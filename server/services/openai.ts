import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || ""
});

export interface PostCategory {
  category: string;
  confidence: number;
  tags: string[];
  summary: string;
}

export interface SkillRecommendation {
  skill: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTimeToLearn: string;
}

export interface DigestContent {
  title: string;
  summary: string;
  categories: Array<{
    name: string;
    count: number;
    highlights: string[];
  }>;
  actionItems: string[];
}

export class OpenAIService {
  private isConfigured(): boolean {
    return !!process.env.OPENAI_API_KEY || !!process.env.OPENAI_KEY;
  }

  async categorizePost(postContent: string): Promise<PostCategory> {
    if (!this.isConfigured()) {
      // Return default categorization if OpenAI is not configured
      return {
        category: "General",
        confidence: 0.5,
        tags: ["uncategorized"],
        summary: postContent.substring(0, 100) + "..."
      };
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant that categorizes LinkedIn posts. Analyze the post content and categorize it into one of these categories: "Career Insights", "Tech Resources", "Learning", "Inspiration", "Industry News", "Job Opportunities", or "General". Also provide relevant tags and a brief summary. Respond with JSON in this format: { "category": string, "confidence": number, "tags": string[], "summary": string }`
          },
          {
            role: "user",
            content: postContent
          }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        category: result.category || "General",
        confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
        tags: Array.isArray(result.tags) ? result.tags : ["uncategorized"],
        summary: result.summary || postContent.substring(0, 100) + "..."
      };
    } catch (error) {
      console.error('OpenAI categorization error:', error);
      return {
        category: "General",
        confidence: 0.5,
        tags: ["uncategorized"],
        summary: postContent.substring(0, 100) + "..."
      };
    }
  }

  async generateSkillRecommendations(
    currentSkills: Array<{ name: string; level: number }>,
    careerGoals?: string,
    industryTrends?: string[]
  ): Promise<SkillRecommendation[]> {
    if (!this.isConfigured()) {
      return [];
    }

    try {
      const skillsText = currentSkills.map(s => `${s.name}: ${s.level}%`).join(', ');
      const trendsText = industryTrends?.join(', ') || '';
      
      const prompt = `Based on these current skills: ${skillsText}
      ${careerGoals ? `Career goals: ${careerGoals}` : ''}
      ${trendsText ? `Industry trends: ${trendsText}` : ''}
      
      Recommend 3-5 new skills to learn that would complement the existing skills and help with career growth. Consider both technical and soft skills. Respond with JSON in this format: { "recommendations": [{ "skill": string, "reason": string, "priority": "high|medium|low", "estimatedTimeToLearn": string }] }`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a career development AI that provides personalized skill recommendations for professional growth."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result.recommendations || [];
    } catch (error) {
      console.error('OpenAI skill recommendations error:', error);
      return [];
    }
  }

  async generateWeeklyDigest(
    savedPosts: Array<{ content: string; category: string; tags: string[] }>,
    userInterests?: string[]
  ): Promise<DigestContent> {
    if (!this.isConfigured()) {
      return {
        title: "Your Weekly Digest",
        summary: "Your saved posts from this week",
        categories: [],
        actionItems: []
      };
    }

    try {
      const postsText = savedPosts.map((post, index) => 
        `Post ${index + 1} (${post.category}): ${post.content.substring(0, 200)}...`
      ).join('\n\n');

      const prompt = `Analyze these saved posts and create a weekly digest:
      
      ${postsText}
      
      ${userInterests ? `User interests: ${userInterests.join(', ')}` : ''}
      
      Create a summary that highlights key themes, important insights, and actionable items. Respond with JSON in this format: { "title": string, "summary": string, "categories": [{ "name": string, "count": number, "highlights": string[] }], "actionItems": string[] }`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant that creates personalized content digests for professionals."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        title: result.title || "Your Weekly Digest",
        summary: result.summary || "Summary of your saved content",
        categories: result.categories || [],
        actionItems: result.actionItems || []
      };
    } catch (error) {
      console.error('OpenAI digest generation error:', error);
      return {
        title: "Your Weekly Digest",
        summary: "Your saved posts from this week",
        categories: [],
        actionItems: []
      };
    }
  }
}

export const openaiService = new OpenAIService();

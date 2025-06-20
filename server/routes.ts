import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { githubService } from "./services/github";
import { openaiService } from "./services/openai";
import { insertUserSchema, insertPostSchema, insertSavedPostSchema, insertSkillSchema, insertCertificationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes (simplified for demo)
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // In production, verify password hash
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ error: "Registration failed" });
    }
  });

  // User routes
  app.get("/api/users/me", async (req, res) => {
    // Simplified auth - return sample user
    const user = await storage.getUser(1);
    if (user) {
      res.json({ ...user, password: undefined });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.put("/api/users/me", async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(1, updates);
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(400).json({ error: "Update failed" });
    }
  });

  // Posts routes
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getAllPosts();
      // Enrich with user data
      const enrichedPosts = await Promise.all(
        posts.map(async (post) => {
          const user = await storage.getUser(post.userId);
          return {
            ...post,
            author: user ? { ...user, password: undefined } : null
          };
        })
      );
      res.json(enrichedPosts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const postData = insertPostSchema.parse({ ...req.body, userId: 1 });
      const post = await storage.createPost(postData);
      res.json(post);
    } catch (error) {
      res.status(400).json({ error: "Failed to create post" });
    }
  });

  app.put("/api/posts/:id/like", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getPost(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      
      const updatedPost = await storage.updatePost(postId, { 
        likes: (post.likes || 0) + 1 
      });
      res.json(updatedPost);
    } catch (error) {
      res.status(400).json({ error: "Failed to like post" });
    }
  });

  // Saved posts routes
  app.get("/api/saved-posts", async (req, res) => {
    try {
      const savedPosts = await storage.getSavedPostsByUserId(1);
      res.json(savedPosts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch saved posts" });
    }
  });

  app.post("/api/saved-posts", async (req, res) => {
    try {
      const savedPostData = insertSavedPostSchema.parse({ ...req.body, userId: 1 });
      const savedPost = await storage.createSavedPost(savedPostData);
      
      // Get the actual post content for AI categorization
      const post = await storage.getPost(savedPost.postId);
      if (post) {
        // Categorize with AI in the background
        const category = await openaiService.categorizePost(post.content);
        await storage.updateSavedPost(savedPost.id, {
          category: category.category,
          tags: category.tags
        });
      }
      
      res.json(savedPost);
    } catch (error) {
      res.status(400).json({ error: "Failed to save post" });
    }
  });

  app.get("/api/saved-posts/categories", async (req, res) => {
    try {
      const savedPosts = await storage.getSavedPostsByUserId(1);
      const categories = savedPosts.reduce((acc: Record<string, number>, post) => {
        const category = post.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});
      
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Skills routes
  app.get("/api/skills", async (req, res) => {
    try {
      const skills = await storage.getSkillsByUserId(1);
      res.json(skills);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  });

  app.post("/api/skills", async (req, res) => {
    try {
      const skillData = insertSkillSchema.parse({ ...req.body, userId: 1 });
      const skill = await storage.createSkill(skillData);
      
      // Add to timeline
      await storage.addSkillTimelineEntry({
        userId: 1,
        skillId: skill.id,
        level: skill.level,
        source: skill.source,
        metadata: null,
        recordedAt: new Date()
      });
      
      res.json(skill);
    } catch (error) {
      res.status(400).json({ error: "Failed to create skill" });
    }
  });

  app.get("/api/skills/timeline", async (req, res) => {
    try {
      const timeline = await storage.getSkillTimeline(1);
      res.json(timeline);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch skill timeline" });
    }
  });

  app.get("/api/skills/recommendations", async (req, res) => {
    try {
      const skills = await storage.getSkillsByUserId(1);
      const recommendations = await openaiService.generateSkillRecommendations(skills);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate recommendations" });
    }
  });

  // GitHub integration routes
  app.post("/api/github/sync", async (req, res) => {
    try {
      const { username } = req.body;
      if (!username) {
        return res.status(400).json({ error: "GitHub username required" });
      }

      const githubStats = await githubService.getUserStats(username);
      const githubData = await storage.updateGithubData(1, {
        contributions: githubStats.contributions,
        repositories: githubStats.repositories,
        languages: githubStats.languages,
        lastSynced: new Date()
      });

      // Update user's GitHub username
      await storage.updateUser(1, { githubUsername: username });

      res.json(githubData);
    } catch (error) {
      res.status(500).json({ error: "Failed to sync GitHub data" });
    }
  });

  app.get("/api/github/data", async (req, res) => {
    try {
      const githubData = await storage.getGithubData(1);
      res.json(githubData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch GitHub data" });
    }
  });

  // Certifications routes
  app.get("/api/certifications", async (req, res) => {
    try {
      const certifications = await storage.getCertificationsByUserId(1);
      res.json(certifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch certifications" });
    }
  });

  app.post("/api/certifications", async (req, res) => {
    try {
      const certData = insertCertificationSchema.parse({ ...req.body, userId: 1 });
      const certification = await storage.createCertification(certData);
      res.json(certification);
    } catch (error) {
      res.status(400).json({ error: "Failed to create certification" });
    }
  });

  // AI Digest routes
  app.get("/api/digests", async (req, res) => {
    try {
      const digests = await storage.getAiDigestsByUserId(1);
      res.json(digests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch digests" });
    }
  });

  app.post("/api/digests/generate", async (req, res) => {
    try {
      const savedPosts = await storage.getSavedPostsByUserId(1);
      const postsWithContent = await Promise.all(
        savedPosts.map(async (savedPost) => {
          const post = await storage.getPost(savedPost.postId);
          return {
            content: post?.content || '',
            category: savedPost.category || 'General',
            tags: savedPost.tags || []
          };
        })
      );

      const digestContent = await openaiService.generateWeeklyDigest(postsWithContent);
      
      const digest = await storage.createAiDigest({
        userId: 1,
        title: digestContent.title,
        content: digestContent,
        type: 'weekly',
        generatedAt: new Date()
      });

      res.json(digest);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate digest" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

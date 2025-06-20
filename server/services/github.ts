export interface GitHubStats {
  contributions: number;
  repositories: number;
  languages: Record<string, number>;
  recentActivity: Array<{
    type: string;
    repo: string;
    date: string;
  }>;
}

export class GitHubService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GITHUB_TOKEN || process.env.GITHUB_API_KEY || "";
  }

  async getUserStats(username: string): Promise<GitHubStats> {
    if (!this.apiKey) {
      throw new Error("GitHub API key not configured");
    }

    try {
      const headers = {
        'Authorization': `token ${this.apiKey}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'LinkedIn-Clone-App'
      };

      // Get user repositories
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
        headers
      });

      if (!reposResponse.ok) {
        throw new Error(`GitHub API error: ${reposResponse.status}`);
      }

      const repos = await reposResponse.json();

      // Get user events for contribution count
      const eventsResponse = await fetch(`https://api.github.com/users/${username}/events?per_page=100`, {
        headers
      });

      const events = eventsResponse.ok ? await eventsResponse.json() : [];

      // Calculate language statistics
      const languages: Record<string, number> = {};
      for (const repo of repos) {
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
      }

      // Calculate contributions from events
      const contributions = events.filter((event: any) => 
        ['PushEvent', 'PullRequestEvent', 'IssuesEvent'].includes(event.type)
      ).length;

      // Get recent activity
      const recentActivity = events.slice(0, 10).map((event: any) => ({
        type: event.type,
        repo: event.repo.name,
        date: event.created_at
      }));

      return {
        contributions,
        repositories: repos.length,
        languages,
        recentActivity
      };
    } catch (error) {
      console.error('GitHub API error:', error);
      // Return empty stats if API fails
      return {
        contributions: 0,
        repositories: 0,
        languages: {},
        recentActivity: []
      };
    }
  }

  async analyzeSkillsFromGitHub(username: string): Promise<Array<{ name: string; level: number }>> {
    try {
      const stats = await getUserStats(username);
      const skills: Array<{ name: string; level: number }> = [];

      // Convert languages to skills with estimated levels
      for (const [language, count] of Object.entries(stats.languages)) {
        const level = Math.min(100, Math.max(10, count * 10)); // Rough estimation
        skills.push({ name: language, level });
      }

      // Add general programming skills based on activity
      if (stats.contributions > 50) {
        skills.push({ name: 'Git', level: Math.min(100, 40 + stats.contributions / 10) });
      }

      if (stats.repositories > 5) {
        skills.push({ name: 'Software Architecture', level: Math.min(100, 30 + stats.repositories * 5) });
      }

      return skills;
    } catch (error) {
      console.error('Error analyzing GitHub skills:', error);
      return [];
    }
  }
}

export const githubService = new GitHubService();

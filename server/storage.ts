import { 
  users, posts, savedPosts, skills, certifications, skillTimeline, 
  githubData, connections, aiDigests,
  type User, type InsertUser, type Post, type InsertPost, 
  type SavedPost, type InsertSavedPost, type Skill, type InsertSkill,
  type Certification, type InsertCertification, type SkillTimeline,
  type GithubData, type Connection, type InsertConnection, type AiDigest
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Posts
  getAllPosts(): Promise<Post[]>;
  getPostsByUserId(userId: number): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, updates: Partial<Post>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;

  // Saved Posts
  getSavedPostsByUserId(userId: number): Promise<SavedPost[]>;
  getSavedPostsByCategory(userId: number, category: string): Promise<SavedPost[]>;
  createSavedPost(savedPost: InsertSavedPost): Promise<SavedPost>;
  updateSavedPost(id: number, updates: Partial<SavedPost>): Promise<SavedPost | undefined>;
  deleteSavedPost(id: number): Promise<boolean>;

  // Skills
  getSkillsByUserId(userId: number): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, updates: Partial<Skill>): Promise<Skill | undefined>;
  getSkillTimeline(userId: number, skillId?: number): Promise<SkillTimeline[]>;
  addSkillTimelineEntry(entry: Omit<SkillTimeline, 'id'>): Promise<SkillTimeline>;

  // Certifications
  getCertificationsByUserId(userId: number): Promise<Certification[]>;
  createCertification(cert: InsertCertification): Promise<Certification>;

  // GitHub Data
  getGithubData(userId: number): Promise<GithubData | undefined>;
  updateGithubData(userId: number, data: Omit<GithubData, 'id' | 'userId'>): Promise<GithubData>;

  // Connections
  getConnectionsByUserId(userId: number): Promise<Connection[]>;
  createConnection(connection: InsertConnection): Promise<Connection>;
  updateConnection(id: number, status: string): Promise<Connection | undefined>;

  // AI Digests
  getAiDigestsByUserId(userId: number): Promise<AiDigest[]>;
  createAiDigest(digest: Omit<AiDigest, 'id'>): Promise<AiDigest>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private savedPosts: Map<number, SavedPost>;
  private skills: Map<number, Skill>;
  private certifications: Map<number, Certification>;
  private skillTimeline: Map<number, SkillTimeline>;
  private githubData: Map<number, GithubData>;
  private connections: Map<number, Connection>;
  private aiDigests: Map<number, AiDigest>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.savedPosts = new Map();
    this.skills = new Map();
    this.certifications = new Map();
    this.skillTimeline = new Map();
    this.githubData = new Map();
    this.connections = new Map();
    this.aiDigests = new Map();
    this.currentId = 1;

    // Initialize with a sample user
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleUser: User = {
      id: 1,
      username: "aditigopinath",
      email: "aditi.gopinath@example.com",
      password: "hashedpassword",
      name: "Aditi Gopinath",
      title: "Senior Software Engineer & AI Researcher",
      company: "Google",
      bio: "Passionate about AI and software engineering. Building intelligent systems that make a difference. Expert in machine learning, full-stack development, and data science.",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b332b632?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      coverImage: null,
      githubUsername: "aditi-gopinath",
      profileViews: 542,
      postImpressions: 3247,
      createdAt: new Date(),
    };
    this.users.set(1, sampleUser);

    // Add sample skills with realistic progression based on Aditi's journey
    const sampleSkills: Skill[] = [
      { id: 2, userId: 1, name: "JavaScript", level: 92, source: "github", lastUpdated: new Date('2024-11-15') },
      { id: 3, userId: 1, name: "React", level: 88, source: "github", lastUpdated: new Date('2024-11-10') },
      { id: 4, userId: 1, name: "TypeScript", level: 85, source: "github", lastUpdated: new Date('2024-10-25') },
      { id: 5, userId: 1, name: "Node.js", level: 82, source: "github", lastUpdated: new Date('2024-11-01') },
      { id: 6, userId: 1, name: "Machine Learning", level: 78, source: "certification", lastUpdated: new Date('2024-09-10') },
      { id: 7, userId: 1, name: "Python", level: 80, source: "github", lastUpdated: new Date('2024-08-15') },
      { id: 8, userId: 1, name: "TensorFlow", level: 70, source: "certification", lastUpdated: new Date('2024-09-10') },
      { id: 9, userId: 1, name: "PostgreSQL", level: 75, source: "github", lastUpdated: new Date('2024-11-15') },
    ];

    sampleSkills.forEach(skill => this.skills.set(skill.id, skill));

    // Add sample certifications
    const sampleCerts: Certification[] = [
      {
        id: 8,
        userId: 1,
        name: "AWS Solutions Architect - Associate",
        issuer: "Amazon Web Services",
        issueDate: new Date('2024-03-15'),
        expiryDate: new Date('2027-03-15'),
        credentialUrl: "https://aws.amazon.com/certification/",
        skills: ["Cloud Computing", "AWS", "System Architecture"]
      },
      {
        id: 9,
        userId: 1,
        name: "Google AI/ML Certification",
        issuer: "Google Cloud",
        issueDate: new Date('2024-05-20'),
        expiryDate: new Date('2026-05-20'),
        credentialUrl: "https://cloud.google.com/certification",
        skills: ["Machine Learning", "TensorFlow", "Data Science"]
      }
    ];

    sampleCerts.forEach(cert => this.certifications.set(cert.id, cert));

    // Add skill timeline entries
    const timelineEntries: SkillTimeline[] = [
      // JavaScript progression
      { id: 10, userId: 1, skillId: 2, level: 60, source: "github", recordedAt: new Date('2024-01-01'), metadata: null },
      { id: 11, userId: 1, skillId: 2, level: 70, source: "github", recordedAt: new Date('2024-03-01'), metadata: null },
      { id: 12, userId: 1, skillId: 2, level: 85, source: "github", recordedAt: new Date('2024-06-01'), metadata: null },
      
      // React progression
      { id: 13, userId: 1, skillId: 3, level: 50, source: "github", recordedAt: new Date('2024-02-01'), metadata: null },
      { id: 14, userId: 1, skillId: 3, level: 65, source: "github", recordedAt: new Date('2024-04-01'), metadata: null },
      { id: 15, userId: 1, skillId: 3, level: 78, source: "github", recordedAt: new Date('2024-06-10'), metadata: null },

      // ML progression from certification
      { id: 16, userId: 1, skillId: 5, level: 25, source: "manual", recordedAt: new Date('2024-04-01'), metadata: null },
      { id: 17, userId: 1, skillId: 5, level: 45, source: "certification", recordedAt: new Date('2024-05-20'), metadata: null },
    ];

    timelineEntries.forEach(entry => this.skillTimeline.set(entry.id, entry));

    // Add sample posts
    const samplePosts: Post[] = [
      {
        id: 18,
        userId: 1,
        content: "Just completed my AWS Solutions Architect certification! 🎉 The journey taught me so much about cloud architecture patterns and scalability. Key takeaways:\n\n• Design for failure - always assume components will fail\n• Use managed services when possible to reduce operational overhead\n• Security should be built-in, not bolted-on\n\nExcited to apply these principles in upcoming projects. What cloud certifications have been most valuable in your career?",
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        likes: 127,
        comments: 23,
        shares: 8,
        createdAt: new Date('2024-06-18T14:30:00')
      },
      {
        id: 19,
        userId: 1,
        content: "Fascinating read on how AI is transforming software development workflows. The integration of AI coding assistants is no longer a 'nice-to-have' but becoming essential for competitive development teams.\n\nSome observations from our team's adoption:\n• 40% faster initial code generation\n• Significantly better code documentation\n• More time for architectural thinking\n\nThe key is learning to prompt effectively and knowing when to trust vs. verify AI suggestions. How is your team leveraging AI tools?",
        imageUrl: null,
        likes: 89,
        comments: 15,
        shares: 12,
        createdAt: new Date('2024-06-17T09:15:00')
      }
    ];

    samplePosts.forEach(post => this.posts.set(post.id, post));

    // Add GitHub data
    const githubData: GithubData = {
      id: 20,
      userId: 1,
      contributions: 1247,
      repositories: 23,
      languages: {
        "JavaScript": 15,
        "TypeScript": 12,
        "Python": 8,
        "Go": 3,
        "Rust": 2
      },
      lastSynced: new Date('2024-06-19T08:00:00')
    };

    this.githubData.set(20, githubData);

    this.currentId = 21;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      profileViews: 0, 
      postImpressions: 0,
      createdAt: new Date(),
      title: insertUser.title || null,
      company: insertUser.company || null,
      bio: insertUser.bio || null,
      profileImage: insertUser.profileImage || null,
      coverImage: insertUser.coverImage || null,
      githubUsername: insertUser.githubUsername || null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Posts
  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getPostsByUserId(userId: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentId++;
    const post: Post = { 
      ...insertPost, 
      id, 
      likes: 0, 
      comments: 0, 
      shares: 0,
      createdAt: new Date(),
      imageUrl: insertPost.imageUrl || null
    };
    this.posts.set(id, post);
    return post;
  }

  async updatePost(id: number, updates: Partial<Post>): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    const updatedPost = { ...post, ...updates };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: number): Promise<boolean> {
    return this.posts.delete(id);
  }

  // Saved Posts
  async getSavedPostsByUserId(userId: number): Promise<SavedPost[]> {
    return Array.from(this.savedPosts.values())
      .filter(savedPost => savedPost.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getSavedPostsByCategory(userId: number, category: string): Promise<SavedPost[]> {
    return Array.from(this.savedPosts.values())
      .filter(savedPost => savedPost.userId === userId && savedPost.category === category);
  }

  async createSavedPost(insertSavedPost: InsertSavedPost): Promise<SavedPost> {
    const id = this.currentId++;
    const savedPost: SavedPost = { 
      ...insertSavedPost, 
      id, 
      category: null,
      tags: null,
      createdAt: new Date() 
    };
    this.savedPosts.set(id, savedPost);
    return savedPost;
  }

  async updateSavedPost(id: number, updates: Partial<SavedPost>): Promise<SavedPost | undefined> {
    const savedPost = this.savedPosts.get(id);
    if (!savedPost) return undefined;
    const updatedSavedPost = { ...savedPost, ...updates };
    this.savedPosts.set(id, updatedSavedPost);
    return updatedSavedPost;
  }

  async deleteSavedPost(id: number): Promise<boolean> {
    return this.savedPosts.delete(id);
  }

  // Skills
  async getSkillsByUserId(userId: number): Promise<Skill[]> {
    return Array.from(this.skills.values())
      .filter(skill => skill.userId === userId)
      .sort((a, b) => b.level - a.level);
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const id = this.currentId++;
    const skill: Skill = { 
      ...insertSkill, 
      id, 
      lastUpdated: new Date() 
    };
    this.skills.set(id, skill);
    return skill;
  }

  async updateSkill(id: number, updates: Partial<Skill>): Promise<Skill | undefined> {
    const skill = this.skills.get(id);
    if (!skill) return undefined;
    const updatedSkill = { ...skill, ...updates, lastUpdated: new Date() };
    this.skills.set(id, updatedSkill);
    return updatedSkill;
  }

  async getSkillTimeline(userId: number, skillId?: number): Promise<SkillTimeline[]> {
    return Array.from(this.skillTimeline.values())
      .filter(entry => entry.userId === userId && (!skillId || entry.skillId === skillId))
      .sort((a, b) => new Date(a.recordedAt!).getTime() - new Date(b.recordedAt!).getTime());
  }

  async addSkillTimelineEntry(entry: Omit<SkillTimeline, 'id'>): Promise<SkillTimeline> {
    const id = this.currentId++;
    const timelineEntry: SkillTimeline = { 
      ...entry, 
      id, 
      recordedAt: entry.recordedAt || new Date() 
    };
    this.skillTimeline.set(id, timelineEntry);
    return timelineEntry;
  }

  // Certifications
  async getCertificationsByUserId(userId: number): Promise<Certification[]> {
    return Array.from(this.certifications.values())
      .filter(cert => cert.userId === userId)
      .sort((a, b) => new Date(b.issueDate!).getTime() - new Date(a.issueDate!).getTime());
  }

  async createCertification(insertCert: InsertCertification): Promise<Certification> {
    const id = this.currentId++;
    const certification: Certification = { 
      ...insertCert, 
      id,
      skills: insertCert.skills || null,
      issueDate: insertCert.issueDate || null,
      expiryDate: insertCert.expiryDate || null,
      credentialUrl: insertCert.credentialUrl || null
    };
    this.certifications.set(id, certification);
    return certification;
  }

  // GitHub Data
  async getGithubData(userId: number): Promise<GithubData | undefined> {
    return Array.from(this.githubData.values()).find(data => data.userId === userId);
  }

  async updateGithubData(userId: number, data: Omit<GithubData, 'id' | 'userId'>): Promise<GithubData> {
    const existing = Array.from(this.githubData.values()).find(d => d.userId === userId);
    if (existing) {
      const updated = { ...existing, ...data };
      this.githubData.set(existing.id, updated);
      return updated;
    } else {
      const id = this.currentId++;
      const githubData: GithubData = { ...data, id, userId };
      this.githubData.set(id, githubData);
      return githubData;
    }
  }

  // Connections
  async getConnectionsByUserId(userId: number): Promise<Connection[]> {
    return Array.from(this.connections.values())
      .filter(conn => conn.requesterId === userId || conn.receiverId === userId);
  }

  async createConnection(insertConnection: InsertConnection): Promise<Connection> {
    const id = this.currentId++;
    const connection: Connection = { 
      ...insertConnection, 
      id, 
      createdAt: new Date() 
    };
    this.connections.set(id, connection);
    return connection;
  }

  async updateConnection(id: number, status: string): Promise<Connection | undefined> {
    const connection = this.connections.get(id);
    if (!connection) return undefined;
    const updatedConnection = { ...connection, status };
    this.connections.set(id, updatedConnection);
    return updatedConnection;
  }

  // AI Digests
  async getAiDigestsByUserId(userId: number): Promise<AiDigest[]> {
    return Array.from(this.aiDigests.values())
      .filter(digest => digest.userId === userId)
      .sort((a, b) => new Date(b.generatedAt!).getTime() - new Date(a.generatedAt!).getTime());
  }

  async createAiDigest(insertDigest: Omit<AiDigest, 'id'>): Promise<AiDigest> {
    const id = this.currentId++;
    const digest: AiDigest = { 
      ...insertDigest, 
      id, 
      generatedAt: insertDigest.generatedAt || new Date() 
    };
    this.aiDigests.set(id, digest);
    return digest;
  }
}

export const storage = new MemStorage();

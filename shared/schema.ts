import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  title: text("title"),
  company: text("company"),
  bio: text("bio"),
  profileImage: text("profile_image"),
  coverImage: text("cover_image"),
  githubUsername: text("github_username"),
  profileViews: integer("profile_views").default(0),
  postImpressions: integer("post_impressions").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const savedPosts = pgTable("saved_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  postId: integer("post_id").notNull(),
  category: text("category"), // AI-generated category
  tags: text("tags").array(), // AI-generated tags
  createdAt: timestamp("created_at").defaultNow(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  level: integer("level").notNull(), // 0-100
  source: text("source").notNull(), // 'github', 'certification', 'manual', 'post_analysis'
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  issueDate: timestamp("issue_date"),
  expiryDate: timestamp("expiry_date"),
  credentialUrl: text("credential_url"),
  skills: text("skills").array(), // Related skills
});

export const skillTimeline = pgTable("skill_timeline", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  skillId: integer("skill_id").notNull(),
  level: integer("level").notNull(),
  source: text("source").notNull(),
  metadata: jsonb("metadata"), // Additional context
  recordedAt: timestamp("recorded_at").defaultNow(),
});

export const githubData = pgTable("github_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  contributions: integer("contributions").notNull(),
  repositories: integer("repositories").notNull(),
  languages: jsonb("languages"), // Language statistics
  lastSynced: timestamp("last_synced").defaultNow(),
});

export const connections = pgTable("connections", {
  id: serial("id").primaryKey(),
  requesterId: integer("requester_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  status: text("status").notNull(), // 'pending', 'accepted', 'rejected'
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiDigests = pgTable("ai_digests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: jsonb("content"), // Structured digest content
  type: text("type").notNull(), // 'weekly', 'monthly'
  generatedAt: timestamp("generated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  profileViews: true,
  postImpressions: true,
  createdAt: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  likes: true,
  comments: true,
  shares: true,
  createdAt: true,
});

export const insertSavedPostSchema = createInsertSchema(savedPosts).omit({
  id: true,
  category: true,
  tags: true,
  createdAt: true,
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
  lastUpdated: true,
});

export const insertCertificationSchema = createInsertSchema(certifications).omit({
  id: true,
});

export const insertConnectionSchema = createInsertSchema(connections).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type SavedPost = typeof savedPosts.$inferSelect;
export type InsertSavedPost = z.infer<typeof insertSavedPostSchema>;

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;

export type Certification = typeof certifications.$inferSelect;
export type InsertCertification = z.infer<typeof insertCertificationSchema>;

export type SkillTimeline = typeof skillTimeline.$inferSelect;
export type GithubData = typeof githubData.$inferSelect;
export type Connection = typeof connections.$inferSelect;
export type InsertConnection = z.infer<typeof insertConnectionSchema>;
export type AiDigest = typeof aiDigests.$inferSelect;

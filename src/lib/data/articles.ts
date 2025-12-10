import { eq } from "drizzle-orm";
import { usersSync } from "drizzle-orm/neon";
import redis from "@/cache";
import db from "@/db";
import { articles } from "@/db/schema";

export type ArticleList = {
  id: number;
  title: string;
  createdAt: string;
  content: string;
  author: string | null;
  imageUrl?: string | null;
  summary?: string | null;
};

export async function getArticles(): Promise<ArticleList[]> {
  const cached = await redis.get<ArticleList[]>("articles:all");
  if (cached) {
    console.log("🎯 Get Articles Cache Hit!");
    return cached;
  }
  console.log("🏹 Get Articles Cache Miss!");

  const response = await db
    .select({
      title: articles.title,
      id: articles.id,
      createdAt: articles.createdAt,
      content: articles.content,
      author: usersSync.name,
      summary: articles.summary,
    })
    .from(articles)
    .leftJoin(usersSync, eq(articles.authorId, usersSync.id));

  redis.set("articles:all", response, {
    ex: 60, // 60 seconds
  });

  return response;
}
// use limit and offset to paginate

export async function getArticleById(id: number) {
  const response = await db
    .select({
      title: articles.title,
      id: articles.id,
      createdAt: articles.createdAt,
      content: articles.content,
      author: usersSync.name,
      imageUrl: articles.imageUrl,
    })
    .from(articles)
    .where(eq(articles.id, id))
    .leftJoin(usersSync, eq(articles.authorId, usersSync.id));

  return response[0] ? response[0] : null;
}

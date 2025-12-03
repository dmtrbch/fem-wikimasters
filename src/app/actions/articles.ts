"use server";

import { stackServerApp } from "@/stack/server";

export type CreateArticleInput = {
  title: string;
  content: string;
  authorId: string;
  imageUrl?: string;
}

export type UpdateArticleInput = {
  title?: string;
  content?: string;
  imageUrl?: string;
}

// server actions do have to protected, or someone else could invoke your actions

export async function createArticle(data: CreateArticleInput) {
  const user = await stackServerApp.getUser();
  
  if (!user) {
    throw new Error("Unauthorized");
  }

  console.log("createArticle called", data);
  return { success: true, message: "Article created" };
}

export async function updateArticle(data: UpdateArticleInput) {
  const user = await stackServerApp.getUser();
  
  if (!user) {
    throw new Error("Unauthorized");
  }

  const authorId = user.id;

  console.log("updateArticle called", authorId, data);
  return { success: true, message: "Article updated" };
}

export async function deleteArticle(id: string) {
  const user = await stackServerApp.getUser();
  
  if (!user) {
    throw new Error("Unauthorized");
  }

  const authorId = user.id;

  console.log("deleteArticle called", authorId, id);
  return { success: true, message: "Article deleted" };
}
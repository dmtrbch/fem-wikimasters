import { usersSync } from "drizzle-orm/neon";
import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  published: boolean("published").notNull().default(false),
  authorId: text("author_id")
    .notNull()
    .references(() => usersSync.id),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
  summary: text("summary"),
});

const schema = { articles };

export default schema;

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;

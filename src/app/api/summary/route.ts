import { eq, isNull } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import summarizeArticle from "@/ai/summarize";
import redis from "@/cache";
import db from "@/db";
import { articles } from "@/db/schema";

export async function GET(req: NextRequest) {
  if (
    process.env.NODE_ENV !== "development" &&
    req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}` // CRON_SECRET is defined by Vercel and we don't have to add it to env
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({
      id: articles.id,
      title: articles.title,
      content: articles.content,
    })
    .from(articles)
    .where(isNull(articles.summary));

  let updated = 0;

  console.log("🤖 Starting AI summary job");

  for (const row of rows) {
    try {
      const summary = await summarizeArticle(row.title ?? "", row.content);

      if (summary && summary.trim().length > 0) {
        await db
          .update(articles)
          .set({ summary })
          .where(eq(articles.id, row.id));
        updated++;
      }
    } catch (e) {
      console.warn(`⚠️ Failed to summarize article ${row.id}`, e);
    }
  }

  if (updated > 0) {
    try {
      await redis.del("articles:all");
    } catch (e) {
      console.warn("⚠️ Failed to delete articles cache", e);
    }
  }

  console.log(`🤖 Concluding AI summary job, updated ${updated} articles`);

  return NextResponse.json({ ok: true, updated });
}

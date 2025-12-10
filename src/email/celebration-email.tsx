import { eq } from "drizzle-orm";
import { usersSync } from "drizzle-orm/neon";
import db from "@/db";
import { articles } from "@/db/schema";
import resend from "@/email";
import CelebrationTemplate from "@/email/templates/celebration-template";

const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export default async function sendCelebrationEmail(
  articleId: number,
  pageviews: number,
) {
  const response = await db
    .select({
      email: usersSync.email,
      id: usersSync.id,
      title: articles.title,
      name: usersSync.name,
    })
    .from(articles)
    .leftJoin(usersSync, eq(articles.authorId, usersSync.id))
    .where(eq(articles.id, articleId));

  const { email, id, title, name } = response[0];

  if (!email) {
    console.log(
      `❌ skipping celebraton for ${articleId} on pageviews ${pageviews}, could not find email in database`,
    );
    return;
  }

  // THIS WILL WORK IF WE HAVE CUSTOM DOMAIN SETUP IN RESEND
  //   const emailRes = await resend.emails.send({
  //     from: "Wikimasters <noreply@mail.dmtrbch.dev>",
  //     to: email,
  //     subject: `Your article on Wikimasters got ${pageviews} views`,
  //     html: "<h1>Congrats!</h1><p>You're an amazing author and PEOPLE LIKE YOU.</p>",
  //   });

  const emailRes = await resend.emails.send({
    from: "Wikimasters <onboarding@resend.dev>",
    to: "bochvarovskidimitar@gmail.com",
    subject: `Your article on Wikimasters got ${pageviews} views`,
    react: (
      <CelebrationTemplate
        name={name ?? "Friend"}
        pageviews={pageviews}
        articleTitle={title}
        articleUrl={`${BASE_URL}/wiki/${articleId}`}
      />
    ),
  });

  if (!emailRes.error) {
    console.log(
      `✅ sent ${id} a celebraton email for getting ${pageviews} on article ${articleId}`,
    );
  } else {
    console.log(
      `❌ error sending ${id} a celebraton email for getting ${pageviews} on article ${articleId}`,
    );
  }
}

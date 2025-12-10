"use server";

import redis from "@/cache";
import sendCelebrationEmail from "@/email/celebration-email";

const milestones = [10, 50, 100, 10000];

const keyFor = (id: number) => `pageviews:article${id}`;

export async function incrementPageview(articleId: number) {
  const articleKey = keyFor(articleId);
  const newVal = await redis.incr(articleKey);

  if (milestones.includes(newVal)) {
    sendCelebrationEmail(articleId, newVal); // no need to await, it happens in the background
  }

  return +newVal;
}

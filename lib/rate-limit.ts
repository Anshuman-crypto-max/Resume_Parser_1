import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

const redis =
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN })
    : null;

export const rateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, "1 m"),
      analytics: true
    })
  : null;

export async function enforceRateLimit(key: string) {
  if (!rateLimit) {
    return;
  }
  const result = await rateLimit.limit(key);
  if (!result.success) {
    throw new Response("Rate limit exceeded", { status: 429 });
  }
}

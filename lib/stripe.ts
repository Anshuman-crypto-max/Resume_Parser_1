import Stripe from "stripe";
import { env } from "@/lib/env";

export const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-07-30.basil"
    })
  : null;

export function getStripe() {
  if (!stripe) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }
  return stripe;
}

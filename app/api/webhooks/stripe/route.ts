import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripe();
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }
  const event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const organizationId = session.metadata?.organizationId;
    if (organizationId) {
      await prisma.billingAccount.upsert({
        where: { organizationId },
        update: { stripeCustomerId: String(session.customer), stripeSubscriptionId: String(session.subscription), status: "ACTIVE", plan: "PRO" },
        create: { organizationId, stripeCustomerId: String(session.customer), stripeSubscriptionId: String(session.subscription), status: "ACTIVE", plan: "PRO" }
      });
    }
  }
  return NextResponse.json({ received: true });
}

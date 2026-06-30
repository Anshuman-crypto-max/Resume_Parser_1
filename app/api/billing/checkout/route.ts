import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { env } from "@/lib/env";
import { getStripe } from "@/lib/stripe";

const checkoutSchema = z.object({ priceId: z.string().min(1) });

export async function POST(request: Request) {
  const { user, organization } = await requireUser();
  const { priceId } = checkoutSchema.parse(await request.json());
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
    metadata: { organizationId: organization.id }
  });
  return NextResponse.json({ url: session.url });
}

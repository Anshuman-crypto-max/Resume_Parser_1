import { Resend } from "resend";
import { env } from "@/lib/env";

export const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export async function sendNotification(to: string, subject: string, html: string) {
  if (!resend) {
    return;
  }
  await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to,
    subject,
    html
  });
}

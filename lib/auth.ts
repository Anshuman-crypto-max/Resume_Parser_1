import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function requireUser() {
  const session = await auth();
  if (!session.userId) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";

  const user = await prisma.user.upsert({
    where: { clerkId: session.userId },
    update: {
      email,
      name: clerkUser?.fullName ?? email,
      imageUrl: clerkUser?.imageUrl
    },
    create: {
      clerkId: session.userId,
      email,
      name: clerkUser?.fullName ?? email,
      imageUrl: clerkUser?.imageUrl,
      organizations: {
        create: {
          role: "OWNER",
          organization: {
            create: {
              clerkOrgId: session.orgId,
              name: session.orgSlug ?? "Personal Workspace",
              slug: session.orgSlug ?? `personal-${session.userId.slice(0, 8)}`
            }
          }
        }
      }
    },
    include: {
      organizations: {
        include: { organization: true },
        take: 1
      }
    }
  });

  const organization = user.organizations[0]?.organization;
  if (!organization) {
    throw new Response("Organization not found", { status: 403 });
  }

  return { user, organization, role: user.organizations[0].role };
}

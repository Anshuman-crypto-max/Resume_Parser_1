import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/candidates(.*)",
  "/api/resumes(.*)",
  "/api/search(.*)",
  "/api/ats(.*)",
  "/api/compare(.*)",
  "/api/analytics(.*)",
  "/api/billing(.*)",
  "/api/api-keys(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|webp|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"]
};

import { authMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

export default authMiddleware({
  beforeAuth: (req) => {
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      return NextResponse.next();
    }
    return NextResponse.next();
  },
  publicRoutes: [
    "/",
    "/all-products",
    "/product/(.*)",
    "/api/product/list",
    "/api/product/all",
    "/api/product/(.*)",
    "/api/webhook/(.*)",
    "/api/user/(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)"
  ],
  ignoredRoutes: [
    "/((?!api|trpc))(_next|.+\\..+)(.*)", // Ignore static files
    "/_next/static/(.*)",
    "/_next/image/(.*)",
    "/favicon.ico",
    "/favicon.e0ef1da5.ico", // if your app requests this specifically
    "/assets/(.*)"
  ]
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)', // Exclude static files
    '/',                          // Include root path
    '/(api|trpc)(.*)',            // Include API and tRPC routes
    '/((?!.*\\.).*)'              // Include non-static files
  ]
};

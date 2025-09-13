export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/sacco-admin/:path*",
    "/member/:path*",
    // "/superuser/:path*",
    // "/members/:path*",
  ],
};

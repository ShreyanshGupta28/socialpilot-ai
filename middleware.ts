import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/reply/:path*",
    "/improve/:path*",
    "/saved/:path*",
    "/settings/:path*",
  ],
};

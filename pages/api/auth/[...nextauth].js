import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Sign In with your credentials",
      credentials: {
        member_no: {
          label: "Member Number",
          type: "text",
          placeholder: "Enter your member number or payroll number",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials, req) {
        const { member_no, password } = credentials;
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/token/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ member_no, password }),
            }
          );
          if (!response.ok) {
            console.error(
              "Backend API error:",
              response.status,
              response.statusText
            );
            return null;
          }
          const user = await response.json();
          if (user) {
            return user;
          }
          return null;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  pages: { signIn: "/auth/login" },
};


export default NextAuth(authOptions);
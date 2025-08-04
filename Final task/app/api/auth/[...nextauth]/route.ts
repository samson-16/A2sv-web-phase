// filepath: c:\a2sv-web-track\Final task\app\api\auth\[...nextauth]\route.ts
// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          const data = await res.json();

          // eslint-disable-next-line no-console
          console.log("[CYPRESS DEBUG] Credentials authorize response:", data);

          if (res.ok && data.success) {
            // The user object returned here is passed to the `jwt` callback
            // eslint-disable-next-line no-console
            console.log(
              "[CYPRESS DEBUG] Authorize success, returning user object:",
              {
                id: data.data.id,
                name: data.data.name,
                email: data.data.email,
                accessToken: data.data.accessToken,
                refreshToken: data.data.refreshToken,
              }
            );
            return {
              id: data.data.id,
              name: data.data.name,
              email: data.data.email,
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
            };
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
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

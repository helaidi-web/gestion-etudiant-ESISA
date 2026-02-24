import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        return new Promise((resolve, reject) => {
          db.get(
            "SELECT id, email, name, password_hash FROM users WHERE email = ?",
            [credentials.email],
            async (err: any, row: any) => {
              if (err) {
                reject(new Error("Database error"));
                return;
              }

              if (!row) {
                reject(new Error("User not found"));
                return;
              }

              const isPasswordValid = await bcrypt.compare(
                credentials.password,
                row.password_hash
              );

              if (!isPasswordValid) {
                reject(new Error("Invalid password"));
                return;
              }

              resolve({
                id: row.id,
                email: row.email,
                name: row.name,
              });
            }
          );
        });
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

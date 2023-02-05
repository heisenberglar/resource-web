import NextAuth from "next-auth";
import LinkedinProvider from "next-auth/providers/linkedin";
import GoogleProvider from "next-auth/providers/google";
import qs from "qs";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  database: process.env.DB_URL,
  secret: process.env.JWT_SECRET_KEY,
  callbacks: {
    session: async ({ session, token }) => {
      // ...

      return session;
    },
    jwt: async ({ token, user, account, profile, isNewUser }) => {
      // ...

      return Promise.resolve(token);
    },
  },
  pages: {
    newUser: "/settings/profile",
  },
});

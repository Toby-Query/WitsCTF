import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "../../lib/mongodb";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const { db } = await connectToDatabase();
      const user = await db
        .collection("users")
        .findOne({ googleId: profile.sub });

      if (!user) {
        const hackername = profile.email.split("@")[0];
        await db.collection("users").insertOne({
          googleId: profile.sub,
          name: profile.name,
          profilePic: profile.picture,
          hackername,
          points: 0,
          role: "user",
          accountAge: new Date(),
        });
      }
      return true;
    },
    async session({ session, user }) {
      const { db } = await connectToDatabase();
      const dbUser = await db
        .collection("users")
        .findOne({ googleId: user.id });

      session.user.id = dbUser._id;
      session.user.role = dbUser.role;
      return session;
    },
  },
});

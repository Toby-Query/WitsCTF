import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/mongodb"; // Assuming this is your MongoDB connection function

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const { db } = await connectToDatabase();

      // Check if the user already exists
      const user = await db
        .collection("users")
        .findOne({ googleId: profile.sub });

      if (!user) {
        // Calculate the rank of the new user based on the current number of users
        const totalUsers = await db.collection("users").countDocuments();

        const hackerName = profile.email.split("@")[0]; // Extract hackername from email
        const result = await db.collection("users").insertOne({
          googleId: profile.sub,
          name: profile.name,
          profilePic: profile.picture,
          hackerName,
          points: 0, // Starting points
          rank: totalUsers + 1, // Rank is total users + 1
          accountAge: new Date(), // Current date as account creation date
          school: "Computer Science", // Default school
          level: "Undergraduate", // Default level
          awards: [], // Empty list of awards
          solved: [], // Empty list of solved problems
          email: profile.email,
          role: "user",
        });

        profile.id = result.insertedId.toString(); // Store new user ID in profile
      } else {
        // If user exists, store their existing MongoDB ID
        profile.id = user._id.toString();
      }

      return true;
    },

    async jwt({ token, user, profile }) {
      // Attach user info to JWT token for future requests
      if (user) {
        token.id = user.id || profile?.id; // Store user ID in token
        token.role = user.role || "user"; // Default role if not found
        token.school = user.school || "Computer Science"; // Store school in token
        token.level = user.level || "Undergraduate"; // Store level in token
        token.awards = user.awards || []; // Store awards in token
      }
      return token;
    },

    async session({ session, token }) {
      const { db } = await connectToDatabase();

      // Fetch user data from MongoDB using the user ID stored in the token
      const dbUser = await db
        .collection("users")
        .findOne({ googleId: token.id });

      if (dbUser) {
        // Attach user data to session
        session.user.id = dbUser._id.toString(); // Store MongoDB ID as string in session
        session.user.role = dbUser.role;
        session.user.hackerName = dbUser.hackerName; // Add hackername if needed
        session.user.profilePic = dbUser.profilePic; // Add profile picture if needed
        session.user.school = dbUser.school; // Attach school to session
        session.user.level = dbUser.level; // Attach level to session
        session.user.awards = dbUser.awards; // Attach awards to session
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };

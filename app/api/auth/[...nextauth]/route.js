import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/mongodb";

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

      // Check if the email ends with @students.wits.ac.za
      const email = profile.email.toLowerCase();
      if (!email.endsWith("@students.wits.ac.za")) {
        // Check if the email already exists in the database
        const existingUser = await db.collection("users").findOne({ email });
        if (!existingUser) {
          // Reject registration for new emails that don't meet the domain rule
          return false; // User registration is blocked
        }
      }

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

        // Recalculate problem points and user points after new user registration
        await recalculatePoints(db);
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
        session.user.solved = dbUser.solved; // Attach solved problems to session
        session.user.role = dbUser.role; // Attach user role to session
      }

      return session;
    },
  },
});

async function recalculatePoints(db) {
  // Step 1: Recalculate Problem Points
  const problemsCollection = db.collection("problems");
  const usersCollection = db.collection("users");

  const problems = await problemsCollection.find().toArray();
  const users = await usersCollection.find().toArray();

  const usersCount = users.length;

  for (const problem of problems) {
    const updatedSolves = problem.solves || 0;
    const dynamicScore = Math.max(
      0,
      ((usersCount - updatedSolves) / usersCount) * 500
    );

    await problemsCollection.updateOne(
      { problemName: problem.problemName },
      { $set: { points: dynamicScore } }
    );
  }

  // Step 2: Recalculate User Points
  for (const user of users) {
    let totalPoints = 0;
    for (const solvedProblemName of user.solved) {
      const solvedProblem = await problemsCollection.findOne({
        problemName: solvedProblemName,
      });
      if (solvedProblem?.points) {
        totalPoints += solvedProblem.points;
      }
    }

    await usersCollection.updateOne(
      { email: user.email },
      { $set: { points: totalPoints } }
    );
  }

  // Step 3: Recalculate User Ranks
  const allUsers = await usersCollection
    .find({}, { projection: { email: 1, points: 1 } })
    .toArray();

  // Sort users by points in descending order and assign ranks
  allUsers.sort((a, b) => b.points - a.points);

  for (let rank = 0; rank < allUsers.length; rank++) {
    await usersCollection.updateOne(
      { email: allUsers[rank].email },
      { $set: { rank: rank + 1 } }
    );
  }
}

export { handler as GET, handler as POST };

/**
 * @swagger
 * /api/auth/[...nextauth]:
 *   post:
 *     summary: Google Authentication for sign-in and registration.
 *     description: Authenticates a user using Google OAuth, registers the user if they don't exist, and calculates dynamic scores and ranks.
 *     tags:
 *      - Authentication
 *     responses:
 *       200:
 *         description: User authenticated or registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User authenticated or registered successfully"
 *       401:
 *         description: User's email doesn't meet the required domain or they are not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not authenticated or Email domain not allowed
 *       500:
 *         description: Internal server error during authentication process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 *   get:
 *     summary: Google Authentication callback.
 *     description: This endpoint handles the callback from Google after successful authentication.
 *     tags:
 *      - Authentication
 *     responses:
 *       200:
 *         description: Redirect to the authenticated session or homepage.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Redirect to authenticated session or homepage"
 *       500:
 *         description: Internal server error during callback processing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */

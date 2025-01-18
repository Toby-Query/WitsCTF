import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth";

export async function POST(request) {
  try {
    const { problemName, submittedFlag } = await request.json();

    if (!problemName || !submittedFlag) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const userSession = await getServerSession();
    const userEmail = userSession?.user?.email;

    if (!userEmail) {
      return new Response(
        JSON.stringify({ message: "User not authenticated" }),
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const problemsCollection = db.collection("problems");
    const usersCollection = db.collection("users");

    // Fetch the problem by name
    const problem = await problemsCollection.findOne({ problemName });

    if (!problem) {
      return new Response(JSON.stringify({ message: "Problem not found" }), {
        status: 404,
      });
    }

    // Verify the flag
    if (problem.flag !== submittedFlag) {
      return new Response(JSON.stringify({ message: "Incorrect flag" }), {
        status: 401,
      });
    }

    // Fetch the user by email
    const user = await usersCollection.findOne({ email: userEmail });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Ensure the problem isn't already solved by the user
    const isAlreadySolved = user.solved && user.solved.includes(problemName);
    if (isAlreadySolved) {
      return new Response(
        JSON.stringify({ message: "Problem already solved" }),
        { status: 400 }
      );
    }

    // Increment the solves count for the problem
    const updatedSolves = (problem.solves || 0) + 1;
    const usersCount = await usersCollection.countDocuments();
    const dynamicScore = Math.max(
      0,
      ((usersCount - updatedSolves) / usersCount) * 500
    );

    // Update the problem's solves count and points
    await problemsCollection.updateOne(
      { problemName },
      { $set: { solves: updatedSolves, points: dynamicScore } }
    );

    // Add the problem to the user's solved list
    const updatedSolved = new Set([...(user.solved || []), problemName]);

    // Recalculate the user's total points from scratch
    let totalPoints = 0;

    for (const solvedProblemName of updatedSolved) {
      const solvedProblem = await problemsCollection.findOne({
        problemName: solvedProblemName,
      });
      if (solvedProblem?.points) {
        totalPoints += solvedProblem.points;
      }
    }

    // Update the user's solved list and points
    await usersCollection.updateOne(
      { email: userEmail },
      { $set: { solved: Array.from(updatedSolved), points: totalPoints } }
    );

    // Recalculate points for all users who have solved any problem
    const allUsers = await usersCollection
      .find(
        { solved: { $exists: true, $not: { $size: 0 } } },
        { projection: { email: 1, solved: 1 } }
      )
      .toArray();

    // Loop through all users who have solved problems and recalculate their points
    for (const user of allUsers) {
      let userPoints = 0;

      for (const solvedProblemName of user.solved) {
        const solvedProblem = await problemsCollection.findOne({
          problemName: solvedProblemName,
        });
        if (solvedProblem?.points) {
          userPoints += solvedProblem.points;
        }
      }

      // Update the user's total points
      await usersCollection.updateOne(
        { email: user.email },
        { $set: { points: userPoints } }
      );
    }

    // Recalculate ranks for all users
    const updatedUsers = await usersCollection
      .find({}, { projection: { email: 1, points: 1 } })
      .toArray();

    // Sort users by points in descending order and assign ranks
    updatedUsers.sort((a, b) => b.points - a.points);

    for (let rank = 0; rank < updatedUsers.length; rank++) {
      await usersCollection.updateOne(
        { email: updatedUsers[rank].email },
        { $set: { rank: rank + 1 } }
      );
    }

    return new Response(
      JSON.stringify({
        message: `Flag correct! Problem points and user ranks updated.`,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}

/**
 * @swagger
 * /api/submit-flag:
 *   post:
 *     summary: Submit a flag for a problem and update scores and ranks.
 *     description: This endpoint verifies a submitted flag for a problem, updates the problem's solve count and points, and recalculates user ranks and scores dynamically.
 *     tags:
 *        - Flag Submission
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               problemName:
 *                 type: string
 *                 example: "Welcome to WitsCTF"
 *               submittedFlag:
 *                 type: string
 *                 example: "CTF{correct_flag}"
 *     responses:
 *       200:
 *         description: Flag verified, and scores updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Flag correct! Problem points and user ranks updated."
 *       400:
 *         description: Bad request due to missing fields or problem already solved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *       401:
 *         description: Unauthorized access or incorrect flag.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not authenticated"
 *       404:
 *         description: Resource not found (problem or user).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Problem not found"
 *       500:
 *         description: Internal server error during processing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

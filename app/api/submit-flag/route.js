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

    // Assume we have middleware to fetch the user's session
    const userSession = await getServerSession(); // Use your auth/session utility
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

    // Find the problem by name
    const problem = await problemsCollection.findOne({ problemName });

    if (!problem) {
      return new Response(JSON.stringify({ message: "Problem not found" }), {
        status: 404,
      });
    }

    // Check if the flag is correct
    if (problem.flag !== submittedFlag) {
      return new Response(JSON.stringify({ message: "Incorrect flag" }), {
        status: 401,
      });
    }

    // Update user's points and solved list
    const user = await usersCollection.findOne({ email: userEmail });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const updatedSolved = new Set([...(user.solved || []), problemName]);

    await usersCollection.updateOne(
      { email: userEmail },
      {
        $inc: { points: problem.points },
        $set: { solved: Array.from(updatedSolved) },
      }
    );

    return new Response(
      JSON.stringify({ message: "Flag correct! Points updated." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}

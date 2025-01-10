import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request) {
  try {
    // Authenticate the user
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Connect to the database
    const { db } = await connectToDatabase();

    // Fetch the user's profile to check their role
    const user = await db
      .collection("users")
      .findOne({ email: session.user.email });
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    if (user.role !== "admin") {
      return new Response("Forbidden: Admin access required", { status: 403 });
    }

    // Parse the incoming request body
    const body = await request.json();
    let {
      problemName,
      tag,
      author,
      description,
      link = "",
      flag,
      points,
    } = body;

    // Validate required fields
    if (
      !problemName ||
      !tag ||
      !author ||
      !description ||
      !flag ||
      points === undefined
    ) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Convert points to integer
    points = parseInt(points, 10);

    // Ensure points are a positive integer
    if (!Number.isInteger(points) || points < 0) {
      return new Response("Points must be a positive integer", { status: 400 });
    }
    // Construct the new problem document
    const newProblem = {
      problemName,
      tag,
      author,
      description,
      link,
      flag,
      points,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert the new problem into the database
    const result = await db.collection("problems").insertOne(newProblem);

    // Respond with the created problem
    return new Response(
      JSON.stringify({
        message: "Problem created successfully",
        problem: {
          id: result.insertedId,
          ...newProblem,
        },
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in POST /api/create:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

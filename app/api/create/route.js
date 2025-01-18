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
    let { problemName, tag, author, description, link = "", flag } = body;

    // Validate required fields
    if (!problemName || !tag || !author || !description || !flag) {
      console.log("Missing required fields:", body);
      return new Response("Missing required fields", { status: 400 });
    }

    // Convert points to integer
    // points = parseInt(points, 10);

    // // Ensure points are a positive integer
    // if (!Number.isInteger(points) || points < 0) {
    //   console.log("Invalid points:", points);
    //   return new Response("Points must be a positive integer", { status: 400 });
    // }

    // Check if a problem with the same name already exists
    const existingProblem = await db
      .collection("problems")
      .findOne({ problemName });
    if (existingProblem) {
      return new Response(
        JSON.stringify({
          message: "A problem with this name already exists",
        }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // Construct the new problem document
    const newProblem = {
      problemName,
      tag,
      author,
      description,
      link,
      flag,
      createdAt: new Date(),
      updatedAt: new Date(),
      solves: 0,
      points: 500,
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

/**
 * @swagger
 * /api/create:
 *   post:
 *     summary: Create a new problem
 *     description: Allows an admin user to create a new problem and add it to the database.
 *     tags:
 *       - Problems
 *     security:
 *       - bearerAuth: [] # If you're using JWT or other token-based authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - problemName
 *               - tag
 *               - author
 *               - description
 *               - flag
 *             properties:
 *               problemName:
 *                 type: string
 *                 example: "Example Problem"
 *               tag:
 *                 type: string
 *                 example: "Cryptography"
 *               author:
 *                 type: string
 *                 example: "John Doe"
 *               description:
 *                 type: string
 *                 example: "Solve the challenge by decrypting the given cipher text."
 *               link:
 *                 type: string
 *                 example: "https://example.com/challenge"
 *                 description: "Optional link to the problem's resource."
 *               flag:
 *                 type: string
 *                 example: "flag{example_flag}"
 *     responses:
 *       201:
 *         description: Problem created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Problem created successfully"
 *                 problem:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "6782c30a4d81c6f251740b8f"
 *                     problemName:
 *                       type: string
 *                       example: "Example Problem"
 *                     tag:
 *                       type: string
 *                       example: "Cryptography"
 *                     author:
 *                       type: string
 *                       example: "John Doe"
 *                     description:
 *                       type: string
 *                       example: "Solve the challenge by decrypting the given cipher text."
 *                     link:
 *                       type: string
 *                       example: "https://example.com/challenge"
 *                     flag:
 *                       type: string
 *                       example: "flag{example_flag}"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-18T12:34:56.789Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-18T12:34:56.789Z"
 *                     solves:
 *                       type: integer
 *                       example: 0
 *                     points:
 *                       type: integer
 *                       example: 500
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Missing required fields"
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Unauthorized"
 *       403:
 *         description: "Forbidden: Admin access required"
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Forbidden: Admin access required"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "User not found"
 *       409:
 *         description: "Conflict: A problem with this name already exists"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A problem with this name already exists"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 details:
 *                   type: string
 *                   example: "Database connection failed"
 */

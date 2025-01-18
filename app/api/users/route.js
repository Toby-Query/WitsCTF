import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb"; // Adjust the path to your db connection utility

// GET /api/users - Fetch all users sorted by rank
export async function GET() {
  try {
    // Connect to the database
    const { db } = await connectToDatabase();

    // Fetch and sort users by rank from the users collection
    const users = await db
      .collection("users")
      .find()
      .sort({ rank: 1 })
      .toArray();

    // Return the sorted user data
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Fetch all users sorted by rank.
 *     description: Retrieves a list of all users, sorted by their rank in ascending order.
 *     tags:
 *      - Users
 *     responses:
 *       200:
 *         description: A list of users sorted by rank.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     example: "user@example.com"
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   rank:
 *                     type: integer
 *                     example: 5
 *                   points:
 *                     type: integer
 *                     example: 1200
 *       500:
 *         description: Internal server error when fetching users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch users"
 */

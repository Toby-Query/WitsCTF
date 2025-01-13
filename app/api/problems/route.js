import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/problems:
 *   get:
 *     summary: Returns a list of all problems.
 *     description: Returns a list of all problems from the database.
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello World
 *       500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: Failed to fetch
 */
export async function GET() {
  try {
    // Connect to the database
    const { db } = await connectToDatabase();

    // Fetch all problems from the "problems" collection without the "flag" field
    const problems = await db
      .collection("problems")
      .find({}, { projection: { flag: 0 } })
      .toArray();

    // Return the fetched problems as JSON
    return NextResponse.json(problems, { status: 200 });
  } catch (error) {
    console.error("Error fetching problems:", error);
    return NextResponse.json(
      { error: "Failed to fetch problems" },
      { status: 500 }
    );
  }
}

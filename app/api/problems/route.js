import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

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

/**
 * @swagger
 * /api/problems:
 *   get:
 *     summary: Returns a list of all problems.
 *     description: Returns a list of all problems from the database.
 *     tags:
 *       - Problems
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 6782c30a4d81c6f251740b8f
 *                 problemName:
 *                   type: string
 *                   example: "Welcome to WitsCTF"
 *                 tag:
 *                   type: string
 *                   example: "Cryptography"
 *                 author:
 *                   type: string
 *                   example: "Muthuphei Mukhunyeledzi"
 *                 description:
 *                   type: string
 *                   example: "84 104 117 112 115 67 84 70 123 102 49 114 115 116 95 112 114 111 98 108 101 109 125"
 *                 link:
 *                   type: string
 *                   example: "https://witsctf.com"
 *                 points:
 *                   type: number
 *                   example: 100
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-05-17T13:30:00.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-05-17T13:30:00.000Z"
 *                 solves:
 *                   type: number
 *                   example: 0
 *       500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: Failed to fetch problems
 */

import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth";

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { db } = await connectToDatabase();
    const user = await db
      .collection("users")
      .findOne({ email: session.user.email });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { db } = await connectToDatabase();

    const result = await db
      .collection("users")
      .updateOne({ email: session.user.email }, { $set: body });

    if (result.matchedCount === 0) {
      return new Response("User not found", { status: 404 });
    }

    return new Response("Profile updated successfully", { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieves the profile information of the currently authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: [] # Adjust based on your authentication method
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "6782c30a4d81c6f251740b8f"
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 role:
 *                   type: string
 *                   example: "admin"
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Unauthorized"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "User not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 *   post:
 *     summary: Update user profile
 *     description: Updates the profile information of the currently authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: [] # Adjust based on your authentication method
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               role:
 *                 type: string
 *                 example: "user"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Profile updated successfully"
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Unauthorized"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "User not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */

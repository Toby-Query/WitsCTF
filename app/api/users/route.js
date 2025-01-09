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

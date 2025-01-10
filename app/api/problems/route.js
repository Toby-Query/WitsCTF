import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Connect to the database
    const { db } = await connectToDatabase();

    // Fetch all problems from the "problems" collection
    const problems = await db.collection("problems").find({}).toArray();

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

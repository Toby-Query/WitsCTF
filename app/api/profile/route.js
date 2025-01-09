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

    console.log(user);

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

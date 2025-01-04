import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({
      success: false,
      message: "Not authenticated",
    }, { status: 401 });
  }

  const user: User = session.user;
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const userData = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!userData || userData.length === 0) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      messages: userData[0].messages,
    }, { status: 200 });

  } catch (error) {
    console.error("Unexpected Error occurred while fetching user messages:", error);
    return NextResponse.json({
      success: false,
      message: "An unexpected error occurred",
    }, { status: 500 });
  }
}

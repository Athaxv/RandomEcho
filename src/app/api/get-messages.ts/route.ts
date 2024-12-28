import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import User from 'next-auth'
import mongoose from "mongoose";

export async function GET(request: Request){
    dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if (!session || !session.user){
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, {status: 401})
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            { $match: {id: userId} },
            { $unwind: "$messages"},
            { $sort: {'messages.createdAt': -1}},
            { $group: { _id: '$_id', messages: {$push: '$messages'}}}
        ])
    } catch (error) {
        
    }
}
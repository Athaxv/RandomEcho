import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import User from 'next-auth'

export async function POST(request: Request){
    dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated",
        }, {status: 401})
    }

    const userId = user._id;
    const { acceptMessages } = await request.json()

    try{
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessage: acceptMessages
            },
            {
                new: true
            }
        )
        if (!updatedUser){
            return Response.json({
                success: false,
                message: "Error updating user status"
            }, {status: 401})
        }
        else {
            return Response.json({
                success: true,
                message: "Message acceptance status updated",
                updatedUser
            }, {status: 200})
        }
    }
    catch (error) {
        console.log("Failed to update user status")
        return Response.json({
            success: false,
            message: "Failed to update user status"
        }, {status: 500})
    }
}

export async function GET(request: Request){
    dbConnect();

    const session = getServerSession(authOptions);
    const user = session?.user

    if (!session || !session.user){
        return Response.json({
            success: false,
            message: "Not authenticated",
        }, {status: 401})
    }

    const userId = user._id;

    const foundUser = await UserModel.findById(userId);
    
    try {
        if (!foundUser){
            return Response.json({
                success: false,
                message: "User not found",
            }, {status: 404})
        }
        else {
            return Response.json({
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessage
            }, {status: 200})
        }
    } catch (error) {
        console.log("Error getting acceptance status")
        return Response.json({
            success: false,
            message: "Error getting acceptance status"
        }, {status: 500})
    }
}
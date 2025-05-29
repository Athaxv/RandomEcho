import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request){
    await dbConnect()

    try {
        const {username, code} = await request.json()

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username: decodedUsername})
        console.log(user)
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found",
            }, {status: 500})
        }

        const isCodeValid = user.verifyCode === code
        const isCodenotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodenotExpired){
            user.isVerified = true
            await user.save()

            return Response.json({
                success: true,
                message: "Account Verification Successfull"
            }, {status: 200})
        }
        else if (!isCodenotExpired){
            return Response.json({
                success: false,
                message: "Code Expired, Verify again"
            }, {status: 400})
        }
        else {
            return Response.json({
                success: false,
                message: "Code Invalid",
            }, {status: 500})
        }

    } catch (error) {
        console.error("Error verifying email", error)
        return Response.json({
            success: false,
            message: "Error verifying username and mail"
        }, {status: 500})
    }
}
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text"},
                password: { label: "password", type: "password"},
            },
            async authorize(credentials: any): Promise<any>{
                await dbConnect();
                try {
                    const user = UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier},
                        ]
                    })
                    if (!user){
                        throw new Error("No such user exists with this email")
                    }
                    if (!user.isVerified){
                        throw new Error('Please verify your account before login')
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if (isPasswordCorrect){
                        return user 
                    }
                    else {
                        throw new Error('Please verify your account before login')
                    }
                } catch (err: any) {
                    throw new Error(err)
                }
            }

        })
    ]
}
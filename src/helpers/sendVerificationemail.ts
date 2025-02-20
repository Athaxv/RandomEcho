import {resend} from "../lib/resend"
import VerificationEmail from "../../emails/VerificationEmails"
import { ApiResponse } from "../types/ApiResponse"

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "Verify your Account",
            react: VerificationEmail({username, otp: verifyCode}),
        });
        console.log(email)
        return {success: true, message: 'Verification email send Successfully'}
    } catch (Emailerror) {
        console.error("Error sending verification email", Emailerror)
        return {success: false, message: 'Failed to send Verification email'}
    }
}
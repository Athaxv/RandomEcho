import {z} from "zod"

export const MessageSchema = z.object({
    content: z
    .string()
    .min(5, {message: "Message should be atleast 5 characters long"})
    .max(100, {message: "Message must not be longer than 100 characters"})
})
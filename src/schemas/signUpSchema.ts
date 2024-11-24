import {z} from 'zod';

export const usernameValidation = z
    .string()
    .min(4, "Username must be atleast 4 characters long")
    .max(20, "Username must not be more than 20 characters")


export const signUpValidation = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid Email Address"}),
    password: z.string().min(6, {message: "Password must be atleast 6 characters long"})
})
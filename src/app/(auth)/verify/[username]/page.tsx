"use client"
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { verifyEmailSchema } from '@/schemas/VerifyEmail'
import * as z  from "zod"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function VerifyAccount() {
    const router = useRouter()
    const params = useParams<{username: string}>()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof verifyEmailSchema>>({
            resolver: zodResolver(verifyEmailSchema),
      }) 

    const onSubmit = async (data: z.infer<typeof verifyEmailSchema>) => 
        {
        try {
            const response = await axios.post('/api/verifyCode', {
                username: params.username,
                code: data.code,
            })

            toast({
                title: "Success",
                description: response.data.message
            })
            router.replace("/signin");
        }
        catch (error) {
            console.error("Error verifying user", error)
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message
            toast({
                title: 'Verification unsuccessfull',
                description: errorMessage,
                variant: 'destructive'
            })
        }
    }

    return (
    <div className='flex justify-center items-center bg-gray-100 min-h-screen'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
            <h1 className='text-4xl tracking-tight font-extrabold lg:text-5xl mb-6'>Verfiy Your Account</h1>
            <p className='mb-4'>Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verfiy Email</FormLabel>
              <FormControl>
                <Input type='password' placeholder="Verify your Code" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
      </div>
    </div>
  )
}





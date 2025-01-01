"use client"
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import { signInSchema } from '@/schemas/signInSchema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import * as z  from "zod"

export default function Page() {

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) =>
  {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    })
    console.log(result)
    if (result?.error){
      toast({
        title: "User login Failed",
        description: "Incorrect username or password",
        variant: 'destructive'
      })
    }
    if (result?.url){
      router.replace('/dashboard')
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100 '>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
            Welcome Back
          </h1>
          <p className='mb-4'>Let's get started with your Echoes</p>
        </div>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your mail" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
        <div className='text-center mt-4'>
          <p>Not a Member yet?{' '}
            <Link href={'/signup'} className='text-blue-500 hover:text-blue-800'>Signup</Link>
          </p>
        </div>
      </div>
    </div>
  )
}



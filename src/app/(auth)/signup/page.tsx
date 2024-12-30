"use client" 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { useDebounceCallback } from 'usehooks-ts'
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpValidation } from "@/schemas/signUpSchema"
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"



export default function Page() {
  const [username, setUsername ] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername ] = useState(false)
  const [isSubmitting, setIsSubmitting ] = useState(false)

  const debounced = useDebounceCallback(setUsername, 300);
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof signUpValidation>>({
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  }) 

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/Check-unique-username?username=${username}`)
          console.log(response)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          )
        }
        finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [debounced])

  const onSubmit = async (data: z.infer<typeof signUpValidation>) =>
  {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/signup', data)
      console.log(response)
      toast({
        title: 'success',
        description: response.data.message
      })
      router.replace(`/verify/${username}`)
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in signup", error)
      const axiosError = error as AxiosError<ApiResponse>;
        const errorMessage = axiosError.response?.data.message
        toast({
          title: "Signup Failed",
          description: errorMessage,
          variant: 'destructive'
        })
        setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join Random Message
            </h1>
            <p className="mb-4">Sign up to start your anonymous adventure</p>
          </div>
          <Form {...form}>
              <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username"
                       {...field}
                       onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                       }}
                       />
                    </FormControl>
                    {isCheckingUsername && <Loader2 className="animate-spin"/>}
                    {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
                    <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email"
                       {...field}
                       />
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
                      <Input type="password" placeholder="password"
                       {...field}
                       />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {
                  isSubmitting ? (
                    <>
                    <Loader2 className="mr-2 h-4 animate-spin w-4" /> Please wait!
                    </>
                  ) : ( 'Signup' )
                }
              </Button>
              </form>
          </Form>
          <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href={"/signin"} className="text-blue-600 hover:text-blue-800"></Link>
          </p>
          </div>
      </div>
    </div>
  )
}

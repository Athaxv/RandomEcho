"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'

function Navbar() {
    const {data: session} = useSession()
    const user: User = session?.user as User
  return (
    <nav className='p-4 bg-black text-white md:p-6 shadow-md'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
            <a className='text-xl font-bold mb-4 md:mb-0' href="#">Random Echoes</a>
            {
                session ? (
                    <>
                    <span className='mr-4'>Welcome, {user?.username || user?.email}</span>
                    <Button className='w-full md:w-auto' onClick={() => signOut()}>Logout</Button>
                    </>
                ) : (
                    <Link href='/signin'>
                        <Button className='w-full md:w-auto'>Login</Button>
                    </Link>
                )
            }
        </div>
    </nav>
  )
}

export default Navbar

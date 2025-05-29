"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
// import { Button } from './ui/button'
import { RainbowButton } from './magicui/rainbow-button'

function Navbar() {
    const {data: session} = useSession()
    const user: User = session?.user as User
  return (
    <nav className="border-b bg-white text-black shadow-sm">
  <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
    {/* Logo / Brand */}
    <Link href="/" className="text-2xl font-bold tracking-tight hover:opacity-80 transition">
      RandomEchoes
    </Link>

    {/* Navigation / Auth */}
    <div className="flex items-center space-x-4">
      {session ? (
        <>
          <span className="hidden md:inline text-sm text-muted-foreground">
            Welcome, {user?.username || user?.email}
          </span>
          {/* <Button variant="outline" className="border-gray-300" onClick={() => signOut()}> */}
          <RainbowButton onClick={() => signOut()}>
            Logout
            </RainbowButton>
          {/* </Button> */}
        </>
      ) : (
        <Link href="/signin">
            <RainbowButton variant={'default'}>
            Login</RainbowButton>
        </Link>
      )}
    </div>
  </div>
</nav>

  )
}

export default Navbar

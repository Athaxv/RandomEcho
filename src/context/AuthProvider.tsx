"use client"

import { SessionProvider } from "next-auth/react"

export default function AuthProvider ({
  Children,
}: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      { Children }
    </SessionProvider>
  )
}
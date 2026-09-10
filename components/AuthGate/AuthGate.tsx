'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { clearSession, getCurrentUser, getToken } from '@/lib/auth'

const publicPaths = ['/login', '/register']

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const isPublicPath = publicPaths.includes(pathname)
    const hasValidSession = Boolean(getToken() && getCurrentUser())

    if (!hasValidSession && !isPublicPath) {
      clearSession()
      router.replace('/login')
      return
    }

    setIsReady(true)
  }, [pathname, router])

  if (!isReady) return null
  return children
}

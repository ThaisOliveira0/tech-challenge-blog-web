'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import GooeyNav from './GooeyNav'
import { AUTH_CHANGED_EVENT, clearSession, getCurrentUser } from '@/lib/auth'
import type { User } from '@/types/auth'
import './AppNavigation.css'

export default function AppNavigation() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const syncUser = () => setUser(getCurrentUser())
    syncUser()
    window.addEventListener(AUTH_CHANGED_EVENT, syncUser)
    window.addEventListener('storage', syncUser)
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, syncUser)
      window.removeEventListener('storage', syncUser)
    }
  }, [])

  function handleLogout() {
    clearSession()
    setUser(null)
    router.push('/login')
  }

  const items = user ? [
    { label: 'Home', href: '/' },
    ...(user.role === 'teacher' ? [{ label: 'My posts', href: '/my-posts' }] : []),
    ...(user.role === 'admin' ? [{ label: 'Cadastrar professor', href: '/register/teacher' }] : []),
  ] : []

  return (
    <div className="app-navigation">
      {items.length > 0 && <GooeyNav
          items={items}
          particleCount={15}
          particleDistances={[90, 10]}
          particleR={100}
          initialActiveIndex={0}
          animationTime={600}
          timeVariance={300}
          colors={[1, 2, 3, 1, 2, 3, 1, 4]}
        />}
      {user ? (
        <div className="session-actions">
          <span className="session-user" title={user.email}>Olá, {user.name.trim().split(/\s+/)[0]}</span>
          <button type="button" onClick={handleLogout}>Sair</button>
        </div>
      ) : (
        <a className="session-login" href="/login">Entrar</a>
      )}
    </div>
  )
}

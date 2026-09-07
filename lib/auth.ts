import type { User } from '@/types/auth'

const TOKEN_KEY = 'blog-token'
const USER_KEY = 'blog-user'
export const AUTH_CHANGED_EVENT = 'blog-auth-changed'

function notifyAuthChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
  }
}

export function getToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null

  const storedUser = window.localStorage.getItem(USER_KEY)
  if (!storedUser) return null

  try {
    return JSON.parse(storedUser) as User
  } catch {
    clearSession()
    return null
  }
}

export function saveSession(token: string, user: User) {
  window.localStorage.setItem(TOKEN_KEY, token)
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
  notifyAuthChanged()
}

export function clearSession() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(TOKEN_KEY)
  window.localStorage.removeItem(USER_KEY)
  notifyAuthChanged()
}

export function hasRole(role: User['role']) {
  return getCurrentUser()?.role === role
}
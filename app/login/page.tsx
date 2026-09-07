'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth.service'
import { saveSession } from '@/lib/auth'
import '../auth.css'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const response = await authService.login({ email, password })
      saveSession(response.data.token, response.data.user)
      router.push('/')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível entrar.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-shell" aria-labelledby="login-title">
        <div className="auth-intro">
          <div>
            <div className="auth-mark">The language journal</div>
            <h1>Seu próximo capítulo começa aqui.</h1>
            <p>Volte para as ideias, histórias e descobertas que fazem o aprendizado acontecer.</p>
          </div>
          <div className="auth-note">Um espaço para aprender, ensinar e repetir.</div>
        </div>
        <div className="auth-form-wrap">
          <h2 id="login-title">Bem-vindo de volta</h2>
          <p className="auth-subtitle">Entre na sua conta para continuar de onde parou.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field"><label htmlFor="email">E-mail</label><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></div>
            <div className="field"><label htmlFor="password">Senha</label><input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required minLength={6} /></div>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="auth-submit" type="submit" disabled={isLoading}>{isLoading ? 'Entrando...' : 'Entrar na conta'}</button>
          </form>
          <p className="auth-switch">Ainda não tem uma conta? <Link href="/register">Criar cadastro</Link></p>
        </div>
      </section>
    </main>
  )
}
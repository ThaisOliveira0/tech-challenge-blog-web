'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth.service'
import PasswordField from '@/components/PasswordField/PasswordField'
import '../auth.css'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' as const })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function updateField(field: 'name' | 'email' | 'password', value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await authService.register(form)
      router.push('/login')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível criar a conta.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-shell" aria-labelledby="register-title">
        <div className="auth-intro">
          <div>
            <div className="auth-mark">The language journal</div>
            <h1>Ideias melhores nascem em conversa.</h1>
            <p>Crie seu espaço para compartilhar aprendizados e encontrar novas formas de praticar.</p>
          </div>
          <div className="auth-note">Escreva. Compartilhe. Cresça.</div>
        </div>
        <div className="auth-form-wrap">
          <h2 id="register-title">Criar sua conta</h2>
          <p className="auth-subtitle">Leva menos de um minuto para começar.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field"><label htmlFor="name">Nome</label><input id="name" value={form.name} onChange={(event) => updateField('name', event.target.value)} autoComplete="name" required /></div>
            <div className="field"><label htmlFor="register-email">E-mail</label><input id="register-email" type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} autoComplete="email" required /></div>
            <PasswordField id="register-password" value={form.password} onChange={(value) => updateField('password', value)} autoComplete="new-password" />
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="auth-submit" type="submit" disabled={isLoading}>{isLoading ? 'Criando conta...' : 'Criar minha conta'}</button>
          </form>
          <p className="auth-switch">Já tem uma conta? <Link href="/login">Entrar</Link></p>
        </div>
      </section>
    </main>
  )
}
'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth.service'
import { getCurrentUser } from '@/lib/auth'
import PasswordField from '@/components/PasswordField/PasswordField'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import '../../../auth.css'

export default function RegisterTeacherPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'teacher' as const })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) router.replace('/login')
    else if (user.role !== 'admin') router.replace('/')
  }, [router])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await authService.register(form)
      router.push('/')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível cadastrar o professor.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-shell" aria-labelledby="teacher-register-title">
        <div className="auth-intro"><div><div className="auth-mark">Administração</div><h1>Amplie a sala de aula.</h1><p>Cadastre professores autorizados a compartilhar conhecimento na plataforma.</p></div></div>
        <div className="auth-form-wrap">
          <Breadcrumb items={[{ label: 'Início', href: '/' }, { label: 'Cadastrar professor' }]} />
          <h2 id="teacher-register-title">Novo professor</h2>
          <p className="auth-subtitle">Somente administradores podem realizar este cadastro.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field"><label htmlFor="teacher-name">Nome</label><input id="teacher-name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} autoComplete="name" required /></div>
            <div className="field"><label htmlFor="teacher-email">E-mail</label><input id="teacher-email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} autoComplete="email" required /></div>
            <PasswordField id="teacher-password" value={form.password} onChange={(password) => setForm((current) => ({ ...current, password }))} autoComplete="new-password" />
            {error && <p className="auth-error" role="alert">{error}</p>}
            <div className="form-actions"><button className="auth-cancel" type="button" onClick={() => router.back()}>Cancelar</button><button className="auth-submit" type="submit" disabled={isLoading}>{isLoading ? 'Cadastrando...' : 'Cadastrar professor'}</button></div>
          </form>
        </div>
      </section>
    </main>
  )
}

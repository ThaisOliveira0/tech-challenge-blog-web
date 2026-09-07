'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { postsService } from '@/services/posts.service'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import '../../auth.css'

export default function NewPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) router.replace('/login')
    else if (user.role !== 'teacher') router.replace('/')
  }, [router])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const post = await postsService.create({ title, content })
      router.push(`/posts/${post.id}`)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível criar o post.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-shell" aria-labelledby="new-post-title">
        <div className="auth-intro"><div><div className="auth-mark">Estúdio do professor</div><h1>Compartilhe o que você sabe.</h1><p>Crie um novo post para sua comunidade de aprendizagem.</p></div></div>
        <div className="auth-form-wrap">
          <Breadcrumb items={[{ label: 'Meus posts', href: '/my-posts' }, { label: 'Novo post' }]} />
          <h2 id="new-post-title">Novo post</h2>
          <p className="auth-subtitle">Publique uma ideia, dica ou experiência.</p>
          <div className="editor-tabs" role="tablist" aria-label="Modo do editor">
            <button type="button" className={!isPreview ? 'active' : ''} onClick={() => setIsPreview(false)}>Editar</button>
            <button type="button" className={isPreview ? 'active' : ''} onClick={() => setIsPreview(true)}>Visualizar</button>
          </div>
          {isPreview ? <article className="post-preview"><span className="preview-label">Pré-visualização</span><h3>{title || 'Seu título aparecerá aqui'}</h3><p>{content || 'Seu conteúdo aparecerá aqui.'}</p></article> : <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field"><label htmlFor="title">Título</label><input id="title" value={title} onChange={(event) => setTitle(event.target.value)} required /></div>
            <div className="field"><label htmlFor="content">Conteúdo</label><textarea id="content" value={content} onChange={(event) => setContent(event.target.value)} required rows={10} /></div>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <div className="form-actions">
              <button className="auth-cancel" type="button" onClick={() => router.back()}>Cancelar</button>
              <button className="auth-submit" type="submit" disabled={isLoading}>{isLoading ? 'Publicando...' : 'Publicar post'}</button>
            </div>
          </form>}
        </div>
      </section>
    </main>
  )
}

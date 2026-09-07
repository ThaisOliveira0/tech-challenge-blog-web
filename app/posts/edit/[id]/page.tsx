'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { postsService } from '@/services/posts.service'
import type { Post } from '@/types/post'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal'
import '../../../auth.css'

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.replace('/login')
      return
    }
    if (user.role !== 'teacher') {
      router.replace('/')
      return
    }

    postsService.findById(id).then((loadedPost) => {
      setPost(loadedPost)
      setTitle(loadedPost.title)
      setContent(loadedPost.content)
    }).catch((requestError) => {
      setError(requestError instanceof Error ? requestError.message : 'Não foi possível carregar o post.')
    }).finally(() => setIsLoading(false))
  }, [id, router])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSaving(true)
    try {
      await postsService.update(id, { title, content })
      router.push(`/posts/${id}`)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível atualizar o post.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    setError('')
    setIsDeleting(true)
    try {
      await postsService.delete(id)
      router.push('/my-posts')
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Não foi possível excluir o post.')
      setIsDeleting(false)
    }
  }

  if (isLoading) return <main className="auth-page"><p>Carregando post...</p></main>
  if (!post) return <main className="auth-page"><p>{error || 'Post não encontrado.'}</p></main>

  return (
    <main className="auth-page">
      <section className="auth-shell" aria-labelledby="edit-post-title">
        <div className="auth-intro"><div><div className="auth-mark">Estúdio do professor</div><h1>Refine sua ideia.</h1><p>Atualize o conteúdo ou remova este post quando necessário.</p></div></div>
        <div className="auth-form-wrap">
          <Breadcrumb items={[{ label: 'Meus posts', href: '/my-posts' }, { label: 'Editar post' }]} />
          <h2 id="edit-post-title">Editar post</h2>
          <p className="auth-subtitle">As alterações serão salvas no backend.</p>
          <div className="editor-tabs" role="tablist" aria-label="Modo do editor">
            <button type="button" className={!isPreview ? 'active' : ''} onClick={() => setIsPreview(false)}>Editar</button>
            <button type="button" className={isPreview ? 'active' : ''} onClick={() => setIsPreview(true)}>Visualizar</button>
          </div>
          {isPreview ? <article className="post-preview"><span className="preview-label">Pré-visualização</span><h3>{title}</h3><p>{content}</p></article> : <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field"><label htmlFor="title">Título</label><input id="title" value={title} onChange={(event) => setTitle(event.target.value)} required /></div>
            <div className="field"><label htmlFor="content">Conteúdo</label><textarea id="content" value={content} onChange={(event) => setContent(event.target.value)} required rows={10} /></div>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="auth-submit" type="submit" disabled={isSaving}>{isSaving ? 'Salvando...' : 'Salvar alterações'}</button>
            <div className="form-actions">
              <button className="auth-cancel" type="button" onClick={() => router.back()}>Cancelar</button>
              <button className="auth-delete" type="button" onClick={() => setIsConfirmingDelete(true)}>Excluir post</button>
            </div>
          </form>}
        </div>
      </section>
      {isConfirmingDelete && <ConfirmModal title="Excluir post?" message="Esta ação não pode ser desfeita." confirmLabel="Excluir" isLoading={isDeleting} onCancel={() => setIsConfirmingDelete(false)} onConfirm={handleDelete} />}
    </main>
  )
}

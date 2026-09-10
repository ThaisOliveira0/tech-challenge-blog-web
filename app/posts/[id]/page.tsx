'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Edit3, Trash2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { postsService } from '@/services/posts.service'
import { commentsService } from '@/services/comments.service'
import type { Comment, Post } from '@/types/post'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal'
import './PostDetail.css'

export default function PostDetailPage() {
	const { id } = useParams<{ id: string }>()
	const router = useRouter()
	const [currentUser] = useState(getCurrentUser())
	const [post, setPost] = useState<Post | null>(null)
	const [comments, setComments] = useState<Comment[]>([])
	const [commentText, setCommentText] = useState('')
	const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
	const [editingCommentText, setEditingCommentText] = useState('')
	const [isOwner, setIsOwner] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [isCommentsLoading, setIsCommentsLoading] = useState(true)
	const [isCommentSubmitting, setIsCommentSubmitting] = useState(false)
	const [error, setError] = useState('')
	const [commentsError, setCommentsError] = useState('')
	const [confirmDelete, setConfirmDelete] = useState<{ type: 'post' | 'comment'; id: number } | null>(null)
	const [isDeleting, setIsDeleting] = useState(false)

	useEffect(() => {
		let isCurrent = true
		postsService.findById(id).then((fetchedPost) => {
			if (isCurrent) {
				setPost(fetchedPost)
				setIsOwner(currentUser?.role === 'teacher' && currentUser.id === fetchedPost.userId)
			}
		}).catch((requestError) => {
			if (isCurrent) setError(requestError instanceof Error ? requestError.message : 'Não foi possível carregar este post.')
		}).finally(() => {
			if (isCurrent) setIsLoading(false)
		})
		commentsService.list(id).then((loadedComments) => {
			if (isCurrent) setComments(loadedComments)
		}).catch((requestError) => {
			if (isCurrent) setCommentsError(requestError instanceof Error ? requestError.message : 'Não foi possível carregar os comentários.')
		}).finally(() => {
			if (isCurrent) setIsCommentsLoading(false)
		})
		return () => { isCurrent = false }
	}, [id])

	async function handleCreateComment(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const content = commentText.trim()
		if (!content) return
		setIsCommentSubmitting(true)
		setCommentsError('')
		try {
			const createdComment = await commentsService.create(id, { content })
			setComments((currentComments) => [...currentComments, createdComment])
			setCommentText('')
		} catch (requestError) {
			setCommentsError(requestError instanceof Error ? requestError.message : 'Não foi possível publicar o comentário.')
		} finally {
			setIsCommentSubmitting(false)
		}
	}

	async function handleUpdateComment(commentId: number) {
		const content = editingCommentText.trim()
		if (!content) return
		try {
			const updatedComment = await commentsService.update(commentId, { content })
			setComments((currentComments) => currentComments.map((comment) => comment.id === commentId ? updatedComment : comment))
			setEditingCommentId(null)
			setEditingCommentText('')
		} catch (requestError) {
			setCommentsError(requestError instanceof Error ? requestError.message : 'Não foi possível editar o comentário.')
		}
	}

	async function handleDeleteComment(commentId: number) {
		setIsDeleting(true)
		try {
			await commentsService.delete(commentId)
			setComments((currentComments) => currentComments.filter((comment) => comment.id !== commentId))
			setConfirmDelete(null)
		} catch (requestError) {
			setCommentsError(requestError instanceof Error ? requestError.message : 'Não foi possível excluir o comentário.')
		} finally {
			setIsDeleting(false)
		}
	}

	async function handleDelete() {
		if (!post) return

		setIsDeleting(true)
		try {
			await postsService.delete(String(post.id))
			router.push('/my-posts')
		} catch (deleteError) {
			setError(deleteError instanceof Error ? deleteError.message : 'Não foi possível excluir o post.')
			setIsDeleting(false)
		}
	}

	if (isLoading) return <main className="post-detail-page"><p className="detail-message">Carregando post...</p></main>
	if (!post) return <main className="post-detail-page"><p className="detail-message">{error || 'Não foi possível encontrar este post.'}</p></main>

	return (
		<main className="post-detail-page">
			<div className="post-detail-layout">
				<article className="post-detail-article">
		            <Breadcrumb items={[{ label: 'Início', href: '/' }, { label: post.title }]} />
					<h1 className="post-detail-title">{post.title}</h1>
					<p className="post-detail-meta">Publicado em {new Date(post.createdAt).toLocaleDateString('pt-BR')} · autor {post.user?.name}</p>
					{isOwner && (
						<div className="post-owner-actions">
							<Link href={`/posts/edit/${post.id}`}>Editar post</Link>
							<button type="button" onClick={() => setConfirmDelete({ type: 'post', id: post.id })}>Excluir post</button>
						</div>
					)}
					<div className="post-detail-content">{post.content}</div>
				</article>
				<aside className="comments-panel" aria-labelledby="comments-title">
					<h2 id="comments-title">Comentários</h2>
					<p className="comments-count">{comments.length} contribuição(ões) nesta conversa</p>
					{isCommentsLoading && <p className="comment-text">Carregando comentários...</p>}
					{!isCommentsLoading && commentsError && <p className="auth-error" role="alert">{commentsError}</p>}
					{!isCommentsLoading && !commentsError && comments.length === 0 && <p className="comment-text">Ainda não há comentários.</p>}
					<div className="comment-list">
						{comments.map((comment) => {
							const isCommentOwner = currentUser?.id === comment.userId
							return <div className="comment" key={comment.id}>
								<div className="comment-heading">
									<div className="comment-avatar" aria-hidden="true">{(comment.user?.name || `U${comment.userId}`).slice(0, 2).toUpperCase()}</div>
									<div><p className="comment-author">{comment.user?.name || `Usuário #${comment.userId}`}</p><time className="comment-date" dateTime={comment.createdAt}>{new Date(comment.createdAt).toLocaleDateString('pt-BR')}</time></div>
								</div>
								{editingCommentId === comment.id ? <>
									<textarea className="comment-form-input" value={editingCommentText} onChange={(event) => setEditingCommentText(event.target.value)} />
									<div className="comment-actions"><button type="button" onClick={() => handleUpdateComment(comment.id)}>Salvar</button><button type="button" onClick={() => setEditingCommentId(null)}>Cancelar</button></div>
								</> : <p className="comment-text">{comment.content}</p>}
								{isCommentOwner && editingCommentId !== comment.id && <div className="comment-actions"><button type="button" className="comment-icon-action" title="Editar comentário" aria-label="Editar comentário" onClick={() => { setEditingCommentId(comment.id); setEditingCommentText(comment.content) }}><Edit3 size={15} aria-hidden="true" /></button><button type="button" className="comment-icon-action comment-delete-action" title="Excluir comentário" aria-label="Excluir comentário" onClick={() => setConfirmDelete({ type: 'comment', id: comment.id })}><Trash2 size={15} aria-hidden="true" /></button></div>}
							</div>
						})}
					</div>
					{currentUser && <form className="comment-form" onSubmit={handleCreateComment}>
						<label htmlFor="comment">Deixe uma ideia</label>
						<textarea id="comment" value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Escreva um comentário..." maxLength={500} required />
						<button className="comment-submit" type="submit" disabled={isCommentSubmitting}>{isCommentSubmitting ? 'Publicando...' : 'Publicar comentário'}</button>
					</form>}
				</aside>
			</div>
			{confirmDelete && <ConfirmModal title={confirmDelete.type === 'post' ? 'Excluir post?' : 'Excluir comentário?'} message={confirmDelete.type === 'post' ? 'Esta ação não pode ser desfeita.' : 'O comentário será removido permanentemente.'} confirmLabel="Excluir" isLoading={isDeleting} onCancel={() => setConfirmDelete(null)} onConfirm={() => confirmDelete.type === 'post' ? handleDelete() : handleDeleteComment(confirmDelete.id)} />}
		</main>
	)
}

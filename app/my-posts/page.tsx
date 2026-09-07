'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import './MyPosts.css'
import PostCard from '@/components/PostCard/PostCard'
import { getCurrentUser } from '@/lib/auth'
import { postsService } from '@/services/posts.service'
import { teachersService } from '@/services/teachers.service'
import type { Post } from '@/types/post'
import type { TeacherDashboard } from '@/types/dashboard'

export default function MyPosts() {
  const router = useRouter()
  const [teacher, setTeacher] = useState(getCurrentUser())
  const [dashboard, setDashboard] = useState<TeacherDashboard['metrics'] | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const user = getCurrentUser()
    setTeacher(user)
    if (!user) {
      router.replace('/login')
      return
    }
    if (user.role !== 'teacher') {
      router.replace('/')
      return
    }

    postsService.me().then(setPosts).catch((requestError) => {
      setError(requestError instanceof Error ? requestError.message : 'Não foi possível carregar seus posts.')
    }).finally(() => setIsLoading(false))

    teachersService.dashboard().then((data) => {
      setTeacher(data.user)
      setDashboard(data.metrics)
    }).catch(() => {
    })
  }, [router])

  return (
    <main className="my-posts-page">
      <section className="posts-section">
        <div className="posts-header">
          <span className="posts-label">PROFESSOR</span>
          <h1>Meus posts</h1>
          <p>Compartilhe seu conhecimento, suas ideias e experiências com seus alunos.</p>
          <Link className="new-post-action" href="/posts/new">Criar novo post</Link>
        </div>

        {isLoading && <p>Carregando seus posts...</p>}
        {!isLoading && error && <p>{error}</p>}
        {!isLoading && !error && posts.length === 0 && <p>Você ainda não criou nenhum post.</p>}
        <div className="posts-list">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              excerpt={post.content.slice(0, 150)}
              date={new Date(post.createdAt).toLocaleDateString('pt-BR')}
              category="Post"
              author={post.user?.name || teacher?.name}
            />
          ))}
        </div>
      </section>

      {teacher && (
        <aside className="teacher-dashboard" aria-label="Resumo do professor">
            <div className="teacher-identity">
              <div className="teacher-avatar" aria-hidden="true">{teacher.name.slice(0, 2).toUpperCase()}</div>
              <div>
                <span className="dashboard-eyebrow">Perfil do professor</span>
                <h2>{teacher.name}</h2>
                <p>{teacher.email}</p>
              </div>
            </div>
            <div className="teacher-metrics">
              <div className="teacher-metric"><strong>{dashboard?.postsCount ?? posts.length}</strong><span>Posts publicados</span></div>
              <div className="teacher-metric"><strong>{dashboard?.commentsCount ?? '--'}</strong><span>Comentários recebidos</span></div>
              <div className="teacher-metric"><strong>{dashboard?.latestPostAt ? new Date(dashboard.latestPostAt).toLocaleDateString('pt-BR') : posts.length ? new Date(posts[0].createdAt).toLocaleDateString('pt-BR') : '--'}</strong><span>Publicação mais recente</span></div>
            </div>
        </aside>
      )}
    </main>
  )
}

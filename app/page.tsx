'use client'

import { useEffect, useState } from 'react'
import PostCard from '@/components/PostCard/PostCard'
import { postsService } from '@/services/posts.service'
import type { Post } from '@/types/post'
import './Home.css'

export default function Home() {
  const [search, setSearch] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true
    setIsLoading(true)
    setError('')

    const request = search.trim()
      ? postsService.search(search.trim())
      : postsService.list()

    request.then((data) => {
      if (isCurrent) setPosts(data)
    }).catch((requestError) => {
      if (isCurrent) setError(requestError instanceof Error ? requestError.message : 'Não foi possível carregar os posts.')
    }).finally(() => {
      if (isCurrent) setIsLoading(false)
    })

    return () => { isCurrent = false }
  }, [search])

  return (
    <main className="home-page">
      <section className="latest-posts">
        <div className="home-header">
          <div className="home-header-content">
            <div>
              <h1>Aprenda, ensine e repita</h1>

              <p>
                Explore posts, dicas e conteúdos úteis para evoluir no seu aprendizado.
              </p>
            </div>

            <div className="search-container">
              <input
                type="text"
                placeholder="Pesquisar posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        <div className="home-posts-list">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              excerpt={post.content.slice(0, 150)}
              date={new Date(post.createdAt).toLocaleDateString('pt-BR')}
              category="Post"
              author={post.user?.name}
            />
          ))}
        </div>

        {isLoading && <p className="no-results">Carregando posts...</p>}
        {!isLoading && error && <p className="no-results">{error}</p>}
        {!isLoading && !error && posts.length === 0 && <p className="no-results">Nenhum post encontrado.</p>}
      </section>

      <div className="purple-glow home-glow-one" />
      <div className="purple-glow home-glow-two" />
    </main>
  )
}
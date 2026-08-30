'use client'

import { useState } from 'react'
import PostCard from '@/components/PostCard/PostCard'
import './Home.css'

const posts = [
  {
    id: 1,
    title: 'How to improve your English vocabulary',
    excerpt:
      'Some useful tips and strategies to expand your vocabulary and learn new words every day.',
    date: 'Aug 28, 2026',
    category: 'English',
    image: 'https://i.ytimg.com/vi/Sa4Z91dn1eo/maxresdefault.jpg',
  },
  {
    id: 2,
    title: 'The importance of reading in English',
    excerpt:
      'Reading regularly can help you improve your vocabulary, grammar and comprehension skills.',
    date: 'Aug 25, 2026',
    category: 'Learning',
    image: 'https://i.ytimg.com/vi/Sa4Z91dn1eo/maxresdefault.jpg',
  },
  {
    id: 3,
    title: '5 common mistakes English learners make',
    excerpt:
      'Let’s take a look at some common mistakes and how you can avoid them.',
    date: 'Aug 21, 2026',
    category: 'Tips',
    image: 'https://i.ytimg.com/vi/Sa4Z91dn1eo/maxresdefault.jpg',
  },
  {
    id: 4,
    title: 'English vocabulary for traveling',
    excerpt:
      'Useful English words and expressions that you can use during your next trip.',
    date: 'Aug 18, 2026',
    category: 'Travel',
    image: 'https://i.ytimg.com/vi/Sa4Z91dn1eo/maxresdefault.jpg',
  },
  {
    id: 5,
    title: 'How to practice English every day',
    excerpt:
      'Simple habits that can help you practice English and improve your skills.',
    date: 'Aug 15, 2026',
    category: 'Practice',
    image: 'https://i.ytimg.com/vi/Sa4Z91dn1eo/maxresdefault.jpg',
  },
]

export default function Home() {
  const [search, setSearch] = useState('')

  const filteredPosts = posts.filter((post) => {
    const searchTerm = search.toLowerCase()

    return (
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.category.toLowerCase().includes(searchTerm)
    )
  })

  return (
    <main className="home-page">
      <section className="latest-posts">
        <div className="home-header">
          <div className="home-header-content">
            <div>
              <h1>Learn, Teach & Repeat</h1>

              <p>
                Explore posts, tips and useful content to help you improve your English.
              </p>
            </div>

            <div className="search-container">
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        <div className="home-posts-list">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              title={post.title}
              excerpt={post.excerpt}
              date={post.date}
              category={post.category}
              image={post.image}
            />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <p className="no-results">No posts found.</p>
        )}
      </section>

      <div className="purple-glow home-glow-one" />
      <div className="purple-glow home-glow-two" />
    </main>
  )
}
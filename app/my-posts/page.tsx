'use client'

import './MyPosts.css'
import PostCard from '@/components/PostCard/PostCard'


const posts = [
  {
    id: 1,
    title: 'How to improve your English vocabulary',
    excerpt:
      'Some useful tips and strategies to expand your vocabulary and learn new words every day.',
    date: 'Aug 28, 2026',
    category: 'English',
  },
  {
    id: 2,
    title: 'The importance of reading in English',
    excerpt:
      'Reading regularly can help you improve your vocabulary, grammar and comprehension skills.',
    date: 'Aug 25, 2026',
    category: 'Learning',
  },
  {
    id: 3,
    title: '5 common mistakes English learners make',
    excerpt:
      'Let’s take a look at some common mistakes and how you can avoid them.',
    date: 'Aug 21, 2026',
    category: 'Tips',
  },
  {
    id: 4,
    title: 'English vocabulary for traveling',
    excerpt:
      'Useful English words and expressions that you can use during your next trip.',
    date: 'Aug 18, 2026',
    category: 'Travel',
  },
]

export default function MyPosts() {
  return (
    <main className="my-posts-page">

      <section className="posts-section">

        <div className="posts-header">
          <span className="posts-label">TEACHER</span>

          <h1>My Posts</h1>

          <p>
            Share your knowledge, ideas and experiences with your students.
          </p>
        </div>

        <div className="posts-list">

          {posts.map((post) => (
            <PostCard
                key={post.id}
                title={post.title}
                excerpt={post.excerpt}
                date={post.date}
                category={post.category}
                image="https://i.ytimg.com/vi/Sa4Z91dn1eo/maxresdefault.jpg"
            />
            ))}

        </div>

      </section>



    </main>
  )
}


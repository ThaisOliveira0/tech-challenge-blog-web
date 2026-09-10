import Link from 'next/link'
import './PostCard.css'

type PostCardProps = {
  id?: number
  title: string
  excerpt: string
  date: string
  category: string
  author?: string
  image?: string
}

export default function PostCard({
  id,
  title,
  excerpt,
  date,
  category,
  author = 'Professor',
  image,
}: PostCardProps) {
  const postUrl = id ? `/posts/${id}` : '#'

  return (
    <Link className="post-card-link" href={postUrl} aria-label={`Abrir post: ${title}`}>
    <article className="post-card">
      <div
        className="post-card-image"
        style={image ? { backgroundImage: `url(${image})` } : undefined}
      >
        <span>{category}</span>
      </div>

      <h2 className="post-card-title">{title}</h2>

      <p className="post-card-body">{excerpt}</p>

      <p className="post-card-footer">
        Escrito por <span className="by-name">{author}</span> em{' '}
        <span className="date">{date}</span>
      </p>

    </article>
    </Link>
  )
}
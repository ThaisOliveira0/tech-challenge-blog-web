import './PostCard.css'

type PostCardProps = {
  title: string
  excerpt: string
  date: string
  category: string
  image: string
}

export default function PostCard({
  title,
  excerpt,
  date,
  category,
  image,
}: PostCardProps) {
  return (
    <article className="post-card">
      <div
        className="post-card-image"
        style={{ backgroundImage: `url(${image})` }}
      >
        <span>{category}</span>
      </div>

      <h2 className="post-card-title">{title}</h2>

      <p className="post-card-body">{excerpt}</p>

      <p className="post-card-footer">
        Written by <span className="by-name">Teacher</span> on{' '}
        <span className="date">{date}</span>
      </p>

      <button className="read-more">Read post →</button>
    </article>
  )
}
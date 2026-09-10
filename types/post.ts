export interface Post {
  id: number
  title: string
  content: string
  userId: number
  createdAt: string
  updatedAt: string
  user?: PostAuthor
}

export interface PostAuthor {
  id: number
  name: string
  email: string
  role: 'teacher' | 'student' | 'admin'
  createdAt?: string
  updatedAt?: string
}

export interface CreatePostData {
  title: string
  content: string
}

export interface UpdatePostData {
  title?: string
  content?: string
}

export interface Comment {
  id: number
  content: string
  userId: number
  postId: number
  createdAt: string
  updatedAt: string
  user?: PostAuthor
}

export interface CreateCommentData {
  content: string
}

export interface UpdateCommentData {
  content: string
}
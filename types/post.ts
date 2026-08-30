export interface Post {
  id: number
  title: string
  content: string
  userId: number
  createdAt: string
  updatedAt: string
}

export interface CreatePostData {
  title: string
  content: string
}

export interface UpdatePostData {
  title?: string
  content?: string
}
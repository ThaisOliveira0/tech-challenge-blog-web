import { apiFetch } from './api'
import type {
  Post,
  CreatePostData,
  UpdatePostData,
} from '@/types/post'

export const postsService = {
  async list() {
    return apiFetch<Post[]>('/posts')
  },

  async me() {
    return apiFetch<Post[]>('/posts/me')
  },

  async search(term: string) {
    return apiFetch<Post[]>(
      `/posts/search?q=${encodeURIComponent(term)}`
    )
  },

  async findById(id: string) {
    return apiFetch<Post>(`/posts/${id}`)
  },

  async create(data: CreatePostData) {
    return apiFetch<{ message: string; data: Post }>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async update(id: string, data: UpdatePostData) {
    return apiFetch<{ message: string; data: Post }>(
      `/posts/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    )
  },

  async delete(id: string) {
    return apiFetch<void>(`/posts/${id}`, {
      method: 'DELETE',
    })
  },
}
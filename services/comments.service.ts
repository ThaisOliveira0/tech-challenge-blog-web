import { apiFetch } from './api'
import type {
  Comment,
  CreateCommentData,
  UpdateCommentData,
} from '@/types/post'

type ApiData<T extends object> = T | { data: T }

function unwrap<T extends object>(response: ApiData<T>) {
  return 'data' in response ? response.data : response
}

export const commentsService = {
  async list(postId: string) {
    const response = await apiFetch<ApiData<Comment[]>>(`/posts/${postId}/comments`)
    return unwrap(response)
  },

  async create(postId: string, data: CreateCommentData) {
    const response = await apiFetch<ApiData<Comment>>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return unwrap(response)
  },

  async update(id: number, data: UpdateCommentData) {
    const response = await apiFetch<ApiData<Comment>>(`/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return unwrap(response)
  },

  async delete(id: number) {
    return apiFetch<void>(`/comments/${id}`, { method: 'DELETE' })
  },
}
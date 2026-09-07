import { apiFetch } from './api'
import type {
  Post,
  CreatePostData,
  UpdatePostData,
} from '@/types/post'

type ApiData<T extends object> = T | { data: T }

function unwrap<T extends object>(response: ApiData<T>) {
  return 'data' in response ? response.data : response
}

export const postsService = {
  async list() {
    const response = await apiFetch<ApiData<Post[]>>('/posts')
    return unwrap(response)
  },

  async me() {
    const response = await apiFetch<ApiData<Post[]>>('/posts/me')
    return unwrap(response)
  },

  async search(term: string) {
    const response = await apiFetch<ApiData<Post[]>>(
      `/posts/search?q=${encodeURIComponent(term)}`
    )
    return unwrap(response)
  },

  async findById(id: string) {
    const response = await apiFetch<ApiData<Post>>(`/posts/${id}`)
    return unwrap(response)
  },

  async create(data: CreatePostData) {
    const response = await apiFetch<ApiData<Post>>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return unwrap(response)
  },

  async update(id: string, data: UpdatePostData) {
    const response = await apiFetch<ApiData<Post>>(
      `/posts/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    )
    return unwrap(response)
  },

  async delete(id: string) {
    return apiFetch<void>(`/posts/${id}`, {
      method: 'DELETE',
    })
  },
}
import { apiFetch } from './api'
import type {
  RegisterData,
  LoginData,
  RegisterResponse,
  LoginResponse,
} from '@/types/auth'

export const authService = {
  async register(data: RegisterData) {
    return apiFetch<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async login(data: LoginData) {
    return apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}
import { apiFetch } from './api'
import type { TeacherDashboard } from '@/types/dashboard'

export const teachersService = {
  async dashboard() {
    const response = await apiFetch<{ data: TeacherDashboard } | TeacherDashboard>('/teachers/me/dashboard')
    return 'data' in response ? response.data : response
  },
}
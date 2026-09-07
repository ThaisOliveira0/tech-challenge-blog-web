import type { User } from './auth'

export interface TeacherDashboard {
  user: User
  metrics: {
    postsCount: number
    commentsCount: number
    latestPostAt: string | null
  }
}
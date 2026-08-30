export interface User {
  id: number
  name: string
  email: string
  role: 'teacher' | 'student'
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role: 'teacher' | 'student'
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterResponse {
  message: string
  data: {
    user: User
  }
}

export interface LoginResponse {
  message: string
  data: {
    user: User
    token: string
  }
}
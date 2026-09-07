const API_URL = process.env.NEXT_PUBLIC_API_URL

const errorMessages: Record<string, string> = {
  'Invalid credentials': 'E-mail ou senha inválidos.',
  'Invalid credentials.': 'E-mail ou senha inválidos.',
  'User already exists': 'Este e-mail já está cadastrado.',
  'User already exists.': 'Este e-mail já está cadastrado.',
  'Something went wrong': 'Algo deu errado. Tente novamente.',
  'Unauthorized': 'Você precisa estar autenticado para continuar.',
  'Unauthenticated': 'Sua sessão expirou. Entre novamente.',
  'Forbidden': 'Você não tem permissão para realizar esta ação.',
  'Not found': 'O recurso solicitado não foi encontrado.',
}

export function translateApiError(message?: string) {
  if (!message) return 'Não foi possível concluir a operação.'
  if (errorMessages[message]) return errorMessages[message]

  const normalizedMessage = message.toLowerCase()
  if (normalizedMessage.includes('only teachers')) return 'Apenas professores podem realizar esta ação.'
  if (normalizedMessage.includes('only edit your own') || normalizedMessage.includes('only delete your own')) return 'Você só pode alterar ou excluir seus próprios posts.'
  if (normalizedMessage.includes('comment') && normalizedMessage.includes('own')) return 'Você só pode alterar ou excluir seus próprios comentários.'
  if (normalizedMessage.includes('unauthorized') || normalizedMessage.includes('forbidden')) return 'Você não tem permissão para realizar esta ação.'
  if (normalizedMessage.includes('not found')) return 'O recurso solicitado não foi encontrado.'

  return message
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = typeof window !== 'undefined'
    ? window.localStorage.getItem('blog-token')
    : null

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(translateApiError(data?.message))
  }

  return data
}
import { api } from '@/lib/axios'
import type { ApiResponse, AuthResponse } from '@/shared/types'

interface LoginPayload {
	dni: string
	password: string
}

export const loginService = (payload: LoginPayload) =>
	api.post<ApiResponse<AuthResponse>>('/auth/login', payload).then((res) => res.data.data)

import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store'
import { loginService } from '../services/authService'
import type { ApiResponse, Role } from '@/shared/types'
import { AxiosError, isAxiosError } from 'axios'
import { toast } from '@heroui/react'

const ROLE_REDIRECT: Record<Role, string> = {
	ADMIN: '/',
	ENTRENADOR: '/',
	SOCIO: '/',
	RECEPCIONISTA: '/',
}

export const useLogin = () => {
	const navigate = useNavigate()
	const login = useAuthStore((state) => state.login)

	return useMutation({
		mutationFn: loginService,

		onSuccess: (data) => {
			const { token, ...user } = data

			login(user, token)

			navigate(ROLE_REDIRECT[user.role] ?? '/')
		},
		onError: (error) => {
			if (!isAxiosError(error)) return
			const axiosError = error as AxiosError<ApiResponse<null>>

			toast.danger('Error al iniciar sesion', {
				description: axiosError.response?.data.message,
			})
		},
	})
}

export const useLogout = () => {
	const navigate = useNavigate()
	const logout = useAuthStore((state) => state.logout)

	return () => {
		logout()
		navigate('/login')
	}
}

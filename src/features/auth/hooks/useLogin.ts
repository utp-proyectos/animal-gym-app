import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { loginService } from '../services/authService'
import type { Role } from '@/shared/types'

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

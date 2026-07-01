import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

import { config } from '@/config'

export const api = axios.create({
	baseURL: config.API_URL,
})

api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token

	if (token) config.headers.Authorization = `Bearer ${token}`

	return config
})

api.interceptors.response.use(
	(response) => response,
	(error) => {
		const requestUrl = error.config?.url ?? ''
		const isLoginRequest = requestUrl.includes('/auth/login')

		if (error.response?.status === 401 && !isLoginRequest) {
			useAuthStore.getState().logout()
			window.location.href = '/login'
		}

		return Promise.reject(error)
	},
)

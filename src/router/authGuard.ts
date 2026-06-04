import { redirect, type LoaderFunctionArgs } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore' // Tu tienda de Zustand
import type { Role } from '@/shared/types'

export const authGuard = async ({ request }: LoaderFunctionArgs, allowedRoles: Role[] = []) => {
	const { isAuthenticated, hasAnyRole } = useAuthStore.getState()

	const url = new URL(request.url)
	const pathname = url.pathname

	if (!isAuthenticated && pathname !== '/login') {
		return redirect('/login')
	}

	if (isAuthenticated && pathname === '/login') {
		return redirect('/')
	}

	if (isAuthenticated && allowedRoles.length > 0) {
		if (!hasAnyRole(allowedRoles)) {
			return redirect('/')
		}
	}

	return null
}

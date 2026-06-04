import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthResponse, Role } from '@/shared/types/auth'

type User = Omit<AuthResponse, 'token'>
interface AuthState {
	user: User | null
	token: string | null
	isAuthenticated: boolean
	login: (user: User, token: string) => void
	logout: () => void
	hasAnyRole: (requiredRoles: Role | Role[]) => boolean
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			token: null,
			isAuthenticated: false,

			login: (user, token) => set({ user, token, isAuthenticated: true }),

			logout: () => set({ user: null, token: null, isAuthenticated: false }),

			hasAnyRole: (requiredRoles) => {
				const { user } = get()
				const rolesToCheck = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
				return user?.role ? rolesToCheck.includes(user.role) : false
			},
		}),
		{
			name: 'auth-storage',
		},
	),
)

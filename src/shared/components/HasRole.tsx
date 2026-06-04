import { useAuthStore } from '@/store/authStore'
import type { Role } from '../types'

interface HasRoleProps {
	roles: Role | Role[]
	children: React.ReactNode
}

const HasRole = ({ roles, children }: HasRoleProps) => {
	const { hasAnyRole, isAuthenticated } = useAuthStore()

	if (isAuthenticated && hasAnyRole(roles)) {
		return children
	}

	return null
}

export default HasRole

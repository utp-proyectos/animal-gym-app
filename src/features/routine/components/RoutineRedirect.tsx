import { useAuthStore } from '@/store'
import { Navigate } from 'react-router-dom'
import { RoutinePage } from '../page/RoutinePage'

export default function RoutineRedirect() {
	const { user } = useAuthStore()

	if (user?.role === 'SOCIO' && user?.personId) {
		return <Navigate to={`/rutinas/partner/${user.personId}`} replace />
	}

	return <RoutinePage />
}

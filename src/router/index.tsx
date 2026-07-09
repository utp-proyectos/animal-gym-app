import LoginPage from '@/features/auth/pages/LoginPage'
import { BillPage } from '@/features/bill/page/BillPage'
import { EmployeePage } from '@/features/employee/page/EmployeePage'
import { ExercisePage } from '@/features/exercise/page/ExercisePage'
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { authGuard } from './authGuard'
import { SessionPage } from '@/features/session/page/SessionPage'
import { RoutinePage } from '@/features/routine/page/RoutinePage'
import { RoutineDetailPage } from '@/features/routine/page/RoutineDetailPage'
import { MembershipPage } from '@/features/membership/page/MembershipPage'
import { PartnerPage } from '@/features/partner/page/PartnerPage'

export const router = createBrowserRouter([
	{
		path: '/',
		element: <DashboardLayout />,
		loader: (args) => authGuard(args),
		children: [
			{
				index: true,
				element: <Navigate to="/clases" replace />,
			},
			{
				path: 'socios',
				Component: PartnerPage,
				loader: (args) => authGuard(args, ['ADMIN']),
			},
			{
				path: 'membresias',
				Component: MembershipPage,
			},
			{
				path: 'empleados',
				loader: (args) => authGuard(args, ['ADMIN']),
				Component: EmployeePage,
			},
			{
				path: 'rutinas',
				Component: RoutinePage,
			},
			{
				path: 'rutinas/partner/:partnerId',
				Component: RoutineDetailPage,
			},
			{
				path: 'clases',
				Component: SessionPage,
			},
			{
				path: 'ejercicios',
				Component: ExercisePage,
			},
			{
				path: 'boletas',
				loader: (args) => authGuard(args, ['ADMIN', 'SOCIO', 'RECEPCIONISTA']),
				Component: BillPage,
			},
		],
	},
	{
		path: '/login',
		Component: LoginPage,
		loader: (args) => authGuard(args),
	},
])

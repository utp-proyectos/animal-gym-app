import LoginPage from '@/features/auth/pages/LoginPage'
import { BillPage } from '@/features/bill/page/BillPage'
import { EmployeePage } from '@/features/employee/page/EmployeePage'
import { ExercisePage } from '@/features/exercise/page/ExercisePage'
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout'
import { createBrowserRouter } from 'react-router-dom'
import { authGuard } from './authGuard'
import { SessionPage } from '@/features/session/page/SessionPage'
import { RoutinePage } from '@/features/routine/page/RoutinePage'
import { RoutineDetailPage } from '@/features/routine/page/RoutineDetailPage'
import HasRole from '@/shared/components/auth/HasRole'
import { MembershipPage } from '@/features/membership/page/MembershipPage'
import { PartnerPage } from '@/features/partner/page/PartnerPage'


export const router = createBrowserRouter([
	{
		path: '/',
		element: <DashboardLayout />,
		loader: (args) => authGuard(args),
		children: [
			{
				path: 'socios',
				Component: PartnerPage,
			},
			{
				path: 'membresias',
				Component: MembershipPage,
			},
			{
				path: 'empleados',
				element: (
					<HasRole roles="ADMIN">
						<EmployeePage />
					</HasRole>
				),
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

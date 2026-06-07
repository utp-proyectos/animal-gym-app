import LoginPage from '@/features/auth/pages/LoginPage'
import { BillPage } from '@/features/bill/page/BillPage'
import { EmployeePage } from '@/features/employee/page/EmployeePage'
import { ExercisePage } from '@/features/exercise/page/ExercisePage'
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout'
import { createBrowserRouter } from 'react-router-dom'
import { authGuard } from './authGuard'

export const router = createBrowserRouter([
	{
		path: '/',
		element: <DashboardLayout />,
		loader: (args) => authGuard(args),
		children: [
			{
				path: 'socios',
				Component: EmployeePage,
			},
			{
				path: 'membresias',
				Component: EmployeePage,
			},
			{
				path: 'empleados',
				Component: EmployeePage,
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

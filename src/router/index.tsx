import LoginPage from '@/features/auth/pages/LoginPage'
import { BillPage } from '@/features/bill/page/BillPage'
import { EmployeePage } from '@/features/employee/page/EmployeePage'
import { ExercisePage } from '@/features/exercise/page/ExercisePage'
import { DashboardLayout } from '@/layout/DashboardLayout'
import { createBrowserRouter } from 'react-router-dom'
import { authGuard } from './authGuard'

const router = createBrowserRouter([
	{
		path: '/',
		element: <DashboardLayout />,
		loader: (args) => authGuard(args),
		children: [
			{
				path: 'socios',
				element: <EmployeePage />,
			},
			{
				path: 'membresias',
				element: <EmployeePage />,
			},
			{
				path: 'empleados',
				element: <EmployeePage />,
			},
			{
				path: 'ejercicios',
				element: <ExercisePage />,
			},
			{
				path: 'boletas',
				element: <BillPage />,
			},
		],
	},
	{
		path: '/login',
		Component: LoginPage,
		loader: (args) => authGuard(args),
	},
])

export default router

import { EmployeePage } from '@/features/employee/components/EmployeePage'
import { ExercisePage } from '@/features/exercise/page/ExercisePage'
import { DashboardLayout } from '@/layout/DashboardLayout'
import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
	{
		path: '/',
		element: <DashboardLayout />,
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
				element: <ExercisePage />,
			},
		],
	},
])

export default router

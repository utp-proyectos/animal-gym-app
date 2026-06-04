import { EmployeePage } from '@/features/employee/components/EmployeePage'
import { DashboardLayout } from '@/layout/DashboardLayout'
import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
	{
		path: '/',
		element: <DashboardLayout />,
		children: [
			{
				path: 'empleados',
				element: <EmployeePage />,
			},
		],
	},
])

export default router

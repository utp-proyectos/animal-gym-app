import App from '@/App'
import { EmployeePage } from '@/features/employee/components/EmployeePage'
import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
	},
	{
		path: '/empleados',
		element: <EmployeePage />,
	},
])

export default router

import type { EmployeeResponse } from '../EmployeeType'
import { EmployeeCard } from './EmployeeCard'
import { EmployeeFormModal } from './EmployeeFormModal'
export function EmployeePage() {
	const mockEmployees: EmployeeResponse[] = [
		{
			id: 1,
			firstName: 'Juan',
			lastName: 'Pérez',
			image: 'https://i.pravatar.cc/150?img=9',
			role: 'ADMIN',
		},
		{
			id: 2,
			firstName: 'María',
			lastName: 'López',
			image: 'https://i.pravatar.cc/150?img=5',
			role: 'ENTRENADOR',
		},
		{
			id: 3,
			firstName: 'Carlos',
			lastName: 'Ramos',
			image: 'https://i.pravatar.cc/150?img=30',
			role: 'RECEPCIONISTA',
		},
	]
	return (
		<div className="flex justify-center">
			<EmployeeFormModal />

			<EmployeeCard
				employees={mockEmployees}
				onEdit={(id) => console.log('editar', id)}
				onDelete={(id) => console.log('eliminar', id)}
				onChangePassword={(id) => console.log('contraseña', id)}
				onViewDetail={(id) => console.log('detalle', id)}
			/>
		</div>
	)
}

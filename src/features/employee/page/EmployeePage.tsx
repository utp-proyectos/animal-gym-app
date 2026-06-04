// src/pages/EmployeePage.tsx
import { Button, Card, Label, ListBox, SearchField, Select } from '@heroui/react'
import { Plus, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { EmployeeCard } from '../components/EmployeeCard'
import { EmployeeFormModal } from '../components/EmployeeFormModal'
import { EmployeeDetailModal } from '../components/EmployeeDetailModal'
import type { EmployeeResponse, EmployeeDetailResponse } from '../EmployeeType'

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

	const [openCreate, setOpenCreate] = useState(false)
	const [openDetail, setOpenDetail] = useState(false)
	const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDetailResponse | null>(null)

	const handleViewDetail = (id: number) => {
		setSelectedEmployee({
			id,
			dni: '12345678',
			firstName: 'Juan',
			lastName: 'Pérez',
			phoneNumber: '999888777',
			gender: 'MALE',
			email: 'juan@animalgym.com',
			birthDate: '1990-05-15',
			hireDate: '2024-01-10',
			image: 'https://i.pravatar.cc/150?img=9',
			salary: 2500,
			contractType: 'FULL_TIME',
			specialty: 'Emergencias',
			role: 'ADMIN',
		})
		setOpenDetail(true)
	}

	return (
		<div className="p-8 max-w-7xl mx-auto min-h-screen bg-white text-slate-900">
			<header className="flex justify-between items-end mb-10">
				<div>
					<h1 className="text-4xl font-black tracking-tight uppercase text-black">
						Gestión de empleados
					</h1>
					<p className="text-default-500 text-sm">Administra y organiza tus empleados</p>
				</div>
				<Button
					onPress={() => setOpenCreate(true)}
					className="bg-primary text-white font-semibold px-6 rounded-full shadow-lg shadow-primary/20"
				>
					<Plus size={20} className="mr-2" />
					Crear empleado
				</Button>
			</header>

			<div className="flex flex-col md:flex-row gap-8">
				<aside className="w-full md:w-72 flex flex-col gap-4">
					<Card className="p-6 border-none bg-default-50/50 rounded-3xl shadow-sm">
						<h3 className="font-bold text-lg mb-6 text-black">Filtrar empleados</h3>
						<div className="flex flex-col gap-7">
							<div className="flex flex-col gap-1">
								<SearchField name="Buscador">
									<Label>Buscador</Label>
									<SearchField.Group>
										<SearchField.SearchIcon />
										<SearchField.Input className="w-70]" placeholder="Search..." />
										<SearchField.ClearButton />
									</SearchField.Group>
								</SearchField>
							</div>
							<div className="flex flex-col gap-2">
								<label className="text-sm font-semibold text-slate-700 ml-1">Rol</label>
								<Select className="w-full" placeholder="Seleccionar rol">
									<Select.Trigger className="px-3 py-2 flex justify-between items-center">
										<Select.Value />
										<Select.Indicator />
									</Select.Trigger>
									<Select.Popover>
										<ListBox className="bg-white border border-default-200 shadow-xl">
											<ListBox.Item id="todos" textValue="Todos">
												Todos
											</ListBox.Item>
											<ListBox.Item id="admin" textValue="Admin">
												Admin
											</ListBox.Item>
											<ListBox.Item id="entrenador" textValue="Entrenador">
												Entrenador
											</ListBox.Item>
											<ListBox.Item id="recepcionista" textValue="Recepcionista">
												Recepcionista
											</ListBox.Item>
										</ListBox>
									</Select.Popover>
								</Select>
							</div>
							<Button className="w-full mt-2 font-medium bg-primary/10 text-primary">
								<RotateCcw size={18} className="mr-2" />
								Resetear filtros
							</Button>
						</div>
					</Card>
				</aside>

				<main className="flex-1">
					<EmployeeCard
						employees={mockEmployees}
						onEdit={(id) => console.log('editar', id)}
						onDelete={(id) => console.log('eliminar', id)}
						onChangePassword={(id) => console.log('contraseña', id)}
						onViewDetail={handleViewDetail}
					/>
				</main>
			</div>

			{openCreate && <EmployeeFormModal onClose={() => setOpenCreate(false)} />}
			{openDetail && (
				<EmployeeDetailModal
					employee={selectedEmployee}
					onClose={() => {
						setOpenDetail(false)
						setSelectedEmployee(null)
					}}
				/>
			)}
		</div>
	)
}

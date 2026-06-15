import { Button, Card, Modal, Skeleton, toast, type RangeValue } from '@heroui/react'
import { Plus, Frown, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { EmployeeCard } from '../components/EmployeeCard'
import { EmployeeDetailModal } from '../components/EmployeeDetailModal'
import { EmployeePasswordModal } from '../components/EmployeePasswordModal'
import { useEmployees, useDeleteEmployee } from '../hooks/useEmployees'
import CreateForm from '../components/CreateForm'
import EditForm from '../components/EditForm'
import type { EmployeeDetailResponse } from '../types'
import { DeleteModal } from '@/shared/components/ui/DeleteModal'
import { parseDate, type DateValue } from '@internationalized/date'
import { Filters } from '@/shared/components/ui/Filters'

interface ModalState {
	isOpen: boolean
	data: EmployeeDetailResponse | null
}

const CLOSED = { isOpen: false, data: null }

const ROLE_OPTIONS = ['Todos', 'ADMIN', 'ENTRENADOR', 'RECEPCIONISTA']

const INITIAL_FILTERS = {
	search: '',
	role: '',
	dateRange: null as RangeValue<DateValue> | null,
}

export function EmployeePage() {
	const { mutate: deleteEmployee } = useDeleteEmployee()
	const { data: employees = [], isLoading, error } = useEmployees()

	const [filters, setFilters] = useState(INITIAL_FILTERS)
	const [formModal, setFormModal] = useState<ModalState>(CLOSED)
	const [detailModal, setDetailModal] = useState<ModalState>(CLOSED)
	const [passwordModal, setPasswordModal] = useState<ModalState>(CLOSED)
	const [deleteModal, setDeleteModal] = useState<ModalState>(CLOSED)

	const isEditing = formModal.data !== null

	const filtered = employees.filter((emp) => {
		const matchSearch =
			filters.search === '' || emp.firstName.toLowerCase().includes(filters.search.toLowerCase())

		const matchRole =
			filters.role === '' ||
			filters.role === 'Todos' ||
			emp.role.toLowerCase() === filters.role.toLowerCase()

		const hireDate = emp.hireDate ? parseDate(emp.hireDate) : null
		const matchDate =
			!filters.dateRange ||
			!hireDate ||
			(hireDate >= filters.dateRange.start && hireDate <= filters.dateRange.end)

		return matchSearch && matchRole && matchDate
	})

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
					onPress={() => setFormModal({ isOpen: true, data: null })}
					className="bg-primary text-white font-semibold px-6 rounded-full shadow-lg shadow-primary/20"
				>
					<Plus size={20} className="mr-2" />
					Crear empleado
				</Button>
			</header>

			<div className="flex flex-col md:flex-row gap-8">
				<Filters title="Filtrar empleados" onReset={() => setFilters(INITIAL_FILTERS)}>
					<Filters.Search
						value={filters.search}
						placeholder="Buscar empleado..."
						onChange={(v) => setFilters((p) => ({ ...p, search: v }))}
					/>
					<Filters.Select
						label="Rol"
						value={filters.role}
						placeholder="Seleccionar rol"
						options={ROLE_OPTIONS}
						onChange={(v) => setFilters((p) => ({ ...p, role: v }))}
					/>
					<Filters.DateRange
						label="Fecha de ingreso"
						value={filters.dateRange}
						onChange={(v) => setFilters((p) => ({ ...p, dateRange: v }))}
					/>
				</Filters>

				<main className="flex-1">
					{isLoading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
							{Array.from({ length: 4 }).map((_, index) => (
								<Card
									key={index}
									className="p-0 border-none bg-white shadow-md overflow-hidden flex flex-col"
								>
									<div className="w-full aspect-4/3 relative">
										<Skeleton className="w-full h-full" animationType="shimmer" />
										<div className="absolute top-3 left-4">
											<Skeleton className="w-16 h-5 rounded-full" animationType="shimmer" />
										</div>
									</div>
									<div className="p-4 flex flex-col gap-3 flex-1 justify-between">
										<div className="flex justify-between items-start gap-2">
											<div className="flex flex-col gap-2 w-full">
												<Skeleton className="w-3/4 h-5 rounded-xl" animationType="shimmer" />
												<Skeleton className="w-1/2 h-3.5 rounded-lg" animationType="shimmer" />
											</div>
											<Skeleton className="w-8 h-8 rounded-full shrink-0" animationType="shimmer" />
										</div>
										<div>
											<div className="h-px w-full bg-default-100 mb-3" />
											<div className="flex items-center justify-between">
												<Skeleton className="w-28 h-8 rounded-xl" animationType="shimmer" />
											</div>
										</div>
									</div>
								</Card>
							))}
						</div>
					) : error ? (
						<div className="p-8 flex flex-col items-center justify-center gap-3 bg-danger-50 text-danger rounded-2xl border border-danger-100">
							<p className="font-semibold">Error al cargar los empleados</p>
							<Frown />
						</div>
					) : filtered.length === 0 ? (
						<div className="p-16 flex flex-col items-center justify-center gap-3 bg-default-50 text-default-400 rounded-3xl border border-dashed border-default-300">
							<Frown size={40} strokeWidth={1.5} />
							<p className="font-bold text-xl text-default-500">
								{employees.length === 0
									? 'No hay empleados registrados'
									: 'No se encontraron resultados'}
							</p>
							<p className="text-sm text-default-400">
								{employees.length === 0
									? 'Aún no se han creado empleados en la base de datos.'
									: 'Intenta con otros filtros o reinicia la búsqueda.'}
							</p>
						</div>
					) : (
						<EmployeeCard
							employees={filtered}
							onEdit={(employee) => setFormModal({ isOpen: true, data: employee })}
							onDelete={(employee) => setDeleteModal({ isOpen: true, data: employee })}
							onChangePassword={(employee) => setPasswordModal({ isOpen: true, data: employee })}
							onViewDetail={(employee) => setDetailModal({ isOpen: true, data: employee })}
						/>
					)}
				</main>
			</div>

			<Modal.Backdrop
				isOpen={formModal.isOpen}
				onOpenChange={(isOpen) => setFormModal({ isOpen, data: null })}
			>
				<Modal.Container size="cover">
					<Modal.Dialog>
						<Modal.CloseTrigger />
						<Modal.Header className="pb-4">
							<Modal.Heading className="text-4xl font-black tracking-tight uppercase text-black">
								{isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}
							</Modal.Heading>
							<p className="text-sm text-default-500">
								{isEditing
									? 'Modifica los campos necesarios para actualizar al empleado'
									: 'Completa la información para registrar un nuevo empleado.'}
							</p>
						</Modal.Header>
						<Modal.Body>
							{isEditing && formModal.data ? (
								<EditForm onClose={() => setFormModal(CLOSED)} employee={formModal.data} />
							) : (
								<CreateForm onClose={() => setFormModal(CLOSED)} />
							)}
						</Modal.Body>
						<Modal.Footer className="pt-4">
							<Button variant="secondary" slot="close">
								Cancelar
							</Button>
							<Button type="submit" form="form-modal-s">
								<UserPlus className="size-4" />
								Guardar empleado
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>

			<EmployeeDetailModal
				isOpen={detailModal.isOpen}
				onOpenChange={(open) => setDetailModal({ isOpen: open, data: null })}
				employee={detailModal.data}
			/>

			<EmployeePasswordModal
				isOpen={passwordModal.isOpen}
				onOpenChange={(open) => setPasswordModal({ isOpen: open, data: null })}
				employee={passwordModal.data}
			/>

			<DeleteModal
				isOpen={deleteModal.isOpen}
				onOpenChange={(open) => setDeleteModal({ isOpen: open, data: null })}
				title="Empleado"
				onConfirm={() => {
					if (deleteModal.data)
						deleteEmployee(deleteModal.data.id, {
							onSuccess: () => {
								toast.success(`Empleado eliminado`, {
									description: `El empleado ${deleteModal.data?.firstName} fue removido con exito`,
								})
								setDeleteModal(CLOSED)
							},
							onError: () => {
								toast.danger('Error al eliminar', {
									description: `No se pudo eliminar al empleado. Intentelo de nuevo`,
								})
							},
						})
				}}
			/>
		</div>
	)
}

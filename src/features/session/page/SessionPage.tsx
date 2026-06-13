import {
	Card,
	Input,
	Button,
	ListBox,
	Select,
	Skeleton,
	Label,
	useOverlayState,
	Modal,
} from '@heroui/react'
import { Plus, RotateCcw, Frown, UserPlus } from 'lucide-react'
import { SessionCard } from '../components/SessionCard'
import { useSessions } from '../hooks/useSessions'
import { useState } from 'react'
import CreateForm from '../components/CreateForm'
import EditForm from '../components/EditForm'
import type { SessionResponse } from '../types'

export function SessionPage() {
	const { data: sessions = [], isLoading, error } = useSessions()

	const modal = useOverlayState()
	const [currentSession, setCurrentSession] = useState<SessionResponse | null>(null)
	const isEditing = currentSession !== null

	const openCreateForm = () => {
		setCurrentSession(null)
		modal.open()
	}

	const handleEdit = (id: number) => {
		const sessionToEdit = sessions.find((session) => session.id === id)

		console.log('Editar sesión con ID:', sessionToEdit)

		if (sessionToEdit) {
			setCurrentSession(sessionToEdit)
			modal.open()
		}
	}

	const handleDelete = (id: number) => {
		console.log('Eliminar sesión con ID:', id)
	}

	const handleViewDetail = (id: number) => {
		console.log('Ver detalles de la sesión con ID:', id)
	}

	return (
		<div className="p-8 max-w-7xl mx-auto min-h-screen bg-white text-slate-900">
			{/* Header */}
			<header className="flex justify-between items-end mb-10">
				<div>
					<h1 className="text-4xl font-black tracking-tight uppercase text-black">
						Gestión de Clases
					</h1>
					<p className="text-default-500 text-sm">Administra y organiza tus sesiones deportivas</p>
				</div>
				<Button
					className="bg-primary text-white font-semibold px-6 rounded-full shadow-lg shadow-primary/20"
					onPress={openCreateForm}
				>
					<Plus size={20} className="mr-2" />
					Crear clase
				</Button>
			</header>

			<div className="flex flex-col md:flex-row gap-8">
				{/* Sidebar de Filtros */}
				<aside className="w-full md:w-72 flex flex-col gap-4">
					<Card className="p-6 border-none bg-default-50/50 rounded-3xl shadow-sm">
						<h3 className="font-bold text-lg mb-6 text-black">Filtrar clases</h3>

						<div className="flex flex-col gap-7">
							<div className="flex flex-col gap-1">
								<Label htmlFor="input-type-nombre">Nombre</Label>
								<Input id="input-type-nombre" placeholder="Ej. Yoga" />
							</div>

							{/* Selector de Estado */}
							<div className="flex flex-col gap-2">
								<label className="text-sm font-semibold text-slate-700 ml-1">Estado</label>
								<Select className="w-full" placeholder="Seleccionar uno" variant="secondary">
									<Select.Trigger className="px-3 py-2 flex justify-between items-center">
										<Select.Value />
										<Select.Indicator />
									</Select.Trigger>
									<Select.Popover>
										<ListBox className="bg-white border border-default-200 shadow-xl">
											<ListBox.Item id="todos" textValue="Todos">
												Todos
											</ListBox.Item>
											<ListBox.Item id="activo" textValue="Activo">
												Activo
											</ListBox.Item>
											<ListBox.Item id="cancelado" textValue="Cancelado">
												Cancelado
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

				{/* Contenedor Principal Dinámico */}
				<main className="flex-1">
					{isLoading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{Array.from({ length: 3 }).map((_, index) => (
								<Card
									key={index}
									className="p-0 border-none bg-white shadow-md overflow-hidden flex flex-col"
								>
									<div className="w-full aspect-video relative">
										<Skeleton className="w-full h-full" animationType="shimmer" />
									</div>
									<div className="p-6 flex flex-col gap-4 flex-1 justify-between">
										<div className="flex flex-col gap-2 w-full">
											<Skeleton className="w-3/4 h-6 rounded-xl" animationType="shimmer" />
											<Skeleton className="w-1/2 h-4 rounded-lg" animationType="shimmer" />
										</div>
										<div>
											<div className="h-px w-full bg-default-100 mb-3" />
											<div className="flex items-center justify-between">
												<Skeleton className="w-20 h-4 rounded-lg" animationType="shimmer" />
												<Skeleton className="w-24 h-8 rounded-xl" animationType="shimmer" />
											</div>
										</div>
									</div>
								</Card>
							))}
						</div>
					) : error ? (
						<div className="p-8 flex flex-col items-center justify-center gap-3 bg-danger-50 text-danger rounded-2xl border border-danger-100">
							<p className="font-semibold">Error al cargar las sesiones de clases</p>
							<Frown />
						</div>
					) : sessions.length === 0 ? (
						<div className="p-16 flex flex-col items-center justify-center gap-3 bg-default-50 text-default-400 rounded-3xl border border-dashed border-default-300">
							<Frown size={40} strokeWidth={1.5} />
							<p className="font-bold text-xl text-default-500">No hay clases registradas</p>
							<p className="text-sm text-default-400">
								Aún no se han creado clases en la base de datos.
							</p>
						</div>
					) : (
						<SessionCard
							sessions={sessions}
							onEdit={handleEdit}
							onDelete={handleDelete}
							onViewDetail={handleViewDetail}
						/>
					)}
				</main>
			</div>

			<Modal.Backdrop isOpen={modal.isOpen} onOpenChange={modal.setOpen}>
				<Modal.Container>
					<Modal.Dialog className="max-w-4xl">
						<Modal.CloseTrigger />

						<Modal.Header className="pb-4">
							<Modal.Heading className="text-4xl font-black tracking-tight uppercase text-black">
								{isEditing ? 'Editar Clase' : 'Nueva Clase'}
							</Modal.Heading>
							<p className="text-sm text-default-500">
								{isEditing
									? 'Modifica los campos necesarios para actualizar la clase.'
									: 'Completa la información para registrar una nueva clase.'}
							</p>
						</Modal.Header>

						<Modal.Body className="p-6">
							{isEditing ? (
								<EditForm item={currentSession} onClose={modal.close} />
							) : (
								<CreateForm onClose={modal.close} />
							)}
						</Modal.Body>

						<Modal.Footer className="pt-4">
							<Button variant="secondary" slot="close">
								Cancelar
							</Button>
							<Button type="submit" form="session-form">
								<UserPlus className="size-4" />
								Guardar clase
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</div>
	)
}

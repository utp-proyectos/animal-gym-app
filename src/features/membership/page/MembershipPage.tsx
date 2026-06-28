import { useState } from 'react'
import { Button, Card, Modal, Skeleton, toast } from '@heroui/react'
import { Plus, Save, Frown } from 'lucide-react'
import { useMemberships, useDeleteMembership } from '../hooks/useMemberships'
import { MembershipCard } from '../components/MembershipCard'
import { Filters } from '@/shared/components/ui/Filters'
import { DeleteModal } from '@/shared/components/ui/DeleteModal'
import CreateForm from '../components/CreateForm'
import EditForm from '../components/EditForm'
import type { MembershipReponse } from '../types'

// ── Modal state ────────────────────────────────────────────────────────────────

interface ModalState {
	isOpen: boolean
	data: MembershipReponse | null
}

const CLOSED: ModalState = { isOpen: false, data: null }

// ── Filtros ────────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = ['Todos', 'Activos', 'Inactivos']

const INITIAL_FILTERS = {
	search: '',
	status: '',
	maxPrice: 0, // 0 = sin filtro activo
}

// ── Página ─────────────────────────────────────────────────────────────────────

export function MembershipPage() {
	const { data: memberships = [], isLoading, error } = useMemberships()
	const { mutate: deleteMembership } = useDeleteMembership()

	const [filters, setFilters] = useState(INITIAL_FILTERS)
	const [formModal, setFormModal] = useState<ModalState>(CLOSED)
	const [deleteModal, setDeleteModal] = useState<ModalState>(CLOSED)

	const isEditing = formModal.data !== null

	// ── Lógica de filtrado (cliente) ───────────────────────────────────────────

	const filtered = memberships.filter((m) => {
		const matchSearch =
			filters.search === '' || m.name.toLowerCase().includes(filters.search.toLowerCase())

		const matchStatus =
			filters.status === '' ||
			filters.status === 'Todos' ||
			(filters.status === 'Activos' && m.status === true) ||
			(filters.status === 'Inactivos' && m.status === false)

		const matchPrice = filters.maxPrice === 0 || m.price <= filters.maxPrice

		return matchSearch && matchStatus && matchPrice
	})

	// ── Render ─────────────────────────────────────────────────────────────────

	return (
		<div className="p-8 max-w-7xl mx-auto min-h-screen bg-white text-slate-900">
			{/* Header */}
			<header className="flex justify-between items-end mb-10">
				<div>
					<h1 className="text-4xl font-black tracking-tight uppercase text-black">
						Gestión de Membresías
					</h1>
					<p className="text-default-500 text-sm">Administra los planes del gimnasio</p>
				</div>

				<Button
					onPress={() => setFormModal({ isOpen: true, data: null })}
					className="bg-primary text-white font-semibold px-6 rounded-full shadow-lg shadow-primary/20"
				>
					<Plus size={20} className="mr-2" />
					Nueva membresía
				</Button>
			</header>

			{/* Contenido principal */}
			<div className="flex flex-col md:flex-row gap-8">
				{/* Panel de filtros */}
				<Filters title="Filtrar membresías" onReset={() => setFilters(INITIAL_FILTERS)}>
					<Filters.Search
						value={filters.search}
						placeholder="Buscar membresía..."
						onChange={(v) => setFilters((p) => ({ ...p, search: v }))}
					/>
					<Filters.Select
						label="Estado"
						value={filters.status}
						placeholder="Seleccionar estado"
						options={STATUS_OPTIONS}
						onChange={(v) => setFilters((p) => ({ ...p, status: v }))}
					/>
					<Filters.Range
						label="Precio máximo"
						value={filters.maxPrice}
						min={0}
						max={500}
						step={10}
						onChange={(v) => setFilters((p) => ({ ...p, maxPrice: v }))}
					/>
				</Filters>

				{/* Grid de tarjetas */}
				<main className="flex-1">
					{/* Skeleton */}
					{isLoading && (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{Array.from({ length: 6 }).map((_, i) => (
								<Card
									key={i}
									className="overflow-hidden border border-gray-100 shadow-sm flex flex-col"
								>
									<div className="w-full aspect-video relative">
										<Skeleton className="w-full h-full" animationType="shimmer" />
										<div className="absolute top-3 left-3">
											<Skeleton className="w-14 h-5 rounded-full" animationType="shimmer" />
										</div>
										<div className="absolute top-3 right-3">
											<Skeleton className="w-8 h-8 rounded-full" animationType="shimmer" />
										</div>
									</div>
									<div className="p-5 flex flex-col gap-3 flex-1">
										<div className="flex flex-col gap-1.5">
											<Skeleton className="w-3/4 h-5 rounded-xl" animationType="shimmer" />
											<Skeleton className="w-1/3 h-3.5 rounded-lg" animationType="shimmer" />
										</div>
										<Skeleton className="w-full h-8 rounded-lg" animationType="shimmer" />
										<div className="h-px bg-default-100" />
										<Skeleton className="w-28 h-8 rounded-xl" animationType="shimmer" />
										<div className="h-px bg-default-100 mt-auto" />
										<div className="flex justify-between items-center">
											<Skeleton className="w-20 h-4 rounded-lg" animationType="shimmer" />
											<Skeleton className="w-16 h-4 rounded-lg" animationType="shimmer" />
										</div>
									</div>
								</Card>
							))}
						</div>
					)}

					{/* Error */}
					{!isLoading && error && (
						<div className="p-8 flex flex-col items-center justify-center gap-3 bg-danger-50 text-danger rounded-2xl border border-danger-100">
							<p className="font-semibold">Error al cargar las membresías</p>
							<Frown />
						</div>
					)}

					{/* Sin resultados */}
					{!isLoading && !error && filtered.length === 0 && (
						<div className="p-16 flex flex-col items-center justify-center gap-3 bg-default-50 text-default-400 rounded-3xl border border-dashed border-default-300">
							<Frown size={40} strokeWidth={1.5} />
							<p className="font-bold text-xl text-default-500">
								{memberships.length === 0
									? 'No hay membresías registradas'
									: 'No se encontraron resultados'}
							</p>
							<p className="text-sm text-default-400">
								{memberships.length === 0
									? 'Aún no se han creado membresías en la base de datos.'
									: 'Intenta con otros filtros o reinicia la búsqueda.'}
							</p>
						</div>
					)}

					{/* Grid */}
					{!isLoading && !error && filtered.length > 0 && (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{filtered.map((membership) => (
								<MembershipCard
									key={membership.id}
									membership={membership}
									onEdit={(m) => setFormModal({ isOpen: true, data: m })}
									onDelete={(m) => setDeleteModal({ isOpen: true, data: m })}
								/>
							))}
						</div>
					)}
				</main>
			</div>

			{/* Modal — formulario crear / editar */}
			<Modal.Backdrop
				isOpen={formModal.isOpen}
				onOpenChange={(isOpen) => setFormModal({ isOpen, data: null })}
			>
				<Modal.Container size="lg" scroll="inside" placement="center">
					<Modal.Dialog className="rounded-3xl w-full max-h-[88vh]">
						<Modal.CloseTrigger />

						<Modal.Header className="pb-4">
							<Modal.Heading className="text-4xl font-black tracking-tight uppercase text-black">
								{isEditing ? 'Editar Membresía' : 'Nueva Membresía'}
							</Modal.Heading>
							<p className="text-sm text-default-500">
								{isEditing
									? 'Modifica los campos necesarios para actualizar la membresía.'
									: 'Completa la información para registrar una nueva membresía.'}
							</p>
						</Modal.Header>

						<Modal.Body>
							{isEditing && formModal.data ? (
								<EditForm onClose={() => setFormModal(CLOSED)} membership={formModal.data} />
							) : (
								<CreateForm onClose={() => setFormModal(CLOSED)} />
							)}
						</Modal.Body>

						<Modal.Footer className="pt-4">
							<Button variant="secondary" slot="close">
								Cancelar
							</Button>
							<Button type="submit" form="membership-form">
								<Save className="size-4" />
								{isEditing ? 'Guardar cambios' : 'Crear membresía'}
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>

			{/* Modal — confirmar eliminación */}
			<DeleteModal
				isOpen={deleteModal.isOpen}
				onOpenChange={(open) => setDeleteModal({ isOpen: open, data: null })}
				title="membresía"
				onConfirm={() => {
					if (deleteModal.data)
						deleteMembership(deleteModal.data.id, {
							onSuccess: () => {
								toast.success('Membresía eliminada', {
									description: `La membresía "${deleteModal.data?.name}" fue eliminada con éxito.`,
								})
								setDeleteModal(CLOSED)
							},
							onError: () => {
								toast.danger('Error al eliminar', {
									description: 'No se pudo eliminar la membresía. Inténtalo de nuevo.',
								})
							},
						})
				}}
			/>
		</div>
	)
}

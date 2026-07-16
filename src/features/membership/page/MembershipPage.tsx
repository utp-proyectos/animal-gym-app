import { useMemo, useState } from 'react'
import { Button, Card, Modal, Skeleton, Spinner, toast } from '@heroui/react'
import { CalendarClock, Frown, IdCard, Plus, Save } from 'lucide-react'
import { useDeleteMembership, useMemberships, useMyMembership } from '../hooks/useMemberships'
import { MembershipCard } from '../components/MembershipCard'
import { Filters } from '@/shared/components/ui/Filters'
import { DeleteModal } from '@/shared/components/ui/DeleteModal'
import CreateForm from '../components/CreateForm'
import EditForm from '../components/EditForm'
import { MembershipAssignmentModal } from '../components/MembershipAssignmentModal'
import { MembershipPurchaseModal } from '../components/MembershipPurchaseModal'
import HasRole from '@/shared/components/auth/HasRole'
import type { MembershipReponse } from '../types'
import { useAuthStore } from '@/store/authStore'

interface ModalState {
	isOpen: boolean
	data: MembershipReponse | null
}

const CLOSED: ModalState = { isOpen: false, data: null }

interface MembershipFilterState {
	search: string
	status: 'Todos' | 'Activos' | 'Inactivos'
	availability: 'Todos' | 'Con cupos' | 'Cupo lleno'
	priceRange: [number, number] | null
	maxDuration: number | null
}

const INITIAL_FILTERS: MembershipFilterState = {
	search: '',
	status: 'Todos',
	availability: 'Todos',
	priceRange: null,
	maxDuration: null,
}

export function MembershipPage() {
	const { data: memberships = [], isLoading: isLoadingMemberships, error } = useMemberships()
	const { mutate: deleteMembership } = useDeleteMembership()
	const role = useAuthStore((state) => state.user?.role)
	const isPartner = role === 'SOCIO'
	const {
		data: currentMembership,
		isLoading: isLoadingCurrentMembership,
		isError: isCurrentMembershipError,
	} = useMyMembership(isPartner)

	const [filters, setFilters] = useState<MembershipFilterState>(INITIAL_FILTERS)
	const [formModal, setFormModal] = useState<ModalState>(CLOSED)
	const [deleteModal, setDeleteModal] = useState<ModalState>(CLOSED)
	const [assignmentModal, setAssignmentModal] = useState<ModalState>(CLOSED)
	const [purchaseModal, setPurchaseModal] = useState<ModalState>(CLOSED)
	const [isSaving, setIsSaving] = useState(false)

	const isEditing = formModal.data !== null
	const isLoading = isLoadingMemberships || (isPartner && isLoadingCurrentMembership)
	const priceLimit = useMemo(() => {
		const highestPrice = memberships.reduce((highest, membership) => {
			const effectivePrice =
				membership.active && membership.discountPrice !== null
					? membership.discountPrice
					: membership.price
			return Math.max(highest, effectivePrice)
		}, 0)
		return Math.max(10, Math.ceil(highestPrice / 10) * 10)
	}, [memberships])
	const durationLimit = useMemo(
		() => Math.max(1, ...memberships.map((membership) => membership.duration)),
		[memberships],
	)
	const priceRange = filters.priceRange ?? ([0, priceLimit] as [number, number])
	const maxDuration = filters.maxDuration ?? durationLimit

	const filtered = memberships.filter((membership) => {
		const query = filters.search.trim().toLowerCase()
		const matchSearch =
			query === '' ||
			membership.name.toLowerCase().includes(query) ||
			membership.description.toLowerCase().includes(query)
		const matchStatus =
			filters.status === 'Todos' ||
			(filters.status === 'Activos' && membership.status) ||
			(filters.status === 'Inactivos' && !membership.status)
		const hasCapacity = membership.enrolledMembers < membership.capacityLimit
		const matchAvailability =
			filters.availability === 'Todos' ||
			(filters.availability === 'Con cupos' && hasCapacity) ||
			(filters.availability === 'Cupo lleno' && !hasCapacity)
		const effectivePrice =
			membership.active && membership.discountPrice !== null
				? membership.discountPrice
				: membership.price
		const matchPrice = effectivePrice >= priceRange[0] && effectivePrice <= priceRange[1]
		const matchDuration = membership.duration <= maxDuration

		return matchSearch && matchStatus && matchAvailability && matchPrice && matchDuration
	})
	
	return (
		<div className="p-8 max-w-7xl mx-auto min-h-screen bg-white text-slate-900">
			{/* Header */}
			<header className="flex justify-between items-end mb-10">
				<div>
					<h1 className="text-4xl font-black tracking-tight uppercase text-black">Membresías</h1>
					<p className="text-default-500 text-sm">
						{isPartner
							? 'Compra, renueva o cambia tu plan del gimnasio'
							: 'Administra los planes y asignaciones del gimnasio'}
					</p>
				</div>

				<HasRole roles={['ADMIN', 'RECEPCIONISTA']}>
					<Button
						onPress={() => setFormModal({ isOpen: true, data: null })}
						className="bg-primary text-white font-semibold px-6 rounded-full shadow-lg shadow-primary/20"
					>
						<Plus size={20} className="mr-2" />
						Nueva membresía
					</Button>
				</HasRole>
			</header>

			{isPartner && !isLoadingCurrentMembership && currentMembership && (
				<div
					className={`mb-8 flex flex-col gap-3 rounded-3xl border p-5 sm:flex-row sm:items-center sm:justify-between ${
						currentMembership.active
							? 'border-primary/20 bg-primary/5'
							: 'border-warning/20 bg-warning/5'
					}`}
				>
					<div className="flex items-center gap-3">
						<div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
							<IdCard size={22} />
						</div>
						<div>
							<p className="text-xs font-bold uppercase tracking-wide text-default-500">
								{currentMembership.active ? 'Tu membresía actual' : 'Estado de tu membresía'}
							</p>
							<p className="text-lg font-black text-slate-900">
								{currentMembership.membershipName ?? 'Todavía no tienes una membresía'}
							</p>
						</div>
					</div>
					{currentMembership.expirationDate && (
						<div className="flex items-center gap-2 text-sm font-semibold text-default-600">
							<CalendarClock size={17} />
							{currentMembership.active
								? `${currentMembership.daysRemaining} días restantes`
								: 'La membresía está vencida'}
						</div>
					)}
				</div>
			)}

			{isPartner && isCurrentMembershipError && (
				<div className="mb-8 rounded-2xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">
					No se pudo obtener tu membresía actual. Vuelve a iniciar sesión o inténtalo nuevamente.
				</div>
			)}

			{/* Contenido principal */}
			<div className="flex flex-col md:flex-row gap-8">
				<Filters title={`Filtrar membresías (${filtered.length}/${memberships.length})`} onReset={() => setFilters(INITIAL_FILTERS)}>
					<Filters.Search
						value={filters.search}
						placeholder="Nombre o descripción..."
						onChange={(value) => setFilters((current) => ({ ...current, search: value }))}
					/>
					<Filters.Select
						label="Estado"
						value={filters.status}
						options={['Todos', 'Activos', 'Inactivos']}
						onChange={(value) =>
							setFilters((current) => ({
								...current,
								status: value as MembershipFilterState['status'],
							}))
						}
					/>
					<Filters.Select
						label="Disponibilidad"
						value={filters.availability}
						options={['Todos', 'Con cupos', 'Cupo lleno']}
						onChange={(value) =>
							setFilters((current) => ({
								...current,
								availability: value as MembershipFilterState['availability'],
							}))
						}
					/>
					<Filters.Range
						label={`Precio mínimo: S/ ${priceRange[0]}`}
						value={priceRange[0]}
						min={0}
						max={priceLimit}
						step={10}
						onChange={(value) =>
							setFilters((current) => ({
								...current,
								priceRange: [Math.min(value, priceRange[1]), priceRange[1]],
							}))
						}
					/>
					<Filters.Range
						label={`Precio máximo: S/ ${priceRange[1]}`}
						value={priceRange[1]}
						min={0}
						max={priceLimit}
						step={10}
						onChange={(value) =>
							setFilters((current) => ({
								...current,
								priceRange: [priceRange[0], Math.max(value, priceRange[0])],
							}))
						}
					/>
					<Filters.Range
						label={`Duración máxima: ${maxDuration} días`}
						value={maxDuration}
						min={1}
						max={durationLimit}
						step={1}
						onChange={(value) =>
							setFilters((current) => ({ ...current, maxDuration: value }))
						}
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
									className="p-0 overflow-hidden border-none shadow-md flex flex-col"
								>
									<div className="w-full aspect-video relative">
										<Skeleton className="w-full h-full" animationType="shimmer" />
										<div className="absolute top-3 left-3">
											<Skeleton className="w-14 h-5 rounded-full" animationType="shimmer" />
										</div>
									</div>
									<div className="p-5 flex flex-col gap-3 flex-1">
										<div className="flex items-start justify-between gap-2">
											<div className="flex flex-1 flex-col gap-1.5">
												<Skeleton className="w-3/4 h-5 rounded-xl" animationType="shimmer" />
												<Skeleton className="w-1/3 h-3.5 rounded-lg" animationType="shimmer" />
											</div>
											<Skeleton className="w-8 h-8 rounded-full" animationType="shimmer" />
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
									onAssign={(m) => setAssignmentModal({ isOpen: true, data: m })}
									onPurchase={(m) => setPurchaseModal({ isOpen: true, data: m })}
									currentMembership={isPartner ? currentMembership : null}
								/>
							))}
						</div>
					)}
				</main>
			</div>

			{/* Modal — formulario crear / editar */}
			<Modal.Backdrop
				isOpen={formModal.isOpen}
				onOpenChange={(isOpen) => {
					if (!isSaving) setFormModal({ isOpen, data: null })
				}}
			>
				<Modal.Container size="lg" scroll="inside" placement="center">
					<Modal.Dialog className="rounded-3xl w-full max-h-[88vh]">
						<Modal.CloseTrigger isDisabled={isSaving} />

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
								<EditForm
									onClose={() => setFormModal(CLOSED)}
									membership={formModal.data}
									onPendingChange={setIsSaving}
								/>
							) : (
								<CreateForm
									onClose={() => setFormModal(CLOSED)}
									onPendingChange={setIsSaving}
								/>
							)}
						</Modal.Body>

						<Modal.Footer className="pt-4">
							<Button variant="secondary" slot="close" isDisabled={isSaving}>
								Cancelar
							</Button>
							<Button
								type="submit"
								form="membership-form"
								isPending={isSaving}
								isDisabled={isSaving}
							>
								{({ isPending }) => (
									<>
										{isPending ? <Spinner color="current" size="sm" /> : <Save className="size-4" />}
										{isPending
											? 'Guardando...'
											: isEditing
												? 'Guardar cambios'
												: 'Crear membresía'}
									</>
								)}
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

			{assignmentModal.data && (
				<MembershipAssignmentModal
					isOpen={assignmentModal.isOpen}
					membership={assignmentModal.data}
					onClose={() => setAssignmentModal(CLOSED)}
				/>
			)}

			{purchaseModal.data && (
				<MembershipPurchaseModal
					isOpen={purchaseModal.isOpen}
					membership={purchaseModal.data}
					onClose={() => setPurchaseModal(CLOSED)}
				/>
			)}
		</div>
	)
}

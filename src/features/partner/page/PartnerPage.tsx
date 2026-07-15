import { useState } from 'react'
import {
	Button,
	Chip,
	Dropdown,
	Label,
	Modal,
	Separator,
	Spinner,
	Table,
	toast,
	type RangeValue,
} from '@heroui/react'
import {
	CalendarClock,
	Edit3,
	Eye,
	Frown,
	Loader2,
	MoreVertical,
	Plus,
	Save,
	Trash2,
	UserCircle2,
} from 'lucide-react'
import { parseDate } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'

import { useDeletePartner, usePartnerDetail, usePartners } from '../hooks/usePartners'
import { useMemberships } from '@/features/membership/hooks/useMemberships'
import type { PartnerResponse } from '../types'
import { Filters } from '@/shared/components/ui/Filters'
import { DeleteModal } from '@/shared/components/ui/DeleteModal'
import { PartnerDetailModal } from '../components/PartnerDetailModal'
import PartnerCreateForm from '../components/PartnerCreateForm'
import PartnerEditForm from '../components/PartnerEditForm'
import defaultImg from '@/assets/global/default.png'

interface ModalState {
	isOpen: boolean
	data: PartnerResponse | null
}

const CLOSED: ModalState = { isOpen: false, data: null }

const STATUS_OPTIONS = ['Todos', 'Activos', 'Inactivos']

const INITIAL_FILTERS = {
	search: '',
	status: '',
	membership: '',
	dateRange: null as RangeValue<DateValue> | null,
}

export function PartnerPage() {
	const { data: partners = [], isLoading, error } = usePartners()
	const { data: memberships = [] } = useMemberships()
	const { mutate: deletePartner } = useDeletePartner()

	const [filters, setFilters] = useState(INITIAL_FILTERS)
	const [formModal, setFormModal] = useState<ModalState>(CLOSED)
	const [deleteModal, setDeleteModal] = useState<ModalState>(CLOSED)
	const [detailModal, setDetailModal] = useState<ModalState>(CLOSED)

	const isEditing = formModal.data !== null

	const { data: partnerDetail, isLoading: isLoadingDetail } = usePartnerDetail(
		isEditing ? (formModal.data?.id ?? null) : null,
	)

	const membershipFilterOptions = ['Todas', ...memberships.map((m) => m.name)]

	const filtered = partners.filter((p) => {
		const lowerSearch = filters.search.toLowerCase()

		const matchSearch =
			filters.search === '' ||
			`${p.firstName} ${p.lastName}`.toLowerCase().includes(lowerSearch) ||
			p.dni.includes(filters.search)

		const matchStatus =
			filters.status === '' ||
			filters.status === 'Todos' ||
			(filters.status === 'Activos' && p.status === true) ||
			(filters.status === 'Inactivos' && p.status === false)

		const matchMembership =
			filters.membership === '' ||
			filters.membership === 'Todas' ||
			p.membershipName === filters.membership

		const itemDate = p.expirationDate ? parseDate(p.expirationDate) : null
		const matchDate =
			!filters.dateRange ||
			!itemDate ||
			(itemDate >= filters.dateRange.start && itemDate <= filters.dateRange.end)

		return matchSearch && matchStatus && matchMembership && matchDate
	})

	const getExpirationInfo = (partner: PartnerResponse) => {
		const today = new Date()
		const expDate = partner.expirationDate ? new Date(partner.expirationDate) : null
		const isExpired = expDate ? expDate < today : false
		const daysRemaining = expDate
			? Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
			: null
		const isExpiringSoon = daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 7
		return { expDate, isExpired, daysRemaining, isExpiringSoon }
	}

	return (
		<div className="p-8 max-w-7xl mx-auto min-h-screen bg-white text-slate-900">
			{/* Header */}
			<header className="flex justify-between items-end mb-10">
				<div>
					<h1 className="text-4xl font-black tracking-tight uppercase text-black">
						Gestión de Socios
					</h1>
					<p className="text-default-500 text-sm">Administra los miembros del gimnasio</p>
				</div>
				<Button
					onPress={() => setFormModal({ isOpen: true, data: null })}
					className="bg-primary text-white font-semibold px-6 rounded-full shadow-lg shadow-primary/20"
				>
					<Plus size={20} className="mr-2" />
					Nuevo socio
				</Button>
			</header>

			{/* Layout principal */}
			<div className="flex flex-col md:flex-row gap-8">
				{/* Panel de filtros */}
				<Filters title="Filtrar socios" onReset={() => setFilters(INITIAL_FILTERS)}>
					<Filters.Search
						value={filters.search}
						placeholder="Buscar por nombre o DNI..."
						onChange={(v) => setFilters((p) => ({ ...p, search: v }))}
					/>
					<Filters.Select
						label="Estado"
						value={filters.status}
						placeholder="Todos los estados"
						options={STATUS_OPTIONS}
						onChange={(v) => setFilters((p) => ({ ...p, status: v }))}
					/>
					<Filters.Select
						label="Membresía"
						value={filters.membership}
						placeholder="Todas las membresías"
						options={membershipFilterOptions}
						onChange={(v) => setFilters((p) => ({ ...p, membership: v }))}
					/>
					<Filters.DateRange
						label="Vencimiento"
						value={filters.dateRange}
						onChange={(v) => setFilters((p) => ({ ...p, dateRange: v }))}
					/>
				</Filters>

				{/* Tabla */}
				<main className="flex-1 overflow-hidden">
					<Table>
						<Table.ScrollContainer>
							<Table.Content aria-label="Tabla de socios" className="min-w-180">
								<Table.Header>
									<Table.Column isRowHeader aria-label="Foto" className="w-14" />
									<Table.Column isRowHeader>
										<span>Socio</span>
									</Table.Column>
									<Table.Column>
										<span>Membresía</span>
									</Table.Column>
									<Table.Column>
										<div className="flex items-center gap-2">
											<CalendarClock size={15} className="text-default-500" />
											<span>Vencimiento</span>
										</div>
									</Table.Column>
									<Table.Column>
										<span>Estado</span>
									</Table.Column>
									<Table.Column aria-label="Acciones">
										<div className="flex items-center justify-end pr-4">
											<span>Acciones</span>
										</div>
									</Table.Column>
								</Table.Header>

								<Table.Body
									renderEmptyState={() => (
										<div className="flex flex-col items-center justify-center h-48 gap-3 p-8">
											{isLoading ? (
												<div className="flex items-center gap-2 text-primary">
													<Loader2 className="animate-spin size-5" />
													<span className="text-sm">Cargando socios...</span>
												</div>
											) : error ? (
												<div className="flex flex-col items-center gap-2 text-danger">
													<Frown size={32} strokeWidth={1.5} />
													<p className="text-sm font-semibold">Error al cargar los socios</p>
												</div>
											) : partners.length === 0 ? (
												<div className="flex flex-col items-center gap-2 text-default-400">
													<Frown size={32} strokeWidth={1.5} />
													<p className="text-sm font-semibold">No hay socios registrados</p>
													<p className="text-xs">Crea el primer socio con el botón superior.</p>
												</div>
											) : (
												<div className="flex flex-col items-center gap-2 text-default-400">
													<Frown size={32} strokeWidth={1.5} />
													<p className="text-sm font-semibold">Sin resultados para los filtros</p>
													<p className="text-xs">
														Intenta con otros filtros o reinicia la búsqueda.
													</p>
												</div>
											)}
										</div>
									)}
								>
									{!isLoading &&
										!error &&
										filtered.map((partner) => {
											const { expDate, isExpired, daysRemaining, isExpiringSoon } =
												getExpirationInfo(partner)

											return (
												<Table.Row
													key={partner.id}
													className="hover:bg-slate-50/60 transition-colors border-b border-default-100 last:border-none"
												>
													{/* Avatar */}
													<Table.Cell>
														<div className="w-9 h-9 rounded-full overflow-hidden bg-default-100 border border-default-200 shrink-0 flex items-center justify-center">
															{partner.avatar ? (
																<img
																	src={partner.avatar}
																	alt={`${partner.firstName} ${partner.lastName}`}
																	className="w-full h-full object-cover"
																	onError={(e) => {
																		e.currentTarget.src = defaultImg
																	}}
																/>
															) : (
																<UserCircle2 size={22} className="text-default-300" />
															)}
														</div>
													</Table.Cell>

													{/* Nombre + DNI + email */}
													<Table.Cell>
														<div className="flex flex-col">
															<span className="font-bold text-slate-900 text-sm">
																{partner.firstName} {partner.lastName}
															</span>
															<span className="text-xs text-default-400 mt-0.5">
																DNI {partner.dni}
															</span>
															<span className="text-xs text-default-400 truncate max-w-44">
																{partner.email}
															</span>
														</div>
													</Table.Cell>

													{/* Membresía */}
													<Table.Cell>
														<Chip
															size="sm"
															variant="primary"
															className="text-[10px] font-semibold max-w-36 truncate"
														>
															{partner.membershipName ?? 'Sin membresía'}
														</Chip>
													</Table.Cell>

													{/* Vencimiento */}
													<Table.Cell>
														{expDate ? (
															<span
																className={`text-xs font-medium px-2 py-1 rounded-lg inline-block ${
																	isExpired
																		? 'bg-danger/10 text-danger'
																		: isExpiringSoon
																			? 'bg-warning/10 text-warning'
																			: 'bg-default-50 text-default-500'
																}`}
															>
																{isExpired
																	? `Vencido ${expDate.toLocaleDateString('es-PE')}`
																	: isExpiringSoon
																		? `Vence en ${daysRemaining}d`
																		: expDate.toLocaleDateString('es-PE')}
															</span>
														) : (
															<span className="text-xs text-default-300">—</span>
														)}
													</Table.Cell>

													{/* Estado */}
													<Table.Cell>
														<Chip
															size="sm"
															color={partner.status ? 'success' : 'default'}
															variant="primary"
															className="text-[10px] font-bold"
														>
															{partner.status ? 'Activo' : 'Inactivo'}
														</Chip>
													</Table.Cell>

													{/* Acciones */}
													<Table.Cell>
														<div className="flex items-center justify-end pr-4">
															<Dropdown>
																<Button
																	aria-label="Opciones del socio"
																	className="min-w-8 w-8 h-8 p-0 bg-transparent hover:bg-default-100 rounded-full border-none outline-none flex items-center justify-center"
																>
																	<MoreVertical
																		size={18}
																		className="text-black"
																		strokeWidth={2.5}
																	/>
																</Button>
																<Dropdown.Popover>
																	<Dropdown.Menu className="min-w-42 bg-white border border-default-100 shadow-xl rounded-2xl">
																		<Dropdown.Item
																			id="detail"
																			textValue="Ver perfil"
																			onPress={() =>
																				setDetailModal({ isOpen: true, data: partner })
																			}
																		>
																			<div className="flex items-center gap-2 py-1">
																				<Eye size={15} className="text-default-600" />
																				<Label className="font-semibold text-black cursor-pointer">
																					Ver perfil
																				</Label>
																			</div>
																		</Dropdown.Item>

																		<Separator />

																		<Dropdown.Item
																			id="edit"
																			textValue="Editar"
																			onPress={() => setFormModal({ isOpen: true, data: partner })}
																		>
																			<div className="flex items-center gap-2 py-1">
																				<Edit3 size={15} className="text-black" />
																				<Label className="font-semibold text-black cursor-pointer">
																					Editar
																				</Label>
																			</div>
																		</Dropdown.Item>

																		<Separator />

																		<Dropdown.Item
																			id="delete"
																			textValue="Eliminar"
																			className="text-danger"
																			onPress={() =>
																				setDeleteModal({ isOpen: true, data: partner })
																			}
																		>
																			<div className="flex items-center gap-2 py-1">
																				<Trash2 size={15} />
																				<Label className="font-semibold cursor-pointer">
																					Eliminar
																				</Label>
																			</div>
																		</Dropdown.Item>
																	</Dropdown.Menu>
																</Dropdown.Popover>
															</Dropdown>
														</div>
													</Table.Cell>
												</Table.Row>
											)
										})}
								</Table.Body>
							</Table.Content>
						</Table.ScrollContainer>
					</Table>
				</main>
			</div>

			<Modal.Backdrop
				isOpen={formModal.isOpen}
				onOpenChange={(isOpen) => setFormModal({ isOpen, data: null })}
			>
				<Modal.Container size="lg" scroll="inside" placement="center">
					<Modal.Dialog className="rounded-3xl w-full max-h-[88vh]">
						<Modal.CloseTrigger />

						<Modal.Header className="pb-4">
							<Modal.Heading className="text-4xl font-black tracking-tight uppercase text-black">
								{isEditing ? 'Editar Socio' : 'Nuevo Socio'}
							</Modal.Heading>
							<p className="text-sm text-default-500">
								{isEditing
									? `Modificando datos de ${formModal.data?.firstName} ${formModal.data?.lastName}`
									: 'Completa los datos para registrar un nuevo socio.'}
							</p>
						</Modal.Header>

						<Modal.Body>
							{isEditing ? (
								isLoadingDetail ? (
									<div className="flex flex-col items-center justify-center py-16 gap-3">
										<Spinner size="lg" />
										<p className="text-sm text-default-400">Cargando datos del socio...</p>
									</div>
								) : partnerDetail ? (
									<PartnerEditForm partner={partnerDetail} onClose={() => setFormModal(CLOSED)} />
								) : null
							) : (
								<PartnerCreateForm onClose={() => setFormModal(CLOSED)} />
							)}
						</Modal.Body>

						<Modal.Footer className="pt-4">
							<Button variant="secondary" slot="close">
								Cancelar
							</Button>
							<Button
								type="submit"
								form="partner-form"
								isDisabled={isEditing && (isLoadingDetail || !partnerDetail)}
							>
								<Save className="size-4" />
								{isEditing ? 'Guardar cambios' : 'Registrar socio'}
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>

			<PartnerDetailModal
				isOpen={detailModal.isOpen}
				onOpenChange={(open) => setDetailModal({ isOpen: open, data: null })}
				partner={detailModal.data}
			/>

			<DeleteModal
				isOpen={deleteModal.isOpen}
				onOpenChange={(open) => setDeleteModal({ isOpen: open, data: null })}
				title="socio"
				onConfirm={() => {
					if (!deleteModal.data) return
					deletePartner(deleteModal.data.id, {
						onSuccess: () => {
							toast.success('Socio eliminado', {
								description: `${deleteModal.data?.firstName} ${deleteModal.data?.lastName} fue eliminado del sistema.`,
							})
							setDeleteModal(CLOSED)
						},
						onError: () => {
							toast.danger('Error al eliminar', {
								description: 'No se pudo eliminar el socio. Inténtalo de nuevo.',
							})
						},
					})
				}}
			/>
		</div>
	)
}

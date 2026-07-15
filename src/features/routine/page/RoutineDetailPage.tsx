import {
	Button,
	Dropdown,
	Label,
	Modal,
	Separator,
	Spinner,
	Table,
	Tabs,
	toast,
} from '@heroui/react'
import { ArrowLeft, Edit3, MoreVertical, Plus, Trash2, UserPlus } from 'lucide-react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useGetPartnerRoutines } from '@/features/partner/hooks/usePartners'
import { useState } from 'react'
import CreateForm from '../components/CreateForm'
import { RoutineHistoryCarousel } from '../components/RoutineHistoryCarousel'
import { useRoutineCarousel } from '../hooks/useRoutineCarousel'
import type { DetailInfo, RoutineInfo } from '@/features/partner/types'
import EditForm from '../components/EditForm'
import { DeleteModal } from '@/shared/components/ui/DeleteModal'
import { useDeleteRoutine, useDeleteRoutineDetail } from '../hooks/useRoutines'
import CreateDetailForm from '../components/detailRoutine/CreateDetailForm'
import EditDetailForm from '../components/detailRoutine/EditDetailForm'
import HasRole from '@/shared/components/auth/HasRole'
import { useAuthStore } from '@/store'

interface RoutineModalState {
	isOpen: boolean
	data: RoutineInfo | null
}

interface DetailModalState {
	isOpen: boolean
	data: DetailInfo | null
}

export function RoutineDetailPage() {
	//Ruta para obtener el id del socio
	const { partnerId } = useParams<{ partnerId: string }>()
	const navigate = useNavigate()
	const id = partnerId ? Number(partnerId) : null

	const user = useAuthStore((state) => state.user)

	//Modales
	const [formModal, setFormModal] = useState<RoutineModalState>({
		isOpen: false,
		data: null,
	})

	const [deleteModal, setDeleteModal] = useState<RoutineModalState>({
		isOpen: false,
		data: null,
	})

	const [detailModal, setDetailModal] = useState<DetailModalState>({
		isOpen: false,
		data: null,
	})

	const [deleteDetailModal, setDeleteDetailModal] = useState<DetailModalState>({
		isOpen: false,
		data: null,
	})

	const isEditing = formModal.data !== null
	const isEditingDetail = detailModal.data !== null

	const { data: partner, isLoading, isError, error } = useGetPartnerRoutines(id)
	const { mutate: deleteRoutine } = useDeleteRoutine()
	const { mutate: deleteRoutineDetailMutate } = useDeleteRoutineDetail()

	// Necesario para el carousel
	const { activeId, currentActiveRoutine, setSelectedRoutineId, emblaRef, emblaApi } =
		useRoutineCarousel(partner?.routines)

	// Necesario para los dia de la semana
	const [selectedDay, setSelectedDay] = useState<string>('Lunes')

	const exercisesByDay =
		currentActiveRoutine?.routineDetails?.reduce<
			Record<string, typeof currentActiveRoutine.routineDetails>
		>((acc, detail) => {
			const day = detail.dayOfWeek
			if (!acc[day]) acc[day] = []
			acc[day].push(detail)
			return acc
		}, {}) || {}

	const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
	const activeDayExercises = exercisesByDay[selectedDay] || []

	if (isLoading) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center gap-2 bg-slate-50/50">
				<Spinner size="lg" color="accent" />
				<span className="text-default-500 text-sm font-medium">Cargando perfil del socio...</span>
			</div>
		)
	}

	if (isError || !partner) {
		if (user?.role === 'SOCIO') {
			return <Navigate to="/clases" replace />
		}

		return (
			<HasRole roles={['ADMIN', 'RECEPCIONISTA', 'ENTRENADOR']}>
				<div className="p-8 text-center bg-slate-50/50 min-h-screen flex flex-col items-center justify-center gap-4">
					<p className="text-danger font-medium">
						{error?.message || 'No se pudo encontrar la información del socio.'}
					</p>
					<Button variant="primary" onPress={() => navigate('/rutinas')}>
						Volver a la lista
					</Button>
				</div>
			</HasRole>
		)
	}

	return (
		<div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-50/50 text-slate-900 animate-in fade-in duration-200">
			{/* Botón para regresar */}
			<HasRole roles={['ADMIN', 'RECEPCIONISTA', 'ENTRENADOR']}>
				<Button variant="primary" className="mb-6" onPress={() => navigate('/rutinas')}>
					<ArrowLeft size={18} className="mr-2" />
					Volver a la lista
				</Button>
			</HasRole>

			{/* Heading */}
			<header className="flex justify-between items-center mb-10">
				<div>
					<h1 className="text-3xl font-black tracking-tight text-black">
						Rutinas del Socio (
						<span className="text-primary">
							{partner.firstName} {partner.lastName}
						</span>
						)
					</h1>
					<p className="text-default-500 text-sm mt-1">
						Visualiza el historial completo de entrenamientos asignados
					</p>
				</div>
				<HasRole roles={['ADMIN', 'RECEPCIONISTA', 'ENTRENADOR']}>
					<Button
						onPress={() =>
							setFormModal({
								isOpen: true,
								data: null,
							})
						}
					>
						<Plus size={20} className="mr-2" />
						Nueva Rutina
					</Button>
				</HasRole>
			</header>

			{/* Sección del Carousel */}
			<RoutineHistoryCarousel
				routines={partner.routines}
				activeId={activeId}
				onSelectRoutine={setSelectedRoutineId}
				emblaRef={emblaRef}
				emblaApi={emblaApi}
				onEditRoutine={(routine) => setFormModal({ isOpen: true, data: routine })}
				onDeleteRoutine={(routine) => setDeleteModal({ isOpen: true, data: routine })}
			/>

			{/* Sección Dinámica Inferior */}
			<div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
				{currentActiveRoutine ? (
					<div className="bg-white rounded-3xl p-6 md:p-8 border border-default-200 shadow-sm">
						<div className="border-b border-default-100 pb-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<div>
								<h3 className="text-2xl font-black text-black">
									Plan de Trabajo: {currentActiveRoutine.name}
								</h3>
								<p className="text-default-500 text-sm mt-1">
									Mostrando el desglose de días y ejercicios enfocados en:{' '}
									<strong className="text-slate-700">{currentActiveRoutine.goal}</strong>
								</p>
							</div>

							<HasRole roles={['ADMIN', 'RECEPCIONISTA', 'ENTRENADOR']}>
								<Button onPress={() => setDetailModal({ isOpen: true, data: null })}>
									<Plus size={20} className="mr-2" />
									Nuevo Detalle rutina
								</Button>
							</HasRole>
						</div>

						<Tabs
							className="w-full mb-8"
							selectedKey={selectedDay}
							onSelectionChange={(key) => setSelectedDay(key as string)}
						>
							<Tabs.ListContainer className="overflow-x-auto pb-2">
								<Tabs.List
									aria-label="Días de la semana"
									className="flex gap-3 grid-cols-2 sm:grid-cols-4 md:grid-cols-7 w-full h-auto bg-transparent p-0"
								>
									{diasSemana.map((dia) => {
										const hasExercises = (exercisesByDay[dia]?.length || 0) > 0

										return (
											<Tabs.Tab
												key={dia}
												id={dia}
												className={`p-4 cursor-pointer relative h-auto flex flex-col`}
											>
												<span>{dia}</span>

												{hasExercises ? (
													<span className="font-black">
														{[
															...new Set(exercisesByDay[dia].map((d) => d.exercise.muscleGroup)),
														].join(', ')}
													</span>
												) : (
													<span className="text-default-400 italic">Descanso</span>
												)}

												{/* Indicador nativo de HeroUI */}
												<Tabs.Indicator className="bg-gray-200 bottom-0" />
											</Tabs.Tab>
										)
									})}
								</Tabs.List>
							</Tabs.ListContainer>

							{/* Paneles de Contenido vinculados a cada día */}
							{diasSemana.map((dia) => (
								<Tabs.Panel key={dia} id={dia} className="animate-in fade-in duration-200 pt-2">
									<div className="flex items-center justify-between mb-4">
										<h4 className="text-lg font-black text-black flex items-center gap-2">
											Ejercicios del <span className="text-primary">{dia}</span>
											<span className="text-xs font-normal bg-default-100 text-default-600 px-2.5 py-0.5 rounded-full">
												{activeDayExercises.length} asignados
											</span>
										</h4>
									</div>

									{activeDayExercises.length > 0 ? (
										<Table aria-label="Tabla de ejercicios asignados">
											<Table.ScrollContainer aria-label="Contenedor de desplazamiento de ejercicios">
												<Table.Content className="min-w-150" aria-label="Contenido de ejercicios">
													<Table.Header>
														{/* Columna: Ejercicio */}
														<Table.Column isRowHeader>
															<div className="flex items-center gap-2">
																<span>Ejercicio</span>
															</div>
														</Table.Column>

														{/* Columna: Grupo Muscular */}
														<Table.Column>
															<div className="flex items-center gap-2">
																<span>Grupo Muscular</span>
															</div>
														</Table.Column>

														{/* Columna: Herramienta */}
														<Table.Column>
															<div className="flex items-center gap-2">
																<span>Equipo</span>
															</div>
														</Table.Column>

														{/* Columna: Series x Reps */}
														<Table.Column>
															<div className="flex items-center gap-2">
																<span>Series x Reps</span>
															</div>
														</Table.Column>

														{/* Columna: Peso base */}
														<Table.Column>
															<div className="flex items-center gap-2">
																<span>Peso base</span>
															</div>
														</Table.Column>

														{/* Columna: Calorias estimadas */}
														<Table.Column>
															<div className="flex items-center gap-2">
																<span>Calorias estimadas</span>
															</div>
														</Table.Column>

														{/* Columna: Descanso */}
														<Table.Column>
															<div className="flex items-center gap-2">
																<span>Descanso</span>
															</div>
														</Table.Column>
														{/* Acciones */}
														<HasRole roles={['ADMIN', 'RECEPCIONISTA', 'ENTRENADOR']}>
															<Table.Column aria-label="Acciones">
																<div className="flex items-center justify-end pr-4">
																	<span>Acciones</span>
																</div>
															</Table.Column>
														</HasRole>
													</Table.Header>

													<Table.Body>
														{activeDayExercises.map((detail) => (
															<Table.Row
																key={detail.id}
																className="hover:bg-slate-50/60 transition-colors border-b border-default-100 last:border-none"
															>
																{/* Nombre y descripción del Ejercicio */}
																<Table.Cell>
																	<div className="flex flex-col">
																		<span className="font-bold text-slate-900 text-base">
																			{detail.exercise.name}
																		</span>
																		<span
																			className="text-xs text-default-400 max-w-xs truncate mt-0.5"
																			title={detail.exercise.description}
																		>
																			{detail.exercise.description}
																		</span>
																	</div>
																</Table.Cell>

																{/* Grupo Muscular Badge */}
																<Table.Cell>
																	<span className="text-default-600">
																		{detail.exercise.muscleGroup}
																	</span>
																</Table.Cell>

																{/* Equipamiento */}
																<Table.Cell>
																	<span className="text-default-600 font-medium">
																		{detail.exercise.equipment}
																	</span>
																</Table.Cell>

																{/* Series x Repeticiones */}
																<Table.Cell>
																	<span className="font-black text-slate-800 text-base">
																		{detail.sets}{' '}
																		<span className="text-default-400 font-normal">x</span>{' '}
																		{detail.reps}
																	</span>
																</Table.Cell>

																{/* Peso Base Badge */}
																<Table.Cell>
																	<span className="bg-orange-50 text-orange-600 text-xs font-black px-2.5 py-1 rounded-lg inline-block">
																		{detail.weight} kg
																	</span>
																</Table.Cell>

																{/* Calorias estimadas */}
																<Table.Cell>
																	<span className="text-default-600">{detail.calories} klas</span>
																</Table.Cell>

																{/* Tiempo de Descanso */}
																<Table.Cell>
																	<span className="text-default-500 font-semibold">
																		{detail.restTime}min
																	</span>
																</Table.Cell>

																<HasRole roles={['ADMIN', 'RECEPCIONISTA', 'ENTRENADOR']}>
																	<Table.Cell>
																		<div className="flex items-center justify-center pr-2">
																			<Dropdown>
																				<Button
																					aria-label="Opciones de ejercicio"
																					className="min-w-8 w-8 h-8 p-0 bg-transparent hover:bg-default-100 rounded-full border-none outline-none flex items-center justify-center"
																				>
																					<MoreVertical
																						size={20}
																						className="text-black"
																						strokeWidth={3}
																					/>
																				</Button>

																				<Dropdown.Popover>
																					<Dropdown.Menu className="min-w-42.5 bg-white border border-default-100 shadow-xl rounded-2xl">
																						<Dropdown.Item
																							id="edit-detail"
																							textValue="Editar Ejercicio"
																							onPress={() => {
																								setDetailModal({
																									isOpen: true,
																									data: detail,
																								})
																							}}
																						>
																							<div className="flex items-center gap-2 py-1">
																								<Edit3 size={16} className="text-black" />
																								<Label className="font-semibold text-black cursor-pointer">
																									Editar
																								</Label>
																							</div>
																						</Dropdown.Item>

																						<Separator />

																						{/* Opción Eliminar Ejercicio */}
																						<Dropdown.Item
																							id="delete-detail"
																							textValue="Eliminar Ejercicio"
																							className="text-danger"
																							onPress={() => {
																								setDeleteDetailModal({
																									isOpen: true,
																									data: detail,
																								})
																							}}
																						>
																							<div className="flex items-center gap-2 py-1">
																								<Trash2 size={16} />
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
																</HasRole>
															</Table.Row>
														))}
													</Table.Body>
												</Table.Content>
											</Table.ScrollContainer>
										</Table>
									) : (
										<div className="border-2 border-dashed border-default-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-2 bg-slate-50/30">
											<span className="text-3xl">😴</span>
											<h5 className="font-bold text-slate-700 mt-2">
												¡Día de Recuperación Muscular!
											</h5>
											<p className="text-default-400 text-sm max-w-sm">
												No hay ejercicios asignados para este día en la rutina "
												{currentActiveRoutine.name}". Es crucial para el descanso del socio.
											</p>
										</div>
									)}
								</Tabs.Panel>
							))}
						</Tabs>
					</div>
				) : (
					partner.routines &&
					partner.routines.length > 0 && (
						<div className="text-center p-6 text-default-400 text-sm">
							Selecciona una rutina del deslizador superior para ver su cronograma.
						</div>
					)
				)}
			</div>

			<Modal.Backdrop
				isOpen={formModal.isOpen}
				onOpenChange={(isOpen) => setFormModal({ isOpen, data: null })}
			>
				<Modal.Container>
					<Modal.Dialog className="max-w-xl">
						<Modal.CloseTrigger />

						<Modal.Header className="pb-4">
							<Modal.Heading className="text-4xl font-black tracking-tight uppercase text-black">
								{isEditing ? 'Editar Rutina' : 'Nuevo Rutina'}
							</Modal.Heading>
							<p className="text-sm text-default-500">
								{isEditing
									? 'Modifica los campos necesarios para actualizar la rutina.'
									: 'Completa la información para registrar una nuevarutina.'}
							</p>
						</Modal.Header>

						<Modal.Body className="p-6">
							{isEditing && formModal.data ? (
								<EditForm
									item={formModal.data}
									onClose={() => setFormModal({ isOpen: false, data: null })}
								/>
							) : (
								<CreateForm onClose={() => setFormModal({ isOpen: false, data: null })} />
							)}
						</Modal.Body>

						<Modal.Footer className="pt-4">
							<Button variant="secondary" slot="close">
								Cancelar
							</Button>
							<Button type="submit" form="routine-form">
								<UserPlus className="size-4" />
								Guardar rutina
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>

			<DeleteModal
				isOpen={deleteModal.isOpen}
				onOpenChange={(open) => setDeleteModal({ isOpen: open, data: null })}
				title="Detalle rutina"
				onConfirm={() => {
					if (!deleteModal.data || !partnerId) return

					deleteRoutine(
						{ id: deleteModal.data.id, partnerId: Number(partnerId) },
						{
							onSuccess: () => {
								toast.success('Rutina eliminada', {
									description: `La rutina "${deleteModal.data?.name}" fue removida del socio con éxito.`,
								})
								setDeleteModal({ isOpen: false, data: null })
							},
							onError: () => {
								toast.danger('Error al eliminar', {
									description: `No se pudo eliminar la rutina asignada. Inténtalo de nuevo.`,
								})
							},
						},
					)
				}}
			/>

			<Modal.Backdrop
				isOpen={detailModal.isOpen}
				onOpenChange={(isOpen) => setDetailModal({ isOpen, data: null })}
			>
				<Modal.Container>
					<Modal.Dialog className="max-w-xl">
						<Modal.CloseTrigger />

						<Modal.Header className="pb-4">
							<Modal.Heading className="text-4xl font-black tracking-tight uppercase text-black">
								{isEditingDetail ? 'Editar detalle rutina' : 'Agregar Detalle rutina'}
							</Modal.Heading>
							<p className="text-sm text-default-500">
								{isEditingDetail
									? 'Modifica los parámetros del ejercicio (series, repeticiones, peso) asignado.'
									: 'Completa los datos para asignar un nuevo ejercicio a este plan de trabajo.'}
							</p>
						</Modal.Header>

						<Modal.Body className="p-6">
							{isEditingDetail && detailModal.data ? (
								<EditDetailForm
									item={detailModal.data}
									onClose={() => setDetailModal({ isOpen: false, data: null })}
									routineId={Number(activeId)}
								/>
							) : (
								<CreateDetailForm
									routineId={Number(activeId)}
									onClose={() => setDetailModal({ isOpen: false, data: null })}
								/>
							)}
						</Modal.Body>

						<Modal.Footer className="pt-4">
							<Button variant="secondary" slot="close">
								Cancelar
							</Button>

							<Button type="submit" form="routine-detail-form">
								<UserPlus className="size-4" />
								Guardar ejercicio
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>

			<DeleteModal
				isOpen={deleteDetailModal.isOpen}
				onOpenChange={(open) => setDeleteDetailModal({ isOpen: open, data: null })}
				title="Detalle rutina"
				onConfirm={() => {
					if (!deleteDetailModal.data || !partnerId) return

					deleteRoutineDetailMutate(
						{
							routineId: Number(activeId),
							detailId: deleteDetailModal.data.id,
							partnerId: Number(partnerId),
						},
						{
							onSuccess: () => {
								toast.success('Ejercicio eliminado', {
									description: 'El ejercicio fue removido de este día.',
								})
								setDeleteDetailModal({ isOpen: false, data: null })
							},
							onError: () => {
								toast.danger('Error al eliminar', {
									description: 'No se pudo eliminar el ejercicio.',
								})
							},
						},
					)
				}}
			/>
		</div>
	)
}

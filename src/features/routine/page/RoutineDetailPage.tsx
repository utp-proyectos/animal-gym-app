import { Button, Spinner, Table, Tabs } from '@heroui/react'
import { ArrowLeft, ChevronRight, Plus } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetPartnerRoutines } from '@/features/partner/hooks/usePartners'
import { useState, useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

export function RoutineDetailPage() {
	const { partnerId } = useParams<{ partnerId: string }>()
	const navigate = useNavigate()

	const id = partnerId ? Number(partnerId) : null
	const { data: partner, isLoading, isError, error } = useGetPartnerRoutines(id)

	const [selectedRoutineId, setSelectedRoutineId] = useState<number | null>(null)
	const [selectedDay, setSelectedDay] = useState<string>('Lunes')

	const [emblaRef, emblaApi] = useEmblaCarousel({
		align: 'center',
		skipSnaps: false,
		containScroll: false,
	})

	const currentActiveRoutine =
		partner?.routines?.find((r) => r.id === selectedRoutineId) ||
		partner?.routines?.[partner.routines.length - 1]

	const activeId = selectedRoutineId || currentActiveRoutine?.id || null

	useEffect(() => {
		if (emblaApi && partner?.routines && partner.routines.length > 0 && !selectedRoutineId) {
			const lastIndex = partner.routines.length - 1
			emblaApi.scrollTo(lastIndex, true)
		}
	}, [emblaApi, partner?.routines, selectedRoutineId])

	useEffect(() => {
		if (!emblaApi) return

		const handleSelect = () => {
			const routines = partner?.routines
			if (!routines) return
			const selectedIndex = emblaApi.selectedScrollSnap()
			const activeRoutine = routines[selectedIndex]
			if (activeRoutine) {
				setSelectedRoutineId(activeRoutine.id)
			}
		}

		emblaApi.on('select', handleSelect)
		emblaApi.on('reInit', handleSelect)

		return () => {
			emblaApi.off('select', handleSelect)
			emblaApi.off('reInit', handleSelect)
		}
	}, [emblaApi, partner])

	if (isLoading) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center gap-2 bg-slate-50/50">
				<Spinner size="lg" color="accent" />
				<span className="text-default-500 text-sm font-medium">Cargando perfil del socio...</span>
			</div>
		)
	}

	if (isError || !partner) {
		return (
			<div className="p-8 text-center bg-slate-50/50 min-h-screen flex flex-col items-center justify-center gap-4">
				<p className="text-danger font-medium">
					{error?.message || 'No se pudo encontrar la información del socio.'}
				</p>
				<Button variant="primary" onPress={() => navigate('/rutinas')}>
					Volver a la lista
				</Button>
			</div>
		)
	}

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

	return (
		<div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-50/50 text-slate-900 animate-in fade-in duration-200">
			{/* Botón para regresar */}
			<Button
				variant="primary"
				className="mb-6 text-default-500 font-medium hover:text-black"
				onPress={() => navigate('/rutinas')}
			>
				<ArrowLeft size={18} className="mr-2" />
				Volver a la lista
			</Button>

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
				<Button
					className="bg-primary text-white font-semibold px-6 rounded-full shadow-lg shadow-primary/20"
					onPress={() => console.log('Crear rutina para socio:', partner.id)}
				>
					<Plus size={20} className="mr-2" />
					Nueva Rutina
				</Button>
			</header>

			{/* Sección del Carousel */}
			<div className="mb-8">
				<h2 className="text-xl font-bold text-black mb-4 uppercase tracking-wider">
					Historial de Rutinas
				</h2>

				{partner.routines && partner.routines.length > 0 ? (
					<div className="overflow-hidden pb-6 pt-1" ref={emblaRef}>
						<div className="flex gap-5">
							{partner.routines.map((routine, idx) => {
								const isSelected = routine.id === activeId

								return (
									<div
										key={routine.id}
										className="flex-[0_0_92%] md:flex-[0_0_65%] lg:flex-[0_0_55%] min-w-0"
									>
										<div
											className={`w-full p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex justify-between items-center ${
												isSelected
													? 'bg-orange-50 border-orange-300 shadow-md shadow-orange-100/60 ring-2 ring-orange-400/20 scale-[1.01]'
													: 'bg-white border-default-200 shadow-sm hover:shadow-md opacity-60 scale-95'
											}`}
											onClick={() => {
												setSelectedRoutineId(routine.id)
												if (emblaApi) emblaApi.scrollTo(idx)
											}}
										>
											<div className="space-y-2 w-full pr-4">
												<div className="flex items-center gap-2">
													<h3 className="text-xl font-black text-slate-900 tracking-tight">
														Rutina: {routine.name}
													</h3>
													{isSelected && (
														<span className="text-[10px] font-bold bg-orange-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
															Seleccionada
														</span>
													)}
												</div>
												<p className="text-sm font-medium text-slate-700">
													<span className="font-bold text-slate-400">Vigencia:</span>{' '}
													{routine.startDate} — {routine.endDate}
												</p>
												<p className="text-sm text-slate-600 line-clamp-2">
													<span className="font-bold text-slate-400">Objetivo:</span> {routine.goal}
												</p>
											</div>
											<div
												className={`p-2 rounded-full transition-transform duration-300 ${isSelected ? 'text-orange-500 bg-orange-100 rotate-90' : 'text-slate-400'}`}
											>
												<ChevronRight size={20} strokeWidth={2.5} />
											</div>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				) : (
					<div className="bg-white border border-default-200 rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-2">
						<span className="text-default-400 text-sm font-medium">
							Este socio aún no cuenta con rutinas registradas.
						</span>
					</div>
				)}
			</div>

			{/* Sección Dinámica Inferior */}
			<div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
				{currentActiveRoutine ? (
					<div className="bg-white rounded-3xl p-6 md:p-8 border border-default-200 shadow-sm">
						<div className="border-b border-default-100 pb-4 mb-6">
							<h3 className="text-2xl font-black text-black">
								Plan de Trabajo: {currentActiveRoutine.name}
							</h3>
							<p className="text-default-500 text-sm mt-1">
								Mostrando el desglose de días y ejercicios enfocados en:{' '}
								<strong className="text-slate-700">{currentActiveRoutine.goal}</strong>
							</p>
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
											<Table.ScrollContainer>
												<Table.Content className="min-w-150">
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

														{/* Columna: Descanso */}
														<Table.Column>
															<div className="flex items-center gap-2">
																<span>Descanso</span>
															</div>
														</Table.Column>
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

																{/* Tiempo de Descanso */}
																<Table.Cell>
																	<span className="text-default-500 font-semibold">
																		{detail.restTime}s
																	</span>
																</Table.Cell>
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
		</div>
	)
}

import { ChevronRight, Edit3, MoreVertical, Trash2 } from 'lucide-react'
import type { UseEmblaCarouselType } from 'embla-carousel-react'
import { Button, Card, Chip, Dropdown, Label, Separator } from '@heroui/react'
import type { RoutineInfo } from '@/features/partner/types'

interface RoutineHistoryCarouselProps {
	routines: RoutineInfo[] | undefined
	activeId: number | null
	onSelectRoutine: (id: number) => void
	emblaRef: UseEmblaCarouselType[0]
	emblaApi: UseEmblaCarouselType[1]
	onEditRoutine: (routine: RoutineInfo) => void
	onDeleteRoutine: (routine: RoutineInfo) => void
}

export function RoutineHistoryCarousel({
	routines,
	activeId,
	onSelectRoutine,
	emblaRef,
	emblaApi,
	onEditRoutine,
	onDeleteRoutine,
}: RoutineHistoryCarouselProps) {
	return (
		<div className="mb-8">
			<h2 className="text-xl font-black text-black mb-4">Historial de Rutinas</h2>

			{routines && routines.length > 0 ? (
				<div className="overflow-hidden pb-6 pt-1" ref={emblaRef}>
					<div className="flex gap-5">
						{routines.map((routine, idx) => {
							const isSelected = routine.id === activeId

							return (
								<div
									key={routine.id}
									className="flex-[0_0_92%] md:flex-[0_0_65%] lg:flex-[0_0_55%] min-w-0"
								>
									<Card
										className={`w-full p-6 border transition-all duration-300 cursor-pointer flex-row items-center justify-between gap-4 ${
											isSelected
												? 'bg-red-50 border-red-300 shadow-md shadow-red-100/60 ring-2 ring-red-400/20 scale-[1.01]'
												: 'bg-white border-default-200 shadow-sm hover:shadow-md opacity-60 scale-95'
										}`}
										onClick={() => {
											onSelectRoutine(routine.id)
											if (emblaApi) emblaApi.scrollTo(idx)
										}}
									>
										<div className="space-y-2 w-full pr-2">
											<Card.Header className="p-0 flex flex-row items-center gap-2 flex-wrap">
												<Card.Title className="text-xl font-black text-slate-900 tracking-tight">
													Rutina: {routine.name}
												</Card.Title>
												{isSelected && (
													<Chip variant="primary" color="danger" className="font-semibold">
														SELECCIONADO
													</Chip>
												)}
											</Card.Header>

											<Card.Content className="p-0 space-y-1">
												<p className="text-sm font-medium text-slate-700">
													<span className="font-bold text-slate-400">Vigencia:</span>{' '}
													{routine.startDate} — {routine.endDate}
												</p>
												<p className="text-sm text-slate-600 line-clamp-2">
													<span className="font-bold text-slate-400">Objetivo:</span> {routine.goal}
												</p>
											</Card.Content>
										</div>

										{/* Acciones del Dropdown y Chevron lateral */}
										<div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
											<Dropdown>
												<Button
													aria-label="Opciones"
													className="min-w-8 w-8 h-8 p-0 bg-transparent hover:bg-default-100 rounded-full border-none outline-none flex items-center justify-center"
												>
													<MoreVertical size={20} className="text-black" strokeWidth={3} />
												</Button>

												<Dropdown.Popover>
													<Dropdown.Menu className="min-w-42.5 bg-white border border-default-100 shadow-xl rounded-2xl">
														{/* Opción Editar */}
														<Dropdown.Item
															id="edit"
															textValue="Editar"
															onPress={() => onEditRoutine(routine)}
														>
															<div className="flex items-center gap-2 py-1">
																<Edit3 size={16} className="text-black" />
																<Label className="font-semibold text-black cursor-pointer">
																	Editar
																</Label>
															</div>
														</Dropdown.Item>

														<Separator />

														{/* Opción Eliminar */}
														<Dropdown.Item
															id="delete"
															textValue="Eliminar"
															className="text-danger"
															onPress={() => onDeleteRoutine(routine)}
														>
															<div className="flex items-center gap-2 py-1">
																<Trash2 size={16} />
																<Label className="font-semibold cursor-pointer">Eliminar</Label>
															</div>
														</Dropdown.Item>
													</Dropdown.Menu>
												</Dropdown.Popover>
											</Dropdown>

											{/* Chevron Indicador visual */}
											<div
												className={`p-2 rounded-full transition-transform duration-300 ${
													isSelected ? 'text-red-500 bg-red-100 rotate-90' : 'text-slate-400'
												}`}
											>
												<ChevronRight size={20} strokeWidth={2.5} />
											</div>
										</div>
									</Card>
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
	)
}

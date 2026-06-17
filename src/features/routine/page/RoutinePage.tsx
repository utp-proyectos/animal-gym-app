import { Button, Table } from '@heroui/react'
import { CalendarDays, Eye, Loader2, Settings, Target, User } from 'lucide-react'
import { useGetAllPartnersWithRoutines } from '@/features/partner/hooks/usePartners'
import { useNavigate } from 'react-router-dom'

// interface ModalState {
// 	isOpen: boolean
// 	data: PartnerRoutinesResponse | null
// }

export function RoutinePage() {
	const { data: partners = [], isLoading, isError, error } = useGetAllPartnersWithRoutines()

	const navigate = useNavigate()

	// const [manageModal, setManageModal] = useState<ModalState>({
	// 	isOpen: false,
	// 	data: null,
	// })

	console.log(partners)

	return (
		<div className="p-8 max-w-7xl mx-auto min-h-screen bg-white text-slate-900">
			{/* Header */}
			<header className="flex justify-between items-end mb-10">
				<div>
					<h1 className="text-4xl font-black tracking-tight uppercase text-black">
						Asignación de Rutinas
					</h1>
					<p className="text-default-500 text-sm">
						Monitorea los objetivos y vigencia de entrenamiento de los socios
					</p>
				</div>
			</header>

			<div className="flex flex-col gap-8">
				<main className="flex-1 overflow-hidden">
					<Table>
						<Table.ScrollContainer>
							<Table.Content aria-label="Gestión de rutinas de socios" className="min-w-150">
								<Table.Header>
									{/* Columna: Socio */}
									<Table.Column isRowHeader>
										<div className="flex items-center gap-2">
											<User size={16} className="text-default-500" />
											<span>Socio</span>
										</div>
									</Table.Column>

									{/* Columna: Objetivo */}
									<Table.Column>
										<div className="flex items-center gap-2">
											<Target size={16} className="text-default-500" />
											<span>Objetivo</span>
										</div>
									</Table.Column>

									{/* Columna: Fecha Inicio */}
									<Table.Column>
										<div className="flex items-center gap-2">
											<CalendarDays size={16} className="text-default-500" />
											<span>Fecha Inicio</span>
										</div>
									</Table.Column>

									{/* Columna: Fecha Fin */}
									<Table.Column>
										<div className="flex items-center gap-2">
											<CalendarDays size={16} className="text-default-500" />
											<span>Fecha Fin</span>
										</div>
									</Table.Column>

									{/* Columna: Acciones */}
									<Table.Column>
										<div className="flex items-center gap-2 justify-end pr-4">
											<Settings size={16} className="text-default-500" />
											<span>Acciones</span>
										</div>
									</Table.Column>
								</Table.Header>

								<Table.Body
									renderEmptyState={() => (
										<div className="flex h-40 w-full flex-col items-center justify-center gap-2 text-center p-8">
											<span className="text-sm font-medium text-default-400">
												{isLoading ? (
													<div className="flex items-center gap-2 text-primary">
														<Loader2 className="animate-spin size-5" />
														Cargando socios y rutinas...
													</div>
												) : isError ? (
													<div className="text-danger">
														Error al cargar los datos: {error?.message || 'Error desconocido'}
													</div>
												) : (
													'No hay socios registrados en el sistema'
												)}
											</span>
										</div>
									)}
								>
									{!isLoading &&
										!isError &&
										partners.map((partner) => {
											// 💡 Obtenemos la rutina más reciente si el socio tiene una asignada
											const activeRoutine =
												partner.routines && partner.routines.length > 0
													? partner.routines[partner.routines.length - 1]
													: null

											return (
												<Table.Row key={partner.id}>
													{/* Nombre del Socio */}
													<Table.Cell>
														<div className="flex flex-col">
															<span className="font-bold text-black text-base">
																{partner.firstName} {partner.lastName}
															</span>
														</div>
													</Table.Cell>

													{/* Objetivo de la rutina */}
													<Table.Cell>
														{activeRoutine ? (
															<div className="flex flex-col">
																<span className="text-sm font-semibold text-slate-800">
																	{activeRoutine.name}
																</span>
																<span
																	className="text-xs text-default-500 truncate max-w-50"
																	title={activeRoutine.goal}
																>
																	{activeRoutine.goal}
																</span>
															</div>
														) : (
															<span className="text-xs font-medium px-2 py-1 bg-default-100 text-default-600 rounded-md">
																Sin rutina asignada
															</span>
														)}
													</Table.Cell>

													{/* Fecha de Inicio */}
													<Table.Cell>
														<span className="text-sm text-default-600">
															{activeRoutine ? activeRoutine.startDate : '—'}
														</span>
													</Table.Cell>

													{/* Fecha de Fin */}
													<Table.Cell>
														<span className="text-sm text-default-600">
															{activeRoutine ? activeRoutine.endDate : '—'}
														</span>
													</Table.Cell>

													{/* Botón de Acciones Rápido */}
													<Table.Cell>
														<div className="flex items-center justify-end pr-4">
															<Button
																aria-label="Ver o Gestionar Rutinas"
																className="min-w-8 w-8 h-8 p-0 bg-transparent hover:bg-default-100 rounded-full flex items-center justify-center text-slate-700"
																onPress={() => navigate(`/rutinas/${partner.id}`)}
															>
																<Eye size={18} />
															</Button>
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
		</div>
	)
}

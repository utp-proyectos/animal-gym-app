import { Button, Dropdown, Label, Separator, Table } from '@heroui/react'
import { Edit3, Loader2, MoreVertical, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ExcerciseFormModal } from '../components/ExcerciseFormModal'
import { useExercise } from '../hooks/useExercises'

export function ExercisePage() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	// const [setSelectedExercise] = useState<ExerciseResponse | null>(null)

	const { data: exercises = [], isLoading, isError, error } = useExercise()

	// Controladores de flujo para el Modal
	const handleCreateClick = () => {
		// setSelectedExercise(null)
		setIsModalOpen(true)
	}

	const handleEditClick = () => {
		// setSelectedExercise(exercise)
		setIsModalOpen(true)
	}

	const handleDeleteClick = (id: number) => {
		console.log('Ejercicio a eliminar:', id)
	}

	return (
		<div className="p-8 max-w-7xl mx-auto min-h-screen bg-white text-slate-900">
			{/* Header */}
			<header className="flex justify-between items-end mb-10">
				<div>
					<h1 className="text-4xl font-black tracking-tight uppercase text-black">
						Gestión de Ejercicios
					</h1>
					<p className="text-default-500 text-sm">
						Administra los ejercicios disponibles en el gimnasio
					</p>
				</div>
				<Button
					className="bg-primary text-white font-semibold px-6 rounded-full shadow-lg shadow-primary/20"
					onPress={handleCreateClick}
				>
					<Plus size={20} className="mr-2" />
					Crear ejercicio
				</Button>
			</header>

			<div className="flex flex-col md:flex-row gap-8">
				{/* Contenido de la Tabla */}
				<main className="flex-1 bg-white rounded-3xl shadow-sm border border-default-100 overflow-hidden">
					<Table variant="secondary">
						<Table.ScrollContainer>
							<Table.Content aria-label="Gestión de sesiones deportivas" className="min-w-150">
								<Table.Header>
									<Table.Column isRowHeader>Nombre</Table.Column>
									<Table.Column>Descripción</Table.Column>
									<Table.Column>Grupo muscular</Table.Column>
									<Table.Column>Equipo</Table.Column>
									<Table.Column>Acciones</Table.Column>
								</Table.Header>

								<Table.Body
									renderEmptyState={() => (
										<div className="flex h-40 w-full flex-col items-center justify-center gap-2 text-center p-8">
											<span className="text-sm font-medium text-default-400">
												{isLoading ? (
													<div className="flex items-center gap-2 text-primary">
														<Loader2 className="animate-spin size-5" />
														Cargando ejercicios...
													</div>
												) : isError ? (
													<div className="text-danger">
														Error al cargar los ejercicios: {error?.message || 'Error desconocido'}
													</div>
												) : (
													'No hay ejercicios registrados'
												)}
											</span>
										</div>
									)}
								>
									{/* Si no está cargando ni hay error, iteramos con un */}
									{!isLoading &&
										!isError &&
										exercises.map((exercise) => (
											<Table.Row key={exercise.id}>
												{/* Celda: Nombre */}
												<Table.Cell>
													<div className="flex flex-col">
														<span className="font-bold text-black text-base">{exercise.name}</span>
													</div>
												</Table.Cell>

												{/* Celda: Descripción */}
												<Table.Cell className="max-w-xs">
													<p
														className="text-default-600 text-sm truncate"
														title={exercise.description}
													>
														{exercise.description}
													</p>
												</Table.Cell>

												{/* Celda: Grupo muscular */}
												<Table.Cell>
													<p>{exercise.muscleGroup}</p>
												</Table.Cell>

												{/* Celda: Equipo */}
												<Table.Cell>
													<p>{exercise.equipment}</p>
												</Table.Cell>

												{/* Celda: Acciones (Dropdown) */}
												<Table.Cell className="text-right pr-4">
													<Dropdown>
														<Button
															aria-label="Opciones"
															className="min-w-8 w-8 h-8 p-0 bg-transparent hover:bg-default-100 rounded-full border-none outline-none flex items-center justify-center"
														>
															<MoreVertical size={20} className="text-black" strokeWidth={3} />
														</Button>
														<Dropdown.Popover>
															<Dropdown.Menu className="min-w-42.5 bg-white border border-default-100 shadow-xl rounded-2xl">
																{/* Opcion Editar */}
																<Dropdown.Item
																	id="edit"
																	textValue="Editar"
																	onPress={() => handleEditClick()}
																>
																	<div className="flex items-center gap-2 py-1">
																		<Edit3 size={16} className="text-black" />
																		<Label className="font-semibold text-black">Editar</Label>
																	</div>
																</Dropdown.Item>

																<Separator />

																{/* Opcion Eliminar */}
																<Dropdown.Item
																	id="delete"
																	textValue="Eliminar"
																	className="text-danger"
																	onPress={() => handleDeleteClick(exercise.id)}
																>
																	<div className="flex items-center gap-2 py-1">
																		<Trash2 size={16} />
																		<Label className="font-semibold">Eliminar</Label>
																	</div>
																</Dropdown.Item>
															</Dropdown.Menu>
														</Dropdown.Popover>
													</Dropdown>
												</Table.Cell>
											</Table.Row>
										))}
								</Table.Body>
							</Table.Content>
						</Table.ScrollContainer>
					</Table>
				</main>
			</div>

			{isModalOpen && <ExcerciseFormModal onClose={() => setIsModalOpen(false)} />}
		</div>
	)
}

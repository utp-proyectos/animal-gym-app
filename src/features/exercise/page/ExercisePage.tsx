import { Button, Dropdown, Label, Separator, Table } from '@heroui/react'
import type { ExerciseResponse } from '../types/exercise.response'
import { Edit3, MoreVertical, Plus, Trash2 } from 'lucide-react'

export function ExercisePage() {
	const exercises: ExerciseResponse[] = [
		{
			id: 1,
			name: 'HIIT Avanzado',
			description: 'Entrenamiento de alta intensidad',
			muscleGroup: 'Cardio',
			equipment: 'Máquina',
		},
		{
			id: 2,
			name: 'Pilates',
			description: 'ejercicio de pilates con ejercicios de core',
			muscleGroup: 'Core',
			equipment: 'Colchoneta',
		},
		{
			id: 3,
			name: 'Spinning',
			description: 'ejercicio de ciclismo indoor',
			muscleGroup: 'Cardio',
			equipment: 'Bicicleta estacionaria',
		},
		{
			id: 4,
			name: 'Zumba',
			description: 'ejercicio de baile fitness',
			muscleGroup: 'Cardio',
			equipment: 'Espacio abierto',
		},
		{
			id: 5,
			name: 'Crossfit',
			description: 'Entrenamiento funcional',
			muscleGroup: 'Funcional',
			equipment: 'Materiales',
		},
		{
			id: 6,
			name: 'Stretching',
			description: 'Estiramientos guiados',
			muscleGroup: 'Flexibilidad',
			equipment: 'Colchoneta',
		},
	]

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
				<Button className="bg-primary text-white font-semibold px-6 rounded-full shadow-lg shadow-primary/20">
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
									<Table.Column>Nombre</Table.Column>
									<Table.Column>Descripción</Table.Column>
									<Table.Column>Grupo muscular</Table.Column>
									<Table.Column>Equipo</Table.Column>
									<Table.Column>Acciones</Table.Column>
								</Table.Header>

								<Table.Body
									renderEmptyState={() => (
										<div className="flex h-40 w-full flex-col items-center justify-center gap-2 text-center p-8">
											<span className="text-sm font-medium text-default-400">
												No hay clases registradas
											</span>
										</div>
									)}
								>
									{exercises.map((exercise) => (
										<Table.Row key={exercise.id}>
											{/* Celda: Nombre e ID */}
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

											{/* Celda: Grupo musculaar */}
											<Table.Cell>
												<span className="inline-block bg-zinc-100 text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-zinc-200">
													{exercise.muscleGroup}
												</span>
											</Table.Cell>

											{/* Celda: Equipo */}
											<Table.Cell>
												<span className="inline-block bg-zinc-100 text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-zinc-200">
													{exercise.equipment}
												</span>
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
														<Dropdown.Menu
															// onAction={(key) => handleAction(String(key), employee.id)}
															className="min-w-42.5 bg-white border border-default-100 shadow-xl rounded-2xl"
														>
															<Dropdown.Item id="edit" textValue="Editar">
																<div className="flex items-center gap-2 py-1">
																	<Edit3 size={16} className="text-black" />
																	<Label className="font-semibold text-black">Editar</Label>
																</div>
															</Dropdown.Item>
															<Separator />
															<Dropdown.Item
																id="delete"
																textValue="Eliminar"
																className="text-danger"
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
		</div>
	)
}

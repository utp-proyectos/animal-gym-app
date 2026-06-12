import { Button, Dropdown, Label, Modal, Separator, Table, useOverlayState } from '@heroui/react'
import { Edit3, Loader2, MoreVertical, Plus, Trash2, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useExercise } from '../hooks/useExercises'
import type { ExerciseResponse } from '../types'
import EditForm from '../components/EditForm'
import CreateForm from '../components/CreateForm'
import { DeleteForm } from '../components/DeleteForm'

export function ExercisePage() {
	const modal = useOverlayState()
	const modalDelete = useOverlayState()
	const [currentExercise, setCurrentExercise] = useState<ExerciseResponse | null>(null)
	const isEditing = currentExercise !== null

	const { data: exercises = [], isLoading, isError, error } = useExercise()

	// Función para abrir en Modo Crear
	const openCreateForm = () => {
		setCurrentExercise(null)
		modal.open()
	}

	// Función para abrir en Modo Editar
	const openEditForm = (exercise: ExerciseResponse) => {
		setCurrentExercise(exercise)
		modal.open()
	}

	// Función para abrir Eliminar
	const openDeleteForm = (exercise: ExerciseResponse) => {
		setCurrentExercise(exercise)
		modalDelete.open()
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
					onPress={openCreateForm}
				>
					<Plus size={20} className="mr-2" />
					Crear ejercicio
				</Button>
			</header>

			<div className="flex flex-col md:flex-row gap-8">
				{/* Contenido de la Tabla */}
				<main className="flex-1 overflow-hidden">
					<Table>
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
																	onPress={() => openEditForm(exercise)}
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
																	onPress={() => openDeleteForm(exercise)}
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

			<Modal.Backdrop isOpen={modal.isOpen} onOpenChange={modal.setOpen}>
				<Modal.Container>
					<Modal.Dialog className="max-w-xl">
						<Modal.CloseTrigger />

						<Modal.Header className="pb-4">
							<Modal.Heading className="text-4xl font-black tracking-tight uppercase text-black">
								{isEditing ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
							</Modal.Heading>
							<p className="text-sm text-default-500">
								{isEditing
									? 'Modifica los campos necesarios para actualizar el ejercicio.'
									: 'Completa la información para registrar un nuevo ejercicio.'}
							</p>
						</Modal.Header>

						<Modal.Body className="p-6">
							{isEditing ? (
								<EditForm item={currentExercise!} onClose={modal.close} />
							) : (
								<CreateForm onClose={modal.close} />
							)}
						</Modal.Body>

						<Modal.Footer className="pt-4">
							<Button variant="secondary" slot="close">
								Cancelar
							</Button>
							<Button type="submit" form="exercise-form">
								<UserPlus className="size-4" />
								Guardar ejercicio
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>

			<DeleteForm
				exercise={currentExercise}
				isOpen={modalDelete.isOpen}
				onOpenChange={modalDelete.setOpen}
				onClose={modalDelete.close}
			/>
		</div>
	)
}

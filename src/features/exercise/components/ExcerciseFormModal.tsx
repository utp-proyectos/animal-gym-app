import { Button, Input, Label, Modal, Surface, TextField } from '@heroui/react'
import { UserPlus } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateExercise } from '../hooks/useExercises'
import z from 'zod'

interface Props {
	onClose: () => void
}

const exerciseSchema = z.object({
	name: z
		.string({ message: 'El nombre es requerido' })
		.min(1, 'El nombre es requerido')
		.min(3, 'El nombre debe tener al menos 3 caracteres'),
	description: z
		.string({ message: 'La descripción es requerida' })
		.min(1, 'La descripción es requerida'),
	muscleGroup: z
		.string({ message: 'El grupo muscular es requerido' })
		.min(1, 'El grupo muscular es requerido'),
	equipment: z
		.string({ message: 'El tipo de equipo es requerido' })
		.min(1, 'El tipo de equipo es requerido'),
})

export type ExerciseFormInput = z.input<typeof exerciseSchema>
export type ExerciseFormOutput = z.output<typeof exerciseSchema>

export function ExcerciseFormModal({ onClose }: Props) {
	const { control, handleSubmit } = useForm<ExerciseFormInput, unknown, ExerciseFormOutput>({
		resolver: zodResolver(exerciseSchema),
		defaultValues: {
			name: '',
			description: '',
			muscleGroup: '',
			equipment: '',
		},
	})

	const { mutate } = useCreateExercise()

	const onSubmit = (data: ExerciseFormOutput) => {
		mutate(data)
		onClose()
	}

	return (
		<Modal
			defaultOpen
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose()
			}}
		>
			<Modal.Backdrop>
				<Modal.Container>
					<Modal.Dialog className="sm:max-w-md">
						<Modal.CloseTrigger />

						<Modal.Header className="pb-4">
							<Modal.Heading className="text-4xl font-black tracking-tight uppercase text-black">
								Nuevo ejercicio
							</Modal.Heading>
							<p className="text-sm text-default-500">
								Completa la información para registrar un nuevo ejercicio.
							</p>
						</Modal.Header>

						<Modal.Body className="p-6">
							<Surface variant="default">
								<form
									id="exercise-form-modal"
									className="flex flex-col gap-4"
									onSubmit={handleSubmit(onSubmit)}
								>
									{/* Campo: Nombre */}
									<Controller
										name="name"
										control={control}
										render={({ field, fieldState: { error } }) => (
											<TextField className="w-full" variant="secondary" isInvalid={!!error}>
												<Label>Nombre</Label>
												<Input {...field} placeholder="Ej. Curl de bíceps" />
												{error && <p className="text-xs text-danger mt-1">{error.message}</p>}
											</TextField>
										)}
									/>

									{/* Campo: Descripción */}
									<Controller
										name="description"
										control={control}
										render={({ field, fieldState: { error } }) => (
											<TextField className="w-full" variant="secondary" isInvalid={!!error}>
												<Label>Descripción</Label>
												<Input {...field} placeholder="Ej. Ejercicio de fuerza" />
												{error && <p className="text-xs text-danger mt-1">{error.message}</p>}
											</TextField>
										)}
									/>

									{/* Campo: Grupo Muscular */}
									<Controller
										name="muscleGroup"
										control={control}
										render={({ field, fieldState: { error } }) => (
											<TextField className="w-full" variant="secondary" isInvalid={!!error}>
												<Label>Grupo muscular</Label>
												<Input {...field} placeholder="Ej. Bíceps" />
												{error && <p className="text-xs text-danger mt-1">{error.message}</p>}
											</TextField>
										)}
									/>

									{/* Campo: Equipo */}
									<Controller
										name="equipment"
										control={control}
										render={({ field, fieldState: { error } }) => (
											<TextField className="w-full" variant="secondary" isInvalid={!!error}>
												<Label>Equipo</Label>
												<Input {...field} placeholder="Ej. Mancuernas" />
												{error && <p className="text-xs text-danger mt-1">{error.message}</p>}
											</TextField>
										)}
									/>
								</form>
							</Surface>
						</Modal.Body>

						<Modal.Footer className="pt-4">
							<Button variant="secondary" slot="close">
								Cancelar
							</Button>
							<Button type="submit" form="exercise-form-modal">
								<UserPlus className="size-4" />
								Guardar ejercicio
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	)
}

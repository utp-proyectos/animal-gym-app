import { CustomSelect } from '@/shared/components/ui/CustomSelect'
import {
	Button,
	FieldError,
	Input,
	Label,
	Modal,
	Surface,
	TextArea,
	TextField,
} from '@heroui/react'
import { UserPlus } from 'lucide-react'
import z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { DateValue, Time } from '@internationalized/date'
import { CustomDateField } from '@/shared/components/ui/CustomDateField'
import { CustomTimeField } from '@/shared/components/ui/CustomTimeField'

interface Props {
	onClose: () => void
}

type IntensityOption = 'Baja' | 'Media' | 'Alta'

const sessionSchema = z.object({
	name: z
		.string({ message: 'El nombre de la clase es requerido' })
		.min(1, 'El nombre de la clase es requerido'),
	intensity: z.custom<IntensityOption | null>().refine((val) => val !== null, {
		message: 'Selecciona una intensidad para la clase',
	}),
	capacity: z.number({ message: 'La capacidad es requerida' }).min(1, 'El valor mínimo es 1'),
	description: z.string().optional(),
	goal: z.string().optional(),
	date: z
		.custom<DateValue | null>()
		.refine((val) => val !== null, {
			message: 'La fecha es requerida',
		})
		.transform((val) => val.toString()),
	startTime: z
		.custom<Time | null>()
		.refine((val) => val !== null, {
			message: 'La hora de inicio es requerida',
		})
		.transform((val) => val.toString()),
	endTime: z
		.custom<Time | null>()
		.refine((val) => val !== null, {
			message: 'La hora de fin es requerida',
		})
		.transform((val) => val.toString()),
})

export type SessionFormInput = z.input<typeof sessionSchema>
export type SessionFormOutput = z.output<typeof sessionSchema>

export function SessionFormModal({ onClose }: Props) {
	const INTENSITY_OPTIONS: IntensityOption[] = ['Baja', 'Media', 'Alta']

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<SessionFormInput, unknown, SessionFormOutput>({
		resolver: zodResolver(sessionSchema),
		defaultValues: {
			name: '',
			intensity: null,
			capacity: 0,
			description: '',
			goal: '',
			date: null,
			startTime: null,
			endTime: null,
		},
	})

	const onSubmit = (data: SessionFormOutput) => {
		console.log('Datos del formulario:', data)
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
					<Modal.Dialog className="max-w-4xl">
						<Modal.CloseTrigger />

						<Modal.Header className="pb-4">
							<Modal.Heading className="text-4xl font-black tracking-tight uppercase text-black">
								Nueva clase
							</Modal.Heading>
							<p className="text-sm text-default-500">
								Completa la información para registrar una nueva clase.
							</p>
						</Modal.Header>

						<Modal.Body className="p-6">
							<Surface variant="default">
								<form
									id="session-form-modal"
									className="flex flex-col gap-5"
									onSubmit={handleSubmit(onSubmit)}
								>
									{/* FILA 1 */}
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<TextField isInvalid={!!errors.name} variant="secondary">
											<Label>Nombre de la clase</Label>
											<Input {...register('name')} placeholder="Ej. Spinning Pro" />
											<FieldError>{errors.name?.message}</FieldError>
										</TextField>

										<Controller
											name="intensity"
											control={control}
											render={({ field, fieldState: { error } }) => (
												<>
													<CustomSelect
														label="Intensidad"
														placeholder="Selecciona intensidad"
														options={INTENSITY_OPTIONS}
														value={field.value}
														onChange={field.onChange}
														errorMessage={error?.message}
													/>
												</>
											)}
										></Controller>

										<TextField isInvalid={!!errors.capacity} variant="secondary">
											<Label>Capacidad</Label>
											<Input
												type="number"
												{...register('capacity', { valueAsNumber: true })}
												placeholder="Ej. 20"
											/>
											<FieldError>{errors.capacity?.message}</FieldError>
										</TextField>
									</div>

									{/* FILA 2 */}
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="w-full flex flex-col gap-1">
											<Label>Descripción</Label>
											<TextArea
												variant="secondary"
												{...register('description')}
												placeholder="Ej. Clase de spinning avanzada"
											/>
										</div>

										<div className="w-full flex flex-col gap-1">
											<Label>Objetivo</Label>
											<TextArea
												variant="secondary"
												{...register('goal')}
												placeholder="Ej. Mejorar resistencia cardiovascular"
											/>
										</div>
									</div>

									{/* FILA 3 */}
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<Controller
											name="date"
											control={control}
											render={({ field, fieldState: { error } }) => (
												<CustomDateField
													label="Fecha"
													value={field.value}
													onChange={field.onChange}
													errorMessage={error?.message}
												/>
											)}
										/>

										<Controller
											name="startTime"
											control={control}
											render={({ field, fieldState: { error } }) => (
												<CustomTimeField
													label="Hora Inicio"
													value={field.value}
													onChange={field.onChange}
													errorMessage={error?.message}
												/>
											)}
										/>

										<Controller
											name="endTime"
											control={control}
											render={({ field, fieldState: { error } }) => (
												<CustomTimeField
													label="Hora Fin"
													value={field.value}
													onChange={field.onChange}
													errorMessage={error?.message}
												/>
											)}
										/>
									</div>
								</form>
							</Surface>
						</Modal.Body>

						<Modal.Footer className="pt-4">
							<Button variant="secondary" slot="close">
								Cancelar
							</Button>
							<Button type="submit" form="session-form-modal">
								<UserPlus className="size-4" />
								Guardar clase
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	)
}

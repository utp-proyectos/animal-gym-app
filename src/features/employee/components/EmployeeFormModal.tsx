import {
	Button,
	DateField,
	Description,
	FieldError,
	Input,
	Label,
	Modal,
	TextField,
} from '@heroui/react'
import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CustomSelect } from '../../../components/CustomSelect'

const schema = z.object({
	dni: z.string().length(8, 'DNI debe tener exactamente 8 caracteres'),
	firstName: z.string().min(2, 'Mínimo 2 caracteres'),
	lastName: z.string().min(2, 'Mínimo 2 caracteres'),
	phoneNumber: z.string().min(9, 'Teléfono inválido'),
	email: z.string().email('Email inválido'),
	gender: z.string().min(1, 'Selecciona un género'),
	birthDate: z.string().min(1, 'Fecha requerida'),
	hireDate: z.string().min(1, 'Fecha requerida'),
	salary: z.number().positive('Debe ser mayor a 0'),
	contractType: z.string().min(1, 'Selecciona un tipo'),
	specialty: z.string().min(1, 'Selecciona una especialidad'),
	role: z.string().min(1, 'Selecciona un rol'),
	password: z.string().min(8, 'Mínimo 8 caracteres'),
})

type EmployeeFormSchema = z.infer<typeof schema>

interface Props {
	onClose: () => void
}

export function EmployeeFormModal({ onClose }: Props) {
	const GENDER_OPTIONS = ['Masculino', 'Femenino', 'Otro']
	const CONTRACT_OPTIONS = ['FULL_TIME', 'PART_TIME', 'TEMPORARY']
	const SPECIALTY_OPTIONS = ['Emergencias', 'Pediatría', 'Cardiología', 'General']
	const ROLE_OPTIONS = ['ADMIN', 'NURSE', 'DOCTOR']

	const [preview, setPreview] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<EmployeeFormSchema>({
		resolver: zodResolver(schema),
	})

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) setPreview(URL.createObjectURL(file))
	}

	const onSubmit = (data: EmployeeFormSchema) => {
		console.log(data)
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
					<Modal.Dialog className="sm:max-w-4xl max-h-[90vh]">
						<Modal.CloseTrigger />

						<Modal.Header className="pb-4">
							<Modal.Heading className="text-4xl font-black tracking-tight uppercase text-black">
								Nuevo empleado
							</Modal.Heading>
							<p className="text-sm text-default-500">
								Completa la información para registrar un nuevo empleado.
							</p>
						</Modal.Header>

						<Modal.Body className="overflow-y-auto py-4">
							<form className="space-y-8" id="form-modal-s" onSubmit={handleSubmit(onSubmit)}>
								{/* DATOS PERSONALES */}
								<section className="space-y-4">
									<h3 className="font-semibold text-lg">Datos personales</h3>

									<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
										<TextField isInvalid={!!errors.dni}>
											<Label>DNI</Label>
											<Input {...register('dni')} placeholder="12345678" variant="secondary" />
											<FieldError>{errors.dni?.message}</FieldError>
										</TextField>
										<TextField isInvalid={!!errors.firstName}>
											<Label>Nombre</Label>
											<Input {...register('firstName')} placeholder="Juan" variant="secondary" />
											<FieldError>{errors.firstName?.message}</FieldError>
										</TextField>
										<TextField isInvalid={!!errors.lastName}>
											<Label>Apellido</Label>
											<Input {...register('lastName')} placeholder="Pérez" variant="secondary" />
											<FieldError>{errors.lastName?.message}</FieldError>
										</TextField>
									</div>

									<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
										<TextField isInvalid={!!errors.phoneNumber}>
											<Label>Teléfono</Label>
											<Input
												{...register('phoneNumber')}
												placeholder="999888777"
												variant="secondary"
											/>
											<FieldError>{errors.phoneNumber?.message}</FieldError>
										</TextField>
										<TextField isInvalid={!!errors.email}>
											<Label>Email</Label>
											<Input
												{...register('email')}
												placeholder="juan@empresa.com"
												variant="secondary"
											/>
											<FieldError>{errors.email?.message}</FieldError>
										</TextField>
										<CustomSelect
											label="Género"
											placeholder="Selecciona género"
											options={GENDER_OPTIONS}
											isRequired
											{...register('gender')}
										/>
									</div>

									<div className="grid gap-4 md:grid-cols-2">
										<DateField
											className="w-full"
											name="birthDate"
											isRequired
											isInvalid={!!errors.birthDate}
										>
											<Label>Fecha de nacimiento</Label>
											<DateField.Group variant="secondary">
												<DateField.Input>
													{(segment) => <DateField.Segment segment={segment} />}
												</DateField.Input>
											</DateField.Group>
											<FieldError>{errors.birthDate?.message}</FieldError>
										</DateField>

										<div className="flex flex-col gap-2">
											<Label>Imagen</Label>
											<input
												type="file"
												accept="image/*"
												className="block w-full rounded-medium border border-default-200 px-3 py-2 text-sm"
												onChange={handleImageChange}
											/>
											{preview && (
												<div className="w-full h-40 rounded-xl overflow-hidden border border-default-200">
													<img src={preview} alt="preview" className="w-full h-full object-cover" />
												</div>
											)}
										</div>
									</div>
								</section>

								{/* DATOS LABORALES */}
								<section className="space-y-4 border-t pt-6">
									<h3 className="font-semibold text-lg">Datos laborales</h3>

									<div className="grid gap-4 md:grid-cols-2">
										<DateField
											className="w-full"
											name="hireDate"
											isRequired
											isInvalid={!!errors.hireDate}
										>
											<Label>Fecha de contratación</Label>
											<DateField.Group variant="secondary">
												<DateField.Input>
													{(segment) => <DateField.Segment segment={segment} />}
												</DateField.Input>
											</DateField.Group>
											<FieldError>{errors.hireDate?.message}</FieldError>
										</DateField>
										<TextField isInvalid={!!errors.salary}>
											<Label>Salario</Label>
											<Input
												{...register('salary')}
												placeholder="2500"
												variant="secondary"
												type="number"
											/>
											<FieldError>{errors.salary?.message}</FieldError>
										</TextField>
									</div>

									<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
										<CustomSelect
											label="Tipo de contrato"
											placeholder="Selecciona contrato"
											options={CONTRACT_OPTIONS}
											isRequired
											{...register('contractType')}
										/>
										<CustomSelect
											label="Especialidad"
											placeholder="Selecciona especialidad"
											options={SPECIALTY_OPTIONS}
											isRequired
											{...register('specialty')}
										/>
										<CustomSelect
											label="Rol"
											placeholder="Selecciona un rol"
											options={ROLE_OPTIONS}
											isRequired
											{...register('role')}
										/>
									</div>
								</section>

								{/* CREDENCIALES */}
								<section className="space-y-4 border-t pt-6">
									<h3 className="font-semibold text-lg">Credenciales</h3>
									<div className="grid gap-4 md:grid-cols-2">
										<TextField isInvalid={!!errors.password}>
											<Label>Contraseña</Label>
											<Input
												{...register('password')}
												type="password"
												placeholder="Mínimo 8 caracteres"
												variant="secondary"
												autoComplete="new-password"
											/>
											<Description>La contraseña debe tener al menos 8 caracteres.</Description>
											<FieldError>{errors.password?.message}</FieldError>
										</TextField>
									</div>
								</section>
							</form>
						</Modal.Body>

						<Modal.Footer className="pt-4">
							<Button type="reset" variant="secondary" slot="close">
								Cancelar
							</Button>
							<Button type="submit" form="form-modal-s">
								<UserPlus className="size-4" />
								Guardar empleado
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	)
}

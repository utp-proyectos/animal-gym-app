import {
	Button,
	Description,
	FieldError,
	Input,
	Label,
	Modal,
	TextField,
	type Key,
} from '@heroui/react'
import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CustomSelect } from '@/shared/components/ui/CustomSelect'
import { CalendarDate, CalendarDateTime, ZonedDateTime } from '@internationalized/date'
import { CustomDateField } from '@/shared/components/ui/CustomDateField'
import { useCreateEmployee } from '../hooks/useEmployees'
import type { Role } from '@/shared/types'
import type { EmployeeCreateRequest } from '../types'

type HeroUIDate = CalendarDate | CalendarDateTime | ZonedDateTime

const schema = z.object({
	dni: z.string().length(8, 'DNI debe tener exactamente 8 caracteres'),
	firstName: z.string().min(2, 'Mínimo 2 caracteres'),
	lastName: z.string().min(2, 'Mínimo 2 caracteres'),
	phoneNumber: z.string().min(9, 'Teléfono inválido'),
	email: z.string().email('Email inválido'),
	gender: z
		.custom<Key>()
		.nullable()
		.refine((value) => value !== null && value !== '', {
			error: 'Selecciona un genero',
		}),
	birthDate: z
		.custom<HeroUIDate | null>()
		.refine((value) => value !== null, {
			message: 'Fecha de nacimiento requerida',
		})
		.transform((val) => val as HeroUIDate | null),

	hireDate: z
		.custom<HeroUIDate | null>()
		.refine((value) => value !== null, {
			message: 'Fecha de contratación requerida',
		})
		.transform((val) => val as HeroUIDate | null),
	salary: z.number().positive('Debe ser mayor a 0'),
	contractType: z
		.custom<Key>()
		.nullable()
		.refine((value) => value !== null && value !== '', { error: 'Selecciona un contrato' }),
	specialty: z
		.custom<Key>()
		.nullable()
		.refine((value) => value !== null && value !== '', { error: 'Selecciona una especialidad' }),
	role: z
		.custom<Key>()
		.nullable()
		.refine((value) => value !== null && value !== '', { error: 'Selecciona un rol' }),
	password: z.string().min(8, 'Mínimo 8 caracteres'),
})

type EmployeeFormSchema = z.infer<typeof schema>

interface Props {
	onClose: () => void
}

export function EmployeeFormModal({ onClose }: Props) {
	const { mutate } = useCreateEmployee()
	const GENDER_OPTIONS = ['Masculino', 'Femenino', 'Otro']
	const CONTRACT_OPTIONS = ['FULL_TIME', 'PART_TIME', 'TEMPORARY']
	const SPECIALTY_OPTIONS = ['Emergencias', 'Pediatría', 'Cardiología', 'General']
	const ROLE_OPTIONS: Role[] = ['ADMIN', 'ENTRENADOR', 'SOCIO', 'RECEPCIONISTA']

	const [preview, setPreview] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<EmployeeFormSchema>({
		resolver: zodResolver(schema),
		defaultValues: {
			gender: null,
			contractType: null,
			specialty: null,
			role: null,
			birthDate: null,
			hireDate: null,
		},
	})

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) setPreview(URL.createObjectURL(file))
	}

	const onSubmit = (data: EmployeeFormSchema) => {
		const emplooyee: EmployeeCreateRequest = {
			dni: data.dni,
			firstName: data.firstName,
			lastName: data.lastName,
			phoneNumber: data.phoneNumber,
			gender: data.gender,
			email: data.email,
			birthDate: data.birthDate?.toString(),
			hireDate: data.hireDate?.toString(),
			avatar: null,
			salary: data.salary,
			contractType: data.contractType,
			specialty: data.specialty,
			password: data.password,
			role: data.role as Role,
		}
		console.log(emplooyee)
		mutate(emplooyee)
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
				<Modal.Container size="cover">
					<Modal.Dialog>
						<Modal.CloseTrigger />
						<Modal.Header className="pb-4">
							<Modal.Heading className="text-4xl font-black tracking-tight uppercase text-black">
								Nuevo empleado
							</Modal.Heading>
							<p className="text-sm text-default-500">
								Completa la información para registrar un nuevo empleado.
							</p>
						</Modal.Header>

						<Modal.Body className="overflow-y-auto py-4 h-[calc(100vh-120px)] md:h-full">
							<form
								className="space-y-8 h-full"
								id="form-modal-s"
								onSubmit={handleSubmit(onSubmit)}
							>
								<div className="grid grid-cols-1  sm:grid-cols-1 lg:grid-cols-3 gap-10 h-full items-stretch">
									{/* DATOS PERSONALES */}
									<section className="flex flex-col  p-4 rounded-xl  border">
										<h3 className="font-semibold text-lg mb-3">Datos personales</h3>
										{/* DNI NOMBRE */}
										<div className="grid gap-4  lg:grid-cols-2 grow">
											<TextField isInvalid={!!errors.dni}>
												<Label>DNI</Label>
												<Input
													placeholder="Ej. 00000000"
													{...register('dni')}
													variant="secondary"
													maxLength={8}
												/>
												<FieldError>{errors.dni?.message}</FieldError>
											</TextField>
											<TextField isInvalid={!!errors.firstName}>
												<Label>Nombre</Label>
												<Input
													{...register('firstName')}
													placeholder="Ej. Juan"
													variant="secondary"
												/>
												<FieldError>{errors.firstName?.message}</FieldError>
											</TextField>
										</div>

										{/* APELLIDO TELEFONO */}
										<div className="grid gap-4  lg:grid-cols-2  grow">
											<TextField isInvalid={!!errors.lastName}>
												<Label>Apellido</Label>
												<Input
													{...register('lastName')}
													placeholder="Ej. Pérez"
													variant="secondary"
												/>
												<FieldError>{errors.lastName?.message}</FieldError>
											</TextField>
											<TextField isInvalid={!!errors.phoneNumber}>
												<Label>Teléfono</Label>
												<Input
													{...register('phoneNumber')}
													placeholder="Ej. 999888777"
													variant="secondary"
													maxLength={9}
												/>
												<FieldError>{errors.phoneNumber?.message}</FieldError>
											</TextField>
										</div>

										{/* EMAIL GENERO */}
										<div className="grid gap-4  lg:grid-cols-2  grow">
											<TextField isInvalid={!!errors.email}>
												<Label>Email</Label>
												<Input
													{...register('email')}
													placeholder="Ej. xx@gmail.com"
													variant="secondary"
												/>
												<FieldError>{errors.email?.message}</FieldError>
											</TextField>
											<Controller
												name="gender"
												control={control}
												render={({ field, fieldState: { error } }) => (
													<CustomSelect
														label="Género"
														placeholder="Selecciona género"
														options={GENDER_OPTIONS}
														value={field.value}
														onChange={field.onChange}
														isInvalid={!!error}
														errorMessage={error?.message}
													/>
												)}
											/>
										</div>

										{/* NACIMIENTO GENERO */}
										<div className="grid gap-4 md:grid-cols-2 grow">
											<Controller
												name="birthDate"
												control={control}
												render={({ field, fieldState: { error } }) => (
													<>
														{' '}
														<CustomDateField
															label="Fecha de Nacimiento"
															value={field.value}
															onChange={field.onChange}
															isInvalid={!!error}
															errorMessage={error?.message}
														/>
														{error && <FieldError>{error.message}</FieldError>}
													</>
												)}
											/>

											<div className="flex flex-col gap-2">
												<Label>Imagen</Label>
												<input
													type="file"
													accept="image/*"
													className="cursor-pointer
													bg-surface-secondary
													p-2
													rounded-xl
													file:cursor-pointer
													"
													onChange={handleImageChange}
												/>
											</div>
										</div>

										{/* IMG PREVIEW */}
										<div className="mt-5">
											{preview && (
												<div className="rounded-xl overflow-hidden">
													<img src={preview} alt="preview" />
												</div>
											)}
										</div>
									</section>

									{/* DATOS LABORALES */}
									<section className="flex flex-col p-4 rounded-xl border">
										<h3 className="font-semibold text-lg mb-3">Datos laborales</h3>
										<div className="flex flex-col gap-4">
											{/* CONTRATO */}
											<Controller
												name="hireDate"
												control={control}
												render={({ field, fieldState: { error } }) => (
													<CustomDateField
														label="Fecha de Contratacion"
														value={field.value}
														onChange={field.onChange}
														isInvalid={!!error}
														errorMessage={error?.message}
													/>
												)}
											/>

											{/* SALARIO */}
											<TextField isInvalid={!!errors.salary}>
												<Label>Salario</Label>
												<Input
													{...register('salary', { valueAsNumber: true })}
													placeholder="Ej. 1000"
													variant="secondary"
													type="number"
												/>
												<FieldError>{errors.salary?.message}</FieldError>
											</TextField>

											{/* TIPO CONTRATO */}
											<Controller
												name="contractType"
												control={control}
												render={({ field, fieldState: { error } }) => (
													<CustomSelect
														label="Tipo de contrato"
														placeholder="Selecciona contrato"
														options={CONTRACT_OPTIONS}
														value={field.value}
														onChange={field.onChange}
														isInvalid={!!error}
														errorMessage={error?.message}
													/>
												)}
											/>

											{/* ESPECIALIAD*/}
											<Controller
												name="specialty"
												control={control}
												render={({ field, fieldState: { error } }) => (
													<CustomSelect
														label="Especialidad"
														placeholder="Selecciona especialidad"
														options={SPECIALTY_OPTIONS}
														value={field.value}
														onChange={field.onChange}
														isInvalid={!!error}
														errorMessage={error?.message}
													/>
												)}
											/>

											{/* ROL */}
											<Controller
												name="role"
												control={control}
												render={({ field, fieldState: { error } }) => (
													<CustomSelect
														label="Puesto"
														placeholder="Selecciona puesto"
														options={ROLE_OPTIONS}
														value={field.value}
														onChange={field.onChange}
														isInvalid={!!error}
														errorMessage={error?.message}
													/>
												)}
											/>
										</div>
									</section>

									{/* CREDENCIALES */}
									<section className="flex flex-col p-4 rounded-xl border">
										<h3 className="font-semibold text-lg mb-3">Credenciales</h3>
										{/*CONTRASEÑA */}
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
									</section>
								</div>
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

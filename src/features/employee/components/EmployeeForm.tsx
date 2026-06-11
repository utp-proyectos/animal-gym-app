import { Description, FieldError, Input, Label, TextField } from '@heroui/react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { CustomSelect } from '@/shared/components/ui/CustomSelect'
import { CustomDateField } from '@/shared/components/ui/CustomDateField'
import { useState } from 'react'
import type { Role } from '@/shared/types'
import defult from '@/assets/global/default.png'

const GENDER_OPTIONS = ['Masculino', 'Femenino', 'Otro']
const CONTRACT_OPTIONS = ['FULL_TIME', 'PART_TIME', 'TEMPORARY']
const SPECIALTY_OPTIONS = ['Brazos', 'Piernas', 'Danzas', 'Biceps']
const ROLE_OPTIONS: Role[] = ['ADMIN', 'ENTRENADOR', 'RECEPCIONISTA']

interface EmployeeFormProps {
	isEditing?: boolean
}

const EmployeeForm = ({ isEditing = false }: EmployeeFormProps) => {
	const { control, setValue } = useFormContext()
	const avatarValue = useWatch({ control, name: 'avatar' })
	const [newPreview, setNewPreview] = useState<string | null>(null)

	//image
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) setNewPreview(URL.createObjectURL(file))
		setValue('avatar', file)
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-10 h-full items-stretch">
			{/* DATOS PERSONALES */}
			<section className="flex flex-col p-4 rounded-xl border">
				<h3 className="font-semibold text-lg mb-3">Datos personales</h3>

				{/* DNI / NOMBRE */}
				<div className="grid gap-4 lg:grid-cols-2 grow">
					<Controller
						name="dni"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<TextField isInvalid={!!error}>
								<Label>DNI</Label>
								<Input {...field} placeholder="Ej. 00000000" variant="secondary" maxLength={8} />
								<FieldError>{error?.message}</FieldError>
							</TextField>
						)}
					/>
					<Controller
						name="firstName"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<TextField isInvalid={!!error}>
								<Label>Nombre</Label>
								<Input {...field} placeholder="Ej. Juan" variant="secondary" />
								<FieldError>{error?.message}</FieldError>
							</TextField>
						)}
					/>
				</div>

				{/* APELLIDO / TELÉFONO */}
				<div className="grid gap-4 lg:grid-cols-2 grow">
					<Controller
						name="lastName"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<TextField isInvalid={!!error}>
								<Label>Apellido</Label>
								<Input {...field} placeholder="Ej. Pérez" variant="secondary" />
								<FieldError>{error?.message}</FieldError>
							</TextField>
						)}
					/>
					<Controller
						name="phoneNumber"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<TextField isInvalid={!!error}>
								<Label>Teléfono</Label>
								<Input {...field} placeholder="Ej. 999888777" variant="secondary" maxLength={9} />
								<FieldError>{error?.message}</FieldError>
							</TextField>
						)}
					/>
				</div>

				{/* EMAIL / GÉNERO */}
				<div className="grid gap-4 lg:grid-cols-2 grow">
					<Controller
						name="email"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<TextField isInvalid={!!error}>
								<Label>Email</Label>
								<Input {...field} placeholder="Ej. xx@gmail.com" variant="secondary" />
								<FieldError>{error?.message}</FieldError>
							</TextField>
						)}
					/>
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
								errorMessage={error?.message}
							/>
						)}
					/>
				</div>

				{/* FECHA NACIMIENTO / IMAGEN */}
				<div className="grid gap-4 md:grid-cols-2 grow">
					<Controller
						name="birthDate"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<CustomDateField
								label="Fecha de Nacimiento"
								value={field.value}
								onChange={field.onChange}
								errorMessage={error?.message}
							/>
						)}
					/>
					<div className="flex flex-col gap-2">
						<Label>Imagen</Label>
						<input
							type="file"
							accept="image/*"
							className="cursor-pointer bg-surface-secondary p-2 rounded-xl file:cursor-pointer"
							onChange={handleImageChange}
						/>
					</div>
				</div>

				{/* PREVIEW */}
				{(newPreview || (typeof avatarValue === 'string' && avatarValue)) && (
					<div className="mt-5 rounded-xl overflow-hidden">
						<img
							src={newPreview || (typeof avatarValue === 'string' ? avatarValue : undefined)}
							alt="preview"
							onError={(e) => {
								e.currentTarget.src = defult
							}}
						/>
					</div>
				)}
			</section>

			{/* DATOS LABORALES */}
			<section className="flex flex-col p-4 rounded-xl border">
				<h3 className="font-semibold text-lg mb-3">Datos laborales</h3>
				<div className="flex flex-col gap-4">
					<Controller
						name="hireDate"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<CustomDateField
								label="Fecha de Contratación"
								value={field.value}
								onChange={field.onChange}
								errorMessage={error?.message}
							/>
						)}
					/>
					<Controller
						name="salary"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<TextField isInvalid={!!error}>
								<Label>Salario</Label>
								<Input
									{...field}
									onChange={(e) => field.onChange(e.target.valueAsNumber)}
									placeholder="Ej. 1000"
									variant="secondary"
									type="number"
								/>
								<FieldError>{error?.message}</FieldError>
							</TextField>
						)}
					/>
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
								errorMessage={error?.message}
							/>
						)}
					/>
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
								errorMessage={error?.message}
							/>
						)}
					/>
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
								errorMessage={error?.message}
							/>
						)}
					/>
				</div>
			</section>

			{/* CREDENCIALES — solo en modo crear */}
			{!isEditing && (
				<section className="flex flex-col p-4 rounded-xl border">
					<h3 className="font-semibold text-lg mb-3">Credenciales</h3>
					<Controller
						name="password"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<TextField isInvalid={!!error}>
								<Label>Contraseña</Label>
								<Input
									{...field}
									type="password"
									placeholder="Mínimo 8 caracteres"
									variant="secondary"
									autoComplete="new-password"
								/>
								<Description>La contraseña debe tener al menos 8 caracteres.</Description>
								<FieldError>{error?.message}</FieldError>
							</TextField>
						)}
					/>
				</section>
			)}
		</div>
	)
}

export default EmployeeForm

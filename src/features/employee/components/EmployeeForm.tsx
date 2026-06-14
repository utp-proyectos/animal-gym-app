import { Input } from '@heroui/react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { CustomSelect } from '@/shared/components/ui/CustomSelect'
import { CustomDateField } from '@/shared/components/ui/CustomDateField'
import type { Role } from '@/shared/types'
import preview from '@/assets/global/preview.png'
import CustomField from '@/shared/components/ui/CustomField'
import FileField from '@/shared/components/ui/FileField'
import { CustomNumberField } from '../../../shared/components/ui/CustomNumberField'

interface EmployeeFormProps {
	isEditing?: boolean
}
const ROLE_OPTIONS: Role[] = ['ADMIN', 'ENTRENADOR', 'RECEPCIONISTA']
const SPECIALITY_OPTIONS = ['Biceps', 'Brazos', 'Danzas', 'Piernas']
const CONTRACT_TYPE_OPTIONS = ['Medio tiempo', 'Tiempo completo']
const GENDER_OPTIONS = ['Masculino', 'Femenino', 'Otro']
const EmployeeForm = ({ isEditing = false }: EmployeeFormProps) => {
	const { control } = useFormContext()
	const avatarValue = useWatch({ control, name: 'avatar' }) as FileList | null
	const avatarUrl = useWatch({ control, name: 'avatarUrl' }) as string | null
	const previewSrc =
		avatarValue && avatarValue.length > 0
			? URL.createObjectURL(avatarValue[0])
			: avatarUrl || preview
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
							<CustomField label="Dni" errorMessage={error?.message}>
								<Input {...field} placeholder="Ingrese su email" maxLength={8}></Input>
							</CustomField>
						)}
					/>
					<Controller
						name="firstName"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<CustomField label="Nombre" errorMessage={error?.message}>
								<Input {...field} placeholder="Ingrese su nombre"></Input>
							</CustomField>
						)}
					/>
				</div>

				{/* APELLIDO / TELÉFONO */}
				<div className="grid gap-4 lg:grid-cols-2 grow">
					<Controller
						name="lastName"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<CustomField label="Apellido" errorMessage={error?.message}>
								<Input {...field} placeholder="Ingrese su apellido"></Input>
							</CustomField>
						)}
					/>
					<Controller
						name="phoneNumber"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<CustomField label="Telefono" errorMessage={error?.message}>
								<Input {...field} placeholder="Ingrese su telefono" maxLength={9}></Input>
							</CustomField>
						)}
					/>
				</div>

				{/* EMAIL / GÉNERO */}
				<div className="grid gap-4 lg:grid-cols-2 grow">
					<Controller
						name="email"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<CustomField label="Email" errorMessage={error?.message}>
								<Input {...field} placeholder="Ingrese su email"></Input>
							</CustomField>
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

					<Controller
						name="avatar"
						control={control}
						render={({ field: { onChange, value }, fieldState: { error } }) => (
							<FileField
								label="Imagen"
								accept="image/jpeg,image/png"
								value={value}
								onChange={onChange}
								errorMessage={error?.message}
							/>
						)}
					/>
				</div>

				{/* PREVIEW */}
				<div className="mt-5 rounded-xl overflow-hidden">
					<img src={previewSrc} alt="preview" />
				</div>
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
							<CustomNumberField
								label="Ingrese el salario"
								value={field.value}
								onChange={field.onChange}
								errorMessage={error?.message}
								formatOptions={{
									style: 'currency',
									currency: 'PEN',
								}}
							/>
						)}
					/>
					<Controller
						name="contractType"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<CustomSelect
								label="Tipo de contrato"
								placeholder="Selecciona contrato"
								options={CONTRACT_TYPE_OPTIONS}
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
								options={SPECIALITY_OPTIONS}
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
							<CustomField label="Contraseña" errorMessage={error?.message}>
								<Input {...field} placeholder="Ingrese su contraseña" type="password"></Input>
							</CustomField>
						)}
					/>
				</section>
			)}
		</div>
	)
}

export default EmployeeForm

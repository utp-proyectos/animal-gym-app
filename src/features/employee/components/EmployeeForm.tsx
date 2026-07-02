import { Input } from '@heroui/react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { CustomSelect } from '@/shared/components/ui/CustomSelect'
import { CustomDateField } from '@/shared/components/ui/CustomDateField'
import type { Role } from '@/shared/types'
import CustomField from '@/shared/components/ui/CustomField'
import FileField from '@/shared/components/ui/FileField'
import { CustomNumberField } from '@/shared/components/ui/CustomNumberField'
import defult from '@/assets/global/default.png'
import preview from '@/assets/global/preview.png'
import { LockKeyhole } from 'lucide-react'
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
		<div className="flex flex-col gap-4">
			<div className="flex flex-col md:flex-row gap-4">
				<div className="w-full">
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
				<div className="w-full">
					<Controller
						name="lastName"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<CustomField label="Apellido" errorMessage={error?.message}>
								<Input {...field} placeholder="Ingrese su apellido"></Input>
							</CustomField>
						)}
					/>
				</div>
			</div>

			<div className="flex flex-col md:flex-row gap-4">
				<div className="w-full">
					<Controller
						name="dni"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<CustomField label="Dni" errorMessage={error?.message}>
								<Input {...field} placeholder="Ingrese su dni" maxLength={8}></Input>
							</CustomField>
						)}
					/>
				</div>
				<div className="w-full">
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
			</div>

			<div className="flex flex-col md:flex-row gap-4">
				<div className="w-full">
					<Controller
						name="email"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<CustomField label="Email" errorMessage={error?.message}>
								<Input {...field} placeholder="Ingrese su email"></Input>
							</CustomField>
						)}
					/>
				</div>
				<div className="w-full">
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
			</div>

			<div className="grid gap-4 md:grid-cols-2 grow">
				<div className="w-full">
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
				</div>
				<div className="w-full">
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
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2 grow">
				<div className="w-full">
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
				</div>
				<div className="w-full">
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
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2 grow">
				<div className="w-full">
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
				</div>
				<div className="w-full">
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
			</div>

			<div className="w-full">
				<Controller
					name="avatar"
					control={control}
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<FileField
							label="Imagen"
							accept="image/jpeg,image/png"
							value={value}
							onChange={onChange}
							variant="secondary"
							errorMessage={error?.message}
						/>
					)}
				/>
			</div>

			<div className="mt-5 rounded-xl overflow-hidden">
				<img
					src={previewSrc}
					className="w-full"
					alt="preview"
					onError={(e) => {
						e.currentTarget.src = defult
					}}
				/>
			</div>

			{!isEditing ? (
				<Controller
					name="password"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<CustomField label="Contraseña" errorMessage={error?.message}>
							<Input {...field} placeholder="Ingrese su contraseña" type="password" />
						</CustomField>
					)}
				/>
			) : (
				<div className="flex items-center gap-3 p-4 h-18 rounded-xl border border-dashed border-default-300 bg-default-50 text-default-500 select-none">
					<LockKeyhole />
					<div className="flex flex-col gap-0.5">
						<span className="text-xs font-medium text-default-500">Acceso protegido</span>
						<p className="text-xs leading-normal">
							La contraseña se gestiona directamente desde la tarjeta del empleado.
						</p>
					</div>
				</div>
			)}
		</div>
	)
}

export default EmployeeForm

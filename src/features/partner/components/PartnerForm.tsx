import { Input } from '@heroui/react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { CustomDatePicker } from '@/shared/components/ui/CustomDatePicker'
import CustomField from '@/shared/components/ui/CustomField'
import { CustomNumberField } from '@/shared/components/ui/CustomNumberField'
import { CustomSelect } from '@/shared/components/ui/CustomSelect'
import FileField from '@/shared/components/ui/FileField'
import { useMemberships } from '@/features/membership/hooks/useMemberships'
import defaultImg from '@/assets/global/default.png'
import previewImg from '@/assets/global/preview.png'

const GENDER_OPTIONS = [
	{ label: 'Masculino', value: 'M' },
	{ label: 'Femenino', value: 'F' },
	{ label: 'Prefiero no especificar', value: 'NO_ESPECIFICADO' },
]

interface PartnerFormProps {
	isEditing?: boolean
	currentImageUrl?: string | null
}

function SectionDivider({ label }: { label: string }) {
	return (
		<div className="flex items-center gap-3 pt-1">
			<div className="flex-1 h-px bg-default-200" />
			<span className="text-xs font-semibold uppercase tracking-wider text-default-400 whitespace-nowrap">
				{label}
			</span>
			<div className="flex-1 h-px bg-default-200" />
		</div>
	)
}

const PartnerForm = ({ isEditing = false, currentImageUrl }: PartnerFormProps) => {
	const { control } = useFormContext()

	const { data: memberships = [], isLoading: isLoadingMemberships } = useMemberships()

	const membershipOptions = memberships
		.filter((m) => m.status === true)
		.map((m) => ({
			label: `${m.name} — S/ ${m.price.toFixed(2)} / ${m.duration} días`,
			value: m.id,
		}))

	const avatarValue = useWatch({ control, name: 'avatar' }) as FileList | null

	const previewSrc =
		avatarValue && avatarValue.length > 0
			? URL.createObjectURL(avatarValue[0])
			: currentImageUrl || previewImg

	return (
		<div className="flex flex-col gap-5">
			<div className="grid grid-cols-2 gap-3">
				<Controller
					name="firstName"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<CustomField label="Nombre" errorMessage={error?.message}>
							<Input {...field} placeholder="Juan" />
						</CustomField>
					)}
				/>
				<Controller
					name="lastName"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<CustomField label="Apellido" errorMessage={error?.message}>
							<Input {...field} placeholder="Pérez" />
						</CustomField>
					)}
				/>
			</div>

			<div className="grid grid-cols-2 gap-3">
				<Controller
					name="dni"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<CustomField label="DNI" errorMessage={error?.message}>
							<Input {...field} placeholder="12345678" maxLength={8} inputMode="numeric" />
						</CustomField>
					)}
				/>
				<Controller
					name="phoneNumber"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<CustomField label="Teléfono" errorMessage={error?.message}>
							<Input {...field} placeholder="987654321" inputMode="tel" />
						</CustomField>
					)}
				/>
			</div>

			<Controller
				name="email"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<CustomField label="Correo electrónico" errorMessage={error?.message}>
						<Input {...field} type="email" placeholder="juan@ejemplo.com" />
					</CustomField>
				)}
			/>

			<div className="grid grid-cols-2 gap-3">
				<Controller
					name="gender"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<CustomSelect
							label="Género"
							placeholder="Selecciona..."
							options={GENDER_OPTIONS}
							value={field.value ?? null}
							onChange={field.onChange}
							errorMessage={error?.message}
						/>
					)}
				/>
				<Controller
					name="birthDate"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<CustomDatePicker
							label="Fecha de nacimiento"
							value={field.value ?? null}
							onChange={field.onChange}
							errorMessage={error?.message}
						/>
					)}
				/>
			</div>

			<SectionDivider label="Membresía e ingreso" />

			<Controller
				name="membershipId"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<CustomSelect
						label="Membresía *"
						placeholder={isLoadingMemberships ? 'Cargando planes...' : 'Selecciona un plan'}
						options={membershipOptions}
						value={field.value ?? null}
						onChange={field.onChange}
						errorMessage={error?.message}
					/>
				)}
			/>

			<Controller
				name="hireDate"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<CustomDatePicker
						label="Fecha de ingreso al gimnasio"
						value={field.value ?? null}
						onChange={field.onChange}
						errorMessage={error?.message}
					/>
				)}
			/>

			<SectionDivider label="Métricas de salud - opcional" />

			<div className="grid grid-cols-2 gap-3">
				<Controller
					name="weight"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<CustomNumberField
							label="Peso (kg)"
							value={field.value ?? undefined}
							onChange={field.onChange}
							errorMessage={error?.message}
						/>
					)}
				/>
				<Controller
					name="height"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<CustomNumberField
							label="Altura (cm)"
							value={field.value ?? undefined}
							onChange={field.onChange}
							errorMessage={error?.message}
						/>
					)}
				/>
			</div>

			<SectionDivider label="Foto de perfil - opcional" />

			<Controller
				name="avatar"
				control={control}
				render={({ field: { onChange, value }, fieldState: { error } }) => (
					<FileField
						label={isEditing ? 'Cambiar foto de perfil' : 'Foto de perfil'}
						accept="image/jpeg,image/png,image/webp"
						value={value}
						onChange={onChange}
						variant="secondary"
						errorMessage={error?.message}
					/>
				)}
			/>

			<div className="flex justify-center items-center rounded-xl overflow-hidden bg-default-100 min-h-28">
				<img
					src={previewSrc}
					alt="Vista previa"
					className="w-xs h-full object-cover max-h-48"
					onError={(e) => {
						e.currentTarget.src = defaultImg
					}}
				/>
			</div>

			<SectionDivider label="Acceso" />

			<Controller
				name="password"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<CustomField
						label={isEditing ? 'Nueva contraseña' : 'Contraseña *'}
						errorMessage={error?.message}
					>
						<Input
							{...field}
							type="password"
							placeholder={isEditing ? 'Dejar vacío para no cambiar' : 'Mínimo 6 caracteres'}
						/>
					</CustomField>
				)}
			/>
		</div>
	)
}

export default PartnerForm

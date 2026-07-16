import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, Input, Card, Avatar, Spinner } from '@heroui/react'
import { useAuthStore } from '@/store'
import { usePartnerDetail, useUpdatePartnerProfile } from '@/features/partner/hooks/usePartners'
import { useGetEmployee, useUpdateEmployeeProfile } from '@/features/employee/hooks/useEmployees'
import CustomField from '@/shared/components/ui/CustomField'
import { Mail, User } from 'lucide-react'
import { CustomSelect } from '@/shared/components/ui/CustomSelect'
import { CustomDateField } from '@/shared/components/ui/CustomDateField'
import { parseDate, type DateValue } from '@internationalized/date'
import defaultAvatar from '@/assets/global/default.png'

// const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150'

interface ProfileFormInputs {
	firstName: string
	lastName: string
	email: string
	phoneNumber: string
	gender: string
	birthDate: DateValue | null
}

export function ProfilePage() {
	const { user } = useAuthStore()
	const isSocio = user?.role === 'SOCIO'
	const personId = user?.personId ? Number(user.personId) : null

	const [isEditing, setIsEditing] = useState(false)

	const { data: employeeData, isLoading: isLoadingEmployee } = useGetEmployee(
		!isSocio && personId ? personId : undefined,
	)
	const { data: partnerData, isLoading: isLoadingPartner } = usePartnerDetail(
		isSocio && personId ? personId : null,
	)

	const isLoadingData = isSocio ? isLoadingPartner : isLoadingEmployee
	const profileData = isSocio ? partnerData : employeeData

	const { mutate: updatePartner, isPending: isUpdatingPartner } = useUpdatePartnerProfile()
	const { mutate: updateEmployee, isPending: isUpdatingEmployee } = useUpdateEmployeeProfile()

	const isSaving = isUpdatingEmployee || isUpdatingPartner

	// React Hook Form
	const { control, handleSubmit, reset } = useForm<ProfileFormInputs>({
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			phoneNumber: '',
			gender: '',
			birthDate: null,
		},
	})

	useEffect(() => {
		if (profileData) {
			reset({
				firstName: profileData.firstName || '',
				lastName: profileData.lastName || '',
				email: profileData.email || '',
				phoneNumber: profileData.phoneNumber || '',
				gender: profileData.gender || '',
				birthDate: profileData.birthDate ? parseDate(profileData.birthDate) : null,
			})
		}
	}, [profileData, reset])

	const handleCancel = () => {
		setIsEditing(false)
		if (profileData) {
			reset({
				firstName: profileData.firstName,
				lastName: profileData.lastName,
				email: profileData.email,
				phoneNumber: profileData.phoneNumber,
				gender: profileData.gender || '',
				birthDate: profileData.birthDate ? parseDate(profileData.birthDate) : null,
			})
		}
	}

	const onSubmit = (data: ProfileFormInputs) => {
		if (!personId) return

		if (isSocio) {
			updatePartner(
				{
					id: personId,
					payload: {
						...profileData,
						firstName: data.firstName,
						lastName: data.lastName,
						email: data.email,
						phoneNumber: data.phoneNumber,
						gender: data.gender as 'Masculino' | 'Femenino' | 'Otro',
						birthDate: data.birthDate?.toString() ?? '',
					},
				},
				{
					onSuccess: () => setIsEditing(false),
				},
			)
		} else {
			updateEmployee(
				{
					id: personId,
					payload: {
						...profileData,
						firstName: data.firstName,
						lastName: data.lastName,
						email: data.email,
						phoneNumber: data.phoneNumber,
						gender: data.gender as 'Masculino' | 'Femenino' | 'Otro',
						birthDate: data.birthDate?.toString() ?? '',
					},
				},
				{
					onSuccess: () => setIsEditing(false),
				},
			)
		}
	}

	if (isLoadingData) {
		return (
			<div className="flex flex-col gap-3 justify-center items-center h-[60vh]">
				<Spinner size="lg" />
				<span className="text-sm font-semibold text-default-500">Cargando tu perfil...</span>
			</div>
		)
	}

	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				<Card className="p-6 flex flex-col items-center justify-between text-center border-none shadow-md bg-white">
					<div className="flex flex-col items-center gap-4 w-full">
						<div className="relative">
							<Avatar className="w-36 h-36 text-large shadow-inner border-4 border-default-100">
								<Avatar.Image
									src={profileData?.avatar?.trim() || defaultAvatar}
									alt={`Foto de perfil de ${profileData?.firstName ?? 'usuario'}`}
								/>
							</Avatar>
						</div>

						<div className="mt-2">
							<h2 className="text-2xl font-black text-black tracking-tight leading-tight">
								{profileData?.firstName} {profileData?.lastName}
							</h2>
							<span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary text-xs font-black uppercase tracking-wider rounded-full">
								{user?.role}
							</span>
						</div>

						<div className="h-px w-full bg-default-100 my-2" />

						{/* Detalles Fijos */}
						<div className="w-full text-left flex flex-col gap-3">
							<div className="flex items-center gap-3 text-default-600">
								<User size={18} className="text-default-400" />
								<span className="text-sm font-semibold">DNI: {profileData?.dni}</span>
							</div>
							<div className="flex items-center gap-3 text-default-600">
								<Mail size={18} className="text-default-400" />
								<span className="text-sm font-semibold truncate">{profileData?.email}</span>
							</div>
						</div>
					</div>

					{/* Botón de control de Edición */}
					{!isEditing && (
						<Button
							className="w-full mt-6 font-bold"
							variant="outline"
							onPress={() => setIsEditing(true)}
						>
							Editar Perfil
						</Button>
					)}
				</Card>

				{/* Contenedor Derecho: Formulario editable */}
				<Card className="col-span-1 md:col-span-2 p-6 border-none shadow-md bg-white">
					<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
						<div className="flex justify-between items-center">
							<h3 className="text-xl font-bold text-black tracking-tight">Información Personal</h3>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<Controller
								name="firstName"
								control={control}
								render={({ field, fieldState: { error } }) => (
									<CustomField
										label="Nombre"
										variant={isEditing ? 'secondary' : 'primary'}
										errorMessage={error?.message}
									>
										<Input {...field} placeholder="Tu nombre" disabled={!isEditing} />
									</CustomField>
								)}
							/>
							<Controller
								name="lastName"
								control={control}
								render={({ field, fieldState: { error } }) => (
									<CustomField
										label="Apellido"
										variant={isEditing ? 'secondary' : 'primary'}
										errorMessage={error?.message}
									>
										<Input {...field} placeholder="Tu apellido" disabled={!isEditing} />
									</CustomField>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<Controller
								name="email"
								control={control}
								render={({ field, fieldState: { error } }) => (
									<CustomField
										label="Correo Electrónico"
										variant={isEditing ? 'secondary' : 'primary'}
										errorMessage={error?.message}
									>
										<Input
											{...field}
											type="email"
											placeholder="correo@ejemplo.com"
											disabled={!isEditing}
										/>
									</CustomField>
								)}
							/>
							<Controller
								name="phoneNumber"
								control={control}
								render={({ field, fieldState: { error } }) => (
									<CustomField
										label="Teléfono"
										variant={isEditing ? 'secondary' : 'primary'}
										errorMessage={error?.message}
									>
										<Input {...field} placeholder="987654321" disabled={!isEditing} />
									</CustomField>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<Controller
								name="gender"
								control={control}
								render={({ field, fieldState: { error } }) => (
									<CustomSelect
										label="Género"
										placeholder="Selecciona género"
										options={[
											{ label: 'Masculino', value: 'Masculino' },
											{ label: 'Femenino', value: 'Femenino' },
											{ label: 'Otro', value: 'Otro' },
										]}
										value={field.value ?? null}
										onChange={field.onChange}
										errorMessage={error?.message}
										disabled={!isEditing}
									/>
								)}
							/>

							<Controller
								name="birthDate"
								control={control}
								render={({ field, fieldState: { error } }) => (
									<CustomDateField
										label="Fecha de Nacimiento"
										value={field.value ?? null}
										onChange={field.onChange}
										errorMessage={error?.message}
										disabled={!isEditing}
									/>
								)}
							/>
						</div>

						{/* Botones de acción al estar editando */}
						{isEditing && (
							<div className="flex gap-3 justify-end mt-4">
								<Button
									variant="outline"
									className="font-bold"
									onPress={handleCancel}
									isDisabled={isSaving}
								>
									Cancelar
								</Button>
								<Button type="submit" className="font-bold">
									Guardar Cambios
								</Button>
							</div>
						)}
					</form>
				</Card>
			</div>
		</div>
	)
}

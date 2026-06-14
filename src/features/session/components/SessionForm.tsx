import { FieldError, Input, Label, NumberField, TextArea } from '@heroui/react'
import { useFormContext, Controller, useWatch } from 'react-hook-form'
import CustomField from '@/shared/components/ui/CustomField'
import { CustomSelect } from '@/shared/components/ui/CustomSelect'
import { useEmployees } from '@/features/employee/hooks/useEmployees'
import { CustomDateField } from '@/shared/components/ui/CustomDateField'
import { CustomTimeField } from '@/shared/components/ui/CustomTimeField'
import FileField from '@/shared/components/ui/FileField'
import defult from '@/assets/global/default.png'
import preview from '@/assets/global/preview.png'

const SessionForm = () => {
	const { control } = useFormContext()
	const imageValue = useWatch({ control, name: 'image' }) as FileList | null
	const imageUrl = useWatch({ control, name: 'imageUrl' }) as string | null

	const previewSrc =
		imageValue && imageValue.length > 0 ? URL.createObjectURL(imageValue[0]) : imageUrl || preview

	const { data: employees = [], isLoading: isLoadingEmployees } = useEmployees()
	const trainersFiltered = employees.filter((emp) => emp.role?.toUpperCase() === 'ENTRENADOR')
	const trainerOptions = trainersFiltered.map((emp) => ({
		label: `${emp.firstName} ${emp.lastName || ''}`,
		value: emp.id,
	})) satisfies { label: string; value: number }[]

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Controller
					name="name"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<CustomField label="Nombre de la clase" errorMessage={error?.message}>
							<Input {...field} placeholder="Ej. Spinning Pro" />
						</CustomField>
					)}
				/>

				<Controller
					name="description"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<CustomField label="Descripción" errorMessage={error?.message}>
							<TextArea {...field} placeholder="Ej. Clase de spinning avanzada" />
						</CustomField>
					)}
				/>

				<Controller
					name="goal"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<CustomField label="Objetivo" errorMessage={error?.message}>
							<TextArea {...field} placeholder="Ej. Mejorar resistencia cardiovascular" />
						</CustomField>
					)}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Controller
					name="capacity"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<NumberField
							variant="secondary"
							minValue={0}
							name={field.name}
							value={field.value}
							onChange={field.onChange}
						>
							<Label>Capacidad</Label>
							<NumberField.Group>
								<NumberField.DecrementButton />
								<NumberField.Input />
								<NumberField.IncrementButton />
								<FieldError>{error?.message}</FieldError>
							</NumberField.Group>
						</NumberField>
					)}
				/>

				<Controller
					name="intensity"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<>
							<CustomSelect
								label="Intensidad"
								placeholder="Selecciona intensidad"
								options={['Baja', 'Media', 'Alta']}
								value={field.value}
								onChange={field.onChange}
								errorMessage={error?.message}
							/>
						</>
					)}
				/>

				<Controller
					name="employeeId"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<CustomSelect
							label="Entrenador"
							placeholder={
								isLoadingEmployees ? 'Cargando entrenadores...' : 'Selecciona un entrenador'
							}
							options={trainerOptions}
							value={field.value}
							onChange={field.onChange}
							errorMessage={error?.message}
						/>
					)}
				/>
			</div>

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

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Controller
					name="image"
					control={control}
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<FileField
							label="Imagen"
							accept="image/jpeg,image/png"
							value={value}
							onChange={onChange}
							errorMessage={error?.message}
							variant="secondary"
						/>
					)}
				/>

				<div className="mt-5 rounded-xl overflow-hidden">
					<img
						src={previewSrc}
						alt="preview"
						onError={(e) => {
							e.currentTarget.src = defult
						}}
					/>
				</div>
			</div>
		</>
	)
}

export default SessionForm

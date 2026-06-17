import { useEmployees } from '@/features/employee/hooks/useEmployees'
import { Input, TextArea } from '@heroui/react'
import { useFormContext, Controller } from 'react-hook-form'
import CustomField from '@/shared/components/ui/CustomField'
import { CustomDateRangePicker } from '@/shared/components/ui/CustomDateRangePickerField'
import { getLocalTimeZone, today } from '@internationalized/date'
import { CustomSelect } from '@/shared/components/ui/CustomSelect'

const RoutineForm = () => {
	const { control } = useFormContext()

	const { data: employees = [], isLoading: isLoadingEmployees } = useEmployees()
	const trainersFiltered = employees.filter((emp) => emp.role?.toUpperCase() === 'ENTRENADOR')
	const trainerOptions = trainersFiltered.map((emp) => ({
		label: `${emp.firstName} ${emp.lastName || ''}`,
		value: emp.id,
	})) satisfies { label: string; value: number }[]

	return (
		<>
			<Controller
				name="name"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<CustomField label="Nombre" errorMessage={error?.message}>
						<Input {...field} placeholder="Ej. Rutina de brazos" />
					</CustomField>
				)}
			/>

			<Controller
				name="description"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<CustomField label="Descripción" errorMessage={error?.message}>
						<TextArea {...field} placeholder="Ej. Esta rutina tiene ejercicios de fuerza" />
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

			<Controller
				name="dateRange"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<CustomDateRangePicker
						label="Vigencia de la Rutina"
						value={field.value}
						onChange={field.onChange}
						errorMessage={error?.message}
						minValue={today(getLocalTimeZone())}
						startName="startDate"
						endName="endDate"
					/>
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
		</>
	)
}

export default RoutineForm

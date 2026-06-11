import { Input } from '@heroui/react'
import { useFormContext, Controller } from 'react-hook-form'
import CustomField from '@/shared/components/ui/CustomField'

const ExerciseForm = () => {
	const { control } = useFormContext()

	return (
		<>
			<Controller
				name="name"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<CustomField label="Nombre" errorMessage={error?.message}>
						<Input {...field} placeholder="Ej. Curl de bíceps" />
					</CustomField>
				)}
			/>

			<Controller
				name="description"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<CustomField label="Descripción" errorMessage={error?.message}>
						<Input {...field} placeholder="Ej. Ejercicio de fuerza" />
					</CustomField>
				)}
			/>

			<Controller
				name="muscleGroup"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<CustomField label="Grupo muscular" errorMessage={error?.message}>
						<Input {...field} placeholder="Ej. Bíceps" />
					</CustomField>
				)}
			/>

			<Controller
				name="equipment"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<CustomField label="Equipo" errorMessage={error?.message}>
						<Input {...field} placeholder="Ej. Mancuernas" />
					</CustomField>
				)}
			/>
		</>
	)
}

export default ExerciseForm

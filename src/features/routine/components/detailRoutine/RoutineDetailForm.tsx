import { useFormContext, Controller } from 'react-hook-form'
import { CustomSelect } from '@/shared/components/ui/CustomSelect'
import { FieldError, Label, NumberField } from '@heroui/react'
import { useExercise } from '@/features/exercise/hooks/useExercises'

const RoutineDetailForm = () => {
	const { control } = useFormContext()

	const { data: exercises = [], isLoading: isLoadingExercises } = useExercise()
	const trainerOptions = exercises.map((ex) => ({
		label: ex.name,
		value: ex.id,
	})) satisfies { label: string; value: number }[]

	return (
		<>
			<Controller
				name="dayOfWeek"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<>
						<CustomSelect
							label="Día de la semana"
							placeholder="Selecciona intensidad"
							options={['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']}
							value={field.value}
							onChange={field.onChange}
							errorMessage={error?.message}
						/>
					</>
				)}
			/>

			<Controller
				name="sets"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<NumberField
						variant="secondary"
						name={field.name}
						value={field.value}
						onChange={field.onChange}
						isInvalid={!!error}
					>
						<Label>Serie</Label>
						<NumberField.Group>
							<NumberField.DecrementButton />
							<NumberField.Input />
							<NumberField.IncrementButton />
						</NumberField.Group>
						<FieldError>{error?.message}</FieldError>
					</NumberField>
				)}
			/>

			<Controller
				name="reps"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<NumberField
						variant="secondary"
						name={field.name}
						value={field.value}
						onChange={field.onChange}
						isInvalid={!!error}
					>
						<Label>Repeticiones</Label>
						<NumberField.Group>
							<NumberField.DecrementButton />
							<NumberField.Input />
							<NumberField.IncrementButton />
						</NumberField.Group>
						<FieldError>{error?.message}</FieldError>
					</NumberField>
				)}
			/>

			<Controller
				name="weight"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<NumberField
						variant="secondary"
						name={field.name}
						value={field.value}
						onChange={field.onChange}
						isInvalid={!!error}
						formatOptions={{
							style: 'unit',
							unit: 'kilogram',
							unitDisplay: 'short',
						}}
					>
						<Label>Peso</Label>
						<NumberField.Group>
							<NumberField.DecrementButton />
							<NumberField.Input />
							<NumberField.IncrementButton />
						</NumberField.Group>
						<FieldError>{error?.message}</FieldError>
					</NumberField>
				)}
			/>

			<Controller
				name="calories"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<NumberField
						variant="secondary"
						name={field.name}
						value={field.value}
						onChange={field.onChange}
						isInvalid={!!error}
					>
						<Label>Calorias estimadas</Label>
						<NumberField.Group>
							<NumberField.DecrementButton />
							<NumberField.Input />
							<NumberField.IncrementButton />
						</NumberField.Group>
						<FieldError>{error?.message}</FieldError>
					</NumberField>
				)}
			/>

			<Controller
				name="restTime"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<NumberField
						variant="secondary"
						name={field.name}
						value={field.value}
						onChange={field.onChange}
						isInvalid={!!error}
					>
						<Label>Tiempo de descanso</Label>
						<NumberField.Group>
							<NumberField.DecrementButton />
							<NumberField.Input />
							<NumberField.IncrementButton />
						</NumberField.Group>
						<FieldError>{error?.message}</FieldError>
					</NumberField>
				)}
			/>

			<Controller
				name="exerciseId"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<CustomSelect
						label="Ejercicios"
						placeholder={isLoadingExercises ? 'Cargando ejercicios...' : 'Selecciona un ejercicio'}
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

export default RoutineDetailForm

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editSchema, type EditInput, type EditOutput } from '../schema/exerciseSchema'
import ExerciseForm from './ExerciseForm'
import { useUpdateExercise } from '../hooks/useExercises'
import type { ExerciseResponse } from '../types'

interface EditFormProps {
	item: ExerciseResponse
	onClose: () => void
}

const EditForm = ({ item, onClose }: EditFormProps) => {
	const { mutate } = useUpdateExercise()

	const form = useForm<EditInput, unknown, EditOutput>({
		resolver: zodResolver(editSchema),
		defaultValues: item,
	})

	const onSubmit = (data: EditOutput) => {
		mutate(
			{ id: data.id, payload: data },
			{
				onSuccess: () => {
					console.log('Ejercicio actualizado con éxito en Spring Boot:', data)
					onClose()
				},
				onError: (error) => {
					console.error('Error al actualizar en el backend:', error)
				},
			},
		)
	}

	return (
		<FormProvider {...form}>
			<form
				id="exercise-form"
				className="flex flex-col gap-4"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<ExerciseForm />
			</form>
		</FormProvider>
	)
}

export default EditForm

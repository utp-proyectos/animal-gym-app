import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editSchema, type EditInput, type EditOutput } from '../schema/exerciseSchema'
import ExerciseForm from './ExerciseForm'
import { useUpdateExercise } from '../hooks/useExercises'
import type { ExerciseResponse } from '../types'
import { toast } from '@heroui/react'

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
					toast.success('Ejericio editado', {
						description: `El ejercicio "${data?.name}" fue editado con éxito.`,
					})

					onClose()
				},
				onError: () => {
					toast.danger('Error al editar ejercicio', {
						description: `No se pudo editar el ejercicio. Inténtalo de nuevo.`,
					})
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

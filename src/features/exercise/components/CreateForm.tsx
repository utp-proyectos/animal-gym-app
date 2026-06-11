import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createSchema, type CreateInput, type CreateOutput } from '../schema/exerciseSchema'
import ExerciseForm from './ExerciseForm'
import { useCreateExercise } from '../hooks/useExercises'

interface CreateFormProps {
	onClose: () => void
}

const CreateForm = ({ onClose }: CreateFormProps) => {
	const { mutate } = useCreateExercise()

	const form = useForm<CreateInput, unknown, CreateOutput>({
		resolver: zodResolver(createSchema),
		defaultValues: {
			name: '',
			description: '',
			muscleGroup: '',
			equipment: '',
		},
	})

	const onSubmit = (data: CreateOutput) => {
		mutate(data, {
			onSuccess: () => {
				console.log('Ejercicio creado con éxito en Spring Boot', data)
				onClose()
			},
			onError: (error) => {
				console.error('Error al guardar en el backend:', error)
			},
		})
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

export default CreateForm

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createSchema, type CreateInput, type CreateOutput } from '../schema/exerciseSchema'
import ExerciseForm from './ExerciseForm'
import { useCreateExercise } from '../hooks/useExercises'
import { toast } from '@heroui/react'

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
				toast.success('Ejercicio creada', {
					description: `El ejercicio "${data?.name}" fue creada con éxito.`,
				})

				onClose()
			},
			onError: () => {
				toast.danger('Error al crear ejercicio', {
					description: `No se pudo crear el ejercicio. Inténtalo de nuevo.`,
				})
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

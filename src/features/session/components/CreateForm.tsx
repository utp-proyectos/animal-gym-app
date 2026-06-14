import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createSchema, type CreateInput, type CreateOutput } from '../schemas/sessionSchema'
import SessionForm from './SessionForm'
import { useCreateSession } from '../hooks/useSessions'
import { toast } from '@heroui/react'

interface CreateFormProps {
	onClose: () => void
}

const CreateForm = ({ onClose }: CreateFormProps) => {
	const { mutate } = useCreateSession()

	const form = useForm<CreateInput, unknown, CreateOutput>({
		resolver: zodResolver(createSchema),
		defaultValues: {
			name: '',
			description: '',
			goal: '',
			capacity: 0,
			intensity: null,
			employeeId: null,
			date: null,
			startTime: null,
			endTime: null,
			image: null,
		},
	})

	const onSubmit = (data: CreateOutput) => {
		mutate(data, {
			onSuccess: () => {
				toast.success('Clase creada', {
					description: `La clase "${data?.name}" fue creada con éxito.`,
				})

				onClose()
			},
			onError: () => {
				toast.danger('Error al crear clase', {
					description: `No se pudo crear la clase. Inténtalo de nuevo.`,
				})
			},
		})
	}

	return (
		<FormProvider {...form}>
			<form
				id="session-form"
				className="flex flex-col gap-4"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<SessionForm />
			</form>
		</FormProvider>
	)
}

export default CreateForm

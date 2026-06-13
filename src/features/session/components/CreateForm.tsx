import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createSchema, type CreateInput, type CreateOutput } from '../schemas/sessionSchema'
import SessionForm from './SessionForm'
import { useCreateSession } from '../hooks/useSessions'

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
			employeeId: 0,
			date: null,
			startTime: null,
			endTime: null,
			image: null,
		},
	})

	const onSubmit = (data: CreateOutput) => {
		mutate(data, {
			onSuccess: () => {
				console.log('Clase creado con éxito', data)
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

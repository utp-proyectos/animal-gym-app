import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editSchema, type EditInput, type EditOutput } from '../schemas/sessionSchema'
import SessionForm from './SessionForm'
import { useUpdateSession } from '../hooks/useSessions'
import type { SessionResponse } from '../types'
import { parseDate, parseTime } from '@internationalized/date'
import { toast } from '@heroui/react'

interface EditFormProps {
	item: SessionResponse
	onClose: () => void
}

type IntensityOption = 'Baja' | 'Media' | 'Alta'

const EditForm = ({ item, onClose }: EditFormProps) => {
	const { mutate } = useUpdateSession()

	const formatInitialValues = (
		session: SessionResponse,
	): EditInput & { imageUrl?: string | null } => {
		return {
			id: session.id,
			name: session.name,
			description: session.description,
			goal: session.goal,
			capacity: session.capacity,
			employeeId: session.employee?.id ?? 0,
			intensity: session.intensity as IntensityOption,
			date: session.date ? parseDate(session.date) : null,
			startTime: session.startTime ? parseTime(session.startTime.substring(0, 5)) : null,
			endTime: session.endTime ? parseTime(session.endTime.substring(0, 5)) : null,
			image: null,
			imageUrl: session.image,
		}
	}

	const form = useForm<EditInput, unknown, EditOutput>({
		resolver: zodResolver(editSchema),
		defaultValues: formatInitialValues(item),
	})

	const onSubmit = (data: EditOutput) => {
		mutate(
			{ id: data.id, payload: data },
			{
				onSuccess: () => {
					toast.success('Clase editada', {
						description: `La clase "${data?.name}" fue editada con éxito.`,
					})

					onClose()
				},
				onError: () => {
					toast.danger('Error al editar clase', {
						description: `No se pudo editar la clase. Inténtalo de nuevo.`,
					})
				},
			},
		)
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

export default EditForm

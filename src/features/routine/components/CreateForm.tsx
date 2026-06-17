import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import {
	createSchema,
	type CreateInput,
	type CreateOutput,
} from '../../routine/schema/routineSchema'
import RoutineForm from '@/features/routine/components/RoutineForm'
import { useCreateRoutine } from '@/features/routine/hooks/useRoutines'
import { toast } from '@heroui/react'
import type { RoutineRequest } from '@/features/routine/types'

interface CreateFormProps {
	onClose: () => void
}

const CreateForm = ({ onClose }: CreateFormProps) => {
	const { partnerId } = useParams<{ partnerId: string }>()

	const { mutate } = useCreateRoutine()

	const form = useForm<CreateInput, unknown, CreateOutput>({
		resolver: zodResolver(createSchema),
		defaultValues: {
			name: '',
			description: '',
			goal: '',
			dateRange: null,
			employeeId: null,
		},
	})

	const onSubmit = (data: CreateOutput) => {
		const { dateRange, ...rest } = data

		const payload: RoutineRequest = {
			...rest,
			startDate: dateRange!.start.toString(),
			endDate: dateRange!.end.toString(),
			partnerId: Number(partnerId),
		}

		mutate(payload, {
			onSuccess: () => {
				toast.success('Rutina creada', {
					description: `La rutina "${data?.name}" fue asignada con éxito al socio.`,
				})
				onClose()
			},
			onError: () => {
				toast.danger('Error al crear rutina', {
					description: `No se pudo guardar la rutina. Inténtalo de nuevo.`,
				})
			},
		})
	}

	return (
		<FormProvider {...form}>
			<form
				id="routine-form"
				className="flex flex-col gap-4"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<RoutineForm />
			</form>
		</FormProvider>
	)
}

export default CreateForm

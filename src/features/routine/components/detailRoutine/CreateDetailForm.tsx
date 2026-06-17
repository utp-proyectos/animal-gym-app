import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from '@heroui/react'

import RoutineDetailForm from './RoutineDetailForm'
import { useCreateRoutineDetail } from '@/features/routine/hooks/useRoutines'
import type { RoutineDetailRequest } from '@/features/routine/types'
import { createSchema, type CreateInput, type CreateOutput } from '../../schema/routineDetailSchema'

interface CreateDetailFormProps {
	onClose: () => void
	routineId: number
}

const CreateDetailForm = ({ onClose, routineId }: CreateDetailFormProps) => {
	const { partnerId } = useParams<{ partnerId: string }>()

	const { mutate } = useCreateRoutineDetail()

	const form = useForm<CreateInput, unknown, CreateOutput>({
		resolver: zodResolver(createSchema),
		defaultValues: {
			dayOfWeek: null,
			sets: 0,
			reps: 0,
			weight: 0,
			calories: 0,
			restTime: 0,
			exerciseId: null,
		},
	})

	const onSubmit = (data: CreateOutput) => {
		const payload: RoutineDetailRequest = {
			...data,
			routineId: routineId,
			partnerId: Number(partnerId),
		}

		console.log(payload)

		mutate(payload, {
			onSuccess: () => {
				toast.success('Ejercicio asignado', {
					description: 'El detalle de la rutina fue guardado con éxito.',
				})
				onClose()
			},
			onError: () => {
				toast.danger('Error al asignar ejercicio', {
					description: 'No se pudo guardar el detalle. Inténtalo de nuevo.',
				})
			},
		})
	}

	return (
		<FormProvider {...form}>
			<form
				id="routine-detail-form"
				className="flex flex-col gap-4"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<RoutineDetailForm />
			</form>
		</FormProvider>
	)
}

export default CreateDetailForm

import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from '@heroui/react'

import RoutineDetailForm from './RoutineDetailForm'
import { useUpdateRoutineDetail } from '@/features/routine/hooks/useRoutines'
import type { RoutineDetailRequest } from '@/features/routine/types'
import type { DetailInfo } from '@/features/partner/types'
import { editSchema, type EditInput, type EditOutput } from '../../schema/routineDetailSchema'

interface EditDetailFormProps {
	item: DetailInfo
	onClose: () => void
	routineId: number
}

type DaysOfWeekOption =
	| 'Lunes'
	| 'Martes'
	| 'Miércoles'
	| 'Jueves'
	| 'Viernes'
	| 'Sábado'
	| 'Domingo'

const EditDetailForm = ({ item, onClose, routineId }: EditDetailFormProps) => {
	const { partnerId } = useParams<{ partnerId: string }>()

	const { mutate } = useUpdateRoutineDetail()

	const formatInitialValues = (d: DetailInfo): EditInput => {
		return {
			id: d.id,
			dayOfWeek: d.dayOfWeek as DaysOfWeekOption,
			sets: d.sets,
			reps: d.reps,
			weight: d.weight,
			calories: d.calories ?? 0,
			restTime: d.restTime,
			exerciseId: d.exercise?.id ?? null,
		}
	}

	const form = useForm<EditInput, unknown, EditOutput>({
		resolver: zodResolver(editSchema),
		defaultValues: formatInitialValues(item),
	})

	const onSubmit = (data: EditOutput) => {
		const payload: RoutineDetailRequest = {
			dayOfWeek: data.dayOfWeek,
			sets: data.sets,
			reps: data.reps,
			weight: data.weight,
			calories: data.calories,
			restTime: data.restTime,
			exerciseId: data.exerciseId!,
			routineId: routineId,
			partnerId: Number(partnerId),
		}

		mutate(
			{ detailId: data.id, payload },
			{
				onSuccess: () => {
					toast.success('Detalle rutina actualizada', {
						description: 'Los parámetros del detalle fueron modificados con éxito.',
					})
					onClose()
				},
				onError: () => {
					toast.danger('Error al editar el detalle rutina', {
						description: 'No se pudieron guardar los cambios. Inténtalo de nuevo.',
					})
				},
			},
		)
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

export default EditDetailForm

import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { parseDate } from '@internationalized/date'
import { toast } from '@heroui/react'

import { editSchema, type EditInput, type EditOutput } from '../../routine/schema/routineSchema'
import RoutineForm from '@/features/routine/components/RoutineForm'
import { useUpdateRoutine } from '@/features/routine/hooks/useRoutines'
import type { RoutineRequest } from '@/features/routine/types'
import type { RoutineInfo } from '@/features/partner/types'

interface EditFormProps {
	item: RoutineInfo
	onClose: () => void
}

const EditForm = ({ item, onClose }: EditFormProps) => {
	const { partnerId } = useParams<{ partnerId: string }>()
	const { mutate } = useUpdateRoutine()

	const formatInitialValues = (r: RoutineInfo): EditInput => {
		return {
			id: r.id,
			name: r.name,
			description: r.description,
			goal: r.goal,
			employeeId: r.employee?.id ?? null,
			dateRange:
				r.startDate && r.endDate
					? {
							start: parseDate(r.startDate.toString()),
							end: parseDate(r.endDate.toString()),
						}
					: null,
		}
	}

	const form = useForm<EditInput, unknown, EditOutput>({
		resolver: zodResolver(editSchema),
		defaultValues: formatInitialValues(item),
	})

	const onSubmit = (data: EditOutput) => {
		const { dateRange, ...rest } = data

		const payload: RoutineRequest = {
			...rest,
			startDate: dateRange!.start.toString(),
			endDate: dateRange!.end.toString(),
			partnerId: Number(partnerId),
		}

		mutate(
			{ id: data.id, payload },
			{
				onSuccess: () => {
					toast.success('Rutina editada', {
						description: `La rutina "${data?.name}" fue actualizada con éxito.`,
					})
					onClose()
				},
				onError: () => {
					toast.danger('Error al editar rutina', {
						description: `No se pudo guardar los cambios. Inténtalo de nuevo.`,
					})
				},
			},
		)
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

export default EditForm

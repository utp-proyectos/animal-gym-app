import { toast } from '@heroui/react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { parseDate } from '@internationalized/date'
import { editSchema, type EditInput, type EditOutput } from '../schema/membershipSchema'
import { useUpdateMembership } from '../hooks/useMemberships'
import MembershipForm from './MembershipForm'
import type { MembershipReponse } from '../types'
import type { AxiosError } from 'axios'
import { useEffect } from 'react'

interface Props {
	onClose: () => void
	membership: MembershipReponse | null
	onPendingChange?: (pending: boolean) => void
}

const formatInitialValues = (membership: MembershipReponse): EditInput => ({
	id: membership.id,
	name: membership.name,
	description: membership.description ?? '',
	duration: membership.duration,
	price: membership.price,
	discountPrice: membership.discountPrice ?? null,
	offerStartDate: membership.offerStartDate ? parseDate(membership.offerStartDate) : null,
	offerEndDate: membership.offerEndDate ? parseDate(membership.offerEndDate) : null,
	status: membership.status,
	capacityLimit: membership.capacityLimit,
	image: null,
})

const EditForm = ({ onClose, membership, onPendingChange }: Props) => {
	const { mutate, isPending } = useUpdateMembership()

	useEffect(() => {
		onPendingChange?.(isPending)
		return () => onPendingChange?.(false)
	}, [isPending, onPendingChange])

	const form = useForm<EditInput, unknown, EditOutput>({
		resolver: zodResolver(editSchema),
		defaultValues: membership ? formatInitialValues(membership) : undefined,
	})

	const onSubmit = (data: EditOutput) => {
		mutate(
			{ id: data.id, payload: data },
			{
				onSuccess: () => {
					toast.success('Membresía actualizada', {
						description: `La membresía "${data.name}" fue actualizada con éxito.`,
					})
					onClose()
				},
				onError: (error) => {
					const axiosError = error as AxiosError<{
						message?: string
						data?: Record<string, string>
					}>
					const response = axiosError.response?.data
					const validationMessage = Object.values(response?.data ?? {})[0]
					toast.danger('Error al editar membresía', {
						description:
							validationMessage ??
							response?.message ??
							'No se pudo actualizar la membresía. Inténtalo de nuevo.',
					})
				},
			},
		)
	}

	return (
		<FormProvider {...form}>
			<form
				id="membership-form"
				className="flex flex-col gap-4"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<MembershipForm isEditing currentImageUrl={membership?.image} />
			</form>
		</FormProvider>
	)
}

export default EditForm

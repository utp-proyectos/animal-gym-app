import { toast } from '@heroui/react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { parseDate } from '@internationalized/date'
import { editSchema, type EditInput, type EditOutput } from '../schema/membershipSchema'
import { useUpdateMembership } from '../hooks/useMemberships'
import MembershipForm from './MembershipForm'
import type { MembershipReponse } from '../types'

interface Props {
	onClose: () => void
	membership: MembershipReponse | null
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

const EditForm = ({ onClose, membership }: Props) => {
	const { mutate } = useUpdateMembership()

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
				onError: () => {
					toast.danger('Error al editar membresía', {
						description: 'No se pudo actualizar la membresía. Inténtalo de nuevo.',
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

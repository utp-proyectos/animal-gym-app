import { useEffect } from 'react'
import { toast } from '@heroui/react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { parseDate } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'
import {
	editPartnerSchema,
	type EditPartnerInput,
	type EditPartnerOutput,
} from '../schema/partnerSchema'
import { useUpdatePartner, useUploadPartnerAvatar } from '../hooks/usePartners'
import type { PartnerDetailResponse } from '../types'
import PartnerForm from './PartnerForm'

const toDateValue = (dateStr: string | null | undefined): DateValue | null => {
	if (!dateStr) return null
	try {
		return parseDate(dateStr)
	} catch {
		return null
	}
}

function buildDefaultValues(partner: PartnerDetailResponse): EditPartnerInput {
	return {
		id: partner.id,
		firstName: partner.firstName,
		lastName: partner.lastName,
		dni: partner.dni,
		phoneNumber: partner.phoneNumber,
		email: partner.email,
		gender: partner.gender ?? null,
		birthDate: toDateValue(partner.birthDate),
		hireDate: toDateValue(partner.hireDate),
		weight: partner.weight ?? undefined,
		height: partner.height ?? undefined,
		membershipId: partner.membershipId ?? null,
		password: '',
		avatar: null,
	}
}

interface Props {
	partner: PartnerDetailResponse
	onClose: () => void
}

const PartnerEditForm = ({ partner, onClose }: Props) => {
	const { mutateAsync: updatePartner } = useUpdatePartner()
	const { mutateAsync: uploadAvatar } = useUploadPartnerAvatar()

	const form = useForm<EditPartnerInput, unknown, EditPartnerOutput>({
		resolver: zodResolver(editPartnerSchema),
		defaultValues: buildDefaultValues(partner),
	})

	useEffect(() => {
		form.reset(buildDefaultValues(partner))
	}, [partner.id]) // eslint-disable-line react-hooks/exhaustive-deps

	const onSubmit = async (data: EditPartnerOutput) => {
		const { id, avatar, ...rest } = data
		const request = { ...rest, image: partner.image }

		try {
			await updatePartner({ id, payload: request })

			if (avatar) {
				await uploadAvatar({ id, file: avatar })
			}

			toast.success('Socio actualizado', {
				description: `Los datos de ${data.firstName} ${data.lastName} fueron actualizados.`,
			})

			onClose()
		} catch {
			toast.danger('Error al actualizar', {
				description: 'No se pudieron guardar los cambios. Inténtalo de nuevo.',
			})
		}
	}

	return (
		<FormProvider {...form}>
			<form
				id="partner-form"
				className="flex flex-col gap-4"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<PartnerForm isEditing currentImageUrl={partner.image} />
			</form>
		</FormProvider>
	)
}

export default PartnerEditForm

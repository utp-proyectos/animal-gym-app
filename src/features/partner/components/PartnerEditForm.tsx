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
import type { AxiosError } from 'axios'

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
		password: '',
		avatar: null,
	}
}

interface Props {
	partner: PartnerDetailResponse
	onClose: () => void
	onPendingChange?: (pending: boolean) => void
}

const PartnerEditForm = ({ partner, onClose, onPendingChange }: Props) => {
	const { mutateAsync: updatePartner, isPending: isUpdating } = useUpdatePartner()
	const { mutateAsync: uploadAvatar, isPending: isUploading } = useUploadPartnerAvatar()
	const isPending = isUpdating || isUploading

	useEffect(() => {
		onPendingChange?.(isPending)
		return () => onPendingChange?.(false)
	}, [isPending, onPendingChange])

	const form = useForm<EditPartnerInput, unknown, EditPartnerOutput>({
		resolver: zodResolver(editPartnerSchema),
		defaultValues: buildDefaultValues(partner),
	})

	useEffect(() => {
		form.reset(buildDefaultValues(partner))
	}, [partner.id]) // eslint-disable-line react-hooks/exhaustive-deps

	const onSubmit = async (data: EditPartnerOutput) => {
		const { id, avatar, ...rest } = data
		const request = { ...rest, image: partner.avatar }

		try {
			await updatePartner({ id, payload: request })

			if (avatar) {
				await uploadAvatar({ id, file: avatar })
			}

			toast.success('Socio actualizado', {
				description: `Los datos de ${data.firstName} ${data.lastName} fueron actualizados.`,
			})

			onClose()
		} catch (error) {
			const axiosError = error as AxiosError<{ message?: string }>
			const status = axiosError.response?.status
			const message = axiosError.response?.data?.message

			if (status === 409 && message) {
				const lower = message.toLowerCase()
				if (lower.includes('dni')) form.setError('dni', { type: 'manual', message })
				else if (lower.includes('correo')) form.setError('email', { type: 'manual', message })
				else if (lower.includes('teléfono')) {
					form.setError('phoneNumber', { type: 'manual', message })
				} else toast.danger('No se pudo actualizar el socio', { description: message })
			} else {
				toast.danger('Error al actualizar', {
					description: message ?? 'No se pudieron guardar los cambios. Inténtalo de nuevo.',
				})
			}
		}
	}

	return (
		<FormProvider {...form}>
			<form
				id="partner-form"
				className="flex flex-col gap-4"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<PartnerForm isEditing currentImageUrl={partner.avatar} />
			</form>
		</FormProvider>
	)
}

export default PartnerEditForm

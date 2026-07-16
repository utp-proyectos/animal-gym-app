import { toast } from '@heroui/react'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	CREATE_PARTNER_DEFAULTS,
	createPartnerSchema,
	type CreatePartnerInput,
	type CreatePartnerOutput,
} from '../schema/partnerSchema'
import { useCreatePartner, useUploadPartnerAvatar } from '../hooks/usePartners'
import PartnerForm from './PartnerForm'
import type { AxiosError } from 'axios'

interface Props {
	onClose: () => void
	onPendingChange?: (pending: boolean) => void
}

const PartnerCreateForm = ({ onClose, onPendingChange }: Props) => {
	const { mutateAsync: createPartner, isPending: isCreating } = useCreatePartner()
	const { mutateAsync: uploadAvatar, isPending: isUploading } = useUploadPartnerAvatar()
	const isPending = isCreating || isUploading

	useEffect(() => {
		onPendingChange?.(isPending)
		return () => onPendingChange?.(false)
	}, [isPending, onPendingChange])

	const form = useForm<CreatePartnerInput, unknown, CreatePartnerOutput>({
		resolver: zodResolver(createPartnerSchema),
		defaultValues: CREATE_PARTNER_DEFAULTS,
	})

	const onSubmit = async (data: CreatePartnerOutput) => {
		const { avatar, ...request } = data

		try {
			const created = await createPartner(request)

			if (avatar) {
				await uploadAvatar({ id: created.id, file: avatar })
			}

			toast.success('Socio registrado', {
				description: `${data.firstName} ${data.lastName} fue registrado con éxito.`,
			})

			onClose()
			form.reset()
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
				} else toast.danger('No se pudo registrar el socio', { description: message })
			} else {
				toast.danger('Error al registrar', {
					description: message ?? 'No se pudo registrar el socio. Inténtalo de nuevo.',
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
				<PartnerForm />
			</form>
		</FormProvider>
	)
}

export default PartnerCreateForm

import { toast } from '@heroui/react'
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

interface Props {
	onClose: () => void
}

const PartnerCreateForm = ({ onClose }: Props) => {
	const { mutateAsync: createPartner } = useCreatePartner()
	const { mutateAsync: uploadAvatar } = useUploadPartnerAvatar()

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
		} catch {
			toast.danger('Error al registrar', {
				description: 'No se pudo registrar el socio. Inténtalo de nuevo.',
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
				<PartnerForm />
			</form>
		</FormProvider>
	)
}

export default PartnerCreateForm

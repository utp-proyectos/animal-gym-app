import { toast } from '@heroui/react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createSchema, type CreateInput, type CreateOutput } from '../schema/membershipSchema'
import { useCreateMembership } from '../hooks/useMemberships'
import MembershipForm from './MembershipForm'

interface Props {
	onClose: () => void
}

const CreateForm = ({ onClose }: Props) => {
	const { mutate } = useCreateMembership()

	const form = useForm<CreateInput, unknown, CreateOutput>({
		resolver: zodResolver(createSchema),
		defaultValues: {
			name: '',
			description: '',
			duration: 0,
			price: 0,
			discountPrice: null,
			offerStartDate: null,
			offerEndDate: null,
			status: true,
			capacityLimit: 1,
			image: null,
		},
	})

	const onSubmit = (data: CreateOutput) => {
		mutate(data, {
			onSuccess: () => {
				toast.success('Membresía creada', {
					description: `La membresía "${data.name}" fue creada con éxito.`,
				})
				onClose()
			},
			onError: () => {
				toast.danger('Error al crear membresía', {
					description: 'No se pudo crear la membresía. Inténtalo de nuevo.',
				})
			},
		})
	}

	return (
		<FormProvider {...form}>
			<form
				id="membership-form"
				className="flex flex-col gap-4"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<MembershipForm />
			</form>
		</FormProvider>
	)
}

export default CreateForm

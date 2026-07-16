import { toast } from '@heroui/react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createSchema, type CreateInput, type CreateOutput } from '../schema/membershipSchema'
import { useCreateMembership } from '../hooks/useMemberships'
import MembershipForm from './MembershipForm'
import type { AxiosError } from 'axios'
import { useEffect } from 'react'

interface Props {
	onClose: () => void
	onPendingChange?: (pending: boolean) => void
}

const CreateForm = ({ onClose, onPendingChange }: Props) => {
	const { mutate, isPending } = useCreateMembership()

	useEffect(() => {
		onPendingChange?.(isPending)
		return () => onPendingChange?.(false)
	}, [isPending, onPendingChange])

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
			onError: (error) => {
				const axiosError = error as AxiosError<{
					message?: string
					data?: Record<string, string>
				}>
				const response = axiosError.response?.data
				const validationMessage = Object.values(response?.data ?? {})[0]
				toast.danger('Error al crear membresía', {
					description:
						validationMessage ??
						response?.message ??
						'No se pudo crear la membresía. Inténtalo de nuevo.',
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

import { toast } from '@heroui/react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createSchema, type CreateInput, type CreateOutput } from '../schema/employeeSchema'
import { useCreateEmployee } from '../hooks/useEmployees'
import EmployeeForm from './EmployeeForm'
import type { AxiosError } from 'axios'
import { useEffect } from 'react'

interface Props {
	onClose: () => void
	onPendingChange?: (pending: boolean) => void
}

const CreateForm = ({ onClose, onPendingChange }: Props) => {
	const { mutate, isPending } = useCreateEmployee()
	useEffect(() => {
		onPendingChange?.(isPending)
	}, [isPending, onPendingChange])

	const form = useForm<CreateInput, unknown, CreateOutput>({
		resolver: zodResolver(createSchema),
		defaultValues: {
			dni: '',
			firstName: '',
			lastName: '',
			phoneNumber: '',
			email: '',
			gender: null,
			birthDate: null,
			hireDate: null,
			salary: 0,
			contractType: null,
			specialty: null,
			role: null,
			password: '',
			avatar: null,
		},
	})

	const onSubmit = (data: CreateOutput) => {
		mutate(data, {
			onSuccess: (response) => {
				toast.success('Empleado creado', {
					description: `El empleado ${data.lastName} fue creado con éxito`,
				})
				onClose()
				console.log(response)
			},
			onError: (error) => {
				const axiosError = error as AxiosError<{ message?: string }>
				const status = axiosError.response?.status
				const message = axiosError.response?.data?.message

				if (status === 409 && message) {
					const lower = message.toLowerCase()

					if (lower.includes('dni')) {
						form.setError('dni', { type: 'manual', message })
					} else if (lower.includes('correo')) {
						form.setError('email', { type: 'manual', message })
					} else if (lower.includes('teléfono')) {
						form.setError('phoneNumber', { type: 'manual', message })
					} else {
						toast.danger('No se pudo crear el empleado', { description: message })
					}
				} else {
					toast.danger('Error al crear el empleado', {
						description: message ?? 'No se pudo crear el empleado. Inténtelo de nuevo',
					})
				}
			},
		})
	}

	return (
		<FormProvider {...form}>
			<form id="form-modal-s" onSubmit={form.handleSubmit(onSubmit)}>
				<EmployeeForm />
			</form>
		</FormProvider>
	)
}

export default CreateForm

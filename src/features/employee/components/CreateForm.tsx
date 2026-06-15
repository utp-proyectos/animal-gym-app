import { toast } from '@heroui/react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createSchema, type CreateInput, type CreateOutput } from '../schema/employeeSchema'
import { useCreateEmployee } from '../hooks/useEmployees'
import EmployeeForm from './EmployeeForm'

interface Props {
	onClose: () => void
}

const CreateForm = ({ onClose }: Props) => {
	const { mutate } = useCreateEmployee()

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
					description: `El empleado ${data.lastName} fue creado con exito`,
				})
				console.log('Registro creado exitosamente ' + response)
				onClose()
			},
			onError: (error) => {
				toast.danger(`Error al crear el empleado`, {
					description: `Nose puede creado el empleado. Intenelo denuevo`,
				})
				console.error('Error al guardar el backend' + error)
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

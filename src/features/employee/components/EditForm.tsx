import { toast } from '@heroui/react'

import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { parseDate } from '@internationalized/date'
import { editSchema, type EditInput, type EditOutput } from '../schema/employeeSchema'
import { useUpdateEmployee } from '../hooks/useEmployees'
import EmployeeForm from './EmployeeForm'
import type { EmployeeDetailResponse } from '../types'
import type { AxiosError } from 'axios'
import { useEffect } from 'react'

interface Props {
	onClose: () => void
	employee: EmployeeDetailResponse | null
	onPendingChange?: (pending: boolean) => void
}

const formatInitialValues = (
	employee: EmployeeDetailResponse,
): EditInput & { avatarUrl?: string | null } => {
	return {
		id: employee.id,
		dni: employee.dni,
		firstName: employee.firstName,
		lastName: employee.lastName,
		phoneNumber: employee.phoneNumber,
		email: employee.email,
		gender: employee.gender,
		contractType: employee.contractType,
		specialty: employee.specialty,
		role: employee.role,
		birthDate: employee.birthDate ? parseDate(employee.birthDate) : null,
		hireDate: employee.hireDate ? parseDate(employee.hireDate) : null,
		salary: employee.salary,
		avatar: null,
		avatarUrl: employee.avatar,
	}
}

const EditForm = ({ onClose, employee, onPendingChange }: Props) => {
	const { mutate, isPending } = useUpdateEmployee()
	useEffect(() => {
		onPendingChange?.(isPending)
	}, [isPending, onPendingChange])

	const form = useForm<EditInput, unknown, EditOutput>({
		resolver: zodResolver(editSchema),
		defaultValues: employee ? formatInitialValues(employee) : undefined,
	})

	const onSubmit = (data: EditOutput) => {
		mutate(
			{ id: data.id, payload: data },
			{
				onSuccess: (response) => {
					toast.success(`Empleado editado`, {
						description: `El empleado ${data.firstName} fue editado con exito`,
					})
					console.log('Editado correctamente', response)
					onClose()
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
							toast.danger('No se pudo actualizar el empleado', { description: message })
						}
					} else if (status === 404) {
						toast.danger('Empleado no encontrado', {
							description: 'Es posible que el registro haya sido eliminado',
						})
					} else {
						toast.danger('Error al actualizar el empleado', {
							description: message ?? 'No se pudo actualizar. Inténtelo de nuevo',
						})
					}
				},
			},
		)
	}

	return (
		<FormProvider {...form}>
			<form className="space-y-8 h-full" id="form-modal-s" onSubmit={form.handleSubmit(onSubmit)}>
				<EmployeeForm isEditing />
			</form>
		</FormProvider>
	)
}

export default EditForm

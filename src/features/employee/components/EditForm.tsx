import { toast } from '@heroui/react'

import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { parseDate } from '@internationalized/date'
import { editSchema, type EditInput, type EditOutput } from '../schema/employeeSchema'
import { useUpdateEmployee } from '../hooks/useEmployees'
import EmployeeForm from './EmployeeForm'
import type { EmployeeDetailResponse } from '../types'

interface Props {
	onClose: () => void
	employee: EmployeeDetailResponse | null
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

const EditForm = ({ onClose, employee }: Props) => {
	const { mutate } = useUpdateEmployee()

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
					toast.danger('Error al editar empleado', {
						description: `No se pudo editar el empleado. Intentelo denuevo`,
					})
					console.error('Error al guardar en el backend' + error)
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

import { Button, Modal } from '@heroui/react'
import { UserPen } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { parseDate } from '@internationalized/date'
import { editSchema, type EditInput, type EditOutput } from '../schema/employeeSchema'
import { useUpdateEmployee } from '../hooks/useEmployees'
import EmployeeForm from './EmployeeForm'
import type { EmployeeDetailResponse } from '../types'

interface Props {
	isOpen: boolean
	onOpenChange: (open: boolean) => void
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

const EditForm = ({ isOpen, onOpenChange, employee }: Props) => {
	const { mutate } = useUpdateEmployee()

	const form = useForm<EditInput, unknown, EditOutput>({
		resolver: zodResolver(editSchema),
		defaultValues: employee ? formatInitialValues(employee) : undefined,
	})

	const onSubmit = (data: EditOutput) => {
		mutate({ id: data.id, payload: data }, { onSuccess: () => onOpenChange(false) })
	}

	return (
		<Modal>
			<Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
				<Modal.Container size="cover">
					<Modal.Dialog>
						<Modal.CloseTrigger />

						<Modal.Header className="pb-4">
							<Modal.Heading className="text-4xl font-black tracking-tight uppercase text-black">
								Editar empleado
							</Modal.Heading>
							<p className="text-sm text-default-500">Modifica la información del empleado.</p>
						</Modal.Header>

						<Modal.Body className="overflow-y-auto py-4 h-[calc(100vh-120px)] md:h-full">
							<FormProvider {...form}>
								<form
									className="space-y-8 h-full"
									id="form-modal-s"
									onSubmit={form.handleSubmit(onSubmit)}
								>
									<EmployeeForm isEditing />
								</form>
							</FormProvider>
						</Modal.Body>

						<Modal.Footer className="pt-4">
							<Button type="reset" variant="secondary" slot="close">
								Cancelar
							</Button>
							<Button type="submit" form="form-modal-s">
								<UserPen className="size-4" />
								Guardar cambios
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	)
}

export default EditForm

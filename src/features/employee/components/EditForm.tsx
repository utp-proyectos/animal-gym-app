import { Button, Modal } from '@heroui/react'
import { UserPen } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editSchema, type EditInput, type EditOutput } from '../schema/employeeSchema'
import { useUpdateEmployee } from '../hooks/useEmployees'
import EmployeeForm from './EmployeeForm'

interface Item {
	dni: string
	firstName: string
	lastName: string
	phoneNumber: string
	email: string
	gender: 'Masculino' | 'Femenino' | 'Otro'
	birthDate: string
	hireDate: string
	salary: number
	contractType: 'Tiempo completo' | 'Medio tiempo'
	specialty: 'Brazos' | 'Piernas' | 'Danzas' | 'Biceps'
	role: 'Admin' | 'Entrenador' | 'Recepcionista'
	id: number
	avatar?: string | File | null | undefined
}
interface EditFormProps {
	item: Item
	onClose: () => void
}

const EditForm = ({ item, onClose }: EditFormProps) => {
	const { mutate } = useUpdateEmployee()
	const form = useForm<EditInput, unknown, EditOutput>({
		resolver: zodResolver(editSchema),
		defaultValues: item,
	})

	const onSubmit = (data: EditOutput) => {
		mutate({ id: data.id, payload: data })
		console.log(data)
		onClose()
	}
	console.log('form errors', form.formState.errors)

	return (
		<Modal
			defaultOpen
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose()
			}}
		>
			<Modal.Backdrop>
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

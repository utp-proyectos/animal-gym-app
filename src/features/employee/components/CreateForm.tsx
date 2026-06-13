import { Button, Modal } from '@heroui/react'
import { UserPlus } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createSchema, type CreateInput, type CreateOutput } from '../schema/employeeSchema'
import { useCreateEmployee } from '../hooks/useEmployees'
import EmployeeForm from './EmployeeForm'

const CreateForm = ({ onClose }: { onClose: () => void }) => {
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
		mutate(data)
		console.log(data)
		onClose()
	}

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
								Nuevo empleado
							</Modal.Heading>
							<p className="text-sm text-default-500">
								Completa la información para registrar un nuevo empleado.
							</p>
						</Modal.Header>

						<Modal.Body className="overflow-y-auto py-4 h-[calc(100vh-120px)] md:h-full">
							<FormProvider {...form}>
								<form
									className="space-y-8 h-full"
									id="form-modal-s"
									onSubmit={form.handleSubmit(onSubmit)}
								>
									<EmployeeForm />
								</form>
							</FormProvider>
						</Modal.Body>

						<Modal.Footer className="pt-4">
							<Button type="reset" variant="secondary" slot="close">
								Cancelar
							</Button>
							<Button type="submit" form="form-modal-s">
								<UserPlus className="size-4" />
								Guardar empleado
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	)
}

export default CreateForm

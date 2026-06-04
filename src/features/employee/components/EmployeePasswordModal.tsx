// src/components/ChangePasswordModal.tsx
import { Button, FieldError, Form, Input, Label, Modal, TextField } from '@heroui/react'
import { KeyRound } from 'lucide-react'

interface Props {
	onClose: () => void
}

export function EmployeePasswordModal({ onClose }: Props) {
	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		const newPassword = formData.get('newPassword')
		console.log('cambiar contraseña:', newPassword)
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
				<Modal.Container>
					<Modal.Dialog className="sm:max-w-md">
						<Modal.CloseTrigger />

						<Modal.Header>
							<div className="flex items-center gap-3">
								<div>
									<Modal.Heading className="text-2xl font-black tracking-tight uppercase text-black">
										Cambiar contraseña
									</Modal.Heading>
									<p className="text-sm text-default-500">Ingresa la nueva contraseña</p>
								</div>
							</div>
						</Modal.Header>

						<Modal.Body className="py-6">
							<Form id="form-password" className="flex flex-col gap-4" onSubmit={onSubmit}>
								<TextField isRequired name="newPassword" type="password" minLength={8}>
									<Label>Nueva contraseña</Label>
									<Input
										placeholder="Mínimo 8 caracteres"
										variant="secondary"
										autoComplete="new-password"
									/>
									<FieldError />
								</TextField>

								<TextField isRequired name="confirmPassword" type="password" minLength={8}>
									<Label>Confirmar contraseña</Label>
									<Input
										placeholder="Repite la contraseña"
										variant="secondary"
										autoComplete="new-password"
									/>
									<FieldError />
								</TextField>
							</Form>
						</Modal.Body>

						<Modal.Footer className=" pt-4">
							<Button variant="secondary" slot="close">
								Cancelar
							</Button>
							<Button type="submit" form="form-password">
								<KeyRound className="size-4" />
								Guardar
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	)
}

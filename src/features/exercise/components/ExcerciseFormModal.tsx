import { Button, Input, Label, Modal, Surface, TextField } from '@heroui/react'
import { UserPlus } from 'lucide-react'

interface Props {
	onClose: () => void
}

export function ExcerciseFormModal({ onClose }: Props) {
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

						<Modal.Header className="pb-4">
							<Modal.Heading className="text-4xl font-black tracking-tight uppercase text-black">
								Nuevo ejercicio
							</Modal.Heading>
							<p className="text-sm text-default-500">
								Completa la información para registrar un nuevo ejercicio.
							</p>
						</Modal.Header>

						<Modal.Body className="p-6">
							<Surface variant="default">
								<form className="flex flex-col gap-4">
									<TextField className="w-full" variant="secondary">
										<Label>Nombre</Label>
										<Input placeholder="Ej. Curl de bíceps" />
									</TextField>
									<TextField className="w-full" variant="secondary">
										<Label>Descripción</Label>
										<Input placeholder="Ej. Ejercicio de fuerza" />
									</TextField>
									<TextField className="w-full" variant="secondary">
										<Label>Grupo muscular</Label>
										<Input placeholder="Ej. Bíceps" />
									</TextField>
									<TextField className="w-full" variant="secondary">
										<Label>Equipo</Label>
										<Input placeholder="Ej. Mancuernas" />
									</TextField>
								</form>
							</Surface>
						</Modal.Body>

						<Modal.Footer className="pt-4">
							<Button type="reset" variant="secondary" slot="close">
								Cancelar
							</Button>
							<Button type="submit" form="form-modal-s">
								<UserPlus className="size-4" />
								Guardar ejercicio
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	)
}

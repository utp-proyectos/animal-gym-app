import { Button, Modal } from '@heroui/react'
import { Trash2 } from 'lucide-react'
import type { EmployeeDetailResponse } from '../types'

interface Props {
	isOpen: boolean
	onOpenChange: (open: boolean) => void
	employee: EmployeeDetailResponse | null
	title?: string
	description?: string
	onConfirm: () => void
}

export function EmployeeDeleteModal({
	isOpen,
	onOpenChange,
	employee,
	title = 'Eliminar registro',
	description = '¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.',
	onConfirm,
}: Props) {
	return (
		<Modal>
			<Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
				<Modal.Container>
					<Modal.Dialog className="sm:max-w-md">
						<Modal.CloseTrigger />

						<Modal.Header>
							<div className="flex items-center gap-3">
								<div>
									<Modal.Heading className="text-xl font-black tracking-tight uppercase text-black">
										{title}
									</Modal.Heading>
									<p className="text-sm text-default-500">{description}</p>
								</div>
							</div>
						</Modal.Header>

						<Modal.Footer className="pt-4">
							<Button variant="secondary" slot="close">
								Cancelar
							</Button>
							<Button
								className="bg-danger text-white"
								isDisabled={!employee}
								onPress={() => {
									if (!employee) return
									onConfirm()
									onOpenChange(false)
								}}
							>
								<Trash2 className="size-4" />
								Eliminar
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	)
}

import { AlertDialog, Button } from '@heroui/react'

interface Props {
	isOpen: boolean
	onOpenChange: (open: boolean) => void
	title?: string
	onConfirm: () => void
}

export function DeleteModal({ isOpen, onOpenChange, title, onConfirm }: Props) {
	return (
		<AlertDialog isOpen={isOpen} onOpenChange={onOpenChange}>
			<AlertDialog.Backdrop>
				<AlertDialog.Container>
					<AlertDialog.Dialog className="sm:max-w-100 bg-white">
						<AlertDialog.CloseTrigger />

						<AlertDialog.Header>
							<AlertDialog.Icon status="danger" />
							<AlertDialog.Heading className="text-xl font-black tracking-tight uppercase text-black">
								Eliminar {title}
							</AlertDialog.Heading>
						</AlertDialog.Header>

						<AlertDialog.Body>
							<p className="text-sm text-default-600">
								¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede
								deshacer.
							</p>
						</AlertDialog.Body>

						<AlertDialog.Footer className="pt-4">
							<Button slot="close" variant="tertiary">
								Cancel
							</Button>

							<Button
								variant="danger"
								onPress={() => {
									onConfirm()
									onOpenChange(false)
								}}
							>
								Eliminar {title}
							</Button>
						</AlertDialog.Footer>
					</AlertDialog.Dialog>
				</AlertDialog.Container>
			</AlertDialog.Backdrop>
		</AlertDialog>
	)
}

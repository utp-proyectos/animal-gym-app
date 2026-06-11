import { Modal, Button } from '@heroui/react'
import { AlertTriangle, Trash2 } from 'lucide-react'
import type { ExerciseResponse } from '../types'
import { useDeleteExercise } from '../hooks/useExercises'

interface DeleteModalProps {
	exercise: ExerciseResponse | null
	isOpen: boolean
	onOpenChange: (isOpen: boolean) => void
	onClose: () => void
}

export function DeleteForm({ exercise, isOpen, onOpenChange, onClose }: DeleteModalProps) {
	const { mutate } = useDeleteExercise()

	if (!exercise) return null

	const handleDelete = () => {
		mutate(exercise.id, {
			onSuccess: () => {
				console.log(`Ejercicio ${exercise.id} eliminado con éxito`)
				onClose()
			},
			onError: (error) => {
				console.error('Error al intentar eliminar el ejercicio:', error)
			},
		})
	}

	return (
		<Modal>
			<Modal.Backdrop variant="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
				<Modal.Container size="sm" placement="center">
					<Modal.Dialog className="rounded-3xl">
						<Modal.CloseTrigger />
						<Modal.Header>
							<Modal.Heading className="text-lg font-bold">Confirmar eliminación</Modal.Heading>
						</Modal.Header>

						<Modal.Body>
							<div className="text-center py-2">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-warning/10">
									<AlertTriangle size={34} className="text-warning" />
								</div>
								<h6 className="font-semibold text-black">
									¿Está seguro de que desea eliminar el ejercicio{' '}
									<span className="text-danger">"{exercise?.name}"</span>?
								</h6>
								<p className="text-default-500 text-sm mt-2">Esta acción no se puede deshacer.</p>
							</div>
						</Modal.Body>

						<Modal.Footer>
							<Button variant="outline" slot="close">
								Cancelar
							</Button>
							<Button variant="danger" onPress={handleDelete}>
								<Trash2 size={18} className="mr-2" />
								Eliminar
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	)
}

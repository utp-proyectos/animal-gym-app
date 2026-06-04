import type { Membership } from '../MembershipType';
import { Modal, Button } from '@heroui/react';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  membership: Membership | null;
  onConfirm: (id: number) => void;
}

export function MembershipDeleteModal({ isOpen, onOpenChange, membership, onConfirm }: Props) {
  const handleConfirm = () => {
    if (membership) onConfirm(membership.id);
    onOpenChange(false);
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
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
                  ¿Está seguro de que desea eliminar la membresía{' '}
                  <span className="text-danger">"{membership?.nombre}"</span>?
                </h6>
                <p className="text-default-500 text-sm mt-2">
                  Esta acción no se puede deshacer y afectará a los socios asociados.
                </p>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="outline" slot="close">
                Cancelar
              </Button>
              <Button variant="danger" onPress={handleConfirm}>
                <Trash2 size={18} className="mr-2" />
                Eliminar
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

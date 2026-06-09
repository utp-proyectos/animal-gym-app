import type { Membership } from '../MembershipType';
import { Modal, Button } from '@heroui/react';
import { Clock, Tag, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  membership: Membership | null;
}

export function MembershipDetailModal({ isOpen, onOpenChange, membership }: Props) {
  const isActivo = membership?.estado === 'Activo';

  return (
    <Modal>
      <Modal.Backdrop variant="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal.Container size="md" scroll="inside" placement="center">
          <Modal.Dialog className="rounded-3xl overflow-hidden">
            <Modal.CloseTrigger />

            {membership && (
              <>
                <img
                  src={membership.imagenUrl}
                  alt={membership.nombre}
                  className="w-full h-48 object-cover"
                />

                <Modal.Body>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-2xl font-black tracking-tight text-black">
                      {membership.nombre}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${
                        isActivo ? 'bg-success/10 text-success' : 'bg-default-200 text-default-600'
                      }`}
                    >
                      {isActivo ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      {membership.estado}
                    </span>
                  </div>

                  <p className="text-default-500 text-sm leading-relaxed mb-5">
                    {membership.descripcion}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-default-50 p-4">
                      <div className="flex items-center gap-2 text-default-400 text-xs font-semibold uppercase tracking-wide mb-1">
                        <Tag size={14} /> Precio
                      </div>
                      <p className="text-xl font-bold text-primary">
                        S/ {membership.precio.toFixed(2)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-default-50 p-4">
                      <div className="flex items-center gap-2 text-default-400 text-xs font-semibold uppercase tracking-wide mb-1">
                        <Clock size={14} /> Duración
                      </div>
                      <p className="text-xl font-bold text-black">{membership.duracionDias} días</p>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">
                    ID: #{membership.id}
                  </p>
                </Modal.Body>

                <Modal.Footer>
                  <Button variant="primary" slot="close">
                    Cerrar
                  </Button>
                </Modal.Footer>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

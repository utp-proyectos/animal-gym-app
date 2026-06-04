import type { Membership } from '../MembershipType';
import { Card, Button, Dropdown, Label } from '@heroui/react';
import { MoreVertical, Edit3, Trash2 } from 'lucide-react';

interface Props {
  membership: Membership;
  onEdit: (membership: Membership) => void;
  onDelete: (membership: Membership) => void;
  onView: (membership: Membership) => void;
}

export function MembershipCard({ membership, onEdit, onDelete, onView }: Props) {
  const handleAction = (key: string) => {
    if (key === 'edit') onEdit(membership);
    if (key === 'delete') onDelete(membership);
  };

  const isActivo = membership.estado === 'Activo';

  return (
    <Card className="p-0 border-none bg-white hover:translate-y-[-4px] transition-all duration-300 shadow-md overflow-hidden flex flex-col h-full">
      <div className="w-full aspect-[16/9] relative">
        <img
          alt={membership.nombre}
          className="w-full h-full object-cover"
          src={membership.imagenUrl}
        />

        <div className="absolute top-4 left-5">
          <span
            className={`backdrop-blur-md text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
              isActivo ? 'bg-white/90 text-primary' : 'bg-default-900/70 text-white'
            }`}
          >
            {membership.estado}
          </span>
        </div>

        <div className="absolute top-4 right-4">
          <Dropdown>
            <Button
              aria-label="Opciones"
              className="min-w-9 w-9 h-9 p-0 bg-white/90 hover:bg-white rounded-full border-none outline-none shadow-sm"
            >
              <MoreVertical size={20} className="text-black" strokeWidth={2.5} />
            </Button>
            <Dropdown.Popover>
              <Dropdown.Menu
                onAction={(key) => handleAction(String(key))}
                className="min-w-[170px] bg-white border border-default-100 shadow-xl rounded-2xl"
              >
                <Dropdown.Item id="edit" textValue="Editar">
                  <div className="flex items-center gap-2 py-1">
                    <Edit3 size={18} className="text-black" />
                    <Label className="font-semibold text-black">Editar membresía</Label>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item id="delete" textValue="Eliminar" className="text-danger">
                  <div className="flex items-center gap-2 py-1">
                    <Trash2 size={18} />
                    <Label className="font-semibold">Eliminar membresía</Label>
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-bold text-2xl text-black tracking-tight leading-tight">
              {membership.nombre}
            </h4>
            <p className="text-default-400 text-xs font-semibold uppercase mt-0.5">
              {membership.duracionDias} días
            </p>
          </div>
        </div>

        <p className="text-default-500 text-sm leading-relaxed line-clamp-3 mb-4">
          {membership.descripcion}
        </p>

        <div className="mt-auto">
          <div className="flex items-baseline gap-1.5 mb-4">
            <span className="text-[26px] font-bold text-primary">
              S/ {membership.precio.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">/ {membership.duracionDias} días</span>
          </div>

          <div className="h-[1px] w-full bg-default-100 mb-3" />

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              ID: #{membership.id}
            </span>
            <Button variant="outline" size="sm" onPress={() => onView(membership)}>
              Ver detalles
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

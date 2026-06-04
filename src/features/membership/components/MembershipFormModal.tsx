import { useEffect, useState } from 'react';
import type { Membership, MembershipFormData } from '../MembershipType';
import { Modal, Button, Input, Select, ListBox, Label } from '@heroui/react';
import { ImagePlus } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  membership: Membership | null;
  onSubmit: (data: MembershipFormData, id: number | null) => void;
}

const EMPTY: MembershipFormData = {
  nombre: '',
  descripcion: '',
  duracionDias: 30,
  precio: 0,
  estado: 'Activo',
  imagenUrl: '',
};

const PLACEHOLDER = 'https://placehold.co/600x400?text=Sin+imagen';

type Errors = Partial<Record<keyof MembershipFormData, string>>;

export function MembershipFormModal({ isOpen, onOpenChange, membership, onSubmit }: Props) {
  const isEdit = membership !== null;
  const [form, setForm] = useState<MembershipFormData>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (isOpen) {
      setForm(
        membership
          ? {
              nombre: membership.nombre,
              descripcion: membership.descripcion,
              duracionDias: membership.duracionDias,
              precio: membership.precio,
              estado: membership.estado,
              imagenUrl: membership.imagenUrl,
            }
          : EMPTY
      );
      setErrors({});
    }
  }, [isOpen, membership]);

  const set = <K extends keyof MembershipFormData>(key: K, value: MembershipFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) set('imagenUrl', URL.createObjectURL(file));
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (form.nombre.trim().length < 3) next.nombre = 'Ingrese un nombre válido (mínimo 3 caracteres).';
    if (!(form.precio > 0)) next.precio = 'Ingrese un precio válido.';
    if (!(form.duracionDias >= 1)) next.duracionDias = 'Ingrese una duración válida.';
    if (form.descripcion.trim().length < 10) next.descripcion = 'Ingrese una descripción (mínimo 10 caracteres).';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ ...form, imagenUrl: form.imagenUrl || PLACEHOLDER }, membership?.id ?? null);
    onOpenChange(false);
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal.Container size="lg" scroll="inside" placement="center">
          <Modal.Dialog className="rounded-3xl">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading className="text-xl font-bold">
                {isEdit ? 'Editar membresía' : 'Nueva membresía'}
              </Modal.Heading>
            </Modal.Header>

            <Modal.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div className="md:col-span-2">
                  <Label className="mb-1.5 block">Nombre del plan</Label>
                  <Input
                    placeholder="Plan Básico"
                    value={form.nombre}
                    // isInvalid={!!errors.nombre}
                    onChange={(e) => set('nombre', e.target.value)}
                  />
                  {errors.nombre && <p className="text-danger text-xs mt-1">{errors.nombre}</p>}
                </div>

                {/* Precio */}
                <div>
                  <Label className="mb-1.5 block">Precio (S/)</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                    value={String(form.precio)}
                    // isInvalid={!!errors.precio}
                    onChange={(e) => set('precio', Number(e.target.value))}
                  />
                  {errors.precio && <p className="text-danger text-xs mt-1">{errors.precio}</p>}
                </div>

                {/* Duración */}
                <div>
                  <Label className="mb-1.5 block">Duración (días)</Label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="30"
                    value={String(form.duracionDias)}
                    // isInvalid={!!errors.duracionDias}
                    onChange={(e) => set('duracionDias', Number(e.target.value))}
                  />
                  {errors.duracionDias && (
                    <p className="text-danger text-xs mt-1">{errors.duracionDias}</p>
                  )}
                </div>

                {/* Estado */}
                <div className="md:col-span-2">
                  <Label className="mb-1.5 block">Estado</Label>
                  <Select
                    className="w-full"
                    value={form.estado}
                    onChange={(key) => set('estado', (key as 'Activo' | 'Inactivo') ?? 'Activo')}
                  >
                    <Select.Trigger className="px-3 py-2 flex justify-between items-center">
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox className="bg-white border border-default-200 shadow-xl">
                        <ListBox.Item id="Activo" textValue="Activo">Activo</ListBox.Item>
                        <ListBox.Item id="Inactivo" textValue="Inactivo">Inactivo</ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>

                {/* Descripción */}
                <div className="md:col-span-2">
                  <Label className="mb-1.5 block">Descripción</Label>
                  <textarea
                    rows={3}
                    placeholder="Describe los beneficios del plan..."
                    value={form.descripcion}
                    onChange={(e) => set('descripcion', e.target.value)}
                    className={`w-full rounded-medium border-2 bg-default-100 px-3 py-2 text-sm outline-none transition-colors hover:border-default-400 focus:border-primary ${
                      errors.descripcion ? 'border-danger' : 'border-default-200'
                    }`}
                  />
                  {errors.descripcion && (
                    <p className="text-danger text-xs mt-1">{errors.descripcion}</p>
                  )}
                </div>

                {/* Imagen */}
                <div className="md:col-span-2">
                  <Label className="mb-1.5 block">Foto de la membresía</Label>
                  <label className="flex items-center gap-2 cursor-pointer rounded-medium border-2 border-dashed border-default-300 px-3 py-2.5 text-sm text-default-500 hover:border-primary transition-colors">
                    <ImagePlus size={18} />
                    <span>Seleccionar imagen (JPG / PNG)</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                      onChange={handleFile}
                    />
                  </label>

                  <div className="mt-3">
                    <img
                      src={form.imagenUrl || PLACEHOLDER}
                      alt="Vista previa"
                      className="w-full h-40 object-cover rounded-2xl border border-default-100"
                    />
                  </div>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="outline" slot="close">
                Cancelar
              </Button>
              <Button variant="primary" onPress={handleSubmit}>
                {isEdit ? 'Guardar cambios' : 'Crear membresía'}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

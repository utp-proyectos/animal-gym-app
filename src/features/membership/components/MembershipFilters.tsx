import { Card, Input, Button, Select, ListBox, Label } from '@heroui/react';
import { RotateCcw } from 'lucide-react';

interface FiltersProps {
  search: string;
  setSearch: (value: string) => void;
  estado: string;
  setEstado: (value: string) => void;
  minPrecio: number;
  setMinPrecio: (value: number) => void;
  maxPrecio: number;
  setMaxPrecio: (value: number) => void;
  onReset: () => void;
}

export function MembershipFilters({
  search,
  setSearch,
  estado,
  setEstado,
  minPrecio,
  setMinPrecio,
  maxPrecio,
  setMaxPrecio,
  onReset,
}: FiltersProps) {
  return (
    <Card className="p-6 border-none bg-default-50/50 rounded-3xl shadow-sm sticky top-8">
      <h3 className="font-bold text-lg mb-6 text-black">Filtrar membresías</h3>

      <div className="flex flex-col gap-6">
        <div>
          <Label className="mb-1.5 block">Nombre del plan</Label>
          <Input
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <Label className="mb-1.5 block">Estado</Label>
          <Select
            placeholder="Todos los estados"
            className="w-full"
            value={estado}
            onChange={(key) => setEstado((key as string) ?? 'all')}
          >
            <Select.Trigger className="px-3 py-2 flex justify-between items-center">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox className="bg-white border border-default-200 shadow-xl">
                <ListBox.Item id="all" textValue="Todos">Todos</ListBox.Item>
                <ListBox.Item id="Activo" textValue="Activo">Activo</ListBox.Item>
                <ListBox.Item id="Inactivo" textValue="Inactivo">Inactivo</ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">Rango de Precio (S/)</Label>

          <div className="flex items-center justify-between text-sm mb-1">
            <span className="font-medium text-primary">S/ {minPrecio}</span>
            <span className="font-medium text-primary">S/ {maxPrecio}</span>
          </div>

          <div className="flex flex-col gap-4">
            <input
              type="range"
              min={0}
              max={500}
              step={5}
              value={minPrecio}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val <= maxPrecio) setMinPrecio(val);
              }}
              className="w-full accent-primary"
            />

            <input
              type="range"
              min={0}
              max={500}
              step={5}
              value={maxPrecio}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= minPrecio) setMaxPrecio(val);
              }}
              className="w-full accent-primary"
            />
          </div>

          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Min</span>
            <span>Max</span>
          </div>
        </div>

        <Button
          onPress={onReset}
          className="w-full mt-2 font-medium bg-primary/10 text-primary"
        >
          <RotateCcw size={18} className="mr-2" />
          Resetear filtros
        </Button>
      </div>
    </Card>
  );
}

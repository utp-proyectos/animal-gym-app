import { useState, useMemo } from 'react';
import type { Membership, MembershipFormData } from './MembershipType';
import { MembershipCard } from './components/MembershipCard';
import { MembershipFilters } from './components/MembershipFilters';
import { MembershipFormModal } from './components/MembershipFormModal';
import { MembershipDeleteModal } from './components/MembershipDeleteModal';
import { MembershipDetailModal } from './components/MembershipDetailModal';
import { Button } from '@heroui/react';
import { Plus } from 'lucide-react';

const mockMemberships: Membership[] = [
  { id: 1, nombre: 'Plan Básico', descripcion: 'Acceso ilimitado al gimnasio durante 30 días.', duracionDias: 30, precio: 49.99, estado: 'Activo', imagenUrl: 'https://picsum.photos/id/1015/600/400' },
  { id: 2, nombre: 'Plan Premium', descripcion: 'Clases grupales, piscina y acceso prioritario.', duracionDias: 90, precio: 129.99, estado: 'Activo', imagenUrl: 'https://picsum.photos/id/201/600/400' },
  { id: 3, nombre: 'Plan VIP Anual', descripcion: 'Acceso completo + entrenador personal durante todo el año.', duracionDias: 365, precio: 399.99, estado: 'Activo', imagenUrl: 'https://picsum.photos/id/160/600/400' },
  { id: 4, nombre: 'Plan Estudiante', descripcion: 'Descuento especial para estudiantes universitarios.', duracionDias: 30, precio: 35.0, estado: 'Inactivo', imagenUrl: 'https://picsum.photos/id/251/600/400' },
];

export function MembershipPage() {
  const [memberships, setMemberships] = useState<Membership[]>(mockMemberships);

  // Filtros
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('all');
  const [minPrecio, setMinPrecio] = useState(0);
  const [maxPrecio, setMaxPrecio] = useState(500);

  // Modales (controlados desde la página)
  const [formModal, setFormModal] = useState<{ open: boolean; editing: Membership | null }>({
    open: false,
    editing: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; target: Membership | null }>({
    open: false,
    target: null,
  });
  const [detailModal, setDetailModal] = useState<{ open: boolean; target: Membership | null }>({
    open: false,
    target: null,
  });

  const filteredMemberships = useMemo(() => {
    return memberships.filter((m) => {
      const matchesSearch = m.nombre.toLowerCase().includes(search.toLowerCase());
      const matchesEstado = estado === 'all' || m.estado === estado;
      const matchesPrecio = m.precio >= minPrecio && m.precio <= maxPrecio;
      return matchesSearch && matchesEstado && matchesPrecio;
    });
  }, [memberships, search, estado, minPrecio, maxPrecio]);

  const handleResetFilters = () => {
    setSearch('');
    setEstado('all');
    setMinPrecio(0);
    setMaxPrecio(500);
  };

  const handleSubmit = (data: MembershipFormData, id: number | null) => {
    if (id === null) {
      const nuevo: Membership = { ...data, id: Date.now() };
      setMemberships((prev) => [nuevo, ...prev]);
    } else {
      setMemberships((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
    }
  };

  const handleConfirmDelete = (id: number) => {
    setMemberships((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase">Gestión de Membresías</h1>
          <p className="text-default-500 text-sm">Administra los planes de tu gimnasio</p>
        </div>

        <Button
          variant="primary"
          className="font-semibold px-6 rounded-full"
          onPress={() => setFormModal({ open: true, editing: null })}
        >
          <Plus size={20} className="mr-2" /> Nueva Membresía
        </Button>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-72">
          <MembershipFilters
            search={search}
            setSearch={setSearch}
            estado={estado}
            setEstado={setEstado}
            minPrecio={minPrecio}
            setMinPrecio={setMinPrecio}
            maxPrecio={maxPrecio}
            setMaxPrecio={setMaxPrecio}
            onReset={handleResetFilters}
          />
        </aside>

        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemberships.length > 0 ? (
              filteredMemberships.map((membership) => (
                <MembershipCard
                  key={membership.id}
                  membership={membership}
                  onEdit={(m) => setFormModal({ open: true, editing: m })}
                  onDelete={(m) => setDeleteModal({ open: true, target: m })}
                  onView={(m) => setDetailModal({ open: true, target: m })}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-10">
                No se encontraron membresías con los filtros aplicados.
              </p>
            )}
          </div>
        </main>
      </div>

      {/* Modales */}
      <MembershipFormModal
        isOpen={formModal.open}
        onOpenChange={(open) => setFormModal((s) => ({ ...s, open }))}
        membership={formModal.editing}
        onSubmit={handleSubmit}
      />

      <MembershipDeleteModal
        isOpen={deleteModal.open}
        onOpenChange={(open) => setDeleteModal((s) => ({ ...s, open }))}
        membership={deleteModal.target}
        onConfirm={handleConfirmDelete}
      />

      <MembershipDetailModal
        isOpen={detailModal.open}
        onOpenChange={(open) => setDetailModal((s) => ({ ...s, open }))}
        membership={detailModal.target}
      />
    </div>
  );
}

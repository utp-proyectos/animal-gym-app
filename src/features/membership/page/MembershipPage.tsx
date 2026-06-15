import { MembershipFilters } from '../components/MembershipFilters'
import { useState, useEffect, useMemo } from 'react'
import { Button, Spinner } from '@heroui/react'
import { Plus } from 'lucide-react'
import type { MembershipReponse } from '../types'
import { mockMemberships } from '../mock/membership.mock'
import { MembershipCard } from '../components/MembershipCard'

export function MembershipPage() {
	const [memberships, setMemberships] = useState<MembershipReponse[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
	const [minPrice, setMinPrice] = useState(0)
	const [maxPrice, setMaxPrice] = useState(500)
	const [searchQuery, setSearchQuery] = useState('')

	useEffect(() => {
		const timer = setTimeout(() => {
			try {
				setMemberships(mockMemberships)
			} catch {
				setError('No se pudieron cargar las membresias. Intentalo de nuevo')
			} finally {
				setIsLoading(false)
			}
		}, 800)

		return () => clearTimeout(timer)
	}, [])

	const filteredMemberships = useMemo(() => {
		return memberships.filter((m) => {
			const matchesSearch = m.name.toLowerCase().includes(searchQuery.trim().toLowerCase())

			const matchesStatus =
				statusFilter === 'all' ||
				(statusFilter === 'active' && m.status === true) ||
				(statusFilter === 'inactive' && m.status === false)

			const matchesPrice = m.price >= minPrice && m.price <= maxPrice

			return matchesSearch && matchesStatus && matchesPrice
		})
	}, [memberships, searchQuery, statusFilter, minPrice, maxPrice])

	const handleOpenEdit = (membership: MembershipReponse) => {
		console.log('Editar membresía:', membership.id)
	}

	const handleOpenDelete = (membership: MembershipReponse) => {
		console.log('Eliminar membresía:', membership.id)
	}

	const handleResetFilters = () => {
		setSearchQuery('')
		setStatusFilter('all')
		setMinPrice(0)
		setMaxPrice(500)
	}

	return (
		<div className="p-8 max-w-7xl mx-auto">
			<header className="flex items-end justify-between mb-10">
				<div>
					<h1 className="text-3xl font-black tracking-tight">Gestión de Membresías</h1>
					<p className="text-gray-500 text-sm mt-1">Administra los planes del gimnasio</p>
				</div>

				<Button
					onPress={() => {
						//MembershipFormModal para creación
					}}
					className="font-semibold"
				>
					<Plus size={18} />
					Nueva membresía
				</Button>
			</header>

			<div className="flex flex-col sm:flex-row gap-8">
				<aside className="w-full sm:w-72 sm:flex-none">
					<MembershipFilters
						searchQuery={searchQuery}
						onSearchChange={setSearchQuery}
						statusFilter={statusFilter}
						onStatusChange={setStatusFilter}
						minPrice={minPrice}
						onMinPriceChange={setMinPrice}
						maxPrice={maxPrice}
						onMaxPriceChange={setMaxPrice}
						onReset={handleResetFilters}
						total={memberships.length}
						filtered={filteredMemberships.length}
					/>
				</aside>

				<main className="flex-1 min-w-0 min-h-64">
					{isLoading && (
						<div className="flex flex-col items-center justify-center h-64 gap-4">
							<Spinner size="lg" color="success" />
							<p className="text-gray-400 text-sm">Cargando membresías...</p>
						</div>
					)}

					{!isLoading && error !== null && (
						<div className="flex flex-col items-center justify-center h-64 gap-4">
							<p className="text-red-500 font-medium">{error}</p>
							<Button variant="ghost" size="sm" onPress={() => window.location.reload()}>
								Reintentar
							</Button>
						</div>
					)}

					{!isLoading && error === null && filteredMemberships.length === 0 && (
						<div className="flex items-center justify-center h-64">
							<p className="text-gray-400 text-sm">
								No se encontraron membresías con los filtros actuales.
							</p>
						</div>
					)}

					{!isLoading && error === null && filteredMemberships.length > 0 && (
						<div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-6">
							{filteredMemberships.map((membership) => (
								<MembershipCard
									key={membership.id}
									membership={membership}
									onEdit={handleOpenEdit}
									onDelete={handleOpenDelete}
								/>
							))}
						</div>
					)}
				</main>
			</div>
		</div>
	)
}

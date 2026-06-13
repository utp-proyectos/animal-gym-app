import { Card, Input, Button } from '@heroui/react'
import { SlidersHorizontal, RotateCcw } from 'lucide-react'

type StatusFilter = 'all' | 'active' | 'inactive'

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
	{ value: 'all', label: 'Todos' },
	{ value: 'active', label: 'Activos' },
	{ value: 'inactive', label: 'Inactivos' },
]

interface MembershipFiltersProps {
	statusFilter: StatusFilter
	minPrice: number
	maxPrice: number

	onStatusChange: (value: StatusFilter) => void
	onMinPriceChange: (value: number) => void
	onMaxPriceChange: (value: number) => void
	onReset: () => void

	total: number
	filtered: number
}

export function MembershipFilters({
	statusFilter,
	minPrice,
	maxPrice,
	onStatusChange,
	onMinPriceChange,
	onMaxPriceChange,
	onReset,
	total,
	filtered,
}: MembershipFiltersProps) {
	const handleMinPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(e.target.value)
		if (value <= maxPrice) onMinPriceChange(value)
	}

	const handleMaxPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(e.target.value)
		if (value >= minPrice) onMaxPriceChange(value)
	}

	const hasActiveFilters = statusFilter !== 'all' || minPrice !== 0 || maxPrice !== 500

	return (
		<Card className="p-5 border border-gray-100 shadow-sm rounded-3xl sticky top-6">
			<div className="flex items-center justify-between mb-5">
				<div className="flex items-center gap-2">
					<SlidersHorizontal size={15} className="text-gray-400" />
					<span className="font-bold text-gray-800 text-sm">Filtros</span>
				</div>

				<span className="text-xs text-gray-400 font-medium tabular-nums">
					{filtered} de {total}
				</span>
			</div>
			<div className="flex flex-col gap-5">
				{/* ── Filtro de estado ─────────────────────────────────────────── */}
				<div>
					<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
						Estado
					</p>

					<div className="flex flex-col gap-1">
						{STATUS_OPTIONS.map((option) => (
							<button
								key={option.value}
								onClick={() => onStatusChange(option.value)}
								className={`
                  w-full text-left px-3.5 py-2.5 rounded-xl text-sm
                  font-medium transition-all duration-150
                  ${
										statusFilter === option.value
											? 'bg-blue-600 text-white shadow-sm'
											: 'text-gray-600 hover:bg-gray-50'
									}
                `}
							>
								{option.label}
							</button>
						))}
					</div>
				</div>

				<div className="h-px bg-gray-100" />

				<div>
					<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
						Rango de precio (S/)
					</p>

					<div className="flex flex-col gap-3">
						<div>
							<label className="text-xs text-gray-400 mb-1.5 block">Mínimo</label>

							<div className="flex items-center gap-2">
								<span className="text-xs text-gray-400 font-semibold select-none">S/</span>

								<Input
									className="w-64"
									type="number"
									min={0}
									max={maxPrice}
									value={String(minPrice)}
									onChange={handleMinPrice}
									placeholder="0"
								/>
							</div>
						</div>

						<div>
							<label className="text-xs text-gray-400 mb-1.5 block">Máximo</label>

							<div className="flex items-center gap-2">
								<span className="text-xs text-gray-400 font-semibold select-none">S/</span>

								<Input
									className="w-64"
									type="number"
									min={minPrice}
									value={String(maxPrice)}
									onChange={handleMaxPrice}
									placeholder="500"
								/>
							</div>
						</div>
					</div>
				</div>

				{hasActiveFilters && (
					<Button
						variant="ghost"
						size="sm"
						onPress={onReset}
						className="w-full border border-gray-200 text-gray-500 hover:bg-gray-50"
					>
						<RotateCcw size={13} />
						Limpiar filtros
					</Button>
				)}
			</div>
		</Card>
	)
}

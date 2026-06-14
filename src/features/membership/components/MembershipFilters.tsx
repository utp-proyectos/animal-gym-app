import { Card, Button, Select, Slider, SearchField, ListBox, Label, Separator } from '@heroui/react'
import { SlidersHorizontal, RotateCcw } from 'lucide-react'

type StatusFilter = 'all' | 'active' | 'inactive'

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
	{ value: 'all', label: 'Todos' },
	{ value: 'active', label: 'Activos' },
	{ value: 'inactive', label: 'Inactivos' },
]

const PRICE_MAX = 500
const LABEL_CLASS = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400'

interface MembershipFiltersProps {
	searchQuery: string
	statusFilter: StatusFilter
	minPrice: number
	maxPrice: number

	onSearchChange: (value: string) => void
	onStatusChange: (value: StatusFilter) => void
	onMinPriceChange: (value: number) => void
	onMaxPriceChange: (value: number) => void
	onReset: () => void

	total: number
	filtered: number
}

export function MembershipFilters({
	searchQuery,
	statusFilter,
	minPrice,
	maxPrice,

	onSearchChange,
	onStatusChange,
	onMinPriceChange,
	onMaxPriceChange,
	onReset,

	total,
	filtered,
}: MembershipFiltersProps) {
	const hasActiveFilters =
		searchQuery.trim() !== '' || statusFilter !== 'all' || minPrice !== 0 || maxPrice !== PRICE_MAX

	return (
		<Card className="p-5 border border-gray-100 shadow-sm rounded-3xl lg:sticky lg:top-6">
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
				<SearchField className="w-full" value={searchQuery} onChange={onSearchChange}>
					<Label className={LABEL_CLASS}>Buscar</Label>
					<SearchField.Group className="overflow-visible">
						<SearchField.SearchIcon />
						<SearchField.Input className="min-w-0" placeholder="Nombre de la membresía..." />
						<SearchField.ClearButton />
					</SearchField.Group>
				</SearchField>

				<Separator className="bg-gray-50" />

				<Select
					className="w-full"
					placeholder="Selecciona un estado"
					value={statusFilter}
					onChange={(value) => onStatusChange((value ?? 'all') as StatusFilter)}
				>
					<Label className={LABEL_CLASS}>Estado</Label>

					<Select.Trigger>
						<Select.Value />
						<Select.Indicator />
					</Select.Trigger>

					<Select.Popover>
						<ListBox>
							{STATUS_OPTIONS.map((option) => (
								<ListBox.Item key={option.value} id={option.value} textValue={option.label}>
									{option.label}
									<ListBox.ItemIndicator />
								</ListBox.Item>
							))}
						</ListBox>
					</Select.Popover>
				</Select>

				<Separator className="bg-gray-50" />

				<Slider
					className="w-full"
					minValue={0}
					maxValue={PRICE_MAX}
					step={10}
					value={[minPrice, maxPrice]}
					onChange={(value) => {
						if (!Array.isArray(value)) return
						onMinPriceChange(value[0])
						onMaxPriceChange(value[1])
					}}
					formatOptions={{ style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }}
				>
					<Label className={LABEL_CLASS}>Rango de precio</Label>
					<Slider.Output className="block text-sm font-semibold text-gray-700 mb-2" />

					<Slider.Track>
						{({ state }) => (
							<>
								<Slider.Fill />
								{state.values.map((_, i) => (
									<Slider.Thumb key={i} index={i} />
								))}
							</>
						)}
					</Slider.Track>
				</Slider>

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

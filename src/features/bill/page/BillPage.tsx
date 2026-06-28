import { Button, Dropdown, Label, Table, type RangeValue } from '@heroui/react'
import {
	MoreVertical,
	Info,
	Loader2,
	Settings,
	User,
	CalendarDays,
	Clock,
	IdCardLanyard,
	Crown,
	CircleDollarSign,
	CircleCheck,
	Frown,
} from 'lucide-react'
import { BillDetailModal } from '../components/BillDetailModal'
import { useState } from 'react'
import type { BillResponse } from '../types/bill.response'
import { useBills } from '../hooks/useBill'
import { Filters } from '@/shared/components/ui/Filters'
import { parseDate, type DateValue } from '@internationalized/date'

interface ModalState {
	isOpen: boolean
	data: BillResponse | null
}
const INITIAL_FILTERS = {
	search: '',
	role: '',
	dateRange: null as RangeValue<DateValue> | null,
	price: 0,
}

export function BillPage() {
	const { data: bills = [], isLoading, isError, error } = useBills()

	const [detailModal, setDetailModal] = useState<ModalState>({
		isOpen: false,
		data: null,
	})
	const [filters, setFilters] = useState(INITIAL_FILTERS)

	const filtered = bills.filter((bill) => {
		const matchSearch =
			filters.search === '' ||
			bill.partnerFirstName.toLowerCase().includes(filters.search.toLowerCase())

		const hireDate = bill.issueDate ? parseDate(bill.issueDate) : null
		const matchDate =
			!filters.dateRange ||
			!hireDate ||
			(hireDate >= filters.dateRange.start && hireDate <= filters.dateRange.end)
		const matchPrice = filters.price === 0 || bill.totalPrice >= filters.price
		return matchSearch && matchDate && matchPrice
	})

	return (
		<div className="p-8 max-w-7xl mx-auto min-h-screen bg-white text-slate-900">
			<header className="flex justify-between items-end mb-10">
				<div>
					<h1 className="text-4xl font-black tracking-tight uppercase text-black">
						Gestión de boletas
					</h1>
					<p className="text-default-500 text-sm">Administra las boletas de los socios</p>
				</div>
			</header>

			<div className="flex flex-col md:flex-row gap-8">
				<Filters title="Filtrar boletas" onReset={() => setFilters(INITIAL_FILTERS)}>
					<Filters.Search
						value={filters.search}
						placeholder="Buscar socio..."
						onChange={(v) => setFilters((p) => ({ ...p, search: v }))}
					/>

					<Filters.DateRange
						label="Fecha de ingreso"
						value={filters.dateRange}
						onChange={(v) => setFilters((p) => ({ ...p, dateRange: v }))}
					/>

					<Filters.Range
						label="Precio máximo"
						value={filters.price}
						min={0}
						max={5000}
						step={50}
						onChange={(v) => setFilters((p) => ({ ...p, price: v }))}
					/>
				</Filters>
				<main className="flex-1 overflow-hidden">
					<Table>
						<Table.ScrollContainer>
							<Table.Content aria-label="Gestión de boletas" className="min-w-150">
								<Table.Header>
									<Table.Column isRowHeader>
										{' '}
										<div className="flex items-center gap-2">
											<CalendarDays size={16} className="text-default-500" />
											<span>Fecha </span>
										</div>
									</Table.Column>
									<Table.Column>
										<div className="flex items-center gap-2">
											<Clock size={16} className="text-default-500" />
											<span>Hora</span>
										</div>
									</Table.Column>
									<Table.Column>
										<div className="flex items-center gap-2">
											<Crown size={16} className="text-default-500" />
											<span>Membresia</span>
										</div>
									</Table.Column>
									<Table.Column>
										<div className="flex items-center gap-2">
											<IdCardLanyard size={16} className="text-default-500" />
											<span>Empleado</span>
										</div>
									</Table.Column>
									<Table.Column>
										<div className="flex items-center gap-2">
											<User size={16} className="text-default-500" />
											<span>Socio</span>
										</div>
									</Table.Column>
									<Table.Column>
										<div className="flex items-center gap-2">
											<CircleDollarSign size={16} className="text-default-500" />
											<span>Total</span>
										</div>
									</Table.Column>
									<Table.Column>
										<div className="flex items-center gap-2">
											<CircleCheck size={16} className="text-default-500" />
											<span>Estado</span>
										</div>
									</Table.Column>
									<Table.Column>
										<div className="flex items-center gap-2 justify-end pr-4">
											<Settings size={16} className="text-default-500" />
											<span>Acciones</span>
										</div>
									</Table.Column>
								</Table.Header>
								<Table.Body
									renderEmptyState={() => (
										<div className="w-full flex items-center justify-center p-4">
											{isLoading ? (
												<div className="flex h-40 items-center gap-2 text-primary justify-center font-medium">
													<Loader2 className="animate-spin size-5" />
													Cargando boletas...
												</div>
											) : isError ? (
												<div className="w-full my-4 p-8 flex flex-col items-center justify-center gap-3 bg-danger-50 text-danger rounded-2xl border border-danger-100">
													<p className="font-semibold">Error al cargar las boletas</p>
													<p className="text-xs opacity-80">
														{error?.message || 'Error desconocido'}
													</p>
													<Frown size={24} />
												</div>
											) : filtered.length === 0 ? (
												<div className="w-full my-4 p-16 flex flex-col items-center justify-center gap-3 bg-default-50 text-default-400 rounded-3xl border border-dashed border-default-300">
													<Frown size={40} strokeWidth={1.5} />
													<p className="font-bold text-xl text-default-500">
														{bills.length === 0
															? 'No hay boletas registradas'
															: 'No se encontraron resultados'}
													</p>
													<p className="text-sm text-default-400">
														{bills.length === 0
															? 'Aún no se han creado boletas en la base de datos.'
															: 'Intenta con otros filtros o reinicia la búsqueda.'}
													</p>
												</div>
											) : null}
										</div>
									)}
								>
									{/* Las filas solo se renderizan si la data filtrada tiene elementos */}
									{filtered.map((bill) => (
										<Table.Row key={bill.id} className="text-center">
											<Table.Cell>
												<span className="font-medium text-black">{bill.issueDate}</span>
											</Table.Cell>
											<Table.Cell>
												<span className="text-default-600 text-sm">{bill.time}</span>
											</Table.Cell>
											<Table.Cell>
												<span className="inline-block bg-zinc-100 text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-zinc-200">
													{bill.membershipName}
												</span>
											</Table.Cell>
											<Table.Cell>
												{bill.employeeFirstName !== null ? (
													<span className="text-default-600 text-sm">
														{bill.employeeFirstName} {bill.employeeLastName}
													</span>
												) : (
													<span className="text-default-600 text-sm">Compra online</span>
												)}
											</Table.Cell>
											<Table.Cell>
												<span className="text-default-600 text-sm">
													{bill.partnerFirstName} {bill.partnerLastName}
												</span>
											</Table.Cell>
											<Table.Cell>
												<span className="font-bold text-black">${bill.totalPrice.toFixed(2)}</span>
											</Table.Cell>
											<Table.Cell>
												<span
													className={`inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${
														bill.status
															? 'bg-green-50 text-green-700 border-green-200'
															: 'bg-red-50 text-red-700 border-red-200'
													}`}
												>
													{bill.status ? 'Pagado' : 'Pendiente'}
												</span>
											</Table.Cell>
											<Table.Cell className="text-right pr-4">
												<Dropdown>
													<Button
														aria-label="Opciones"
														className="min-w-8 w-8 h-8 p-0 bg-transparent hover:bg-default-100 rounded-full border-none outline-none flex items-center justify-center"
													>
														<MoreVertical size={20} className="text-black" strokeWidth={3} />
													</Button>
													<Dropdown.Popover>
														<Dropdown.Menu
															className="min-w-42.5 bg-white border border-default-100 shadow-xl rounded-2xl"
															onAction={(key) => {
																if (key === 'detail') setDetailModal({ isOpen: true, data: bill })
															}}
														>
															<Dropdown.Item id="detail" textValue="Ver detalles">
																<div className="flex items-center gap-2 py-1">
																	<Info size={16} className="text-black" />
																	<Label className="font-semibold text-black">Ver detalles</Label>
																</div>
															</Dropdown.Item>
														</Dropdown.Menu>
													</Dropdown.Popover>
												</Dropdown>
											</Table.Cell>
										</Table.Row>
									))}
								</Table.Body>
							</Table.Content>
						</Table.ScrollContainer>
					</Table>
				</main>
			</div>

			{detailModal.data && (
				<BillDetailModal
					bill={detailModal.data}
					onClose={() => setDetailModal({ isOpen: false, data: null })}
				/>
			)}
		</div>
	)
}

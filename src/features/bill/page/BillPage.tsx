import { Button, Card, Dropdown, Label, Table, DateField, SearchField, Slider } from '@heroui/react'
import { MoreVertical, Info, RotateCcw, Loader2 } from 'lucide-react'
import { BillDetailModal } from '../components/BillDetailModal'
import { useState } from 'react'
import type { BillResponse } from '../types/bill.response'
import { useBills } from '../hooks/useBill'

interface ModalState {
	isOpen: boolean
	data: BillResponse | null
}

export function BillPage() {
	const { data: bills = [], isLoading, isError, error } = useBills()

	const [detailModal, setDetailModal] = useState<ModalState>({
		isOpen: false,
		data: null,
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
				<aside className="w-full md:w-72 flex flex-col gap-4">
					<Card className="p-6 border-none bg-default-50/50 rounded-3xl shadow-sm">
						<h3 className="font-bold text-lg mb-6 text-black">Filtrar boletas</h3>
						<div className="flex flex-col gap-7">
							<div className="flex flex-col gap-1">
								<SearchField name="Buscador" variant="secondary">
									<Label>Buscador</Label>
									<SearchField.Group>
										<SearchField.SearchIcon />
										<SearchField.Input className="w-70]" placeholder="Search..." />
										<SearchField.ClearButton />
									</SearchField.Group>
								</SearchField>
							</div>
							<div className="flex flex-col gap-1">
								<DateField className="w-[256px]" name="startDate">
									<Label>Fecha de inicio</Label>
									<DateField.Group variant="secondary">
										<DateField.Input>
											{(segment) => <DateField.Segment segment={segment} />}
										</DateField.Input>
									</DateField.Group>
								</DateField>
							</div>
							<div className="flex flex-col gap-1">
								<DateField className="w-[256px]" name="endDate">
									<Label>Fecha de fin</Label>
									<DateField.Group variant="secondary">
										<DateField.Input>
											{(segment) => <DateField.Segment segment={segment} />}
										</DateField.Input>
									</DateField.Group>
								</DateField>
							</div>
							<div className="flex flex-col gap-1">
								<Slider className="w-full max-w-xs" defaultValue={30}>
									<Label>Rango de precios</Label>
									<Slider.Output />
									<Slider.Track>
										<Slider.Fill />
										<Slider.Thumb />
									</Slider.Track>
								</Slider>
							</div>
							<Button className="w-full mt-2 font-medium bg-primary/10 text-primary">
								<RotateCcw size={18} className="mr-2" />
								Resetear filtros
							</Button>
						</div>
					</Card>
				</aside>

				<main className="flex-1 overflow-hidden">
					<Table>
						<Table.ScrollContainer>
							<Table.Content aria-label="Gestión de boletas" className="min-w-150">
								<Table.Header>
									<Table.Column isRowHeader>Fecha</Table.Column>
									<Table.Column>Hora</Table.Column>
									<Table.Column>Membresía</Table.Column>
									<Table.Column>Empleado</Table.Column>
									<Table.Column>Socio</Table.Column>
									<Table.Column>Subtotal</Table.Column>
									<Table.Column>Total</Table.Column>
									<Table.Column>Estado</Table.Column>
									<Table.Column>Acciones</Table.Column>
								</Table.Header>

								<Table.Body
									renderEmptyState={() => (
										<div className="flex h-40 w-full flex-col items-center justify-center gap-2 text-center p-8">
											<span className="text-sm font-medium text-default-400">
												{isLoading ? (
													<div className="flex items-center gap-2 text-primary">
														<Loader2 className="animate-spin size-5" />
														Cargando boletas...
													</div>
												) : isError ? (
													<div className="text-danger">
														Error al cargar las boletas: {error?.message || 'Error desconocido'}
													</div>
												) : (
													'No hay boletas registradas'
												)}
											</span>
										</div>
									)}
								>
									{!isLoading &&
										!isError &&
										bills.map((bill) => (
											<Table.Row key={bill.id} className={'text-center'}>
												<Table.Cell>
													<span className="font-medium text-black">{bill.issueDate}</span>
												</Table.Cell>
												<Table.Cell>
													<span className="text-default-600 text-sm">{bill.time}</span>
												</Table.Cell>
												<Table.Cell>
													<span className="inline-block   bg-zinc-100 text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-zinc-200">
														{bill.membershipName}
													</span>
												</Table.Cell>
												<Table.Cell>
													<span className="text-default-600 text-sm ">
														{bill.employeeFirstName} {bill.employeeLastName}
													</span>
												</Table.Cell>
												<Table.Cell>
													<span className="text-default-600 text-sm">
														{bill.partnerFirstName} {bill.partnerLastName}
													</span>
												</Table.Cell>
												<Table.Cell>
													<span className="text-default-600 text-sm">
														{bill.subTotal.toFixed(2)}
													</span>
												</Table.Cell>
												<Table.Cell>
													<span className="font-bold text-black">{bill.totalPrice.toFixed(2)}</span>
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

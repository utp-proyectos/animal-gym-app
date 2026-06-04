import type { BillResponse } from '../BillType'
import { Button, Card, Dropdown, Label, Table, DateField, SearchField, Slider } from '@heroui/react'
import { MoreVertical, Info, RotateCcw } from 'lucide-react'
import { BillDetailModal } from '../components/BillDetailModal'
import { useState } from 'react'
export function BillPage() {
	// dentro del componente
	const [openDetail, setOpenDetail] = useState(false)
	const [selectedBill, setSelectedBill] = useState<BillResponse | null>(null)

	const handleViewDetail = (bill: BillResponse) => {
		setSelectedBill(bill)
		setOpenDetail(true)
	}
	const bills: BillResponse[] = [
		{
			id: 1,
			issueDate: '2026-06-03',
			time: '14:30',
			subTotal: 150.0,
			totalPrice: 177.0,
			igv: 27.0,
			status: true,
			employeeFirstName: 'Carlos',
			employeeLastName: 'Pérez',
			partnerFirstName: 'Ana',
			partnerLastName: 'Gómez',
			membershipName: 'Gold',
		},
		{
			id: 2,
			issueDate: '2026-06-03',
			time: '14:30',
			subTotal: 150.0,
			totalPrice: 177.0,
			igv: 27.0,
			status: true,
			employeeFirstName: 'Carlos',
			employeeLastName: 'Pérez',
			partnerFirstName: 'Ana',
			partnerLastName: 'Gómez',
			membershipName: 'Gold',
		},
		{
			id: 3,
			issueDate: '2026-06-03',
			time: '14:30',
			subTotal: 150.0,
			totalPrice: 177.0,
			igv: 27.0,
			status: true,
			employeeFirstName: 'Carlos',
			employeeLastName: 'Pérez',
			partnerFirstName: 'Ana',
			partnerLastName: 'Gómez',
			membershipName: 'Gold',
		},
	]

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
						<h3 className="font-bold text-lg mb-6 text-black">Filtrar empleados</h3>
						<div className="flex flex-col gap-7">
							<div className="flex flex-col gap-1">
								<SearchField name="Buscador">
									<Label>Buscador</Label>
									<SearchField.Group>
										<SearchField.SearchIcon />
										<SearchField.Input className="w-70]" placeholder="Search..." />
										<SearchField.ClearButton />
									</SearchField.Group>
								</SearchField>
							</div>
							<div className="flex flex-col gap-1">
								<DateField className="w-[256px]" name="date">
									<Label>Fecha de incio</Label>
									<DateField.Group>
										<DateField.Input>
											{(segment) => <DateField.Segment segment={segment} />}
										</DateField.Input>
									</DateField.Group>
								</DateField>
							</div>
							<div className="flex flex-col gap-1">
								<DateField className="w-[256px]" name="date">
									<Label>Fecha de fin</Label>
									<DateField.Group>
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
				<main className="bg-white rounded-3xl shadow-sm border border-default-100 overflow-hidden">
					<Table variant="secondary">
						<Table.ScrollContainer>
							<Table.Content aria-label="Gestión de boletas" className="min-w-150">
								<Table.Header>
									<Table.Column>Fecha</Table.Column>
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
												No hay boletas registradas
											</span>
										</div>
									)}
								>
									{bills.map((bill) => (
										<Table.Row key={bill.id}>
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
												<span className="text-default-600 text-sm">{bill.employeeFirstName}</span>
											</Table.Cell>

											<Table.Cell>
												<span className="text-default-600 text-sm">{bill.partnerFirstName}</span>
											</Table.Cell>

											<Table.Cell>
												<span className="text-default-600 text-sm">
													S/ {bill.subTotal.toFixed(2)}
												</span>
											</Table.Cell>

											<Table.Cell>
												<span className="font-bold text-black">
													S/ {bill.totalPrice.toFixed(2)}
												</span>
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
																if (key === 'detail') handleViewDetail(bill)
															}}
														>
															<Dropdown.Item id="detail" textValue="Editar">
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

			{openDetail && (
				<BillDetailModal
					bill={selectedBill}
					onClose={() => {
						setOpenDetail(false)
						setSelectedBill(null)
					}}
				/>
			)}
		</div>
	)
}

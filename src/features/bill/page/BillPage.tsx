import type { BillResponse } from '../BillType'
import { Button, Dropdown, Label, Table } from '@heroui/react'
import { MoreVertical, Info } from 'lucide-react'
export function BillPage() {
	const bills: BillResponse[] = [
		{
			id: 1,
			issueDate: '2024-01-10',
			time: '10:30',
			subTotal: 80,
			totalPrice: 94.4,
			status: true,
			employeeFirstName: 'Juan',
			partnerFirstName: 'Carlos',
			membershipName: 'Mensual',
		},
		{
			id: 2,
			issueDate: '2024-01-11',
			time: '11:00',
			subTotal: 120,
			totalPrice: 141.6,
			status: false,
			employeeFirstName: 'María',
			partnerFirstName: 'Ana',
			membershipName: 'Anual',
		},
		{
			id: 3,
			issueDate: '2024-01-12',
			time: '09:15',
			subTotal: 60,
			totalPrice: 70.8,
			status: true,
			employeeFirstName: 'Carlos',
			partnerFirstName: 'Luis',
			membershipName: 'Semanal',
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
			<div className="flex flex-col md:flex-row gap-8">{/* Sidebar filtros */}</div>
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
											<span className="font-bold text-black">S/ {bill.totalPrice.toFixed(2)}</span>
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
													<Dropdown.Menu className="min-w-42.5 bg-white border border-default-100 shadow-xl rounded-2xl">
														<Dropdown.Item id="edit" textValue="Editar">
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
	)
}

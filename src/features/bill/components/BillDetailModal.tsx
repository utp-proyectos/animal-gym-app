// src/components/BillDetailModal.tsx
import { Button, Modal } from '@heroui/react'
import type { BillResponse } from '../BillType'

interface Props {
	bill: BillResponse | null
	onClose: () => void
}

export function BillDetailModal({ bill, onClose }: Props) {
	if (!bill) return null

	return (
		<Modal
			defaultOpen
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose()
			}}
		>
			<Modal.Backdrop>
				<Modal.Container>
					<Modal.Dialog className="sm:max-w-2xl max-h-[90vh]">
						<Modal.CloseTrigger />

						<Modal.Header>
							<Modal.Heading className="text-3xl font-black tracking-tight uppercase text-black">
								Detalle de Boleta
							</Modal.Heading>
							<p className="text-sm text-default-500">
								{bill.issueDate} — {bill.time}
							</p>
						</Modal.Header>

						<Modal.Body className="overflow-y-auto py-6">
							{/* Membresía */}
							<section className="space-y-4">
								<h3 className="font-semibold text-lg  pb-2">Membresía</h3>
								<div className="grid gap-4 md:grid-cols-2">
									<div>
										<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
											Nombre
										</p>
										<p className="font-medium text-black">{bill.membershipName}</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
											Estado
										</p>
										<span
											className={`inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${
												bill.status
													? 'bg-green-50 text-green-700 border-green-200'
													: 'bg-red-50 text-red-700 border-red-200'
											}`}
										>
											{bill.status ? 'Pagado' : 'Pendiente'}
										</span>
									</div>
								</div>
							</section>

							{/* Personas */}
							<section className="space-y-4 border-t pt-6 mt-2">
								<h3 className="font-semibold text-lg  pb-2">Personas</h3>
								<div className="grid gap-4 md:grid-cols-2">
									<div>
										<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
											Empleado
										</p>
										<p className="font-medium text-black">
											{bill.employeeFirstName} {bill.employeeLastName}
										</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
											Socio
										</p>
										<p className="font-medium text-black">
											{bill.partnerFirstName} {bill.partnerLastName}
										</p>
									</div>
								</div>
							</section>

							{/* Montos */}
							<section className="space-y-4 border-t pt-6 mt-2">
								<h3 className="font-semibold text-lg  pb-2">Montos</h3>
								<div className="grid gap-4 md:grid-cols-3">
									<div>
										<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
											Subtotal
										</p>
										<p className="font-medium text-black">S/ {bill.subTotal.toFixed(2)}</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
											IGV
										</p>
										<p className="font-medium text-black">S/ {bill.igv.toFixed(2)}</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
											Total
										</p>
										<p className="font-bold text-black text-lg">S/ {bill.totalPrice.toFixed(2)}</p>
									</div>
								</div>
							</section>
						</Modal.Body>

						<Modal.Footer className="pt-4">
							<Button variant="secondary" onPress={onClose}>
								Cerrar
							</Button>
							<Button variant="primary">Imprimir</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	)
}

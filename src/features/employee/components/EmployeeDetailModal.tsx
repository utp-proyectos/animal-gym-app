import { Button, Modal, Skeleton } from '@heroui/react'
import { useGetEmployee } from '../hooks/useEmployees'
import defult from '@/assets/global/default.png'
import type { EmployeeDetailResponse } from '../types'

interface Props {
	isOpen: boolean
	onOpenChange: (open: boolean) => void
	employee: EmployeeDetailResponse | null
}

export function EmployeeDetailModal({ isOpen, onOpenChange, employee }: Props) {
	const { data, isLoading } = useGetEmployee(employee?.id)

	return (
		<Modal>
			<Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
				<Modal.Container>
					<Modal.Dialog className="sm:max-w-3xl max-h-[90vh]">
						<Modal.CloseTrigger />

						<Modal.Header className="pb-4">
							<div className="flex items-center gap-4">
								{isLoading ? (
									<>
										<Skeleton className="w-16 h-16 rounded-full" />
										<div className="flex flex-col gap-2">
											<Skeleton className="w-48 h-6 rounded-xl" />
											<Skeleton className="w-32 h-4 rounded-lg" />
										</div>
									</>
								) : (
									<>
										<img
											src={data?.avatar || defult}
											alt={`${data?.firstName} ${data?.lastName}`}
											className="w-16 h-16 rounded-full object-cover"
											onError={(e) => {
												e.currentTarget.src = defult
											}}
										/>
										<div>
											<Modal.Heading className="text-3xl font-black tracking-tight uppercase text-black">
												{data?.firstName} {data?.lastName}
											</Modal.Heading>
											<p className="text-sm text-default-500">
												{data?.role} — {data?.specialty}
											</p>
										</div>
									</>
								)}
							</div>
						</Modal.Header>

						<Modal.Body className="overflow-y-auto py-6">
							{isLoading ? (
								<div className="flex flex-col gap-4">
									<Skeleton className="w-full h-6 rounded-xl" />
									<Skeleton className="w-full h-6 rounded-xl" />
									<Skeleton className="w-2/3 h-6 rounded-xl" />
								</div>
							) : (
								<>
									<section className="space-y-4">
										<h3 className="font-semibold text-lg border-b pb-2">Datos personales</h3>
										<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
											<div>
												<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
													DNI
												</p>
												<p className="font-medium text-black">{data?.dni}</p>
											</div>
											<div>
												<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
													Teléfono
												</p>
												<p className="font-medium text-black">{data?.phoneNumber}</p>
											</div>
											<div>
												<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
													Email
												</p>
												<p className="font-medium text-black">{data?.email}</p>
											</div>
											<div>
												<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
													Género
												</p>
												<p className="font-medium text-black">{data?.gender}</p>
											</div>
											<div>
												<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
													Fecha de nacimiento
												</p>
												<p className="font-medium text-black">{data?.birthDate}</p>
											</div>
										</div>
									</section>

									<section className="space-y-4 pt-6 mt-2">
										<h3 className="font-semibold text-lg border-b pb-2">Datos laborales</h3>
										<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
											<div>
												<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
													Fecha de contratación
												</p>
												<p className="font-medium text-black">{data?.hireDate}</p>
											</div>
											<div>
												<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
													Salario
												</p>
												<p className="font-medium text-black">S/ {data?.salary}</p>
											</div>
											<div>
												<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
													Tipo de contrato
												</p>
												<p className="font-medium text-black">{data?.contractType}</p>
											</div>
											<div>
												<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
													Especialidad
												</p>
												<p className="font-medium text-black">{data?.specialty}</p>
											</div>
											<div>
												<p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
													Rol
												</p>
												<p className="font-medium text-black">{data?.role}</p>
											</div>
										</div>
									</section>
								</>
							)}
						</Modal.Body>

						<Modal.Footer className="pt-4">
							<Button variant="secondary" slot="close">
								Cerrar
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	)
}

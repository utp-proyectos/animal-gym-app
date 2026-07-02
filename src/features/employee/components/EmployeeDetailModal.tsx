import { Button, Chip, Modal } from '@heroui/react'
import defult from '@/assets/global/default.png'
import type { EmployeeDetailResponse } from '../types'
import { Calendar, DollarSign, Mail, Phone, User, X } from 'lucide-react'
import { CircleFill } from '@gravity-ui/icons'

interface Props {
	isOpen: boolean
	onOpenChange: (open: boolean) => void
	employee: EmployeeDetailResponse | null
}

export function EmployeeDetailModal({ isOpen, onOpenChange, employee }: Props) {
	return (
		<Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
			<Modal.Container>
				<Modal.Dialog className="max-w-5xl overflow-hidden rounded-3xl bg-white p-0">
					<div className="grid grid-cols-1 md:grid-cols-12 min-h-125">
						{/* COLUMNA IZQUIERDA - IMAGEN */}
						<div className="md:col-span-5 relative bg-default-100 min-h-62.5 md:min-h-full">
							<img
								src={employee?.avatar || defult}
								alt={`${employee?.firstName} ${employee?.lastName}`}
								className="absolute inset-0 w-full h-full object-cover"
								onError={(e) => {
									e.currentTarget.src = defult
								}}
							/>
							{/* Degradado */}
							<div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent md:bg-linear-to-r" />
						</div>

						{/* COLUMNA DERECHA */}
						<div className="md:col-span-7 p-8 flex flex-col justify-between relative bg-white">
							<div className="absolute top-4 right-4 z-10">
								<Button isIconOnly variant="outline" slot="close" size="sm">
									<X className="size-5 text-default-500" />
								</Button>
							</div>

							{/* Contenido Principal */}
							<div className="flex flex-col gap-6">
								<div>
									<div className="flex items-center gap-2 mb-2 flex-wrap">
										<Chip variant="primary" size="sm" className="font-semibold">
											<CircleFill width={6} />
											{employee?.role}
										</Chip>
										<Chip
											color="default"
											variant="soft"
											size="sm"
											className="font-bold uppercase tracking-wider text-[11px]"
										>
											<CircleFill width={6} />
											{employee?.contractType}
										</Chip>
										{employee?.specialty && (
											<Chip
												variant="soft"
												size="sm"
												className="font-bold uppercase tracking-wider text-[11px]"
											>
												<CircleFill width={6} />
												{employee?.specialty}
											</Chip>
										)}
									</div>
									<h2 className="text-3xl font-black uppercase text-black tracking-tight">
										{employee?.firstName} {employee?.lastName}
									</h2>
								</div>

								{/* Sección de Contacto */}
								<div className="flex flex-col gap-1.5">
									<h4 className="text-xs font-bold uppercase tracking-wider text-default-400 flex items-center gap-2">
										<Mail className="size-4 text-primary" /> Correo electrónico
									</h4>
									<p className="text-sm text-slate-700 bg-default-50 p-3 rounded-xl border border-default-100">
										{employee?.email}
									</p>
								</div>

								{/* Sección del DNI / Género */}
								<div className="flex flex-col gap-1.5">
									<h4 className="text-xs font-bold uppercase tracking-wider text-default-400 flex items-center gap-2">
										<User className="size-4 text-primary" /> Datos personales
									</h4>
									<div className="flex items-center gap-3 p-3 bg-default-50/50 rounded-xl border border-default-100">
										<div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
											<User className="size-5" />
										</div>
										<span className="font-semibold text-slate-900 text-sm">
											DNI {employee?.dni} — {employee?.gender}
										</span>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4 mt-2">
									<div className="p-3 border border-default-100 bg-white rounded-2xl flex items-center gap-3 shadow-sm">
										<div className="p-2 bg-default-50 text-default-500 rounded-lg">
											<Phone className="size-4" />
										</div>
										<div className="flex flex-col">
											<span className="text-[11px] text-default-400 font-medium uppercase tracking-wider">
												Teléfono
											</span>
											<span className="text-xs font-bold text-black">{employee?.phoneNumber}</span>
										</div>
									</div>

									<div className="p-3 border border-default-100 bg-white rounded-2xl flex items-center gap-3 shadow-sm">
										<div className="p-2 bg-default-50 text-default-500 rounded-lg">
											<Calendar className="size-4" />
										</div>
										<div className="flex flex-col">
											<span className="text-[11px] text-default-400 font-medium uppercase tracking-wider">
												Nacimiento
											</span>
											<span className="text-xs font-bold text-black">{employee?.birthDate}</span>
										</div>
									</div>

									<div className="p-3 border border-default-100 bg-white rounded-2xl flex items-center gap-3 shadow-sm">
										<div className="p-2 bg-default-50 text-default-500 rounded-lg">
											<Calendar className="size-4" />
										</div>
										<div className="flex flex-col">
											<span className="text-[11px] text-default-400 font-medium uppercase tracking-wider">
												Contratación
											</span>
											<span className="text-xs font-bold text-black">{employee?.hireDate}</span>
										</div>
									</div>

									<div className="p-3 border border-default-100 bg-white rounded-2xl flex items-center gap-3 shadow-sm">
										<div className="p-2 bg-default-50 text-default-500 rounded-lg">
											<DollarSign className="size-4" />
										</div>
										<div className="flex flex-col">
											<span className="text-[11px] text-default-400 font-medium uppercase tracking-wider">
												Salario
											</span>
											<span className="text-xs font-bold text-black">S/ {employee?.salary}</span>
										</div>
									</div>
								</div>
							</div>

							<div className="mt-8 flex justify-end">
								<Button variant="primary" className="px-6 font-semibold" slot="close">
									Cerrar Detalle
								</Button>
							</div>
						</div>
					</div>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

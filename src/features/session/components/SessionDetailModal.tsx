import { Modal, Chip, Button } from '@heroui/react'
import { Target, User, Calendar, Clock, Users, X } from 'lucide-react'
import type { SessionResponse } from '../types'
import defaultImage from '@/assets/global/default.png'
import { CircleFill } from '@gravity-ui/icons'

interface SessionDetailModalProps {
	isOpen: boolean
	onOpenChange: (isOpen: boolean) => void
	session: SessionResponse | null
}

export function SessionDetailModal({ isOpen, onOpenChange, session }: SessionDetailModalProps) {
	if (!session) return null

	const intensityColorMap: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
		Baja: 'success',
		Media: 'warning',
		Alta: 'danger',
	}

	const statusColorMap: Record<string, 'success' | 'danger' | 'warning' | 'default'> = {
		PROGRAMADO: 'default',
		ACTIVO: 'success',
		FINALIZADO: 'danger',
	}

	const trainerName = session.employee
		? `${session.employee.firstName} ${session.employee.lastName || ''}`
		: 'Sin entrenador asignado'

	return (
		<Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
			<Modal.Container>
				<Modal.Dialog className="max-w-5xl overflow-hidden rounded-3xl bg-white p-0">
					<div className="grid grid-cols-1 md:grid-cols-12 min-h-125">
						<div className="md:col-span-5 relative bg-default-100 min-h-62.5 md:min-h-full">
							<img
								src={session.image || defaultImage}
								alt={session.name}
								className="absolute inset-0 w-full h-full object-cover"
								onError={(e) => {
									e.currentTarget.src = defaultImage
								}}
							/>
							{/* Degradado*/}
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
										<Chip
											variant="primary"
											color={intensityColorMap[session.intensity || ''] || 'default'}
											size="sm"
											className="font-semibold"
										>
											<CircleFill width={6} />
											Intensidad {session.intensity}
										</Chip>
										<Chip
											color={statusColorMap[session.status] || 'default'}
											variant="soft"
											size="sm"
											className="font-bold uppercase tracking-wider text-[11px]"
										>
											<CircleFill width={6} />
											{session.status || 'Activo'}
										</Chip>
									</div>
									<h2 className="text-3xl font-black uppercase text-black tracking-tight">
										{session.name}
									</h2>
									<p className="text-default-500 text-sm mt-2 leading-relaxed">
										{session.description || 'Sin descripción disponible para esta clase.'}
									</p>
								</div>

								{/* Sección de Objetivo */}
								{session.goal && (
									<div className="flex flex-col gap-1.5">
										<h4 className="text-xs font-bold uppercase tracking-wider text-default-400 flex items-center gap-2">
											<Target className="size-4 text-primary" /> Objetivo de la sesión
										</h4>
										<p className="text-sm text-slate-700 bg-default-50 p-3 rounded-xl border border-default-100">
											{session.goal}
										</p>
									</div>
								)}

								{/* Sección del Entrenador */}
								<div className="flex flex-col gap-1.5">
									<h4 className="text-xs font-bold uppercase tracking-wider text-default-400 flex items-center gap-2">
										<User className="size-4 text-primary" /> Entrenador a cargo
									</h4>
									<div className="flex items-center gap-3 p-3 bg-default-50/50 rounded-xl border border-default-100">
										<div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
											<User className="size-5" />
										</div>
										<span className="font-semibold text-slate-900 text-sm">{trainerName}</span>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4 mt-2">
									<div className="p-3 border border-default-100 bg-white rounded-2xl flex items-center gap-3 shadow-sm">
										<div className="p-2 bg-default-50 text-default-500 rounded-lg">
											<Calendar className="size-4" />
										</div>
										<div className="flex flex-col">
											<span className="text-[11px] text-default-400 font-medium uppercase tracking-wider">
												Fecha
											</span>
											<span className="text-xs font-bold text-black">
												{session.date?.toString()}
											</span>
										</div>
									</div>

									<div className="p-3 border border-default-100 bg-white rounded-2xl flex items-center gap-3 shadow-sm">
										<div className="p-2 bg-default-50 text-default-500 rounded-lg">
											<Users className="size-4" />
										</div>
										<div className="flex flex-col">
											<span className="text-[11px] text-default-400 font-medium uppercase tracking-wider">
												Capacidad
											</span>
											<span className="text-xs font-bold text-black">
												{session.capacity} socios
											</span>
										</div>
									</div>

									<div className="p-3 border border-default-100 bg-white rounded-2xl flex items-center gap-3 shadow-sm">
										<div className="p-2 bg-default-50 text-default-500 rounded-lg">
											<Clock className="size-4" />
										</div>
										<div className="flex flex-col">
											<span className="text-[11px] text-default-400 font-medium uppercase tracking-wider">
												Hora Inicio
											</span>
											<span className="text-xs font-bold text-black">
												{session.startTime?.toString()}
											</span>
										</div>
									</div>

									<div className="p-3 border border-default-100 bg-white rounded-2xl flex items-center gap-3 shadow-sm">
										<div className="p-2 bg-default-50 text-default-500 rounded-lg">
											<Clock className="size-4" />
										</div>
										<div className="flex flex-col">
											<span className="text-[11px] text-default-400 font-medium uppercase tracking-wider">
												Hora Fin
											</span>
											<span className="text-xs font-bold text-black">
												{session.endTime?.toString()}
											</span>
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

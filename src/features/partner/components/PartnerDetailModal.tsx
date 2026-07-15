import { Modal, Button, Chip, Spinner } from '@heroui/react'
import {
	CalendarClock,
	Dumbbell,
	Mail,
	Phone,
	Ruler,
	Scale,
	Star,
	UserCircle2,
	User,
} from 'lucide-react'
import type { PartnerResponse } from '../types'
import { usePartnerDetail } from '../hooks/usePartners'
import defaultImg from '@/assets/global/default.png'

interface Props {
	isOpen: boolean
	onOpenChange: (open: boolean) => void
	partner: PartnerResponse | null
}

export function PartnerDetailModal({ isOpen, onOpenChange, partner }: Props) {
	const { data: detail, isLoading } = usePartnerDetail(partner?.id ?? null)

	const today = new Date()
	const expDate = detail?.expirationDate ? new Date(detail.expirationDate) : null
	const isExpired = expDate ? expDate < today : false
	const daysRemaining = expDate
		? Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
		: null
	const isExpiringSoon = daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 7

	return (
		<Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
			<Modal.Container size="lg" scroll="inside" placement="center">
				<Modal.Dialog className="rounded-3xl w-full max-h-[90vh]">
					<Modal.CloseTrigger />

					<Modal.Header className="pb-2">
						<Modal.Heading className="text-2xl font-black tracking-tight uppercase text-black">
							Perfil del Socio
						</Modal.Heading>
					</Modal.Header>

					<Modal.Body className="p-6">
						{/* ── Loading ─────────────────────────────────────────────── */}
						{isLoading && (
							<div className="flex flex-col items-center justify-center py-16 gap-3">
								<Spinner size="lg" />
								<p className="text-sm text-default-400">Cargando perfil...</p>
							</div>
						)}

						{/* ── Contenido ──────────────────────────────────────────── */}
						{!isLoading && detail && (
							<div className="flex flex-col gap-6">
								{/* ── Cabecera: avatar + nombre + estado ──────────────── */}
								<div className="flex items-center gap-5">
									{/* Avatar */}
									<div className="w-20 h-20 rounded-full overflow-hidden bg-default-100 border-2 border-default-200 shrink-0 flex items-center justify-center">
										{detail.avatar ? (
											<img
												src={detail.avatar}
												alt={`${detail.firstName} ${detail.lastName}`}
												className="w-full h-full object-cover"
												onError={(e) => {
													e.currentTarget.src = defaultImg
												}}
											/>
										) : (
											<UserCircle2 size={42} className="text-default-300" />
										)}
									</div>

									{/* Info principal */}
									<div>
										<h3 className="text-xl font-black tracking-tight text-black">
											{detail.firstName} {detail.lastName}
										</h3>
										<p className="text-sm text-default-400 font-medium mt-0.5">DNI {detail.dni}</p>
										<div className="flex flex-wrap items-center gap-2 mt-2">
											<Chip
												size="sm"
												color={detail.status ? 'success' : 'default'}
												variant="primary"
												className="text-[10px] font-bold"
											>
												{detail.status ? 'Activo' : 'Inactivo'}
											</Chip>
											{detail.membershipName && (
												<Chip size="sm" variant="primary" className="text-[10px] font-bold">
													{detail.membershipName}
												</Chip>
											)}
											{expDate && (
												<Chip
													size="sm"
													color={isExpired ? 'danger' : isExpiringSoon ? 'warning' : 'default'}
													variant="primary"
													className="text-[10px] font-bold"
												>
													{isExpired
														? `Vencido el ${expDate.toLocaleDateString('es-PE')}`
														: isExpiringSoon
															? `Vence en ${daysRemaining} día${daysRemaining !== 1 ? 's' : ''}`
															: `Vence el ${expDate.toLocaleDateString('es-PE')}`}
												</Chip>
											)}
										</div>
									</div>
								</div>

								<div className="h-px bg-default-100" />

								{/* ── Datos de contacto ──────────────────────────────── */}
								<div className="grid grid-cols-2 gap-3">
									<InfoItem icon={<Mail size={14} />} label="Correo" value={detail.email} />
									<InfoItem
										icon={<Phone size={14} />}
										label="Teléfono"
										value={detail.phoneNumber}
									/>
									<InfoItem icon={<User size={14} />} label="Género" value={detail.gender ?? '—'} />
									<InfoItem
										icon={<CalendarClock size={14} />}
										label="Fecha de ingreso"
										value={
											detail.hireDate ? new Date(detail.hireDate).toLocaleDateString('es-PE') : '—'
										}
									/>
								</div>

								{/* ── Métricas de salud ──────────────────────────────── */}
								{(detail.weight || detail.height || detail.points > 0) && (
									<>
										<div className="h-px bg-default-100" />
										<div>
											<p className="text-xs font-semibold text-default-400 uppercase tracking-wider mb-3">
												Métricas
											</p>
											<div className="grid grid-cols-3 gap-3">
												{detail.weight && (
													<MetricCard
														icon={<Scale size={16} />}
														label="Peso"
														value={`${detail.weight} kg`}
													/>
												)}
												{detail.height && (
													<MetricCard
														icon={<Ruler size={16} />}
														label="Altura"
														value={`${detail.height} cm`}
													/>
												)}
												<MetricCard
													icon={<Star size={16} />}
													label="Puntos"
													value={String(detail.points)}
												/>
											</div>
										</div>
									</>
								)}

								{/* ── Rutinas ─────────────────────────────────────────── */}
								<div className="h-px bg-default-100" />
								<div>
									<div className="flex items-center gap-2 mb-3">
										<Dumbbell size={15} className="text-default-400" />
										<p className="text-xs font-semibold text-default-400 uppercase tracking-wider">
											Rutinas asignadas ({detail.routines.length})
										</p>
									</div>

									{detail.routines.length === 0 ? (
										<div className="border-2 border-dashed border-default-200 rounded-2xl p-6 text-center">
											<p className="text-sm text-default-400">
												Este socio aún no tiene rutinas asignadas.
											</p>
										</div>
									) : (
										<div className="flex flex-col gap-3">
											{detail.routines.map((routine) => (
												<div
													key={routine.id}
													className="border border-default-100 rounded-2xl p-4 bg-default-50/40"
												>
													{/* Cabecera de la rutina */}
													<div className="flex items-start justify-between gap-2 mb-3">
														<div>
															<p className="font-bold text-sm text-slate-900">{routine.name}</p>
															{routine.goal && (
																<p className="text-xs text-default-400 mt-0.5">
																	Objetivo: {routine.goal}
																</p>
															)}
														</div>
														<div className="text-right shrink-0">
															<p className="text-[10px] text-default-400">
																{new Date(routine.startDate).toLocaleDateString('es-PE')} →{' '}
																{new Date(routine.endDate).toLocaleDateString('es-PE')}
															</p>
															{routine.employee && (
																<p className="text-[10px] text-default-400 mt-0.5">
																	Instructor: {routine.employee.firstName}{' '}
																	{routine.employee.lastName}
																</p>
															)}
														</div>
													</div>

													{/* Ejercicios de la rutina */}
													{routine.routineDetails && routine.routineDetails.length > 0 ? (
														<div className="flex flex-col gap-1.5">
															{routine.routineDetails.map((rd) => (
																<div
																	key={rd.id}
																	className="flex items-center justify-between text-xs bg-white rounded-xl px-3 py-2 border border-default-100"
																>
																	<div className="flex items-center gap-2 min-w-0">
																		<span className="w-2 h-2 rounded-full bg-primary/40 shrink-0" />
																		<div className="min-w-0">
																			<span className="font-semibold text-slate-800 truncate block">
																				{rd.exercise.name}
																			</span>
																			<span className="text-default-400 text-[10px]">
																				{rd.dayOfWeek} · {rd.exercise.muscleGroup} ·{' '}
																				{rd.exercise.equipment}
																			</span>
																		</div>
																	</div>
																	<div className="text-right shrink-0 ml-2">
																		<span className="font-black text-slate-800">
																			{rd.sets}×{rd.reps}
																		</span>
																		{rd.weight > 0 && (
																			<span className="text-default-400 ml-1">
																				— {rd.weight} kg
																			</span>
																		)}
																		<span className="text-default-400 block text-[10px]">
																			{rd.calories} kcal · {rd.restTime}s descanso
																		</span>
																	</div>
																</div>
															))}
														</div>
													) : (
														<p className="text-xs text-default-400 italic">
															Sin ejercicios asignados en esta rutina.
														</p>
													)}
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						)}
					</Modal.Body>

					<Modal.Footer className="pt-2">
						<Button variant="secondary" slot="close" className="w-full">
							Cerrar
						</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
	return (
		<div className="flex flex-col gap-0.5">
			<div className="flex items-center gap-1.5 text-default-400">
				{icon}
				<span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span>
			</div>
			<p className="text-sm font-medium text-default-800 truncate">{value}</p>
		</div>
	)
}

function MetricCard({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode
	label: string
	value: string
}) {
	return (
		<div className="rounded-2xl bg-white border border-default-100 p-3 flex flex-col gap-1">
			<div className="flex items-center gap-1.5 text-default-400">
				{icon}
				<span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span>
			</div>
			<p className="text-lg font-black text-default-900">{value}</p>
		</div>
	)
}

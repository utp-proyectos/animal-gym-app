import { Modal, Button, Table, Input, toast } from '@heroui/react'
import {
	User,
	IdCard,
	CalendarDays,
	Trash2,
	Users,
	Loader2,
	AlertCircle,
	UserPlus,
} from 'lucide-react'
import type { PartnerEnrolledRequest, SessionResponse } from '../types'
import { useGetEnrolledPartners, useAddSocioToSession } from '../hooks/useSessionBooking'
import { useForm } from 'react-hook-form'

interface SessionEnrolledModalProps {
	isOpen: boolean
	onOpenChange: (isOpen: boolean) => void
	session: SessionResponse | null
}

export function SessionEnrolledModal({ isOpen, onOpenChange, session }: SessionEnrolledModalProps) {
	const {
		data: members = [],
		isLoading,
		isError,
		error,
	} = useGetEnrolledPartners(session?.id ?? null)

	const { mutate: enrollSocio, isPending } = useAddSocioToSession()

	const { register, handleSubmit, reset } = useForm<PartnerEnrolledRequest>({
		defaultValues: {
			dni: '',
		},
	})

	const onSubmit = (data: PartnerEnrolledRequest) => {
		if (!session?.id) return

		enrollSocio(
			{
				sessionId: session.id,
				dni: data.dni.trim(),
			},
			{
				onSuccess: () => {
					toast.success('Socio inscrito', {
						description: `El socio "${data.dni}" fue inscrito con éxito.`,
					})

					reset()
				},
				onError: () => {
					toast.danger('Error al inscribir socio', {
						description: `No se pudo inscribir el socio. Inténtalo de nuevo.`,
					})
				},
			},
		)
	}

	return (
		<Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
			<Modal.Container>
				<Modal.Dialog className="max-w-2xl">
					<Modal.CloseTrigger />

					{/* Cabecera del Modal */}
					<Modal.Header className="pb-4">
						<Modal.Heading className="text-4xl font-black tracking-tight uppercase text-black flex items-center gap-2">
							<Users size={28} className="text-primary" />
							Gestionar Socios inscritos
						</Modal.Heading>
						<p className="text-sm text-default-500">
							Administra los socios inscritos en la sesión:{' '}
							<span className="font-bold text-black">{session?.name || 'Cargando...'}</span>
						</p>
					</Modal.Header>

					{/* Cuerpo del Modal: Tabla de Socios */}
					<Modal.Body className="p-6 flex flex-col gap-6">
						<Table className="max-h-64 overflow-y-auto">
							<Table.ScrollContainer>
								<Table.Content aria-label="Socios inscritos" className="min-w-120">
									<Table.Header>
										<Table.Column isRowHeader>
											<div className="flex items-center gap-2">
												<User size={16} className="text-default-500" />
												<span>Nombre completo</span>
											</div>
										</Table.Column>
										<Table.Column>
											<div className="flex items-center gap-2">
												<IdCard size={16} className="text-default-500" />
												<span>DNI</span>
											</div>
										</Table.Column>
										<Table.Column>
											<div className="flex items-center gap-2">
												<CalendarDays size={16} className="text-default-500" />
												<span>Inscripción</span>
											</div>
										</Table.Column>
										<Table.Column>
											<div className="flex items-center gap-2 justify-end pr-4">
												<span>Acción</span>
											</div>
										</Table.Column>
									</Table.Header>

									<Table.Body
										renderEmptyState={() => (
											<div className="flex h-40 w-full flex-col items-center justify-center gap-2 text-center p-8">
												<span className="text-sm font-medium text-default-400">
													{isLoading ? (
														<div className="flex items-center gap-2 text-primary font-semibold">
															<Loader2 className="animate-spin size-5" />
															Cargando socios inscritos...
														</div>
													) : isError ? (
														<div className="flex items-center gap-2 text-danger font-semibold">
															<AlertCircle className="size-5" />
															Error al cargar los socios: {error?.message || 'Error desconocido'}
														</div>
													) : (
														'Aún no hay socios inscritos en esta sesión.'
													)}
												</span>
											</div>
										)}
									>
										{!isLoading &&
											!isError &&
											members.map((socio) => (
												<Table.Row key={socio.bookingId}>
													<Table.Cell>
														<span className="font-semibold text-black">
															{socio.firstName} {socio.lastName}
														</span>
													</Table.Cell>
													<Table.Cell>
														<span className="text-default-600 font-mono text-sm">{socio.dni}</span>
													</Table.Cell>
													<Table.Cell>
														<span className="text-sm text-default-500">{socio.enrollmentDate}</span>
													</Table.Cell>
													<Table.Cell>
														<div className="flex items-center justify-end pr-2">
															<Button
																aria-label="Dar de baja socio"
																className="min-w-8 w-8 h-8 p-0 bg-transparent hover:bg-danger-50 text-danger rounded-full flex items-center justify-center transition-colors"
																onPress={console.log}
															>
																<Trash2 size={16} />
															</Button>
														</div>
													</Table.Cell>
												</Table.Row>
											))}
									</Table.Body>
								</Table.Content>
							</Table.ScrollContainer>
						</Table>

						<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
							<label className="text-sm font-bold text-black uppercase tracking-wider ml-1">
								Inscribir Socio de forma rápida
							</label>
							<div className="flex gap-2 items-center">
								<div className="flex-1">
									<Input
										placeholder="Ingrese el DNI del socio (Ej. 71234567)"
										maxLength={8}
										className="w-full"
										variant="secondary"
										disabled={isPending}
										{...register('dni', {
											required: true,
											maxLength: 8,
											onChange: (e) => {
												e.target.value = e.target.value.replace(/\D/g, '')
											},
										})}
									/>
								</div>
								<Button type="submit" className="bg-primary text-white font-semibold px-6">
									<UserPlus size={18} className="mr-1" />
									{isPending ? 'Inscribiendo...' : 'Inscribir'}
								</Button>
							</div>
						</form>
					</Modal.Body>

					{/* Pie del Modal */}
					<Modal.Footer className="pt-4">
						<Button variant="secondary" slot="close">
							Cerrar
						</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

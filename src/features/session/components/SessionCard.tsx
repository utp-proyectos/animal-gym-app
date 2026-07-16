import { Button, Card, Dropdown, Label, Modal } from '@heroui/react'
import { Edit3, MoreVertical, Trash2, Users } from 'lucide-react'
import type { SessionResponse } from '../types'
import defaultImg from '@/assets/global/default.png'
import HasRole from '@/shared/components/auth/HasRole'
import { useCancelSubscription, useSubscribeToSession } from '../hooks/useSessionBooking'
import { useState } from 'react'

interface Props {
	sessions: SessionResponse[]
	onEdit: (session: SessionResponse) => void
	onDelete: (session: SessionResponse) => void
	onViewDetail: (session: SessionResponse) => void
	onSessionEnrolled: (session: SessionResponse) => void
	currentPartnerId: number
}

interface ConfirmModalState {
	isOpen: boolean
	session: SessionResponse | null
	action: 'subscribe' | 'cancel' | null
}

export function SessionCard({
	sessions,
	onEdit,
	onDelete,
	onViewDetail,
	onSessionEnrolled,
	currentPartnerId,
}: Props) {
	// Mutaciones de React Query
	const { mutate: subscribe, isPending: isSubscribing } = useSubscribeToSession()
	const { mutate: cancelSubscription, isPending: isCanceling } = useCancelSubscription()

	// Estado único para controlar el modal de Confirmación
	const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
		isOpen: false,
		session: null,
		action: null,
	})

	const handleAction = (key: string, session: SessionResponse) => {
		if (key === 'edit') onEdit(session)
		if (key === 'delete') onDelete(session)
		if (key === 'detail') onViewDetail(session)
		if (key === 'enrolled') onSessionEnrolled(session)
	}

	const openConfirmModal = (session: SessionResponse, action: 'subscribe' | 'cancel') => {
		setConfirmModal({
			isOpen: true,
			session,
			action,
		})
	}

	const handleConfirmAction = () => {
		const { session, action } = confirmModal
		if (!session || !currentPartnerId) return

		if (action === 'subscribe') {
			subscribe(
				{ partnerId: currentPartnerId, sessionId: session.id },
				{ onSettled: () => setConfirmModal({ isOpen: false, session: null, action: null }) },
			)
		} else if (action === 'cancel') {
			cancelSubscription(
				{ partnerId: currentPartnerId, sessionId: session.id },
				{ onSettled: () => setConfirmModal({ isOpen: false, session: null, action: null }) },
			)
		}
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{sessions.map((session) => (
				<Card
					key={session.id}
					className="p-0 border-none bg-white hover:-translate-y-1 transition-all duration-300 shadow-md overflow-hidden flex flex-col"
				>
					{/* Imagen de la sesión */}
					<div className="w-full aspect-video relative overflow-hidden rounded-t-3xl bg-default-100">
						<img
							alt={session.name}
							src={session.image || defaultImg}
							className="absolute inset-0 w-full h-full object-cover object-center"
							onError={(e) => {
								e.currentTarget.src = defaultImg
							}}
						/>

						{/* Badge de Estado flotante */}
						<div className="absolute top-4 left-5 z-10">
							<span className="bg-white/90 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
								{session.status}
							</span>
						</div>
					</div>

					{/* Contenido de la tarjeta */}
					<div className="p-6 flex flex-col gap-3 flex-1 justify-between">
						<div className="flex justify-between items-start gap-2">
							<div className="flex flex-col">
								<h4 className="font-bold text-2xl text-black tracking-tight leading-tight">
									{session.name}
								</h4>
								<p className="text-default-500 text-xs font-semibold uppercase mt-1 flex items-center gap-1.5">
									<span>Inscritos:</span>
									<span
										className={`font-bold ${
											(session.bookingsCount ?? 0) >= session.capacity
												? 'text-danger'
												: (session.bookingsCount ?? 0) >= session.capacity * 0.8
													? 'text-warning'
													: 'text-primary'
										}`}
									>
										{session.bookingsCount ?? 0}
									</span>
									<span className="text-default-400">/</span>
									<span className="text-black font-bold">{session.capacity}</span>
								</p>
							</div>

							{/* Menú de opciones desplegables */}
							<HasRole roles={['ADMIN', 'RECEPCIONISTA']}>
								<Dropdown>
									<Button
										aria-label="Opciones de clase"
										className="min-w-8 w-8 h-8 p-0 bg-transparent hover:bg-default-100 rounded-full border-none outline-none flex items-center justify-center"
									>
										<MoreVertical size={20} className="text-black" strokeWidth={3} />
									</Button>
									<Dropdown.Popover>
										<Dropdown.Menu
											onAction={(key) => handleAction(String(key), session)}
											className="min-w-42.5 bg-white border border-default-100 shadow-xl rounded-2xl"
										>
											<Dropdown.Item id="edit" textValue="Editar clase">
												<div className="flex items-center gap-2 py-1">
													<Edit3 size={16} className="text-black" />
													<Label className="font-semibold text-black">Editar clase</Label>
												</div>
											</Dropdown.Item>
											<Dropdown.Item id="enrolled" textValue="Gestionar socios">
												<div className="flex items-center gap-2 py-1">
													<Users size={16} className="text-black" />
													<Label className="font-semibold text-black">Gestionar socios</Label>
												</div>
											</Dropdown.Item>
											<Dropdown.Item id="delete" textValue="Eliminar clase" className="text-danger">
												<div className="flex items-center gap-2 py-1">
													<Trash2 size={16} />
													<Label className="font-semibold">Eliminar clase</Label>
												</div>
											</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown.Popover>
								</Dropdown>
							</HasRole>
						</div>

						{/* Footer de la tarjeta */}
						<div>
							<div className="h-px w-full bg-default-100 mb-3" />
							<div className="flex items-center justify-between">
								<HasRole roles={['SOCIO']}>
									{session.enrolled ? (
										/* Botón de Cancelar Inscripción (Suscrito) */
										<Button
											size="sm"
											variant="danger"
											onPress={() => openConfirmModal(session, 'cancel')}
										>
											{isCanceling ? 'Cancelando...' : 'Cancelar'}
										</Button>
									) : (
										/* Botón de Inscribirse (No suscrito) */
										<Button
											size="sm"
											variant="primary"
											isDisabled={(session.bookingsCount ?? 0) >= session.capacity}
											onPress={() => openConfirmModal(session, 'subscribe')}
										>
											{isSubscribing
												? 'Inscribiendo...'
												: (session.bookingsCount ?? 0) >= session.capacity
													? 'Lleno'
													: 'Inscribirse'}{' '}
										</Button>
									)}
								</HasRole>
								<Button variant="outline" size="sm" onPress={() => onViewDetail(session)}>
									Ver detalles
								</Button>
							</div>
						</div>
					</div>
				</Card>
			))}

			<Modal.Backdrop
				isOpen={confirmModal.isOpen}
				onOpenChange={(isOpen) =>
					!isOpen && setConfirmModal({ isOpen: false, session: null, action: null })
				}
			>
				<Modal.Container>
					<Modal.Dialog className="max-w-md">
						<Modal.CloseTrigger />

						<Modal.Header className="pb-2">
							<Modal.Heading className="text-2xl font-black text-black">
								{confirmModal.action === 'subscribe'
									? 'Confirmar Inscripción'
									: 'Cancelar Inscripción'}
							</Modal.Heading>
						</Modal.Header>

						<Modal.Body className="py-4">
							<p className="text-default-600 text-sm">
								{confirmModal.action === 'subscribe' ? (
									<span>
										¿Estás seguro de que deseas inscribirte en la clase de{' '}
										<strong className="text-black">"{confirmModal.session?.name}"</strong>? Se
										reservará un cupo a tu nombre de inmediato.
									</span>
								) : (
									<span>
										¿Estás seguro de que deseas liberar tu cupo para{' '}
										<strong className="text-black">"{confirmModal.session?.name}"</strong>? Esta
										acción no se puede deshacer y tu cupo quedará disponible para otros socios.
									</span>
								)}
							</p>
						</Modal.Body>

						<Modal.Footer className="flex gap-2 justify-end">
							<Button
								variant="secondary"
								slot="close"
								onPress={() => setConfirmModal({ isOpen: false, session: null, action: null })}
							>
								Cancelar
							</Button>
							<Button
								variant={confirmModal.action === 'subscribe' ? 'primary' : 'danger'}
								onPress={handleConfirmAction}
							>
								{confirmModal.action === 'subscribe' ? 'Sí, inscribirme' : 'Sí, cancelar cupo'}
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</div>
	)
}

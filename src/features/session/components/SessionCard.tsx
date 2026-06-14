import { Button, Card, Dropdown, Label } from '@heroui/react'
import { Edit3, MoreVertical, Trash2 } from 'lucide-react'
import type { SessionResponse } from '../types'
import defaultImg from '@/assets/global/default.png'

interface Props {
	sessions: SessionResponse[]
	onEdit: (session: SessionResponse) => void
	onDelete: (session: SessionResponse) => void
	onViewDetail: (session: SessionResponse) => void
}

export function SessionCard({ sessions, onEdit, onDelete, onViewDetail }: Props) {
	// Manejo de acciones centralizado tal cual lo estructuró tu amigo
	const handleAction = (key: string, session: SessionResponse) => {
		if (key === 'edit') onEdit(session)
		if (key === 'delete') onDelete(session)
		if (key === 'detail') onViewDetail(session)
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{sessions.map((session) => (
				<Card
					key={session.id}
					className="p-0 border-none bg-white hover:-translate-y-1 transition-all duration-300 shadow-md overflow-hidden flex flex-col"
				>
					{/* Imagen de la sesión */}
					<div className="w-full aspect-video relative">
						<img
							alt={session.name}
							className="w-full h-full object-cover"
							src={session.image || defaultImg}
							onError={(e) => {
								e.currentTarget.src = defaultImg
							}}
						/>
						{/* Badge de Estado flotante */}
						<div className="absolute top-4 left-5">
							<span className="bg-white/90 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
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
								<p className="text-default-400 text-xs font-semibold uppercase mt-0.5">
									Capacidad: {session.capacity} personas
								</p>
							</div>

							{/* Menú de opciones desplegables */}
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
										<Dropdown.Item id="delete" textValue="Eliminar clase" className="text-danger">
											<div className="flex items-center gap-2 py-1">
												<Trash2 size={16} />
												<Label className="font-semibold">Eliminar clase</Label>
											</div>
										</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown.Popover>
							</Dropdown>
						</div>

						{/* Footer de la tarjeta */}
						<div>
							<div className="h-px w-full bg-default-100 mb-3" />
							<div className="flex items-center justify-between">
								<span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
									Clase ID: #{session.id}
								</span>
								<Button variant="outline" size="sm" onPress={() => onViewDetail(session)}>
									Ver detalles
								</Button>
							</div>
						</div>
					</div>
				</Card>
			))}
		</div>
	)
}

// src/components/EmployeeCard.tsx
import { Button, Card, Dropdown, Label, Separator } from '@heroui/react'
import { Edit3, KeyRound, MoreVertical, Trash2 } from 'lucide-react'
import type { EmployeeResponse } from '../types'
import defult from '@/assets/global/default.png'
interface Props {
	employees: EmployeeResponse[]
	onEdit: (id: number) => void
	onDelete: (id: number) => void
	onChangePassword: (id: number) => void
	onViewDetail: (id: number) => void
}

export function EmployeeCard({
	employees,
	onEdit,
	onDelete,
	onChangePassword,
	onViewDetail,
}: Props) {
	const handleAction = (key: string, id: number) => {
		if (key === 'edit') onEdit(id)
		if (key === 'delete') onDelete(id)
		if (key === 'password') onChangePassword(id)
		if (key === 'detail') onViewDetail(id)
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
			{employees.map((employee) => (
				<Card
					key={employee.id}
					className="p-0 border-none bg-white hover:-translate-y-1 transition-all duration-300 shadow-md overflow-hidden flex flex-col"
				>
					{/* Imagen */}
					<div className="w-full aspect-4/3 relative">
						<img
							alt={`${employee.firstName} ${employee.lastName}`}
							className="w-full h-full object-cover"
							src={employee.image || defult}
							onError={(e) => {
								e.currentTarget.src = defult
							}}
						/>
						<div className="absolute top-3 left-4">
							<span className="bg-white/90 backdrop-blur-md text-primary text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full">
								{employee.role}
							</span>
						</div>
					</div>

					{/* Contenido */}
					<div className="p-4 flex flex-col gap-3 flex-1 justify-between">
						<div className="flex justify-between items-start gap-2">
							<div className="flex flex-col">
								<h4 className="font-bold text-lg text-black tracking-tight leading-tight">
									{employee.firstName} {employee.lastName}
								</h4>
								<p className="text-default-400 text-[11px] font-semibold uppercase mt-0.5">
									Animal Gym
								</p>
							</div>

							<Dropdown>
								<Button
									aria-label="Opciones"
									className="min-w-8 w-8 h-8 p-0 bg-transparent hover:bg-default-100 rounded-full border-none outline-none flex items-center justify-center"
								>
									<MoreVertical size={20} className="text-black" strokeWidth={3} />
								</Button>
								<Dropdown.Popover>
									<Dropdown.Menu
										onAction={(key) => handleAction(String(key), employee.id)}
										className="min-w-42.5 bg-white border border-default-100 shadow-xl rounded-2xl"
									>
										<Dropdown.Item id="edit" textValue="Editar">
											<div className="flex items-center gap-2 py-1">
												<Edit3 size={16} className="text-black" />
												<Label className="font-semibold text-black">Editar</Label>
											</div>
										</Dropdown.Item>
										<Dropdown.Item id="password" textValue="Cambiar contraseña">
											<div className="flex items-center gap-2 py-1">
												<KeyRound size={16} className="text-black" />
												<Label className="font-semibold text-black">Cambiar contraseña</Label>
											</div>
										</Dropdown.Item>
										<Separator />
										<Dropdown.Item id="delete" textValue="Eliminar" className="text-danger">
											<div className="flex items-center gap-2 py-1">
												<Trash2 size={16} />
												<Label className="font-semibold">Eliminar</Label>
											</div>
										</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown.Popover>
							</Dropdown>
						</div>

						<div>
							<div className="h-px w-full bg-default-100 mb-3" />
							<div className="flex items-center justify-between">
								<Button variant="outline" size="sm" onPress={() => onViewDetail(employee.id)}>
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

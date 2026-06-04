// src/components/EmployeeCard.tsx
import { Button, Card, Dropdown, Label, Separator } from '@heroui/react'
import { EllipsisVertical } from 'lucide-react'
import type { EmployeeResponse } from '../EmployeeType'

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
		<div className="flex flex-wrap gap-4 p-6">
			{employees.map((employee) => (
				<Card key={employee.id} className="w-[320px] gap-3 shadow-lg">
					<img
						alt={`${employee.firstName} ${employee.lastName}`}
						className="w-full h-48 object-fill rounded"
						src={employee.image}
					/>
					<Card.Header className="gap-1 flex-row items-center justify-between">
						<div>
							<Card.Title className="text-xl">
								{employee.firstName} {employee.lastName}
							</Card.Title>
							<Card.Description className="text-base">{employee.role}</Card.Description>
						</div>

						<Dropdown>
							<Dropdown.Trigger>
								<Button variant="ghost" size="sm" aria-label="Opciones">
									<EllipsisVertical className="size-5" />
								</Button>
							</Dropdown.Trigger>
							<Dropdown.Popover>
								<Dropdown.Menu onAction={(key) => handleAction(String(key), employee.id)}>
									<Dropdown.Item id="edit" textValue="Editar">
										<Label>Editar</Label>
									</Dropdown.Item>
									<Dropdown.Item id="password" textValue="Cambiar contraseña">
										<Label>Cambiar contraseña</Label>
									</Dropdown.Item>
									<Dropdown.Item id="detail" textValue="Ver detalles">
										<Label>Ver detalles</Label>
									</Dropdown.Item>
									<Separator />
									<Dropdown.Item id="delete" textValue="Eliminar" variant="danger">
										<Label>Eliminar</Label>
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown.Popover>
						</Dropdown>
					</Card.Header>
				</Card>
			))}
		</div>
	)
}

import { Button, FieldError, InputGroup, Label, Modal, TextField } from '@heroui/react'
import { KeyRound, Eye, EyeClosed, Lock } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useChangePassword } from '@/features/user/hook/UseUser'
import type { EmployeeDetailResponse } from '../types'

const schema = z
	.object({
		newPassword: z.string().min(8, 'Mínimo 8 caracteres'),
		confirmPassword: z.string().min(8, 'Mínimo 8 caracteres'),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'Las contraseñas no coinciden',
		path: ['confirmPassword'],
	})

type PasswordSchema = z.infer<typeof schema>

interface Props {
	isOpen: boolean
	onOpenChange: (open: boolean) => void
	employee: EmployeeDetailResponse | null
}

export function EmployeePasswordModal({ isOpen, onOpenChange, employee }: Props) {
	const { mutate: changePassword, isPending } = useChangePassword()
	const [isNewVisible, setIsNewVisible] = useState(false)
	const [isConfirmVisible, setIsConfirmVisible] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<PasswordSchema>({
		resolver: zodResolver(schema),
	})

	const onSubmit = (data: PasswordSchema) => {
		if (!employee) return
		changePassword(
			{ personId: employee.id, newPassword: data.newPassword },
			{
				onSuccess: () => {
					reset()
					onOpenChange(false)
				},
			},
		)
	}

	return (
		<Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
			<Modal.Container>
				<Modal.Dialog className="sm:max-w-md">
					<Modal.CloseTrigger />

					<Modal.Header>
						<div className="flex items-center gap-3">
							<KeyRound size={24} className="text-black" />
							<div>
								<Modal.Heading className="text-2xl font-black tracking-tight uppercase text-black">
									Cambiar contraseña
								</Modal.Heading>
								<p className="text-sm text-default-500">Ingresa la nueva contraseña</p>
							</div>
						</div>
					</Modal.Header>

					<Modal.Body className="py-6">
						<form
							id="form-password"
							className="flex flex-col gap-4"
							onSubmit={handleSubmit(onSubmit)}
						>
							<TextField isInvalid={!!errors.newPassword}>
								<Label>Nueva contraseña</Label>
								<InputGroup>
									<InputGroup.Prefix>
										<Lock className="size-4" />
									</InputGroup.Prefix>
									<InputGroup.Input
										{...register('newPassword')}
										type={isNewVisible ? 'text' : 'password'}
										placeholder="Mínimo 8 caracteres"
										autoComplete="new-password"
									/>
									<InputGroup.Suffix>
										<Button
											type="button"
											isIconOnly
											size="sm"
											variant="ghost"
											onPress={() => setIsNewVisible(!isNewVisible)}
										>
											{isNewVisible ? <EyeClosed className="size-4" /> : <Eye className="size-4" />}
										</Button>
									</InputGroup.Suffix>
								</InputGroup>
								<FieldError>{errors.newPassword?.message}</FieldError>
							</TextField>

							<TextField isInvalid={!!errors.confirmPassword}>
								<Label>Confirmar contraseña</Label>
								<InputGroup>
									<InputGroup.Prefix>
										<Lock className="size-4" />
									</InputGroup.Prefix>
									<InputGroup.Input
										{...register('confirmPassword')}
										type={isConfirmVisible ? 'text' : 'password'}
										placeholder="Repite la contraseña"
										autoComplete="new-password"
									/>
									<InputGroup.Suffix>
										<Button
											type="button"
											isIconOnly
											size="sm"
											variant="ghost"
											onPress={() => setIsConfirmVisible(!isConfirmVisible)}
										>
											{isConfirmVisible ? (
												<EyeClosed className="size-4" />
											) : (
												<Eye className="size-4" />
											)}
										</Button>
									</InputGroup.Suffix>
								</InputGroup>
								<FieldError>{errors.confirmPassword?.message}</FieldError>
							</TextField>

							<div className="flex justify-end gap-2 border-t pt-4">
								<Button type="button" variant="secondary" slot="close">
									Cancelar
								</Button>
								<Button type="submit" isPending={isPending}>
									<KeyRound className="size-4" />
									{isPending ? 'Guardando...' : 'Guardar'}
								</Button>
							</div>
						</form>
					</Modal.Body>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

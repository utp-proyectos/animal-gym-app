// src/components/EmployeeFormModal.tsx
import {
	Button,
	DateField,
	Description,
	FieldError,
	Form,
	Input,
	Label,
	Modal,
	TextField,
} from '@heroui/react'
import { UserPlus } from 'lucide-react'
import { CustomSelect } from '../../../components/CustomSelect'

interface Props {
	onClose: () => void
}

export function EmployeeFormModal({ onClose }: Props) {
	// Opciones en arreglos de strings puros
	const GENDER_OPTIONS = ['Masculino', 'Femenino', 'Otro']
	const CONTRACT_OPTIONS = ['FULL_TIME', 'PART_TIME', 'TEMPORARY']
	const SPECIALTY_OPTIONS = ['Emergencias', 'Pediatría', 'Cardiología', 'General']
	const ROLE_OPTIONS = ['ADMIN', 'NURSE', 'DOCTOR']

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		const data: Record<string, string> = {}
		formData.forEach((value, key) => {
			data[key] = value.toString()
		})
		console.log(data)
	}

	return (
		<Modal
			defaultOpen
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose()
			}}
		>
			<Modal.Backdrop>
				<Modal.Container>
					<Modal.Dialog className="sm:max-w-4xl max-h-[90vh]">
						<Modal.CloseTrigger />

						<Modal.Header className=" pb-4">
							<Modal.Heading className="text-4xl font-black tracking-tight uppercase text-black">
								Nuevo empleado
							</Modal.Heading>
							<p className="text-sm text-default-500">
								Completa la información para registrar un nuevo empleado.
							</p>
						</Modal.Header>

						<Modal.Body className="overflow-y-auto py-4">
							<Form className="space-y-8" id="form-modal" onSubmit={onSubmit}>
								{/* DATOS PERSONALES */}
								<section className="space-y-4">
									<h3 className="font-semibold text-lg">Datos personales</h3>

									<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
										<TextField isRequired name="dni">
											<Label>DNI</Label>
											<Input placeholder="12345678" variant="secondary" />
											<FieldError />
										</TextField>

										<TextField isRequired name="firstName">
											<Label>Nombre</Label>
											<Input placeholder="Juan" variant="secondary" />
											<FieldError />
										</TextField>

										<TextField isRequired name="lastName">
											<Label>Apellido</Label>
											<Input placeholder="Pérez" variant="secondary" />
											<FieldError />
										</TextField>
									</div>

									<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
										<TextField isRequired name="phoneNumber" variant="secondary">
											<Label>Teléfono</Label>
											<Input placeholder="999888777" />
											<FieldError />
										</TextField>

										<TextField isRequired name="email" type="email">
											<Label>Email</Label>
											<Input placeholder="juan@empresa.com" variant="secondary" />
											<FieldError />
										</TextField>

										<CustomSelect
											name="gender"
											label="Género"
											placeholder="Selecciona género"
											options={GENDER_OPTIONS}
											isRequired
										/>
									</div>

									<div className="grid gap-4 md:grid-cols-2">
										<DateField className="w-full bg-content2" name="birthDate" isRequired>
											<Label>Fecha de nacimiento</Label>
											<DateField.Group>
												<DateField.Input>
													{(segment) => <DateField.Segment segment={segment} />}
												</DateField.Input>
											</DateField.Group>
										</DateField>

										<TextField name="image">
											<Label>URL de imagen</Label>
											<Input placeholder="Sube tu archivo" type="field" variant="secondary" />
											<FieldError />
										</TextField>
									</div>
								</section>

								{/* DATOS LABORALES */}
								<section className="space-y-4 border-t pt-6">
									<h3 className="font-semibold text-lg">Datos laborales</h3>

									<div className="grid gap-4 md:grid-cols-2">
										<DateField className="w-full" name="hireDate" isRequired>
											<Label>Fecha de contratación</Label>
											<DateField.Group>
												<DateField.Input>
													{(segment) => <DateField.Segment segment={segment} />}
												</DateField.Input>
											</DateField.Group>
										</DateField>

										<TextField isRequired name="salary" type="number">
											<Label>Salario</Label>
											<Input placeholder="2500" variant="secondary" />
											<FieldError />
										</TextField>
									</div>

									<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
										<CustomSelect
											name="contractType"
											label="Tipo de contrato"
											placeholder="Selecciona contrato"
											options={CONTRACT_OPTIONS}
											isRequired
										/>

										<CustomSelect
											name="specialty"
											label="Especialidad"
											placeholder="Selecciona especialidad"
											options={SPECIALTY_OPTIONS}
											isRequired
										/>

										<CustomSelect
											name="role"
											label="Rol"
											placeholder="Selecciona un rol"
											options={ROLE_OPTIONS}
											isRequired
										/>
									</div>
								</section>

								{/* CREDENCIALES */}
								<section className="space-y-4 border-t pt-6">
									<h3 className="font-semibold text-lg">Credenciales</h3>

									<div className="grid gap-4 md:grid-cols-2">
										<TextField isRequired name="password" type="password" minLength={8}>
											<Label>Contraseña</Label>
											<Input placeholder="Mínimo 8 caracteres" variant="secondary" />
											<Description>La contraseña debe tener al menos 8 caracteres.</Description>
											<FieldError />
										</TextField>

										<div className="flex items-center justify-center border rounded-xl h-40">
											<img
												src="../assets/global/preview.png"
												alt="img"
												className="w-full h-full object-fill"
											/>
										</div>
									</div>
								</section>
							</Form>
						</Modal.Body>
						<Modal.Footer className="border-t pt-4">
							<Button type="reset" variant="secondary" slot="close">
								Cancelar
							</Button>

							<Button type="submit" form="form-modal">
								<UserPlus className="size-4" />
								Guardar empleado
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	)
}

import type { DateValue } from '@heroui/react'
import { z } from 'zod'

type Role = 'Admin' | 'Entrenador' | 'Recepcionista'
type Especiality = 'Brazos' | 'Piernas' | 'Danzas' | 'Biceps'
type ContractType = 'Tiempo completo' | 'Medio tiempo'
type Gender = 'Masculino' | 'Femenino' | 'Otro'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png']
const baseSchema = z.object({
	dni: z
		.string({ message: ' El campo es requerido' })
		.min(1, 'El campo es requerido')
		.length(8, 'DNI debe tener exactamente 8 caracteres'),
	firstName: z
		.string({ message: 'El campo es requerido' })
		.min(1, 'El campo es requerido')
		.min(2, 'Mínimo 2 caracteres'),
	lastName: z
		.string({ message: 'El campo es requerido' })
		.min(1, 'El campo es requerido')
		.min(2, 'Mínimo 2 caracteres'),
	phoneNumber: z
		.string({ message: 'El campo es requerido' })
		.min(1, 'El campo es requerido')
		.min(9, 'Teléfono debe tener exactamente 9 caracteres'),
	email: z.email('Email inválido'),
	avatar: z
		.custom<FileList>()
		.transform((files) => files[0])
		.refine((file) => !file || file.size <= MAX_FILE_SIZE, 'El archivo no puede superar los 5MB')
		.refine((file) => !file || ACCEPTED_TYPES.includes(file.type), 'Solo se permite .jpg y .png')
		.nullable(),
	gender: z
		.custom<Gender | null>()
		.refine((value) => value !== null, { message: 'Selecciona un género' }),
	birthDate: z
		.custom<DateValue | null>()
		.refine((value) => value !== null, { message: 'Fecha de nacimiento requerida' })
		.transform((val) => val!.toString()),

	hireDate: z
		.custom<DateValue | null>()
		.refine((value) => value !== null, { message: 'Fecha de contratación requerida' })
		.transform((val) => val!.toString()),

	salary: z.number({ message: 'El campo es requerido' }).min(0, 'El valor minimo es 0'),

	contractType: z
		.custom<ContractType | null>()
		.refine((value) => value !== null, { error: 'Selecciona un contrato' }),
	specialty: z
		.custom<Especiality | null>()
		.nullable()
		.refine((value) => value !== null, { error: 'Selecciona una especialidad' }),
	role: z
		.custom<Role | null>()
		.nullable()
		.refine((value) => value !== null, { error: 'Selecciona un rol' }),
})

export const createSchema = baseSchema.extend({
	password: z.string().min(8, 'Mínimo 8 caracteres'),
})

export const editSchema = baseSchema.extend({
	id: z.number(),
	avatar: z
		.union([z.instanceof(File), z.string()])
		.nullable()
		.optional(),
})

export type CreateInput = z.input<typeof createSchema>
export type CreateOutput = z.output<typeof createSchema>

export type EditInput = z.input<typeof editSchema>
export type EditOutput = z.output<typeof editSchema>

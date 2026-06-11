import type { Key } from '@heroui/react'
import type { CalendarDate, CalendarDateTime, ZonedDateTime } from '@internationalized/date'
import { z } from 'zod'

type HeroUIDate = CalendarDate | CalendarDateTime | ZonedDateTime

const baseSchema = z.object({
	dni: z.string().length(8, 'DNI debe tener exactamente 8 caracteres'),
	firstName: z.string().min(2, 'Mínimo 2 caracteres'),
	lastName: z.string().min(2, 'Mínimo 2 caracteres'),
	phoneNumber: z.string().min(9, 'Teléfono inválido'),
	email: z.email('Email inválido'),
	avatar: z.instanceof(File).nullable().optional().default(null),
	gender: z
		.custom<Key | null>()
		.refine((value) => value !== null && value !== '', { message: 'Selecciona un género' })
		.transform((val) => String(val)),

	birthDate: z
		.custom<HeroUIDate | null>()
		.refine((value) => value !== null, { message: 'Fecha de nacimiento requerida' })
		.transform((val) => val!.toString()),

	hireDate: z
		.custom<HeroUIDate | null>()
		.refine((value) => value !== null, { message: 'Fecha de contratación requerida' })
		.transform((val) => val!.toString()),

	salary: z.number().positive('Debe ser mayor a 0'),

	contractType: z
		.custom<Key>()
		.nullable()
		.refine((value) => value !== null && value !== '', { error: 'Selecciona un contrato' }),
	specialty: z
		.custom<Key>()
		.nullable()
		.refine((value) => value !== null && value !== '', { error: 'Selecciona una especialidad' }),
	role: z
		.custom<Key>()
		.nullable()
		.refine((value) => value !== null && value !== '', { error: 'Selecciona un rol' }),
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

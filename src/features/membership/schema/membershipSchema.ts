import { z } from 'zod'
import type { DateValue } from '@internationalized/date'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const imageSchema = z
	.custom<FileList | null>()
	.transform((files) => (files && files.length > 0 ? files[0] : null))
	.refine((file) => !file || file.size <= MAX_FILE_SIZE, 'El archivo no puede superar los 5 MB')
	.refine(
		(file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
		'Solo se permite .jpg, .png o .webp',
	)

const optionalDate = z
	.custom<DateValue | null>()
	.nullable()
	.transform((val) => val?.toString() ?? null)

const baseObject = z.object({
	name: z
		.string({ message: 'El nombre es requerido' })
		.min(1, 'El nombre es requerido')
		.max(70, 'Máximo 70 caracteres'),

	description: z
		.string()
		.optional()
		.nullable()
		.transform((val) => val ?? null),

	duration: z
		.number({ message: 'La duración es requerida' })
		.int('Debe ser un número entero')
		.min(1, 'Mínimo 1 día'),

	price: z.number({ message: 'El precio es requerido' }).min(0.01, 'El precio debe ser mayor a 0'),

	discountPrice: z
		.number()
		.positive('El precio de oferta debe ser positivo')
		.nullable()
		.optional()
		.transform((val) => val ?? null),

	offerStartDate: optionalDate,
	offerEndDate: optionalDate,

	status: z.boolean(),

	capacityLimit: z
		.number({ message: 'El límite de cupos es requerido' })
		.int('Debe ser un número entero')
		.min(1, 'Mínimo 1 cupo'),
})

export const createSchema = baseObject
	.extend({
		image: imageSchema.refine((file) => file !== null, 'La imagen es requerida'),
	})
	.refine((d) => d.discountPrice == null || d.discountPrice < d.price, {
		path: ['discountPrice'],
		message: 'El precio de oferta debe ser menor al precio normal',
	})
	.refine((d) => d.discountPrice == null || !!d.offerStartDate, {
		path: ['offerStartDate'],
		message: 'Fecha de inicio requerida con precio de oferta',
	})
	.refine((d) => d.discountPrice == null || !!d.offerEndDate, {
		path: ['offerEndDate'],
		message: 'Fecha de fin requerida con precio de oferta',
	})
	.refine((d) => !d.offerStartDate || !d.offerEndDate || d.offerEndDate > d.offerStartDate, {
		path: ['offerEndDate'],
		message: 'La fecha de fin debe ser posterior a la de inicio',
	})

export const editSchema = baseObject
	.extend({
		id: z.number(),
		image: imageSchema,
	})
	.refine((d) => d.discountPrice == null || d.discountPrice < d.price, {
		path: ['discountPrice'],
		message: 'El precio de oferta debe ser menor al precio normal',
	})
	.refine((d) => d.discountPrice == null || !!d.offerStartDate, {
		path: ['offerStartDate'],
		message: 'Fecha de inicio requerida con precio de oferta',
	})
	.refine((d) => d.discountPrice == null || !!d.offerEndDate, {
		path: ['offerEndDate'],
		message: 'Fecha de fin requerida con precio de oferta',
	})
	.refine((d) => !d.offerStartDate || !d.offerEndDate || d.offerEndDate > d.offerStartDate, {
		path: ['offerEndDate'],
		message: 'La fecha de fin debe ser posterior a la de inicio',
	})

export type CreateInput = z.input<typeof createSchema>
export type CreateOutput = z.output<typeof createSchema>

export type EditInput = z.input<typeof editSchema>
export type EditOutput = z.output<typeof editSchema>

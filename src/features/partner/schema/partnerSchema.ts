import { z } from 'zod'
import type { DateValue } from '@internationalized/date'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const optionalDate = z
	.custom<DateValue | null>()
	.nullable()
	.transform((val) => val?.toString() ?? null)

const avatarSchema = z
	.custom<FileList | null>()
	.transform((files) => (files && files.length > 0 ? files[0] : null))
	.refine((file) => !file || file.size <= MAX_FILE_SIZE, 'El archivo no puede superar los 5 MB')
	.refine(
		(file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
		'Solo se permite .jpg, .png o .webp',
	)

const basePartnerSchema = z.object({
	dni: z
		.string({ message: 'El DNI es requerido' })
		.length(8, 'El DNI debe tener exactamente 8 dígitos')
		.regex(/^\d{8}$/, 'El DNI solo debe contener números'),

	firstName: z
		.string({ message: 'El nombre es requerido' })
		.min(2, 'Mínimo 2 caracteres')
		.max(50, 'Máximo 50 caracteres'),

	lastName: z
		.string({ message: 'El apellido es requerido' })
		.min(2, 'Mínimo 2 caracteres')
		.max(50, 'Máximo 50 caracteres'),

	phoneNumber: z
		.string({ message: 'El teléfono es requerido' })
		.min(9, 'Mínimo 9 dígitos')
		.max(15, 'Máximo 15 caracteres'),

	email: z
		.string({ message: 'El correo es requerido' })
		.min(1, 'El correo es requerido')
		.email('Ingresa un correo electrónico válido'),

	gender: z
		.string()
		.nullable()
		.optional()
		.transform((val) => val ?? null),

	birthDate: optionalDate,
	hireDate: optionalDate,

	weight: z
		.number()
		.positive('El peso debe ser mayor a 0')
		.nullable()
		.optional()
		.transform((val) => val ?? null),

	height: z
		.number()
		.positive('La altura debe ser mayor a 0')
		.nullable()
		.optional()
		.transform((val) => val ?? null),

	membershipId: z
		.custom<number | null>()
		.refine((val) => val !== null && Number(val) > 0, {
			message: 'Selecciona una membresía válida',
		})
		.transform((val) => Number(val)),

	role: z.literal('SOCIO').default('SOCIO'),

	avatar: avatarSchema,
})

export const createPartnerSchema = basePartnerSchema.extend({
	password: z
		.string({ message: 'La contraseña es requerida' })
		.min(6, 'Mínimo 6 caracteres')
		.max(50, 'Máximo 50 caracteres'),
})

export const editPartnerSchema = basePartnerSchema.extend({
	id: z.number(),

	password: z.union([
		z.string().min(6, 'Si deseas cambiar la contraseña, debe tener al menos 6 caracteres'),
		z.literal(''),
	]),
})

export type CreatePartnerInput = z.input<typeof createPartnerSchema>
export type CreatePartnerOutput = z.output<typeof createPartnerSchema>

export type EditPartnerInput = z.input<typeof editPartnerSchema>
export type EditPartnerOutput = z.output<typeof editPartnerSchema>

export const CREATE_PARTNER_DEFAULTS: CreatePartnerInput = {
	dni: '',
	firstName: '',
	lastName: '',
	phoneNumber: '',
	email: '',
	gender: null,
	birthDate: null,
	hireDate: null,
	membershipId: null,
	avatar: null,
	password: '',
}

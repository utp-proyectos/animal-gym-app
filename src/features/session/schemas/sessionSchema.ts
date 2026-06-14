import type { DateValue, Time } from '@internationalized/date'
import { z } from 'zod'

type IntensityOption = 'Baja' | 'Media' | 'Alta'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png']

// Schema base con los campos compartidos entre modos
const baseSchema = z.object({
	name: z
		.string({ message: 'El nombre de la clase es requerido' })
		.min(1, 'El nombre de la clase es requerido'),
	description: z.string().nullable(),
	goal: z.string().nullable(),
	capacity: z.number({ message: 'La capacidad es requerida' }).min(1, 'El valor minimo es 1'),
	intensity: z.custom<IntensityOption | null>().refine((val) => val !== null, {
		message: 'Selecciona una intensidad',
	}),
	employeeId: z.custom<number | null>().refine((val) => val !== null, {
		message: 'Selecciona un empleado',
	}),
	date: z
		.custom<DateValue | null>()
		.refine((val) => val !== null, {
			message: 'La fecha es requerida',
		})
		.transform((val) => val.toString()),
	startTime: z
		.custom<Time | null>()
		.refine((val) => val !== null, {
			message: 'La hora de inicio es requerida',
		})
		.transform((val) => val.toString()),
	endTime: z
		.custom<Time | null>()
		.refine((val) => val !== null, {
			message: 'La hora de fin es requerida',
		})
		.transform((val) => val.toString()),
	image: z
		.custom<FileList>()
		.transform((files) => files[0])
		.refine((file) => file.size <= MAX_FILE_SIZE, 'El archivo no puede superar 5MB.')
		.refine((file) => ACCEPTED_TYPES.includes(file.type), 'Solo se permiten .jpg y .png.')
		.nullable(),
})

// Modo editar: extiende base con id
export const editSchema = baseSchema.extend({
	id: z.number(),
})

// Modo crear: extiende base con campos exclusivos
export const createSchema = baseSchema

export type CreateInput = z.input<typeof createSchema>
export type CreateOutput = z.output<typeof createSchema>

export type EditInput = z.input<typeof editSchema>
export type EditOutput = z.output<typeof editSchema>

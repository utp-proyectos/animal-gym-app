import type { DateRange } from '@heroui/react'
import { z } from 'zod'

// Schema base con los campos compartidos entre modos
const baseSchema = z.object({
	name: z
		.string({ message: 'El nombre es requerido' })
		.min(1, 'El nombre es requerido')
		.min(3, 'El nombre debe tener al menos 3 caracteres'),
	description: z
		.string({ message: 'La descripción es requerida' })
		.min(1, 'La descripción es requerida'),
	goal: z.string({ message: 'El objetivo es requerido' }).min(1, 'La descripción es requerida'),
	dateRange: z
		.custom<DateRange | null>()
		.refine((val) => val !== null && val.start !== null && val.end !== null, {
			message: 'El rango de fechas (inicio y fin) es requerido',
		}),
	employeeId: z.custom<number | null>().refine((val) => val !== null, {
		message: 'Selecciona un empleado',
	}),
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

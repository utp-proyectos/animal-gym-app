import { z } from 'zod'

type DaysOfWeekOption =
	| 'Lunes'
	| 'Martes'
	| 'Miércoles'
	| 'Jueves'
	| 'Viernes'
	| 'Sábado'
	| 'Domingo'

// Schema base con los campos compartidos entre modos
const baseSchema = z.object({
	dayOfWeek: z.custom<DaysOfWeekOption | null>().refine((val) => val !== null, {
		message: 'Selecciona un día de la semana',
	}),
	sets: z
		.number({ message: 'El número de conjuntos es requerido' })
		.min(1, 'El número de conjuntos es requerido'),
	reps: z
		.number({ message: 'El número de repeticiones es requerido' })
		.min(1, 'El número de repeticiones es requerido'),
	weight: z.number({ message: 'El peso es requerido' }).min(1, 'El peso es requerido'),
	calories: z
		.number({ message: 'La cantidad de calorías es requerida' })
		.min(1, 'La cantidad de calorías es requerida'),
	restTime: z
		.number({ message: 'El tiempo de descanso es requerido' })
		.min(1, 'El tiempo de descanso es requerido'),
	exerciseId: z.custom<number | null>().refine((val) => val !== null, {
		message: 'Selecciona una ejercicio',
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

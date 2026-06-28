import type { PartnerResponse } from './partner.response'

// Ejercicio dentro de un detalle de rutina
export interface ExerciseItem {
	id: number
	name: string
	description: string
	muscleGroup: string
	equipment: string
}

// Detalle de rutina
export interface RoutineDetailItem {
	id: number
	dayOfWeek: string
	sets: number
	reps: number
	weight: number
	calories: number
	restTime: number
	exercise: ExerciseItem
}

// Empleado básico asignado como instructor de la rutina
export interface EmployeeBasic {
	id: number
	firstName: string
	lastName: string
	specialty: string | null
}

// Rutina asignada al socio
export interface RoutineItem {
	id: number
	name: string
	description: string | null
	goal: string | null
	startDate: string
	endDate: string
	employee: EmployeeBasic | null
	routineDetails: RoutineDetailItem[]
}

// Detalle completo del socio — respuesta de GET /partners/{id}/detail
export interface PartnerDetailResponse extends PartnerResponse {
	gender: string | null
	birthDate: string | null
	weight: number | null
	height: number | null
	points: number
	routines: RoutineItem[]
}

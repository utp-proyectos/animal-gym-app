interface ExerciseInfo {
	id: number
	name: string
	description: string
	muscleGroup: string
	equipment: string
}

interface DetailInfo {
	id: number
	dayOfWeek: string
	sets: number
	reps: number
	weight: number
	restTime: number
	exercise: ExerciseInfo
}

export interface RoutineInfo {
	id: number
	name: string
	description: string
	goal: string
	startDate: string
	endDate: string
	employee: EmployeeResponse | null
	routineDetails: DetailInfo[]
}

export interface PartnerRoutinesResponse {
	id: number
	firstName: string
	lastName: string
	routines: RoutineInfo[]
}

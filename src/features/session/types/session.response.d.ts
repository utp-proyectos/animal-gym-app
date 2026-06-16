import type { EmployeeResponse } from '@/features/employee/types'

export interface SessionResponse {
	id: number
	name: string
	description: string | null
	capacity: number
	date: string
	startTime: string
	endTime: string
	goal: string | null
	intensity: string
	image: string | null
	employee: EmployeeResponse | null
	status: string
	bookingsCount: number
}

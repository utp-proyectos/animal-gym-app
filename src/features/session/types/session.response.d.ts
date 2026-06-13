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
	employeeId: number | null
	status: string
}

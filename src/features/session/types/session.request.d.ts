export interface SessionRequest {
	name: string
	description: string
	capacity: number
	date: string
	startTime: string
	endTime: string
	duration: number
	status: string
	goal: string
	intensity: string
	image: string | null
	employeeId: number | null
}

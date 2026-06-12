export interface SessionDetailResponse {
	id: number
	name: string
	description: string | null
	capacity: number
	date: string
	startTime: string
	endTime: string
	duration: number
	status: string
	goal: string | null
	intensity: string
	image: string | null
	employee: EmployeeResponseDTO | null
	currentBookings: number
	enrolled: boolean
	participants: SessionParticipantDTO[]
}

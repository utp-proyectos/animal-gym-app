import type { Role } from '@/shared/enums/Role'

export interface EmployeeResponse {
	id: number
	firstName: string
	lastName: string
	image: string
	role: Role
}

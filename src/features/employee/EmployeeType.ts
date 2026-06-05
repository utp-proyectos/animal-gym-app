import type { Role } from '@/shared/enums/Role'

export interface EmployeeResponse {
	id: number
	firstName: string
	lastName: string
	image: string
	role: Role
}
export interface EmployeeCreateRequest {
	dni: string
	firstName: string
	lastName: string
	phoneNumber: string
	gender: string | number | null
	email: string
	birthDate: string | undefined
	hireDate: string | undefined
	image: string | number | null
	salary: number
	contractType: string | number | null
	specialty: string | number | null
	password: string
	role: Role | null
}
export interface EmployeeDetailResponse {
	id: number
	dni: string
	firstName: string
	lastName: string
	phoneNumber: string
	gender: string
	email: string
	birthDate: string
	hireDate: string
	image: string | null
	salary: number
	contractType: string
	specialty: string
	role: string
}

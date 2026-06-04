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
	gender: string
	email: string
	birthDate: string
	hireDate: string
	image: string
	salary: number
	contractType: string
	specialty: string
	password: string
	role: Role
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
	image: string
	salary: number
	contractType: string
	specialty: string
	role: string
}

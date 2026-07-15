import { Role } from './index'

export interface AuthResponse {
	id: string
	personId: string
	dni: string
	firstName: string
	lastName: string
	email: string
	avatar: string | null
	role: Role
	token: string
}

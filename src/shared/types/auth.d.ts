export type Role = 'ADMIN' | 'ENTRENADOR' | 'SOCIO' | 'RECEPCIONISTA'

export interface AuthResponse {
	id: string
	dni: string
	firstName: string
	lastName: string
	email: string
	avatar: string | null
	role: Role
	token: string
}

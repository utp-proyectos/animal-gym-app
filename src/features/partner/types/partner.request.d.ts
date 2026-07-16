import type { Role } from '@/shared/types'

export interface PartnerRequest {
	dni: string
	firstName: string
	lastName: string
	phoneNumber: string
	email: string
	gender: string | null
	birthDate: string | null
	hireDate: string | null

	weight: number | null
	height: number | null

	// Se conserva por compatibilidad; la membresía se asigna desde su propio módulo.
	membershipId?: number | null

	password: string
	role: Role | null

	image?: string | null
}

export interface UpdatePartnerProfileRequest {
	firstName: string

	lastName: string

	email: string

	phoneNumber: string

	gender: 'Masculino' | 'Femenino' | 'Otro'

	birthDate: string
}

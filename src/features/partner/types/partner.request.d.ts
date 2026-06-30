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

	membershipId: number

	password: string
	role: Role | null

	image?: string | null
}

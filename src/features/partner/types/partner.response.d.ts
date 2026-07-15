export interface PartnerResponse {
	id: number
	dni: string
	firstName: string
	lastName: string
	phoneNumber: string
	email: string
	avatar: string | null
	status: boolean
	hireDate: string
	expirationDate: string | null
	membershipId: number | null
	membershipName: string | null
}

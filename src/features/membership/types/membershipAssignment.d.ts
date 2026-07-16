export type PaymentMethod = 'EFECTIVO' | 'TARJETA' | 'YAPE' | 'PLIN'

export interface MembershipAssignmentRequest {
	partnerDni: string
	paymentMethod: PaymentMethod
}

export interface MembershipAssignmentResponse {
	billId: number | null
	operationType: 'PURCHASE' | 'RENEWAL' | 'CHANGE'
	partnerId: number
	partnerDni: string
	partnerName: string
	membershipId: number
	membershipName: string
	previousExpirationDate: string | null
	newExpirationDate: string
	originalPrice: number
	selectedPrice: number
	remainingDays: number
	remainingCredit: number
	totalPrice: number
	refundAmount: number
	subTotal: number
	igv: number
	discountApplied: boolean
	paymentMethod: PaymentMethod | 'SALDO'
	paymentStatus: 'APROBADO' | 'SIN_COBRO'
}

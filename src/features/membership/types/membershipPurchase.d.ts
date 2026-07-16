import type { PaymentMethod } from './membershipAssignment'

export type MembershipPurchaseOperation =
	| 'PURCHASE'
	| 'RENEWAL'
	| 'CHANGE'
	| 'CURRENT'
	| 'INACTIVE'
	| 'FULL'

export interface MembershipSelfResponse {
	partnerId: number
	membershipId: number | null
	membershipName: string | null
	expirationDate: string | null
	active: boolean
	daysRemaining: number
}

export interface MembershipPurchasePreview {
	operationType: MembershipPurchaseOperation
	allowed: boolean
	message: string
	currentMembershipId: number | null
	currentMembershipName: string | null
	currentExpirationDate: string | null
	remainingDays: number
	remainingCredit: number
	selectedMembershipId: number
	selectedMembershipName: string
	selectedDuration: number
	originalPrice: number
	selectedPrice: number
	discountApplied: boolean
	amountToPay: number
	refundAmount: number
	newExpirationDate: string
}

export interface MembershipPurchaseRequest {
	paymentMethod: PaymentMethod | null
}

export interface MembershipPurchaseResponse {
	billId: number | null
	operationType: 'PURCHASE' | 'RENEWAL' | 'CHANGE'
	partnerId: number
	partnerName: string
	membershipId: number
	membershipName: string
	previousExpirationDate: string | null
	newExpirationDate: string
	selectedPrice: number
	remainingCredit: number
	totalPrice: number
	refundAmount: number
	subTotal: number
	igv: number
	discountApplied: boolean
	paymentMethod: PaymentMethod | 'SALDO'
	paymentStatus: 'APROBADO' | 'SIN_COBRO'
}

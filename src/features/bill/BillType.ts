export interface BillResponse {
	id: number
	issueDate: string
	time: string
	subTotal: number
	totalPrice: number
	status: boolean
	employeeFirstName: string
	partnerFirstName: string
	membershipName: string
}

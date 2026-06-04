export interface BillResponse {
	id: number
	issueDate: string
	time: string
	subTotal: number
	totalPrice: number
	igv: number
	status: boolean
	employeeFirstName: string
	employeeLastName: string
	partnerFirstName: string
	partnerLastName: string
	membershipName: string
}

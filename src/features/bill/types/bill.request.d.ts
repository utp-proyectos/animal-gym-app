export interface BillRequest {
	issueDate: string
	time: string
	subTotal: number
	totalPrice: number
	igv: number
	status: boolean
	partnerId: number
	employeeId: number
}

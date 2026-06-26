import { api } from '@/lib/axios'
import type { ApiResponse } from '@/shared/types'
import type { BillRequest } from '../types/bill.request'
import type { BillResponse } from '../types/bill.response'

export const billService = {
	getAll: () => api.get<ApiResponse<BillResponse[]>>('/bills').then((res) => res.data.data),

	getById: (id: number) =>
		api.get<ApiResponse<BillResponse>>(`/bills/${id}`).then((res) => res.data.data),

	save: (payload: BillRequest) =>
		api.post<ApiResponse<BillResponse>>('/bills', payload).then((res) => res.data.data),

	getPdf: (id: number) =>
		api.get(`/bills/${id}/pdf`, { responseType: 'blob' }).then((res) => {
			const url = URL.createObjectURL(res.data)
			const link = document.createElement('a')
			link.href = url
			link.download = `boleta-${id}.pdf`
			link.click()
			URL.revokeObjectURL(url)
		}),
}

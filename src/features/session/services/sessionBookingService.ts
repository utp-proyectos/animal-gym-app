import { api } from '@/lib/axios'
import type { ApiResponse } from '@/shared/types'
import type { PartnerEnrolledRequest, PartnerEnrolledResponse } from '../types'

export const bookingService = {
	getEnrolledBySession: (sessionId: number) =>
		api
			.get<ApiResponse<PartnerEnrolledResponse[]>>(`/bookings/session/${sessionId}`)
			.then((res) => res.data.data),
	addBooking: (sessionId: number, data: PartnerEnrolledRequest) =>
		api.post<ApiResponse<string>>(`/bookings/session/${sessionId}`, data).then((res) => res.data),
}

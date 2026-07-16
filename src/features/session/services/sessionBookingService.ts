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
	removeBooking: (sessionId: number, bookingId: number) =>
		api
			.delete<ApiResponse<string>>(`/bookings/session/${sessionId}/booking/${bookingId}`)
			.then((res) => res.data),
	subscribe: (partnerId: number, sessionId: number) =>
		api
			.post<ApiResponse<void>>(`/bookings/subscribe`, null, {
				params: { partnerId, sessionId },
			})
			.then((res) => res.data),

	cancel: (partnerId: number, sessionId: number) =>
		api
			.delete<ApiResponse<void>>(`/bookings/cancel`, {
				params: { partnerId, sessionId },
			})
			.then((res) => res.data),
}

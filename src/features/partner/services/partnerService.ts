import { api } from '@/lib/axios'
import type { ApiResponse } from '@/shared/types'
import type { PartnerDetailResponse, PartnerRequest, PartnerResponse } from '../types'

export const partnerService = {
	getAll: (): Promise<PartnerResponse[]> =>
		api.get<ApiResponse<PartnerResponse[]>>('/partners').then((res) => res.data.data),

	getById: (id: number): Promise<PartnerResponse> =>
		api.get<ApiResponse<PartnerResponse>>(`/partners/${id}`).then((res) => res.data.data),

	getDetail: (id: number): Promise<PartnerDetailResponse> =>
		api
			.get<ApiResponse<PartnerDetailResponse>>(`/partners/${id}/detail`)
			.then((res) => res.data.data),

	create: (payload: PartnerRequest): Promise<PartnerResponse> =>
		api.post<ApiResponse<PartnerResponse>>('/partners', payload).then((res) => res.data.data),

	update: (id: number, payload: PartnerRequest): Promise<PartnerResponse> =>
		api.put<ApiResponse<PartnerResponse>>(`/partners/${id}`, payload).then((res) => res.data.data),

	delete: (id: number): Promise<void> =>
		api.delete<ApiResponse<void>>(`/partners/${id}`).then(() => undefined),

	uploadAvatar: (id: number, file: File): Promise<string> => {
		const formData = new FormData()
		formData.append('file', file)
		return api
			.post<ApiResponse<string>>(`/partners/${id}/avatar`, formData)
			.then((res) => res.data.data)
	},

	// GET /partners/filter?status=true
	filterByStatus: (status: boolean): Promise<PartnerResponse[]> =>
		api
			.get<ApiResponse<PartnerResponse[]>>('/partners/filter', {
				params: { status },
			})
			.then((res) => res.data.data),

	// GET /partners/filter/expiration?start=2025-01-01&end=2025-12-31
	filterByExpiration: (start: string, end: string): Promise<PartnerResponse[]> =>
		api
			.get<ApiResponse<PartnerResponse[]>>('/partners/filter/expiration', {
				params: { start, end },
			})
			.then((res) => res.data.data),

	// GET /partners/filter/membership?membershipId=3
	filterByMembership: (membershipId: number): Promise<PartnerResponse[]> =>
		api
			.get<ApiResponse<PartnerResponse[]>>('/partners/filter/membership', {
				params: { membershipId },
			})
			.then((res) => res.data.data),

	// GET /partners/search?name=juan
	search: (name: string): Promise<PartnerResponse[]> =>
		api
			.get<ApiResponse<PartnerResponse[]>>('/partners/search', {
				params: { name },
			})
			.then((res) => res.data.data),
}

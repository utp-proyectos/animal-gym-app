import { api } from '@/lib/axios'
import type { ApiResponse } from '@/shared/types'
import type { SessionCardResponse, SessionDetailResponse, SessionRequest } from '../types'

export const sessionService = {
	getAll: () =>
		api.get<ApiResponse<SessionCardResponse[]>>('/sessions').then((res) => res.data.data),

	getById: (id: number) =>
		api.get<ApiResponse<SessionDetailResponse>>(`/sessions/${id}`).then((res) => res.data.data),

	save: (payload: SessionRequest) =>
		api.post<ApiResponse<SessionDetailResponse>>('/sessions', payload).then((res) => res.data.data),

	update: (id: number, payload: SessionRequest) =>
		api
			.put<ApiResponse<SessionDetailResponse>>(`/sessions/${id}`, payload)
			.then((res) => res.data.data),

	delete: (id: number) => api.delete<ApiResponse<void>>(`/sessions/${id}`).then((res) => res.data),
}

import { api } from '@/lib/axios'
import type { ApiResponse } from '@/shared/types'
import type { SessionResponse, SessionDetailResponse, SessionRequest } from '../types'
import { toFormData } from '@/shared/util'

export const sessionService = {
	getAll: () => api.get<ApiResponse<SessionResponse[]>>('/sessions').then((res) => res.data.data),

	getById: (id: number) =>
		api.get<ApiResponse<SessionDetailResponse>>(`/sessions/${id}`).then((res) => res.data.data),

	save: (payload: SessionRequest) =>
		api
			.post<ApiResponse<SessionDetailResponse>>('/sessions', toFormData(payload))
			.then((res) => res.data.data),

	update: (id: number, payload: SessionRequest) =>
		api
			.put<ApiResponse<SessionDetailResponse>>(`/sessions/${id}`, toFormData(payload))
			.then((res) => res.data.data),

	delete: (id: number) => api.delete<ApiResponse<void>>(`/sessions/${id}`).then((res) => res.data),
}

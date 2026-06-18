import { api } from '@/lib/axios'
import type { ApiResponse } from '@/shared/types'
import type { MembershipReponse, MembershipRequest } from '../types'
import { toFormData } from '@/shared/util'

export const membershipService = {
	getAll: () =>
		api.get<ApiResponse<MembershipReponse[]>>('/memberships').then((res) => res.data.data),

	getById: (id: number) =>
		api.get<ApiResponse<MembershipReponse>>(`/memberships/${id}`).then((res) => res.data.data),

	create: (payload: MembershipRequest) =>
		api
			.post<ApiResponse<MembershipReponse>>('/memberships', toFormData(payload))
			.then((res) => res.data.data),

	update: (id: number, payload: MembershipRequest) =>
		api
			.put<ApiResponse<MembershipReponse>>(`/memberships/${id}`, toFormData(payload))
			.then((res) => res.data.data),

	delete: (id: number) =>
		api.delete<ApiResponse<void>>(`/memberships/${id}`).then((res) => res.data),
}

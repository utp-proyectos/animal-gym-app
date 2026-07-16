import { api } from '@/lib/axios'
import type { ApiResponse } from '@/shared/types'
import type {
	MembershipAssignmentRequest,
	MembershipAssignmentResponse,
	MembershipPurchasePreview,
	MembershipPurchaseRequest,
	MembershipPurchaseResponse,
	MembershipReponse,
	MembershipRequest,
	MembershipSelfResponse,
} from '../types'
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

	assignToPartner: (id: number, payload: MembershipAssignmentRequest) =>
		api
			.post<ApiResponse<MembershipAssignmentResponse>>(`/memberships/${id}/assign`, payload)
			.then((res) => res.data.data),

	previewAssignment: (id: number, partnerDni: string) =>
		api
			.get<ApiResponse<MembershipPurchasePreview>>(`/memberships/${id}/assignment-preview`, {
				params: { partnerDni },
			})
			.then((res) => res.data.data),

	getMyMembership: () =>
		api
			.get<ApiResponse<MembershipSelfResponse>>('/memberships/me')
			.then((res) => res.data.data),

	previewPurchase: (id: number) =>
		api
			.get<ApiResponse<MembershipPurchasePreview>>(`/memberships/${id}/purchase-preview`)
			.then((res) => res.data.data),

	purchase: (id: number, payload: MembershipPurchaseRequest) =>
		api
			.post<ApiResponse<MembershipPurchaseResponse>>(`/memberships/${id}/purchase`, payload)
			.then((res) => res.data.data),
}

import { api } from '@/lib/axios'
import type { ApiResponse } from '@/shared/types'
import type { PartnerRoutinesResponse } from '../types'

export const partnerService = {
	getPartnerRoutines: (partnerId: number) =>
		api
			.get<ApiResponse<PartnerRoutinesResponse>>(`/partners/${partnerId}/routines`)
			.then((res) => res.data.data),

	getAllPartnersWithRoutines: () =>
		api
			.get<ApiResponse<PartnerRoutinesResponse[]>>(`/partners/routines`)
			.then((res) => res.data.data),
}

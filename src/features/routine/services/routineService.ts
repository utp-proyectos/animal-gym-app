import type { PartnerRoutinesResponse } from '@/features/partner/types'
import { api } from '@/lib/axios'
import type { ApiResponse } from '@/shared/types'
import type { RoutineDetailRequest, RoutineRequest } from '../types'

export const routineService = {
	createRoutine: (data: RoutineRequest) =>
		api.post<ApiResponse<PartnerRoutinesResponse>>('/routines', data).then((res) => res.data.data),
	updateRoutine: (id: number, data: RoutineRequest) =>
		api
			.put<ApiResponse<PartnerRoutinesResponse>>(`/routines/${id}`, data)
			.then((res) => res.data.data),

	deleteRoutine: (id: number, partnerId: number) =>
		api
			.delete<ApiResponse<PartnerRoutinesResponse>>(`/routines/${id}`, {
				params: { partnerId },
			})
			.then((res) => res.data.data),
	createRoutineDetail: (data: RoutineDetailRequest) =>
		api
			.post<ApiResponse<PartnerRoutinesResponse>>('/routines/details', data)
			.then((res) => res.data.data),
	updateRoutineDetail: (detailId: number, data: RoutineDetailRequest) =>
		api
			.put<ApiResponse<PartnerRoutinesResponse>>(`/routines/details/${detailId}`, data)
			.then((res) => res.data.data),

	deleteRoutineDetail: (routineId: number, detailId: number, partnerId: number) =>
		api
			.delete<ApiResponse<PartnerRoutinesResponse>>(`/routines/${routineId}/details/${detailId}`, {
				params: { partnerId },
			})
			.then((res) => res.data.data),
}

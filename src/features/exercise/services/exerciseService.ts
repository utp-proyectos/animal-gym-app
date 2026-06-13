import { api } from '@/lib/axios'
import type { ApiResponse } from '@/shared/types'
import type { ExerciseRequest, ExerciseResponse } from '../types'
import { toFormData } from '@/shared/util'

export const exerciseService = {
	getAll: () => api.get<ApiResponse<ExerciseResponse[]>>('/exercises').then((res) => res.data.data),

	save: (payload: ExerciseRequest) =>
		api.post<ApiResponse<ExerciseResponse>>('/exercises', toFormData(payload)).then((res) => res.data.data),

	update: (id: number, payload: ExerciseRequest) =>
		api
			.put<ApiResponse<ExerciseResponse>>(`/exercises/${id}`, toFormData(payload))
			.then((res) => res.data.data),

	delete: (id: number) => api.delete<ApiResponse<void>>(`/exercises/${id}`).then((res) => res.data),
}

import { api } from '@/lib/axios'
import type { ApiResponse } from '@/shared/types'
import type { ExerciseRequest, ExerciseResponse } from '../types'

export const exerciseService = {
	getAll: () => api.get<ApiResponse<ExerciseResponse[]>>('/exercises').then((res) => res.data.data),

	save: (payload: ExerciseRequest) =>
		api.post<ApiResponse<ExerciseResponse>>('/exercises', payload).then((res) => res.data.data),

	update: (id: number, payload: ExerciseRequest) =>
		api
			.put<ApiResponse<ExerciseResponse>>(`/api/exercises/${id}`, payload)
			.then((res) => res.data.data),

	delete: (id: number) => api.delete<ApiResponse<void>>(`/exercises/${id}`).then((res) => res.data),
}

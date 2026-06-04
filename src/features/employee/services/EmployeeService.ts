import { api } from '@/lib/axios'
import type { ApiResponse } from '@/shared/types'
import type {
	EmployeeResponse,
	EmployeeDetailResponse,
	EmployeeCreateRequest,
} from '../EmployeeType'

export const employeeService = {
	getAll: () => api.get<ApiResponse<EmployeeResponse[]>>('/employees').then((res) => res.data.data),

	getById: (id: number) =>
		api.get<ApiResponse<EmployeeDetailResponse>>(`/employees/${id}`).then((res) => res.data.data),

	save: (payload: EmployeeCreateRequest) =>
		api.post<ApiResponse<EmployeeResponse>>('/employees', payload).then((res) => res.data.data),

	delete: (id: number) => api.delete<ApiResponse<void>>(`/employees/${id}`).then((res) => res.data),
}

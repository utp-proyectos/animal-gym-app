import { api } from '@/lib/axios'
import type { ApiResponse } from '@/shared/types'
import type { EmployeeDetailResponse, EmployeeRequest, EmployeeUpdate } from '../types'
import { toFormData } from '@/shared/util'
import type { UpdateEmployeeProfileRequest } from '../types/employee.request'

export const employeeService = {
	getAll: () =>
		api.get<ApiResponse<EmployeeDetailResponse[]>>('/employees').then((res) => res.data.data),

	getById: (id: number) =>
		api.get<ApiResponse<EmployeeDetailResponse>>(`/employees/${id}`).then((res) => res.data.data),

	save: (payload: EmployeeRequest) =>
		api
			.post<ApiResponse<EmployeeDetailResponse>>('/employees', toFormData(payload))
			.then((res) => res.data.data),

	update: (id: number, payload: EmployeeUpdate) =>
		api
			.put<ApiResponse<EmployeeDetailResponse>>(`/employees/${id}`, toFormData(payload))
			.then((res) => res.data.data),

	updateProfile: (id: number, payload: UpdateEmployeeProfileRequest) =>
		api
			.put<ApiResponse<EmployeeDetailResponse>>(`/employees/${id}/profile`, payload)
			.then((res) => res.data.data),

	delete: (id: number) => api.delete<ApiResponse<void>>(`/employees/${id}`).then((res) => res.data),
}

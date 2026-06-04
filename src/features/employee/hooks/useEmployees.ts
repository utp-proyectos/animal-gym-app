import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { employeeService } from '../services/EmployeeService'
import type { EmployeeCreateRequest } from '../EmployeeType'

const EMPLOYEE_KEY = 'employees'

export function useEmployees() {
	return useQuery({
		queryKey: [EMPLOYEE_KEY],
		queryFn: employeeService.getAll,
	})
}

export function useEmployee(id: number) {
	return useQuery({
		queryKey: [EMPLOYEE_KEY, id],
		queryFn: () => employeeService.getById(id),
		enabled: !!id,
	})
}

export function useCreateEmployee() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: EmployeeCreateRequest) => employeeService.save(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [EMPLOYEE_KEY] })
		},
	})
}

export function useDeleteEmployee() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: number) => employeeService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [EMPLOYEE_KEY] })
		},
	})
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { employeeService } from '../services/EmployeeService'
import type { EditOutput } from '../schema/employeeSchema'

const EMPLOYEE_KEY = 'employees'

export function useEmployees() {
	return useQuery({
		queryKey: [EMPLOYEE_KEY],
		queryFn: employeeService.getAll,
	})
}

export function useUpdateEmployee() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['employees', 'save'],

		mutationFn: ({ id, payload }: { id: number; payload: EditOutput }) =>
			employeeService.update(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [EMPLOYEE_KEY] })
		},
	})
}
export function usePrefetchEmployee() {
	const queryClient = useQueryClient()

	return (id: number) => {
		queryClient.prefetchQuery({
			queryKey: [EMPLOYEE_KEY, id],
			queryFn: () => employeeService.getById(id),
		})
	}
}
export function useGetEmployee(id: number | undefined) {
	return useQuery({
		queryKey: [EMPLOYEE_KEY, id],
		queryFn: () => employeeService.getById(id!),
		enabled: !!id,
	})
}

export function useCreateEmployee() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['employees', 'save'],

		mutationFn: employeeService.save,
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

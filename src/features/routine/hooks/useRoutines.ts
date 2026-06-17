import { useMutation, useQueryClient } from '@tanstack/react-query'
import { routineService } from '../services/routineService'
import type { RoutineDetailRequest, RoutineRequest } from '../types'

export const ROUTINE_KEY = 'routines'
export const PARTNER_KEY = 'partners'

export function useCreateRoutine() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: RoutineRequest) => routineService.createRoutine(payload),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [PARTNER_KEY] })
		},
	})
}

export function useUpdateRoutine() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, payload }: { id: number; payload: RoutineRequest }) =>
			routineService.updateRoutine(id, payload),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [PARTNER_KEY] })
		},
	})
}

export function useDeleteRoutine() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, partnerId }: { id: number; partnerId: number }) =>
			routineService.deleteRoutine(id, partnerId),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [PARTNER_KEY] })
		},
	})
}

export function useCreateRoutineDetail() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: RoutineDetailRequest) => routineService.createRoutineDetail(payload),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [PARTNER_KEY] })
		},
	})
}

export function useUpdateRoutineDetail() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ detailId, payload }: { detailId: number; payload: RoutineDetailRequest }) =>
			routineService.updateRoutineDetail(detailId, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [PARTNER_KEY] })
		},
	})
}

export function useDeleteRoutineDetail() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			routineId,
			detailId,
			partnerId,
		}: {
			routineId: number
			detailId: number
			partnerId: number
		}) => routineService.deleteRoutineDetail(routineId, detailId, partnerId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [PARTNER_KEY] })
		},
	})
}

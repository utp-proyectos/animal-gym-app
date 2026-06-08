import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { exerciseService } from '../services/exerciseService'
import type { ExerciseRequest } from '../types'

const EXERCISE_KEY = 'exercises'

export function useExercise() {
	return useQuery({
		queryKey: [EXERCISE_KEY],
		queryFn: exerciseService.getAll,
	})
}

export function useCreateExercise() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: exerciseService.save,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [EXERCISE_KEY] })
		},
	})
}

export function useUpdateExercise() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, payload }: { id: number; payload: ExerciseRequest }) =>
			exerciseService.update(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [EXERCISE_KEY] })
		},
	})
}

export function useDeleteExercise() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: number) => exerciseService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [EXERCISE_KEY] })
		},
	})
}

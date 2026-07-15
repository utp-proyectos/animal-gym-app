import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { sessionService } from '../services/sessionService'
import type { SessionRequest } from '../types'

const SESSION_KEY = 'sessions'

export function useSessions(partnerId?: number | null) {
	return useQuery({
		queryKey: [SESSION_KEY, { partnerId }],
		queryFn: () => sessionService.getAll(partnerId),
	})
}

export function useCreateSession() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: sessionService.save,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [SESSION_KEY] })
		},
	})
}

export function useUpdateSession() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, payload }: { id: number; payload: SessionRequest }) =>
			sessionService.update(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [SESSION_KEY] })
		},
	})
}

export function useDeleteSession() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: number) => sessionService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [SESSION_KEY] })
		},
	})
}

export function usePrefetchSession() {
	const queryClient = useQueryClient()

	return (id: number) => {
		queryClient.prefetchQuery({
			queryKey: [SESSION_KEY, id],
			queryFn: () => sessionService.getById(id),
		})
	}
}
export function useGetSession(id: number) {
	return useQuery({
		queryKey: [SESSION_KEY, id],
		queryFn: () => sessionService.getById(id),
		enabled: !!id,
	})
}

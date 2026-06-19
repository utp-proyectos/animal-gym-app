import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { membershipService } from '../services/membershipService'
import type { CreateOutput, EditOutput } from '../schema/membershipSchema'

const MEMBERSHIP_KEY = 'memberships'

export function useMemberships() {
	return useQuery({
		queryKey: [MEMBERSHIP_KEY],
		queryFn: membershipService.getAll,
	})
}

export function useCreateMembership() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: CreateOutput) => membershipService.create(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [MEMBERSHIP_KEY] })
		},
	})
}

export function useUpdateMembership() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, payload }: { id: number; payload: EditOutput }) =>
			membershipService.update(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [MEMBERSHIP_KEY] })
		},
	})
}

export function useDeleteMembership() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: number) => membershipService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [MEMBERSHIP_KEY] })
		},
	})
}

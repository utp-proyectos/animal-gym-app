import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { membershipService } from '../services/membershipService'
import type { CreateOutput, EditOutput } from '../schema/membershipSchema'
import type { MembershipAssignmentRequest, MembershipPurchaseRequest } from '../types'

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

export function useAssignMembership() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, payload }: { id: number; payload: MembershipAssignmentRequest }) =>
			membershipService.assignToPartner(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [MEMBERSHIP_KEY] })
			queryClient.invalidateQueries({ queryKey: ['partners'] })
			queryClient.invalidateQueries({ queryKey: ['bills'] })
		},
	})
}

export function useMembershipAssignmentPreview(
	id: number,
	partnerDni: string,
	enabled: boolean,
) {
	return useQuery({
		queryKey: [MEMBERSHIP_KEY, 'assignment-preview', id, partnerDni],
		queryFn: () => membershipService.previewAssignment(id, partnerDni),
		enabled: enabled && /^\d{8}$/.test(partnerDni),
		staleTime: 15_000,
	})
}

export function useMyMembership(enabled: boolean) {
	return useQuery({
		queryKey: [MEMBERSHIP_KEY, 'me'],
		queryFn: membershipService.getMyMembership,
		enabled,
	})
}

export function useMembershipPurchasePreview(id: number | null, enabled: boolean) {
	return useQuery({
		queryKey: [MEMBERSHIP_KEY, 'purchase-preview', id],
		queryFn: () => membershipService.previewPurchase(id!),
		enabled: enabled && id !== null,
	})
}

export function usePurchaseMembership() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, payload }: { id: number; payload: MembershipPurchaseRequest }) =>
			membershipService.purchase(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [MEMBERSHIP_KEY] })
			queryClient.invalidateQueries({ queryKey: ['bills'] })
		},
	})
}

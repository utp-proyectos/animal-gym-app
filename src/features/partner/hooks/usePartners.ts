import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { partnerService } from '../services/partnerService'
import type { PartnerRequest } from '../types'

const PARTNER_KEY = 'partners' as const

export function usePartners() {
	return useQuery({
		queryKey: [PARTNER_KEY],
		queryFn: partnerService.getAll,
	})
}

export function usePartner(id: number | null) {
	return useQuery({
		queryKey: [PARTNER_KEY, id],
		queryFn: () => partnerService.getById(id!),
		enabled: !!id,
	})
}

export function usePartnerDetail(id: number | null) {
	return useQuery({
		queryKey: [PARTNER_KEY, id, 'detail'],
		queryFn: () => partnerService.getDetail(id!),
		enabled: !!id,
	})
}

export function useCreatePartner() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: PartnerRequest) => partnerService.create(payload),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [PARTNER_KEY] })
		},
	})
}

export function useUpdatePartner() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, payload }: { id: number; payload: PartnerRequest }) =>
			partnerService.update(id, payload),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [PARTNER_KEY] })
		},
	})
}

export function useDeletePartner() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: number) => partnerService.delete(id),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [PARTNER_KEY] })
		},
	})
}

export function useUploadPartnerAvatar() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, file }: { id: number; file: File }) => partnerService.uploadAvatar(id, file),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [PARTNER_KEY] })
		},
	})
}

export function useGetPartnerRoutines(partnerId: number | null) {
	return useQuery({
		queryKey: [PARTNER_KEY, 'routines', partnerId],

		queryFn: () => partnerService.getPartnerRoutines(partnerId!),
		enabled: !!partnerId,
	})
}

export function useGetAllPartnersWithRoutines() {
	return useQuery({
		queryKey: [PARTNER_KEY],
		queryFn: partnerService.getAllPartnersWithRoutines,
	})
}

import { useQuery } from '@tanstack/react-query'
import { partnerService } from '../services/partnerService'

const PARTNERS_KEY = 'partners'

export function useGetPartnerRoutines(partnerId: number | null) {
	return useQuery({
		queryKey: [PARTNERS_KEY],
		queryFn: () => partnerService.getPartnerRoutines(partnerId!),

		enabled: !!partnerId,
	})
}

export function useGetAllPartnersWithRoutines() {
	return useQuery({
		queryKey: [PARTNERS_KEY],
		queryFn: partnerService.getAllPartnersWithRoutines,
	})
}

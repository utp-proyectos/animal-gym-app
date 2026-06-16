import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bookingService } from '../services/sessionBookingService'

const BOOKING_KEY = 'sessionBookings'

export function useGetEnrolledPartners(sessionId: number | null) {
	return useQuery({
		queryKey: [BOOKING_KEY, 'session', sessionId],
		queryFn: () => bookingService.getEnrolledBySession(sessionId!),
		enabled: !!sessionId,
		placeholderData: (previousData) => previousData,
	})
}

export function useAddSocioToSession() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ sessionId, dni }: { sessionId: number; dni: string }) => {
			return bookingService.addBooking(sessionId, { dni })
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [BOOKING_KEY],
			})
		},
	})
}

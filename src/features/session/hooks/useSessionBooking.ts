import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bookingService } from '../services/sessionBookingService'

const BOOKING_KEY = 'sessionBookings'
const SESSIONS_KEY = 'sessions'

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
		mutationFn: ({ sessionId, dni }: { sessionId: number; dni: string }) =>
			bookingService.addBooking(sessionId, { dni }),

		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: [BOOKING_KEY, 'session', variables.sessionId],
			})

			queryClient.invalidateQueries({
				queryKey: [SESSIONS_KEY],
			})
		},
	})
}

export function useRemoveBookingFromSession() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ sessionId, bookingId }: { sessionId: number; bookingId: number }) => {
			return bookingService.removeBooking(sessionId, bookingId)
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: [BOOKING_KEY, 'session', variables.sessionId],
			})

			queryClient.invalidateQueries({
				queryKey: [SESSIONS_KEY],
			})
		},
	})
}

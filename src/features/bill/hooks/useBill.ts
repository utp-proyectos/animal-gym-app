import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { billService } from '../services/BillService'
import type { BillRequest } from '../types/bill.request'

const BILL_KEY = 'bills'

export function useBills() {
	return useQuery({
		queryKey: [BILL_KEY],
		queryFn: billService.getAll,
	})
}

export function useGetBill(id: number | undefined) {
	return useQuery({
		queryKey: [BILL_KEY, id],
		queryFn: () => billService.getById(id!),
		enabled: !!id,
	})
}

export function useCreateBill() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: BillRequest) => billService.save(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [BILL_KEY] })
		},
	})
}

export function useDownloadBillPdf() {
	return useMutation({
		mutationFn: (id: number) => billService.getPdf(id),
	})
}

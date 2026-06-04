import { api } from '@/lib/axios'
import type { ApiResponse } from '@/shared/types'

interface ChangePasswordPayload {
	newPassword: string
}

export const userService = {
	changePassword: (personId: number, payload: ChangePasswordPayload) =>
		api.patch<ApiResponse<void>>(`/users/${personId}/password`, payload).then((res) => res.data),
}

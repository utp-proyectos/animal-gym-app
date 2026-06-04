// src/features/user/hooks/useUser.ts
import { useMutation } from '@tanstack/react-query'
import { userService } from '../service/UserService'

export function useChangePassword() {
	return useMutation({
		mutationFn: ({ personId, newPassword }: { personId: number; newPassword: string }) =>
			userService.changePassword(personId, { newPassword }),
	})
}

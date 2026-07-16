import { z } from 'zod'

export const membershipAssignmentSchema = z
	.object({
		partnerDni: z
			.string({ message: 'El DNI es requerido' })
			.regex(/^\d{8}$/, 'El DNI debe tener exactamente 8 dígitos'),
		paymentRequired: z.boolean(),
		paymentMethod: z.enum(['EFECTIVO', 'TARJETA', 'YAPE', 'PLIN']),
		cardHolder: z.string(),
		cardNumber: z.string(),
		cardExpiry: z.string(),
		cardCvv: z.string(),
	})
	.superRefine((data, ctx) => {
		if (!data.paymentRequired) return
		if (data.paymentMethod !== 'TARJETA') return

		if (data.cardHolder.trim().length < 3) {
			ctx.addIssue({
				code: 'custom',
				path: ['cardHolder'],
				message: 'Ingresa el nombre del titular',
			})
		}

		if (!/^\d{16}$/.test(data.cardNumber)) {
			ctx.addIssue({
				code: 'custom',
				path: ['cardNumber'],
				message: 'La tarjeta debe tener 16 dígitos',
			})
		}

		if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.cardExpiry)) {
			ctx.addIssue({
				code: 'custom',
				path: ['cardExpiry'],
				message: 'Usa el formato MM/AA',
			})
		}

		if (!/^\d{3}$/.test(data.cardCvv)) {
			ctx.addIssue({
				code: 'custom',
				path: ['cardCvv'],
				message: 'El CVV debe tener 3 dígitos',
			})
		}
	})

export type MembershipAssignmentForm = z.infer<typeof membershipAssignmentSchema>

export const MEMBERSHIP_ASSIGNMENT_DEFAULTS: MembershipAssignmentForm = {
	partnerDni: '',
	paymentRequired: true,
	paymentMethod: 'TARJETA',
	cardHolder: '',
	cardNumber: '',
	cardExpiry: '',
	cardCvv: '',
}

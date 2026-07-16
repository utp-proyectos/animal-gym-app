import { z } from 'zod'

function isFutureCardDate(value: string) {
	const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value)
	if (!match) return false

	const month = Number(match[1])
	const year = 2000 + Number(match[2])
	const now = new Date()
	return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1)
}

export const membershipPurchaseSchema = z
	.object({
		paymentRequired: z.boolean(),
		paymentMethod: z.enum(['EFECTIVO', 'TARJETA', 'YAPE', 'PLIN']),
		cardHolder: z.string(),
		cardNumber: z.string(),
		cardExpiry: z.string(),
		cardCvv: z.string(),
	})
	.superRefine((data, ctx) => {
		if (!data.paymentRequired || data.paymentMethod !== 'TARJETA') return

		if (data.cardHolder.trim().length < 3) {
			ctx.addIssue({ code: 'custom', path: ['cardHolder'], message: 'Ingresa el nombre del titular' })
		}

		if (!/^\d{16}$/.test(data.cardNumber)) {
			ctx.addIssue({ code: 'custom', path: ['cardNumber'], message: 'La tarjeta debe tener 16 dígitos' })
		}

		if (!isFutureCardDate(data.cardExpiry)) {
			ctx.addIssue({
				code: 'custom',
				path: ['cardExpiry'],
				message: 'Usa MM/AA y una fecha no vencida',
			})
		}

		if (!/^\d{3}$/.test(data.cardCvv)) {
			ctx.addIssue({ code: 'custom', path: ['cardCvv'], message: 'El CVV debe tener 3 dígitos' })
		}
	})

export type MembershipPurchaseForm = z.infer<typeof membershipPurchaseSchema>

export const MEMBERSHIP_PURCHASE_DEFAULTS: MembershipPurchaseForm = {
	paymentRequired: true,
	paymentMethod: 'TARJETA',
	cardHolder: '',
	cardNumber: '',
	cardExpiry: '',
	cardCvv: '',
}

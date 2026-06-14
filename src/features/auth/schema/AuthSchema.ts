import { z } from 'zod'

export const loginSchema = z.object({
	dni: z.string().length(8, 'DNI debe tener exactamente 8 caracteres'),
	password: z.string().min(1, 'La contraseña es requerida'),
})

export type LoginForm = z.infer<typeof loginSchema>

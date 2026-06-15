import type { MembershipReponse } from '../types'
export const mockMemberships: MembershipReponse[] = [
	{
		// Plan sin oferta, con cupos disponibles
		id: 1,
		name: 'Plan Básico',
		description: 'Acceso ilimitado al gimnasio. Ideal para quienes están empezando.',
		duration: 30,
		price: 49.99,
		discountPrice: null,
		offerStartDate: null,
		offerEndDate: null,
		image: 'https://picsum.photos/id/1015/600/400',
		status: true,
		capacityLimit: 20,
		active: null,
		expired: null,
		remainingDays: null,
		enrolledMembers: 8,
	},
	{
		// Plan con oferta activa y días restantes
		id: 2,
		name: 'Plan Premium',
		description: 'Clases grupales, piscina y acceso prioritario a equipos.',
		duration: 90,
		price: 129.99,
		discountPrice: 99.99,
		offerStartDate: '2025-06-01',
		offerEndDate: '2025-12-31',
		image: 'https://picsum.photos/id/201/600/400',
		status: true,
		capacityLimit: 15,
		active: true, // ← la oferta está activa hoy
		expired: false,
		remainingDays: 45, // ← quedan 45 días de oferta
		enrolledMembers: 9,
	},
	{
		// Plan con cupo lleno (enrolledMembers === capacityLimit)
		id: 3,
		name: 'Plan VIP Anual',
		description: 'Acceso completo con entrenador personal durante todo el año.',
		duration: 365,
		price: 399.99,
		discountPrice: null,
		offerStartDate: null,
		offerEndDate: null,
		image: 'https://picsum.photos/id/160/600/400',
		status: true,
		capacityLimit: 5,
		active: null,
		expired: null,
		remainingDays: null,
		enrolledMembers: 5, // ← lleno: 5/5
	},
	{
		// Plan deshabilitado (status: false)
		id: 4,
		name: 'Plan Estudiante',
		description: 'Descuento especial para estudiantes universitarios con carné vigente.',
		duration: 30,
		price: 35.0,
		discountPrice: null,
		offerStartDate: null,
		offerEndDate: null,
		image: 'https://picsum.photos/id/251/600/400',
		status: false, // ← deshabilitado
		capacityLimit: 25,
		active: null,
		expired: null,
		remainingDays: null,
		enrolledMembers: 3,
	},
	{
		// Plan con oferta vencida
		id: 5,
		name: 'Plan Familiar',
		description: 'Hasta 4 miembros por familia con acceso completo a instalaciones.',
		duration: 60,
		price: 189.99,
		discountPrice: 149.99,
		offerStartDate: '2025-01-01',
		offerEndDate: '2025-03-31',
		image: 'https://picsum.photos/id/326/600/400',
		status: true,
		capacityLimit: 10,
		active: false, // ← oferta ya no está activa
		expired: true, // ← la oferta venció
		remainingDays: null,
		enrolledMembers: 6,
	},
]

export interface EmployeeUpdate {
	dni: string
	firstName: string
	lastName: string
	phoneNumber: string
	email: string
	avatar: File | null
	gender: 'Masculino' | 'Femenino' | 'Otro'
	birthDate: string
	hireDate: string
	salary: number
	contractType: 'Tiempo completo' | 'Medio tiempo'
	specialty: 'Brazos' | 'Piernas' | 'Danzas' | 'Biceps'
	role: 'Admin' | 'Entrenador' | 'Recepcionista'
	id: number
}

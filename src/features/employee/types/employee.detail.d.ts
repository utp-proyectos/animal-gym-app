export interface EmployeeDetailResponse {
	id: number
	dni: string
	firstName: string
	lastName: string
	phoneNumber: string
	gender: 'Masculino' | 'Femenino' | 'Otro'
	email: string
	birthDate: string
	hireDate: string
	avatar: string | null
	salary: number
	contractType: 'Tiempo completo' | 'Medio tiempo'
	specialty: 'Brazos' | 'Piernas' | 'Danzas' | 'Biceps'
	role: 'Admin' | 'Entrenador' | 'Recepcionista'
}

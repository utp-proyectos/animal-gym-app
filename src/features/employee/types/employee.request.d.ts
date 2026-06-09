export interface EmployeeCreateRequest {
	dni: string
	firstName: string
	lastName: string
	phoneNumber: string
	gender: string | number | null
	email: string
	birthDate: string | undefined
	hireDate: string | undefined
	avatar: null | File
	salary: number
	contractType: string | number | null
	specialty: string | number | null
	password: string
	role: Role | null
}

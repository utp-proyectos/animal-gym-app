import { FieldError, Label, TextField } from '@heroui/react'

interface FileFieldProps {
	label?: string
	errorMessage?: string
	variant?: 'primary' | 'secondary'
	children: React.ReactNode
}

const CustomField = ({ label, errorMessage, variant = 'secondary', children }: FileFieldProps) => {
	const isInvalid = !!errorMessage

	return (
		<TextField isInvalid={isInvalid} variant={variant}>
			<Label>{label}</Label>
			{children}
			<FieldError>{errorMessage}</FieldError>
		</TextField>
	)
}

export default CustomField

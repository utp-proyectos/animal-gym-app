import { FieldError, Label, TextField } from '@heroui/react'

interface FileFieldProps {
	label?: string
	errorMessage?: string
	children: React.ReactNode
}

const CustomField = ({ label, errorMessage, children }: FileFieldProps) => {
	const isInvalid = !!errorMessage

	return (
		<TextField isInvalid={isInvalid} variant="secondary">
			<Label>{label}</Label>
			{children}
			<FieldError>{errorMessage}</FieldError>
		</TextField>
	)
}

export default CustomField

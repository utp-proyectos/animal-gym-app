import type { DateValue } from '@internationalized/date'
import { DateField, FieldError, Label } from '@heroui/react'

interface CustomDateFieldProps {
	label: string
	value: DateValue | null
	onChange: (value: DateValue | null) => void
	className?: string
	errorMessage?: string | undefined
}

export function CustomDateField({
	label,
	value,
	onChange,
	errorMessage,
	className = 'w-full',
}: CustomDateFieldProps) {
	const isInvalid = !!errorMessage

	return (
		<DateField className={className} value={value} onChange={onChange} isInvalid={isInvalid}>
			<Label>{label}</Label>
			<DateField.Group variant="secondary">
				<DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
			</DateField.Group>
			<FieldError>{errorMessage}</FieldError>
		</DateField>
	)
}

import type { Time } from '@internationalized/date'
import { TimeField, FieldError, Label } from '@heroui/react'

interface CustomTimeFieldProps {
	label: string
	value: Time | null
	onChange: (value: Time | null) => void
	className?: string
	isInvalid?: boolean
	errorMessage?: string | undefined
}

export function CustomTimeField({
	label,
	value,
	onChange,
	errorMessage,
	className = 'w-full',
	isInvalid = false,
}: CustomTimeFieldProps) {
	return (
		<TimeField className={className} value={value} onChange={onChange} isInvalid={isInvalid}>
			<Label>{label}</Label>
			<TimeField.Group variant="secondary">
				<TimeField.Input>{(segment) => <TimeField.Segment segment={segment} />}</TimeField.Input>
			</TimeField.Group>
			<FieldError>{errorMessage}</FieldError>
		</TimeField>
	)
}

import { NumberField, Label, FieldError } from '@heroui/react'

interface CustomNumberFieldProps {
	label: string
	value: number | undefined
	onChange: (value: number | null) => void
	className?: string
	errorMessage?: string
	formatOptions?: Intl.NumberFormatOptions
}

export function CustomNumberField({
	label,
	value,
	onChange,
	errorMessage,
	className = 'w-full',
	formatOptions,
}: CustomNumberFieldProps) {
	const isInvalid = !!errorMessage

	return (
		<NumberField
			formatOptions={formatOptions}
			className={className}
			value={value}
			onChange={onChange}
			isInvalid={isInvalid}
			variant="secondary"
		>
			<Label>{label}</Label>

			<NumberField.Group>
				<NumberField.DecrementButton />
				<NumberField.Input />
				<NumberField.IncrementButton />
			</NumberField.Group>

			<FieldError>{errorMessage}</FieldError>
		</NumberField>
	)
}

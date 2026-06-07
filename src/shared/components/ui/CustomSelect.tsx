import type { Key } from '@heroui/react'
import { Select, ListBox, Label, FieldError } from '@heroui/react'

interface CustomSelectProps {
	label: string
	value: Key | null
	onChange: (value: Key | null) => void
	placeholder?: string
	options: string[]
	className?: string
	isInvalid?: boolean
	errorMessage?: string | undefined
}

export function CustomSelect({
	label,
	value,
	onChange,
	placeholder,
	options,
	errorMessage,
	className = 'w-full',
	isInvalid = false,
}: CustomSelectProps) {
	return (
		<Select
			className={className}
			placeholder={placeholder}
			value={value}
			onChange={(val) => onChange(val)}
			isInvalid={isInvalid}
			variant="secondary"
		>
			<Label>{label}</Label>
			<Select.Trigger>
				<Select.Value />
				<Select.Indicator />
			</Select.Trigger>

			<Select.Popover>
				<ListBox>
					{options.map((option) => (
						<ListBox.Item key={option} id={option} textValue={option}>
							{option}
							<ListBox.ItemIndicator />
						</ListBox.Item>
					))}
				</ListBox>
			</Select.Popover>
			<FieldError>{errorMessage}</FieldError>
		</Select>
	)
}

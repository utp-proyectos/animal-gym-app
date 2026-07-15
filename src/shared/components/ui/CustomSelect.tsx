import type { Key } from '@heroui/react'
import { Select, ListBox, Label, FieldError } from '@heroui/react'

interface SelectOption {
	label: string
	value: Key
}

interface CustomSelectProps {
	label: string
	value: Key | null
	onChange: (value: Key | null) => void
	placeholder?: string
	options: (string | SelectOption)[]
	className?: string
	errorMessage?: string | undefined
	disabled?: boolean
}

export function CustomSelect({
	label,
	value,
	onChange,
	placeholder,
	options,
	errorMessage,
	className = 'w-full',
	disabled = false,
}: CustomSelectProps) {
	const isInvalid = !!errorMessage

	return (
		<Select
			className={className}
			placeholder={placeholder}
			value={value}
			onChange={(val) => onChange(val)}
			isInvalid={isInvalid}
			variant="secondary"
			isDisabled={disabled}
		>
			<Label>{label}</Label>
			<Select.Trigger>
				<Select.Value />
				<Select.Indicator />
			</Select.Trigger>

			<Select.Popover>
				<ListBox>
					{options.map((option) => {
						const isObject = typeof option !== 'string'
						const itemKey = isObject ? option.value : option
						const itemLabel = isObject ? option.label : option

						return (
							<ListBox.Item key={itemKey} id={itemKey} textValue={itemLabel}>
								{itemLabel}
								<ListBox.ItemIndicator />
							</ListBox.Item>
						)
					})}
				</ListBox>
			</Select.Popover>
			<FieldError>{errorMessage}</FieldError>
		</Select>
	)
}

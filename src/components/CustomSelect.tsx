// src/components/ui/CustomSelect.tsx
import { Select, ListBox, Label } from '@heroui/react'

interface CustomSelectProps {
	name: string
	label: string
	placeholder?: string
	options: string[]
	isRequired?: boolean
	className?: string
}

export function CustomSelect({
	name,
	label,
	placeholder,
	options,
	isRequired = false,
	className = 'w-full',
}: CustomSelectProps) {
	return (
		<Select
			name={name}
			isRequired={isRequired}
			className={className}
			placeholder={placeholder}
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
						/* Usamos el propio string como id y como textValue */
						<ListBox.Item key={option} id={option} textValue={option}>
							{option}
							<ListBox.ItemIndicator />
						</ListBox.Item>
					))}
				</ListBox>
			</Select.Popover>
		</Select>
	)
}

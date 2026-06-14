import { Input, InputGroup } from '@heroui/react'
import { useState } from 'react'
import { IMask } from 'react-imask'

interface Props {
	group?: boolean
	name?: string
	mask: string
	value?: string
	onChange: (value: string) => void
	placeholder?: string
	type?: 'text' | 'password' | 'email' | 'number' | 'tel'
}

const MaskInput = ({ group, name, mask, value, onChange, placeholder, type = 'text' }: Props) => {
	const formater = IMask.createMask({
		mask,
	})

	const [displayValue, setDisplayValue] = useState<string | undefined>(value)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		formater.resolve(e.target.value)

		setDisplayValue(formater.value)

		onChange(formater.unmaskedValue)
	}

	if (group)
		return (
			<InputGroup.Input
				name={name}
				type={type}
				value={displayValue}
				onChange={handleChange}
				placeholder={placeholder}
			/>
		)
	return (
		<Input
			name={name}
			type={type}
			value={displayValue}
			onChange={handleChange}
			placeholder={placeholder}
		/>
	)
}

export default MaskInput

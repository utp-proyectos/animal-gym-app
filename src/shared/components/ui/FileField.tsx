import { Button, FieldError, InputGroup, Label, TextField } from '@heroui/react'
import { Picture } from '@gravity-ui/icons'
import { useEffect, useRef } from 'react'

interface FileFieldProps {
	label?: string
	placeholder?: string
	accept?: string
	value?: FileList | null
	onChange?: (file: FileList | null) => void
	isInvalid?: boolean
	errorMessage?: string
}

type FileInput = EventTarget & HTMLInputElement

const FileField = ({
	label,
	placeholder,
	accept,
	value,
	onChange,
	isInvalid,
	errorMessage,
}: FileFieldProps) => {
	const fileInput = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (!value && fileInput.current) fileInput.current.value = ''
	}, [value])

	const selectFile = () => {
		if (fileInput.current) fileInput.current.click()
	}

	const handleFileChange = ({ files }: FileInput) => {
		if (!files || files.length === 0) return

		if (onChange) onChange(files)
	}

	const getFileName = () => (value ? value[0].name : '')

	return (
		<>
			<TextField isInvalid={isInvalid}>
				<Label>{label}</Label>
				<InputGroup>
					<InputGroup.Input
						placeholder={placeholder}
						value={getFileName()}
						disabled
					></InputGroup.Input>
					<InputGroup.Suffix className="pr-0">
						<Button isIconOnly variant="ghost" size="sm" onClick={selectFile}>
							<Picture className="size-4" />
						</Button>
					</InputGroup.Suffix>
				</InputGroup>
				<FieldError>{errorMessage}</FieldError>
			</TextField>
			<input
				type="file"
				className="hidden"
				ref={fileInput}
				accept={accept}
				onChange={(e) => handleFileChange(e.target)}
			/>
		</>
	)
}

export default FileField

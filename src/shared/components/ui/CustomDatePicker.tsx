import { DatePicker, Label, DateField, Calendar, FieldError } from '@heroui/react'
import type { DateValue } from '@internationalized/date'

interface CustomDatePickerProps {
	label: string
	value: DateValue | null
	onChange: (value: DateValue | null) => void
	minValue?: DateValue
	errorMessage?: string | undefined
	className?: string
}

export function CustomDatePicker({
	label,
	value,
	onChange,
	minValue,
	errorMessage,
	className = 'w-full',
}: CustomDatePickerProps) {
	const isInvalid = !!errorMessage

	return (
		<DatePicker className={className} value={value} onChange={onChange} minValue={minValue}>
			<Label>{label}</Label>

			<DateField.Group variant="secondary" isInvalid={isInvalid}>
				<DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>

				<DateField.Suffix>
					<DatePicker.Trigger>
						<DatePicker.TriggerIndicator />
					</DatePicker.Trigger>
				</DateField.Suffix>
			</DateField.Group>

			<FieldError>{errorMessage}</FieldError>

			<DatePicker.Popover>
				<Calendar aria-label={label}>
					<Calendar.Header className="gap-2 pb-2">
						<Calendar.YearPickerTrigger className="font-semibold text-sm">
							<Calendar.YearPickerTriggerHeading />
							<Calendar.YearPickerTriggerIndicator />
						</Calendar.YearPickerTrigger>
						<div className="flex items-center gap-1 ml-auto">
							<Calendar.NavButton slot="previous" />
							<Calendar.NavButton slot="next" />
						</div>
					</Calendar.Header>

					<Calendar.Grid>
						<Calendar.GridHeader>
							{(day) => (
								<Calendar.HeaderCell className="text-default-400 text-xs font-semibold">
									{day}
								</Calendar.HeaderCell>
							)}
						</Calendar.GridHeader>
						<Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
					</Calendar.Grid>

					<Calendar.YearPickerGrid>
						<Calendar.YearPickerGridBody>
							{({ year }) => <Calendar.YearPickerCell year={year} />}
						</Calendar.YearPickerGridBody>
					</Calendar.YearPickerGrid>
				</Calendar>
			</DatePicker.Popover>
		</DatePicker>
	)
}

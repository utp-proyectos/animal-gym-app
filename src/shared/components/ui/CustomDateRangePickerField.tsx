import { DateRangePicker, Label, DateField, RangeCalendar, FieldError } from '@heroui/react'
import type { DateValue } from '@internationalized/date'
import type { DateRange } from '@heroui/react'

interface CustomDateRangePickerProps {
	label: string
	value: DateRange | null
	onChange: (value: DateRange | null) => void
	minValue?: DateValue
	errorMessage?: string | undefined
	className?: string
	startName?: string
	endName?: string
}

export function CustomDateRangePicker({
	label,
	value,
	onChange,
	minValue,
	errorMessage,
	className = 'w-full',
	startName = 'startDate',
	endName = 'endDate',
}: CustomDateRangePickerProps) {
	const isInvalid = !!errorMessage

	return (
		<DateRangePicker
			className={className}
			value={value}
			onChange={onChange}
			minValue={minValue}
			startName={startName}
			endName={endName}
		>
			<Label>{label}</Label>

			<DateField.Group variant="secondary" isInvalid={isInvalid} fullWidth>
				<DateField.Input slot="start">
					{(segment) => <DateField.Segment segment={segment} />}
				</DateField.Input>

				<DateRangePicker.RangeSeparator className="text-default-400 mx-1" />
				<DateField.Input slot="end">
					{(segment) => <DateField.Segment segment={segment} />}
				</DateField.Input>

				<DateField.Suffix>
					<DateRangePicker.Trigger>
						<DateRangePicker.TriggerIndicator />
					</DateRangePicker.Trigger>
				</DateField.Suffix>
			</DateField.Group>

			<FieldError>{errorMessage}</FieldError>

			<DateRangePicker.Popover>
				<RangeCalendar aria-label={label}>
					<RangeCalendar.Header className="gap-2 pb-2">
						<RangeCalendar.YearPickerTrigger className="font-semibold text-sm">
							<RangeCalendar.YearPickerTriggerHeading />
							<RangeCalendar.YearPickerTriggerIndicator />
						</RangeCalendar.YearPickerTrigger>
						<div className="flex items-center gap-1 ml-auto">
							<RangeCalendar.NavButton slot="previous" />
							<RangeCalendar.NavButton slot="next" />
						</div>
					</RangeCalendar.Header>

					<RangeCalendar.Grid>
						<RangeCalendar.GridHeader>
							{(day) => (
								<RangeCalendar.HeaderCell className="text-default-400 text-xs font-semibold">
									{day}
								</RangeCalendar.HeaderCell>
							)}
						</RangeCalendar.GridHeader>
						<RangeCalendar.GridBody>
							{(date) => <RangeCalendar.Cell date={date} />}
						</RangeCalendar.GridBody>
					</RangeCalendar.Grid>

					<RangeCalendar.YearPickerGrid>
						<RangeCalendar.YearPickerGridBody>
							{({ year }) => <RangeCalendar.YearPickerCell year={year} />}
						</RangeCalendar.YearPickerGridBody>
					</RangeCalendar.YearPickerGrid>
				</RangeCalendar>
			</DateRangePicker.Popover>
		</DateRangePicker>
	)
}

import { RotateCcw } from 'lucide-react'
import {
	Button,
	Card,
	ListBox,
	SearchField,
	Select,
	Slider,
	DateField,
	DateRangePicker,
	Label,
	RangeCalendar,
	type RangeValue,
} from '@heroui/react'
import { type DateValue } from '@internationalized/date'

export function Filters({
	children,
	title,
	onReset,
}: {
	children: React.ReactNode
	title?: string
	onReset?: () => void
}) {
	return (
		<aside className="w-full md:w-72 flex flex-col gap-4">
			<Card className="p-6 border-none bg-default-50/50 rounded-3xl shadow-sm">
				{title && <h3 className="font-bold text-lg mb-3 text-black">{title}</h3>}
				<div className="flex flex-col gap-5">
					{children}
					{onReset && (
						<Button
							className="w-full mt-2 font-medium bg-primary/10 text-primary"
							onPress={onReset}
						>
							<RotateCcw size={18} className="mr-2" />
							Resetear filtros
						</Button>
					)}
				</div>
			</Card>
		</aside>
	)
}

Filters.Search = function Search({
	value,
	onChange,
	placeholder,
}: {
	value: string
	onChange: (value: string) => void
	placeholder?: string
}) {
	return (
		<SearchField name="Buscador" variant="secondary" value={value} onChange={onChange}>
			<Label>Buscador</Label>
			<SearchField.Group>
				<SearchField.SearchIcon />
				<SearchField.Input placeholder={placeholder} />
				<SearchField.ClearButton />
			</SearchField.Group>
		</SearchField>
	)
}

Filters.Select = function FilterSelect({
	label,
	value,
	placeholder,
	options,
	onChange,
}: {
	label: string
	value: string
	placeholder?: string
	options: string[]
	onChange: (value: string) => void
}) {
	return (
		<Select
			className="w-full"
			placeholder={placeholder}
			variant="secondary"
			value={value}
			onChange={(key) => onChange(key as string)}
		>
			<Label>{label}</Label>

			<Select.Trigger>
				<Select.Value />
				<Select.Indicator />
			</Select.Trigger>
			<Select.Popover>
				<ListBox>
					{options.map((opt) => (
						<ListBox.Item key={opt} id={opt} textValue={opt}>
							{opt}
						</ListBox.Item>
					))}
				</ListBox>
			</Select.Popover>
		</Select>
	)
}

Filters.DateRange = function DateRange({
	value,
	onChange,
	label,
}: {
	value: RangeValue<DateValue> | null
	onChange: (value: RangeValue<DateValue> | null) => void
	label?: string
}) {
	return (
		<DateRangePicker className="w-full" value={value} onChange={onChange}>
			<Label>{label}</Label>
			<DateField.Group fullWidth>
				<DateField.InputContainer>
					<DateField.Input slot="start">
						{(segment) => <DateField.Segment segment={segment} />}
					</DateField.Input>
					<DateRangePicker.RangeSeparator />
					<DateField.Input slot="end">
						{(segment) => <DateField.Segment segment={segment} />}
					</DateField.Input>
				</DateField.InputContainer>

				<DateField.Suffix>
					<DateRangePicker.Trigger>
						<DateRangePicker.TriggerIndicator />
					</DateRangePicker.Trigger>
				</DateField.Suffix>
			</DateField.Group>
			<DateRangePicker.Popover>
				<RangeCalendar>
					<RangeCalendar.Header>
						<RangeCalendar.YearPickerTrigger>
							<RangeCalendar.YearPickerTriggerHeading />
							<RangeCalendar.YearPickerTriggerIndicator />
						</RangeCalendar.YearPickerTrigger>
						<RangeCalendar.NavButton slot="previous" />
						<RangeCalendar.NavButton slot="next" />
					</RangeCalendar.Header>
					<RangeCalendar.Grid>
						<RangeCalendar.GridHeader>
							{(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
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

Filters.Range = function Range({
	value,
	min = 0,
	max = 1000,
	step = 1,
	label = 'Rango',
	onChange,
}: {
	value: number
	min?: number
	max?: number
	step?: number
	label?: string
	onChange: (value: number) => void
}) {
	return (
		<Slider
			className="w-full"
			value={value}
			minValue={min}
			maxValue={max}
			step={step}
			onChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
		>
			<Label>{label}</Label>
			<Slider.Output />
			<Slider.Track>
				<Slider.Fill />
				<Slider.Thumb />
			</Slider.Track>
		</Slider>
	)
}

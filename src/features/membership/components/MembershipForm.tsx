import { Switch, Description, TextArea, Input } from '@heroui/react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import CustomField from '@/shared/components/ui/CustomField'
import { CustomNumberField } from '@/shared/components/ui/CustomNumberField'
import { CustomDatePicker } from '@/shared/components/ui/CustomDatePicker'
import FileField from '@/shared/components/ui/FileField'
import defult from '@/assets/global/default.png'
import preview from '@/assets/global/preview.png'

interface MembershipFormProps {
	isEditing?: boolean
	currentImageUrl?: string | null
}

const MembershipForm = ({ isEditing = false, currentImageUrl }: MembershipFormProps) => {
	const { control } = useFormContext()

	const imageValue = useWatch({ control, name: 'image' }) as FileList | null

	const previewSrc =
		imageValue && imageValue.length > 0
			? URL.createObjectURL(imageValue[0])
			: currentImageUrl || preview

	return (
		<div className="flex flex-col gap-5">
			<Controller
				name="name"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<CustomField label="Nombre del plan" errorMessage={error?.message}>
						<Input {...field} placeholder="Ej. Plan Premium" />
					</CustomField>
				)}
			/>

			<Controller
				name="description"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<CustomField label="Descripción" errorMessage={error?.message}>
						<TextArea
							{...field}
							value={field.value ?? ''}
							placeholder="Describe los beneficios del plan..."
							rows={3}
						/>
					</CustomField>
				)}
			/>

			<div className="grid grid-cols-3 gap-3">
				<Controller
					name="duration"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<CustomNumberField
							label="Duración (días)"
							value={field.value}
							onChange={field.onChange}
							errorMessage={error?.message}
						/>
					)}
				/>
				<Controller
					name="price"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<CustomNumberField
							label="Precio (S/)"
							value={field.value}
							onChange={field.onChange}
							errorMessage={error?.message}
							formatOptions={{ style: 'currency', currency: 'PEN' }}
						/>
					)}
				/>
				<Controller
					name="capacityLimit"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<CustomNumberField
							label="Cupos disponibles"
							value={field.value}
							onChange={field.onChange}
							errorMessage={error?.message}
						/>
					)}
				/>
			</div>

			<div className="col-span-2 w-full">
				<Controller
					name="image"
					control={control}
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<FileField
							label={isEditing ? 'Cambiar imagen' : 'Imagen del plan'}
							accept="image/jpeg,image/png,image/webp"
							value={value}
							onChange={onChange}
							variant="secondary"
							errorMessage={error?.message}
						/>
					)}
				/>
			</div>

			<div className="col-span-3 flex justify-center items-center rounded-xl overflow-hidden bg-default-100 min-h-28">
				<img
					src={previewSrc}
					alt="Vista previa"
					className="w-xs h-full object-cover"
					onError={(e) => {
						e.currentTarget.src = defult
					}}
				/>
			</div>

			<Controller
				name="status"
				control={control}
				render={({ field }) => {
					const isActive = field.value ?? true
					return (
						<div
							className={`
                flex items-center justify-between gap-4
                border rounded-xl px-4 py-3 transition-colors duration-200
                ${isActive ? 'border-success/30 bg-success/5' : 'border-default-200 bg-default-50'}
              `}
						>
							<div className="flex flex-col">
								<span className="text-sm font-semibold">Estado del plan</span>
								<span
									className={`text-xs mt-0.5 ${isActive ? 'text-success' : 'text-default-400'}`}
								>
									{isActive ? 'Visible en el catálogo público' : 'Oculto del catálogo público'}
								</span>
							</div>

							<Switch isSelected={isActive} onChange={field.onChange}>
								<Switch.Content>
									<Switch.Control>
										<Switch.Thumb />
									</Switch.Control>
									<span
										className={`text-sm font-semibold ${
											isActive ? 'text-success' : 'text-default-400'
										}`}
									>
										{isActive ? 'Activo' : 'Inactivo'}
									</span>
								</Switch.Content>
								<Description className="sr-only">
									Cambia la visibilidad del plan en el catálogo
								</Description>
							</Switch>
						</div>
					)
				}}
			/>

			<div className="flex items-center gap-3 pt-1">
				<div className="flex-1 h-px bg-default-200" />
				<span className="text-xs font-semibold uppercase tracking-wider text-default-400 whitespace-nowrap">
					Precio de oferta - opcional
				</span>
				<div className="flex-1 h-px bg-default-200" />
			</div>

			<Controller
				name="discountPrice"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<CustomNumberField
						label="Precio de oferta (S/)"
						value={field.value ?? undefined}
						onChange={field.onChange}
						errorMessage={error?.message}
						formatOptions={{ style: 'currency', currency: 'PEN' }}
					/>
				)}
			/>

			<Controller
				name="offerStartDate"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<CustomDatePicker
						label="Inicio de oferta"
						value={field.value ?? null}
						onChange={field.onChange}
						errorMessage={error?.message}
					/>
				)}
			/>

			<Controller
				name="offerEndDate"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<CustomDatePicker
						label="Fin de oferta"
						value={field.value ?? null}
						onChange={field.onChange}
						errorMessage={error?.message}
					/>
				)}
			/>
		</div>
	)
}

export default MembershipForm

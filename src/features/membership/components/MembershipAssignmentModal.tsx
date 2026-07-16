import { useEffect, useMemo } from 'react'
import { Button, Chip, Input, Modal, Spinner, toast } from '@heroui/react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreditCard, ShieldCheck, UserCheck } from 'lucide-react'
import { isAxiosError } from 'axios'

import CustomField from '@/shared/components/ui/CustomField'
import { CustomSelect } from '@/shared/components/ui/CustomSelect'
import type { ApiResponse } from '@/shared/types'
import { usePartners } from '@/features/partner/hooks/usePartners'
import { useAssignMembership, useMembershipAssignmentPreview } from '../hooks/useMemberships'
import {
	MEMBERSHIP_ASSIGNMENT_DEFAULTS,
	membershipAssignmentSchema,
	type MembershipAssignmentForm,
} from '../schema/membershipAssignmentSchema'
import type { MembershipReponse, PaymentMethod } from '../types'

const OPERATION_LABELS = {
	PURCHASE: 'Primera membresía',
	RENEWAL: 'Renovación',
	CHANGE: 'Cambio de membresía',
} as const

const PAYMENT_OPTIONS = [
	{ label: 'Tarjeta', value: 'TARJETA' },
	{ label: 'Efectivo', value: 'EFECTIVO' },
	{ label: 'Yape', value: 'YAPE' },
	{ label: 'Plin', value: 'PLIN' },
]

interface Props {
	isOpen: boolean
	membership: MembershipReponse
	onClose: () => void
}

const formatDate = (value: string) => value.split('-').reverse().join('/')
const formatMoney = (value: number) => `S/ ${value.toFixed(2)}`

const getErrorMessage = (error: unknown) => {
	if (isAxiosError<ApiResponse<unknown>>(error)) {
		return error.response?.data?.message
	}
	return undefined
}

export function MembershipAssignmentModal({ isOpen, membership, onClose }: Props) {
	const {
		data: partners = [],
		isLoading: isLoadingPartners,
		isError: isPartnersError,
	} = usePartners()
	const { mutateAsync: assignMembership, isPending } = useAssignMembership()

	const {
		control,
		handleSubmit,
		setError,
		setValue,
		formState: { errors },
	} = useForm<MembershipAssignmentForm>({
		resolver: zodResolver(membershipAssignmentSchema),
		defaultValues: MEMBERSHIP_ASSIGNMENT_DEFAULTS,
	})

	const partnerDni = useWatch({ control, name: 'partnerDni' })
	const paymentMethod = useWatch({ control, name: 'paymentMethod' })

	const partner = useMemo(
		() => partners.find((item) => item.dni === partnerDni) ?? null,
		[partnerDni, partners],
	)
	const {
		data: preview,
		isLoading: isLoadingPreview,
		isError: isPreviewError,
		error: previewError,
	} = useMembershipAssignmentPreview(membership.id, partnerDni, partner !== null)

	const hasActiveOffer = membership.active === true && membership.discountPrice !== null
	const cardPrice = hasActiveOffer ? membership.discountPrice! : membership.price
	const selectedPrice = preview?.selectedPrice ?? cardPrice
	const amountToPay = preview?.amountToPay ?? selectedPrice
	const paymentRequired = preview ? preview.amountToPay > 0 : false
	const partnerNotFound =
		partnerDni.length === 8 && !isLoadingPartners && !isPartnersError && !partner

	useEffect(() => {
		setValue('paymentRequired', paymentRequired)
	}, [paymentRequired, setValue])

	const onSubmit = async (data: MembershipAssignmentForm) => {
		if (!partner) {
			setError('partnerDni', { message: 'No se encontró un socio con ese DNI' })
			return
		}
		if (!preview?.allowed) {
			setError('partnerDni', {
				message: preview?.message ?? 'No se pudo preparar esta operación',
			})
			return
		}

		try {
			const result = await assignMembership({
				id: membership.id,
				payload: {
					partnerDni: data.partnerDni,
					paymentMethod: data.paymentMethod as PaymentMethod,
				},
			})

			const billText = result.billId ? ` Boleta N.° ${result.billId}.` : ' Operación sin cobro.'
			const refundText =
				result.refundAmount > 0 ? ` Saldo a favor: ${formatMoney(result.refundAmount)}.` : ''

			toast.success(OPERATION_LABELS[result.operationType], {
				description: `${result.partnerName} tiene vigencia hasta el ${formatDate(result.newExpirationDate)}.${billText}${refundText}`,
			})
			onClose()
		} catch (error) {
			toast.danger('No se pudo completar el pago', {
				description: getErrorMessage(error) ?? 'Verifica los datos e inténtalo nuevamente.',
			})
		}
	}

	return (
		<Modal.Backdrop
			isOpen={isOpen}
			onOpenChange={(open) => {
				if (!open && !isPending) onClose()
			}}
		>
			<Modal.Container size="lg" scroll="inside" placement="center">
				<Modal.Dialog className="rounded-3xl w-full max-h-[90vh]">
					<Modal.CloseTrigger isDisabled={isPending} />

					<Modal.Header className="pb-3">
						<Modal.Heading className="text-3xl font-black tracking-tight uppercase text-black">
							Asignar membresía
						</Modal.Heading>
						<p className="text-sm text-default-500">Busca al socio por DNI y confirma el pago.</p>
					</Modal.Header>

					<Modal.Body>
						<form
							id="membership-assignment-form"
							className="flex flex-col gap-5"
							onSubmit={handleSubmit(onSubmit)}
						>
							<div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
								<div className="flex items-start justify-between gap-4">
									<div>
										<p className="text-xs font-bold uppercase tracking-wide text-primary">
											Plan seleccionado
										</p>
										<h3 className="text-xl font-black text-slate-900">{membership.name}</h3>
										<p className="text-sm text-default-500">{membership.duration} días</p>
									</div>
									<div className="text-right">
										{hasActiveOffer && (
											<p className="text-xs text-default-400 line-through">
												S/ {membership.price.toFixed(2)}
											</p>
										)}
										<p className="text-2xl font-black text-primary">{formatMoney(selectedPrice)}</p>
									</div>
								</div>
							</div>

							<div className="flex flex-col gap-2">
								<Controller
									name="partnerDni"
									control={control}
									render={({ field }) => (
										<CustomField label="DNI del socio *" errorMessage={errors.partnerDni?.message}>
											<Input
												{...field}
												placeholder="12345678"
												maxLength={8}
												inputMode="numeric"
												disabled={isPending}
											/>
										</CustomField>
									)}
								/>

								{partner && (
									<div className="flex items-center justify-between gap-3 rounded-2xl border border-success/20 bg-success/5 p-4">
										<div className="flex items-center gap-3">
											<div className="flex size-10 items-center justify-center rounded-full bg-success/10 text-success">
												<UserCheck size={20} />
											</div>
											<div>
												<p className="font-bold text-slate-900">
													{partner.firstName} {partner.lastName}
												</p>
												<p className="text-xs text-default-500">
													Membresía actual: {partner.membershipName ?? 'Sin membresía'}
												</p>
												{preview?.currentExpirationDate && (
													<p className="text-xs text-default-500">
														Vence: {formatDate(preview.currentExpirationDate)} ·{' '}
														{preview.remainingDays} días restantes
													</p>
												)}
											</div>
										</div>
										{preview?.allowed && (
											<Chip
												size="sm"
												color={preview.operationType === 'CHANGE' ? 'warning' : 'success'}
											>
												{OPERATION_LABELS[preview.operationType as keyof typeof OPERATION_LABELS]}
											</Chip>
										)}
									</div>
								)}

								{partnerNotFound && (
									<p className="text-sm font-medium text-danger">
										No existe un socio registrado con ese DNI.
									</p>
								)}

								{isPartnersError && (
									<p className="text-sm font-medium text-danger">
										No se pudo cargar la lista de socios. Cierra el formulario e inténtalo
										nuevamente.
									</p>
								)}

								{partner && isLoadingPreview && (
									<div className="flex items-center gap-2 rounded-2xl bg-default-50 p-4 text-sm text-default-500">
										<Spinner size="sm" />
										Calculando vigencia y saldo restante...
									</div>
								)}

								{partner && isPreviewError && (
									<div className="rounded-2xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">
										{getErrorMessage(previewError) ?? 'No se pudo calcular esta operación.'}
									</div>
								)}
							</div>

							{preview && !preview.allowed && (
								<div className="rounded-2xl border border-danger/20 bg-danger/5 p-4 text-sm font-medium text-danger">
									{preview.message}
								</div>
							)}

							{preview?.allowed && (
								<div className="rounded-2xl border border-default-200 bg-default-50 p-4">
									<p className="text-xs font-bold uppercase tracking-wide text-default-500">
										Resumen de la operación
									</p>
									<div className="mt-3 flex flex-col gap-2 text-sm">
										<div className="flex justify-between gap-4">
											<span className="text-default-500">Precio del nuevo plan</span>
											<span className="font-semibold">{formatMoney(preview.selectedPrice)}</span>
										</div>
										{preview.operationType === 'CHANGE' && (
											<div className="flex justify-between gap-4 text-success">
												<span>Saldo restante ({preview.remainingDays} días)</span>
												<span className="font-semibold">
													− {formatMoney(preview.remainingCredit)}
												</span>
											</div>
										)}
										<div className="my-1 h-px bg-default-200" />
										<div className="flex justify-between gap-4 text-base font-black text-slate-900">
											<span>Total por pagar</span>
											<span>{formatMoney(preview.amountToPay)}</span>
										</div>
										{preview.refundAmount > 0 && (
											<div className="flex justify-between gap-4 text-warning-700">
												<span>Saldo a favor</span>
												<span className="font-semibold">{formatMoney(preview.refundAmount)}</span>
											</div>
										)}
										<div className="flex justify-between gap-4 text-xs text-default-500">
											<span>Nueva fecha de vencimiento</span>
											<span>{formatDate(preview.newExpirationDate)}</span>
										</div>
									</div>
								</div>
							)}

							<div className="h-px bg-default-200" />

							{paymentRequired ? (
								<>
									<Controller
										name="paymentMethod"
										control={control}
										render={({ field }) => (
											<CustomSelect
												label="Método de pago *"
												value={field.value}
												onChange={field.onChange}
												options={PAYMENT_OPTIONS}
												errorMessage={errors.paymentMethod?.message}
											/>
										)}
									/>

									{paymentMethod === 'TARJETA' && (
										<div className="flex flex-col gap-3 rounded-2xl border border-default-200 p-4">
											<div className="flex items-center gap-2 text-default-600">
												<CreditCard size={18} />
												<span className="text-sm font-bold">Datos de tarjeta</span>
											</div>

											<Controller
												name="cardHolder"
												control={control}
												render={({ field }) => (
													<CustomField label="Titular *" errorMessage={errors.cardHolder?.message}>
														<Input {...field} placeholder="JUAN PÉREZ" disabled={isPending} />
													</CustomField>
												)}
											/>

											<Controller
												name="cardNumber"
												control={control}
												render={({ field }) => (
													<CustomField
														label="Número de tarjeta *"
														errorMessage={errors.cardNumber?.message}
													>
														<Input
															{...field}
															placeholder="4111111111111111"
															maxLength={16}
															inputMode="numeric"
															disabled={isPending}
														/>
													</CustomField>
												)}
											/>

											<div className="grid grid-cols-2 gap-3">
												<Controller
													name="cardExpiry"
													control={control}
													render={({ field }) => (
														<CustomField
															label="Vencimiento *"
															errorMessage={errors.cardExpiry?.message}
														>
															<Input
																{...field}
																placeholder="MM/AA"
																maxLength={5}
																disabled={isPending}
															/>
														</CustomField>
													)}
												/>
												<Controller
													name="cardCvv"
													control={control}
													render={({ field }) => (
														<CustomField label="CVV *" errorMessage={errors.cardCvv?.message}>
															<Input
																{...field}
																type="password"
																placeholder="123"
																maxLength={3}
																inputMode="numeric"
																disabled={isPending}
															/>
														</CustomField>
													)}
												/>
											</div>
										</div>
									)}
								</>
							) : preview?.allowed ? (
								<div className="rounded-2xl border border-success/20 bg-success/5 p-4 text-sm text-success-700">
									El saldo del plan actual cubre el nuevo plan. No se requiere pago.
								</div>
							) : null}

							<div className="flex items-start gap-2 rounded-xl bg-default-100 p-3 text-xs text-default-500">
								<ShieldCheck size={16} className="mt-0.5 shrink-0 text-success" />
								<span>Los datos de tarjeta no se envían ni se almacenan.</span>
							</div>
						</form>
					</Modal.Body>

					<Modal.Footer className="pt-4">
						<Button variant="secondary" onPress={onClose} isDisabled={isPending}>
							Cancelar
						</Button>
						<Button
							type="submit"
							form="membership-assignment-form"
							isDisabled={!partner || !preview?.allowed || isLoadingPreview || isPending}
						>
							{isPending ? <Spinner size="sm" /> : <ShieldCheck size={17} />}
							{isPending
								? 'Procesando...'
								: paymentRequired
									? `Pagar ${formatMoney(amountToPay)}`
									: 'Confirmar cambio'}
						</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

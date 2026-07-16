import { useEffect } from 'react'
import { Button, Chip, Input, Modal, Spinner, toast } from '@heroui/react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, CreditCard, ShieldCheck, WalletCards } from 'lucide-react'
import { isAxiosError } from 'axios'

import CustomField from '@/shared/components/ui/CustomField'
import { CustomSelect } from '@/shared/components/ui/CustomSelect'
import type { ApiResponse } from '@/shared/types'
import { useMembershipPurchasePreview, usePurchaseMembership } from '../hooks/useMemberships'
import {
	MEMBERSHIP_PURCHASE_DEFAULTS,
	membershipPurchaseSchema,
	type MembershipPurchaseForm,
} from '../schema/membershipPurchaseSchema'
import type { MembershipPurchaseOperation, MembershipReponse } from '../types'

const PAYMENT_OPTIONS = [
	{ label: 'Tarjeta', value: 'TARJETA' },
	{ label: 'Efectivo', value: 'EFECTIVO' },
	{ label: 'Yape', value: 'YAPE' },
	{ label: 'Plin', value: 'PLIN' },
]

const OPERATION_LABELS: Record<MembershipPurchaseOperation, string> = {
	PURCHASE: 'Comprar membresía',
	RENEWAL: 'Renovar membresía',
	CHANGE: 'Cambiar membresía',
	CURRENT: 'Membresía actual',
	INACTIVE: 'Membresía inactiva',
	FULL: 'Sin cupos disponibles',
}

interface Props {
	isOpen: boolean
	membership: MembershipReponse
	onClose: () => void
}

const formatMoney = (value: number) => `S/ ${value.toFixed(2)}`
const formatDate = (value: string) => value.split('-').reverse().join('/')

const getErrorMessage = (error: unknown) => {
	if (isAxiosError<ApiResponse<unknown>>(error)) return error.response?.data?.message
	return undefined
}

export function MembershipPurchaseModal({ isOpen, membership, onClose }: Props) {
	const {
		data: preview,
		isLoading: isLoadingPreview,
		isError: isPreviewError,
		error: previewError,
	} = useMembershipPurchasePreview(membership.id, isOpen)
	const { mutateAsync: purchaseMembership, isPending } = usePurchaseMembership()

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<MembershipPurchaseForm>({
		resolver: zodResolver(membershipPurchaseSchema),
		defaultValues: MEMBERSHIP_PURCHASE_DEFAULTS,
	})

	const paymentMethod = useWatch({ control, name: 'paymentMethod' })
	const paymentRequired = (preview?.amountToPay ?? 0) > 0

	useEffect(() => {
		if (!isOpen || !preview) return
		reset({ ...MEMBERSHIP_PURCHASE_DEFAULTS, paymentRequired })
	}, [isOpen, paymentRequired, preview, reset])

	const onSubmit = async (data: MembershipPurchaseForm) => {
		if (!preview?.allowed) return

		try {
			const result = await purchaseMembership({
				id: membership.id,
				payload: { paymentMethod: data.paymentRequired ? data.paymentMethod : null },
			})
			const billText = result.billId ? ` Boleta N.° ${result.billId}.` : ''
			const refundText =
				result.refundAmount > 0
					? ` Saldo a favor simulado: ${formatMoney(result.refundAmount)}.`
					: ''

			toast.success(OPERATION_LABELS[result.operationType], {
				description: `Tu membresía estará vigente hasta el ${formatDate(result.newExpirationDate)}.${billText}${refundText}`,
			})
			onClose()
		} catch (error) {
			toast.danger('No se pudo completar la operación', {
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
							{preview ? OPERATION_LABELS[preview.operationType] : 'Procesar membresía'}
						</Modal.Heading>
						<p className="text-sm text-default-500">
							Revisa el resumen antes de confirmar el pago.
						</p>
					</Modal.Header>

					<Modal.Body>
						{isLoadingPreview && (
							<div className="flex min-h-52 items-center justify-center gap-3 text-default-500">
								<Spinner size="sm" />
								<span>Calculando el cambio...</span>
							</div>
						)}

						{isPreviewError && (
							<div className="rounded-2xl border border-danger/20 bg-danger/5 p-5 text-danger">
								<p className="font-bold">No se pudo preparar la operación</p>
								<p className="mt-1 text-sm">
									{getErrorMessage(previewError) ?? 'Cierra el formulario e inténtalo nuevamente.'}
								</p>
							</div>
						)}

						{preview && !isLoadingPreview && (
							<form
								id="membership-purchase-form"
								className="flex flex-col gap-5"
								onSubmit={handleSubmit(onSubmit)}
							>
								<Controller
									name="paymentRequired"
									control={control}
									render={({ field }) => (
										<input
											type="hidden"
											name={field.name}
											value={field.value ? 'true' : 'false'}
											readOnly
										/>
									)}
								/>

								{preview.currentMembershipId && (
									<div className="rounded-2xl border border-warning/20 bg-warning/5 p-4">
										<p className="text-xs font-bold uppercase tracking-wide text-warning-700">
											Membresía registrada
										</p>
										<div className="mt-2 flex items-center justify-between gap-3">
											<div>
												<p className="font-bold text-slate-900">{preview.currentMembershipName}</p>
												<p className="text-xs text-default-500">
													{preview.currentExpirationDate
														? `Vence: ${formatDate(preview.currentExpirationDate)}`
														: 'Sin fecha de vencimiento'}
												</p>
											</div>
											{preview.operationType === 'CHANGE' && (
												<Chip size="sm" color="warning">
													{preview.remainingDays} días restantes
												</Chip>
											)}
										</div>
									</div>
								)}

								<div className="flex items-center gap-3">
									<div className="min-w-0 flex-1 rounded-2xl border border-primary/20 bg-primary/5 p-4">
										<p className="text-xs font-bold uppercase tracking-wide text-primary">
											Nuevo plan
										</p>
										<p className="truncate text-xl font-black text-slate-900">
											{preview.selectedMembershipName}
										</p>
										<p className="text-sm text-default-500">{preview.selectedDuration} días</p>
									</div>
									<ArrowRight className="shrink-0 text-default-300" />
									<div className="text-right">
										{preview.discountApplied && (
											<p className="text-xs text-default-400 line-through">
												{formatMoney(preview.originalPrice)}
											</p>
										)}
										<p className="text-2xl font-black text-primary">
											{formatMoney(preview.selectedPrice)}
										</p>
									</div>
								</div>

								<div className="rounded-2xl border border-default-200 p-4">
									<div className="flex justify-between text-sm text-default-600">
										<span>Precio del nuevo plan</span>
										<span>{formatMoney(preview.selectedPrice)}</span>
									</div>
									{preview.remainingCredit > 0 && (
										<div className="mt-2 flex justify-between text-sm text-success">
											<span>Saldo restante aplicado</span>
											<span>- {formatMoney(preview.remainingCredit)}</span>
										</div>
									)}
									<div className="my-3 h-px bg-default-200" />
									<div className="flex items-end justify-between">
										<span className="font-bold text-slate-900">Monto a pagar</span>
										<span className="text-2xl font-black text-primary">
											{formatMoney(preview.amountToPay)}
										</span>
									</div>
									{preview.refundAmount > 0 && (
										<p className="mt-2 text-right text-xs font-semibold text-success">
											Saldo a favor simulado: {formatMoney(preview.refundAmount)}
										</p>
									)}
								</div>

								<div
									className={`rounded-xl p-3 text-sm ${
										preview.allowed ? 'bg-primary/5 text-primary' : 'bg-danger/5 text-danger'
									}`}
								>
									{preview.message}
								</div>

								{preview.allowed && paymentRequired && (
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
													<span className="text-sm font-bold">Datos simulados de tarjeta</span>
												</div>
												<Controller
													name="cardHolder"
													control={control}
													render={({ field }) => (
														<CustomField
															label="Titular *"
															errorMessage={errors.cardHolder?.message}
														>
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
								)}

								{preview.allowed && (
									<div className="flex items-start gap-2 rounded-xl bg-default-100 p-3 text-xs text-default-500">
										<ShieldCheck size={16} className="mt-0.5 shrink-0 text-success" />
										<span>Los datos de tarjeta no se envían ni se almacenan.</span>
									</div>
								)}
							</form>
						)}
					</Modal.Body>

					<Modal.Footer className="pt-4">
						<Button variant="secondary" onPress={onClose} isDisabled={isPending}>
							Cancelar
						</Button>
						<Button
							type="submit"
							form="membership-purchase-form"
							isDisabled={!preview?.allowed || isLoadingPreview || isPending}
						>
							{isPending ? (
								<Spinner size="sm" />
							) : paymentRequired ? (
								<WalletCards size={17} />
							) : (
								<ShieldCheck size={17} />
							)}
							{isPending
								? 'Procesando...'
								: paymentRequired
									? `Pagar ${formatMoney(preview?.amountToPay ?? 0)}`
									: 'Confirmar cambio'}
						</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal.Container>
		</Modal.Backdrop>
	)
}

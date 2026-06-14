import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Description, FieldGroup, Fieldset, Form, InputGroup, Spinner } from '@heroui/react'
import { useState } from 'react'
import { useLogin } from '../hooks/useLogin'

import logo from '@/assets/global/logo.png'
import loginVideo from '@/assets/global/login.mp4'
import { loginSchema, type LoginForm } from '../schema/AuthSchema'
import CustomField from '@/shared/components/ui/CustomField'
import { Eye, EyeClosed, Lock, Person } from '@gravity-ui/icons'
import MaskInput from '@/shared/components/ui/MaskInput'

const LoginPage = () => {
	const { mutate, isPending } = useLogin()
	const {
		control,
		handleSubmit,
		setValue,
		formState: { isValid, isSubmitted },
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
	})

	const [isVisible, setIsVisible] = useState(false)

	const onSubmit = (data: LoginForm) =>
		mutate(data, {
			onError: () => {
				setValue('password', '', { shouldValidate: true })
			},
		})

	return (
		<div className="relative min-h-screen flex">
			<div className="absolute top-0 left-0 w-full h-dvh lg:static lg:basis-1/2">
				<div className="w-37.5 rounded-xl overflow-hidden mb-4 absolute top-4 left-4">
					<img src={logo} alt="Animal GYM" className="w-full block" />
				</div>
				<video src={loginVideo} autoPlay loop muted className=" w-full h-full object-cover" />
			</div>

			<div className="z-10 flex flex-col items-center justify-center w-full lg:basis-1/2">
				<Form
					onSubmit={handleSubmit(onSubmit)}
					className="bg-gray-100 p-6 rounded-xl w-[320px] min-[420px]:w-sm lg:bg-transparent lg:p-0"
				>
					<Fieldset>
						<Fieldset.Legend>Iniciar Sesión</Fieldset.Legend>
						<Description>Ingrese sus credenciales para acceder a la app</Description>
						<FieldGroup>
							<Controller
								name="dni"
								control={control}
								render={({ field, fieldState: { error } }) => (
									<CustomField label="DNI" errorMessage={error?.message} variant="primary">
										<InputGroup>
											<InputGroup.Prefix>
												<Person className="size-4" />
											</InputGroup.Prefix>
											<MaskInput
												group
												mask="00000000"
												placeholder="00000000"
												{...field}
											></MaskInput>
										</InputGroup>
									</CustomField>
								)}
							/>
							<Controller
								name="password"
								control={control}
								render={({ field, fieldState: { error } }) => (
									<CustomField label="Contraseña" errorMessage={error?.message} variant="primary">
										<InputGroup>
											<InputGroup.Prefix>
												<Lock className="size-4" />
											</InputGroup.Prefix>
											<InputGroup.Input
												{...field}
												type={isVisible ? 'text' : 'password'}
												placeholder="********"
											/>
											<InputGroup.Suffix
												className="cursor-pointer"
												onClick={() => setIsVisible(!isVisible)}
											>
												{isVisible ? <EyeClosed className="size-4" /> : <Eye className="size-4" />}
											</InputGroup.Suffix>
										</InputGroup>
									</CustomField>
								)}
							></Controller>
							<Fieldset.Actions>
								<Button
									type="submit"
									isDisabled={isSubmitted && !isValid}
									fullWidth
									className="rounded-lg bg-red-600"
									isPending={isPending}
								>
									<>
										{isPending ? <Spinner color="current" size="sm" /> : null}
										{isPending ? 'Ingresando...' : 'Ingresar'}
									</>
								</Button>
							</Fieldset.Actions>
						</FieldGroup>
					</Fieldset>
				</Form>
			</div>
		</div>
	)
}

export default LoginPage

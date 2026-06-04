import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, FieldError, InputGroup, Label, Spinner, TextField } from '@heroui/react'
import { User, Eye, EyeClosed, Lock } from 'lucide-react'
import { useState } from 'react'

import { useLogin } from '../hooks/useLogin'
import { isAxiosError } from 'axios'

import logo from '@/assets/global/logo.png'
import loginVideo from '@/assets/global/login.mp4'

const loginSchema = z.object({
	dni: z.string().length(8, 'DNI debe tener exactamente 8 caracteres'),
	password: z.string().min(1, 'La contraseña es requerida'),
})

type LoginForm = z.infer<typeof loginSchema>

const LoginPage = () => {
	const { mutate, isPending, error } = useLogin()
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
	})

	const [isVisible, setIsVisible] = useState(false)

	const onSubmit = (data: LoginForm) => mutate(data)

	const getErrorMessage = () => {
		if (!isAxiosError(error)) return null

		const status = error.response?.status
		if (status === 401) return 'Credenciales incorrectas'
		if (status === 403) return 'Tu cuenta está desactivada'
		if (status === 422) return 'Datos inválidos'

		return 'Error inesperado, intenta de nuevo'
	}

	const errorMessage = getErrorMessage()

	return (
		<div className="relative min-h-screen flex">
			<div className="basis-1/2">
				<div className="w-37.5 rounded-xl overflow-hidden mb-4 absolute top-4 left-4">
					<img src={logo} alt="Animal GYM" className="w-full block" />
				</div>
				<video src={loginVideo} autoPlay loop muted className=" w-full h-full object-cover" />
			</div>
			<div className="basis-1/2 flex flex-col items-center justify-center">
				<h2 className="text-2xl font-bold">Iniciar Sesión</h2>
				<p className="text-muted mb-4">Ingrese sus credenciales para acceder</p>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-sm">
					<TextField isInvalid={!!errors.dni}>
						<Label>DNI</Label>
						<InputGroup>
							<InputGroup.Prefix>
								<User className="size-4" />
							</InputGroup.Prefix>
							<InputGroup.Input placeholder="00000000" {...register('dni')} />
						</InputGroup>
						<FieldError>{errors.dni?.message}</FieldError>
					</TextField>
					<TextField isInvalid={!!errors.password}>
						<Label>Contraseña</Label>
						<InputGroup>
							<InputGroup.Prefix>
								<Lock className="size-4" />
							</InputGroup.Prefix>
							<InputGroup.Input
								placeholder="********"
								type={isVisible ? 'text' : 'password'}
								{...register('password')}
							/>
							<InputGroup.Suffix>
								<Button
									type="button"
									isIconOnly
									aria-label={isVisible ? 'Hide password' : 'Show password'}
									size="sm"
									variant="ghost"
									onPress={() => setIsVisible(!isVisible)}
								>
									{isVisible ? <EyeClosed className="size-4" /> : <Eye className="size-4" />}
								</Button>
							</InputGroup.Suffix>
						</InputGroup>
						<FieldError>{errors.password?.message}</FieldError>
					</TextField>
					<Button
						type="submit"
						isDisabled={!isValid}
						fullWidth
						className="rounded-lg bg-red-600"
						isPending={isPending}
					>
						<>
							{isPending ? <Spinner color="current" size="sm" /> : null}
							{isPending ? 'Ingresando...' : 'Ingresar'}
						</>
					</Button>
				</form>
				{errorMessage && <p>{errorMessage}</p>}
			</div>
		</div>
	)
}

export default LoginPage

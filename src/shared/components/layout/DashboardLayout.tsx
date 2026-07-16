import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Button, Dropdown, Label } from '@heroui/react'
import {
	Menu,
	Users,
	Contact,
	IdCard,
	SportShoe,
	ReceiptSwissFranc,
	Puzzle,
	CalendarCheck,
} from 'lucide-react'
import logo from '@/assets/global/logo.png'
import './style.css'
import { useLogout } from '@/features/auth/hooks/useLogin'
import { useAuthStore } from '@/store/authStore'
import HasRole from '../auth/HasRole'
import type { Role } from '@/shared/types'
interface MenuItem {
	label: string
	path: string
	icon: React.ReactNode
	roles?: Role[]
}
export function DashboardLayout() {
	const [sidebarOpen, setSidebarOpen] = useState(true)
	const location = useLocation()
	const logout = useLogout()
	const user = useAuthStore((state) => state.user)
	const navigate = useNavigate()

	const menuItems: MenuItem[] = [
		// { label: 'Inicio', path: '/', icon: <House size={20} /> },
		{
			label: 'Socios',
			path: '/socios',
			icon: <Contact size={20} />,
			roles: ['ADMIN', 'RECEPCIONISTA'],
		},
		{
			label: 'Membresias',
			path: '/membresias',
			icon: <IdCard size={20} />,
			roles: ['ADMIN', 'SOCIO', 'RECEPCIONISTA'],
		},
		{ label: 'Rutinas', path: '/rutinas', icon: <CalendarCheck size={20} /> },
		{ label: 'Empleados', path: '/empleados', icon: <Users size={20} />, roles: ['ADMIN'] },
		{ label: 'Clases', path: '/clases', icon: <Puzzle size={20} /> },
		{ label: 'Ejercicios', path: '/ejercicios', icon: <SportShoe size={20} /> },
		{
			label: 'Boletas',
			path: '/boletas',
			icon: <ReceiptSwissFranc size={20} />,
			roles: ['ADMIN', 'SOCIO', 'RECEPCIONISTA'],
		},
	]

	const handleUserAction = (key: string | number) => {
		if (key === 'profile') {
			navigate('/perfil')
		} else if (key === 'logout') {
			logout()
		}
	}

	return (
		<div className={`app-gym ${sidebarOpen ? 'sidebar-open' : ''}`}>
			{/* SIDEBAR */}
			<aside className="sidebar-gym">
				<header className="sidebar-header-gym">
					<img src={logo} alt="Animal GYM" className="sidebar-logo-gym" />
				</header>

				<nav className="sidebar-body-gym">
					<ul className="sidebar-items-gym">
						{menuItems.map((item) => {
							const isActive =
								item.path === '/'
									? location.pathname === '/'
									: location.pathname.startsWith(item.path)

							const menuItem = (
								<li
									key={item.path}
									className={`sidebar-item-gym ${isActive ? 'active' : ''} ${item.roles && user ? (item.roles.includes(user.role) ? '' : 'hidden') : ''}`}
								>
									<NavLink to={item.path} className="sidebar-link-gym">
										<span className="sidebar-link-icon-gym">{item.icon}</span>
										{item.label}
									</NavLink>
								</li>
							)

							return item.roles ? (
								<HasRole key={item.path} roles={item.roles}>
									{menuItem}
								</HasRole>
							) : (
								menuItem
							)
						})}
					</ul>
				</nav>
			</aside>

			{/* CONTENEDOR PRINCIPAL TRIDIMENSIONAL */}
			<div className="main-container-gym">
				<main className="main-gym">
					{/* Overlay de clic para cerrar el sidebar en móviles */}
					<div
						className={`absolute inset-0 z-2000 transition-opacity duration-500 lg:hidden
    ${
			sidebarOpen
				? 'opacity-100 pointer-events-auto backdrop-blur-md bg-black/40'
				: 'opacity-0 pointer-events-none'
		}`}
						onClick={() => setSidebarOpen(false)}
					/>

					{/* Navbar Superior usando la estructura limpia de HeroUI para el Dropdown */}
					<nav className="main-navbar-gym">
						<div className="navbar-content-gym">
							<Button
								isIconOnly
								variant="outline"
								className="text-black bg-zinc-100 hover:bg-zinc-200 rounded-xl"
								onPress={() => setSidebarOpen(!sidebarOpen)}
							>
								<Menu size={20} />
							</Button>

							{/* Menú Usuario con Dropdown */}
							<div className="navbar-user-gym">
								<Dropdown>
									<Button
										variant="outline"
										className="flex items-center gap-2 px-3 py-1 bg-zinc-50 hover:bg-zinc-100 rounded-full text-black font-semibold"
									>
										<img
											src="https://i.pravatar.cc/150?u=admin"
											alt="user avatar"
											className="navbar-user-image-gym"
										/>
										<span>{user?.firstName}</span>
									</Button>
									<Dropdown.Popover>
										<Dropdown.Menu
											onAction={(key) => handleUserAction(key)}
											className="bg-white border shadow-xl rounded-xl p-2 min-w-37.5"
										>
											<Dropdown.Item id="profile" textValue="Ver Perfil">
												<Label className="text-black font-medium cursor-pointer">Ver perfil</Label>
											</Dropdown.Item>
											<Dropdown.Item
												id="logout"
												textValue="Cerrar Sesión"
												className="text-danger"
												onClick={logout}
											>
												<Label className="text-danger font-medium cursor-pointer">
													Cerrar Sesión
												</Label>
											</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown.Popover>
								</Dropdown>
							</div>
						</div>
					</nav>

					{/* Cuerpo donde React Router inyectará las vistas hijas */}
					<div className="main-body-gym">
						<div className="container-fluid py-4 px-6">
							<Outlet />
						</div>
					</div>
				</main>
			</div>
		</div>
	)
}

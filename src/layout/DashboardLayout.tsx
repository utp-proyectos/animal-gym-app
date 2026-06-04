import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Button } from '@heroui/react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users } from 'lucide'

export function DashboardLayout() {
	const [sidebarOpen, setSidebarOpen] = useState(false)

	const menuItems = [
		{ label: 'Inicio', path: '/', icon: <LayoutDashboard size={20} /> },
		{ label: 'Empleados', path: '/empleados', icon: <Users size={20} /> },
	]

	return (
		<div className="flex h-screen">
			{/* Sidebar */}

			{sidebarOpen && (
				<aside className="w-64 bg-black text-white">
					<aside className="w-64 bg-black text-white">
						<div className="border-b border-zinc-800 p-6">
							<h1 className="text-2xl font-bold">ANIMAL GYM</h1>
						</div>
						<nav className="flex flex-col gap-2 p-4">
							{menuItems.map((item) => (
								<NavLink key={item.path} to={item.path}>
									<Button fullWidth variant="outline" className="justify-start text-white">
										{item.label}
									</Button>
								</NavLink>
							))}
						</nav>
					</aside>
				</aside>
			)}

			{/* Contenido */}
			<main className="flex-1">
				<header className="border-b p-4">
					<Button variant="outline" onPress={() => setSidebarOpen(!sidebarOpen)}>
						☰
					</Button>
				</header>

				<div className="p-6">
					<Outlet />
				</div>
			</main>
		</div>
	)
}

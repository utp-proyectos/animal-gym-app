import { Card, Input, Button, ListBox, Select, Dropdown, Label } from '@heroui/react'
import { Plus, RotateCcw, MoreVertical, Edit3, Trash2 } from 'lucide-react'

interface ClaseGym {
	id: number
	nombre: string
	desc: string
	estado: string
}

export function LessonPage() {
	const clases: ClaseGym[] = [
		{
			id: 1,
			nombre: 'HIIT Avanzado',
			desc: 'Entrenamiento de alta intensidad',
			estado: 'Programado',
		},
		{
			id: 2,
			nombre: 'Pilates',
			desc: 'Clase de pilates con ejercicios de core',
			estado: 'Programado',
		},
		{
			id: 3,
			nombre: 'Spinning',
			desc: 'Clase de ciclismo indoor',
			estado: 'Programado',
		},
		{
			id: 4,
			nombre: 'Zumba',
			desc: 'Clase de baile fitness',
			estado: 'Programado',
		},
		{
			id: 5,
			nombre: 'Crossfit',
			desc: 'Entrenamiento funcional',
			estado: 'Programado',
		},
		{
			id: 6,
			nombre: 'Stretching',
			desc: 'Estiramientos guiados',
			estado: 'Programado',
		},
	]

	return (
		<div className="p-8 max-w-7xl mx-auto min-h-screen bg-white text-slate-900">
			{/* Header */}
			<header className="flex justify-between items-end mb-10">
				<div>
					<h1 className="text-4xl font-black tracking-tight uppercase text-black">
						Gestión de Clases
					</h1>
					<p className="text-default-500 text-sm">Administra y organiza tus sesiones deportivas</p>
				</div>
				<Button className="bg-primary text-white font-semibold px-6 rounded-full shadow-lg shadow-primary/20">
					<Plus size={20} className="mr-2" />
					Crear clase
				</Button>
			</header>

			<div className="flex flex-col md:flex-row gap-8">
				{/* Sidebar de Filtros */}
				<aside className="w-full md:w-72 flex flex-col gap-4">
					<Card className="p-6 border-none bg-default-50/50 rounded-3xl shadow-sm">
						<h3 className="font-bold text-lg mb-6 text-black">Filtrar clases</h3>

						<div className="flex flex-col gap-7">
							<div className="flex flex-col gap-2">
								<div className="flex flex-col gap-1">
									<Label htmlFor="input-type-email">Nombre</Label>
									<Input id="input-type-nombre" placeholder="Ej. Yoga" type="nombre" />
								</div>
							</div>

							{/* Selectores */}
							<div className="flex flex-col gap-2">
								<label className="text-sm font-semibold text-slate-700 ml-1">Estado</label>
								<Select className="w-[256px]" placeholder="Select one">
									<Select.Trigger className="px-3 py-2 flex justify-between items-center">
										<Select.Value />
										<Select.Indicator />
									</Select.Trigger>
									<Select.Popover>
										<ListBox className="bg-white border border-default-200 shadow-xl">
											<ListBox.Item id="todos" textValue="Todos">
												Todos
											</ListBox.Item>
											<ListBox.Item id="prog" textValue="Programado">
												Programado
											</ListBox.Item>
										</ListBox>
									</Select.Popover>
								</Select>
							</div>

							<Button className="w-full mt-2 font-medium bg-primary/10 text-primary">
								<RotateCcw size={18} className="mr-2" />
								Resetear filtros
							</Button>
						</div>
					</Card>
				</aside>

				{/* Grid de Cards */}
				<main className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{clases.map((clase) => (
						<Card
							key={clase.id}
							className="p-0 border-none bg-white hover:translate-y-1 transition-all duration-300 shadow-md overflow-hidden flex flex-col"
						>
							{/* IMAGEN TOTAL A LO ANCHO (Sin paddings ni bordes) */}
							<div className="w-full aspect-video relative">
								<img
									alt={clase.nombre}
									className="w-full h-full object-cover"
									src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop"
								/>
								{/* Badge de Estado flotante */}
								<div className="absolute top-4 left-5">
									<span className="bg-white/90 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
										{clase.estado}
									</span>
								</div>
							</div>

							{/* CONTENIDO*/}
							<div className="p-6 flex flex-col gap-3">
								<div className="flex justify-between items-start">
									<div className="flex flex-col">
										<h4 className="font-bold text-2xl text-black tracking-tight leading-tight">
											{clase.nombre}
										</h4>
										<p className="text-default-400 text-xs font-semibold uppercase">
											Fitness Center
										</p>
									</div>

									{/* DROPDOWN CON PUNTOS NEGROS */}
									<Dropdown>
										<Button
											aria-label="Opciones"
											className="min-w-10 w-10 h-10 p-0 bg-transparent hover:bg-default-100 rounded-full border-none outline-none"
										>
											{/* Color negro puro y más grosor para que resalte */}
											<MoreVertical size={24} className="text-black" strokeWidth={3} />
										</Button>
										<Dropdown.Popover>
											<Dropdown.Menu
												onAction={(key) => console.log(key)}
												className="min-w-42.5 bg-white border border-default-100 shadow-xl rounded-2xl"
											>
												<Dropdown.Item id="edit" textValue="Editar">
													<div className="flex items-center gap-2 py-1">
														<Edit3 size={18} className="text-black" />
														<Label className="font-semibold text-black">Editar clase</Label>
													</div>
												</Dropdown.Item>
												<Dropdown.Item id="delete" textValue="Eliminar" className="text-danger">
													<div className="flex items-center gap-2 py-1">
														<Trash2 size={18} />
														<Label className="font-semibold">Eliminar clase</Label>
													</div>
												</Dropdown.Item>
											</Dropdown.Menu>
										</Dropdown.Popover>
									</Dropdown>
								</div>

								<p className="text-default-500 text-sm leading-relaxed mt-1">{clase.desc}</p>

								<div className="h-px w-full bg-default-100 mt-2" />

								<div className="flex items-center justify-between mt-1">
									<span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
										Gym ID: #{clase.id}
									</span>
									<Button variant="outline">Ver detalles</Button>
								</div>
							</div>
						</Card>
					))}
				</main>
			</div>
		</div>
	)
}

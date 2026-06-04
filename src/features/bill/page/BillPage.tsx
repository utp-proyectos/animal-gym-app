export function BillPage() {
	return (
		<div className="p-8 max-w-7xl mx-auto min-h-screen bg-white text-slate-900">
			<header className="flex justify-between items-end mb-10">
				<div>
					<h1 className="text-4xl font-black tracking-tight uppercase text-black">
						Gestión de boletas
					</h1>
					<p className="text-default-500 text-sm">Administra las boletas de los socios</p>
				</div>
			</header>
			<div className="flex flex-col md:flex-row gap-8">{/* Sidebar filtros */}</div>
		</div>
	)
}

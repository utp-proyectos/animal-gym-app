# Guía de Implementación de Filtros

Estandarizar la implementación de filtros en todas las páginas del sistema utilizando el componente compartido `Filters`.

---

## 1. Definir el estado inicial de filtros

Cada página debe declarar un objeto con los filtros que necesite fuera del componente.

```tsx
const INITIAL_FILTERS = {
	search: '',
	role: '',
	dateRange: null,
}
```

Luego crear el estado:

```tsx
const [filters, setFilters] = useState(INITIAL_FILTERS)
```

---

## 2. Renderizar el panel de filtros

Los filtros siempre deben colocarse dentro del componente `Filters`.

```tsx
<Filters title="Filtrar empleados" onReset={() => setFilters(INITIAL_FILTERS)}>
	<Filters.Search
		value={filters.search}
		placeholder="Buscar empleado..."
		onChange={(value) =>
			setFilters((prev) => ({
				...prev,
				search: value,
			}))
		}
	/>

	<Filters.Select
		label="Rol"
		value={filters.role}
		placeholder="Seleccionar rol"
		options={ROLE_OPTIONS}
		onChange={(value) =>
			setFilters((prev) => ({
				...prev,
				role: value,
			}))
		}
	/>

	<Filters.DateRange
		label="Fecha de ingreso"
		value={filters.dateRange}
		onChange={(value) =>
			setFilters((prev) => ({
				...prev,
				dateRange: value,
			}))
		}
	/>
</Filters>
```

---

## 3. Crear la colección filtrada

Nunca modificar la colección original. Siempre crear una nueva variable derivada aplicando los filtros.

```tsx
const filteredItems = items.filter((item) => {
	const matchSearch =
		filters.search === '' || item.name.toLowerCase().includes(filters.search.toLowerCase())

	const matchRole =
		filters.role === '' ||
		filters.role === 'Todos' ||
		item.role.toLowerCase() === filters.role.toLowerCase()

	return matchSearch && matchRole
})
```

---

## 4. Implementar filtros de fechas

Cuando se utilice un rango de fechas se debe convertir la fecha del registro al formato esperado por el `DateRangePicker`.

Si el backend devuelve un ISO string como `"2024-01-15T00:00:00Z"`, recortar primero con `.split('T')[0]` para obtener solo `"2024-01-15"` pero si devuelve LocalDate `"2024-01-20"` quitar el `"split('T')"`.

```tsx
const itemDate = item.createdAt ? parseDate(item.createdAt.split('T')[0]) : null

const matchDate =
	!filters.dateRange ||
	!itemDate ||
	(itemDate >= filters.dateRange.start && itemDate <= filters.dateRange.end)
```

---

## 5. Renderizar la colección filtrada

Una vez creada la colección filtrada, todos los componentes visuales deben consumir dicha colección.

✅ Correcto

```tsx
<CardList items={filteredItems} />
```

❌ Incorrecto

```tsx
<CardList items={items} />
```

> Si se mantiene la colección original, los filtros actualizarán el estado correctamente pero la interfaz seguirá mostrando todos los registros.

---

## 6. Reiniciar filtros

Siempre proporcionar la posibilidad de limpiar los filtros a través de `onReset`.

```tsx
<Filters onReset={() => setFilters(INITIAL_FILTERS)}>
```

Esto restaurará todos los valores al estado inicial definido en `INITIAL_FILTERS`.

---

## Componentes disponibles

### `Filters.Search`

Búsqueda por texto. Compara si el campo contiene lo que escribe el usuario.

Ideal para: nombre, correo, documento, teléfono, cualquier campo textual.

```tsx
<Filters.Search
	value={filters.search}
	placeholder="Buscar..."
	onChange={(v) => setFilters((p) => ({ ...p, search: v }))}
/>
```

```tsx
const matchSearch =
	filters.search === '' || item.name.toLowerCase().includes(filters.search.toLowerCase())
```

---

### `Filters.Select`

Selección única desde un dropdown. Compara si el campo es igual a la opción seleccionada.

Ideal para: estado, rol, categoría, género, tipo.

```tsx
<Filters.Select
	label="Rol"
	value={filters.role}
	placeholder="Seleccionar rol"
	options={['Todos', 'Admin', 'Entrenador']}
	onChange={(v) => setFilters((p) => ({ ...p, role: v }))}
/>
```

```tsx
const matchRole =
	filters.role === '' ||
	filters.role === 'Todos' ||
	item.role.toLowerCase() === filters.role.toLowerCase()
```

> Las opciones deben coincidir con los valores del backend. Usar `.toLowerCase()` en ambos lados evita problemas con mayúsculas o minúsculas.

---

### `Filters.DateRange`

Selector de rango de fechas. Filtra si la fecha del registro cae dentro del rango seleccionado.

Ideal para: fecha de creación, fecha de ingreso, fecha de vencimiento.

```tsx
import type { DateValue, RangeValue } from '@heroui/react'

// En INITIAL_FILTERS
dateRange: null as RangeValue<DateValue> | null
```

```tsx
<Filters.DateRange
	label="Fecha de ingreso"
	value={filters.dateRange}
	onChange={(v) => setFilters((p) => ({ ...p, dateRange: v }))}
/>
```

```tsx
import { parseDate } from '@internationalized/date'

const itemDate = item.createdAt ? parseDate(item.createdAt) : null

const matchDate =
	!filters.dateRange ||
	!itemDate ||
	(itemDate >= filters.dateRange.start && itemDate <= filters.dateRange.end)
```

---

### `Filters.Range`

Slider numérico. Filtra si el campo es menor o igual al valor seleccionado.

Ideal para: precio, edad, stock, cantidad, peso.

```tsx
<Filters.Range
	label="Precio máximo"
	value={filters.price}
	min={0}
	max={5000}
	step={100}
	onChange={(v) => setFilters((p) => ({ ...p, price: v }))}
/>
```

```tsx
const matchPrice = filters.price === 0 || item.price <= filters.price
```

---

## Flujo recomendado

```
1. Obtener la colección original  →  useData()
2. Crear el estado de filtros     →  useState(INITIAL_FILTERS)
3. Renderizar el panel Filters    →  <Filters />
4. Generar colección filtrada     →  data.filter(...)
5. Pasar filtrada al componente   →  <EntityCard items={filteredItems} />
```

```tsx
const { data = [] } = useData()
const [filters, setFilters] = useState(INITIAL_FILTERS)

const filteredItems = data.filter(...)

return (
  <>
    <Filters onReset={() => setFilters(INITIAL_FILTERS)}>
      ...
    </Filters>

    <EntityCard items={filteredItems} />
  </>
)

```

---

## 7. Manejar estados vacíos

El componente de lista debe manejar tres estados distintos: error al cargar, sin resultados por filtros y sin datos registrados. La lógica se basa en comparar `filteredItems.length` con `items.length`.

```tsx
{
	error ? (
		<div className="p-8 flex flex-col items-center justify-center gap-3 bg-danger-50 text-danger rounded-2xl border border-danger-100">
			<p className="font-semibold">Error al cargar los registros</p>
			<Frown />
		</div>
	) : filteredItems.length === 0 ? (
		<div className="p-16 flex flex-col items-center justify-center gap-3 bg-default-50 text-default-400 rounded-3xl border border-dashed border-default-300">
			<Frown size={40} strokeWidth={1.5} />
			<p className="font-bold text-xl text-default-500">
				{items.length === 0 ? 'No hay registros aún' : 'No se encontraron resultados'}
			</p>
			<p className="text-sm text-default-400">
				{items.length === 0
					? 'Aún no se han creado registros en la base de datos.'
					: 'Intenta con otros filtros o reinicia la búsqueda.'}
			</p>
		</div>
	) : (
		<EntityCard items={filteredItems} />
	)
}
```

### Por qué comparar `filteredItems` con `items`

| Caso                                          | `items.length` | `filteredItems.length` | Mensaje                        |
| --------------------------------------------- | -------------- | ---------------------- | ------------------------------ |
| Sin datos en el backend                       | `0`            | `0`                    | "No hay registros aún"         |
| Con datos pero ninguno coincide con el filtro | `> 0`          | `0`                    | "No se encontraron resultados" |
| Con datos y coincidencias                     | `> 0`          | `> 0`                  | Renderiza la lista             |

Si solo revisaras `filteredItems.length === 0` sin comparar con `items.length`, no podrías distinguir entre "no hay datos" y "el filtro no encontró nada" — ambos mostrarían el mismo mensaje y el usuario no sabría si debe crear registros o cambiar los filtros.

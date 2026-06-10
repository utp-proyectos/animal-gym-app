# Formularios Reutilizables con React Hook Form + Zod + TypeScript

Patrón para crear formularios que comparten campos entre modos (crear/editar), con schemas separados por modo y un único componente de inputs reutilizable.

---

## Estructura de carpetas

Cada feature tiene sus propios archivos de schema, formulario compartido y wrappers por modo.

```
feature/
├── page/
│   └── FeaturePage.tsx
├── schema/
│   └── featureSchema.ts
└── components/
    ├── FeatureForm.tsx   ← inputs reutilizables
    ├── CreateForm.tsx    ← wrapper modo crear
    └── EditForm.tsx      ← wrapper modo editar
```

---

## 1. Schema (`schema/featureSchema.ts`)

Se define un schema base con los campos compartidos y se extiende para cada modo.

```typescript
import { z } from 'zod'

// Schema base con los campos compartidos entre modos
const baseSchema = z.object({
	// Ver documentación de Zod para las validaciones de cada campo
})

// Modo editar: extiende base con id
export const editSchema = baseSchema.extend({
	id: z.number(),
})

// Modo crear: extiende base con campos exclusivos
export const createSchema = baseSchema.extend({
	password: z.string().min(1, { message: 'La contraseña es requerida' }),
})

// Tipos separados para input (lo que entra al form) y output (lo que sale validado)
// z.input  → valores antes de transformaciones (útil para defaultValues con null, undefined, etc.)
// z.output → valores después de transformaciones (lo que recibe onSubmit)
export type CreateInput = z.input<typeof createSchema>
export type CreateOutput = z.output<typeof createSchema>

export type EditInput = z.input<typeof editSchema>
export type EditOutput = z.output<typeof editSchema>
```

> **Nota:** Los tipos `Input` y `Output` difieren cuando el schema usa `.transform()` o `.default()`. Si no usas transformaciones, son equivalentes.

---

## 2. Campos reutilizables (`components/FeatureForm.tsx`)

Un único componente que contiene todos los inputs. Se conecta al form a través de `useFormContext`, sin recibir `register`, `control` ni `errors` como props.

Los campos que solo aparecen en un modo se controlan con una prop booleana.

```tsx
import { useFormContext } from 'react-hook-form'
import { Controller } from 'react-hook-form'

interface FeatureFormProps {
	isEditing?: boolean
}

const FeatureForm = ({ isEditing = false }: FeatureFormProps) => {
	const { control } = useFormContext()

	return (
		<>
			{/* Campo compartido */}
			<Controller
				name="email"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<CustomField label="Email" errorMessage={error?.message}>
						<Input {...field} placeholder="Ingrese su email" />
					</CustomField>
				)}
			/>

			{/* Campo exclusivo del modo editar */}
			{isEditing && (
				<Controller
					name="someEditOnlyField"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<CustomField label="Campo edición" errorMessage={error?.message}>
							<Input {...field} />
						</CustomField>
					)}
				/>
			)}

			{/* Campo exclusivo del modo crear */}
			{!isEditing && (
				<Controller
					name="password"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<CustomField label="Contraseña" errorMessage={error?.message}>
							<Input {...field} type="password" />
						</CustomField>
					)}
				/>
			)}
		</>
	)
}

export default FeatureForm
```

### Por qué `Controller` en lugar de `register`

`register` funciona conectando directamente el `ref` y los eventos del input nativo del DOM. Cuando el input viene de una librería de componentes externa (shadcn, Radix, Ark UI, etc.), ese componente puede:

- Manejar su propio estado interno de `value`
- No exponer un `ref` compatible con el DOM nativo
- Ignorar el `defaultValue` porque tiene un estado controlado propio

`Controller` resuelve esto porque envuelve el input y le pasa explícitamente `value`, `onChange` y `onBlur` como props controladas, sin depender del `ref` del DOM. Si un input viene de una librería externa, usar `Controller` es lo correcto por defecto.

```tsx
// register → para inputs HTML nativos (<input>, <select>, <textarea>)
<input {...register('email')} />

// Controller → para componentes de librerías externas
<Controller
  name="email"
  control={control}
  render={({ field }) => <CustomInput {...field} />}
/>
```

---

## 3. Wrapper crear (`components/CreateForm.tsx`)

Define su propio `useForm` con el schema de creación, su `onSubmit`, y envuelve `FeatureForm` con `FormProvider`.

```tsx
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createSchema, CreateInput, CreateOutput } from '../schema/featureSchema'
import FeatureForm from './FeatureForm'

const CreateForm = () => {
	const form = useForm<CreateInput, unknown, CreateOutput>({
		resolver: zodResolver(createSchema),
		defaultValues: {
			// valores iniciales del form
		},
	})

	const onSubmit = (data: CreateOutput) => {
		// data tiene el tipo exacto del schema de creación
		console.log(data)
	}

	return (
		<FormProvider {...form}>
			<form id="create-form" onSubmit={form.handleSubmit(onSubmit)}>
				<FeatureForm />
				<button type="submit">Crear</button>
			</form>
		</FormProvider>
	)
}

export default CreateForm
```

---

## 4. Wrapper editar (`components/EditForm.tsx`)

Mismo patrón que `CreateForm` pero con el schema de edición y `defaultValues` poblados desde los datos del item a editar.

```tsx
import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editSchema, EditInput, EditOutput } from '../schema/featureSchema'
import FeatureForm from './FeatureForm'

interface Item {
	id: number
	email: string
	// resto de campos
}

interface EditFormProps {
	item: Item
}

const EditForm = ({ item }: EditFormProps) => {
	const form = useForm<EditInput, unknown, EditOutput>({
		resolver: zodResolver(editSchema),
		defaultValues: item,
	})

	const onSubmit = (data: EditOutput) => {
		console.log(data)
	}

	return (
		<FormProvider {...form}>
			<form id="edit-form" onSubmit={form.handleSubmit(onSubmit)}>
				<FeatureForm isEditing />
				<button type="submit">Guardar</button>
			</form>
		</FormProvider>
	)
}

export default EditForm
```

---

## 5. Ejemplo en modal

```tsx
const modal = useOverlayState()
const [currentFeature, setCurrentFeature] = useState<Feature | null>(null)
const isEditing = currentFeature !== null

const openCreateForm = () => {
	setCurrentFeature(null)
	modal.open()
}

const openEditForm = () => {
	setCurrentFeature({
		id: 1,
		email: 'email@example.com',
		option: 'option_1',
	})
	modal.open()
}
```

```tsx
<Modal.Backdrop isOpen={modal.isOpen} onOpenChange={modal.setOpen}>
	// ...
	<Modal.Body>{isEditing ? <EditForm employee={currentEmployee} /> : <CreateForm />}</Modal.Body>
	// ...
</Modal.Backdrop>
```

---

## Hooks utilizados

### `useForm`

Inicializa el form con su schema, valores por defecto y configuración. Devuelve todos los métodos y estado del form (`register`, `control`, `handleSubmit`, `formState`, `reset`, etc.). Se instancia una vez por wrapper (CreateForm / EditForm).

### `FormProvider`

Expone el contexto del form a todos los componentes hijos sin necesidad de pasar props. Recibe el objeto completo que devuelve `useForm` (`{...form}`).

### `useFormContext`

Consume el contexto de `FormProvider` desde cualquier componente hijo. Devuelve los mismos métodos que `useForm`. Se usa en `FeatureForm` para acceder a `control` sin recibir props.

### `useFormState`

Alternativa a desestructurar `formState` desde `useFormContext`. Crea una suscripción reactiva independiente al estado del form (errores, estado de submit, etc.). Útil cuando `errors` no re-renderiza correctamente al desestructurarse desde `useFormContext`.

```tsx
// Si errors no actualiza en el hijo, usar esto en lugar de useFormContext
import { useFormState } from 'react-hook-form'
const { errors } = useFormState()
```

### `Controller`

Conecta inputs de librerías externas al form pasando `value`, `onChange` y `onBlur` explícitamente. A través de `fieldState` expone el error del campo directamente, sin necesidad de acceder a `formState.errors`.

---

## Resumen del patrón

| Archivo            | Responsabilidad                                                       |
| ------------------ | --------------------------------------------------------------------- |
| `featureSchema.ts` | Schemas Zod + tipos TypeScript                                        |
| `CreateForm.tsx`   | `useForm` con createSchema, `onSubmit`, `FormProvider`                |
| `EditForm.tsx`     | `useForm` con editSchema, `onSubmit`, `FormProvider`, `defaultValues` |
| `FeatureForm.tsx`  | Todos los inputs con `Controller`, visibilidad por `isEditing`        |

Cada wrapper es independiente: tiene su propio schema, su propio estado de form y su propio submit. `FeatureForm` no sabe en qué modo está — solo recibe un booleano para mostrar u ocultar campos.

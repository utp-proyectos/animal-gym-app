# Guía de Validación de Formularios

Stack: **React Hook Form** + **Zod v4** + **TypeScript** + componentes de librería UI

---

## Conceptos base

Antes de ver los ejemplos, es importante entender cómo fluye la validación:

```
Campo UI → field.onChange(valor del componente)
               ↓
         z.custom<T>()              ← tipamos el input explícitamente
               ↓
         z.refine                   ← validamos condiciones (requerido, formato, etc.)
               ↓
         z.transform / z.pipe       ← convertimos al tipo final de la API
               ↓
         onSubmit(data: FormOutput) ← tipo exacto que espera la API
```

### Los tres genéricos de `useForm`

```typescript
useForm<FormInput, unknown, FormOutput>()
//      ^^^^^^^^^           ^^^^^^^^^^
//      tipo que RHF        tipo que recibe onSubmit
//      maneja internamente (z.output del schema)
//      (z.input del schema)
```

- `FormInput` = `z.input<typeof schema>` → el tipo que manejan los componentes UI
- `FormOutput` = `z.output<typeof schema>` → el tipo que llega al `onSubmit` y se envía a la API

### `defaultValues` siempre explícitos

RHF inicializa todos los campos como `undefined` en runtime si no defines `defaultValues`,
independientemente del tipo inferido. Esto causa el warning:

```
Warning: A component changed from uncontrolled to controlled
```

Define siempre los `defaultValues` acorde al tipo del campo:

```typescript
useForm<FormInput, unknown, FormOutput>({
	resolver: zodResolver(schema),
	defaultValues: {
		textField: '', // string          → string vacío
		numberField: 0, // number          → 0
		selectField: null, // Option | null   → null = "no seleccionado"
		dateField: null, // DateValue | null → null = "no seleccionado"
		checkField: false, // boolean         → false
		// fileField: sin defaultValue — FileList no puede inicializarse vacío
	},
})
```

### Cuándo usar `register` vs `Controller`

| Componente                                 | Estrategia   |
| ------------------------------------------ | ------------ |
| `<input>`, `<textarea>`, `<select>` nativo | `register`   |
| Componente UI con `onChange(value)` custom | `Controller` |

Los componentes de librería UI exponen `onChange(value)` directamente en lugar de
`onChange(event)`, por eso no pueden conectarse con `register` y necesitan `Controller`.

### Modo de validación

RHF por defecto valida solo al hacer submit. Después del primer submit re-valida en cada `onChange`:

```typescript
useForm({
	mode: 'onSubmit', // cuándo valida por primera vez (default)
	reValidateMode: 'onChange', // cuándo re-valida después del primer submit (default)
})
```

Otras opciones de `mode`: `'onChange'`, `'onBlur'`, `'onTouched'`, `'all'`.

---

## Inputs nativos

### Text

```typescript
const schema = z.object({
	fieldName: z
		.string({ message: 'El campo es requerido' })
		.min(1, 'El campo es requerido') // cubre string vacío ''
		.min(3, 'Mínimo 3 caracteres'), // validaciones adicionales
})

type FormInput = z.input<typeof schema> // { fieldName: string }
type FormOutput = z.output<typeof schema> // { fieldName: string }
```

> Usar `message` para un mensaje general o `error: (issue) => ...` para mensajes por tipo de error.

```tsx
const { register, formState: { errors } } = useForm<FormInput, unknown, FormOutput>({
  resolver: zodResolver(schema),
  defaultValues: { fieldName: '' },
})

<Field {...register('fieldName')} />
<FieldError>{errors.email?.message}</FieldError>
```

`z.string()` acepta string vacío `''` — por eso siempre combinar con `.min(1)` para campos requeridos.

### Number

Los inputs `type="number"` devuelven `string` desde el DOM. Hay dos formas de manejarlo:

```typescript
// Opción A: valueAsNumber en register (control explícito)
const schema = z.object({
  fieldName: z.number({ message: 'El campo es requerido' })
              .min(0, 'El valor mínimo es 0'),
})

<input type="number" {...register('fieldName', { valueAsNumber: true })} />

// Opción B: z.coerce (conversión automática string → number)
const schema = z.object({
  fieldName: z.coerce.number({ message: 'El campo es requerido' })
                     .min(0, 'El valor mínimo es 0'),
})

<input type="number" {...register('fieldName')} />
```

### Checkbox

```typescript
const schema = z.object({
  fieldName: z.literal(true, {
    errorMap: () => ({ message: 'Este campo es requerido' }),
  }),
})

// defaultValues
defaultValues: { fieldName: false }

<input type="checkbox" {...register('fieldName')} />
{errors.fieldName && <span>{errors.fieldName.message}</span>}
```

`z.literal(true)` valida que el checkbox esté marcado — si está en `false` falla.

---

## Select con librería UI

El componente `Select` devuelve `Key | null` en su `onChange`, donde `Key = string | number`.
Se usa `Controller` para conectarlo con RHF.

### Estrategia A — Validar con `z.enum`

Usar cuando los valores del Select deben validarse contra un conjunto fijo — Zod rechaza
cualquier valor que no pertenezca al enum, independientemente de lo que devuelva el componente.

```typescript
type Option = 'option_1' | 'option_2'

const OPTIONS = ['option_1', 'option_2'] as const satisfies readonly Option[]
//              ^^^^^^^^^^^^^^^^^^^^^^^^^  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//              as const: preserva literales para z.enum
//              satisfies: verifica que cada valor sea Option
//              Si agregas un Option nuevo y no lo pones aquí → error de TS ✅

const schema = z.object({
	fieldName: z
		.custom<Option | null>()
		//      ^^^^^^^^^^^^^ tipo explícito: lo que devuelve el Select
		.pipe(
			z.enum(OPTIONS, {
				message: 'Selecciona una opción',
				// message cubre cualquier error: null, string inválido, etc.
			}),
		),
})

const SELECT_OPTIONS = ['option_1', 'option_2', 'option_3'] // option_3 no es una opcion valida

type FormInput = z.input<typeof schema> // { fieldName: Option | null }
type FormOutput = z.output<typeof schema> // { fieldName: Option }
```

```tsx
<Controller
	name="fieldName"
	control={control}
	render={({ field, fieldState: { error } }) => (
		<CustomSelect
			label="Campo"
			options={SELECT_OPTIONS}
			value={field.value}
			onChange={field.onChange}
			isInvalid={!!error}
			errorMessage={error?.message}
		/>
	)}
/>
```

### Estrategia B — Solo validar que no sea null

Usar cuando las opciones ya están tipadas correctamente — el array tipado como `Option[]`
garantiza en compilación que solo entran valores válidos, el schema solo verifica que
el usuario haya seleccionado algo.

```typescript
type Option = 'option_1' | 'option_2'

const OPTIONS: Option[] = ['option_1', 'option_2']
//             ^^^^^^^^
//             TypeScript garantiza que solo entran valores de tipo Option ✅

const schema = z.object({
	fieldName: z.custom<Option | null>().refine((val): val is Option => val !== null, {
		//       ^^^^^^^^^^^^^^^^^^^^ type predicate
		//       elimina null del tipo de output
		message: 'Selecciona una opción',
	}),
})

type FormInput = z.input<typeof schema> // { fieldName: Option | null }
type FormOutput = z.output<typeof schema> // { fieldName: Option }
```

```tsx
<Controller
	name="fieldName"
	control={control}
	render={({ field, fieldState: { error } }) => (
		<CustomSelect
			label="Campo"
			options={OPTIONS}
			value={field.value}
			onChange={field.onChange}
			isInvalid={!!error}
			errorMessage={error?.message}
		/>
	)}
/>
```

### Opciones con label y value distintos

Si el Select muestra texto diferente al value enviado a la API:

```typescript
type Option = 'option_1' | 'option_2'

const OPTIONS = [
	{ label: 'Opción 1', value: 'option_1' },
	{ label: 'Opción 2', value: 'option_2' },
] satisfies { label: string; value: Option }[]
//           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//           garantiza que value sea siempre de tipo Option ✅

// El Select muestra option.label pero devuelve option.value en onChange
```

---

## DateField con librería UI

Los componentes `DateField` trabajan con `DateValue` de `@internationalized/date`.
El output a la API debe ser `string` en formato `"YYYY-MM-DD"`.

```typescript
import type { DateValue } from '@internationalized/date'

const schema = z.object({
	fieldName: z
		.custom<DateValue | null>()
		.refine((val) => val !== null, {
			//       			 ^^^^^^^^^^^~ validamos que no sea null
			message: 'La fecha es requerida',
		})
		.transform((val) => val.toString()),
	// DateValue.toString() → "YYYY-MM-DD"
})

type FormInput = z.input<typeof schema> // { fieldName: DateValue | null }
type FormOutput = z.output<typeof schema> // { fieldName: string }
```

```tsx
<Controller
	name="fieldName"
	control={control}
	render={({ field, fieldState: { error } }) => (
		<CustomDateField
			label="Fecha"
			value={field.value} // DateValue | null → directo al componente
			onChange={field.onChange}
			isInvalid={!!error}
			errorMessage={error?.message}
		/>
	)}
/>
```

Si el formulario se pre-rellena desde la API:

```typescript
import { parseDate } from '@internationalized/date'

defaultValues: {
  fieldName: apiData?.fieldName
    ? parseDate(apiData.fieldName)  // "YYYY-MM-DD" → DateValue
    : null,
}
```

---

## Input File

El input file nativo devuelve `FileList` en `e.target.files`:

- `FileList` con archivos → cuando el usuario selecciona algo
- `null` → cuando no hay archivos o se limpia el input
  Usar siempre `z.custom<FileList | null>()` y `defaultValue: null` para que el
  `reset()` de RHF limpie el campo correctamente — asignar `null` al value del
  input file limpia el DOM de la misma forma que asignar `''`.

### Campo requerido

`abort: true` detiene la ejecución si el primer `refine` falla — los siguientes
no se ejecutan si llega `null`, evitando acceder a propiedades de un valor nulo.

```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png']

const schema = z.object({
	fieldName: z
		.custom<FileList | null>()
		.refine((files) => files !== null, {
			message: 'El archivo es requerido',
			abort: true, // ← si falla, los refines siguientes no se ejecutan
		})
		.transform((files) => files[0]) // FileList → File
		// Zod v4 infiere que files es FileList aquí (null descartado por abort)
		.refine((file) => file.size <= MAX_FILE_SIZE, 'El archivo no puede superar 5MB.')
		.refine((file) => ACCEPTED_TYPES.includes(file.type), 'Solo se permiten .jpg y .png.'),
})

type FormInput = z.input<typeof schema> // { fieldName: FileList | null }
type FormOutput = z.output<typeof schema> // { fieldName: File }

// defaultValues
defaultValues: {
	fieldName: null
}
```

### Campo opcional

`.nullable()` corta la ejecucion cuando llega `null` — ningún `refine` ni `transform`
se ejecuta. Solo cuando llega un `FileList` se validan tamaño y tipo.

```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png']

const schema = z.object({
	fieldName: z
		.custom<FileList>()
		.transform((files) => files[0]) // FileList → File
		.refine((file) => file.size <= MAX_FILE_SIZE, 'El archivo no puede superar 5MB.')
		.refine((file) => ACCEPTED_TYPES.includes(file.type), 'Solo se permiten .jpg y .png.')
		.nullable(),
	// null cortocircuita antes del transform y los refines ✅
})

type FormInput = z.input<typeof schema> // { fieldName: FileList | null }
type FormOutput = z.output<typeof schema> // { fieldName: File | null }

// defaultValues
defaultValues: {
	fieldName: null
}
```

### Uso en el formulario

```tsx
<Controller
	name="fieldName"
	control={control}
	render={({ field: { onChange }, fieldState: { error } }) => (
		<CustomFileInput
			label="Archivo"
			accept="image/jpeg,image/png"
			onChange={onChange}
			isInvalid={!!error}
			errorMessage={error?.message}
		/>
	)}
/>
```

### Enviar a la API con FormData

Los archivos no pueden enviarse como JSON — usar `multipart/form-data`.

```typescript
const service = (data) => api.post('/endpoint', toFormData(data))
	// axios detecta FormData automáticamente y setea
	// Content-Type: multipart/form-data con el boundary correcto
	// NO forzar el Content-Type manualmente
}
```

---

## Referencia rápida

### ¿Qué schema usar según el tipo de campo?

| Campo                  | Schema                          | Input               | Output         |
| ---------------------- | ------------------------------- | ------------------- | -------------- |
| Text                   | `z.string().min(1)`             | `string`            | `string`       |
| Number (coerce)        | `z.coerce.number()`             | `string`            | `number`       |
| Number (explícito)     | `z.number()` + `valueAsNumber`  | `number`            | `number`       |
| Checkbox requerido     | `z.literal(true)`               | `boolean`           | `true`         |
| Select UI + enum       | `z.custom + pipe(z.enum)`       | `Option \| null`    | `Option`       |
| Select UI + null check | `z.custom + refine`             | `Option \| null`    | `Option`       |
| DateField UI           | `z.custom + refine + transform` | `DateValue \| null` | `string`       |
| File requerido         | `z.custom + refine + transform` | `FileList \| null`  | `File`         |
| File opcional          | `z.custom + refine + transform` | `FileList \| null`  | `File \| null` |

### Herramientas de Zod

| Herramienta     | Para qué                                                                                 |
| --------------- | ---------------------------------------------------------------------------------------- |
| `z.custom<T>()` | Tipar el input explícitamente — siempre el primer paso para componentes UI               |
| `z.refine`      | Validar sin cambiar el valor ni el tipo. Con `abort: true` detiene la ejecución si falla |
| `z.transform`   | Cambiar el valor y/o el tipo de output                                                   |
| `z.pipe`        | Conectar la salida de un schema con la entrada de otro schema completo                   |
| `z.enum`        | Validar que el valor pertenezca a un conjunto de literales                               |
| `z.literal`     | Validar que el valor sea exactamente ese literal                                         |
| `z.coerce`      | Conversión automática de tipos (string → number, etc.)                                   |

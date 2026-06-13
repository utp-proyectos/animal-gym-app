# Manejo de Estado de Modales en React 19 + HeroUI v3

## Objetivo

Centralizar el control de apertura, cierre y datos asociados a un modal utilizando un único estado.

Este patrón permite:

* Abrir un modal vacío para crear registros.
* Abrir un modal con información para editar registros.
* Mantener el estado del modal en un solo lugar.
* Evitar múltiples estados (`isOpen`, `selectedItem`, etc.).

---

# Estructura del Estado

Definimos una interfaz que almacena:

* `isOpen`: indica si el modal está visible.
* `data`: información asociada al registro seleccionado.

```tsx
interface ModalState {
  isOpen: boolean
  data: Data | null
}
```

Inicializamos el estado:

```tsx
const [formModal, setFormModal] = useState<ModalState>({
  isOpen: false,
  data: null
})
```

---

# Abrir Modal para Crear

Cuando se desea crear un nuevo registro, el modal se abre sin información.

```tsx
<Button
  onPress={() =>
    setFormModal({
      isOpen: true,
      data: null
    })
  }
>
  Nuevo Registro
</Button>
```

Resultado:

```ts
{
  isOpen: true,
  data: null
}
```

El formulario entenderá que se trata de una creación porque no existe información asociada.

---

# Abrir Modal para Editar

Cuando se desea editar un registro existente, se envía el objeto seleccionado al estado.

```tsx
onEdit={() =>
  setFormModal({
    isOpen: true,
    data: item
  })
}
```

Resultado:

```ts
{
  isOpen: true,
  data: item
}
```

De esta forma el formulario recibe los datos y puede precargar los campos.

---

# Enviar Estado al Modal

El componente padre es responsable de controlar completamente el estado del modal.

```tsx
<FormModal
  isOpen={formModal.isOpen}
  onOpenChange={(isOpen) =>
    setFormModal({
      isOpen,
      data: null
    })
  }
  data={formModal.data}
/>
```

Props utilizadas:

| Prop         | Descripción                          |
| ------------ | ------------------------------------ |
| isOpen       | Indica si el modal está abierto      |
| onOpenChange | Función ejecutada al cerrar el modal |
| data         | Información asociada al registro     |

---

# Uso Dentro del Modal

El estado recibido desde el componente padre se conecta directamente con el componente Modal de HeroUI.

```tsx
<Modal.Backdrop
  isOpen={isOpen}
  onOpenChange={onOpenChange}
>
```

HeroUI utilizará:

* `isOpen` para mostrar u ocultar el modal.
* `onOpenChange` para notificar cuando el modal debe cerrarse.

---

# Cierre del Modal

HeroUI ejecuta automáticamente `onOpenChange()` cuando se utiliza un elemento con el slot `close` que este dentro del modal.

Ejemplo:

```tsx
<Button
  slot="close"
>
  Cancelar
</Button>
```

Al presionar el botón:

1. HeroUI detecta el `slot="close"`.
2. El modal solicita cerrarse.
3. Se ejecuta `onOpenChange()`.
4. El componente padre actualiza el estado.

```tsx
setFormModal({
  isOpen: false,
  data: null
})
```

Estado final:

```ts
{
  isOpen: false,
  data: null
}
```

---

# Flujo Completo

## Crear Registro

```text
Usuario presiona "Nuevo Registro"
        ↓
isOpen = true
data = null
        ↓
Modal abierto
        ↓
Usuario guarda o cancela
        ↓
onOpenChange()
        ↓
isOpen = false
data = null
```

---

## Editar Registro

```text
Usuario presiona "Editar"
        ↓
isOpen = true
data = item
        ↓
Formulario recibe información
        ↓
Usuario guarda o cancela
        ↓
onOpenChange()
        ↓
isOpen = false
data = null
```

---

# Ventajas del Patrón

* Un único estado controla todo el modal.
* Fácil de reutilizar en cualquier módulo.
* Evita estados duplicados.
* Facilita distinguir entre creación y edición.
* Mantiene una fuente única de verdad (Single Source of Truth).
* Compatible con React 19 y HeroUI v3.

---

# Resumen

El modal siempre depende del estado del componente padre.

```tsx
interface ModalState {
  isOpen: boolean
  data: Data | null
}
```

* `data = null` → modo creación.
* `data != null` → modo edición.
* `isOpen = true` → modal visible.
* `isOpen = false` → modal oculto.

Todo el ciclo de vida del modal se controla mediante el estado `formModal`.

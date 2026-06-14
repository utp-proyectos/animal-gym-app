# Manejo de Ciclo de Vida Asíncrono en Formularios

## Objetivo

Controlar de manera segura el cierre de modales y la persistencia de datos en la UI basándose **únicamente** en la respuesta del servidor (Backend).

Este patrón permite:

- Evitar que el modal se cierre antes de tiempo si la petición falla.
- Mantener la información intacta en pantalla para que el usuario pueda corregir errores.
- Ejecutar efectos secundarios de éxito (como alertas, notificaciones o redirecciones) antes de desmontar el componente.
- Separar las acciones visuales inmediatas (Cancelar) de las acciones de negocio asíncronas (Guardar).

---

# El Problema de los Cierres Prematuros

Si dependiéramos únicamente de propiedades de UI como `slot="close"` en el botón de envío (`type="submit"`), el modal se cerraría en el mismo milisegundo en el que el usuario hace clic.

Si el servidor responde con un error de base de datos (ej. _"La clase ya existe"_ o _"Capacidad inválida"_), el usuario perdería todo lo que escribió, asumiendo erróneamente que los datos se guardaron.

---

# Manejo en el onSubmit con `mutate`

Cuando utilizamos las mutaciones de React Query (`useMutation`), la función `mutate` acepta un segundo argumento con opciones de callback para reaccionar al resultado del servidor en tiempo real:

```tsx
interface FormProps {
	onClose: () => void // 💡 Recibida desde el padre para forzar el cierre
}

export function CreateForm({ onClose }: FormProps) {
	const { mutate, isPending } = useCreateSession()

	const onSubmit = (data: CreateOutput) => {
		// 1. Ejecutamos la petición hacia la base de datos
		mutate(data, {
			onSuccess: (response) => {
				// 2. El servidor guardó los datos con éxito (200 OK / 201 Created)
				console.log('Registro creado con éxito:', response)

				// 3. Fieles al flujo: Cerramos el modal solo si todo salió bien
				onClose()
			},
			onError: (error) => {
				// 4. El backend rechazó la petición o falló la red
				console.error('Error al guardar en el backend:', error)

				// NOTA: No llamamos a onClose(). El modal se queda abierto
				// para que el usuario vea los mensajes de error sin perder sus datos.
			},
		})
	}
}
```

# Callbacks de React Query Usados

| Callback        | Descripción                                                                              | Comportamiento en la UI                                              |
| :-------------- | :--------------------------------------------------------------------------------------- | :------------------------------------------------------------------- |
| **`onSuccess`** | Se ejecuta cuando el servidor responde de forma exitosa.                                 | Desencadena el cierre definitivo de la ventana (`onClose()`).        |
| **`onError`**   | Se ejecuta si ocurre un error de red o el backend devuelve un código de error (4xx/5xx). | Mantiene el formulario abierto y bloquea el cierre para diagnóstico. |

### Flujo de Ejecución del Ciclo Asíncrono

```text
               Usuario presiona "Guardar clase"
                              ↓
                [ Se dispara el onSubmit ]
                              ↓
       [ Mutate envía la petición HTTP a la BD ]
                              ↓
              Estado de Espera (isPending = true)
             (El botón muestra un spinner de carga)
                              ↓
             ┌────────────────┴────────────────┐
             ▼                                 ▼
   Servidor responde ÉXITO           Servidor responde ERROR
             │                                 │
     Ejecuta onSuccess()               Ejecuta onError()
             │                                 │
     Llamada a onClose()              Muestra alerta / error Zod
             │                                 │
   [ El Modal se Cierra ]            [ El Modal se Queda ABIERTO ]
             │                                 │
  Estado limpio en el padre             Datos del usuario a salvo
```

# Ventajas del Patrón

- **Integridad de Datos:** El usuario nunca pierde la información redactada por culpa de un fallo de red o validación del servidor.
- **UI Sincronizada con el Servidor:** La interfaz jamás miente; solo se cierra cuando la persistencia en la base de datos está totalmente garantizada.
- **Separación de Responsabilidades:** Las cancelaciones de UI usan mecanismos nativos (`slot="close"`), mientras que las aprobaciones de negocio quedan en manos de las respuestas HTTP de la mutación.

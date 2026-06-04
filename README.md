# Sistema Web de Gestión de Membresías y Operaciones para el Gimnasio Animal Gym - Frontend

## Descripción

Aplicación web desarrollada en React para la administración de un gimnasio. Permite gestionar empleados, socios, membresías, rutnas, clases y controlar el acceso mediante autenticación basada en roles.

## Tecnologías Utilizadas

- React
- TypeScript
- HeroUI
- React Router DOM
- Axios
- React Hook Form
- Vite
- GitHub Actions

## Características

- Inicio de sesión
- Gestión de empleados
- Gestión de socios
- Gestión de membresías
- Gestión de rutinas
- Gestión de clases
- Gestión de ejercicios
- Gestión de boletas
- Protección de rutas
- Dashboard administrativo
- Consumo de API REST

## Estructura del Proyecto

```
animal-gym-app
├─ .editorconfig
├─ .prettierrc.json
├─ eslint.config.js
├─ index.html
├─ package.json
├─ pnpm-lock.yaml
├─ public
│  ├─ favicon.svg
│  └─ icons.svg
├─ README.md
├─ src
│  ├─ App.tsx
│  ├─ assets
│  │  └─ global
│  │     ├─ login.mp4
│  │     ├─ logo.png
│  │     └─ preview.png
│  ├─ components
│  │  └─ CustomSelect.tsx
│  ├─ config
│  │  └─ index.ts
│  ├─ features
│  │  ├─ auth
│  │  │  ├─ hooks
│  │  │  │  └─ useLogin.ts
│  │  │  ├─ pages
│  │  │  │  └─ LoginPage.tsx
│  │  │  └─ services
│  │  │     └─ authService.ts
│  │  ├─ bill
│  │  │  ├─ BillType.ts
│  │  │  ├─ components
│  │  │  │  ├─ BillDetailModal.tsx
│  │  │  │  └─ DeleteModal.tsx
│  │  │  └─ page
│  │  │     └─ BillPage.tsx
│  │  ├─ employee
│  │  │  ├─ components
│  │  │  │  ├─ EmployeeCard.tsx
│  │  │  │  ├─ EmployeeDetailModal.tsx
│  │  │  │  ├─ EmployeeFormModal.tsx
│  │  │  │  └─ EmployeePasswordModal.tsx
│  │  │  ├─ EmployeeType.ts
│  │  │  └─ page
│  │  │     └─ EmployeePage.tsx
│  │  ├─ exercise
│  │  │  ├─ components
│  │  │  ├─ ExerciseType.ts
│  │  │  └─ page
│  │  │     └─ ExercisePage.tsx
│  │  └─ membership
│  │     ├─ components
│  │     │  ├─ MembershipCard.tsx
│  │     │  └─ MembershipFilters.tsx
│  │     └─ MembershipType.ts
│  ├─ index.css
│  ├─ layout
│  │  ├─ DashboardLayout.tsx
│  │  └─ style.css
│  ├─ lib
│  │  ├─ axios.ts
│  │  └─ queryClient.ts
│  ├─ main.tsx
│  ├─ router
│  │  ├─ authGuard.ts
│  │  └─ index.tsx
│  ├─ shared
│  │  ├─ components
│  │  │  └─ HasRole.tsx
│  │  ├─ enums
│  │  │  └─ Role.ts
│  │  └─ types
│  │     ├─ apiResponse.d.ts
│  │     ├─ auth.d.ts
│  │     └─ index.ts
│  └─ store
│     └─ authStore.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```

## Instalación

### Clonar el repositorio

```bash
git clone https://github.com/utp-proyectos/animal-gym-app.git
```

### Instalar dependencias

```bash
pnpm install
```

### Ejecutar en desarrollo

```bash
pnpm dev
```

## Gestión del Proyecto

Durante el desarrollo se utilizaron las siguientes herramientas y metodologías:

- GitHub Issues para la planificación de tareas.
- GitHub Projects para el seguimiento mediante tablero Kanban.
- Pull Requests para la revisión e integración de cambios.
- GitHub Actions para automatización de procesos.
- Releases y Tags para el control de versiones.
- Discord para la comunicación y coordinación del equipo.

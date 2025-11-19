# TechFlow - Task Management System

Sistema de gestión de tareas y proyectos desarrollado para la Hackathon #2 de CS2031. Esta aplicación permite a los equipos crear proyectos, asignar tareas, hacer seguimiento del progreso y colaborar en tiempo real.

## Descripción del Proyecto

TechFlow es una aplicación web frontend que consume la API REST de gestión de tareas y proyectos. Permite a los usuarios autenticarse, gestionar proyectos, crear y asignar tareas, visualizar estadísticas en un dashboard y colaborar con miembros del equipo.

## Tecnologías Utilizadas

- **React 18+** - Biblioteca de JavaScript para construir interfaces de usuario
- **TypeScript** - Superset de JavaScript que añade tipado estático
- **Vite** - Herramienta de construcción y desarrollo rápida
- **React Router** - Enrutamiento para aplicaciones React
- **Tailwind CSS** - Framework de CSS utility-first
- **Axios** - Cliente HTTP para realizar peticiones a la API

## Instalación

1. Clona el repositorio o navega al directorio del proyecto:
```bash
cd /home2/Proyectos/confe
```

2. Instala las dependencias:
```bash
npm install
```

## Ejecución Local

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).

## Build para Producción

Para crear una build optimizada para producción:

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/`.

## Features Implementadas

### ✅ Autenticación
- Registro de nuevos usuarios
- Inicio de sesión con JWT
- Gestión de tokens y sesiones
- Rutas protegidas
- Perfil de usuario
- Cerrar sesión

### ✅ Dashboard
- Vista general con estadísticas (total de tareas, completadas, pendientes, vencidas)
- Acciones rápidas (crear tarea, ver proyectos)
- Feed de actividades recientes

### ✅ Gestión de Proyectos
- Listar todos los proyectos con paginación
- Crear nuevo proyecto
- Editar proyecto existente
- Eliminar proyecto (con confirmación)
- Ver detalles de proyecto con tareas asociadas
- Búsqueda/filtrado de proyectos por nombre

### ✅ Gestión de Tareas
- Listar tareas con múltiples filtros:
  - Por estado (TODO, IN_PROGRESS, COMPLETED)
  - Por prioridad (LOW, MEDIUM, HIGH, URGENT)
  - Por proyecto
  - Por usuario asignado
- Crear tarea con validación de formulario
- Actualizar tarea (estado, prioridad, descripción, fecha límite)
- Eliminar tarea (con confirmación)
- Asignar tarea a miembros del equipo
- Marcar tarea como completada
- Ver detalles completos de tarea

### ✅ Colaboración en Equipo
- Ver miembros del equipo
- Ver tareas asignadas a cada miembro
- Navegación entre tareas y proyectos

## Estructura del Proyecto

```
src/
├── components/
│   ├── common/          # Componentes reutilizables (Button, Input, Modal, Card, Layout)
│   ├── auth/            # Componentes de autenticación (LoginForm, RegisterForm)
│   ├── projects/        # Componentes de proyectos (ProjectCard, ProjectForm)
│   └── tasks/           # Componentes de tareas (TaskCard, TaskForm)
├── pages/               # Páginas principales (Dashboard, Projects, Tasks, Team, etc.)
├── services/            # Servicios API (authService, projectService, taskService, teamService)
├── context/             # Context API (AuthContext)
├── types/               # Definiciones de tipos TypeScript
└── utils/               # Utilidades y constantes
```

## API Base URL

La aplicación consume la API en:
```
https://cs2031-2025-2-hackathon-2-backend-production.up.railway.app/v1
```

Todas las peticiones autenticadas requieren el header:
```
Authorization: Bearer <jwt_token>
```

## Credenciales de Prueba

Puedes crear una cuenta nueva usando el formulario de registro en la aplicación. No se proporcionan credenciales de prueba pre-configuradas.

## Deploy

El proyecto puede ser desplegado en cualquier plataforma que soporte aplicaciones React/Vite como:
- Vercel
- Netlify
- Railway
- Render

Para desplegar en Vercel:
```bash
npm install -g vercel
vercel
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Crea una build de producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## Desarrollo

El proyecto utiliza:
- **React Context API** para el manejo del estado de autenticación
- **Axios interceptors** para agregar tokens JWT automáticamente
- **React Router** para navegación y rutas protegidas
- **Tailwind CSS** para estilos responsive
- **TypeScript** para type safety

## Notas

- La aplicación redirige automáticamente a `/login` si el usuario no está autenticado
- Los tokens JWT se almacenan en `localStorage`
- La aplicación maneja errores de autenticación (401) redirigiendo al login
- Todos los formularios incluyen validación básica

---

## Hackathon Requirements (Original README)

A continuación se incluye el README original con los requisitos completos de la hackathon:

---

# Hackathon #2: TechFlow Task Management - Desafío Frontend

## Descripción General

¡Bienvenidos a la Hackathon #2 de Desarrollo Basado en Plataformas! 🎉

**TechFlow** es una startup de gestión de proyectos que necesita un dashboard web para su plataforma de administración de tareas. Los equipos pueden crear proyectos, asignar tareas, hacer seguimiento del progreso y colaborar en tiempo real. Tu trabajo es construir la **aplicación web frontend** que consume su API existente.

Esta solución impacta directamente a equipos de productividad en todo el mundo al proporcionar una interfaz intuitiva para la coordinación de tareas, seguimiento de plazos y colaboración en equipo.

## Objetivo

Construir una aplicación web interactiva y funcional usando **React + TypeScript + Tailwind CSS** que permita a los usuarios:

- Registrarse, iniciar sesión y gestionar su perfil
- Visualizar un dashboard con estadísticas de proyectos y tareas
- Crear, editar y eliminar proyectos
- Gestionar tareas con filtros avanzados (estado, prioridad, proyecto, usuario asignado)
- Asignar tareas a miembros del equipo
- Ver detalles completos de proyectos y tareas
- Colaborar con el equipo visualizando actividades y asignaciones

## Autenticación y Seguridad

Todas las llamadas a la API requieren un token JWT válido en el header `Authorization: Bearer <token>` para garantizar la seguridad y privacidad de los datos.

## Requisitos Técnicos

### Stack Obligatorio

- React 18+ con TypeScript
- React Router para navegación
- Tailwind CSS para estilos
- Axios o Fetch API para peticiones HTTP

### Funcionalidades Clave a Implementar

#### 1. Autenticación (Requerido) 🔐

- Pantallas de Login y Registro
- Gestión de token JWT
- Rutas protegidas (redirección a login si no está autenticado)
- Funcionalidad de logout
- Visualización de perfil de usuario

#### 2. Dashboard (Requerido) 📊

- Vista general con estadísticas (total de tareas, completadas, pendientes, vencidas)
- Acciones rápidas (crear tarea, ver proyectos)
- Feed de actividad reciente

#### 3. Gestión de Proyectos (Requerido) 📁

- Listar todos los proyectos con paginación
- Crear nuevo proyecto (modal o página separada)
- Ver detalles de proyecto con tareas asociadas
- Actualizar información del proyecto
- Eliminar proyecto (con confirmación)
- Buscar/filtrar proyectos por nombre o estado

#### 4. Gestión de Tareas (Requerido) ✅

- Listar tareas con múltiples filtros:
  - Por estado (TODO, IN_PROGRESS, COMPLETED)
  - Por prioridad (LOW, MEDIUM, HIGH, URGENT)
  - Por proyecto
  - Por usuario asignado
- Crear tarea con validación de formulario
- Actualizar tarea (estado, prioridad, descripción, fecha límite)
- Eliminar tarea
- Asignar tarea a miembros del equipo
- Marcar tarea como completada
- Ver detalles de tarea (modal o página separada)

#### 5. Colaboración en Equipo (Requerido) 👥

- Ver miembros del equipo
- Ver tareas asignadas a cada miembro

## Documentación de la API

**URL Base:** `https://cs2031-2025-2-hackathon-2-backend-production.up.railway.app/v1`

Todos los endpoints autenticados requieren el header:

```
Authorization: Bearer <jwt_token>
```

### Endpoints de Autenticación

| Método | Endpoint | Descripción | Body de Petición | Respuesta |
|--------|----------|-------------|------------------|-----------|
| POST | `/auth/register` | Registrar nuevo usuario | `{ "email": "user@email.com", "password": "pass123", "name": "Juan Pérez" }` | `{ "message": "Usuario creado exitosamente" }` |
| POST | `/auth/login` | Iniciar sesión | `{ "email": "user@email.com", "password": "pass123" }` | `{ "token": "jwt_token", "user": { "id": "uuid", "email": "...", "name": "..." } }` |
| GET | `/auth/profile` | Obtener usuario actual | - | `{ "id": "uuid", "email": "...", "name": "...", "createdAt": "..." }` |

### Endpoints de Proyectos 🔐

| Método | Endpoint | Descripción | Body de Petición | Respuesta |
|--------|----------|-------------|------------------|-----------|
| GET | `/projects?page=1&limit=10&search=` | Listar proyectos (paginado) | - | `{ "projects": [...], "totalPages": 5, "currentPage": 1 }` |
| POST | `/projects` | Crear proyecto | `{ "name": "Proyecto Alpha", "description": "...", "status": "ACTIVE" }` | `{ "id": "uuid", "name": "...", ... }` |
| GET | `/projects/:id` | Obtener detalles de proyecto | - | `{ "id": "uuid", "name": "...", "tasks": [...] }` |
| PUT | `/projects/:id` | Actualizar proyecto | `{ "name": "Nombre Actualizado", "status": "COMPLETED" }` | `{ "id": "uuid", ... }` |
| DELETE | `/projects/:id` | Eliminar proyecto | - | `{ "message": "Proyecto eliminado" }` |

**Estados de Proyecto:** `ACTIVE`, `COMPLETED`, `ON_HOLD`

### Endpoints de Tareas 🔐

| Método | Endpoint | Descripción | Query Params | Body de Petición | Respuesta |
|--------|----------|-------------|--------------|------------------|-----------|
| GET | `/tasks` | Listar todas las tareas | `?projectId=uuid&status=TODO&priority=HIGH&page=1&limit=20` | - | `{ "tasks": [...], "totalPages": 3 }` |
| POST | `/tasks` | Crear tarea | - | `{ "title": "Implementar login", "description": "...", "projectId": "uuid", "priority": "HIGH", "dueDate": "2025-12-01", "assignedTo": "userId" }` | `{ "id": "uuid", ... }` |
| GET | `/tasks/:id` | Obtener detalles de tarea | - | - | `{ "id": "uuid", "title": "...", "status": "IN_PROGRESS", ... }` |
| PUT | `/tasks/:id` | Actualizar tarea | - | `{ "status": "COMPLETED", "priority": "MEDIUM" }` | `{ "id": "uuid", ... }` |
| DELETE | `/tasks/:id` | Eliminar tarea | - | `{ "message": "Tarea eliminada" }` |
| PATCH | `/tasks/:id/status` | Actualizar solo el estado de la tarea | - | `{ "status": "COMPLETED" }` | `{ "id": "uuid", "status": "COMPLETED" }` |

**Estados de Tarea:** `TODO`, `IN_PROGRESS`, `COMPLETED`
**Prioridades:** `LOW`, `MEDIUM`, `HIGH`, `URGENT`

### Endpoints de Equipo 🔐 (Bonus)

| Método | Endpoint | Descripción | Respuesta |
|--------|----------|-------------|-----------|
| GET | `/team/members` | Listar miembros del equipo | `{ "members": [{ "id": "uuid", "name": "...", "email": "..." }] }` |
| GET | `/team/members/:id/tasks` | Obtener tareas de un miembro | `{ "tasks": [...] }` |

### Códigos de Estado HTTP

- `200 OK` - GET/PUT/PATCH exitoso
- `201 Created` - POST exitoso
- `204 No Content` - DELETE exitoso
- `400 Bad Request` - Body de petición inválido
- `401 Unauthorized` - Token faltante o inválido
- `403 Forbidden` - Permisos insuficientes
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

## Restricciones y Consideraciones Importantes

⚠️ **Importante:**

- Este proyecto es exclusivamente para plataforma web
- Deberán usar **React** con **TypeScript** obligatoriamente
- **Tailwind CSS** es requerido para los estilos
- Se permite el uso de librerías de componentes completas (Material-UI, Ant Design, etc.) - deben construir sus propios componentes
- La API está preconfigurada y lista para usar como "caja negra"
- El tiempo máximo es de **2 horas**
- Trabajarán en equipos de **4-5 estudiantes**


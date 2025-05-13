# Chatbot con CrewAI

<div align="center">
  <img src="./public/Logo-completo.png" alt="Logo del Chatbot" width="400"/>
</div>

## Descripción

Este proyecto implementa una interfaz de usuario para un chatbot que utiliza CrewAI para orquestar diferentes agentes inteligentes. La aplicación permite interactuar con múltiples agentes especializados que trabajan en conjunto para responder consultas y ejecutar tareas complejas.

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn
- Backend de agentes corriendo en el puerto 8000

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/chatbot-crewAI.git
cd chatbot-crewAI
```

### 2. Instalar dependencias

Con npm:
```bash
npm install
```

O con yarn:
```bash
yarn install
```

## Ejecución

### 1. Asegúrate de que el backend de agentes esté activo

Antes de iniciar la interfaz, verifica que el backend de agentes esté corriendo en `http://localhost:8000`. 
**¡IMPORTANTE!** La aplicación no funcionará correctamente si el backend no está disponible en ese puerto.

### 2. Iniciar el servidor de desarrollo

Con npm:
```bash
npm run dev
```

O con yarn:
```bash
yarn dev
```

La aplicación estará disponible en `http://localhost:8080`

## Construir para producción

Con npm:
```bash
npm run build
```

O con yarn:
```bash
yarn build
```

## Tecnologías Utilizadas

- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Router
- React Query
- Supabase

## Licencia

[MIT](LICENSE)

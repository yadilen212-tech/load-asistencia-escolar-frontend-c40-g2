# Educación Pública — Asistencia — Frontend

> Registro de asistencia escolar diaria y resúmenes para apoderados.

Template oficial de Yura para el dominio **Educación Pública — Asistencia**. SPA en **React + Vite**,
lista para extender con **shadcn/ui** (`components.json` + `src/lib/utils.ts`
ya configurados). Pensado como punto de partida curado para estudiantes en
cursos universitarios LATAM, no como demo desechable.

**Problema que resuelve:** Las escuelas públicas controlan la inasistencia con cuadernos físicos; este sistema la digitaliza y avisa a los apoderados.

## Setup

Requisitos: Node 20+, pnpm 9+.

```bash
pnpm install
cp .env.example .env   # ajusta VITE_API_URL si el backend no corre en :3000
pnpm dev               # http://localhost:5173
```

Scripts disponibles:

- `pnpm dev` — servidor de desarrollo con HMR.
- `pnpm build` — type-check + build de producción a `dist/`.
- `pnpm lint` — Biome (lint + format check).
- `pnpm test` — Vitest.

Para agregar componentes shadcn/ui:

```bash
pnpm dlx shadcn@latest add button card input
```

## Architecture

```
src/
├── main.tsx          # bootstrap React
├── App.tsx           # routing mínimo (login -> lista)
├── lib/
│   ├── api.ts        # fetch client con JWT desde localStorage
│   └── utils.ts      # helper cn() de shadcn/ui
└── pages/
    ├── LoginPage.tsx # autenticación email + password
    └── ListPage.tsx  # caso de uso end-to-end del dominio
```

- **Estado de sesión:** el JWT se guarda en `localStorage` (`access_token`) y
  el cliente `api.ts` lo adjunta como `Authorization: Bearer`.
- **Estilos:** base mínima en `index.css`; el sistema de diseño se construye
  con shadcn/ui sobre Tailwind cuando el equipo lo necesite.
- **Backend:** consume el template `educacion-asistencia-backend` (NestJS + Prisma).

## Onboarding

Si es tu primer día en este proyecto:

1. Lee este README completo y arranca el backend (`educacion-asistencia-backend`) en local.
2. Corre `pnpm install && pnpm dev` y entra con cualquier credenciales (el
   login es un stub: reemplázalo por una llamada real a `POST /auth/login`).
3. Explora `src/pages/ListPage.tsx`: ahí vive el caso de uso del dominio.
   Conéctalo a la API real reemplazando los datos demo por `api('/educacion-asistencia')`.
4. Toda contribución entra por Pull Request; Yura evalúa tus PRs
   automáticamente. No hagas push directo a `main`.

¿Dudas de producto? El catálogo de Yura describe el dominio **Educación Pública — Asistencia**.

# 📱 Smart Solution Fund - Progressive Web App

[![PWA Ready](https://img.shields.io/badge/PWA-Ready-success.svg)](https://www.pwabuilder.com/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg)](https://vitejs.dev/)

Progressive Web App (PWA) para Smart Solution Fund, desarrollada con React, TypeScript y Vite. Configurada para generar APK Android mediante PWA Builder.

## ✨ Características

- 📱 **PWA Standalone** - Se ejecuta sin barra de navegación
- ⚡ **Rendimiento Optimizado** - Service Worker con precache de 256 archivos
- 🔄 **Offline Support** - Funciona sin conexión para rutas visitadas
- 🌐 **API Integration** - Conectada a backend en `backend.smartsolution.fund`
- 🔒 **CORS Resuelto** - Proxy configurado para desarrollo y producción
- 🎨 **Tema Personalizable** - Dark/Light mode
- 🌍 **i18n** - Soporte multiidioma (ES/EN)
- 📊 **Dashboard Completo** - Inversiones, retiros, referidos, pagos

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 18+
- Yarn 1.22+

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/Herocku2/smartapp.git
cd smartapp

# Instalar dependencias
yarn install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
yarn dev
```

La app estará disponible en `http://localhost:5174`

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
yarn dev              # Inicia servidor de desarrollo en puerto 5174

# Build
yarn build            # Genera build de producción en /dist
yarn build:pwa        # Build optimizado para PWA Builder

# Preview
yarn preview          # Preview del build de producción

# Calidad de código
yarn lint             # Ejecuta ESLint
yarn format           # Formatea código con Prettier
```

## 📦 Build para APK

### 1. Generar build de producción

```bash
yarn build
```

Esto generará la carpeta `dist/` con:
- ✅ Service Worker (`sw.js`)
- ✅ Manifest PWA (`manifest.webmanifest`) con `display: "standalone"`
- ✅ Assets optimizados (256 archivos, ~23 MB)
- ✅ Workbox runtime

### 2. Subir a hosting

**Opción A: Netlify (Recomendado)**
```bash
netlify deploy --prod --dir=dist
```

**Opción B: Vercel**
```bash
vercel --prod dist/
```

**Opción C: GitHub Pages**
- Subir contenido de `dist/` al repositorio
- Habilitar GitHub Pages en Settings

### 3. Generar APK con PWA Builder

1. Ir a [PWA Builder](https://www.pwabuilder.com/)
2. Ingresar URL del hosting
3. Click en "Start"
4. Ir a pestaña "Package" → "Android"
5. Configurar:
   - Package ID: `com.smartsolution.fund`
   - App name: Smart Solution Fund
   - Version: 1.0.0
6. Click en "Generate Package"
7. Descargar APK

Ver [INSTRUCCIONES_PWA_BUILDER.md](./INSTRUCCIONES_PWA_BUILDER.md) para guía detallada.

## 🔧 Configuración

### Variables de Entorno

**Desarrollo (`.env`)**
```env
VITE_API_BASE_URL=/api
VITE_AUTH_TOKEN_ENDPOINT=/auth/token/
VITE_REGISTER_REF_BASE=/auth/register/
VITE_BACKEND_DOMAIN="/api/"
```

**Producción (`.env.production`)**
```env
VITE_API_BASE_URL=https://backend.smartsolution.fund/api
VITE_AUTH_TOKEN_ENDPOINT=/auth/token/
VITE_REGISTER_REF_BASE=/auth/register/
VITE_BACKEND_DOMAIN="https://backend.smartsolution.fund/api/"
```

### PWA Manifest

```json
{
  "name": "Smart Solution Fund",
  "short_name": "SmartApp",
  "display": "standalone",
  "theme_color": "#0d9488",
  "background_color": "#ffffff",
  "orientation": "portrait"
}
```

### Service Worker

- **Estrategia**: NetworkFirst para `/api/*`
- **Precache**: 256 archivos (todos los assets)
- **Auto-update**: Activado
- **Tamaño máximo**: 5 MB por archivo

## 🌐 Backend Integration

La app se conecta al backend en:
```
https://backend.smartsolution.fund/api/
```

### CORS

**Desarrollo**: Proxy de Vite redirige `/api/*` → `https://backend.smartsolution.fund/api/*`

**Producción**: Proxy de Netlify/Vercel configurado en:
- `public/_redirects`
- `public/netlify.toml`

Ver [SOLUCIONES_CORS.md](./SOLUCIONES_CORS.md) para más detalles.

## 📱 Funcionalidades Principales

### Autenticación
- Login con email/password
- Registro con código de referido
- Recuperación de contraseña
- Refresh token automático

### Dashboard
- Balance disponible
- Inversiones activas
- Historial de transacciones
- Estadísticas de rendimiento

### Inversiones
- Ver productos disponibles
- Crear nueva inversión
- Historial de inversiones
- Detalles y ROI

### Retiros
- Solicitar retiro
- Historial de retiros
- Estados: Pendiente, Aprobado, Rechazado
- Métodos: Crypto, Fiat

### Referidos
- Link de referencia personalizado
- Lista de referidos
- Comisiones ganadas
- Niveles de referidos

### Admin (rol admin)
- Aprobar/Rechazar retiros
- Ver todas las inversiones
- Gestión de usuarios
- Estadísticas globales

## 🎨 Tecnologías

### Core
- **React 18.3** - Framework UI
- **TypeScript 5.5** - Tipado estático
- **Vite 5.4** - Build tool

### State Management
- **Redux Toolkit** - Estado global
- **RTK Query** - Data fetching y cache

### UI/UX
- **Bootstrap 5** - Framework CSS
- **React Bootstrap** - Componentes React
- **SASS/SCSS** - Estilos
- **Lucide Icons** - Iconografía

### Forms & Validation
- **React Hook Form** - Gestión de formularios
- **Yup** - Validación de schemas

### Charts & Data
- **ApexCharts** - Gráficos
- **React Table** - Tablas avanzadas

### PWA
- **vite-plugin-pwa** - PWA automática
- **Workbox** - Service Worker

### Utils
- **Axios** - HTTP client
- **date-fns** - Manipulación de fechas
- **i18next** - Internacionalización
- **react-hot-toast** - Notificaciones

## 📂 Estructura del Proyecto

```
smartapp/
├── public/              # Assets estáticos
│   ├── _redirects      # Netlify redirects (CORS)
│   ├── netlify.toml    # Config Netlify
│   └── *.png           # Iconos y logos
├── src/
│   ├── Layouts/        # Layouts (Horizontal, Vertical, Public)
│   ├── components/     # Componentes reutilizables
│   │   ├── Apps/       # Apps integradas (Chat, Email, etc)
│   │   ├── Dashboards/ # Componentes de dashboard
│   │   └── Pages/      # Componentes de páginas
│   ├── hooks/          # Custom hooks
│   ├── locales/        # Traducciones i18n
│   ├── routes/         # Configuración de rutas
│   ├── store/          # Redux store
│   │   └── api/        # RTK Query APIs
│   ├── types/          # TypeScript types
│   ├── views/          # Vistas/Páginas
│   │   ├── auth/       # Autenticación
│   │   ├── dashboards/ # Dashboards
│   │   └── pages/      # Otras páginas
│   ├── App.tsx         # Componente raíz
│   └── main.tsx        # Punto de entrada
├── dist/               # Build de producción (generado)
├── .env                # Variables desarrollo
├── .env.production     # Variables producción
├── vite.config.ts      # Config Vite + PWA
├── tsconfig.json       # Config TypeScript
└── package.json        # Dependencias y scripts
```

## 🔐 Seguridad

- ✅ Tokens JWT para autenticación
- ✅ Refresh token automático
- ✅ HTTPS en producción
- ✅ Validación de formularios
- ✅ Sanitización de inputs
- ✅ Headers de seguridad configurados

## 📚 Documentación Adicional

- [INSTRUCCIONES_PWA_BUILDER.md](./INSTRUCCIONES_PWA_BUILDER.md) - Guía completa para generar APK
- [ERRORES_CORREGIDOS.md](./ERRORES_CORREGIDOS.md) - Historial de errores y soluciones
- [SOLUCIONES_CORS.md](./SOLUCIONES_CORS.md) - Documentación de configuración CORS
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Guía de despliegue

## 🐛 Solución de Problemas

### Error CORS en desarrollo
```bash
# Asegúrate de que el proxy esté configurado en vite.config.ts
# y que uses rutas relativas /api/* en .env
```

### Service Worker no se registra
```bash
# Verifica que vite-plugin-pwa esté instalado
yarn add -D vite-plugin-pwa

# Asegúrate de que devOptions.enabled esté en true
```

### Build falla por tamaño de archivo
```bash
# Ya está configurado maximumFileSizeToCacheInBytes: 5MB
# Si necesitas más, edita vite.config.ts
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: Amazing Feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Changelog

### [1.0.0] - 2025-11-01

#### ✨ Added
- PWA configurada con display standalone
- Service Worker con Workbox
- Precache de 256 archivos
- Campo de referral con link completo
- Proxy CORS para desarrollo y producción
- Documentación completa para PWA Builder

#### 🔧 Fixed
- Error de Service Worker duplicado
- 404 en /registerSW.js
- Manifest icon warnings
- CORS en peticiones API

#### ⚡ Improved
- Build optimizado para producción
- Auto-update de Service Worker
- Offline support mejorado

## 📄 Licencia

Privado - Smart Solution Fund © 2024-2025

## 👥 Autores

- **Nicolas** - Desarrollo Frontend

## 🔗 Links

- **Backend API**: https://backend.smartsolution.fund/api/
- **PWA Builder**: https://www.pwabuilder.com/
- **Repositorio**: https://github.com/Herocku2/smartapp

---

**Última actualización**: 2025-11-01
**Versión**: 1.0.0
**Estado**: ✅ Listo para PWA Builder

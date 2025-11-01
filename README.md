# Smart Solution - Progressive Web App (PWA)

Plataforma innovadora de gestión de fondos mutuos que brinda transparencia, seguridad y control total a los inversores.

## 🚀 Características

- ✅ **Progressive Web App (PWA)** - Instalable como app nativa
- ✅ **Modo Standalone** - Sin barra de navegación del navegador
- ✅ **Service Worker** - Funcionamiento offline y cache inteligente
- ✅ **React + TypeScript** - Desarrollo moderno y tipado
- ✅ **Vite** - Build ultra rápido
- ✅ **Multi-idioma** - Inglés y Español
- ✅ **Sistema de Referidos** - Registro con código de referencia

## 📦 Instalación

```bash
# Clonar el repositorio
git clone [URL]

# Navegar al directorio
cd "smart solution app/frontend"

# Instalar dependencias
yarn install
```

## 🔧 Configuración

### Variables de Entorno

Crea o edita el archivo `.env`:

```env
VITE_BACKEND_DOMAIN="https://backend.smartsolution.fund/api/"
```

### Backend (IMPORTANTE)

El backend debe tener CORS habilitado. Ver [BACKEND_CORS_CONFIG.md](./BACKEND_CORS_CONFIG.md) para instrucciones detalladas.

## 🎯 Desarrollo

```bash
# Iniciar servidor de desarrollo
yarn dev

# La app estará disponible en:
# http://localhost:5173
```

## 🏗️ Build para Producción

```bash
# Crear build optimizado
yarn build

# Preview del build
yarn preview
```

Los archivos se generarán en la carpeta `dist/`

## 📱 Generar APK con PWABuilder

### Requisitos Previos

1. La app debe estar desplegada en HTTPS
2. El manifest.json debe ser accesible
3. El service worker debe estar registrado

### Pasos

1. **Desplegar** la carpeta `dist/` en un servidor HTTPS (Netlify, Vercel, etc.)

2. **Visitar** https://www.pwabuilder.com/

3. **Ingresar** la URL de tu app desplegada

4. **Generar** el paquete Android:
   - Package ID: `com.smartsolution.app`
   - App name: `Smart Solution`
   - Display: `standalone`
   - Orientation: `portrait`

5. **Descargar** y probar el APK

Ver [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) para instrucciones detalladas.

## 🔐 Sistema de Registro

### Con Código en URL

```
https://app.smartsolution.fund/auth/register/ABC123
```

El campo de código se pre-llena con `ABC123`

### Sin Código en URL

```
https://app.smartsolution.fund/auth/register
```

El usuario debe ingresar manualmente un código de referencia

### API Endpoint

Cuando el usuario se registra, se envía a:

```
POST https://backend.smartsolution.fund/api/auth/register/{ref_code}/
```

Body:
```json
{
  "username": "usuario123",
  "email": "usuario@ejemplo.com",
  "phone_number": "+573001234567",
  "password": "contraseña",
  "password2": "contraseña",
  "hcaptcha": "captcha-token"
}
```

## 🌐 Rutas Principales

### Autenticación
- `/auth/login` - Iniciar sesión
- `/auth/register` - Registro sin código
- `/auth/register/:ref_code` - Registro con código
- `/auth/forgot-password` - Recuperar contraseña
- `/auth/verify-email/:code` - Verificar email

### Dashboard
- `/dashboard` - Panel principal
- `/investment-history` - Historial de inversiones
- `/my-payments` - Mis pagos
- `/my-withdrawals` - Mis retiros
- `/my-referrals` - Mis referidos
- `/unilevel-tree` - Árbol de referidos

## 🛠️ Tecnologías

- **React 18** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **Vite PWA Plugin** - Generación de PWA
- **Workbox** - Service Worker
- **React Router** - Navegación
- **Redux Toolkit** - Estado global
- **RTK Query** - Manejo de API
- **React Bootstrap** - Componentes UI
- **React Hook Form** - Formularios
- **Yup** - Validaciones
- **i18next** - Internacionalización

## 📁 Estructura del Proyecto

```
frontend/
├── public/
│   └── favicon.png
├── src/
│   ├── Layouts/          # Layouts de la app
│   ├── components/       # Componentes reutilizables
│   ├── views/           # Vistas/páginas
│   ├── routes/          # Configuración de rutas
│   ├── store/           # Redux store y API slices
│   ├── locales/         # Traducciones
│   ├── types/           # Tipos TypeScript
│   ├── utils/           # Utilidades
│   └── App.tsx          # Componente principal
├── .env                 # Variables de entorno
├── vite.config.ts       # Configuración Vite + PWA
├── package.json
└── README.md
```

## 🎨 Personalización

### Colores y Tema

Edita `src/assets/scss/theme/` para cambiar colores y estilos.

### Iconos

Reemplaza `/public/favicon.png` con tu icono (mínimo 512x512px PNG)

### Manifest

Edita `vite.config.ts` para cambiar nombre, descripción, colores del tema, etc.

## 📝 Scripts Disponibles

```bash
# Desarrollo
yarn dev              # Servidor de desarrollo

# Build
yarn build            # Build de producción
yarn preview          # Preview del build

# Calidad de código
yarn lint             # Linter
yarn format           # Formatear código
```

## 🐛 Debugging

### Service Worker

Abre Chrome DevTools (F12) > Application > Service Workers

### Manifest

Abre Chrome DevTools (F12) > Application > Manifest

### Network

Abre Chrome DevTools (F12) > Network para ver peticiones a la API

## 🔒 Seguridad

- ✅ HTTPS requerido en producción
- ✅ Tokens JWT para autenticación
- ✅ HCaptcha para registro
- ✅ Validación de formularios
- ✅ Sanitización de inputs

## 📖 Documentación Adicional

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Guía completa de despliegue
- [BACKEND_CORS_CONFIG.md](./BACKEND_CORS_CONFIG.md) - Configuración CORS del backend

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

ISC

## 👥 Autores

WRAPCODERS

---

**¡Listo para desplegar! 🚀**

# 🚀 Deploy Manual en Netlify - Guía Rápida

## ✅ Cambios ya realizados

1. ✅ CORS corregido en `.env.production`
2. ✅ Build generado con `yarn build`
3. ✅ Carpeta `dist/` lista
4. ✅ Cambios commiteados y pusheados a GitHub

---

## 📦 Opción 1: Drag & Drop (MÁS FÁCIL)

### Paso 1: Ir a Netlify Dashboard

Abre en tu navegador:
```
https://app.netlify.com/
```

### Paso 2: Buscar tu sitio

- Busca el sitio llamado **"smartappv1"** (o similar)
- Click en el nombre del sitio

### Paso 3: Deploy manualmente

1. En la página del sitio, buscar el área que dice **"Deploys"**
2. Scroll down hasta ver **"Need to update your site? Drag and drop your site output folder here"**
3. Arrastra la carpeta **`dist/`** completa desde Finder
4. Espera a que termine el upload y deploy (1-2 minutos)

### Ruta de la carpeta dist:
```
/Users/nicolas/Documentos locales/smart solution app/frontend/dist/
```

---

## 🔗 Opción 2: Conectar a GitHub (Automático)

### Paso 1: Ir a Site Settings

1. En Netlify Dashboard, ir a tu sitio "smartappv1"
2. Click en **"Site settings"**
3. Click en **"Build & deploy"** (menú lateral)

### Paso 2: Link Repository

1. Scroll hasta **"Continuous deployment"**
2. Click en **"Link repository"**
3. Seleccionar **GitHub**
4. Autorizar Netlify (si es necesario)
5. Buscar y seleccionar: **Herocku2/smartapp**
6. Branch: **main**

### Paso 3: Configurar Build

```
Base directory: (dejar vacío)
Build command: yarn build
Publish directory: dist
```

### Paso 4: Variables de entorno (IMPORTANTE)

1. En Site Settings > Build & deploy > Environment
2. Click "Edit variables"
3. Agregar:

```
VITE_API_BASE_URL=/api
VITE_AUTH_TOKEN_ENDPOINT=/auth/token/
VITE_REGISTER_REF_BASE=/auth/register/
VITE_BACKEND_DOMAIN=/api/
```

4. Click "Save"

### Paso 5: Deploy

1. Click en **"Deploy site"**
2. Espera a que termine el build (2-3 minutos)
3. ✅ Cada push a `main` hará deploy automático

---

## 🖥️ Opción 3: Netlify CLI (Terminal)

### Requisito: Vincular el sitio primero

```bash
cd /Users/nicolas/Documentos\ locales/smart\ solution\ app/frontend

# Listar tus sitios
netlify sites:list

# Copiar el Site ID de "smartappv1"
# Luego vincular:
netlify link --id=TU_SITE_ID
```

### Una vez vinculado, deployar:

```bash
# Deploy a producción
netlify deploy --prod --dir=dist

# O sin confirmación:
netlify deploy --prod --dir=dist --yes
```

---

## ✅ Verificar Deploy

### Paso 1: Obtener URL del sitio

Después del deploy, Netlify te dará una URL, ejemplo:
```
https://smartappv1.netlify.app
```

### Paso 2: Abrir en navegador

```
https://smartappv1.netlify.app/auth/login
```

### Paso 3: Verificar CORS (DevTools)

1. Abrir DevTools (F12)
2. Ir a **Console**
3. Hacer login
4. ✅ **NO** debe aparecer errores de CORS
5. ✅ Las peticiones a `/api/*` deben funcionar

### Paso 4: Verificar PWA

1. DevTools > Application > Manifest
   - ✅ `display: "standalone"`
2. Application > Service Workers
   - ✅ Service Worker registrado

---

## 🎯 Resumen Ejecutivo

### Lo que se corrigió:
```diff
- VITE_API_BASE_URL=https://backend.smartsolution.fund/api
+ VITE_API_BASE_URL=/api
```

### Por qué funciona ahora:
```
Usuario → /api/auth/token/
    ↓
Netlify Proxy → https://backend.smartsolution.fund/api/auth/token/
    ↓
✅ Sin CORS (mismo origen)
```

### Archivos clave en dist/:
- ✅ `_redirects` - Proxy de Netlify
- ✅ `netlify.toml` - Configuración avanzada
- ✅ `manifest.webmanifest` - PWA con standalone
- ✅ `sw.js` - Service Worker

---

## 📱 Después del Deploy

### Para generar APK:

1. Ir a: https://www.pwabuilder.com/
2. Ingresar URL: `https://smartappv1.netlify.app`
3. Click "Start"
4. Package > Android > Generate
5. Descargar APK
6. ✅ La app se abrirá sin barra de navegación (standalone)

---

## 🆘 Si necesitas ayuda

### Ver logs de deploy:
```bash
netlify deploy --prod --dir=dist --debug
```

### Ver status del sitio:
```bash
netlify status
```

### Ver URLs:
```bash
netlify open:site
```

---

**Última actualización:** 2025-11-01 17:00
**Estado:** ✅ Build listo, esperando deploy manual
**Carpeta:** `/Users/nicolas/Documentos locales/smart solution app/frontend/dist/`

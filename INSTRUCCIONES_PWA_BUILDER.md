# 📱 Instrucciones para generar APK con PWA Builder

## ✅ Estado del Build

**Build completado exitosamente** ✨

- ✅ Service Worker generado: `sw.js` (14 KB)
- ✅ Manifest configurado con `display: "standalone"` (sin barra de navegación)
- ✅ 256 archivos en precache (23.1 MB)
- ✅ Workbox configurado con NetworkFirst para API
- ✅ Iconos configurados (192x192 y 512x512)

## 📂 Carpeta dist/ lista para subir

La carpeta `dist/` contiene todo lo necesario:

```
dist/
├── sw.js                    ← Service Worker
├── workbox-1504e367.js      ← Workbox runtime
├── registerSW.js            ← Registro automático del SW
├── manifest.webmanifest     ← Manifest PWA con display:standalone
├── index.html               ← HTML principal
├── assets/                  ← JS, CSS, imágenes optimizadas
├── smartsolutionlogo.png    ← Logo de la app
└── ...otros archivos
```

## 🚀 Pasos para generar APK en PWA Builder

### 1. Subir la carpeta dist/ a un servidor web

**Opción A: Netlify (Recomendado - ya configurado)**
```bash
# Desde la terminal en /frontend
netlify deploy --prod --dir=dist
```

**Opción B: Vercel**
```bash
vercel --prod dist/
```

**Opción C: GitHub Pages**
- Sube el contenido de `dist/` a un repositorio
- Habilita GitHub Pages en Settings

### 2. Ir a PWA Builder

1. Visita: https://www.pwabuilder.com/
2. Ingresa la URL donde subiste la carpeta `dist/` (ejemplo: `https://tudominio.netlify.app`)
3. Haz click en **"Start"**

### 3. Generar APK

1. PWA Builder analizará tu app automáticamente
2. Verás un puntaje de PWA (debería ser alto ✅)
3. Ve a la pestaña **"Package"**
4. Selecciona **"Android"**
5. Configura los detalles:
   - **Package ID**: `com.smartsolution.fund` (ejemplo)
   - **App name**: Smart Solution Fund
   - **App version**: 1.0.0
   - **Min SDK**: 24 (Android 7.0+)
   - **Signing**: Puedes generar una nueva key o usar una existente
6. Haz click en **"Generate Package"**
7. Descarga el APK generado

### 4. Probar APK

**En emulador Android Studio:**
```bash
adb install SmartSolutionFund.apk
```

**En dispositivo físico:**
- Habilita "Instalar apps desconocidas" en ajustes
- Transfiere el APK y ábrelo para instalar

## 🔧 Configuración actual de la PWA

### Manifest (display standalone)
```json
{
  "name": "Smart Solution Fund",
  "short_name": "SmartApp",
  "display": "standalone",  ← Sin barra de navegación
  "theme_color": "#0d9488",
  "background_color": "#ffffff",
  "start_url": "/",
  "scope": "/",
  "orientation": "portrait"
}
```

### Service Worker
- **Estrategia**: NetworkFirst para `/api/*`
- **Precache**: 256 archivos (todos los assets)
- **Auto-update**: Activado
- **Tamaño máximo cache**: 5 MB por archivo

### Variables de entorno (Producción)
```env
VITE_API_BASE_URL=https://backend.smartsolution.fund/api
VITE_AUTH_TOKEN_ENDPOINT=/auth/token/
VITE_REGISTER_REF_BASE=/auth/register/
VITE_BACKEND_DOMAIN="https://backend.smartsolution.fund/api/"
```

## ✨ Características PWA implementadas

1. ✅ **Standalone mode** - No se ve la barra de navegación
2. ✅ **Offline support** - Service Worker con precache
3. ✅ **Fast loading** - Assets cacheados
4. ✅ **API caching** - NetworkFirst strategy
5. ✅ **Auto-update** - Detecta nuevas versiones
6. ✅ **Installable** - Manifest válido con iconos
7. ✅ **Portrait orientation** - Optimizado para móvil
8. ✅ **Theme color** - Teal (#0d9488)

## 🐛 Errores corregidos

### ❌ Antes
- Error: Service Worker duplicado (registro manual + automático)
- Error: 404 en /registerSW.js
- Conflicto entre Workbox manual y vite-plugin-pwa

### ✅ Después
- Service Worker único manejado por vite-plugin-pwa
- registerSW.js generado automáticamente
- Sin conflictos ni errores en consola

## 📝 Notas importantes

1. **CORS**: La app usa proxy en producción mediante Netlify/Vercel
2. **Backend**: Conectado a `https://backend.smartsolution.fund/api/`
3. **Referral links**: Acepta links completos como `https://backend.smartsolution.fund/api/auth/register/345346/`
4. **Standalone**: Al abrir la app desde el ícono, NO se verá la barra de dirección del navegador

## 🔍 Verificar PWA localmente

```bash
# Servir dist/ en local
cd frontend
npx serve dist -p 8080

# Abrir en Chrome
# - Ir a http://localhost:8080
# - Abrir DevTools > Application > Manifest
# - Verificar "display: standalone"
# - Application > Service Workers > Verificar que está registrado
```

## 🎯 Resultado esperado

Al instalar el APK generado por PWA Builder:

1. ✅ La app se abre en pantalla completa (sin barra de navegación)
2. ✅ Funciona offline para rutas ya visitadas
3. ✅ Se conecta al backend en `https://backend.smartsolution.fund/api/`
4. ✅ Login y registro funcionan correctamente
5. ✅ El campo de referral acepta links completos

---

**Build generado el**: 2025-11-01 15:56
**Versión**: 1.0.0
**Carpeta**: `/Users/nicolas/Documentos locales/smart solution app/frontend/dist/`

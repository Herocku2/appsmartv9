# ✅ Checklist de Verificación - Antes de Deploy a Netlify

## 📋 Pre-Deploy

### 1. Variables de Entorno
- [x] `.env.production` usa rutas relativas `/api/`
- [x] No hay URLs absolutas `https://backend.smartsolution.fund` en `.env.production`
- [x] Build regenerado con `yarn build`

### 2. Archivos de Configuración
- [x] `public/netlify.toml` tiene proxy configurado
- [x] `public/_redirects` existe
- [x] Ambos archivos copiados a `dist/`

### 3. PWA Manifest
- [x] `display: "standalone"` en manifest
- [x] Iconos configurados (192x192, 512x512)
- [x] Service Worker generado (`dist/sw.js`)

### 4. Build
- [x] `dist/` generado sin errores
- [x] 256 archivos en precache
- [x] `dist/_redirects` presente
- [x] `dist/netlify.toml` presente
- [x] `dist/manifest.webmanifest` con standalone

---

## 🚀 Durante Deploy en Netlify

### Método: Netlify CLI (Recomendado)

```bash
# 1. Instalar Netlify CLI (si no está instalado)
npm install -g netlify-cli

# 2. Login en Netlify
netlify login

# 3. Deploy a producción
cd /Users/nicolas/Documentos\ locales/smart\ solution\ app/frontend
netlify deploy --prod --dir=dist

# Confirmar cuando pregunte
```

### Método: Drag & Drop

1. Ir a https://app.netlify.com/
2. Hacer drag & drop de la carpeta `dist/` completa
3. Esperar a que termine el deploy
4. Copiar la URL generada

---

## ✅ Post-Deploy - Verificación

### 1. Abrir la app en navegador

**URL:** https://smartappv1.netlify.app/auth/login

### 2. DevTools - Verificar CORS

Abrir DevTools (F12) > Console

**✅ NO debe aparecer:**
```
Access to fetch at 'https://backend.smartsolution.fund/api/...' has been blocked by CORS policy
```

**✅ DEBE aparecer (silencio = éxito):**
- Sin errores rojos relacionados con CORS
- Peticiones a `/api/*` exitosas (código 200)

### 3. DevTools - Verificar Network

DevTools > Network > Filtrar por "token"

**Verificar petición POST /api/auth/token/:**
```
Request URL: https://smartappv1.netlify.app/api/auth/token/
                                          ^^^^^^^^
                                          Relativa, NO absoluta
```

**❌ INCORRECTO (no debería verse así):**
```
Request URL: https://backend.smartsolution.fund/api/auth/token/
```

### 4. Test Funcional - Login

- [ ] Ingresar usuario: `mobileuser`
- [ ] Ingresar contraseña: `••••••••••`
- [ ] Click en "Iniciar sesión"
- [ ] ✅ Debe redirigir al dashboard SIN errores
- [ ] ✅ Dashboard carga datos del backend

### 5. DevTools - Verificar PWA

**Application > Manifest:**
- [ ] `display: "standalone"` ✅
- [ ] Icons cargados correctamente ✅
- [ ] Start URL: `/` ✅

**Application > Service Workers:**
- [ ] Service Worker registrado ✅
- [ ] Estado: "activated and is running" ✅
- [ ] Scope: `/` ✅

### 6. Test de Instalación PWA

**En Chrome/Edge:**
1. Click en icono de instalación (⊕) en barra de dirección
2. Click "Instalar"
3. La app debe instalarse como PWA
4. Al abrir la PWA instalada:
   - [ ] Se abre en ventana separada
   - [ ] Sin barra de navegación del navegador ✅
   - [ ] Parece app nativa ✅

---

## 🔍 Debugging - Si algo falla

### Errores de CORS todavía aparecen

**Paso 1:** Verificar que Netlify tenga los archivos de configuración

```bash
# Verificar en Netlify Dashboard > Deploy > Deploy log
# Debe mostrar:
# "Processing redirect rules"
# "Found _redirects file"
# "Found netlify.toml"
```

**Paso 2:** Limpiar cache y re-deploy

```bash
netlify deploy --prod --dir=dist --force
```

**Paso 3:** Verificar variables de entorno compiladas

```bash
# Buscar URLs absolutas en el build
grep -r "backend.smartsolution.fund" dist/assets/*.js

# NO debe encontrar nada
# Si encuentra algo, regenerar build:
yarn build
netlify deploy --prod --dir=dist
```

### Service Worker no se registra

**Paso 1:** Verificar HTTPS
- Netlify siempre usa HTTPS ✅
- Service Workers solo funcionan en HTTPS

**Paso 2:** Verificar archivos
```bash
ls -la dist/sw.js
ls -la dist/workbox-*.js
ls -la dist/registerSW.js
```

**Paso 3:** Hard refresh
- Chrome: Ctrl + Shift + R (Windows) / Cmd + Shift + R (Mac)
- Limpiar cache: DevTools > Application > Clear storage

### Login no funciona

**Paso 1:** Verificar Network
- DevTools > Network
- Ver petición a `/api/auth/token/`
- Verificar que Status Code sea 200
- Verificar Response tiene token

**Paso 2:** Verificar credenciales
```
Usuario: mobileuser
Contraseña: (la que tienes configurada)
```

**Paso 3:** Verificar backend
```bash
# Test directo al backend
curl -X POST https://backend.smartsolution.fund/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"mobileuser","password":"tu_password"}'

# Debe retornar token
```

---

## 📱 PWA Builder - Generar APK

### Requisitos Previos
- [ ] App deployada en Netlify ✅
- [ ] URL pública accesible ✅
- [ ] Sin errores CORS ✅
- [ ] PWA funcional ✅

### Paso a Paso

1. **Ir a PWA Builder**
   ```
   URL: https://www.pwabuilder.com/
   ```

2. **Ingresar URL de tu app**
   ```
   https://smartappv1.netlify.app
   ```

3. **Click "Start"**
   - PWA Builder analizará tu app
   - Debe obtener puntaje alto (>80)

4. **Revisar Report Card**
   - [ ] Manifest: ✅ Valid
   - [ ] Service Worker: ✅ Registered
   - [ ] HTTPS: ✅ Enabled
   - [ ] Icons: ✅ Present

5. **Package > Android**
   - Package ID: `com.smartsolution.fund`
   - App name: `Smart Solution Fund`
   - Version: `1.0.0`
   - Min SDK: `24` (Android 7.0+)

6. **Generate**
   - Click "Generate Package"
   - Esperar 1-2 minutos
   - Descargar APK

7. **Instalar APK**
   - Transferir a dispositivo Android
   - Habilitar "Fuentes desconocidas"
   - Instalar
   - ✅ App se abre SIN barra de navegación

---

## 🎯 Resultado Esperado

### En Navegador (Netlify)
```
✅ Sin errores CORS
✅ Login funcional
✅ Dashboard carga datos
✅ PWA installable
✅ Service Worker activo
```

### En APK (PWA Builder)
```
✅ App se instala correctamente
✅ Icono aparece en launcher
✅ Al abrir: pantalla completa (standalone)
✅ SIN barra de dirección del navegador
✅ Parece app nativa
✅ Funcionalidad completa
```

---

## 📞 Soporte

Si después de seguir todos los pasos sigues teniendo problemas:

1. **Exporta logs:**
   ```bash
   # DevTools > Console > Click derecho > Save as...
   # Guarda como: netlify-console-errors.log
   ```

2. **Captura de pantalla:**
   - DevTools > Network tab (con errores visibles)
   - DevTools > Console (con errores rojos)

3. **Información del deploy:**
   - URL de Netlify
   - Versión del build
   - Logs de deploy

---

**Última actualización:** 2025-11-01 16:45
**Versión:** 1.0.1
**Build:** dist/ regenerado con CORS fix
**Estado:** ✅ Listo para deploy en Netlify

# 🎯 GUÍA FINAL - PWA LISTA PARA PWA BUILDER

## ✅ CONFIGURACIÓN COMPLETADA

### 1. Variables de Entorno Configuradas

**Archivo `.env`:**
```env
VITE_API_BASE_URL=https://backend.smartsolution.fund/api
VITE_AUTH_TOKEN_ENDPOINT=/auth/token/
VITE_REGISTER_REF_BASE=/auth/register/
VITE_BACKEND_DOMAIN="https://backend.smartsolution.fund/api/"
```

### 2. PWA Configurada

✅ **Modo Standalone** - Sin barra de navegación
✅ **Service Worker** - Con cache offline
✅ **Manifest.json** - Generado automáticamente
✅ **Iconos PWA** - Usando smartsolutionlogo.png
✅ **Theme Color** - #0d9488 (verde azulado)

### 3. Características Implementadas

- ✅ Conexión API REST con backend Django
- ✅ Campo "Ref Code" en formulario de registro
- ✅ Acepta URLs como: `https://backend.smartsolution.fund/api/auth/register/345346/`
- ✅ Service Worker personalizado
- ✅ Cache inteligente de API y páginas
- ✅ Auto-actualización de la app
- ✅ CORS habilitado en desarrollo

## 🚀 GENERAR BUILD PARA PWA BUILDER

### Paso 1: Limpiar build anterior (opcional)
```bash
rm -rf dist
```

### Paso 2: Crear build de producción
```bash
yarn build
```

Esto generará la carpeta `/dist` con:
- ✅ Todos los archivos optimizados
- ✅ manifest.webmanifest
- ✅ sw.js (Service Worker)
- ✅ workbox-*.js
- ✅ Assets minificados

### Paso 3: Verificar el build localmente
```bash
yarn preview
```

Abre http://localhost:4173 y verifica:
- [ ] La app carga correctamente
- [ ] El ícono smartsolutionlogo.png se muestra
- [ ] El modo standalone funciona (F12 > Application > Manifest)
- [ ] Service Worker está registrado (F12 > Application > Service Workers)

## 📱 SUBIR A PWA BUILDER

### Opción A: Desplegar en Netlify (Recomendado)

1. **Crear cuenta en Netlify** (gratis): https://www.netlify.com/

2. **Desplegar la carpeta dist:**
   - Método 1: Arrastra la carpeta `dist` a netlify.com
   - Método 2: Conecta tu repositorio GitHub

3. **Netlify te dará una URL HTTPS**, por ejemplo:
   ```
   https://smart-solution-fund.netlify.app
   ```

4. **Ir a PWA Builder:**
   - Abre: https://www.pwabuilder.com/
   - Ingresa la URL de Netlify
   - Click en "Start"

5. **Generar APK:**
   - PWA Builder analizará tu app
   - Verifica que todos los checks estén en verde ✅
   - Click en "Package For Stores"
   - Selecciona "Android"
   - Configura:
     - Package ID: `com.smartsolution.fund`
     - App Name: `Smart Solution Fund`
     - Display Mode: `standalone`
   - Click en "Generate"
   - Descarga el APK

### Opción B: Tu Propio Servidor HTTPS

1. **Sube la carpeta `dist` a tu servidor**

2. **Configura el servidor web** (ejemplo Nginx):
   ```nginx
   server {
       listen 443 ssl http2;
       server_name app.smartsolution.fund;
       
       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;
       
       root /var/www/smart-solution/dist;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

3. **Sigue los pasos 4 y 5 de la Opción A**

## 🔍 VERIFICACIÓN PRE-DESPLIEGUE

Ejecuta el script de verificación:
```bash
./check-deployment.sh
```

Debe mostrar: **"🎉 ¡Todo está listo para desplegar!"**

## 📋 CHECKLIST ANTES DE GENERAR APK

### Build Local
- [ ] `yarn build` se ejecuta sin errores
- [ ] Carpeta `dist` se genera correctamente
- [ ] `dist/manifest.webmanifest` existe
- [ ] `dist/sw.js` existe
- [ ] Iconos en `dist/` están presentes

### Servidor HTTPS
- [ ] App desplegada en HTTPS (obligatorio para PWA)
- [ ] URL accesible desde el navegador
- [ ] Service Worker se registra correctamente
- [ ] Manifest.json es accesible

### PWA Builder
- [ ] Todos los checks en verde en PWA Builder
- [ ] Score de PWA > 80
- [ ] Manifest válido
- [ ] Service Worker funcionando
- [ ] Iconos detectados

## 🎨 ICONOS PWA

Actualmente usa: **smartsolutionlogo.png**

### Si quieres usar "Perfil x.png":

1. **Coloca el archivo** en `/public/Perfil x.png`

2. **Actualiza vite.config.ts:**
   ```typescript
   includeAssets: [
       "Perfil x.png",
       // ...
   ],
   icons: [
       {
           src: "/Perfil x.png",
           sizes: "192x192",
           type: "image/png"
       },
       {
           src: "/Perfil x.png",
           sizes: "512x512",
           type: "image/png"
       },
       {
           src: "/Perfil x.png",
           sizes: "512x512",
           type: "image/png",
           purpose: "maskable"
       }
   ]
   ```

3. **Actualiza index.html:**
   ```html
   <link rel="icon" type="image/png" href="/Perfil x.png" />
   <link rel="apple-touch-icon" href="/Perfil x.png" />
   ```

4. **Reconstruir:**
   ```bash
   yarn build
   ```

### Requisitos de Iconos para PWA

- **Mínimo:** 192x192 y 512x512 píxeles
- **Formato:** PNG con fondo (no transparente para maskable)
- **Maskable:** Área segura de 80% del ícono

## 🔧 CONFIGURACIÓN DEL BACKEND

**IMPORTANTE:** El backend debe tener CORS habilitado.

Ver archivo `BACKEND_CORS_CONFIG.md` para instrucciones completas.

**Resumen rápido:**
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "https://app.smartsolution.fund",
    "https://smart-solution-fund.netlify.app",  # Si usas Netlify
    "http://localhost:5173",
]

CORS_ALLOW_CREDENTIALS = True
```

## 📱 CAMPO REF CODE

El formulario de registro ya incluye el campo "Ref Code":

**URL de ejemplo:**
```
https://app.smartsolution.fund/auth/register/345346
```

El código `345346` se pre-llena automáticamente en el campo "Referral Code".

**Endpoint de registro:**
```
POST https://backend.smartsolution.fund/api/auth/register/345346/
```

**Body:**
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

## 🎯 CRITERIOS DE ÉXITO

### ✅ Build Exitoso
```bash
yarn build
# ✓ built in 10s
# dist/index.html           0.50 kB
# dist/manifest.webmanifest 0.60 kB
# dist/sw.js                5.20 kB
# ...
```

### ✅ PWA Builder - Todos los checks en verde

Al ingresar tu URL en PWA Builder, debes ver:
- ✅ **Manifest**: Valid
- ✅ **Service Worker**: Detected and valid
- ✅ **HTTPS**: Enabled
- ✅ **Icons**: Found (192x192, 512x512)
- ✅ **Display**: Standalone
- ✅ **Orientation**: Portrait
- ✅ **Theme Color**: #0d9488

### ✅ Prueba en Dispositivo Android

1. Genera el APK desde PWA Builder
2. Descarga el APK en tu Android
3. Instala el APK
4. Abre la app
5. Verifica:
   - [ ] Se abre en pantalla completa (sin barra de navegación)
   - [ ] El ícono smartsolutionlogo.png aparece en el launcher
   - [ ] La app funciona offline (después de cargar una vez)
   - [ ] El registro con Ref Code funciona
   - [ ] La conexión al backend funciona

## 📂 ESTRUCTURA DE DIST

Después de `yarn build`, tu carpeta `dist` contendrá:

```
dist/
├── index.html
├── manifest.webmanifest
├── sw.js
├── workbox-*.js
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
├── smartsolutionlogo.png
├── favicon.png
└── ...otros assets...
```

## 🆘 SOLUCIÓN DE PROBLEMAS

### PWA Builder dice "No manifest found"

**Solución:** Verifica que `dist/manifest.webmanifest` existe y es accesible en `https://tu-url.com/manifest.webmanifest`

### Service Worker no se registra

**Solución:** 
1. Verifica que estás usando HTTPS (obligatorio)
2. Abre F12 > Application > Service Workers
3. Busca errores en la consola
4. Verifica que `sw.js` es accesible

### Iconos no aparecen en PWA Builder

**Solución:**
1. Verifica que los iconos están en `dist/`
2. Verifica los tamaños (mínimo 192x192 y 512x512)
3. Verifica el formato PNG
4. Limpia cache y reconstruye

### App no abre en modo standalone

**Solución:**
1. Verifica `display: "standalone"` en vite.config.ts
2. Reconstruye con `yarn build`
3. Limpia cache del navegador
4. Reinstala la PWA

## 📞 COMANDOS ÚTILES

```bash
# Desarrollo
yarn dev          # Servidor de desarrollo con PWA habilitada

# Build
yarn build        # Crear build de producción
yarn preview      # Previsualizar build

# Verificación
./check-deployment.sh  # Verificar configuración

# Limpiar
rm -rf dist       # Limpiar build anterior
rm -rf node_modules && yarn install  # Reinstalar dependencias
```

## 🎉 ¡LISTO PARA PWA BUILDER!

Tu aplicación está 100% configurada como PWA y lista para:

1. ✅ Hacer build: `yarn build`
2. ✅ Desplegar en HTTPS (Netlify, tu servidor, etc.)
3. ✅ Generar APK con https://www.pwabuilder.com/
4. ✅ Instalar en Android como app nativa

**¡Éxito con tu PWA!** 🚀

# Guía de Despliegue PWA - Smart Solution

## Cambios Realizados

### 1. Configuración del Backend
- ✅ Actualizado `.env` con la URL del backend: `https://backend.smartsolution.fund/api/`
- ✅ El sistema ahora se conecta automáticamente al backend en producción

### 2. Configuración PWA (Progressive Web App)
- ✅ Instalado `vite-plugin-pwa` y `workbox-window`
- ✅ Configurado `vite.config.ts` para generar manifest y service worker
- ✅ Configurado modo `standalone` para que no se vea la barra de navegación
- ✅ Agregadas meta tags en `index.html` para mejor compatibilidad móvil

### 3. Registro con Código de Referencia
- ✅ Agregado campo visible de código de referencia en el formulario de registro
- ✅ El código puede venir de la URL o ingresarse manualmente
- ✅ Validación obligatoria del código de referencia
- ✅ Traducciones en inglés y español

### 4. Configuración CORS
- ✅ Configurado proxy en Vite para desarrollo local
- ✅ En producción, el backend debe tener CORS habilitado para:
  - `https://app.smartsolution.fund`
  - O el dominio donde desplegarás el frontend

## Instrucciones para Crear la APK con PWABuilder

### Paso 1: Build de Producción
```bash
cd "/Users/nicolas/Documentos locales/smart solution app/frontend"
yarn build
```

Este comando generará una carpeta `dist` con todos los archivos optimizados.

### Paso 2: Desplegar en un Servidor Web
Debes desplegar la carpeta `dist` en un servidor HTTPS (obligatorio para PWA). Opciones:

1. **Netlify** (Recomendado - Gratis)
   - Arrastra la carpeta `dist` a netlify.com
   - O conecta tu repositorio GitHub

2. **Vercel** (Gratis)
   - Similar a Netlify

3. **Tu propio servidor**
   - Copia la carpeta `dist` a tu servidor web
   - Asegúrate de tener HTTPS activo

### Paso 3: Generar APK con PWABuilder

1. **Accede a**: https://www.pwabuilder.com/

2. **Ingresa la URL** de tu app desplegada (ej: `https://app.smartsolution.fund`)

3. **PWABuilder analizará** tu sitio y verificará:
   - ✅ Manifest.json presente
   - ✅ Service Worker activo
   - ✅ HTTPS habilitado
   - ✅ Iconos correctos

4. **Genera el paquete Android**:
   - Click en "Package for Stores"
   - Selecciona "Android (Google Play)"
   - Configura opciones:
     - Package ID: `com.smartsolution.app`
     - App name: `Smart Solution`
     - Start URL: `/`
     - Display mode: `standalone`
     - Orientation: `portrait`

5. **Descarga** el paquete APK generado

6. **Prueba** instalando el APK en tu dispositivo Android

### Paso 4: Probar la PWA en Local (Opcional)

Para probar cómo se verá la PWA antes de generar la APK:

```bash
# 1. Construir para producción
yarn build

# 2. Previsualizar build
yarn preview
```

Luego abre Chrome DevTools (F12) > Application > Manifest y verifica que todo esté correcto.

## Configuración del Backend (IMPORTANTE)

El backend en `https://backend.smartsolution.fund` debe tener configurado CORS. Ejemplo en Django:

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "https://app.smartsolution.fund",
    "http://localhost:5173",  # Para desarrollo
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
```

## Características de la PWA

### Modo Standalone
- ✅ La app se abre sin barra de navegación del navegador
- ✅ Parece una app nativa
- ✅ Icono en el home screen del dispositivo

### Service Worker
- ✅ Cache de recursos estáticos para funcionamiento offline
- ✅ Cache inteligente de llamadas API
- ✅ Actualizaciones automáticas cuando hay nueva versión

### Manifest
- ✅ Nombre: Smart Solution
- ✅ Tema: Blanco
- ✅ Orientación: Portrait
- ✅ Iconos: 192x192 y 512x512

## Rutas Disponibles

### Registro
- `/auth/register` - Registro sin código (debe ingresar uno manualmente)
- `/auth/register/CODIGO` - Registro con código en la URL

### Flujo de Registro
1. Usuario ingresa a la app por link de referido: `/auth/register/ABC123`
2. El campo de código se pre-llena con `ABC123`
3. Usuario puede editar el código si lo desea
4. El código es obligatorio para completar el registro
5. Al registrarse, se envía a: `POST https://backend.smartsolution.fund/api/auth/register/ABC123/`

## Testing

### Probar Registro
1. Abre: `http://localhost:5173/auth/register`
2. Ingresa un código de referencia manualmente
3. Completa el formulario
4. Verifica que se envíe a la API correcta

### Probar con Código en URL
1. Abre: `http://localhost:5173/auth/register/TEST123`
2. Verifica que el campo esté pre-llenado con `TEST123`
3. Completa el formulario

## Próximos Pasos

1. ✅ **Verificar funcionamiento local** - Ya disponible en http://localhost:5173
2. ⏳ **Hacer build de producción** - `yarn build`
3. ⏳ **Desplegar en servidor HTTPS**
4. ⏳ **Generar APK con PWABuilder**
5. ⏳ **Probar APK en dispositivo Android**

## Comandos Útiles

```bash
# Desarrollo
yarn dev

# Build para producción
yarn build

# Preview del build
yarn preview

# Linting
yarn lint

# Formateo de código
yarn format
```

## Notas Importantes

- La PWA **requiere HTTPS** en producción (excepto localhost)
- El **Service Worker** solo funciona en HTTPS
- Los **iconos** deben ser PNG de 192x192 y 512x512 mínimo
- El **campo de referencia** es obligatorio para el registro
- Las **traducciones** están en inglés y español

## Soporte

Si tienes problemas:
1. Verifica que CORS esté habilitado en el backend
2. Verifica que la URL del backend sea correcta
3. Revisa la consola del navegador (F12) para errores
4. Verifica que el service worker esté registrado en DevTools > Application

---

✅ **Todo configurado y listo para desplegar!**

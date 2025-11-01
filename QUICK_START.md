# 🚀 INICIO RÁPIDO - Smart Solution PWA

## ✅ ¿Qué se ha configurado?

### 1. Backend Conectado
- ✅ La app se conecta a: `https://backend.smartsolution.fund/api/`
- ⚠️ **IMPORTANTE**: Debes configurar CORS en el backend (ver abajo)

### 2. PWA Configurado
- ✅ Modo Standalone (sin barra de navegación)
- ✅ Service Worker para cache offline
- ✅ Manifest.json configurado
- ✅ Iconos y meta tags PWA

### 3. Sistema de Registro con Referidos
- ✅ Campo de código de referencia visible
- ✅ Validación obligatoria del código
- ✅ Traducciones en inglés y español
- ✅ Rutas: `/auth/register` y `/auth/register/:codigo`

## 🎯 Para Ver la App AHORA (Local)

La app ya está corriendo en tu navegador local en:

**http://localhost:5173**

Puedes hacer clic en el botón de preview que aparece arriba para verla.

### Probar el Registro:

1. Ve a: http://localhost:5173/auth/register
2. Ingresa un código de referencia (cualquiera para testing, ej: "TEST123")
3. Completa el formulario
4. Presiona "Registrar"

O prueba con código en la URL:
- http://localhost:5173/auth/register/CODIGO123

## ⚠️ CONFIGURAR CORS EN EL BACKEND (URGENTE)

Para que la app funcione, **DEBES** configurar CORS en el backend de Django:

### Pasos Rápidos:

1. **Instalar django-cors-headers** en el backend:
   ```bash
   pip install django-cors-headers
   ```

2. **Editar settings.py** del backend y agregar:
   ```python
   # En INSTALLED_APPS
   INSTALLED_APPS = [
       # ...
       'corsheaders',
       # ...
   ]

   # En MIDDLEWARE (DEBE IR PRIMERO)
   MIDDLEWARE = [
       'corsheaders.middleware.CorsMiddleware',  # PRIMERO
       'django.middleware.common.CommonMiddleware',
       # ... resto
   ]

   # Configurar CORS
   CORS_ALLOWED_ORIGINS = [
       "https://app.smartsolution.fund",  # Tu dominio de producción
       "http://localhost:5173",           # Para desarrollo
       "http://127.0.0.1:5173",
   ]

   CORS_ALLOW_CREDENTIALS = True
   ```

3. **Reiniciar el servidor Django**

Ver archivo **BACKEND_CORS_CONFIG.md** para configuración completa.

## 🏗️ Para Crear el Build de Producción

```bash
# 1. Detener el servidor de desarrollo (Ctrl+C en la terminal)

# 2. Crear build
yarn build

# 3. Probar el build localmente
yarn preview
```

Los archivos se generarán en `frontend/dist/`

## 📱 Para Generar la APK

### Opción 1: Desplegar en Netlify (Recomendado y Gratis)

1. Ve a https://www.netlify.com/
2. Arrastra la carpeta `dist/` a Netlify
3. Netlify te dará una URL HTTPS (ej: `https://smart-solution.netlify.app`)
4. Ve a https://www.pwabuilder.com/
5. Ingresa la URL de Netlify
6. Descarga la APK generada

### Opción 2: Tu Propio Servidor

1. Sube la carpeta `dist/` a tu servidor HTTPS
2. Asegúrate que esté accesible (ej: `https://app.smartsolution.fund`)
3. Ve a https://www.pwabuilder.com/
4. Ingresa tu URL
5. Descarga la APK generada

## 📋 Checklist Pre-Despliegue

Ejecuta este comando para verificar que todo esté listo:

```bash
./check-deployment.sh
```

Debe mostrar: **"🎉 ¡Todo está listo para desplegar!"**

## 🔧 Solución de Problemas

### Error: "CORS policy"
**Solución**: Configura CORS en el backend (ver arriba)

### Error: "Network request failed"
**Solución**: Verifica que el backend esté corriendo y accesible

### La PWA no se instala
**Solución**: Necesitas HTTPS. Usa Netlify o un servidor HTTPS

### El campo de referencia no aparece
**Solución**: Asegúrate de estar en `/auth/register` y refresca la página

## 📚 Documentación Completa

- **README.md** - Documentación general
- **DEPLOYMENT_GUIDE.md** - Guía detallada de despliegue
- **BACKEND_CORS_CONFIG.md** - Configuración CORS del backend

## 🆘 Ayuda Rápida

### Ver logs del servidor de desarrollo
Mira la terminal donde ejecutaste `yarn dev`

### Ver errores en el navegador
Presiona F12 > Console

### Verificar peticiones al backend
F12 > Network > Filtra por "fetch/xhr"

---

## 🎉 ¡LISTO!

Tu app está funcionando en:
- **Local**: http://localhost:5173
- **Producción**: (después de desplegar)

### Próximos Pasos:
1. ✅ Configura CORS en el backend
2. ⏳ Haz el build: `yarn build`
3. ⏳ Despliega en Netlify o tu servidor
4. ⏳ Genera la APK con PWABuilder
5. ⏳ ¡Prueba la APK en tu teléfono!

**¿Necesitas ayuda?** Revisa los archivos de documentación o contacta al equipo de desarrollo.

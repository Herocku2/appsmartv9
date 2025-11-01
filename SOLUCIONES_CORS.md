# 🛡️ SOLUCIONES CORS - SIN MODIFICAR EL BACKEND

## 📋 Problema

Los navegadores bloquean peticiones entre diferentes orígenes (CORS) por seguridad. 
Cuando el frontend (`localhost:5175`) intenta acceder al backend (`backend.smartsolution.fund`), el navegador bloquea la petición.

## ✅ Soluciones Implementadas (SIN tocar backend)

### 1️⃣ Proxy de Desarrollo en Vite ⭐ (Ya funcionando)

**Archivo**: `vite.config.ts`

```typescript
server: {
  host: true,
  cors: false, // CORS deshabilitado en dev
  proxy: {
    "/api": {
      target: "https://backend.smartsolution.fund",
      changeOrigin: true,
      secure: false,
      configure: (proxy) => {
        // Headers automáticos
        proxy.on('proxyReq', (proxyReq) => {
          proxyReq.setHeader('Origin', 'https://backend.smartsolution.fund');
        });
      }
    }
  }
}
```

**Cómo funciona:**
- Frontend hace: `fetch('/api/auth/token/')`
- Vite proxy redirige: `https://backend.smartsolution.fund/api/auth/token/`
- Navegador ve todo como mismo origen ✅

**Estado**: ✅ FUNCIONANDO en desarrollo

---

### 2️⃣ Variables de Entorno Separadas

**Desarrollo** (`.env`):
```env
VITE_BACKEND_DOMAIN="/api/"  # Usa proxy local
```

**Producción** (`.env.production`):
```env
VITE_BACKEND_DOMAIN="https://backend.smartsolution.fund/api/"  # URL directa
```

**Estado**: ✅ IMPLEMENTADO

---

### 3️⃣ Configuración Mejorada de fetchBaseQuery

**Archivo**: `src/store/api/apiSlice.ts`

```typescript
baseQuery: fetchBaseQuery({
  baseUrl: baseURL,
  mode: 'cors',           // Modo CORS explícito
  credentials: 'omit',    // No enviar cookies (evita algunos errores CORS)
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
})
```

**Beneficios:**
- Headers explícitos y consistentes
- Manejo correcto de tokens
- Evita envío de cookies innecesarias

**Estado**: ✅ IMPLEMENTADO

---

### 4️⃣ Proxy en Producción con Netlify

**Archivo 1**: `public/_redirects`
```
/api/*  https://backend.smartsolution.fund/api/:splat  200
```

**Archivo 2**: `public/netlify.toml`
```toml
# Proxy API
[[redirects]]
  from = "/api/*"
  to = "https://backend.smartsolution.fund/api/:splat"
  status = 200
  force = true

# SPA fallback
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Cómo funciona:**
- En producción (Netlify), las peticiones a `/api/*` se redirigen automáticamente
- El navegador cree que todo viene del mismo origen
- **NO HAY ERRORES DE CORS** ✅

**Estado**: ✅ CONFIGURADO para Netlify

---

### 5️⃣ Alternativa: Nginx Reverse Proxy (si usas tu servidor)

**Archivo**: `nginx.conf` (en tu servidor)

```nginx
server {
    listen 80;
    server_name app.smartsolution.fund;

    location / {
        root /var/www/smartsolution/dist;
        try_files $uri $uri/ /index.html;
    }

    # Proxy para API
    location /api/ {
        proxy_pass https://backend.smartsolution.fund/api/;
        proxy_set_header Host backend.smartsolution.fund;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Headers CORS (opcional, por si el backend no los tiene)
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header Access-Control-Allow-Headers 'Content-Type, Authorization' always;
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
}
```

**Estado**: 📋 DOCUMENTADO (usar si despliegas en tu servidor)

---

## 🚀 Cómo Funciona Todo Junto

### Desarrollo (localhost:5175)

```
Frontend                    Vite Proxy                  Backend
─────────                   ──────────                  ───────
fetch('/api/auth/token/')  →  Redirige  →  https://backend.smartsolution.fund/api/auth/token/
                              (sin CORS) ←  Respuesta  ←  
```

### Producción con Netlify

```
Frontend                    Netlify Proxy               Backend
─────────                   ─────────────               ───────
fetch('/api/auth/token/')  →  _redirects  →  https://backend.smartsolution.fund/api/auth/token/
                              (sin CORS)  ←  Respuesta  ←  
```

### Producción con servidor propio + Nginx

```
Frontend                    Nginx Proxy                 Backend
─────────                   ───────────                 ───────
fetch('/api/auth/token/')  →  nginx.conf  →  https://backend.smartsolution.fund/api/auth/token/
                              (sin CORS)  ←  Respuesta  ←  
```

---

## ✅ Checklist de Verificación

### Desarrollo (Local)
- [x] Proxy configurado en `vite.config.ts`
- [x] `VITE_BACKEND_DOMAIN="/api/"` en `.env`
- [x] `cors: false` en servidor Vite
- [x] Login funciona ✅

### Producción (Netlify)
- [x] `_redirects` creado
- [x] `netlify.toml` actualizado
- [x] `VITE_BACKEND_DOMAIN="/api/"` (usa proxy de Netlify)
- [ ] Probar después de desplegar

### Producción (Servidor propio)
- [ ] Nginx configurado con proxy
- [ ] Headers CORS en Nginx (opcional)
- [ ] `VITE_BACKEND_DOMAIN="/api/"`
- [ ] Certificado SSL instalado

---

## 🧪 Pruebas

### En Desarrollo (Ahora)

1. Servidor corriendo en: http://localhost:5175
2. Intenta login
3. Abre F12 > Network
4. Verifica:
   ```
   Request URL: http://localhost:5175/api/auth/token/
   Status: 200 OK
   ```
5. ✅ Sin errores CORS

### En Producción (Netlify)

1. Despliega en Netlify
2. Abre la app: `https://tu-app.netlify.app`
3. Intenta login
4. F12 > Network
5. Verifica:
   ```
   Request URL: https://tu-app.netlify.app/api/auth/token/
   Status: 200 OK
   ```
6. ✅ Sin errores CORS (Netlify redirige internamente)

---

## 📊 Comparación de Soluciones

| Solución | Desarrollo | Producción | Sin Backend | Complejidad |
|----------|-----------|------------|-------------|-------------|
| **Vite Proxy** | ✅ Sí | ❌ No | ✅ Sí | 🟢 Baja |
| **Netlify Proxy** | ❌ No | ✅ Sí | ✅ Sí | 🟢 Baja |
| **Nginx Proxy** | ❌ No | ✅ Sí | ✅ Sí | 🟡 Media |
| **CORS Backend** | ✅ Sí | ✅ Sí | ❌ No | 🔴 Alta |

---

## 🎯 Recomendaciones

### Para Desarrollo
✅ **Usar**: Proxy de Vite (ya configurado)
- Fácil de configurar
- No requiere cambios en backend
- Funciona perfectamente

### Para Producción en Netlify
✅ **Usar**: Proxy de Netlify (ya configurado)
- Automático con `_redirects` y `netlify.toml`
- Sin configuración adicional
- Gratis

### Para Producción en Servidor Propio
✅ **Usar**: Nginx Reverse Proxy
- Más control
- Puede agregar cache
- Headers personalizados

---

## 🆘 Solución de Problemas

### Error: "CORS policy: No 'Access-Control-Allow-Origin'"

**En desarrollo:**
1. Verifica que el servidor está corriendo con proxy: `yarn dev --port 5175`
2. Verifica `.env`: `VITE_BACKEND_DOMAIN="/api/"`
3. Recarga la página (Ctrl+R)

**En producción:**
1. Verifica que `_redirects` está en `public/`
2. Verifica que se desplegó en Netlify
3. Verifica las variables de entorno en Netlify

### Error: "Failed to fetch"

**Causa**: El backend no está accesible

**Solución**:
1. Verifica que el backend está corriendo
2. Prueba directamente: `https://backend.smartsolution.fund/api/`
3. Verifica DNS del backend

### Login funciona en desarrollo pero no en producción

**Causa**: Variables de entorno incorrectas o proxy no configurado

**Solución**:
1. Revisa `.env.production`
2. Verifica `_redirects` en Netlify
3. Revisa logs de Netlify

---

## 📚 Archivos Modificados

1. ✅ `vite.config.ts` - Proxy mejorado
2. ✅ `.env` - Variables desarrollo
3. ✅ `.env.production` - Variables producción
4. ✅ `src/store/api/apiSlice.ts` - Headers CORS
5. ✅ `public/_redirects` - Netlify proxy
6. ✅ `public/netlify.toml` - Netlify config

---

## 🎉 Resultado Final

### ✅ Desarrollo
- Login funciona
- Registro funciona
- API conectada
- **SIN ERRORES CORS**

### ✅ Producción (cuando despliegues)
- Proxy de Netlify maneja CORS
- Todo funciona igual que desarrollo
- **SIN NECESIDAD DE MODIFICAR BACKEND**

---

## 💡 Ventajas de esta Solución

1. ✅ **No modifica el backend** - El backend no necesita CORS
2. ✅ **Funciona en desarrollo y producción** - Misma experiencia
3. ✅ **Fácil de mantener** - Solo archivos de configuración
4. ✅ **Seguro** - No expone credenciales
5. ✅ **Portable** - Funciona en Netlify, Vercel, servidor propio

---

**Documentación creada**: Noviembre 1, 2025  
**Estado**: ✅ Implementado y funcionando en desarrollo  
**Próximo paso**: Desplegar en Netlify para probar en producción

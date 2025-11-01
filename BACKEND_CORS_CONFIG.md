# Configuración CORS para Backend Django

## Instrucciones para el Backend

Para que la aplicación frontend pueda conectarse correctamente al backend, necesitas configurar CORS (Cross-Origin Resource Sharing) en el servidor Django.

## Instalación

```bash
pip install django-cors-headers
```

## Configuración en settings.py

```python
# settings.py

# Agregar a INSTALLED_APPS
INSTALLED_APPS = [
    # ... otras apps
    'corsheaders',
    # ... resto de apps
]

# Agregar el middleware de CORS
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # DEBE IR PRIMERO
    'django.middleware.common.CommonMiddleware',
    # ... resto de middleware
]

# Configurar CORS
CORS_ALLOWED_ORIGINS = [
    "https://app.smartsolution.fund",  # Tu dominio de producción
    "http://localhost:5173",           # Para desarrollo local
    "http://127.0.0.1:5173",          # Para desarrollo local
]

# Permitir credenciales (cookies, auth headers)
CORS_ALLOW_CREDENTIALS = True

# Headers permitidos
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

# Métodos HTTP permitidos
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# Exponer headers adicionales si es necesario
CORS_EXPOSE_HEADERS = [
    'content-type',
    'x-csrftoken',
]

# Si quieres permitir todos los orígenes (NO RECOMENDADO EN PRODUCCIÓN)
# CORS_ALLOW_ALL_ORIGINS = True
```

## Configuración para Producción

Si usas diferentes dominios para desarrollo y producción:

```python
# settings.py

import os

DEBUG = os.getenv('DEBUG', 'False') == 'True'

if DEBUG:
    # Desarrollo
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
else:
    # Producción
    CORS_ALLOWED_ORIGINS = [
        "https://app.smartsolution.fund",
        "https://smartsolution.fund",
    ]
```

## Verificar que CORS está funcionando

1. **Desde el navegador**, abre la consola (F12)
2. **Haz una petición** a tu API desde el frontend
3. **Si hay errores CORS**, verás algo como:
   ```
   Access to XMLHttpRequest at 'https://backend.smartsolution.fund/api/...' 
   from origin 'https://app.smartsolution.fund' has been blocked by CORS policy
   ```

4. **Si CORS está bien configurado**, verás en los headers de la respuesta:
   ```
   Access-Control-Allow-Origin: https://app.smartsolution.fund
   Access-Control-Allow-Credentials: true
   ```

## Configuración de HTTPS (Producción)

Para que CORS funcione correctamente en producción, necesitas HTTPS. En Django:

```python
# settings.py (producción)

# Seguridad HTTPS
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# Configurar dominios de confianza
CSRF_TRUSTED_ORIGINS = [
    'https://app.smartsolution.fund',
    'https://backend.smartsolution.fund',
]

# Hosts permitidos
ALLOWED_HOSTS = [
    'backend.smartsolution.fund',
    'api.smartsolution.fund',  # Si usas un subdominio diferente
]
```

## Configuración de Nginx (si aplica)

Si usas Nginx como proxy inverso:

```nginx
# /etc/nginx/sites-available/smartsolution-backend

server {
    listen 80;
    server_name backend.smartsolution.fund;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name backend.smartsolution.fund;

    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/backend.smartsolution.fund/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/backend.smartsolution.fund/privkey.pem;

    # Headers de seguridad
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /path/to/your/static/files/;
    }

    location /media/ {
        alias /path/to/your/media/files/;
    }
}
```

## Pruebas

### 1. Probar desde curl

```bash
# Verificar headers CORS
curl -I -X OPTIONS \
  -H "Origin: https://app.smartsolution.fund" \
  -H "Access-Control-Request-Method: POST" \
  https://backend.smartsolution.fund/api/auth/register/123/
```

Deberías ver en la respuesta:
```
Access-Control-Allow-Origin: https://app.smartsolution.fund
Access-Control-Allow-Methods: POST, OPTIONS, ...
```

### 2. Probar desde navegador

```javascript
// En la consola del navegador (F12)
fetch('https://backend.smartsolution.fund/api/auth/token/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'test123'
  })
})
.then(r => r.json())
.then(d => console.log(d))
.catch(e => console.error(e));
```

## Solución de Problemas Comunes

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Causa**: El middleware de CORS no está configurado o el origen no está en la lista permitida.

**Solución**: 
1. Verifica que `corsheaders` esté en `INSTALLED_APPS`
2. Verifica que `CorsMiddleware` esté PRIMERO en `MIDDLEWARE`
3. Agrega tu dominio a `CORS_ALLOWED_ORIGINS`

### Error: "CORS policy: Credentials flag is true, but Access-Control-Allow-Credentials is not present"

**Causa**: El frontend envía credenciales pero el backend no las permite.

**Solución**:
```python
CORS_ALLOW_CREDENTIALS = True
```

### Error: "Mixed Content: The page was loaded over HTTPS, but requested an insecure resource"

**Causa**: El frontend está en HTTPS pero el backend en HTTP.

**Solución**: Configura HTTPS en el backend también.

## Checklist Final

- [ ] `django-cors-headers` instalado
- [ ] `corsheaders` en `INSTALLED_APPS`
- [ ] `CorsMiddleware` PRIMERO en `MIDDLEWARE`
- [ ] Dominios correctos en `CORS_ALLOWED_ORIGINS`
- [ ] `CORS_ALLOW_CREDENTIALS = True`
- [ ] HTTPS configurado en producción
- [ ] `CSRF_TRUSTED_ORIGINS` configurado
- [ ] Probado con curl y navegador

---

Con esta configuración, tu backend estará listo para recibir peticiones del frontend sin problemas de CORS.

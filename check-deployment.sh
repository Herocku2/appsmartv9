#!/bin/bash

# Script de verificación pre-despliegue
# Smart Solution App

echo "🔍 Verificando configuración de Smart Solution App..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
CHECKS_PASSED=0
CHECKS_FAILED=0

# Función para verificar
check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}❌ $2${NC}"
        ((CHECKS_FAILED++))
    fi
}

echo "📦 Verificando dependencias..."
echo "-----------------------------------"

# Verificar Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    check 0 "Node.js instalado: $NODE_VERSION"
else
    check 1 "Node.js no está instalado"
fi

# Verificar Yarn
if command -v yarn &> /dev/null; then
    YARN_VERSION=$(yarn --version)
    check 0 "Yarn instalado: $YARN_VERSION"
else
    check 1 "Yarn no está instalado"
fi

echo ""
echo "📄 Verificando archivos de configuración..."
echo "-----------------------------------"

# Verificar .env
if [ -f ".env" ]; then
    check 0 ".env existe"
    
    # Verificar que contiene la URL del backend
    if grep -q "VITE_BACKEND_DOMAIN" .env; then
        check 0 "VITE_BACKEND_DOMAIN está configurado"
        
        # Mostrar la URL configurada
        BACKEND_URL=$(grep "VITE_BACKEND_DOMAIN" .env | cut -d '"' -f 2)
        echo -e "${YELLOW}   Backend URL: $BACKEND_URL${NC}"
        
        # Verificar que es HTTPS en producción
        if [[ $BACKEND_URL == https://* ]]; then
            check 0 "Backend URL usa HTTPS"
        else
            echo -e "${YELLOW}   ⚠️  Advertencia: Backend no usa HTTPS${NC}"
        fi
    else
        check 1 "VITE_BACKEND_DOMAIN no está configurado en .env"
    fi
else
    check 1 ".env no existe"
fi

# Verificar vite.config.ts
if [ -f "vite.config.ts" ]; then
    check 0 "vite.config.ts existe"
    
    # Verificar que tiene configuración PWA
    if grep -q "VitePWA" vite.config.ts; then
        check 0 "Plugin PWA está configurado"
    else
        check 1 "Plugin PWA no está configurado"
    fi
else
    check 1 "vite.config.ts no existe"
fi

# Verificar package.json
if [ -f "package.json" ]; then
    check 0 "package.json existe"
    
    # Verificar dependencias PWA
    if grep -q "vite-plugin-pwa" package.json; then
        check 0 "vite-plugin-pwa está en package.json"
    else
        check 1 "vite-plugin-pwa no está en package.json"
    fi
    
    if grep -q "workbox-window" package.json; then
        check 0 "workbox-window está en package.json"
    else
        check 1 "workbox-window no está en package.json"
    fi
else
    check 1 "package.json no existe"
fi

echo ""
echo "🔧 Verificando archivos del proyecto..."
echo "-----------------------------------"

# Verificar favicon
if [ -f "public/favicon.png" ]; then
    check 0 "Favicon existe (public/favicon.png)"
else
    check 1 "Favicon no existe (public/favicon.png)"
fi

# Verificar index.html
if [ -f "index.html" ]; then
    check 0 "index.html existe"
    
    # Verificar meta tags PWA
    if grep -q "apple-mobile-web-app-capable" index.html; then
        check 0 "Meta tags PWA están configurados"
    else
        check 1 "Meta tags PWA no están configurados"
    fi
else
    check 1 "index.html no existe"
fi

# Verificar componente de registro
if [ -f "src/views/auth/minimal/Register.tsx" ]; then
    check 0 "Componente de registro existe"
    
    # Verificar que tiene campo de referencia
    if grep -q "referralCode" src/views/auth/minimal/Register.tsx; then
        check 0 "Campo de código de referencia está implementado"
    else
        check 1 "Campo de código de referencia no está implementado"
    fi
else
    check 1 "Componente de registro no existe"
fi

echo ""
echo "🌍 Verificando traducciones..."
echo "-----------------------------------"

# Verificar archivos de traducción
if [ -f "src/locales/en/translation.json" ]; then
    check 0 "Traducciones en inglés existen"
    
    if grep -q "Referral Code" src/locales/en/translation.json; then
        check 0 "Traducciones de código de referencia (EN) están agregadas"
    else
        check 1 "Traducciones de código de referencia (EN) faltan"
    fi
else
    check 1 "Traducciones en inglés no existen"
fi

if [ -f "src/locales/es/translation.json" ]; then
    check 0 "Traducciones en español existen"
    
    if grep -q "Código de Referencia" src/locales/es/translation.json; then
        check 0 "Traducciones de código de referencia (ES) están agregadas"
    else
        check 1 "Traducciones de código de referencia (ES) faltan"
    fi
else
    check 1 "Traducciones en español no existen"
fi

echo ""
echo "📚 Verificando documentación..."
echo "-----------------------------------"

if [ -f "DEPLOYMENT_GUIDE.md" ]; then
    check 0 "Guía de despliegue existe"
else
    check 1 "Guía de despliegue no existe"
fi

if [ -f "BACKEND_CORS_CONFIG.md" ]; then
    check 0 "Guía de configuración CORS existe"
else
    check 1 "Guía de configuración CORS no existe"
fi

if [ -f "README.md" ]; then
    check 0 "README.md existe"
else
    check 1 "README.md no existe"
fi

echo ""
echo "═══════════════════════════════════"
echo "📊 RESUMEN"
echo "═══════════════════════════════════"
echo -e "${GREEN}Verificaciones exitosas: $CHECKS_PASSED${NC}"
echo -e "${RED}Verificaciones fallidas: $CHECKS_FAILED${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡Todo está listo para desplegar!${NC}"
    echo ""
    echo "Próximos pasos:"
    echo "1. Ejecutar 'yarn build' para crear el build de producción"
    echo "2. Desplegar la carpeta 'dist/' en un servidor HTTPS"
    echo "3. Ir a https://www.pwabuilder.com/ para generar la APK"
    echo ""
else
    echo -e "${RED}⚠️  Hay problemas que necesitan ser resueltos antes de desplegar${NC}"
    echo ""
    echo "Por favor, revisa los errores anteriores y corrígelos."
    echo ""
fi

echo "Para más información, consulta:"
echo "  - DEPLOYMENT_GUIDE.md"
echo "  - BACKEND_CORS_CONFIG.md"
echo "  - README.md"
echo ""

#!/bin/bash

# Script para generar build optimizado para PWA Builder
# Smart Solution Fund

echo "🚀 Iniciando build para PWA Builder..."
echo "═══════════════════════════════════════════"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contador de pasos
STEP=1

# Función para mostrar paso
step() {
    echo ""
    echo -e "${BLUE}[$STEP/7]${NC} $1"
    ((STEP++))
}

# Función para error
error() {
    echo -e "${RED}❌ Error: $1${NC}"
    exit 1
}

# Función para éxito
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Función para advertencia
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Paso 1: Verificar Node y Yarn
step "Verificando herramientas necesarias..."

if ! command -v node &> /dev/null; then
    error "Node.js no está instalado"
fi
success "Node.js $(node --version) encontrado"

if ! command -v yarn &> /dev/null; then
    error "Yarn no está instalado"
fi
success "Yarn $(yarn --version) encontrado"

# Paso 2: Verificar configuración
step "Verificando configuración PWA..."

if [ ! -f ".env" ]; then
    error "Archivo .env no encontrado"
fi
success "Archivo .env encontrado"

if [ ! -f "vite.config.ts" ]; then
    error "Archivo vite.config.ts no encontrado"
fi
success "Archivo vite.config.ts encontrado"

# Verificar plugin PWA
if ! grep -q "vite-plugin-pwa" package.json; then
    error "vite-plugin-pwa no está instalado en package.json"
fi
success "Plugin PWA configurado"

# Paso 3: Limpiar build anterior
step "Limpiando build anterior..."

if [ -d "dist" ]; then
    rm -rf dist
    success "Carpeta dist/ eliminada"
else
    warning "No hay build anterior para limpiar"
fi

# Paso 4: Verificar dependencias
step "Verificando dependencias..."

if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias..."
    yarn install || error "Error al instalar dependencias"
    success "Dependencias instaladas"
else
    success "Dependencias ya instaladas"
fi

# Paso 5: Crear build
step "Creando build de producción..."

echo "Ejecutando: yarn build"
yarn build || error "Error al crear build"

success "Build creado exitosamente"

# Paso 6: Verificar archivos generados
step "Verificando archivos generados..."

# Verificar que dist existe
if [ ! -d "dist" ]; then
    error "Carpeta dist/ no fue generada"
fi
success "Carpeta dist/ generada"

# Verificar archivos críticos
REQUIRED_FILES=("index.html" "manifest.webmanifest" "sw.js")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "dist/$file" ]; then
        success "$file encontrado"
    else
        error "$file no fue generado"
    fi
done

# Verificar assets
if [ ! -d "dist/assets" ]; then
    error "Carpeta dist/assets/ no fue generada"
fi
success "Assets generados"

# Contar archivos
FILE_COUNT=$(find dist -type f | wc -l)
success "Total de archivos generados: $FILE_COUNT"

# Tamaño del build
BUILD_SIZE=$(du -sh dist | cut -f1)
success "Tamaño total del build: $BUILD_SIZE"

# Paso 7: Verificar manifest y service worker
step "Verificando configuración PWA..."

# Verificar manifest.webmanifest
if grep -q "Smart Solution" dist/manifest.webmanifest; then
    success "Manifest contiene el nombre de la app"
else
    warning "Manifest no contiene el nombre esperado"
fi

if grep -q "standalone" dist/manifest.webmanifest; then
    success "Display mode: standalone configurado"
else
    error "Display mode no está en standalone"
fi

if grep -q "smartsolutionlogo.png" dist/manifest.webmanifest; then
    success "Ícono configurado en manifest"
else
    warning "Ícono no encontrado en manifest"
fi

# Verificar que sw.js existe y tiene contenido
if [ -s "dist/sw.js" ]; then
    SW_SIZE=$(wc -c < "dist/sw.js")
    if [ $SW_SIZE -gt 100 ]; then
        success "Service Worker generado (${SW_SIZE} bytes)"
    else
        warning "Service Worker parece estar vacío"
    fi
else
    error "Service Worker no fue generado o está vacío"
fi

echo ""
echo "═══════════════════════════════════════════"
echo -e "${GREEN}🎉 BUILD COMPLETADO EXITOSAMENTE${NC}"
echo "═══════════════════════════════════════════"
echo ""
echo "📂 Ubicación: $(pwd)/dist"
echo "📦 Tamaño: $BUILD_SIZE"
echo "📄 Archivos: $FILE_COUNT"
echo ""
echo "📱 Próximos pasos para PWA Builder:"
echo "───────────────────────────────────────────"
echo "1. Desplegar la carpeta 'dist/' en un servidor HTTPS"
echo "   Opciones:"
echo "   • Netlify (recomendado): https://www.netlify.com/"
echo "   • Vercel: https://vercel.com/"
echo "   • Tu propio servidor HTTPS"
echo ""
echo "2. Ir a PWA Builder: https://www.pwabuilder.com/"
echo ""
echo "3. Ingresar la URL de tu app desplegada"
echo ""
echo "4. Generar y descargar el APK"
echo ""
echo "🔍 Para probar el build localmente:"
echo "   yarn preview"
echo "   Luego abre: http://localhost:4173"
echo ""
echo "📚 Documentación completa en:"
echo "   - PWA_BUILDER_READY.md"
echo "   - DEPLOYMENT_GUIDE.md"
echo ""
success "¡Build listo para PWA Builder!"

# Variables de Entorno para Railway

## Variables Requeridas

**Ninguna** - El proyecto funciona con valores por defecto sin necesidad de configurar variables de entorno.

## Variables Opcionales

### `VITE_API_BASE_URL` (Opcional)

**Descripción**: URL base de la API backend.

**Valor por defecto**: `https://cs2031-2025-2-hackathon-2-backend-production.up.railway.app/v1`

**Cuándo configurarla**: Solo si necesitas cambiar la URL de la API (por ejemplo, si tienes tu propia instancia del backend).

**Cómo configurarla en Railway**:
1. Ve a tu proyecto en Railway
2. Click en **"Variables"** en el menú lateral
3. Click en **"New Variable"**
4. Agrega:
   - **Variable**: `VITE_API_BASE_URL`
   - **Value**: `https://tu-api-url.com/v1`

**Nota importante**: 
- En Vite, todas las variables de entorno del frontend deben empezar con `VITE_`
- Las variables de entorno se inyectan en tiempo de build, no en tiempo de ejecución
- Si cambias esta variable, necesitarás hacer un nuevo deploy para que surta efecto

## Variables Automáticas (no necesitas configurarlas)

### `PORT` (Automática)

Railway establece automáticamente esta variable. El script `npm start` usa `${PORT:-3000}`, que significa:
- Usar la variable `PORT` si existe
- Usar `3000` como valor por defecto si no existe

**No necesitas configurar esta variable manualmente.**

## Resumen

Para el deployment básico en Railway: **No necesitas configurar ninguna variable de entorno**.

El proyecto funcionará con los valores por defecto configurados.


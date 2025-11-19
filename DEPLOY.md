# Guía de Deployment en Railway

Esta guía te ayudará a desplegar TechFlow Task Management en Railway.

## Prerrequisitos

- Cuenta de GitHub
- Cuenta de Railway ([railway.app](https://railway.app))
- Repositorio de GitHub con el código

## Pasos para Deploy

### 1. Preparar el Repositorio

Asegúrate de que tu código esté en GitHub:

```bash
git init
git add .
git commit -m "Ready for Railway deployment"
git branch -M main
git remote add origin <tu-repositorio-github-url>
git push -u origin main
```

### 2. Conectar Railway con GitHub

1. Ve a [Railway Dashboard](https://railway.app/dashboard)
2. Click en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Autoriza Railway para acceder a tu cuenta de GitHub si es necesario
5. Selecciona tu repositorio

### 3. Configuración Automática

Railway detectará automáticamente:
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Output Directory**: `dist`

### 4. Variables de Entorno (Opcional)

Si necesitas cambiar la URL de la API:

1. En Railway, ve a tu proyecto
2. Click en **"Variables"**
3. Agrega:
   - **Nombre**: `VITE_API_BASE_URL`
   - **Valor**: `https://cs2031-2025-2-hackathon-2-backend-production.up.railway.app/v1`

**Nota**: Si no configuras esta variable, se usará el valor por defecto.

### 5. Desplegar

Una vez conectado, Railway:
1. Automáticamente hará build del proyecto (`npm run build`)
2. Iniciará el servidor (`npm start`)
3. Proporcionará una URL pública para tu aplicación

### 6. Monitoreo

Railway proporciona:
- Logs en tiempo real
- Métricas de rendimiento
- Despliegues automáticos en cada push a `main`

## Configuración Manual (Alternativa)

Si prefieres usar Railway CLI:

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Iniciar sesión
railway login

# Inicializar proyecto
railway init

# Desplegar
railway up
```

## Solución de Problemas

### El build falla

- Verifica que todos los archivos estén commiteados
- Revisa los logs en Railway para errores específicos
- Asegúrate de que `package.json` tenga todos los scripts necesarios

### La aplicación no inicia

- Verifica que `serve` esté en `dependencies` (no `devDependencies`)
- Revisa los logs para errores de puerto
- Asegúrate de que el script `start` use `${PORT:-3000}`

### Errores de CORS

- Verifica que la URL de la API esté correcta
- Asegúrate de que la variable `VITE_API_BASE_URL` esté configurada si es necesario

## Verificación Post-Deploy

1. Accede a la URL proporcionada por Railway
2. Verifica que la aplicación carga correctamente
3. Prueba el login/registro
4. Verifica que las peticiones a la API funcionen

## Archivos de Configuración

El proyecto incluye:
- `railway.json` - Configuración de Railway
- `nixpacks.toml` - Configuración de Nixpacks (usado por Railway)
- `package.json` - Scripts de build y start

Estos archivos están preconfigurados y no necesitas modificarlos a menos que tengas requisitos específicos.


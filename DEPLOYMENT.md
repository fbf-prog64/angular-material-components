# GitHub Pages Deployment Guide

Este proyecto está configurado para ser desplegado en GitHub Pages de dos formas:

## Método 1: Automático con GitHub Actions (Recomendado)

El proyecto incluye un workflow de GitHub Actions que se ejecuta automáticamente cuando:

- Haces push a la rama `main` o `master`
- Creas un Pull Request
- Lo ejecutas manualmente desde la pestaña "Actions" en GitHub

### Configuración requerida en GitHub:

1. Ve a tu repositorio en GitHub
2. Ve a **Settings** > **Pages**
3. En **Source**, selecciona **GitHub Actions**
4. El workflow se ejecutará automáticamente en el próximo push

### URL del sitio:

Tu sitio estará disponible en: `https://fbf-prog64.github.io/angular-material-components/`

## Método 2: Deployment Manual

### Instalación de dependencias:

```bash
pnpm install
```

### Build y deploy:

```bash
# Opción 1: Un solo comando
pnpm run deploy:gh-pages

# Opción 2: Paso a paso
pnpm run build:gh-pages
npx angular-cli-ghpages --dir=dist/angular-material-components
```

## Scripts disponibles

- `pnpm run build:gh-pages` - Construye la aplicación para GitHub Pages
- `pnpm run deploy:gh-pages` - Construye y despliega en GitHub Pages
- `pnpm run build` - Build de producción estándar
- `pnpm run start` - Servidor de desarrollo

## Notas importantes

- El `base-href` está configurado como `/angular-material-components/` para GitHub Pages
- Los archivos se publican en la rama `gh-pages` automáticamente
- Asegúrate de que GitHub Pages esté habilitado en la configuración del repositorio

## Troubleshooting

Si tienes problemas con el deployment:

1. Verifica que el repositorio tenga habilitado GitHub Pages
2. Comprueba que la rama `gh-pages` se haya creado correctamente
3. Revisa los logs del GitHub Action en la pestaña "Actions"
4. Asegúrate de que no haya errores en el build

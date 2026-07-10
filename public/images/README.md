# Carpeta de imágenes

Coloca aquí las imágenes de fondo/branding del formulario. Los nombres de
archivo esperados (configurables en `src/config/theme.js`) son:

| Archivo           | Uso                                             | Tamaño sugerido      |
| ------------------ | ------------------------------------------------ | -------------------- |
| `portada.jpg`      | Imagen de la pantalla de bienvenida               | 1600×2000 px (retrato) |
| `logo.png`         | Logo institucional en el encabezado (fondo transparente) | 256×256 px      |
| `gracias.jpg`      | Imagen de la pantalla final de agradecimiento     | 1600×2000 px (retrato) |
| `fondo.jpg` (opcional) | Fondo global detrás de todo el formulario, si se define `backgroundImage` en `theme.js` | 1920×1080 px |

Si un archivo no existe, el componente simplemente lo oculta y usa el
fondo animado por defecto — no rompe la aplicación.

Formatos recomendados: `.jpg`/`.webp` para fotos (comprimidas, <300KB),
`.png`/`.svg` para logos con transparencia.

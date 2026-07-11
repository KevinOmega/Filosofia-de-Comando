# Encuesta · Filosofía de Mando Tipo Misión

Formulario tipo *typeform* construido con **Vue 3 + Vite**: una pregunta
por pantalla, mobile-first, con fondo animado, transiciones suaves y
envío automático de respuestas a **Google Sheets** (sin backend propio).

## Requisitos

- Node.js 18 o superior
- npm

## Puesta en marcha

```bash
npm install
npm run dev       # http://localhost:5173
```

Para producción:

```bash
npm run build      # genera la carpeta dist/
npm run preview    # sirve dist/ localmente para verificar el build
```

`dist/` es un sitio 100% estático: puedes subirlo a Vercel, Netlify,
GitHub Pages, Firebase Hosting, o cualquier hosting estático.

---

## Estructura del proyecto

```
src/
  data/questions.js        Preguntas de la encuesta (ver "Agregar/quitar preguntas")
  config/theme.js          Textos e imágenes de portada/cierre/fondo
  components/              Piezas visuales reutilizables
  views/SurveyForm.vue      Wizard: arma los pasos y controla la navegación
  services/googleSheets.js Envío del payload al Web App de Apps Script
public/images/              Coloca aquí tus imágenes (ver su README.md)
google-apps-script/Code.gs  Script para pegar en Google Apps Script
```

## Agregar o quitar preguntas

Todo el contenido de la encuesta vive en **`src/data/questions.js`**. No
hace falta tocar ningún componente:

- **Agregar una pregunta:** añade un objeto al array `questions`, con un
  `id` único, `dimension`, `indicator` y `text`. Si no defines `options`,
  usa automáticamente la escala Likert de 5 puntos (`likertOptions`).
- **Quitar una pregunta:** borra (o comenta) su objeto del array.
- **Cambiar la escala de una pregunta puntual:** agrega la propiedad
  `options: [...]` directamente en esa pregunta.
- **Datos personales** (nombre, correo): están en el array
  `personalFields` del mismo archivo. Son los únicos campos de texto
  libre; agregar uno nuevo es igual de sencillo (define `id`, `type`,
  `label`, `placeholder`, `icon`).

El wizard, la barra de progreso y las columnas que se envían a Google
Sheets se recalculan solos a partir de estos arrays.

## Personalizar imágenes, colores y textos

Edita **`src/config/theme.js`** para cambiar:

- `coverImage`, `logoImage`, `successImage`: rutas dentro de
  `public/images/` (ver `public/images/README.md` para tamaños
  sugeridos). Si un archivo no existe, simplemente se oculta — no rompe
  nada.
- `backgroundImage`: fondo global opcional detrás de todo el formulario.
- Textos de portada (`title`, `subtitle`, `description`,
  `startButtonLabel`) y de cierre (`thanksTitle`, `thanksMessage`).

Los colores de acento (morado/cian/rosa) y tipografías se definen como
variables CSS en `src/assets/styles.css` (`--accent-1`, `--accent-2`,
`--accent-3`) si quieres adaptarlos a la identidad del cliente.

---

## Conectar con Google Sheets

El formulario no tiene backend: envía las respuestas directamente a una
hoja de Google Sheets usando un **Google Apps Script** publicado como
"Web App". Sigue estos pasos:

### 1. Crea la hoja de cálculo

1. Ve a [sheets.google.com](https://sheets.google.com) y crea una hoja
   nueva (o usa una existente). Ponle un nombre, ej. `Encuesta Mando Misión`.

### 2. Agrega el script

1. En la hoja, ve a **Extensiones → Apps Script**.
2. Borra el contenido de `Code.gs` que aparece por defecto.
3. Copia y pega el contenido del archivo
   [`google-apps-script/Code.gs`](./google-apps-script/Code.gs) de este
   proyecto.
4. Guarda el proyecto (ícono de disquete o `Ctrl+S`). Puedes ponerle
   nombre, ej. `Encuesta - Receptor`.

Este script crea automáticamente una hoja llamada **"Respuestas"**, y
si en el futuro agregas o quitas preguntas en `questions.js`, agrega
las columnas nuevas solo, sin romper los datos existentes.

### 3. Publica el script como Web App

1. Arriba a la derecha, clic en **Implementar → Nueva implementación**.
2. En "Selecciona el tipo", elige **Aplicación web**.
3. Configura:
   - **Ejecutar como:** *Yo (tu cuenta)*
   - **Quién tiene acceso:** *Cualquier usuario*  (necesario para que el
     formulario público pueda enviar datos sin iniciar sesión)
4. Clic en **Implementar**.
5. Google te pedirá autorizar permisos la primera vez (es tu propio
   script, es seguro aceptarlo): elige tu cuenta → *Avanzado* → *Ir a
   [nombre del proyecto] (no seguro)* → *Permitir*.
6. Copia la **URL de la aplicación web** que te entrega (termina en
   `/exec`). Se ve así:

   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

> ⚠️ Cada vez que edites el script (`Code.gs`), debes crear una **nueva
> implementación** (o gestionar una implementación existente y subir
> versión) para que los cambios se apliquen a la URL pública.

### 4. Configura el formulario

1. Copia el archivo `.env.example` a `.env`:

   ```bash
   cp .env.example .env
   ```

2. Pega la URL copiada en el paso anterior:

   ```
   VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
   ```

3. Reinicia `npm run dev` (o vuelve a correr `npm run build` si ya
   estaba desplegado) para que Vite tome la nueva variable de entorno.

### 5. Prueba el envío

1. Completa la encuesta en el navegador hasta el final.
2. Abre tu Google Sheet: debería aparecer una hoja **"Respuestas"** con
   una fila nueva, incluyendo `grado`, `arma`, `nombre_completo`,
   `correo`, `fecha_envio` y una columna por cada pregunta (`p1`, `p2`,
   ...) con el valor numérico de la escala Likert (1 a 5), útil para
   análisis estadístico.

### Si ya tenías el script conectado y las columnas salen en desorden

Apps Script no garantiza el orden de las claves de `e.parameter` (por
eso columnas como `p1`, `p10`, `p11`, `p12`, `p2`... podían aparecer
alfabetizadas en vez de en el orden real de la encuesta). Esto ya está
corregido: el formulario ahora envía un campo extra `_column_order`
con el orden exacto, y `Code.gs` lo usa para escribir los encabezados.

Para aplicar la corrección si ya tenías el script desplegado:

1. Reemplaza el contenido de tu `Code.gs` en Apps Script por la versión
   actualizada de [`google-apps-script/Code.gs`](./google-apps-script/Code.gs).
2. Ve a **Implementar → Gestionar implementaciones**, edita tu
   implementación existente (ícono de lápiz) y sube una **Nueva
   versión**. Así la URL pública (`/exec`) no cambia y no necesitas
   tocar tu `.env`.
3. Si tu hoja **"Respuestas"** ya tiene filas guardadas con el
   encabezado en el orden incorrecto: como el script siempre escribe
   cada valor en la columna que coincide con el texto del encabezado
   (sin importar su posición), basta con **reordenar manualmente la
   fila 1** (arrastrando columnas o cortando/pegando celdas) al orden
   que prefieras una sola vez. Los envíos futuros seguirán
   respetando esa fila de encabezados tal cual la dejes.

### Notas técnicas

- La petición se envía con `fetch(..., { mode: 'no-cors' })` porque
  Apps Script no permite leer la respuesta desde el navegador (limitación
  conocida de CORS). Por eso el formulario no puede confirmar el
  contenido de la respuesta del servidor; se considera exitoso si la
  petición de red no falla. Si necesitas confirmación más estricta
  (por ejemplo reintentos automáticos con backoff), se puede migrar a
  un backend propio (Cloud Function, Vercel Function, etc.) que sí
  permita CORS controlado.
- Si despliegas el sitio en un dominio propio (Vercel, Netlify, etc.),
  recuerda configurar la variable de entorno `VITE_GOOGLE_SCRIPT_URL`
  también en el panel de esa plataforma, no solo en tu `.env` local.

---

## Buenas prácticas aplicadas

- **Contenido separado de la interfaz**: preguntas y textos viven en
  `src/data/questions.js` y `src/config/theme.js`; los componentes solo
  renderizan lo que reciben, así que agregar/quitar preguntas no
  requiere tocar Vue.
- **Componentes pequeños y de una sola responsabilidad**:
  `ChoiceQuestion`, `TextQuestion`, `ProgressBar`, `CoverScreen`,
  `SuccessScreen`, `BackgroundDecor`.
- **Accesibilidad básica**: roles ARIA en la barra de progreso,
  `autocomplete` en los campos personales, soporte de
  `prefers-reduced-motion`.
- **Mobile-first**: tipografía y espaciados con `clamp()`/unidades
  relativas, botones grandes pensados para dedo, `safe-area-inset` para
  notch/barra de gestos, layout de una sola columna con mejoras
  progresivas en pantallas más grandes.

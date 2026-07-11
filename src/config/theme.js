// ---------------------------------------------------------------------------
// Configuración visual centralizada. Aquí defines las imágenes de fondo
// y los textos de portada/cierre sin tocar los componentes.
//
// Coloca tus imágenes en `public/images/` y referencia el nombre de archivo.
// Si dejas `null`, se usa el fondo animado por defecto (sin imagen).
// ---------------------------------------------------------------------------

export const theme = {
  // Imagen de fondo global (detrás de todo el formulario). Ej: '/images/fondo.jpg'
  backgroundImage: null,

  // Imagen mostrada en la pantalla de portada (antes de iniciar la encuesta).
  coverImage: '/images/portada.jpg',

  // Imagen/logo mostrado en el encabezado (esquina o centrado). Ej: '/images/logo-ejercito.png'
  logoImage: '/images/logo.png',

  // Imagen mostrada en la pantalla de agradecimiento final.
  successImage: '/images/gracias.jpg',

  // Textos de portada
  title:
    'Filosofía de Mando Tipo Misión en el Ejército de Bolivia, para enfrentar los desafíos y amenazas emergentes del siglo XXI',
  description:
    'Tu opinión como profesional militar es clave para esta investigación. La encuesta toma menos de 5 minutos y tus respuestas son confidenciales.',
  startButtonLabel: 'Comenzar encuesta',

  // Textos de cierre
  thanksTitle: '¡Gracias por tu participación!',
  thanksMessage:
    'Tus respuestas fueron registradas correctamente y serán tratadas de forma confidencial. Tu aporte es muy valioso para esta investigación.',
}

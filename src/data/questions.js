// ---------------------------------------------------------------------------
// Fuente única de verdad para el contenido de la encuesta.
//
// Para AGREGAR una pregunta: añade un objeto al array `questions`.
// Para QUITAR una pregunta: elimina (o comenta) su objeto del array.
// El wizard, la barra de progreso y el envío a Google Sheets se adaptan
// automáticamente porque todo se genera a partir de este archivo.
// ---------------------------------------------------------------------------

/**
 * Escala Likert de 5 puntos reutilizada por todas las preguntas de
 * selección múltiple. Puedes definir una escala distinta por pregunta
 * agregando la propiedad `options` directamente en la pregunta.
 */
export const likertOptions = [
  { value: 1, label: 'Totalmente en desacuerdo' },
  { value: 2, label: 'En desacuerdo' },
  { value: 3, label: 'Ni de acuerdo, ni en desacuerdo' },
  { value: 4, label: 'De acuerdo' },
  { value: 5, label: 'Totalmente de acuerdo' },
]

/**
 * Campos de datos personales. Son los únicos campos de texto libre;
 * todo lo demás en `questions` debe ser de tipo "choice".
 */
export const personalFields = [
  {
    id: 'nombre_completo',
    type: 'text',
    label: 'Nombre completo',
    placeholder: 'Ej. Juan Pérez Quispe',
    autocomplete: 'name',
    icon: '🪖',
    required: true,
  },
  {
    id: 'correo',
    type: 'email',
    label: 'Correo electrónico',
    placeholder: 'nombre@correo.com',
    autocomplete: 'email',
    icon: '✉️',
    required: true,
  },
]

/**
 * Preguntas de la encuesta. Cada una pertenece a una `dimension` y a un
 * `indicator`, tal como en el instrumento original.
 *
 * Forma de un objeto pregunta:
 * {
 *   id: string            -> identificador único (se usa como columna en Sheets)
 *   dimension: string      -> dimensión del instrumento
 *   indicator: string      -> indicador específico
 *   text: string           -> enunciado de la pregunta
 *   type: 'choice'         -> tipo de control (por ahora solo 'choice')
 *   options?: Array        -> opcional, si no se define usa `likertOptions`
 *   required?: boolean     -> por defecto true
 * }
 */
export const questions = [
  {
    id: 'p1',
    dimension: 'Doctrina',
    indicator: 'Grado de necesidad de diseñar una filosofía de mando',
    text: '¿Considera que el Ejército de Bolivia necesita diseñar una filosofía de mando tipo misión para responder con mayor eficacia a los desafíos y amenazas emergentes del siglo XXI?',
    type: 'choice',
  },
  {
    id: 'p2',
    dimension: 'Doctrina',
    indicator: 'Nivel de adecuación doctrinal',
    text: '¿Considera que la doctrina vigente del Ejército de Bolivia requiere ser actualizada para incorporar los principios de la filosofía de mando tipo misión?',
    type: 'choice',
  },
  {
    id: 'p3',
    dimension: 'Recursos Humanos',
    indicator: 'Nivel de conocimiento del personal',
    text: '¿El personal militar posee conocimientos suficientes sobre los desafíos y amenazas emergentes del siglo XXI para aplicar una filosofía de mando tipo misión?',
    type: 'choice',
  },
  {
    id: 'p4',
    dimension: 'Recursos Humanos',
    indicator: 'Participación del personal en actividades con autonomía táctica',
    text: '¿Durante la formación, entrenamiento o desempeño profesional, el personal militar participa en actividades que fomentan la autonomía táctica y la toma descentralizada de decisiones?',
    type: 'choice',
  },
  {
    id: 'p5',
    dimension: 'Táctica',
    indicator: 'Nivel de preparación',
    text: '¿El personal militar se encuentra adecuadamente preparado para enfrentar escenarios operativos complejos mediante una filosofía de mando tipo misión?',
    type: 'choice',
  },
  {
    id: 'p6',
    dimension: 'Táctica',
    indicator: 'Nivel de efectividad táctica',
    text: '¿La aplicación de una filosofía de mando tipo misión permitiría mejorar la efectividad en la toma de decisiones durante operaciones complejas y cambiantes?',
    type: 'choice',
  },
  {
    id: 'p7',
    dimension: 'Estrategia',
    indicator: 'Nivel de adaptación estratégica',
    text: '¿El Ejército de Bolivia posee actualmente la capacidad de adaptarse con rapidez a los desafíos y amenazas emergentes del siglo XXI?',
    type: 'choice',
  },
  {
    id: 'p8',
    dimension: 'Estrategia',
    indicator: 'Participación del personal en la elaboración de planes',
    text: '¿El personal militar participa activamente en la elaboración de planes que incorporan principios de la filosofía de mando tipo misión?',
    type: 'choice',
  },
  {
    id: 'p9',
    dimension: 'Táctica (Variable Dependiente)',
    indicator: 'Planificación centralizada y ejecución descentralizada',
    text: '¿Una planificación centralizada con ejecución descentralizada contribuiría a incrementar la eficacia de las operaciones militares frente a amenazas emergentes?',
    type: 'choice',
  },
  {
    id: 'p10',
    dimension: 'Táctica (Variable Dependiente)',
    indicator: 'Preparación del personal para situaciones complejas',
    text: '¿El nivel actual de preparación del personal militar permite responder eficazmente a situaciones operativas complejas y cambiantes?',
    type: 'choice',
  },
  {
    id: 'p11',
    dimension: 'Apoyo al Desarrollo',
    indicator: 'Participación del Ejército en apoyo al desarrollo',
    text: '¿La aplicación de una filosofía de mando tipo misión fortalecería la participación del Ejército de Bolivia en acciones de apoyo al desarrollo nacional mediante una mayor iniciativa y autonomía de sus unidades?',
    type: 'choice',
  },
  {
    id: 'p12',
    dimension: 'Apoyo al Desarrollo',
    indicator: 'Efectividad de las operaciones en apoyo al desarrollo',
    text: '¿El mando tipo misión permitiría incrementar la efectividad de las operaciones militares de apoyo al desarrollo nacional, al facilitar una toma de decisiones más oportuna y descentralizada?',
    type: 'choice',
  },
]

/** Normaliza una pregunta agregando `options` y `required` por defecto. */
export function normalizeQuestion(question) {
  return {
    required: true,
    options: likertOptions,
    ...question,
  }
}

export const normalizedQuestions = questions.map(normalizeQuestion)

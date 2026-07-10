// ---------------------------------------------------------------------------
// Envío de respuestas a Google Sheets a través de un Google Apps Script
// desplegado como Web App. Ver README.md para la guía de configuración
// paso a paso.
//
// Se usa `mode: 'no-cors'` a propósito: Apps Script no permite leer la
// respuesta desde el navegador (problema conocido de CORS), así que el
// envío se considera exitoso si la petición de red no lanza una excepción.
// El propio Apps Script es responsable de registrar/validar los datos.
// ---------------------------------------------------------------------------

const ENDPOINT = import.meta.env.VITE_GOOGLE_SCRIPT_URL

/**
 * Envía las respuestas de la encuesta a Google Sheets.
 *
 * @param {Object} payload - Objeto plano { columna: valor } a registrar.
 * @returns {Promise<void>} Resuelve si la petición de red se realizó sin errores.
 * @throws {Error} Si falta configurar el endpoint o si la red falla.
 */
export async function submitToGoogleSheets(payload) {
  if (!ENDPOINT) {
    throw new Error(
      'Falta configurar VITE_GOOGLE_SCRIPT_URL en tu archivo .env. Revisa el README.md para la guía de conexión con Google Sheets.'
    )
  }

  const body = new URLSearchParams()
  Object.entries(payload).forEach(([key, value]) => {
    body.append(key, value ?? '')
  })

  await fetch(ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    body,
  })
}

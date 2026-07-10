/**
 * Pega este código en el editor de Apps Script de tu Google Sheet
 * (Extensiones > Apps Script). Ver README.md del proyecto para la guía
 * completa paso a paso.
 *
 * Este script:
 *  - Crea automáticamente la hoja "Respuestas" si no existe.
 *  - Escribe los encabezados a partir de las claves recibidas en el
 *    primer envío.
 *  - Si en el futuro agregas o quitas preguntas en `src/data/questions.js`,
 *    detecta columnas nuevas y las agrega solas al final, sin romper
 *    los datos ya guardados.
 */

const SHEET_NAME = 'Respuestas';

function doPost(e) {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) ||
    SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);

  const params = e.parameter;
  const incomingKeys = Object.keys(params);

  let headers;
  if (sheet.getLastRow() === 0) {
    headers = incomingKeys;
    sheet.appendRow(headers);
  } else {
    headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const missing = incomingKeys.filter((key) => headers.indexOf(key) === -1);
    if (missing.length > 0) {
      headers = headers.concat(missing);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
  }

  const row = headers.map((header) => (params[header] !== undefined ? params[header] : ''));
  sheet.appendRow(row);

  return ContentService.createTextOutput(JSON.stringify({ result: 'success' })).setMimeType(
    ContentService.MimeType.JSON
  );
}

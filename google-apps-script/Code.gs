/**
 * Pega este código en el editor de Apps Script de tu Google Sheet
 * (Extensiones > Apps Script). Ver README.md del proyecto para la guía
 * completa paso a paso.
 *
 * Este script:
 *  - Crea automáticamente la hoja "Respuestas" si no existe.
 *  - Escribe los encabezados en el mismo orden en que se hicieron las
 *    preguntas (usa el campo `_column_order` que envía el formulario,
 *    en vez de confiar en el orden de `e.parameter`, que Apps Script no
 *    garantiza y puede alfabetizar columnas como p1, p10, p11, p2...).
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
  const order = params._column_order
    ? JSON.parse(params._column_order)
    : Object.keys(params).filter((key) => key !== '_column_order');

  let headers;
  if (sheet.getLastRow() === 0) {
    headers = order;
    sheet.appendRow(headers);
  } else {
    headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const missing = order.filter((key) => headers.indexOf(key) === -1);
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

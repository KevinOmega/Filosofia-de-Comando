// ---------------------------------------------------------------------------
// Datos del "panel" de 30 oficiales seleccionados, extraídos manualmente de
// la hoja "Respuestas" de Google Sheets (columnas alineadas a mano por el
// desorden/columnas legado de la hoja: campos "_texto" vacíos y una columna
// "_column_order"). Se excluyen respuestas de personas fuera de esta lista.
//
// Formato por fila: [grado, arma, nombre_completo, p1..p12]
// ---------------------------------------------------------------------------

export const panelRows = [
  ['MAYOR', 'ARTILLERIA', 'FREDDY MAURICIO VALLE ROSSEL', 5, 4, 3, 3, 1, 5, 2, 2, 5, 2, 4, 5],
  ['TCNL.', 'DEM.', 'EDGAR ARIEL DIAZ ANDIA', 5, 5, 4, 4, 4, 5, 4, 4, 5, 4, 5, 5],
  ['MAYOR DEM.', 'CABALLERÍA', 'DEMIS HENRY LINARES ALARCON', 5, 5, 3, 5, 2, 5, 3, 4, 5, 2, 5, 5],
  ['CORONEL', 'INGENIERIA', 'PEDRO RENE WOLFF BALDIVIEZO', 4, 4, 4, 3, 4, 5, 2, 4, 5, 3, 5, 5],
  ['TENIENTE CORONEL', 'DEM. INFANTERÍA', 'JESÚS REYNALDO CANDIA MARQUEZ', 5, 5, 3, 3, 3, 5, 4, 5, 5, 5, 5, 5],
  ['MAYOR', 'CABALLERÍA', 'BRIAN ROLANDO FERNÁNDEZ SEJAS', 5, 5, 4, 3, 3, 5, 3, 3, 5, 3, 5, 5],
  ['TCNL.', 'INFANTERIA', 'GUSTAVO DENNYS GÓNGORA CÁCERES', 5, 5, 2, 2, 2, 5, 4, 4, 4, 4, 4, 5],
  ['TENIENTE CORONEL', 'DEM - INFANTERIA', 'WILSON ROLANDO ROMERO PRADO', 4, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  ['MAYOR', 'ARTILLERIA', 'JORGE ALEJANDRO HIDALGO REJAS', 5, 5, 2, 2, 2, 5, 4, 4, 5, 5, 5, 5],
  ['TENIENTE CORONEL', 'ARTILLERIA', 'JUAN CARLOS SOTO POLO', 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 3, 5],
  ['MAYOR', 'CABALLERÍA', 'PAOLO FAUSHINIO TORREZ DELGADO', 5, 5, 2, 2, 2, 5, 2, 3, 5, 2, 4, 4],
  ['MAYOR', 'ARTILLERIA', 'EDUARDO RODRIGUEZ SEJAS', 5, 5, 2, 1, 1, 5, 3, 2, 5, 5, 5, 5],
  ['CNL.', 'INFANTERIA', 'FERNANDO BOYAN', 5, 4, 3, 2, 2, 5, 3, 4, 5, 2, 4, 4],
  ['CORONEL', 'INFANTERÍA', 'ERICK RONALD GUTIERREZ BUSTAMANTE', 5, 5, 2, 2, 1, 5, 1, 2, 5, 2, 5, 5],
  ['MAYOR', 'INFANTERÍA', 'JAVIER MIGUEL ZELAYA', 5, 5, 3, 3, 2, 5, 4, 3, 5, 5, 5, 4],
  ['TENIENTE CORONEL', 'DEM', 'SERGIO HERNAN MORALES MILLAN', 5, 5, 3, 3, 1, 5, 1, 1, 4, 1, 5, 5],
  ['TENIENTE CORONEL', 'INFANTERÍA', 'MARCELO ABALOS ORTUÑO', 5, 4, 3, 4, 2, 4, 3, 3, 4, 3, 5, 5],
  ['CORONEL', 'INGENIERIA', 'JOSE LUIS JIMENEZ OLMOS', 5, 5, 2, 2, 1, 5, 2, 3, 5, 2, 5, 5],
  ['TENIENTE CORONEL', 'CABALLERIA', 'JORGE DANIEL FLORES GONZALES', 5, 5, 2, 2, 2, 5, 2, 2, 5, 2, 5, 5],
  ['TENIENTE CORONEL', 'INFANTERIA', 'EDSON ARAUJO ÁLVAREZ', 5, 5, 5, 2, 2, 5, 3, 5, 5, 2, 5, 5],
  ['CORONEL', 'ARTILLERIA', 'ALVARO ARMANDO ALARCON ANTEZANA', 2, 3, 2, 2, 2, 3, 2, 3, 2, 1, 1, 3],
  ['CORONEL', 'CABALLERÍA', 'MOSHÉ MEZA ZAIDUNI', 5, 5, 2, 1, 2, 5, 2, 2, 4, 2, 5, 4],
  ['MAYOR', 'ARTILLERIA (DEM)', 'ELVIS FIDEL CASTRO BALLON', 5, 4, 4, 5, 2, 5, 1, 2, 5, 5, 5, 5],
  ['MAYOR', 'ARTILLERÍA', 'BORIS DANIEL JIMÉNEZ PEÑA', 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 5],
  ['TENIENTE CORONEL', 'INGENIERIA', 'DIDIER KEVIN CHAMBILLA ALARCON', 5, 4, 2, 4, 3, 5, 3, 2, 5, 4, 4, 4],
  ['MAYOR', 'LOGISTICA', 'DAVID VALDIVIA SALAZAR', 5, 5, 4, 4, 2, 5, 3, 4, 4, 2, 5, 5],
  ['CORONEL', 'CABALLERIA', 'HUGO JAVIER SAENZ LOZA', 5, 5, 2, 2, 2, 5, 1, 2, 4, 2, 4, 4],
  ['TENIENTE CORONEL', 'ARTILLERIA', 'JOAN MANUEL VILLARROEL ESTRADA', 5, 5, 2, 1, 2, 5, 2, 2, 5, 2, 5, 5],
  ['TCNL', 'INFANTERIA', 'NORMAN JAIME DULON AGUILAR', 5, 5, 2, 3, 2, 4, 4, 3, 4, 3, 5, 5],
  ['TCNL. DEM.', 'CABALLERÍA', 'RICHTER R0JAS MEDINA', 5, 5, 1, 1, 1, 1, 1, 1, 2, 3, 5, 3],
]

export const questionInfo = {
  p1: { text: 'Necesidad de filosofía de mando tipo misión', dim: 'Doctrina' },
  p2: { text: 'Adecuación doctrinal', dim: 'Doctrina' },
  p3: { text: 'Conocimiento del personal', dim: 'Recursos Humanos' },
  p4: { text: 'Participación con autonomía táctica', dim: 'Recursos Humanos' },
  p5: { text: 'Nivel de preparación', dim: 'Táctica' },
  p6: { text: 'Efectividad táctica', dim: 'Táctica' },
  p9: { text: 'Planificación centralizada / ejecución descentralizada', dim: 'Táctica' },
  p10: { text: 'Preparación para situaciones complejas', dim: 'Táctica' },
  p7: { text: 'Adaptación estratégica institucional', dim: 'Estrategia' },
  p8: { text: 'Participación en elaboración de planes', dim: 'Estrategia' },
  p11: { text: 'Participación en apoyo al desarrollo', dim: 'Apoyo al Desarrollo' },
  p12: { text: 'Efectividad en apoyo al desarrollo', dim: 'Apoyo al Desarrollo' },
}

export const dimensionOrder = ['Doctrina', 'Recursos Humanos', 'Táctica', 'Estrategia', 'Apoyo al Desarrollo']

// Índice de cada pregunta dentro de cada fila de `panelRows`.
export const questionColumnIndex = {
  p1: 3, p2: 4, p3: 5, p4: 6, p5: 7, p6: 8, p7: 9, p8: 10, p9: 11, p10: 12, p11: 13, p12: 14,
}

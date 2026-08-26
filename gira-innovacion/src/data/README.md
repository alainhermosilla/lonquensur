# Fuente única de conocimiento de la Gira

Esta carpeta contiene los datos oficiales que deben compartir el sitio Astro y el futuro asistente RAG.

## Reglas

- Las páginas no deben mantener copias independientes de programa, visitas o encuestas.
- Los enlaces externos son referencias para el usuario, no fuentes autorizadas para el asistente.
- Un dato pendiente nunca debe completarse por inferencia.
- Las fechas relativas se interpretan en `America/Santiago`.
- Los datos personales y operativos deben clasificarse antes de incorporarlos al índice.
- El PDF del programa debe generarse desde esta fuente o considerarse una salida secundaria.

## Colecciones actuales

- `programa.ts`: días, jornadas, actividades y relaciones con visitas.
- `visitas.ts`: organizaciones anfitrionas y contenidos pedagógicos.
- `encuestas.ts`: ventanas de disponibilidad y formularios.
- `pendientes.ts`: vacíos editoriales y política mínima de respuesta.

## Próximas colecciones

- `informacion.ts`
- `avisos.ts`
- `faqs.ts`
- `alojamientos.ts`
- `cooperativas-participantes.ts`
- `participantes.ts` (solo después de definir privacidad y autenticación)

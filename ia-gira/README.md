# API cerrada del asistente de la Gira

Servicio RAG sin navegación web. Lee el archivo `conocimiento.json` generado por Astro, recupera fragmentos internos y consulta exclusivamente un modelo disponible por HTTP en localhost.

## Garantías iniciales

- Rechaza corpus con fragmentos no públicos.
- El modelo solo puede configurarse en `127.0.0.1`, `localhost` o `::1`.
- No tiene herramientas de navegación.
- Se abstiene si la recuperación no supera el umbral.
- Limita tamaño de preguntas, frecuencia y tiempo de respuesta.
- Solo acepta solicitudes desde el origen configurado.
- No incorpora participantes ni información restringida.

## Configuración

```env
HOST=127.0.0.1
PORT=8787
KNOWLEDGE_PATH=../gira-innovacion/dist/conocimiento.json
ALLOWED_ORIGIN=https://gira.lonquensur.cl
MODEL_BASE_URL=http://127.0.0.1:11434
MODEL_NAME=
TOP_K=5
MIN_SCORE=0.16
RATE_LIMIT_PER_MINUTE=20
```

`MODEL_NAME` es obligatorio para responder. Se deja vacío deliberadamente para no imponer ni descargar un modelo sin una decisión de infraestructura.

## Ejecución

Primero se construye el sitio Astro para generar el corpus. Después:

```sh
npm test
npm start
```

La API escucha en localhost por defecto. Debe publicarse detrás de un proxy HTTPS con límites adicionales y sin salida general a Internet.

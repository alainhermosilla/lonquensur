# Perfil de modelo para pgp-dev

Diagnóstico observado el 26 de agosto de 2026:

- 2 CPU;
- 3,8 GiB de RAM;
- 1,7 GiB de swap;
- sin GPU;
- 21 GiB de disco libre;
- Node.js 24 disponible;
- Ollama aún no instalado.

## Candidato inicial

`qwen3:1.7b`

El catálogo oficial de Ollama indica un tamaño aproximado de 1,4 GB, cuantización Q4_K_M y soporte multilingüe. Es el máximo razonable para una primera prueba en este host sin GPU.

Perfil de ejecución:

```env
MODEL_NAME=qwen3:1.7b
MODEL_NUM_CTX=4096
MODEL_NUM_PREDICT=220
```

La API desactiva el modo de razonamiento extendido, fija temperatura 0.1 y mantiene el modelo cargado solo durante cinco minutos. Esto reduce consumo y evita respuestas innecesariamente largas.

## Alternativa de contingencia

`gemma3:1b`, aproximadamente 815 MB según el catálogo oficial de Ollama. Se probará solamente si Qwen3 1.7B provoca uso sostenido de swap, latencia excesiva o respuestas inestables.

## Criterios mínimos

Antes de aceptar el modelo:

- completar los 15 casos RAG sin navegación ni invenciones;
- mediana inferior a 12 segundos por respuesta corta en desarrollo;
- ausencia de OOM y crecimiento sostenido de swap;
- respuesta en español clara;
- respeto consistente de la abstención;
- máximo 220 tokens de salida.

Fuentes oficiales:

- https://ollama.com/library/qwen3:1.7b
- https://ollama.com/library/gemma3
- https://docs.ollama.com/capabilities/thinking
- https://docs.ollama.com/faq

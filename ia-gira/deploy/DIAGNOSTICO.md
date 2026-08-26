# Diagnóstico previo del servidor

`diagnostico-host.sh` es de solo lectura. No instala paquetes, no inicia servicios y no cambia configuración.

Ejecución desde la raíz del repositorio:

```sh
bash ia-gira/deploy/diagnostico-host.sh
```

El resultado permite decidir:

- si corresponde un modelo solo CPU;
- cuánta cuantización cabe en memoria;
- si existe una GPU aprovechable;
- si Node.js está disponible como binario del sistema;
- si Ollama ya está instalado;
- si los puertos internos previstos ya están ocupados.

Después de instalar deliberadamente un modelo, `benchmark-model.mjs` mide latencia y velocidad sin contactar servicios externos:

```sh
MODEL_NAME=nombre-del-modelo node ia-gira/deploy/benchmark-model.mjs
```

No se debe elegir un modelo definitivo hasta revisar el diagnóstico y ejecutar la batería completa con sus respuestas.

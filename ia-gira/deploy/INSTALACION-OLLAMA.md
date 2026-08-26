# Instalación controlada de Ollama en pgp-dev

El script `instalar-ollama.sh` realiza únicamente estas operaciones:

1. comprueba arquitectura y memoria disponible;
2. descarga el instalador oficial de Ollama mediante HTTPS;
3. instala o reutiliza el servicio `ollama`;
4. fija el servicio en `127.0.0.1:11434`;
5. limita contexto, paralelismo y modelos cargados;
6. descarga `qwen3:1.7b`;
7. detiene Ollama si detecta que escucha fuera de loopback.

No instala la API de la Gira, no configura Nginx y no modifica el sitio publicado.

Después de ejecutarlo se debe correr el benchmark y revisar memoria:

```sh
MODEL_NAME=qwen3:1.7b node ia-gira/deploy/benchmark-model.mjs
free -h
ollama ps
```

Procedimiento oficial de referencia: https://docs.ollama.com/linux

# Despliegue de desarrollo

Estos archivos son plantillas. No se instalan ni activan automáticamente.

## Topología

```text
gira.lonquensur.cl
        │ HTTPS
        ▼
ia-gira.lonquensur.cl
        │ Nginx local
        ▼
127.0.0.1:8787  API RAG
        │ HTTP loopback
        ▼
127.0.0.1:11434 modelo local
```

## Directorios sugeridos

```text
/opt/ia-gira/app/                 código de ia-gira
/opt/ia-gira/conocimiento.json   corpus generado por Astro
/etc/ia-gira/ia-gira.env         configuración, modo 0600
```

El usuario de sistema `ia-gira` no debe tener shell, directorio personal ni permisos sobre otros proyectos.

## Secuencia de preparación

1. Crear el usuario y los directorios dedicados.
2. Instalar Node.js 22 mediante el mecanismo administrado del servidor y confirmar la ruta de `ExecStart`.
3. Copiar el servicio y el corpus generado desde la misma revisión Git.
4. Instalar el modelo local, sin exponer su puerto fuera de loopback.
5. Definir `MODEL_NAME` solo después de evaluar el modelo.
6. Instalar el servicio systemd y el virtual host de Nginx.
7. Validar configuración, iniciar el servicio y ejecutar pruebas de humo.
8. Configurar `PUBLIC_IA_API_URL` únicamente en el build del sitio de desarrollo.
9. No publicar en producción hasta aprobar la evaluación extremo a extremo.

## Cierre de red

La unidad systemd aplica `IPAddressDeny=any` y permite únicamente loopback. Esto impide que la API contacte Internet incluso si se introdujera accidentalmente una URL externa. La máquina debe complementar esta medida con:

- modelo enlazado exclusivamente a `127.0.0.1:11434`;
- Nginx como único proceso que publica la API;
- firewall de entrada limitado a HTTPS;
- DNS y certificados solo para el entorno elegido;
- registros sin cuerpos completos de preguntas.

## Actualización del conocimiento

Cada despliegue debe:

1. construir `gira-innovacion`;
2. verificar y copiar `dist/conocimiento.json`;
3. reiniciar `ia-gira`;
4. comprobar que `/health` informa el número esperado de fragmentos.

El asistente nunca descarga ni rastrea el sitio publicado.

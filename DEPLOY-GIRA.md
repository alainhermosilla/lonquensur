# Publicar gira.lonquensur.cl

Producción está alojada en HostGator. El workflow `.github/workflows/gira-deploy.yml` publica exclusivamente desde `main`, mediante ejecución manual (`workflow_dispatch`). No se publica por cada push o merge.

Los secretos de Actions `FTP_HOST`, `GIRA_FTP_USER` y `GIRA_FTP_PASSWORD` ya están configurados en `alainhermosilla/lonquensur`. No es necesario recuperar ni mostrar las contraseñas en cada conversación.

## Procedimiento

1. Preparar cambios en una rama, revisar y probar.
2. Obtener la autorización del usuario para producción y fusionar en `main`.
3. Ejecutar desde un equipo con GitHub CLI autenticado:

```bash
gh workflow run gira-deploy.yml --repo alainhermosilla/lonquensur --ref main
```

También se puede iniciar desde GitHub → Actions → Publicar Gira en HostGator → Run workflow → main.

4. Consultar el resultado en Actions. El flujo verifica que `deployment-version.txt` en el sitio público corresponde al commit construido. Un fallo de comprobación posterior puede ocurrir después de que se hayan transferido archivos; revisar el paso fallido antes de afirmar que no hubo publicación.

## Alcance y acceso

El workflow construye Astro con la API pública habilitada y ejecuta pruebas/evaluaciones de ia-gira, pero solo despliega el sitio estático. No actualiza el servicio IA en la VPS. No elimina archivos remotos sobrantes. Las cargas FTPS no son una transacción atómica: un fallo durante la transferencia puede dejar una versión parcial; una nueva ejecución correcta la completa.

La configuración TLS conserva la verificación de la cadena del certificado y el ajuste existente de HostGator por IP (`ssl:check-hostname false`).

En septiembre de 2026, el conector GitHub de esta conversación permite crear cambios, fusionar PR y consultar ejecuciones, pero no expone el inicio de `workflow_dispatch`. No prometer ejecución directa desde el chat si esa capacidad no está disponible. El usuario puede iniciar el comando anterior sin entrar a pgp-dev si tiene GitHub CLI autenticado en su equipo, o usar el navegador.

El método local anterior sigue disponible en pgp-dev mediante `scripts/deploy-gira.sh` y el archivo local `.env`. No subir `.env` al repositorio.

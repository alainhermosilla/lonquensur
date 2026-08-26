#!/usr/bin/env bash
set -u

echo "== Direcciones del servidor =="
hostname -f 2>/dev/null || hostname
ip -4 -o addr show scope global | awk '{print $2, $4}'
ip route show default 2>/dev/null || true

echo
echo "== Servicios web disponibles =="
for command_name in nginx caddy cloudflared certbot; do
  if command -v "$command_name" >/dev/null 2>&1; then
    printf '%-12s %s\n' "$command_name" "$(command -v "$command_name")"
  else
    printf '%-12s no instalado\n' "$command_name"
  fi
done

echo
echo "== Puertos web en escucha =="
ss -lntp '( sport = :80 or sport = :443 or sport = :8088 or sport = :8787 or sport = :11434 )' 2>/dev/null || true

echo
echo "== Estado de servicios conocidos =="
for service_name in nginx caddy cloudflared apache2; do
  if systemctl list-unit-files "$service_name.service" --no-legend 2>/dev/null | grep -q .; then
    printf '%-12s %s\n' "$service_name" "$(systemctl is-active "$service_name" 2>/dev/null || true)"
  fi
done

echo
echo "== Resolución DNS actual =="
for domain_name in gira.lonquensur.cl ia-gira.lonquensur.cl; do
  echo "-- $domain_name"
  getent ahostsv4 "$domain_name" 2>/dev/null | awk '!seen[$1]++ {print $1}' || true
done

echo
echo "== Firewall local (solo lectura) =="
if command -v ufw >/dev/null 2>&1; then
  sudo ufw status 2>/dev/null || true
elif command -v nft >/dev/null 2>&1; then
  sudo nft list ruleset 2>/dev/null | sed -n '1,160p' || true
else
  echo "No se encontró ufw ni nft en PATH."
fi

echo
echo "Diagnóstico terminado; no se modificó la configuración."

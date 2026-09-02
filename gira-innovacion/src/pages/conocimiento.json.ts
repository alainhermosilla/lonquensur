import type { APIRoute } from 'astro';
import { crearFragmentosPublicos } from '../data/conocimiento';

export const prerender = true;

export const GET: APIRoute = () => {
	const fragmentos = crearFragmentosPublicos();

	return new Response(JSON.stringify({
		version: 2,
		generadoDesde: 'fuente-unica-repositorio',
		evento: 'Gira de Innovación AGROCOOPINNOVA 2026',
		idioma: 'es-CL',
		zonaHoraria: 'America/Santiago',
		navegacionWebPermitida: false,
		total: fragmentos.length,
		fragmentos,
	}, null, 2), {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': 'public, max-age=300',
		},
	});
};

import { encuestas } from './encuestas';
import { jornadas } from './programa';
import { visitas } from './visitas';

export function validarFuenteUnica() {
	const errores: string[] = [];
	const idsVisitas = new Set<string>();
	const numerosVisitas = new Set<string>();

	for (const visita of visitas) {
		if (idsVisitas.has(visita.id)) errores.push(`ID de visita duplicado: ${visita.id}`);
		if (numerosVisitas.has(visita.numero)) errores.push(`Número de visita duplicado: ${visita.numero}`);
		idsVisitas.add(visita.id);
		numerosVisitas.add(visita.numero);
	}

	for (const jornada of jornadas) {
		if (jornada.visitaId && !idsVisitas.has(jornada.visitaId)) {
			errores.push(`La jornada ${jornada.id} referencia una visita inexistente: ${jornada.visitaId}`);
		}
	}

	for (const encuesta of encuestas) {
		if (encuesta.visitaId && !idsVisitas.has(encuesta.visitaId)) {
			errores.push(`La encuesta ${encuesta.id} referencia una visita inexistente: ${encuesta.visitaId}`);
		}
		if (new Date(encuesta.apertura).getTime() >= new Date(encuesta.cierre).getTime()) {
			errores.push(`La encuesta ${encuesta.id} no tiene una ventana temporal válida`);
		}
	}

	if (errores.length) {
		throw new Error(`Fuente única inválida:\n- ${errores.join('\n- ')}`);
	}
}

validarFuenteUnica();

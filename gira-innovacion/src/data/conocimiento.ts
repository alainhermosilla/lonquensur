import { encuestas } from './encuestas';
import { faqs } from './faqs';
import { recomendaciones } from './informacion';
import { jornadas } from './programa';
import { visitas } from './visitas';

export interface FragmentoConocimiento {
	id: string;
	tipo: 'programa' | 'visita' | 'recomendacion' | 'encuesta' | 'faq';
	titulo: string;
	texto: string;
	fuente: string;
	fecha?: string;
	visitaId?: string;
	categorias?: string[];
	respuestaDirecta?: string;
	visibilidad: 'publica';
}

export function crearFragmentosPublicos(): FragmentoConocimiento[] {
	const programa = jornadas.map((jornada) => ({
		id: `programa:${jornada.id}`,
		tipo: 'programa' as const,
		titulo: `${jornada.fechaTexto}: ${jornada.titulo}`,
		texto: [jornada.etiqueta, jornada.titulo, jornada.lugar, ...jornada.actividades.flatMap((actividad) => [actividad.titulo, actividad.descripcion])].join('\n'),
		fuente: '/programa/',
		fecha: jornada.fecha,
		visitaId: jornada.visitaId,
		visibilidad: 'publica' as const,
	}));

	const organizaciones = visitas.map((visita) => ({
		id: `visita:${visita.id}`,
		tipo: 'visita' as const,
		titulo: visita.nombre,
		texto: [visita.nombre, visita.lugar, visita.descripcion, `Temas: ${visita.temas.join(', ')}`, visita.interes, visita.pregunta].join('\n'),
		fuente: `/visitas/?visita=${visita.numero}`,
		visitaId: visita.id,
		visibilidad: 'publica' as const,
	}));

	const consejos = recomendaciones.map((recomendacion, indice) => ({
		id: `recomendacion:${String(indice + 1).padStart(2, '0')}`,
		tipo: 'recomendacion' as const,
		titulo: recomendacion.titulo,
		texto: [recomendacion.titulo, ...recomendacion.parrafos, recomendacion.destacado, recomendacion.nota].filter(Boolean).join('\n'),
		fuente: '/informacion/',
		visibilidad: 'publica' as const,
	}));

	const formularios = encuestas.map((encuesta) => ({
		id: `encuesta:${encuesta.id}`,
		tipo: 'encuesta' as const,
		titulo: encuesta.nombre,
		texto: [encuesta.nombre, `Lugar: ${encuesta.lugar}`, `Apertura: ${encuesta.aperturaTexto}`, `Cierre: ${encuesta.cierreTexto}`, 'Horarios expresados en hora de Chile.'].join('\n'),
		fuente: '/encuestas/',
		visitaId: encuesta.visitaId,
		visibilidad: 'publica' as const,
	}));

	const preguntas = faqs
		.filter((faq) => faq.estado === 'confirmado' && faq.visibilidad === 'publica')
		.map((faq) => ({
			id: `faq:${faq.id}`,
			tipo: 'faq' as const,
			titulo: faq.pregunta,
			texto: `${faq.pregunta}\n${faq.respuesta}`,
			fuente: 'fuente-interna:faqs',
			categorias: faq.categorias,
			respuestaDirecta: faq.respuesta,
			visibilidad: 'publica' as const,
		}));

	return [...programa, ...organizaciones, ...consejos, ...formularios, ...preguntas];
}

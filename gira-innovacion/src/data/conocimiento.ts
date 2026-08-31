import { encuestas } from './encuestas';
import { faqs } from './faqs';
import { contactos, recomendaciones } from './informacion';
import { cooperativasParticipantes } from './cooperativas-participantes';
import { jornadas } from './programa';
import { visitas } from './visitas';

export interface FragmentoConocimiento {
	id: string;
	tipo: 'programa' | 'visita' | 'recomendacion' | 'contacto' | 'encuesta' | 'faq' | 'cooperativa-participante';
	titulo: string;
	texto: string;
	fuente: string;
	fecha?: string;
	visitaId?: string;
	categorias?: string[];
	consultas?: string[];
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
		texto: [visita.nombre, visita.lugar, visita.descripcion, `Temas: ${visita.temas.join(', ')}`, visita.interes, visita.pregunta, visita.web ? `Sitio oficial: ${visita.web}` : ''].filter(Boolean).join('\n'),
		fuente: `/visitas/?visita=${visita.numero}`,
		visitaId: visita.id,
		visibilidad: 'publica' as const,
	}));
	const sitiosOficiales = visitas
		.filter((visita) => visita.web)
		.map((visita) => {
			const respuesta = `Puedes obtener más información sobre ${visita.nombre} en su sitio oficial: ${visita.web}`;
			return {
				id: `faq:mas-info-${visita.id}`,
				tipo: 'faq' as const,
				titulo: `¿Dónde puedo obtener más información sobre ${visita.nombre}?`,
				texto: respuesta,
				fuente: `/visitas/?visita=${visita.numero}`,
				categorias: ['sitio oficial', 'web', 'más información', visita.nombre],
				consultas: [
					`¿Dónde puedo obtener más información sobre ${visita.nombre}?`,
					`¿Cuál es la página web de ${visita.nombre}?`,
					`¿Cuál es el sitio oficial de ${visita.nombre}?`,
					`Quiero saber más sobre ${visita.nombre}`,
				],
				respuestaDirecta: respuesta,
				visibilidad: 'publica' as const,
			};
		});

	const consejos = recomendaciones.map((recomendacion, indice) => ({
		id: `recomendacion:${String(indice + 1).padStart(2, '0')}`,
		tipo: 'recomendacion' as const,
		titulo: recomendacion.titulo,
		texto: [recomendacion.titulo, ...recomendacion.parrafos, recomendacion.destacado, recomendacion.nota].filter(Boolean).join('\n'),
		fuente: '/informacion/',
		visibilidad: 'publica' as const,
	}));

	const equipo = contactos.map(([nombre, funcion, telefono], indice) => ({
		id: `contacto:${String(indice + 1).padStart(2, '0')}`,
		tipo: 'contacto' as const,
		titulo: `${nombre} — ${funcion}`,
		texto: [
			'Contacto del equipo de la Gira de Innovación AgrocoopInnova 2026',
			`Nombre: ${nombre}`,
			`Función: ${funcion}`,
			`Teléfono: ${telefono}`,
		].join('\n'),
		fuente: '/informacion/',
		categorias: ['contactos', 'equipo', 'telefono', 'coordinacion'],
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

	const cooperativasConfirmadas = cooperativasParticipantes.filter((cooperativa) => cooperativa.estado === 'confirmado');
	const cooperativasConRepresentante = cooperativasConfirmadas.filter((cooperativa) => cooperativa.enviaRepresentante).length;
	const listaCooperativas = cooperativasConfirmadas.map((cooperativa, indice) => (
		`${indice + 1}.\n${cooperativa.nombre}\n${cooperativa.region}\nEstado: ${cooperativa.enviaRepresentante ? 'Enviará representante' : 'No enviará representante según la nómina actual'}`
	));
	const respuestaCooperativas = `La nómina contempla ${cooperativasConfirmadas.length} cooperativas admitidas:\n\n${listaCooperativas.join('\n\n')}\n\nSegún la nómina actual, ${cooperativasConRepresentante} cooperativas enviarán representante y ${cooperativasConfirmadas.length - cooperativasConRepresentante} no enviará representante. Esta situación puede cambiar.`;
	const faqCooperativas = {
		id: 'faq:cooperativas-participantes',
		tipo: 'faq' as const,
		titulo: '¿Cuáles son las cooperativas admitidas para la Gira?',
		texto: respuestaCooperativas,
		fuente: 'fuente-interna:cooperativas-participantes',
		categorias: ['cooperativas', 'participantes', 'admitidas', 'representante', 'regiones'],
		consultas: [
			'¿Cuáles son las cooperativas que participan de la gira?',
			'¿Qué cooperativas fueron admitidas?',
			'¿Cuál es la lista de cooperativas participantes?',
			'¿Qué cooperativas enviarán representante?',
			'¿De qué regiones son las cooperativas participantes?',
		],
		respuestaDirecta: respuestaCooperativas,
		visibilidad: 'publica' as const,
	};
	const cooperativas = cooperativasConfirmadas.map((cooperativa) => ({
		id: `cooperativa-participante:${cooperativa.id}`,
		tipo: 'cooperativa-participante' as const,
		titulo: cooperativa.nombre,
		texto: [
			`Cooperativa admitida para la Gira de Innovación AGROCOOPINNOVA 2026: ${cooperativa.nombre}.`,
			`Región: ${cooperativa.region}.`,
			cooperativa.enviaRepresentante ? 'Enviará representante.' : 'No enviará representante según la nómina actual.',
		].join('\n'),
		fuente: 'fuente-interna:cooperativas-participantes',
		categorias: ['cooperativas', 'participantes', 'admitidas', 'representante', cooperativa.region],
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
			consultas: [faq.pregunta, ...(faq.variantes ?? [])],
			respuestaDirecta: faq.respuesta,
			visibilidad: 'publica' as const,
		}));

	return [...programa, ...organizaciones, ...sitiosOficiales, ...consejos, ...equipo, ...formularios, faqCooperativas, ...cooperativas, ...preguntas];
}

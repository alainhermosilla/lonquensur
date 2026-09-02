import { encuestas } from './encuestas';
import { faqs } from './faqs';
import { contactos, recomendaciones } from './informacion';
import { alojamientos } from './alojamientos';
import { alimentacion } from './alimentacion';
import { cooperativasParticipantes } from './cooperativas-participantes';
import { jornadas } from './programa';
import { visitas } from './visitas';

export interface FragmentoConocimiento {
	id: string;
	tipo: 'programa' | 'visita' | 'alojamiento' | 'alimentacion' | 'recomendacion' | 'contacto' | 'encuesta' | 'faq' | 'cooperativa-participante';
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

export function validarFragmentosPublicos(fragmentos: FragmentoConocimiento[]): void {
	const ids = new Set<string>();
	const errores: string[] = [];

	for (const [indice, fragmento] of fragmentos.entries()) {
		const referencia = fragmento.id || `posición ${indice + 1}`;
		if (!fragmento.id.trim()) errores.push(`Fragmento sin id en la posición ${indice + 1}`);
		if (ids.has(fragmento.id)) errores.push(`Id duplicado: ${fragmento.id}`);
		ids.add(fragmento.id);
		if (!fragmento.titulo.trim()) errores.push(`${referencia}: título vacío`);
		if (!fragmento.texto.trim()) errores.push(`${referencia}: texto vacío`);
		if (!fragmento.fuente.trim()) errores.push(`${referencia}: fuente vacía`);
		if (fragmento.visibilidad !== 'publica') errores.push(`${referencia}: visibilidad no pública`);
		if (fragmento.respuestaDirecta && !(fragmento.consultas?.length)) {
			errores.push(`${referencia}: respuesta directa sin consultas asociadas`);
		}
		if (fragmento.consultas?.some((consulta) => !consulta.trim())) {
			errores.push(`${referencia}: contiene una consulta vacía`);
		}
	}

	if (errores.length) {
		throw new Error(`Corpus público inválido:\n- ${errores.join('\n- ')}`);
	}
}

export function crearFragmentosPublicos(): FragmentoConocimiento[] {
	const aliasesPorVisita: Record<string, string[]> = {
		'fundacion-origen': ['Fundación Origen', 'Origen'],
		ceta: ['CeTA', 'CETA', 'Centro Tecnológico para la Innovación Alimentaria'],
		'agricola-cinco-valles': ['Agrícola Cinco Valles', 'Cinco Valles', '5 Valles'],
		coopeumo: ['COOPEUMO', 'Cooperativa Peumo', 'Cooperativa de Peumo'],
		'tres-piedras': ['Cooperativa Tres Piedras', 'Cooperativa Campesina Tres Piedras', 'Tres Piedras'],
		loncomilla: ['Cooperativa Loncomilla', 'Cooperativa Vitivinícola Loncomilla', 'Loncomilla'],
		coopcam: ['COOPCAM', 'COOPCAAM', 'Mujeres de Pelarco', 'Cooperativa Mujeres de Pelarco', 'Cooperativa Campesina Mujeres de Pelarco'],
	};
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
		texto: [visita.nombre, `También conocida como: ${(aliasesPorVisita[visita.id] ?? []).join(', ')}`, visita.lugar, visita.descripcion, `Temas: ${visita.temas.join(', ')}`, visita.interes, visita.pregunta, visita.web ? `Sitio oficial: ${visita.web}` : ''].filter(Boolean).join('\n'),
		fuente: `/visitas/?visita=${visita.numero}`,
		visitaId: visita.id,
		visibilidad: 'publica' as const,
	}));
	const descripcionesOrganizaciones = visitas.map((visita) => {
		const respuesta = `${visita.nombre} es una de las organizaciones que visitará la Gira de Innovación AGROCOOPINNOVA 2026. ${visita.descripcion} Está ubicada en ${visita.lugar}.`;
		const consultasPorAlias = (aliasesPorVisita[visita.id] ?? [visita.nombre]).flatMap((alias) => [
			`¿Qué es ${alias}?`,
			`¿Qué hace ${alias}?`,
			`Háblame de ${alias}`,
		]);
		return {
			id: `faq:que-es-${visita.id}`,
			tipo: 'faq' as const,
			titulo: `¿Qué es ${visita.nombre}?`,
			texto: respuesta,
			fuente: `/visitas/?visita=${visita.numero}`,
			categorias: ['organización', 'visita', 'descripción', ...(aliasesPorVisita[visita.id] ?? [])],
			consultas: consultasPorAlias,
			respuestaDirecta: respuesta,
			visibilidad: 'publica' as const,
		};
	});
	const ubicacionesOrganizaciones = visitas.map((visita) => {
		const respuesta = `${visita.nombre} está ubicada en ${visita.lugar}.`;
		const consultasPorAlias = (aliasesPorVisita[visita.id] ?? [visita.nombre]).flatMap((alias) => [
			`¿Dónde está ${alias}?`,
			`¿Dónde queda ${alias}?`,
			`¿En qué comuna está ${alias}?`,
		]);
		return {
			id: `faq:donde-esta-${visita.id}`,
			tipo: 'faq' as const,
			titulo: `¿Dónde está ${visita.nombre}?`,
			texto: respuesta,
			fuente: `/visitas/?visita=${visita.numero}`,
			categorias: ['ubicación', 'comuna', 'región', ...(aliasesPorVisita[visita.id] ?? [])],
			consultas: consultasPorAlias,
			respuestaDirecta: respuesta,
			visibilidad: 'publica' as const,
		};
	});
	const fechasOrganizaciones = visitas.map((visita) => {
		const jornadasVisita = jornadas.filter((jornada) => jornada.visitaId === visita.id);
		const detalles = jornadasVisita.map((jornada) => `${jornada.fechaTexto}, ${jornada.etiqueta.toLowerCase()}, en ${jornada.lugar}`).join('; ');
		const respuesta = jornadasVisita.length
			? `La visita a ${visita.nombre} está programada para: ${detalles}.`
			: `No tengo una fecha oficial publicada para la visita a ${visita.nombre}.`;
		const consultasPorAlias = (aliasesPorVisita[visita.id] ?? [visita.nombre]).flatMap((alias) => [
			`¿Cuándo visitamos ${alias}?`,
			`¿Qué día vamos a ${alias}?`,
			`¿En qué fecha visitaremos ${alias}?`,
		]);
		return {
			id: `faq:cuando-visita-${visita.id}`,
			tipo: 'faq' as const,
			titulo: `¿Cuándo visitamos ${visita.nombre}?`,
			texto: respuesta,
			fuente: '/programa/',
			fecha: jornadasVisita[0]?.fecha,
			visitaId: visita.id,
			categorias: ['programa', 'fecha', 'día', 'visita', ...(aliasesPorVisita[visita.id] ?? [])],
			consultas: consultasPorAlias,
			respuestaDirecta: respuesta,
			visibilidad: 'publica' as const,
		};
	});
	const actividadesOrganizaciones = visitas.map((visita) => {
		const jornadasVisita = jornadas.filter((jornada) => jornada.visitaId === visita.id);
		const actividades = jornadasVisita.flatMap((jornada) => jornada.actividades.map((actividad) => `${actividad.titulo}: ${actividad.descripcion}`));
		const respuesta = `En la visita a ${visita.nombre} conoceremos: ${actividades.join(' ')}`;
		const consultasPorAlias = (aliasesPorVisita[visita.id] ?? [visita.nombre]).flatMap((alias) => [
			`¿Qué hacemos en ${alias}?`,
			`¿Qué aprenderemos en ${alias}?`,
			`¿Qué conoceremos en ${alias}?`,
		]);
		return {
			id: `faq:actividades-visita-${visita.id}`,
			tipo: 'faq' as const,
			titulo: `¿Qué haremos en ${visita.nombre}?`,
			texto: respuesta,
			fuente: '/programa/',
			visitaId: visita.id,
			categorias: ['programa', 'actividades', 'aprendizaje', 'visita', ...(aliasesPorVisita[visita.id] ?? [])],
			consultas: consultasPorAlias,
			respuestaDirecta: respuesta,
			visibilidad: 'publica' as const,
		};
	});
	const sitiosOficiales = visitas
		.filter((visita) => visita.web)
		.map((visita) => {
			const respuesta = `Puedes obtener más información sobre ${visita.nombre} en su sitio oficial: ${visita.web}`;
			const consultasPorAlias = (aliasesPorVisita[visita.id] ?? [visita.nombre]).flatMap((alias) => [
				`¿Dónde puedo obtener más info sobre ${alias}?`,
				`¿Cuál es la web de ${alias}?`,
				`¿Cuál es el sitio oficial de ${alias}?`,
			]);
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
					...consultasPorAlias,
				],
				respuestaDirecta: respuesta,
				visibilidad: 'publica' as const,
			};
		});

	const hospedajes = alojamientos
		.filter((alojamiento) => alojamiento.estado === 'confirmado' && alojamiento.visibilidad === 'publica')
		.map((alojamiento) => ({
			id: `alojamiento:${alojamiento.id}`,
			tipo: 'alojamiento' as const,
			titulo: alojamiento.nombre,
			texto: [
				`Alojamiento oficial de la Gira: ${alojamiento.nombre}.`,
				`Dirección: ${alojamiento.direccion}.`,
				`Estadía desde el ${alojamiento.desde} hasta el ${alojamiento.hasta}.`,
			].join('\n'),
			fuente: 'fuente-interna:base-informacion-web',
			fecha: alojamiento.desde,
			categorias: ['alojamiento', 'hotel', 'hospedaje', 'dirección'],
			visibilidad: 'publica' as const,
		}));
	const respuestaAlojamientos = 'La Gira contempla dos alojamientos oficiales:\n\n- Hotel DA Aeropuerto: Av. Américo Vespucio Oriente 1299, comuna de Pudahuel, Región Metropolitana. Corresponde a las noches del domingo 6, lunes 7 y martes 8 de septiembre.\n- Hotel DA Talca: Calle 4 Poniente 1011, comuna de Talca, Región del Maule. Corresponde a las noches del miércoles 9 y jueves 10 de septiembre.';
	const faqAlojamientos = {
		id: 'faq:alojamientos-gira',
		tipo: 'faq' as const,
		titulo: '¿Qué hoteles están incluidos en la Gira?',
		texto: respuestaAlojamientos,
		fuente: 'fuente-interna:base-informacion-web',
		categorias: ['alojamiento', 'alojamientos', 'hotel', 'hoteles', 'hospedaje', 'direcciones'],
		consultas: [
			'¿Qué hoteles están en la gira?',
			'¿Cuáles son los hoteles de la gira?',
			'¿Dónde nos alojaremos durante la gira?',
			'¿Dónde vamos a dormir?',
			'¿Cuáles son las direcciones de los hoteles?',
			'¿En qué hoteles nos quedaremos?',
		],
		respuestaDirecta: respuestaAlojamientos,
		visibilidad: 'publica' as const,
	};
	const respuestasAlojamientos = alojamientos
		.filter((alojamiento) => alojamiento.estado === 'confirmado' && alojamiento.visibilidad === 'publica')
		.map((alojamiento) => {
			const enTalca = alojamiento.id === 'hotel-da-talca';
			const dias = enTalca ? [9, 10] : [6, 7, 8];
			const noches = enTalca
				? 'las noches del miércoles 9 y jueves 10 de septiembre de 2026'
				: 'las noches del domingo 6, lunes 7 y martes 8 de septiembre de 2026';
			const respuesta = `${alojamiento.nombre} está ubicado en ${alojamiento.direccion}. Es el alojamiento previsto para ${noches}.`;
			return {
				id: `faq:${alojamiento.id}`,
				tipo: 'faq' as const,
				titulo: `Información de ${alojamiento.nombre}`,
				texto: respuesta,
				fuente: 'fuente-interna:base-informacion-web',
				categorias: ['alojamiento', 'hotel', 'dirección', alojamiento.nombre, enTalca ? 'Talca' : 'Pudahuel'],
				consultas: [
					`¿Cuál es la dirección del ${alojamiento.nombre}?`,
					`¿Dónde queda el ${alojamiento.nombre}?`,
					`¿Qué noches estaremos en el ${alojamiento.nombre}?`,
					`¿Cuándo nos alojamos en el ${alojamiento.nombre}?`,
					...dias.flatMap((dia) => [
						`¿En qué hotel nos quedamos el día ${dia} de septiembre?`,
						`¿Dónde dormimos el ${dia} de septiembre?`,
					]),
				],
				respuestaDirecta: respuesta,
				visibilidad: 'publica' as const,
			};
		});
	const almuerzos = alimentacion.map((lugar) => ({
		id: `alimentacion:${lugar.id}`,
		tipo: 'alimentacion' as const,
		titulo: lugar.nombre,
		texto: [
			`Almuerzo del ${lugar.fecha}: ${lugar.nombre}.`,
			`Ubicación: ${lugar.ubicacion}.`,
			`Dirección: ${lugar.direccion}.`,
			lugar.detalle,
			`Estado de la información: ${lugar.estado}.`,
		].join('\n'),
		fuente: 'fuente-interna:base-informacion-web',
		fecha: lugar.fecha,
		categorias: ['alimentación', 'almuerzo', 'restaurante', lugar.estado],
		visibilidad: 'publica' as const,
	}));
	const respuestasAlmuerzos = alimentacion.map((lugar) => {
		const fecha = new Intl.DateTimeFormat('es-CL', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
			.format(new Date(`${lugar.fecha}T00:00:00Z`));
		const diaMes = Number(lugar.fecha.slice(-2));
		const pendiente = lugar.estado === 'pendiente';
		const respuesta = pendiente
			? `El ${fecha} está previsto almorzar en San Vicente de Tagua Tagua, pero el restaurante y la dirección todavía están por confirmar.`
			: `El ${fecha} el almuerzo está previsto en ${lugar.nombre}, ${lugar.direccion}, ${lugar.ubicacion}. ${lugar.detalle}`;
		return {
			id: `faq:almuerzo-${lugar.fecha}`,
			tipo: 'faq' as const,
			titulo: `¿Dónde almorzamos el ${fecha}?`,
			texto: respuesta,
			fuente: 'fuente-interna:base-informacion-web',
			fecha: lugar.fecha,
			categorias: ['alimentación', 'almuerzo', 'restaurante', lugar.nombre, lugar.ubicacion],
			consultas: [
				`¿Dónde almorzamos el ${fecha}?`,
				`¿En qué restaurante comemos el ${fecha}?`,
				`¿Cuál es el almuerzo del ${fecha}?`,
				`¿Dónde será el almuerzo del ${fecha}?`,
				`¿Dónde almorzamos el día ${diaMes} de septiembre?`,
				`¿En qué restaurante comemos el ${diaMes} de septiembre?`,
			],
			respuestaDirecta: respuesta,
			visibilidad: 'publica' as const,
		};
	});
	const respuestaGeneralAlmuerzos = "La información publicada contempla estos almuerzos:\n\n- Martes 8: Forestani Restaurant, Av. Vicuña Mackenna 522, comuna de Melipilla, Región Metropolitana.\n- Miércoles 9: comuna de San Vicente de Tagua Tagua, Región de O'Higgins; el restaurante y la dirección están por confirmar.\n- Jueves 10: Toro Macho, lado oriente del río Loncomilla, comuna de Villa Alegre, Región del Maule.\n- Viernes 11: Juan y Medio, Longitudinal Sur Km 109, comuna de Rengo, Región de O'Higgins.\n\nEl documento no publica un lugar de almuerzo para el lunes 7.";
	const faqAlmuerzos = {
		id: 'faq:almuerzos-gira',
		tipo: 'faq' as const,
		titulo: '¿Dónde almorzamos durante la Gira?',
		texto: respuestaGeneralAlmuerzos,
		fuente: 'fuente-interna:base-informacion-web',
		categorias: ['alimentación', 'almuerzos', 'restaurantes', 'comidas'],
		consultas: ['¿Dónde almorzamos?', '¿Dónde serán los almuerzos?', '¿En qué restaurantes comeremos?', '¿Cuáles son los restaurantes de la gira?'],
		respuestaDirecta: respuestaGeneralAlmuerzos,
		visibilidad: 'publica' as const,
	};

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
	const respuestasContactos = contactos.map(([nombre, funcion, telefono], indice) => {
		const primerNombre = nombre.split(' ')[0];
		const respuesta = `${nombre} es ${funcion} de la Gira de Innovación AGROCOOPINNOVA 2026. Su teléfono de contacto es ${telefono}.`;
		return {
			id: `faq:contacto-${String(indice + 1).padStart(2, '0')}`,
			tipo: 'faq' as const,
			titulo: `Contacto de ${nombre}`,
			texto: respuesta,
			fuente: '/informacion/',
			categorias: ['contacto', 'teléfono', 'equipo', 'coordinación', nombre, primerNombre],
			consultas: [
				`¿Cuál es el teléfono de ${nombre}?`,
				`¿Cómo contacto a ${nombre}?`,
				`¿Qué función tiene ${nombre}?`,
				`¿Cuál es el teléfono de ${primerNombre}?`,
				`¿Cómo contacto a ${primerNombre}?`,
			],
			respuestaDirecta: respuesta,
			visibilidad: 'publica' as const,
		};
	});
	const formularios = encuestas.map((encuesta) => ({
		id: `encuesta:${encuesta.id}`,
		tipo: 'encuesta' as const,
		titulo: encuesta.nombre,
		texto: [encuesta.nombre, `Lugar: ${encuesta.lugar}`, `Apertura: ${encuesta.aperturaTexto}`, `Cierre: ${encuesta.cierreTexto}`, 'Horarios expresados en hora de Chile.'].join('\n'),
		fuente: '/encuestas/',
		visitaId: encuesta.visitaId,
		visibilidad: 'publica' as const,
	}));
	const respuestasEncuestas = encuestas.map((encuesta) => {
		const visita = visitas.find((item) => item.id === encuesta.visitaId);
		const aliases = aliasesPorVisita[encuesta.visitaId] ?? [visita?.nombre ?? encuesta.lugar];
		const respuesta = `${encuesta.nombre}. Abre: ${encuesta.aperturaTexto}. Cierra: ${encuesta.cierreTexto}. Horarios expresados en hora de Chile. Formulario oficial: ${encuesta.enlace}`;
		return {
			id: `faq:encuesta-${encuesta.id}`,
			tipo: 'faq' as const,
			titulo: `Información de la encuesta de ${visita?.nombre ?? encuesta.lugar}`,
			texto: respuesta,
			fuente: '/encuestas/',
			visitaId: encuesta.visitaId,
			categorias: ['encuesta', 'formulario', 'apertura', 'cierre', 'enlace', ...aliases],
			consultas: aliases.flatMap((alias) => [
				`¿Cuándo abre la encuesta de ${alias}?`,
				`¿Cuándo cierra la encuesta de ${alias}?`,
				`¿Hasta cuándo puedo responder la encuesta de ${alias}?`,
				`¿Cuál es el enlace de la encuesta de ${alias}?`,
				`¿Dónde respondo el formulario de ${alias}?`,
			]),
			respuestaDirecta: respuesta,
			visibilidad: 'publica' as const,
		};
	});
	const traslados = [
		{
			id: 'faq:llegada-santiago', tipo: 'faq' as const, titulo: '¿Cuándo es la llegada a Santiago?',
			texto: 'La llegada de los participantes a Santiago está programada para el domingo 6 de septiembre de 2026 durante la tarde, aproximadamente después de las 18:00 horas. El punto de encuentro exacto aún no está publicado.',
			fuente: '/programa/', categorias: ['llegada', 'Santiago', 'traslado', 'domingo 6'],
			consultas: ['¿Cuándo debemos llegar a Santiago?', '¿A qué hora llegamos el domingo?', '¿Cuál es el punto de encuentro en Santiago?', '¿Cuándo comienza la gira?'],
			respuestaDirecta: 'La llegada de los participantes a Santiago está programada para el domingo 6 de septiembre de 2026 durante la tarde, aproximadamente después de las 18:00 horas. El punto de encuentro exacto aún no está publicado.', visibilidad: 'publica' as const,
		},
		{
			id: 'faq:traslado-talca', tipo: 'faq' as const, titulo: '¿Cuándo es el traslado a Talca?',
			texto: "El traslado a Talca está programado para la tarde del miércoles 9 de septiembre de 2026, después de la jornada en COOPEUMO. El programa indica el viaje desde la Región de O'Higgins hacia Talca, pero no publica una hora exacta.",
			fuente: '/programa/', categorias: ['traslado', 'Talca', 'miércoles 9', 'COOPEUMO'],
			consultas: ['¿Cuándo viajamos a Talca?', '¿Qué día nos trasladamos a Talca?', '¿A qué hora viajamos a Talca?', '¿Qué hacemos después de COOPEUMO?'],
			respuestaDirecta: "El traslado a Talca está programado para la tarde del miércoles 9 de septiembre de 2026, después de la jornada en COOPEUMO. El programa indica el viaje desde la Región de O'Higgins hacia Talca, pero no publica una hora exacta.", visibilidad: 'publica' as const,
		},
		{
			id: 'faq:retorno-hogares', tipo: 'faq' as const, titulo: '¿Cuándo regresan los participantes a sus hogares?',
			texto: 'El retorno de los participantes a sus hogares está programado para la tarde del viernes 11 de septiembre de 2026, una vez finalizadas las actividades en Pelarco. No hay una hora exacta de salida publicada.',
			fuente: '/programa/', categorias: ['retorno', 'regreso', 'hogares', 'viernes 11', 'Pelarco'],
			consultas: ['¿Cuándo regresamos a nuestras casas?', '¿Qué día termina la gira?', '¿Cuándo volvemos a nuestros hogares?', '¿A qué hora salimos de Pelarco?'],
			respuestaDirecta: 'El retorno de los participantes a sus hogares está programado para la tarde del viernes 11 de septiembre de 2026, una vez finalizadas las actividades en Pelarco. No hay una hora exacta de salida publicada.', visibilidad: 'publica' as const,
		},
	];

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
	const respuestasCooperativas = cooperativasConfirmadas.map((cooperativa) => {
		const nombreBreve = cooperativa.id.replaceAll('-', ' ');
		const estadoRepresentante = cooperativa.enviaRepresentante ? 'Enviará representante.' : 'No enviará representante según la nómina actual.';
		const respuesta = `${cooperativa.nombre} es una de las 15 cooperativas admitidas para la Gira. ${cooperativa.region}. ${estadoRepresentante}`;
		return {
			id: `faq:cooperativa-${cooperativa.id}`,
			tipo: 'faq' as const,
			titulo: `Información de ${cooperativa.nombre}`,
			texto: respuesta,
			fuente: 'fuente-interna:cooperativas-participantes',
			categorias: ['cooperativa', 'participación', 'región', 'representante', cooperativa.nombre, nombreBreve],
			consultas: [cooperativa.nombre, nombreBreve].flatMap((nombre) => [
				`¿Participa ${nombre} en la gira?`,
				`¿De qué región es ${nombre}?`,
				`¿${nombre} enviará representante?`,
				`Dame información sobre ${nombre}`,
			]),
			respuestaDirecta: respuesta,
			visibilidad: 'publica' as const,
		};
	});

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

	const fragmentos = [...programa, ...organizaciones, ...descripcionesOrganizaciones, ...ubicacionesOrganizaciones, ...fechasOrganizaciones, ...actividadesOrganizaciones, ...sitiosOficiales, ...hospedajes, faqAlojamientos, ...respuestasAlojamientos, ...almuerzos, faqAlmuerzos, ...respuestasAlmuerzos, ...consejos, ...equipo, ...respuestasContactos, ...formularios, ...respuestasEncuestas, ...traslados, faqCooperativas, ...cooperativas, ...respuestasCooperativas, ...preguntas];
	validarFragmentosPublicos(fragmentos);
	return fragmentos;
}

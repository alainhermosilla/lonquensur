export type Visibilidad = 'publica' | 'participantes' | 'restringida';

export interface Actividad {
	titulo: string;
	descripcion: string;
}

export interface Jornada {
	id: string;
	fecha: string;
	fechaTexto: string;
	etiqueta: string;
	titulo: string;
	lugar: string;
	visitaId?: string;
	actividades: Actividad[];
}

export interface DiaPrograma {
	id: string;
	fecha: string;
	fechaTexto: string;
	jornadas: Jornada[];
}

export const programa: DiaPrograma[] = [
	{
		id: '06',
		fecha: '2026-09-06',
		fechaTexto: 'DOMINGO 6 DE SEPTIEMBRE DE 2026',
		jornadas: [{
			id: '2026-09-06-llegada',
			fecha: '2026-09-06',
			fechaTexto: 'DOMINGO 6 DE SEPTIEMBRE DE 2026',
			etiqueta: 'Llegada de participantes',
			titulo: 'Inicio de la experiencia',
			lugar: 'Comuna de Santiago · Región Metropolitana',
			actividades: [
				{ titulo: 'Recepción y encuentro', descripcion: 'Llegada de los representantes de las 15 cooperativas participantes a Santiago durante la tarde, aproximadamente después de las 18:00 horas, y recepción en el punto de encuentro definido para el inicio de la gira.' },
				{ titulo: 'Alojamiento y coordinación', descripcion: 'Traslado al lugar de alojamiento y coordinación general de los participantes para el inicio de las actividades del día siguiente.' },
			],
		}],
	},
	{
		id: '07',
		fecha: '2026-09-07',
		fechaTexto: 'LUNES 7 DE SEPTIEMBRE DE 2026',
		jornadas: [
			{ id: '2026-09-07-manana', fecha: '2026-09-07', fechaTexto: 'LUNES 7 DE SEPTIEMBRE DE 2026', etiqueta: 'Jornada Mañana', titulo: 'Fundación Origen', lugar: 'Comuna de Pirque · Región Metropolitana', visitaId: 'fundacion-origen', actividades: [{ titulo: 'Inicio de la gira', descripcion: 'Presentación de las cooperativas participantes, introducción al concepto de innovación y dinámica participativa para compartir conocimientos, experiencias y expectativas.' }] },
			{ id: '2026-09-07-tarde', fecha: '2026-09-07', fechaTexto: 'LUNES 7 DE SEPTIEMBRE DE 2026', etiqueta: 'Jornada Tarde', titulo: 'Visita de campo', lugar: 'Fundación Origen · Comuna de Pirque', visitaId: 'fundacion-origen', actividades: [{ titulo: 'Agroecología y agricultura sustentable', descripcion: 'Recorrido por el Mercado Campesino Origen y el banco de semillas tradicionales, conociendo en terreno la mirada de la Fundación sobre agroecología, producción sustentable y conservación de semillas.' }] },
		],
	},
	{
		id: '08',
		fecha: '2026-09-08',
		fechaTexto: 'MARTES 8 DE SEPTIEMBRE DE 2026',
		jornadas: [
			{ id: '2026-09-08-manana', fecha: '2026-09-08', fechaTexto: 'MARTES 8 DE SEPTIEMBRE DE 2026', etiqueta: 'Jornada Mañana', titulo: 'Centro Tecnológico para la Innovación Alimentaria (CeTA)', lugar: 'Comuna de Pudahuel · Región Metropolitana', visitaId: 'ceta', actividades: [{ titulo: 'Innovación alimentaria', descripcion: 'Conocer el ecosistema de innovación alimentaria, la infraestructura y los procesos que permiten desarrollar nuevos productos, diversificar producciones y agregar valor.' }] },
			{ id: '2026-09-08-tarde', fecha: '2026-09-08', fechaTexto: 'MARTES 8 DE SEPTIEMBRE DE 2026', etiqueta: 'Jornada Tarde', titulo: 'Agrícola Cinco Valles', lugar: 'Comuna de Melipilla · Región Metropolitana', visitaId: 'agricola-cinco-valles', actividades: [{ titulo: 'Modelo de servicios compartidos', descripcion: 'Conocer su organización, principales dificultades y modelo de servicios técnicos compartidos, incluyendo SAT INDAP y asesoría en riego.' }] },
		],
	},
	{
		id: '09',
		fecha: '2026-09-09',
		fechaTexto: 'MIÉRCOLES 9 DE SEPTIEMBRE DE 2026',
		jornadas: [
			{ id: '2026-09-09-manana', fecha: '2026-09-09', fechaTexto: 'MIÉRCOLES 9 DE SEPTIEMBRE DE 2026', etiqueta: 'Jornada de la mañana', titulo: 'COOPEUMO', lugar: "Comuna de Peumo · Región de O'Higgins", visitaId: 'coopeumo', actividades: [{ titulo: 'Modelo cooperativo campesino', descripcion: 'Jornada de capacitación y conversación para conocer los principales logros, dificultades y desafíos actuales de la cooperativa.' }, { titulo: 'Visita a instalaciones', descripcion: 'Recorrido y conversatorio sobre su experiencia en servicios integrales para sus socios, incluyendo insumos, financiamiento, asistencia técnica y comercialización.' }] },
			{ id: '2026-09-09-tarde', fecha: '2026-09-09', fechaTexto: 'MIÉRCOLES 9 DE SEPTIEMBRE DE 2026', etiqueta: 'Jornada de la tarde', titulo: 'Viaje a Talca', lugar: 'Ciudad de Talca · Región del Maule', actividades: [{ titulo: 'Traslado a Talca', descripcion: "Viaje desde la Región de O'Higgins hacia la ciudad de Talca para continuar las actividades de la gira." }] },
		],
	},
	{
		id: '10',
		fecha: '2026-09-10',
		fechaTexto: 'JUEVES 10 DE SEPTIEMBRE DE 2026',
		jornadas: [
			{ id: '2026-09-10-manana', fecha: '2026-09-10', fechaTexto: 'JUEVES 10 DE SEPTIEMBRE DE 2026', etiqueta: 'Jornada Mañana', titulo: 'Cooperativa Campesina Tres Piedras', lugar: 'Comuna de Pelluhue · Región del Maule', visitaId: 'tres-piedras', actividades: [{ titulo: 'Innovación y alianzas', descripcion: 'Conocer los desafíos de una cooperativa en proceso de desarrollo, las soluciones implementadas y el acceso a innovación tecnológica mediante alianzas estratégicas.' }, { titulo: 'Visita a terreno', descripcion: 'Visita a predios y packing para conocer directamente su experiencia productiva.' }] },
			{ id: '2026-09-10-tarde', fecha: '2026-09-10', fechaTexto: 'JUEVES 10 DE SEPTIEMBRE DE 2026', etiqueta: 'Jornada Tarde', titulo: 'Cooperativa Vitivinícola Loncomilla', lugar: 'Comuna de San Javier · Región del Maule', visitaId: 'loncomilla', actividades: [{ titulo: 'Experiencia cooperativa', descripcion: 'Conocer la historia, problemas y logros de una cooperativa con más de seis décadas de trayectoria.' }, { titulo: 'Innovación y mercados', descripcion: 'Visita a planta y viñedos, junto con la presentación del proyecto Invicto y el proceso de certificación Fairtrade.' }] },
		],
	},
	{
		id: '11',
		fecha: '2026-09-11',
		fechaTexto: 'VIERNES 11 DE SEPTIEMBRE DE 2026',
		jornadas: [
			{ id: '2026-09-11-manana', fecha: '2026-09-11', fechaTexto: 'VIERNES 11 DE SEPTIEMBRE DE 2026', etiqueta: 'Jornada Mañana', titulo: 'Cooperativa Campesina Mujeres de Pelarco (COOPCAM)', lugar: 'Comuna de Pelarco · Región del Maule', visitaId: 'coopcam', actividades: [{ titulo: 'Cooperativismo y emprendimiento femenino', descripcion: 'Conversación con las integrantes de la Cooperativa Campesina Mujeres de Pelarco para conocer sus aciertos, dificultades y aprendizajes durante sus años de funcionamiento.' }, { titulo: 'Visita a instalaciones', descripcion: 'Conocer la experiencia productiva de la cooperativa, sus instalaciones y sala de venta.' }] },
			{ id: '2026-09-11-tarde', fecha: '2026-09-11', fechaTexto: 'VIERNES 11 DE SEPTIEMBRE DE 2026', etiqueta: 'Jornada Tarde', titulo: 'Vuelta de los participantes a sus hogares', lugar: 'Desde Pelarco · Región del Maule', actividades: [{ titulo: 'Retorno', descripcion: 'Finalizadas las actividades de la gira, se realizará la coordinación y retorno de los participantes a sus respectivos lugares de origen.' }] },
		],
	},
];

export const jornadas = programa.flatMap((dia) => dia.jornadas);

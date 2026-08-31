export interface Faq {
	id: string;
	pregunta: string;
	respuesta: string;
	categorias: string[];
	visibilidad: 'publica' | 'participantes';
	estado: 'borrador' | 'confirmado';
}

export const faqs: Faq[] = [
	{ id: 'fechas-gira', pregunta: '¿Cuándo se realiza la Gira?', respuesta: 'La llegada de participantes está programada para el domingo 6 de septiembre de 2026. Las jornadas de actividades se desarrollan desde el lunes 7 hasta el viernes 11 de septiembre de 2026.', categorias: ['programa', 'fechas'], visibilidad: 'publica', estado: 'confirmado' },
	{ id: 'duracion-gira', pregunta: '¿Cuántos días dura la Gira?', respuesta: 'La Gira contempla cinco días de actividades, desde el lunes 7 hasta el viernes 11 de septiembre de 2026. La llegada de los participantes está programada para el domingo 6.', categorias: ['programa', 'fechas', 'duracion'], visibilidad: 'publica', estado: 'confirmado' },
	{ id: 'regiones', pregunta: '¿Qué regiones recorrerá la Gira?', respuesta: 'La Gira contempla actividades en las regiones Metropolitana, de O’Higgins y del Maule.', categorias: ['programa', 'territorio'], visibilidad: 'publica', estado: 'confirmado' },
	{ id: 'participantes-gira', pregunta: '¿Quiénes participan de la Gira?', respuesta: 'En la Gira de Innovación AGROCOOPINNOVA 2026 participan 15 representantes de 15 cooperativas.', categorias: ['participantes', 'asistentes', 'cooperativas', 'beneficiarios', 'quienes-van'], visibilidad: 'publica', estado: 'confirmado' },
	{ id: 'dispositivo', pregunta: '¿Necesito llevar un dispositivo con Internet?', respuesta: 'Sí. Se recomienda llevar un celular, tablet o computador portátil con datos móviles. Un teléfono celular con acceso a Internet es suficiente.', categorias: ['recomendaciones', 'equipamiento'], visibilidad: 'publica', estado: 'confirmado' },
	{ id: 'carga-dispositivo', pregunta: '¿Debo llevar cargador o batería externa?', respuesta: 'Se recomienda comenzar cada jornada con el dispositivo cargado al 100 %, llevar el cargador y, si es posible, una batería externa.', categorias: ['recomendaciones', 'equipamiento'], visibilidad: 'publica', estado: 'confirmado' },
	{ id: 'vestimenta', pregunta: '¿Qué ropa y calzado conviene llevar?', respuesta: 'Se recomiendan zapatos cerrados, cómodos y apropiados para terreno; vestirse por capas; y llevar una chaqueta impermeable o cortaviento ante posibles lluvias.', categorias: ['recomendaciones', 'equipamiento'], visibilidad: 'publica', estado: 'confirmado' },
	{ id: 'agua-mochila', pregunta: '¿Qué conviene llevar durante las visitas?', respuesta: 'Se recomienda llevar una mochila pequeña con el celular, cargador, batería externa si se dispone de una, botella reutilizable de agua, chaqueta, medicamentos personales, documentos y otros elementos esenciales.', categorias: ['recomendaciones', 'equipamiento'], visibilidad: 'publica', estado: 'confirmado' },
	{ id: 'encuestas', pregunta: '¿Cuándo se pueden responder las encuestas?', respuesta: 'Cada encuesta tiene su propio período de apertura y cierre, publicado en la sección Encuestas del sitio. Los horarios se expresan en hora de Chile.', categorias: ['encuestas'], visibilidad: 'publica', estado: 'confirmado' },
	{ id: 'horarios-exactos', pregunta: '¿Dónde puedo consultar los horarios exactos y puntos de encuentro?', respuesta: 'Los horarios exactos y puntos de encuentro aún no están publicados en la información oficial disponible. Ante una necesidad operativa, corresponde comunicarse con el equipo coordinador de la Gira.', categorias: ['programa', 'pendientes'], visibilidad: 'publica', estado: 'confirmado' },
	{ id: 'alojamiento', pregunta: '¿Cuál es el alojamiento de la Gira?', respuesta: 'El nombre y la dirección de los alojamientos aún no están publicados en la información oficial disponible.', categorias: ['alojamiento', 'pendientes'], visibilidad: 'publica', estado: 'confirmado' },
	{
		id: 'emergencia-salud',
		pregunta: '¿Qué debo hacer si tengo un accidente, un malestar o un problema de salud durante la Gira de Innovación 2026?',
		respuesta: 'Debes contactar inmediatamente a las personas encargadas de la Gira de Innovación 2026:\n\n- Alain Hermosilla Ringger: +56 9 9846 4849\n- Ignacio Fernández Uribe: +56 9 8827 8525\n- Ximena Uribe Álvarez: +56 9 9888 9356\n\nEllos te dirán qué hacer.',
		categorias: ['salud', 'accidente', 'malestar', 'emergencia', 'urgencia', 'enfermedad', 'lesion', 'asistencia-medica', 'contactos'],
		visibilidad: 'publica',
		estado: 'confirmado',
	},
];

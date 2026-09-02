export interface Faq {
	id: string;
	pregunta: string;
	variantes?: string[];
	respuesta: string;
	categorias: string[];
	visibilidad: 'publica' | 'participantes';
	estado: 'borrador' | 'confirmado';
}

export const faqs: Faq[] = [
	{ id: 'fechas-gira', pregunta: '¿Cuándo se realiza la Gira?', variantes: ['¿Cuáles son las fechas de la gira?', '¿Qué día comienza y termina?', '¿Cuándo parte AGROCOOPINNOVA 2026?', '¿Entre qué fechas es la gira?', '¿Cuándo empieza la gira?', '¿Cuándo termina la gira?', '¿De qué fecha a qué fecha es?'], respuesta: 'La llegada de participantes está programada para el domingo 6 de septiembre de 2026. Las jornadas de actividades se desarrollan desde el lunes 7 hasta el viernes 11 de septiembre de 2026.', categorias: ['programa', 'fechas'], visibilidad: 'publica', estado: 'confirmado' },
	{ id: 'duracion-gira', pregunta: '¿Cuántos días dura la Gira?', variantes: ['¿Cuánto dura la gira?', '¿Cuántos días estaremos de gira?', '¿Cuánto dura AGROCOOPINNOVA?', '¿Cuántas jornadas tiene la gira?'], respuesta: 'La Gira contempla cinco días de actividades, desde el lunes 7 hasta el viernes 11 de septiembre de 2026. La llegada de los participantes está programada para el domingo 6.', categorias: ['programa', 'fechas', 'duracion'], visibilidad: 'publica', estado: 'confirmado' },
	{ id: 'regiones', pregunta: '¿Qué regiones recorrerá la Gira?', variantes: ['¿Por qué regiones pasaremos?', '¿En qué regiones será la gira?', '¿Qué regiones vamos a visitar?', '¿Por dónde será la gira?', '¿A qué regiones vamos?', '¿Qué zonas recorreremos?'], respuesta: 'La Gira contempla actividades en las regiones Metropolitana, de O’Higgins y del Maule.', categorias: ['programa', 'territorio'], visibilidad: 'publica', estado: 'confirmado' },
	{ id: 'objetivo-gira', pregunta: '¿Cuál es el objetivo de la Gira?', variantes: ['¿Cuál es el propósito de esta gira?', '¿Para qué se realiza AGROCOOPINNOVA?', '¿Qué busca lograr la gira?', '¿Cuál es la finalidad de esta actividad?'], respuesta: 'El objetivo de la Gira es conocer, aprender y compartir experiencias de innovación, cooperativismo y desarrollo productivo, fortaleciendo capacidades y redes entre cooperativas.', categorias: ['objetivo', 'proposito', 'finalidad', 'aprendizaje', 'innovacion', 'cooperativismo', 'desarrollo-productivo', 'redes'], visibilidad: 'publica', estado: 'confirmado' },
	{ id: 'participantes-gira', pregunta: '¿Quiénes participan de la Gira?', variantes: ['Participantes de la gira', '¿Cuántas cooperativas fueron admitidas?', '¿Cuántas cooperativas van a la gira?', '¿Quiénes son los beneficiarios?'], respuesta: 'La nómina contempla 15 cooperativas admitidas. La disponibilidad de representantes se informa por separado, porque una o más cooperativas pueden no enviar representante a la Gira.', categorias: ['participantes', 'asistentes', 'cooperativas', 'beneficiarios', 'quienes-van'], visibilidad: 'publica', estado: 'confirmado' },
	{
		id: 'nombre-oficial',
		pregunta: '¿Cuál es el nombre oficial de la Gira?',
		variantes: ['¿Cómo se llama la gira?', '¿Cuál es el nombre de esta actividad?', '¿Qué es AGROCOOPINNOVA 2026?'],
		respuesta: 'El nombre oficial es Gira de Innovación AGROCOOPINNOVA 2026.',
		categorias: ['nombre', 'nombre-oficial', 'agrocoopinnova'], visibilidad: 'publica', estado: 'confirmado',
	},
	{
		id: 'financia-gira',
		pregunta: '¿Quién financia y aprueba la Gira?',
		variantes: ['¿Quién financia la gira?', '¿Quién financia AGROCOOPINNOVA?', '¿Qué institución financia AGROCOOPINNOVA?', '¿Quién aprobó esta gira?', '¿La gira es financiada por FIA?'],
		respuesta: 'La Gira es financiada y aprobada por la Fundación para la Innovación Agraria (FIA).',
		categorias: ['fia', 'financiamiento', 'financia', 'aprueba'], visibilidad: 'publica', estado: 'confirmado',
	},
	{
		id: 'ejecuta-gira',
		pregunta: '¿Quién ejecuta la Gira?',
		variantes: ['¿Qué institución ejecuta la actividad?', '¿Quién organiza AGROCOOPINNOVA?', '¿Qué es IEAC en esta gira?', '¿Quién está a cargo de ejecutar el proyecto?'],
		respuesta: 'La Gira es ejecutada por el Instituto de Estudios, Asesorías y Capacitación Ltda. (IEAC), de Juanita Chamorro.',
		categorias: ['ieac', 'ejecuta', 'organizacion', 'juanita-chamorro'], visibilidad: 'publica', estado: 'confirmado',
	},
	{
		id: 'coordinacion-gira',
		pregunta: '¿Quiénes están a cargo de la Gira?',
		variantes: ['¿Quiénes son los coordinadores?', '¿Quién coordina la gira?', '¿Cuál es el equipo coordinador?', '¿Quién es el encargado de la gira?'],
		respuesta: 'La coordinación principal está a cargo de Alain Hermosilla Ringger e Ignacio Fernández Uribe. Ximena Uribe Álvarez está a cargo de la coordinación administrativa.',
		categorias: ['coordinacion', 'encargados', 'equipo', 'responsables'], visibilidad: 'publica', estado: 'confirmado',
	},
	{
		id: 'contactos-gira',
		pregunta: '¿Cuáles son los teléfonos del equipo coordinador?',
		variantes: ['¿Cómo contacto a los encargados?', '¿Cuáles son los contactos de la gira?', 'Necesito los teléfonos de los encargados', 'Necesito el teléfono de Alain, Ignacio o Ximena', '¿A quién puedo llamar por una consulta?'],
		respuesta: 'Puedes contactar al equipo coordinador en estos números:\n\n- Alain Hermosilla Ringger: +56 9 9846 4849\n- Ignacio Fernández Uribe: +56 9 8827 8525\n- Ximena Uribe Álvarez: +56 9 9888 9356.',
		categorias: ['contactos', 'telefonos', 'equipo', 'coordinacion'], visibilidad: 'publica', estado: 'confirmado',
	},
	{
		id: 'enfoques-aprendizaje',
		pregunta: '¿Qué temas de aprendizaje aborda la Gira?',
		variantes: ['¿Qué vamos a aprender?', '¿Cuáles son los temas de la gira?', '¿En qué se enfoca AGROCOOPINNOVA?', '¿Qué conocimientos se trabajarán?'],
		respuesta: 'La Gira aborda innovación; cooperativismo y asociatividad; desarrollo productivo; agregación de valor; comercialización; gestión organizacional; redes y colaboración; y agroecología y producción sustentable.',
		categorias: ['aprendizaje', 'temas', 'enfoque', 'contenidos'], visibilidad: 'publica', estado: 'confirmado',
	},
	{
		id: 'sentido-visitas',
		pregunta: '¿Qué debemos observar y aprender durante las visitas?',
		variantes: ['¿Qué debo aprovechar de las visitas?', '¿Cuál es la pregunta orientadora de la gira?', '¿Para qué visitamos estas organizaciones?', '¿Qué ideas debo buscar en cada experiencia?'],
		respuesta: 'Durante las visitas, la pregunta orientadora es: ¿Qué de lo que estoy viendo podría adaptar, mejorar o utilizar en mi cooperativa? La idea es conocer experiencias, identificar aprendizajes y descubrir elementos que puedan adaptarse a la realidad de cada cooperativa.',
		categorias: ['visitas', 'aprendizaje', 'pregunta-orientadora', 'adaptar'], visibilidad: 'publica', estado: 'confirmado',
	},
	{
		id: 'whatsapp-gira',
		pregunta: '¿Para qué se utilizará el grupo de WhatsApp?',
		variantes: ['¿Cuál es el canal de comunicación de la gira?', '¿Dónde se informarán los avisos?', '¿Por dónde comunicarán los horarios?', '¿Para qué sirve el WhatsApp de la gira?'],
		respuesta: 'El grupo de WhatsApp es el principal canal operativo para comunicar horarios, puntos de encuentro, visitas, materiales, fotografías, encuestas y avisos.',
		categorias: ['whatsapp', 'comunicacion', 'avisos', 'horarios'], visibilidad: 'publica', estado: 'confirmado',
	},
	{
		id: 'encuestas-visitas',
		pregunta: '¿Cómo son las encuestas después de cada visita?',
		variantes: ['¿Cuántas preguntas tienen las encuestas?', '¿Las encuestas son una prueba?', '¿Hay respuestas correctas en las encuestas?', '¿Qué evalúan las encuestas de las visitas?'],
		respuesta: 'Después de cada visita hay una encuesta de cinco preguntas: cuatro de alternativas y una de desarrollo. No son pruebas y no existen alternativas correctas o incorrectas. El foco está en lo observado, valorado y aprendido, y en aquello que podría llevarse a la cooperativa.',
		categorias: ['encuestas', 'preguntas', 'aprendizaje', 'visitas'], visibilidad: 'publica', estado: 'confirmado',
	},
	{
		id: 'encuesta-final',
		pregunta: '¿Qué se preguntará en la encuesta final?',
		variantes: ['¿Qué evalúa la encuesta de término?', '¿Cómo es la evaluación final?', '¿Qué debemos responder al terminar la gira?'],
		respuesta: 'La encuesta final abordará la organización, el alojamiento, la alimentación, los traslados y la atención del equipo. También recogerá qué observó y aprendió cada participante, qué le inspiró y qué experiencia, idea o aprendizaje considera importante llevar a su cooperativa.',
		categorias: ['encuesta-final', 'evaluacion', 'termino', 'aprendizaje'], visibilidad: 'publica', estado: 'confirmado',
	},
	{ id: 'dispositivo', pregunta: '¿Necesito llevar un dispositivo con Internet?', variantes: ['¿Debo llevar celular?', '¿Necesito datos móviles?', '¿Hay que llevar computador o tablet?', '¿Es necesario tener Internet durante la gira?', '¿Basta con mi teléfono?', '¿Tengo que llevar notebook?', '¿Necesito plan de datos?'], respuesta: 'Sí. Se recomienda llevar un celular, tablet o computador portátil con datos móviles. Un teléfono celular con acceso a Internet es suficiente.', categorias: ['recomendaciones', 'equipamiento'], visibilidad: 'publica', estado: 'confirmado' },
	{ id: 'carga-dispositivo', pregunta: '¿Debo llevar cargador o batería externa?', variantes: ['¿Necesito un power bank?', '¿Debo cargar el celular antes de salir?', '¿Conviene llevar batería portátil?', '¿Qué hago para mantener cargado el teléfono?'], respuesta: 'Se recomienda comenzar cada jornada con el dispositivo cargado al 100 %, llevar el cargador y, si es posible, una batería externa.', categorias: ['recomendaciones', 'equipamiento'], visibilidad: 'publica', estado: 'confirmado' },
	{ id: 'vestimenta', pregunta: '¿Qué ropa y calzado conviene llevar?', variantes: ['¿Debo llevar alguna ropa en especial?', '¿Cómo debo vestirme?', '¿Qué zapatos necesito?', '¿Debo llevar ropa para la lluvia?', '¿Necesito chaqueta impermeable?', '¿Qué ropa es apropiada para las visitas a terreno?'], respuesta: 'Se recomiendan zapatos cerrados, cómodos y apropiados para terreno; vestirse por capas; y llevar una chaqueta impermeable o cortaviento ante posibles lluvias.', categorias: ['recomendaciones', 'equipamiento'], visibilidad: 'publica', estado: 'confirmado' },
	{ id: 'agua-mochila', pregunta: '¿Qué conviene llevar durante las visitas?', variantes: ['¿Qué llevo en la mochila?', '¿Debo llevar botella de agua?', '¿Qué elementos necesito para salir a terreno?', '¿Qué cosas debo llevar cada día?'], respuesta: 'Se recomienda llevar una mochila pequeña con el celular, cargador, batería externa si se dispone de una, botella reutilizable de agua, chaqueta, medicamentos personales, documentos y otros elementos esenciales.', categorias: ['recomendaciones', 'equipamiento'], visibilidad: 'publica', estado: 'confirmado' },
	{ id: 'encuestas', pregunta: '¿Cuándo se pueden responder las encuestas?', variantes: ['¿Cuándo estarán disponibles las encuestas?', '¿Hasta qué hora puedo contestar?', '¿Dónde veo si una encuesta está abierta?', '¿Cuándo se habilitan los formularios?'], respuesta: 'Cada encuesta tiene su propio período de apertura y cierre, publicado en la sección Encuestas del sitio. Los horarios se expresan en hora de Chile.', categorias: ['encuestas'], visibilidad: 'publica', estado: 'confirmado' },
	{ id: 'horarios-exactos', pregunta: '¿Dónde puedo consultar los horarios exactos y puntos de encuentro?', respuesta: 'Los horarios exactos y puntos de encuentro aún no están publicados en la información oficial disponible. Ante una necesidad operativa, corresponde comunicarse con el equipo coordinador de la Gira.', categorias: ['programa', 'pendientes'], visibilidad: 'publica', estado: 'confirmado' },
	{
		id: 'emergencia-salud',
		pregunta: '¿Qué debo hacer si tengo un accidente, un malestar o un problema de salud durante la Gira de Innovación 2026?',
		variantes: ['Tuve un accidente, ¿qué hago?', 'Me siento mal, ¿a quién aviso?', 'Me duele el estómago, ¿qué hago?', 'Un compañero necesita asistencia médica', '¿A quién llamo por una emergencia de salud?'],
		respuesta: 'Debes contactar inmediatamente a las personas encargadas de la Gira de Innovación 2026:\n\n- Alain Hermosilla Ringger: +56 9 9846 4849\n- Ignacio Fernández Uribe: +56 9 8827 8525\n- Ximena Uribe Álvarez: +56 9 9888 9356\n\nEllos te dirán qué hacer.',
		categorias: ['salud', 'accidente', 'malestar', 'emergencia', 'urgencia', 'enfermedad', 'lesion', 'asistencia-medica', 'contactos'],
		visibilidad: 'publica',
		estado: 'confirmado',
	},
];

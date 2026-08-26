export interface PendienteEditorial {
	id: string;
	tema: string;
	descripcion: string;
	impactoRag: string;
	estado: 'pendiente' | 'confirmado';
}

export const pendientesEditoriales: PendienteEditorial[] = [
	{ id: 'horarios', tema: 'Horarios exactos', descripcion: 'Confirmar horas de inicio y término de cada jornada, traslados y comidas.', impactoRag: 'El asistente debe abstenerse de responder horas no publicadas.', estado: 'pendiente' },
	{ id: 'alojamientos', tema: 'Alojamientos', descripcion: 'Faltan nombres, direcciones, fechas, teléfonos y reglas de acceso de los alojamientos.', impactoRag: 'No existe información suficiente para responder dónde duerme el grupo.', estado: 'pendiente' },
	{ id: 'puntos-encuentro', tema: 'Puntos de encuentro', descripcion: 'Faltan ubicaciones y horas confirmadas para recepción y salidas.', impactoRag: 'El asistente debe remitir al equipo coordinador.', estado: 'pendiente' },
	{ id: 'cooperativas-participantes', tema: 'Cooperativas participantes', descripcion: 'El sitio indica 15 cooperativas, pero no contiene la lista oficial.', impactoRag: 'No debe inferirse desde las organizaciones anfitrionas.', estado: 'pendiente' },
	{ id: 'participantes', tema: 'Participantes', descripcion: 'No existe una nómina ni una política de visibilidad para datos personales.', impactoRag: 'Excluir del índice público hasta definir autenticación y privacidad.', estado: 'pendiente' },
	{ id: 'faqs', tema: 'Preguntas frecuentes', descripcion: 'No existe todavía una colección oficial de preguntas y respuestas.', impactoRag: 'Crear FAQs aprobadas antes de evaluar cobertura operativa.', estado: 'pendiente' },
	{ id: 'bitacora-fechas', tema: 'Fechas de bitácora', descripcion: 'La entrada del 13–16 de agosto no coincide con el programa de septiembre.', impactoRag: 'No indexar como hecho de la gira hasta confirmar.', estado: 'pendiente' },
];

export const politicaDeRespuesta = {
	zonaHoraria: 'America/Santiago',
	sinEvidencia: 'No tengo esa información en los contenidos oficiales de la Gira.',
	navegacionWeb: false,
	fuentesPermitidas: ['programa', 'visitas', 'informacion', 'encuestas', 'avisos', 'faqs'],
};

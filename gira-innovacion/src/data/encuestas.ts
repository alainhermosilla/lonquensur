export interface Encuesta {
	id: string;
	visitaId?: string;
	nombre: string;
	lugar: string;
	apertura: string;
	cierre: string;
	aperturaTexto: string;
	cierreTexto: string;
	enlace: string;
	esPrueba?: boolean;
}

export const encuestas: Encuesta[] = [
	{ id: 'prueba-fundacion-origen', visitaId: 'fundacion-origen', nombre: 'Encuesta 00 · Prueba de apertura y cierre', lugar: 'Fundación Origen · Prueba temporal', apertura: '2026-09-02T13:00:00-04:00', cierre: '2026-09-02T15:00:00-04:00', aperturaTexto: 'Mié 2 sep · 13:00', cierreTexto: 'Mié 2 sep · 15:00', enlace: 'https://docs.google.com/forms/d/e/1FAIpQLScbPh5rt5ExbmeEpKbwKBXIY5uM9cIBIZzTyy8dxL3K7VC28A/viewform?usp=header', esPrueba: true },
	{ id: 'fundacion-origen', visitaId: 'fundacion-origen', nombre: 'Encuesta sobre visita a la Fundación Origen, realizada el día 7 de septiembre de 2026', lugar: 'Pirque', apertura: '2026-09-07T18:00:00-03:00', cierre: '2026-09-12T00:00:00-03:00', aperturaTexto: 'Lun 7 sep · 18:00', cierreTexto: 'Vie 11 sep · 23:59', enlace: 'https://docs.google.com/forms/d/e/1FAIpQLScbPh5rt5ExbmeEpKbwKBXIY5uM9cIBIZzTyy8dxL3K7VC28A/viewform?usp=header' },
	{ id: 'ceta', visitaId: 'ceta', nombre: 'Encuesta sobre visita al Centro Tecnológico para la Innovación Alimentaria (CeTA), realizada el día 8 de septiembre de 2026', lugar: 'Pudahuel', apertura: '2026-09-08T12:30:00-03:00', cierre: '2026-09-12T00:00:00-03:00', aperturaTexto: 'Mar 8 sep · 12:30', cierreTexto: 'Vie 11 sep · 23:59', enlace: 'https://forms.gle/ppipBekgvHB1GcNp8' },
	{ id: 'agricola-cinco-valles', visitaId: 'agricola-cinco-valles', nombre: 'Encuesta sobre visita a Agrícola Cinco Valles, realizada el día 8 de septiembre de 2026', lugar: 'Melipilla', apertura: '2026-09-08T18:00:00-03:00', cierre: '2026-09-12T00:00:00-03:00', aperturaTexto: 'Mar 8 sep · 18:00', cierreTexto: 'Vie 11 sep · 23:59', enlace: 'https://forms.gle/JQTeBfkFNGMHwKhH7' },
	{ id: 'coopeumo', visitaId: 'coopeumo', nombre: 'Encuesta sobre visita a COOPEUMO, realizada el día 9 de septiembre de 2026', lugar: 'Peumo', apertura: '2026-09-09T13:00:00-03:00', cierre: '2026-09-12T00:00:00-03:00', aperturaTexto: 'Mié 9 sep · 13:00', cierreTexto: 'Vie 11 sep · 23:59', enlace: 'https://forms.gle/XMvwuhTeZMtc2tKt9' },
	{ id: 'tres-piedras', visitaId: 'tres-piedras', nombre: 'Encuesta sobre visita a la Cooperativa Tres Piedras, realizada el día 10 de septiembre de 2026', lugar: 'Pelluhue', apertura: '2026-09-10T13:00:00-03:00', cierre: '2026-09-12T00:00:00-03:00', aperturaTexto: 'Jue 10 sep · 13:00', cierreTexto: 'Vie 11 sep · 23:59', enlace: 'https://forms.gle/ZwUaBnXkq1DqawxEA' },
	{ id: 'loncomilla', visitaId: 'loncomilla', nombre: 'Encuesta sobre visita a la Cooperativa Vitivinícola Loncomilla, realizada el día 10 de septiembre de 2026', lugar: 'San Javier', apertura: '2026-09-10T18:00:00-03:00', cierre: '2026-09-12T00:00:00-03:00', aperturaTexto: 'Jue 10 sep · 18:00', cierreTexto: 'Vie 11 sep · 23:59', enlace: 'https://forms.gle/QhQUSRXt3LBvu42M6' },
	{ id: 'coopcam', visitaId: 'coopcam', nombre: 'Encuesta sobre visita a la Cooperativa Mujeres de Pelarco, realizada el día 11 de septiembre de 2026', lugar: 'Pelarco', apertura: '2026-09-11T13:00:00-03:00', cierre: '2026-09-12T18:00:00-03:00', aperturaTexto: 'Vie 11 sep · 13:00', cierreTexto: 'Sáb 12 sep · 18:00', enlace: 'https://forms.gle/hZBQN69ntFt6ZWBQ7' },
	{ id: 'cierre-gira', nombre: 'Encuesta de cierre Gira de innovación AgrocoopInnova 2026', lugar: 'Cierre de la gira', apertura: '2026-09-11T16:00:00-03:00', cierre: '2026-09-20T18:00:00-03:00', aperturaTexto: 'Vie 11 sep · 16:00', cierreTexto: 'Dom 20 sep · 18:00', enlace: 'https://docs.google.com/forms/d/e/1FAIpQLSdFB33_lQkDGkfnScID7AtntawTx1kMP9xBjqRORwPzEPtZ4Q/viewform?usp=header' },
];

export interface Alimentacion {
	id: string;
	fecha: string;
	nombre: string;
	direccion: string;
	ubicacion: string;
	detalle: string;
	estado: 'confirmado' | 'referencia' | 'pendiente';
	visibilidad: 'publica';
}

export const alimentacion: Alimentacion[] = [
	{
		id: 'fundacion-origen',
		fecha: '2026-09-07',
		nombre: 'Fundación Origen',
		direccion: 'Pirque',
		ubicacion: 'Región Metropolitana',
		detalle: 'Almuerzo durante la jornada en Fundación Origen.',
		estado: 'confirmado',
		visibilidad: 'publica',
	},
	{
		id: 'forestani-restaurant',
		fecha: '2026-09-08',
		nombre: 'Forestani Restaurant',
		direccion: 'Av. Vicuña Mackenna 522',
		ubicacion: 'Melipilla, Región Metropolitana',
		detalle: 'Almuerzo en Melipilla antes de la visita de la tarde a Agrícola Cinco Valles.',
		estado: 'confirmado',
		visibilidad: 'publica',
	},
	{
		id: 'almuerzo-san-vicente',
		fecha: '2026-09-09',
		nombre: 'Almuerzo en San Vicente',
		direccion: 'Lugar y dirección por confirmar',
		ubicacion: "San Vicente de Tagua Tagua, Región de O'Higgins",
		detalle: 'El restaurante o lugar definitivo todavía no está confirmado.',
		estado: 'pendiente',
		visibilidad: 'publica',
	},
	{
		id: 'toro-macho',
		fecha: '2026-09-10',
		nombre: 'Toro Macho',
		direccion: 'Lado oriente del río Loncomilla',
		ubicacion: 'Villa Alegre, Región del Maule',
		detalle: 'Almuerzo previo a la visita de la tarde.',
		estado: 'referencia',
		visibilidad: 'publica',
	},
	{
		id: 'juan-y-medio',
		fecha: '2026-09-11',
		nombre: 'Juan y Medio',
		direccion: 'Longitudinal Sur Km 109',
		ubicacion: "Rengo, Región de O'Higgins",
		detalle: 'Almuerzo durante el retorno de los participantes.',
		estado: 'confirmado',
		visibilidad: 'publica',
	},
];

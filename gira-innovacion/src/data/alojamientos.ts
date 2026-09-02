export interface Alojamiento {
	id: string;
	nombre: string;
	direccion: string;
	desde: string;
	hasta: string;
	telefono?: string;
	visibilidad: 'publica' | 'participantes';
	estado: 'borrador' | 'confirmado';
}

export const alojamientos: Alojamiento[] = [
	{
		id: 'hotel-da-aeropuerto',
		nombre: 'Hotel DA Aeropuerto',
		direccion: 'Av. Américo Vespucio Oriente 1299, Pudahuel, Región Metropolitana',
		desde: '2026-09-06',
		hasta: '2026-09-09',
		visibilidad: 'publica',
		estado: 'confirmado',
	},
	{
		id: 'hotel-da-talca',
		nombre: 'Hotel DA Talca',
		direccion: 'Calle 4 Poniente 1011, Talca, Región del Maule',
		desde: '2026-09-09',
		hasta: '2026-09-11',
		visibilidad: 'publica',
		estado: 'confirmado',
	},
];

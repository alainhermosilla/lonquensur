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

// Pendiente de información oficial. El asistente debe abstenerse hasta que existan registros confirmados.
export const alojamientos: Alojamiento[] = [];

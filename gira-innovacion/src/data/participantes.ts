export interface Participante {
	id: string;
	nombre: string;
	cooperativaId: string;
	rol?: string;
	visibilidad: 'participantes' | 'restringida';
	estado: 'borrador' | 'confirmado';
}

/**
 * Esta colección nunca debe incorporarse al índice público.
 * Requiere política de privacidad y autenticación antes de contener datos.
 */
export const participantes: Participante[] = [];

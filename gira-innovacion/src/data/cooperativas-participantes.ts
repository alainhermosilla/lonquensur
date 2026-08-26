export interface CooperativaParticipante {
	id: string;
	nombre: string;
	territorio?: string;
	region?: string;
	estado: 'borrador' | 'confirmado';
}

// El programa menciona 15 cooperativas, pero la lista oficial aún no está publicada.
export const cooperativasParticipantes: CooperativaParticipante[] = [];

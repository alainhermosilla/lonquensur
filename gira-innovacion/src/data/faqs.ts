export interface Faq {
	id: string;
	pregunta: string;
	respuesta: string;
	categorias: string[];
	visibilidad: 'publica' | 'participantes';
	estado: 'borrador' | 'confirmado';
}

// Solo deben indexarse preguntas con respuesta aprobada y estado "confirmado".
export const faqs: Faq[] = [];

export interface Recomendacion {
	icono: string;
	titulo: string;
	parrafos: string[];
	destacado?: string;
	nota?: string;
}

export const recomendaciones: Recomendacion[] = [
	{ icono: '🌱', titulo: 'Ven con curiosidad y mente abierta', parrafos: ['Esta gira está pensada como una experiencia de aprendizaje e intercambio, no solamente como una serie de visitas.', 'Conoceremos organizaciones con diferentes tamaños, historias, productos, tecnologías y formas de trabajar. No esperamos que todas las experiencias puedan replicarse exactamente en tu cooperativa. Lo importante será observar, preguntar, conversar y descubrir qué elementos podrían adaptarse a tu propia realidad.', 'Al finalizar cada experiencia tendremos una breve encuesta para recoger qué observaron, qué les llamó la atención y qué ideas consideran interesantes para compartir con sus cooperativas.'], destacado: '¿Qué de lo que estoy viendo podría adaptar, mejorar o utilizar en mi cooperativa?' },
	{ icono: '📶', titulo: 'Lleva un dispositivo con conexión a internet', parrafos: ['Puede ser un celular, tablet o computador portátil con un plan de datos móviles activo, que permita conectarse a internet incluso al aire libre o fuera de una red Wi-Fi.', 'Lo utilizaremos para acceder a información de las organizaciones, responder encuestas, participar en actividades, revisar material digital y mantenernos comunicados.'], nota: 'No es necesario llevar más de un equipo: un teléfono celular con acceso a internet es suficiente.' },
	{ icono: '🔋', titulo: 'Mantén tus dispositivos cargados', parrafos: ['Comienza cada jornada con tu dispositivo cargado al 100%. Lo utilizaremos durante distintas actividades y visitas.', 'Lleva siempre tu cargador y, si tienes, una batería externa o power bank, especialmente considerando que tendremos jornadas completas fuera del alojamiento.'] },
	{ icono: '🥾', titulo: 'Usa zapatos cómodos y apropiados para terreno', parrafos: ['Visitaremos predios agrícolas, instalaciones productivas, packing y otros espacios de trabajo.', 'Recomendamos utilizar zapatos cerrados, cómodos, con buena suela y apropiados para caminar en terreno, considerando que podemos encontrarnos con barro, humedad o superficies irregulares.'] },
	{ icono: '🧥', titulo: 'Vístete por capas', parrafos: ['La gira se realizará durante septiembre y recorreremos las regiones Metropolitana, O’Higgins y Maule.', 'Las mañanas pueden ser frías y las temperaturas pueden cambiar durante el día. Recomendamos llevar polera o camisa, polar o chaleco y chaqueta, de manera que puedas adaptar tu vestimenta a las condiciones de cada jornada.'] },
	{ icono: '🌧️', titulo: 'Prepárate para posibles lluvias', parrafos: ['Lleva una chaqueta impermeable o cortaviento. También puede ser útil llevar un paraguas pequeño.', 'Algunas de las actividades se realizarán en terreno, por lo que debemos estar preparados para cambios en las condiciones meteorológicas.'] },
	{ icono: '💧', titulo: 'Lleva una botella de agua', parrafos: ['Mantente hidratado durante los recorridos y viajes.', 'Recomendamos utilizar una botella reutilizable que puedas rellenar cuando sea necesario y llevar contigo durante las distintas visitas.'] },
	{ icono: '🎒', titulo: 'Lleva una mochila pequeña', parrafos: ['Una mochila pequeña será mucho más cómoda durante las visitas que un bolso de gran tamaño.', 'Puedes utilizarla para llevar celular, cargador, batería externa, botella de agua, chaqueta, medicamentos personales, documentos y otros elementos esenciales.'] },
	{ icono: '📝', titulo: 'Registra las ideas que te llamen la atención', parrafos: ['Puedes utilizar una libreta o las notas de tu celular. No necesitas escribir todo lo que escuches.', 'También puedes tomar fotografías cuando esté permitido para recordar posteriormente aquello que te haya parecido interesante.'], destacado: 'Esto podría servir en mi cooperativa.' },
	{ icono: '⏰', titulo: 'Respeta los horarios y puntos de encuentro', parrafos: ['Durante la gira tendremos diferentes traslados entre regiones y comunas.', 'Intenta estar en cada punto de encuentro unos minutos antes de la hora indicada. Un pequeño atraso puede afectar los horarios de las visitas y las actividades de todo el grupo.', 'La puntualidad será especialmente importante para aprovechar al máximo cada jornada.'] },
	{ icono: '🤝', titulo: 'Conversa, pregunta y genera contactos', parrafos: ['Aprovecha las visitas para conversar directamente con las organizaciones anfitrionas y realizar todas las preguntas que consideres necesarias.', 'También aprovecha los viajes, almuerzos y tiempos compartidos para conocer a los representantes de las demás cooperativas, intercambiar experiencias y generar nuevos contactos.', 'Parte importante de la innovación puede surgir precisamente de estas conversaciones y del intercambio entre participantes.'] },
];

export const contactos = [
	['Alain Hermosilla Ringger', 'Coordinador principal', '+56 9 9846 4849'],
	['Ignacio Fernández Uribe', 'Coordinador principal', '+56 9 8827 8525'],
	['Ximena Uribe Álvarez', 'Coordinadora administrativa', '+56 9 9888 9356'],
] as const;

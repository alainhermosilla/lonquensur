export interface CooperativaParticipante {
	id: string;
	nombre: string;
	territorio?: string;
	region?: string;
	enviaRepresentante: boolean;
	estado: 'borrador' | 'confirmado';
}

export const cooperativasParticipantes: CooperativaParticipante[] = [
	{ id: 'san-jose-llamuco', nombre: 'COOPERATIVA AGRICOLA SAN JOSE DE LLAMUCO LIMITADA', region: 'Región de La Araucanía', enviaRepresentante: true, estado: 'confirmado' },
	{ id: 'antu-malen', nombre: 'COOPERATIVA AGRICOLA DE FLORES ANTU MALEN LTDA', region: 'Región de La Araucanía', enviaRepresentante: true, estado: 'confirmado' },
	{ id: 'gente-de-la-tierra', nombre: 'COOPERATIVA AGRICOLA GENTE DE LA TIERRA', region: 'Región del Biobío', enviaRepresentante: true, estado: 'confirmado' },
	{ id: 'peniwen', nombre: 'COOPERATIVA AGRICOLA PENIWEN LIMITADA', region: 'Región de La Araucanía', enviaRepresentante: true, estado: 'confirmado' },
	{ id: 'agrokoyan', nombre: 'COOPERATIVA AGROPECUARIA Y TURISTICA AGROKOYAN LIMITADA', region: 'Región de La Araucanía', enviaRepresentante: true, estado: 'confirmado' },
	{ id: 'codinhue-bajo', nombre: 'COOPERATIVA CAMPESINA CODINHUE BAJO LTDA', region: 'Región de La Araucanía', enviaRepresentante: true, estado: 'confirmado' },
	{ id: 'flor-de-malleco', nombre: 'COOPERATIVA AGRÍCOLA FLOR DE MALLECO', region: 'Región de La Araucanía', enviaRepresentante: true, estado: 'confirmado' },
	{ id: 'destilados-valle-del-maule', nombre: 'COOPERATIVA DESTILADOS PATRIMONIALES VALLE DEL MAULE LIMITADA', region: 'Región del Maule', enviaRepresentante: false, estado: 'confirmado' },
	{ id: 'regleche-peuma', nombre: 'COOPERATIVA AGROPECUARIA Y TURISTICA REGLECHE PEUMA LTDA', region: 'Región de La Araucanía', enviaRepresentante: true, estado: 'confirmado' },
	{ id: 'caunahue', nombre: 'COOPERATIVA AGRÍCOLA CAUNAHUE LTDA', region: 'Región de Los Ríos', enviaRepresentante: true, estado: 'confirmado' },
	{ id: 'rayenko-framberries', nombre: 'COOPERATIVA AGRÍCOLA RAYENKO FRAMBERRIES LIMITADA', region: 'Región de La Araucanía', enviaRepresentante: true, estado: 'confirmado' },
	{ id: 'olivicultores-santa-rosa', nombre: 'COOPERATIVA AGRÍCOLA OLIVICULTORES DEL VALLE DE SANTA ROSA LIMITADA', region: 'Región de La Araucanía', enviaRepresentante: true, estado: 'confirmado' },
	{ id: 'pecuaria-nuble', nombre: 'COOPERATIVA AGRICOLA Y AGROECOLOGICA PECUARIA DE ÑUBLE LIMITADA', region: 'Región de Ñuble', enviaRepresentante: true, estado: 'confirmado' },
	{ id: 'mongen', nombre: 'COOPERATIVA AGRICOLA MONGEN LIMITADA', region: 'Región de La Araucanía', enviaRepresentante: true, estado: 'confirmado' },
	{ id: 'olivicola-el-hueso', nombre: 'COOPERATIVA OLIVICOLA EL HUESO', region: 'Región de Antofagasta', enviaRepresentante: true, estado: 'confirmado' },
];

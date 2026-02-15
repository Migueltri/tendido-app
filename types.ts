export enum Category {
  ACTUALIDAD = 'Actualidad',
  CRONICAS = 'Crónicas',
  ENTREVISTAS = 'Entrevistas',
  OPINION = 'Opinión'
}

export interface Author {
  id: string;
  name: string;
  role: string; // e.g., "Redactor Jefe", "Colaborador"
  imageUrl?: string;
}

export interface BullfightResult {
  bullfighter: string; // Nombre del torero/novillero
  result: string;      // Ej: "Una oreja", "Ovación", "Silencio"
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string; // Imagen de portada
  contentImages?: string[]; // Imágenes adicionales
  category: Category;
  authorId: string;
  date: string; // ISO string
  isPublished: boolean;
  
  // Campos específicos para Crónicas
  bullfightLocation?: string; // Plaza
  bullfightCattle?: string;   // Ganadería
  bullfightSummary?: string;  // Resumen del festejo (texto específico de la ficha)
  bullfightResults?: BullfightResult[]; // Array de resultados
}

export interface DashboardStats {
  totalArticles: number;
  totalAuthors: number;
  recentArticles: Article[];
}

export interface AppSettings {
  githubToken: string;
  repoOwner: string; // Tu usuario de GitHub
  repoName: string;  // El nombre de tu repositorio
  filePath: string;  // Ruta donde se guardará el JSON (ej: public/data/noticias.json)
  repoBranch?: string; // Rama del repositorio (main, master, etc)
}
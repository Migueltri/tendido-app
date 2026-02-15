import { Article, Author, Category } from '../types';

// Initial Mock Data to populate the app if empty
const INITIAL_AUTHORS: Author[] = [
  { id: '1', name: 'Eduardo Elvira', role: 'Redacción', imageUrl: 'https://ui-avatars.com/api/?name=Eduardo+Elvira&background=random' },
  { id: '2', name: 'Nerea F.Elena', role: 'Redacción', imageUrl: 'https://ui-avatars.com/api/?name=Nerea+F+Elena&background=random' },
  { id: '3', name: 'Manolo Herrera', role: 'Redacción', imageUrl: 'https://ui-avatars.com/api/?name=Manolo+Herrera&background=random' },
  { id: '4', name: 'Rubén Sánchez', role: 'Redacción', imageUrl: 'https://ui-avatars.com/api/?name=Ruben+Sanchez&background=random' },
  { id: '5', name: 'Iris Rodríguez', role: 'Redacción', imageUrl: 'https://ui-avatars.com/api/?name=Iris+Rodriguez&background=random' },
  { id: '6', name: 'Antonio Tortosa', role: 'Redacción', imageUrl: 'https://ui-avatars.com/api/?name=Antonio+Tortosa&background=random' },
  { id: '7', name: 'Inés Sáez', role: 'Redacción', imageUrl: 'https://ui-avatars.com/api/?name=Ines+Saez&background=random' },
  { id: '8', name: 'Enrique Salazar', role: 'Redacción', imageUrl: 'https://ui-avatars.com/api/?name=Enrique+Salazar&background=random' },
];

const INITIAL_ARTICLES: Article[] = [
  {
    id: '101',
    title: 'Sábado en el Carnaval del Toro de Ciudad Rodrigo',
    summary: 'Cuatro orejas y varios novillos aplaudidos en el arrastre en una tarde marcada por el viento.',
    content: '<p>Texto completo de la crónica del carnaval...</p>',
    imageUrl: 'https://picsum.photos/800/600?random=10',
    contentImages: [],
    category: Category.CRONICAS,
    authorId: '1',
    date: new Date().toISOString(),
    isPublished: true,
    // Datos de crónica
    bullfightLocation: 'Plaza Mayor de Ciudad Rodrigo',
    bullfightCattle: 'Novillos de las ganaderías de Talavante y un eral de El Pilar.',
    bullfightSummary: 'En este sábado de carnaval, Ciudad Rodrigo vivió una tarde con una novillada de Talavante sensacional, ofreciendo cada uno de ellos un juego más que notable.',
    bullfightResults: [
        { bullfighter: 'Diego Urdiales', result: 'una oreja' },
        { bullfighter: 'Alejandro Talavante', result: 'ovación' },
        { bullfighter: 'Pablo Aguado', result: 'una oreja' },
        { bullfighter: 'El Mene', result: 'una oreja' },
        { bullfighter: 'Moisés Fraile', result: 'ovación' }
    ]
  },
  {
    id: '102',
    title: 'La Asociación Andaluza de Escuelas Taurinas celebra su Asamblea',
    summary: 'Pedro Romero celebra en Camas su Asamblea General con una ambiciosa mirada al futuro.',
    content: '<p>Texto completo de la noticia...</p>',
    imageUrl: 'https://picsum.photos/800/600?random=11',
    contentImages: [],
    category: Category.ACTUALIDAD,
    authorId: '2',
    date: new Date(Date.now() - 86400000).toISOString(),
    isPublished: true,
  },
];

// Changed keys to v4 to ensure clean state with chronicle fields
const STORAGE_KEYS = {
  ARTICLES: 'td_articles_v4',
  AUTHORS: 'td_authors_v4',
};

// Helpers to simulate DB interaction
export const getAuthors = (): Author[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.AUTHORS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.AUTHORS, JSON.stringify(INITIAL_AUTHORS));
    return INITIAL_AUTHORS;
  }
  return JSON.parse(stored);
};

export const saveAuthor = (author: Author): void => {
  const authors = getAuthors();
  const existingIndex = authors.findIndex((a) => a.id === author.id);
  if (existingIndex >= 0) {
    authors[existingIndex] = author;
  } else {
    authors.push(author);
  }
  localStorage.setItem(STORAGE_KEYS.AUTHORS, JSON.stringify(authors));
};

export const deleteAuthor = (id: string): void => {
  const authors = getAuthors().filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.AUTHORS, JSON.stringify(authors));
};

export const getArticles = (): Article[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.ARTICLES);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(INITIAL_ARTICLES));
    return INITIAL_ARTICLES;
  }
  return JSON.parse(stored);
};

export const saveArticle = (article: Article): void => {
  const articles = getArticles();
  const existingIndex = articles.findIndex((a) => a.id === article.id);
  if (existingIndex >= 0) {
    articles[existingIndex] = article;
  } else {
    articles.unshift(article); // Add new to top
  }
  localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
};

export const deleteArticle = (id: string): void => {
  const articles = getArticles().filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
};

export const getArticleById = (id: string): Article | undefined => {
  return getArticles().find((a) => a.id === id);
};
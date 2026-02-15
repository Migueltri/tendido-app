import { AppSettings, Article, Author } from '../types';
import { getArticles, getAuthors, saveArticle, saveAuthor } from './dataService';

const SETTINGS_KEY = 'td_app_settings';

export const getSettings = (): AppSettings => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  return stored ? JSON.parse(stored) : {
    githubToken: '',
    repoOwner: '',
    repoName: '',
    filePath: 'public/data/db.json' // Ruta por defecto
  };
};

export const saveSettings = (settings: AppSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

interface GitHubFileResponse {
  sha: string;
  content: string;
  encoding: string;
}

// Estructura completa de la base de datos
interface DatabaseSchema {
  articles: Article[];
  authors: Author[];
  lastUpdated: string;
}

export const syncWithGitHub = async (): Promise<{ success: boolean; message: string }> => {
  const settings = getSettings();
  
  if (!settings.githubToken || !settings.repoOwner || !settings.repoName) {
    return { success: false, message: 'Falta configuración de GitHub. Ve a Configuración.' };
  }

  const url = `https://api.github.com/repos/${settings.repoOwner}/${settings.repoName}/contents/${settings.filePath}`;
  const headers = {
    'Authorization': `token ${settings.githubToken}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };

  try {
    // 1. Obtener el archivo actual (necesitamos el SHA para actualizar)
    const getResponse = await fetch(url, { headers });
    
    let sha = '';
    
    if (getResponse.ok) {
      const data: GitHubFileResponse = await getResponse.json();
      sha = data.sha;
    } else if (getResponse.status !== 404) {
      throw new Error('Error conectando con GitHub');
    }

    // 2. Preparar los datos actuales de la App
    const currentData: DatabaseSchema = {
        articles: getArticles(),
        authors: getAuthors(),
        lastUpdated: new Date().toISOString()
    };

    // 3. Convertir a Base64 (requerido por GitHub API)
    // Usamos un método compatible con Unicode/Emojis
    const jsonString = JSON.stringify(currentData, null, 2);
    const contentEncoded = btoa(unescape(encodeURIComponent(jsonString)));

    // 4. Subir el archivo (PUT)
    const body = {
      message: `Actualización contenido web: ${new Date().toLocaleDateString()}`,
      content: contentEncoded,
      sha: sha || undefined // Si no hay SHA, creará el archivo nuevo
    };

    const putResponse = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    });

    if (!putResponse.ok) {
        const err = await putResponse.json();
        throw new Error(err.message || 'Error al subir a GitHub');
    }

    return { success: true, message: '¡Web actualizada correctamente!' };

  } catch (error: any) {
    console.error(error);
    return { success: false, message: `Error: ${error.message}` };
  }
};

export const downloadFromGitHub = async (): Promise<{ success: boolean; message: string }> => {
    const settings = getSettings();
    if (!settings.githubToken) return { success: false, message: 'Configuración incompleta' };

    const url = `https://api.github.com/repos/${settings.repoOwner}/${settings.repoName}/contents/${settings.filePath}`;
    
    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `token ${settings.githubToken}` }
        });

        if (!response.ok) throw new Error('No se encontró el archivo en GitHub');

        const data: GitHubFileResponse = await response.json();
        const decodedContent = decodeURIComponent(escape(window.atob(data.content)));
        const db: DatabaseSchema = JSON.parse(decodedContent);

        // Actualizar LocalStorage
        if (db.articles) localStorage.setItem('td_articles_v4', JSON.stringify(db.articles));
        if (db.authors) localStorage.setItem('td_authors_v4', JSON.stringify(db.authors));

        // Forzar recarga
        window.location.reload();

        return { success: true, message: 'Datos descargados de la web correctamente' };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
import { AppSettings, Article, Author } from '../types';
import { getArticles, getAuthors, saveArticle, saveAuthor } from './dataService';

const SETTINGS_KEY = 'td_app_settings';

export const getSettings = (): AppSettings => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  const settings = stored ? JSON.parse(stored) : {};
  
  // Defaults
  return {
    githubToken: settings.githubToken || '',
    repoOwner: settings.repoOwner || '',
    repoName: settings.repoName || '',
    filePath: settings.filePath || 'public/data/db.json',
    repoBranch: settings.repoBranch || 'main' // Default to main if not set
  };
};

export const saveSettings = (settings: AppSettings) => {
  const cleanSettings = {
    ...settings,
    githubToken: settings.githubToken.trim(),
    repoOwner: settings.repoOwner.trim(),
    repoName: settings.repoName.trim(),
    filePath: settings.filePath.trim().replace(/^\//, ''),
    repoBranch: settings.repoBranch?.trim() || 'main'
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(cleanSettings));
};

interface GitHubFileResponse {
  sha: string;
  content: string;
  encoding: string;
}

interface DatabaseSchema {
  articles: Article[];
  authors: Author[];
  lastUpdated: string;
}

// Escanea el repositorio buscando archivos .json
export const findJsonFiles = async (): Promise<string[]> => {
    const settings = getSettings();
    if (!settings.githubToken || !settings.repoOwner || !settings.repoName) return [];
  
    try {
      // Usamos la API de Trees con recursive=1 para ver todos los archivos
      const url = `https://api.github.com/repos/${settings.repoOwner}/${settings.repoName}/git/trees/${settings.repoBranch}?recursive=1`;
      const response = await fetch(url, {
        headers: { 'Authorization': `token ${settings.githubToken}` }
      });
      
      if (!response.ok) return [];
      
      const data = await response.json();
      if (!data.tree) return [];

      // Filtramos solo los blobs (archivos) que terminen en .json
      const jsonFiles = data.tree
        .filter((item: any) => item.path.endsWith('.json') && item.type === 'blob')
        .map((item: any) => item.path);
        
      return jsonFiles;
    } catch (e) {
      console.error("Error buscando archivos JSON", e);
      return [];
    }
  }

export const verifyConnection = async (): Promise<{ success: boolean; message: string }> => {
    const settings = getSettings();
    if (!settings.githubToken || !settings.repoOwner || !settings.repoName) {
       return { success: false, message: 'Faltan datos de configuración' };
    }
  
    // 1. Verificar Repositorio y Permisos
    const repoUrl = `https://api.github.com/repos/${settings.repoOwner}/${settings.repoName}`;
    try {
        const repoRes = await fetch(repoUrl, {
            headers: { 'Authorization': `token ${settings.githubToken}` }
        });
        
        if (repoRes.status !== 200) {
            if (repoRes.status === 404) return { success: false, message: '❌ No se encuentra el repositorio.' };
            if (repoRes.status === 401) return { success: false, message: '❌ Token inválido.' };
            return { success: false, message: `❌ Error accediendo al repo: ${repoRes.status}` };
        }

        const repoData = await repoRes.json();
        if (repoData.permissions && repoData.permissions.push === false) {
            return { success: false, message: '⚠️ Token sin permiso de escritura (Write/Push).' };
        }

        // 2. Verificar Rama
        const branchUrl = `https://api.github.com/repos/${settings.repoOwner}/${settings.repoName}/branches/${settings.repoBranch}`;
        const branchRes = await fetch(branchUrl, {
             headers: { 'Authorization': `token ${settings.githubToken}` }
        });

        if (branchRes.status === 404) {
            return { success: false, message: `⚠️ La rama "${settings.repoBranch}" no existe.` };
        }

        // 3. Verificar Archivo (Opcional, informativo)
        const fileUrl = `https://api.github.com/repos/${settings.repoOwner}/${settings.repoName}/contents/${settings.filePath}?ref=${settings.repoBranch}`;
        const fileRes = await fetch(fileUrl, {
             headers: { 'Authorization': `token ${settings.githubToken}` }
        });

        if (fileRes.status === 404) {
             return { success: true, message: `✅ Conexión correcta. El archivo "${settings.filePath}" no existe aún, se creará al publicar.` };
        }

        return { success: true, message: `✅ Conexión y archivo encontrados en rama "${settings.repoBranch}".` };

    } catch (e: any) {
        return { success: false, message: `❌ Error de red: ${e.message}` };
    }
  }

export const syncWithGitHub = async (): Promise<{ success: boolean; message: string }> => {
  const settings = getSettings();
  
  if (!settings.githubToken) {
    return { success: false, message: 'Falta configuración.' };
  }

  // SEGURIDAD: Evitar sobrescribir código fuente
  if (!settings.filePath.endsWith('.json')) {
      return { success: false, message: '⛔ SEGURIDAD: Solo se permite guardar en archivos .json para evitar dañar la web.' };
  }

  // URL base con soporte para rama (?ref=branch para GET)
  const baseUrl = `https://api.github.com/repos/${settings.repoOwner}/${settings.repoName}/contents/${settings.filePath}`;
  const getUrl = `${baseUrl}?ref=${settings.repoBranch}`;
  
  const headers = {
    'Authorization': `token ${settings.githubToken}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };

  try {
    // 1. GET SHA
    const getResponse = await fetch(getUrl, { headers });
    let sha = '';
    
    if (getResponse.ok) {
      const data: GitHubFileResponse = await getResponse.json();
      sha = data.sha;
    } else if (getResponse.status === 404) {
      console.log("Archivo no encontrado, se creará uno nuevo.");
    } else if (getResponse.status === 403) {
       throw new Error("Acceso denegado (403). Verifica permisos del Token.");
    } else {
       throw new Error(`Error leyendo archivo: ${getResponse.statusText}`);
    }

    // 2. Data
    const currentData: DatabaseSchema = {
        articles: getArticles(),
        authors: getAuthors(),
        lastUpdated: new Date().toISOString()
    };

    const jsonString = JSON.stringify(currentData, null, 2);
    const contentEncoded = btoa(unescape(encodeURIComponent(jsonString)));

    // 3. PUT (Importante: incluir 'branch' en el body)
    const body = {
      message: `Update ${settings.filePath}: ${new Date().toLocaleString()}`,
      content: contentEncoded,
      sha: sha || undefined,
      branch: settings.repoBranch // Especificar la rama
    };

    const putResponse = await fetch(baseUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    });

    if (!putResponse.ok) {
        const err = await putResponse.json();
        throw new Error(`Error subiendo (${putResponse.status}): ${err.message}`);
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

    const url = `https://api.github.com/repos/${settings.repoOwner}/${settings.repoName}/contents/${settings.filePath}?ref=${settings.repoBranch}`;
    
    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `token ${settings.githubToken}` }
        });

        if (!response.ok) {
            if(response.status === 404) throw new Error('El archivo no existe en la rama especificada.');
            throw new Error('Error al conectar con GitHub');
        }

        const data: GitHubFileResponse = await response.json();
        const decodedContent = decodeURIComponent(escape(window.atob(data.content)));
        const db: DatabaseSchema = JSON.parse(decodedContent);

        if (db.articles) localStorage.setItem('td_articles_v4', JSON.stringify(db.articles));
        if (db.authors) localStorage.setItem('td_authors_v4', JSON.stringify(db.authors));

        window.location.reload();

        return { success: true, message: 'Datos descargados correctamente' };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
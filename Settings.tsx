import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../services/githubService';
import { AppSettings } from '../types';
import { Save, Github, AlertTriangle } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    githubToken: '',
    repoOwner: '',
    repoName: '',
    filePath: 'public/data/db.json'
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Configuración de Conexión</h2>
        <p className="text-gray-500">Vincula la aplicación con tu repositorio de GitHub.</p>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 text-blue-800 text-sm">
         <Github className="flex-shrink-0" />
         <div>
            <p className="font-bold mb-1">¿Cómo funciona?</p>
            <p>Esta aplicación guardará un archivo <code>db.json</code> en tu repositorio. Tu página web debe estar programada para leer ese archivo y mostrar las noticias.</p>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
        
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Token de Acceso Personal (GitHub Token)</label>
            <input
                type="password"
                name="githubToken"
                value={settings.githubToken}
                onChange={handleChange}
                placeholder="ghp_xxxxxxxxxxxx"
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-brand-red outline-none font-mono text-sm"
                required
            />
            <p className="text-xs text-gray-400">
                Necesitas un token con permisos de 'repo'. <a href="https://github.com/settings/tokens" target="_blank" className="underline hover:text-brand-red">Generar Token aquí</a>.
            </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Usuario GitHub</label>
                <input
                    type="text"
                    name="repoOwner"
                    value={settings.repoOwner}
                    onChange={handleChange}
                    placeholder="Ej: usuario123"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:border-brand-red outline-none"
                    required
                />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nombre del Repositorio</label>
                <input
                    type="text"
                    name="repoName"
                    value={settings.repoName}
                    onChange={handleChange}
                    placeholder="Ej: tendidodigital-web"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:border-brand-red outline-none"
                    required
                />
            </div>
        </div>

        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Ruta del Archivo (En el repo)</label>
            <input
                type="text"
                name="filePath"
                value={settings.filePath}
                onChange={handleChange}
                placeholder="public/data/db.json"
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-brand-red outline-none font-mono text-sm"
                required
            />
            <p className="text-xs text-gray-400">Carpeta y nombre del archivo donde se guardarán los datos.</p>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            {saved ? <span className="text-green-600 font-medium animate-pulse">¡Guardado correctamente!</span> : <span></span>}
            <button 
                type="submit" 
                className="bg-brand-dark hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
                <Save size={18} />
                Guardar Configuración
            </button>
        </div>

      </form>

      <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex gap-3 text-orange-800 text-sm">
         <AlertTriangle className="flex-shrink-0" />
         <div>
            <p className="font-bold mb-1">Importante sobre las Imágenes</p>
            <p>Las imágenes se guardan codificadas dentro del archivo. Si subes muchas imágenes de alta calidad, el archivo puede pesar demasiado para GitHub. Intenta usar imágenes optimizadas o enlaces externos.</p>
         </div>
      </div>
    </div>
  );
};

export default Settings;
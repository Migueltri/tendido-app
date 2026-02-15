import React, { useEffect, useState } from 'react';
import { getArticles, deleteArticle, getAuthors } from '../services/dataService';
import { Article, Category, Author } from '../types';
import { Link } from 'react-router-dom';
import { Plus, Search, Trash2, Edit2, Filter, AlertCircle } from 'lucide-react';

const ArticlesList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletedCount, setDeletedCount] = useState(0);

  const loadData = () => {
    setArticles(getArticles());
    setAuthors(getAuthors());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id: string, title: string) => {
    // Confirmación estricta
    if (confirm(`¿ATENCIÓN: Estás seguro de que quieres eliminar la noticia: "${title}"?\n\nEsta acción no se puede deshacer localmente.`)) {
      deleteArticle(id);
      loadData();
      setDeletedCount(prev => prev + 1);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesCategory = filterCategory === 'all' || article.category === filterCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getAuthorName = (id: string) => {
    const author = authors.find(a => a.id === id);
    return author ? author.name : 'Desconocido';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-bold text-gray-800">Gestión de Noticias</h2>
           <p className="text-gray-500">Administra todas las publicaciones de Tendido Digital</p>
        </div>
        <Link 
          to="/crear-noticia" 
          className="bg-brand-red hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm font-medium"
        >
          <Plus size={18} />
          Nueva Noticia
        </Link>
      </div>

      {/* Aviso de cambios pendientes al borrar */}
      {deletedCount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start gap-3 animate-fade-in text-yellow-800">
              <AlertCircle className="flex-shrink-0 mt-0.5" />
              <div>
                  <p className="font-bold">Has eliminado noticias localmente.</p>
                  <p className="text-sm">Para que desaparezcan de la página web real, recuerda ir al Panel Principal y pulsar <span className="font-bold">"Publicar cambios en la Web"</span>.</p>
              </div>
          </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por título..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter size={18} className="text-gray-500" />
            <select 
              className="w-full md:w-48 p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-red bg-white"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">Todas las Categorías</option>
              {Object.values(Category).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm">
                <th className="p-4 font-medium">Noticia</th>
                <th className="p-4 font-medium">Categoría</th>
                <th className="p-4 font-medium">Autor</th>
                <th className="p-4 font-medium">Fecha</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No se encontraron noticias con los filtros actuales.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50 group">
                    <td className="p-4 max-w-md">
                      <div className="flex items-center gap-3">
                        <img src={article.imageUrl} className="w-10 h-10 rounded object-cover bg-gray-200" alt="" />
                        <div>
                           <p className="font-medium text-gray-900 line-clamp-1">{article.title}</p>
                           <p className="text-xs text-gray-500 line-clamp-1">{article.summary}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`
                        px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${article.category === Category.CRONICAS ? 'bg-orange-50 text-orange-700 border-orange-100' : ''}
                        ${article.category === Category.ACTUALIDAD ? 'bg-blue-50 text-blue-700 border-blue-100' : ''}
                        ${article.category === Category.ENTREVISTAS ? 'bg-green-50 text-green-700 border-green-100' : ''}
                        ${article.category === Category.OPINION ? 'bg-purple-50 text-purple-700 border-purple-100' : ''}
                      `}>
                        {article.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {getAuthorName(article.authorId)}
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(article.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/editar-noticia/${article.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(article.id, article.title)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ArticlesList;
import React, { useEffect, useState } from 'react';
import { getAuthors, saveAuthor, deleteAuthor } from '../services/dataService';
import { Author } from '../types';
import { Plus, Trash2, User } from 'lucide-react';

const Authors: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState({ name: '', role: '', imageUrl: '' });

  const loadAuthors = () => {
    setAuthors(getAuthors());
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.name || !newAuthor.role) return;

    saveAuthor({
      id: Date.now().toString(),
      name: newAuthor.name,
      role: newAuthor.role,
      imageUrl: newAuthor.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(newAuthor.name)}&background=random`
    });

    setNewAuthor({ name: '', role: '', imageUrl: '' });
    setIsFormOpen(false);
    loadAuthors();
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Borrar autor?')) {
        deleteAuthor(id);
        loadAuthors();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-3xl font-bold text-gray-800">Equipo de Redacción</h2>
           <p className="text-gray-500">Gestiona quién escribe las noticias en Tendido Digital.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-brand-dark hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Añadir Autor
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 animate-fade-in-down">
          <h3 className="font-bold text-lg mb-4">Nuevo Autor</h3>
          <form onSubmit={handleSave} className="flex flex-col md:flex-row gap-4 items-end">
             <div className="flex-1 w-full space-y-1">
               <label className="text-xs font-semibold text-gray-500 uppercase">Nombre</label>
               <input 
                 type="text" 
                 className="w-full p-2 border rounded" 
                 placeholder="Ej: Juan Belmonte"
                 value={newAuthor.name}
                 onChange={e => setNewAuthor({...newAuthor, name: e.target.value})}
                 required
               />
             </div>
             <div className="flex-1 w-full space-y-1">
               <label className="text-xs font-semibold text-gray-500 uppercase">Cargo / Rol</label>
               <input 
                 type="text" 
                 className="w-full p-2 border rounded" 
                 placeholder="Ej: Cronista, Fotógrafo..."
                 value={newAuthor.role}
                 onChange={e => setNewAuthor({...newAuthor, role: e.target.value})}
                 required
               />
             </div>
             <button type="submit" className="bg-brand-red text-white px-6 py-2.5 rounded hover:bg-red-700 w-full md:w-auto">Guardar</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => (
          <div key={author.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 group">
             <img 
               src={author.imageUrl} 
               alt={author.name} 
               className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
             />
             <div className="flex-1">
                <h4 className="font-bold text-gray-900">{author.name}</h4>
                <p className="text-sm text-brand-red font-medium">{author.role}</p>
             </div>
             <button 
               onClick={() => handleDelete(author.id)}
               className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2"
             >
               <Trash2 size={18} />
             </button>
          </div>
        ))}
        {authors.length === 0 && (
          <div className="col-span-3 text-center py-10 text-gray-400">
            <User size={48} className="mx-auto mb-2 opacity-50" />
            <p>No hay autores registrados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Authors;
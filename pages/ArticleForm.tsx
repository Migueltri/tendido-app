import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getArticleById, getAuthors, saveArticle } from '../services/dataService';
import { Article, Author, Category, BullfightResult } from '../types';
import { Save, ArrowLeft, Image as ImageIcon, UploadCloud, X, Plus, Bold, Italic, List, Shield, MapPin, Award, Trash2 } from 'lucide-react';

const ArticleForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [authors, setAuthors] = useState<Author[]>([]);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Article>>({
    title: '',
    summary: '',
    content: '',
    category: Category.ACTUALIDAD,
    imageUrl: '',
    contentImages: [],
    authorId: '',
    isPublished: true,
    // Chronicle specific defaults
    bullfightLocation: '',
    bullfightCattle: '',
    bullfightSummary: '',
    bullfightResults: []
  });

  // Local state for adding a new result row
  const [newResult, setNewResult] = useState<BullfightResult>({ bullfighter: '', result: '' });

  // Refs
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAuthors(getAuthors());
    
    if (isEditMode && id) {
      const article = getArticleById(id);
      if (article) {
        setFormData(article);
        if (editorRef.current) {
            editorRef.current.innerHTML = article.content;
        }
      } else {
        navigate('/noticias');
      }
    } else {
        setFormData({
            title: '',
            summary: '',
            content: '',
            category: Category.ACTUALIDAD,
            imageUrl: '',
            contentImages: [],
            authorId: '',
            isPublished: true,
            bullfightLocation: '',
            bullfightCattle: '',
            bullfightSummary: '',
            bullfightResults: []
        });
        if (editorRef.current) {
            editorRef.current.innerHTML = '';
        }
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: string[] = [];
      const promises: Promise<string>[] = [];

      Array.from(files).forEach(file => {
        const promise = new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
             resolve(reader.result as string);
          };
          reader.readAsDataURL(file as Blob);
        });
        promises.push(promise);
      });

      Promise.all(promises).then((results) => {
         setFormData(prev => ({
           ...prev,
           contentImages: [...(prev.contentImages || []), ...results]
         }));
      });
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
      setFormData(prev => ({
          ...prev,
          contentImages: prev.contentImages?.filter((_, index) => index !== indexToRemove)
      }));
  };

  // Result Management
  const addResult = () => {
    if (newResult.bullfighter && newResult.result) {
        setFormData(prev => ({
            ...prev,
            bullfightResults: [...(prev.bullfightResults || []), newResult]
        }));
        setNewResult({ bullfighter: '', result: '' });
    }
  };

  const removeResult = (index: number) => {
      setFormData(prev => ({
          ...prev,
          bullfightResults: prev.bullfightResults?.filter((_, i) => i !== index)
      }));
  };

  const handleFormat = (command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.authorId) {
        alert('Por favor completa los campos obligatorios');
        return;
    }

    const articleToSave: Article = {
      id: isEditMode ? id! : Date.now().toString(),
      title: formData.title || '',
      summary: formData.summary || '',
      content: formData.content || '',
      category: formData.category as Category,
      authorId: formData.authorId || '',
      imageUrl: formData.imageUrl || 'https://picsum.photos/800/600',
      contentImages: formData.contentImages || [],
      date: formData.date || new Date().toISOString(),
      isPublished: true,
      // Optional Chronicle fields
      bullfightLocation: formData.bullfightLocation,
      bullfightCattle: formData.bullfightCattle,
      bullfightSummary: formData.bullfightSummary,
      bullfightResults: formData.bullfightResults
    };

    saveArticle(articleToSave);
    navigate('/noticias');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 mb-12">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Editar Noticia' : 'Nueva Noticia'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 space-y-8">
        
        {/* Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none text-lg font-medium bg-white"
            placeholder="Escribe un titular llamativo..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none bg-white"
            >
                {Object.values(Category).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
            </div>

            {/* Author */}
            <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Autor</label>
            <select
                name="authorId"
                value={formData.authorId}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none bg-white"
                required
            >
                <option value="">Selecciona un autor</option>
                {authors.map(author => (
                <option key={author.id} value={author.id}>{author.name}</option>
                ))}
            </select>
            </div>
        </div>

        {/* --- SECTION: Chronicle Specific Data (Visible only for Crónicas) --- */}
        {formData.category === Category.CRONICAS && (
            <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 space-y-6">
                <div className="flex items-center gap-2 text-orange-800 border-b border-orange-200 pb-2">
                    <Shield size={20} />
                    <h3 className="font-bold text-lg">Ficha del Festejo</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-orange-800 uppercase flex items-center gap-1">
                             <MapPin size={14} /> Plaza
                        </label>
                        <input
                            type="text"
                            name="bullfightLocation"
                            value={formData.bullfightLocation}
                            onChange={handleChange}
                            className="w-full p-2 border border-orange-200 rounded focus:border-orange-500 outline-none bg-white"
                            placeholder="Ej: Plaza Mayor de Ciudad Rodrigo"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-orange-800 uppercase flex items-center gap-1">
                             <Shield size={14} /> Ganadería
                        </label>
                        <input
                            type="text"
                            name="bullfightCattle"
                            value={formData.bullfightCattle}
                            onChange={handleChange}
                            className="w-full p-2 border border-orange-200 rounded focus:border-orange-500 outline-none bg-white"
                            placeholder="Ej: Novillos de Talavante"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-orange-800 uppercase">Resumen del Festejo (Ficha Técnica)</label>
                    <textarea
                        name="bullfightSummary"
                        value={formData.bullfightSummary}
                        onChange={handleChange}
                        rows={3}
                        className="w-full p-2 border border-orange-200 rounded focus:border-orange-500 outline-none resize-none bg-white"
                        placeholder="Resumen general del comportamiento del ganado y la tarde..."
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-semibold text-orange-800 uppercase flex items-center gap-1">
                        <Award size={14} /> Resultados
                    </label>
                    
                    {/* List of added results */}
                    <div className="space-y-2">
                        {formData.bullfightResults?.map((res, idx) => (
                            <div key={idx} className="flex items-center bg-white p-2 rounded border border-orange-200 shadow-sm">
                                <div className="flex-1">
                                    <span className="font-bold text-gray-800">{res.bullfighter}</span>
                                    <span className="text-gray-400 mx-2">|</span>
                                    <span className="text-gray-600 italic">{res.result}</span>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => removeResult(idx)}
                                    className="text-red-400 hover:text-red-600 p-1"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add new result input */}
                    <div className="flex flex-col md:flex-row gap-2 items-end bg-orange-100/50 p-3 rounded-lg">
                        <div className="flex-1 w-full">
                             <input 
                                type="text" 
                                placeholder="Nombre (Ej: Diego Urdiales)"
                                className="w-full p-2 text-sm border border-gray-300 rounded bg-white"
                                value={newResult.bullfighter}
                                onChange={(e) => setNewResult(prev => ({ ...prev, bullfighter: e.target.value }))}
                             />
                        </div>
                        <div className="flex-1 w-full">
                             <input 
                                type="text" 
                                placeholder="Resultado (Ej: una oreja)"
                                className="w-full p-2 text-sm border border-gray-300 rounded bg-white"
                                value={newResult.result}
                                onChange={(e) => setNewResult(prev => ({ ...prev, result: e.target.value }))}
                             />
                        </div>
                        <button 
                            type="button"
                            onClick={addResult}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors w-full md:w-auto"
                        >
                            Añadir
                        </button>
                    </div>
                </div>

            </div>
        )}

        {/* Summary */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Resumen / Entradilla (Portada)</label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows={2}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none bg-white"
            placeholder="Breve descripción que aparecerá en la portada..."
          />
        </div>

        {/* --- Image Section 1: Main Image --- */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <ImageIcon size={18} />
            Imagen del Titular (Portada)
          </label>
          
          <div 
             className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative overflow-hidden"
             onClick={() => mainImageInputRef.current?.click()}
             onDragOver={(e) => e.preventDefault()}
             onDrop={(e) => {
               e.preventDefault();
               if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                 const file = e.dataTransfer.files[0];
                 const reader = new FileReader();
                 reader.onloadend = () => setFormData(p => ({ ...p, imageUrl: reader.result as string }));
                 reader.readAsDataURL(file);
               }
             }}
          >
             {formData.imageUrl ? (
               <div className="relative w-full h-64">
                  <img src={formData.imageUrl} alt="Portada" className="w-full h-full object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                      <p className="text-white font-medium flex items-center gap-2"><UploadCloud size={20} /> Cambiar Imagen</p>
                  </div>
               </div>
             ) : (
               <div className="py-8 space-y-2">
                 <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                    <UploadCloud size={24} />
                 </div>
                 <p className="text-gray-600 font-medium">Haz clic o arrastra una imagen aquí</p>
                 <p className="text-xs text-gray-400">JPG, PNG hasta 5MB</p>
               </div>
             )}
             <input 
               type="file" 
               ref={mainImageInputRef} 
               className="hidden" 
               accept="image/*"
               onChange={handleMainImageUpload}
             />
          </div>
        </div>

        {/* --- Image Section 2: Gallery/News Images --- */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
             <ImageIcon size={18} />
             Imágenes de la Noticia (Galería)
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Upload Button */}
              <div 
                onClick={() => galleryInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-brand-red/50 hover:text-brand-red transition-all"
              >
                  <Plus size={32} className="mb-2 opacity-50" />
                  <span className="text-xs font-medium">Añadir Fotos</span>
                  <input 
                    type="file" 
                    ref={galleryInputRef} 
                    className="hidden" 
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                  />
              </div>

              {/* Gallery Previews */}
              {formData.contentImages?.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200">
                      <img src={img} alt={`Galería ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                          <X size={14} />
                      </button>
                  </div>
              ))}
          </div>
          <p className="text-xs text-gray-400">Puedes subir múltiples imágenes para que aparezcan en el cuerpo de la noticia.</p>
        </div>

        {/* Content (Rich Text Editor) */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Contenido de la Noticia</label>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-red/20 focus-within:border-brand-red bg-white">
              {/* Toolbar */}
              <div className="flex items-center gap-1 p-2 border-b border-gray-100 bg-gray-50">
                  <button 
                    type="button" 
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleFormat('bold')} 
                    className="p-2 hover:bg-gray-200 rounded text-gray-700 transition-colors" 
                    title="Negrita"
                  >
                      <Bold size={18} />
                  </button>
                  <button 
                    type="button" 
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleFormat('italic')} 
                    className="p-2 hover:bg-gray-200 rounded text-gray-700 transition-colors" 
                    title="Cursiva"
                  >
                      <Italic size={18} />
                  </button>
                  <button 
                    type="button" 
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleFormat('insertUnorderedList')} 
                    className="p-2 hover:bg-gray-200 rounded text-gray-700 transition-colors" 
                    title="Lista con viñetas"
                  >
                      <List size={18} />
                  </button>
              </div>

              {/* Editor Area */}
              <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  className="w-full p-4 min-h-[300px] outline-none font-sans text-gray-700 leading-relaxed overflow-y-auto"
                  onInput={(e) => {
                      const newContent = e.currentTarget.innerHTML;
                      setFormData(prev => ({ ...prev, content: newContent }));
                  }}
                  style={{ minHeight: '300px' }}
              />
          </div>
          <p className="text-xs text-gray-400">Selecciona el texto y usa los botones para dar formato.</p>
        </div>

        {/* Footer Buttons */}
        <div className="pt-4 flex justify-end gap-4 border-t border-gray-100">
             <button 
                type="button" 
                onClick={() => navigate('/noticias')}
                className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
             >
                Cancelar
             </button>
             <button 
                type="submit" 
                className="px-6 py-2.5 bg-brand-red hover:bg-red-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
             >
                <Save size={18} />
                {isEditMode ? 'Guardar Cambios' : 'Publicar Noticia'}
             </button>
        </div>

      </form>
    </div>
  );
};

export default ArticleForm;
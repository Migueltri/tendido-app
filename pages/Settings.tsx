import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings, verifyConnection, findJsonFiles } from '../services/githubService';
import { AppSettings } from '../types';
import { Save, Search, FileJson, Code, Copy, CheckCircle, XCircle, RefreshCw, Bug } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    githubToken: '',
    repoOwner: '',
    repoName: '',
    filePath: 'public/data/db.json',
    repoBranch: 'main'
  });
  const [saved, setSaved] = useState(false);
  const [testStatus, setTestStatus] = useState<{ loading: boolean, msg: string, success?: boolean } | null>(null);
  const [foundFiles, setFoundFiles] = useState<string[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showCode, setShowCode] = useState(true); 

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings.filePath.endsWith('.json')) {
        alert("Error: El archivo debe terminar en .json");
        return;
    }
    saveSettings(settings);
    setSettings(getSettings()); 
    setSaved(true);
    setTestStatus(null);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTestConnection = async () => {
      saveSettings(settings);
      setSettings(getSettings()); 
      setTestStatus({ loading: true, msg: 'Verificando...', success: false });
      const result = await verifyConnection();
      setTestStatus({ loading: false, msg: result.message, success: result.success });
  };

  const handleSearchFiles = async () => {
      if(!settings.githubToken || !settings.repoOwner || !settings.repoName) {
          alert("Rellena los datos primero.");
          return;
      }
      setIsSearching(true);
      setFoundFiles(null);
      const files = await findJsonFiles();
      setFoundFiles(files);
      setIsSearching(false);
  };

  const selectFile = (file: string) => {
      setSettings(prev => ({ ...prev, filePath: file }));
      setFoundFiles(null);
  };

  // Código V6 - Corregido "verdadero" -> true y declaraciones duplicadas
  const integrationCode = `
import React, { useState, useEffect } from 'react';

// --- 1. INTERFACES Y TIPOS ---
interface BaseArticle {
  id: number | string;
  title: string;
  plaza?: string;
  date: string;
  category?: string;
  toreros?: string[];
  ganaderia?: string;
  resultado?: string[];
  torerosRaw?: string[];
  image: string;
  imageCaption?: string;
  video?: string;
  resumen?: string;
  detalles?: string;
  fullContent?: string;
  excerpt?: string;
  footerImage1?: string;
  footerImage1Caption?: string;
  footerImage2?: string;
  footerImage2Caption?: string;
  footerImage3?: string;
  footerImage3Caption?: string;
  footerImage4?: string;
  footerImage4Caption?: string;
  footerImage5?: string;
  footerImage5Caption?: string;
  footerImage6?: string;
  footerImage6Caption?: string;
  footerImage7?: string;
  footerImage7Caption?: string;	  
  footerImage8?: string;
  footerImage8Caption?: string;
  boldContent?: boolean;
  author?: string;
  authorLogo?: string;
  showAuthorHeader?: boolean;
}

type NewsItem = BaseArticle;
type OpinionArticle = BaseArticle;
type Chronicle = BaseArticle;

// --- 2. FUNCIONES AUXILIARES ---
function formatExactDate(dateString: string): string {
  const parsed = new Date(dateString);
  if (!isNaN(parsed.getTime())) {
    return parsed.toLocaleString("es-ES", {
      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  }
  return dateString;
}

const renderArticleContent = (text?: string | null) => {
  if (!text) return null;
  const normalized = text.replace(/\\r\\n/g, '\\n').replace(/\\r/g, '\\n').trim();
  let paragraphs = normalized.split(/\\n\\s*\\n/).map(p => p.trim()).filter(Boolean);
  
  if (paragraphs.length === 1 && normalized.length > 200) {
    const sentences = normalized.split(/(?<=[.?!])\\s+/);
    const groupSize = 2; 
    paragraphs = [];
    for (let i = 0; i < sentences.length; i += groupSize) {
      paragraphs.push(sentences.slice(i, i + groupSize).join(' ').trim());
    }
  }

  const toHtml = (p: string) =>
    p.replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
     .replace(/[“”]/g, '"')
     .replace(/[‘’]/g, "'")
     .replace(/\\n+/g, ' ');

  return paragraphs.map((p, i) => (
    <p key={i} className="text-gray-700 text-sm leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: toHtml(p) }} />
  ));
};

// --- 3. DATOS ESTÁTICOS ---

const latestNews: NewsItem[] = [
	{ 
    id: 235,
    title: \`Sábado en el Carnaval del Toro de Ciudad Rodrigo\`,
	image: "/images/ciud.jpg",
    category: "Crónicas",
    date: "15 de Febrero de 2026",
	excerpt: "Cuatro orejas y varios novillos aplaudidos en el arrastre en una tarde marcada por el viento, la huella taurina y el debut con entrega de Moisés Fraile.",
	plaza: "Plaza Mayor de Ciudad Rodrigo",
    ganaderia: "Novillos de las ganaderías de Talavante y un eral de El Pilar.",
	torerosRaw: \`Diego Urdiales: una oreja.
Alejandro Talavante: ovación.
Pablo Aguado: una oreja
El Mene: una oreja.
Moisés Fraile: ovación.\`,
	fullContent: \`En este sábado de carnaval, Ciudad Rodrigo vivió una tarde con una novillada de Talavante sensacional, ofreciendo cada uno de ellos un juego más que notable, bravos, con empuje en el caballo y una condición que creció a medida que avanzaba el festejo. El broche final lo puso un eral de El Pilar para el debutante Moisés Fraile.

Abrió plaza **Diego Urdiales**, toreando un novillo fijo en el capote que le permitió dibujar algunos lances estimables a pesar del aire. Empujó con fuerza en el tercio de varas y confirmo su nobleza ante el vendaval, pues el viento dejaba al descubierto al matador constantemente, pero el astado no hizo por él. No fue fácil el trasteo, el novillo apenas dejaba que Urdiales se colocara, yendo siempre detrás de la muleta sin apenas frenar. El riojano bridó su novillo al fallecido la noche anterior en la capea nocturna, añadiendo emoción a una faena de mérito y exposición. Mató de manera efectiva y paseó una oreja. El novillo por su parte fue aplaudido en el arrastre.

**Alejandro Talavante** sorteó un novillo con mayor transmisión que el primero, dejando ver su buen aire con el capote y con un quite por chicuelinas con ajuste y compás. Inició la faena de muleta a pies quietos, ligando tandas con muletazos encadenados y templados, aprovechando que el viento parecía haber disminuido un poco para mostrarse más versátil y asentado. La estocada, un poco contraria, pareció suficiente, pero el novillo se levantó y el espada extremeño se vio obligado al descabello. La demora hizo que los tendidos se enfriarán y todo se quedó en una ovación. De nuevo, el animal fue aplaudido en el arrastre.

**Pablo Aguado** dejó la faena de mayor sabor y torería. Brindó al cirujano de la plaza, Enrique Crespo, y arrancó con una tanda sensacional que marcó el tono de lo que vendría después: toreo con la yema de los dedos, de forma muy natural, despacio y con una gran pureza estética, creando una imagen de las que llegan y se quedan en los aficionados. Un pinchazo precedió a una estocada ligeramente tendida. En el trance se cortó en un dedo y tuvo que pasar por enfermería, donde recibió dos puntos de sutura. Cortó una oreja de ley.

**El Mene** se encontró con el novillo más completo del encierro, brindando a Talavante y planteando una faena de ligazón y entrega, exprimiendo la calidad del astado, dejando varios muletazos hilvanados con sentido y mando. Tras un pinchazo, dejó la mejor estocada de la tarde, recibiendo una oreja. El novillo fue aplaudido en el arrastre.

Cerró el debutante **Moisés Fraile** ante un eral de El Pilar, de su propia casa. Saludó con un quite por gaoneras muy ajustado y comenzó su faena a pies quietos, con decisión, aunque sufrió una fuerte voltereta. No obstante, eso no hizo que mermara su entrega. Su labor, llena de ganas y personalidad, conectó con el público, dejando pases muy buenos, especialmente con la mano izquierda. La espada emborronó lo que podía haber sido un gran premio: estocada enhebrada, varios pinchazos y hasta tres descabellos.\`,
    author: "Nerea F.Elena",
    authorLogo: "/images/nere.jpg",
    showAuthorHeader: true
   },
   // ... (AQUÍ DEBES PEGAR EL RESTO DE TU LISTA 'latestNews' ORIGINAL) ...
   // Asegúrate de que showAuthorHeader sea 'true' y no 'verdadero'
];

const chronicles: Chronicle[] = [
	{ 
    id: 4995,
    title: \`Sábado en el Carnaval del Toro de Ciudad Rodrigo\`,
	image: "/images/ciud.jpg",
    category: "Crónicas",
    date: "15 de Febrero de 2026",
	excerpt: "Cuatro orejas y varios novillos aplaudidos en el arrastre en una tarde marcada por el viento, la huella taurina y el debut con entrega de Moisés Fraile.",
	plaza: "Plaza Mayor de Ciudad Rodrigo",
    ganaderia: "Novillos de las ganaderías de Talavante y un eral de El Pilar.",
	torerosRaw: \`Diego Urdiales: una oreja.
Alejandro Talavante: ovación.
Pablo Aguado: una oreja
El Mene: una oreja.
Moisés Fraile: ovación.\`,
	fullContent: \`En este sábado de carnaval, Ciudad Rodrigo vivió una tarde con una novillada de Talavante sensacional...\`,
    author: "Nerea F.Elena",
    authorLogo: "/images/nere.jpg",
    showAuthorHeader: true
   },
   // ... (AQUÍ PEGA TU LISTA 'chronicles' ORIGINAL) ...
];

const entrevistas: NewsItem[] = [
	{ 
    id: 499,
    title: \`“El toreo es una forma de ser, de estar y de vivir” - Entrevista a José Garrido\`,
    image: "/images/cron1.jpg",
    category: "Entrevistas",
    date: "25 de Enero de 2026",
	imageCaption: "Fotos de Vanesa Santos",
    excerpt: "José Garrido afronta una etapa clave de madurez en su carrera...",
	fullContent: \`José Garrido afronta una etapa clave de madurez en su carrera...\`,
    author: "Eduardo Elvira",
    authorLogo: "/images/edu4.jpg",
    showAuthorHeader: true
  },
  // ... (AQUÍ PEGA TU LISTA 'entrevistas' ORIGINAL) ...
];

// Generamos featuredNews a partir de latestNews para evitar duplicados
const featuredNews = latestNews.slice(0, 5); 

// --- 4. COMPONENTE PRINCIPAL ---

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState(latestNews); // Inicializamos con latestNews
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedChronicle, setSelectedChronicle] = useState<Chronicle | null>(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isChronicleModalOpen, setIsChronicleModalOpen] = useState(false);
  const [visibleNewsCount, setVisibleNewsCount] = useState(15);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeTab, setActiveTab] = useState('inicio');
  const [newsFilter, setNewsFilter] = useState('todas');
  
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharePost, setSharePost] = useState<any>(null);

  // Carga desde CMS
  useEffect(() => {
    fetch('/data/db.json')
      .then((res) => {
         if(!res.ok) throw new Error("No db.json found");
         return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.articles)) {
            const newArticles = [...data.articles, ...latestNews];
            setArticles(newArticles);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.warn("Aviso CMS:", error.message);
        setLoading(false);
      });
  }, []);

  // Scroll Handler
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Carousel
  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredNews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Handlers
  const loadMoreNews = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleNewsCount(prev => prev + 18);
      setIsLoadingMore(false);
    }, 800);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  const openNewsModal = (news: any) => {
      setSelectedNews(news);
      setIsNewsModalOpen(true);
      document.body.style.overflow = "hidden";
  };

  const closeNewsModal = () => {
      setIsNewsModalOpen(false);
      setSelectedNews(null);
      document.body.style.overflow = "auto";
  };
  
  const openChronicleModal = (chronicle: any) => {
      setSelectedChronicle(chronicle);
      setIsChronicleModalOpen(true);
      document.body.style.overflow = "hidden";
  };

  const closeChronicleModal = () => {
      setIsChronicleModalOpen(false);
      setSelectedChronicle(null);
      document.body.style.overflow = "auto";
  };

  const toggleSave = (id: number, e?: any) => {
      if(e) e.stopPropagation();
      setSavedPosts(prev => {
          const newSet = new Set(prev);
          if(newSet.has(id)) newSet.delete(id);
          else newSet.add(id);
          return newSet;
      });
  };

  const openShareModal = (post: any, e?: any) => {
      if(e) e.stopPropagation();
      setSharePost(post);
      setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
      setIsShareModalOpen(false);
      setSharePost(null);
  };

  const getFilteredNews = () => {
      if (newsFilter === 'todas') return articles;
      return articles.filter(news => {
          const cat = news.category?.toLowerCase() || '';
          return cat.includes(newsFilter.toLowerCase()) || newsFilter.toLowerCase().includes(cat);
      });
  };

  // --- RENDERIZADO ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        {/* HEADER */}
        <header className={\`sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm transition-all \${scrollY > 50 ? 'shadow-md' : ''}\`}>
            <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
                    <img src="/images/tendidodigitallogosimple.png" alt="Logo" className="h-12 w-auto mix-blend-multiply" />
                    <span className="font-bold text-xl text-gray-900 hidden md:block">TENDIDO DIGITAL</span>
                </div>
                <nav className="hidden md:flex gap-6 font-medium text-gray-700">
                    <button onClick={() => { setActiveTab('inicio'); scrollToSection('inicio'); }} className="hover:text-red-600 transition">Inicio</button>
                    <button onClick={() => { setActiveTab('inicio'); scrollToSection('actualidad'); }} className="hover:text-red-600 transition">Actualidad</button>
                    <button onClick={() => setActiveTab('cronicas')} className="hover:text-red-600 transition">Crónicas</button>
                    <button onClick={() => setActiveTab('entrevistas')} className="hover:text-red-600 transition">Entrevistas</button>
                    <button onClick={() => scrollToSection('contacto')} className="hover:text-red-600 transition">Contacto</button>
                </nav>
                <button className="md:hidden text-2xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <i className={isMenuOpen ? "ri-close-line" : "ri-menu-line"}></i>
                </button>
            </div>
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t p-4 flex flex-col gap-4 shadow-lg absolute w-full z-50">
                    <button onClick={() => { setActiveTab('inicio'); setIsMenuOpen(false); }}>Inicio</button>
                    <button onClick={() => { setActiveTab('cronicas'); setIsMenuOpen(false); }}>Crónicas</button>
                    <button onClick={() => { setActiveTab('entrevistas'); setIsMenuOpen(false); }}>Entrevistas</button>
                    <button onClick={() => { scrollToSection('contacto'); setIsMenuOpen(false); }}>Contacto</button>
                </div>
            )}
        </header>

        {/* MAIN */}
        <main>
            {/* VISTA INICIO */}
            {activeTab === 'inicio' && (
                <>
                    {/* HERO */}
                    <section id="inicio" className="relative h-[60vh] md:h-[80vh] bg-black text-white overflow-hidden">
                        {featuredNews.map((news, idx) => (
                            <div key={news.id} className={\`absolute inset-0 transition-opacity duration-1000 \${idx === currentSlide ? 'opacity-100' : 'opacity-0'}\`}>
                                <img src={news.image} alt={news.title} className="w-full h-full object-cover opacity-60" />
                                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                                    <span className="bg-red-600 px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">{news.category}</span>
                                    <h1 className="text-3xl md:text-5xl font-bold max-w-4xl mb-6 leading-tight drop-shadow-lg">{news.title}</h1>
                                    <button onClick={() => openNewsModal(news)} className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition shadow-xl">
                                        Leer Noticia
                                    </button>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* FILTROS Y GRID */}
                    <section id="actualidad" className="max-w-7xl mx-auto px-4 py-16">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Últimas Noticias</h2>
                                <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full mt-2"></div>
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                                {['todas', 'actualidad', 'cronicas', 'entrevistas', 'opinion'].map(cat => (
                                    <button key={cat} onClick={() => setNewsFilter(cat)} className={\`px-6 py-2 rounded-full text-sm font-bold capitalize transition \${newsFilter === cat ? 'bg-red-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}\`}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {getFilteredNews().slice(0, visibleNewsCount).map((news: any) => (
                                <article key={news.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => openNewsModal(news)}>
                                    <div className="h-56 overflow-hidden relative">
                                        <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" loading="lazy" />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">{news.category}</span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <span className="text-xs text-gray-400 font-medium block mb-2">{formatExactDate(news.date)}</span>
                                        <h3 className="font-bold text-lg mb-3 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">{news.title}</h3>
                                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{news.excerpt || news.summary}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                        
                        {visibleNewsCount < getFilteredNews().length && (
                            <div className="text-center mt-12">
                                <button onClick={loadMoreNews} className="bg-white border-2 border-red-600 text-red-600 px-8 py-3 rounded-full font-bold hover:bg-red-600 hover:text-white transition-all shadow-md">
                                    {isLoadingMore ? 'Cargando...' : 'Cargar más noticias'}
                                </button>
                            </div>
                        )}
                    </section>
                </>
            )}

            {/* VISTA CRÓNICAS */}
            {activeTab === 'cronicas' && (
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <h2 className="text-3xl font-bold text-center mb-12">Crónicas Taurinas</h2>
                    <div className="space-y-8">
                        {chronicles.map((item: any) => (
                             <div key={item.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all cursor-pointer flex flex-col md:flex-row group" onClick={() => openChronicleModal(item)}>
                                 <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden">
                                     <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" />
                                 </div>
                                 <div className="p-8 md:w-2/3 flex flex-col justify-center">
                                     <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                                         <span className="text-red-600 font-bold uppercase tracking-wider">Reseña</span> • {item.date}
                                     </div>
                                     <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">{item.title}</h3>
                                     <p className="text-gray-600 mb-6 line-clamp-3">{item.excerpt || item.fullContent}</p>
                                     <div className="flex gap-4 text-sm font-medium text-gray-700">
                                         <span><i className="ri-map-pin-line text-red-500"></i> {item.plaza}</span>
                                         <span><i className="ri-vip-crown-line text-red-500"></i> {item.ganaderia}</span>
                                     </div>
                                 </div>
                             </div>
                        ))}
                    </div>
                </div>
            )}

            {/* VISTA ENTREVISTAS */}
            {activeTab === 'entrevistas' && (
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <h2 className="text-3xl font-bold text-center mb-12">Entrevistas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {entrevistas.map((item: any) => (
                             <div key={item.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer group" onClick={() => openNewsModal(item)}>
                                 <div className="h-72 overflow-hidden relative">
                                     <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                     <div className="absolute bottom-6 left-6 text-white">
                                         <h3 className="text-2xl font-bold leading-tight">{item.title}</h3>
                                     </div>
                                 </div>
                                 <div className="p-6">
                                     <p className="text-gray-600 line-clamp-3">{item.excerpt}</p>
                                     <div className="mt-4 text-red-600 font-bold text-sm group-hover:underline">Leer entrevista completa &rarr;</div>
                                 </div>
                             </div>
                        ))}
                    </div>
                </div>
            )}
        </main>

        {/* MODAL DE NOTICIA */}
        {isNewsModalOpen && selectedNews && (
            <div className="fixed inset-0 bg-white z-[60] overflow-y-auto animate-fade-in">
                <div className="sticky top-0 bg-white/95 backdrop-blur border-b px-4 py-3 flex justify-between items-center z-10 shadow-sm">
                    <button onClick={closeNewsModal} className="flex items-center text-gray-600 hover:text-black transition">
                        <i className="ri-arrow-left-line text-2xl mr-2"></i> <span className="font-medium">Volver</span>
                    </button>
                    <div className="flex gap-2">
                        <button onClick={() => toggleSave(selectedNews.id)} className="p-2 rounded-full hover:bg-gray-100 transition">
                            <i className={\`ri-bookmark-\${savedPosts.has(Number(selectedNews.id)) ? 'fill text-yellow-500' : 'line'} text-xl\`}></i>
                        </button>
                        <button onClick={() => openShareModal(selectedNews)} className="p-2 rounded-full hover:bg-gray-100 transition">
                            <i className="ri-share-line text-xl"></i>
                        </button>
                    </div>
                </div>
                
                <div className="max-w-3xl mx-auto px-4 py-10">
                    <div className="text-center mb-8">
                        <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase">{selectedNews.category}</span>
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mt-4 mb-4 leading-tight">{selectedNews.title}</h1>
                        <div className="flex justify-center items-center gap-2 text-gray-500 text-sm">
                            <span>{formatExactDate(selectedNews.date)}</span>
                            {selectedNews.author && <span>| Por <strong>{selectedNews.author}</strong></span>}
                        </div>
                    </div>

                    <img src={selectedNews.image} className="w-full rounded-xl shadow-lg mb-2" />
                    {selectedNews.imageCaption && <p className="text-right text-xs text-gray-400 italic mb-8">{selectedNews.imageCaption}</p>}

                    <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                        {selectedNews.excerpt && <p className="font-medium text-xl text-gray-600 mb-8 not-prose border-l-4 border-red-500 pl-4">{selectedNews.excerpt}</p>}
                        {renderArticleContent(selectedNews.fullContent || selectedNews.detalles)}
                    </div>

                    <div className="mt-12 space-y-6">
                        {[selectedNews.footerImage1, selectedNews.footerImage2, selectedNews.footerImage3, selectedNews.footerImage4].filter(Boolean).map((img, idx) => (
                            <img key={idx} src={img} className="w-full rounded-xl shadow-md" loading="lazy" />
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* MODAL CRÓNICA */}
        {isChronicleModalOpen && selectedChronicle && (
            <div className="fixed inset-0 bg-white z-[60] overflow-y-auto animate-fade-in">
                 <div className="sticky top-0 bg-white/95 backdrop-blur border-b px-4 py-3 flex justify-between items-center z-10 shadow-sm">
                    <button onClick={closeChronicleModal} className="flex items-center text-gray-600 hover:text-black transition">
                        <i className="ri-arrow-left-line text-2xl mr-2"></i> <span className="font-medium">Volver a Crónicas</span>
                    </button>
                    <div className="flex gap-2">
                        <button onClick={() => toggleSave(selectedChronicle.id)} className="p-2 rounded-full hover:bg-gray-100 transition">
                             <i className={\`ri-bookmark-\${savedPosts.has(Number(selectedChronicle.id)) ? 'fill text-yellow-500' : 'line'} text-xl\`}></i>
                        </button>
                    </div>
                </div>
                <div className="max-w-3xl mx-auto px-4 py-8">
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">La Reseña</span>
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mt-4 mb-6 leading-tight">{selectedChronicle.title}</h1>
                    <img src={selectedChronicle.image} className="w-full rounded-xl shadow-lg mb-8" />
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
                         <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                             <div><span className="font-bold text-gray-900">Plaza:</span> {selectedChronicle.plaza}</div>
                             <div><span className="font-bold text-gray-900">Ganadería:</span> {selectedChronicle.ganaderia}</div>
                         </div>
                         {selectedChronicle.torerosRaw && (
                             <div className="p-4 bg-white rounded border border-gray-200 text-sm font-medium text-gray-800 whitespace-pre-line">
                                 {selectedChronicle.torerosRaw}
                             </div>
                         )}
                    </div>

                    <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                         {renderArticleContent(selectedChronicle.fullContent || selectedChronicle.detalles || selectedChronicle.excerpt)}
                    </div>
                </div>
            </div>
        )}

        {/* FOOTER */}
        <footer className="bg-gray-900 text-white py-12 border-t border-gray-800" id="contacto">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-2xl font-bold mb-4">TENDIDO DIGITAL</h2>
                <p className="text-gray-400 mb-8">Portal taurino de referencia.</p>
                <div className="flex justify-center gap-6 mb-8">
                    <a href="https://twitter.com/ptendidodigital" target="_blank" className="hover:text-red-500 transition"><i className="ri-twitter-x-fill text-2xl"></i></a>
                    <a href="https://instagram.com/portaltendidodigital" target="_blank" className="hover:text-red-500 transition"><i className="ri-instagram-fill text-2xl"></i></a>
                    <a href="https://tiktok.com/@portaltendidodigital" target="_blank" className="hover:text-red-500 transition"><i className="ri-tiktok-fill text-2xl"></i></a>
                </div>
                <p className="text-gray-600 text-sm">© 2026 Tendido Digital. Todos los derechos reservados.</p>
            </div>
        </footer>
    </div>
  );
}
`.trim();

  return (
    <div className="max-w-3xl mx-auto space-y-8 mb-12">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Configuración</h2>
        <p className="text-gray-500">Configura la conexión con GitHub y obtén el código para tu web.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
        {/* Form fields (same as previous) */}
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Token de GitHub</label>
            <input type="password" name="githubToken" value={settings.githubToken} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="repoOwner" value={settings.repoOwner} onChange={handleChange} placeholder="Usuario" className="w-full p-3 border border-gray-200 rounded-lg" required />
            <input type="text" name="repoName" value={settings.repoName} onChange={handleChange} placeholder="Repositorio" className="w-full p-3 border border-gray-200 rounded-lg" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input type="text" name="repoBranch" value={settings.repoBranch} onChange={handleChange} placeholder="Rama" className="w-full p-3 border border-gray-200 rounded-lg" required />
            <div className="md:col-span-2 flex gap-2">
                <input type="text" name="filePath" value={settings.filePath} onChange={handleChange} placeholder="Ruta .json" className="w-full p-3 border rounded-lg" required />
                <button type="button" onClick={handleSearchFiles} className="bg-gray-100 p-3 rounded-lg"><Search size={18}/></button>
            </div>
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t">
            <button type="button" onClick={handleTestConnection} className="bg-white border px-4 py-2 rounded-lg">Probar</button>
            <button type="submit" className="bg-brand-dark text-white px-6 py-2 rounded-lg flex items-center gap-2"><Save size={18}/> Guardar</button>
        </div>
      </form>

      {/* --- SOLUCIÓN AL ERROR DE PANTALLA BLANCA --- */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
             <CheckCircle className="text-red-600 mt-1 flex-shrink-0" size={24} />
             <div>
                 <h3 className="text-red-800 font-bold text-lg mb-2">SOLUCIÓN DEFINITIVA (Versión 6 - Corrección "Verdadero")</h3>
                 <p className="text-red-700 text-sm mb-2">
                     El error <code>ReferenceError: verdadero is not defined</code> ocurre porque algún traductor cambió <code>true</code> por <code>verdadero</code>.
                 </p>
                 <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                     <li>He reemplazado todos los <code>verdadero</code> por <code>true</code>.</li>
                     <li>Las listas están declaradas fuera para evitar el error de Vercel.</li>
                     <li><strong>Copia este código y reemplaza tu page.tsx.</strong></li>
                 </ul>
             </div>
        </div>
      </div>

      <div className="bg-slate-900 text-slate-100 p-6 rounded-xl shadow-lg border border-slate-700">
        <div className="flex items-start gap-4">
            <Code className="flex-shrink-0 mt-1 text-brand-red" size={24} />
            <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Código de Integración V6 (Sanitized)</h3>
                <button onClick={() => setShowCode(!showCode)} className="text-sm font-bold text-brand-red underline mb-2 block">
                    {showCode ? 'Ocultar código' : 'Ver código para copiar'}
                </button>
                {showCode && (
                    <div className="bg-black/80 p-4 rounded-lg relative group border border-slate-700">
                        <button 
                             onClick={() => navigator.clipboard.writeText(integrationCode)}
                             className="absolute top-2 right-2 p-2 bg-green-600 hover:bg-green-700 rounded text-xs text-white flex items-center gap-1 font-bold shadow-lg z-10"
                        >
                            <Copy size={14} /> COPIAR TODO EL CÓDIGO
                        </button>
                        <pre className="text-xs font-mono text-green-400 overflow-x-auto whitespace-pre-wrap max-h-96 pt-10">
                            {integrationCode}
                        </pre>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
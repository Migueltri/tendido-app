import React, { useState, useEffect } from "react";

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
  torerosRaw?: string;
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

function formatTimeAgo(dateString: string): string {
  const parsed = new Date(dateString);
  if (isNaN(parsed.getTime())) return ""; 
  const now = new Date();
  const diff = Math.floor((now.getTime() - parsed.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
  if (diff < 60) return "hace unos segundos";
  if (diff < 3600) return rtf.format(-Math.floor(diff / 60), "minute");
  if (diff < 86400) return rtf.format(-Math.floor(diff / 3600), "hour");
  if (diff < 2592000) return rtf.format(-Math.floor(diff / 86400), "day");
  if (diff < 31536000) return rtf.format(-Math.floor(diff / 2592000), "month");
  return rtf.format(-Math.floor(diff / 31536000), "year");
}

const renderArticleContent = (text?: string | null) => {
  if (!text) return null;
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  let paragraphs = normalized.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  
  if (paragraphs.length === 1 && normalized.length > 200) {
    const sentences = normalized.split(/(?<=[.?!])\s+/);
    const groupSize = 2; 
    paragraphs = [];
    for (let i = 0; i < sentences.length; i += groupSize) {
      paragraphs.push(sentences.slice(i, i + groupSize).join(' ').trim());
    }
  }

  const toHtml = (p: string) =>
    p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
     .replace(/[“”]/g, '"')
     .replace(/[‘’]/g, "'")
     .replace(/\n+/g, ' ');

  return paragraphs.map((p, i) => (
    <p key={i} className="text-gray-700 text-sm leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: toHtml(p) }} />
  ));
};

// --- 3. DATOS ESTÁTICOS ---
// Definidos AQUÍ fuera para evitar errores de duplicado

const chronicles: Chronicle[] = [
	{ 
    id: 4995,
    title: `Sábado en el Carnaval del Toro de Ciudad Rodrigo`,
	image: "/images/ciud.jpg",
    category: "Crónicas",
    date: "15 de Febrero de 2026",
	excerpt: "Cuatro orejas y varios novillos aplaudidos en el arrastre en una tarde marcada por el viento, la huella taurina y el debut con entrega de Moisés Fraile.",
	plaza: "Plaza Mayor de Ciudad Rodrigo",
    ganaderia: "Novillos de las ganaderías de Talavante y un eral de El Pilar.",
	torerosRaw: `Diego Urdiales: una oreja.
Alejandro Talavante: ovación.
Pablo Aguado: una oreja
El Mene: una oreja.
Moisés Fraile: ovación.`,
	fullContent: `En este sábado de carnaval, Ciudad Rodrigo vivió una tarde con una novillada de Talavante sensacional, ofreciendo cada uno de ellos un juego más que notable, bravos, con empuje en el caballo y una condición que creció a medida que avanzaba el festejo. El broche final lo puso un eral de El Pilar para el debutante Moisés Fraile.

Abrió plaza **Diego Urdiales**, toreando un novillo fijo en el capote que le permitió dibujar algunos lances estimables a pesar del aire. Empujó con fuerza en el tercio de varas y confirmo su nobleza ante el vendaval, pues el viento dejaba al descubierto al matador constantemente, pero el astado no hizo por él. No fue fácil el trasteo, el novillo apenas dejaba que Urdiales se colocara, yendo siempre detrás de la muleta sin apenas frenar. El riojano bridó su novillo al fallecido la noche anterior en la capea nocturna, añadiendo emoción a una faena de mérito y exposición. Mató de manera efectiva y paseó una oreja. El novillo por su parte fue aplaudido en el arrastre.

**Alejandro Talavante** sorteó un novillo con mayor transmisión que el primero, dejando ver su buen aire con el capote y con un quite por chicuelinas con ajuste y compás. Inició la faena de muleta a pies quietos, ligando tandas con muletazos encadenados y templados, aprovechando que el viento parecía haber disminuido un poco para mostrarse más versátil y asentado. La estocada, un poco contraria, pareció suficiente, pero el novillo se levantó y el espada extremeño se vio obligado al descabello. La demora hizo que los tendidos se enfriarán y todo se quedó en una ovación. De nuevo, el animal fue aplaudido en el arrastre.

**Pablo Aguado** dejó la faena de mayor sabor y torería. Brindó al cirujano de la plaza, Enrique Crespo, y arrancó con una tanda sensacional que marcó el tono de lo que vendría después: toreo con la yema de los dedos, de forma muy natural, despacio y con una gran pureza estética, creando una imagen de las que llegan y se quedan en los aficionados. Un pinchazo precedió a una estocada ligeramente tendida. En el trance se cortó en un dedo y tuvo que pasar por enfermería, donde recibió dos puntos de sutura. Cortó una oreja de ley.

**El Mene** se encontró con el novillo más completo del encierro, brindando a Talavante y planteando una faena de ligazón y entrega, exprimiendo la calidad del astado, dejando varios muletazos hilvanados con sentido y mando. Tras un pinchazo, dejó la mejor estocada de la tarde, recibiendo una oreja. El novillo fue aplaudido en el arrastre.

Cerró el debutante **Moisés Fraile** ante un eral de El Pilar, de su propia casa. Saludó con un quite por gaoneras muy ajustado y comenzó su faena a pies quietos, con decisión, aunque sufrió una fuerte voltereta. No obstante, eso no hizo que mermara su entrega. Su labor, llena de ganas y personalidad, conectó con el público, dejando pases muy buenos, especialmente con la mano izquierda. La espada emborronó lo que podía haber sido un gran premio: estocada enhebrada, varios pinchazos y hasta tres descabellos.`,
    author: "Nerea F.Elena",
    authorLogo: "/images/nere.jpg",
    showAuthorHeader: true
   },
	{ 
    id: 4996,
    title: `Juan Ortega pone el broche a San Blas con dos orejas en Valdemorillo`,
    image: "/images/croni.jpg",
    category: "Crónicas",
    date: "8 de Febrero de 2026",
	plaza: "Valdemorillo (Madrid)",
	ganaderia: "Torrealta",
    torerosRaw: `Uceda Leal , palmas y vuelta al ruedo;
Juan Ortega , silencio y dos orejas;
Pablo Aguado , silencio y silencio `,
    fullContent: `Ficha del Festejo: Valdemorillo (Madrid). Domingo 8 de Febrero de 2026. Fiestas de San Blas, Corrida de Toros, Lleno de ‘No hay billetes’, en tarde fría y con lluvia.

Toros de la ganadería de Torrealta;

Incidencias: Al finalizar el paseíllo sonaron los acordes del Himno Nacional de España. El banderillero Iván García se desmonteró tras parear al sexto.

**Uceda Leal** , palmas y vuelta al ruedo;
**Juan Ortega** , silencio y dos orejas;
**Pablo Aguado** , silencio y silencio

**Uceda Leal** destacó por su toreo clásico y de gran sabor frente a dos toros de Torrealta de escasa fuerza. En el primero, de gran calidad pero muy flojo, dejó una faena elegante aunque condicionada por el animal y falló con la espada. En el cuarto, con menos clase pero más fondo, logró lo mejor de la tarde, sobre todo al natural, firmando una faena técnica y meritoria que fue premiada con una vuelta al ruedo.

**Juan Ortega** tuvo una actuación de menos a más. En su primero, un toro flojo y sin entrega, apenas pudo lucirse y fue silenciado. En el quinto, todo cambió: cuajó una gran faena por el pitón derecho a un buen toro de Torrealta, con series largas y muy ligadas, que levantaron al público. Tras una estocada, cortó dos orejas.

**Pablo Aguado** brilló al capote, especialmente a la verónica, firmando lo más destacado del inicio del festejo. Sin embargo, sus dos toros, faltos de fuerza y de duración, le impidieron redondear la faena: en el primero dejó detalles de buen trazo pero falló con la espada, y en el sexto apenas tuvo opciones. Ambos turnos se saldaron con silencio.`,
    author: "Eduardo Elvira",
    authorLogo: "/images/edu4.jpg",
    showAuthorHeader: true
   },
	{ 
    id: 4997,
    title: `Tarde deslucida por los aceros en Valdemorillo`,
    image: "/images/cronic.jpg",
    category: "Crónicas",
    date: "7 de Febrero de 2026",
	excerpt: "Borja Jiménez y Tomás Rufo se midieron en un mano a mano con reses de El Capea, Carmen Lorenzo, Fuente Ymbro y Hnos. García Jímenez.",
	plaza: "Valdemorillo (Madrid)",
	ganaderia: "Fuente Ymbro (4 y 5) , Hnos Garcia Jimenez (3 y 6) , El Capea (1) , Carmen Lorenzo (2)",
    torerosRaw: `Borja Jimenez,oreja, silencio y ovacion con saludos;
Tomas Rufo, silencio,oreja y silencio;`,
    fullContent: `Ficha del Festejo: Valdemorillo (Madrid). Sábado 7 de Febrero de 2026. Fiestas de San Blas, Corrida de Toros, aforo casi completo, en tarde fría y con lluvia.

Toros de las ganaderías Fuente Ymbro (4 y 5) , Hnos Garcia Jimenez (3 y 6) , El Capea (1) , Carmen Lorenzo (2); primer y cuarto toro ovacionados en el arrastre; segundo y sexto pitados en el arrastre.

Incidencias: Al finalizar el paseíllo sonaron los acordes del Himno Nacional de España. **Iván García** se desmonteró tras parear al quinto.

**Borja Jimenez**,oreja, silencio y ovacion con saludos;
**Tomas Rufo**, silencio,oreja y silencio;

El diestro sevillano comenzó la tarde con un toro de El Capea de escasas fuerzas, aunque empleado en el tercio de varas, que no logró transmitir mucho ni en el capote ni en la muleta a pesar del esfuerzo del matador. Mató con una estocada entera que le sirvió para que el toro cayese redondo, siendo premiado con una oreja. El toro por su parte fue aplaudido en al arrastre ante un público vehemente. Ante el segundo de su lote, un buen toro de García Jiménez que destacó en comparación al otro de esta misma ganadería, Borja Jiménez firmó una faena de peso sobre todo en la muleta que podría haber sido premiada con otra oreja, pero que fue emborronada por los aceros. Destacables los aplausos a Tito Sandoval en el tercio de varas. Por último, Borja se enfrentó ante un quinto de poca presencia y estrecho de sienes de la ganadería Fuente Ymbro con el que pudo firmar la faena de la tarde, entregándose tanto que recibió un susto al ser prendido en el aire. Volvió a fallar con los aceros, lo que le arrebató el triunfo. A destacar los dos pares de banderillas de **Iván García** que le permitieron desmonterarse. Borja finalmente recibió una fuerte ovación dando la vuelta al ruedo.

**Tomás Rufo** por su parte firmó una faena caracterizada por la mansedumbre del astado de Carmen Lorenzo, en la que pudo dejar un natural para el recuerdo. La espada volvió a ser un obstáculo, pinchó hasta en cuatro ocasiones antes de escuchar un aviso, logrando finalmente el descabello al segundo intento. En el cuarto de la tarde, Tomás Rufo dejó una faena muy seria de menos a más a un animal de Fuente Ymbro. Esta vez acertó con la espada, pero el toro mostró su bravura a la hora de caer aguantándose la muerte encendiendo los aplausos del público. El matador fue premiado con una oreja y hubo fuerte petición de vuelta al ruedo para el toro, que el presidente no concedió. Por último, el sexto de la tarde fue un toro de García Jiménez con mucha presencia pero que se vino abajo en seguida. El diestro no logró conectar con el público durante la faena, la alargó demasiado y el toro no le ayudó en nada a la hora de entrar a matar lo que provocó que pinchara hasta en 3 ocasiones. El animal fue pitado en el arrastre.`,
    author: "Nerea F.Elena",
    authorLogo: "/images/nere.jpg",
    showAuthorHeader: true
   },
	{ 
    id: 4998,
    title: `Samuel Castrejón firma una tarde de alto nivel en su debut con picadores`,
    image: "/images/croned.jpg",
    category: "Crónicas",
    date: "6 de Febrero de 2026",
	plaza: "Valdemorillo (Madrid)",
	ganaderia: "Jiménez Pasquau",
    torerosRaw: `Alvaro Serrano,oreja;
Mario Vilau, oreja;
Julio Mendez, oreja;
Sergio Rollon (Que reaparecia tras su grave percance) , vuelta al ruedo;
Felix San Roman, silencio tras aviso;
Samuel Castrejon (Que debutaba con picadores), dos orejas;`,
    fullContent: `Ficha del Festejo: Valdemorillo (Madrid). Viernes 6 de Febrero de 2026. Fiestas de San Blas, Novillada con Caballos, tres cuartos de entrada, en tarde fría y con lluvia.

Utreros de la ganadería de Jimenez Pasquau; El sexto novillo fue premiado con la vuelta al ruedo.

Incidencias: saludó una ovación Sergio Rollón tras el paseíllo con motivo de su reaparición tras su grave percance en Valdetorres del Jarama.
Jesús Robledo 'Tito' se desmonteró tras parear al cuarto.

**Alvaro Serrano**, oreja;
**Mario Vilau**, oreja;
**Julio Mendez**, oreja;
**Sergio Rollón** (Que reaparecia tras su grave percance) , vuelta al ruedo;
**Felix San Roman**, silencio tras aviso;
**Samuel Castrejon** (Que debutaba con picadores), dos orejas;


En el primer novillo, **Álvaro Serrano** mostró una actitud muy entregada y buscó siempre la conexión con el público, logrando una faena que fue de menos a más y que, junto a una estocada efectiva, le permitió cortar una oreja.

**Mario Vilau** destacó en el segundo novillo por su firmeza y capacidad de mando ante una embestida exigente, dejando los mejores momentos al natural. Pese a una actuación de gran nivel, la oreja obtenida tras la estocada se consideró un premio escaso.

**Julio Méndez** firmó una faena de menos a más ante un novillo falto de poder, pero de buena intención, al que supo aprovechar con oficio y temple junto a las tablas, rematando con un buen final por ayudados y trincherillas antes de la estocada, lo que le valió una oreja.

**Sergio Rollón** reapareció tras su grave cornada de julio, lidiando un novillo áspero y deslucido. Faena de mérito, marcada por la firmeza y el esfuerzo, mejor valorada por un público con memoria que por el lucimiento. Media estocada y vuelta al ruedo con ligera petición.

**Félix San Román** se enfrentó a un novillo falto de poder que condicionó su labor. La faena, larga y poco conectada, se desarrolló en un ambiente frío, roto solo por una aparatosa cogida que alarmó al público. Pinchazo hondo y silencio tras aviso.

**Samuel Castrejón**, debutando con picadores, firmó la actuación de la tarde. Dos verónicas iniciales marcaron una faena de enorme calado, basada en el temple, el abandono y el toreo ralentizado al máximo. El público respondió con olés rotundos. Estocada y dos orejas. El novillo fue premiado con la vuelta al ruedo.`,
    author: "Eduardo Elvira",
    authorLogo: "/images/edu4.jpg",
    showAuthorHeader: true
   },
	{ 
    id: 4999,
    title: `Once orejas y dos rabos en la primera novillada de la Puebla del Rio`,
    image: "/images/aparicio.jpg",
    category: "Crónicas",
    date: "24 de Enero de 2026",
	plaza: "La Puebla del Rio",
    ganaderia: "*Juan Manuel Criado, Hnos. García Jiménez, Fermín Bohórquez, David Ribeiro Telles, Santiago Domecq, Alcurrucén y Garcigrande* . El quinto, *de Santiago Domecq, premiado con la vuelta al ruedo.*",
	excerpt: "Julio Aparicio y Armando Rojo son los nombres propios de la tarde al cortar un rabo cada uno.",
	torerosRaw: `·        Jaime de Pedro, dos orejas.

·        Blas Márquez, dos orejas.

·        Ignacio Garibay, dos orejas.

·        Íñigo Norte, oreja.

·        Julio Aparicio, dos orejas y rabo.

·        Joao Fernándes, ovación con saludos tras aviso.

·        Armando Rojo, dos orejas y rabo.`,
  fullContent: `**Jaime de Pedro** en el primero de la tarde destacó en la portagayola con la que recibió al primero, con la muleta busco la profundidad de su toreo destacando con el pitón izquierdo al novillo de **Criado**, la estocada quedó algo delantera y desprendida.

**Blas Márquez** lo recibió por verónicas, al eral **Hnos. García Jiménez** que hacia segundo de la tarde, con la muleta toreo con ambos pitones, destacando en la verticalidad de su toreo y en el toreo en redondo con la diestra, media estocada y descabello.

**Ignacio Garibay** se las vio en tercer lugar con un eral de encaste Murube con el hierro de **Fermín Bohórquez**, el novillero Azteca destaco en su toreo al natural donde lo llevo muy pulseado, el animal que acusaba falta de fuerza no dejo muchas opciones al mexicano, estocada que hizo guardia.

**Iñigo Norte** lanceo templado al cuarto de la tarde un novillo de **David Ribeiro Telles**, el de Salamanca no tuvo muchas opciones con el complicado novillo que le toco en suerte, solo que quedó mostrar capacidad y valor que el público se lo supo valorar y tras una estocada le dieron una oreja.

**Julio Aparicio**, nieto y sobrino de los **Julio Aparicio**, mostros sus cartas desde que se abrió con el capote, ante un extraordinario novillo de **Santiago Domecq** al que se le dio la vuelta al ruedo, como buen **Aparicio** su toreo está lleno de personalidad, sabor y mucha torería, de ese toreo con pellizco que gusta dejando una gran faena de muleta por ambos pitones una faena de impacto en La Puebla y tras una estocada se llevó el Rabo y el novillo la vuelta al ruedo.

**Joao Fernandes**, se las vio con el novillo de más volumen con el hierro de **Alcurrucén**, que le faltó transmisión y al portugués solo que quedo mostrar cuando lo dejó su oponente concepto y sobretodo su valor, falló con los aceros.

**Armando Rojo** que cerraba la tarde en la Puebla se las vio con un buen novillo de Garcigrande, al que toreo por verónicas muy templadas. Con la muleta conecto desde el principio con sus paisanos con su personalidad y buen toreo, faena muy profunda además de templada con ambos pitones, estocada y los máximos trofeos


**FICHA DEL FESTEJO:**
**La Puebla del Río (Sevilla).** Sábado 24 de enero de 2025. Fiestas de San Sebastián, novillada sin caballos, con lleno en los tendidos, en tarde fría.

Erales, por orden de lidia, de **Juan Manuel Criado**, **Hnos. García Jiménez**, **Fermín Bohórquez**, **David Ribeiro Telles**, **Santiago Domecq**, **Alcurrucén** y **Garcigrande**. El quinto, de Santiago Domecq, premiado con la vuelta al ruedo.

* **Jaime de Pedro**, dos orejas.
* **Blas Márquez**, dos orejas.
* **Ignacio Garibay**, dos orejas.
* **Íñigo Norte**, oreja.
* **Julio Aparicio**, dos orejas y rabo.
* **Joao Fernandes**, ovación con saludos tras aviso.
* **Armando Rojo**, dos orejas y rabo.`,
  author: "Eduardo Elvira",
  authorLogo: "/images/edu4.jpg",
  showAuthorHeader: true
  },
	{ 
    id: 5000,
    title: `Óscar Campos se impone en el IV Certamen de Invierno de Escuelas Taurinas de la Comunidad de Madrid`,
    image: "/images/novillero1.jpg",
    category: "Crónicas",
    date: "28 de Diciembre de 2025",
    imageCaption: "Plaza de Toros Venta del Batán",
	plaza: "Plaza de Toros Venta del Batán.",
	ganaderia: "Toros de la Plata y Zacarías Moreno",
	torerosRaw: `Andreo Sánchez (E.T. Navas del Rey), vuelta al ruedo 

Pablo Jurado (E.T. Fundación El Juli), vuelta al ruedo 

José Huelves (E.T. Colmenar Viejo), dos orejas 

Brahian Osorio ‘Carrita’ (E.T. Galapagar), vuelta al ruedo 

Óscar Campos (E.T. Yiyo), dos orejas 

Kevin Montiel (E.T. CITAR-Anchuelo), silencio`,
  fullContent: `El novillero Óscar Campos ha ganado el IV Certamen de Invierno de Escuelas Taurinas de la Comunidad de Madrid, que como cada Navidad ha tenido lugar este mediodía en la plaza de tientas de la Venta del Batán. El alumno de la Escuela José Cubero Yiyo ha cortado dos orejas simbólicas, igual que José Huelves, de Colmenar Viejo, que también ha dejado momentos muy destacados. 

Campos, que cuajó a su novillo de Toros de la Plata el mejor saludo capotero de la mañana, brilló sobre todo por el modo de componer y de expresarse, así como en los remates, sobre todo en los cambios de mano. Huelves por su parte evidenció quietud, mano baja y buen juego cintura frente a un buen ejemplar de Zacarías Moreno al que extrajo naturales de mucho peso y plomada. 

Más voluntariosos anduvieron el resto de actuantes, que dieron una vuelta al ruedo al concluir su actuación. El festejo sirvió además para rendir homenaje a Tomás Serrano Guío por su labor como Presidente del Patronato de Escuela de Tauromaquia de Madrid.

Con excelente ambiente en una mañana soleada y fría se han lidiado ejemplares de Toros de la Plata y dos (2º y 3º) de Zacarías Moreno, de buen juego en términos generales. El resultado de los novilleros ha sido el siguiente: 

Andreo Sánchez (E.T. Navas del Rey), vuelta al ruedo 

Pablo Jurado (E.T. Fundación El Juli), vuelta al ruedo 

José Huelves (E.T. Colmenar Viejo), dos orejas 

Brahian Osorio ‘Carrita’ (E.T. Galapagar), vuelta al ruedo 

Óscar Campos (E.T. Yiyo), dos orejas 

Kevin Montiel (E.T. CITAR-Anchuelo), silencio`,
  author: "Eduardo Elvira",
  authorLogo: "/images/edu4.jpg",
  showAuthorHeader: true
  },
	{ 
    id: 5001,
    title: `Triunfo de la terna y Manuel de María que deslumbra en su debut en Alcaudete de la Jara`,
    image: "/images/triunfo.jpg",
    category: "Crónicas",
    date: "7 de Diciembre de 2025",
	footerImage1: "/images/foto1.jpg",
    footerImage1Caption: "Fotos de Luis Muñoz",
    footerImage2: "/images/foto2.jpg",
    footerImage3: "/images/foto3.jpg",
    footerImage4: "/images/foto4.jpg",
	plaza: "Plaza de toros de Alcaudete de La Jara (Toledo).",
	ganaderia: "Alcurrucen",
    torerosRaw: `Jesús Navalucillos (Escuela Taurina Domingo Ortega de Toledo) Dos Orejas 

Pablo Méndez (Escuela Taurina de Guadalajara)*Dos Orejas

Álvaro Sánchez (Escuela Taurina Domingo Ortega de Toledo) Dos orejas y rabo 

Manuel de María (Escuela Taurina José Cubero Yiyo de Madrid) Dos orejas y rabo.`,
fullContent: `En conjunto, los jóvenes alumnos mostraron su progreso, dejando patente su ilusión, entrega y buenas maneras ante los novillos de Alcurrucén. Cada uno, desde su propio momento de aprendizaje, logró conectar con los tendidos y ofrecer una tarde llena de espontaneidad y torería en formación.

Cerró el festejo **Manuel de María**, convirtiéndose en la sorpresa de la tarde en su debut. Con desparpajo, naturalidad y una serenidad impropia de su edad, conectó rápidamente con el público y dejó instantes de gran emoción.
**Su actuación fue una de las más celebradas del festejo y abrió un horizonte ilusionante.**

**Plaza de toros de Alcaudete de La Jara (Toledo)**. Clase práctica.
**Novillos de Alcurrucén**, de buen juego en su conjunto. Lleno en los tendidos.

**Jesús Navalcillos** (Escuela Taurina Domingo Ortega de Toledo) Dos Orejas
**Pablo Méndez** (Escuela Taurina de Guadalajara)*Dos Orejas
**Álvaro Sánchez** (Escuela Taurina Domingo Ortega de Toledo) Dos orejas y rabo
**Manuel de María** (Escuela Taurina José Cubero Yiyo de Madrid) Dos orejas y rabo.`,
  author: "Eduardo Elvira",
  authorLogo: "/images/edu4.jpg",
  showAuthorHeader: true
  },
	{ 
    id: 6000,
    title: `Israel Guirao y Jaime Padilla, grandes triunfadores en el I Certamen Taurino “Linares, Cuna de Toreros”`,
    image: "/images/linares.jpg",
    category: "Crónicas",
    date: "6 de Diciembre de 2025",
	plaza: "Santa Margarita- Linares (Jaén)",
	ganaderia: "Apolinar Soriano (1º y 2º), Collado Ruiz, Sancho Dávila, Los Ronceles, Paco Sorando y El Añadio. Un encierro variado e importante por su comportamiento que resultó exigente y muy toreable en líneas generales.",
    torerosRaw: `MARTÍN MENDOZA, E.T. Camas; Ovación.

BLAS MÁRQUEZ, E.T. Linares; Oreja.

JAIME PADILLA, E.T. Málaga; Dos orejas y vuelta al ruedo al novillo.

JESÚS MOLINA, E.T. Linares; Oreja tras aviso.

DANIEL RIVAS, E.T. Linares; Oreja.

ISRAEL GUIRAO, E.T. Valencia; Dos orejas y rabo.

LISARES, E.T. Arles; Oreja.`,
fullContent: `El alumno de la escuela de Valencia cortó un rabo y el de Málaga dos orejas, ambos a hombros por la ‘Puerta Grande’



El emblemático Coso de Santa Margarita volvió a abrir sus puertas en plena festividad navideña, el sábado 6 de diciembre, para albergar el I Certamen Taurino “Linares, Cuna de Toreros”, un nuevo ciclo que nace con vocación de permanencia y que rinde tributo a dos figuras indispensables de la tauromaquia linarense: Apolinar Soriano y Pepe Luis Díaz. La ciudad, reconocida históricamente como auténtico semillero de toreros, reafirma así su compromiso con una tradición profundamente arraigada en su identidad cultural.

El certamen se concibe como un homenaje al legado taurino de Linares y, al mismo tiempo, como una apuesta decidida por el futuro del toreo. En esta primera edición, la plaza se convirtió en un escenario formativo de primer nivel, brindando una plataforma de proyección a 

jóvenes valores procedentes de distintas escuelas taurinas de España y del extranjero. La diversidad de procedencias y estilos enriqueció un encuentro en el que la cantera mostró solvencia, entrega y un notable nivel artístico.



Los alumnos participantes fueron: Martín Mendoza (Escuela Taurina de Camas); Blas Márquez, Jesús Molina y Daniel Rivas (Escuela Taurina de Linares); Jaime Padilla (Escuela Taurina de Málaga); Israel Guirao (Escuela Taurina de Valencia); y Lisares (Escuela Taurina de Arles). Se enfrentaron a un concurso de ganaderías compuesto por siete ejemplares de hierros 

de reconocido prestigio: Sorando, El Cotillo, Apolinar Soriano, Los Ronceles, Collado Ruiz, Sancho Dávila y El Añadío.



La jornada dejó una amplia variedad de matices y evoluciones artísticas



1º Martín Mendoza, ante “Urcola”, de Apolinar Soriano, abrió plaza con decisión, recibiendo a portagayola y cuajando un toreo al natural lleno de personalidad. La espada le privó de premio y recibió una ovación.

2º El linarense Blas Márquez, con “Presidiario”, también de Apolinar Soriano, firmó una faena clásica y cargada de gusto, destacando un luminoso toreo de capa. Cortó una oreja.

3º Jaime Padilla, con “Feroz”, de Collado Ruiz, protagonizó una de las actuaciones de mayor 

rotundidad. Su entrega, su expresividad y un espadazo perfecto le valieron dos orejas, mientras que el novillo fue premiado con la vuelta al ruedo.

4º Jesús Molina, ante “Lancito”, de Sancho Dávila, dejó una labor templada y armoniosa, iniciada de rodillas y construida con suavidad y expresión. Cortó una oreja, y el novillo fue premiado con vuelta al ruedo.

5º Daniel Rivas, con “Gobernante”, de Los Ronceles, demostró evolución y oficio ante un ejemplar que mejoró durante la lidia. Su faena, reposada y de buen trazo, fue premiada con unaoreja.

6º Israel Guirao, con “Labriego”, de Sorando, deslumbró por su madurez y firmeza. Su actuación, intensa y muy personal, culminó con un estoconazo que le abrió la puerta grande al cortar dos orejas y rabo.

7º Cerró la tarde Lisares, que recibió a portagayola a “Cabeza Loca”, de El Añadío. Pese a las complicaciones de su oponente, que buscó tablas con insistencia, el francés mostró raza, limpieza y capacidad, obteniendo una oreja.



El I Certamen Taurino “Linares, Cuna de Toreros” concluyó así con un balance altamente positivo, tanto por el nivel artístico de los participantes como por el ambiente de apoyo a la juventud taurina. Con esta iniciativa, Linares reafirma su papel fundamental en la historia del toreo y renueva su compromiso con la promoción y el impulso de nuevas generaciones que 

mantienen viva su tradición.

FICHA DEL FESTEJO:

Sábado 06 de diciembre de 2025

Plaza de Toros de Santa Margarita- Linares (Jaén)

I Certamen “Linares, cuna de toreros”

Entrada: Algo más de media plaza en tarde gris y fría.

Erales de varias ganaderías (por orden): Apolinar Soriano (1º y 2º), Collado Ruiz, Sancho Dávila, Los Ronceles, Paco Sorando y El Añadio. Un encierro variado e importante por su comportamiento que resultó exigente y muy toreable en líneas generales. Destacaron el 3º 

“Feroz” de Collado Ruiz, y el 4º “Lancito” de Sancho Dávila, premiados con la vuelta al ruedo. 
OBSERVACIONES: 

 Un evento que sirvió como homenaje póstumo a Apolinar Soriano y Pepe Luis Díaz,

figuras reconocidas del ámbito taurino local.

 Festejo en modalidad de ‘Clase Práctica’ y además Concurso de Ganaderías.

 Antes de romper sonó el Himno Nacional.

 Antes de comenzar el festejo se entregaron varios reconocimientos a los Ganaderos, 

Propiedad de la Plaza, Escuela Taurina de Linares y Canal Sur Tv. Todos recibieron 

una placa conmemorativa en presencia de la alcaldesa de Linares, Dña. María 

Auxiliadora del Olmo Ruiz. 

 Último festejo de la Temporada 2025 de las Escuelas y último también de las 

retransmisiones de Canal Sur Tv.

 El piso plaza se encontraba muy húmedo y con algunas zonas algo resbaladizas.

 Presidió el festejo en el palco D. José Luis Martín López`,
  author: "Manolo Herrera",
  authorLogo: "/images/manoloherrera.jpg",
  showAuthorHeader: true
  },
	{ 
    id: 6001,
   title: `Algar: Mario Torres, Celso Ortega y Gabriel Moreno ‘El Calé’, abren la ‘Puerta Grande’ con dos orejas cada uno`,
    image: "/images/algar.jpg",
    category: "Crónicas",
    date: "2 de Diciembre de 2025",
	plaza: "Algar",
    ganaderia: "El Torero",
	 torerosRaw: `
Agustín de Antonio: Dos Orejas Tras Aviso
Candela "La Piyaya": Dos Orejas
Fernando Lovera: Dos Orejas Tras Aviso
Armando Rojo: Oreja Con Petición de la Segunda Tras Aviso
Mario Torres: Oreja Tras Dos Avisos
Juan Manuel Viruez: Oreja Tras Aviso
`,
    fullContent: `La plaza de toros de Algar (Cádiz) se convirtió este fin de semana en el escenario de la **Gran Final de las Becerradas de la XIII Competición Provincial de las Escuelas Taurinas de Cádiz** —bajo el patrocinio de la Excma. Diputación de Cádiz— un festejo que, pese a la tarde desapacible y fría, registró un lleno absoluto en los tendidos del centenario coso gaditano.
La cita reunió a los jóvenes valores del toreo provincial, que demostraron capacidad, entrega y ambición ante un encierro variado de la ganadería de **El Torero**, cuyos astados ofrecieron desigual presentación y juego.
Destacó especialmente el quinto becerro, premiado con la vuelta al ruedo por su calidad y bravura.
Entre los noveles actuantes brillaron **Mario Torres, Celso Ortega y Gabriel Moreno ‘El Calé’**, quienes lograron cortar dos orejas cada uno y, con ello, abrir la ‘Puerta Grande’, culminando así una tarde cargada de emociones y evidentes muestras de futuro.

Abrió plaza **Martín Marengo**, de la Escuela Taurina Francisco Montes ‘Paquiro’ de Chiclana de la Frontera, que dejó detalles de buena colocación y temple, siendo premiado con una oreja con petición de segunda.
Le siguió **Adrián Olmedo**, de la Escuela Taurina Linense, que mostró firmeza y decisión pese a un complicado oponente; escuchó palmas tras tres avisos.
El tercer turno correspondió a **Mario Torres**, de la Escuela Taurina Comarcal de Ubrique, quien cuajó una actuación llena de oficio y serenidad. Su faena, rematada con una estocada tras aviso, fue reconocida con dos orejas.

El francés **Remy Lucas**, de la Escuela Taurina ‘Rafael Ortega’ de San Fernando, mostró elegancia y personalidad. A pesar del aviso, cortó una oreja.
Uno de los momentos más destacados llegó de la mano de **Celso Ortega**, representante de la Escuela de Tauromaquia ‘La Gallosina’ de El Puerto de Santa María. Su conexión con los tendidos y el buen entendimiento de la embestida del quinto, premiado con la vuelta al ruedo, le valieron dos orejas.
Posteriormente, **Javier Mena**, de la Escuela Municipal de Tauromaquia Miguel Mateo ‘Migue­lín’ de Algeciras, dejó pasajes de voluntad y buenas maneras, siendo ovacionado tras escuchar tres avisos.
Cerró el festejo **Gabriel Moreno ‘El Calé’**, de la Escuela Taurina ‘El Volapié’ de Sanlúcar de Barrameda, que hizo vibrar al público con una faena de entrega y prestancia gitana. Cortó dos orejas, también tras aviso, lo que le permitió acompañar a Torres y Ortega en la salida a hombros.

**FICHA DEL FESTEJO:**
Domingo, 30 de noviembre de 2025
Plaza de Toros de Algar – (Cádiz)

**Gran Final de las Becerradas de la XIII Competición Provincial de las Escuelas Taurinas de Cádiz**

Proyecto de Fomento de la Cultura Taurina de Andalucía 2025

Entrada: Lleno en tarde desapacible, amenazante y fría.

Se lidiaron reses de **El Torero**. Desiguales de presentación y juego.
Destacó especialmente el 5º, premiado con la vuelta al ruedo por su calidad y bravura.

**MARTÍN MAREN­GO**, (E.T.‘Paquiro’-Chiclana Ftra); Oreja con petición de segunda.
**ADRIÁN OLMEDO**, (E.T. Linense); Palmas tras tres avisos.
**MARIO TORRES**, (E.T. Ubrique); Dos orejas tras aviso.
**REMY LUCAS**, (E.T. ‘Rafael Ortega’ - S. Fdo.); Oreja tras aviso.
**CELSO ORTEGA**, (E.T. ‘La Gallosina’-Pto. Sta. Mª); Dos orejas y vuelta al novillo.
**JAVIER MENA**, (E.T. ‘Miguelín’-Algeciras); Palmas tras tres avisos.
**GABRIEL MORENO ‘EL CALÉ’**, (E.T. ‘El Volapié’ Sanlúcar Bdra.); Dos orejas tras aviso.

**Observaciones:**
Tras el paseíllo sonó el Himno de España.
Asistió al festejo el Primer Teniente de Alcalde de la localidad, D. Juan Manuel Guerra.
La XIII Competición Provincial de las Escuelas Taurinas de Cádiz ha contado con el patrocinio de la Excma. Diputación de Cádiz.

**PALCO:**
Presidió el Alcalde de Algar, D. José Carlos Sánchez.
Asesores: D. Juan Pedro Sánchez.`,
  author: "Manolo Herrera",
  authorLogo: "/images/manoloherrera.jpg",
  showAuthorHeader: true
  },
{ 
    id: 6002,
    title: `Almadén de la Plata: Agustín de Antonio, 'La Piyaya' y Fernando Lovera, a hombros tras desorejar a sus respectivos novillos`,
    image: "/images/almaden1.jpg",
    category: "Crónicas",
    date: "2 de Diciembre de 2025",
	plaza: "Almadén de la Plata",
    ganaderia: "El Torero",
	 torerosRaw: `
Agustín de Antonio: Dos Orejas Tras Aviso
Candela "La Piyaya": Dos Orejas
Fernando Lovera: Dos Orejas Tras Aviso
Armando Rojo: Oreja Con Petición de la Segunda Tras Aviso
Mario Torres: Oreja Tras Dos Avisos
Juan Manuel Viruez: Oreja Tras Aviso
`,
    fullContent: `La plaza de toros de **Almadén de la Plata** registró un lleno absoluto en la novillada sin picadores organizada con motivo de la **VIII Edición del Día del Jamón**, en la que se lidiaron reses bien presentadas y de juego variado de **Albarreal**, destacando el primero y el tercero.
La novillada dejó tres ‘Puertas Grandes’ y un notable nivel de las jóvenes promesas, confirmando a Almadén de la Plata como una cita clave para seguir la evolución de los nuevos valores del toreo. Tras el paseíllo sonó el Himno de España, antes de dar paso a una tarde en la que los seis actuantes mostraron oficio, entrega y personalidad.

**Agustín de Antonio** abrió la tarde con una faena templada y expresiva ante un novillo noble, logrando dos orejas tras aviso.
**Candela “La Piyaya”** resolvió con firmeza ante un astado áspero, aprovechando los momentos que permitió el lucimiento y cortando dos orejas.
El tercer triunfador fue **Fernando Lovera**, que brilló con una actuación muy templada y de gran profundidad, premiada igualmente con dos orejas tras aviso.
**Armando Rojo** se impuso a un novillo complicado con firmeza y buenos detalles, obteniendo una oreja con petición de segunda.
**Mario Torres**, muy seguro ante un quinto exigente, dejó los mejores momentos por la derecha y cortó una oreja tras dos avisos.
Cerró la tarde **Juan Manuel Viruez**, que mostró buen concepto y una importante personalidad para pasear una oreja tras aviso.

**FICHA DEL FESTEJO:**
Sábado, 29 de noviembre de 2025

Plaza de Toros El Coso – Almadén de la Plata (Sevilla)

Novillada Extraordinaria con motivo de la “**VIII Edición del Día del Jamón**”

Proyecto de Fomento de la Cultura Taurina de Andalucía 2025

Entrada: Lleno en tarde muy gélida.

Se lidiaron reses de **Albarreal**. Bien presentadas y de juego variado de Albarreal, destacando el primero y el tercero.

**AGUSTÍN DE ANTONIO**, (E.T. Sevilla); Dos orejas tras aviso.
**CANDELA ‘LA PIYAYA’**, (E.T.J.C. ‘Yiyo’-Madrid); Dos orejas.
**FERNANDO LOVERA**, (E.T. Camas); Dos orejas tras aviso.
**ARMANDO ROJO**, (E.T. Sevilla); Oreja con petición de segunda tras aviso.
**MARIO TORRES**, (E.T. Ubrique); Oreja tras dos avisos.
**JUAN MANUEL VIRUEZ**, (E.T. Ubrique); Oreja tras aviso.

**Observaciones:**
Tras el paseíllo sonó el Himno de España.
Presidió: D. Francisco Alonso, asesorado por Dña. Mª del Pilar Portillo, perteneciente a la UPTE (Unión de Presidentes de Plazas de Toros de España).
Asistió al festejo el Delegado del Gobierno de la Junta de Andalucía en Sevilla, D. Ricardo Sánchez Antúnez y el Alcalde de la localidad, D. Carlos Raigada Barrero.
Un festejo organizado por la Escuela de Sevilla, la Escuela de Ubrique y el propio Ayuntamiento de Almadén de la Plata.`,
  author: "Manolo Herrera",
  authorLogo: "/images/manoloherrera.jpg",
  showAuthorHeader: true
  },
];

const entrevistas: NewsItem[] = [
  { 
    id: 499,
    title: `“El toreo es una forma de ser, de estar y de vivir” - Entrevista a José Garrido`,
    image: "/images/cron1.jpg",
    category: "Entrevistas",
    date: "25 de Enero de 2026",
    imageCaption: "Fotos de Vanesa Santos",
    footerImage1: "/images/cron2.jpg",
    footerImage1Caption: "Fotos de Vanesa Santos",
    footerImage2: "/images/cron3.jpg",
    footerImage2Caption: "Fotos de Vanesa Santos",
    footerImage3: "/images/cron4.jpg",
    fullContent: `**José Garrido** afronta una etapa clave de madurez en su carrera. El matador extremeño, que con constancia y una firme vocación ha ido construyendo un nombre propio en el toreo, atraviesa un momento de consolidación que despierta el interés de la afición y de los profesionales. Tras temporadas marcadas por actuaciones de peso, faenas de gran calado y una evolución técnica evidente, Garrido se reafirma como un torero de concepto claro y personalidad definida.

**José, vienes de una tierra con mucha afición como Extremadura. ¿De qué manera crees que tus raíces han marcado tu forma de entender el toreo?**

Bueno, yo entiendo el toreo como una forma de ser, de estar, de vivir. Es con lo que convivo el día a día, con el **toro** y con la afición y de querer mejorar y de querer cada vez alimentar todas esas inquietudes que te da la afición.

Y en Extremadura eso se vive por su gente, por la gente de campo, por la dehesa, por las ganaderías que hay. Esa afición se siente en la calle y en los extremeños y bueno, pues el ser de aquí, quieras que no, te encuentras con el mundo del **toro** en el día a día. Tanto sus gentes, como en el campo, como en los animales, como en **todo**.

**Tomaste la alternativa muy joven y con muchas expectativas. Mirando atrás, ¿qué ha sido lo más difícil de gestionar en tu carrera profesional?**

Bueno, al final yo creo que lo más difícil es lo que viene de golpe y no estás acostumbrado a ello, como en mi caso el viaje, las multitudes, el momento de que venga **todo** nuevo: contratos, tardes seguidas, expectativas, como dices.

Y bueno, pues gestionar **todo** eso no es fácil. Siendo un chaval joven, pues como era yo cuando tomé la alternativa, pues al final todo eso te sumerge en un mundo quizás que te aleja un poco de la realidad. Yo creo que no lo llevé mal dentro de lo que cabe, supe más o menos valorar lo que tenía y lo que estaba consiguiendo, pero sí es cierto que no es fácil mantener los pies en la tierra.

**Se habla mucho de tu concepto clásico y puro. ¿Cómo definirías tú tu toreo con tus propias palabras?**

En mi concepto, al final yo intento hacer lo que a mí me gusta ver. Lo que yo más valoro en un **torero** es la personalidad, y la forma de ser uno mismo. Pero hay ciertos **toreros** que te gustan mucho e intentas en tus formas hacer lo que ellos hacen o lo que **tú** estás buscando en **tu** personalidad, pero con formas y conceptos de otros **toreros**.

Yo no sabría definirme a mí mismo, hay veces que veo vídeos míos y me gusto mucho y otras veces que no me gusto nada, Siempre hay cosas que destaco y que intento ir mejorando. Pero sí es cierto que me gusta la profundidad y el empaque, el muletazo y, sobre todo, la reunión con los **toros**, Que **todo** sea uno y ese toreo un poco circular, reunido. Eso me gusta mucho y es lo que intento buscar.

**Has tenido tardes importantes en plazas de primera. ¿Qué tiene una plaza como Madrid que la hace tan determinante para un torero?**

Madrid es la que es capaz de determinar **tu** trayectoria y **tu** vida profesional, porque al ser **tan** exigente, el **toro** que sale, como su aficionado. Cuando las cosas salen bien es como encontrar una aguja en un pajar, también las cosas bien es tan difícil que salgan y tan exigente, que por eso **te** da tanto. No sabría con qué comparártelo, pero que se reúnan tantas cosas en Madrid para que salgan bien es casi imposible. Entonces pues bueno, pues cuando hay un triunfo o cuando congenias con la afición y eres capaz de ponerte de acuerdo con un toro para pegarle 20 pases, es algo grandioso.

**En una profesión tan exigente, ¿cómo trabajas la cabeza y la confianza cuando las cosas no salen como esperas?**

Yo creo que en el mundo del **toro** hay que fijarse más en la mentalización. Para las tardes duras, **tanto** así como para las **tardes** buenas, porque **tan** importante es **trabajar** la mente para unas como para otras. Y en esas plazas de primera, de **tanta** importancia, es muy importante gestionar las emociones porque **tanto** te puede afectar una **tarde** de triunfo como una **tarde** de fracaso.

Entonces bueno, yo soy una persona que me guardo mucho las cosas dentro e intento exteriorizarlas y digerirlas conmigo mismo y bueno, de momento pues he sido capaz de, escalón a escalón, ir cultivando una mentalidad fuerte.

**¿Hay alguna faena o tarde concreta que sientas que refleja realmente quién es José Garrido como torero?**

No **te** diría a lo mejor una tarde concreta o un toro en especial. **Hay** tardes en las que me quedo con muchas cosas y lo que voy buscando es eso, pues concretarlas **todas** en un día que salga ese toro que me venga bien y poder reunir en una **tarde** el mejor **José Garrido**, que **todavía** creo que no ha salido. Ha habido apuntes, esta temporada del 2025 ha habido cosas, pero tiene que salir **el**... **el** de la faena redonda.

**El toreo evoluciona constantemente. ¿Cómo encuentras el equilibrio entre respetar la tradición y adaptarte a los tiempos actuales?**

El equilibrio es sencillo de decir pero difícil de lograr: beber de las fuentes antiguas para no perder la pureza, pero torear con la entrega que **te** exige las embestidas del **toro** actual.

**¿Qué sueños o metas te quedan por cumplir dentro y fuera de los ruedos?**

Tanto dentro como fuera hay muchas metas por cumplir **todavía** y muchos objetivos. Depende mucho lo de conseguir fuera, consiguiéndolo dentro primero en los ruedos. Depende mucho lo de fuera según lo que se consiga dentro. Así que vamos a intentar primero arreglar lo de dentro y luego vemos lo de fuera.`,
    author: "Eduardo Elvira",
    authorLogo: "/images/edu4.jpg",
    showAuthorHeader: true
  },
  { 
    id: 500,
    title: `“Me gusta torear despacio , pudiendo a los animales y dejándomelos llegar muy cerca” - Entrevista a Julio Norte`,
    image: "/images/titu.jpg",
    category: "Entrevistas",
    date: "21 de Enero de 2026",
    footerImage1: "/images/titu1.jpg",
    footerImage2: "/images/titu2.jpg",
    fullContent: `**Julio Norte** encara uno de los momentos más decisivos de su carrera. El novillero salmantino, que con esfuerzo, disciplina y constancia ha ido pasando de ser una figura emergente a consolidarse como una de las promesas más firmes del escalafón, vive un periodo de crecimiento que genera grandes **expectativas** entre la afición.

Tras una **temporada sobresaliente** en la que sumó numerosos **triunfos**, cortó **orejas importantes** y dejó constancia de su concepto profundo del **toreo**, **Norte** se perfila como un torero con proyección y personalidad. Su **temple**, **naturalidad** en el ruedo y **ambición controlada** dibujan un perfil que merece atención y seguimiento en los próximos meses.

**¿Cómo empezaste en el mundo del toreo y qué te inspiró a ser torero?**

Pues empecé hace no mucho después de la pandemia cuando mi padre apoderaba al maestro Uceda Leal. Me inspiró a querer ser torero pues que estaba todo el tiempo rodeado de toros.

**¿Qué toreros o figuras han influido más en tu estilo y trayectoria?**

Bueno a mi me gusta fijarme en **todos** pero sí que tengo grandes **referentes** como el maestro Paco Ojeda, el juli, Perera y Roca Rey.

**¿Cómo describirías el toreo que buscas expresar en la plaza?**

Eso prefiero que lo digan los **aficionados**, pero sí que me gusta **torear despacio**, pudiendo a los **animales** y **dejándomelos llegar muy cerca**.

**¿Cómo planteas la temporada 2026, en la que ya se han anunciado festejos importantes en plazas de gran categoría?**

Pues la planteamos con mucha **ilusión y ganas**, ya que va a ser una **temporada importante y decisiva** en mi trayectoria voy a **pisar plazas de máxima importancia** y evidentemente estoy **contento e ilusionado** pero a la vez **responsabilizado**.

**¿Qué objetivos te has marcado para la temporada 2026?**

**Ser yo mismo** y **seguir mi camino** como lo he estado haciendo hasta ahora.

**Respecto a la grave cornada sufrida el 22 de septiembre del pasado año en San Agustín de Guadalix, ¿qué ha sido lo más duro, física y mentalmente, durante la recuperación?**

Pues **físicamente** durante el proceso de recuperación muchos **dolores**, sobretodo de la **sonda urinaria**, que muchas veces hacía que se me **agotaran las fuerzas** y me veía en un estado de **debilidad muy grande** pero yo siempre resistía, gracias a Dios me he **recuperado bien** y luego **mentalmente** siempre he tenido la **mente tranquila** y he estado pensando en que iba a **volver a ser el mismo** cuando volviese a una plaza.

**¿En qué plaza sueñas con triunfar en el futuro?**

Me **gustaría** triunfar en **todas** las plazas **importantes** del mundo, pero sobretodo Madrid y Sevilla.

**¿Qué es para ti tomar la alternativa en Dax con figuras del torero como Roca Rey y Pablo Aguado?**

Es un **sueño hecho realidad** y bueno con dos **grandes figuras** del **toreo** y me **siento** un **auténtico afortunado**.`,
    author: "Eduardo Elvira",
    authorLogo: "/images/edu4.jpg",
    showAuthorHeader: true
  },
  { 
    id: 501,
    title: "“Expreso mi concepto bajo los cánones del clasicismo, con mi singularidad personal” - Entrevista a David Galván",
    image: "/images/entrevista.jpg",
    category: "Entrevistas",
    date: "29 de noviembre de 2025",
    fullContent: `**David Galván**
encara uno de los momentos más determinantes de su carrera. El matador gaditano, que con constancia, sensibilidad y una evolución silenciosa ha pasado de ser una promesa a convertirse en un nombre respetado dentro del escalafón, atraviesa un proceso de madurez profesional que despierta ilusión entre la afición.

Tras una temporada marcada por la solidez, actuaciones de gran calado y tardes en las que dejó patente la profundidad de su concepto, Galván ha logrado situarse como uno de los toreros con mayor poso y proyección. Su expresión clásica, su temple y una ambición cada vez más nítida lo consolidan como un perfil que merece ser escuchado.

**¿Cómo afronta usted la temporada que viene, teniendo en cuenta lo importante que ha sido esta?**

La temporada 2026 la afronto con la ilusión de dar mi mejor versión en cada actuación, mostrar mi personalidad en su máxima dimensión y seguir sintiendo a la afición ilusionada por ver a David Galván. 

**Se ha creado un movimiento “galvanista” ya que el buen publico, admira que un concepto tan puro como el suyo, no cambie con corridas duras. ¿Le gusta a usted que le encasillen con ese tipo de ganaderias o encastes? o preferiria torear corridas mas “comodas” y en otro tipo de carteles.**

Es muy bonito sentir ese movimiento “Galvanista” que he vivido este año y sigo viviendo. Recibo el entusiasmo constante de aficionados de todas las edades de la geografía europea y americana, lo que supone una gran felicidad para mí. 
Considero que no estoy encasillado en nada, no me pongo limitaciones, y es por este motivo que he conseguido desarrollar mi toreo y triunfar con todo tipo de ganaderías y encantes. 

**Perú y México, son dos paises con los que mantiene un idilio constante, y en los que se le espera con gran entusiasmo; ¿que opina de estos dos paises? ¿Y de los constantes ataques antitaurinos en mexico? ( se han vuelto a prohibir los toros en Ciudad Juarez)**

Tanto Perú como México son dos países que llevo en mi corazón. Me encanta torear en ellos y sentir el calor de sus aficiones. Siempre tendrán mi apoyo incondicional. 

**¿Como quiere que se le recuerde, cuales son sus mayores aspiraciones en este mundo?**

Como artista y como persona lo que más me llena es sentir que la gente se emociona y es feliz a través de mi expresión, esta es la mayor satisfacción y aspiración. 

 **Su concepto del toreo ha sido definido muchas veces como “clásico y eterno”. ¿Cree usted que en la actualidad, donde abundan estilos más efectistas, sigue habiendo espacio para ese clasicismo? ¿Qué mensaje quiere transmitir cada vez que se pone delante de un toro?**

Particularmente siento que los públicos si se identifican con mi toreo. Expreso mi concepto bajo los cánones del clasicismo, con mi singularidad personal. Me gusta la originalidad en el ruedo y que no haya nada previsible ni encorsetado.

**En España, la temporada pasada dejó tardes memorables en plazas de primera. ¿Qué importancia le da a triunfar en Madrid o Sevilla frente a otras plazas más pequeñas? ¿Considera que el público de cada ciudad entiende y valora de manera distinta su tauromaquia?**

Mi filosofía como torero pasa por expresar mi toreo con la misma entrega y compromiso independientemente de la categoría reglamentaria de la plaza. El público acude a la plaza y merece ver la mejor versión de uno mismo. 

En plazas de primera es cierto que ha habido faenas importantes en este año 2025, en las que he sentido el reconocimientos de aficiones que son exigentes y dan crédito. Inolvidables han sido las faenas en Sevilla y Málaga, el San Isidro de esta temporada o las tardes de capacidad en Dax y Albacete. 



**La juventud se acerca cada vez más al toreo, pero también se enfrenta a críticas sociales. ¿Qué consejo daría usted a los jóvenes que sueñan con ser toreros, y cómo cree que deberían afrontar las presiones externas que cuestionan la fiesta?**

Que persigan su sueño con fe, sin complejos y sintiéndose libres. 

**El toro bravo es el eje de todo este mundo. ¿Qué opinión tiene usted sobre la evolución de las ganaderías actuales? ¿Prefiere enfrentarse a hierros de máxima exigencia que ponen a prueba al torero, o cree que también es necesario buscar variedad para mostrar diferentes matices de su arte?**

El nivel de las ganaderías, cada una en su contexto y personalidad, en la actualidad es muy alto. Los ganaderos están haciendo una gran labor. 
Para el aficionado considero que causa mayor interés la variedad que la monotonía. Me preparo diariamente para tener registros suficientes para expresar mi toreo a todo tipo de toros independientemente de su condición o ganaderia, siempre fiel a mi sello personal.`,
    footerImage1: "/images/victorluengo.jpg",
    footerImage1Caption: "Fotos de Víctor Luengo",
    footerImage2: "/images/davidgalvan3.jpg",
    author: "Eduardo Elvira",
    authorLogo: "/images/edu4.jpg",
    showAuthorHeader: true
  },
  {
    id: 502,
    title: "Busco torear lo más despacio posible: Entrevista al novillero Tomás González",
    image: "images/tomasgonzalez.jpg",
    category: "Entrevistas",
    date: "14 de Octubre de 2025",
    fullContent: `
La temporada del joven novillero alcorisano Tomás González ha sido un punto de inflexión, uno de los novilleros que ha demostrado con argumentos que puede estar en las ferias.

Cuenta con buenas actuaciones a lo largo de la temporada Vinaroz, Burgo de Osma, Mojados, Azuqueca de Henares, Zaragoza…

En esta entrevista repasa su evolución, sus momentos más señalados del año y las metas que lo motivan a seguir avanzando de cara a la temporada que viene.

1. ¿Qué balances haces de tu temporada con importantes triunfos?

Ha sido una temporada muy importante, he crecido mucho como torero, que es lo más importante para mí. Hemos avanzado mucho, he encontrado la base de lo que quiero que sea mi toreo, que es algo fundamental.

2. ¿Si tuvieras que señalar una faena y una plaza de este año, dónde sería y por qué?

Me quedaría por diferentes razones con la faena de mi primer novillo de Zaragoza. Un pinchazo previo a la estocada se llevó el doble trofeo; me queda esa espina pero sentí cosas muy bonitas e importantes en esa faena, me entregué y expresé. Aunque ha habido faenas muy especiales, como las de Mojados, Marchamalo, Azuqueca, etc…

3. ¿Qué te ha enseñado esta temporada como torero y como persona?

He aprendido muchas cosas: que cada paso lleva un proceso muy largo detrás y que todo cuesta mucho de conseguir; por eso hay que apreciar y saborear el proceso en el que te encuentras. Ser torero y poder materializarlo es un privilegio grandioso al que no le damos la relevancia que verdaderamente tiene. También me ha ayudado a conocerme a mí mismo; esta temporada se han vivido momentos realmente duros, que han hecho reafirmarme en mi vocación torera como nunca.

4. ¿Cuál es tu estilo o qué estilo buscas?

No me gusta hablar de estilos, más bien de conceptos. Mi intención es la de torear como siento: encajado, relajado, lo más despacio posible. Al final creo que es lo que más lleva arriba, siendo siempre fiel a la personalidad de uno.

5. ¿Cómo fue tu paso por Zaragoza tras una gran faena a un novillo de Pincha? ¿Qué sentiste?

La tarde de Zaragoza fue muy especial; es la plaza en la que más veces he estado en mi vida. Me sentí realmente a gusto, disfruté, y eso en una plaza de esa relevancia es complicado. Creo que lo transmití arriba.

6. ¿Cómo planteas tu próxima temporada?

Ahora es momento de reflexión, tomar conciencia de lo que ha ido sucediendo durante la temporada y utilizarlo para mejorar en el invierno. Aunque desde ya, esperando la temporada venidera y que venga cargada de tardes importantes.
`
  },
  {
    id: 503,
    title: "Entrevista a Carlos Zúñiga: “Soy una persona ambiciosa y la vida me ha enseñado a saber esperar”",
    image: "images/carloszuñiga.jpg",
    category: "Entrevistas",
    date: "17 de Octubre de 2025",
    fullContent: `Carlos, en un momento donde la tauromaquia enfrenta tantos desafíos sociales y políticos, ¿qué significa para usted seguir apostando por este sector como empresario? 

Para mi es una forma de vida, una vocación. Yo no sé hacer otra cosa. Vivo 24 h para por y para el toro en su máxima expresión y no concibo el día a día sin ilusionarme y pensar en la confección de una feria. Creo que a veces puedo ser demasiado cansino en el día a día pero hasta ahora, esa "fórmula" no me ha ido mal. Seguiré peleando por y para el toreo y espero no desfallecer.

Gestiona plazas tan emblemáticas como El Puerto, Gijón o Aranjuez. ¿Qué criterios considera esenciales para que una feria taurina sea rentable y atractiva para el público? 

Creo que el secreto es dar al público de cada lugar lo que busca. Yo no me considero ni un Séneca ni un salvador del toreo, pero intento tener mi sello de calidad buscando la excelencia en el espectáculo. Me gusta un determinado tipo de toro e intento no perder nunca el rigor y el trapío acorde a cada plaza. En Gijón, por ejemplo, llevo casi 25 años con esa fórmula y la Feria de Begoña está más consolidada que nunca.

¿Qué le diría hoy a los políticos que impulsan prohibiciones o trabas a la celebración de festejos taurinos en España?

Simple y llanamente que respeten nuestras traiciones y las salvaguarden como garantes de un Bien declarado Patrimonio Cultural Inmaterial, por mucho que partidos radicales hayan tratado de boicotear.

¿Qué plaza sueña con gestionar algún día, y qué aportaría usted como empresario para devolverle o mantenerle su prestigio?

Bueno, imagínese, uno siempre sueña con volar lo más alto posible y en ese horizonte como no están Sevilla y Madrid. Quien sabe si el futuro me deparará algún día algo bonito. Lo que aportaría, me lo guardo para entonces.

La retirada de Morante de la Puebla marca un punto de inflexión en la tauromaquia actual. También porque usted siempre lo ha contratado siempre que ha podido este año en plazas como El Puerto de Santa María , Aranjuez….
Desde el punto de vista empresarial, ¿cómo afecta la ausencia de una figura así en la confección de carteles y en la atracción del público?

Reitero una vez más mi agradecimiento públicamente a Morante. Creo que ha sido el toreo más grandioso que mis ojos han tenido la oportunidad de ver y que seguramente vayan a ver. Ha sido muy generoso con la Fiesta y especialmente con los empresarios. Con su apoyo y el de El Juli, he crecido profesionalmente y sus faenas históricas en mis plazas me han aportado un plus de calidad que nunca olvidaré. Le echaremos mucho de menos como lo hemos hecho estos 2 años con Julián.

¿Como plantea la temporada que viene de cara a nuevas plazas? ¿Tiene en mente alguna? 

Estoy muy contento y muy feliz con las 9 o 10 plazas que gestiono actualmente pero soy una persona ambiciosa y además la vida me ha enseñado a saber esperar. Desde luego, y no lo voy a ocultar, mi objetivo es poder seguir creciendo pero siempre con la clarividencia de estudiar los pliegos y la situación de cada plaza. Quién sabe, si el futuro, nos deparará alguna sorpresa. También es bonito soñar...`
  },
  { 
    id: 504,
    title: "“Soy torero no sobresaliente” - Entrevista con Enrique Martínez Chapurra",
    image: "images/enriquez.jpg",
    category: "Entrevistas",
    date: "1 de noviembre de 2025",
    fullContent: `Matador de toros desde 2003, natural de Andújar, ha encabezado durante años el escalafón de sobresalientes en plazas tan destacadas como Las Ventas, Vistalegre o Morón de la Frontera. A pesar de una carrera marcada por la dureza y las lesiones, sigue fiel a su pasión y a su forma de entender la vida: con afición, entrega y verdad.

—¿Qué significa para ti haber encabezado durante varios años el escalafón de sobresalientes en plazas tan importantes?
—Bueno, no tiene mucha importancia el torear más o menos de sobresaliente. Yo considero que lo importante es poder vivir de torero y poder vivir de tu profesión. Dado que esto está muy complicado, poder vivir del toreo no es tarea fácil, y me siento un privilegiado de poder seguir disfrutando de mi profesión. Siempre pienso que esto es un trampolín hacia una oportunidad que me pueda cambiar la vida.

—Tomaste la alternativa en 2003 en Andújar, pero no has logrado consolidarte como matador principal. ¿Cómo has vivido esa transición?
—Tomé la alternativa en mi pueblo hace bastante tiempo, y al principio no me gustaba torear de sobresaliente, pero vi que era una de las pocas posibilidades que tenía para seguir vistiéndome de torero y seguir luchando. Me lo tomé como si toreara cincuenta corridas por temporada, porque nunca he dejado de entrenar como al principio. A día de hoy sigo con la misma ilusión que cuando era un chaval.

—En 2022 sufriste una grave cornada en Estella. ¿Cómo fue esa experiencia?
—Sí, fue una cornada extremadamente grave. Al final tuve mucha suerte, porque si el pitón llega a profundizar un poco más —ya fueron 25 centímetros— estaríamos hablando de una tragedia gorda, porque me habría partido el hígado. Así que me considero un afortunado. Mi carrera ha sido muy dura: desde novillero tuve una cornada gravísima en el ano que me destrozó intestino delgado y grueso, con rotura de peritoneo, y estuve a punto de morir. Luego vinieron más: una en Ondara en 2005, otra lesión muy dura en 2019 con la rotura del tendón de Aquiles… Pero aquí sigo. Mi carrera ha sido muy dura, sí, pero también muy vivida.

—Eres conocido por tu afición y entrega. ¿Cuál es tu filosofía personal para mantenerte motivado?
—Mi filosofía en el toreo y en la vida es ir siempre recto. En el toreo hay que tener mucha afición y vivir para ello. A mí nunca me ha costado sacrificarme por mi profesión, porque me gusta y es mi pasión.

—¿Qué opinas sobre el papel de los sobresalientes en los festejos taurinos?
—La opinión que tengo es que uno no es sobresaliente: uno es torero. Me toca esto y es lo que me contratan, pero ante todo soy matador de toros, y sobre todo, soy torero.

—¿Cuáles son tus proyectos y objetivos para el futuro?
—Mi objetivo es seguir en mi profesión mientras las fuerzas y la ilusión me acompañen. Que venga lo que el destino quiera, pero yo lo único que quiero es ser feliz, y así lo soy con lo que hago.`
  }, 
  { 
    id: 505,
    title: "“Considero que soy un torero que tiene personalidad” - Entrevista con Sergio Rodríguez",
    image: "/images/sergior.jpg",
    imageCaption: "Sergio Rodríguez en la Final de la Copa Chenel",
    footerImage1: "/images/sergior1.jpg",
    footerImage1Caption: "Sergio Rodríguez el pasado 12 de Octubre en Las Ventas - Foto Plaza 1",
    footerImage2: "/images/sergior2.jpg",
    category: "Entrevistas",
    date: "24 de noviembre de 2025",
    fullContent: `A las puertas de una nueva campaña taurina, **Sergio Rodríguez** encara uno de los momentos más determinantes de su carrera. El matador abulense, que en apenas unos años ha pasado de promesa a nombre imprescindible del escalafón joven, vive un proceso de madurez profesional que ilusiona tanto al aficionado. 

**Tras una temporada marcada por la regularidad**, triunfos de peso y tardes en las que dejó constancia de su personalidad en la plaza, Sergio ha logrado posicionarse como uno de los toreros con mayor proyección del momento. Su concepto clásico, su valor sereno y una ambición cada vez más evidente lo convierten en un perfil que despierta interés.

**¿Qué significó para ti proclamarte triunfador de la Copa Chenel 2025 y cómo crees que ese triunfo puede cambiar tu carrera?**

“Bueno, pues aparte de la satisfacción que a uno le da triunfar y ganar, certámenes 
 tan importantes como puede ser la Copa Chenel, fue un poco la recompensa a muchos meses de entrenamiento, de disciplina, de entrega.
Entonces, pues bueno, significó mucho, tanto como parami torero como para la persona que soy.
Fue un antes y un después, sin duda.
Y bueno, pues espero que el año que viene me den un poco las oportunidades que este año no se me han dado y creo que merecía por los motivos que había dado en la plaza.
Creo que eso es un poco lo que más puedo esperar de cara al año que viene.”

**¿Cómo recuerdas tus primeros pasos en la tauromaquia, empezando desde que tenías 12 años en la escuela taurina de Las Navas del Marqués?**

“Pues son recuerdos muy bonitos, todos los recuerdo de una manera muy gratificante y muy feliz.
De hecho, hay muchos que los añoro, hay cosas que ya no van a volver por la inocencia de un niño que empieza, por un montón de cosas que se tienen cuando uno está empezando.
La verdad que las extraño.
Y bueno, fue una etapa muy bonita donde di mis primeros pasos en una escuela de aficionados.
Ni siquiera yo quería ser torero, pero bueno, ahí fue donde me entró ese veneno que decimos los toreros para querer dedicarme ya de una manera profesional al torero.”

**¿Cómo definirías tu estilo dentro del ruedo y qué toreros han influido en tu forma de torear?**

“Considero que soy un torero que tiene personalidad.
Interpreto el toreo de una manera muy personal.
Es cierto que siempre me he fijado mucho en el maestro José Tomás, en el maestro Morante, en el maestro Rafael de Paula , pero nunca he intentado copiar nada.
Siempre he buscado las cosas que más me han gustado de estos maestros y he intentado trasladarlo a mis formas y a mi concepto.”

	**¿Qué te gustaría que la afición recordara de ti dentro de unos años?**

“Bueno, pues me gustaría que me recordasen como un torero de época, un torero especial, con un concepto propio del toreo.
Y me encantaría intentar marcar la época en el torero y sobre todo ser torero de torero.
Creo que es lo más grande que hay y creo que es la mejor forma que se le pueda recordar a un torero, siendo torero de torero.”

**¿Cómo planteas la temporada que viene después de los triunfos logrados este año?**

“Pues la verdad que, bueno, la temporada del año que viene es un poco incógnita, no sé muy bien el que puede pararme, pero sí tengo claro lo que yo quiero y lo que me encantaría conseguir, por supuesto.
Me encantaría volver a Madrid, me encantaría que la afición de Madrid me viese como yo soy, aprovechar esa oportunidad que ahora mismo tanto necesito para hacerme un hueco dentro del escalafón.”

**¿Como afrontas tu compromiso en Perú , donde este próximo mes de diciembre torearás allí?**

“Bueno, pues la verdad que el compromiso de Perú lo afrontó con mucha ilusión.
Al final ha sido una inyección de moral.
Cuando uno tiende un poquito a relajarse una vez terminada la temporada, pues que le llamen para viajar a uno de los países que más en auge está en la actualidad en el mundo del toro, pues es muy bonito y también me viene la responsabilidad.
Quiero aprovechar esa oportunidad que se me ha brindado, que creo que es muy buena.
Y nada, pues me encanta conocer nuevos países, nuevas costumbres y sobre todo que conozca mi toreo en otros rincones del mundo.”`
  },
  { 
    id: 506,
    title: `Nicolás Grande, el joven que reivindica la tauromaquia desde las redes: “Mi generación es el futuro de este arte”`,
    image: "/images/nicolas.jpg",
    category: "Entrevistas",
    date: "9 de Diciembre de 2025",
    fullContent: `Con apenas unos años de presencia en redes sociales, **Nicolás Grande** se ha convertido en una de las voces jóvenes más visibles en defensa de la tauromaquia. Estudiante de veterinaria y apasionado del toro, su discurso rompe clichés: no viene de una familia taurina ni creció rodeado de corridas, pero encontró en los sanfermines el inicio de una fascinación que marcaría su camino.

Por eso, desde Portal Tendido Digital hemos querido entrevistarle para conocerle algo más.

**Nicolás, estudias veterinaria. ¿Qué te llevó a interesarte por la tauromaquia, y cómo concilias ese amor por los animales con la defensa del espectáculo taurino?**

Mi verdadera pasión son los animales. El toro de lidia fue, desde el principio, lo que despertó mi interés por este espectáculo. Yo no vengo de una familia especialmente taurina, pero ver cada 7 de julio en las calles de Pamplona a esos animales majestuosos correr fue lo que me generó una fascinación enorme.
Respecto a la defensa de la tauromaquia, desde fuera puede parecer algo muy complejo. Sin embargo, cuando uno entiende la fiesta brava y se dedica a estudiarla, descubre un mar infinito de argumentos que la sustentan. Solo hace falta acercarse con la mente abierta.

**Has ganado visibilidad en Instagram/TikTok como joven defensor de la tauromaquia. ¿Cómo usas tus redes para comunicar tu visión? ¿Crees que las redes pueden cambiar la percepción de los toros entre la gente joven?**

Desde que empecé en redes no he parado de aprender. Me adentré en un mundo que desconocía por completo; de hecho, ni siquiera tenía TikTok: me lo descargué exclusivamente para empezar a crear contenido.
En un inicio quería hablar del mundo ganadero en general, ya que había trabajado en una ganadería de carne en Cantabria y me apasionaba la defensa del medio rural. Pero un día decidí subir un vídeo con argumentos a favor de la tauromaquia, y tuvo tanto éxito que me replanteó mi vocación.
Me di cuenta de que en redes faltaban creadores taurinos adaptados a los nuevos tiempos, capaces de llegar a un público joven. Ahí decidí enfocar mi contenido hacia una especie de “evangelización” de la tauromaquia desde un formato moderno.
Creo que antes era más fácil consumir tauromaquia, y que durante un tiempo se dejó de difundir este arte; pero gracias a las redes sociales puede volver a conectar con un público amplio.
Muchos asocian la tauromaquia con generaciones mayores.

**Tú representas una generación joven a favor del toreo. ¿Qué crees que puede aportar tu generación a la tauromaquia? ¿Qué interés ves hoy en jóvenes por este mundo?**

Mi generación es el futuro de todo. De nosotros depende la continuidad de nuestra cultura. Si no somos nosotros quienes ocupamos los tendidos, ¿quién lo hará?
Tenemos la responsabilidad de escuchar y aprender de nuestros mayores, de los toreros, de los escritores taurinos y de toda la sabiduría que ellos han acumulado, para en un futuro poder transmitirlo.
Aun así, hay un aspecto que me tranquiliza: los jóvenes empezamos a buscar referentes en una sociedad que muchas veces se percibe como vacía o sin héroes. En la tauromaquia muchos encuentran figuras valientes, personas que se juegan la vida por aquello que aman, mientras vemos a nuestros representantes políticos esconderse ante todo lo que no les beneficia.

**La tauromaquia está muy politizada, con defensores y detractores apasionados. ¿Cómo valoras ese contexto? ¿Piensas que hay una politización excesiva? ¿Qué espacio crees que ha de tener la tradición del toro en la sociedad actual? (Sobre todo por la zona de Barcelona)**

Es una pena que la cultura se politice. No ocurre solo con los toros: hoy en día prácticamente todo se usa para generar tensión y confrontación.
Existen numerosos ejemplos de personajes públicos que, independientemente de su ideología, acuden a las plazas. Por mencionar algunos, tanto Isabel Díaz Ayuso (del Partido Popular) como Joaquín Sabina (abiertamente socialista) disfrutan de la tauromaquia.
La fiesta no entiende de colores ni de partidos: es del pueblo y para el pueblo.
En cuanto a Barcelona, es triste ver cómo la familia Balañá sigue con su juego cobarde de mantener cerradas las plazas. Cataluña es taurina, y eso se refleja en los muchos pueblos de la comunidad donde se celebran festejos con más libertad que en la propia ciudad.
Aun así, tengo esperanza de que, con la ayuda de mi amigo Mario Vilau, logremos reabrir la Monumental.

**Si tuvieras que explicar a alguien que nunca ha visto un toro de lidia por qué te gusta la tauromaquia, ¿qué argumentos darías apelando a lo emocional, cultural o artístico?**

Le diría que es algo que, hasta que no lo vives, no lo puedes entender. Y aun viviéndolo, sigue siendo difícil de explicar.
Me gusta compararla con un cuadro abstracto: o tienes la sensibilidad para apreciar el arte que encierra, o simplemente no lo ves. No hay término medio. Puede hacerte vibrar en un buen natural, o puede parecerte solo un hombre con una capa roja.
Aun así, creo que cualquiera debería sentarse en un tendido al menos una vez para construirse una opinión real sobre los toros.`,
  author: "Eduardo Elvira",
  authorLogo: "/images/edu4.jpg",
  showAuthorHeader: true
  },
];

const latestNews: NewsItem[] = [...chronicles, ...entrevistas];

// --- 4. COMPONENTE PRINCIPAL ---

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState(latestNews); 
  
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
  
  // Newsletter y contacto
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  // Generamos featuredNews a partir de latestNews (primeros 5)
  const featuredNews = articles.slice(0, 5);

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
  }, [featuredNews.length]);

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

  const shareToWhatsApp = () => {
      if(!sharePost) return;
      window.open(`https://wa.me/?text=${encodeURIComponent(sharePost.title + ' - ' + window.location.origin)}`, '_blank');
      closeShareModal();
  };
  
  const shareToTwitter = () => {
      if(!sharePost) return;
      const text = `${sharePost.title} - vía @tendidodigital`;
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin)}`;
      window.open(url, '_blank');
      closeShareModal();
  };

  const shareToFacebook = () => {
      if(!sharePost) return;
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`;
      window.open(url, '_blank');
      closeShareModal();
  };

  const copyLink = async () => {
      try {
        if (sharePost) {
          const encoded = btoa(`news-${sharePost.id}`);
          const link = `${window.location.origin}/?p=${encoded}&utm_source=ig_web_copy_link`;
          await navigator.clipboard.writeText(link);
          setContactMessage("¡Enlace copiado!");
          closeShareModal();
          setTimeout(() => setContactMessage(""), 3000);
        }
      } catch (error) {
        console.error("Error al copiar enlace:", error);
      }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsNewsletterSubmitting(true);
      setTimeout(() => {
          setNewsletterMessage("¡Gracias por suscribirte!");
          setNewsletterEmail("");
          setIsNewsletterSubmitting(false);
      }, 1000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsContactSubmitting(true);
      setTimeout(() => {
          setContactMessage("Mensaje enviado correctamente.");
          setContactForm({ name: '', email: '', subject: '', message: '' });
          setIsContactSubmitting(false);
      }, 1000);
  };

  const getFilteredNews = () => {
      if (newsFilter === 'todas') return articles;
      return articles.filter(news => {
          const cat = news.category?.toLowerCase() || '';
          const filter = newsFilter.toLowerCase();
          return cat.includes(filter) || filter.includes(cat);
      });
  };
  
  const SponsorBanner = () => (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col items-center justify-center my-8 cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
        <a href="https://tauromania.es" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center space-y-3">
        <img src="/images/tauromania.png" alt="TauroManía logo" className="w-52 md:w-64 object-contain" />
        <p className="text-gray-700 font-medium text-sm text-center">Colaboración <span className="font-bold text-yellow-600">- TauroManía</span></p>
        </a>
    </div>
  );

  // --- RENDERIZADO ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        {/* HEADER */}
        <header className={`sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm transition-all ${scrollY > 50 ? 'shadow-md' : ''}`}>
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
                            <div key={news.id} className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
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
                                    <button key={cat} onClick={() => setNewsFilter(cat)} className={`px-6 py-2 rounded-full text-sm font-bold capitalize transition ${newsFilter === cat ? 'bg-red-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {getFilteredNews().slice(0, visibleNewsCount).map((news: any, index) => (
                                <React.Fragment key={news.id}>
                                <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => openNewsModal(news)}>
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
                                {(index + 1) % 6 === 0 && <SponsorBanner />}
                                </React.Fragment>
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
                            <i className={`ri-bookmark-${savedPosts.has(Number(selectedNews.id)) ? 'fill text-yellow-500' : 'line'} text-xl`}></i>
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
                            <div key={idx}>
                                <img src={img} className="w-full rounded-xl shadow-md" loading="lazy" />
                                {/* Captions opcionales si existen */}
                                {idx === 0 && selectedNews.footerImage1Caption && <p className="text-xs text-gray-500 mt-1">{selectedNews.footerImage1Caption}</p>}
                                {idx === 1 && selectedNews.footerImage2Caption && <p className="text-xs text-gray-500 mt-1">{selectedNews.footerImage2Caption}</p>}
                                {idx === 2 && selectedNews.footerImage3Caption && <p className="text-xs text-gray-500 mt-1">{selectedNews.footerImage3Caption}</p>}
                                {idx === 3 && selectedNews.footerImage4Caption && <p className="text-xs text-gray-500 mt-1">{selectedNews.footerImage4Caption}</p>}
                            </div>
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
                             <i className={`ri-bookmark-${savedPosts.has(Number(selectedChronicle.id)) ? 'fill text-yellow-500' : 'line'} text-xl`}></i>
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

        {/* MODAL COMPARTIR */}
        {isShareModalOpen && sharePost && (
          <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4" onClick={closeShareModal}>
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300" onClick={e => e.stopPropagation()}>
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <i className="ri-share-line text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Compartir Noticia</h3>
                <p className="text-gray-600 text-sm">Comparte esta noticia con tus amigos</p>
              </div>

              <div className="space-y-3 mb-6">
                <button onClick={shareToWhatsApp} className="w-full flex items-center justify-center space-x-3 bg-green-500 hover:bg-green-600 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105">
                  <i className="ri-whatsapp-line text-xl"></i>
                  <span className="font-medium">Compartir en WhatsApp</span>
                </button>

                <button onClick={shareToTwitter} className="w-full flex items-center justify-center space-x-3 bg-sky-500 hover:bg-sky-600 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105">
                  <i className="ri-twitter-fill text-xl"></i>
                  <span className="font-medium">Compartir en Twitter</span>
                </button>

                <button onClick={shareToFacebook} className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105">
                  <i className="ri-facebook-fill text-xl"></i>
                  <span className="font-medium">Compartir en Facebook</span>
                </button>

                <button onClick={copyLink} className="w-full flex items-center justify-center space-x-3 bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105">
                  <i className="ri-link text-xl"></i>
                  <span className="font-medium">Copiar enlace</span>
                </button>
              </div>

              <button
                onClick={closeShareModal}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-all duration-300"
              >
                Cancelar
              </button>
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
                
                {/* FORMULARIO NEWSLETTER / CONTACTO */}
                <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-xl mb-8">
                    <h3 className="text-lg font-bold mb-4">Suscríbete al boletín</h3>
                    <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                        <input 
                            type="email" 
                            placeholder="Tu email" 
                            className="w-full p-3 rounded bg-gray-700 text-white border-none focus:ring-2 focus:ring-red-500"
                            value={newsletterEmail}
                            onChange={e => setNewsletterEmail(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={isNewsletterSubmitting} className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-bold transition">
                            {isNewsletterSubmitting ? 'Enviando...' : 'Suscribirse'}
                        </button>
                        {newsletterMessage && <p className="text-sm text-green-400">{newsletterMessage}</p>}
                    </form>
                </div>

                <p className="text-gray-600 text-sm">© 2026 Tendido Digital. Todos los derechos reservados.</p>
            </div>
        </footer>
    </div>
  );
}
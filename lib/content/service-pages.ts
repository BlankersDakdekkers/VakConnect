export type ServiceSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  type?: "default" | "warning" | "info";
};
export type ServiceFaq = { question: string; answer: string };
export type ServiceLink = { href: string; title: string; description: string };
export type ServiceContentPageData = {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  intro: string[];
  breadcrumbs: Array<{ label: string; href?: string }>;
  sections: ServiceSection[];
  costFactors: string[];
  processSteps: string[];
  relatedLinks: ServiceLink[];
  faqs: ServiceFaq[];
  cta: {
    title: string;
    description: string;
    label: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  };
  warning?: { title: string; body: string };
};

const defaultCostFactors = [
  "Omvang van de klus en benodigde arbeidsuren",
  "Materiaalkeuze en kwaliteit van onderdelen",
  "Bereikbaarheid van de werklocatie",
  "Complexiteit van bestaande situatie",
  "Regio, planning en eventuele spoed"
];

function withFallbackCosts(costFactors: string[]) {
  return costFactors.length ? costFactors : defaultCostFactors;
}

const rawServiceMainPages = {
  "dakdekker": {
    "path": "/dakdekker",
    "title": "Dakdekker nodig? Vind een passende vakman via VakConnect",
    "description": "Lees wanneer een dakdekker nodig is, welke aanpak past bij jouw dak en hoe je via VakConnect een inhoudelijk sterke aanvraag doet.",
    "keywords": [
      "dakdekker",
      "dakdekker",
      "vakman",
      "VakConnect"
    ],
    "h1": "Dakdekker nodig? Vind een passende vakman via VakConnect",
    "intro": [
      "Via VakConnect kun je dakproblemen of gepland dakonderhoud gericht uitzetten bij een passende vakman in jouw regio.",
      "Of het nu om lekkage, slijtage of renovatie gaat: met een goede intake voorkom je snelle maar onvolledige oplossingen.",
      "Deze pagina geeft je inhoudelijke houvast voor keuzes, planning en kostenfactoren, zonder dat VakConnect zelf uitvoerend dakwerk doet."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Dakdekker"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer je een dakdekker nodig hebt",
        "paragraphs": [
          "Wanneer je een dakdekker nodig hebt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer je een dakdekker nodig hebt tellen factoren zoals actieve daklekkage, periodiek onderhoud bij ouder dak, stormschade aan pannen of nok en voorbereiding op renovatie of verkoop mee, omdat ze de omvang en aanpak van dakwerk rond dakdekker concreet maken.",
          "Voor wanneer je een dakdekker nodig hebt beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "actieve daklekkage",
          "periodiek onderhoud bij ouder dak",
          "stormschade aan pannen of nok",
          "voorbereiding op renovatie of verkoop"
        ]
      },
      {
        "heading": "Hoe een dakbeoordeling meestal start",
        "paragraphs": [
          "Hoe een dakbeoordeling meestal start: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij hoe een dakbeoordeling meestal start tellen factoren zoals verschil tussen hellend dak en plat dak bij diagnose, controle van aansluitingen rond schoorsteen, dakkapel en goten, beoordeling van dakbedekking, onderlagen en bevestigingen en veilig werken op hoogte met geschikte bereikbaarheid mee, omdat ze de omvang en aanpak van dakwerk rond dakdekker concreet maken.",
          "Voor hoe een dakbeoordeling meestal start beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "verschil tussen hellend dak en plat dak bij diagnose",
          "controle van aansluitingen rond schoorsteen, dakkapel en goten",
          "beoordeling van dakbedekking, onderlagen en bevestigingen",
          "veilig werken op hoogte met geschikte bereikbaarheid"
        ]
      },
      {
        "heading": "Repareren, deels renoveren of volledig vernieuwen",
        "paragraphs": [
          "Repareren, deels renoveren of volledig vernieuwen: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij repareren, deels renoveren of volledig vernieuwen tellen factoren zoals lokale reparatie als de rest van het dak nog in goede staat is, deelrenovatie bij slijtage in één dakvlak, volledige renovatie bij structurele veroudering en combineren met isolatie wanneer de opbouw toch open gaat mee, omdat ze de omvang en aanpak van dakwerk rond dakdekker concreet maken.",
          "Voor repareren, deels renoveren of volledig vernieuwen beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "lokale reparatie als de rest van het dak nog in goede staat is",
          "deelrenovatie bij slijtage in één dakvlak",
          "volledige renovatie bij structurele veroudering",
          "combineren met isolatie wanneer de opbouw toch open gaat"
        ]
      },
      {
        "heading": "Voorbereiding van je aanvraag",
        "paragraphs": [
          "Voorbereiding van je aanvraag: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij voorbereiding van je aanvraag tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond dakdekker concreet maken.",
          "Voor voorbereiding van je aanvraag beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Uitvoering op hoogte en bereikbaarheid",
        "paragraphs": [
          "Uitvoering op hoogte en bereikbaarheid: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij uitvoering op hoogte en bereikbaarheid tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond dakdekker concreet maken.",
          "Voor uitvoering op hoogte en bereikbaarheid beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Combinaties met isolatie en afwatering",
        "paragraphs": [
          "Combinaties met isolatie en afwatering: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij combinaties met isolatie en afwatering tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond dakdekker concreet maken.",
          "Voor combinaties met isolatie en afwatering beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wanneer uitstel extra risico geeft",
        "paragraphs": [
          "Wanneer uitstel extra risico geeft: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij wanneer uitstel extra risico geeft tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond dakdekker concreet maken.",
          "Voor wanneer uitstel extra risico geeft beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "type": "warning"
      },
      {
        "heading": "Informatie die jouw aanvraag sterker maakt",
        "paragraphs": [
          "Informatie die jouw aanvraag sterker maakt: Een zorgvuldige beoordeling van dit onderdeel maakt offertes beter vergelijkbaar en realistischer.",
          "Bij informatie die jouw aanvraag sterker maakt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond dakdekker concreet maken.",
          "Voor informatie die jouw aanvraag sterker maakt beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "tijd voor lekdetectie en inspectie van details",
      "daktype en materiaal (pannen, bitumen of EPDM)",
      "bereikbaarheid via steiger, ladder of hoogwerker",
      "omvang van herstel en eventuele vervolgschade",
      "spoedinzet buiten reguliere planning",
      "afvoer- en randdetails die moeten worden meegenomen"
    ],
    "processSteps": [
      "Beschrijf het probleem, het daktype en de urgentie in je aanvraag.",
      "Voeg foto’s toe van de zichtbare schade en noem wanneer de klacht optreedt.",
      "VakConnect koppelt de aanvraag aan een passende dakprofessional in jouw regio.",
      "De professional beoordeelt de situatie en stemt vervolg, planning en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/dakdekker/daklekkage",
        "title": "Daklekkage",
        "description": "Verdiep je in daklekkage en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/dakdekker/dakrenovatie",
        "title": "Dakrenovatie",
        "description": "Verdiep je in dakrenovatie en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/dakdekker/dakpannen-vervangen",
        "title": "Dakpannen vervangen",
        "description": "Verdiep je in dakpannen vervangen en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/dakdekker/plat-dak",
        "title": "Plat dak",
        "description": "Verdiep je in plat dak en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/dakdekker/schoorsteen",
        "title": "Schoorsteen",
        "description": "Verdiep je in schoorsteen en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/dakdekker/dakinspectie",
        "title": "Dakinspectie",
        "description": "Verdiep je in dakinspectie en ontdek wanneer deze subdienst past bij jouw situatie."
      }
    ],
    "faqs": [
      {
        "question": "Wanneer is een dakprobleem echt spoed?",
        "answer": "Spoed is vooral aan de orde bij actieve lekkage, snelle toename van waterschade of losliggende delen die onveilig kunnen worden. Benoem de ernst in je aanvraag zodat de juiste prioriteit kan worden ingeschat."
      },
      {
        "question": "Wat is het verschil tussen reparatie en renovatie?",
        "answer": "Reparatie richt zich op een afgebakend defect, zoals een aansluiting of een beperkt dakdeel. Renovatie gaat breder en pakt de staat van een groter deel van de dakopbouw aan."
      },
      {
        "question": "Moet ik direct kiezen welk materiaal ik wil?",
        "answer": "Nee. Het helpt om je voorkeur te delen, maar de definitieve keuze volgt meestal na beoordeling van je huidige dak en de gewenste levensduur."
      },
      {
        "question": "Kan ik dakwerk combineren met isolatie?",
        "answer": "Ja, vooral bij renovatie kan dat efficiënt zijn omdat delen van de opbouw al toegankelijk zijn. Vermeld in je aanvraag dat je die combinatie wilt onderzoeken."
      },
      {
        "question": "Voert VakConnect zelf dakwerk uit?",
        "answer": "Nee. VakConnect is het platform dat consumenten koppelt aan een passende aangesloten vakman."
      }
    ],
    "cta": {
      "title": "Vind een passende dakdekker voor jouw klus",
      "description": "Beschrijf je dakdekker-klus op /aanvraag met duidelijke informatie over situatie, bereikbaarheid en planning voor een gerichte koppeling.",
      "label": "Vraag een passende dakdekker aan",
      "secondaryLabel": "Bekijk hoe VakConnect werkt",
      "secondaryHref": "/hoe-werkt-het"
    }
  },
  "schilder": {
    "path": "/schilder",
    "title": "Schilder zoeken voor binnen- en buitenwerk via VakConnect",
    "description": "Ontdek wanneer schilderwerk onderhoud vraagt, welke keuzes echt verschil maken en hoe je via VakConnect een passende schilder vindt.",
    "keywords": [
      "schilder",
      "schilder",
      "vakman",
      "VakConnect"
    ],
    "h1": "Schilder zoeken voor binnen- en buitenwerk via VakConnect",
    "intro": [
      "Schilderwerk bepaalt niet alleen de uitstraling van je woning, maar ook de bescherming van hout en afwerking.",
      "Via VakConnect beschrijf je je schilderklus op een manier die direct bruikbaar is voor een passende specialist.",
      "Hier lees je hoe je per situatie de juiste keuzes maakt in voorbereiding, materiaal en planning."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Schilder"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer schilderwerk onderhoud vraagt",
        "paragraphs": [
          "Wanneer schilderwerk onderhoud vraagt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer schilderwerk onderhoud vraagt tellen factoren zoals periodiek buitenschilderwerk, opfrissen van binnenschilderwerk, herstel van bladderende of krijtende lagen en combinatie met kozijnonderhoud of renovatie mee, omdat ze de omvang en aanpak van schilderwerk rond schilder concreet maken.",
          "Voor wanneer schilderwerk onderhoud vraagt beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "periodiek buitenschilderwerk",
          "opfrissen van binnenschilderwerk",
          "herstel van bladderende of krijtende lagen",
          "combinatie met kozijnonderhoud of renovatie"
        ]
      },
      {
        "heading": "Wat een schilder beoordeelt vóór uitvoering",
        "paragraphs": [
          "Wat een schilder beoordeelt vóór uitvoering: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij wat een schilder beoordeelt vóór uitvoering tellen factoren zoals staat van de ondergrond bepaalt het eindresultaat, vochtbelasting en zonzijde beïnvloeden de verfkeuze, voorbehandeling (reinigen, schuren, plamuren) is bepalend voor hechting en afplakken, ventilatie en droogtijd sturen de planning mee, omdat ze de omvang en aanpak van schilderwerk rond schilder concreet maken.",
          "Voor wat een schilder beoordeelt vóór uitvoering beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "staat van de ondergrond bepaalt het eindresultaat",
          "vochtbelasting en zonzijde beïnvloeden de verfkeuze",
          "voorbehandeling (reinigen, schuren, plamuren) is bepalend voor hechting",
          "afplakken, ventilatie en droogtijd sturen de planning"
        ]
      },
      {
        "heading": "Keuzes in verfopbouw en afwerking",
        "paragraphs": [
          "Keuzes in verfopbouw en afwerking: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij keuzes in verfopbouw en afwerking tellen factoren zoals binnenwerk gefaseerd per ruimte, buitenwerk per gevelzijde of in één onderhoudsronde, alleen opfrissen of inclusief herstel van houtschade en combinatie met deuren-, trap- of kozijnwerk mee, omdat ze de omvang en aanpak van schilderwerk rond schilder concreet maken.",
          "Voor keuzes in verfopbouw en afwerking beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "binnenwerk gefaseerd per ruimte",
          "buitenwerk per gevelzijde of in één onderhoudsronde",
          "alleen opfrissen of inclusief herstel van houtschade",
          "combinatie met deuren-, trap- of kozijnwerk"
        ]
      },
      {
        "heading": "Binnenwerk, buitenwerk of een combinatie",
        "paragraphs": [
          "Binnenwerk, buitenwerk of een combinatie: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij binnenwerk, buitenwerk of een combinatie tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van schilderwerk rond schilder concreet maken.",
          "Voor binnenwerk, buitenwerk of een combinatie beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Voorbereiding in huis of aan de gevel",
        "paragraphs": [
          "Voorbereiding in huis of aan de gevel: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij voorbereiding in huis of aan de gevel tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van schilderwerk rond schilder concreet maken.",
          "Voor voorbereiding in huis of aan de gevel beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Planning rond droogtijd en seizoen",
        "paragraphs": [
          "Planning rond droogtijd en seizoen: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij planning rond droogtijd en seizoen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van schilderwerk rond schilder concreet maken.",
          "Voor planning rond droogtijd en seizoen beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wat uitstel doet met ondergrond en herstelwerk",
        "paragraphs": [
          "Wat uitstel doet met ondergrond en herstelwerk: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij wat uitstel doet met ondergrond en herstelwerk tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van schilderwerk rond schilder concreet maken.",
          "Voor wat uitstel doet met ondergrond en herstelwerk beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ],
        "type": "warning"
      },
      {
        "heading": "Hoe je een inhoudelijk sterke aanvraag opstelt",
        "paragraphs": [
          "Hoe je een inhoudelijk sterke aanvraag opstelt: Een zorgvuldige beoordeling van dit onderdeel maakt offertes beter vergelijkbaar en realistischer.",
          "Bij hoe je een inhoudelijk sterke aanvraag opstelt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van schilderwerk rond schilder concreet maken.",
          "Voor hoe je een inhoudelijk sterke aanvraag opstelt beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "aantal m² en hoeveelheid houtwerk",
      "staat van ondergrond en nodig herstel",
      "aantal lagen en gekozen verfsysteem",
      "hoogte en bereikbaarheid van geveldelen",
      "mate van afplak- en beschermwerk",
      "planning in drukke seizoenen"
    ],
    "processSteps": [
      "Omschrijf welke delen je wilt laten schilderen en in welke staat ze zijn.",
      "Noem of het om binnenwerk, buitenwerk of een combinatie gaat.",
      "VakConnect koppelt je aanvraag aan een schilder die past bij jouw klus en regio.",
      "Daarna volgt afstemming over aanpak, voorbereiding en planning."
    ],
    "relatedLinks": [
      {
        "href": "/schilder/binnenschilderwerk",
        "title": "Binnenschilderwerk",
        "description": "Verdiep je in binnenschilderwerk en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/schilder/buitenschilderwerk",
        "title": "Buitenschilderwerk",
        "description": "Verdiep je in buitenschilderwerk en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/schilder/kozijnen-schilderen",
        "title": "Kozijnen schilderen",
        "description": "Verdiep je in kozijnen schilderen en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/schilder/deuren-schilderen",
        "title": "Deuren schilderen",
        "description": "Verdiep je in deuren schilderen en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/schilder/plafond-schilderen",
        "title": "Plafond schilderen",
        "description": "Verdiep je in plafond schilderen en ontdek wanneer deze subdienst past bij jouw situatie."
      }
    ],
    "faqs": [
      {
        "question": "Waarom is voorbehandeling zo belangrijk?",
        "answer": "Omdat oneffenheden, oude losse lagen en vervuiling anders zichtbaar blijven of voor slechte hechting zorgen. Een strak resultaat begint vrijwel altijd met degelijk voorbereid werk."
      },
      {
        "question": "Kan ik schilderwerk in etappes uitvoeren?",
        "answer": "Ja, dat gebeurt vaak. Denk aan eerst buiten, later binnen, of per verdieping. Geef in je aanvraag aan welke volgorde je prettig vindt."
      },
      {
        "question": "Moet ik alle verfkleuren al gekozen hebben?",
        "answer": "Nee. Een richting helpt, maar kleur- en glanskeuze kunnen later met de vakman worden aangescherpt."
      },
      {
        "question": "Wanneer combineer ik schilderwerk met kozijnherstel?",
        "answer": "Als er scheuren, zacht hout of hardnekkige vochtplekken zijn, is gecombineerde aanpak vaak logischer dan alleen overschilderen."
      },
      {
        "question": "Doet VakConnect zelf het schilderwerk?",
        "answer": "Nee, VakConnect koppelt je aan een passende specialist."
      }
    ],
    "cta": {
      "title": "Vind een passende schilder voor jouw klus",
      "description": "Beschrijf je schilder-klus op /aanvraag met duidelijke informatie over situatie, bereikbaarheid en planning voor een gerichte koppeling.",
      "label": "Vind een passende schilder",
      "secondaryLabel": "Bekijk hoe VakConnect werkt",
      "secondaryHref": "/hoe-werkt-het"
    }
  },
  "loodgieter": {
    "path": "/loodgieter",
    "title": "Loodgieter nodig? Plaats je aanvraag via VakConnect",
    "description": "Van lekkage tot leidingwerk: lees wat een loodgieter doet, welke informatie je moet aanleveren en hoe VakConnect je koppelt aan een passende professional.",
    "keywords": [
      "loodgieter",
      "loodgieter",
      "vakman",
      "VakConnect"
    ],
    "h1": "Loodgieter nodig? Plaats je aanvraag via VakConnect",
    "intro": [
      "Bij water- of afvoerproblemen wil je snel weten wat urgent is en wat planbaar blijft.",
      "Via VakConnect kun je je loodgietersvraag volledig omschrijven, zodat een passende vakman gericht kan reageren.",
      "Deze pagina helpt je met diagnose-informatie, veelvoorkomende complicaties en praktische voorbereiding."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Loodgieter"
      }
    ],
    "sections": [
      {
        "heading": "Welke situaties om een loodgieter vragen",
        "paragraphs": [
          "Welke situaties om een loodgieter vragen: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij welke situaties om een loodgieter vragen tellen factoren zoals lekkage bij leiding of aansluiting, terugkerende verstopping, aanpassen van water- of afvoertraject en sanitair vervangen of verplaatsen mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond loodgieter concreet maken.",
          "Voor welke situaties om een loodgieter vragen beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "lekkage bij leiding of aansluiting",
          "terugkerende verstopping",
          "aanpassen van water- of afvoertraject",
          "sanitair vervangen of verplaatsen"
        ]
      },
      {
        "heading": "Hoe lekkage en verstopping worden beoordeeld",
        "paragraphs": [
          "Hoe lekkage en verstopping worden beoordeeld: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij hoe lekkage en verstopping worden beoordeeld tellen factoren zoals lokaliseren van lekpunten vóór herstel, oorzaak van verstoppingen in toestel of leidingtraject, combinatie van water, afvoer en ventilatie in natte ruimtes en bereikbaarheid van leidingen achter wanden, vloer of kruipruimte mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond loodgieter concreet maken.",
          "Voor hoe lekkage en verstopping worden beoordeeld beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "lokaliseren van lekpunten vóór herstel",
          "oorzaak van verstoppingen in toestel of leidingtraject",
          "combinatie van water, afvoer en ventilatie in natte ruimtes",
          "bereikbaarheid van leidingen achter wanden, vloer of kruipruimte"
        ]
      },
      {
        "heading": "Keuzes in herstel versus vervanging",
        "paragraphs": [
          "Keuzes in herstel versus vervanging: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij keuzes in herstel versus vervanging tellen factoren zoals noodmaatregel gevolgd door definitief herstel, deelvervanging of compleet leidingdeel vernieuwen, uitvoering tijdens bewoonde situatie of renovatiefase en combineren met badkamerrenovatie of keukenverbouwing mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond loodgieter concreet maken.",
          "Voor keuzes in herstel versus vervanging beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "noodmaatregel gevolgd door definitief herstel",
          "deelvervanging of compleet leidingdeel vernieuwen",
          "uitvoering tijdens bewoonde situatie of renovatiefase",
          "combineren met badkamerrenovatie of keukenverbouwing"
        ]
      },
      {
        "heading": "Leidingroutes, bereikbaarheid en voorbereiding",
        "paragraphs": [
          "Leidingroutes, bereikbaarheid en voorbereiding: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij leidingroutes, bereikbaarheid en voorbereiding tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond loodgieter concreet maken.",
          "Voor leidingroutes, bereikbaarheid en voorbereiding beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Combinatie met badkamer- of keukenwerk",
        "paragraphs": [
          "Combinatie met badkamer- of keukenwerk: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij combinatie met badkamer- of keukenwerk tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond loodgieter concreet maken.",
          "Voor combinatie met badkamer- of keukenwerk beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Planning bij spoed en niet-spoed",
        "paragraphs": [
          "Planning bij spoed en niet-spoed: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij planning bij spoed en niet-spoed tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond loodgieter concreet maken.",
          "Voor planning bij spoed en niet-spoed beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Risico’s van wachten bij waterproblemen",
        "paragraphs": [
          "Risico’s van wachten bij waterproblemen: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij risico’s van wachten bij waterproblemen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond loodgieter concreet maken.",
          "Voor risico’s van wachten bij waterproblemen beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "type": "warning"
      },
      {
        "heading": "Wat je in je aanvraag moet opnemen",
        "paragraphs": [
          "Wat je in je aanvraag moet opnemen: Een zorgvuldige beoordeling van dit onderdeel maakt offertes beter vergelijkbaar en realistischer.",
          "Bij wat je in je aanvraag moet opnemen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond loodgieter concreet maken.",
          "Voor wat je in je aanvraag moet opnemen beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "tijd voor diagnose en opsporing",
      "toegang tot leidingen en afvoertrajecten",
      "onderdelen zoals koppelingen, kranen of sifons",
      "extra werk bij openbreken en herstel van afwerking",
      "spoed, avond- of weekendinzet",
      "omvang van vervolgwerk na eerste reparatie"
    ],
    "processSteps": [
      "Beschrijf waar het probleem zit en wanneer het is begonnen.",
      "Noem of het probleem continu is of op specifieke momenten optreedt.",
      "VakConnect koppelt je aanvraag aan een loodgieter met passende diensten en regio.",
      "De specialist stemt vervolgens diagnose, aanpak en planning met je af."
    ],
    "relatedLinks": [
      {
        "href": "/loodgieter/lekkage",
        "title": "Loodgieter lekkage",
        "description": "Verdiep je in loodgieter lekkage en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/loodgieter/verstopping",
        "title": "Verstopping",
        "description": "Verdiep je in verstopping en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/loodgieter/leidingwerk",
        "title": "Leidingwerk",
        "description": "Verdiep je in leidingwerk en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/loodgieter/sanitair",
        "title": "Sanitair",
        "description": "Verdiep je in sanitair en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/loodgieter/spoed",
        "title": "Spoed loodgieter",
        "description": "Verdiep je in spoed loodgieter en ontdek wanneer deze subdienst past bij jouw situatie."
      }
    ],
    "faqs": [
      {
        "question": "Is elke lekkage meteen een spoedgeval?",
        "answer": "Niet elke lekkage is acuut, maar doorlopend vocht kan snel vervolgschade geven. Meld daarom altijd duidelijk hoe ernstig en actief de lekkage is."
      },
      {
        "question": "Waarom komt een verstopping terug?",
        "answer": "Terugkerende verstoppingen wijzen vaak op een dieper liggende oorzaak, zoals opbouw in het traject, beperkte helling of een knelpunt in de leiding."
      },
      {
        "question": "Kan leidingwerk zonder grote verbouwing worden aangepast?",
        "answer": "Soms wel, soms niet. Dat hangt af van route, toegankelijkheid en de gewenste nieuwe indeling."
      },
      {
        "question": "Welke informatie versnelt de beoordeling?",
        "answer": "Foto’s, locatie van het probleem, timing van klachten en eerdere reparaties helpen de vakman om sneller de juiste aanpak te bepalen."
      },
      {
        "question": "Voert VakConnect zelf loodgieterswerk uit?",
        "answer": "Nee, VakConnect voert het werk niet zelf uit en koppelt je aan een passende professional."
      }
    ],
    "cta": {
      "title": "Vind een passende loodgieter voor jouw klus",
      "description": "Beschrijf je loodgieter-klus op /aanvraag met duidelijke informatie over situatie, bereikbaarheid en planning voor een gerichte koppeling.",
      "label": "Plaats je loodgieter-aanvraag",
      "secondaryLabel": "Bekijk hoe VakConnect werkt",
      "secondaryHref": "/hoe-werkt-het"
    }
  },
  "elektricien": {
    "path": "/elektricien",
    "title": "Elektricien vinden voor veilige elektra via VakConnect",
    "description": "Voor groepenkast, storingen en uitbreidingen: ontdek welke keuzes belangrijk zijn en vraag via VakConnect een passende elektricien aan.",
    "keywords": [
      "elektricien",
      "elektricien",
      "vakman",
      "VakConnect"
    ],
    "h1": "Elektricien vinden voor veilige elektra via VakConnect",
    "intro": [
      "Elektra vraagt om vakkennis, veilige uitvoering en duidelijke informatie vooraf.",
      "Via VakConnect leg je storingen, uitbreidingen of vervangingsvragen vast voor een passende elektricien.",
      "Op deze pagina krijg je inzicht in keuzes rond capaciteit, veiligheid en uitvoerbaarheid."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Elektricien"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer een elektricien nodig is",
        "paragraphs": [
          "Wanneer een elektricien nodig is: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer een elektricien nodig is tellen factoren zoals uitvallende groepen of storingen, uitbreiden van stopcontacten en lichtpunten, voorbereiding op zwaardere apparatuur en vervangen of moderniseren van groepenkast mee, omdat ze de omvang en aanpak van elektrotechniek rond elektricien concreet maken.",
          "Voor wanneer een elektricien nodig is beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "uitvallende groepen of storingen",
          "uitbreiden van stopcontacten en lichtpunten",
          "voorbereiding op zwaardere apparatuur",
          "vervangen of moderniseren van groepenkast"
        ]
      },
      {
        "heading": "Veilige beoordeling van installatie en belasting",
        "paragraphs": [
          "Veilige beoordeling van installatie en belasting: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij veilige beoordeling van installatie en belasting tellen factoren zoals belasting en verdeling per groep, kwaliteit en ouderdom van bestaande bekabeling, verschil tussen 1-fase en 3-fase toepassingen en inspectie van beveiliging en aardingsvoorzieningen mee, omdat ze de omvang en aanpak van elektrotechniek rond elektricien concreet maken.",
          "Voor veilige beoordeling van installatie en belasting beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "belasting en verdeling per groep",
          "kwaliteit en ouderdom van bestaande bekabeling",
          "verschil tussen 1-fase en 3-fase toepassingen",
          "inspectie van beveiliging en aardingsvoorzieningen"
        ]
      },
      {
        "heading": "Uitbreiden of vervangen: hoe kies je",
        "paragraphs": [
          "Uitbreiden of vervangen: hoe kies je: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij uitbreiden of vervangen: hoe kies je tellen factoren zoals uitbreiden van bestaande kast of volledig vervangen, gefaseerde uitvoering per ruimte, combinatie met keuken- of zolderverbouwing en extra capaciteit reserveren voor toekomstige apparatuur mee, omdat ze de omvang en aanpak van elektrotechniek rond elektricien concreet maken.",
          "Voor uitbreiden of vervangen: hoe kies je beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "uitbreiden van bestaande kast of volledig vervangen",
          "gefaseerde uitvoering per ruimte",
          "combinatie met keuken- of zolderverbouwing",
          "extra capaciteit reserveren voor toekomstige apparatuur"
        ]
      },
      {
        "heading": "Aansluitpunten, groepen en toekomstig gebruik",
        "paragraphs": [
          "Aansluitpunten, groepen en toekomstig gebruik: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij aansluitpunten, groepen en toekomstig gebruik tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van elektrotechniek rond elektricien concreet maken.",
          "Voor aansluitpunten, groepen en toekomstig gebruik beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Planning met stroomonderbreking en bereikbaarheid",
        "paragraphs": [
          "Planning met stroomonderbreking en bereikbaarheid: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij planning met stroomonderbreking en bereikbaarheid tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van elektrotechniek rond elektricien concreet maken.",
          "Voor planning met stroomonderbreking en bereikbaarheid beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Combinatie met verbouwing en renovatie",
        "paragraphs": [
          "Combinatie met verbouwing en renovatie: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij combinatie met verbouwing en renovatie tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van elektrotechniek rond elektricien concreet maken.",
          "Voor combinatie met verbouwing en renovatie beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Waarom uitstel bij elektra onwenselijk is",
        "paragraphs": [
          "Waarom uitstel bij elektra onwenselijk is: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij waarom uitstel bij elektra onwenselijk is tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van elektrotechniek rond elektricien concreet maken.",
          "Voor waarom uitstel bij elektra onwenselijk is beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "type": "warning"
      },
      {
        "heading": "Welke intake-informatie cruciaal is",
        "paragraphs": [
          "Welke intake-informatie cruciaal is: Een zorgvuldige beoordeling van dit onderdeel maakt offertes beter vergelijkbaar en realistischer.",
          "Bij welke intake-informatie cruciaal is tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van elektrotechniek rond elektricien concreet maken.",
          "Voor welke intake-informatie cruciaal is beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "complexiteit van de bestaande installatie",
      "aantal nieuwe groepen of aansluitpunten",
      "kabelroutes door vloer, wand of plafond",
      "benodigde componenten en afwerking",
      "beschikbaarheid en planning van stroomonderbreking",
      "eventuele vervolgwerkzaamheden na diagnose"
    ],
    "processSteps": [
      "Omschrijf welke klacht of uitbreiding je hebt en wanneer die optreedt.",
      "Geef aan welke ruimtes of apparaten betrokken zijn.",
      "VakConnect koppelt je aanvraag aan een passende elektricien in je regio.",
      "De specialist beoordeelt daarna wat veilig en technisch passend is."
    ],
    "relatedLinks": [
      {
        "href": "/elektricien/groepenkast",
        "title": "Groepenkast",
        "description": "Verdiep je in groepenkast en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/elektricien/storing",
        "title": "Elektra storing",
        "description": "Verdiep je in elektra storing en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/elektricien/stopcontacten",
        "title": "Stopcontacten",
        "description": "Verdiep je in stopcontacten en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/elektricien/verlichting",
        "title": "Verlichting",
        "description": "Verdiep je in verlichting en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/elektricien/krachtstroom",
        "title": "Krachtstroom",
        "description": "Verdiep je in krachtstroom en ontdek wanneer deze subdienst past bij jouw situatie."
      }
    ],
    "faqs": [
      {
        "question": "Waarom is een goede intake bij elektra belangrijk?",
        "answer": "Omdat storingen meerdere oorzaken kunnen hebben en veiligheid voorop staat. Met concrete informatie kan een elektricien sneller bepalen welke controles eerst nodig zijn."
      },
      {
        "question": "Wanneer kies je voor uitbreiding in plaats van vervanging?",
        "answer": "Dat hangt af van de staat van de groepenkast, beschikbare ruimte, belasting en de gewenste toekomstbestendigheid."
      },
      {
        "question": "Is 3-fase altijd nodig voor nieuwe apparatuur?",
        "answer": "Nee, dat verschilt per apparaat en aansluiting. Laat dit beoordelen door een vakman."
      },
      {
        "question": "Kan ik zelf alvast onderdelen vervangen?",
        "answer": "Voor vaste elektrische installaties is dat niet verstandig. Gebruik de pagina voor oriëntatie en laat uitvoering aan een professional."
      },
      {
        "question": "Is VakConnect zelf installateur?",
        "answer": "Nee, VakConnect is een platform voor matching met passende specialisten."
      }
    ],
    "cta": {
      "title": "Vind een passende elektricien voor jouw klus",
      "description": "Beschrijf je elektricien-klus op /aanvraag met duidelijke informatie over situatie, bereikbaarheid en planning voor een gerichte koppeling.",
      "label": "Vind een passende elektricien",
      "secondaryLabel": "Bekijk hoe VakConnect werkt",
      "secondaryHref": "/hoe-werkt-het"
    }
  },
  "kozijnen": {
    "path": "/kozijnen",
    "title": "Kozijnen laten vervangen of onderhouden via VakConnect",
    "description": "Vergelijk kunststof, hout en aluminium kozijnen en ontdek hoe je een passende specialist vindt via VakConnect.",
    "keywords": [
      "kozijnen",
      "kozijnen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Kozijnen laten vervangen of onderhouden via VakConnect",
    "intro": [
      "Kozijnen hebben direct invloed op comfort, isolatie, onderhoud en uitstraling van je woning.",
      "Via VakConnect kun je vergelijken welke aanpak past: herstellen, gedeeltelijk vervangen of volledig vernieuwen.",
      "Deze pagina geeft je per stap inzicht in materiaalkeuzes, aandachtspunten en aanvraagvoorbereiding."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Kozijnen"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer kozijnproblemen om actie vragen",
        "paragraphs": [
          "Wanneer kozijnproblemen om actie vragen: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer kozijnproblemen om actie vragen tellen factoren zoals tocht of condens rond ramen, verouderde kozijnen met onderhoudsachterstand, combineren van kozijnwerk met HR-glas en vernieuwen van ramen en deuren bij renovatie mee, omdat ze de omvang en aanpak van kozijnwerk rond kozijnen concreet maken.",
          "Voor wanneer kozijnproblemen om actie vragen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "tocht of condens rond ramen",
          "verouderde kozijnen met onderhoudsachterstand",
          "combineren van kozijnwerk met HR-glas",
          "vernieuwen van ramen en deuren bij renovatie"
        ]
      },
      {
        "heading": "Technische beoordeling van kozijn en aansluiting",
        "paragraphs": [
          "Technische beoordeling van kozijn en aansluiting: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij technische beoordeling van kozijn en aansluiting tellen factoren zoals maatvoering en inmeting zijn bepalend voor pasvorm, aansluitdetails rond gevel en isolatieschil, hang- en sluitwerk voor gebruiksgemak en materiaalgedrag bij temperatuur en vocht mee, omdat ze de omvang en aanpak van kozijnwerk rond kozijnen concreet maken.",
          "Voor technische beoordeling van kozijn en aansluiting beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "maatvoering en inmeting zijn bepalend voor pasvorm",
          "aansluitdetails rond gevel en isolatieschil",
          "hang- en sluitwerk voor gebruiksgemak",
          "materiaalgedrag bij temperatuur en vocht"
        ]
      },
      {
        "heading": "Herstellen, vervangen of faseren",
        "paragraphs": [
          "Herstellen, vervangen of faseren: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij herstellen, vervangen of faseren tellen factoren zoals kunststof, hout of aluminium afhankelijk van wensen, per verdieping vervangen of in één project, herstel van delen versus volledige vervanging en combinatie met schilderwerk bij houten kozijnen mee, omdat ze de omvang en aanpak van kozijnwerk rond kozijnen concreet maken.",
          "Voor herstellen, vervangen of faseren beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "kunststof, hout of aluminium afhankelijk van wensen",
          "per verdieping vervangen of in één project",
          "herstel van delen versus volledige vervanging",
          "combinatie met schilderwerk bij houten kozijnen"
        ]
      },
      {
        "heading": "Materiaalkeuze: kunststof, hout of aluminium",
        "paragraphs": [
          "Materiaalkeuze: kunststof, hout of aluminium: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij materiaalkeuze: kunststof, hout of aluminium tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van kozijnwerk rond kozijnen concreet maken.",
          "Voor materiaalkeuze: kunststof, hout of aluminium beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Combineren met glas en afwerking",
        "paragraphs": [
          "Combineren met glas en afwerking: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij combineren met glas en afwerking tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van kozijnwerk rond kozijnen concreet maken.",
          "Voor combineren met glas en afwerking beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Planning en bereikbaarheid van montage",
        "paragraphs": [
          "Planning en bereikbaarheid van montage: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij planning en bereikbaarheid van montage tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van kozijnwerk rond kozijnen concreet maken.",
          "Voor planning en bereikbaarheid van montage beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Uitstel en oplopende onderhoudsdruk",
        "paragraphs": [
          "Uitstel en oplopende onderhoudsdruk: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij uitstel en oplopende onderhoudsdruk tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van kozijnwerk rond kozijnen concreet maken.",
          "Voor uitstel en oplopende onderhoudsdruk beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ],
        "type": "warning"
      },
      {
        "heading": "Hoe je je kozijnvraag helder aanvraagt",
        "paragraphs": [
          "Hoe je je kozijnvraag helder aanvraagt: Een zorgvuldige beoordeling van dit onderdeel maakt offertes beter vergelijkbaar en realistischer.",
          "Bij hoe je je kozijnvraag helder aanvraagt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van kozijnwerk rond kozijnen concreet maken.",
          "Voor hoe je je kozijnvraag helder aanvraagt beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "aantal kozijnen en afmetingen",
      "materiaaltype en profielkeuze",
      "glaskeuze en isolatiewaarde",
      "bereikbaarheid en steigerwerk",
      "afwerking aan binnen- en buitenzijde",
      "eventuele aanpassingen aan bestaande openingen"
    ],
    "processSteps": [
      "Beschrijf welke kozijnen klachten geven of vervangen moeten worden.",
      "Noem materiaalvoorkeuren en of je ook glas wilt meenemen.",
      "VakConnect koppelt je aanvraag aan een specialist die bij de klus past.",
      "Daarna volgt afstemming over inmeting, planning en uitvoering."
    ],
    "relatedLinks": [
      {
        "href": "/kozijnen/kunststof-kozijnen",
        "title": "Kunststof kozijnen",
        "description": "Verdiep je in kunststof kozijnen en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/kozijnen/houten-kozijnen",
        "title": "Houten kozijnen",
        "description": "Verdiep je in houten kozijnen en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/kozijnen/aluminium-kozijnen",
        "title": "Aluminium kozijnen",
        "description": "Verdiep je in aluminium kozijnen en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/kozijnen/kozijnen-vervangen",
        "title": "Kozijnen vervangen",
        "description": "Verdiep je in kozijnen vervangen en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/kozijnen/ramen-en-deuren",
        "title": "Ramen en deuren",
        "description": "Verdiep je in ramen en deuren en ontdek wanneer deze subdienst past bij jouw situatie."
      }
    ],
    "faqs": [
      {
        "question": "Wanneer is vervangen logischer dan herstellen?",
        "answer": "Bij terugkerende klachten, structurele slijtage of oplopende onderhoudskosten is vervanging vaak logischer dan nogmaals lokaal herstel."
      },
      {
        "question": "Wat is het voordeel van materiaalvergelijking vooraf?",
        "answer": "Je voorkomt dat alleen op prijs wordt gekozen en kunt beter afwegen op onderhoud, uitstraling, isolatie en levensduur."
      },
      {
        "question": "Kan ik kozijnwerk combineren met ander onderhoud?",
        "answer": "Ja, bijvoorbeeld met schilderwerk, gevelwerk of renovatie van ramen en deuren."
      },
      {
        "question": "Hoe belangrijk is inmeting voor de uiteindelijke kwaliteit?",
        "answer": "Zeer belangrijk. Kleine afwijkingen hebben direct invloed op sluiting, tocht en afwerking."
      },
      {
        "question": "Voert VakConnect het montagewerk zelf uit?",
        "answer": "Nee, VakConnect koppelt je aan een passende aangesloten specialist."
      }
    ],
    "cta": {
      "title": "Vind een passende kozijnen voor jouw klus",
      "description": "Beschrijf je kozijnen-klus op /aanvraag met duidelijke informatie over situatie, bereikbaarheid en planning voor een gerichte koppeling.",
      "label": "Start je kozijnen-aanvraag",
      "secondaryLabel": "Bekijk hoe VakConnect werkt",
      "secondaryHref": "/hoe-werkt-het"
    }
  },
  "badkamer": {
    "path": "/badkamer",
    "title": "Badkamer vernieuwen? Vind een passende specialist via VakConnect",
    "description": "Krijg grip op badkamerrenovatie: van indeling en installaties tot planning en kostenfactoren via VakConnect.",
    "keywords": [
      "badkamer",
      "badkamer",
      "vakman",
      "VakConnect"
    ],
    "h1": "Badkamer vernieuwen? Vind een passende specialist via VakConnect",
    "intro": [
      "Een badkamerklus raakt vaak meerdere disciplines tegelijk: sanitair, tegelwerk, leidingwerk, elektra en ventilatie.",
      "Via VakConnect zet je dat overzichtelijk in één aanvraag zodat een passende specialist gericht kan beoordelen.",
      "Hier lees je hoe je van losse wensen naar een uitvoerbaar renovatieplan gaat."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Badkamer"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer een badkamerproject start",
        "paragraphs": [
          "Wanneer een badkamerproject start: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer een badkamerproject start tellen factoren zoals gedeeltelijke opfrisbeurt, complete badkamerrenovatie, ombouwen naar inloopdouche en combineren van sanitair, tegelwerk en ventilatie mee, omdat ze de omvang en aanpak van badkamerwerk rond badkamer concreet maken.",
          "Voor wanneer een badkamerproject start beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "gedeeltelijke opfrisbeurt",
          "complete badkamerrenovatie",
          "ombouwen naar inloopdouche",
          "combineren van sanitair, tegelwerk en ventilatie"
        ]
      },
      {
        "heading": "Techniek eerst: water, afvoer, elektra en ventilatie",
        "paragraphs": [
          "Techniek eerst: water, afvoer, elektra en ventilatie: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij techniek eerst: water, afvoer, elektra en ventilatie tellen factoren zoals water- en afvoerpunten bepalen de speelruimte, elektra en verlichting vragen vroegtijdige afstemming, ventilatie is essentieel in natte ruimtes en tegel- en kitdetails bepalen onderhoud en levensduur mee, omdat ze de omvang en aanpak van badkamerwerk rond badkamer concreet maken.",
          "Voor techniek eerst: water, afvoer, elektra en ventilatie beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "water- en afvoerpunten bepalen de speelruimte",
          "elektra en verlichting vragen vroegtijdige afstemming",
          "ventilatie is essentieel in natte ruimtes",
          "tegel- en kitdetails bepalen onderhoud en levensduur"
        ]
      },
      {
        "heading": "Indeling en scope: deelrenovatie of totaal",
        "paragraphs": [
          "Indeling en scope: deelrenovatie of totaal: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij indeling en scope: deelrenovatie of totaal tellen factoren zoals renovatie in één keer of gefaseerd, bestaande indeling houden of aanpassen, standaard sanitair of maatwerkoplossingen en combinatie met leidingwerk en elektra-upgrades mee, omdat ze de omvang en aanpak van badkamerwerk rond badkamer concreet maken.",
          "Voor indeling en scope: deelrenovatie of totaal beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "renovatie in één keer of gefaseerd",
          "bestaande indeling houden of aanpassen",
          "standaard sanitair of maatwerkoplossingen",
          "combinatie met leidingwerk en elektra-upgrades"
        ]
      },
      {
        "heading": "Voorbereiding vóór sloop en opbouw",
        "paragraphs": [
          "Voorbereiding vóór sloop en opbouw: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij voorbereiding vóór sloop en opbouw tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van badkamerwerk rond badkamer concreet maken.",
          "Voor voorbereiding vóór sloop en opbouw beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Samenloop tussen disciplines",
        "paragraphs": [
          "Samenloop tussen disciplines: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij samenloop tussen disciplines tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van badkamerwerk rond badkamer concreet maken.",
          "Voor samenloop tussen disciplines beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Planning van ruwbouw naar afwerking",
        "paragraphs": [
          "Planning van ruwbouw naar afwerking: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij planning van ruwbouw naar afwerking tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van badkamerwerk rond badkamer concreet maken.",
          "Voor planning van ruwbouw naar afwerking beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wat uitstel doet bij vocht en slijtage",
        "paragraphs": [
          "Wat uitstel doet bij vocht en slijtage: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij wat uitstel doet bij vocht en slijtage tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van badkamerwerk rond badkamer concreet maken.",
          "Voor wat uitstel doet bij vocht en slijtage beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "type": "warning"
      },
      {
        "heading": "Welke aanvraaginformatie het verschil maakt",
        "paragraphs": [
          "Welke aanvraaginformatie het verschil maakt: Een zorgvuldige beoordeling van dit onderdeel maakt offertes beter vergelijkbaar en realistischer.",
          "Bij welke aanvraaginformatie het verschil maakt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van badkamerwerk rond badkamer concreet maken.",
          "Voor welke aanvraaginformatie het verschil maakt beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "sloop en afvoer van bestaand materiaal",
      "leidingwerk verleggen voor nieuwe indeling",
      "tegeloppervlak en gekozen afwerking",
      "sanitair, kranen en douche-oplossingen",
      "elektra, ventilatie en extra voorzieningen",
      "planning tussen meerdere disciplines"
    ],
    "processSteps": [
      "Beschrijf je huidige badkamer en je belangrijkste verbeterwensen.",
      "Noem welke onderdelen zeker mee moeten: sanitair, tegels, ventilatie of indeling.",
      "VakConnect koppelt je aanvraag aan een passende specialist of combinatie van vakgebieden.",
      "Daarna volgt afstemming over technische haalbaarheid en planning."
    ],
    "relatedLinks": [
      {
        "href": "/badkamer/renovatie",
        "title": "Badkamerrenovatie",
        "description": "Verdiep je in badkamerrenovatie en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/badkamer/tegelen",
        "title": "Badkamer tegelen",
        "description": "Verdiep je in badkamer tegelen en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/badkamer/sanitair",
        "title": "Badkamer sanitair",
        "description": "Verdiep je in badkamer sanitair en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/badkamer/inloopdouche",
        "title": "Inloopdouche",
        "description": "Verdiep je in inloopdouche en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/badkamer/complete-badkamer",
        "title": "Complete badkamer",
        "description": "Verdiep je in complete badkamer en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/badkamer/ventilatie",
        "title": "Badkamerventilatie",
        "description": "Verdiep je in badkamerventilatie en ontdek wanneer deze subdienst past bij jouw situatie."
      }
    ],
    "faqs": [
      {
        "question": "Moet ik mijn volledige ontwerp al klaar hebben?",
        "answer": "Nee. Een heldere omschrijving van huidige situatie, wensen en prioriteiten is voldoende om gericht te starten."
      },
      {
        "question": "Waarom is planning tussen disciplines zo belangrijk?",
        "answer": "Omdat loodgieterswerk, elektra, tegelwerk en afwerking elkaar direct opvolgen. Goede volgorde voorkomt dubbel werk en uitloop."
      },
      {
        "question": "Is ventilatie echt zo bepalend?",
        "answer": "Ja. Onvoldoende ventilatie vergroot kans op vochtproblemen, schimmel en snellere slijtage van afwerking."
      },
      {
        "question": "Wanneer combineer ik badkamerwerk met andere woningklussen?",
        "answer": "Dat is vaak logisch bij grotere renovaties, bijvoorbeeld wanneer leidingwerk of groepenkast toch wordt aangepast."
      },
      {
        "question": "Voert VakConnect de renovatie zelf uit?",
        "answer": "Nee, VakConnect koppelt je aan passende aangesloten professionals."
      }
    ],
    "cta": {
      "title": "Vind een passende badkamer voor jouw klus",
      "description": "Beschrijf je badkamer-klus op /aanvraag met duidelijke informatie over situatie, bereikbaarheid en planning voor een gerichte koppeling.",
      "label": "Beschrijf je badkamerklus",
      "secondaryLabel": "Bekijk hoe VakConnect werkt",
      "secondaryHref": "/hoe-werkt-het"
    }
  },
  "isolatie": {
    "path": "/isolatie",
    "title": "Isolatie specialist vinden via VakConnect",
    "description": "Voor dak-, vloer-, spouw- en gevelisolatie: vergelijk situaties, keuzes en aandachtspunten en vind een passende specialist via VakConnect.",
    "keywords": [
      "isolatie",
      "isolatie",
      "vakman",
      "VakConnect"
    ],
    "h1": "Isolatie specialist vinden via VakConnect",
    "intro": [
      "Isolatievragen beginnen meestal bij comfortklachten of oplopend energieverlies in specifieke ruimtes.",
      "Via VakConnect kun je je woningtype en situatie beschrijven om een passende isolatiespecialist te vinden.",
      "Op deze pagina zie je welke keuzes technisch logisch zijn per bouwdeel."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Isolatie"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer isolatie prioriteit krijgt",
        "paragraphs": [
          "Wanneer isolatie prioriteit krijgt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer isolatie prioriteit krijgt tellen factoren zoals koud aanvoelende ruimtes, hoge energievraag ondanks normaal gebruik, renovatie waarbij bouwdelen open gaan en stapsgewijs verduurzamen per woningdeel mee, omdat ze de omvang en aanpak van isolatiewerk rond isolatie concreet maken.",
          "Voor wanneer isolatie prioriteit krijgt beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "koud aanvoelende ruimtes",
          "hoge energievraag ondanks normaal gebruik",
          "renovatie waarbij bouwdelen open gaan",
          "stapsgewijs verduurzamen per woningdeel"
        ]
      },
      {
        "heading": "Eerste beoordeling van bouwdeel en vochtgedrag",
        "paragraphs": [
          "Eerste beoordeling van bouwdeel en vochtgedrag: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij eerste beoordeling van bouwdeel en vochtgedrag tellen factoren zoals elk bouwdeel vraagt een andere isolatiestrategie, vochtgedrag en ventilatie moeten worden meegewogen, aansluitingen en koudebruggen bepalen het eindresultaat en bestaande constructie begrenst soms de materiaalkeuze mee, omdat ze de omvang en aanpak van isolatiewerk rond isolatie concreet maken.",
          "Voor eerste beoordeling van bouwdeel en vochtgedrag beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "elk bouwdeel vraagt een andere isolatiestrategie",
          "vochtgedrag en ventilatie moeten worden meegewogen",
          "aansluitingen en koudebruggen bepalen het eindresultaat",
          "bestaande constructie begrenst soms de materiaalkeuze"
        ]
      },
      {
        "heading": "Keuzes in methode en materiaal",
        "paragraphs": [
          "Keuzes in methode en materiaal: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij keuzes in methode en materiaal tellen factoren zoals starten met grootste warmteverlies, isoleren per deel of gecombineerd project, binnen- of buitenzijde afhankelijk van bouwsituatie en combinatie met kozijnen of dakwerk mee, omdat ze de omvang en aanpak van isolatiewerk rond isolatie concreet maken.",
          "Voor keuzes in methode en materiaal beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "starten met grootste warmteverlies",
          "isoleren per deel of gecombineerd project",
          "binnen- of buitenzijde afhankelijk van bouwsituatie",
          "combinatie met kozijnen of dakwerk"
        ]
      },
      {
        "heading": "Stapsgewijs verbeteren of integraal aanpakken",
        "paragraphs": [
          "Stapsgewijs verbeteren of integraal aanpakken: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij stapsgewijs verbeteren of integraal aanpakken tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van isolatiewerk rond isolatie concreet maken.",
          "Voor stapsgewijs verbeteren of integraal aanpakken beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Combinatie met dak, gevel of kozijnen",
        "paragraphs": [
          "Combinatie met dak, gevel of kozijnen: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij combinatie met dak, gevel of kozijnen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van isolatiewerk rond isolatie concreet maken.",
          "Voor combinatie met dak, gevel of kozijnen beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Planning en uitvoeringsmoment",
        "paragraphs": [
          "Planning en uitvoeringsmoment: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij planning en uitvoeringsmoment tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van isolatiewerk rond isolatie concreet maken.",
          "Voor planning en uitvoeringsmoment beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en verbruik",
        "paragraphs": [
          "Wat uitstel betekent voor comfort en verbruik: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij wat uitstel betekent voor comfort en verbruik tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van isolatiewerk rond isolatie concreet maken.",
          "Voor wat uitstel betekent voor comfort en verbruik beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ],
        "type": "warning"
      },
      {
        "heading": "Inhoud die je aanvraag sterker maakt",
        "paragraphs": [
          "Inhoud die je aanvraag sterker maakt: Een zorgvuldige beoordeling van dit onderdeel maakt offertes beter vergelijkbaar en realistischer.",
          "Bij inhoud die je aanvraag sterker maakt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van isolatiewerk rond isolatie concreet maken.",
          "Voor inhoud die je aanvraag sterker maakt beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "te isoleren oppervlak en toegankelijkheid",
      "materiaalkeuze en gewenste isolatiewaarde",
      "voorwerk aan bestaande constructie",
      "afwerking van aansluitingen",
      "fasering over meerdere bouwdelen",
      "combinatie met andere renovatiewerkzaamheden"
    ],
    "processSteps": [
      "Omschrijf welke ruimtes het koudst aanvoelen en welke bouwdelen je wilt verbeteren.",
      "Geef aan of het om losse maatregel of bredere renovatie gaat.",
      "VakConnect koppelt je aanvraag aan een specialist voor het juiste isolatietype.",
      "Daarna volgt beoordeling van haalbaarheid, planning en uitvoering."
    ],
    "relatedLinks": [
      {
        "href": "/isolatie/dakisolatie",
        "title": "Dakisolatie",
        "description": "Verdiep je in dakisolatie en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/isolatie/spouwmuurisolatie",
        "title": "Spouwmuurisolatie",
        "description": "Verdiep je in spouwmuurisolatie en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/isolatie/vloerisolatie",
        "title": "Vloerisolatie",
        "description": "Verdiep je in vloerisolatie en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/isolatie/gevelisolatie",
        "title": "Gevelisolatie",
        "description": "Verdiep je in gevelisolatie en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/isolatie/kruipruimte-isolatie",
        "title": "Kruipruimte isolatie",
        "description": "Verdiep je in kruipruimte isolatie en ontdek wanneer deze subdienst past bij jouw situatie."
      }
    ],
    "faqs": [
      {
        "question": "Welke isolatiemaatregel levert het meeste op?",
        "answer": "Dat verschilt per woning. De grootste winst zit vaak in het bouwdeel met het hoogste warmteverlies, maar dat moet per situatie worden beoordeeld."
      },
      {
        "question": "Waarom hoort ventilatie bij isolatiekeuzes?",
        "answer": "Omdat beter isoleren zonder goede ventilatie vochtproblemen kan versterken. Beide onderwerpen moeten in samenhang worden bekeken."
      },
      {
        "question": "Kan ik isolatie combineren met andere klussen?",
        "answer": "Ja, dat is vaak efficiënt, bijvoorbeeld bij dakrenovatie of kozijnvervanging."
      },
      {
        "question": "Zijn vaste besparingsbedragen betrouwbaar?",
        "answer": "Niet als algemene belofte. Resultaten verschillen per woning, gebruik en gekozen uitvoering."
      },
      {
        "question": "Doet VakConnect de isolatie zelf?",
        "answer": "Nee, VakConnect koppelt je aan een passende specialist."
      }
    ],
    "cta": {
      "title": "Vind een passende isolatie voor jouw klus",
      "description": "Beschrijf je isolatie-klus op /aanvraag met duidelijke informatie over situatie, bereikbaarheid en planning voor een gerichte koppeling.",
      "label": "Vind een isolatiespecialist",
      "secondaryLabel": "Bekijk hoe VakConnect werkt",
      "secondaryHref": "/hoe-werkt-het"
    }
  },
  "verbouwing": {
    "path": "/verbouwing",
    "title": "Verbouwing plannen? Vind een passende specialist via VakConnect",
    "description": "Van aanbouw tot zolderverbouwing: krijg grip op keuzes, volgorde en risico’s en start je verbouwingsaanvraag via VakConnect.",
    "keywords": [
      "verbouwing",
      "verbouwing",
      "vakman",
      "VakConnect"
    ],
    "h1": "Verbouwing plannen? Vind een passende specialist via VakConnect",
    "intro": [
      "Bij verbouwingen draait veel om volgorde: eerst helder scope bepalen, dan technisch en praktisch uitwerken.",
      "Via VakConnect beschrijf je je project zodat een passende specialist of discipline snel kan inschatten wat nodig is.",
      "Deze pagina helpt je met realistische verwachtingen rond planning, kostenfactoren en combinatieklussen."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Verbouwing"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer verbouwen logisch wordt",
        "paragraphs": [
          "Wanneer verbouwen logisch wordt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer verbouwen logisch wordt tellen factoren zoals ruimtegebrek oplossen, verouderde woningdelen vernieuwen, keuken of zolder functioneel herindelen en renovatie combineren met verduurzaming mee, omdat ze de omvang en aanpak van verbouwwerk rond verbouwing concreet maken.",
          "Voor wanneer verbouwen logisch wordt beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "ruimtegebrek oplossen",
          "verouderde woningdelen vernieuwen",
          "keuken of zolder functioneel herindelen",
          "renovatie combineren met verduurzaming"
        ]
      },
      {
        "heading": "Haalbaarheid en technische randvoorwaarden",
        "paragraphs": [
          "Haalbaarheid en technische randvoorwaarden: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij haalbaarheid en technische randvoorwaarden tellen factoren zoals volgorde van disciplines bepaalt voortgang, constructieve ingrepen vragen aanvullende beoordeling, installatiewerk en afbouw moeten op elkaar aansluiten en bereikbaarheid en logistiek op locatie sturen de planning mee, omdat ze de omvang en aanpak van verbouwwerk rond verbouwing concreet maken.",
          "Voor haalbaarheid en technische randvoorwaarden beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "volgorde van disciplines bepaalt voortgang",
          "constructieve ingrepen vragen aanvullende beoordeling",
          "installatiewerk en afbouw moeten op elkaar aansluiten",
          "bereikbaarheid en logistiek op locatie sturen de planning"
        ]
      },
      {
        "heading": "Scope en fasering bepalen",
        "paragraphs": [
          "Scope en fasering bepalen: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij scope en fasering bepalen tellen factoren zoals deelverbouwing of totaalrenovatie, gefaseerd werken per ruimte, combineren met isolatie en kozijnwerk en tijdelijke maatregelen tijdens bewoonde verbouwing mee, omdat ze de omvang en aanpak van verbouwwerk rond verbouwing concreet maken.",
          "Voor scope en fasering bepalen beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "deelverbouwing of totaalrenovatie",
          "gefaseerd werken per ruimte",
          "combineren met isolatie en kozijnwerk",
          "tijdelijke maatregelen tijdens bewoonde verbouwing"
        ]
      },
      {
        "heading": "Combinatie met installaties en afwerking",
        "paragraphs": [
          "Combinatie met installaties en afwerking: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij combinatie met installaties en afwerking tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van verbouwwerk rond verbouwing concreet maken.",
          "Voor combinatie met installaties en afwerking beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Planning in een bewoonde woning",
        "paragraphs": [
          "Planning in een bewoonde woning: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij planning in een bewoonde woning tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van verbouwwerk rond verbouwing concreet maken.",
          "Voor planning in een bewoonde woning beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Risico’s en onvoorziene punten",
        "paragraphs": [
          "Risico’s en onvoorziene punten: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij risico’s en onvoorziene punten tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van verbouwwerk rond verbouwing concreet maken.",
          "Voor risico’s en onvoorziene punten beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wanneer aanvullende beoordeling nodig is",
        "paragraphs": [
          "Wanneer aanvullende beoordeling nodig is: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij wanneer aanvullende beoordeling nodig is tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van verbouwwerk rond verbouwing concreet maken.",
          "Voor wanneer aanvullende beoordeling nodig is beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ],
        "type": "warning"
      },
      {
        "heading": "Welke projectdetails je aanvraag compleet maken",
        "paragraphs": [
          "Welke projectdetails je aanvraag compleet maken: Een zorgvuldige beoordeling van dit onderdeel maakt offertes beter vergelijkbaar en realistischer.",
          "Bij welke projectdetails je aanvraag compleet maken tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van verbouwwerk rond verbouwing concreet maken.",
          "Voor welke projectdetails je aanvraag compleet maken beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "omvang van bouwkundige aanpassingen",
      "keuze van afwerkingsniveau en materialen",
      "coördinatie tussen meerdere vakgebieden",
      "bereikbaarheid en afvoer van bouwafval",
      "eventuele voorbereidende onderzoeken",
      "ruimte voor onvoorziene omstandigheden"
    ],
    "processSteps": [
      "Omschrijf wat je wilt veranderen en waarom nu.",
      "Noem welke ruimtes, functies en prioriteiten centraal staan.",
      "VakConnect koppelt je aanvraag aan een passende specialist of uitvoerende discipline.",
      "Na eerste beoordeling volgt afstemming over fasering, planning en aanpak."
    ],
    "relatedLinks": [
      {
        "href": "/verbouwing/aanbouw",
        "title": "Aanbouw",
        "description": "Verdiep je in aanbouw en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/verbouwing/uitbouw",
        "title": "Uitbouw",
        "description": "Verdiep je in uitbouw en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/verbouwing/zolder-verbouwen",
        "title": "Zolder verbouwen",
        "description": "Verdiep je in zolder verbouwen en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/verbouwing/woning-renoveren",
        "title": "Woning renoveren",
        "description": "Verdiep je in woning renoveren en ontdek wanneer deze subdienst past bij jouw situatie."
      },
      {
        "href": "/verbouwing/keuken-verbouwen",
        "title": "Keuken verbouwen",
        "description": "Verdiep je in keuken verbouwen en ontdek wanneer deze subdienst past bij jouw situatie."
      }
    ],
    "faqs": [
      {
        "question": "Wanneer is een constructieve beoordeling nodig?",
        "answer": "Bij ingrepen zoals draagmuurwijzigingen, grote openingen of aanpassingen aan dragende delen is aanvullende constructieve beoordeling vaak verstandig of vereist."
      },
      {
        "question": "Waarom loopt een verbouwing soms uit?",
        "answer": "Uitloop ontstaat vaak door onduidelijke scope, onderschatte voorbereidende werkzaamheden of onverwachte situaties in de bestaande bouw."
      },
      {
        "question": "Kan ik in mijn woning blijven tijdens verbouwing?",
        "answer": "Dat hangt af van de aard van de werkzaamheden en de volgorde van uitvoering."
      },
      {
        "question": "Is gefaseerd verbouwen altijd goedkoper?",
        "answer": "Niet altijd. Gefaseerd werken kan prettig zijn, maar brengt soms extra opstart- en afstemmomenten mee."
      },
      {
        "question": "Voert VakConnect zelf verbouwingswerk uit?",
        "answer": "Nee, VakConnect koppelt je aan passende aangesloten professionals."
      }
    ],
    "cta": {
      "title": "Vind een passende verbouwing voor jouw klus",
      "description": "Beschrijf je verbouwing-klus op /aanvraag met duidelijke informatie over situatie, bereikbaarheid en planning voor een gerichte koppeling.",
      "label": "Start je verbouwingsaanvraag",
      "secondaryLabel": "Bekijk hoe VakConnect werkt",
      "secondaryHref": "/hoe-werkt-het"
    }
  }
} satisfies Record<string, ServiceContentPageData>;

const rawServiceSubPages = {
  "dakdekker/daklekkage": {
    "path": "/dakdekker/daklekkage",
    "title": "Daklekkage via VakConnect",
    "description": "Herken signalen van daklekkage, begrijp de meest voorkomende oorzaken en vraag via VakConnect gericht hulp aan.",
    "keywords": [
      "dakdekker",
      "daklekkage",
      "vakman",
      "VakConnect"
    ],
    "h1": "Daklekkage: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij daklekkage? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Dakdekker",
        "href": "/dakdekker"
      },
      {
        "label": "Daklekkage"
      }
    ],
    "sections": [
      {
        "heading": "Waar komt daklekkage vaak vandaan?",
        "paragraphs": [
          "Waar komt daklekkage vaak vandaan?: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij waar komt daklekkage vaak vandaan? tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond daklekkage concreet maken.",
          "Voor waar komt daklekkage vaak vandaan? beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — daklekkage",
        "paragraphs": [
          "Signalen die vaak wijzen op dakproblemen — daklekkage: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen die vaak wijzen op dakproblemen — daklekkage tellen factoren zoals donkere plekken op plafond of zoldervloer, waterdruppels bij langdurige regen, muffe geur of nat isolatiemateriaal en vochtsporen rond schoorsteen, dakkapel of doorvoeren mee, omdat ze de omvang en aanpak van dakwerk rond daklekkage concreet maken.",
          "Voor signalen die vaak wijzen op dakproblemen — daklekkage beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "donkere plekken op plafond of zoldervloer",
          "waterdruppels bij langdurige regen",
          "muffe geur of nat isolatiemateriaal",
          "vochtsporen rond schoorsteen, dakkapel of doorvoeren"
        ]
      },
      {
        "heading": "Waardoor dit probleem meestal ontstaat — daklekkage",
        "paragraphs": [
          "Waardoor dit probleem meestal ontstaat — daklekkage: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij waardoor dit probleem meestal ontstaat — daklekkage tellen factoren zoals beschadigde pannen of scheuren in dakbedekking, versleten lood- of kitdetails bij aansluitingen, verstopte afvoer op platte daken en windbelasting waardoor details zijn losgekomen mee, omdat ze de omvang en aanpak van dakwerk rond daklekkage concreet maken.",
          "Voor waardoor dit probleem meestal ontstaat — daklekkage beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "beschadigde pannen of scheuren in dakbedekking",
          "versleten lood- of kitdetails bij aansluitingen",
          "verstopte afvoer op platte daken",
          "windbelasting waardoor details zijn losgekomen"
        ]
      },
      {
        "heading": "Wat een dakdekker meestal eerst controleert (daklekkage) — daklekkage",
        "paragraphs": [
          "Wat een dakdekker meestal eerst controleert (daklekkage) — daklekkage: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een dakdekker meestal eerst controleert (daklekkage) — daklekkage tellen factoren zoals de bron lokaliseren met inspectie van dakvlak en details, inschatten of noodherstel nodig is om directe schade te beperken, definitief herstel plannen op basis van oorzaak en controleren of onderliggende constructie droog en stabiel blijft mee, omdat ze de omvang en aanpak van dakwerk rond daklekkage concreet maken.",
          "Voor wat een dakdekker meestal eerst controleert (daklekkage) — daklekkage beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "de bron lokaliseren met inspectie van dakvlak en details",
          "inschatten of noodherstel nodig is om directe schade te beperken",
          "definitief herstel plannen op basis van oorzaak",
          "controleren of onderliggende constructie droog en stabiel blijft"
        ]
      },
      {
        "heading": "Keuzes in herstel: lokaal, deels of breder — daklekkage",
        "paragraphs": [
          "Keuzes in herstel: lokaal, deels of breder — daklekkage: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in herstel: lokaal, deels of breder — daklekkage tellen factoren zoals noodmaatregel bij actieve lekkage versus planmatig definitief herstel, lokale reparatie of grotere aanpak bij brede slijtage en combinatie met dakinspectie of renovatie als meerdere zwakke punten zichtbaar zijn mee, omdat ze de omvang en aanpak van dakwerk rond daklekkage concreet maken.",
          "Voor keuzes in herstel: lokaal, deels of breder — daklekkage beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "noodmaatregel bij actieve lekkage versus planmatig definitief herstel",
          "lokale reparatie of grotere aanpak bij brede slijtage",
          "combinatie met dakinspectie of renovatie als meerdere zwakke punten zichtbaar zijn"
        ]
      },
      {
        "heading": "Welke informatie je in je aanvraag moet zetten — daklekkage",
        "paragraphs": [
          "Welke informatie je in je aanvraag moet zetten — daklekkage: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke informatie je in je aanvraag moet zetten — daklekkage tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond daklekkage concreet maken.",
          "Voor welke informatie je in je aanvraag moet zetten — daklekkage beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — daklekkage",
        "paragraphs": [
          "Gevolgen van uitstel en wanneer sneller handelen verstandig is — daklekkage: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij gevolgen van uitstel en wanneer sneller handelen verstandig is — daklekkage tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond daklekkage concreet maken.",
          "Voor gevolgen van uitstel en wanneer sneller handelen verstandig is — daklekkage beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "type": "warning"
      },
      {
        "heading": "Planning, bereikbaarheid en afstemming op locatie — daklekkage",
        "paragraphs": [
          "Planning, bereikbaarheid en afstemming op locatie — daklekkage: Een zorgvuldige beoordeling van dit onderdeel maakt offertes beter vergelijkbaar en realistischer.",
          "Bij planning, bereikbaarheid en afstemming op locatie — daklekkage tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond daklekkage concreet maken.",
          "Voor planning, bereikbaarheid en afstemming op locatie — daklekkage beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "tijd voor lekdetectie en inspectie",
      "daktype en hoogte",
      "toegankelijkheid van het lekpunt",
      "omvang van natte of beschadigde delen",
      "spoedinzet en tijdelijke voorzieningen"
    ],
    "processSteps": [
      "Beschrijf je vraag rond daklekkage en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende dakdekker-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/dakdekker",
        "title": "Dakdekker",
        "description": "Bekijk ook dakdekker voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/dakdekker/plat-dak",
        "title": "Plat dak",
        "description": "Bekijk ook plat dak voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/dakdekker/schoorsteen",
        "title": "Schoorsteen",
        "description": "Bekijk ook schoorsteen voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/dakdekker/dakinspectie",
        "title": "Dakinspectie",
        "description": "Bekijk ook dakinspectie voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Moet ik wachten tot het droog is voor een aanvraag?",
        "answer": "Nee. Juist informatie over wanneer het lekt helpt om de oorzaak sneller te herkennen."
      },
      {
        "question": "Is lekkage altijd zichtbaar op de plek van het probleem?",
        "answer": "Niet altijd. Water kan via constructiedelen verplaatsen waardoor de zichtbare plek afwijkt van het lekpunt."
      },
      {
        "question": "Kan één reparatie voldoende zijn?",
        "answer": "Dat hangt af van de staat van omliggende details. Soms is aanvullend herstel nodig om herhaling te voorkomen."
      },
      {
        "question": "Welke gegevens zijn onmisbaar in mijn aanvraag?",
        "answer": "Vermeld daktype, locatie van vochtsporen, timing van de lekkage en voeg foto’s toe als dat veilig kan."
      },
      {
        "question": "Voert VakConnect zelf herstel uit?",
        "answer": "Nee, VakConnect koppelt je aan een passende dakprofessional."
      }
    ],
    "cta": {
      "title": "Beschrijf je daklekkage-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over daklekkage, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Plaats je aanvraag voor daklekkage",
      "secondaryLabel": "Terug naar dakdekker",
      "secondaryHref": "/dakdekker"
    }
  },
  "dakdekker/dakrenovatie": {
    "path": "/dakdekker/dakrenovatie",
    "title": "Dakrenovatie via VakConnect",
    "description": "Overweeg je dakrenovatie? Lees wanneer renovatie logisch is, welke keuzes je hebt en hoe je je aanvraag goed voorbereidt.",
    "keywords": [
      "dakdekker",
      "dakrenovatie",
      "vakman",
      "VakConnect"
    ],
    "h1": "Dakrenovatie: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij dakrenovatie? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Dakdekker",
        "href": "/dakdekker"
      },
      {
        "label": "Dakrenovatie"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer renovatie logischer is dan blijven repareren",
        "paragraphs": [
          "Wanneer renovatie logischer is dan blijven repareren: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer renovatie logischer is dan blijven repareren tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond dakrenovatie concreet maken.",
          "Voor wanneer renovatie logischer is dan blijven repareren beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — dakrenovatie",
        "paragraphs": [
          "Signalen die vaak wijzen op dakproblemen — dakrenovatie: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen die vaak wijzen op dakproblemen — dakrenovatie tellen factoren zoals terugkerende lekkages op meerdere plekken, zichtbare veroudering van dakmateriaal, oplopende onderhoudsfrequentie en comfortverlies door koude of vochtproblemen mee, omdat ze de omvang en aanpak van dakwerk rond dakrenovatie concreet maken.",
          "Voor signalen die vaak wijzen op dakproblemen — dakrenovatie beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "terugkerende lekkages op meerdere plekken",
          "zichtbare veroudering van dakmateriaal",
          "oplopende onderhoudsfrequentie",
          "comfortverlies door koude of vochtproblemen"
        ]
      },
      {
        "heading": "Waardoor dit probleem meestal ontstaat — dakrenovatie",
        "paragraphs": [
          "Waardoor dit probleem meestal ontstaat — dakrenovatie: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij waardoor dit probleem meestal ontstaat — dakrenovatie tellen factoren zoals einde technische levensduur van materiaal, achterstallig onderhoud en onvoldoende kwaliteit van oudere details mee, omdat ze de omvang en aanpak van dakwerk rond dakrenovatie concreet maken.",
          "Voor waardoor dit probleem meestal ontstaat — dakrenovatie beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "einde technische levensduur van materiaal",
          "achterstallig onderhoud",
          "onvoldoende kwaliteit van oudere details"
        ]
      },
      {
        "heading": "Wat een dakdekker meestal eerst controleert (dakrenovatie) — dakrenovatie",
        "paragraphs": [
          "Wat een dakdekker meestal eerst controleert (dakrenovatie) — dakrenovatie: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een dakdekker meestal eerst controleert (dakrenovatie) — dakrenovatie tellen factoren zoals staat van dakopbouw integraal beoordelen, scenario’s vergelijken: herstel, deelrenovatie of volledig vernieuwen, planning afstemmen op bereikbaarheid en seizoen en uitvoering combineren met verbeteringen zoals isolatie mee, omdat ze de omvang en aanpak van dakwerk rond dakrenovatie concreet maken.",
          "Voor wat een dakdekker meestal eerst controleert (dakrenovatie) — dakrenovatie beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "staat van dakopbouw integraal beoordelen",
          "scenario’s vergelijken: herstel, deelrenovatie of volledig vernieuwen",
          "planning afstemmen op bereikbaarheid en seizoen",
          "uitvoering combineren met verbeteringen zoals isolatie"
        ]
      },
      {
        "heading": "Keuzes in herstel: lokaal, deels of breder — dakrenovatie",
        "paragraphs": [
          "Keuzes in herstel: lokaal, deels of breder — dakrenovatie: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in herstel: lokaal, deels of breder — dakrenovatie tellen factoren zoals gefaseerde renovatie bij beperkte scope, volledige renovatie bij structurele problemen en combineren met isolatie en afwateringsverbetering mee, omdat ze de omvang en aanpak van dakwerk rond dakrenovatie concreet maken.",
          "Voor keuzes in herstel: lokaal, deels of breder — dakrenovatie beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "gefaseerde renovatie bij beperkte scope",
          "volledige renovatie bij structurele problemen",
          "combineren met isolatie en afwateringsverbetering"
        ]
      },
      {
        "heading": "Welke informatie je in je aanvraag moet zetten — dakrenovatie",
        "paragraphs": [
          "Welke informatie je in je aanvraag moet zetten — dakrenovatie: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke informatie je in je aanvraag moet zetten — dakrenovatie tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond dakrenovatie concreet maken.",
          "Voor welke informatie je in je aanvraag moet zetten — dakrenovatie beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — dakrenovatie",
        "paragraphs": [
          "Gevolgen van uitstel en wanneer sneller handelen verstandig is — dakrenovatie: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij gevolgen van uitstel en wanneer sneller handelen verstandig is — dakrenovatie tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond dakrenovatie concreet maken.",
          "Voor gevolgen van uitstel en wanneer sneller handelen verstandig is — dakrenovatie beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "type": "warning"
      },
      {
        "heading": "Planning, bereikbaarheid en afstemming op locatie — dakrenovatie",
        "paragraphs": [
          "Planning, bereikbaarheid en afstemming op locatie — dakrenovatie: Een zorgvuldige beoordeling van dit onderdeel maakt offertes beter vergelijkbaar en realistischer.",
          "Bij planning, bereikbaarheid en afstemming op locatie — dakrenovatie tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond dakrenovatie concreet maken.",
          "Voor planning, bereikbaarheid en afstemming op locatie — dakrenovatie beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "oppervlakte en dakvorm",
      "materiaalkeuze en gewenste levensduur",
      "bereikbaarheid en veiligheidsmaatregelen",
      "extra werk aan details zoals goten en schoorsteen",
      "afstemming met eventuele isolatiemaatregelen"
    ],
    "processSteps": [
      "Beschrijf je vraag rond dakrenovatie en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende dakdekker-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/dakdekker",
        "title": "Dakdekker",
        "description": "Bekijk ook dakdekker voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/dakdekker/dakpannen-vervangen",
        "title": "Dakpannen vervangen",
        "description": "Bekijk ook dakpannen vervangen voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/isolatie/dakisolatie",
        "title": "Dakisolatie",
        "description": "Bekijk ook dakisolatie voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/dakdekker/dakinspectie",
        "title": "Dakinspectie",
        "description": "Bekijk ook dakinspectie voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Wanneer is renovatie slimmer dan reparatie?",
        "answer": "Als problemen terugkeren op meerdere plekken of het materiaal het einde van de levensduur nadert, is renovatie vaak logischer."
      },
      {
        "question": "Kan renovatie in delen?",
        "answer": "Ja, maar dat hangt af van de dakopbouw en de samenhang tussen details."
      },
      {
        "question": "Moet ik isolatie direct meenemen?",
        "answer": "Bij openliggende dakopbouw is dat vaak praktisch, maar de juiste keuze verschilt per woning."
      },
      {
        "question": "Hoe bereid ik een renovatieaanvraag voor?",
        "answer": "Noem het type dak, leeftijd, bekende problemen en voeg recente foto’s toe."
      },
      {
        "question": "Voert VakConnect renovaties uit?",
        "answer": "Nee, VakConnect koppelt je met een passende vakman."
      }
    ],
    "cta": {
      "title": "Beschrijf je dakrenovatie-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over dakrenovatie, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Vraag een specialist voor dakrenovatie",
      "secondaryLabel": "Terug naar dakdekker",
      "secondaryHref": "/dakdekker"
    }
  },
  "dakdekker/dakpannen-vervangen": {
    "path": "/dakdekker/dakpannen-vervangen",
    "title": "Dakpannen vervangen via VakConnect",
    "description": "Dakpannen beschadigd of poreus? Ontdek wanneer vervanging verstandig is en wat de omvang van de klus bepaalt.",
    "keywords": [
      "dakdekker",
      "dakpannen-vervangen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Dakpannen vervangen: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij dakpannen vervangen? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Dakdekker",
        "href": "/dakdekker"
      },
      {
        "label": "Dakpannen vervangen"
      }
    ],
    "sections": [
      {
        "heading": "Losse pannen vervangen of een groter vlak aanpakken",
        "paragraphs": [
          "Losse pannen vervangen of een groter vlak aanpakken: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij losse pannen vervangen of een groter vlak aanpakken tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond dakpannen vervangen concreet maken.",
          "Voor losse pannen vervangen of een groter vlak aanpakken beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — dakpannen vervangen",
        "paragraphs": [
          "Signalen die vaak wijzen op dakproblemen — dakpannen vervangen: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen die vaak wijzen op dakproblemen — dakpannen vervangen tellen factoren zoals gebroken of verschoven pannen, zichtbare poreuze pannen, vochtsporen onder dakvlak en regelmatige stormschade op dezelfde zones mee, omdat ze de omvang en aanpak van dakwerk rond dakpannen vervangen concreet maken.",
          "Voor signalen die vaak wijzen op dakproblemen — dakpannen vervangen beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "gebroken of verschoven pannen",
          "zichtbare poreuze pannen",
          "vochtsporen onder dakvlak",
          "regelmatige stormschade op dezelfde zones"
        ]
      },
      {
        "heading": "Waardoor dit probleem meestal ontstaat — dakpannen vervangen",
        "paragraphs": [
          "Waardoor dit probleem meestal ontstaat — dakpannen vervangen: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij waardoor dit probleem meestal ontstaat — dakpannen vervangen tellen factoren zoals ouderdom en weersinvloed, bevestigingsproblemen bij nok of randen en lokale belasting door wind mee, omdat ze de omvang en aanpak van dakwerk rond dakpannen vervangen concreet maken.",
          "Voor waardoor dit probleem meestal ontstaat — dakpannen vervangen beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "ouderdom en weersinvloed",
          "bevestigingsproblemen bij nok of randen",
          "lokale belasting door wind"
        ]
      },
      {
        "heading": "Wat een dakdekker meestal eerst controleert (dakpannen vervangen) — dakpannen vervangen",
        "paragraphs": [
          "Wat een dakdekker meestal eerst controleert (dakpannen vervangen) — dakpannen vervangen: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een dakdekker meestal eerst controleert (dakpannen vervangen) — dakpannen vervangen tellen factoren zoals inspectie van complete rij en aansluitingen, vervanging van losse pannen of grotere vlakken, controle op onderliggende laag en nokdetails en nazicht op waterdichtheid na herstel mee, omdat ze de omvang en aanpak van dakwerk rond dakpannen vervangen concreet maken.",
          "Voor wat een dakdekker meestal eerst controleert (dakpannen vervangen) — dakpannen vervangen beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "inspectie van complete rij en aansluitingen",
          "vervanging van losse pannen of grotere vlakken",
          "controle op onderliggende laag en nokdetails",
          "nazicht op waterdichtheid na herstel"
        ]
      },
      {
        "heading": "Keuzes in herstel: lokaal, deels of breder — dakpannen vervangen",
        "paragraphs": [
          "Keuzes in herstel: lokaal, deels of breder — dakpannen vervangen: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in herstel: lokaal, deels of breder — dakpannen vervangen tellen factoren zoals deelherstel met kleurverschil accepteren of bredere vervanging kiezen, combinatie met nokvorstherstel en planning direct na stormperiode of als onderhoudsproject mee, omdat ze de omvang en aanpak van dakwerk rond dakpannen vervangen concreet maken.",
          "Voor keuzes in herstel: lokaal, deels of breder — dakpannen vervangen beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "deelherstel met kleurverschil accepteren of bredere vervanging kiezen",
          "combinatie met nokvorstherstel",
          "planning direct na stormperiode of als onderhoudsproject"
        ]
      },
      {
        "heading": "Welke informatie je in je aanvraag moet zetten — dakpannen vervangen",
        "paragraphs": [
          "Welke informatie je in je aanvraag moet zetten — dakpannen vervangen: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke informatie je in je aanvraag moet zetten — dakpannen vervangen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond dakpannen vervangen concreet maken.",
          "Voor welke informatie je in je aanvraag moet zetten — dakpannen vervangen beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — dakpannen vervangen",
        "paragraphs": [
          "Gevolgen van uitstel en wanneer sneller handelen verstandig is — dakpannen vervangen: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij gevolgen van uitstel en wanneer sneller handelen verstandig is — dakpannen vervangen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond dakpannen vervangen concreet maken.",
          "Voor gevolgen van uitstel en wanneer sneller handelen verstandig is — dakpannen vervangen beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "type": "warning"
      },
      {
        "heading": "Planning, bereikbaarheid en afstemming op locatie — dakpannen vervangen",
        "paragraphs": [
          "Planning, bereikbaarheid en afstemming op locatie — dakpannen vervangen: Een zorgvuldige beoordeling van dit onderdeel maakt offertes beter vergelijkbaar en realistischer.",
          "Bij planning, bereikbaarheid en afstemming op locatie — dakpannen vervangen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond dakpannen vervangen concreet maken.",
          "Voor planning, bereikbaarheid en afstemming op locatie — dakpannen vervangen beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "aantal te vervangen pannen",
      "bereikbaarheid van het dakvlak",
      "beschikbaarheid van passend panmodel",
      "extra werk aan nok en afwerking",
      "eventuele schade onder de pannen"
    ],
    "processSteps": [
      "Beschrijf je vraag rond dakpannen vervangen en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende dakdekker-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/dakdekker",
        "title": "Dakdekker",
        "description": "Bekijk ook dakdekker voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/dakdekker/nokvorsten",
        "title": "Nokvorsten",
        "description": "Bekijk ook nokvorsten voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/dakdekker/dakinspectie",
        "title": "Dakinspectie",
        "description": "Bekijk ook dakinspectie voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Kan ik alleen kapotte pannen laten vervangen?",
        "answer": "Ja, als omliggende delen nog voldoende kwaliteit hebben."
      },
      {
        "question": "Waarom wordt soms een groter vlak geadviseerd?",
        "answer": "Omdat brede slijtage of slechte aansluiting anders snel nieuwe klachten geeft."
      },
      {
        "question": "Hoe belangrijk is het panmodel?",
        "answer": "Belangrijk voor pasvorm, waterafvoer en uitstraling."
      },
      {
        "question": "Kan ik dit combineren met inspectie?",
        "answer": "Ja, dat is vaak zinvol om verdere zwakke plekken mee te nemen."
      },
      {
        "question": "Doet VakConnect dit werk zelf?",
        "answer": "Nee, het platform koppelt je aan een passende professional."
      }
    ],
    "cta": {
      "title": "Beschrijf je dakpannen vervangen-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over dakpannen vervangen, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Start je aanvraag voor dakpannen",
      "secondaryLabel": "Terug naar dakdekker",
      "secondaryHref": "/dakdekker"
    }
  },
  "dakdekker/plat-dak": {
    "path": "/dakdekker/plat-dak",
    "title": "Plat dak via VakConnect",
    "description": "Voor onderhoud, reparatie of vernieuwing van een plat dak: lees wat belangrijk is en plaats gericht je aanvraag.",
    "keywords": [
      "dakdekker",
      "plat-dak",
      "vakman",
      "VakConnect"
    ],
    "h1": "Plat dak: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij plat dak? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Dakdekker",
        "href": "/dakdekker"
      },
      {
        "label": "Plat dak"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer plat dak in beeld komt",
        "paragraphs": [
          "Wanneer plat dak in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer plat dak in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond plat dak concreet maken.",
          "Voor wanneer plat dak in beeld komt beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — plat dak",
        "paragraphs": [
          "Signalen die vaak wijzen op dakproblemen — plat dak: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen die vaak wijzen op dakproblemen — plat dak tellen factoren zoals plassen die lang blijven staan, blazen of scheuren in daklaag, lekkage na regen en losse randen bij opstanden mee, omdat ze de omvang en aanpak van dakwerk rond plat dak concreet maken.",
          "Voor signalen die vaak wijzen op dakproblemen — plat dak beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "plassen die lang blijven staan",
          "blazen of scheuren in daklaag",
          "lekkage na regen",
          "losse randen bij opstanden"
        ]
      },
      {
        "heading": "Waardoor dit probleem meestal ontstaat — plat dak",
        "paragraphs": [
          "Waardoor dit probleem meestal ontstaat — plat dak: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij waardoor dit probleem meestal ontstaat — plat dak tellen factoren zoals verouderde dakbedekking, beperkte afwatering en zwakke aansluitdetails mee, omdat ze de omvang en aanpak van dakwerk rond plat dak concreet maken.",
          "Voor waardoor dit probleem meestal ontstaat — plat dak beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "verouderde dakbedekking",
          "beperkte afwatering",
          "zwakke aansluitdetails"
        ]
      },
      {
        "heading": "Wat een dakdekker meestal eerst controleert (plat dak) — plat dak",
        "paragraphs": [
          "Wat een dakdekker meestal eerst controleert (plat dak) — plat dak: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een dakdekker meestal eerst controleert (plat dak) — plat dak tellen factoren zoals visuele inspectie van daklaag en naden, controle van afschot en afvoer, lokaal herstel of deelvernieuwing en advies over onderhoudsinterval mee, omdat ze de omvang en aanpak van dakwerk rond plat dak concreet maken.",
          "Voor wat een dakdekker meestal eerst controleert (plat dak) — plat dak beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "visuele inspectie van daklaag en naden",
          "controle van afschot en afvoer",
          "lokaal herstel of deelvernieuwing",
          "advies over onderhoudsinterval"
        ]
      },
      {
        "heading": "Keuzes in herstel: lokaal, deels of breder — plat dak",
        "paragraphs": [
          "Keuzes in herstel: lokaal, deels of breder — plat dak: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in herstel: lokaal, deels of breder — plat dak tellen factoren zoals repareren van detail of groter oppervlak vernieuwen, materiaalkeuze passend bij bestaande opbouw en combineren met dakgoot- of afvoerwerk mee, omdat ze de omvang en aanpak van dakwerk rond plat dak concreet maken.",
          "Voor keuzes in herstel: lokaal, deels of breder — plat dak beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "repareren van detail of groter oppervlak vernieuwen",
          "materiaalkeuze passend bij bestaande opbouw",
          "combineren met dakgoot- of afvoerwerk"
        ]
      },
      {
        "heading": "Welke informatie je in je aanvraag moet zetten — plat dak",
        "paragraphs": [
          "Welke informatie je in je aanvraag moet zetten — plat dak: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke informatie je in je aanvraag moet zetten — plat dak tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond plat dak concreet maken.",
          "Voor welke informatie je in je aanvraag moet zetten — plat dak beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — plat dak",
        "paragraphs": [
          "Gevolgen van uitstel en wanneer sneller handelen verstandig is — plat dak: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij gevolgen van uitstel en wanneer sneller handelen verstandig is — plat dak tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond plat dak concreet maken.",
          "Voor gevolgen van uitstel en wanneer sneller handelen verstandig is — plat dak beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "oppervlakte en bereikbaarheid",
      "staat van bestaande laag",
      "aantal details en doorvoeren",
      "afvoerverbeteringen",
      "spoed versus planmatig onderhoud"
    ],
    "processSteps": [
      "Beschrijf je vraag rond plat dak en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende dakdekker-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/dakdekker/daklekkage",
        "title": "Daklekkage",
        "description": "Bekijk ook daklekkage voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/dakdekker/dakgoot",
        "title": "Dakgoot",
        "description": "Bekijk ook dakgoot voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/dakdekker/dakinspectie",
        "title": "Dakinspectie",
        "description": "Bekijk ook dakinspectie voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Hoe vaak laat ik een plat dak controleren?",
        "answer": "Periodieke controle helpt om slijtage en verstoppingen vroeg te signaleren."
      },
      {
        "question": "Is een scheur altijd direct lekkage?",
        "answer": "Niet altijd, maar het risico op waterindringing neemt wel toe."
      },
      {
        "question": "Kan afwatering apart worden aangepakt?",
        "answer": "Ja, soms is afvoerverbetering al een belangrijke stap."
      },
      {
        "question": "Welke foto’s zijn nuttig?",
        "answer": "Overzicht van het dak, details bij randen en locaties met plassen of schade."
      }
    ],
    "cta": {
      "title": "Beschrijf je plat dak-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over plat dak, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Vraag hulp voor je platte dak",
      "secondaryLabel": "Terug naar dakdekker",
      "secondaryHref": "/dakdekker"
    }
  },
  "dakdekker/schoorsteen": {
    "path": "/dakdekker/schoorsteen",
    "title": "Schoorsteen via VakConnect",
    "description": "Lekkage of slijtage rond de schoorsteen? Lees welke oorzaken vaak voorkomen en hoe je de klus goed aanvraagt.",
    "keywords": [
      "dakdekker",
      "schoorsteen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Schoorsteen: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij schoorsteen? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Dakdekker",
        "href": "/dakdekker"
      },
      {
        "label": "Schoorsteen"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer schoorsteen in beeld komt",
        "paragraphs": [
          "Wanneer schoorsteen in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer schoorsteen in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond schoorsteen concreet maken.",
          "Voor wanneer schoorsteen in beeld komt beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — schoorsteen",
        "paragraphs": [
          "Signalen die vaak wijzen op dakproblemen — schoorsteen: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen die vaak wijzen op dakproblemen — schoorsteen tellen factoren zoals vocht rond schoorsteen, scheuren in voegwerk, losse loodstroken en afbrokkelende delen mee, omdat ze de omvang en aanpak van dakwerk rond schoorsteen concreet maken.",
          "Voor signalen die vaak wijzen op dakproblemen — schoorsteen beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "vocht rond schoorsteen",
          "scheuren in voegwerk",
          "losse loodstroken",
          "afbrokkelende delen"
        ]
      },
      {
        "heading": "Waardoor dit probleem meestal ontstaat — schoorsteen",
        "paragraphs": [
          "Waardoor dit probleem meestal ontstaat — schoorsteen: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij waardoor dit probleem meestal ontstaat — schoorsteen tellen factoren zoals verouderde voegen, versleten aansluiting met dak en vorstschade mee, omdat ze de omvang en aanpak van dakwerk rond schoorsteen concreet maken.",
          "Voor waardoor dit probleem meestal ontstaat — schoorsteen beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "verouderde voegen",
          "versleten aansluiting met dak",
          "vorstschade"
        ]
      },
      {
        "heading": "Wat een dakdekker meestal eerst controleert (schoorsteen) — schoorsteen",
        "paragraphs": [
          "Wat een dakdekker meestal eerst controleert (schoorsteen) — schoorsteen: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een dakdekker meestal eerst controleert (schoorsteen) — schoorsteen tellen factoren zoals inspectie van metselwerk en looddetails, herstellen of vervangen van aansluitstroken, opnieuw voegen waar nodig en controle op waterdichte aansluiting met dakvlak mee, omdat ze de omvang en aanpak van dakwerk rond schoorsteen concreet maken.",
          "Voor wat een dakdekker meestal eerst controleert (schoorsteen) — schoorsteen beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "inspectie van metselwerk en looddetails",
          "herstellen of vervangen van aansluitstroken",
          "opnieuw voegen waar nodig",
          "controle op waterdichte aansluiting met dakvlak"
        ]
      },
      {
        "heading": "Keuzes in herstel: lokaal, deels of breder — schoorsteen",
        "paragraphs": [
          "Keuzes in herstel: lokaal, deels of breder — schoorsteen: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in herstel: lokaal, deels of breder — schoorsteen tellen factoren zoals alleen voegwerk of compleet detailherstel, combinatie met daklekkage-onderzoek en preventieve inspectie bij ouder metselwerk mee, omdat ze de omvang en aanpak van dakwerk rond schoorsteen concreet maken.",
          "Voor keuzes in herstel: lokaal, deels of breder — schoorsteen beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "alleen voegwerk of compleet detailherstel",
          "combinatie met daklekkage-onderzoek",
          "preventieve inspectie bij ouder metselwerk"
        ]
      },
      {
        "heading": "Welke informatie je in je aanvraag moet zetten — schoorsteen",
        "paragraphs": [
          "Welke informatie je in je aanvraag moet zetten — schoorsteen: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke informatie je in je aanvraag moet zetten — schoorsteen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond schoorsteen concreet maken.",
          "Voor welke informatie je in je aanvraag moet zetten — schoorsteen beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — schoorsteen",
        "paragraphs": [
          "Gevolgen van uitstel en wanneer sneller handelen verstandig is — schoorsteen: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij gevolgen van uitstel en wanneer sneller handelen verstandig is — schoorsteen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond schoorsteen concreet maken.",
          "Voor gevolgen van uitstel en wanneer sneller handelen verstandig is — schoorsteen beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "hoogte en bereikbaarheid",
      "staat van metselwerk",
      "omvang van aansluitherstel",
      "benodigde veiligheidsvoorzieningen"
    ],
    "processSteps": [
      "Beschrijf je vraag rond schoorsteen en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende dakdekker-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/dakdekker",
        "title": "Dakdekker",
        "description": "Bekijk ook dakdekker voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/dakdekker/daklekkage",
        "title": "Daklekkage",
        "description": "Bekijk ook daklekkage voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/dakdekker/dakkapel",
        "title": "Dakkapel",
        "description": "Bekijk ook dakkapel voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Is schoorsteenwerk altijd metselwerk?",
        "answer": "Niet alleen; ook de aansluiting met het dak bepaalt de waterdichtheid."
      },
      {
        "question": "Kan klein scheurwerk wachten?",
        "answer": "Kleine scheuren kunnen doorslaan naar grotere lekkageproblemen."
      },
      {
        "question": "Welke info hoort in de aanvraag?",
        "answer": "Noem zichtbare schade, locatie en voeg foto’s toe van detail en omgeving."
      },
      {
        "question": "Voert VakConnect herstel uit?",
        "answer": "Nee, VakConnect koppelt je aan een passende specialist."
      }
    ],
    "cta": {
      "title": "Beschrijf je schoorsteen-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over schoorsteen, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Vraag schoorsteenhulp aan",
      "secondaryLabel": "Terug naar dakdekker",
      "secondaryHref": "/dakdekker"
    }
  },
  "dakdekker/nokvorsten": {
    "path": "/dakdekker/nokvorsten",
    "title": "Nokvorsten via VakConnect",
    "description": "Losliggende of gescheurde nokvorsten? Ontdek wanneer herstel nodig is en hoe je snel de juiste specialist vindt.",
    "keywords": [
      "dakdekker",
      "nokvorsten",
      "vakman",
      "VakConnect"
    ],
    "h1": "Nokvorsten: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij nokvorsten? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Dakdekker",
        "href": "/dakdekker"
      },
      {
        "label": "Nokvorsten"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer nokvorsten in beeld komt",
        "paragraphs": [
          "Wanneer nokvorsten in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer nokvorsten in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond nokvorsten concreet maken.",
          "Voor wanneer nokvorsten in beeld komt beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — nokvorsten",
        "paragraphs": [
          "Signalen die vaak wijzen op dakproblemen — nokvorsten: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen die vaak wijzen op dakproblemen — nokvorsten tellen factoren zoals scheef liggende nokdelen, scheuren in bevestiging en vochtsporen bij nok mee, omdat ze de omvang en aanpak van dakwerk rond nokvorsten concreet maken.",
          "Voor signalen die vaak wijzen op dakproblemen — nokvorsten beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "scheef liggende nokdelen",
          "scheuren in bevestiging",
          "vochtsporen bij nok"
        ]
      },
      {
        "heading": "Waardoor dit probleem meestal ontstaat — nokvorsten",
        "paragraphs": [
          "Waardoor dit probleem meestal ontstaat — nokvorsten: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij waardoor dit probleem meestal ontstaat — nokvorsten tellen factoren zoals ouderdom van mortel of bevestiging, stormbelasting en werking van dakconstructie mee, omdat ze de omvang en aanpak van dakwerk rond nokvorsten concreet maken.",
          "Voor waardoor dit probleem meestal ontstaat — nokvorsten beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "ouderdom van mortel of bevestiging",
          "stormbelasting",
          "werking van dakconstructie"
        ]
      },
      {
        "heading": "Wat een dakdekker meestal eerst controleert (nokvorsten) — nokvorsten",
        "paragraphs": [
          "Wat een dakdekker meestal eerst controleert (nokvorsten) — nokvorsten: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een dakdekker meestal eerst controleert (nokvorsten) — nokvorsten tellen factoren zoals controle van de hele noklijn, lokale reparatie of vernieuwen van delen en verbeteren van bevestiging en afdichting mee, omdat ze de omvang en aanpak van dakwerk rond nokvorsten concreet maken.",
          "Voor wat een dakdekker meestal eerst controleert (nokvorsten) — nokvorsten beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "controle van de hele noklijn",
          "lokale reparatie of vernieuwen van delen",
          "verbeteren van bevestiging en afdichting"
        ]
      },
      {
        "heading": "Keuzes in herstel: lokaal, deels of breder — nokvorsten",
        "paragraphs": [
          "Keuzes in herstel: lokaal, deels of breder — nokvorsten: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in herstel: lokaal, deels of breder — nokvorsten tellen factoren zoals traditionele mortel of droog noksysteem en plaatselijk herstel of complete nokaanpak mee, omdat ze de omvang en aanpak van dakwerk rond nokvorsten concreet maken.",
          "Voor keuzes in herstel: lokaal, deels of breder — nokvorsten beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "traditionele mortel of droog noksysteem",
          "plaatselijk herstel of complete nokaanpak"
        ]
      },
      {
        "heading": "Welke informatie je in je aanvraag moet zetten — nokvorsten",
        "paragraphs": [
          "Welke informatie je in je aanvraag moet zetten — nokvorsten: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke informatie je in je aanvraag moet zetten — nokvorsten tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond nokvorsten concreet maken.",
          "Voor welke informatie je in je aanvraag moet zetten — nokvorsten beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — nokvorsten",
        "paragraphs": [
          "Gevolgen van uitstel en wanneer sneller handelen verstandig is — nokvorsten: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij gevolgen van uitstel en wanneer sneller handelen verstandig is — nokvorsten tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond nokvorsten concreet maken.",
          "Voor gevolgen van uitstel en wanneer sneller handelen verstandig is — nokvorsten beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "lengte van noklijn",
      "bereikbaarheid",
      "type bevestiging",
      "benodigde vervangingsdelen"
    ],
    "processSteps": [
      "Beschrijf je vraag rond nokvorsten en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende dakdekker-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/dakdekker",
        "title": "Dakdekker",
        "description": "Bekijk ook dakdekker voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/dakdekker/dakpannen-vervangen",
        "title": "Dakpannen vervangen",
        "description": "Bekijk ook dakpannen vervangen voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/dakdekker/dakinspectie",
        "title": "Dakinspectie",
        "description": "Bekijk ook dakinspectie voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Hoe urgent zijn losse nokvorsten?",
        "answer": "Dat kan urgent zijn door risico op vervolgschade of losrakende delen."
      },
      {
        "question": "Kan ik alleen één zijde laten herstellen?",
        "answer": "Ja, afhankelijk van de staat van de rest."
      },
      {
        "question": "Waarom eerst inspectie?",
        "answer": "Omdat de zichtbare schade niet altijd het volledige probleem toont."
      },
      {
        "question": "Doet VakConnect dit werk zelf?",
        "answer": "Nee, je wordt gekoppeld aan een passende vakman."
      }
    ],
    "cta": {
      "title": "Beschrijf je nokvorsten-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over nokvorsten, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Plaats je nokvorsten-aanvraag",
      "secondaryLabel": "Terug naar dakdekker",
      "secondaryHref": "/dakdekker"
    }
  },
  "dakdekker/dakgoot": {
    "path": "/dakdekker/dakgoot",
    "title": "Dakgoot via VakConnect",
    "description": "Problemen met dakgoot of afwatering? Lees wanneer reparatie of vervanging nodig is.",
    "keywords": [
      "dakdekker",
      "dakgoot",
      "vakman",
      "VakConnect"
    ],
    "h1": "Dakgoot: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij dakgoot? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Dakdekker",
        "href": "/dakdekker"
      },
      {
        "label": "Dakgoot"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer dakgoot in beeld komt",
        "paragraphs": [
          "Wanneer dakgoot in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer dakgoot in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond dakgoot concreet maken.",
          "Voor wanneer dakgoot in beeld komt beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — dakgoot",
        "paragraphs": [
          "Signalen die vaak wijzen op dakproblemen — dakgoot: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen die vaak wijzen op dakproblemen — dakgoot tellen factoren zoals overlopende goot bij normale regen, natte gevelstroken en doorhangende delen mee, omdat ze de omvang en aanpak van dakwerk rond dakgoot concreet maken.",
          "Voor signalen die vaak wijzen op dakproblemen — dakgoot beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "overlopende goot bij normale regen",
          "natte gevelstroken",
          "doorhangende delen"
        ]
      },
      {
        "heading": "Waardoor dit probleem meestal ontstaat — dakgoot",
        "paragraphs": [
          "Waardoor dit probleem meestal ontstaat — dakgoot: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij waardoor dit probleem meestal ontstaat — dakgoot tellen factoren zoals verstopping, slijtage van verbindingen en onvoldoende afschot mee, omdat ze de omvang en aanpak van dakwerk rond dakgoot concreet maken.",
          "Voor waardoor dit probleem meestal ontstaat — dakgoot beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "verstopping",
          "slijtage van verbindingen",
          "onvoldoende afschot"
        ]
      },
      {
        "heading": "Wat een dakdekker meestal eerst controleert (dakgoot) — dakgoot",
        "paragraphs": [
          "Wat een dakdekker meestal eerst controleert (dakgoot) — dakgoot: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een dakdekker meestal eerst controleert (dakgoot) — dakgoot tellen factoren zoals goottraject inspecteren en reinigen, naden herstellen of delen vervangen en afvoer en afschot verbeteren mee, omdat ze de omvang en aanpak van dakwerk rond dakgoot concreet maken.",
          "Voor wat een dakdekker meestal eerst controleert (dakgoot) — dakgoot beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "goottraject inspecteren en reinigen",
          "naden herstellen of delen vervangen",
          "afvoer en afschot verbeteren"
        ]
      },
      {
        "heading": "Keuzes in herstel: lokaal, deels of breder — dakgoot",
        "paragraphs": [
          "Keuzes in herstel: lokaal, deels of breder — dakgoot: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in herstel: lokaal, deels of breder — dakgoot tellen factoren zoals onderhoud vs vervanging, materiaalkeuze afgestemd op woningtype en combinatie met afvoercontrole mee, omdat ze de omvang en aanpak van dakwerk rond dakgoot concreet maken.",
          "Voor keuzes in herstel: lokaal, deels of breder — dakgoot beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "onderhoud vs vervanging",
          "materiaalkeuze afgestemd op woningtype",
          "combinatie met afvoercontrole"
        ]
      },
      {
        "heading": "Welke informatie je in je aanvraag moet zetten — dakgoot",
        "paragraphs": [
          "Welke informatie je in je aanvraag moet zetten — dakgoot: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke informatie je in je aanvraag moet zetten — dakgoot tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond dakgoot concreet maken.",
          "Voor welke informatie je in je aanvraag moet zetten — dakgoot beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — dakgoot",
        "paragraphs": [
          "Gevolgen van uitstel en wanneer sneller handelen verstandig is — dakgoot: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij gevolgen van uitstel en wanneer sneller handelen verstandig is — dakgoot tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond dakgoot concreet maken.",
          "Voor gevolgen van uitstel en wanneer sneller handelen verstandig is — dakgoot beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "lengte van goottraject",
      "hoogte en bereikbaarheid",
      "staat van bevestiging",
      "aansluiting op regenafvoer"
    ],
    "processSteps": [
      "Beschrijf je vraag rond dakgoot en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende dakdekker-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/dakdekker",
        "title": "Dakdekker",
        "description": "Bekijk ook dakdekker voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/dakdekker/plat-dak",
        "title": "Plat dak",
        "description": "Bekijk ook plat dak voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/loodgieter/afvoer",
        "title": "Afvoer",
        "description": "Bekijk ook afvoer voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Is reinigen altijd genoeg?",
        "answer": "Niet als verbindingen of ophanging versleten zijn."
      },
      {
        "question": "Waarom is afschot belangrijk?",
        "answer": "Zonder goed afschot blijft water staan en versnelt slijtage."
      },
      {
        "question": "Kan ik deelvervanging doen?",
        "answer": "Vaak wel, afhankelijk van de staat van het totaal."
      },
      {
        "question": "Welke info helpt in de aanvraag?",
        "answer": "Lengte, hoogte en zichtbare klachten."
      }
    ],
    "cta": {
      "title": "Beschrijf je dakgoot-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over dakgoot, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Vraag hulp voor dakgootwerk",
      "secondaryLabel": "Terug naar dakdekker",
      "secondaryHref": "/dakdekker"
    }
  },
  "dakdekker/dakkapel": {
    "path": "/dakdekker/dakkapel",
    "title": "Dakkapel via VakConnect",
    "description": "Lekkage of slijtage rond je dakkapel? Vind via VakConnect een specialist voor beoordeling en herstel.",
    "keywords": [
      "dakdekker",
      "dakkapel",
      "vakman",
      "VakConnect"
    ],
    "h1": "Dakkapel: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij dakkapel? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Dakdekker",
        "href": "/dakdekker"
      },
      {
        "label": "Dakkapel"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer dakkapel in beeld komt",
        "paragraphs": [
          "Wanneer dakkapel in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer dakkapel in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond dakkapel concreet maken.",
          "Voor wanneer dakkapel in beeld komt beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — dakkapel",
        "paragraphs": [
          "Signalen die vaak wijzen op dakproblemen — dakkapel: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen die vaak wijzen op dakproblemen — dakkapel tellen factoren zoals vochtsporen bij zijwang, tocht of kieren en scheuren in bekleding mee, omdat ze de omvang en aanpak van dakwerk rond dakkapel concreet maken.",
          "Voor signalen die vaak wijzen op dakproblemen — dakkapel beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "vochtsporen bij zijwang",
          "tocht of kieren",
          "scheuren in bekleding"
        ]
      },
      {
        "heading": "Waardoor dit probleem meestal ontstaat — dakkapel",
        "paragraphs": [
          "Waardoor dit probleem meestal ontstaat — dakkapel: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij waardoor dit probleem meestal ontstaat — dakkapel tellen factoren zoals versleten afdichting, slechte afwatering en ouderdom van bekleding mee, omdat ze de omvang en aanpak van dakwerk rond dakkapel concreet maken.",
          "Voor waardoor dit probleem meestal ontstaat — dakkapel beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "versleten afdichting",
          "slechte afwatering",
          "ouderdom van bekleding"
        ]
      },
      {
        "heading": "Wat een dakdekker meestal eerst controleert (dakkapel) — dakkapel",
        "paragraphs": [
          "Wat een dakdekker meestal eerst controleert (dakkapel) — dakkapel: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een dakdekker meestal eerst controleert (dakkapel) — dakkapel tellen factoren zoals details rond aansluitingen controleren, afdichting en bekleding herstellen en nazicht van kozijn- en dakovergang mee, omdat ze de omvang en aanpak van dakwerk rond dakkapel concreet maken.",
          "Voor wat een dakdekker meestal eerst controleert (dakkapel) — dakkapel beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "details rond aansluitingen controleren",
          "afdichting en bekleding herstellen",
          "nazicht van kozijn- en dakovergang"
        ]
      },
      {
        "heading": "Keuzes in herstel: lokaal, deels of breder — dakkapel",
        "paragraphs": [
          "Keuzes in herstel: lokaal, deels of breder — dakkapel: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in herstel: lokaal, deels of breder — dakkapel tellen factoren zoals lokaal herstel of bredere renovatie en combinatie met kozijnwerk of schilderwerk mee, omdat ze de omvang en aanpak van dakwerk rond dakkapel concreet maken.",
          "Voor keuzes in herstel: lokaal, deels of breder — dakkapel beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "lokaal herstel of bredere renovatie",
          "combinatie met kozijnwerk of schilderwerk"
        ]
      },
      {
        "heading": "Welke informatie je in je aanvraag moet zetten — dakkapel",
        "paragraphs": [
          "Welke informatie je in je aanvraag moet zetten — dakkapel: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke informatie je in je aanvraag moet zetten — dakkapel tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond dakkapel concreet maken.",
          "Voor welke informatie je in je aanvraag moet zetten — dakkapel beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — dakkapel",
        "paragraphs": [
          "Gevolgen van uitstel en wanneer sneller handelen verstandig is — dakkapel: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij gevolgen van uitstel en wanneer sneller handelen verstandig is — dakkapel tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond dakkapel concreet maken.",
          "Voor gevolgen van uitstel en wanneer sneller handelen verstandig is — dakkapel beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "type dakkapel en afwerking",
      "bereikbaarheid",
      "omvang van detailherstel",
      "eventuele combinatie met ander buitenwerk"
    ],
    "processSteps": [
      "Beschrijf je vraag rond dakkapel en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende dakdekker-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/dakdekker",
        "title": "Dakdekker",
        "description": "Bekijk ook dakdekker voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/dakdekker/schoorsteen",
        "title": "Schoorsteen",
        "description": "Bekijk ook schoorsteen voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/kozijnen/ramen-en-deuren",
        "title": "Ramen en deuren",
        "description": "Bekijk ook ramen en deuren voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Is dit dakwerk of kozijnwerk?",
        "answer": "Vaak een combinatie, omdat meerdere details samenkomen."
      },
      {
        "question": "Moet ik binnenfoto’s toevoegen?",
        "answer": "Ja, dat helpt bij het duiden van gevolgschade."
      },
      {
        "question": "Kan onderhoud schade voorkomen?",
        "answer": "Regelmatige controle van naden en afwatering helpt."
      },
      {
        "question": "Voert VakConnect herstel uit?",
        "answer": "Nee, VakConnect koppelt je aan een passende specialist."
      }
    ],
    "cta": {
      "title": "Beschrijf je dakkapel-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over dakkapel, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Start je dakkapel-aanvraag",
      "secondaryLabel": "Terug naar dakdekker",
      "secondaryHref": "/dakdekker"
    }
  },
  "dakdekker/dakinspectie": {
    "path": "/dakdekker/dakinspectie",
    "title": "Dakinspectie via VakConnect",
    "description": "Plan een dakinspectie bij twijfel, onderhoud of aankoop en krijg inzicht in de staat van je dak.",
    "keywords": [
      "dakdekker",
      "dakinspectie",
      "vakman",
      "VakConnect"
    ],
    "h1": "Dakinspectie: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij dakinspectie? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Dakdekker",
        "href": "/dakdekker"
      },
      {
        "label": "Dakinspectie"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer dakinspectie in beeld komt",
        "paragraphs": [
          "Wanneer dakinspectie in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer dakinspectie in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond dakinspectie concreet maken.",
          "Voor wanneer dakinspectie in beeld komt beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — dakinspectie",
        "paragraphs": [
          "Signalen die vaak wijzen op dakproblemen — dakinspectie: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen die vaak wijzen op dakproblemen — dakinspectie tellen factoren zoals ouder dak zonder recente controle, onverklaarde vochtsporen en controlebehoefte na storm mee, omdat ze de omvang en aanpak van dakwerk rond dakinspectie concreet maken.",
          "Voor signalen die vaak wijzen op dakproblemen — dakinspectie beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "ouder dak zonder recente controle",
          "onverklaarde vochtsporen",
          "controlebehoefte na storm"
        ]
      },
      {
        "heading": "Waardoor dit probleem meestal ontstaat — dakinspectie",
        "paragraphs": [
          "Waardoor dit probleem meestal ontstaat — dakinspectie: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij waardoor dit probleem meestal ontstaat — dakinspectie tellen factoren zoals normale veroudering, verborgen schade en onvoldoende periodiek onderhoud mee, omdat ze de omvang en aanpak van dakwerk rond dakinspectie concreet maken.",
          "Voor waardoor dit probleem meestal ontstaat — dakinspectie beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "normale veroudering",
          "verborgen schade",
          "onvoldoende periodiek onderhoud"
        ]
      },
      {
        "heading": "Wat een dakdekker meestal eerst controleert (dakinspectie) — dakinspectie",
        "paragraphs": [
          "Wat een dakdekker meestal eerst controleert (dakinspectie) — dakinspectie: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een dakdekker meestal eerst controleert (dakinspectie) — dakinspectie tellen factoren zoals visuele opname van dakvlak en details, vastleggen van aandachtspunten en advies over onderhoud, herstel of renovatie mee, omdat ze de omvang en aanpak van dakwerk rond dakinspectie concreet maken.",
          "Voor wat een dakdekker meestal eerst controleert (dakinspectie) — dakinspectie beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "visuele opname van dakvlak en details",
          "vastleggen van aandachtspunten",
          "advies over onderhoud, herstel of renovatie"
        ]
      },
      {
        "heading": "Keuzes in herstel: lokaal, deels of breder — dakinspectie",
        "paragraphs": [
          "Keuzes in herstel: lokaal, deels of breder — dakinspectie: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in herstel: lokaal, deels of breder — dakinspectie tellen factoren zoals eenmalige inspectie of periodieke controle en direct vervolgwerk opnemen of later plannen mee, omdat ze de omvang en aanpak van dakwerk rond dakinspectie concreet maken.",
          "Voor keuzes in herstel: lokaal, deels of breder — dakinspectie beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "eenmalige inspectie of periodieke controle",
          "direct vervolgwerk opnemen of later plannen"
        ]
      },
      {
        "heading": "Welke informatie je in je aanvraag moet zetten — dakinspectie",
        "paragraphs": [
          "Welke informatie je in je aanvraag moet zetten — dakinspectie: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke informatie je in je aanvraag moet zetten — dakinspectie tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond dakinspectie concreet maken.",
          "Voor welke informatie je in je aanvraag moet zetten — dakinspectie beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — dakinspectie",
        "paragraphs": [
          "Gevolgen van uitstel en wanneer sneller handelen verstandig is — dakinspectie: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij gevolgen van uitstel en wanneer sneller handelen verstandig is — dakinspectie tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van dakwerk rond dakinspectie concreet maken.",
          "Voor gevolgen van uitstel en wanneer sneller handelen verstandig is — dakinspectie beoordeelt een dakdekker meestal welke stap logisch volgt; zonder die afweging neemt de kans op vocht en constructieve aantasting toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "type en grootte van het dak",
      "toegang en veiligheidsvoorzieningen",
      "detailniveau van rapportage"
    ],
    "processSteps": [
      "Beschrijf je vraag rond dakinspectie en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende dakdekker-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/dakdekker",
        "title": "Dakdekker",
        "description": "Bekijk ook dakdekker voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/dakdekker/daklekkage",
        "title": "Daklekkage",
        "description": "Bekijk ook daklekkage voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/dakdekker/dakrenovatie",
        "title": "Dakrenovatie",
        "description": "Bekijk ook dakrenovatie voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Is inspectie nuttig zonder klachten?",
        "answer": "Ja, vooral bij oudere daken voorkomt vroeg inzicht verrassingen."
      },
      {
        "question": "Krijg ik direct een definitief plan?",
        "answer": "Je krijgt meestal eerst een beoordeling en daarna passend advies."
      },
      {
        "question": "Moet ik aanwezig zijn?",
        "answer": "Dat hangt af van de situatie, maar vaak is afstemming vooraf voldoende."
      },
      {
        "question": "Doet VakConnect de inspectie zelf?",
        "answer": "Nee, het platform koppelt je aan een passende professional."
      }
    ],
    "cta": {
      "title": "Beschrijf je dakinspectie-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over dakinspectie, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Vraag een dakinspectie aan",
      "secondaryLabel": "Terug naar dakdekker",
      "secondaryHref": "/dakdekker"
    }
  },
  "schilder/binnenschilderwerk": {
    "path": "/schilder/binnenschilderwerk",
    "title": "Binnenschilderwerk via VakConnect",
    "description": "Binnenschilderwerk laten doen? Lees hoe voorbereiding, verfkeuze en planning het eindresultaat bepalen.",
    "keywords": [
      "schilder",
      "binnenschilderwerk",
      "vakman",
      "VakConnect"
    ],
    "h1": "Binnenschilderwerk: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij binnenschilderwerk? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Schilder",
        "href": "/schilder"
      },
      {
        "label": "Binnenschilderwerk"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer binnenschilderwerk in beeld komt",
        "paragraphs": [
          "Wanneer binnenschilderwerk in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer binnenschilderwerk in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van schilderwerk rond binnenschilderwerk concreet maken.",
          "Voor wanneer binnenschilderwerk in beeld komt beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Welke klachten je vaak ziet vóór schilderwerk — binnenschilderwerk",
        "paragraphs": [
          "Welke klachten je vaak ziet vóór schilderwerk — binnenschilderwerk: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij welke klachten je vaak ziet vóór schilderwerk — binnenschilderwerk tellen factoren zoals vlekken, strepen of beschadigingen, slijtage op houtwerk en ongelijke oude lagen mee, omdat ze de omvang en aanpak van schilderwerk rond binnenschilderwerk concreet maken.",
          "Voor welke klachten je vaak ziet vóór schilderwerk — binnenschilderwerk beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "vlekken, strepen of beschadigingen",
          "slijtage op houtwerk",
          "ongelijke oude lagen"
        ]
      },
      {
        "heading": "Oorzaken achter slijtage of slechte afwerking — binnenschilderwerk",
        "paragraphs": [
          "Oorzaken achter slijtage of slechte afwerking — binnenschilderwerk: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij oorzaken achter slijtage of slechte afwerking — binnenschilderwerk tellen factoren zoals normaal gebruik, vocht of condens en verouderde afwerking mee, omdat ze de omvang en aanpak van schilderwerk rond binnenschilderwerk concreet maken.",
          "Voor oorzaken achter slijtage of slechte afwerking — binnenschilderwerk beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "normaal gebruik",
          "vocht of condens",
          "verouderde afwerking"
        ]
      },
      {
        "heading": "Hoe een schilder de ondergrond beoordeelt (binnenschilderwerk) — binnenschilderwerk",
        "paragraphs": [
          "Hoe een schilder de ondergrond beoordeelt (binnenschilderwerk) — binnenschilderwerk: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij hoe een schilder de ondergrond beoordeelt (binnenschilderwerk) — binnenschilderwerk tellen factoren zoals ondergrond voorbereiden, passende lagen opbouwen en strak afwerken van randen en details mee, omdat ze de omvang en aanpak van schilderwerk rond binnenschilderwerk concreet maken.",
          "Voor hoe een schilder de ondergrond beoordeelt (binnenschilderwerk) — binnenschilderwerk beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "ondergrond voorbereiden",
          "passende lagen opbouwen",
          "strak afwerken van randen en details"
        ]
      },
      {
        "heading": "Keuzes in afwerking en combinatie met ander onderhoud — binnenschilderwerk",
        "paragraphs": [
          "Keuzes in afwerking en combinatie met ander onderhoud — binnenschilderwerk: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in afwerking en combinatie met ander onderhoud — binnenschilderwerk tellen factoren zoals ruimte voor ruimte werken, accent op muren, plafonds of houtwerk en hoog belastbare verf in druk gebruikte ruimtes mee, omdat ze de omvang en aanpak van schilderwerk rond binnenschilderwerk concreet maken.",
          "Voor keuzes in afwerking en combinatie met ander onderhoud — binnenschilderwerk beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "ruimte voor ruimte werken",
          "accent op muren, plafonds of houtwerk",
          "hoog belastbare verf in druk gebruikte ruimtes"
        ]
      },
      {
        "heading": "Zo maak je je aanvraag concreet en vergelijkbaar — binnenschilderwerk",
        "paragraphs": [
          "Zo maak je je aanvraag concreet en vergelijkbaar — binnenschilderwerk: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij zo maak je je aanvraag concreet en vergelijkbaar — binnenschilderwerk tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van schilderwerk rond binnenschilderwerk concreet maken.",
          "Voor zo maak je je aanvraag concreet en vergelijkbaar — binnenschilderwerk beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wat er gebeurt als je onderhoud te lang uitstelt — binnenschilderwerk",
        "paragraphs": [
          "Wat er gebeurt als je onderhoud te lang uitstelt — binnenschilderwerk: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij wat er gebeurt als je onderhoud te lang uitstelt — binnenschilderwerk tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van schilderwerk rond binnenschilderwerk concreet maken.",
          "Voor wat er gebeurt als je onderhoud te lang uitstelt — binnenschilderwerk beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "m² en aantal oppervlakken",
      "staat van ondergrond",
      "benodigde herstelwerkzaamheden",
      "aantal lagen en productkeuze"
    ],
    "processSteps": [
      "Beschrijf je vraag rond binnenschilderwerk en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende schilder-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/schilder",
        "title": "Schilder",
        "description": "Bekijk ook schilder voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/schilder/plafond-schilderen",
        "title": "Plafond schilderen",
        "description": "Bekijk ook plafond schilderen voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/schilder/deuren-schilderen",
        "title": "Deuren schilderen",
        "description": "Bekijk ook deuren schilderen voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Waarom zie je soms strepen na schilderen?",
        "answer": "Dat komt vaak door onjuiste voorbereiding of verwerking voor de gekozen ondergrond."
      },
      {
        "question": "Kan ik in huis blijven tijdens het werk?",
        "answer": "Meestal wel, afhankelijk van planning per ruimte."
      },
      {
        "question": "Moet alles leeg?",
        "answer": "Niet volledig, maar werkruimte vrijmaken helpt."
      },
      {
        "question": "Is kleuradvies mogelijk?",
        "answer": "Ja, veel vakmensen adviseren hierin."
      }
    ],
    "cta": {
      "title": "Beschrijf je binnenschilderwerk-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over binnenschilderwerk, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Start je aanvraag voor binnenschilderwerk",
      "secondaryLabel": "Terug naar schilder",
      "secondaryHref": "/schilder"
    }
  },
  "schilder/buitenschilderwerk": {
    "path": "/schilder/buitenschilderwerk",
    "title": "Buitenschilderwerk via VakConnect",
    "description": "Voor onderhoud en bescherming van geveldelen: ontdek wat buitenschilderwerk vraagt.",
    "keywords": [
      "schilder",
      "buitenschilderwerk",
      "vakman",
      "VakConnect"
    ],
    "h1": "Buitenschilderwerk: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij buitenschilderwerk? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Schilder",
        "href": "/schilder"
      },
      {
        "label": "Buitenschilderwerk"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer buitenschilderwerk in beeld komt",
        "paragraphs": [
          "Wanneer buitenschilderwerk in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer buitenschilderwerk in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van schilderwerk rond buitenschilderwerk concreet maken.",
          "Voor wanneer buitenschilderwerk in beeld komt beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Welke klachten je vaak ziet vóór schilderwerk — buitenschilderwerk",
        "paragraphs": [
          "Welke klachten je vaak ziet vóór schilderwerk — buitenschilderwerk: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij welke klachten je vaak ziet vóór schilderwerk — buitenschilderwerk tellen factoren zoals bladderende buitenverf, kale plekken op hout en verkleuring op zonzijde mee, omdat ze de omvang en aanpak van schilderwerk rond buitenschilderwerk concreet maken.",
          "Voor welke klachten je vaak ziet vóór schilderwerk — buitenschilderwerk beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "bladderende buitenverf",
          "kale plekken op hout",
          "verkleuring op zonzijde"
        ]
      },
      {
        "heading": "Oorzaken achter slijtage of slechte afwerking — buitenschilderwerk",
        "paragraphs": [
          "Oorzaken achter slijtage of slechte afwerking — buitenschilderwerk: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij oorzaken achter slijtage of slechte afwerking — buitenschilderwerk tellen factoren zoals UV en neerslag, achterstallig onderhoud en vochtinwerking mee, omdat ze de omvang en aanpak van schilderwerk rond buitenschilderwerk concreet maken.",
          "Voor oorzaken achter slijtage of slechte afwerking — buitenschilderwerk beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "UV en neerslag",
          "achterstallig onderhoud",
          "vochtinwerking"
        ]
      },
      {
        "heading": "Hoe een schilder de ondergrond beoordeelt (buitenschilderwerk) — buitenschilderwerk",
        "paragraphs": [
          "Hoe een schilder de ondergrond beoordeelt (buitenschilderwerk) — buitenschilderwerk: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij hoe een schilder de ondergrond beoordeelt (buitenschilderwerk) — buitenschilderwerk tellen factoren zoals inspectie van geveldelen, voorbehandeling en herstel en opbouw van duurzaam verfsysteem mee, omdat ze de omvang en aanpak van schilderwerk rond buitenschilderwerk concreet maken.",
          "Voor hoe een schilder de ondergrond beoordeelt (buitenschilderwerk) — buitenschilderwerk beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "inspectie van geveldelen",
          "voorbehandeling en herstel",
          "opbouw van duurzaam verfsysteem"
        ]
      },
      {
        "heading": "Keuzes in afwerking en combinatie met ander onderhoud — buitenschilderwerk",
        "paragraphs": [
          "Keuzes in afwerking en combinatie met ander onderhoud — buitenschilderwerk: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in afwerking en combinatie met ander onderhoud — buitenschilderwerk tellen factoren zoals deelonderhoud of complete ronde, focus op kozijnen, deuren of boeidelen en combinatie met houtreparatie mee, omdat ze de omvang en aanpak van schilderwerk rond buitenschilderwerk concreet maken.",
          "Voor keuzes in afwerking en combinatie met ander onderhoud — buitenschilderwerk beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "deelonderhoud of complete ronde",
          "focus op kozijnen, deuren of boeidelen",
          "combinatie met houtreparatie"
        ]
      },
      {
        "heading": "Zo maak je je aanvraag concreet en vergelijkbaar — buitenschilderwerk",
        "paragraphs": [
          "Zo maak je je aanvraag concreet en vergelijkbaar — buitenschilderwerk: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij zo maak je je aanvraag concreet en vergelijkbaar — buitenschilderwerk tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van schilderwerk rond buitenschilderwerk concreet maken.",
          "Voor zo maak je je aanvraag concreet en vergelijkbaar — buitenschilderwerk beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wat er gebeurt als je onderhoud te lang uitstelt — buitenschilderwerk",
        "paragraphs": [
          "Wat er gebeurt als je onderhoud te lang uitstelt — buitenschilderwerk: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij wat er gebeurt als je onderhoud te lang uitstelt — buitenschilderwerk tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van schilderwerk rond buitenschilderwerk concreet maken.",
          "Voor wat er gebeurt als je onderhoud te lang uitstelt — buitenschilderwerk beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "aantal gevelzijden",
      "hoogte en bereikbaarheid",
      "staat van hout",
      "lagenopbouw en materiaal"
    ],
    "processSteps": [
      "Beschrijf je vraag rond buitenschilderwerk en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende schilder-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/schilder",
        "title": "Schilder",
        "description": "Bekijk ook schilder voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/schilder/kozijnen-schilderen",
        "title": "Kozijnen schilderen",
        "description": "Bekijk ook kozijnen schilderen voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/kozijnen/houten-kozijnen",
        "title": "Houten kozijnen",
        "description": "Bekijk ook houten kozijnen voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Wanneer is buitenwerk het beste te plannen?",
        "answer": "In stabiele weersperioden is uitvoering meestal voorspelbaarder."
      },
      {
        "question": "Kan ik alleen de slechtste zijde doen?",
        "answer": "Ja, deelprojecten zijn mogelijk."
      },
      {
        "question": "Is voorwerk echt nodig?",
        "answer": "Ja, zonder goed voorwerk gaat de levensduur omlaag."
      },
      {
        "question": "Voert VakConnect dit zelf uit?",
        "answer": "Nee, je wordt gekoppeld aan een passende schilder."
      }
    ],
    "cta": {
      "title": "Beschrijf je buitenschilderwerk-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over buitenschilderwerk, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Vraag buitenschilderwerk aan",
      "secondaryLabel": "Terug naar schilder",
      "secondaryHref": "/schilder"
    }
  },
  "schilder/kozijnen-schilderen": {
    "path": "/schilder/kozijnen-schilderen",
    "title": "Kozijnen schilderen via VakConnect",
    "description": "Kozijnen schilderen met oog voor bescherming en uitstraling: lees waarop je moet letten.",
    "keywords": [
      "schilder",
      "kozijnen-schilderen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Kozijnen schilderen: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij kozijnen schilderen? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Schilder",
        "href": "/schilder"
      },
      {
        "label": "Kozijnen schilderen"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer kozijnen schilderen in beeld komt",
        "paragraphs": [
          "Wanneer kozijnen schilderen in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer kozijnen schilderen in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van schilderwerk rond kozijnen schilderen concreet maken.",
          "Voor wanneer kozijnen schilderen in beeld komt beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Welke klachten je vaak ziet vóór schilderwerk — kozijnen schilderen",
        "paragraphs": [
          "Welke klachten je vaak ziet vóór schilderwerk — kozijnen schilderen: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij welke klachten je vaak ziet vóór schilderwerk — kozijnen schilderen tellen factoren zoals scheuren of bladders, doffe plekken en beginnende houtaantasting mee, omdat ze de omvang en aanpak van schilderwerk rond kozijnen schilderen concreet maken.",
          "Voor welke klachten je vaak ziet vóór schilderwerk — kozijnen schilderen beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "scheuren of bladders",
          "doffe plekken",
          "beginnende houtaantasting"
        ]
      },
      {
        "heading": "Oorzaken achter slijtage of slechte afwerking — kozijnen schilderen",
        "paragraphs": [
          "Oorzaken achter slijtage of slechte afwerking — kozijnen schilderen: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij oorzaken achter slijtage of slechte afwerking — kozijnen schilderen tellen factoren zoals verouderde verflaag, vocht in naden en intensieve zonbelasting mee, omdat ze de omvang en aanpak van schilderwerk rond kozijnen schilderen concreet maken.",
          "Voor oorzaken achter slijtage of slechte afwerking — kozijnen schilderen beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "verouderde verflaag",
          "vocht in naden",
          "intensieve zonbelasting"
        ]
      },
      {
        "heading": "Hoe een schilder de ondergrond beoordeelt (kozijnen schilderen) — kozijnen schilderen",
        "paragraphs": [
          "Hoe een schilder de ondergrond beoordeelt (kozijnen schilderen) — kozijnen schilderen: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij hoe een schilder de ondergrond beoordeelt (kozijnen schilderen) — kozijnen schilderen tellen factoren zoals conditie van hout beoordelen, herstellen en gronden en aflakken met geschikt systeem mee, omdat ze de omvang en aanpak van schilderwerk rond kozijnen schilderen concreet maken.",
          "Voor hoe een schilder de ondergrond beoordeelt (kozijnen schilderen) — kozijnen schilderen beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "conditie van hout beoordelen",
          "herstellen en gronden",
          "aflakken met geschikt systeem"
        ]
      },
      {
        "heading": "Keuzes in afwerking en combinatie met ander onderhoud — kozijnen schilderen",
        "paragraphs": [
          "Keuzes in afwerking en combinatie met ander onderhoud — kozijnen schilderen: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in afwerking en combinatie met ander onderhoud — kozijnen schilderen tellen factoren zoals binnenzijde, buitenzijde of beide en lokale herstelklus of volledig kozijnpakket mee, omdat ze de omvang en aanpak van schilderwerk rond kozijnen schilderen concreet maken.",
          "Voor keuzes in afwerking en combinatie met ander onderhoud — kozijnen schilderen beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "binnenzijde, buitenzijde of beide",
          "lokale herstelklus of volledig kozijnpakket"
        ]
      },
      {
        "heading": "Zo maak je je aanvraag concreet en vergelijkbaar — kozijnen schilderen",
        "paragraphs": [
          "Zo maak je je aanvraag concreet en vergelijkbaar — kozijnen schilderen: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij zo maak je je aanvraag concreet en vergelijkbaar — kozijnen schilderen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van schilderwerk rond kozijnen schilderen concreet maken.",
          "Voor zo maak je je aanvraag concreet en vergelijkbaar — kozijnen schilderen beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wat er gebeurt als je onderhoud te lang uitstelt — kozijnen schilderen",
        "paragraphs": [
          "Wat er gebeurt als je onderhoud te lang uitstelt — kozijnen schilderen: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij wat er gebeurt als je onderhoud te lang uitstelt — kozijnen schilderen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van schilderwerk rond kozijnen schilderen concreet maken.",
          "Voor wat er gebeurt als je onderhoud te lang uitstelt — kozijnen schilderen beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "aantal kozijnen",
      "staat van het hout",
      "bereikbaarheid",
      "noodzaak van kit- en herstelwerk"
    ],
    "processSteps": [
      "Beschrijf je vraag rond kozijnen schilderen en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende schilder-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/schilder",
        "title": "Schilder",
        "description": "Bekijk ook schilder voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/kozijnen/houten-kozijnen",
        "title": "Houten kozijnen",
        "description": "Bekijk ook houten kozijnen voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/schilder/buitenschilderwerk",
        "title": "Buitenschilderwerk",
        "description": "Bekijk ook buitenschilderwerk voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Moet kitwerk mee in deze klus?",
        "answer": "Bij verouderde naden is dat vaak verstandig."
      },
      {
        "question": "Kan ik kleur wijzigen?",
        "answer": "Ja, maar overleg over dekking en systeemopbouw is belangrijk."
      },
      {
        "question": "Hoe vaak onderhoud?",
        "answer": "Dat hangt af van ligging en belasting."
      },
      {
        "question": "Doet VakConnect het schilderen zelf?",
        "answer": "Nee, VakConnect koppelt je aan een specialist."
      }
    ],
    "cta": {
      "title": "Beschrijf je kozijnen schilderen-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over kozijnen schilderen, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Plaats je kozijnen-schilderaanvraag",
      "secondaryLabel": "Terug naar schilder",
      "secondaryHref": "/schilder"
    }
  },
  "schilder/deuren-schilderen": {
    "path": "/schilder/deuren-schilderen",
    "title": "Deuren schilderen via VakConnect",
    "description": "Binnen- of buitendeuren laten schilderen: lees wat bepalend is voor een slijtvaste afwerking.",
    "keywords": [
      "schilder",
      "deuren-schilderen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Deuren schilderen: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij deuren schilderen? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Schilder",
        "href": "/schilder"
      },
      {
        "label": "Deuren schilderen"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer deuren schilderen in beeld komt",
        "paragraphs": [
          "Wanneer deuren schilderen in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer deuren schilderen in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van schilderwerk rond deuren schilderen concreet maken.",
          "Voor wanneer deuren schilderen in beeld komt beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Welke klachten je vaak ziet vóór schilderwerk — deuren schilderen",
        "paragraphs": [
          "Welke klachten je vaak ziet vóór schilderwerk — deuren schilderen: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij welke klachten je vaak ziet vóór schilderwerk — deuren schilderen tellen factoren zoals krassen of stootplekken, slijtage rond handgrepen en oude lak die vergeling toont mee, omdat ze de omvang en aanpak van schilderwerk rond deuren schilderen concreet maken.",
          "Voor welke klachten je vaak ziet vóór schilderwerk — deuren schilderen beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "krassen of stootplekken",
          "slijtage rond handgrepen",
          "oude lak die vergeling toont"
        ]
      },
      {
        "heading": "Oorzaken achter slijtage of slechte afwerking — deuren schilderen",
        "paragraphs": [
          "Oorzaken achter slijtage of slechte afwerking — deuren schilderen: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij oorzaken achter slijtage of slechte afwerking — deuren schilderen tellen factoren zoals dagelijks gebruik, onvoldoende harde toplaag en vocht- of temperatuurbelasting mee, omdat ze de omvang en aanpak van schilderwerk rond deuren schilderen concreet maken.",
          "Voor oorzaken achter slijtage of slechte afwerking — deuren schilderen beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "dagelijks gebruik",
          "onvoldoende harde toplaag",
          "vocht- of temperatuurbelasting"
        ]
      },
      {
        "heading": "Hoe een schilder de ondergrond beoordeelt (deuren schilderen) — deuren schilderen",
        "paragraphs": [
          "Hoe een schilder de ondergrond beoordeelt (deuren schilderen) — deuren schilderen: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij hoe een schilder de ondergrond beoordeelt (deuren schilderen) — deuren schilderen tellen factoren zoals oppervlak voorbereiden, beschadigingen herstellen en aflakken met slijtvaste laag mee, omdat ze de omvang en aanpak van schilderwerk rond deuren schilderen concreet maken.",
          "Voor hoe een schilder de ondergrond beoordeelt (deuren schilderen) — deuren schilderen beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "oppervlak voorbereiden",
          "beschadigingen herstellen",
          "aflakken met slijtvaste laag"
        ]
      },
      {
        "heading": "Keuzes in afwerking en combinatie met ander onderhoud — deuren schilderen",
        "paragraphs": [
          "Keuzes in afwerking en combinatie met ander onderhoud — deuren schilderen: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in afwerking en combinatie met ander onderhoud — deuren schilderen tellen factoren zoals alle deuren tegelijk of gefaseerd en binnen en buiten apart plannen mee, omdat ze de omvang en aanpak van schilderwerk rond deuren schilderen concreet maken.",
          "Voor keuzes in afwerking en combinatie met ander onderhoud — deuren schilderen beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "alle deuren tegelijk of gefaseerd",
          "binnen en buiten apart plannen"
        ]
      },
      {
        "heading": "Zo maak je je aanvraag concreet en vergelijkbaar — deuren schilderen",
        "paragraphs": [
          "Zo maak je je aanvraag concreet en vergelijkbaar — deuren schilderen: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij zo maak je je aanvraag concreet en vergelijkbaar — deuren schilderen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van schilderwerk rond deuren schilderen concreet maken.",
          "Voor zo maak je je aanvraag concreet en vergelijkbaar — deuren schilderen beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wat er gebeurt als je onderhoud te lang uitstelt — deuren schilderen",
        "paragraphs": [
          "Wat er gebeurt als je onderhoud te lang uitstelt — deuren schilderen: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij wat er gebeurt als je onderhoud te lang uitstelt — deuren schilderen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van schilderwerk rond deuren schilderen concreet maken.",
          "Voor wat er gebeurt als je onderhoud te lang uitstelt — deuren schilderen beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "aantal deuren",
      "mate van herstelwerk",
      "demonteren beslag",
      "afwerking en droogtijd"
    ],
    "processSteps": [
      "Beschrijf je vraag rond deuren schilderen en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende schilder-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/schilder",
        "title": "Schilder",
        "description": "Bekijk ook schilder voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/schilder/binnenschilderwerk",
        "title": "Binnenschilderwerk",
        "description": "Bekijk ook binnenschilderwerk voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/schilder/buitenschilderwerk",
        "title": "Buitenschilderwerk",
        "description": "Bekijk ook buitenschilderwerk voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Moet beslag verwijderd worden?",
        "answer": "Voor een strak resultaat meestal wel."
      },
      {
        "question": "Kan dit op locatie?",
        "answer": "Ja, in veel situaties wel."
      },
      {
        "question": "Welke lak is geschikt?",
        "answer": "Dat hangt af van binnen- of buitentoepassing."
      },
      {
        "question": "Voert VakConnect dit werk zelf uit?",
        "answer": "Nee, VakConnect koppelt je aan een passende vakman."
      }
    ],
    "cta": {
      "title": "Beschrijf je deuren schilderen-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over deuren schilderen, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Start je deurenschilder-aanvraag",
      "secondaryLabel": "Terug naar schilder",
      "secondaryHref": "/schilder"
    }
  },
  "schilder/plafond-schilderen": {
    "path": "/schilder/plafond-schilderen",
    "title": "Plafond schilderen via VakConnect",
    "description": "Plafond schilderen zonder strepen: krijg inzicht in voorbereiding, productkeuze en uitvoering.",
    "keywords": [
      "schilder",
      "plafond-schilderen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Plafond schilderen: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij plafond schilderen? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Schilder",
        "href": "/schilder"
      },
      {
        "label": "Plafond schilderen"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer plafond schilderen in beeld komt",
        "paragraphs": [
          "Wanneer plafond schilderen in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer plafond schilderen in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van schilderwerk rond plafond schilderen concreet maken.",
          "Voor wanneer plafond schilderen in beeld komt beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Welke klachten je vaak ziet vóór schilderwerk — plafond schilderen",
        "paragraphs": [
          "Welke klachten je vaak ziet vóór schilderwerk — plafond schilderen: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij welke klachten je vaak ziet vóór schilderwerk — plafond schilderen tellen factoren zoals vlekken door vocht of rook, streperig eindbeeld en haarscheuren mee, omdat ze de omvang en aanpak van schilderwerk rond plafond schilderen concreet maken.",
          "Voor welke klachten je vaak ziet vóór schilderwerk — plafond schilderen beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "vlekken door vocht of rook",
          "streperig eindbeeld",
          "haarscheuren"
        ]
      },
      {
        "heading": "Oorzaken achter slijtage of slechte afwerking — plafond schilderen",
        "paragraphs": [
          "Oorzaken achter slijtage of slechte afwerking — plafond schilderen: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij oorzaken achter slijtage of slechte afwerking — plafond schilderen tellen factoren zoals onvoldoende voorstrijk, ondergrond niet egaal en verkeerde verfkeuze mee, omdat ze de omvang en aanpak van schilderwerk rond plafond schilderen concreet maken.",
          "Voor oorzaken achter slijtage of slechte afwerking — plafond schilderen beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "onvoldoende voorstrijk",
          "ondergrond niet egaal",
          "verkeerde verfkeuze"
        ]
      },
      {
        "heading": "Hoe een schilder de ondergrond beoordeelt (plafond schilderen) — plafond schilderen",
        "paragraphs": [
          "Hoe een schilder de ondergrond beoordeelt (plafond schilderen) — plafond schilderen: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij hoe een schilder de ondergrond beoordeelt (plafond schilderen) — plafond schilderen tellen factoren zoals ondergrond reinigen en voorbereiden, lokale herstelpunten aanpakken en baangewijs afwerken voor egaal resultaat mee, omdat ze de omvang en aanpak van schilderwerk rond plafond schilderen concreet maken.",
          "Voor hoe een schilder de ondergrond beoordeelt (plafond schilderen) — plafond schilderen beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "ondergrond reinigen en voorbereiden",
          "lokale herstelpunten aanpakken",
          "baangewijs afwerken voor egaal resultaat"
        ]
      },
      {
        "heading": "Keuzes in afwerking en combinatie met ander onderhoud — plafond schilderen",
        "paragraphs": [
          "Keuzes in afwerking en combinatie met ander onderhoud — plafond schilderen: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in afwerking en combinatie met ander onderhoud — plafond schilderen tellen factoren zoals alleen plafond of combinatie met wand en standaard verf of vochtbestendige variant mee, omdat ze de omvang en aanpak van schilderwerk rond plafond schilderen concreet maken.",
          "Voor keuzes in afwerking en combinatie met ander onderhoud — plafond schilderen beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "alleen plafond of combinatie met wand",
          "standaard verf of vochtbestendige variant"
        ]
      },
      {
        "heading": "Zo maak je je aanvraag concreet en vergelijkbaar — plafond schilderen",
        "paragraphs": [
          "Zo maak je je aanvraag concreet en vergelijkbaar — plafond schilderen: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij zo maak je je aanvraag concreet en vergelijkbaar — plafond schilderen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van schilderwerk rond plafond schilderen concreet maken.",
          "Voor zo maak je je aanvraag concreet en vergelijkbaar — plafond schilderen beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wat er gebeurt als je onderhoud te lang uitstelt — plafond schilderen",
        "paragraphs": [
          "Wat er gebeurt als je onderhoud te lang uitstelt — plafond schilderen: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij wat er gebeurt als je onderhoud te lang uitstelt — plafond schilderen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van schilderwerk rond plafond schilderen concreet maken.",
          "Voor wat er gebeurt als je onderhoud te lang uitstelt — plafond schilderen beoordeelt een schilder meestal welke stap logisch volgt; zonder die afweging neemt de kans op snelle slijtage van ondergronden toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "oppervlakte",
      "aantal herstelplekken",
      "hoogte en bereikbaarheid",
      "productkeuze"
    ],
    "processSteps": [
      "Beschrijf je vraag rond plafond schilderen en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende schilder-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/schilder",
        "title": "Schilder",
        "description": "Bekijk ook schilder voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/schilder/binnenschilderwerk",
        "title": "Binnenschilderwerk",
        "description": "Bekijk ook binnenschilderwerk voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/badkamer/ventilatie",
        "title": "Badkamerventilatie",
        "description": "Bekijk ook badkamerventilatie voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Waarom zie ik banen in strijklicht?",
        "answer": "Dat kan door verschil in dekking of verwerking ontstaan."
      },
      {
        "question": "Moet oude laag eraf?",
        "answer": "Niet altijd, wel moet losse of slechte laag worden aangepakt."
      },
      {
        "question": "Kan dit in één dag?",
        "answer": "Dat hangt af van droogtijd en aantal lagen."
      },
      {
        "question": "Doet VakConnect dit zelf?",
        "answer": "Nee, VakConnect koppelt je aan een passende schilder."
      }
    ],
    "cta": {
      "title": "Beschrijf je plafond schilderen-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over plafond schilderen, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Vraag plafond-schilderwerk aan",
      "secondaryLabel": "Terug naar schilder",
      "secondaryHref": "/schilder"
    }
  },
  "loodgieter/lekkage": {
    "path": "/loodgieter/lekkage",
    "title": "Loodgieter lekkage via VakConnect",
    "description": "Lekkage aan leiding, koppeling of sanitair? Lees hoe beoordeling en herstel doorgaans verlopen.",
    "keywords": [
      "loodgieter",
      "lekkage",
      "vakman",
      "VakConnect"
    ],
    "h1": "Loodgieter lekkage: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij loodgieter lekkage? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Loodgieter",
        "href": "/loodgieter"
      },
      {
        "label": "Loodgieter lekkage"
      }
    ],
    "sections": [
      {
        "heading": "Van eerste lekkagesignaal naar gerichte diagnose",
        "paragraphs": [
          "Van eerste lekkagesignaal naar gerichte diagnose: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij van eerste lekkagesignaal naar gerichte diagnose tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond lekkage concreet maken.",
          "Voor van eerste lekkagesignaal naar gerichte diagnose beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen die duiden op een loodgietersprobleem — lekkage",
        "paragraphs": [
          "Signalen die duiden op een loodgietersprobleem — lekkage: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen die duiden op een loodgietersprobleem — lekkage tellen factoren zoals druppels bij koppelingen, vochtkringen in kast of wand, drukverlies en onverklaarbare vochtgeur mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond lekkage concreet maken.",
          "Voor signalen die duiden op een loodgietersprobleem — lekkage beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "druppels bij koppelingen",
          "vochtkringen in kast of wand",
          "drukverlies",
          "onverklaarbare vochtgeur"
        ]
      },
      {
        "heading": "Technische oorzaken die vaak terugkomen — lekkage",
        "paragraphs": [
          "Technische oorzaken die vaak terugkomen — lekkage: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij technische oorzaken die vaak terugkomen — lekkage tellen factoren zoals versleten koppelingen, haarscheur in leiding, slechte afdichting en oude appendages mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond lekkage concreet maken.",
          "Voor technische oorzaken die vaak terugkomen — lekkage beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "versleten koppelingen",
          "haarscheur in leiding",
          "slechte afdichting",
          "oude appendages"
        ]
      },
      {
        "heading": "Diagnose en eerste aanpak door een loodgieter (lekkage) — lekkage",
        "paragraphs": [
          "Diagnose en eerste aanpak door een loodgieter (lekkage) — lekkage: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij diagnose en eerste aanpak door een loodgieter (lekkage) — lekkage tellen factoren zoals lekbron bepalen, tijdelijk beperken van schade, defect deel vervangen en controle op vervolgschade mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond lekkage concreet maken.",
          "Voor diagnose en eerste aanpak door een loodgieter (lekkage) — lekkage beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "lekbron bepalen",
          "tijdelijk beperken van schade",
          "defect deel vervangen",
          "controle op vervolgschade"
        ]
      },
      {
        "heading": "Keuzes tussen noodoplossing en definitieve reparatie — lekkage",
        "paragraphs": [
          "Keuzes tussen noodoplossing en definitieve reparatie — lekkage: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes tussen noodoplossing en definitieve reparatie — lekkage tellen factoren zoals noodherstel gevolgd door definitief herstel, lokaal vervangen of groter leidingdeel vernieuwen en combinatie met sanitair- of renovatiewerk mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond lekkage concreet maken.",
          "Voor keuzes tussen noodoplossing en definitieve reparatie — lekkage beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "noodherstel gevolgd door definitief herstel",
          "lokaal vervangen of groter leidingdeel vernieuwen",
          "combinatie met sanitair- of renovatiewerk"
        ]
      },
      {
        "heading": "Welke gegevens je direct moet aanleveren — lekkage",
        "paragraphs": [
          "Welke gegevens je direct moet aanleveren — lekkage: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke gegevens je direct moet aanleveren — lekkage tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond lekkage concreet maken.",
          "Voor welke gegevens je direct moet aanleveren — lekkage beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Risico bij uitstel van lekkage of verstopping — lekkage",
        "paragraphs": [
          "Risico bij uitstel van lekkage of verstopping — lekkage: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij risico bij uitstel van lekkage of verstopping — lekkage tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond lekkage concreet maken.",
          "Voor risico bij uitstel van lekkage of verstopping — lekkage beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "type": "warning"
      },
      {
        "heading": "Praktische planning en bereikbaarheid van leidingen — lekkage",
        "paragraphs": [
          "Praktische planning en bereikbaarheid van leidingen — lekkage: Een zorgvuldige beoordeling van dit onderdeel maakt offertes beter vergelijkbaar en realistischer.",
          "Bij praktische planning en bereikbaarheid van leidingen — lekkage tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond lekkage concreet maken.",
          "Voor praktische planning en bereikbaarheid van leidingen — lekkage beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "diagnosetijd",
      "toegankelijkheid van leklocatie",
      "onderdelen en vervanging",
      "herstel van opengebroken afwerking",
      "spoedinzet"
    ],
    "processSteps": [
      "Beschrijf je vraag rond loodgieter lekkage en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende loodgieter-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/loodgieter",
        "title": "Loodgieter",
        "description": "Bekijk ook loodgieter voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/loodgieter/spoed",
        "title": "Spoed loodgieter",
        "description": "Bekijk ook spoed loodgieter voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/badkamer/sanitair",
        "title": "Badkamer sanitair",
        "description": "Bekijk ook badkamer sanitair voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/dakdekker/daklekkage",
        "title": "Daklekkage",
        "description": "Bekijk ook daklekkage voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Is een kleine druppellekkage ernstig?",
        "answer": "Vaak wel op termijn, omdat continu vocht snel schade opbouwt."
      },
      {
        "question": "Wat doe ik eerst bij actieve lekkage?",
        "answer": "Beperk indien mogelijk de watertoevoer en leg de situatie direct vast in je aanvraag."
      },
      {
        "question": "Waarom kan lekkage terugkomen?",
        "answer": "Als onderliggende oorzaak niet volledig is opgelost."
      },
      {
        "question": "Welke info versnelt opvolging?",
        "answer": "Locatie, beginmoment, foto’s en eventuele eerdere reparatie."
      },
      {
        "question": "Doet VakConnect het herstel zelf?",
        "answer": "Nee, VakConnect koppelt je aan een passende loodgieter."
      }
    ],
    "cta": {
      "title": "Beschrijf je loodgieter lekkage-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over lekkage, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Plaats je lekkage-aanvraag",
      "secondaryLabel": "Terug naar loodgieter",
      "secondaryHref": "/loodgieter"
    }
  },
  "loodgieter/verstopping": {
    "path": "/loodgieter/verstopping",
    "title": "Verstopping via VakConnect",
    "description": "Hardnekkige verstopping? Ontdek oorzaken, diagnose en wat de omvang van de oplossing bepaalt.",
    "keywords": [
      "loodgieter",
      "verstopping",
      "vakman",
      "VakConnect"
    ],
    "h1": "Verstopping: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij verstopping? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Loodgieter",
        "href": "/loodgieter"
      },
      {
        "label": "Verstopping"
      }
    ],
    "sections": [
      {
        "heading": "Waarom verstoppingen terugkomen en hoe je dat voorkomt",
        "paragraphs": [
          "Waarom verstoppingen terugkomen en hoe je dat voorkomt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij waarom verstoppingen terugkomen en hoe je dat voorkomt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond verstopping concreet maken.",
          "Voor waarom verstoppingen terugkomen en hoe je dat voorkomt beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen die duiden op een loodgietersprobleem — verstopping",
        "paragraphs": [
          "Signalen die duiden op een loodgietersprobleem — verstopping: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen die duiden op een loodgietersprobleem — verstopping tellen factoren zoals langzaam weglopend water, borrelende geluiden, terugslag in meerdere afvoeren en geurhinder mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond verstopping concreet maken.",
          "Voor signalen die duiden op een loodgietersprobleem — verstopping beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "langzaam weglopend water",
          "borrelende geluiden",
          "terugslag in meerdere afvoeren",
          "geurhinder"
        ]
      },
      {
        "heading": "Technische oorzaken die vaak terugkomen — verstopping",
        "paragraphs": [
          "Technische oorzaken die vaak terugkomen — verstopping: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij technische oorzaken die vaak terugkomen — verstopping tellen factoren zoals vet- en zeepresten, opbouw in leidingtraject, vreemde voorwerpen en beperkte helling mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond verstopping concreet maken.",
          "Voor technische oorzaken die vaak terugkomen — verstopping beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "vet- en zeepresten",
          "opbouw in leidingtraject",
          "vreemde voorwerpen",
          "beperkte helling"
        ]
      },
      {
        "heading": "Diagnose en eerste aanpak door een loodgieter (verstopping) — verstopping",
        "paragraphs": [
          "Diagnose en eerste aanpak door een loodgieter (verstopping) — verstopping: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij diagnose en eerste aanpak door een loodgieter (verstopping) — verstopping tellen factoren zoals vaststellen waar blokkade zit, mechanisch of met apparatuur vrijmaken, controleren op structurele oorzaak en nazicht van doorstroming mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond verstopping concreet maken.",
          "Voor diagnose en eerste aanpak door een loodgieter (verstopping) — verstopping beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "vaststellen waar blokkade zit",
          "mechanisch of met apparatuur vrijmaken",
          "controleren op structurele oorzaak",
          "nazicht van doorstroming"
        ]
      },
      {
        "heading": "Keuzes tussen noodoplossing en definitieve reparatie — verstopping",
        "paragraphs": [
          "Keuzes tussen noodoplossing en definitieve reparatie — verstopping: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes tussen noodoplossing en definitieve reparatie — verstopping tellen factoren zoals acute ontstopping of bredere inspectie, deeltraject vervangen bij terugkerende problemen en combinatie met afvoeroptimalisatie mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond verstopping concreet maken.",
          "Voor keuzes tussen noodoplossing en definitieve reparatie — verstopping beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "acute ontstopping of bredere inspectie",
          "deeltraject vervangen bij terugkerende problemen",
          "combinatie met afvoeroptimalisatie"
        ]
      },
      {
        "heading": "Welke gegevens je direct moet aanleveren — verstopping",
        "paragraphs": [
          "Welke gegevens je direct moet aanleveren — verstopping: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke gegevens je direct moet aanleveren — verstopping tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond verstopping concreet maken.",
          "Voor welke gegevens je direct moet aanleveren — verstopping beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Risico bij uitstel van lekkage of verstopping — verstopping",
        "paragraphs": [
          "Risico bij uitstel van lekkage of verstopping — verstopping: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij risico bij uitstel van lekkage of verstopping — verstopping tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond verstopping concreet maken.",
          "Voor risico bij uitstel van lekkage of verstopping — verstopping beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "type": "warning"
      },
      {
        "heading": "Praktische planning en bereikbaarheid van leidingen — verstopping",
        "paragraphs": [
          "Praktische planning en bereikbaarheid van leidingen — verstopping: Een zorgvuldige beoordeling van dit onderdeel maakt offertes beter vergelijkbaar en realistischer.",
          "Bij praktische planning en bereikbaarheid van leidingen — verstopping tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond verstopping concreet maken.",
          "Voor praktische planning en bereikbaarheid van leidingen — verstopping beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "locatie van blokkade",
      "toegang tot afvoer",
      "benodigde apparatuur",
      "duur van vrijmaken en controle",
      "eventueel vervolgwerk"
    ],
    "processSteps": [
      "Beschrijf je vraag rond verstopping en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende loodgieter-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/loodgieter",
        "title": "Loodgieter",
        "description": "Bekijk ook loodgieter voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/loodgieter/afvoer",
        "title": "Afvoer",
        "description": "Bekijk ook afvoer voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/loodgieter/spoed",
        "title": "Spoed loodgieter",
        "description": "Bekijk ook spoed loodgieter voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Waarom werkt een huis-tuin-oplossing soms niet?",
        "answer": "Omdat de blokkade vaak dieper in het systeem zit dan het zichtbare sifon."
      },
      {
        "question": "Wanneer is terugkerende verstopping een signaal?",
        "answer": "Als klachten kort na elkaar terugkomen, is extra diagnose meestal nodig."
      },
      {
        "question": "Kan verstopping ook buiten de woning zitten?",
        "answer": "Ja, afhankelijk van het traject kan de oorzaak verderop liggen."
      },
      {
        "question": "Welke details zet ik in de aanvraag?",
        "answer": "Waar het optreedt, hoe vaak en of meerdere afvoeren tegelijk last hebben."
      },
      {
        "question": "Voert VakConnect de ontstopping uit?",
        "answer": "Nee, VakConnect koppelt je aan een passende professional."
      }
    ],
    "cta": {
      "title": "Beschrijf je verstopping-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over verstopping, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Start je verstoppingsaanvraag",
      "secondaryLabel": "Terug naar loodgieter",
      "secondaryHref": "/loodgieter"
    }
  },
  "loodgieter/leidingwerk": {
    "path": "/loodgieter/leidingwerk",
    "title": "Leidingwerk via VakConnect",
    "description": "Leidingwerk verleggen of vernieuwen? Lees waar je rekening mee houdt bij planning en uitvoering.",
    "keywords": [
      "loodgieter",
      "leidingwerk",
      "vakman",
      "VakConnect"
    ],
    "h1": "Leidingwerk: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij leidingwerk? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Loodgieter",
        "href": "/loodgieter"
      },
      {
        "label": "Leidingwerk"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer leidingwerk in beeld komt",
        "paragraphs": [
          "Wanneer leidingwerk in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer leidingwerk in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond leidingwerk concreet maken.",
          "Voor wanneer leidingwerk in beeld komt beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen die duiden op een loodgietersprobleem — leidingwerk",
        "paragraphs": [
          "Signalen die duiden op een loodgietersprobleem — leidingwerk: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen die duiden op een loodgietersprobleem — leidingwerk tellen factoren zoals nieuwe keuken- of badkamerindeling, oude leidingen met storingen en druk- of temperatuurproblemen mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond leidingwerk concreet maken.",
          "Voor signalen die duiden op een loodgietersprobleem — leidingwerk beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "nieuwe keuken- of badkamerindeling",
          "oude leidingen met storingen",
          "druk- of temperatuurproblemen"
        ]
      },
      {
        "heading": "Technische oorzaken die vaak terugkomen — leidingwerk",
        "paragraphs": [
          "Technische oorzaken die vaak terugkomen — leidingwerk: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij technische oorzaken die vaak terugkomen — leidingwerk tellen factoren zoals veroudering, onlogische routing en nieuwe functies in ruimte mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond leidingwerk concreet maken.",
          "Voor technische oorzaken die vaak terugkomen — leidingwerk beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "veroudering",
          "onlogische routing",
          "nieuwe functies in ruimte"
        ]
      },
      {
        "heading": "Diagnose en eerste aanpak door een loodgieter (leidingwerk) — leidingwerk",
        "paragraphs": [
          "Diagnose en eerste aanpak door een loodgieter (leidingwerk) — leidingwerk: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij diagnose en eerste aanpak door een loodgieter (leidingwerk) — leidingwerk tellen factoren zoals route en aansluitpunten bepalen, leidingen aanpassen of vervangen en druk en dichtheid testen mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond leidingwerk concreet maken.",
          "Voor diagnose en eerste aanpak door een loodgieter (leidingwerk) — leidingwerk beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "route en aansluitpunten bepalen",
          "leidingen aanpassen of vervangen",
          "druk en dichtheid testen"
        ]
      },
      {
        "heading": "Keuzes tussen noodoplossing en definitieve reparatie — leidingwerk",
        "paragraphs": [
          "Keuzes tussen noodoplossing en definitieve reparatie — leidingwerk: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes tussen noodoplossing en definitieve reparatie — leidingwerk tellen factoren zoals gefaseerde uitvoering, open of weggewerkte route en combinatie met afbouw- of tegelwerk mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond leidingwerk concreet maken.",
          "Voor keuzes tussen noodoplossing en definitieve reparatie — leidingwerk beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "gefaseerde uitvoering",
          "open of weggewerkte route",
          "combinatie met afbouw- of tegelwerk"
        ]
      },
      {
        "heading": "Welke gegevens je direct moet aanleveren — leidingwerk",
        "paragraphs": [
          "Welke gegevens je direct moet aanleveren — leidingwerk: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke gegevens je direct moet aanleveren — leidingwerk tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond leidingwerk concreet maken.",
          "Voor welke gegevens je direct moet aanleveren — leidingwerk beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Risico bij uitstel van lekkage of verstopping — leidingwerk",
        "paragraphs": [
          "Risico bij uitstel van lekkage of verstopping — leidingwerk: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij risico bij uitstel van lekkage of verstopping — leidingwerk tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond leidingwerk concreet maken.",
          "Voor risico bij uitstel van lekkage of verstopping — leidingwerk beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "lengte en route van leidingen",
      "toegang achter wand of vloer",
      "materiaal en appendages",
      "herstel van afwerking"
    ],
    "processSteps": [
      "Beschrijf je vraag rond leidingwerk en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende loodgieter-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/loodgieter",
        "title": "Loodgieter",
        "description": "Bekijk ook loodgieter voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/badkamer/renovatie",
        "title": "Badkamerrenovatie",
        "description": "Bekijk ook badkamerrenovatie voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/verbouwing/keuken-verbouwen",
        "title": "Keuken verbouwen",
        "description": "Bekijk ook keuken verbouwen voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Moet alles opengebroken worden?",
        "answer": "Niet altijd, dit hangt af van de gekozen route."
      },
      {
        "question": "Wanneer vervang ik volledig?",
        "answer": "Bij brede slijtage of wanneer nieuwe indeling dat vraagt."
      },
      {
        "question": "Is een schets voldoende voor aanvraag?",
        "answer": "Ja, een globale schets en foto’s helpen al veel."
      },
      {
        "question": "Doet VakConnect dit werk zelf?",
        "answer": "Nee, je wordt gekoppeld aan een passende specialist."
      }
    ],
    "cta": {
      "title": "Beschrijf je leidingwerk-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over leidingwerk, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Beschrijf je leidingwerkklus",
      "secondaryLabel": "Terug naar loodgieter",
      "secondaryHref": "/loodgieter"
    }
  },
  "loodgieter/sanitair": {
    "path": "/loodgieter/sanitair",
    "title": "Sanitair via VakConnect",
    "description": "Sanitair plaatsen of vervangen: ontdek welke voorbereiding en keuzes belangrijk zijn.",
    "keywords": [
      "loodgieter",
      "sanitair",
      "vakman",
      "VakConnect"
    ],
    "h1": "Sanitair: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij sanitair? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Loodgieter",
        "href": "/loodgieter"
      },
      {
        "label": "Sanitair"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer sanitair in beeld komt",
        "paragraphs": [
          "Wanneer sanitair in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer sanitair in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond sanitair concreet maken.",
          "Voor wanneer sanitair in beeld komt beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen die duiden op een loodgietersprobleem — sanitair",
        "paragraphs": [
          "Signalen die duiden op een loodgietersprobleem — sanitair: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen die duiden op een loodgietersprobleem — sanitair tellen factoren zoals lekkende aansluiting, versleten sanitair en onpraktische opstelling mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond sanitair concreet maken.",
          "Voor signalen die duiden op een loodgietersprobleem — sanitair beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "lekkende aansluiting",
          "versleten sanitair",
          "onpraktische opstelling"
        ]
      },
      {
        "heading": "Technische oorzaken die vaak terugkomen — sanitair",
        "paragraphs": [
          "Technische oorzaken die vaak terugkomen — sanitair: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij technische oorzaken die vaak terugkomen — sanitair tellen factoren zoals slijtage, verouderde aansluitpunten en gewijzigde woonwensen mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond sanitair concreet maken.",
          "Voor technische oorzaken die vaak terugkomen — sanitair beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "slijtage",
          "verouderde aansluitpunten",
          "gewijzigde woonwensen"
        ]
      },
      {
        "heading": "Diagnose en eerste aanpak door een loodgieter (sanitair) — sanitair",
        "paragraphs": [
          "Diagnose en eerste aanpak door een loodgieter (sanitair) — sanitair: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij diagnose en eerste aanpak door een loodgieter (sanitair) — sanitair tellen factoren zoals demontage en voorbereiding, nieuw sanitair aansluiten en afstellen en afdichten mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond sanitair concreet maken.",
          "Voor diagnose en eerste aanpak door een loodgieter (sanitair) — sanitair beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "demontage en voorbereiding",
          "nieuw sanitair aansluiten",
          "afstellen en afdichten"
        ]
      },
      {
        "heading": "Keuzes tussen noodoplossing en definitieve reparatie — sanitair",
        "paragraphs": [
          "Keuzes tussen noodoplossing en definitieve reparatie — sanitair: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes tussen noodoplossing en definitieve reparatie — sanitair tellen factoren zoals deelvervanging of compleet pakket, eigen producten aanleveren of advies volgen en combinatie met tegelwerk mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond sanitair concreet maken.",
          "Voor keuzes tussen noodoplossing en definitieve reparatie — sanitair beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "deelvervanging of compleet pakket",
          "eigen producten aanleveren of advies volgen",
          "combinatie met tegelwerk"
        ]
      },
      {
        "heading": "Welke gegevens je direct moet aanleveren — sanitair",
        "paragraphs": [
          "Welke gegevens je direct moet aanleveren — sanitair: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke gegevens je direct moet aanleveren — sanitair tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond sanitair concreet maken.",
          "Voor welke gegevens je direct moet aanleveren — sanitair beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Risico bij uitstel van lekkage of verstopping — sanitair",
        "paragraphs": [
          "Risico bij uitstel van lekkage of verstopping — sanitair: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij risico bij uitstel van lekkage of verstopping — sanitair tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond sanitair concreet maken.",
          "Voor risico bij uitstel van lekkage of verstopping — sanitair beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "type sanitair en maatvoering",
      "aanpassingen aan leidingwerk",
      "montagetijd en afwerking",
      "extra kit- of voegwerk"
    ],
    "processSteps": [
      "Beschrijf je vraag rond sanitair en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende loodgieter-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/loodgieter",
        "title": "Loodgieter",
        "description": "Bekijk ook loodgieter voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/badkamer/sanitair",
        "title": "Badkamer sanitair",
        "description": "Bekijk ook badkamer sanitair voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/badkamer/complete-badkamer",
        "title": "Complete badkamer",
        "description": "Bekijk ook complete badkamer voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Kan ik alleen de kraan of wc vervangen?",
        "answer": "Ja, deelklussen zijn mogelijk."
      },
      {
        "question": "Wanneer moet leidingwerk mee?",
        "answer": "Bij nieuwe posities of afwijkende aansluitmaten."
      },
      {
        "question": "Moet ik alle producten al hebben?",
        "answer": "Nee, je kunt ook eerst advies vragen."
      },
      {
        "question": "Voert VakConnect de montage uit?",
        "answer": "Nee, VakConnect koppelt je aan een passende loodgieter."
      }
    ],
    "cta": {
      "title": "Beschrijf je sanitair-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over sanitair, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Start je sanitair-aanvraag",
      "secondaryLabel": "Terug naar loodgieter",
      "secondaryHref": "/loodgieter"
    }
  },
  "loodgieter/spoed": {
    "path": "/loodgieter/spoed",
    "title": "Spoed loodgieter via VakConnect",
    "description": "Spoedprobleem met water of afvoer? Lees wat je direct in je aanvraag moet zetten.",
    "keywords": [
      "loodgieter",
      "spoed",
      "vakman",
      "VakConnect"
    ],
    "h1": "Spoed loodgieter: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij spoed loodgieter? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Loodgieter",
        "href": "/loodgieter"
      },
      {
        "label": "Spoed loodgieter"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer spoed loodgieter in beeld komt",
        "paragraphs": [
          "Wanneer spoed loodgieter in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer spoed loodgieter in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond spoed concreet maken.",
          "Voor wanneer spoed loodgieter in beeld komt beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen die duiden op een loodgietersprobleem — spoed",
        "paragraphs": [
          "Signalen die duiden op een loodgietersprobleem — spoed: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen die duiden op een loodgietersprobleem — spoed tellen factoren zoals actieve lekkage, volledige blokkade en snel oplopende waterschade mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond spoed concreet maken.",
          "Voor signalen die duiden op een loodgietersprobleem — spoed beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "actieve lekkage",
          "volledige blokkade",
          "snel oplopende waterschade"
        ]
      },
      {
        "heading": "Technische oorzaken die vaak terugkomen — spoed",
        "paragraphs": [
          "Technische oorzaken die vaak terugkomen — spoed: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij technische oorzaken die vaak terugkomen — spoed tellen factoren zoals gesprongen verbinding, acute verstopping en defect afsluitpunt mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond spoed concreet maken.",
          "Voor technische oorzaken die vaak terugkomen — spoed beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "gesprongen verbinding",
          "acute verstopping",
          "defect afsluitpunt"
        ]
      },
      {
        "heading": "Diagnose en eerste aanpak door een loodgieter (spoed) — spoed",
        "paragraphs": [
          "Diagnose en eerste aanpak door een loodgieter (spoed) — spoed: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij diagnose en eerste aanpak door een loodgieter (spoed) — spoed tellen factoren zoals situatie veilig maken, snelle diagnose en noodmaatregel en vervolgplan mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond spoed concreet maken.",
          "Voor diagnose en eerste aanpak door een loodgieter (spoed) — spoed beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "situatie veilig maken",
          "snelle diagnose",
          "noodmaatregel en vervolgplan"
        ]
      },
      {
        "heading": "Keuzes tussen noodoplossing en definitieve reparatie — spoed",
        "paragraphs": [
          "Keuzes tussen noodoplossing en definitieve reparatie — spoed: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes tussen noodoplossing en definitieve reparatie — spoed tellen factoren zoals tijdelijk beperken of direct definitief herstel en combineren met vervolginspectie mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond spoed concreet maken.",
          "Voor keuzes tussen noodoplossing en definitieve reparatie — spoed beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "tijdelijk beperken of direct definitief herstel",
          "combineren met vervolginspectie"
        ]
      },
      {
        "heading": "Welke gegevens je direct moet aanleveren — spoed",
        "paragraphs": [
          "Welke gegevens je direct moet aanleveren — spoed: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke gegevens je direct moet aanleveren — spoed tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond spoed concreet maken.",
          "Voor welke gegevens je direct moet aanleveren — spoed beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Risico bij uitstel van lekkage of verstopping — spoed",
        "paragraphs": [
          "Risico bij uitstel van lekkage of verstopping — spoed: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij risico bij uitstel van lekkage of verstopping — spoed tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond spoed concreet maken.",
          "Voor risico bij uitstel van lekkage of verstopping — spoed beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "tijdstip van inzet",
      "bereikbaarheid",
      "schadebeperkende maatregelen",
      "definitieve herstelstappen"
    ],
    "processSteps": [
      "Beschrijf je vraag rond spoed loodgieter en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende loodgieter-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/loodgieter",
        "title": "Loodgieter",
        "description": "Bekijk ook loodgieter voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/loodgieter/lekkage",
        "title": "Loodgieter lekkage",
        "description": "Bekijk ook loodgieter lekkage voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/dakdekker/daklekkage",
        "title": "Daklekkage",
        "description": "Bekijk ook daklekkage voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Welke info helpt bij spoed het meest?",
        "answer": "Exacte locatie, type probleem en actuele ernst."
      },
      {
        "question": "Moet ik foto’s toevoegen?",
        "answer": "Ja, als dat veilig kan versnelt dat de beoordeling."
      },
      {
        "question": "Is spoed altijd direct oplosbaar?",
        "answer": "Soms is eerst een noodmaatregel nodig, gevolgd door definitief herstel."
      },
      {
        "question": "Doet VakConnect spoedherstel zelf?",
        "answer": "Nee, VakConnect koppelt je aan een passende professional."
      }
    ],
    "cta": {
      "title": "Beschrijf je spoed loodgieter-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over spoed, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Plaats een spoedaanvraag",
      "secondaryLabel": "Terug naar loodgieter",
      "secondaryHref": "/loodgieter"
    }
  },
  "loodgieter/afvoer": {
    "path": "/loodgieter/afvoer",
    "title": "Afvoer via VakConnect",
    "description": "Afvoerproblemen structureel aanpakken: van diagnose tot herstelopties.",
    "keywords": [
      "loodgieter",
      "afvoer",
      "vakman",
      "VakConnect"
    ],
    "h1": "Afvoer: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij afvoer? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Loodgieter",
        "href": "/loodgieter"
      },
      {
        "label": "Afvoer"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer afvoer in beeld komt",
        "paragraphs": [
          "Wanneer afvoer in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer afvoer in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond afvoer concreet maken.",
          "Voor wanneer afvoer in beeld komt beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen die duiden op een loodgietersprobleem — afvoer",
        "paragraphs": [
          "Signalen die duiden op een loodgietersprobleem — afvoer: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen die duiden op een loodgietersprobleem — afvoer tellen factoren zoals langzame afvoer, regelmatige geurhinder en terugkerende blokkades mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond afvoer concreet maken.",
          "Voor signalen die duiden op een loodgietersprobleem — afvoer beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "langzame afvoer",
          "regelmatige geurhinder",
          "terugkerende blokkades"
        ]
      },
      {
        "heading": "Technische oorzaken die vaak terugkomen — afvoer",
        "paragraphs": [
          "Technische oorzaken die vaak terugkomen — afvoer: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij technische oorzaken die vaak terugkomen — afvoer tellen factoren zoals ophoping, beperkte helling en lokale beschadiging mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond afvoer concreet maken.",
          "Voor technische oorzaken die vaak terugkomen — afvoer beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "ophoping",
          "beperkte helling",
          "lokale beschadiging"
        ]
      },
      {
        "heading": "Diagnose en eerste aanpak door een loodgieter (afvoer) — afvoer",
        "paragraphs": [
          "Diagnose en eerste aanpak door een loodgieter (afvoer) — afvoer: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij diagnose en eerste aanpak door een loodgieter (afvoer) — afvoer tellen factoren zoals afvoertraject controleren, blokkades verwijderen en vervangingsadvies bij structurele gebreken mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond afvoer concreet maken.",
          "Voor diagnose en eerste aanpak door een loodgieter (afvoer) — afvoer beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "afvoertraject controleren",
          "blokkades verwijderen",
          "vervangingsadvies bij structurele gebreken"
        ]
      },
      {
        "heading": "Keuzes tussen noodoplossing en definitieve reparatie — afvoer",
        "paragraphs": [
          "Keuzes tussen noodoplossing en definitieve reparatie — afvoer: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes tussen noodoplossing en definitieve reparatie — afvoer tellen factoren zoals periodiek onderhoud, deelvervanging van traject en combinatie met verstoppingsanalyse mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond afvoer concreet maken.",
          "Voor keuzes tussen noodoplossing en definitieve reparatie — afvoer beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "periodiek onderhoud",
          "deelvervanging van traject",
          "combinatie met verstoppingsanalyse"
        ]
      },
      {
        "heading": "Welke gegevens je direct moet aanleveren — afvoer",
        "paragraphs": [
          "Welke gegevens je direct moet aanleveren — afvoer: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke gegevens je direct moet aanleveren — afvoer tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond afvoer concreet maken.",
          "Voor welke gegevens je direct moet aanleveren — afvoer beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Risico bij uitstel van lekkage of verstopping — afvoer",
        "paragraphs": [
          "Risico bij uitstel van lekkage of verstopping — afvoer: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij risico bij uitstel van lekkage of verstopping — afvoer tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van water- en afvoerwerk rond afvoer concreet maken.",
          "Voor risico bij uitstel van lekkage of verstopping — afvoer beoordeelt een loodgieter meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtschade en hygiëneproblemen toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "lengte en ligging traject",
      "bereikbaarheid",
      "apparatuur en inspectie",
      "herstelwerk"
    ],
    "processSteps": [
      "Beschrijf je vraag rond afvoer en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende loodgieter-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/loodgieter",
        "title": "Loodgieter",
        "description": "Bekijk ook loodgieter voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/loodgieter/verstopping",
        "title": "Verstopping",
        "description": "Bekijk ook verstopping voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/dakdekker/dakgoot",
        "title": "Dakgoot",
        "description": "Bekijk ook dakgoot voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Waarom komt geur terug na ontstoppen?",
        "answer": "Omdat de onderliggende oorzaak soms niet volledig is weggenomen."
      },
      {
        "question": "Is camera-inspectie altijd nodig?",
        "answer": "Niet altijd, maar bij terugkerende klachten vaak wel zinvol."
      },
      {
        "question": "Kan dit zonder breekwerk?",
        "answer": "Soms wel, afhankelijk van locatie van het probleem."
      },
      {
        "question": "Voert VakConnect zelf herstel uit?",
        "answer": "Nee, je wordt gekoppeld aan een passende loodgieter."
      }
    ],
    "cta": {
      "title": "Beschrijf je afvoer-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over afvoer, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Vraag hulp bij afvoerproblemen",
      "secondaryLabel": "Terug naar loodgieter",
      "secondaryHref": "/loodgieter"
    }
  },
  "elektricien/groepenkast": {
    "path": "/elektricien/groepenkast",
    "title": "Groepenkast via VakConnect",
    "description": "Groepenkast uitbreiden of vervangen? Lees wanneer dat nodig kan zijn en welke factoren de klus bepalen.",
    "keywords": [
      "elektricien",
      "groepenkast",
      "vakman",
      "VakConnect"
    ],
    "h1": "Groepenkast: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij groepenkast? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Elektricien",
        "href": "/elektricien"
      },
      {
        "label": "Groepenkast"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer een groepenkast niet meer past bij je woninggebruik",
        "paragraphs": [
          "Wanneer een groepenkast niet meer past bij je woninggebruik: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer een groepenkast niet meer past bij je woninggebruik tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van elektrotechniek rond groepenkast concreet maken.",
          "Voor wanneer een groepenkast niet meer past bij je woninggebruik beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Klachten die vaak op elektra-issues wijzen — groepenkast",
        "paragraphs": [
          "Klachten die vaak op elektra-issues wijzen — groepenkast: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij klachten die vaak op elektra-issues wijzen — groepenkast tellen factoren zoals groepen vallen vaak uit, nieuwe apparatuur past niet op huidige verdeling en verouderde kast zonder moderne beveiliging mee, omdat ze de omvang en aanpak van elektrotechniek rond groepenkast concreet maken.",
          "Voor klachten die vaak op elektra-issues wijzen — groepenkast beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "groepen vallen vaak uit",
          "nieuwe apparatuur past niet op huidige verdeling",
          "verouderde kast zonder moderne beveiliging"
        ]
      },
      {
        "heading": "Oorzaken achter storingen of capaciteitsproblemen — groepenkast",
        "paragraphs": [
          "Oorzaken achter storingen of capaciteitsproblemen — groepenkast: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij oorzaken achter storingen of capaciteitsproblemen — groepenkast tellen factoren zoals toegenomen belasting, ouderdom van componenten en beperkte ruimte in kast mee, omdat ze de omvang en aanpak van elektrotechniek rond groepenkast concreet maken.",
          "Voor oorzaken achter storingen of capaciteitsproblemen — groepenkast beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "toegenomen belasting",
          "ouderdom van componenten",
          "beperkte ruimte in kast"
        ]
      },
      {
        "heading": "Veilige beoordeling door een elektricien (groepenkast) — groepenkast",
        "paragraphs": [
          "Veilige beoordeling door een elektricien (groepenkast) — groepenkast: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij veilige beoordeling door een elektricien (groepenkast) — groepenkast tellen factoren zoals belastingsprofiel beoordelen, uitbreiden of herindelen van groepen, beveiliging actualiseren en controle en test na aanpassing mee, omdat ze de omvang en aanpak van elektrotechniek rond groepenkast concreet maken.",
          "Voor veilige beoordeling door een elektricien (groepenkast) — groepenkast beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "belastingsprofiel beoordelen",
          "uitbreiden of herindelen van groepen",
          "beveiliging actualiseren",
          "controle en test na aanpassing"
        ]
      },
      {
        "heading": "Keuzes bij uitbreiding, vervanging of herverdeling — groepenkast",
        "paragraphs": [
          "Keuzes bij uitbreiding, vervanging of herverdeling — groepenkast: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes bij uitbreiding, vervanging of herverdeling — groepenkast tellen factoren zoals extra groepen bij bestaande kast, volledige vervanging bij beperkte basis en 1-fase of 3-fase passend bij toepassing mee, omdat ze de omvang en aanpak van elektrotechniek rond groepenkast concreet maken.",
          "Voor keuzes bij uitbreiding, vervanging of herverdeling — groepenkast beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "extra groepen bij bestaande kast",
          "volledige vervanging bij beperkte basis",
          "1-fase of 3-fase passend bij toepassing"
        ]
      },
      {
        "heading": "Welke info je nodig hebt voor een gerichte intake — groepenkast",
        "paragraphs": [
          "Welke info je nodig hebt voor een gerichte intake — groepenkast: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke info je nodig hebt voor een gerichte intake — groepenkast tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van elektrotechniek rond groepenkast concreet maken.",
          "Voor welke info je nodig hebt voor een gerichte intake — groepenkast beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Waarom uitstel bij elektra risico’s vergroot — groepenkast",
        "paragraphs": [
          "Waarom uitstel bij elektra risico’s vergroot — groepenkast: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij waarom uitstel bij elektra risico’s vergroot — groepenkast tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van elektrotechniek rond groepenkast concreet maken.",
          "Voor waarom uitstel bij elektra risico’s vergroot — groepenkast beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "type": "warning"
      },
      {
        "heading": "Planning, stroomonderbreking en praktische uitvoering — groepenkast",
        "paragraphs": [
          "Planning, stroomonderbreking en praktische uitvoering — groepenkast: Een zorgvuldige beoordeling van dit onderdeel maakt offertes beter vergelijkbaar en realistischer.",
          "Bij planning, stroomonderbreking en praktische uitvoering — groepenkast tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van elektrotechniek rond groepenkast concreet maken.",
          "Voor planning, stroomonderbreking en praktische uitvoering — groepenkast beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "huidige staat van groepenkast",
      "aantal extra groepen",
      "benodigde componenten",
      "aanpassing van bekabeling",
      "geplande stroomonderbreking"
    ],
    "processSteps": [
      "Beschrijf je vraag rond groepenkast en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende elektricien-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/elektricien",
        "title": "Elektricien",
        "description": "Bekijk ook elektricien voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/elektricien/storing",
        "title": "Elektra storing",
        "description": "Bekijk ook elektra storing voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/elektricien/krachtstroom",
        "title": "Krachtstroom",
        "description": "Bekijk ook krachtstroom voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Wanneer is alleen uitbreiden voldoende?",
        "answer": "Als de basis in goede staat is en er nog veilige uitbreidingsruimte is."
      },
      {
        "question": "Waarom kan 3-fase relevant zijn?",
        "answer": "Bij bepaalde apparatuur of vermogensvraag kan 3-fase nodig zijn, maar dit moet per situatie worden beoordeeld."
      },
      {
        "question": "Moet de stroom uit tijdens werk?",
        "answer": "Meestal wel tijdelijk, voor veilige uitvoering."
      },
      {
        "question": "Kan ik zelf voorbereidend werk doen?",
        "answer": "Aan vaste installaties liever niet; laat dit uitvoeren door een professional."
      },
      {
        "question": "Doet VakConnect dit zelf?",
        "answer": "Nee, VakConnect koppelt je aan een passende elektricien."
      }
    ],
    "cta": {
      "title": "Beschrijf je groepenkast-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over groepenkast, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Vraag een elektricien voor je groepenkast",
      "secondaryLabel": "Terug naar elektricien",
      "secondaryHref": "/elektricien"
    },
    "warning": {
      "title": "Veiligheid eerst bij elektra",
      "body": "Werkzaamheden aan vaste elektrische installaties zijn risicovol. Gebruik deze informatie als oriëntatie en laat de uitvoering over aan een vakman."
    }
  },
  "elektricien/storing": {
    "path": "/elektricien/storing",
    "title": "Elektra storing via VakConnect",
    "description": "Elektra storing? Vind via VakConnect een specialist voor veilige diagnose en herstel.",
    "keywords": [
      "elektricien",
      "storing",
      "vakman",
      "VakConnect"
    ],
    "h1": "Elektra storing: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij elektra storing? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Elektricien",
        "href": "/elektricien"
      },
      {
        "label": "Elektra storing"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer elektra storing in beeld komt",
        "paragraphs": [
          "Wanneer elektra storing in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer elektra storing in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van elektrotechniek rond storing concreet maken.",
          "Voor wanneer elektra storing in beeld komt beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Klachten die vaak op elektra-issues wijzen — storing",
        "paragraphs": [
          "Klachten die vaak op elektra-issues wijzen — storing: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij klachten die vaak op elektra-issues wijzen — storing tellen factoren zoals uitvallende groep, flikkerend licht en gedeeltelijke stroomuitval mee, omdat ze de omvang en aanpak van elektrotechniek rond storing concreet maken.",
          "Voor klachten die vaak op elektra-issues wijzen — storing beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "uitvallende groep",
          "flikkerend licht",
          "gedeeltelijke stroomuitval"
        ]
      },
      {
        "heading": "Oorzaken achter storingen of capaciteitsproblemen — storing",
        "paragraphs": [
          "Oorzaken achter storingen of capaciteitsproblemen — storing: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij oorzaken achter storingen of capaciteitsproblemen — storing tellen factoren zoals defect apparaat, bekabelingsprobleem en probleem in groepenkast mee, omdat ze de omvang en aanpak van elektrotechniek rond storing concreet maken.",
          "Voor oorzaken achter storingen of capaciteitsproblemen — storing beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "defect apparaat",
          "bekabelingsprobleem",
          "probleem in groepenkast"
        ]
      },
      {
        "heading": "Veilige beoordeling door een elektricien (storing) — storing",
        "paragraphs": [
          "Veilige beoordeling door een elektricien (storing) — storing: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij veilige beoordeling door een elektricien (storing) — storing tellen factoren zoals storingsbron isoleren, meten en controleren en defecten veilig herstellen mee, omdat ze de omvang en aanpak van elektrotechniek rond storing concreet maken.",
          "Voor veilige beoordeling door een elektricien (storing) — storing beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "storingsbron isoleren",
          "meten en controleren",
          "defecten veilig herstellen"
        ]
      },
      {
        "heading": "Keuzes bij uitbreiding, vervanging of herverdeling — storing",
        "paragraphs": [
          "Keuzes bij uitbreiding, vervanging of herverdeling — storing: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes bij uitbreiding, vervanging of herverdeling — storing tellen factoren zoals acute fout oplossen en oorzaakanalyse bij terugkerende storingen mee, omdat ze de omvang en aanpak van elektrotechniek rond storing concreet maken.",
          "Voor keuzes bij uitbreiding, vervanging of herverdeling — storing beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "acute fout oplossen",
          "oorzaakanalyse bij terugkerende storingen"
        ]
      },
      {
        "heading": "Welke info je nodig hebt voor een gerichte intake — storing",
        "paragraphs": [
          "Welke info je nodig hebt voor een gerichte intake — storing: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke info je nodig hebt voor een gerichte intake — storing tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van elektrotechniek rond storing concreet maken.",
          "Voor welke info je nodig hebt voor een gerichte intake — storing beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Waarom uitstel bij elektra risico’s vergroot — storing",
        "paragraphs": [
          "Waarom uitstel bij elektra risico’s vergroot — storing: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij waarom uitstel bij elektra risico’s vergroot — storing tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van elektrotechniek rond storing concreet maken.",
          "Voor waarom uitstel bij elektra risico’s vergroot — storing beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "tijd voor diagnose",
      "toegang tot installatie",
      "vervangingsonderdelen",
      "complexiteit van fout"
    ],
    "processSteps": [
      "Beschrijf je vraag rond elektra storing en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende elektricien-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/elektricien",
        "title": "Elektricien",
        "description": "Bekijk ook elektricien voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/elektricien/groepenkast",
        "title": "Groepenkast",
        "description": "Bekijk ook groepenkast voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/elektricien/stopcontacten",
        "title": "Stopcontacten",
        "description": "Bekijk ook stopcontacten voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Kan één defect apparaat een hele groep laten uitvallen?",
        "answer": "Ja, dat komt regelmatig voor."
      },
      {
        "question": "Waarom komt dezelfde storing terug?",
        "answer": "Vaak is de onderliggende oorzaak nog niet structureel verholpen."
      },
      {
        "question": "Moet ik zelf testen met de meterkast?",
        "answer": "Beperk je tot veilige basiscontroles; laat technisch werk uitvoeren door een vakman."
      },
      {
        "question": "Doet VakConnect zelf herstel?",
        "answer": "Nee, VakConnect koppelt je aan een passende elektricien."
      }
    ],
    "cta": {
      "title": "Beschrijf je elektra storing-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over storing, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Start je aanvraag voor storing",
      "secondaryLabel": "Terug naar elektricien",
      "secondaryHref": "/elektricien"
    },
    "warning": {
      "title": "Veiligheid eerst bij elektra",
      "body": "Werkzaamheden aan vaste elektrische installaties zijn risicovol. Gebruik deze informatie als oriëntatie en laat de uitvoering over aan een vakman."
    }
  },
  "elektricien/stopcontacten": {
    "path": "/elektricien/stopcontacten",
    "title": "Stopcontacten via VakConnect",
    "description": "Meer of beter geplaatste stopcontacten nodig? Lees waar je op moet letten.",
    "keywords": [
      "elektricien",
      "stopcontacten",
      "vakman",
      "VakConnect"
    ],
    "h1": "Stopcontacten: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij stopcontacten? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Elektricien",
        "href": "/elektricien"
      },
      {
        "label": "Stopcontacten"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer stopcontacten in beeld komt",
        "paragraphs": [
          "Wanneer stopcontacten in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer stopcontacten in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van elektrotechniek rond stopcontacten concreet maken.",
          "Voor wanneer stopcontacten in beeld komt beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Klachten die vaak op elektra-issues wijzen — stopcontacten",
        "paragraphs": [
          "Klachten die vaak op elektra-issues wijzen — stopcontacten: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij klachten die vaak op elektra-issues wijzen — stopcontacten tellen factoren zoals te weinig stopcontacten, veel verlengsnoeren en loszittende aansluitpunten mee, omdat ze de omvang en aanpak van elektrotechniek rond stopcontacten concreet maken.",
          "Voor klachten die vaak op elektra-issues wijzen — stopcontacten beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "te weinig stopcontacten",
          "veel verlengsnoeren",
          "loszittende aansluitpunten"
        ]
      },
      {
        "heading": "Oorzaken achter storingen of capaciteitsproblemen — stopcontacten",
        "paragraphs": [
          "Oorzaken achter storingen of capaciteitsproblemen — stopcontacten: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij oorzaken achter storingen of capaciteitsproblemen — stopcontacten tellen factoren zoals gewijzigde ruimte-indeling, meer apparatuur en verouderde installatie mee, omdat ze de omvang en aanpak van elektrotechniek rond stopcontacten concreet maken.",
          "Voor oorzaken achter storingen of capaciteitsproblemen — stopcontacten beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "gewijzigde ruimte-indeling",
          "meer apparatuur",
          "verouderde installatie"
        ]
      },
      {
        "heading": "Veilige beoordeling door een elektricien (stopcontacten) — stopcontacten",
        "paragraphs": [
          "Veilige beoordeling door een elektricien (stopcontacten) — stopcontacten: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij veilige beoordeling door een elektricien (stopcontacten) — stopcontacten tellen factoren zoals locaties bepalen, bekabeling veilig aanleggen en aansluitpunten testen mee, omdat ze de omvang en aanpak van elektrotechniek rond stopcontacten concreet maken.",
          "Voor veilige beoordeling door een elektricien (stopcontacten) — stopcontacten beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "locaties bepalen",
          "bekabeling veilig aanleggen",
          "aansluitpunten testen"
        ]
      },
      {
        "heading": "Keuzes bij uitbreiding, vervanging of herverdeling — stopcontacten",
        "paragraphs": [
          "Keuzes bij uitbreiding, vervanging of herverdeling — stopcontacten: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes bij uitbreiding, vervanging of herverdeling — stopcontacten tellen factoren zoals opbouw of inbouw, enkele ruimte of woningbreed en voorbereiding op toekomstig gebruik mee, omdat ze de omvang en aanpak van elektrotechniek rond stopcontacten concreet maken.",
          "Voor keuzes bij uitbreiding, vervanging of herverdeling — stopcontacten beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "opbouw of inbouw",
          "enkele ruimte of woningbreed",
          "voorbereiding op toekomstig gebruik"
        ]
      },
      {
        "heading": "Welke info je nodig hebt voor een gerichte intake — stopcontacten",
        "paragraphs": [
          "Welke info je nodig hebt voor een gerichte intake — stopcontacten: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke info je nodig hebt voor een gerichte intake — stopcontacten tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van elektrotechniek rond stopcontacten concreet maken.",
          "Voor welke info je nodig hebt voor een gerichte intake — stopcontacten beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Waarom uitstel bij elektra risico’s vergroot — stopcontacten",
        "paragraphs": [
          "Waarom uitstel bij elektra risico’s vergroot — stopcontacten: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij waarom uitstel bij elektra risico’s vergroot — stopcontacten tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van elektrotechniek rond stopcontacten concreet maken.",
          "Voor waarom uitstel bij elektra risico’s vergroot — stopcontacten beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "aantal punten",
      "kabelroutes",
      "wandtype en afwerking",
      "eventuele groepsuitbreiding"
    ],
    "processSteps": [
      "Beschrijf je vraag rond stopcontacten en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende elektricien-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/elektricien",
        "title": "Elektricien",
        "description": "Bekijk ook elektricien voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/elektricien/verlichting",
        "title": "Verlichting",
        "description": "Bekijk ook verlichting voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/verbouwing/keuken-verbouwen",
        "title": "Keuken verbouwen",
        "description": "Bekijk ook keuken verbouwen voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Kan elk gewenst punt worden gemaakt?",
        "answer": "Dat hangt af van constructie en route van bekabeling."
      },
      {
        "question": "Wanneer is extra groep nodig?",
        "answer": "Bij hogere belasting of combinatie met andere uitbreidingen."
      },
      {
        "question": "Kan ik dit combineren met verbouwing?",
        "answer": "Ja, dat is vaak efficiënter."
      },
      {
        "question": "Voert VakConnect dit uit?",
        "answer": "Nee, je wordt gekoppeld aan een specialist."
      }
    ],
    "cta": {
      "title": "Beschrijf je stopcontacten-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over stopcontacten, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Vraag stopcontacten aan",
      "secondaryLabel": "Terug naar elektricien",
      "secondaryHref": "/elektricien"
    },
    "warning": {
      "title": "Veiligheid eerst bij elektra",
      "body": "Werkzaamheden aan vaste elektrische installaties zijn risicovol. Gebruik deze informatie als oriëntatie en laat de uitvoering over aan een vakman."
    }
  },
  "elektricien/verlichting": {
    "path": "/elektricien/verlichting",
    "title": "Verlichting via VakConnect",
    "description": "Verlichting laten aanleggen of vernieuwen met veilige en logische aansluitingen.",
    "keywords": [
      "elektricien",
      "verlichting",
      "vakman",
      "VakConnect"
    ],
    "h1": "Verlichting: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij verlichting? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Elektricien",
        "href": "/elektricien"
      },
      {
        "label": "Verlichting"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer verlichting in beeld komt",
        "paragraphs": [
          "Wanneer verlichting in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer verlichting in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van elektrotechniek rond verlichting concreet maken.",
          "Voor wanneer verlichting in beeld komt beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Klachten die vaak op elektra-issues wijzen — verlichting",
        "paragraphs": [
          "Klachten die vaak op elektra-issues wijzen — verlichting: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij klachten die vaak op elektra-issues wijzen — verlichting tellen factoren zoals onvoldoende lichtpunten, onpraktische schakeling en oude armaturen mee, omdat ze de omvang en aanpak van elektrotechniek rond verlichting concreet maken.",
          "Voor klachten die vaak op elektra-issues wijzen — verlichting beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "onvoldoende lichtpunten",
          "onpraktische schakeling",
          "oude armaturen"
        ]
      },
      {
        "heading": "Oorzaken achter storingen of capaciteitsproblemen — verlichting",
        "paragraphs": [
          "Oorzaken achter storingen of capaciteitsproblemen — verlichting: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij oorzaken achter storingen of capaciteitsproblemen — verlichting tellen factoren zoals verouderde installatie, gewijzigde indeling en defecte componenten mee, omdat ze de omvang en aanpak van elektrotechniek rond verlichting concreet maken.",
          "Voor oorzaken achter storingen of capaciteitsproblemen — verlichting beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "verouderde installatie",
          "gewijzigde indeling",
          "defecte componenten"
        ]
      },
      {
        "heading": "Veilige beoordeling door een elektricien (verlichting) — verlichting",
        "paragraphs": [
          "Veilige beoordeling door een elektricien (verlichting) — verlichting: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij veilige beoordeling door een elektricien (verlichting) — verlichting tellen factoren zoals lichtpunten bepalen, aansluitingen en schakeling realiseren en testen en afwerken mee, omdat ze de omvang en aanpak van elektrotechniek rond verlichting concreet maken.",
          "Voor veilige beoordeling door een elektricien (verlichting) — verlichting beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "lichtpunten bepalen",
          "aansluitingen en schakeling realiseren",
          "testen en afwerken"
        ]
      },
      {
        "heading": "Keuzes bij uitbreiding, vervanging of herverdeling — verlichting",
        "paragraphs": [
          "Keuzes bij uitbreiding, vervanging of herverdeling — verlichting: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes bij uitbreiding, vervanging of herverdeling — verlichting tellen factoren zoals functioneel of sfeergericht lichtplan, binnen en buiten combineren en dimmers en zones mee, omdat ze de omvang en aanpak van elektrotechniek rond verlichting concreet maken.",
          "Voor keuzes bij uitbreiding, vervanging of herverdeling — verlichting beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "functioneel of sfeergericht lichtplan",
          "binnen en buiten combineren",
          "dimmers en zones"
        ]
      },
      {
        "heading": "Welke info je nodig hebt voor een gerichte intake — verlichting",
        "paragraphs": [
          "Welke info je nodig hebt voor een gerichte intake — verlichting: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke info je nodig hebt voor een gerichte intake — verlichting tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van elektrotechniek rond verlichting concreet maken.",
          "Voor welke info je nodig hebt voor een gerichte intake — verlichting beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Waarom uitstel bij elektra risico’s vergroot — verlichting",
        "paragraphs": [
          "Waarom uitstel bij elektra risico’s vergroot — verlichting: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij waarom uitstel bij elektra risico’s vergroot — verlichting tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van elektrotechniek rond verlichting concreet maken.",
          "Voor waarom uitstel bij elektra risico’s vergroot — verlichting beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "aantal lichtpunten",
      "schakelcomplexiteit",
      "type armaturen",
      "bekabeling en afwerking"
    ],
    "processSteps": [
      "Beschrijf je vraag rond verlichting en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende elektricien-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/elektricien",
        "title": "Elektricien",
        "description": "Bekijk ook elektricien voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/elektricien/stopcontacten",
        "title": "Stopcontacten",
        "description": "Bekijk ook stopcontacten voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/badkamer/renovatie",
        "title": "Badkamerrenovatie",
        "description": "Bekijk ook badkamerrenovatie voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Kan ik bestaande schakeling hergebruiken?",
        "answer": "Soms wel, afhankelijk van gewenste functies."
      },
      {
        "question": "Zijn dimmers altijd mogelijk?",
        "answer": "Alleen als installatie en armaturen compatibel zijn."
      },
      {
        "question": "Wat is nuttig in mijn aanvraag?",
        "answer": "Aantal lichtpunten, ruimtes en gewenste bediening."
      },
      {
        "question": "Doet VakConnect de aanleg zelf?",
        "answer": "Nee, VakConnect koppelt je aan een passende elektricien."
      }
    ],
    "cta": {
      "title": "Beschrijf je verlichting-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over verlichting, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Start je verlichtingsaanvraag",
      "secondaryLabel": "Terug naar elektricien",
      "secondaryHref": "/elektricien"
    },
    "warning": {
      "title": "Veiligheid eerst bij elektra",
      "body": "Werkzaamheden aan vaste elektrische installaties zijn risicovol. Gebruik deze informatie als oriëntatie en laat de uitvoering over aan een vakman."
    }
  },
  "elektricien/krachtstroom": {
    "path": "/elektricien/krachtstroom",
    "title": "Krachtstroom via VakConnect",
    "description": "Krachtstroom nodig voor zwaardere apparatuur? Lees welke voorbereiding en checks belangrijk zijn.",
    "keywords": [
      "elektricien",
      "krachtstroom",
      "vakman",
      "VakConnect"
    ],
    "h1": "Krachtstroom: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij krachtstroom? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Elektricien",
        "href": "/elektricien"
      },
      {
        "label": "Krachtstroom"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer krachtstroom in beeld komt",
        "paragraphs": [
          "Wanneer krachtstroom in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer krachtstroom in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van elektrotechniek rond krachtstroom concreet maken.",
          "Voor wanneer krachtstroom in beeld komt beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Klachten die vaak op elektra-issues wijzen — krachtstroom",
        "paragraphs": [
          "Klachten die vaak op elektra-issues wijzen — krachtstroom: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij klachten die vaak op elektra-issues wijzen — krachtstroom tellen factoren zoals nieuwe apparatuur met hogere vermogensvraag, beperkte huidige aansluiting en plannen voor werkplaats of zwaardere keukenapparatuur mee, omdat ze de omvang en aanpak van elektrotechniek rond krachtstroom concreet maken.",
          "Voor klachten die vaak op elektra-issues wijzen — krachtstroom beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "nieuwe apparatuur met hogere vermogensvraag",
          "beperkte huidige aansluiting",
          "plannen voor werkplaats of zwaardere keukenapparatuur"
        ]
      },
      {
        "heading": "Oorzaken achter storingen of capaciteitsproblemen — krachtstroom",
        "paragraphs": [
          "Oorzaken achter storingen of capaciteitsproblemen — krachtstroom: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij oorzaken achter storingen of capaciteitsproblemen — krachtstroom tellen factoren zoals groeiende stroomvraag, onvoldoende bestaande verdeling en ontbrekende geschikte bekabeling mee, omdat ze de omvang en aanpak van elektrotechniek rond krachtstroom concreet maken.",
          "Voor oorzaken achter storingen of capaciteitsproblemen — krachtstroom beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "groeiende stroomvraag",
          "onvoldoende bestaande verdeling",
          "ontbrekende geschikte bekabeling"
        ]
      },
      {
        "heading": "Veilige beoordeling door een elektricien (krachtstroom) — krachtstroom",
        "paragraphs": [
          "Veilige beoordeling door een elektricien (krachtstroom) — krachtstroom: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij veilige beoordeling door een elektricien (krachtstroom) — krachtstroom tellen factoren zoals aansluitvoorwaarden controleren, groep en bekabeling realiseren en veiligheid en werking testen mee, omdat ze de omvang en aanpak van elektrotechniek rond krachtstroom concreet maken.",
          "Voor veilige beoordeling door een elektricien (krachtstroom) — krachtstroom beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "aansluitvoorwaarden controleren",
          "groep en bekabeling realiseren",
          "veiligheid en werking testen"
        ]
      },
      {
        "heading": "Keuzes bij uitbreiding, vervanging of herverdeling — krachtstroom",
        "paragraphs": [
          "Keuzes bij uitbreiding, vervanging of herverdeling — krachtstroom: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes bij uitbreiding, vervanging of herverdeling — krachtstroom tellen factoren zoals volledige voorbereiding of gefaseerde uitbreiding en combinatie met groepenkastaanpassing mee, omdat ze de omvang en aanpak van elektrotechniek rond krachtstroom concreet maken.",
          "Voor keuzes bij uitbreiding, vervanging of herverdeling — krachtstroom beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "volledige voorbereiding of gefaseerde uitbreiding",
          "combinatie met groepenkastaanpassing"
        ]
      },
      {
        "heading": "Welke info je nodig hebt voor een gerichte intake — krachtstroom",
        "paragraphs": [
          "Welke info je nodig hebt voor een gerichte intake — krachtstroom: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke info je nodig hebt voor een gerichte intake — krachtstroom tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van elektrotechniek rond krachtstroom concreet maken.",
          "Voor welke info je nodig hebt voor een gerichte intake — krachtstroom beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Waarom uitstel bij elektra risico’s vergroot — krachtstroom",
        "paragraphs": [
          "Waarom uitstel bij elektra risico’s vergroot — krachtstroom: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij waarom uitstel bij elektra risico’s vergroot — krachtstroom tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van elektrotechniek rond krachtstroom concreet maken.",
          "Voor waarom uitstel bij elektra risico’s vergroot — krachtstroom beoordeelt een elektricien meestal welke stap logisch volgt; zonder die afweging neemt de kans op onveilige belasting en uitval toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "afstand en route van kabel",
      "kastaanpassingen",
      "componenten en beveiliging",
      "eventuele netaansluitingsstap"
    ],
    "processSteps": [
      "Beschrijf je vraag rond krachtstroom en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende elektricien-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/elektricien",
        "title": "Elektricien",
        "description": "Bekijk ook elektricien voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/elektricien/groepenkast",
        "title": "Groepenkast",
        "description": "Bekijk ook groepenkast voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/verbouwing/keuken-verbouwen",
        "title": "Keuken verbouwen",
        "description": "Bekijk ook keuken verbouwen voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Is krachtstroom hetzelfde als 3-fase?",
        "answer": "In veel situaties wel, maar de benodigde uitvoering hangt af van installatie en toepassing."
      },
      {
        "question": "Is netverzwaring altijd verplicht?",
        "answer": "Niet altijd; dat moet per situatie worden vastgesteld."
      },
      {
        "question": "Kan dit in bestaande woningen?",
        "answer": "Ja, vaak wel met maatwerk."
      },
      {
        "question": "Voert VakConnect de installatie uit?",
        "answer": "Nee, je wordt gekoppeld aan een passende professional."
      }
    ],
    "cta": {
      "title": "Beschrijf je krachtstroom-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over krachtstroom, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Vraag krachtstroom aan",
      "secondaryLabel": "Terug naar elektricien",
      "secondaryHref": "/elektricien"
    },
    "warning": {
      "title": "Veiligheid eerst bij elektra",
      "body": "Werkzaamheden aan vaste elektrische installaties zijn risicovol. Gebruik deze informatie als oriëntatie en laat de uitvoering over aan een vakman."
    }
  },
  "kozijnen/kunststof-kozijnen": {
    "path": "/kozijnen/kunststof-kozijnen",
    "title": "Kunststof kozijnen via VakConnect",
    "description": "Kunststof kozijnen vergelijken? Lees over profielen, glas, onderhoud en montage.",
    "keywords": [
      "kozijnen",
      "kunststof-kozijnen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Kunststof kozijnen: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij kunststof kozijnen? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Kozijnen",
        "href": "/kozijnen"
      },
      {
        "label": "Kunststof kozijnen"
      }
    ],
    "sections": [
      {
        "heading": "Materiaalkeuze, profielen en uitstraling",
        "paragraphs": [
          "Materiaalkeuze, profielen en uitstraling: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij materiaalkeuze, profielen en uitstraling tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van kozijnwerk rond kunststof kozijnen concreet maken.",
          "Voor materiaalkeuze, profielen en uitstraling beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen dat kozijnen of aansluitingen aandacht vragen — kunststof kozijnen",
        "paragraphs": [
          "Signalen dat kozijnen of aansluitingen aandacht vragen — kunststof kozijnen: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen dat kozijnen of aansluitingen aandacht vragen — kunststof kozijnen tellen factoren zoals huidige kozijnen vragen veel onderhoud, tocht rond ramen en wens voor betere isolatie mee, omdat ze de omvang en aanpak van kozijnwerk rond kunststof kozijnen concreet maken.",
          "Voor signalen dat kozijnen of aansluitingen aandacht vragen — kunststof kozijnen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "huidige kozijnen vragen veel onderhoud",
          "tocht rond ramen",
          "wens voor betere isolatie"
        ]
      },
      {
        "heading": "Mogelijke oorzaken van tocht, slijtage of klemmen — kunststof kozijnen",
        "paragraphs": [
          "Mogelijke oorzaken van tocht, slijtage of klemmen — kunststof kozijnen: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij mogelijke oorzaken van tocht, slijtage of klemmen — kunststof kozijnen tellen factoren zoals ouder materiaal, slechte kierdichting en slijtage van beslag mee, omdat ze de omvang en aanpak van kozijnwerk rond kunststof kozijnen concreet maken.",
          "Voor mogelijke oorzaken van tocht, slijtage of klemmen — kunststof kozijnen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "ouder materiaal",
          "slechte kierdichting",
          "slijtage van beslag"
        ]
      },
      {
        "heading": "Wat een kozijnspecialist doorgaans beoordeelt (kunststof kozijnen) — kunststof kozijnen",
        "paragraphs": [
          "Wat een kozijnspecialist doorgaans beoordeelt (kunststof kozijnen) — kunststof kozijnen: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een kozijnspecialist doorgaans beoordeelt (kunststof kozijnen) — kunststof kozijnen tellen factoren zoals inmeten en profielkeuze, oude kozijnen vervangen en aansluitingen en afwerking controleren mee, omdat ze de omvang en aanpak van kozijnwerk rond kunststof kozijnen concreet maken.",
          "Voor wat een kozijnspecialist doorgaans beoordeelt (kunststof kozijnen) — kunststof kozijnen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "inmeten en profielkeuze",
          "oude kozijnen vervangen",
          "aansluitingen en afwerking controleren"
        ]
      },
      {
        "heading": "Keuzes in materiaal, herstel en vervanging — kunststof kozijnen",
        "paragraphs": [
          "Keuzes in materiaal, herstel en vervanging — kunststof kozijnen: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in materiaal, herstel en vervanging — kunststof kozijnen tellen factoren zoals kleur en profielstijl, glasopties afhankelijk van comfortwens en gefaseerde vervanging mee, omdat ze de omvang en aanpak van kozijnwerk rond kunststof kozijnen concreet maken.",
          "Voor keuzes in materiaal, herstel en vervanging — kunststof kozijnen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "kleur en profielstijl",
          "glasopties afhankelijk van comfortwens",
          "gefaseerde vervanging"
        ]
      },
      {
        "heading": "Welke gegevens je aanvraag echt sterker maken — kunststof kozijnen",
        "paragraphs": [
          "Welke gegevens je aanvraag echt sterker maken — kunststof kozijnen: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke gegevens je aanvraag echt sterker maken — kunststof kozijnen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van kozijnwerk rond kunststof kozijnen concreet maken.",
          "Voor welke gegevens je aanvraag echt sterker maken — kunststof kozijnen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en onderhoudskosten — kunststof kozijnen",
        "paragraphs": [
          "Wat uitstel betekent voor comfort en onderhoudskosten — kunststof kozijnen: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij wat uitstel betekent voor comfort en onderhoudskosten — kunststof kozijnen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van kozijnwerk rond kunststof kozijnen concreet maken.",
          "Voor wat uitstel betekent voor comfort en onderhoudskosten — kunststof kozijnen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "aantal en afmeting kozijnen",
      "profiel- en glaskeuze",
      "bereikbaarheid",
      "afwerkingsniveau"
    ],
    "processSteps": [
      "Beschrijf je vraag rond kunststof kozijnen en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende kozijnen-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/kozijnen",
        "title": "Kozijnen",
        "description": "Bekijk ook kozijnen voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/kozijnen/kozijnen-vervangen",
        "title": "Kozijnen vervangen",
        "description": "Bekijk ook kozijnen vervangen voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/kozijnen/ramen-en-deuren",
        "title": "Ramen en deuren",
        "description": "Bekijk ook ramen en deuren voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Zijn kunststof kozijnen onderhoudsvrij?",
        "answer": "Niet volledig; periodieke reiniging en controle blijven nodig."
      },
      {
        "question": "Kan kunststof in oudere woningen?",
        "answer": "Ja, met passende profiel- en kleurkeuze vaak wel."
      },
      {
        "question": "Wanneer combineer ik met nieuw glas?",
        "answer": "Bij vervanging is dat meestal logisch om comfort en isolatie mee te nemen."
      },
      {
        "question": "Doet VakConnect de montage?",
        "answer": "Nee, VakConnect koppelt je aan een specialist."
      }
    ],
    "cta": {
      "title": "Beschrijf je kunststof kozijnen-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over kunststof kozijnen, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Start je aanvraag voor kunststof kozijnen",
      "secondaryLabel": "Terug naar kozijnen",
      "secondaryHref": "/kozijnen"
    }
  },
  "kozijnen/houten-kozijnen": {
    "path": "/kozijnen/houten-kozijnen",
    "title": "Houten kozijnen via VakConnect",
    "description": "Houten kozijnen laten herstellen of vervangen met oog voor uitstraling en onderhoud.",
    "keywords": [
      "kozijnen",
      "houten-kozijnen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Houten kozijnen: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij houten kozijnen? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Kozijnen",
        "href": "/kozijnen"
      },
      {
        "label": "Houten kozijnen"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer houten kozijnen in beeld komt",
        "paragraphs": [
          "Wanneer houten kozijnen in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer houten kozijnen in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van kozijnwerk rond houten kozijnen concreet maken.",
          "Voor wanneer houten kozijnen in beeld komt beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen dat kozijnen of aansluitingen aandacht vragen — houten kozijnen",
        "paragraphs": [
          "Signalen dat kozijnen of aansluitingen aandacht vragen — houten kozijnen: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen dat kozijnen of aansluitingen aandacht vragen — houten kozijnen tellen factoren zoals bladderende verf, zachte houtdelen en klemmen van ramen mee, omdat ze de omvang en aanpak van kozijnwerk rond houten kozijnen concreet maken.",
          "Voor signalen dat kozijnen of aansluitingen aandacht vragen — houten kozijnen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "bladderende verf",
          "zachte houtdelen",
          "klemmen van ramen"
        ]
      },
      {
        "heading": "Mogelijke oorzaken van tocht, slijtage of klemmen — houten kozijnen",
        "paragraphs": [
          "Mogelijke oorzaken van tocht, slijtage of klemmen — houten kozijnen: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij mogelijke oorzaken van tocht, slijtage of klemmen — houten kozijnen tellen factoren zoals vochtbelasting, uitgesteld onderhoud en verouderde detaillering mee, omdat ze de omvang en aanpak van kozijnwerk rond houten kozijnen concreet maken.",
          "Voor mogelijke oorzaken van tocht, slijtage of klemmen — houten kozijnen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "vochtbelasting",
          "uitgesteld onderhoud",
          "verouderde detaillering"
        ]
      },
      {
        "heading": "Wat een kozijnspecialist doorgaans beoordeelt (houten kozijnen) — houten kozijnen",
        "paragraphs": [
          "Wat een kozijnspecialist doorgaans beoordeelt (houten kozijnen) — houten kozijnen: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een kozijnspecialist doorgaans beoordeelt (houten kozijnen) — houten kozijnen tellen factoren zoals conditie beoordelen, lokale herstel- of vervangingskeuze en afwerken en beschermen mee, omdat ze de omvang en aanpak van kozijnwerk rond houten kozijnen concreet maken.",
          "Voor wat een kozijnspecialist doorgaans beoordeelt (houten kozijnen) — houten kozijnen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "conditie beoordelen",
          "lokale herstel- of vervangingskeuze",
          "afwerken en beschermen"
        ]
      },
      {
        "heading": "Keuzes in materiaal, herstel en vervanging — houten kozijnen",
        "paragraphs": [
          "Keuzes in materiaal, herstel en vervanging — houten kozijnen: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in materiaal, herstel en vervanging — houten kozijnen tellen factoren zoals herstellen of vervangen, combinatie met schilderwerk en fasering per gevel mee, omdat ze de omvang en aanpak van kozijnwerk rond houten kozijnen concreet maken.",
          "Voor keuzes in materiaal, herstel en vervanging — houten kozijnen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "herstellen of vervangen",
          "combinatie met schilderwerk",
          "fasering per gevel"
        ]
      },
      {
        "heading": "Welke gegevens je aanvraag echt sterker maken — houten kozijnen",
        "paragraphs": [
          "Welke gegevens je aanvraag echt sterker maken — houten kozijnen: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke gegevens je aanvraag echt sterker maken — houten kozijnen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van kozijnwerk rond houten kozijnen concreet maken.",
          "Voor welke gegevens je aanvraag echt sterker maken — houten kozijnen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en onderhoudskosten — houten kozijnen",
        "paragraphs": [
          "Wat uitstel betekent voor comfort en onderhoudskosten — houten kozijnen: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij wat uitstel betekent voor comfort en onderhoudskosten — houten kozijnen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van kozijnwerk rond houten kozijnen concreet maken.",
          "Voor wat uitstel betekent voor comfort en onderhoudskosten — houten kozijnen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "mate van aantasting",
      "aantal kozijnen",
      "bereikbaarheid",
      "afwerkingswerk"
    ],
    "processSteps": [
      "Beschrijf je vraag rond houten kozijnen en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende kozijnen-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/kozijnen",
        "title": "Kozijnen",
        "description": "Bekijk ook kozijnen voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/schilder/kozijnen-schilderen",
        "title": "Kozijnen schilderen",
        "description": "Bekijk ook kozijnen schilderen voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/kozijnen/kozijnen-vervangen",
        "title": "Kozijnen vervangen",
        "description": "Bekijk ook kozijnen vervangen voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Kan houtrot lokaal worden hersteld?",
        "answer": "Dat kan, afhankelijk van diepte en spreiding van de aantasting."
      },
      {
        "question": "Hoe vaak onderhoud ik houten kozijnen?",
        "answer": "Dat hangt af van ligging, verfopbouw en weersbelasting."
      },
      {
        "question": "Is volledige vervanging altijd nodig?",
        "answer": "Niet altijd; bij beperkte schade kan herstel volstaan."
      },
      {
        "question": "Voert VakConnect dit zelf uit?",
        "answer": "Nee, je wordt gekoppeld aan een specialist."
      }
    ],
    "cta": {
      "title": "Beschrijf je houten kozijnen-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over houten kozijnen, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Vraag hulp voor houten kozijnen",
      "secondaryLabel": "Terug naar kozijnen",
      "secondaryHref": "/kozijnen"
    }
  },
  "kozijnen/aluminium-kozijnen": {
    "path": "/kozijnen/aluminium-kozijnen",
    "title": "Aluminium kozijnen via VakConnect",
    "description": "Aluminium kozijnen kiezen? Lees wanneer dit materiaal past bij jouw wensen en woning.",
    "keywords": [
      "kozijnen",
      "aluminium-kozijnen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Aluminium kozijnen: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij aluminium kozijnen? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Kozijnen",
        "href": "/kozijnen"
      },
      {
        "label": "Aluminium kozijnen"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer aluminium kozijnen in beeld komt",
        "paragraphs": [
          "Wanneer aluminium kozijnen in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer aluminium kozijnen in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van kozijnwerk rond aluminium kozijnen concreet maken.",
          "Voor wanneer aluminium kozijnen in beeld komt beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen dat kozijnen of aansluitingen aandacht vragen — aluminium kozijnen",
        "paragraphs": [
          "Signalen dat kozijnen of aansluitingen aandacht vragen — aluminium kozijnen: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen dat kozijnen of aansluitingen aandacht vragen — aluminium kozijnen tellen factoren zoals wens voor slanke uitstraling, vervanging van verouderde kozijnen en grotere glasopeningen mee, omdat ze de omvang en aanpak van kozijnwerk rond aluminium kozijnen concreet maken.",
          "Voor signalen dat kozijnen of aansluitingen aandacht vragen — aluminium kozijnen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "wens voor slanke uitstraling",
          "vervanging van verouderde kozijnen",
          "grotere glasopeningen"
        ]
      },
      {
        "heading": "Mogelijke oorzaken van tocht, slijtage of klemmen — aluminium kozijnen",
        "paragraphs": [
          "Mogelijke oorzaken van tocht, slijtage of klemmen — aluminium kozijnen: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij mogelijke oorzaken van tocht, slijtage of klemmen — aluminium kozijnen tellen factoren zoals esthetische vernieuwing, comfortverbetering en technische veroudering van oude kozijnen mee, omdat ze de omvang en aanpak van kozijnwerk rond aluminium kozijnen concreet maken.",
          "Voor mogelijke oorzaken van tocht, slijtage of klemmen — aluminium kozijnen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "esthetische vernieuwing",
          "comfortverbetering",
          "technische veroudering van oude kozijnen"
        ]
      },
      {
        "heading": "Wat een kozijnspecialist doorgaans beoordeelt (aluminium kozijnen) — aluminium kozijnen",
        "paragraphs": [
          "Wat een kozijnspecialist doorgaans beoordeelt (aluminium kozijnen) — aluminium kozijnen: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een kozijnspecialist doorgaans beoordeelt (aluminium kozijnen) — aluminium kozijnen tellen factoren zoals systeem en profiel kiezen, inmeten en plaatsen en afstellen en afdichten mee, omdat ze de omvang en aanpak van kozijnwerk rond aluminium kozijnen concreet maken.",
          "Voor wat een kozijnspecialist doorgaans beoordeelt (aluminium kozijnen) — aluminium kozijnen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "systeem en profiel kiezen",
          "inmeten en plaatsen",
          "afstellen en afdichten"
        ]
      },
      {
        "heading": "Keuzes in materiaal, herstel en vervanging — aluminium kozijnen",
        "paragraphs": [
          "Keuzes in materiaal, herstel en vervanging — aluminium kozijnen: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in materiaal, herstel en vervanging — aluminium kozijnen tellen factoren zoals kleur en afwerking, glascombinaties en gefaseerde uitvoering mee, omdat ze de omvang en aanpak van kozijnwerk rond aluminium kozijnen concreet maken.",
          "Voor keuzes in materiaal, herstel en vervanging — aluminium kozijnen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "kleur en afwerking",
          "glascombinaties",
          "gefaseerde uitvoering"
        ]
      },
      {
        "heading": "Welke gegevens je aanvraag echt sterker maken — aluminium kozijnen",
        "paragraphs": [
          "Welke gegevens je aanvraag echt sterker maken — aluminium kozijnen: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke gegevens je aanvraag echt sterker maken — aluminium kozijnen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van kozijnwerk rond aluminium kozijnen concreet maken.",
          "Voor welke gegevens je aanvraag echt sterker maken — aluminium kozijnen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en onderhoudskosten — aluminium kozijnen",
        "paragraphs": [
          "Wat uitstel betekent voor comfort en onderhoudskosten — aluminium kozijnen: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij wat uitstel betekent voor comfort en onderhoudskosten — aluminium kozijnen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van kozijnwerk rond aluminium kozijnen concreet maken.",
          "Voor wat uitstel betekent voor comfort en onderhoudskosten — aluminium kozijnen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "profielsysteem",
      "glaskeuze",
      "montagecomplexiteit",
      "afwerking"
    ],
    "processSteps": [
      "Beschrijf je vraag rond aluminium kozijnen en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende kozijnen-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/kozijnen",
        "title": "Kozijnen",
        "description": "Bekijk ook kozijnen voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/kozijnen/ramen-en-deuren",
        "title": "Ramen en deuren",
        "description": "Bekijk ook ramen en deuren voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/verbouwing/uitbouw",
        "title": "Uitbouw",
        "description": "Bekijk ook uitbouw voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Zijn aluminium kozijnen geschikt voor renovatie?",
        "answer": "Ja, vaak wel, mits goed ingemeten en aangesloten."
      },
      {
        "question": "Hoe zit het met onderhoud?",
        "answer": "Onderhoud is doorgaans beperkt tot reiniging en periodieke controle."
      },
      {
        "question": "Is maatwerk mogelijk?",
        "answer": "Ja, in veel projecten wordt maatwerk toegepast."
      },
      {
        "question": "Doet VakConnect de plaatsing?",
        "answer": "Nee, VakConnect koppelt je aan een passende specialist."
      }
    ],
    "cta": {
      "title": "Beschrijf je aluminium kozijnen-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over aluminium kozijnen, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Vind een specialist voor aluminium kozijnen",
      "secondaryLabel": "Terug naar kozijnen",
      "secondaryHref": "/kozijnen"
    }
  },
  "kozijnen/kozijnen-vervangen": {
    "path": "/kozijnen/kozijnen-vervangen",
    "title": "Kozijnen vervangen via VakConnect",
    "description": "Wanneer kozijnen vervangen en niet meer repareren? Lees de belangrijkste afwegingen.",
    "keywords": [
      "kozijnen",
      "kozijnen-vervangen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Kozijnen vervangen: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij kozijnen vervangen? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Kozijnen",
        "href": "/kozijnen"
      },
      {
        "label": "Kozijnen vervangen"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer kozijnen vervangen in beeld komt",
        "paragraphs": [
          "Wanneer kozijnen vervangen in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer kozijnen vervangen in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van kozijnwerk rond kozijnen vervangen concreet maken.",
          "Voor wanneer kozijnen vervangen in beeld komt beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen dat kozijnen of aansluitingen aandacht vragen — kozijnen vervangen",
        "paragraphs": [
          "Signalen dat kozijnen of aansluitingen aandacht vragen — kozijnen vervangen: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen dat kozijnen of aansluitingen aandacht vragen — kozijnen vervangen tellen factoren zoals terugkerende tocht, structurele slijtage en slecht sluitwerk mee, omdat ze de omvang en aanpak van kozijnwerk rond kozijnen vervangen concreet maken.",
          "Voor signalen dat kozijnen of aansluitingen aandacht vragen — kozijnen vervangen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "terugkerende tocht",
          "structurele slijtage",
          "slecht sluitwerk"
        ]
      },
      {
        "heading": "Mogelijke oorzaken van tocht, slijtage of klemmen — kozijnen vervangen",
        "paragraphs": [
          "Mogelijke oorzaken van tocht, slijtage of klemmen — kozijnen vervangen: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij mogelijke oorzaken van tocht, slijtage of klemmen — kozijnen vervangen tellen factoren zoals ouderdom, vochtinvloed en beperkte isolatiewaarde mee, omdat ze de omvang en aanpak van kozijnwerk rond kozijnen vervangen concreet maken.",
          "Voor mogelijke oorzaken van tocht, slijtage of klemmen — kozijnen vervangen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "ouderdom",
          "vochtinvloed",
          "beperkte isolatiewaarde"
        ]
      },
      {
        "heading": "Wat een kozijnspecialist doorgaans beoordeelt (kozijnen vervangen) — kozijnen vervangen",
        "paragraphs": [
          "Wat een kozijnspecialist doorgaans beoordeelt (kozijnen vervangen) — kozijnen vervangen: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een kozijnspecialist doorgaans beoordeelt (kozijnen vervangen) — kozijnen vervangen tellen factoren zoals staat in kaart brengen, materiaal en glas kiezen en vervanging en afwerking uitvoeren mee, omdat ze de omvang en aanpak van kozijnwerk rond kozijnen vervangen concreet maken.",
          "Voor wat een kozijnspecialist doorgaans beoordeelt (kozijnen vervangen) — kozijnen vervangen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "staat in kaart brengen",
          "materiaal en glas kiezen",
          "vervanging en afwerking uitvoeren"
        ]
      },
      {
        "heading": "Keuzes in materiaal, herstel en vervanging — kozijnen vervangen",
        "paragraphs": [
          "Keuzes in materiaal, herstel en vervanging — kozijnen vervangen: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in materiaal, herstel en vervanging — kozijnen vervangen tellen factoren zoals vervangen per fase of in één project, materiaalkeuze op onderhoud en uitstraling en combinatie met gevel- of schilderwerk mee, omdat ze de omvang en aanpak van kozijnwerk rond kozijnen vervangen concreet maken.",
          "Voor keuzes in materiaal, herstel en vervanging — kozijnen vervangen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "vervangen per fase of in één project",
          "materiaalkeuze op onderhoud en uitstraling",
          "combinatie met gevel- of schilderwerk"
        ]
      },
      {
        "heading": "Welke gegevens je aanvraag echt sterker maken — kozijnen vervangen",
        "paragraphs": [
          "Welke gegevens je aanvraag echt sterker maken — kozijnen vervangen: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke gegevens je aanvraag echt sterker maken — kozijnen vervangen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van kozijnwerk rond kozijnen vervangen concreet maken.",
          "Voor welke gegevens je aanvraag echt sterker maken — kozijnen vervangen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en onderhoudskosten — kozijnen vervangen",
        "paragraphs": [
          "Wat uitstel betekent voor comfort en onderhoudskosten — kozijnen vervangen: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij wat uitstel betekent voor comfort en onderhoudskosten — kozijnen vervangen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van kozijnwerk rond kozijnen vervangen concreet maken.",
          "Voor wat uitstel betekent voor comfort en onderhoudskosten — kozijnen vervangen beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "aantal kozijnen",
      "materiaal en glas",
      "toegang en montage",
      "afwerking binnen en buiten"
    ],
    "processSteps": [
      "Beschrijf je vraag rond kozijnen vervangen en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende kozijnen-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/kozijnen",
        "title": "Kozijnen",
        "description": "Bekijk ook kozijnen voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/kozijnen/kunststof-kozijnen",
        "title": "Kunststof kozijnen",
        "description": "Bekijk ook kunststof kozijnen voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/kozijnen/houten-kozijnen",
        "title": "Houten kozijnen",
        "description": "Bekijk ook houten kozijnen voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Wanneer is herstel niet meer rendabel?",
        "answer": "Bij terugkerende problemen en oplopende reparatiekosten is vervanging vaak logischer."
      },
      {
        "question": "Kan ik alleen de slechtste kozijnen doen?",
        "answer": "Ja, gefaseerd vervangen is mogelijk."
      },
      {
        "question": "Moet ik glas direct meepakken?",
        "answer": "Dat is vaak praktisch, zeker bij comfort- en isolatiewensen."
      },
      {
        "question": "Voert VakConnect het werk uit?",
        "answer": "Nee, VakConnect koppelt je aan een specialist."
      }
    ],
    "cta": {
      "title": "Beschrijf je kozijnen vervangen-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over kozijnen vervangen, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Plaats je aanvraag voor kozijnvervanging",
      "secondaryLabel": "Terug naar kozijnen",
      "secondaryHref": "/kozijnen"
    }
  },
  "kozijnen/ramen-en-deuren": {
    "path": "/kozijnen/ramen-en-deuren",
    "title": "Ramen en deuren via VakConnect",
    "description": "Ramen en deuren vernieuwen of verbeteren: ontdek wat bepalend is voor comfort en gebruiksgemak.",
    "keywords": [
      "kozijnen",
      "ramen-en-deuren",
      "vakman",
      "VakConnect"
    ],
    "h1": "Ramen en deuren: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij ramen en deuren? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Kozijnen",
        "href": "/kozijnen"
      },
      {
        "label": "Ramen en deuren"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer ramen en deuren in beeld komt",
        "paragraphs": [
          "Wanneer ramen en deuren in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer ramen en deuren in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van kozijnwerk rond ramen en deuren concreet maken.",
          "Voor wanneer ramen en deuren in beeld komt beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen dat kozijnen of aansluitingen aandacht vragen — ramen en deuren",
        "paragraphs": [
          "Signalen dat kozijnen of aansluitingen aandacht vragen — ramen en deuren: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen dat kozijnen of aansluitingen aandacht vragen — ramen en deuren tellen factoren zoals klemmende delen, tocht rond sluiting en slijtage van beslag mee, omdat ze de omvang en aanpak van kozijnwerk rond ramen en deuren concreet maken.",
          "Voor signalen dat kozijnen of aansluitingen aandacht vragen — ramen en deuren beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "klemmende delen",
          "tocht rond sluiting",
          "slijtage van beslag"
        ]
      },
      {
        "heading": "Mogelijke oorzaken van tocht, slijtage of klemmen — ramen en deuren",
        "paragraphs": [
          "Mogelijke oorzaken van tocht, slijtage of klemmen — ramen en deuren: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij mogelijke oorzaken van tocht, slijtage of klemmen — ramen en deuren tellen factoren zoals verouderde onderdelen, scheefstand en onvoldoende afstelling mee, omdat ze de omvang en aanpak van kozijnwerk rond ramen en deuren concreet maken.",
          "Voor mogelijke oorzaken van tocht, slijtage of klemmen — ramen en deuren beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "verouderde onderdelen",
          "scheefstand",
          "onvoldoende afstelling"
        ]
      },
      {
        "heading": "Wat een kozijnspecialist doorgaans beoordeelt (ramen en deuren) — ramen en deuren",
        "paragraphs": [
          "Wat een kozijnspecialist doorgaans beoordeelt (ramen en deuren) — ramen en deuren: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een kozijnspecialist doorgaans beoordeelt (ramen en deuren) — ramen en deuren tellen factoren zoals controle van beslag en sluitpunten, afstellen of vervangen en aansluiten op kozijnconditie mee, omdat ze de omvang en aanpak van kozijnwerk rond ramen en deuren concreet maken.",
          "Voor wat een kozijnspecialist doorgaans beoordeelt (ramen en deuren) — ramen en deuren beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "controle van beslag en sluitpunten",
          "afstellen of vervangen",
          "aansluiten op kozijnconditie"
        ]
      },
      {
        "heading": "Keuzes in materiaal, herstel en vervanging — ramen en deuren",
        "paragraphs": [
          "Keuzes in materiaal, herstel en vervanging — ramen en deuren: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in materiaal, herstel en vervanging — ramen en deuren tellen factoren zoals onderdelen vervangen of compleet vernieuwen en combineren met kozijnproject mee, omdat ze de omvang en aanpak van kozijnwerk rond ramen en deuren concreet maken.",
          "Voor keuzes in materiaal, herstel en vervanging — ramen en deuren beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "onderdelen vervangen of compleet vernieuwen",
          "combineren met kozijnproject"
        ]
      },
      {
        "heading": "Welke gegevens je aanvraag echt sterker maken — ramen en deuren",
        "paragraphs": [
          "Welke gegevens je aanvraag echt sterker maken — ramen en deuren: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke gegevens je aanvraag echt sterker maken — ramen en deuren tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van kozijnwerk rond ramen en deuren concreet maken.",
          "Voor welke gegevens je aanvraag echt sterker maken — ramen en deuren beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en onderhoudskosten — ramen en deuren",
        "paragraphs": [
          "Wat uitstel betekent voor comfort en onderhoudskosten — ramen en deuren: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij wat uitstel betekent voor comfort en onderhoudskosten — ramen en deuren tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van kozijnwerk rond ramen en deuren concreet maken.",
          "Voor wat uitstel betekent voor comfort en onderhoudskosten — ramen en deuren beoordeelt een kozijnspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op tocht, vocht en comfortverlies toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "aantal ramen/deuren",
      "type beslag",
      "afstel- en montagewerk",
      "eventuele kozijnaanpassingen"
    ],
    "processSteps": [
      "Beschrijf je vraag rond ramen en deuren en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende kozijnen-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/kozijnen",
        "title": "Kozijnen",
        "description": "Bekijk ook kozijnen voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/kozijnen/kozijnen-vervangen",
        "title": "Kozijnen vervangen",
        "description": "Bekijk ook kozijnen vervangen voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/schilder/deuren-schilderen",
        "title": "Deuren schilderen",
        "description": "Bekijk ook deuren schilderen voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Is tocht altijd een kozijnprobleem?",
        "answer": "Niet altijd, ook beslag of afdichting kan de oorzaak zijn."
      },
      {
        "question": "Kan afstellen genoeg zijn?",
        "answer": "Soms wel, afhankelijk van slijtage."
      },
      {
        "question": "Wanneer vervang ik compleet?",
        "answer": "Bij structurele schade of als meerdere onderdelen tegelijk tekortschieten."
      },
      {
        "question": "Doet VakConnect de uitvoering?",
        "answer": "Nee, VakConnect koppelt je aan een passende specialist."
      }
    ],
    "cta": {
      "title": "Beschrijf je ramen en deuren-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over ramen en deuren, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Vraag een specialist voor ramen en deuren",
      "secondaryLabel": "Terug naar kozijnen",
      "secondaryHref": "/kozijnen"
    }
  },
  "badkamer/renovatie": {
    "path": "/badkamer/renovatie",
    "title": "Badkamerrenovatie via VakConnect",
    "description": "Badkamerrenovatie plannen van idee tot uitvoering: lees waar je technisch en praktisch op moet letten.",
    "keywords": [
      "badkamer",
      "renovatie",
      "vakman",
      "VakConnect"
    ],
    "h1": "Badkamerrenovatie: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij badkamerrenovatie? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Badkamer",
        "href": "/badkamer"
      },
      {
        "label": "Badkamerrenovatie"
      }
    ],
    "sections": [
      {
        "heading": "Van huidige situatie naar een uitvoerbaar renovatieplan",
        "paragraphs": [
          "Van huidige situatie naar een uitvoerbaar renovatieplan: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij van huidige situatie naar een uitvoerbaar renovatieplan tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van badkamerwerk rond renovatie concreet maken.",
          "Voor van huidige situatie naar een uitvoerbaar renovatieplan beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — renovatie",
        "paragraphs": [
          "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — renovatie: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij welke signalen laten zien dat de badkamer aan vernieuwing toe is — renovatie tellen factoren zoals verouderde indeling, lekkage of vochtproblemen en sanitair dat niet meer past mee, omdat ze de omvang en aanpak van badkamerwerk rond renovatie concreet maken.",
          "Voor welke signalen laten zien dat de badkamer aan vernieuwing toe is — renovatie beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "verouderde indeling",
          "lekkage of vochtproblemen",
          "sanitair dat niet meer past"
        ]
      },
      {
        "heading": "Technische oorzaken achter vocht- of gebruiksproblemen — renovatie",
        "paragraphs": [
          "Technische oorzaken achter vocht- of gebruiksproblemen — renovatie: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij technische oorzaken achter vocht- of gebruiksproblemen — renovatie tellen factoren zoals slijtage, ouder leidingwerk en onvoldoende ventilatie mee, omdat ze de omvang en aanpak van badkamerwerk rond renovatie concreet maken.",
          "Voor technische oorzaken achter vocht- of gebruiksproblemen — renovatie beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "slijtage",
          "ouder leidingwerk",
          "onvoldoende ventilatie"
        ]
      },
      {
        "heading": "Wat een specialist eerst in kaart brengt (renovatie) — renovatie",
        "paragraphs": [
          "Wat een specialist eerst in kaart brengt (renovatie) — renovatie: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een specialist eerst in kaart brengt (renovatie) — renovatie tellen factoren zoals huidige situatie in kaart brengen, sloop en voorbereiding plannen, water, afvoer, elektra en ventilatie afstemmen en tegelwerk en sanitair in logische volgorde uitvoeren mee, omdat ze de omvang en aanpak van badkamerwerk rond renovatie concreet maken.",
          "Voor wat een specialist eerst in kaart brengt (renovatie) — renovatie beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "huidige situatie in kaart brengen",
          "sloop en voorbereiding plannen",
          "water, afvoer, elektra en ventilatie afstemmen",
          "tegelwerk en sanitair in logische volgorde uitvoeren"
        ]
      },
      {
        "heading": "Keuzes in scope, indeling en combinatie met installatiewerk — renovatie",
        "paragraphs": [
          "Keuzes in scope, indeling en combinatie met installatiewerk — renovatie: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in scope, indeling en combinatie met installatiewerk — renovatie tellen factoren zoals deelrenovatie of complete aanpak, huidige indeling verbeteren of volledig wijzigen en combinatie met loodgieter- en elektricienwerk mee, omdat ze de omvang en aanpak van badkamerwerk rond renovatie concreet maken.",
          "Voor keuzes in scope, indeling en combinatie met installatiewerk — renovatie beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "deelrenovatie of complete aanpak",
          "huidige indeling verbeteren of volledig wijzigen",
          "combinatie met loodgieter- en elektricienwerk"
        ]
      },
      {
        "heading": "Welke input nodig is voor een realistische offertefase — renovatie",
        "paragraphs": [
          "Welke input nodig is voor een realistische offertefase — renovatie: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke input nodig is voor een realistische offertefase — renovatie tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van badkamerwerk rond renovatie concreet maken.",
          "Voor welke input nodig is voor een realistische offertefase — renovatie beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Gevolgen van uitstel bij vocht en slijtage — renovatie",
        "paragraphs": [
          "Gevolgen van uitstel bij vocht en slijtage — renovatie: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij gevolgen van uitstel bij vocht en slijtage — renovatie tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van badkamerwerk rond renovatie concreet maken.",
          "Voor gevolgen van uitstel bij vocht en slijtage — renovatie beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "type": "warning"
      },
      {
        "heading": "Planning tussen sloop, techniek en afwerking — renovatie",
        "paragraphs": [
          "Planning tussen sloop, techniek en afwerking — renovatie: Een zorgvuldige beoordeling van dit onderdeel maakt offertes beter vergelijkbaar en realistischer.",
          "Bij planning tussen sloop, techniek en afwerking — renovatie tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van badkamerwerk rond renovatie concreet maken.",
          "Voor planning tussen sloop, techniek en afwerking — renovatie beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "sloop en afvoer",
      "leidingverlegging",
      "tegeloppervlak en patroon",
      "sanitairkeuze",
      "elektra en ventilatie",
      "afwerkingsniveau"
    ],
    "processSteps": [
      "Beschrijf je vraag rond badkamerrenovatie en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende badkamer-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/badkamer",
        "title": "Badkamer",
        "description": "Bekijk ook badkamer voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/loodgieter",
        "title": "Loodgieter",
        "description": "Bekijk ook loodgieter voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/elektricien",
        "title": "Elektricien",
        "description": "Bekijk ook elektricien voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/badkamer/complete-badkamer",
        "title": "Complete badkamer",
        "description": "Bekijk ook complete badkamer voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Waar begin ik als ik nog geen definitief ontwerp heb?",
        "answer": "Met een heldere lijst van klachten, wensen en prioriteiten. Dat is genoeg om de juiste specialist te betrekken."
      },
      {
        "question": "Waarom moet techniek vroeg in het plan?",
        "answer": "Omdat water, afvoer, elektra en ventilatie de indeling en productkeuze direct beïnvloeden."
      },
      {
        "question": "Kan renovatie gefaseerd?",
        "answer": "Ja, maar goede fasering voorkomt dubbel werk en extra kosten."
      },
      {
        "question": "Wanneer schakel ik meerdere vakgebieden in?",
        "answer": "Bij vrijwel elke renovatie waar leidingen, elektra en afwerking samenkomen."
      },
      {
        "question": "Voert VakConnect de renovatie zelf uit?",
        "answer": "Nee, VakConnect koppelt je aan passende professionals."
      }
    ],
    "cta": {
      "title": "Beschrijf je badkamerrenovatie-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over renovatie, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Start je badkamerrenovatie",
      "secondaryLabel": "Terug naar badkamer",
      "secondaryHref": "/badkamer"
    }
  },
  "badkamer/tegelen": {
    "path": "/badkamer/tegelen",
    "title": "Badkamer tegelen via VakConnect",
    "description": "Badkamer tegelen met duurzame afwerking: lees wat ondergrond, voegwerk en maatvoering bepalen.",
    "keywords": [
      "badkamer",
      "tegelen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Badkamer tegelen: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij badkamer tegelen? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Badkamer",
        "href": "/badkamer"
      },
      {
        "label": "Badkamer tegelen"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer badkamer tegelen in beeld komt",
        "paragraphs": [
          "Wanneer badkamer tegelen in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer badkamer tegelen in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van badkamerwerk rond tegelen concreet maken.",
          "Voor wanneer badkamer tegelen in beeld komt beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — tegelen",
        "paragraphs": [
          "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — tegelen: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij welke signalen laten zien dat de badkamer aan vernieuwing toe is — tegelen tellen factoren zoals losse tegels, scheuren in voegwerk en verouderde uitstraling mee, omdat ze de omvang en aanpak van badkamerwerk rond tegelen concreet maken.",
          "Voor welke signalen laten zien dat de badkamer aan vernieuwing toe is — tegelen beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "losse tegels",
          "scheuren in voegwerk",
          "verouderde uitstraling"
        ]
      },
      {
        "heading": "Technische oorzaken achter vocht- of gebruiksproblemen — tegelen",
        "paragraphs": [
          "Technische oorzaken achter vocht- of gebruiksproblemen — tegelen: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij technische oorzaken achter vocht- of gebruiksproblemen — tegelen tellen factoren zoals onvoldoende hechting, vochtbelasting en ondergrondbeweging mee, omdat ze de omvang en aanpak van badkamerwerk rond tegelen concreet maken.",
          "Voor technische oorzaken achter vocht- of gebruiksproblemen — tegelen beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "onvoldoende hechting",
          "vochtbelasting",
          "ondergrondbeweging"
        ]
      },
      {
        "heading": "Wat een specialist eerst in kaart brengt (tegelen) — tegelen",
        "paragraphs": [
          "Wat een specialist eerst in kaart brengt (tegelen) — tegelen: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een specialist eerst in kaart brengt (tegelen) — tegelen tellen factoren zoals ondergrond controleren, waterdichting beoordelen, tegels plaatsen en voegen en afwerken van kritieke randen mee, omdat ze de omvang en aanpak van badkamerwerk rond tegelen concreet maken.",
          "Voor wat een specialist eerst in kaart brengt (tegelen) — tegelen beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "ondergrond controleren",
          "waterdichting beoordelen",
          "tegels plaatsen en voegen",
          "afwerken van kritieke randen"
        ]
      },
      {
        "heading": "Keuzes in scope, indeling en combinatie met installatiewerk — tegelen",
        "paragraphs": [
          "Keuzes in scope, indeling en combinatie met installatiewerk — tegelen: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in scope, indeling en combinatie met installatiewerk — tegelen tellen factoren zoals groot formaat of klassiek formaat, wand, vloer of combinatie en voegkleur en onderhoudsgemak mee, omdat ze de omvang en aanpak van badkamerwerk rond tegelen concreet maken.",
          "Voor keuzes in scope, indeling en combinatie met installatiewerk — tegelen beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "groot formaat of klassiek formaat",
          "wand, vloer of combinatie",
          "voegkleur en onderhoudsgemak"
        ]
      },
      {
        "heading": "Welke input nodig is voor een realistische offertefase — tegelen",
        "paragraphs": [
          "Welke input nodig is voor een realistische offertefase — tegelen: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke input nodig is voor een realistische offertefase — tegelen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van badkamerwerk rond tegelen concreet maken.",
          "Voor welke input nodig is voor een realistische offertefase — tegelen beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Gevolgen van uitstel bij vocht en slijtage — tegelen",
        "paragraphs": [
          "Gevolgen van uitstel bij vocht en slijtage — tegelen: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij gevolgen van uitstel bij vocht en slijtage — tegelen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van badkamerwerk rond tegelen concreet maken.",
          "Voor gevolgen van uitstel bij vocht en slijtage — tegelen beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "m² tegelwerk",
      "ondergrondherstel",
      "snijwerk en patroon",
      "afwerking van hoeken en doorvoeren"
    ],
    "processSteps": [
      "Beschrijf je vraag rond badkamer tegelen en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende badkamer-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/badkamer",
        "title": "Badkamer",
        "description": "Bekijk ook badkamer voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/badkamer/renovatie",
        "title": "Badkamerrenovatie",
        "description": "Bekijk ook badkamerrenovatie voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/badkamer/inloopdouche",
        "title": "Inloopdouche",
        "description": "Bekijk ook inloopdouche voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Kan nieuw tegelwerk over oud tegelwerk?",
        "answer": "Soms, als ondergrond en hoogtes dat toelaten."
      },
      {
        "question": "Waarom ontstaan scheuren in voegwerk?",
        "answer": "Door ondergrondbeweging, vocht of ongeschikte opbouw."
      },
      {
        "question": "Hoe kies ik onderhoudsvriendelijke tegels?",
        "answer": "Let op oppervlaktestructuur, voegbreedte en gebruiksintensiteit."
      },
      {
        "question": "Doet VakConnect dit zelf?",
        "answer": "Nee, je wordt gekoppeld aan een passende specialist."
      }
    ],
    "cta": {
      "title": "Beschrijf je badkamer tegelen-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over tegelen, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Vraag badkamer-tegelwerk aan",
      "secondaryLabel": "Terug naar badkamer",
      "secondaryHref": "/badkamer"
    }
  },
  "badkamer/sanitair": {
    "path": "/badkamer/sanitair",
    "title": "Badkamer sanitair via VakConnect",
    "description": "Sanitair in de badkamer vervangen of vernieuwen: wat bepaalt de beste aanpak?",
    "keywords": [
      "badkamer",
      "sanitair",
      "vakman",
      "VakConnect"
    ],
    "h1": "Badkamer sanitair: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij badkamer sanitair? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Badkamer",
        "href": "/badkamer"
      },
      {
        "label": "Badkamer sanitair"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer badkamer sanitair in beeld komt",
        "paragraphs": [
          "Wanneer badkamer sanitair in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer badkamer sanitair in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van badkamerwerk rond sanitair concreet maken.",
          "Voor wanneer badkamer sanitair in beeld komt beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — sanitair",
        "paragraphs": [
          "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — sanitair: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij welke signalen laten zien dat de badkamer aan vernieuwing toe is — sanitair tellen factoren zoals lekkende aansluitingen, versleten elementen en onpraktische opstelling mee, omdat ze de omvang en aanpak van badkamerwerk rond sanitair concreet maken.",
          "Voor welke signalen laten zien dat de badkamer aan vernieuwing toe is — sanitair beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "lekkende aansluitingen",
          "versleten elementen",
          "onpraktische opstelling"
        ]
      },
      {
        "heading": "Technische oorzaken achter vocht- of gebruiksproblemen — sanitair",
        "paragraphs": [
          "Technische oorzaken achter vocht- of gebruiksproblemen — sanitair: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij technische oorzaken achter vocht- of gebruiksproblemen — sanitair tellen factoren zoals slijtage, oude aansluitpunten en gewijzigde comfortwensen mee, omdat ze de omvang en aanpak van badkamerwerk rond sanitair concreet maken.",
          "Voor technische oorzaken achter vocht- of gebruiksproblemen — sanitair beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "slijtage",
          "oude aansluitpunten",
          "gewijzigde comfortwensen"
        ]
      },
      {
        "heading": "Wat een specialist eerst in kaart brengt (sanitair) — sanitair",
        "paragraphs": [
          "Wat een specialist eerst in kaart brengt (sanitair) — sanitair: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een specialist eerst in kaart brengt (sanitair) — sanitair tellen factoren zoals opstelling beoordelen, nieuw sanitair selecteren en aansluiten, afstellen en afdichten mee, omdat ze de omvang en aanpak van badkamerwerk rond sanitair concreet maken.",
          "Voor wat een specialist eerst in kaart brengt (sanitair) — sanitair beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "opstelling beoordelen",
          "nieuw sanitair selecteren",
          "aansluiten, afstellen en afdichten"
        ]
      },
      {
        "heading": "Keuzes in scope, indeling en combinatie met installatiewerk — sanitair",
        "paragraphs": [
          "Keuzes in scope, indeling en combinatie met installatiewerk — sanitair: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in scope, indeling en combinatie met installatiewerk — sanitair tellen factoren zoals deelvervanging of complete set, eigen inkoop of adviestraject en combinatie met tegelwerk mee, omdat ze de omvang en aanpak van badkamerwerk rond sanitair concreet maken.",
          "Voor keuzes in scope, indeling en combinatie met installatiewerk — sanitair beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "deelvervanging of complete set",
          "eigen inkoop of adviestraject",
          "combinatie met tegelwerk"
        ]
      },
      {
        "heading": "Welke input nodig is voor een realistische offertefase — sanitair",
        "paragraphs": [
          "Welke input nodig is voor een realistische offertefase — sanitair: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke input nodig is voor een realistische offertefase — sanitair tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van badkamerwerk rond sanitair concreet maken.",
          "Voor welke input nodig is voor een realistische offertefase — sanitair beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Gevolgen van uitstel bij vocht en slijtage — sanitair",
        "paragraphs": [
          "Gevolgen van uitstel bij vocht en slijtage — sanitair: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij gevolgen van uitstel bij vocht en slijtage — sanitair tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van badkamerwerk rond sanitair concreet maken.",
          "Voor gevolgen van uitstel bij vocht en slijtage — sanitair beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "type sanitair",
      "aanpassingen van aansluitingen",
      "montagecomplexiteit",
      "afwerkingswerk"
    ],
    "processSteps": [
      "Beschrijf je vraag rond badkamer sanitair en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende badkamer-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/badkamer",
        "title": "Badkamer",
        "description": "Bekijk ook badkamer voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/loodgieter/sanitair",
        "title": "Sanitair",
        "description": "Bekijk ook sanitair voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/badkamer/complete-badkamer",
        "title": "Complete badkamer",
        "description": "Bekijk ook complete badkamer voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Kan ik alleen een douche vervangen?",
        "answer": "Ja, deelvervanging komt veel voor."
      },
      {
        "question": "Moet leidingwerk mee veranderen?",
        "answer": "Dat hangt af van posities en productkeuze."
      },
      {
        "question": "Is maatvoering belangrijk?",
        "answer": "Ja, vooral in compacte badkamers."
      },
      {
        "question": "Voert VakConnect de montage uit?",
        "answer": "Nee, VakConnect koppelt je aan een passende specialist."
      }
    ],
    "cta": {
      "title": "Beschrijf je badkamer sanitair-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over sanitair, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Start je aanvraag voor badkamersanitair",
      "secondaryLabel": "Terug naar badkamer",
      "secondaryHref": "/badkamer"
    }
  },
  "badkamer/inloopdouche": {
    "path": "/badkamer/inloopdouche",
    "title": "Inloopdouche via VakConnect",
    "description": "Inloopdouche realiseren? Lees welke technische en praktische keuzes bepalend zijn.",
    "keywords": [
      "badkamer",
      "inloopdouche",
      "vakman",
      "VakConnect"
    ],
    "h1": "Inloopdouche: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij inloopdouche? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Badkamer",
        "href": "/badkamer"
      },
      {
        "label": "Inloopdouche"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer inloopdouche in beeld komt",
        "paragraphs": [
          "Wanneer inloopdouche in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer inloopdouche in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van badkamerwerk rond inloopdouche concreet maken.",
          "Voor wanneer inloopdouche in beeld komt beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — inloopdouche",
        "paragraphs": [
          "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — inloopdouche: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij welke signalen laten zien dat de badkamer aan vernieuwing toe is — inloopdouche tellen factoren zoals wens voor drempelloze douche, water blijft staan en oude douchezone voldoet niet mee, omdat ze de omvang en aanpak van badkamerwerk rond inloopdouche concreet maken.",
          "Voor welke signalen laten zien dat de badkamer aan vernieuwing toe is — inloopdouche beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "wens voor drempelloze douche",
          "water blijft staan",
          "oude douchezone voldoet niet"
        ]
      },
      {
        "heading": "Technische oorzaken achter vocht- of gebruiksproblemen — inloopdouche",
        "paragraphs": [
          "Technische oorzaken achter vocht- of gebruiksproblemen — inloopdouche: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij technische oorzaken achter vocht- of gebruiksproblemen — inloopdouche tellen factoren zoals onvoldoende afschot, beperkte afvoeroplossing en verouderde opbouw mee, omdat ze de omvang en aanpak van badkamerwerk rond inloopdouche concreet maken.",
          "Voor technische oorzaken achter vocht- of gebruiksproblemen — inloopdouche beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "onvoldoende afschot",
          "beperkte afvoeroplossing",
          "verouderde opbouw"
        ]
      },
      {
        "heading": "Wat een specialist eerst in kaart brengt (inloopdouche) — inloopdouche",
        "paragraphs": [
          "Wat een specialist eerst in kaart brengt (inloopdouche) — inloopdouche: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een specialist eerst in kaart brengt (inloopdouche) — inloopdouche tellen factoren zoals haalbaarheid beoordelen, vloer en afvoer aanpassen en waterdichte opbouw en afwerking maken mee, omdat ze de omvang en aanpak van badkamerwerk rond inloopdouche concreet maken.",
          "Voor wat een specialist eerst in kaart brengt (inloopdouche) — inloopdouche beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "haalbaarheid beoordelen",
          "vloer en afvoer aanpassen",
          "waterdichte opbouw en afwerking maken"
        ]
      },
      {
        "heading": "Keuzes in scope, indeling en combinatie met installatiewerk — inloopdouche",
        "paragraphs": [
          "Keuzes in scope, indeling en combinatie met installatiewerk — inloopdouche: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in scope, indeling en combinatie met installatiewerk — inloopdouche tellen factoren zoals lineaire drain of put, glasoplossing en indeling en combinatie met volledige renovatie mee, omdat ze de omvang en aanpak van badkamerwerk rond inloopdouche concreet maken.",
          "Voor keuzes in scope, indeling en combinatie met installatiewerk — inloopdouche beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "lineaire drain of put",
          "glasoplossing en indeling",
          "combinatie met volledige renovatie"
        ]
      },
      {
        "heading": "Welke input nodig is voor een realistische offertefase — inloopdouche",
        "paragraphs": [
          "Welke input nodig is voor een realistische offertefase — inloopdouche: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke input nodig is voor een realistische offertefase — inloopdouche tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van badkamerwerk rond inloopdouche concreet maken.",
          "Voor welke input nodig is voor een realistische offertefase — inloopdouche beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Gevolgen van uitstel bij vocht en slijtage — inloopdouche",
        "paragraphs": [
          "Gevolgen van uitstel bij vocht en slijtage — inloopdouche: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij gevolgen van uitstel bij vocht en slijtage — inloopdouche tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van badkamerwerk rond inloopdouche concreet maken.",
          "Voor gevolgen van uitstel bij vocht en slijtage — inloopdouche beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "vloeropbouw en afvoerwerk",
      "tegel- en wandafwerking",
      "maatwerk glas",
      "aanpassingen aan leidingwerk"
    ],
    "processSteps": [
      "Beschrijf je vraag rond inloopdouche en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende badkamer-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/badkamer",
        "title": "Badkamer",
        "description": "Bekijk ook badkamer voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/badkamer/tegelen",
        "title": "Badkamer tegelen",
        "description": "Bekijk ook badkamer tegelen voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/loodgieter/leidingwerk",
        "title": "Leidingwerk",
        "description": "Bekijk ook leidingwerk voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Past een inloopdouche in elke badkamer?",
        "answer": "Niet altijd; afvoerhoogte en beschikbare ruimte zijn bepalend."
      },
      {
        "question": "Is antislip nodig?",
        "answer": "In natte zones is antislip vaak een verstandige keuze."
      },
      {
        "question": "Kan dit zonder complete renovatie?",
        "answer": "Soms wel, afhankelijk van bestaande situatie."
      },
      {
        "question": "Doet VakConnect de uitvoering?",
        "answer": "Nee, VakConnect koppelt je aan een passende professional."
      }
    ],
    "cta": {
      "title": "Beschrijf je inloopdouche-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over inloopdouche, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Vraag een specialist voor inloopdouche",
      "secondaryLabel": "Terug naar badkamer",
      "secondaryHref": "/badkamer"
    }
  },
  "badkamer/complete-badkamer": {
    "path": "/badkamer/complete-badkamer",
    "title": "Complete badkamer via VakConnect",
    "description": "Complete badkamer vernieuwen: van oude situatie naar afgestemd totaalplan.",
    "keywords": [
      "badkamer",
      "complete-badkamer",
      "vakman",
      "VakConnect"
    ],
    "h1": "Complete badkamer: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij complete badkamer? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Badkamer",
        "href": "/badkamer"
      },
      {
        "label": "Complete badkamer"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer complete badkamer in beeld komt",
        "paragraphs": [
          "Wanneer complete badkamer in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer complete badkamer in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van badkamerwerk rond complete badkamer concreet maken.",
          "Voor wanneer complete badkamer in beeld komt beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — complete badkamer",
        "paragraphs": [
          "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — complete badkamer: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij welke signalen laten zien dat de badkamer aan vernieuwing toe is — complete badkamer tellen factoren zoals meerdere gebreken tegelijk, technisch en visueel verouderd en wens voor nieuwe indeling mee, omdat ze de omvang en aanpak van badkamerwerk rond complete badkamer concreet maken.",
          "Voor welke signalen laten zien dat de badkamer aan vernieuwing toe is — complete badkamer beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "meerdere gebreken tegelijk",
          "technisch en visueel verouderd",
          "wens voor nieuwe indeling"
        ]
      },
      {
        "heading": "Technische oorzaken achter vocht- of gebruiksproblemen — complete badkamer",
        "paragraphs": [
          "Technische oorzaken achter vocht- of gebruiksproblemen — complete badkamer: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij technische oorzaken achter vocht- of gebruiksproblemen — complete badkamer tellen factoren zoals ouderdom van installatie, opstapeling van kleine problemen en nieuwe woonbehoefte mee, omdat ze de omvang en aanpak van badkamerwerk rond complete badkamer concreet maken.",
          "Voor technische oorzaken achter vocht- of gebruiksproblemen — complete badkamer beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "ouderdom van installatie",
          "opstapeling van kleine problemen",
          "nieuwe woonbehoefte"
        ]
      },
      {
        "heading": "Wat een specialist eerst in kaart brengt (complete badkamer) — complete badkamer",
        "paragraphs": [
          "Wat een specialist eerst in kaart brengt (complete badkamer) — complete badkamer: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een specialist eerst in kaart brengt (complete badkamer) — complete badkamer tellen factoren zoals inventariseren en prioriteren, technische disciplines afstemmen en volledige uitvoering en oplevering mee, omdat ze de omvang en aanpak van badkamerwerk rond complete badkamer concreet maken.",
          "Voor wat een specialist eerst in kaart brengt (complete badkamer) — complete badkamer beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "inventariseren en prioriteren",
          "technische disciplines afstemmen",
          "volledige uitvoering en oplevering"
        ]
      },
      {
        "heading": "Keuzes in scope, indeling en combinatie met installatiewerk — complete badkamer",
        "paragraphs": [
          "Keuzes in scope, indeling en combinatie met installatiewerk — complete badkamer: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in scope, indeling en combinatie met installatiewerk — complete badkamer tellen factoren zoals basisrenovatie of luxe afwerking en gefaseerde planning of alles in één traject mee, omdat ze de omvang en aanpak van badkamerwerk rond complete badkamer concreet maken.",
          "Voor keuzes in scope, indeling en combinatie met installatiewerk — complete badkamer beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "basisrenovatie of luxe afwerking",
          "gefaseerde planning of alles in één traject"
        ]
      },
      {
        "heading": "Welke input nodig is voor een realistische offertefase — complete badkamer",
        "paragraphs": [
          "Welke input nodig is voor een realistische offertefase — complete badkamer: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke input nodig is voor een realistische offertefase — complete badkamer tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van badkamerwerk rond complete badkamer concreet maken.",
          "Voor welke input nodig is voor een realistische offertefase — complete badkamer beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Gevolgen van uitstel bij vocht en slijtage — complete badkamer",
        "paragraphs": [
          "Gevolgen van uitstel bij vocht en slijtage — complete badkamer: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij gevolgen van uitstel bij vocht en slijtage — complete badkamer tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van badkamerwerk rond complete badkamer concreet maken.",
          "Voor gevolgen van uitstel bij vocht en slijtage — complete badkamer beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "sloop en voorbereiding",
      "leiding- en elektra-aanpassingen",
      "materiaalkeuzes",
      "coördinatie van disciplines"
    ],
    "processSteps": [
      "Beschrijf je vraag rond complete badkamer en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende badkamer-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/badkamer",
        "title": "Badkamer",
        "description": "Bekijk ook badkamer voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/badkamer/renovatie",
        "title": "Badkamerrenovatie",
        "description": "Bekijk ook badkamerrenovatie voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/verbouwing/woning-renoveren",
        "title": "Woning renoveren",
        "description": "Bekijk ook woning renoveren voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Hoe concreet moet mijn plan zijn?",
        "answer": "Een duidelijke wensenlijst en foto’s zijn een goed startpunt."
      },
      {
        "question": "Waarom is volgorde van werk belangrijk?",
        "answer": "Omdat techniek en afwerking direct op elkaar aansluiten."
      },
      {
        "question": "Kan ik onderdelen later kiezen?",
        "answer": "Ja, veel keuzes kunnen na eerste technische beoordeling worden aangescherpt."
      },
      {
        "question": "Voert VakConnect het werk uit?",
        "answer": "Nee, VakConnect koppelt je aan passende specialisten."
      }
    ],
    "cta": {
      "title": "Beschrijf je complete badkamer-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over complete badkamer, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Plaats je complete badkamer-aanvraag",
      "secondaryLabel": "Terug naar badkamer",
      "secondaryHref": "/badkamer"
    }
  },
  "badkamer/ventilatie": {
    "path": "/badkamer/ventilatie",
    "title": "Badkamerventilatie via VakConnect",
    "description": "Ventilatieproblemen in de badkamer aanpakken: lees oorzaken, gevolgen en opties.",
    "keywords": [
      "badkamer",
      "ventilatie",
      "vakman",
      "VakConnect"
    ],
    "h1": "Badkamerventilatie: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij badkamerventilatie? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Badkamer",
        "href": "/badkamer"
      },
      {
        "label": "Badkamerventilatie"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer badkamerventilatie in beeld komt",
        "paragraphs": [
          "Wanneer badkamerventilatie in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer badkamerventilatie in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van badkamerwerk rond ventilatie concreet maken.",
          "Voor wanneer badkamerventilatie in beeld komt beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — ventilatie",
        "paragraphs": [
          "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — ventilatie: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij welke signalen laten zien dat de badkamer aan vernieuwing toe is — ventilatie tellen factoren zoals lang natte oppervlakken, schimmel in voegen en blijvende muffe geur mee, omdat ze de omvang en aanpak van badkamerwerk rond ventilatie concreet maken.",
          "Voor welke signalen laten zien dat de badkamer aan vernieuwing toe is — ventilatie beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "lang natte oppervlakken",
          "schimmel in voegen",
          "blijvende muffe geur"
        ]
      },
      {
        "heading": "Technische oorzaken achter vocht- of gebruiksproblemen — ventilatie",
        "paragraphs": [
          "Technische oorzaken achter vocht- of gebruiksproblemen — ventilatie: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij technische oorzaken achter vocht- of gebruiksproblemen — ventilatie tellen factoren zoals onvoldoende afzuiging, verouderde ventilator en onjuiste luchtstroom mee, omdat ze de omvang en aanpak van badkamerwerk rond ventilatie concreet maken.",
          "Voor technische oorzaken achter vocht- of gebruiksproblemen — ventilatie beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "onvoldoende afzuiging",
          "verouderde ventilator",
          "onjuiste luchtstroom"
        ]
      },
      {
        "heading": "Wat een specialist eerst in kaart brengt (ventilatie) — ventilatie",
        "paragraphs": [
          "Wat een specialist eerst in kaart brengt (ventilatie) — ventilatie: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een specialist eerst in kaart brengt (ventilatie) — ventilatie tellen factoren zoals ventilatieprestatie beoordelen, componenten verbeteren of vervangen en afstemmen met badkamergebruik mee, omdat ze de omvang en aanpak van badkamerwerk rond ventilatie concreet maken.",
          "Voor wat een specialist eerst in kaart brengt (ventilatie) — ventilatie beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "ventilatieprestatie beoordelen",
          "componenten verbeteren of vervangen",
          "afstemmen met badkamergebruik"
        ]
      },
      {
        "heading": "Keuzes in scope, indeling en combinatie met installatiewerk — ventilatie",
        "paragraphs": [
          "Keuzes in scope, indeling en combinatie met installatiewerk — ventilatie: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in scope, indeling en combinatie met installatiewerk — ventilatie tellen factoren zoals lokaal ventilatieherstel of integrale renovatie en combineren met elektra-aanpassing mee, omdat ze de omvang en aanpak van badkamerwerk rond ventilatie concreet maken.",
          "Voor keuzes in scope, indeling en combinatie met installatiewerk — ventilatie beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "lokaal ventilatieherstel of integrale renovatie",
          "combineren met elektra-aanpassing"
        ]
      },
      {
        "heading": "Welke input nodig is voor een realistische offertefase — ventilatie",
        "paragraphs": [
          "Welke input nodig is voor een realistische offertefase — ventilatie: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke input nodig is voor een realistische offertefase — ventilatie tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van badkamerwerk rond ventilatie concreet maken.",
          "Voor welke input nodig is voor een realistische offertefase — ventilatie beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Gevolgen van uitstel bij vocht en slijtage — ventilatie",
        "paragraphs": [
          "Gevolgen van uitstel bij vocht en slijtage — ventilatie: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij gevolgen van uitstel bij vocht en slijtage — ventilatie tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van badkamerwerk rond ventilatie concreet maken.",
          "Voor gevolgen van uitstel bij vocht en slijtage — ventilatie beoordeelt een badkamerspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op vochtproblemen en functieverlies toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "type systeem",
      "aanpassingen aan kanalen",
      "elektra-aansluiting",
      "inregel- en testwerk"
    ],
    "processSteps": [
      "Beschrijf je vraag rond badkamerventilatie en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende badkamer-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/badkamer",
        "title": "Badkamer",
        "description": "Bekijk ook badkamer voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/badkamer/renovatie",
        "title": "Badkamerrenovatie",
        "description": "Bekijk ook badkamerrenovatie voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/elektricien/verlichting",
        "title": "Verlichting",
        "description": "Bekijk ook verlichting voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Is ventilatie alleen comfort?",
        "answer": "Nee, het is ook belangrijk voor behoud van afwerking en beperking van vochtproblemen."
      },
      {
        "question": "Wanneer vervang ik de ventilator?",
        "answer": "Bij onvoldoende capaciteit, veel geluid of storingen."
      },
      {
        "question": "Kan ventilatie los van renovatie?",
        "answer": "Ja, in veel situaties wel."
      },
      {
        "question": "Doet VakConnect dit zelf?",
        "answer": "Nee, VakConnect koppelt je aan een passende specialist."
      }
    ],
    "cta": {
      "title": "Beschrijf je badkamerventilatie-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over ventilatie, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Start je aanvraag voor badkamerventilatie",
      "secondaryLabel": "Terug naar badkamer",
      "secondaryHref": "/badkamer"
    }
  },
  "isolatie/dakisolatie": {
    "path": "/isolatie/dakisolatie",
    "title": "Dakisolatie via VakConnect",
    "description": "Dakisolatie plannen? Lees verschillen tussen daktypen, methodes en aandachtspunten.",
    "keywords": [
      "isolatie",
      "dakisolatie",
      "vakman",
      "VakConnect"
    ],
    "h1": "Dakisolatie: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij dakisolatie? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Isolatie",
        "href": "/isolatie"
      },
      {
        "label": "Dakisolatie"
      }
    ],
    "sections": [
      {
        "heading": "Hellend dak en plat dak vragen een andere benadering",
        "paragraphs": [
          "Hellend dak en plat dak vragen een andere benadering: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij hellend dak en plat dak vragen een andere benadering tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van isolatiewerk rond dakisolatie concreet maken.",
          "Voor hellend dak en plat dak vragen een andere benadering beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen dat isolatieverbetering zinvol is — dakisolatie",
        "paragraphs": [
          "Signalen dat isolatieverbetering zinvol is — dakisolatie: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen dat isolatieverbetering zinvol is — dakisolatie tellen factoren zoals koude bovenverdieping, hoge stookvraag en tocht op zolder mee, omdat ze de omvang en aanpak van isolatiewerk rond dakisolatie concreet maken.",
          "Voor signalen dat isolatieverbetering zinvol is — dakisolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "koude bovenverdieping",
          "hoge stookvraag",
          "tocht op zolder"
        ]
      },
      {
        "heading": "Waardoor comfortverlies en warmteverlies ontstaan — dakisolatie",
        "paragraphs": [
          "Waardoor comfortverlies en warmteverlies ontstaan — dakisolatie: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij waardoor comfortverlies en warmteverlies ontstaan — dakisolatie tellen factoren zoals onvoldoende isolatielaag, oude dakopbouw en zwakke aansluitingen mee, omdat ze de omvang en aanpak van isolatiewerk rond dakisolatie concreet maken.",
          "Voor waardoor comfortverlies en warmteverlies ontstaan — dakisolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "onvoldoende isolatielaag",
          "oude dakopbouw",
          "zwakke aansluitingen"
        ]
      },
      {
        "heading": "Wat een isolatiespecialist beoordeelt vóór uitvoering (dakisolatie) — dakisolatie",
        "paragraphs": [
          "Wat een isolatiespecialist beoordeelt vóór uitvoering (dakisolatie) — dakisolatie: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een isolatiespecialist beoordeelt vóór uitvoering (dakisolatie) — dakisolatie tellen factoren zoals daktype en opbouw beoordelen, methode kiezen (binnenzijde of buitenzijde) en uitvoering combineren met details en ventilatie mee, omdat ze de omvang en aanpak van isolatiewerk rond dakisolatie concreet maken.",
          "Voor wat een isolatiespecialist beoordeelt vóór uitvoering (dakisolatie) — dakisolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "daktype en opbouw beoordelen",
          "methode kiezen (binnenzijde of buitenzijde)",
          "uitvoering combineren met details en ventilatie"
        ]
      },
      {
        "heading": "Keuzes in methode, materiaal en combinatiemaatregelen — dakisolatie",
        "paragraphs": [
          "Keuzes in methode, materiaal en combinatiemaatregelen — dakisolatie: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in methode, materiaal en combinatiemaatregelen — dakisolatie tellen factoren zoals isoleren bij renovatie of als losse maatregel, focus op comfort, energie of beide en combinatie met dakrenovatie mee, omdat ze de omvang en aanpak van isolatiewerk rond dakisolatie concreet maken.",
          "Voor keuzes in methode, materiaal en combinatiemaatregelen — dakisolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "isoleren bij renovatie of als losse maatregel",
          "focus op comfort, energie of beide",
          "combinatie met dakrenovatie"
        ]
      },
      {
        "heading": "Welke woninginformatie je vooraf moet delen — dakisolatie",
        "paragraphs": [
          "Welke woninginformatie je vooraf moet delen — dakisolatie: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke woninginformatie je vooraf moet delen — dakisolatie tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van isolatiewerk rond dakisolatie concreet maken.",
          "Voor welke woninginformatie je vooraf moet delen — dakisolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en energiegebruik — dakisolatie",
        "paragraphs": [
          "Wat uitstel betekent voor comfort en energiegebruik — dakisolatie: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij wat uitstel betekent voor comfort en energiegebruik — dakisolatie tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van isolatiewerk rond dakisolatie concreet maken.",
          "Voor wat uitstel betekent voor comfort en energiegebruik — dakisolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "oppervlakte en dakvorm",
      "materiaal en dikte",
      "toegang tot opbouw",
      "afwerking binnenzijde",
      "combinatie met renovatiewerk"
    ],
    "processSteps": [
      "Beschrijf je vraag rond dakisolatie en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende isolatie-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/isolatie",
        "title": "Isolatie",
        "description": "Bekijk ook isolatie voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/dakdekker/dakrenovatie",
        "title": "Dakrenovatie",
        "description": "Bekijk ook dakrenovatie voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/verbouwing/zolder-verbouwen",
        "title": "Zolder verbouwen",
        "description": "Bekijk ook zolder verbouwen voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Is dakisolatie bij elk dak hetzelfde?",
        "answer": "Nee, hellende en platte daken vragen vaak een andere aanpak."
      },
      {
        "question": "Wanneer combineer ik met renovatie?",
        "answer": "Als de dakopbouw toch wordt aangepakt, is combineren vaak efficiënt."
      },
      {
        "question": "Moet ventilatie worden meegenomen?",
        "answer": "Ja, dat is belangrijk voor duurzaam resultaat."
      },
      {
        "question": "Voert VakConnect isolatie uit?",
        "answer": "Nee, VakConnect koppelt je aan een passende specialist."
      }
    ],
    "cta": {
      "title": "Beschrijf je dakisolatie-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over dakisolatie, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Vraag dakisolatie aan",
      "secondaryLabel": "Terug naar isolatie",
      "secondaryHref": "/isolatie"
    }
  },
  "isolatie/spouwmuurisolatie": {
    "path": "/isolatie/spouwmuurisolatie",
    "title": "Spouwmuurisolatie via VakConnect",
    "description": "Spouwmuurisolatie overwegen? Ontdek wanneer de spouw geschikt is en welke factoren meespelen.",
    "keywords": [
      "isolatie",
      "spouwmuurisolatie",
      "vakman",
      "VakConnect"
    ],
    "h1": "Spouwmuurisolatie: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij spouwmuurisolatie? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Isolatie",
        "href": "/isolatie"
      },
      {
        "label": "Spouwmuurisolatie"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer spouwmuurisolatie in beeld komt",
        "paragraphs": [
          "Wanneer spouwmuurisolatie in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer spouwmuurisolatie in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van isolatiewerk rond spouwmuurisolatie concreet maken.",
          "Voor wanneer spouwmuurisolatie in beeld komt beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen dat isolatieverbetering zinvol is — spouwmuurisolatie",
        "paragraphs": [
          "Signalen dat isolatieverbetering zinvol is — spouwmuurisolatie: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen dat isolatieverbetering zinvol is — spouwmuurisolatie tellen factoren zoals koude buitenmuren, tochtbeleving en hoge energievraag mee, omdat ze de omvang en aanpak van isolatiewerk rond spouwmuurisolatie concreet maken.",
          "Voor signalen dat isolatieverbetering zinvol is — spouwmuurisolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "koude buitenmuren",
          "tochtbeleving",
          "hoge energievraag"
        ]
      },
      {
        "heading": "Waardoor comfortverlies en warmteverlies ontstaan — spouwmuurisolatie",
        "paragraphs": [
          "Waardoor comfortverlies en warmteverlies ontstaan — spouwmuurisolatie: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij waardoor comfortverlies en warmteverlies ontstaan — spouwmuurisolatie tellen factoren zoals lege spouw, onregelmatige vulling en vochtbelasting mee, omdat ze de omvang en aanpak van isolatiewerk rond spouwmuurisolatie concreet maken.",
          "Voor waardoor comfortverlies en warmteverlies ontstaan — spouwmuurisolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "lege spouw",
          "onregelmatige vulling",
          "vochtbelasting"
        ]
      },
      {
        "heading": "Wat een isolatiespecialist beoordeelt vóór uitvoering (spouwmuurisolatie) — spouwmuurisolatie",
        "paragraphs": [
          "Wat een isolatiespecialist beoordeelt vóór uitvoering (spouwmuurisolatie) — spouwmuurisolatie: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een isolatiespecialist beoordeelt vóór uitvoering (spouwmuurisolatie) — spouwmuurisolatie tellen factoren zoals spouwconditie beoordelen, geschikt materiaal inblazen en controle op resultaat mee, omdat ze de omvang en aanpak van isolatiewerk rond spouwmuurisolatie concreet maken.",
          "Voor wat een isolatiespecialist beoordeelt vóór uitvoering (spouwmuurisolatie) — spouwmuurisolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "spouwconditie beoordelen",
          "geschikt materiaal inblazen",
          "controle op resultaat"
        ]
      },
      {
        "heading": "Keuzes in methode, materiaal en combinatiemaatregelen — spouwmuurisolatie",
        "paragraphs": [
          "Keuzes in methode, materiaal en combinatiemaatregelen — spouwmuurisolatie: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in methode, materiaal en combinatiemaatregelen — spouwmuurisolatie tellen factoren zoals losse maatregel of onderdeel van bredere renovatie en combineren met gevel- of kozijnwerk mee, omdat ze de omvang en aanpak van isolatiewerk rond spouwmuurisolatie concreet maken.",
          "Voor keuzes in methode, materiaal en combinatiemaatregelen — spouwmuurisolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "losse maatregel of onderdeel van bredere renovatie",
          "combineren met gevel- of kozijnwerk"
        ]
      },
      {
        "heading": "Welke woninginformatie je vooraf moet delen — spouwmuurisolatie",
        "paragraphs": [
          "Welke woninginformatie je vooraf moet delen — spouwmuurisolatie: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke woninginformatie je vooraf moet delen — spouwmuurisolatie tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van isolatiewerk rond spouwmuurisolatie concreet maken.",
          "Voor welke woninginformatie je vooraf moet delen — spouwmuurisolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en energiegebruik — spouwmuurisolatie",
        "paragraphs": [
          "Wat uitstel betekent voor comfort en energiegebruik — spouwmuurisolatie: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij wat uitstel betekent voor comfort en energiegebruik — spouwmuurisolatie tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van isolatiewerk rond spouwmuurisolatie concreet maken.",
          "Voor wat uitstel betekent voor comfort en energiegebruik — spouwmuurisolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "geveloppervlak",
      "spouwconditie",
      "materiaalkeuze",
      "bereikbaarheid buitengevel"
    ],
    "processSteps": [
      "Beschrijf je vraag rond spouwmuurisolatie en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende isolatie-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/isolatie",
        "title": "Isolatie",
        "description": "Bekijk ook isolatie voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/isolatie/gevelisolatie",
        "title": "Gevelisolatie",
        "description": "Bekijk ook gevelisolatie voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/verbouwing/woning-renoveren",
        "title": "Woning renoveren",
        "description": "Bekijk ook woning renoveren voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Is elke spouw geschikt?",
        "answer": "Nee, de spouw moet eerst beoordeeld worden."
      },
      {
        "question": "Kan vocht een belemmering zijn?",
        "answer": "Ja, vochtgedrag is een belangrijke factor in de keuze."
      },
      {
        "question": "Hoe ingrijpend is de uitvoering?",
        "answer": "Vaak minder ingrijpend dan grote renovatiewerkzaamheden."
      },
      {
        "question": "Doet VakConnect dit zelf?",
        "answer": "Nee, je wordt gekoppeld aan een passende specialist."
      }
    ],
    "cta": {
      "title": "Beschrijf je spouwmuurisolatie-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over spouwmuurisolatie, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Start je aanvraag voor spouwmuurisolatie",
      "secondaryLabel": "Terug naar isolatie",
      "secondaryHref": "/isolatie"
    }
  },
  "isolatie/vloerisolatie": {
    "path": "/isolatie/vloerisolatie",
    "title": "Vloerisolatie via VakConnect",
    "description": "Vloerisolatie voor meer comfort: lees welke aanpak past bij jouw woning.",
    "keywords": [
      "isolatie",
      "vloerisolatie",
      "vakman",
      "VakConnect"
    ],
    "h1": "Vloerisolatie: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij vloerisolatie? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Isolatie",
        "href": "/isolatie"
      },
      {
        "label": "Vloerisolatie"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer vloerisolatie in beeld komt",
        "paragraphs": [
          "Wanneer vloerisolatie in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer vloerisolatie in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van isolatiewerk rond vloerisolatie concreet maken.",
          "Voor wanneer vloerisolatie in beeld komt beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen dat isolatieverbetering zinvol is — vloerisolatie",
        "paragraphs": [
          "Signalen dat isolatieverbetering zinvol is — vloerisolatie: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen dat isolatieverbetering zinvol is — vloerisolatie tellen factoren zoals koude vloer, tocht langs plinten en vochtige kruipruimte mee, omdat ze de omvang en aanpak van isolatiewerk rond vloerisolatie concreet maken.",
          "Voor signalen dat isolatieverbetering zinvol is — vloerisolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "koude vloer",
          "tocht langs plinten",
          "vochtige kruipruimte"
        ]
      },
      {
        "heading": "Waardoor comfortverlies en warmteverlies ontstaan — vloerisolatie",
        "paragraphs": [
          "Waardoor comfortverlies en warmteverlies ontstaan — vloerisolatie: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij waardoor comfortverlies en warmteverlies ontstaan — vloerisolatie tellen factoren zoals ongeïsoleerde vloer, koude lucht uit kruipruimte en vochtbelasting mee, omdat ze de omvang en aanpak van isolatiewerk rond vloerisolatie concreet maken.",
          "Voor waardoor comfortverlies en warmteverlies ontstaan — vloerisolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "ongeïsoleerde vloer",
          "koude lucht uit kruipruimte",
          "vochtbelasting"
        ]
      },
      {
        "heading": "Wat een isolatiespecialist beoordeelt vóór uitvoering (vloerisolatie) — vloerisolatie",
        "paragraphs": [
          "Wat een isolatiespecialist beoordeelt vóór uitvoering (vloerisolatie) — vloerisolatie: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een isolatiespecialist beoordeelt vóór uitvoering (vloerisolatie) — vloerisolatie tellen factoren zoals kruipruimte inspecteren, geschikte isolatiemethode kiezen en uitvoering en controle mee, omdat ze de omvang en aanpak van isolatiewerk rond vloerisolatie concreet maken.",
          "Voor wat een isolatiespecialist beoordeelt vóór uitvoering (vloerisolatie) — vloerisolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "kruipruimte inspecteren",
          "geschikte isolatiemethode kiezen",
          "uitvoering en controle"
        ]
      },
      {
        "heading": "Keuzes in methode, materiaal en combinatiemaatregelen — vloerisolatie",
        "paragraphs": [
          "Keuzes in methode, materiaal en combinatiemaatregelen — vloerisolatie: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in methode, materiaal en combinatiemaatregelen — vloerisolatie tellen factoren zoals vloer- of bodemgerichte aanpak en combineren met kruipruimte-isolatie mee, omdat ze de omvang en aanpak van isolatiewerk rond vloerisolatie concreet maken.",
          "Voor keuzes in methode, materiaal en combinatiemaatregelen — vloerisolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "vloer- of bodemgerichte aanpak",
          "combineren met kruipruimte-isolatie"
        ]
      },
      {
        "heading": "Welke woninginformatie je vooraf moet delen — vloerisolatie",
        "paragraphs": [
          "Welke woninginformatie je vooraf moet delen — vloerisolatie: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke woninginformatie je vooraf moet delen — vloerisolatie tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van isolatiewerk rond vloerisolatie concreet maken.",
          "Voor welke woninginformatie je vooraf moet delen — vloerisolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en energiegebruik — vloerisolatie",
        "paragraphs": [
          "Wat uitstel betekent voor comfort en energiegebruik — vloerisolatie: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij wat uitstel betekent voor comfort en energiegebruik — vloerisolatie tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van isolatiewerk rond vloerisolatie concreet maken.",
          "Voor wat uitstel betekent voor comfort en energiegebruik — vloerisolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "toegankelijkheid kruipruimte",
      "oppervlak",
      "materiaalkeuze",
      "vochtmaatregelen"
    ],
    "processSteps": [
      "Beschrijf je vraag rond vloerisolatie en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende isolatie-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/isolatie",
        "title": "Isolatie",
        "description": "Bekijk ook isolatie voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/isolatie/kruipruimte-isolatie",
        "title": "Kruipruimte isolatie",
        "description": "Bekijk ook kruipruimte isolatie voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/verbouwing/woning-renoveren",
        "title": "Woning renoveren",
        "description": "Bekijk ook woning renoveren voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Is kruipruimte altijd nodig?",
        "answer": "Voor veel methoden wel, maar niet voor alle."
      },
      {
        "question": "Werkt vloerisolatie ook bij vocht?",
        "answer": "Dat kan, mits vochtaspecten eerst goed worden meegenomen."
      },
      {
        "question": "Kan dit per deel van de woning?",
        "answer": "Soms wel, afhankelijk van opbouw."
      },
      {
        "question": "Voert VakConnect dit uit?",
        "answer": "Nee, VakConnect koppelt je aan een specialist."
      }
    ],
    "cta": {
      "title": "Beschrijf je vloerisolatie-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over vloerisolatie, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Vraag vloerisolatie aan",
      "secondaryLabel": "Terug naar isolatie",
      "secondaryHref": "/isolatie"
    }
  },
  "isolatie/gevelisolatie": {
    "path": "/isolatie/gevelisolatie",
    "title": "Gevelisolatie via VakConnect",
    "description": "Gevelisolatie plannen? Ontdek wanneer deze maatregel past en welke keuzes belangrijk zijn.",
    "keywords": [
      "isolatie",
      "gevelisolatie",
      "vakman",
      "VakConnect"
    ],
    "h1": "Gevelisolatie: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij gevelisolatie? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Isolatie",
        "href": "/isolatie"
      },
      {
        "label": "Gevelisolatie"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer gevelisolatie in beeld komt",
        "paragraphs": [
          "Wanneer gevelisolatie in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer gevelisolatie in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van isolatiewerk rond gevelisolatie concreet maken.",
          "Voor wanneer gevelisolatie in beeld komt beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen dat isolatieverbetering zinvol is — gevelisolatie",
        "paragraphs": [
          "Signalen dat isolatieverbetering zinvol is — gevelisolatie: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen dat isolatieverbetering zinvol is — gevelisolatie tellen factoren zoals koude buitenwanden, hoge warmteverliezen en renovatie van gevelafwerking mee, omdat ze de omvang en aanpak van isolatiewerk rond gevelisolatie concreet maken.",
          "Voor signalen dat isolatieverbetering zinvol is — gevelisolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "koude buitenwanden",
          "hoge warmteverliezen",
          "renovatie van gevelafwerking"
        ]
      },
      {
        "heading": "Waardoor comfortverlies en warmteverlies ontstaan — gevelisolatie",
        "paragraphs": [
          "Waardoor comfortverlies en warmteverlies ontstaan — gevelisolatie: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij waardoor comfortverlies en warmteverlies ontstaan — gevelisolatie tellen factoren zoals onvoldoende isolatieschil, verouderde gevelopbouw en koudebruggen mee, omdat ze de omvang en aanpak van isolatiewerk rond gevelisolatie concreet maken.",
          "Voor waardoor comfortverlies en warmteverlies ontstaan — gevelisolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "onvoldoende isolatieschil",
          "verouderde gevelopbouw",
          "koudebruggen"
        ]
      },
      {
        "heading": "Wat een isolatiespecialist beoordeelt vóór uitvoering (gevelisolatie) — gevelisolatie",
        "paragraphs": [
          "Wat een isolatiespecialist beoordeelt vóór uitvoering (gevelisolatie) — gevelisolatie: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een isolatiespecialist beoordeelt vóór uitvoering (gevelisolatie) — gevelisolatie tellen factoren zoals gevelsituatie analyseren, systeemkeuze en detaillering bepalen en uitvoering met nette aansluitingen mee, omdat ze de omvang en aanpak van isolatiewerk rond gevelisolatie concreet maken.",
          "Voor wat een isolatiespecialist beoordeelt vóór uitvoering (gevelisolatie) — gevelisolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "gevelsituatie analyseren",
          "systeemkeuze en detaillering bepalen",
          "uitvoering met nette aansluitingen"
        ]
      },
      {
        "heading": "Keuzes in methode, materiaal en combinatiemaatregelen — gevelisolatie",
        "paragraphs": [
          "Keuzes in methode, materiaal en combinatiemaatregelen — gevelisolatie: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in methode, materiaal en combinatiemaatregelen — gevelisolatie tellen factoren zoals binnen- of buitengevelbenadering en combineren met kozijnproject mee, omdat ze de omvang en aanpak van isolatiewerk rond gevelisolatie concreet maken.",
          "Voor keuzes in methode, materiaal en combinatiemaatregelen — gevelisolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "binnen- of buitengevelbenadering",
          "combineren met kozijnproject"
        ]
      },
      {
        "heading": "Welke woninginformatie je vooraf moet delen — gevelisolatie",
        "paragraphs": [
          "Welke woninginformatie je vooraf moet delen — gevelisolatie: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke woninginformatie je vooraf moet delen — gevelisolatie tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van isolatiewerk rond gevelisolatie concreet maken.",
          "Voor welke woninginformatie je vooraf moet delen — gevelisolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en energiegebruik — gevelisolatie",
        "paragraphs": [
          "Wat uitstel betekent voor comfort en energiegebruik — gevelisolatie: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij wat uitstel betekent voor comfort en energiegebruik — gevelisolatie tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van isolatiewerk rond gevelisolatie concreet maken.",
          "Voor wat uitstel betekent voor comfort en energiegebruik — gevelisolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "geveloppervlak",
      "systeem en afwerking",
      "aansluitwerk rond openingen",
      "steiger en bereikbaarheid"
    ],
    "processSteps": [
      "Beschrijf je vraag rond gevelisolatie en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende isolatie-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/isolatie",
        "title": "Isolatie",
        "description": "Bekijk ook isolatie voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/kozijnen/kozijnen-vervangen",
        "title": "Kozijnen vervangen",
        "description": "Bekijk ook kozijnen vervangen voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/verbouwing/uitbouw",
        "title": "Uitbouw",
        "description": "Bekijk ook uitbouw voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Is vergunning nodig?",
        "answer": "Dat verschilt per situatie en lokale regels."
      },
      {
        "question": "Waarom zijn aansluitdetails rond kozijnen belangrijk?",
        "answer": "Daar ontstaan anders snel koudebruggen of afwerkingsproblemen."
      },
      {
        "question": "Kan gevelisolatie gefaseerd?",
        "answer": "Soms wel, afhankelijk van gevelindeling."
      },
      {
        "question": "Doet VakConnect dit zelf?",
        "answer": "Nee, VakConnect koppelt je aan een passende specialist."
      }
    ],
    "cta": {
      "title": "Beschrijf je gevelisolatie-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over gevelisolatie, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Beschrijf je gevelisolatieklus",
      "secondaryLabel": "Terug naar isolatie",
      "secondaryHref": "/isolatie"
    }
  },
  "isolatie/kruipruimte-isolatie": {
    "path": "/isolatie/kruipruimte-isolatie",
    "title": "Kruipruimte isolatie via VakConnect",
    "description": "Kruipruimte isoleren voor meer comfort en minder vochtimpact in huis.",
    "keywords": [
      "isolatie",
      "kruipruimte-isolatie",
      "vakman",
      "VakConnect"
    ],
    "h1": "Kruipruimte isolatie: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij kruipruimte isolatie? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Isolatie",
        "href": "/isolatie"
      },
      {
        "label": "Kruipruimte isolatie"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer kruipruimte isolatie in beeld komt",
        "paragraphs": [
          "Wanneer kruipruimte isolatie in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer kruipruimte isolatie in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van isolatiewerk rond kruipruimte isolatie concreet maken.",
          "Voor wanneer kruipruimte isolatie in beeld komt beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Signalen dat isolatieverbetering zinvol is — kruipruimte isolatie",
        "paragraphs": [
          "Signalen dat isolatieverbetering zinvol is — kruipruimte isolatie: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij signalen dat isolatieverbetering zinvol is — kruipruimte isolatie tellen factoren zoals koude trek op begane grond, vochtige lucht en muffe geur mee, omdat ze de omvang en aanpak van isolatiewerk rond kruipruimte isolatie concreet maken.",
          "Voor signalen dat isolatieverbetering zinvol is — kruipruimte isolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "koude trek op begane grond",
          "vochtige lucht",
          "muffe geur"
        ]
      },
      {
        "heading": "Waardoor comfortverlies en warmteverlies ontstaan — kruipruimte isolatie",
        "paragraphs": [
          "Waardoor comfortverlies en warmteverlies ontstaan — kruipruimte isolatie: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij waardoor comfortverlies en warmteverlies ontstaan — kruipruimte isolatie tellen factoren zoals onvoldoende isolatie, hoge vochtbelasting en beperkte ventilatie mee, omdat ze de omvang en aanpak van isolatiewerk rond kruipruimte isolatie concreet maken.",
          "Voor waardoor comfortverlies en warmteverlies ontstaan — kruipruimte isolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "onvoldoende isolatie",
          "hoge vochtbelasting",
          "beperkte ventilatie"
        ]
      },
      {
        "heading": "Wat een isolatiespecialist beoordeelt vóór uitvoering (kruipruimte isolatie) — kruipruimte isolatie",
        "paragraphs": [
          "Wat een isolatiespecialist beoordeelt vóór uitvoering (kruipruimte isolatie) — kruipruimte isolatie: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij wat een isolatiespecialist beoordeelt vóór uitvoering (kruipruimte isolatie) — kruipruimte isolatie tellen factoren zoals toegang en staat beoordelen, methode kiezen en uitvoering en controle mee, omdat ze de omvang en aanpak van isolatiewerk rond kruipruimte isolatie concreet maken.",
          "Voor wat een isolatiespecialist beoordeelt vóór uitvoering (kruipruimte isolatie) — kruipruimte isolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "toegang en staat beoordelen",
          "methode kiezen",
          "uitvoering en controle"
        ]
      },
      {
        "heading": "Keuzes in methode, materiaal en combinatiemaatregelen — kruipruimte isolatie",
        "paragraphs": [
          "Keuzes in methode, materiaal en combinatiemaatregelen — kruipruimte isolatie: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in methode, materiaal en combinatiemaatregelen — kruipruimte isolatie tellen factoren zoals bodem- of vloerisolatie en combinatie met ventilatiemaatregelen mee, omdat ze de omvang en aanpak van isolatiewerk rond kruipruimte isolatie concreet maken.",
          "Voor keuzes in methode, materiaal en combinatiemaatregelen — kruipruimte isolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "bodem- of vloerisolatie",
          "combinatie met ventilatiemaatregelen"
        ]
      },
      {
        "heading": "Welke woninginformatie je vooraf moet delen — kruipruimte isolatie",
        "paragraphs": [
          "Welke woninginformatie je vooraf moet delen — kruipruimte isolatie: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke woninginformatie je vooraf moet delen — kruipruimte isolatie tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van isolatiewerk rond kruipruimte isolatie concreet maken.",
          "Voor welke woninginformatie je vooraf moet delen — kruipruimte isolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en energiegebruik — kruipruimte isolatie",
        "paragraphs": [
          "Wat uitstel betekent voor comfort en energiegebruik — kruipruimte isolatie: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij wat uitstel betekent voor comfort en energiegebruik — kruipruimte isolatie tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van isolatiewerk rond kruipruimte isolatie concreet maken.",
          "Voor wat uitstel betekent voor comfort en energiegebruik — kruipruimte isolatie beoordeelt een isolatiespecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op warmteverlies en condensproblemen toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "hoogte en bereikbaarheid",
      "materiaal",
      "vochtmaatregelen",
      "oppervlakte"
    ],
    "processSteps": [
      "Beschrijf je vraag rond kruipruimte isolatie en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende isolatie-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/isolatie",
        "title": "Isolatie",
        "description": "Bekijk ook isolatie voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/isolatie/vloerisolatie",
        "title": "Vloerisolatie",
        "description": "Bekijk ook vloerisolatie voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/verbouwing/woning-renoveren",
        "title": "Woning renoveren",
        "description": "Bekijk ook woning renoveren voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Is elke kruipruimte geschikt?",
        "answer": "Niet altijd, toegankelijkheid en vochttoestand zijn bepalend."
      },
      {
        "question": "Helpt dit tegen tocht?",
        "answer": "Vaak wel, mits de juiste methode wordt toegepast."
      },
      {
        "question": "Wanneer combineer ik met vloerisolatie?",
        "answer": "Bij bredere comfortaanpak op begane grond is die combinatie logisch."
      },
      {
        "question": "Voert VakConnect dit zelf uit?",
        "answer": "Nee, je wordt gekoppeld aan een passende specialist."
      }
    ],
    "cta": {
      "title": "Beschrijf je kruipruimte isolatie-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over kruipruimte isolatie, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Vraag kruipruimte-isolatie aan",
      "secondaryLabel": "Terug naar isolatie",
      "secondaryHref": "/isolatie"
    }
  },
  "verbouwing/aanbouw": {
    "path": "/verbouwing/aanbouw",
    "title": "Aanbouw via VakConnect",
    "description": "Aanbouw plannen? Lees welke keuzes en voorbereidingen bepalend zijn voor een haalbaar project.",
    "keywords": [
      "verbouwing",
      "aanbouw",
      "vakman",
      "VakConnect"
    ],
    "h1": "Aanbouw: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij aanbouw? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Verbouwing",
        "href": "/verbouwing"
      },
      {
        "label": "Aanbouw"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer aanbouw in beeld komt",
        "paragraphs": [
          "Wanneer aanbouw in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer aanbouw in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van verbouwwerk rond aanbouw concreet maken.",
          "Voor wanneer aanbouw in beeld komt beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wanneer een verbouwing meestal in beeld komt — aanbouw",
        "paragraphs": [
          "Wanneer een verbouwing meestal in beeld komt — aanbouw: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij wanneer een verbouwing meestal in beeld komt — aanbouw tellen factoren zoals structureel ruimtegebrek, wens voor grotere leefruimte en functionele uitbreiding mee, omdat ze de omvang en aanpak van verbouwwerk rond aanbouw concreet maken.",
          "Voor wanneer een verbouwing meestal in beeld komt — aanbouw beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "structureel ruimtegebrek",
          "wens voor grotere leefruimte",
          "functionele uitbreiding"
        ]
      },
      {
        "heading": "Oorzaken van knelpunten in ruimte of woninggebruik — aanbouw",
        "paragraphs": [
          "Oorzaken van knelpunten in ruimte of woninggebruik — aanbouw: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij oorzaken van knelpunten in ruimte of woninggebruik — aanbouw tellen factoren zoals veranderde gezinssituatie, onvoldoende huidige indeling en toekomstige woonwensen mee, omdat ze de omvang en aanpak van verbouwwerk rond aanbouw concreet maken.",
          "Voor oorzaken van knelpunten in ruimte of woninggebruik — aanbouw beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "veranderde gezinssituatie",
          "onvoldoende huidige indeling",
          "toekomstige woonwensen"
        ]
      },
      {
        "heading": "Eerste beoordeling door een verbouwspecialist (aanbouw) — aanbouw",
        "paragraphs": [
          "Eerste beoordeling door een verbouwspecialist (aanbouw) — aanbouw: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij eerste beoordeling door een verbouwspecialist (aanbouw) — aanbouw tellen factoren zoals scope en haalbaarheid bepalen, bouwkundige voorbereiding en uitvoering en aansluiting op bestaande woning mee, omdat ze de omvang en aanpak van verbouwwerk rond aanbouw concreet maken.",
          "Voor eerste beoordeling door een verbouwspecialist (aanbouw) — aanbouw beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "scope en haalbaarheid bepalen",
          "bouwkundige voorbereiding",
          "uitvoering en aansluiting op bestaande woning"
        ]
      },
      {
        "heading": "Keuzes in fasering, scope en combinatieklussen — aanbouw",
        "paragraphs": [
          "Keuzes in fasering, scope en combinatieklussen — aanbouw: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in fasering, scope en combinatieklussen — aanbouw tellen factoren zoals compacte of ruime aanbouw, fasering van project en combinatie met installatiewerk mee, omdat ze de omvang en aanpak van verbouwwerk rond aanbouw concreet maken.",
          "Voor keuzes in fasering, scope en combinatieklussen — aanbouw beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "compacte of ruime aanbouw",
          "fasering van project",
          "combinatie met installatiewerk"
        ]
      },
      {
        "heading": "Welke projectinformatie je aanvraag sterker maakt — aanbouw",
        "paragraphs": [
          "Welke projectinformatie je aanvraag sterker maakt — aanbouw: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke projectinformatie je aanvraag sterker maakt — aanbouw tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van verbouwwerk rond aanbouw concreet maken.",
          "Voor welke projectinformatie je aanvraag sterker maakt — aanbouw beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Risico’s van uitstel of onduidelijke scope — aanbouw",
        "paragraphs": [
          "Risico’s van uitstel of onduidelijke scope — aanbouw: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij risico’s van uitstel of onduidelijke scope — aanbouw tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van verbouwwerk rond aanbouw concreet maken.",
          "Voor risico’s van uitstel of onduidelijke scope — aanbouw beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "afmeting en constructie",
      "afwerkingsniveau",
      "installatieaanpassingen",
      "bereikbaarheid bouwplaats"
    ],
    "processSteps": [
      "Beschrijf je vraag rond aanbouw en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende verbouwing-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/verbouwing",
        "title": "Verbouwing",
        "description": "Bekijk ook verbouwing voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/verbouwing/uitbouw",
        "title": "Uitbouw",
        "description": "Bekijk ook uitbouw voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/elektricien/krachtstroom",
        "title": "Krachtstroom",
        "description": "Bekijk ook krachtstroom voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Is vergunning altijd nodig?",
        "answer": "Dat hangt af van type, afmeting en lokale regels."
      },
      {
        "question": "Kan ik tijdens het project blijven wonen?",
        "answer": "Dat verschilt per fase en impact."
      },
      {
        "question": "Welke info helpt in de aanvraag?",
        "answer": "Gewenste afmeting, functie en foto’s van de bestaande situatie."
      },
      {
        "question": "Voert VakConnect de bouw uit?",
        "answer": "Nee, VakConnect koppelt je aan een passende specialist."
      }
    ],
    "cta": {
      "title": "Beschrijf je aanbouw-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over aanbouw, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Start je aanvraag voor aanbouw",
      "secondaryLabel": "Terug naar verbouwing",
      "secondaryHref": "/verbouwing"
    }
  },
  "verbouwing/uitbouw": {
    "path": "/verbouwing/uitbouw",
    "title": "Uitbouw via VakConnect",
    "description": "Uitbouw realiseren voor meer leefruimte: ontdek de belangrijkste technische en praktische aandachtspunten.",
    "keywords": [
      "verbouwing",
      "uitbouw",
      "vakman",
      "VakConnect"
    ],
    "h1": "Uitbouw: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij uitbouw? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Verbouwing",
        "href": "/verbouwing"
      },
      {
        "label": "Uitbouw"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer uitbouw in beeld komt",
        "paragraphs": [
          "Wanneer uitbouw in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer uitbouw in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van verbouwwerk rond uitbouw concreet maken.",
          "Voor wanneer uitbouw in beeld komt beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wanneer een verbouwing meestal in beeld komt — uitbouw",
        "paragraphs": [
          "Wanneer een verbouwing meestal in beeld komt — uitbouw: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij wanneer een verbouwing meestal in beeld komt — uitbouw tellen factoren zoals te beperkte woonkeuken, krappe woonkamer en wens voor open plattegrond mee, omdat ze de omvang en aanpak van verbouwwerk rond uitbouw concreet maken.",
          "Voor wanneer een verbouwing meestal in beeld komt — uitbouw beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "te beperkte woonkeuken",
          "krappe woonkamer",
          "wens voor open plattegrond"
        ]
      },
      {
        "heading": "Oorzaken van knelpunten in ruimte of woninggebruik — uitbouw",
        "paragraphs": [
          "Oorzaken van knelpunten in ruimte of woninggebruik — uitbouw: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij oorzaken van knelpunten in ruimte of woninggebruik — uitbouw tellen factoren zoals huidige woningindeling en nieuwe gebruiksbehoeften mee, omdat ze de omvang en aanpak van verbouwwerk rond uitbouw concreet maken.",
          "Voor oorzaken van knelpunten in ruimte of woninggebruik — uitbouw beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "huidige woningindeling",
          "nieuwe gebruiksbehoeften"
        ]
      },
      {
        "heading": "Eerste beoordeling door een verbouwspecialist (uitbouw) — uitbouw",
        "paragraphs": [
          "Eerste beoordeling door een verbouwspecialist (uitbouw) — uitbouw: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij eerste beoordeling door een verbouwspecialist (uitbouw) — uitbouw tellen factoren zoals mogelijkheden verkennen, constructie en afwerking plannen en uitvoering met installatiewerk afstemmen mee, omdat ze de omvang en aanpak van verbouwwerk rond uitbouw concreet maken.",
          "Voor eerste beoordeling door een verbouwspecialist (uitbouw) — uitbouw beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "mogelijkheden verkennen",
          "constructie en afwerking plannen",
          "uitvoering met installatiewerk afstemmen"
        ]
      },
      {
        "heading": "Keuzes in fasering, scope en combinatieklussen — uitbouw",
        "paragraphs": [
          "Keuzes in fasering, scope en combinatieklussen — uitbouw: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in fasering, scope en combinatieklussen — uitbouw tellen factoren zoals kleine of grote uitbreiding, combinatie met keukenverbouwing en gefaseerde aanpak mee, omdat ze de omvang en aanpak van verbouwwerk rond uitbouw concreet maken.",
          "Voor keuzes in fasering, scope en combinatieklussen — uitbouw beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "kleine of grote uitbreiding",
          "combinatie met keukenverbouwing",
          "gefaseerde aanpak"
        ]
      },
      {
        "heading": "Welke projectinformatie je aanvraag sterker maakt — uitbouw",
        "paragraphs": [
          "Welke projectinformatie je aanvraag sterker maakt — uitbouw: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke projectinformatie je aanvraag sterker maakt — uitbouw tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van verbouwwerk rond uitbouw concreet maken.",
          "Voor welke projectinformatie je aanvraag sterker maakt — uitbouw beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Risico’s van uitstel of onduidelijke scope — uitbouw",
        "paragraphs": [
          "Risico’s van uitstel of onduidelijke scope — uitbouw: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij risico’s van uitstel of onduidelijke scope — uitbouw tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van verbouwwerk rond uitbouw concreet maken.",
          "Voor risico’s van uitstel of onduidelijke scope — uitbouw beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "omvang uitbouw",
      "constructiemateriaal",
      "dak- en gevelaansluiting",
      "installatieverlegging"
    ],
    "processSteps": [
      "Beschrijf je vraag rond uitbouw en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende verbouwing-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/verbouwing",
        "title": "Verbouwing",
        "description": "Bekijk ook verbouwing voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/verbouwing/aanbouw",
        "title": "Aanbouw",
        "description": "Bekijk ook aanbouw voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/verbouwing/keuken-verbouwen",
        "title": "Keuken verbouwen",
        "description": "Bekijk ook keuken verbouwen voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Wat is het verschil tussen aanbouw en uitbouw?",
        "answer": "In praktijk overlappen de termen vaak; de projectinvulling is bepalend."
      },
      {
        "question": "Moet ik al een uitgewerkt plan hebben?",
        "answer": "Nee, een heldere wensomschrijving volstaat om te starten."
      },
      {
        "question": "Kan uitbouw met andere renovaties samen?",
        "answer": "Ja, dat is vaak efficiënt."
      },
      {
        "question": "Voert VakConnect dit uit?",
        "answer": "Nee, VakConnect koppelt je aan een passende professional."
      }
    ],
    "cta": {
      "title": "Beschrijf je uitbouw-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over uitbouw, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Vraag een specialist voor uitbouw",
      "secondaryLabel": "Terug naar verbouwing",
      "secondaryHref": "/verbouwing"
    }
  },
  "verbouwing/zolder-verbouwen": {
    "path": "/verbouwing/zolder-verbouwen",
    "title": "Zolder verbouwen via VakConnect",
    "description": "Van opslag naar leefruimte: lees hoe je een zolderverbouwing slim voorbereidt.",
    "keywords": [
      "verbouwing",
      "zolder-verbouwen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Zolder verbouwen: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij zolder verbouwen? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Verbouwing",
        "href": "/verbouwing"
      },
      {
        "label": "Zolder verbouwen"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer zolder verbouwen in beeld komt",
        "paragraphs": [
          "Wanneer zolder verbouwen in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer zolder verbouwen in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van verbouwwerk rond zolder verbouwen concreet maken.",
          "Voor wanneer zolder verbouwen in beeld komt beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wanneer een verbouwing meestal in beeld komt — zolder verbouwen",
        "paragraphs": [
          "Wanneer een verbouwing meestal in beeld komt — zolder verbouwen: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij wanneer een verbouwing meestal in beeld komt — zolder verbouwen tellen factoren zoals onbenutte ruimte, tekort aan kamers en comfortproblemen op zolder mee, omdat ze de omvang en aanpak van verbouwwerk rond zolder verbouwen concreet maken.",
          "Voor wanneer een verbouwing meestal in beeld komt — zolder verbouwen beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "onbenutte ruimte",
          "tekort aan kamers",
          "comfortproblemen op zolder"
        ]
      },
      {
        "heading": "Oorzaken van knelpunten in ruimte of woninggebruik — zolder verbouwen",
        "paragraphs": [
          "Oorzaken van knelpunten in ruimte of woninggebruik — zolder verbouwen: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij oorzaken van knelpunten in ruimte of woninggebruik — zolder verbouwen tellen factoren zoals gebrek aan isolatie, onpraktische indeling en onvoldoende licht of elektra mee, omdat ze de omvang en aanpak van verbouwwerk rond zolder verbouwen concreet maken.",
          "Voor oorzaken van knelpunten in ruimte of woninggebruik — zolder verbouwen beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "gebrek aan isolatie",
          "onpraktische indeling",
          "onvoldoende licht of elektra"
        ]
      },
      {
        "heading": "Eerste beoordeling door een verbouwspecialist (zolder verbouwen) — zolder verbouwen",
        "paragraphs": [
          "Eerste beoordeling door een verbouwspecialist (zolder verbouwen) — zolder verbouwen: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij eerste beoordeling door een verbouwspecialist (zolder verbouwen) — zolder verbouwen tellen factoren zoals functiedoel bepalen, isolatie en installaties afstemmen en afbouw voor dagelijks gebruik mee, omdat ze de omvang en aanpak van verbouwwerk rond zolder verbouwen concreet maken.",
          "Voor eerste beoordeling door een verbouwspecialist (zolder verbouwen) — zolder verbouwen beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "functiedoel bepalen",
          "isolatie en installaties afstemmen",
          "afbouw voor dagelijks gebruik"
        ]
      },
      {
        "heading": "Keuzes in fasering, scope en combinatieklussen — zolder verbouwen",
        "paragraphs": [
          "Keuzes in fasering, scope en combinatieklussen — zolder verbouwen: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in fasering, scope en combinatieklussen — zolder verbouwen tellen factoren zoals slaapkamer, werkplek of multifunctioneel en combinatie met dakisolatie mee, omdat ze de omvang en aanpak van verbouwwerk rond zolder verbouwen concreet maken.",
          "Voor keuzes in fasering, scope en combinatieklussen — zolder verbouwen beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "slaapkamer, werkplek of multifunctioneel",
          "combinatie met dakisolatie"
        ]
      },
      {
        "heading": "Welke projectinformatie je aanvraag sterker maakt — zolder verbouwen",
        "paragraphs": [
          "Welke projectinformatie je aanvraag sterker maakt — zolder verbouwen: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke projectinformatie je aanvraag sterker maakt — zolder verbouwen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van verbouwwerk rond zolder verbouwen concreet maken.",
          "Voor welke projectinformatie je aanvraag sterker maakt — zolder verbouwen beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Risico’s van uitstel of onduidelijke scope — zolder verbouwen",
        "paragraphs": [
          "Risico’s van uitstel of onduidelijke scope — zolder verbouwen: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij risico’s van uitstel of onduidelijke scope — zolder verbouwen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van verbouwwerk rond zolder verbouwen concreet maken.",
          "Voor risico’s van uitstel of onduidelijke scope — zolder verbouwen beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "isolatie en afwerking",
      "elektra-uitbreiding",
      "maatwerkoplossingen",
      "bereikbaarheid"
    ],
    "processSteps": [
      "Beschrijf je vraag rond zolder verbouwen en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende verbouwing-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/verbouwing",
        "title": "Verbouwing",
        "description": "Bekijk ook verbouwing voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/isolatie/dakisolatie",
        "title": "Dakisolatie",
        "description": "Bekijk ook dakisolatie voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/elektricien/verlichting",
        "title": "Verlichting",
        "description": "Bekijk ook verlichting voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Is elke zolder geschikt als leefruimte?",
        "answer": "Dat hangt af van hoogte, indeling en technische randvoorwaarden."
      },
      {
        "question": "Wanneer neem ik isolatie mee?",
        "answer": "Bijna altijd, voor comfort en bruikbaarheid."
      },
      {
        "question": "Kan ik gefaseerd afwerken?",
        "answer": "Ja, afhankelijk van prioriteiten."
      },
      {
        "question": "Doet VakConnect dit zelf?",
        "answer": "Nee, VakConnect koppelt je aan een passende specialist."
      }
    ],
    "cta": {
      "title": "Beschrijf je zolder verbouwen-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over zolder verbouwen, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Plaats je zolderverbouwing-aanvraag",
      "secondaryLabel": "Terug naar verbouwing",
      "secondaryHref": "/verbouwing"
    }
  },
  "verbouwing/woning-renoveren": {
    "path": "/verbouwing/woning-renoveren",
    "title": "Woning renoveren via VakConnect",
    "description": "Woningrenovatie in fases of totaal: krijg grip op prioriteiten, volgorde en uitvoering.",
    "keywords": [
      "verbouwing",
      "woning-renoveren",
      "vakman",
      "VakConnect"
    ],
    "h1": "Woning renoveren: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij woning renoveren? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Verbouwing",
        "href": "/verbouwing"
      },
      {
        "label": "Woning renoveren"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer woning renoveren in beeld komt",
        "paragraphs": [
          "Wanneer woning renoveren in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer woning renoveren in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van verbouwwerk rond woning renoveren concreet maken.",
          "Voor wanneer woning renoveren in beeld komt beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wanneer een verbouwing meestal in beeld komt — woning renoveren",
        "paragraphs": [
          "Wanneer een verbouwing meestal in beeld komt — woning renoveren: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij wanneer een verbouwing meestal in beeld komt — woning renoveren tellen factoren zoals meerdere verouderde onderdelen, comfort- en onderhoudsproblemen en installaties voldoen niet meer mee, omdat ze de omvang en aanpak van verbouwwerk rond woning renoveren concreet maken.",
          "Voor wanneer een verbouwing meestal in beeld komt — woning renoveren beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "meerdere verouderde onderdelen",
          "comfort- en onderhoudsproblemen",
          "installaties voldoen niet meer"
        ]
      },
      {
        "heading": "Oorzaken van knelpunten in ruimte of woninggebruik — woning renoveren",
        "paragraphs": [
          "Oorzaken van knelpunten in ruimte of woninggebruik — woning renoveren: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij oorzaken van knelpunten in ruimte of woninggebruik — woning renoveren tellen factoren zoals achterstallig onderhoud, technische veroudering en gewijzigde woonwensen mee, omdat ze de omvang en aanpak van verbouwwerk rond woning renoveren concreet maken.",
          "Voor oorzaken van knelpunten in ruimte of woninggebruik — woning renoveren beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "achterstallig onderhoud",
          "technische veroudering",
          "gewijzigde woonwensen"
        ]
      },
      {
        "heading": "Eerste beoordeling door een verbouwspecialist (woning renoveren) — woning renoveren",
        "paragraphs": [
          "Eerste beoordeling door een verbouwspecialist (woning renoveren) — woning renoveren: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij eerste beoordeling door een verbouwspecialist (woning renoveren) — woning renoveren tellen factoren zoals prioriteiten stellen, fasering bepalen en uitvoering en controle per fase mee, omdat ze de omvang en aanpak van verbouwwerk rond woning renoveren concreet maken.",
          "Voor eerste beoordeling door een verbouwspecialist (woning renoveren) — woning renoveren beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "prioriteiten stellen",
          "fasering bepalen",
          "uitvoering en controle per fase"
        ]
      },
      {
        "heading": "Keuzes in fasering, scope en combinatieklussen — woning renoveren",
        "paragraphs": [
          "Keuzes in fasering, scope en combinatieklussen — woning renoveren: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in fasering, scope en combinatieklussen — woning renoveren tellen factoren zoals ruimtegerichte planning, combineren met isolatie en kozijnen en deelrenovatie versus totaalproject mee, omdat ze de omvang en aanpak van verbouwwerk rond woning renoveren concreet maken.",
          "Voor keuzes in fasering, scope en combinatieklussen — woning renoveren beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "ruimtegerichte planning",
          "combineren met isolatie en kozijnen",
          "deelrenovatie versus totaalproject"
        ]
      },
      {
        "heading": "Welke projectinformatie je aanvraag sterker maakt — woning renoveren",
        "paragraphs": [
          "Welke projectinformatie je aanvraag sterker maakt — woning renoveren: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke projectinformatie je aanvraag sterker maakt — woning renoveren tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van verbouwwerk rond woning renoveren concreet maken.",
          "Voor welke projectinformatie je aanvraag sterker maakt — woning renoveren beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Risico’s van uitstel of onduidelijke scope — woning renoveren",
        "paragraphs": [
          "Risico’s van uitstel of onduidelijke scope — woning renoveren: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij risico’s van uitstel of onduidelijke scope — woning renoveren tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van verbouwwerk rond woning renoveren concreet maken.",
          "Voor risico’s van uitstel of onduidelijke scope — woning renoveren beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "omvang project",
      "materiaal- en afwerkingskeuzes",
      "coördinatie van disciplines",
      "onvoorziene herstelpunten"
    ],
    "processSteps": [
      "Beschrijf je vraag rond woning renoveren en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende verbouwing-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/verbouwing",
        "title": "Verbouwing",
        "description": "Bekijk ook verbouwing voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/isolatie",
        "title": "Isolatie",
        "description": "Bekijk ook isolatie voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/kozijnen",
        "title": "Kozijnen",
        "description": "Bekijk ook kozijnen voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Waarom eerst prioriteiten stellen?",
        "answer": "Omdat niet alles tegelijk hoeft en volgorde veel invloed heeft op kosten en doorlooptijd."
      },
      {
        "question": "Wanneer is gefaseerde renovatie verstandig?",
        "answer": "Bij bewoonde situaties of wanneer budget en planning stap voor stap worden opgebouwd."
      },
      {
        "question": "Kan ik verduurzaming direct meenemen?",
        "answer": "Ja, dat is vaak praktisch tijdens renovatiefases."
      },
      {
        "question": "Voert VakConnect renovatiewerk uit?",
        "answer": "Nee, VakConnect koppelt je aan passende vakmensen."
      }
    ],
    "cta": {
      "title": "Beschrijf je woning renoveren-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over woning renoveren, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Start je woningrenovatie-aanvraag",
      "secondaryLabel": "Terug naar verbouwing",
      "secondaryHref": "/verbouwing"
    }
  },
  "verbouwing/keuken-verbouwen": {
    "path": "/verbouwing/keuken-verbouwen",
    "title": "Keuken verbouwen via VakConnect",
    "description": "Keuken verbouwen met aandacht voor indeling, aansluitingen en praktische planning.",
    "keywords": [
      "verbouwing",
      "keuken-verbouwen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Keuken verbouwen: vind een passende specialist via VakConnect",
    "intro": [
      "Zoek je hulp bij keuken verbouwen? Via VakConnect kun je je situatie helder omschrijven en een passende specialist vinden.",
      "Op deze pagina krijg je praktische verdieping over diagnose, keuzes, voorbereiding en wat de omvang van de klus beïnvloedt.",
      "Zo voorkom je een oppervlakkige aanvraag en vergroot je de kans op een passende opvolging."
    ],
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Diensten",
        "href": "/diensten"
      },
      {
        "label": "Verbouwing",
        "href": "/verbouwing"
      },
      {
        "label": "Keuken verbouwen"
      }
    ],
    "sections": [
      {
        "heading": "Wanneer keuken verbouwen in beeld komt",
        "paragraphs": [
          "Wanneer keuken verbouwen in beeld komt: In dit onderdeel wordt meestal eerst geïnventariseerd wat direct aandacht vraagt en wat gepland kan worden.",
          "Bij wanneer keuken verbouwen in beeld komt tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van verbouwwerk rond keuken verbouwen concreet maken.",
          "Voor wanneer keuken verbouwen in beeld komt beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Wanneer een verbouwing meestal in beeld komt — keuken verbouwen",
        "paragraphs": [
          "Wanneer een verbouwing meestal in beeld komt — keuken verbouwen: Dit onderwerp bepaalt vaak of een korte ingreep volstaat of dat een bredere aanpak verstandiger is.",
          "Bij wanneer een verbouwing meestal in beeld komt — keuken verbouwen tellen factoren zoals onpraktische opstelling, verouderde apparatuur en te weinig werkruimte mee, omdat ze de omvang en aanpak van verbouwwerk rond keuken verbouwen concreet maken.",
          "Voor wanneer een verbouwing meestal in beeld komt — keuken verbouwen beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "onpraktische opstelling",
          "verouderde apparatuur",
          "te weinig werkruimte"
        ]
      },
      {
        "heading": "Oorzaken van knelpunten in ruimte of woninggebruik — keuken verbouwen",
        "paragraphs": [
          "Oorzaken van knelpunten in ruimte of woninggebruik — keuken verbouwen: Juist hier wordt duidelijk welke voorbereiding nodig is voordat uitvoering efficiënt kan starten.",
          "Bij oorzaken van knelpunten in ruimte of woninggebruik — keuken verbouwen tellen factoren zoals gewijzigde gebruikswensen, technische beperkingen oude keuken en slijtage mee, omdat ze de omvang en aanpak van verbouwwerk rond keuken verbouwen concreet maken.",
          "Voor oorzaken van knelpunten in ruimte of woninggebruik — keuken verbouwen beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "gewijzigde gebruikswensen",
          "technische beperkingen oude keuken",
          "slijtage"
        ]
      },
      {
        "heading": "Eerste beoordeling door een verbouwspecialist (keuken verbouwen) — keuken verbouwen",
        "paragraphs": [
          "Eerste beoordeling door een verbouwspecialist (keuken verbouwen) — keuken verbouwen: Dit deel van de klus heeft vaak invloed op keuzes in materiaal, planning en bereikbaarheid.",
          "Bij eerste beoordeling door een verbouwspecialist (keuken verbouwen) — keuken verbouwen tellen factoren zoals huidige situatie opnemen, leiding- en elektra-aanpassingen plannen en plaatsing en afwerking mee, omdat ze de omvang en aanpak van verbouwwerk rond keuken verbouwen concreet maken.",
          "Voor eerste beoordeling door een verbouwspecialist (keuken verbouwen) — keuken verbouwen beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "huidige situatie opnemen",
          "leiding- en elektra-aanpassingen plannen",
          "plaatsing en afwerking"
        ]
      },
      {
        "heading": "Keuzes in fasering, scope en combinatieklussen — keuken verbouwen",
        "paragraphs": [
          "Keuzes in fasering, scope en combinatieklussen — keuken verbouwen: Wanneer dit onderdeel te laat wordt beoordeeld, loopt de kans op vervolgschade sneller op.",
          "Bij keuzes in fasering, scope en combinatieklussen — keuken verbouwen tellen factoren zoals gedeeltelijke update of complete verbouwing, hergebruik van onderdelen of volledig nieuw en combinatie met uitbouw mee, omdat ze de omvang en aanpak van verbouwwerk rond keuken verbouwen concreet maken.",
          "Voor keuzes in fasering, scope en combinatieklussen — keuken verbouwen beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ],
        "bullets": [
          "gedeeltelijke update of complete verbouwing",
          "hergebruik van onderdelen of volledig nieuw",
          "combinatie met uitbouw"
        ]
      },
      {
        "heading": "Welke projectinformatie je aanvraag sterker maakt — keuken verbouwen",
        "paragraphs": [
          "Welke projectinformatie je aanvraag sterker maakt — keuken verbouwen: Goede afstemming op dit punt voorkomt misverstanden over scope, timing en verwachte resultaten.",
          "Bij welke projectinformatie je aanvraag sterker maakt — keuken verbouwen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van verbouwwerk rond keuken verbouwen concreet maken.",
          "Voor welke projectinformatie je aanvraag sterker maakt — keuken verbouwen beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ]
      },
      {
        "heading": "Risico’s van uitstel of onduidelijke scope — keuken verbouwen",
        "paragraphs": [
          "Risico’s van uitstel of onduidelijke scope — keuken verbouwen: Dit is vaak het punt waarop verschillen tussen woningen en installaties het meest zichtbaar worden.",
          "Bij risico’s van uitstel of onduidelijke scope — keuken verbouwen tellen factoren zoals bereikbaarheid, huidige staat en volgorde van uitvoering mee, omdat ze de omvang en aanpak van verbouwwerk rond keuken verbouwen concreet maken.",
          "Voor risico’s van uitstel of onduidelijke scope — keuken verbouwen beoordeelt een verbouwspecialist meestal welke stap logisch volgt; zonder die afweging neemt de kans op uitloop en extra herstelwerk toe of wordt planning onnodig onrustig."
        ]
      }
    ],
    "costFactors": [
      "indelingswijziging",
      "apparatuurvereisten",
      "leidingwerk en elektra",
      "afwerking en montage"
    ],
    "processSteps": [
      "Beschrijf je vraag rond keuken verbouwen en noem de exacte situatie.",
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in je aanvraag.",
      "VakConnect koppelt de aanvraag aan een passende verbouwing-specialist.",
      "Na beoordeling stemmen jullie vervolgstappen en uitvoering af."
    ],
    "relatedLinks": [
      {
        "href": "/verbouwing",
        "title": "Verbouwing",
        "description": "Bekijk ook verbouwing voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/loodgieter/leidingwerk",
        "title": "Leidingwerk",
        "description": "Bekijk ook leidingwerk voor context, combinatieklussen en vervolgstappen."
      },
      {
        "href": "/elektricien/stopcontacten",
        "title": "Stopcontacten",
        "description": "Bekijk ook stopcontacten voor context, combinatieklussen en vervolgstappen."
      }
    ],
    "faqs": [
      {
        "question": "Moet ik alles vervangen bij een keukenverbouwing?",
        "answer": "Nee, dat hangt af van je doelen en de staat van bestaande onderdelen."
      },
      {
        "question": "Waarom techniek eerst plannen?",
        "answer": "Omdat aansluitpunten de indeling en apparatuurkeuze sturen."
      },
      {
        "question": "Kan ik gefaseerd werken?",
        "answer": "Ja, mits de volgorde goed is afgestemd."
      },
      {
        "question": "Doet VakConnect dit zelf?",
        "answer": "Nee, je wordt gekoppeld aan een passende specialist."
      }
    ],
    "cta": {
      "title": "Beschrijf je keuken verbouwen-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met details over keuken verbouwen, locatie en timing zodat de eerste beoordeling direct concreet is.",
      "label": "Vraag een specialist voor keukenverbouwing",
      "secondaryLabel": "Terug naar verbouwing",
      "secondaryHref": "/verbouwing"
    }
  }
} satisfies Record<string, ServiceContentPageData>;

export const serviceMainPages: Record<string, ServiceContentPageData> = Object.fromEntries(
  Object.entries(rawServiceMainPages).map(([slug, page]) => [slug, { ...page, costFactors: withFallbackCosts(page.costFactors) }]),
);

export const serviceSubPages: Record<string, ServiceContentPageData> = Object.fromEntries(
  Object.entries(rawServiceSubPages).map(([slug, page]) => [slug, { ...page, costFactors: withFallbackCosts(page.costFactors) }]),
);

export const serviceMainSlugs = Object.keys(rawServiceMainPages);
export const serviceSubSlugs = Object.keys(rawServiceSubPages).map((slug) => {
  const [vakgebied, subdienst] = slug.split("/");
  return { vakgebied, subdienst };
});

export function getServiceMainPage(slug: string) {
  return serviceMainPages[slug];
}

export function getServiceSubPage(vakgebied: string, subdienst: string) {
  return serviceSubPages[vakgebied + "/" + subdienst];
}

export function getAllServicePages() {
  return [...Object.values(serviceMainPages), ...Object.values(serviceSubPages)];
}

export function getAllServiceRoutes() {
  return [
    ...serviceMainSlugs.map((slug) => "/" + slug),
    ...Object.keys(rawServiceSubPages).map((slug) => "/" + slug),
  ];
}

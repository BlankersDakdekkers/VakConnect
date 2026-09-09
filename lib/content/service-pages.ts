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
    "title": "Dakdekker nodig? Vind een passende vakman op VakConnect",
    "description": "Lees wanneer een dakdekker nodig is, welke aanpak past bij jouw dak en hoe je met VakConnect een inhoudelijk sterke aanvraag doet.",
    "keywords": [
      "dakdekker",
      "dakdekker",
      "vakman",
      "VakConnect"
    ],
    "h1": "Dakdekker nodig? Vind een passende vakman via het platform",
    "intro": [
      "Op VakConnect kun je dakproblemen of gepland dakonderhoud gericht uitzetten bij een passende vakman in jouw regio.",
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
          "Een dakdekker is meestal nodig zodra water buiten de dakconstructie niet meer betrouwbaar wordt afgevoerd.",
          "Dat zie je niet alleen bij zichtbare lekkage, maar ook bij terugkerende vochtplekken, losliggende randen of verouderde details rond aansluitingen.",
          "Vroeg beoordelen voorkomt dat een relatief kleine ingreep later uitgroeit tot herstel van isolatie, hout of binnenafwerking."
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
          "Een goede dakbeoordeling begint buiten: dakvlak, nok, randen, goten en doorvoeren worden in samenhang bekeken.",
          "Pas daarna volgt de koppeling met signalen binnen, zoals plekken op plafond of muur die kunnen wijzen op verplaatsing van vocht.",
          "Door die volgorde wordt duidelijk of het om een lokaal defect gaat of om bredere slijtage van het systeem."
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
          "Reparatie is logisch wanneer de rest van het dak technisch nog in goede staat is en de oorzaak scherp af te bakenen valt.",
          "Bij verspreide slijtage of meerdere zwakke details is deelrenovatie of volledige vernieuwing vaak stabieler op de middellange termijn.",
          "De keuze hangt vooral af van resterende levensduur, bereikbaarheid en de vraag of je andere werkzaamheden wilt combineren."
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
          "Voorbereiding van je aanvraag maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Voorbereiding van je aanvraag wordt betrouwbaarder beoordeeld wanneer toegang, huidige staat en technische randvoorwaarden expliciet worden meegenomen in het beeld van dakwerk.",
          "In de praktijk bepaalt voorbereiding van je aanvraag vaak of een dakdekker met beperkt herstel uitkomt of een bredere oplossing adviseert om blijvende vochtschade te vermijden."
        ]
      },
      {
        "heading": "Uitvoering op hoogte en bereikbaarheid",
        "paragraphs": [
          "Uitvoering op hoogte en bereikbaarheid maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Wie uitvoering op hoogte en bereikbaarheid goed wil laten inschatten, doet er verstandig aan factoren zoals toegang, huidige staat en technische randvoorwaarden direct te benoemen.",
          "Bij uitvoering op hoogte en bereikbaarheid is het voordeel van een dakdekker vooral dat keuzes in uitvoering en timing meteen op blijvende vochtschade worden getoetst."
        ]
      },
      {
        "heading": "Combinaties met isolatie en afwatering",
        "paragraphs": [
          "Rond combinaties met isolatie en afwatering ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Combinaties met isolatie en afwatering wordt inhoudelijk sterker zodra toegang, huidige staat en technische randvoorwaarden niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Een realistische keuze rond combinaties met isolatie en afwatering ontstaat meestal pas nadat een dakdekker de samenhang heeft beoordeeld; dat voorkomt later blijvende vochtschade."
        ]
      },
      {
        "heading": "Wanneer uitstel extra risico geeft",
        "paragraphs": [
          "Wanneer uitstel extra risico geeft maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Wie wanneer uitstel extra risico geeft goed wil laten inschatten, doet er verstandig aan factoren zoals toegang, huidige staat en technische randvoorwaarden direct te benoemen.",
          "Door wanneer uitstel extra risico geeft vroeg te laten toetsen door een dakdekker worden vervolgstappen consistenter en blijft blijvende vochtschade beter beheersbaar."
        ],
        "type": "warning"
      },
      {
        "heading": "Informatie die jouw aanvraag sterker maakt",
        "paragraphs": [
          "Informatie die jouw aanvraag sterker maakt voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Informatie over toegang, huidige staat en technische randvoorwaarden voorkomt ruis bij informatie die jouw aanvraag sterker maakt en maakt de aanpak binnen dakwerk beter vergelijkbaar.",
          "In de praktijk bepaalt informatie die jouw aanvraag sterker maakt vaak of een dakdekker met beperkt herstel uitkomt of een bredere oplossing adviseert om blijvende vochtschade te vermijden."
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
        "answer": "Spoed is vooral aan de orde bij actieve lekkage, snelle toename van waterschade of losliggende delen die onveilig kunnen worden. Benoem de ernst bij je aanvraag zodat de juiste prioriteit kan worden ingeschat."
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
        "answer": "Ja, vooral bij renovatie kan dat efficiënt zijn omdat delen van de opbouw al toegankelijk zijn. Vermeld in de intake dat je die combinatie wilt onderzoeken."
      },
      {
        "question": "Voert VakConnect zelf dakwerk uit?",
        "answer": "Nee. VakConnect is het platform dat consumenten koppelt aan een passende aangesloten vakman."
      }
    ],
    "cta": {
      "title": "Vind een passende dakdekker voor jouw klus",
      "description": "Beschrijf je dakdekker-klus op /aanvraag met foto’s, bereikbaarheid en planning voor een gerichte eerste beoordeling.",
      "label": "Vraag een passende dakdekker aan",
      "secondaryLabel": "Bekijk hoe VakConnect werkt",
      "secondaryHref": "/hoe-werkt-het"
    }
  },
  "schilder": {
    "path": "/schilder",
    "title": "Schilder zoeken voor binnen- en buitenwerk op het platform",
    "description": "Ontdek wanneer schilderwerk onderhoud vraagt, welke keuzes echt verschil maken en hoe je op VakConnect een passende schilder vindt.",
    "keywords": [
      "schilder",
      "schilder",
      "vakman",
      "VakConnect"
    ],
    "h1": "Schilder zoeken voor binnen- en buitenwerk met VakConnect",
    "intro": [
      "Schilderwerk bepaalt niet alleen de uitstraling van je woning, maar ook de bescherming van hout en afwerking.",
      "Met VakConnect beschrijf je je schilderklus op een manier die direct bruikbaar is voor een vakman met relevante ervaring.",
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
          "Schilderwerk is onderhoud dat beschermt én afwerkt, niet alleen een cosmetische laag over bestaande problemen.",
          "De staat van ondergrond, kitnaden en vochtbelasting bepaalt hoeveel voorwerk nodig is vóór de eerste verflaag.",
          "Daarom lopen vergelijkbare woningen in planning en aanpak vaak toch uiteen."
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
          "Een schilder beoordeelt eerst hechting, oude verflagen, herstelplekken en gevoeligheid voor vocht of zonbelasting.",
          "Pas met die informatie kies je verantwoord tussen bijwerken, deelherstel of een volledige opbouw.",
          "Die volgorde voorkomt vroegtijdige bladders, craquelé of kleurverschillen."
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
          "Binnen en buiten vragen andere producten, droogtijden en voorbereiding van de ruimte.",
          "Voor buitenwerk spelen seizoen en weersvensters sterker mee; binnenwerk vraagt juist afstemming met gebruik van de woning.",
          "Wie deze randvoorwaarden vooraf scherp zet, krijgt beter vergelijkbare offertes en planning."
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
          "Bij binnenwerk, buitenwerk of een combinatie blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Punten zoals toegang, huidige staat en technische randvoorwaarden horen bij binnenwerk, buitenwerk of een combinatie omdat ze veel zeggen over omvang, risico en benodigde stappen binnen schilderwerk.",
          "Bij binnenwerk, buitenwerk of een combinatie helpt een inhoudelijke beoordeling door een schilder om verkeerde prioriteiten en daarmee snelle aantasting van hout en stucwerk te voorkomen."
        ]
      },
      {
        "heading": "Voorbereiding in huis of aan de gevel",
        "paragraphs": [
          "Voorbereiding in huis of aan de gevel vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Bij voorbereiding in huis of aan de gevel vormen toegang, huidige staat en technische randvoorwaarden meestal de basis voor een realistische werkinschatting in schilderwerk.",
          "Wanneer voorbereiding in huis of aan de gevel zorgvuldig wordt beoordeeld, kan een schilder gerichter plannen en de kans op snelle aantasting van hout en stucwerk terugdringen."
        ]
      },
      {
        "heading": "Planning rond droogtijd en seizoen",
        "paragraphs": [
          "Planning rond droogtijd en seizoen is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Bij planning rond droogtijd en seizoen vormen toegang, huidige staat en technische randvoorwaarden meestal de basis voor een realistische werkinschatting in schilderwerk.",
          "Wanneer planning rond droogtijd en seizoen zorgvuldig wordt beoordeeld, kan een schilder gerichter plannen en de kans op snelle aantasting van hout en stucwerk terugdringen."
        ]
      },
      {
        "heading": "Wat uitstel doet met ondergrond en herstelwerk",
        "paragraphs": [
          "Bij wat uitstel doet met ondergrond en herstelwerk blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Punten zoals toegang, huidige staat en technische randvoorwaarden horen bij wat uitstel doet met ondergrond en herstelwerk omdat ze veel zeggen over omvang, risico en benodigde stappen binnen schilderwerk.",
          "Rond wat uitstel doet met ondergrond en herstelwerk wordt vaak duidelijk dat goed voorwerk door een schilder later herstel voorkomt en snelle aantasting van hout en stucwerk reduceert."
        ],
        "type": "warning"
      },
      {
        "heading": "Hoe je een inhoudelijk sterke aanvraag opstelt",
        "paragraphs": [
          "In hoe je een inhoudelijk sterke aanvraag opstelt zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Hoe je een inhoudelijk sterke aanvraag opstelt wordt betrouwbaarder beoordeeld wanneer toegang, huidige staat en technische randvoorwaarden expliciet worden meegenomen in het beeld van schilderwerk.",
          "In de praktijk bepaalt hoe je een inhoudelijk sterke aanvraag opstelt vaak of een schilder met beperkt herstel uitkomt of een bredere oplossing adviseert om snelle aantasting van hout en stucwerk te vermijden."
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
        "answer": "Ja, dat gebeurt vaak. Denk aan eerst buiten, later binnen, of per verdieping. Geef bij de intake aan welke volgorde je prettig vindt."
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
        "answer": "Nee, VakConnect koppelt je aan een gespecialiseerde vakman."
      }
    ],
    "cta": {
      "title": "Vind een passende schilder voor jouw klus",
      "description": "Beschrijf je schilder-klus op /aanvraag met foto’s, bereikbaarheid en planning voor een gerichte eerste beoordeling.",
      "label": "Vind een passende schilder",
      "secondaryLabel": "Bekijk hoe VakConnect werkt",
      "secondaryHref": "/hoe-werkt-het"
    }
  },
  "loodgieter": {
    "path": "/loodgieter",
    "title": "Loodgieter nodig? Plaats je aanvraag via het platform",
    "description": "Van lekkage tot leidingwerk: lees wat een loodgieter doet, welke informatie je moet aanleveren en hoe VakConnect je koppelt aan een passende professional.",
    "keywords": [
      "loodgieter",
      "loodgieter",
      "vakman",
      "VakConnect"
    ],
    "h1": "Loodgieter nodig? Plaats je aanvraag op het platform",
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
          "Een loodgieter wordt ingeschakeld bij lekkages, terugkerende verstoppingen, drukproblemen of storingen in sanitair.",
          "Niet elk signaal vraagt meteen om groot werk, maar terugkerende klachten wijzen vaak op een oorzaak dieper in het systeem.",
          "Juist daarom is een diagnose op locatie belangrijk voordat onderdelen worden vervangen."
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
          "Bij water- en afvoerklachten bepaalt de route van leidingen veel: zichtbare delen zijn zelden het hele verhaal.",
          "Aansluitingen in vloer, wand en schacht kunnen de feitelijke bron zijn, ook als de klacht elders zichtbaar wordt.",
          "Een goede beoordeling voorkomt dat alleen symptomen worden weggewerkt."
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
          "Repareren is vaak voldoende bij lokaal defecte koppelingen, rubbers of beperkte verstoppingspunten.",
          "Vervanging ligt eerder voor de hand bij verouderde trajecten, terugkerende schade of ongunstige bereikbaarheid voor herhaald herstel.",
          "De afweging draait om betrouwbaarheid op termijn, niet alleen om de snelste oplossing voor vandaag."
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
          "Leidingroutes, bereikbaarheid en voorbereiding vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Voor een bruikbare beoordeling van leidingroutes, bereikbaarheid en voorbereiding zijn toegang, huidige staat en technische randvoorwaarden vaak de kerngegevens binnen leiding- en afvoerwerk.",
          "Juist in leidingroutes, bereikbaarheid en voorbereiding kan een loodgieter onderscheid maken tussen tijdelijke verlichting en een aanpak die vochtproblemen in vloeren, muren of plafonds op langere termijn verkleint."
        ]
      },
      {
        "heading": "Combinatie met badkamer- of keukenwerk",
        "paragraphs": [
          "Combinatie met badkamer- of keukenwerk maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Combinatie met badkamer- of keukenwerk wordt inhoudelijk sterker zodra toegang, huidige staat en technische randvoorwaarden niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Wanneer combinatie met badkamer- of keukenwerk zorgvuldig wordt beoordeeld, kan een loodgieter gerichter plannen en de kans op vochtproblemen in vloeren, muren of plafonds terugdringen."
        ]
      },
      {
        "heading": "Planning bij spoed en niet-spoed",
        "paragraphs": [
          "Planning bij spoed en niet-spoed geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Informatie over toegang, huidige staat en technische randvoorwaarden voorkomt ruis bij planning bij spoed en niet-spoed en maakt de aanpak binnen leiding- en afvoerwerk beter vergelijkbaar.",
          "Juist in planning bij spoed en niet-spoed kan een loodgieter onderscheid maken tussen tijdelijke verlichting en een aanpak die vochtproblemen in vloeren, muren of plafonds op langere termijn verkleint."
        ]
      },
      {
        "heading": "Risico’s van wachten bij waterproblemen",
        "paragraphs": [
          "Risico’s van wachten bij waterproblemen helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Risico’s van wachten bij waterproblemen wordt inhoudelijk sterker zodra toegang, huidige staat en technische randvoorwaarden niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Door risico’s van wachten bij waterproblemen vroeg te laten toetsen door een loodgieter worden vervolgstappen consistenter en blijft vochtproblemen in vloeren, muren of plafonds beter beheersbaar."
        ],
        "type": "warning"
      },
      {
        "heading": "Wat je in je aanvraag moet opnemen",
        "paragraphs": [
          "Bij wat je bij je aanvraag moet opnemen blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Punten zoals toegang, huidige staat en technische randvoorwaarden horen bij wat je in de intake moet opnemen omdat ze veel zeggen over omvang, risico en benodigde stappen binnen leiding- en afvoerwerk.",
          "Een loodgieter kijkt bij wat je bij de intake moet opnemen meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en vochtproblemen in vloeren, muren of plafonds beperkt blijft."
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
      "description": "Beschrijf je loodgieter-klus op /aanvraag met foto’s, bereikbaarheid en planning voor een gerichte eerste beoordeling.",
      "label": "Plaats je loodgieter-aanvraag",
      "secondaryLabel": "Bekijk hoe VakConnect werkt",
      "secondaryHref": "/hoe-werkt-het"
    }
  },
  "elektricien": {
    "path": "/elektricien",
    "title": "Elektricien vinden voor veilige elektra op VakConnect",
    "description": "Voor groepenkast, storingen en uitbreidingen: ontdek welke keuzes belangrijk zijn en vraag met VakConnect een passende elektricien aan.",
    "keywords": [
      "elektricien",
      "elektricien",
      "vakman",
      "VakConnect"
    ],
    "h1": "Elektricien vinden voor veilige elektra via het platform",
    "intro": [
      "Elektra vraagt om vakkennis, veilige uitvoering en duidelijke informatie vooraf.",
      "Op het platform leg je storingen, uitbreidingen of vervangingsvragen vast voor een passende elektricien.",
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
          "In het onderdeel wanneer een elektricien nodig is worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Voor een bruikbare beoordeling van wanneer een elektricien nodig is zijn uitvallende groepen of storingen, uitbreiden van stopcontacten en lichtpunten, voorbereiding op zwaardere apparatuur en vervangen of moderniseren van groepenkast vaak de kerngegevens binnen elektrotechnisch werk.",
          "Wie wanneer een elektricien nodig is serieus laat beoordelen door een elektricien, heeft meestal minder kans op onverwachte bijsturing en storingen of onveilige belasting."
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
          "Bij veilige beoordeling van installatie en belasting blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Voor een bruikbare beoordeling van veilige beoordeling van installatie en belasting zijn belasting en verdeling per groep, kwaliteit en ouderdom van bestaande bekabeling, verschil tussen 1-fase en 3-fase toepassingen en inspectie van beveiliging en aardingsvoorzieningen vaak de kerngegevens binnen elektrotechnisch werk.",
          "Als veilige beoordeling van installatie en belasting te globaal wordt ingeschat, groeit de kans op misplanning; een elektricien kan dat vroegtijdig bijsturen en storingen of onveilige belasting helpen beperken."
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
          "Uitbreiden of vervangen: hoe kies je geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Ook bij uitbreiden of vervangen: hoe kies je blijft de combinatie van uitbreiden van bestaande kast of volledig vervangen, gefaseerde uitvoering per ruimte, combinatie met keuken- of zolderverbouwing en extra capaciteit reserveren voor toekomstige apparatuur bepalend voor keuzes en tempo binnen elektrotechnisch werk.",
          "Bij uitbreiden of vervangen: hoe kies je is het voordeel van een elektricien vooral dat keuzes in uitvoering en timing meteen op storingen of onveilige belasting worden getoetst."
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
          "Aansluitpunten, groepen en toekomstig gebruik is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Voor een bruikbare beoordeling van aansluitpunten, groepen en toekomstig gebruik zijn toegang, huidige staat en technische randvoorwaarden vaak de kerngegevens binnen elektrotechnisch werk.",
          "Als aansluitpunten, groepen en toekomstig gebruik te globaal wordt ingeschat, groeit de kans op misplanning; een elektricien kan dat vroegtijdig bijsturen en storingen of onveilige belasting helpen beperken."
        ]
      },
      {
        "heading": "Planning met stroomonderbreking en bereikbaarheid",
        "paragraphs": [
          "Dit onderdeel, planning met stroomonderbreking en bereikbaarheid, is belangrijk omdat hier de praktische haalbaarheid wordt bepaald.",
          "Ook bij planning met stroomonderbreking en bereikbaarheid blijft de combinatie van toegang, huidige staat en technische randvoorwaarden bepalend voor keuzes en tempo binnen elektrotechnisch werk.",
          "Door planning met stroomonderbreking en bereikbaarheid vroeg te laten toetsen door een elektricien worden vervolgstappen consistenter en blijft storingen of onveilige belasting beter beheersbaar."
        ]
      },
      {
        "heading": "Combinatie met verbouwing en renovatie",
        "paragraphs": [
          "Combinatie met verbouwing en renovatie is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Voor een bruikbare beoordeling van combinatie met verbouwing en renovatie zijn toegang, huidige staat en technische randvoorwaarden vaak de kerngegevens binnen elektrotechnisch werk.",
          "Wie combinatie met verbouwing en renovatie serieus laat beoordelen door een elektricien, heeft meestal minder kans op onverwachte bijsturing en storingen of onveilige belasting."
        ]
      },
      {
        "heading": "Waarom uitstel bij elektra onwenselijk is",
        "paragraphs": [
          "Waarom uitstel bij elektra onwenselijk is geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Tijdens waarom uitstel bij elektra onwenselijk is geven toegang, huidige staat en technische randvoorwaarden richting aan materiaalkeuzes, werkvolgorde en planning in elektrotechnisch werk.",
          "Als waarom uitstel bij elektra onwenselijk is te globaal wordt ingeschat, groeit de kans op misplanning; een elektricien kan dat vroegtijdig bijsturen en storingen of onveilige belasting helpen beperken."
        ],
        "type": "warning"
      },
      {
        "heading": "Welke intake-informatie cruciaal is",
        "paragraphs": [
          "Welke intake-informatie cruciaal is geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Voor welke intake-informatie cruciaal is zijn toegang, huidige staat en technische randvoorwaarden relevant; juist daaruit blijkt hoeveel werk in elektrotechnisch werk daadwerkelijk nodig is.",
          "Rond welke intake-informatie cruciaal is wordt vaak duidelijk dat goed voorwerk door een elektricien later herstel voorkomt en storingen of onveilige belasting reduceert."
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
        "answer": "Nee, VakConnect is een platform voor matching met professional met vakkennisen."
      }
    ],
    "cta": {
      "title": "Vind een passende elektricien voor jouw klus",
      "description": "Beschrijf je elektricien-klus op /aanvraag met foto’s, bereikbaarheid en planning voor een gerichte eerste beoordeling.",
      "label": "Vind een passende elektricien",
      "secondaryLabel": "Bekijk hoe VakConnect werkt",
      "secondaryHref": "/hoe-werkt-het"
    }
  },
  "kozijnen": {
    "path": "/kozijnen",
    "title": "Kozijnen laten vervangen of onderhouden op het platform",
    "description": "Vergelijk kunststof, hout en aluminium kozijnen en ontdek hoe je een geschikte vakman vindt op VakConnect.",
    "keywords": [
      "kozijnen",
      "kozijnen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Kozijnen laten vervangen of onderhouden met VakConnect",
    "intro": [
      "Kozijnen hebben direct invloed op comfort, isolatie, onderhoud en uitstraling van je woning.",
      "Op VakConnect kun je vergelijken welke aanpak past: herstellen, gedeeltelijk vervangen of volledig vernieuwen.",
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
          "Wanneer kozijnproblemen om actie vragen helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Wanneer kozijnproblemen om actie vragen wordt betrouwbaarder beoordeeld wanneer tocht of condens rond ramen, verouderde kozijnen met onderhoudsachterstand, combineren van kozijnwerk met HR-glas en vernieuwen van ramen en deuren bij renovatie expliciet worden meegenomen in het beeld van kozijnwerk.",
          "In de praktijk bepaalt wanneer kozijnproblemen om actie vragen vaak of een kozijnspecialist met beperkt herstel uitkomt of een bredere oplossing adviseert om tocht, condens en versnelde slijtage te vermijden."
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
          "Technische beoordeling van kozijn en aansluiting is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Elementen zoals maatvoering en inmeting zijn bepalend voor pasvorm, aansluitdetails rond gevel en isolatieschil, hang- en sluitwerk voor gebruiksgemak en materiaalgedrag bij temperatuur en vocht maken technische beoordeling van kozijn en aansluiting concreet en helpen om scope in kozijnwerk af te bakenen.",
          "Bij technische beoordeling van kozijn en aansluiting helpt een inhoudelijke beoordeling door een kozijnspecialist om verkeerde prioriteiten en daarmee tocht, condens en versnelde slijtage te voorkomen."
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
          "Rond herstellen, vervangen of faseren ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Herstellen, vervangen of faseren wordt inhoudelijk sterker zodra kunststof, hout of aluminium afhankelijk van wensen, per verdieping vervangen of in één project, herstel van delen versus volledige vervanging en combinatie met schilderwerk bij houten kozijnen niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Door herstellen, vervangen of faseren vroeg te laten toetsen door een kozijnspecialist worden vervolgstappen consistenter en blijft tocht, condens en versnelde slijtage beter beheersbaar."
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
          "In materiaalkeuze: kunststof, hout of aluminium zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Materiaalkeuze: kunststof, hout of aluminium wordt inhoudelijk sterker zodra toegang, huidige staat en technische randvoorwaarden niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Wanneer materiaalkeuze: kunststof, hout of aluminium zorgvuldig wordt beoordeeld, kan een kozijnspecialist gerichter plannen en de kans op tocht, condens en versnelde slijtage terugdringen."
        ]
      },
      {
        "heading": "Combineren met glas en afwerking",
        "paragraphs": [
          "Combineren met glas en afwerking vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Bij combineren met glas en afwerking vormen toegang, huidige staat en technische randvoorwaarden meestal de basis voor een realistische werkinschatting in kozijnwerk.",
          "Wanneer combineren met glas en afwerking zorgvuldig wordt beoordeeld, kan een kozijnspecialist gerichter plannen en de kans op tocht, condens en versnelde slijtage terugdringen."
        ]
      },
      {
        "heading": "Planning en bereikbaarheid van montage",
        "paragraphs": [
          "Planning en bereikbaarheid van montage maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Bij planning en bereikbaarheid van montage worden factoren als toegang, huidige staat en technische randvoorwaarden meegewogen om keuzes in kozijnwerk technisch te onderbouwen.",
          "Een kozijnspecialist kijkt bij planning en bereikbaarheid van montage meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en tocht, condens en versnelde slijtage beperkt blijft."
        ]
      },
      {
        "heading": "Uitstel en oplopende onderhoudsdruk",
        "paragraphs": [
          "Uitstel en oplopende onderhoudsdruk geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Informatie over toegang, huidige staat en technische randvoorwaarden voorkomt ruis bij uitstel en oplopende onderhoudsdruk en maakt de aanpak binnen kozijnwerk beter vergelijkbaar.",
          "Juist in uitstel en oplopende onderhoudsdruk kan een kozijnspecialist onderscheid maken tussen tijdelijke verlichting en een aanpak die tocht, condens en versnelde slijtage op langere termijn verkleint."
        ],
        "type": "warning"
      },
      {
        "heading": "Hoe je je kozijnvraag helder aanvraagt",
        "paragraphs": [
          "In hoe je je kozijnvraag helder aanvraagt zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Wie hoe je je kozijnvraag helder aanvraagt goed wil laten inschatten, doet er verstandig aan factoren zoals toegang, huidige staat en technische randvoorwaarden direct te benoemen.",
          "Bij hoe je je kozijnvraag helder aanvraagt is het voordeel van een kozijnspecialist vooral dat keuzes in uitvoering en timing meteen op tocht, condens en versnelde slijtage worden getoetst."
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
      "description": "Beschrijf je kozijnen-klus op /aanvraag met foto’s, bereikbaarheid en planning voor een gerichte eerste beoordeling.",
      "label": "Start je kozijnen-aanvraag",
      "secondaryLabel": "Bekijk hoe VakConnect werkt",
      "secondaryHref": "/hoe-werkt-het"
    }
  },
  "badkamer": {
    "path": "/badkamer",
    "title": "Badkamer vernieuwen? Vind een vakman met relevante ervaring via het platform",
    "description": "Krijg grip op badkamerrenovatie: van indeling en installaties tot planning en kostenfactoren op het platform.",
    "keywords": [
      "badkamer",
      "badkamer",
      "vakman",
      "VakConnect"
    ],
    "h1": "Badkamer vernieuwen? Vind een gespecialiseerde vakman op VakConnect",
    "intro": [
      "Een badkamerklus raakt vaak meerdere disciplines tegelijk: sanitair, tegelwerk, leidingwerk, elektra en ventilatie.",
      "Met VakConnect zet je dat overzichtelijk in één aanvraag zodat een professional met vakkennis gericht kan beoordelen.",
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
          "In het onderdeel wanneer een badkamerproject start worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Voor een bruikbare beoordeling van wanneer een badkamerproject start zijn gedeeltelijke opfrisbeurt, complete badkamerrenovatie, ombouwen naar inloopdouche en combineren van sanitair, tegelwerk en ventilatie vaak de kerngegevens binnen badkamerverbetering.",
          "In de praktijk bepaalt wanneer een badkamerproject start vaak of een badkamerspecialist met beperkt herstel uitkomt of een bredere oplossing adviseert om vocht in constructie en terugkerende herstelkosten te vermijden."
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
          "In techniek eerst: water, afvoer, elektra en ventilatie zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Techniek eerst: water, afvoer, elektra en ventilatie wordt betrouwbaarder beoordeeld wanneer water- en afvoerpunten bepalen de speelruimte, elektra en verlichting vragen vroegtijdige afstemming, ventilatie is essentieel in natte ruimtes en tegel- en kitdetails bepalen onderhoud en levensduur expliciet worden meegenomen in het beeld van badkamerverbetering.",
          "Juist in techniek eerst: water, afvoer, elektra en ventilatie kan een badkamerspecialist onderscheid maken tussen tijdelijke verlichting en een aanpak die vocht in constructie en terugkerende herstelkosten op langere termijn verkleint."
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
          "In indeling en scope: deelrenovatie of totaal zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Bij indeling en scope: deelrenovatie of totaal worden factoren als renovatie in één keer of gefaseerd, bestaande indeling houden of aanpassen, standaard sanitair of maatwerkoplossingen en combinatie met leidingwerk en elektra-upgrades meegewogen om keuzes in badkamerverbetering technisch te onderbouwen.",
          "Bij indeling en scope: deelrenovatie of totaal helpt een inhoudelijke beoordeling door een badkamerspecialist om verkeerde prioriteiten en daarmee vocht in constructie en terugkerende herstelkosten te voorkomen."
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
          "Voorbereiding vóór sloop en opbouw voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Tijdens voorbereiding vóór sloop en opbouw geven toegang, huidige staat en technische randvoorwaarden richting aan materiaalkeuzes, werkvolgorde en planning in badkamerverbetering.",
          "Wie voorbereiding vóór sloop en opbouw serieus laat beoordelen door een badkamerspecialist, heeft meestal minder kans op onverwachte bijsturing en vocht in constructie en terugkerende herstelkosten."
        ]
      },
      {
        "heading": "Samenloop tussen disciplines",
        "paragraphs": [
          "Samenloop tussen disciplines voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Informatie over toegang, huidige staat en technische randvoorwaarden voorkomt ruis bij samenloop tussen disciplines en maakt de aanpak binnen badkamerverbetering beter vergelijkbaar.",
          "Als samenloop tussen disciplines te globaal wordt ingeschat, groeit de kans op misplanning; een badkamerspecialist kan dat vroegtijdig bijsturen en vocht in constructie en terugkerende herstelkosten helpen beperken."
        ]
      },
      {
        "heading": "Planning van ruwbouw naar afwerking",
        "paragraphs": [
          "Planning van ruwbouw naar afwerking is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Voor een bruikbare beoordeling van planning van ruwbouw naar afwerking zijn toegang, huidige staat en technische randvoorwaarden vaak de kerngegevens binnen badkamerverbetering.",
          "Als planning van ruwbouw naar afwerking te globaal wordt ingeschat, groeit de kans op misplanning; een badkamerspecialist kan dat vroegtijdig bijsturen en vocht in constructie en terugkerende herstelkosten helpen beperken."
        ]
      },
      {
        "heading": "Wat uitstel doet bij vocht en slijtage",
        "paragraphs": [
          "Wat uitstel doet bij vocht en slijtage maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Wat uitstel doet bij vocht en slijtage wordt betrouwbaarder beoordeeld wanneer toegang, huidige staat en technische randvoorwaarden expliciet worden meegenomen in het beeld van badkamerverbetering.",
          "Wie wat uitstel doet bij vocht en slijtage serieus laat beoordelen door een badkamerspecialist, heeft meestal minder kans op onverwachte bijsturing en vocht in constructie en terugkerende herstelkosten."
        ],
        "type": "warning"
      },
      {
        "heading": "Welke aanvraaginformatie het verschil maakt",
        "paragraphs": [
          "In het onderdeel welke aanvraaginformatie het verschil maakt worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Punten zoals toegang, huidige staat en technische randvoorwaarden horen bij welke aanvraaginformatie het verschil maakt omdat ze veel zeggen over omvang, risico en benodigde stappen binnen badkamerverbetering.",
          "Voor welke aanvraaginformatie het verschil maakt loont een vroege technische check door een badkamerspecialist, omdat je daarmee vocht in constructie en terugkerende herstelkosten en onnodige herstelrondes beperkt."
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
      "VakConnect koppelt je aanvraag aan een geschikte vakman of combinatie van vakgebieden.",
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
      "description": "Beschrijf je badkamer-klus op /aanvraag met foto’s, bereikbaarheid en planning voor een gerichte eerste beoordeling.",
      "label": "Beschrijf je badkamerklus",
      "secondaryLabel": "Bekijk hoe VakConnect werkt",
      "secondaryHref": "/hoe-werkt-het"
    }
  },
  "isolatie": {
    "path": "/isolatie",
    "title": "Isolatie specialist vinden met VakConnect",
    "description": "Voor dak-, vloer-, spouw- en gevelisolatie: vergelijk situaties, keuzes en aandachtspunten en vind een vakman met relevante ervaring via het platform.",
    "keywords": [
      "isolatie",
      "isolatie",
      "vakman",
      "VakConnect"
    ],
    "h1": "Isolatie specialist vinden op het platform",
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
          "Wanneer isolatie prioriteit krijgt maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Wanneer isolatie prioriteit krijgt wordt inhoudelijk sterker zodra koud aanvoelende ruimtes, hoge energievraag ondanks normaal gebruik, renovatie waarbij bouwdelen open gaan en stapsgewijs verduurzamen per woningdeel niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Bij wanneer isolatie prioriteit krijgt is het voordeel van een isolatiespecialist vooral dat keuzes in uitvoering en timing meteen op onnodig warmteverlies en comfortklachten worden getoetst."
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
          "Dit onderdeel, eerste beoordeling van bouwdeel en vochtgedrag, is belangrijk omdat hier de praktische haalbaarheid wordt bepaald.",
          "Ook bij eerste beoordeling van bouwdeel en vochtgedrag blijft de combinatie van elk bouwdeel vraagt een andere isolatiestrategie, vochtgedrag en ventilatie moeten worden meegewogen, aansluitingen en koudebruggen bepalen het eindresultaat en bestaande constructie begrenst soms de materiaalkeuze bepalend voor keuzes en tempo binnen isolatiewerk.",
          "Een realistische keuze rond eerste beoordeling van bouwdeel en vochtgedrag ontstaat meestal pas nadat een isolatiespecialist de samenhang heeft beoordeeld; dat voorkomt later onnodig warmteverlies en comfortklachten."
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
          "In keuzes in methode en materiaal zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Wie keuzes in methode en materiaal goed wil laten inschatten, doet er verstandig aan factoren zoals starten met grootste warmteverlies, isoleren per deel of gecombineerd project, binnen- of buitenzijde afhankelijk van bouwsituatie en combinatie met kozijnen of dakwerk direct te benoemen.",
          "Bij keuzes in methode en materiaal is het voordeel van een isolatiespecialist vooral dat keuzes in uitvoering en timing meteen op onnodig warmteverlies en comfortklachten worden getoetst."
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
          "Stapsgewijs verbeteren of integraal aanpakken vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Elementen zoals toegang, huidige staat en technische randvoorwaarden maken stapsgewijs verbeteren of integraal aanpakken concreet en helpen om scope in isolatiewerk af te bakenen.",
          "Bij stapsgewijs verbeteren of integraal aanpakken helpt een inhoudelijke beoordeling door een isolatiespecialist om verkeerde prioriteiten en daarmee onnodig warmteverlies en comfortklachten te voorkomen."
        ]
      },
      {
        "heading": "Combinatie met dak, gevel of kozijnen",
        "paragraphs": [
          "In combinatie met dak, gevel of kozijnen zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Combinatie met dak, gevel of kozijnen wordt inhoudelijk sterker zodra toegang, huidige staat en technische randvoorwaarden niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Bij combinatie met dak, gevel of kozijnen is het voordeel van een isolatiespecialist vooral dat keuzes in uitvoering en timing meteen op onnodig warmteverlies en comfortklachten worden getoetst."
        ]
      },
      {
        "heading": "Planning en uitvoeringsmoment",
        "paragraphs": [
          "Rond planning en uitvoeringsmoment ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Planning en uitvoeringsmoment wordt inhoudelijk sterker zodra toegang, huidige staat en technische randvoorwaarden niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Door planning en uitvoeringsmoment vroeg te laten toetsen door een isolatiespecialist worden vervolgstappen consistenter en blijft onnodig warmteverlies en comfortklachten beter beheersbaar."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en verbruik",
        "paragraphs": [
          "In het onderdeel wat uitstel betekent voor comfort en verbruik worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Voor een bruikbare beoordeling van wat uitstel betekent voor comfort en verbruik zijn toegang, huidige staat en technische randvoorwaarden vaak de kerngegevens binnen isolatiewerk.",
          "Juist in wat uitstel betekent voor comfort en verbruik kan een isolatiespecialist onderscheid maken tussen tijdelijke verlichting en een aanpak die onnodig warmteverlies en comfortklachten op langere termijn verkleint."
        ],
        "type": "warning"
      },
      {
        "heading": "Inhoud die je aanvraag sterker maakt",
        "paragraphs": [
          "Bij inhoud die je aanvraag sterker maakt blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Elementen zoals toegang, huidige staat en technische randvoorwaarden maken inhoud die je aanvraag sterker maakt concreet en helpen om scope in isolatiewerk af te bakenen.",
          "Bij inhoud die je aanvraag sterker maakt helpt een inhoudelijke beoordeling door een isolatiespecialist om verkeerde prioriteiten en daarmee onnodig warmteverlies en comfortklachten te voorkomen."
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
        "answer": "Nee, VakConnect koppelt je aan een gespecialiseerde vakman."
      }
    ],
    "cta": {
      "title": "Vind een passende isolatie voor jouw klus",
      "description": "Beschrijf je isolatie-klus op /aanvraag met foto’s, bereikbaarheid en planning voor een gerichte eerste beoordeling.",
      "label": "Vind een isolatiespecialist",
      "secondaryLabel": "Bekijk hoe VakConnect werkt",
      "secondaryHref": "/hoe-werkt-het"
    }
  },
  "verbouwing": {
    "path": "/verbouwing",
    "title": "Verbouwing plannen? Vind een professional met vakkennis op VakConnect",
    "description": "Van aanbouw tot zolderverbouwing: krijg grip op keuzes, volgorde en risico’s en start je verbouwingsaanvraag met VakConnect.",
    "keywords": [
      "verbouwing",
      "verbouwing",
      "vakman",
      "VakConnect"
    ],
    "h1": "Verbouwing plannen? Vind een geschikte vakman via het platform",
    "intro": [
      "Bij verbouwingen draait veel om volgorde: eerst helder scope bepalen, dan technisch en praktisch uitwerken.",
      "Op het platform beschrijf je je project zodat een vakman met relevante ervaring of discipline snel kan inschatten wat nodig is.",
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
          "Wanneer verbouwen logisch wordt helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Wanneer verbouwen logisch wordt wordt inhoudelijk sterker zodra ruimtegebrek oplossen, verouderde woningdelen vernieuwen, keuken of zolder functioneel herindelen en renovatie combineren met verduurzaming niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Wanneer wanneer verbouwen logisch wordt zorgvuldig wordt beoordeeld, kan een verbouwspecialist gerichter plannen en de kans op planning-uitloop en aanvullende herstelposten terugdringen."
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
          "Haalbaarheid en technische randvoorwaarden maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Haalbaarheid en technische randvoorwaarden wordt inhoudelijk sterker zodra volgorde van disciplines bepaalt voortgang, constructieve ingrepen vragen aanvullende beoordeling, installatiewerk en afbouw moeten op elkaar aansluiten en bereikbaarheid en logistiek op locatie sturen de planning niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Door haalbaarheid en technische randvoorwaarden vroeg te laten toetsen door een verbouwspecialist worden vervolgstappen consistenter en blijft planning-uitloop en aanvullende herstelposten beter beheersbaar."
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
          "Rond scope en fasering bepalen ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Scope en fasering bepalen wordt inhoudelijk sterker zodra deelverbouwing of totaalrenovatie, gefaseerd werken per ruimte, combineren met isolatie en kozijnwerk en tijdelijke maatregelen tijdens bewoonde verbouwing niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Door scope en fasering bepalen vroeg te laten toetsen door een verbouwspecialist worden vervolgstappen consistenter en blijft planning-uitloop en aanvullende herstelposten beter beheersbaar."
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
          "Dit onderdeel, combinatie met installaties en afwerking, is belangrijk omdat hier de praktische haalbaarheid wordt bepaald.",
          "Tijdens combinatie met installaties en afwerking geven toegang, huidige staat en technische randvoorwaarden richting aan materiaalkeuzes, werkvolgorde en planning in verbouwtrajecten.",
          "Juist in combinatie met installaties en afwerking kan een verbouwspecialist onderscheid maken tussen tijdelijke verlichting en een aanpak die planning-uitloop en aanvullende herstelposten op langere termijn verkleint."
        ]
      },
      {
        "heading": "Planning in een bewoonde woning",
        "paragraphs": [
          "In het onderdeel planning in een bewoonde woning worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Voor een bruikbare beoordeling van planning in een bewoonde woning zijn toegang, huidige staat en technische randvoorwaarden vaak de kerngegevens binnen verbouwtrajecten.",
          "Juist in planning in een bewoonde woning kan een verbouwspecialist onderscheid maken tussen tijdelijke verlichting en een aanpak die planning-uitloop en aanvullende herstelposten op langere termijn verkleint."
        ]
      },
      {
        "heading": "Risico’s en onvoorziene punten",
        "paragraphs": [
          "Risico’s en onvoorziene punten vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Voor een bruikbare beoordeling van risico’s en onvoorziene punten zijn toegang, huidige staat en technische randvoorwaarden vaak de kerngegevens binnen verbouwtrajecten.",
          "Wie risico’s en onvoorziene punten serieus laat beoordelen door een verbouwspecialist, heeft meestal minder kans op onverwachte bijsturing en planning-uitloop en aanvullende herstelposten."
        ]
      },
      {
        "heading": "Wanneer aanvullende beoordeling nodig is",
        "paragraphs": [
          "Wanneer aanvullende beoordeling nodig is helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Wie wanneer aanvullende beoordeling nodig is goed wil laten inschatten, doet er verstandig aan factoren zoals toegang, huidige staat en technische randvoorwaarden direct te benoemen.",
          "Door wanneer aanvullende beoordeling nodig is vroeg te laten toetsen door een verbouwspecialist worden vervolgstappen consistenter en blijft planning-uitloop en aanvullende herstelposten beter beheersbaar."
        ],
        "type": "warning"
      },
      {
        "heading": "Welke projectdetails je aanvraag compleet maken",
        "paragraphs": [
          "Welke projectdetails je aanvraag compleet maken helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Bij welke projectdetails je aanvraag compleet maken worden factoren als toegang, huidige staat en technische randvoorwaarden meegewogen om keuzes in verbouwtrajecten technisch te onderbouwen.",
          "Bij welke projectdetails je aanvraag compleet maken helpt een inhoudelijke beoordeling door een verbouwspecialist om verkeerde prioriteiten en daarmee planning-uitloop en aanvullende herstelposten te voorkomen."
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
      "VakConnect koppelt je aanvraag aan een gespecialiseerde vakman of uitvoerende discipline.",
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
      "description": "Beschrijf je verbouwing-klus op /aanvraag met foto’s, bereikbaarheid en planning voor een gerichte eerste beoordeling.",
      "label": "Start je verbouwingsaanvraag",
      "secondaryLabel": "Bekijk hoe VakConnect werkt",
      "secondaryHref": "/hoe-werkt-het"
    }
  }
} satisfies Record<string, ServiceContentPageData>;

const rawServiceSubPages = {
  "dakdekker/daklekkage": {
    "path": "/dakdekker/daklekkage",
    "title": "Daklekkage op het platform",
    "description": "Herken signalen van daklekkage, begrijp de meest voorkomende oorzaken en vraag op VakConnect gericht hulp aan.",
    "keywords": [
      "dakdekker",
      "daklekkage",
      "vakman",
      "VakConnect"
    ],
    "h1": "Daklekkage: vind een professional met vakkennis met VakConnect",
    "intro": [
      "Zoek je hulp bij daklekkage? Op VakConnect kun je je situatie helder omschrijven en een geschikte vakman vinden.",
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
          "Daklekkage ontstaat vaak op overgangen: naden, doorvoeren, aansluitingen en opstanden waar water langer blijft staan.",
          "Bij hellende daken spelen verschoven pannen en onderliggende folies mee; bij platte daken zijn naden en afwatering vaak kritische punten.",
          "De zichtbare plek binnen is niet altijd de bron, omdat water zich via constructiedelen kan verplaatsen."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — daklekkage",
        "paragraphs": [
          "Een vakman zoekt eerst naar het daadwerkelijke lektraject in plaats van alleen het natte binnenvlak te herstellen.",
          "Daarbij worden dakdetails stap voor stap gecontroleerd, zodat tijdelijke symptomen niet worden verward met de hoofdoorzaak.",
          "Zo voorkom je dat dezelfde lekkage na de eerstvolgende regen terugkomt."
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
          "Noodherstel is zinvol bij actieve inwatering, maar vervangt geen structurele reparatie van het kwetsbare detail.",
          "Definitief herstel vraagt vaak om materiaal dat past bij de bestaande dakopbouw en correcte afwerking van randen en aansluitingen.",
          "Wie snel aanvraagt met foto’s van buiten én binnen, krijgt meestal eerder een bruikbare eerste inschatting."
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
          "Bij wat een dakdekker meestal eerst controleert (daklekkage) — daklekkage blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Voor een bruikbare beoordeling van wat een dakdekker meestal eerst controleert (daklekkage) — daklekkage zijn de bron lokaliseren met inspectie van dakvlak en details, inschatten of noodherstel nodig is om directe schade te beperken, definitief herstel plannen op basis van oorzaak en controleren of onderliggende constructie droog en stabiel blijft vaak de kerngegevens binnen dakwerk.",
          "In de praktijk bepaalt wat een dakdekker meestal eerst controleert (daklekkage) — daklekkage vaak of een dakdekker met beperkt herstel uitkomt of een bredere oplossing adviseert om blijvende vochtschade te vermijden."
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
          "Keuzes in herstel: lokaal, deels of breder — daklekkage is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Bij keuzes in herstel: lokaal, deels of breder — daklekkage vormen noodmaatregel bij actieve lekkage versus planmatig definitief herstel, lokale reparatie of grotere aanpak bij brede slijtage en combinatie met dakinspectie of renovatie als meerdere zwakke punten zichtbaar zijn meestal de basis voor een realistische werkinschatting in dakwerk.",
          "Door keuzes in herstel: lokaal, deels of breder — daklekkage vroeg te laten toetsen door een dakdekker worden vervolgstappen consistenter en blijft blijvende vochtschade beter beheersbaar."
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
          "Welke informatie je bij je aanvraag moet zetten — daklekkage geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Voor welke informatie je in de intake moet zetten — daklekkage zijn toegang, huidige staat en technische randvoorwaarden relevant; juist daaruit blijkt hoeveel werk in dakwerk daadwerkelijk nodig is.",
          "Een dakdekker kijkt bij welke informatie je bij de intake moet zetten — daklekkage meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en blijvende vochtschade beperkt blijft."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — daklekkage",
        "paragraphs": [
          "Voor gevolgen van uitstel en wanneer sneller handelen verstandig is — daklekkage geldt dat kleine signalen vaak veel zeggen over het vervolg van de klus.",
          "Informatie over toegang, huidige staat en technische randvoorwaarden voorkomt ruis bij gevolgen van uitstel en wanneer sneller handelen verstandig is — daklekkage en maakt de aanpak binnen dakwerk beter vergelijkbaar.",
          "Als gevolgen van uitstel en wanneer sneller handelen verstandig is — daklekkage te globaal wordt ingeschat, groeit de kans op misplanning; een dakdekker kan dat vroegtijdig bijsturen en blijvende vochtschade helpen beperken."
        ],
        "type": "warning"
      },
      {
        "heading": "Planning, bereikbaarheid en afstemming op locatie — daklekkage",
        "paragraphs": [
          "Planning, bereikbaarheid en afstemming op locatie — daklekkage helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Wie planning, bereikbaarheid en afstemming op locatie — daklekkage goed wil laten inschatten, doet er verstandig aan factoren zoals toegang, huidige staat en technische randvoorwaarden direct te benoemen.",
          "Een realistische keuze rond planning, bereikbaarheid en afstemming op locatie — daklekkage ontstaat meestal pas nadat een dakdekker de samenhang heeft beoordeeld; dat voorkomt later blijvende vochtschade."
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over daklekkage, locatie en planning.",
      "label": "Plaats je aanvraag voor daklekkage",
      "secondaryLabel": "Terug naar dakdekker",
      "secondaryHref": "/dakdekker"
    }
  },
  "dakdekker/dakrenovatie": {
    "path": "/dakdekker/dakrenovatie",
    "title": "Dakrenovatie via het platform",
    "description": "Overweeg je dakrenovatie? Lees wanneer renovatie logisch is, welke keuzes je hebt en hoe je je aanvraag goed voorbereidt.",
    "keywords": [
      "dakdekker",
      "dakrenovatie",
      "vakman",
      "VakConnect"
    ],
    "h1": "Dakrenovatie: vind een vakman met relevante ervaring op het platform",
    "intro": [
      "Zoek je hulp bij dakrenovatie? Met VakConnect kun je je situatie helder omschrijven en een gespecialiseerde vakman vinden.",
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
          "Wanneer renovatie logischer is dan blijven repareren helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Wie wanneer renovatie logischer is dan blijven repareren goed wil laten inschatten, doet er verstandig aan factoren zoals toegang, huidige staat en technische randvoorwaarden direct te benoemen.",
          "Bij wanneer renovatie logischer is dan blijven repareren is het voordeel van een dakdekker vooral dat keuzes in uitvoering en timing meteen op blijvende vochtschade worden getoetst."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — dakrenovatie",
        "paragraphs": [
          "In signalen die vaak wijzen op dakproblemen — dakrenovatie zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Signalen die vaak wijzen op dakproblemen — dakrenovatie wordt betrouwbaarder beoordeeld wanneer terugkerende lekkages op meerdere plekken, zichtbare veroudering van dakmateriaal, oplopende onderhoudsfrequentie en comfortverlies door koude of vochtproblemen expliciet worden meegenomen in het beeld van dakwerk.",
          "Juist in signalen die vaak wijzen op dakproblemen — dakrenovatie kan een dakdekker onderscheid maken tussen tijdelijke verlichting en een aanpak die blijvende vochtschade op langere termijn verkleint."
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
          "Waardoor dit probleem meestal ontstaat — dakrenovatie maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Waardoor dit probleem meestal ontstaat — dakrenovatie wordt inhoudelijk sterker zodra einde technische levensduur van materiaal, achterstallig onderhoud en onvoldoende kwaliteit van oudere details niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Door waardoor dit probleem meestal ontstaat — dakrenovatie vroeg te laten toetsen door een dakdekker worden vervolgstappen consistenter en blijft blijvende vochtschade beter beheersbaar."
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
          "Wat een dakdekker meestal eerst controleert (dakrenovatie) — dakrenovatie maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Bij wat een dakdekker meestal eerst controleert (dakrenovatie) — dakrenovatie worden factoren als staat van dakopbouw integraal beoordelen, scenario’s vergelijken: herstel, deelrenovatie of volledig vernieuwen, planning afstemmen op bereikbaarheid en seizoen en uitvoering combineren met verbeteringen zoals isolatie meegewogen om keuzes in dakwerk technisch te onderbouwen.",
          "Voor wat een dakdekker meestal eerst controleert (dakrenovatie) — dakrenovatie loont een vroege technische check door een dakdekker, omdat je daarmee blijvende vochtschade en onnodige herstelrondes beperkt."
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
          "Keuzes in herstel: lokaal, deels of breder — dakrenovatie vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Elementen zoals gefaseerde renovatie bij beperkte scope, volledige renovatie bij structurele problemen en combineren met isolatie en afwateringsverbetering maken keuzes in herstel: lokaal, deels of breder — dakrenovatie concreet en helpen om scope in dakwerk af te bakenen.",
          "Een dakdekker kijkt bij keuzes in herstel: lokaal, deels of breder — dakrenovatie meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en blijvende vochtschade beperkt blijft."
        ],
        "bullets": [
          "gefaseerde renovatie bij beperkte scope",
          "volledige renovatie bij structurele problemen",
          "combineren met isolatie en afwateringsverbetering"
        ]
      },
      {
        "heading": "Welke informatie je bij je aanvraag moet zetten — dakrenovatie",
        "paragraphs": [
          "Welke informatie je in de intake moet zetten — dakrenovatie voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Ook bij welke informatie je bij de intake moet zetten — dakrenovatie blijft de combinatie van toegang, huidige staat en technische randvoorwaarden bepalend voor keuzes en tempo binnen dakwerk.",
          "Een realistische keuze rond welke informatie je in je aanvraag moet zetten — dakrenovatie ontstaat meestal pas nadat een dakdekker de samenhang heeft beoordeeld; dat voorkomt later blijvende vochtschade."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — dakrenovatie",
        "paragraphs": [
          "Bij gevolgen van uitstel en wanneer sneller handelen verstandig is — dakrenovatie blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Elementen zoals toegang, huidige staat en technische randvoorwaarden maken gevolgen van uitstel en wanneer sneller handelen verstandig is — dakrenovatie concreet en helpen om scope in dakwerk af te bakenen.",
          "Voor gevolgen van uitstel en wanneer sneller handelen verstandig is — dakrenovatie loont een vroege technische check door een dakdekker, omdat je daarmee blijvende vochtschade en onnodige herstelrondes beperkt."
        ],
        "type": "warning"
      },
      {
        "heading": "Planning, bereikbaarheid en afstemming op locatie — dakrenovatie",
        "paragraphs": [
          "Planning, bereikbaarheid en afstemming op locatie — dakrenovatie vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Punten zoals toegang, huidige staat en technische randvoorwaarden horen bij planning, bereikbaarheid en afstemming op locatie — dakrenovatie omdat ze veel zeggen over omvang, risico en benodigde stappen binnen dakwerk.",
          "Bij planning, bereikbaarheid en afstemming op locatie — dakrenovatie helpt een inhoudelijke beoordeling door een dakdekker om verkeerde prioriteiten en daarmee blijvende vochtschade te voorkomen."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe bij je aanvraag.",
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over dakrenovatie, locatie en planning.",
      "label": "Vraag een specialist voor dakrenovatie",
      "secondaryLabel": "Terug naar dakdekker",
      "secondaryHref": "/dakdekker"
    }
  },
  "dakdekker/dakpannen-vervangen": {
    "path": "/dakdekker/dakpannen-vervangen",
    "title": "Dakpannen vervangen op VakConnect",
    "description": "Dakpannen beschadigd of poreus? Ontdek wanneer vervanging verstandig is en wat de omvang van de klus bepaalt.",
    "keywords": [
      "dakdekker",
      "dakpannen-vervangen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Dakpannen vervangen: vind een professional met vakkennis met VakConnect",
    "intro": [
      "Zoek je hulp bij dakpannen vervangen? Via VakConnect kun je je situatie helder omschrijven en een geschikte vakman vinden.",
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
          "Losse pannen vervangen of een groter vlak aanpakken vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Elementen zoals toegang, huidige staat en technische randvoorwaarden maken losse pannen vervangen of een groter vlak aanpakken concreet en helpen om scope in dakwerk af te bakenen.",
          "Rond losse pannen vervangen of een groter vlak aanpakken wordt vaak duidelijk dat goed voorwerk door een dakdekker later herstel voorkomt en blijvende vochtschade reduceert."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — dakpannen vervangen",
        "paragraphs": [
          "Signalen die vaak wijzen op dakproblemen — dakpannen vervangen geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Tijdens signalen die vaak wijzen op dakproblemen — dakpannen vervangen geven gebroken of verschoven pannen, zichtbare poreuze pannen, vochtsporen onder dakvlak en regelmatige stormschade op dezelfde zones richting aan materiaalkeuzes, werkvolgorde en planning in dakwerk.",
          "Juist in signalen die vaak wijzen op dakproblemen — dakpannen vervangen kan een dakdekker onderscheid maken tussen tijdelijke verlichting en een aanpak die blijvende vochtschade op langere termijn verkleint."
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
          "Dit onderdeel, waardoor dit probleem meestal ontstaat — dakpannen vervangen, is belangrijk omdat hier de praktische haalbaarheid wordt bepaald.",
          "Voor waardoor dit probleem meestal ontstaat — dakpannen vervangen zijn ouderdom en weersinvloed, bevestigingsproblemen bij nok of randen en lokale belasting door wind relevant; juist daaruit blijkt hoeveel werk in dakwerk daadwerkelijk nodig is.",
          "Rond waardoor dit probleem meestal ontstaat — dakpannen vervangen wordt vaak duidelijk dat goed voorwerk door een dakdekker later herstel voorkomt en blijvende vochtschade reduceert."
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
          "Wat een dakdekker meestal eerst controleert (dakpannen vervangen) — dakpannen vervangen helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Wie wat een dakdekker meestal eerst controleert (dakpannen vervangen) — dakpannen vervangen goed wil laten inschatten, doet er verstandig aan factoren zoals inspectie van complete rij en aansluitingen, vervanging van losse pannen of grotere vlakken, controle op onderliggende laag en nokdetails en nazicht op waterdichtheid na herstel direct te benoemen.",
          "Bij wat een dakdekker meestal eerst controleert (dakpannen vervangen) — dakpannen vervangen is het voordeel van een dakdekker vooral dat keuzes in uitvoering en timing meteen op blijvende vochtschade worden getoetst."
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
          "Rond keuzes in herstel: lokaal, deels of breder — dakpannen vervangen ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Keuzes in herstel: lokaal, deels of breder — dakpannen vervangen wordt inhoudelijk sterker zodra deelherstel met kleurverschil accepteren of bredere vervanging kiezen, combinatie met nokvorstherstel en planning direct na stormperiode of als onderhoudsproject niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Bij keuzes in herstel: lokaal, deels of breder — dakpannen vervangen is het voordeel van een dakdekker vooral dat keuzes in uitvoering en timing meteen op blijvende vochtschade worden getoetst."
        ],
        "bullets": [
          "deelherstel met kleurverschil accepteren of bredere vervanging kiezen",
          "combinatie met nokvorstherstel",
          "planning direct na stormperiode of als onderhoudsproject"
        ]
      },
      {
        "heading": "Welke informatie je in de intake moet zetten — dakpannen vervangen",
        "paragraphs": [
          "Dit onderdeel, welke informatie je bij de intake moet zetten — dakpannen vervangen, is belangrijk omdat hier de praktische haalbaarheid wordt bepaald.",
          "Informatie over toegang, huidige staat en technische randvoorwaarden voorkomt ruis bij welke informatie je in je aanvraag moet zetten — dakpannen vervangen en maakt de aanpak binnen dakwerk beter vergelijkbaar.",
          "Als welke informatie je bij je aanvraag moet zetten — dakpannen vervangen te globaal wordt ingeschat, groeit de kans op misplanning; een dakdekker kan dat vroegtijdig bijsturen en blijvende vochtschade helpen beperken."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — dakpannen vervangen",
        "paragraphs": [
          "Gevolgen van uitstel en wanneer sneller handelen verstandig is — dakpannen vervangen maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Gevolgen van uitstel en wanneer sneller handelen verstandig is — dakpannen vervangen wordt betrouwbaarder beoordeeld wanneer toegang, huidige staat en technische randvoorwaarden expliciet worden meegenomen in het beeld van dakwerk.",
          "Wie gevolgen van uitstel en wanneer sneller handelen verstandig is — dakpannen vervangen serieus laat beoordelen door een dakdekker, heeft meestal minder kans op onverwachte bijsturing en blijvende vochtschade."
        ],
        "type": "warning"
      },
      {
        "heading": "Planning, bereikbaarheid en afstemming op locatie — dakpannen vervangen",
        "paragraphs": [
          "Rond planning, bereikbaarheid en afstemming op locatie — dakpannen vervangen ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Planning, bereikbaarheid en afstemming op locatie — dakpannen vervangen wordt inhoudelijk sterker zodra toegang, huidige staat en technische randvoorwaarden niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Wanneer planning, bereikbaarheid en afstemming op locatie — dakpannen vervangen zorgvuldig wordt beoordeeld, kan een dakdekker gerichter plannen en de kans op blijvende vochtschade terugdringen."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in de intake.",
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over dakpannen vervangen, locatie en planning.",
      "label": "Start je aanvraag voor dakpannen",
      "secondaryLabel": "Terug naar dakdekker",
      "secondaryHref": "/dakdekker"
    }
  },
  "dakdekker/plat-dak": {
    "path": "/dakdekker/plat-dak",
    "title": "Plat dak via het platform",
    "description": "Voor onderhoud, reparatie of vernieuwing van een plat dak: lees wat belangrijk is en plaats gericht je aanvraag.",
    "keywords": [
      "dakdekker",
      "plat-dak",
      "vakman",
      "VakConnect"
    ],
    "h1": "Plat dak: vind een vakman met relevante ervaring op het platform",
    "intro": [
      "Zoek je hulp bij plat dak? Op het platform kun je je situatie helder omschrijven en een gespecialiseerde vakman vinden.",
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
          "Wanneer plat dak in beeld komt maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Bij wanneer plat dak in beeld komt worden factoren als toegang, huidige staat en technische randvoorwaarden meegewogen om keuzes in dakwerk technisch te onderbouwen.",
          "Rond wanneer plat dak in beeld komt wordt vaak duidelijk dat goed voorwerk door een dakdekker later herstel voorkomt en blijvende vochtschade reduceert."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — plat dak",
        "paragraphs": [
          "Signalen die vaak wijzen op dakproblemen — plat dak vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Punten zoals plassen die lang blijven staan, blazen of scheuren in daklaag, lekkage na regen en losse randen bij opstanden horen bij signalen die vaak wijzen op dakproblemen — plat dak omdat ze veel zeggen over omvang, risico en benodigde stappen binnen dakwerk.",
          "Rond signalen die vaak wijzen op dakproblemen — plat dak wordt vaak duidelijk dat goed voorwerk door een dakdekker later herstel voorkomt en blijvende vochtschade reduceert."
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
          "Voor waardoor dit probleem meestal ontstaat — plat dak geldt dat kleine signalen vaak veel zeggen over het vervolg van de klus.",
          "Ook bij waardoor dit probleem meestal ontstaat — plat dak blijft de combinatie van verouderde dakbedekking, beperkte afwatering en zwakke aansluitdetails bepalend voor keuzes en tempo binnen dakwerk.",
          "Bij waardoor dit probleem meestal ontstaat — plat dak is het voordeel van een dakdekker vooral dat keuzes in uitvoering en timing meteen op blijvende vochtschade worden getoetst."
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
          "Bij wat een dakdekker meestal eerst controleert (plat dak) — plat dak blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Bij wat een dakdekker meestal eerst controleert (plat dak) — plat dak vormen visuele inspectie van daklaag en naden, controle van afschot en afvoer, lokaal herstel of deelvernieuwing en advies over onderhoudsinterval meestal de basis voor een realistische werkinschatting in dakwerk.",
          "Door wat een dakdekker meestal eerst controleert (plat dak) — plat dak vroeg te laten toetsen door een dakdekker worden vervolgstappen consistenter en blijft blijvende vochtschade beter beheersbaar."
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
          "Voor keuzes in herstel: lokaal, deels of breder — plat dak geldt dat kleine signalen vaak veel zeggen over het vervolg van de klus.",
          "Informatie over repareren van detail of groter oppervlak vernieuwen, materiaalkeuze passend bij bestaande opbouw en combineren met dakgoot- of afvoerwerk voorkomt ruis bij keuzes in herstel: lokaal, deels of breder — plat dak en maakt de aanpak binnen dakwerk beter vergelijkbaar.",
          "Wie keuzes in herstel: lokaal, deels of breder — plat dak serieus laat beoordelen door een dakdekker, heeft meestal minder kans op onverwachte bijsturing en blijvende vochtschade."
        ],
        "bullets": [
          "repareren van detail of groter oppervlak vernieuwen",
          "materiaalkeuze passend bij bestaande opbouw",
          "combineren met dakgoot- of afvoerwerk"
        ]
      },
      {
        "heading": "Welke informatie je bij de intake moet zetten — plat dak",
        "paragraphs": [
          "In welke informatie je in je aanvraag moet zetten — plat dak zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Welke informatie je bij je aanvraag moet zetten — plat dak wordt inhoudelijk sterker zodra toegang, huidige staat en technische randvoorwaarden niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Een realistische keuze rond welke informatie je in de intake moet zetten — plat dak ontstaat meestal pas nadat een dakdekker de samenhang heeft beoordeeld; dat voorkomt later blijvende vochtschade."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — plat dak",
        "paragraphs": [
          "Gevolgen van uitstel en wanneer sneller handelen verstandig is — plat dak voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Voor gevolgen van uitstel en wanneer sneller handelen verstandig is — plat dak zijn toegang, huidige staat en technische randvoorwaarden relevant; juist daaruit blijkt hoeveel werk in dakwerk daadwerkelijk nodig is.",
          "Voor gevolgen van uitstel en wanneer sneller handelen verstandig is — plat dak loont een vroege technische check door een dakdekker, omdat je daarmee blijvende vochtschade en onnodige herstelrondes beperkt."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe bij de intake.",
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over plat dak, locatie en planning.",
      "label": "Vraag hulp voor je platte dak",
      "secondaryLabel": "Terug naar dakdekker",
      "secondaryHref": "/dakdekker"
    }
  },
  "dakdekker/schoorsteen": {
    "path": "/dakdekker/schoorsteen",
    "title": "Schoorsteen op VakConnect",
    "description": "Lekkage of slijtage rond de schoorsteen? Lees welke oorzaken vaak voorkomen en hoe je de klus goed aanvraagt.",
    "keywords": [
      "dakdekker",
      "schoorsteen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Schoorsteen: vind een professional met vakkennis met VakConnect",
    "intro": [
      "Zoek je hulp bij schoorsteen? Op VakConnect kun je je situatie helder omschrijven en een geschikte vakman vinden.",
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
          "Voor wanneer schoorsteen in beeld komt geldt dat kleine signalen vaak veel zeggen over het vervolg van de klus.",
          "Voor wanneer schoorsteen in beeld komt zijn toegang, huidige staat en technische randvoorwaarden relevant; juist daaruit blijkt hoeveel werk in dakwerk daadwerkelijk nodig is.",
          "Rond wanneer schoorsteen in beeld komt wordt vaak duidelijk dat goed voorwerk door een dakdekker later herstel voorkomt en blijvende vochtschade reduceert."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — schoorsteen",
        "paragraphs": [
          "Rond signalen die vaak wijzen op dakproblemen — schoorsteen ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Signalen die vaak wijzen op dakproblemen — schoorsteen wordt inhoudelijk sterker zodra vocht rond schoorsteen, scheuren in voegwerk, losse loodstroken en afbrokkelende delen niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Een realistische keuze rond signalen die vaak wijzen op dakproblemen — schoorsteen ontstaat meestal pas nadat een dakdekker de samenhang heeft beoordeeld; dat voorkomt later blijvende vochtschade."
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
          "Waardoor dit probleem meestal ontstaat — schoorsteen maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Waardoor dit probleem meestal ontstaat — schoorsteen wordt betrouwbaarder beoordeeld wanneer verouderde voegen, versleten aansluiting met dak en vorstschade expliciet worden meegenomen in het beeld van dakwerk.",
          "Juist in waardoor dit probleem meestal ontstaat — schoorsteen kan een dakdekker onderscheid maken tussen tijdelijke verlichting en een aanpak die blijvende vochtschade op langere termijn verkleint."
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
          "Wat een dakdekker meestal eerst controleert (schoorsteen) — schoorsteen geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Ook bij wat een dakdekker meestal eerst controleert (schoorsteen) — schoorsteen blijft de combinatie van inspectie van metselwerk en looddetails, herstellen of vervangen van aansluitstroken, opnieuw voegen waar nodig en controle op waterdichte aansluiting met dakvlak bepalend voor keuzes en tempo binnen dakwerk.",
          "Wanneer wat een dakdekker meestal eerst controleert (schoorsteen) — schoorsteen zorgvuldig wordt beoordeeld, kan een dakdekker gerichter plannen en de kans op blijvende vochtschade terugdringen."
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
          "Keuzes in herstel: lokaal, deels of breder — schoorsteen geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Tijdens keuzes in herstel: lokaal, deels of breder — schoorsteen geven alleen voegwerk of compleet detailherstel, combinatie met daklekkage-onderzoek en preventieve inspectie bij ouder metselwerk richting aan materiaalkeuzes, werkvolgorde en planning in dakwerk.",
          "Wie keuzes in herstel: lokaal, deels of breder — schoorsteen serieus laat beoordelen door een dakdekker, heeft meestal minder kans op onverwachte bijsturing en blijvende vochtschade."
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
          "Welke informatie je bij je aanvraag moet zetten — schoorsteen is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Punten zoals toegang, huidige staat en technische randvoorwaarden horen bij welke informatie je in de intake moet zetten — schoorsteen omdat ze veel zeggen over omvang, risico en benodigde stappen binnen dakwerk.",
          "Rond welke informatie je bij de intake moet zetten — schoorsteen wordt vaak duidelijk dat goed voorwerk door een dakdekker later herstel voorkomt en blijvende vochtschade reduceert."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — schoorsteen",
        "paragraphs": [
          "Rond gevolgen van uitstel en wanneer sneller handelen verstandig is — schoorsteen ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Bij gevolgen van uitstel en wanneer sneller handelen verstandig is — schoorsteen worden factoren als toegang, huidige staat en technische randvoorwaarden meegewogen om keuzes in dakwerk technisch te onderbouwen.",
          "Bij gevolgen van uitstel en wanneer sneller handelen verstandig is — schoorsteen helpt een inhoudelijke beoordeling door een dakdekker om verkeerde prioriteiten en daarmee blijvende vochtschade te voorkomen."
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
        "answer": "Nee, VakConnect koppelt je aan een vakman met relevante ervaring."
      }
    ],
    "cta": {
      "title": "Beschrijf je schoorsteen-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met concrete details over schoorsteen, locatie en planning.",
      "label": "Vraag schoorsteenhulp aan",
      "secondaryLabel": "Terug naar dakdekker",
      "secondaryHref": "/dakdekker"
    }
  },
  "dakdekker/nokvorsten": {
    "path": "/dakdekker/nokvorsten",
    "title": "Nokvorsten via het platform",
    "description": "Losliggende of gescheurde nokvorsten? Ontdek wanneer herstel nodig is en hoe je snel de juiste specialist vindt.",
    "keywords": [
      "dakdekker",
      "nokvorsten",
      "vakman",
      "VakConnect"
    ],
    "h1": "Nokvorsten: vind een gespecialiseerde vakman op het platform",
    "intro": [
      "Zoek je hulp bij nokvorsten? Met VakConnect kun je je situatie helder omschrijven en een professional met vakkennis vinden.",
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
          "In wanneer nokvorsten in beeld komt zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Wie wanneer nokvorsten in beeld komt goed wil laten inschatten, doet er verstandig aan factoren zoals toegang, huidige staat en technische randvoorwaarden direct te benoemen.",
          "Door wanneer nokvorsten in beeld komt vroeg te laten toetsen door een dakdekker worden vervolgstappen consistenter en blijft blijvende vochtschade beter beheersbaar."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — nokvorsten",
        "paragraphs": [
          "Rond signalen die vaak wijzen op dakproblemen — nokvorsten ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Signalen die vaak wijzen op dakproblemen — nokvorsten wordt betrouwbaarder beoordeeld wanneer scheef liggende nokdelen, scheuren in bevestiging en vochtsporen bij nok expliciet worden meegenomen in het beeld van dakwerk.",
          "Juist in signalen die vaak wijzen op dakproblemen — nokvorsten kan een dakdekker onderscheid maken tussen tijdelijke verlichting en een aanpak die blijvende vochtschade op langere termijn verkleint."
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
          "Waardoor dit probleem meestal ontstaat — nokvorsten voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Tijdens waardoor dit probleem meestal ontstaat — nokvorsten geven ouderdom van mortel of bevestiging, stormbelasting en werking van dakconstructie richting aan materiaalkeuzes, werkvolgorde en planning in dakwerk.",
          "Juist in waardoor dit probleem meestal ontstaat — nokvorsten kan een dakdekker onderscheid maken tussen tijdelijke verlichting en een aanpak die blijvende vochtschade op langere termijn verkleint."
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
          "Wat een dakdekker meestal eerst controleert (nokvorsten) — nokvorsten geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Informatie over controle van de hele noklijn, lokale reparatie of vernieuwen van delen en verbeteren van bevestiging en afdichting voorkomt ruis bij wat een dakdekker meestal eerst controleert (nokvorsten) — nokvorsten en maakt de aanpak binnen dakwerk beter vergelijkbaar.",
          "Wie wat een dakdekker meestal eerst controleert (nokvorsten) — nokvorsten serieus laat beoordelen door een dakdekker, heeft meestal minder kans op onverwachte bijsturing en blijvende vochtschade."
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
          "Keuzes in herstel: lokaal, deels of breder — nokvorsten helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Bij keuzes in herstel: lokaal, deels of breder — nokvorsten worden factoren als traditionele mortel of droog noksysteem en plaatselijk herstel of complete nokaanpak meegewogen om keuzes in dakwerk technisch te onderbouwen.",
          "Een dakdekker kijkt bij keuzes in herstel: lokaal, deels of breder — nokvorsten meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en blijvende vochtschade beperkt blijft."
        ],
        "bullets": [
          "traditionele mortel of droog noksysteem",
          "plaatselijk herstel of complete nokaanpak"
        ]
      },
      {
        "heading": "Welke informatie je bij je aanvraag moet zetten — nokvorsten",
        "paragraphs": [
          "Welke informatie je in de intake moet zetten — nokvorsten maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Welke informatie je bij de intake moet zetten — nokvorsten wordt betrouwbaarder beoordeeld wanneer toegang, huidige staat en technische randvoorwaarden expliciet worden meegenomen in het beeld van dakwerk.",
          "In de praktijk bepaalt welke informatie je in je aanvraag moet zetten — nokvorsten vaak of een dakdekker met beperkt herstel uitkomt of een bredere oplossing adviseert om blijvende vochtschade te vermijden."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — nokvorsten",
        "paragraphs": [
          "Bij gevolgen van uitstel en wanneer sneller handelen verstandig is — nokvorsten blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Punten zoals toegang, huidige staat en technische randvoorwaarden horen bij gevolgen van uitstel en wanneer sneller handelen verstandig is — nokvorsten omdat ze veel zeggen over omvang, risico en benodigde stappen binnen dakwerk.",
          "Een dakdekker kijkt bij gevolgen van uitstel en wanneer sneller handelen verstandig is — nokvorsten meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en blijvende vochtschade beperkt blijft."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe bij je aanvraag.",
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over nokvorsten, locatie en planning.",
      "label": "Plaats je nokvorsten-aanvraag",
      "secondaryLabel": "Terug naar dakdekker",
      "secondaryHref": "/dakdekker"
    }
  },
  "dakdekker/dakgoot": {
    "path": "/dakdekker/dakgoot",
    "title": "Dakgoot op VakConnect",
    "description": "Problemen met dakgoot of afwatering? Lees wanneer reparatie of vervanging nodig is.",
    "keywords": [
      "dakdekker",
      "dakgoot",
      "vakman",
      "VakConnect"
    ],
    "h1": "Dakgoot: vind een geschikte vakman met VakConnect",
    "intro": [
      "Zoek je hulp bij dakgoot? Via VakConnect kun je je situatie helder omschrijven en een vakman met relevante ervaring vinden.",
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
          "In het onderdeel wanneer dakgoot in beeld komt worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Voor een bruikbare beoordeling van wanneer dakgoot in beeld komt zijn toegang, huidige staat en technische randvoorwaarden vaak de kerngegevens binnen dakwerk.",
          "Als wanneer dakgoot in beeld komt te globaal wordt ingeschat, groeit de kans op misplanning; een dakdekker kan dat vroegtijdig bijsturen en blijvende vochtschade helpen beperken."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — dakgoot",
        "paragraphs": [
          "Rond signalen die vaak wijzen op dakproblemen — dakgoot ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Signalen die vaak wijzen op dakproblemen — dakgoot wordt inhoudelijk sterker zodra overlopende goot bij normale regen, natte gevelstroken en doorhangende delen niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Een realistische keuze rond signalen die vaak wijzen op dakproblemen — dakgoot ontstaat meestal pas nadat een dakdekker de samenhang heeft beoordeeld; dat voorkomt later blijvende vochtschade."
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
          "Waardoor dit probleem meestal ontstaat — dakgoot voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Ook bij waardoor dit probleem meestal ontstaat — dakgoot blijft de combinatie van verstopping, slijtage van verbindingen en onvoldoende afschot bepalend voor keuzes en tempo binnen dakwerk.",
          "Wanneer waardoor dit probleem meestal ontstaat — dakgoot zorgvuldig wordt beoordeeld, kan een dakdekker gerichter plannen en de kans op blijvende vochtschade terugdringen."
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
          "Wat een dakdekker meestal eerst controleert (dakgoot) — dakgoot geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Tijdens wat een dakdekker meestal eerst controleert (dakgoot) — dakgoot geven goottraject inspecteren en reinigen, naden herstellen of delen vervangen en afvoer en afschot verbeteren richting aan materiaalkeuzes, werkvolgorde en planning in dakwerk.",
          "Juist in wat een dakdekker meestal eerst controleert (dakgoot) — dakgoot kan een dakdekker onderscheid maken tussen tijdelijke verlichting en een aanpak die blijvende vochtschade op langere termijn verkleint."
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
          "Keuzes in herstel: lokaal, deels of breder — dakgoot vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Punten zoals onderhoud vs vervanging, materiaalkeuze afgestemd op woningtype en combinatie met afvoercontrole horen bij keuzes in herstel: lokaal, deels of breder — dakgoot omdat ze veel zeggen over omvang, risico en benodigde stappen binnen dakwerk.",
          "Voor keuzes in herstel: lokaal, deels of breder — dakgoot loont een vroege technische check door een dakdekker, omdat je daarmee blijvende vochtschade en onnodige herstelrondes beperkt."
        ],
        "bullets": [
          "onderhoud vs vervanging",
          "materiaalkeuze afgestemd op woningtype",
          "combinatie met afvoercontrole"
        ]
      },
      {
        "heading": "Welke informatie je in de intake moet zetten — dakgoot",
        "paragraphs": [
          "Welke informatie je bij de intake moet zetten — dakgoot voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Informatie over toegang, huidige staat en technische randvoorwaarden voorkomt ruis bij welke informatie je in je aanvraag moet zetten — dakgoot en maakt de aanpak binnen dakwerk beter vergelijkbaar.",
          "Wie welke informatie je bij je aanvraag moet zetten — dakgoot serieus laat beoordelen door een dakdekker, heeft meestal minder kans op onverwachte bijsturing en blijvende vochtschade."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — dakgoot",
        "paragraphs": [
          "Rond gevolgen van uitstel en wanneer sneller handelen verstandig is — dakgoot ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Bij gevolgen van uitstel en wanneer sneller handelen verstandig is — dakgoot worden factoren als toegang, huidige staat en technische randvoorwaarden meegewogen om keuzes in dakwerk technisch te onderbouwen.",
          "Bij gevolgen van uitstel en wanneer sneller handelen verstandig is — dakgoot helpt een inhoudelijke beoordeling door een dakdekker om verkeerde prioriteiten en daarmee blijvende vochtschade te voorkomen."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in de intake.",
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over dakgoot, locatie en planning.",
      "label": "Vraag hulp voor dakgootwerk",
      "secondaryLabel": "Terug naar dakdekker",
      "secondaryHref": "/dakdekker"
    }
  },
  "dakdekker/dakkapel": {
    "path": "/dakdekker/dakkapel",
    "title": "Dakkapel via het platform",
    "description": "Lekkage of slijtage rond je dakkapel? Vind op het platform een specialist voor beoordeling en herstel.",
    "keywords": [
      "dakdekker",
      "dakkapel",
      "vakman",
      "VakConnect"
    ],
    "h1": "Dakkapel: vind een gespecialiseerde vakman op VakConnect",
    "intro": [
      "Zoek je hulp bij dakkapel? Op het platform kun je je situatie helder omschrijven en een professional met vakkennis vinden.",
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
          "Bij wanneer dakkapel in beeld komt blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Elementen zoals toegang, huidige staat en technische randvoorwaarden maken wanneer dakkapel in beeld komt concreet en helpen om scope in dakwerk af te bakenen.",
          "Een dakdekker kijkt bij wanneer dakkapel in beeld komt meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en blijvende vochtschade beperkt blijft."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — dakkapel",
        "paragraphs": [
          "In het onderdeel signalen die vaak wijzen op dakproblemen — dakkapel worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Bij signalen die vaak wijzen op dakproblemen — dakkapel vormen vochtsporen bij zijwang, tocht of kieren en scheuren in bekleding meestal de basis voor een realistische werkinschatting in dakwerk.",
          "Door signalen die vaak wijzen op dakproblemen — dakkapel vroeg te laten toetsen door een dakdekker worden vervolgstappen consistenter en blijft blijvende vochtschade beter beheersbaar."
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
          "Waardoor dit probleem meestal ontstaat — dakkapel maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Wie waardoor dit probleem meestal ontstaat — dakkapel goed wil laten inschatten, doet er verstandig aan factoren zoals versleten afdichting, slechte afwatering en ouderdom van bekleding direct te benoemen.",
          "Wanneer waardoor dit probleem meestal ontstaat — dakkapel zorgvuldig wordt beoordeeld, kan een dakdekker gerichter plannen en de kans op blijvende vochtschade terugdringen."
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
          "Wat een dakdekker meestal eerst controleert (dakkapel) — dakkapel is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Voor een bruikbare beoordeling van wat een dakdekker meestal eerst controleert (dakkapel) — dakkapel zijn details rond aansluitingen controleren, afdichting en bekleding herstellen en nazicht van kozijn- en dakovergang vaak de kerngegevens binnen dakwerk.",
          "Als wat een dakdekker meestal eerst controleert (dakkapel) — dakkapel te globaal wordt ingeschat, groeit de kans op misplanning; een dakdekker kan dat vroegtijdig bijsturen en blijvende vochtschade helpen beperken."
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
          "Keuzes in herstel: lokaal, deels of breder — dakkapel geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Voor keuzes in herstel: lokaal, deels of breder — dakkapel zijn lokaal herstel of bredere renovatie en combinatie met kozijnwerk of schilderwerk relevant; juist daaruit blijkt hoeveel werk in dakwerk daadwerkelijk nodig is.",
          "Rond keuzes in herstel: lokaal, deels of breder — dakkapel wordt vaak duidelijk dat goed voorwerk door een dakdekker later herstel voorkomt en blijvende vochtschade reduceert."
        ],
        "bullets": [
          "lokaal herstel of bredere renovatie",
          "combinatie met kozijnwerk of schilderwerk"
        ]
      },
      {
        "heading": "Welke informatie je bij de intake moet zetten — dakkapel",
        "paragraphs": [
          "Welke informatie je in je aanvraag moet zetten — dakkapel is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Bij welke informatie je bij je aanvraag moet zetten — dakkapel vormen toegang, huidige staat en technische randvoorwaarden meestal de basis voor een realistische werkinschatting in dakwerk.",
          "Bij welke informatie je in de intake moet zetten — dakkapel is het voordeel van een dakdekker vooral dat keuzes in uitvoering en timing meteen op blijvende vochtschade worden getoetst."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — dakkapel",
        "paragraphs": [
          "Voor gevolgen van uitstel en wanneer sneller handelen verstandig is — dakkapel geldt dat kleine signalen vaak veel zeggen over het vervolg van de klus.",
          "Informatie over toegang, huidige staat en technische randvoorwaarden voorkomt ruis bij gevolgen van uitstel en wanneer sneller handelen verstandig is — dakkapel en maakt de aanpak binnen dakwerk beter vergelijkbaar.",
          "In de praktijk bepaalt gevolgen van uitstel en wanneer sneller handelen verstandig is — dakkapel vaak of een dakdekker met beperkt herstel uitkomt of een bredere oplossing adviseert om blijvende vochtschade te vermijden."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe bij de intake.",
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
        "answer": "Nee, VakConnect koppelt je aan een geschikte vakman."
      }
    ],
    "cta": {
      "title": "Beschrijf je dakkapel-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met concrete details over dakkapel, locatie en planning.",
      "label": "Start je dakkapel-aanvraag",
      "secondaryLabel": "Terug naar dakdekker",
      "secondaryHref": "/dakdekker"
    }
  },
  "dakdekker/dakinspectie": {
    "path": "/dakdekker/dakinspectie",
    "title": "Dakinspectie met VakConnect",
    "description": "Plan een dakinspectie bij twijfel, onderhoud of aankoop en krijg inzicht in de staat van je dak.",
    "keywords": [
      "dakdekker",
      "dakinspectie",
      "vakman",
      "VakConnect"
    ],
    "h1": "Dakinspectie: vind een vakman met relevante ervaring via het platform",
    "intro": [
      "Zoek je hulp bij dakinspectie? Op VakConnect kun je je situatie helder omschrijven en een gespecialiseerde vakman vinden.",
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
          "Rond wanneer dakinspectie in beeld komt ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Wanneer dakinspectie in beeld komt wordt inhoudelijk sterker zodra toegang, huidige staat en technische randvoorwaarden niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Wanneer wanneer dakinspectie in beeld komt zorgvuldig wordt beoordeeld, kan een dakdekker gerichter plannen en de kans op blijvende vochtschade terugdringen."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — dakinspectie",
        "paragraphs": [
          "Rond signalen die vaak wijzen op dakproblemen — dakinspectie ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Bij signalen die vaak wijzen op dakproblemen — dakinspectie worden factoren als ouder dak zonder recente controle, onverklaarde vochtsporen en controlebehoefte na storm meegewogen om keuzes in dakwerk technisch te onderbouwen.",
          "Rond signalen die vaak wijzen op dakproblemen — dakinspectie wordt vaak duidelijk dat goed voorwerk door een dakdekker later herstel voorkomt en blijvende vochtschade reduceert."
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
          "Waardoor dit probleem meestal ontstaat — dakinspectie vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Punten zoals normale veroudering, verborgen schade en onvoldoende periodiek onderhoud horen bij waardoor dit probleem meestal ontstaat — dakinspectie omdat ze veel zeggen over omvang, risico en benodigde stappen binnen dakwerk.",
          "Een dakdekker kijkt bij waardoor dit probleem meestal ontstaat — dakinspectie meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en blijvende vochtschade beperkt blijft."
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
          "Voor wat een dakdekker meestal eerst controleert (dakinspectie) — dakinspectie geldt dat kleine signalen vaak veel zeggen over het vervolg van de klus.",
          "Ook bij wat een dakdekker meestal eerst controleert (dakinspectie) — dakinspectie blijft de combinatie van visuele opname van dakvlak en details, vastleggen van aandachtspunten en advies over onderhoud, herstel of renovatie bepalend voor keuzes en tempo binnen dakwerk.",
          "Door wat een dakdekker meestal eerst controleert (dakinspectie) — dakinspectie vroeg te laten toetsen door een dakdekker worden vervolgstappen consistenter en blijft blijvende vochtschade beter beheersbaar."
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
          "Keuzes in herstel: lokaal, deels of breder — dakinspectie voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Voor keuzes in herstel: lokaal, deels of breder — dakinspectie zijn eenmalige inspectie of periodieke controle en direct vervolgwerk opnemen of later plannen relevant; juist daaruit blijkt hoeveel werk in dakwerk daadwerkelijk nodig is.",
          "Bij keuzes in herstel: lokaal, deels of breder — dakinspectie helpt een inhoudelijke beoordeling door een dakdekker om verkeerde prioriteiten en daarmee blijvende vochtschade te voorkomen."
        ],
        "bullets": [
          "eenmalige inspectie of periodieke controle",
          "direct vervolgwerk opnemen of later plannen"
        ]
      },
      {
        "heading": "Welke informatie je in je aanvraag moet zetten — dakinspectie",
        "paragraphs": [
          "Welke informatie je bij je aanvraag moet zetten — dakinspectie geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Ook bij welke informatie je in de intake moet zetten — dakinspectie blijft de combinatie van toegang, huidige staat en technische randvoorwaarden bepalend voor keuzes en tempo binnen dakwerk.",
          "Wanneer welke informatie je bij de intake moet zetten — dakinspectie zorgvuldig wordt beoordeeld, kan een dakdekker gerichter plannen en de kans op blijvende vochtschade terugdringen."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — dakinspectie",
        "paragraphs": [
          "Dit onderdeel, gevolgen van uitstel en wanneer sneller handelen verstandig is — dakinspectie, is belangrijk omdat hier de praktische haalbaarheid wordt bepaald.",
          "Informatie over toegang, huidige staat en technische randvoorwaarden voorkomt ruis bij gevolgen van uitstel en wanneer sneller handelen verstandig is — dakinspectie en maakt de aanpak binnen dakwerk beter vergelijkbaar.",
          "Wie gevolgen van uitstel en wanneer sneller handelen verstandig is — dakinspectie serieus laat beoordelen door een dakdekker, heeft meestal minder kans op onverwachte bijsturing en blijvende vochtschade."
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over dakinspectie, locatie en planning.",
      "label": "Vraag een dakinspectie aan",
      "secondaryLabel": "Terug naar dakdekker",
      "secondaryHref": "/dakdekker"
    }
  },
  "schilder/binnenschilderwerk": {
    "path": "/schilder/binnenschilderwerk",
    "title": "Binnenschilderwerk op het platform",
    "description": "Binnenschilderwerk laten doen? Lees hoe voorbereiding, verfkeuze en planning het eindresultaat bepalen.",
    "keywords": [
      "schilder",
      "binnenschilderwerk",
      "vakman",
      "VakConnect"
    ],
    "h1": "Binnenschilderwerk: vind een professional met vakkennis op VakConnect",
    "intro": [
      "Zoek je hulp bij binnenschilderwerk? Met VakConnect kun je je situatie helder omschrijven en een geschikte vakman vinden.",
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
          "In wanneer binnenschilderwerk in beeld komt zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Wanneer binnenschilderwerk in beeld komt wordt betrouwbaarder beoordeeld wanneer toegang, huidige staat en technische randvoorwaarden expliciet worden meegenomen in het beeld van schilderwerk.",
          "Wie wanneer binnenschilderwerk in beeld komt serieus laat beoordelen door een schilder, heeft meestal minder kans op onverwachte bijsturing en snelle aantasting van hout en stucwerk."
        ]
      },
      {
        "heading": "Welke klachten je vaak ziet vóór schilderwerk — binnenschilderwerk",
        "paragraphs": [
          "Welke klachten je vaak ziet vóór schilderwerk — binnenschilderwerk voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Voor welke klachten je vaak ziet vóór schilderwerk — binnenschilderwerk zijn vlekken, strepen of beschadigingen, slijtage op houtwerk en ongelijke oude lagen relevant; juist daaruit blijkt hoeveel werk in schilderwerk daadwerkelijk nodig is.",
          "Rond welke klachten je vaak ziet vóór schilderwerk — binnenschilderwerk wordt vaak duidelijk dat goed voorwerk door een schilder later herstel voorkomt en snelle aantasting van hout en stucwerk reduceert."
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
          "Dit onderdeel, oorzaken achter slijtage of slechte afwerking — binnenschilderwerk, is belangrijk omdat hier de praktische haalbaarheid wordt bepaald.",
          "Ook bij oorzaken achter slijtage of slechte afwerking — binnenschilderwerk blijft de combinatie van normaal gebruik, vocht of condens en verouderde afwerking bepalend voor keuzes en tempo binnen schilderwerk.",
          "Door oorzaken achter slijtage of slechte afwerking — binnenschilderwerk vroeg te laten toetsen door een schilder worden vervolgstappen consistenter en blijft snelle aantasting van hout en stucwerk beter beheersbaar."
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
          "In het onderdeel hoe een schilder de ondergrond beoordeelt (binnenschilderwerk) — binnenschilderwerk worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Voor een bruikbare beoordeling van hoe een schilder de ondergrond beoordeelt (binnenschilderwerk) — binnenschilderwerk zijn ondergrond voorbereiden, passende lagen opbouwen en strak afwerken van randen en details vaak de kerngegevens binnen schilderwerk.",
          "Als hoe een schilder de ondergrond beoordeelt (binnenschilderwerk) — binnenschilderwerk te globaal wordt ingeschat, groeit de kans op misplanning; een schilder kan dat vroegtijdig bijsturen en snelle aantasting van hout en stucwerk helpen beperken."
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
          "Rond keuzes in afwerking en combinatie met ander onderhoud — binnenschilderwerk ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Keuzes in afwerking en combinatie met ander onderhoud — binnenschilderwerk wordt inhoudelijk sterker zodra ruimte voor ruimte werken, accent op muren, plafonds of houtwerk en hoog belastbare verf in druk gebruikte ruimtes niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Wanneer keuzes in afwerking en combinatie met ander onderhoud — binnenschilderwerk zorgvuldig wordt beoordeeld, kan een schilder gerichter plannen en de kans op snelle aantasting van hout en stucwerk terugdringen."
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
          "Zo maak je je aanvraag concreet en vergelijkbaar — binnenschilderwerk is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Bij zo maak je je aanvraag concreet en vergelijkbaar — binnenschilderwerk vormen toegang, huidige staat en technische randvoorwaarden meestal de basis voor een realistische werkinschatting in schilderwerk.",
          "Wanneer zo maak je je aanvraag concreet en vergelijkbaar — binnenschilderwerk zorgvuldig wordt beoordeeld, kan een schilder gerichter plannen en de kans op snelle aantasting van hout en stucwerk terugdringen."
        ]
      },
      {
        "heading": "Wat er gebeurt als je onderhoud te lang uitstelt — binnenschilderwerk",
        "paragraphs": [
          "Wat er gebeurt als je onderhoud te lang uitstelt — binnenschilderwerk voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Ook bij wat er gebeurt als je onderhoud te lang uitstelt — binnenschilderwerk blijft de combinatie van toegang, huidige staat en technische randvoorwaarden bepalend voor keuzes en tempo binnen schilderwerk.",
          "Wanneer wat er gebeurt als je onderhoud te lang uitstelt — binnenschilderwerk zorgvuldig wordt beoordeeld, kan een schilder gerichter plannen en de kans op snelle aantasting van hout en stucwerk terugdringen."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe bij je aanvraag.",
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over binnenschilderwerk, locatie en planning.",
      "label": "Start je aanvraag voor binnenschilderwerk",
      "secondaryLabel": "Terug naar schilder",
      "secondaryHref": "/schilder"
    }
  },
  "schilder/buitenschilderwerk": {
    "path": "/schilder/buitenschilderwerk",
    "title": "Buitenschilderwerk met VakConnect",
    "description": "Voor onderhoud en bescherming van geveldelen: ontdek wat buitenschilderwerk vraagt.",
    "keywords": [
      "schilder",
      "buitenschilderwerk",
      "vakman",
      "VakConnect"
    ],
    "h1": "Buitenschilderwerk: vind een vakman met relevante ervaring via het platform",
    "intro": [
      "Zoek je hulp bij buitenschilderwerk? Via VakConnect kun je je situatie helder omschrijven en een gespecialiseerde vakman vinden.",
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
          "Dit onderdeel, wanneer buitenschilderwerk in beeld komt, is belangrijk omdat hier de praktische haalbaarheid wordt bepaald.",
          "Voor wanneer buitenschilderwerk in beeld komt zijn toegang, huidige staat en technische randvoorwaarden relevant; juist daaruit blijkt hoeveel werk in schilderwerk daadwerkelijk nodig is.",
          "Een schilder kijkt bij wanneer buitenschilderwerk in beeld komt meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en snelle aantasting van hout en stucwerk beperkt blijft."
        ]
      },
      {
        "heading": "Welke klachten je vaak ziet vóór schilderwerk — buitenschilderwerk",
        "paragraphs": [
          "Welke klachten je vaak ziet vóór schilderwerk — buitenschilderwerk voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Ook bij welke klachten je vaak ziet vóór schilderwerk — buitenschilderwerk blijft de combinatie van bladderende buitenverf, kale plekken op hout en verkleuring op zonzijde bepalend voor keuzes en tempo binnen schilderwerk.",
          "Bij welke klachten je vaak ziet vóór schilderwerk — buitenschilderwerk is het voordeel van een schilder vooral dat keuzes in uitvoering en timing meteen op snelle aantasting van hout en stucwerk worden getoetst."
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
          "Voor oorzaken achter slijtage of slechte afwerking — buitenschilderwerk geldt dat kleine signalen vaak veel zeggen over het vervolg van de klus.",
          "Voor oorzaken achter slijtage of slechte afwerking — buitenschilderwerk zijn UV en neerslag, achterstallig onderhoud en vochtinwerking relevant; juist daaruit blijkt hoeveel werk in schilderwerk daadwerkelijk nodig is.",
          "Voor oorzaken achter slijtage of slechte afwerking — buitenschilderwerk loont een vroege technische check door een schilder, omdat je daarmee snelle aantasting van hout en stucwerk en onnodige herstelrondes beperkt."
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
          "Hoe een schilder de ondergrond beoordeelt (buitenschilderwerk) — buitenschilderwerk vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Punten zoals inspectie van geveldelen, voorbehandeling en herstel en opbouw van duurzaam verfsysteem horen bij hoe een schilder de ondergrond beoordeelt (buitenschilderwerk) — buitenschilderwerk omdat ze veel zeggen over omvang, risico en benodigde stappen binnen schilderwerk.",
          "Voor hoe een schilder de ondergrond beoordeelt (buitenschilderwerk) — buitenschilderwerk loont een vroege technische check door een schilder, omdat je daarmee snelle aantasting van hout en stucwerk en onnodige herstelrondes beperkt."
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
          "Bij keuzes in afwerking en combinatie met ander onderhoud — buitenschilderwerk blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Elementen zoals deelonderhoud of complete ronde, focus op kozijnen, deuren of boeidelen en combinatie met houtreparatie maken keuzes in afwerking en combinatie met ander onderhoud — buitenschilderwerk concreet en helpen om scope in schilderwerk af te bakenen.",
          "Een schilder kijkt bij keuzes in afwerking en combinatie met ander onderhoud — buitenschilderwerk meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en snelle aantasting van hout en stucwerk beperkt blijft."
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
          "Zo maak je je aanvraag concreet en vergelijkbaar — buitenschilderwerk vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Voor een bruikbare beoordeling van zo maak je je aanvraag concreet en vergelijkbaar — buitenschilderwerk zijn toegang, huidige staat en technische randvoorwaarden vaak de kerngegevens binnen schilderwerk.",
          "Als zo maak je je aanvraag concreet en vergelijkbaar — buitenschilderwerk te globaal wordt ingeschat, groeit de kans op misplanning; een schilder kan dat vroegtijdig bijsturen en snelle aantasting van hout en stucwerk helpen beperken."
        ]
      },
      {
        "heading": "Wat er gebeurt als je onderhoud te lang uitstelt — buitenschilderwerk",
        "paragraphs": [
          "Wat er gebeurt als je onderhoud te lang uitstelt — buitenschilderwerk vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Bij wat er gebeurt als je onderhoud te lang uitstelt — buitenschilderwerk vormen toegang, huidige staat en technische randvoorwaarden meestal de basis voor een realistische werkinschatting in schilderwerk.",
          "Bij wat er gebeurt als je onderhoud te lang uitstelt — buitenschilderwerk is het voordeel van een schilder vooral dat keuzes in uitvoering en timing meteen op snelle aantasting van hout en stucwerk worden getoetst."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in de intake.",
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over buitenschilderwerk, locatie en planning.",
      "label": "Vraag buitenschilderwerk aan",
      "secondaryLabel": "Terug naar schilder",
      "secondaryHref": "/schilder"
    }
  },
  "schilder/kozijnen-schilderen": {
    "path": "/schilder/kozijnen-schilderen",
    "title": "Kozijnen schilderen op het platform",
    "description": "Kozijnen schilderen met oog voor bescherming en uitstraling: lees waarop je moet letten.",
    "keywords": [
      "schilder",
      "kozijnen-schilderen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Kozijnen schilderen: vind een professional met vakkennis op VakConnect",
    "intro": [
      "Zoek je hulp bij kozijnen schilderen? Op het platform kun je je situatie helder omschrijven en een geschikte vakman vinden.",
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
          "Wanneer kozijnen schilderen in beeld komt maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Bij wanneer kozijnen schilderen in beeld komt worden factoren als toegang, huidige staat en technische randvoorwaarden meegewogen om keuzes in schilderwerk technisch te onderbouwen.",
          "Voor wanneer kozijnen schilderen in beeld komt loont een vroege technische check door een schilder, omdat je daarmee snelle aantasting van hout en stucwerk en onnodige herstelrondes beperkt."
        ]
      },
      {
        "heading": "Welke klachten je vaak ziet vóór schilderwerk — kozijnen schilderen",
        "paragraphs": [
          "In welke klachten je vaak ziet vóór schilderwerk — kozijnen schilderen zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Welke klachten je vaak ziet vóór schilderwerk — kozijnen schilderen wordt inhoudelijk sterker zodra scheuren of bladders, doffe plekken en beginnende houtaantasting niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Wanneer welke klachten je vaak ziet vóór schilderwerk — kozijnen schilderen zorgvuldig wordt beoordeeld, kan een schilder gerichter plannen en de kans op snelle aantasting van hout en stucwerk terugdringen."
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
          "Oorzaken achter slijtage of slechte afwerking — kozijnen schilderen vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Bij oorzaken achter slijtage of slechte afwerking — kozijnen schilderen vormen verouderde verflaag, vocht in naden en intensieve zonbelasting meestal de basis voor een realistische werkinschatting in schilderwerk.",
          "Door oorzaken achter slijtage of slechte afwerking — kozijnen schilderen vroeg te laten toetsen door een schilder worden vervolgstappen consistenter en blijft snelle aantasting van hout en stucwerk beter beheersbaar."
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
          "Hoe een schilder de ondergrond beoordeelt (kozijnen schilderen) — kozijnen schilderen geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Ook bij hoe een schilder de ondergrond beoordeelt (kozijnen schilderen) — kozijnen schilderen blijft de combinatie van conditie van hout beoordelen, herstellen en gronden en aflakken met geschikt systeem bepalend voor keuzes en tempo binnen schilderwerk.",
          "Een realistische keuze rond hoe een schilder de ondergrond beoordeelt (kozijnen schilderen) — kozijnen schilderen ontstaat meestal pas nadat een schilder de samenhang heeft beoordeeld; dat voorkomt later snelle aantasting van hout en stucwerk."
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
          "Keuzes in afwerking en combinatie met ander onderhoud — kozijnen schilderen vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Bij keuzes in afwerking en combinatie met ander onderhoud — kozijnen schilderen vormen binnenzijde, buitenzijde of beide en lokale herstelklus of volledig kozijnpakket meestal de basis voor een realistische werkinschatting in schilderwerk.",
          "Door keuzes in afwerking en combinatie met ander onderhoud — kozijnen schilderen vroeg te laten toetsen door een schilder worden vervolgstappen consistenter en blijft snelle aantasting van hout en stucwerk beter beheersbaar."
        ],
        "bullets": [
          "binnenzijde, buitenzijde of beide",
          "lokale herstelklus of volledig kozijnpakket"
        ]
      },
      {
        "heading": "Zo maak je je aanvraag concreet en vergelijkbaar — kozijnen schilderen",
        "paragraphs": [
          "Rond zo maak je je aanvraag concreet en vergelijkbaar — kozijnen schilderen ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Zo maak je je aanvraag concreet en vergelijkbaar — kozijnen schilderen wordt betrouwbaarder beoordeeld wanneer toegang, huidige staat en technische randvoorwaarden expliciet worden meegenomen in het beeld van schilderwerk.",
          "In de praktijk bepaalt zo maak je je aanvraag concreet en vergelijkbaar — kozijnen schilderen vaak of een schilder met beperkt herstel uitkomt of een bredere oplossing adviseert om snelle aantasting van hout en stucwerk te vermijden."
        ]
      },
      {
        "heading": "Wat er gebeurt als je onderhoud te lang uitstelt — kozijnen schilderen",
        "paragraphs": [
          "Rond wat er gebeurt als je onderhoud te lang uitstelt — kozijnen schilderen ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Bij wat er gebeurt als je onderhoud te lang uitstelt — kozijnen schilderen worden factoren als toegang, huidige staat en technische randvoorwaarden meegewogen om keuzes in schilderwerk technisch te onderbouwen.",
          "Een schilder kijkt bij wat er gebeurt als je onderhoud te lang uitstelt — kozijnen schilderen meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en snelle aantasting van hout en stucwerk beperkt blijft."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe bij de intake.",
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over kozijnen schilderen, locatie en planning.",
      "label": "Plaats je kozijnen-schilderaanvraag",
      "secondaryLabel": "Terug naar schilder",
      "secondaryHref": "/schilder"
    }
  },
  "schilder/deuren-schilderen": {
    "path": "/schilder/deuren-schilderen",
    "title": "Deuren schilderen met VakConnect",
    "description": "Binnen- of buitendeuren laten schilderen: lees wat bepalend is voor een slijtvaste afwerking.",
    "keywords": [
      "schilder",
      "deuren-schilderen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Deuren schilderen: vind een vakman met relevante ervaring via het platform",
    "intro": [
      "Zoek je hulp bij deuren schilderen? Op VakConnect kun je je situatie helder omschrijven en een gespecialiseerde vakman vinden.",
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
          "Wanneer deuren schilderen in beeld komt vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Bij wanneer deuren schilderen in beeld komt vormen toegang, huidige staat en technische randvoorwaarden meestal de basis voor een realistische werkinschatting in schilderwerk.",
          "Wanneer wanneer deuren schilderen in beeld komt zorgvuldig wordt beoordeeld, kan een schilder gerichter plannen en de kans op snelle aantasting van hout en stucwerk terugdringen."
        ]
      },
      {
        "heading": "Welke klachten je vaak ziet vóór schilderwerk — deuren schilderen",
        "paragraphs": [
          "Voor welke klachten je vaak ziet vóór schilderwerk — deuren schilderen geldt dat kleine signalen vaak veel zeggen over het vervolg van de klus.",
          "Tijdens welke klachten je vaak ziet vóór schilderwerk — deuren schilderen geven krassen of stootplekken, slijtage rond handgrepen en oude lak die vergeling toont richting aan materiaalkeuzes, werkvolgorde en planning in schilderwerk.",
          "Wie welke klachten je vaak ziet vóór schilderwerk — deuren schilderen serieus laat beoordelen door een schilder, heeft meestal minder kans op onverwachte bijsturing en snelle aantasting van hout en stucwerk."
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
          "Oorzaken achter slijtage of slechte afwerking — deuren schilderen maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Bij oorzaken achter slijtage of slechte afwerking — deuren schilderen worden factoren als dagelijks gebruik, onvoldoende harde toplaag en vocht- of temperatuurbelasting meegewogen om keuzes in schilderwerk technisch te onderbouwen.",
          "Rond oorzaken achter slijtage of slechte afwerking — deuren schilderen wordt vaak duidelijk dat goed voorwerk door een schilder later herstel voorkomt en snelle aantasting van hout en stucwerk reduceert."
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
          "Bij hoe een schilder de ondergrond beoordeelt (deuren schilderen) — deuren schilderen blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Punten zoals oppervlak voorbereiden, beschadigingen herstellen en aflakken met slijtvaste laag horen bij hoe een schilder de ondergrond beoordeelt (deuren schilderen) — deuren schilderen omdat ze veel zeggen over omvang, risico en benodigde stappen binnen schilderwerk.",
          "Voor hoe een schilder de ondergrond beoordeelt (deuren schilderen) — deuren schilderen loont een vroege technische check door een schilder, omdat je daarmee snelle aantasting van hout en stucwerk en onnodige herstelrondes beperkt."
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
          "Keuzes in afwerking en combinatie met ander onderhoud — deuren schilderen voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Tijdens keuzes in afwerking en combinatie met ander onderhoud — deuren schilderen geven alle deuren tegelijk of gefaseerd en binnen en buiten apart plannen richting aan materiaalkeuzes, werkvolgorde en planning in schilderwerk.",
          "In de praktijk bepaalt keuzes in afwerking en combinatie met ander onderhoud — deuren schilderen vaak of een schilder met beperkt herstel uitkomt of een bredere oplossing adviseert om snelle aantasting van hout en stucwerk te vermijden."
        ],
        "bullets": [
          "alle deuren tegelijk of gefaseerd",
          "binnen en buiten apart plannen"
        ]
      },
      {
        "heading": "Zo maak je je aanvraag concreet en vergelijkbaar — deuren schilderen",
        "paragraphs": [
          "In het onderdeel zo maak je je aanvraag concreet en vergelijkbaar — deuren schilderen worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Voor een bruikbare beoordeling van zo maak je je aanvraag concreet en vergelijkbaar — deuren schilderen zijn toegang, huidige staat en technische randvoorwaarden vaak de kerngegevens binnen schilderwerk.",
          "Juist in zo maak je je aanvraag concreet en vergelijkbaar — deuren schilderen kan een schilder onderscheid maken tussen tijdelijke verlichting en een aanpak die snelle aantasting van hout en stucwerk op langere termijn verkleint."
        ]
      },
      {
        "heading": "Wat er gebeurt als je onderhoud te lang uitstelt — deuren schilderen",
        "paragraphs": [
          "Bij wat er gebeurt als je onderhoud te lang uitstelt — deuren schilderen blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Voor een bruikbare beoordeling van wat er gebeurt als je onderhoud te lang uitstelt — deuren schilderen zijn toegang, huidige staat en technische randvoorwaarden vaak de kerngegevens binnen schilderwerk.",
          "Wie wat er gebeurt als je onderhoud te lang uitstelt — deuren schilderen serieus laat beoordelen door een schilder, heeft meestal minder kans op onverwachte bijsturing en snelle aantasting van hout en stucwerk."
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over deuren schilderen, locatie en planning.",
      "label": "Start je deurenschilder-aanvraag",
      "secondaryLabel": "Terug naar schilder",
      "secondaryHref": "/schilder"
    }
  },
  "schilder/plafond-schilderen": {
    "path": "/schilder/plafond-schilderen",
    "title": "Plafond schilderen op het platform",
    "description": "Plafond schilderen zonder strepen: krijg inzicht in voorbereiding, productkeuze en uitvoering.",
    "keywords": [
      "schilder",
      "plafond-schilderen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Plafond schilderen: vind een professional met vakkennis op VakConnect",
    "intro": [
      "Zoek je hulp bij plafond schilderen? Met VakConnect kun je je situatie helder omschrijven en een geschikte vakman vinden.",
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
          "Wanneer plafond schilderen in beeld komt maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Wanneer plafond schilderen in beeld komt wordt betrouwbaarder beoordeeld wanneer toegang, huidige staat en technische randvoorwaarden expliciet worden meegenomen in het beeld van schilderwerk.",
          "In de praktijk bepaalt wanneer plafond schilderen in beeld komt vaak of een schilder met beperkt herstel uitkomt of een bredere oplossing adviseert om snelle aantasting van hout en stucwerk te vermijden."
        ]
      },
      {
        "heading": "Welke klachten je vaak ziet vóór schilderwerk — plafond schilderen",
        "paragraphs": [
          "In het onderdeel welke klachten je vaak ziet vóór schilderwerk — plafond schilderen worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Punten zoals vlekken door vocht of rook, streperig eindbeeld en haarscheuren horen bij welke klachten je vaak ziet vóór schilderwerk — plafond schilderen omdat ze veel zeggen over omvang, risico en benodigde stappen binnen schilderwerk.",
          "Een schilder kijkt bij welke klachten je vaak ziet vóór schilderwerk — plafond schilderen meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en snelle aantasting van hout en stucwerk beperkt blijft."
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
          "Oorzaken achter slijtage of slechte afwerking — plafond schilderen geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Ook bij oorzaken achter slijtage of slechte afwerking — plafond schilderen blijft de combinatie van onvoldoende voorstrijk, ondergrond niet egaal en verkeerde verfkeuze bepalend voor keuzes en tempo binnen schilderwerk.",
          "Wanneer oorzaken achter slijtage of slechte afwerking — plafond schilderen zorgvuldig wordt beoordeeld, kan een schilder gerichter plannen en de kans op snelle aantasting van hout en stucwerk terugdringen."
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
          "Hoe een schilder de ondergrond beoordeelt (plafond schilderen) — plafond schilderen maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Hoe een schilder de ondergrond beoordeelt (plafond schilderen) — plafond schilderen wordt inhoudelijk sterker zodra ondergrond reinigen en voorbereiden, lokale herstelpunten aanpakken en baangewijs afwerken voor egaal resultaat niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Wanneer hoe een schilder de ondergrond beoordeelt (plafond schilderen) — plafond schilderen zorgvuldig wordt beoordeeld, kan een schilder gerichter plannen en de kans op snelle aantasting van hout en stucwerk terugdringen."
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
          "Keuzes in afwerking en combinatie met ander onderhoud — plafond schilderen vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Punten zoals alleen plafond of combinatie met wand en standaard verf of vochtbestendige variant horen bij keuzes in afwerking en combinatie met ander onderhoud — plafond schilderen omdat ze veel zeggen over omvang, risico en benodigde stappen binnen schilderwerk.",
          "Een schilder kijkt bij keuzes in afwerking en combinatie met ander onderhoud — plafond schilderen meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en snelle aantasting van hout en stucwerk beperkt blijft."
        ],
        "bullets": [
          "alleen plafond of combinatie met wand",
          "standaard verf of vochtbestendige variant"
        ]
      },
      {
        "heading": "Zo maak je je aanvraag concreet en vergelijkbaar — plafond schilderen",
        "paragraphs": [
          "Bij zo maak je je aanvraag concreet en vergelijkbaar — plafond schilderen blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Elementen zoals toegang, huidige staat en technische randvoorwaarden maken zo maak je je aanvraag concreet en vergelijkbaar — plafond schilderen concreet en helpen om scope in schilderwerk af te bakenen.",
          "Bij zo maak je je aanvraag concreet en vergelijkbaar — plafond schilderen helpt een inhoudelijke beoordeling door een schilder om verkeerde prioriteiten en daarmee snelle aantasting van hout en stucwerk te voorkomen."
        ]
      },
      {
        "heading": "Wat er gebeurt als je onderhoud te lang uitstelt — plafond schilderen",
        "paragraphs": [
          "Voor wat er gebeurt als je onderhoud te lang uitstelt — plafond schilderen geldt dat kleine signalen vaak veel zeggen over het vervolg van de klus.",
          "Tijdens wat er gebeurt als je onderhoud te lang uitstelt — plafond schilderen geven toegang, huidige staat en technische randvoorwaarden richting aan materiaalkeuzes, werkvolgorde en planning in schilderwerk.",
          "In de praktijk bepaalt wat er gebeurt als je onderhoud te lang uitstelt — plafond schilderen vaak of een schilder met beperkt herstel uitkomt of een bredere oplossing adviseert om snelle aantasting van hout en stucwerk te vermijden."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe bij je aanvraag.",
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over plafond schilderen, locatie en planning.",
      "label": "Vraag plafond-schilderwerk aan",
      "secondaryLabel": "Terug naar schilder",
      "secondaryHref": "/schilder"
    }
  },
  "loodgieter/lekkage": {
    "path": "/loodgieter/lekkage",
    "title": "Loodgieter lekkage met VakConnect",
    "description": "Lekkage aan leiding, koppeling of sanitair? Lees hoe beoordeling en herstel doorgaans verlopen.",
    "keywords": [
      "loodgieter",
      "lekkage",
      "vakman",
      "VakConnect"
    ],
    "h1": "Loodgieter lekkage: vind een vakman met relevante ervaring via het platform",
    "intro": [
      "Zoek je hulp bij loodgieter lekkage? Via VakConnect kun je je situatie helder omschrijven en een gespecialiseerde vakman vinden.",
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
          "Van eerste lekkagesignaal naar gerichte diagnose geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Informatie over toegang, huidige staat en technische randvoorwaarden voorkomt ruis bij van eerste lekkagesignaal naar gerichte diagnose en maakt de aanpak binnen leiding- en afvoerwerk beter vergelijkbaar.",
          "Wie van eerste lekkagesignaal naar gerichte diagnose serieus laat beoordelen door een loodgieter, heeft meestal minder kans op onverwachte bijsturing en vochtproblemen in vloeren, muren of plafonds."
        ]
      },
      {
        "heading": "Signalen die duiden op een loodgietersprobleem — lekkage",
        "paragraphs": [
          "Rond signalen die duiden op een loodgietersprobleem — lekkage ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Bij signalen die duiden op een loodgietersprobleem — lekkage worden factoren als druppels bij koppelingen, vochtkringen in kast of wand, drukverlies en onverklaarbare vochtgeur meegewogen om keuzes in leiding- en afvoerwerk technisch te onderbouwen.",
          "Bij signalen die duiden op een loodgietersprobleem — lekkage helpt een inhoudelijke beoordeling door een loodgieter om verkeerde prioriteiten en daarmee vochtproblemen in vloeren, muren of plafonds te voorkomen."
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
          "Technische oorzaken die vaak terugkomen — lekkage voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Informatie over versleten koppelingen, haarscheur in leiding, slechte afdichting en oude appendages voorkomt ruis bij technische oorzaken die vaak terugkomen — lekkage en maakt de aanpak binnen leiding- en afvoerwerk beter vergelijkbaar.",
          "Wie technische oorzaken die vaak terugkomen — lekkage serieus laat beoordelen door een loodgieter, heeft meestal minder kans op onverwachte bijsturing en vochtproblemen in vloeren, muren of plafonds."
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
          "In diagnose en eerste aanpak door een loodgieter (lekkage) — lekkage zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Bij diagnose en eerste aanpak door een loodgieter (lekkage) — lekkage worden factoren als lekbron bepalen, tijdelijk beperken van schade, defect deel vervangen en controle op vervolgschade meegewogen om keuzes in leiding- en afvoerwerk technisch te onderbouwen.",
          "Een loodgieter kijkt bij diagnose en eerste aanpak door een loodgieter (lekkage) — lekkage meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en vochtproblemen in vloeren, muren of plafonds beperkt blijft."
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
          "Keuzes tussen noodoplossing en definitieve reparatie — lekkage is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Bij keuzes tussen noodoplossing en definitieve reparatie — lekkage vormen noodherstel gevolgd door definitief herstel, lokaal vervangen of groter leidingdeel vernieuwen en combinatie met sanitair- of renovatiewerk meestal de basis voor een realistische werkinschatting in leiding- en afvoerwerk.",
          "Een realistische keuze rond keuzes tussen noodoplossing en definitieve reparatie — lekkage ontstaat meestal pas nadat een loodgieter de samenhang heeft beoordeeld; dat voorkomt later vochtproblemen in vloeren, muren of plafonds."
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
          "Rond welke gegevens je direct moet aanleveren — lekkage ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Welke gegevens je direct moet aanleveren — lekkage wordt inhoudelijk sterker zodra toegang, huidige staat en technische randvoorwaarden niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Een realistische keuze rond welke gegevens je direct moet aanleveren — lekkage ontstaat meestal pas nadat een loodgieter de samenhang heeft beoordeeld; dat voorkomt later vochtproblemen in vloeren, muren of plafonds."
        ]
      },
      {
        "heading": "Risico bij uitstel van lekkage of verstopping — lekkage",
        "paragraphs": [
          "Risico bij uitstel van lekkage of verstopping — lekkage vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Elementen zoals toegang, huidige staat en technische randvoorwaarden maken risico bij uitstel van lekkage of verstopping — lekkage concreet en helpen om scope in leiding- en afvoerwerk af te bakenen.",
          "Een loodgieter kijkt bij risico bij uitstel van lekkage of verstopping — lekkage meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en vochtproblemen in vloeren, muren of plafonds beperkt blijft."
        ],
        "type": "warning"
      },
      {
        "heading": "Praktische planning en bereikbaarheid van leidingen — lekkage",
        "paragraphs": [
          "In het onderdeel praktische planning en bereikbaarheid van leidingen — lekkage worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Voor een bruikbare beoordeling van praktische planning en bereikbaarheid van leidingen — lekkage zijn toegang, huidige staat en technische randvoorwaarden vaak de kerngegevens binnen leiding- en afvoerwerk.",
          "In de praktijk bepaalt praktische planning en bereikbaarheid van leidingen — lekkage vaak of een loodgieter met beperkt herstel uitkomt of een bredere oplossing adviseert om vochtproblemen in vloeren, muren of plafonds te vermijden."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in de intake.",
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
        "answer": "Beperk indien mogelijk de watertoevoer en leg de situatie direct vast bij de intake."
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over lekkage, locatie en planning.",
      "label": "Plaats je lekkage-aanvraag",
      "secondaryLabel": "Terug naar loodgieter",
      "secondaryHref": "/loodgieter"
    }
  },
  "loodgieter/verstopping": {
    "path": "/loodgieter/verstopping",
    "title": "Verstopping op het platform",
    "description": "Hardnekkige verstopping? Ontdek oorzaken, diagnose en wat de omvang van de oplossing bepaalt.",
    "keywords": [
      "loodgieter",
      "verstopping",
      "vakman",
      "VakConnect"
    ],
    "h1": "Verstopping: vind een professional met vakkennis op VakConnect",
    "intro": [
      "Zoek je hulp bij verstopping? Op het platform kun je je situatie helder omschrijven en een geschikte vakman vinden.",
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
          "Verstoppingen ontstaan vaak door een combinatie van vet, zeepresten, haar, kalk en te weinig spoelstroom in de leiding.",
          "Bij oudere woningen spelen soms ook leidingvervorming, verzakking of onlogische bochten een rol.",
          "Daardoor kan dezelfde afvoer blijven terugvallen, zelfs na een snelle ontstopping."
        ]
      },
      {
        "heading": "Signalen die duiden op een loodgietersprobleem — verstopping",
        "paragraphs": [
          "Een loodgieter kijkt niet alleen naar het eindpunt, maar naar het hele traject vanaf toestel tot standleiding of buitenriolering.",
          "Zo wordt duidelijk of de oorzaak lokaal zit of structureel in de aanleg en helling van de leiding.",
          "Die diagnose bepaalt of reinigen volstaat of dat aanpassing van delen verstandiger is."
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
          "Uitstel vergroot het risico op overstroming, stankoverlast en gevolgschade aan kastwerk of vloeren.",
          "Vooral bij terugkerende klachten loont het om direct frequentie, gebruikte ruimtes en eerder herstel te vermelden in je aanvraag.",
          "Met die context kan de eerste aanpak gerichter worden ingepland."
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
          "Diagnose en eerste aanpak door een loodgieter (verstopping) — verstopping maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Bij diagnose en eerste aanpak door een loodgieter (verstopping) — verstopping worden factoren als vaststellen waar blokkade zit, mechanisch of met apparatuur vrijmaken, controleren op structurele oorzaak en nazicht van doorstroming meegewogen om keuzes in leiding- en afvoerwerk technisch te onderbouwen.",
          "Rond diagnose en eerste aanpak door een loodgieter (verstopping) — verstopping wordt vaak duidelijk dat goed voorwerk door een loodgieter later herstel voorkomt en vochtproblemen in vloeren, muren of plafonds reduceert."
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
          "Keuzes tussen noodoplossing en definitieve reparatie — verstopping voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Voor keuzes tussen noodoplossing en definitieve reparatie — verstopping zijn acute ontstopping of bredere inspectie, deeltraject vervangen bij terugkerende problemen en combinatie met afvoeroptimalisatie relevant; juist daaruit blijkt hoeveel werk in leiding- en afvoerwerk daadwerkelijk nodig is.",
          "Bij keuzes tussen noodoplossing en definitieve reparatie — verstopping helpt een inhoudelijke beoordeling door een loodgieter om verkeerde prioriteiten en daarmee vochtproblemen in vloeren, muren of plafonds te voorkomen."
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
          "In het onderdeel welke gegevens je direct moet aanleveren — verstopping worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Punten zoals toegang, huidige staat en technische randvoorwaarden horen bij welke gegevens je direct moet aanleveren — verstopping omdat ze veel zeggen over omvang, risico en benodigde stappen binnen leiding- en afvoerwerk.",
          "Een loodgieter kijkt bij welke gegevens je direct moet aanleveren — verstopping meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en vochtproblemen in vloeren, muren of plafonds beperkt blijft."
        ]
      },
      {
        "heading": "Risico bij uitstel van lekkage of verstopping — verstopping",
        "paragraphs": [
          "Risico bij uitstel van lekkage of verstopping — verstopping is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Punten zoals toegang, huidige staat en technische randvoorwaarden horen bij risico bij uitstel van lekkage of verstopping — verstopping omdat ze veel zeggen over omvang, risico en benodigde stappen binnen leiding- en afvoerwerk.",
          "Rond risico bij uitstel van lekkage of verstopping — verstopping wordt vaak duidelijk dat goed voorwerk door een loodgieter later herstel voorkomt en vochtproblemen in vloeren, muren of plafonds reduceert."
        ],
        "type": "warning"
      },
      {
        "heading": "Praktische planning en bereikbaarheid van leidingen — verstopping",
        "paragraphs": [
          "In het onderdeel praktische planning en bereikbaarheid van leidingen — verstopping worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Punten zoals toegang, huidige staat en technische randvoorwaarden horen bij praktische planning en bereikbaarheid van leidingen — verstopping omdat ze veel zeggen over omvang, risico en benodigde stappen binnen leiding- en afvoerwerk.",
          "Rond praktische planning en bereikbaarheid van leidingen — verstopping wordt vaak duidelijk dat goed voorwerk door een loodgieter later herstel voorkomt en vochtproblemen in vloeren, muren of plafonds reduceert."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe bij je aanvraag.",
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over verstopping, locatie en planning.",
      "label": "Start je verstoppingsaanvraag",
      "secondaryLabel": "Terug naar loodgieter",
      "secondaryHref": "/loodgieter"
    }
  },
  "loodgieter/leidingwerk": {
    "path": "/loodgieter/leidingwerk",
    "title": "Leidingwerk met VakConnect",
    "description": "Leidingwerk verleggen of vernieuwen? Lees waar je rekening mee houdt bij planning en uitvoering.",
    "keywords": [
      "loodgieter",
      "leidingwerk",
      "vakman",
      "VakConnect"
    ],
    "h1": "Leidingwerk: vind een vakman met relevante ervaring via het platform",
    "intro": [
      "Zoek je hulp bij leidingwerk? Op VakConnect kun je je situatie helder omschrijven en een gespecialiseerde vakman vinden.",
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
          "Rond wanneer leidingwerk in beeld komt ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Bij wanneer leidingwerk in beeld komt worden factoren als toegang, huidige staat en technische randvoorwaarden meegewogen om keuzes in leiding- en afvoerwerk technisch te onderbouwen.",
          "Voor wanneer leidingwerk in beeld komt loont een vroege technische check door een loodgieter, omdat je daarmee vochtproblemen in vloeren, muren of plafonds en onnodige herstelrondes beperkt."
        ]
      },
      {
        "heading": "Signalen die duiden op een loodgietersprobleem — leidingwerk",
        "paragraphs": [
          "Bij signalen die duiden op een loodgietersprobleem — leidingwerk blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Voor een bruikbare beoordeling van signalen die duiden op een loodgietersprobleem — leidingwerk zijn nieuwe keuken- of badkamerindeling, oude leidingen met storingen en druk- of temperatuurproblemen vaak de kerngegevens binnen leiding- en afvoerwerk.",
          "Juist in signalen die duiden op een loodgietersprobleem — leidingwerk kan een loodgieter onderscheid maken tussen tijdelijke verlichting en een aanpak die vochtproblemen in vloeren, muren of plafonds op langere termijn verkleint."
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
          "Technische oorzaken die vaak terugkomen — leidingwerk vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Punten zoals veroudering, onlogische routing en nieuwe functies in ruimte horen bij technische oorzaken die vaak terugkomen — leidingwerk omdat ze veel zeggen over omvang, risico en benodigde stappen binnen leiding- en afvoerwerk.",
          "Bij technische oorzaken die vaak terugkomen — leidingwerk helpt een inhoudelijke beoordeling door een loodgieter om verkeerde prioriteiten en daarmee vochtproblemen in vloeren, muren of plafonds te voorkomen."
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
          "Diagnose en eerste aanpak door een loodgieter (leidingwerk) — leidingwerk helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Diagnose en eerste aanpak door een loodgieter (leidingwerk) — leidingwerk wordt betrouwbaarder beoordeeld wanneer route en aansluitpunten bepalen, leidingen aanpassen of vervangen en druk en dichtheid testen expliciet worden meegenomen in het beeld van leiding- en afvoerwerk.",
          "Wie diagnose en eerste aanpak door een loodgieter (leidingwerk) — leidingwerk serieus laat beoordelen door een loodgieter, heeft meestal minder kans op onverwachte bijsturing en vochtproblemen in vloeren, muren of plafonds."
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
          "Keuzes tussen noodoplossing en definitieve reparatie — leidingwerk voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Ook bij keuzes tussen noodoplossing en definitieve reparatie — leidingwerk blijft de combinatie van gefaseerde uitvoering, open of weggewerkte route en combinatie met afbouw- of tegelwerk bepalend voor keuzes en tempo binnen leiding- en afvoerwerk.",
          "Bij keuzes tussen noodoplossing en definitieve reparatie — leidingwerk is het voordeel van een loodgieter vooral dat keuzes in uitvoering en timing meteen op vochtproblemen in vloeren, muren of plafonds worden getoetst."
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
          "In het onderdeel welke gegevens je direct moet aanleveren — leidingwerk worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Punten zoals toegang, huidige staat en technische randvoorwaarden horen bij welke gegevens je direct moet aanleveren — leidingwerk omdat ze veel zeggen over omvang, risico en benodigde stappen binnen leiding- en afvoerwerk.",
          "Een loodgieter kijkt bij welke gegevens je direct moet aanleveren — leidingwerk meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en vochtproblemen in vloeren, muren of plafonds beperkt blijft."
        ]
      },
      {
        "heading": "Risico bij uitstel van lekkage of verstopping — leidingwerk",
        "paragraphs": [
          "Risico bij uitstel van lekkage of verstopping — leidingwerk is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Bij risico bij uitstel van lekkage of verstopping — leidingwerk vormen toegang, huidige staat en technische randvoorwaarden meestal de basis voor een realistische werkinschatting in leiding- en afvoerwerk.",
          "Een realistische keuze rond risico bij uitstel van lekkage of verstopping — leidingwerk ontstaat meestal pas nadat een loodgieter de samenhang heeft beoordeeld; dat voorkomt later vochtproblemen in vloeren, muren of plafonds."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in de intake.",
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
        "answer": "Nee, je wordt gekoppeld aan een professional met vakkennis."
      }
    ],
    "cta": {
      "title": "Beschrijf je leidingwerk-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met concrete details over leidingwerk, locatie en planning.",
      "label": "Beschrijf je leidingwerkklus",
      "secondaryLabel": "Terug naar loodgieter",
      "secondaryHref": "/loodgieter"
    }
  },
  "loodgieter/sanitair": {
    "path": "/loodgieter/sanitair",
    "title": "Sanitair op het platform",
    "description": "Sanitair plaatsen of vervangen: ontdek welke voorbereiding en keuzes belangrijk zijn.",
    "keywords": [
      "loodgieter",
      "sanitair",
      "vakman",
      "VakConnect"
    ],
    "h1": "Sanitair: vind een geschikte vakman op VakConnect",
    "intro": [
      "Zoek je hulp bij sanitair? Met VakConnect kun je je situatie helder omschrijven en een vakman met relevante ervaring vinden.",
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
          "Dit onderdeel, wanneer sanitair in beeld komt, is belangrijk omdat hier de praktische haalbaarheid wordt bepaald.",
          "Voor wanneer sanitair in beeld komt zijn toegang, huidige staat en technische randvoorwaarden relevant; juist daaruit blijkt hoeveel werk in leiding- en afvoerwerk daadwerkelijk nodig is.",
          "Een loodgieter kijkt bij wanneer sanitair in beeld komt meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en vochtproblemen in vloeren, muren of plafonds beperkt blijft."
        ]
      },
      {
        "heading": "Signalen die duiden op een loodgietersprobleem — sanitair",
        "paragraphs": [
          "Voor signalen die duiden op een loodgietersprobleem — sanitair geldt dat kleine signalen vaak veel zeggen over het vervolg van de klus.",
          "Ook bij signalen die duiden op een loodgietersprobleem — sanitair blijft de combinatie van lekkende aansluiting, versleten sanitair en onpraktische opstelling bepalend voor keuzes en tempo binnen leiding- en afvoerwerk.",
          "Wanneer signalen die duiden op een loodgietersprobleem — sanitair zorgvuldig wordt beoordeeld, kan een loodgieter gerichter plannen en de kans op vochtproblemen in vloeren, muren of plafonds terugdringen."
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
          "Technische oorzaken die vaak terugkomen — sanitair helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Bij technische oorzaken die vaak terugkomen — sanitair worden factoren als slijtage, verouderde aansluitpunten en gewijzigde woonwensen meegewogen om keuzes in leiding- en afvoerwerk technisch te onderbouwen.",
          "Bij technische oorzaken die vaak terugkomen — sanitair helpt een inhoudelijke beoordeling door een loodgieter om verkeerde prioriteiten en daarmee vochtproblemen in vloeren, muren of plafonds te voorkomen."
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
          "Diagnose en eerste aanpak door een loodgieter (sanitair) — sanitair helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Diagnose en eerste aanpak door een loodgieter (sanitair) — sanitair wordt betrouwbaarder beoordeeld wanneer demontage en voorbereiding, nieuw sanitair aansluiten en afstellen en afdichten expliciet worden meegenomen in het beeld van leiding- en afvoerwerk.",
          "In de praktijk bepaalt diagnose en eerste aanpak door een loodgieter (sanitair) — sanitair vaak of een loodgieter met beperkt herstel uitkomt of een bredere oplossing adviseert om vochtproblemen in vloeren, muren of plafonds te vermijden."
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
          "Keuzes tussen noodoplossing en definitieve reparatie — sanitair voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Ook bij keuzes tussen noodoplossing en definitieve reparatie — sanitair blijft de combinatie van deelvervanging of compleet pakket, eigen producten aanleveren of advies volgen en combinatie met tegelwerk bepalend voor keuzes en tempo binnen leiding- en afvoerwerk.",
          "Een realistische keuze rond keuzes tussen noodoplossing en definitieve reparatie — sanitair ontstaat meestal pas nadat een loodgieter de samenhang heeft beoordeeld; dat voorkomt later vochtproblemen in vloeren, muren of plafonds."
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
          "Voor welke gegevens je direct moet aanleveren — sanitair geldt dat kleine signalen vaak veel zeggen over het vervolg van de klus.",
          "Informatie over toegang, huidige staat en technische randvoorwaarden voorkomt ruis bij welke gegevens je direct moet aanleveren — sanitair en maakt de aanpak binnen leiding- en afvoerwerk beter vergelijkbaar.",
          "In de praktijk bepaalt welke gegevens je direct moet aanleveren — sanitair vaak of een loodgieter met beperkt herstel uitkomt of een bredere oplossing adviseert om vochtproblemen in vloeren, muren of plafonds te vermijden."
        ]
      },
      {
        "heading": "Risico bij uitstel van lekkage of verstopping — sanitair",
        "paragraphs": [
          "Risico bij uitstel van lekkage of verstopping — sanitair voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Informatie over toegang, huidige staat en technische randvoorwaarden voorkomt ruis bij risico bij uitstel van lekkage of verstopping — sanitair en maakt de aanpak binnen leiding- en afvoerwerk beter vergelijkbaar.",
          "In de praktijk bepaalt risico bij uitstel van lekkage of verstopping — sanitair vaak of een loodgieter met beperkt herstel uitkomt of een bredere oplossing adviseert om vochtproblemen in vloeren, muren of plafonds te vermijden."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe bij de intake.",
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over sanitair, locatie en planning.",
      "label": "Start je sanitair-aanvraag",
      "secondaryLabel": "Terug naar loodgieter",
      "secondaryHref": "/loodgieter"
    }
  },
  "loodgieter/spoed": {
    "path": "/loodgieter/spoed",
    "title": "Spoed loodgieter met VakConnect",
    "description": "Spoedprobleem met water of afvoer? Lees wat je direct in je aanvraag moet zetten.",
    "keywords": [
      "loodgieter",
      "spoed",
      "vakman",
      "VakConnect"
    ],
    "h1": "Spoed loodgieter: vind een gespecialiseerde vakman via het platform",
    "intro": [
      "Zoek je hulp bij spoed loodgieter? Via VakConnect kun je je situatie helder omschrijven en een professional met vakkennis vinden.",
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
          "Rond wanneer spoed loodgieter in beeld komt ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Wanneer spoed loodgieter in beeld komt wordt inhoudelijk sterker zodra toegang, huidige staat en technische randvoorwaarden niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Bij wanneer spoed loodgieter in beeld komt is het voordeel van een loodgieter vooral dat keuzes in uitvoering en timing meteen op vochtproblemen in vloeren, muren of plafonds worden getoetst."
        ]
      },
      {
        "heading": "Signalen die duiden op een loodgietersprobleem — spoed",
        "paragraphs": [
          "Dit onderdeel, signalen die duiden op een loodgietersprobleem — spoed, is belangrijk omdat hier de praktische haalbaarheid wordt bepaald.",
          "Voor signalen die duiden op een loodgietersprobleem — spoed zijn actieve lekkage, volledige blokkade en snel oplopende waterschade relevant; juist daaruit blijkt hoeveel werk in leiding- en afvoerwerk daadwerkelijk nodig is.",
          "Voor signalen die duiden op een loodgietersprobleem — spoed loont een vroege technische check door een loodgieter, omdat je daarmee vochtproblemen in vloeren, muren of plafonds en onnodige herstelrondes beperkt."
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
          "Technische oorzaken die vaak terugkomen — spoed helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Bij technische oorzaken die vaak terugkomen — spoed worden factoren als gesprongen verbinding, acute verstopping en defect afsluitpunt meegewogen om keuzes in leiding- en afvoerwerk technisch te onderbouwen.",
          "Voor technische oorzaken die vaak terugkomen — spoed loont een vroege technische check door een loodgieter, omdat je daarmee vochtproblemen in vloeren, muren of plafonds en onnodige herstelrondes beperkt."
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
          "Diagnose en eerste aanpak door een loodgieter (spoed) — spoed geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Tijdens diagnose en eerste aanpak door een loodgieter (spoed) — spoed geven situatie veilig maken, snelle diagnose en noodmaatregel en vervolgplan richting aan materiaalkeuzes, werkvolgorde en planning in leiding- en afvoerwerk.",
          "Wie diagnose en eerste aanpak door een loodgieter (spoed) — spoed serieus laat beoordelen door een loodgieter, heeft meestal minder kans op onverwachte bijsturing en vochtproblemen in vloeren, muren of plafonds."
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
          "Keuzes tussen noodoplossing en definitieve reparatie — spoed voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Ook bij keuzes tussen noodoplossing en definitieve reparatie — spoed blijft de combinatie van tijdelijk beperken of direct definitief herstel en combineren met vervolginspectie bepalend voor keuzes en tempo binnen leiding- en afvoerwerk.",
          "Bij keuzes tussen noodoplossing en definitieve reparatie — spoed is het voordeel van een loodgieter vooral dat keuzes in uitvoering en timing meteen op vochtproblemen in vloeren, muren of plafonds worden getoetst."
        ],
        "bullets": [
          "tijdelijk beperken of direct definitief herstel",
          "combineren met vervolginspectie"
        ]
      },
      {
        "heading": "Welke gegevens je direct moet aanleveren — spoed",
        "paragraphs": [
          "Rond welke gegevens je direct moet aanleveren — spoed ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Welke gegevens je direct moet aanleveren — spoed wordt inhoudelijk sterker zodra toegang, huidige staat en technische randvoorwaarden niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Door welke gegevens je direct moet aanleveren — spoed vroeg te laten toetsen door een loodgieter worden vervolgstappen consistenter en blijft vochtproblemen in vloeren, muren of plafonds beter beheersbaar."
        ]
      },
      {
        "heading": "Risico bij uitstel van lekkage of verstopping — spoed",
        "paragraphs": [
          "Risico bij uitstel van lekkage of verstopping — spoed is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Elementen zoals toegang, huidige staat en technische randvoorwaarden maken risico bij uitstel van lekkage of verstopping — spoed concreet en helpen om scope in leiding- en afvoerwerk af te bakenen.",
          "Rond risico bij uitstel van lekkage of verstopping — spoed wordt vaak duidelijk dat goed voorwerk door een loodgieter later herstel voorkomt en vochtproblemen in vloeren, muren of plafonds reduceert."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe bij je aanvraag.",
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over spoed, locatie en planning.",
      "label": "Plaats een spoedaanvraag",
      "secondaryLabel": "Terug naar loodgieter",
      "secondaryHref": "/loodgieter"
    }
  },
  "loodgieter/afvoer": {
    "path": "/loodgieter/afvoer",
    "title": "Afvoer op het platform",
    "description": "Afvoerproblemen structureel aanpakken: van diagnose tot herstelopties.",
    "keywords": [
      "loodgieter",
      "afvoer",
      "vakman",
      "VakConnect"
    ],
    "h1": "Afvoer: vind een geschikte vakman op VakConnect",
    "intro": [
      "Zoek je hulp bij afvoer? Op het platform kun je je situatie helder omschrijven en een vakman met relevante ervaring vinden.",
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
          "In het onderdeel wanneer afvoer in beeld komt worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Bij wanneer afvoer in beeld komt vormen toegang, huidige staat en technische randvoorwaarden meestal de basis voor een realistische werkinschatting in leiding- en afvoerwerk.",
          "Bij wanneer afvoer in beeld komt is het voordeel van een loodgieter vooral dat keuzes in uitvoering en timing meteen op vochtproblemen in vloeren, muren of plafonds worden getoetst."
        ]
      },
      {
        "heading": "Signalen die duiden op een loodgietersprobleem — afvoer",
        "paragraphs": [
          "Dit onderdeel, signalen die duiden op een loodgietersprobleem — afvoer, is belangrijk omdat hier de praktische haalbaarheid wordt bepaald.",
          "Informatie over langzame afvoer, regelmatige geurhinder en terugkerende blokkades voorkomt ruis bij signalen die duiden op een loodgietersprobleem — afvoer en maakt de aanpak binnen leiding- en afvoerwerk beter vergelijkbaar.",
          "Als signalen die duiden op een loodgietersprobleem — afvoer te globaal wordt ingeschat, groeit de kans op misplanning; een loodgieter kan dat vroegtijdig bijsturen en vochtproblemen in vloeren, muren of plafonds helpen beperken."
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
          "Technische oorzaken die vaak terugkomen — afvoer helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Bij technische oorzaken die vaak terugkomen — afvoer worden factoren als ophoping, beperkte helling en lokale beschadiging meegewogen om keuzes in leiding- en afvoerwerk technisch te onderbouwen.",
          "Bij technische oorzaken die vaak terugkomen — afvoer helpt een inhoudelijke beoordeling door een loodgieter om verkeerde prioriteiten en daarmee vochtproblemen in vloeren, muren of plafonds te voorkomen."
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
          "Diagnose en eerste aanpak door een loodgieter (afvoer) — afvoer geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Ook bij diagnose en eerste aanpak door een loodgieter (afvoer) — afvoer blijft de combinatie van afvoertraject controleren, blokkades verwijderen en vervangingsadvies bij structurele gebreken bepalend voor keuzes en tempo binnen leiding- en afvoerwerk.",
          "Door diagnose en eerste aanpak door een loodgieter (afvoer) — afvoer vroeg te laten toetsen door een loodgieter worden vervolgstappen consistenter en blijft vochtproblemen in vloeren, muren of plafonds beter beheersbaar."
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
          "Keuzes tussen noodoplossing en definitieve reparatie — afvoer maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Keuzes tussen noodoplossing en definitieve reparatie — afvoer wordt inhoudelijk sterker zodra periodiek onderhoud, deelvervanging van traject en combinatie met verstoppingsanalyse niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Door keuzes tussen noodoplossing en definitieve reparatie — afvoer vroeg te laten toetsen door een loodgieter worden vervolgstappen consistenter en blijft vochtproblemen in vloeren, muren of plafonds beter beheersbaar."
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
          "Voor welke gegevens je direct moet aanleveren — afvoer geldt dat kleine signalen vaak veel zeggen over het vervolg van de klus.",
          "Voor welke gegevens je direct moet aanleveren — afvoer zijn toegang, huidige staat en technische randvoorwaarden relevant; juist daaruit blijkt hoeveel werk in leiding- en afvoerwerk daadwerkelijk nodig is.",
          "Voor welke gegevens je direct moet aanleveren — afvoer loont een vroege technische check door een loodgieter, omdat je daarmee vochtproblemen in vloeren, muren of plafonds en onnodige herstelrondes beperkt."
        ]
      },
      {
        "heading": "Risico bij uitstel van lekkage of verstopping — afvoer",
        "paragraphs": [
          "Risico bij uitstel van lekkage of verstopping — afvoer voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Informatie over toegang, huidige staat en technische randvoorwaarden voorkomt ruis bij risico bij uitstel van lekkage of verstopping — afvoer en maakt de aanpak binnen leiding- en afvoerwerk beter vergelijkbaar.",
          "In de praktijk bepaalt risico bij uitstel van lekkage of verstopping — afvoer vaak of een loodgieter met beperkt herstel uitkomt of een bredere oplossing adviseert om vochtproblemen in vloeren, muren of plafonds te vermijden."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in de intake.",
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over afvoer, locatie en planning.",
      "label": "Vraag hulp bij afvoerproblemen",
      "secondaryLabel": "Terug naar loodgieter",
      "secondaryHref": "/loodgieter"
    }
  },
  "elektricien/groepenkast": {
    "path": "/elektricien/groepenkast",
    "title": "Groepenkast met VakConnect",
    "description": "Groepenkast uitbreiden of vervangen? Lees wanneer dat nodig kan zijn en welke factoren de klus bepalen.",
    "keywords": [
      "elektricien",
      "groepenkast",
      "vakman",
      "VakConnect"
    ],
    "h1": "Groepenkast: vind een gespecialiseerde vakman via het platform",
    "intro": [
      "Zoek je hulp bij groepenkast? Op VakConnect kun je je situatie helder omschrijven en een professional met vakkennis vinden.",
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
          "Een groepenkast raakt vaak achterhaald wanneer het stroomverbruik in huis groeit door koken, laden, verwarmen of thuiswerken.",
          "Terugkerende uitval, warme componenten of beperkte ruimte voor extra groepen zijn signalen die je serieus moet nemen.",
          "De juiste oplossing hangt af van belasting, opbouw van de installatie en toekomstige uitbreidingswensen."
        ]
      },
      {
        "heading": "Klachten die vaak op elektra-issues wijzen — groepenkast",
        "paragraphs": [
          "Een elektricien beoordeelt of uitbreiden binnen de bestaande kast veilig kan of dat vervanging logischer is.",
          "Daarbij spelen verdeling van groepen, beveiligingen en de aansluiting (1-fase of 3-fase) een belangrijke rol.",
          "Het doel is een stabiele en overzichtelijke installatie die past bij het werkelijke gebruik."
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
          "Werk aan de groepenkast vraagt een professionele uitvoering; risicovolle doe-het-zelf stappen horen hier niet bij.",
          "Voor een goede intake helpt het om huidige situatie, storingsmomenten en geplande nieuwe apparaten te beschrijven.",
          "Zo kan vooraf beter worden ingeschat welke aanpassingen technisch en praktisch nodig zijn."
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
          "Veilige beoordeling door een elektricien (groepenkast) — groepenkast voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Informatie over belastingsprofiel beoordelen, uitbreiden of herindelen van groepen, beveiliging actualiseren en controle en test na aanpassing voorkomt ruis bij veilige beoordeling door een elektricien (groepenkast) — groepenkast en maakt de aanpak binnen elektrotechnisch werk beter vergelijkbaar.",
          "Als veilige beoordeling door een elektricien (groepenkast) — groepenkast te globaal wordt ingeschat, groeit de kans op misplanning; een elektricien kan dat vroegtijdig bijsturen en storingen of onveilige belasting helpen beperken."
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
          "In het onderdeel keuzes bij uitbreiding, vervanging of herverdeling — groepenkast worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Elementen zoals extra groepen bij bestaande kast, volledige vervanging bij beperkte basis en 1-fase of 3-fase passend bij toepassing maken keuzes bij uitbreiding, vervanging of herverdeling — groepenkast concreet en helpen om scope in elektrotechnisch werk af te bakenen.",
          "Een elektricien kijkt bij keuzes bij uitbreiding, vervanging of herverdeling — groepenkast meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en storingen of onveilige belasting beperkt blijft."
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
          "Welke info je nodig hebt voor een gerichte intake — groepenkast maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Bij welke info je nodig hebt voor een gerichte intake — groepenkast worden factoren als toegang, huidige staat en technische randvoorwaarden meegewogen om keuzes in elektrotechnisch werk technisch te onderbouwen.",
          "Voor welke info je nodig hebt voor een gerichte intake — groepenkast loont een vroege technische check door een elektricien, omdat je daarmee storingen of onveilige belasting en onnodige herstelrondes beperkt."
        ]
      },
      {
        "heading": "Waarom uitstel bij elektra risico’s vergroot — groepenkast",
        "paragraphs": [
          "Rond waarom uitstel bij elektra risico’s vergroot — groepenkast ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Wie waarom uitstel bij elektra risico’s vergroot — groepenkast goed wil laten inschatten, doet er verstandig aan factoren zoals toegang, huidige staat en technische randvoorwaarden direct te benoemen.",
          "Wanneer waarom uitstel bij elektra risico’s vergroot — groepenkast zorgvuldig wordt beoordeeld, kan een elektricien gerichter plannen en de kans op storingen of onveilige belasting terugdringen."
        ],
        "type": "warning"
      },
      {
        "heading": "Planning, stroomonderbreking en praktische uitvoering — groepenkast",
        "paragraphs": [
          "Planning, stroomonderbreking en praktische uitvoering — groepenkast vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Bij planning, stroomonderbreking en praktische uitvoering — groepenkast vormen toegang, huidige staat en technische randvoorwaarden meestal de basis voor een realistische werkinschatting in elektrotechnisch werk.",
          "Bij planning, stroomonderbreking en praktische uitvoering — groepenkast is het voordeel van een elektricien vooral dat keuzes in uitvoering en timing meteen op storingen of onveilige belasting worden getoetst."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe bij de intake.",
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over groepenkast, locatie en planning.",
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
    "title": "Elektra storing op het platform",
    "description": "Elektra storing? Vind op VakConnect een specialist voor veilige diagnose en herstel.",
    "keywords": [
      "elektricien",
      "storing",
      "vakman",
      "VakConnect"
    ],
    "h1": "Elektra storing: vind een geschikte vakman met VakConnect",
    "intro": [
      "Zoek je hulp bij elektra storing? Met VakConnect kun je je situatie helder omschrijven en een vakman met relevante ervaring vinden.",
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
          "Wanneer elektra storing in beeld komt helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Bij wanneer elektra storing in beeld komt worden factoren als toegang, huidige staat en technische randvoorwaarden meegewogen om keuzes in elektrotechnisch werk technisch te onderbouwen.",
          "Bij wanneer elektra storing in beeld komt helpt een inhoudelijke beoordeling door een elektricien om verkeerde prioriteiten en daarmee storingen of onveilige belasting te voorkomen."
        ]
      },
      {
        "heading": "Klachten die vaak op elektra-issues wijzen — storing",
        "paragraphs": [
          "Klachten die vaak op elektra-issues wijzen — storing geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Tijdens klachten die vaak op elektra-issues wijzen — storing geven uitvallende groep, flikkerend licht en gedeeltelijke stroomuitval richting aan materiaalkeuzes, werkvolgorde en planning in elektrotechnisch werk.",
          "Juist in klachten die vaak op elektra-issues wijzen — storing kan een elektricien onderscheid maken tussen tijdelijke verlichting en een aanpak die storingen of onveilige belasting op langere termijn verkleint."
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
          "Oorzaken achter storingen of capaciteitsproblemen — storing geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Ook bij oorzaken achter storingen of capaciteitsproblemen — storing blijft de combinatie van defect apparaat, bekabelingsprobleem en probleem in groepenkast bepalend voor keuzes en tempo binnen elektrotechnisch werk.",
          "Door oorzaken achter storingen of capaciteitsproblemen — storing vroeg te laten toetsen door een elektricien worden vervolgstappen consistenter en blijft storingen of onveilige belasting beter beheersbaar."
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
          "Voor veilige beoordeling door een elektricien (storing) — storing geldt dat kleine signalen vaak veel zeggen over het vervolg van de klus.",
          "Informatie over storingsbron isoleren, meten en controleren en defecten veilig herstellen voorkomt ruis bij veilige beoordeling door een elektricien (storing) — storing en maakt de aanpak binnen elektrotechnisch werk beter vergelijkbaar.",
          "Wie veilige beoordeling door een elektricien (storing) — storing serieus laat beoordelen door een elektricien, heeft meestal minder kans op onverwachte bijsturing en storingen of onveilige belasting."
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
          "Bij keuzes bij uitbreiding, vervanging of herverdeling — storing blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Punten zoals acute fout oplossen en oorzaakanalyse bij terugkerende storingen horen bij keuzes bij uitbreiding, vervanging of herverdeling — storing omdat ze veel zeggen over omvang, risico en benodigde stappen binnen elektrotechnisch werk.",
          "Rond keuzes bij uitbreiding, vervanging of herverdeling — storing wordt vaak duidelijk dat goed voorwerk door een elektricien later herstel voorkomt en storingen of onveilige belasting reduceert."
        ],
        "bullets": [
          "acute fout oplossen",
          "oorzaakanalyse bij terugkerende storingen"
        ]
      },
      {
        "heading": "Welke info je nodig hebt voor een gerichte intake — storing",
        "paragraphs": [
          "Welke info je nodig hebt voor een gerichte intake — storing geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Informatie over toegang, huidige staat en technische randvoorwaarden voorkomt ruis bij welke info je nodig hebt voor een gerichte intake — storing en maakt de aanpak binnen elektrotechnisch werk beter vergelijkbaar.",
          "In de praktijk bepaalt welke info je nodig hebt voor een gerichte intake — storing vaak of een elektricien met beperkt herstel uitkomt of een bredere oplossing adviseert om storingen of onveilige belasting te vermijden."
        ]
      },
      {
        "heading": "Waarom uitstel bij elektra risico’s vergroot — storing",
        "paragraphs": [
          "In waarom uitstel bij elektra risico’s vergroot — storing zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Waarom uitstel bij elektra risico’s vergroot — storing wordt inhoudelijk sterker zodra toegang, huidige staat en technische randvoorwaarden niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Door waarom uitstel bij elektra risico’s vergroot — storing vroeg te laten toetsen door een elektricien worden vervolgstappen consistenter en blijft storingen of onveilige belasting beter beheersbaar."
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over storing, locatie en planning.",
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
    "title": "Stopcontacten via het platform",
    "description": "Meer of beter geplaatste stopcontacten nodig? Lees waar je op moet letten.",
    "keywords": [
      "elektricien",
      "stopcontacten",
      "vakman",
      "VakConnect"
    ],
    "h1": "Stopcontacten: vind een gespecialiseerde vakman op het platform",
    "intro": [
      "Zoek je hulp bij stopcontacten? Via VakConnect kun je je situatie helder omschrijven en een professional met vakkennis vinden.",
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
          "Wanneer stopcontacten in beeld komt helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Wanneer stopcontacten in beeld komt wordt betrouwbaarder beoordeeld wanneer toegang, huidige staat en technische randvoorwaarden expliciet worden meegenomen in het beeld van elektrotechnisch werk.",
          "In de praktijk bepaalt wanneer stopcontacten in beeld komt vaak of een elektricien met beperkt herstel uitkomt of een bredere oplossing adviseert om storingen of onveilige belasting te vermijden."
        ]
      },
      {
        "heading": "Klachten die vaak op elektra-issues wijzen — stopcontacten",
        "paragraphs": [
          "Klachten die vaak op elektra-issues wijzen — stopcontacten geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Tijdens klachten die vaak op elektra-issues wijzen — stopcontacten geven te weinig stopcontacten, veel verlengsnoeren en loszittende aansluitpunten richting aan materiaalkeuzes, werkvolgorde en planning in elektrotechnisch werk.",
          "Als klachten die vaak op elektra-issues wijzen — stopcontacten te globaal wordt ingeschat, groeit de kans op misplanning; een elektricien kan dat vroegtijdig bijsturen en storingen of onveilige belasting helpen beperken."
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
          "Oorzaken achter storingen of capaciteitsproblemen — stopcontacten is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Voor een bruikbare beoordeling van oorzaken achter storingen of capaciteitsproblemen — stopcontacten zijn gewijzigde ruimte-indeling, meer apparatuur en verouderde installatie vaak de kerngegevens binnen elektrotechnisch werk.",
          "Juist in oorzaken achter storingen of capaciteitsproblemen — stopcontacten kan een elektricien onderscheid maken tussen tijdelijke verlichting en een aanpak die storingen of onveilige belasting op langere termijn verkleint."
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
          "Veilige beoordeling door een elektricien (stopcontacten) — stopcontacten voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Ook bij veilige beoordeling door een elektricien (stopcontacten) — stopcontacten blijft de combinatie van locaties bepalen, bekabeling veilig aanleggen en aansluitpunten testen bepalend voor keuzes en tempo binnen elektrotechnisch werk.",
          "Wanneer veilige beoordeling door een elektricien (stopcontacten) — stopcontacten zorgvuldig wordt beoordeeld, kan een elektricien gerichter plannen en de kans op storingen of onveilige belasting terugdringen."
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
          "Bij keuzes bij uitbreiding, vervanging of herverdeling — stopcontacten blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Punten zoals opbouw of inbouw, enkele ruimte of woningbreed en voorbereiding op toekomstig gebruik horen bij keuzes bij uitbreiding, vervanging of herverdeling — stopcontacten omdat ze veel zeggen over omvang, risico en benodigde stappen binnen elektrotechnisch werk.",
          "Bij keuzes bij uitbreiding, vervanging of herverdeling — stopcontacten helpt een inhoudelijke beoordeling door een elektricien om verkeerde prioriteiten en daarmee storingen of onveilige belasting te voorkomen."
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
          "Welke info je nodig hebt voor een gerichte intake — stopcontacten maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Welke info je nodig hebt voor een gerichte intake — stopcontacten wordt betrouwbaarder beoordeeld wanneer toegang, huidige staat en technische randvoorwaarden expliciet worden meegenomen in het beeld van elektrotechnisch werk.",
          "In de praktijk bepaalt welke info je nodig hebt voor een gerichte intake — stopcontacten vaak of een elektricien met beperkt herstel uitkomt of een bredere oplossing adviseert om storingen of onveilige belasting te vermijden."
        ]
      },
      {
        "heading": "Waarom uitstel bij elektra risico’s vergroot — stopcontacten",
        "paragraphs": [
          "Bij waarom uitstel bij elektra risico’s vergroot — stopcontacten blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Punten zoals toegang, huidige staat en technische randvoorwaarden horen bij waarom uitstel bij elektra risico’s vergroot — stopcontacten omdat ze veel zeggen over omvang, risico en benodigde stappen binnen elektrotechnisch werk.",
          "Voor waarom uitstel bij elektra risico’s vergroot — stopcontacten loont een vroege technische check door een elektricien, omdat je daarmee storingen of onveilige belasting en onnodige herstelrondes beperkt."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe bij je aanvraag.",
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over stopcontacten, locatie en planning.",
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
    "title": "Verlichting op VakConnect",
    "description": "Verlichting laten aanleggen of vernieuwen met veilige en logische aansluitingen.",
    "keywords": [
      "elektricien",
      "verlichting",
      "vakman",
      "VakConnect"
    ],
    "h1": "Verlichting: vind een geschikte vakman met VakConnect",
    "intro": [
      "Zoek je hulp bij verlichting? Op het platform kun je je situatie helder omschrijven en een vakman met relevante ervaring vinden.",
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
          "Wanneer verlichting in beeld komt helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Wanneer verlichting in beeld komt wordt inhoudelijk sterker zodra toegang, huidige staat en technische randvoorwaarden niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Een realistische keuze rond wanneer verlichting in beeld komt ontstaat meestal pas nadat een elektricien de samenhang heeft beoordeeld; dat voorkomt later storingen of onveilige belasting."
        ]
      },
      {
        "heading": "Klachten die vaak op elektra-issues wijzen — verlichting",
        "paragraphs": [
          "Klachten die vaak op elektra-issues wijzen — verlichting helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Wie klachten die vaak op elektra-issues wijzen — verlichting goed wil laten inschatten, doet er verstandig aan factoren zoals onvoldoende lichtpunten, onpraktische schakeling en oude armaturen direct te benoemen.",
          "Een realistische keuze rond klachten die vaak op elektra-issues wijzen — verlichting ontstaat meestal pas nadat een elektricien de samenhang heeft beoordeeld; dat voorkomt later storingen of onveilige belasting."
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
          "Oorzaken achter storingen of capaciteitsproblemen — verlichting is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Elementen zoals verouderde installatie, gewijzigde indeling en defecte componenten maken oorzaken achter storingen of capaciteitsproblemen — verlichting concreet en helpen om scope in elektrotechnisch werk af te bakenen.",
          "Een elektricien kijkt bij oorzaken achter storingen of capaciteitsproblemen — verlichting meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en storingen of onveilige belasting beperkt blijft."
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
          "Veilige beoordeling door een elektricien (verlichting) — verlichting maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Wie veilige beoordeling door een elektricien (verlichting) — verlichting goed wil laten inschatten, doet er verstandig aan factoren zoals lichtpunten bepalen, aansluitingen en schakeling realiseren en testen en afwerken direct te benoemen.",
          "Bij veilige beoordeling door een elektricien (verlichting) — verlichting is het voordeel van een elektricien vooral dat keuzes in uitvoering en timing meteen op storingen of onveilige belasting worden getoetst."
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
          "In keuzes bij uitbreiding, vervanging of herverdeling — verlichting zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Keuzes bij uitbreiding, vervanging of herverdeling — verlichting wordt inhoudelijk sterker zodra functioneel of sfeergericht lichtplan, binnen en buiten combineren en dimmers en zones niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Bij keuzes bij uitbreiding, vervanging of herverdeling — verlichting is het voordeel van een elektricien vooral dat keuzes in uitvoering en timing meteen op storingen of onveilige belasting worden getoetst."
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
          "Welke info je nodig hebt voor een gerichte intake — verlichting voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Tijdens welke info je nodig hebt voor een gerichte intake — verlichting geven toegang, huidige staat en technische randvoorwaarden richting aan materiaalkeuzes, werkvolgorde en planning in elektrotechnisch werk.",
          "Wie welke info je nodig hebt voor een gerichte intake — verlichting serieus laat beoordelen door een elektricien, heeft meestal minder kans op onverwachte bijsturing en storingen of onveilige belasting."
        ]
      },
      {
        "heading": "Waarom uitstel bij elektra risico’s vergroot — verlichting",
        "paragraphs": [
          "Bij waarom uitstel bij elektra risico’s vergroot — verlichting blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Punten zoals toegang, huidige staat en technische randvoorwaarden horen bij waarom uitstel bij elektra risico’s vergroot — verlichting omdat ze veel zeggen over omvang, risico en benodigde stappen binnen elektrotechnisch werk.",
          "Voor waarom uitstel bij elektra risico’s vergroot — verlichting loont een vroege technische check door een elektricien, omdat je daarmee storingen of onveilige belasting en onnodige herstelrondes beperkt."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in de intake.",
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over verlichting, locatie en planning.",
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
    "title": "Krachtstroom via het platform",
    "description": "Krachtstroom nodig voor zwaardere apparatuur? Lees welke voorbereiding en checks belangrijk zijn.",
    "keywords": [
      "elektricien",
      "krachtstroom",
      "vakman",
      "VakConnect"
    ],
    "h1": "Krachtstroom: vind een gespecialiseerde vakman op het platform",
    "intro": [
      "Zoek je hulp bij krachtstroom? Op VakConnect kun je je situatie helder omschrijven en een professional met vakkennis vinden.",
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
          "Wanneer krachtstroom in beeld komt voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Informatie over toegang, huidige staat en technische randvoorwaarden voorkomt ruis bij wanneer krachtstroom in beeld komt en maakt de aanpak binnen elektrotechnisch werk beter vergelijkbaar.",
          "Als wanneer krachtstroom in beeld komt te globaal wordt ingeschat, groeit de kans op misplanning; een elektricien kan dat vroegtijdig bijsturen en storingen of onveilige belasting helpen beperken."
        ]
      },
      {
        "heading": "Klachten die vaak op elektra-issues wijzen — krachtstroom",
        "paragraphs": [
          "Klachten die vaak op elektra-issues wijzen — krachtstroom voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Ook bij klachten die vaak op elektra-issues wijzen — krachtstroom blijft de combinatie van nieuwe apparatuur met hogere vermogensvraag, beperkte huidige aansluiting en plannen voor werkplaats of zwaardere keukenapparatuur bepalend voor keuzes en tempo binnen elektrotechnisch werk.",
          "Bij klachten die vaak op elektra-issues wijzen — krachtstroom is het voordeel van een elektricien vooral dat keuzes in uitvoering en timing meteen op storingen of onveilige belasting worden getoetst."
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
          "Oorzaken achter storingen of capaciteitsproblemen — krachtstroom vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Punten zoals groeiende stroomvraag, onvoldoende bestaande verdeling en ontbrekende geschikte bekabeling horen bij oorzaken achter storingen of capaciteitsproblemen — krachtstroom omdat ze veel zeggen over omvang, risico en benodigde stappen binnen elektrotechnisch werk.",
          "Bij oorzaken achter storingen of capaciteitsproblemen — krachtstroom helpt een inhoudelijke beoordeling door een elektricien om verkeerde prioriteiten en daarmee storingen of onveilige belasting te voorkomen."
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
          "Veilige beoordeling door een elektricien (krachtstroom) — krachtstroom helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Veilige beoordeling door een elektricien (krachtstroom) — krachtstroom wordt betrouwbaarder beoordeeld wanneer aansluitvoorwaarden controleren, groep en bekabeling realiseren en veiligheid en werking testen expliciet worden meegenomen in het beeld van elektrotechnisch werk.",
          "In de praktijk bepaalt veilige beoordeling door een elektricien (krachtstroom) — krachtstroom vaak of een elektricien met beperkt herstel uitkomt of een bredere oplossing adviseert om storingen of onveilige belasting te vermijden."
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
          "Rond keuzes bij uitbreiding, vervanging of herverdeling — krachtstroom ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Keuzes bij uitbreiding, vervanging of herverdeling — krachtstroom wordt betrouwbaarder beoordeeld wanneer volledige voorbereiding of gefaseerde uitbreiding en combinatie met groepenkastaanpassing expliciet worden meegenomen in het beeld van elektrotechnisch werk.",
          "Als keuzes bij uitbreiding, vervanging of herverdeling — krachtstroom te globaal wordt ingeschat, groeit de kans op misplanning; een elektricien kan dat vroegtijdig bijsturen en storingen of onveilige belasting helpen beperken."
        ],
        "bullets": [
          "volledige voorbereiding of gefaseerde uitbreiding",
          "combinatie met groepenkastaanpassing"
        ]
      },
      {
        "heading": "Welke info je nodig hebt voor een gerichte intake — krachtstroom",
        "paragraphs": [
          "Welke info je nodig hebt voor een gerichte intake — krachtstroom helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Welke info je nodig hebt voor een gerichte intake — krachtstroom wordt betrouwbaarder beoordeeld wanneer toegang, huidige staat en technische randvoorwaarden expliciet worden meegenomen in het beeld van elektrotechnisch werk.",
          "Wie welke info je nodig hebt voor een gerichte intake — krachtstroom serieus laat beoordelen door een elektricien, heeft meestal minder kans op onverwachte bijsturing en storingen of onveilige belasting."
        ]
      },
      {
        "heading": "Waarom uitstel bij elektra risico’s vergroot — krachtstroom",
        "paragraphs": [
          "Voor waarom uitstel bij elektra risico’s vergroot — krachtstroom geldt dat kleine signalen vaak veel zeggen over het vervolg van de klus.",
          "Ook bij waarom uitstel bij elektra risico’s vergroot — krachtstroom blijft de combinatie van toegang, huidige staat en technische randvoorwaarden bepalend voor keuzes en tempo binnen elektrotechnisch werk.",
          "Door waarom uitstel bij elektra risico’s vergroot — krachtstroom vroeg te laten toetsen door een elektricien worden vervolgstappen consistenter en blijft storingen of onveilige belasting beter beheersbaar."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe bij de intake.",
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over krachtstroom, locatie en planning.",
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
    "title": "Kunststof kozijnen op VakConnect",
    "description": "Kunststof kozijnen vergelijken? Lees over profielen, glas, onderhoud en montage.",
    "keywords": [
      "kozijnen",
      "kunststof-kozijnen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Kunststof kozijnen: vind een geschikte vakman met VakConnect",
    "intro": [
      "Zoek je hulp bij kunststof kozijnen? Met VakConnect kun je je situatie helder omschrijven en een vakman met relevante ervaring vinden.",
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
          "Kunststof kozijnen worden vaak gekozen vanwege beperkte onderhoudsbehoefte en stabiele prestaties in wisselende weersomstandigheden.",
          "Toch verschillen profielen, versterkingen, beslag en afwerking sterk per situatie.",
          "Daarom is het belangrijk om niet alleen op uiterlijk of prijs per element te sturen."
        ]
      },
      {
        "heading": "Signalen dat kozijnen of aansluitingen aandacht vragen — kunststof kozijnen",
        "paragraphs": [
          "De combinatie van kozijnprofiel en glastype bepaalt een groot deel van isolatie, comfort en geluidwering.",
          "Ook aansluitdetails op gevel en afwerking aan de binnenzijde hebben invloed op tocht en condensgedrag.",
          "Een goede beoordeling kijkt dus naar het geheel, niet naar losse onderdelen."
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
          "Vervangen is vaak logisch bij structurele slijtage of blijvende tochtklachten; herstel kan volstaan bij lokaal beslag- of afstelwerk.",
          "Vraag in je intake ook naar gewenste uitstraling, ventilatievoorzieningen en type draaiende delen.",
          "Met die informatie wordt de eerste selectie van professionals inhoudelijk sterker."
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
          "In het onderdeel wat een kozijnspecialist doorgaans beoordeelt (kunststof kozijnen) — kunststof kozijnen worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Punten zoals inmeten en profielkeuze, oude kozijnen vervangen en aansluitingen en afwerking controleren horen bij wat een kozijnspecialist doorgaans beoordeelt (kunststof kozijnen) — kunststof kozijnen omdat ze veel zeggen over omvang, risico en benodigde stappen binnen kozijnwerk.",
          "Een kozijnspecialist kijkt bij wat een kozijnspecialist doorgaans beoordeelt (kunststof kozijnen) — kunststof kozijnen meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en tocht, condens en versnelde slijtage beperkt blijft."
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
          "In keuzes in materiaal, herstel en vervanging — kunststof kozijnen zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Keuzes in materiaal, herstel en vervanging — kunststof kozijnen wordt inhoudelijk sterker zodra kleur en profielstijl, glasopties afhankelijk van comfortwens en gefaseerde vervanging niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Door keuzes in materiaal, herstel en vervanging — kunststof kozijnen vroeg te laten toetsen door een kozijnspecialist worden vervolgstappen consistenter en blijft tocht, condens en versnelde slijtage beter beheersbaar."
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
          "Welke gegevens je aanvraag echt sterker maken — kunststof kozijnen voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Tijdens welke gegevens je aanvraag echt sterker maken — kunststof kozijnen geven toegang, huidige staat en technische randvoorwaarden richting aan materiaalkeuzes, werkvolgorde en planning in kozijnwerk.",
          "Juist in welke gegevens je aanvraag echt sterker maken — kunststof kozijnen kan een kozijnspecialist onderscheid maken tussen tijdelijke verlichting en een aanpak die tocht, condens en versnelde slijtage op langere termijn verkleint."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en onderhoudskosten — kunststof kozijnen",
        "paragraphs": [
          "Wat uitstel betekent voor comfort en onderhoudskosten — kunststof kozijnen is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Bij wat uitstel betekent voor comfort en onderhoudskosten — kunststof kozijnen vormen toegang, huidige staat en technische randvoorwaarden meestal de basis voor een realistische werkinschatting in kozijnwerk.",
          "Een realistische keuze rond wat uitstel betekent voor comfort en onderhoudskosten — kunststof kozijnen ontstaat meestal pas nadat een kozijnspecialist de samenhang heeft beoordeeld; dat voorkomt later tocht, condens en versnelde slijtage."
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over kunststof kozijnen, locatie en planning.",
      "label": "Start je aanvraag voor kunststof kozijnen",
      "secondaryLabel": "Terug naar kozijnen",
      "secondaryHref": "/kozijnen"
    }
  },
  "kozijnen/houten-kozijnen": {
    "path": "/kozijnen/houten-kozijnen",
    "title": "Houten kozijnen via het platform",
    "description": "Houten kozijnen laten herstellen of vervangen met oog voor uitstraling en onderhoud.",
    "keywords": [
      "kozijnen",
      "houten-kozijnen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Houten kozijnen: vind een gespecialiseerde vakman op het platform",
    "intro": [
      "Zoek je hulp bij houten kozijnen? Via VakConnect kun je je situatie helder omschrijven en een professional met vakkennis vinden.",
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
          "Wanneer houten kozijnen in beeld komt vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Voor een bruikbare beoordeling van wanneer houten kozijnen in beeld komt zijn toegang, huidige staat en technische randvoorwaarden vaak de kerngegevens binnen kozijnwerk.",
          "Wie wanneer houten kozijnen in beeld komt serieus laat beoordelen door een kozijnspecialist, heeft meestal minder kans op onverwachte bijsturing en tocht, condens en versnelde slijtage."
        ]
      },
      {
        "heading": "Signalen dat kozijnen of aansluitingen aandacht vragen — houten kozijnen",
        "paragraphs": [
          "Signalen dat kozijnen of aansluitingen aandacht vragen — houten kozijnen maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Bij signalen dat kozijnen of aansluitingen aandacht vragen — houten kozijnen worden factoren als bladderende verf, zachte houtdelen en klemmen van ramen meegewogen om keuzes in kozijnwerk technisch te onderbouwen.",
          "Voor signalen dat kozijnen of aansluitingen aandacht vragen — houten kozijnen loont een vroege technische check door een kozijnspecialist, omdat je daarmee tocht, condens en versnelde slijtage en onnodige herstelrondes beperkt."
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
          "Mogelijke oorzaken van tocht, slijtage of klemmen — houten kozijnen geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Ook bij mogelijke oorzaken van tocht, slijtage of klemmen — houten kozijnen blijft de combinatie van vochtbelasting, uitgesteld onderhoud en verouderde detaillering bepalend voor keuzes en tempo binnen kozijnwerk.",
          "Een realistische keuze rond mogelijke oorzaken van tocht, slijtage of klemmen — houten kozijnen ontstaat meestal pas nadat een kozijnspecialist de samenhang heeft beoordeeld; dat voorkomt later tocht, condens en versnelde slijtage."
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
          "In het onderdeel wat een kozijnspecialist doorgaans beoordeelt (houten kozijnen) — houten kozijnen worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Bij wat een kozijnspecialist doorgaans beoordeelt (houten kozijnen) — houten kozijnen vormen conditie beoordelen, lokale herstel- of vervangingskeuze en afwerken en beschermen meestal de basis voor een realistische werkinschatting in kozijnwerk.",
          "Bij wat een kozijnspecialist doorgaans beoordeelt (houten kozijnen) — houten kozijnen is het voordeel van een kozijnspecialist vooral dat keuzes in uitvoering en timing meteen op tocht, condens en versnelde slijtage worden getoetst."
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
          "In keuzes in materiaal, herstel en vervanging — houten kozijnen zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Bij keuzes in materiaal, herstel en vervanging — houten kozijnen worden factoren als herstellen of vervangen, combinatie met schilderwerk en fasering per gevel meegewogen om keuzes in kozijnwerk technisch te onderbouwen.",
          "Bij keuzes in materiaal, herstel en vervanging — houten kozijnen helpt een inhoudelijke beoordeling door een kozijnspecialist om verkeerde prioriteiten en daarmee tocht, condens en versnelde slijtage te voorkomen."
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
          "Welke gegevens je aanvraag echt sterker maken — houten kozijnen maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Welke gegevens je aanvraag echt sterker maken — houten kozijnen wordt inhoudelijk sterker zodra toegang, huidige staat en technische randvoorwaarden niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Bij welke gegevens je aanvraag echt sterker maken — houten kozijnen is het voordeel van een kozijnspecialist vooral dat keuzes in uitvoering en timing meteen op tocht, condens en versnelde slijtage worden getoetst."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en onderhoudskosten — houten kozijnen",
        "paragraphs": [
          "Wat uitstel betekent voor comfort en onderhoudskosten — houten kozijnen maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Wie wat uitstel betekent voor comfort en onderhoudskosten — houten kozijnen goed wil laten inschatten, doet er verstandig aan factoren zoals toegang, huidige staat en technische randvoorwaarden direct te benoemen.",
          "Een realistische keuze rond wat uitstel betekent voor comfort en onderhoudskosten — houten kozijnen ontstaat meestal pas nadat een kozijnspecialist de samenhang heeft beoordeeld; dat voorkomt later tocht, condens en versnelde slijtage."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe bij je aanvraag.",
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over houten kozijnen, locatie en planning.",
      "label": "Vraag hulp voor houten kozijnen",
      "secondaryLabel": "Terug naar kozijnen",
      "secondaryHref": "/kozijnen"
    }
  },
  "kozijnen/aluminium-kozijnen": {
    "path": "/kozijnen/aluminium-kozijnen",
    "title": "Aluminium kozijnen op VakConnect",
    "description": "Aluminium kozijnen kiezen? Lees wanneer dit materiaal past bij jouw wensen en woning.",
    "keywords": [
      "kozijnen",
      "aluminium-kozijnen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Aluminium kozijnen: vind een geschikte vakman met VakConnect",
    "intro": [
      "Zoek je hulp bij aluminium kozijnen? Op het platform kun je je situatie helder omschrijven en een vakman met relevante ervaring vinden.",
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
          "Wanneer aluminium kozijnen in beeld komt helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Wanneer aluminium kozijnen in beeld komt wordt betrouwbaarder beoordeeld wanneer toegang, huidige staat en technische randvoorwaarden expliciet worden meegenomen in het beeld van kozijnwerk.",
          "In de praktijk bepaalt wanneer aluminium kozijnen in beeld komt vaak of een kozijnspecialist met beperkt herstel uitkomt of een bredere oplossing adviseert om tocht, condens en versnelde slijtage te vermijden."
        ]
      },
      {
        "heading": "Signalen dat kozijnen of aansluitingen aandacht vragen — aluminium kozijnen",
        "paragraphs": [
          "Signalen dat kozijnen of aansluitingen aandacht vragen — aluminium kozijnen voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Tijdens signalen dat kozijnen of aansluitingen aandacht vragen — aluminium kozijnen geven wens voor slanke uitstraling, vervanging van verouderde kozijnen en grotere glasopeningen richting aan materiaalkeuzes, werkvolgorde en planning in kozijnwerk.",
          "In de praktijk bepaalt signalen dat kozijnen of aansluitingen aandacht vragen — aluminium kozijnen vaak of een kozijnspecialist met beperkt herstel uitkomt of een bredere oplossing adviseert om tocht, condens en versnelde slijtage te vermijden."
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
          "Mogelijke oorzaken van tocht, slijtage of klemmen — aluminium kozijnen geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Informatie over esthetische vernieuwing, comfortverbetering en technische veroudering van oude kozijnen voorkomt ruis bij mogelijke oorzaken van tocht, slijtage of klemmen — aluminium kozijnen en maakt de aanpak binnen kozijnwerk beter vergelijkbaar.",
          "Wie mogelijke oorzaken van tocht, slijtage of klemmen — aluminium kozijnen serieus laat beoordelen door een kozijnspecialist, heeft meestal minder kans op onverwachte bijsturing en tocht, condens en versnelde slijtage."
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
          "Dit onderdeel, wat een kozijnspecialist doorgaans beoordeelt (aluminium kozijnen) — aluminium kozijnen, is belangrijk omdat hier de praktische haalbaarheid wordt bepaald.",
          "Informatie over systeem en profiel kiezen, inmeten en plaatsen en afstellen en afdichten voorkomt ruis bij wat een kozijnspecialist doorgaans beoordeelt (aluminium kozijnen) — aluminium kozijnen en maakt de aanpak binnen kozijnwerk beter vergelijkbaar.",
          "In de praktijk bepaalt wat een kozijnspecialist doorgaans beoordeelt (aluminium kozijnen) — aluminium kozijnen vaak of een kozijnspecialist met beperkt herstel uitkomt of een bredere oplossing adviseert om tocht, condens en versnelde slijtage te vermijden."
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
          "Dit onderdeel, keuzes in materiaal, herstel en vervanging — aluminium kozijnen, is belangrijk omdat hier de praktische haalbaarheid wordt bepaald.",
          "Voor keuzes in materiaal, herstel en vervanging — aluminium kozijnen zijn kleur en afwerking, glascombinaties en gefaseerde uitvoering relevant; juist daaruit blijkt hoeveel werk in kozijnwerk daadwerkelijk nodig is.",
          "Een kozijnspecialist kijkt bij keuzes in materiaal, herstel en vervanging — aluminium kozijnen meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en tocht, condens en versnelde slijtage beperkt blijft."
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
          "Welke gegevens je aanvraag echt sterker maken — aluminium kozijnen voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Tijdens welke gegevens je aanvraag echt sterker maken — aluminium kozijnen geven toegang, huidige staat en technische randvoorwaarden richting aan materiaalkeuzes, werkvolgorde en planning in kozijnwerk.",
          "Juist in welke gegevens je aanvraag echt sterker maken — aluminium kozijnen kan een kozijnspecialist onderscheid maken tussen tijdelijke verlichting en een aanpak die tocht, condens en versnelde slijtage op langere termijn verkleint."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en onderhoudskosten — aluminium kozijnen",
        "paragraphs": [
          "Wat uitstel betekent voor comfort en onderhoudskosten — aluminium kozijnen voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Voor wat uitstel betekent voor comfort en onderhoudskosten — aluminium kozijnen zijn toegang, huidige staat en technische randvoorwaarden relevant; juist daaruit blijkt hoeveel werk in kozijnwerk daadwerkelijk nodig is.",
          "Rond wat uitstel betekent voor comfort en onderhoudskosten — aluminium kozijnen wordt vaak duidelijk dat goed voorwerk door een kozijnspecialist later herstel voorkomt en tocht, condens en versnelde slijtage reduceert."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in de intake.",
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
        "answer": "Nee, VakConnect koppelt je aan een gespecialiseerde vakman."
      }
    ],
    "cta": {
      "title": "Beschrijf je aluminium kozijnen-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met concrete details over aluminium kozijnen, locatie en planning.",
      "label": "Vind een specialist voor aluminium kozijnen",
      "secondaryLabel": "Terug naar kozijnen",
      "secondaryHref": "/kozijnen"
    }
  },
  "kozijnen/kozijnen-vervangen": {
    "path": "/kozijnen/kozijnen-vervangen",
    "title": "Kozijnen vervangen via het platform",
    "description": "Wanneer kozijnen vervangen en niet meer repareren? Lees de belangrijkste afwegingen.",
    "keywords": [
      "kozijnen",
      "kozijnen-vervangen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Kozijnen vervangen: vind een professional met vakkennis op het platform",
    "intro": [
      "Zoek je hulp bij kozijnen vervangen? Op VakConnect kun je je situatie helder omschrijven en een geschikte vakman vinden.",
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
          "Wanneer kozijnen vervangen in beeld komt maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Wanneer kozijnen vervangen in beeld komt wordt inhoudelijk sterker zodra toegang, huidige staat en technische randvoorwaarden niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Een realistische keuze rond wanneer kozijnen vervangen in beeld komt ontstaat meestal pas nadat een kozijnspecialist de samenhang heeft beoordeeld; dat voorkomt later tocht, condens en versnelde slijtage."
        ]
      },
      {
        "heading": "Signalen dat kozijnen of aansluitingen aandacht vragen — kozijnen vervangen",
        "paragraphs": [
          "Signalen dat kozijnen of aansluitingen aandacht vragen — kozijnen vervangen is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Voor een bruikbare beoordeling van signalen dat kozijnen of aansluitingen aandacht vragen — kozijnen vervangen zijn terugkerende tocht, structurele slijtage en slecht sluitwerk vaak de kerngegevens binnen kozijnwerk.",
          "Juist in signalen dat kozijnen of aansluitingen aandacht vragen — kozijnen vervangen kan een kozijnspecialist onderscheid maken tussen tijdelijke verlichting en een aanpak die tocht, condens en versnelde slijtage op langere termijn verkleint."
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
          "Mogelijke oorzaken van tocht, slijtage of klemmen — kozijnen vervangen maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Mogelijke oorzaken van tocht, slijtage of klemmen — kozijnen vervangen wordt betrouwbaarder beoordeeld wanneer ouderdom, vochtinvloed en beperkte isolatiewaarde expliciet worden meegenomen in het beeld van kozijnwerk.",
          "In de praktijk bepaalt mogelijke oorzaken van tocht, slijtage of klemmen — kozijnen vervangen vaak of een kozijnspecialist met beperkt herstel uitkomt of een bredere oplossing adviseert om tocht, condens en versnelde slijtage te vermijden."
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
          "Wat een kozijnspecialist doorgaans beoordeelt (kozijnen vervangen) — kozijnen vervangen vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Punten zoals staat in kaart brengen, materiaal en glas kiezen en vervanging en afwerking uitvoeren horen bij wat een kozijnspecialist doorgaans beoordeelt (kozijnen vervangen) — kozijnen vervangen omdat ze veel zeggen over omvang, risico en benodigde stappen binnen kozijnwerk.",
          "Rond wat een kozijnspecialist doorgaans beoordeelt (kozijnen vervangen) — kozijnen vervangen wordt vaak duidelijk dat goed voorwerk door een kozijnspecialist later herstel voorkomt en tocht, condens en versnelde slijtage reduceert."
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
          "Dit onderdeel, keuzes in materiaal, herstel en vervanging — kozijnen vervangen, is belangrijk omdat hier de praktische haalbaarheid wordt bepaald.",
          "Informatie over vervangen per fase of in één project, materiaalkeuze op onderhoud en uitstraling en combinatie met gevel- of schilderwerk voorkomt ruis bij keuzes in materiaal, herstel en vervanging — kozijnen vervangen en maakt de aanpak binnen kozijnwerk beter vergelijkbaar.",
          "Juist in keuzes in materiaal, herstel en vervanging — kozijnen vervangen kan een kozijnspecialist onderscheid maken tussen tijdelijke verlichting en een aanpak die tocht, condens en versnelde slijtage op langere termijn verkleint."
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
          "Welke gegevens je aanvraag echt sterker maken — kozijnen vervangen geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Informatie over toegang, huidige staat en technische randvoorwaarden voorkomt ruis bij welke gegevens je aanvraag echt sterker maken — kozijnen vervangen en maakt de aanpak binnen kozijnwerk beter vergelijkbaar.",
          "Wie welke gegevens je aanvraag echt sterker maken — kozijnen vervangen serieus laat beoordelen door een kozijnspecialist, heeft meestal minder kans op onverwachte bijsturing en tocht, condens en versnelde slijtage."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en onderhoudskosten — kozijnen vervangen",
        "paragraphs": [
          "Wat uitstel betekent voor comfort en onderhoudskosten — kozijnen vervangen helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Wie wat uitstel betekent voor comfort en onderhoudskosten — kozijnen vervangen goed wil laten inschatten, doet er verstandig aan factoren zoals toegang, huidige staat en technische randvoorwaarden direct te benoemen.",
          "Een realistische keuze rond wat uitstel betekent voor comfort en onderhoudskosten — kozijnen vervangen ontstaat meestal pas nadat een kozijnspecialist de samenhang heeft beoordeeld; dat voorkomt later tocht, condens en versnelde slijtage."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe bij de intake.",
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over kozijnen vervangen, locatie en planning.",
      "label": "Plaats je aanvraag voor kozijnvervanging",
      "secondaryLabel": "Terug naar kozijnen",
      "secondaryHref": "/kozijnen"
    }
  },
  "kozijnen/ramen-en-deuren": {
    "path": "/kozijnen/ramen-en-deuren",
    "title": "Ramen en deuren op VakConnect",
    "description": "Ramen en deuren vernieuwen of verbeteren: ontdek wat bepalend is voor comfort en gebruiksgemak.",
    "keywords": [
      "kozijnen",
      "ramen-en-deuren",
      "vakman",
      "VakConnect"
    ],
    "h1": "Ramen en deuren: vind een vakman met relevante ervaring met VakConnect",
    "intro": [
      "Zoek je hulp bij ramen en deuren? Met VakConnect kun je je situatie helder omschrijven en een gespecialiseerde vakman vinden.",
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
          "Rond wanneer ramen en deuren in beeld komt ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Wanneer ramen en deuren in beeld komt wordt inhoudelijk sterker zodra toegang, huidige staat en technische randvoorwaarden niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Wanneer wanneer ramen en deuren in beeld komt zorgvuldig wordt beoordeeld, kan een kozijnspecialist gerichter plannen en de kans op tocht, condens en versnelde slijtage terugdringen."
        ]
      },
      {
        "heading": "Signalen dat kozijnen of aansluitingen aandacht vragen — ramen en deuren",
        "paragraphs": [
          "Rond signalen dat kozijnen of aansluitingen aandacht vragen — ramen en deuren ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Bij signalen dat kozijnen of aansluitingen aandacht vragen — ramen en deuren worden factoren als klemmende delen, tocht rond sluiting en slijtage van beslag meegewogen om keuzes in kozijnwerk technisch te onderbouwen.",
          "Een kozijnspecialist kijkt bij signalen dat kozijnen of aansluitingen aandacht vragen — ramen en deuren meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en tocht, condens en versnelde slijtage beperkt blijft."
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
          "Bij mogelijke oorzaken van tocht, slijtage of klemmen — ramen en deuren blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Elementen zoals verouderde onderdelen, scheefstand en onvoldoende afstelling maken mogelijke oorzaken van tocht, slijtage of klemmen — ramen en deuren concreet en helpen om scope in kozijnwerk af te bakenen.",
          "Voor mogelijke oorzaken van tocht, slijtage of klemmen — ramen en deuren loont een vroege technische check door een kozijnspecialist, omdat je daarmee tocht, condens en versnelde slijtage en onnodige herstelrondes beperkt."
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
          "Wat een kozijnspecialist doorgaans beoordeelt (ramen en deuren) — ramen en deuren maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Wie wat een kozijnspecialist doorgaans beoordeelt (ramen en deuren) — ramen en deuren goed wil laten inschatten, doet er verstandig aan factoren zoals controle van beslag en sluitpunten, afstellen of vervangen en aansluiten op kozijnconditie direct te benoemen.",
          "Een realistische keuze rond wat een kozijnspecialist doorgaans beoordeelt (ramen en deuren) — ramen en deuren ontstaat meestal pas nadat een kozijnspecialist de samenhang heeft beoordeeld; dat voorkomt later tocht, condens en versnelde slijtage."
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
          "Keuzes in materiaal, herstel en vervanging — ramen en deuren voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Informatie over onderdelen vervangen of compleet vernieuwen en combineren met kozijnproject voorkomt ruis bij keuzes in materiaal, herstel en vervanging — ramen en deuren en maakt de aanpak binnen kozijnwerk beter vergelijkbaar.",
          "Wie keuzes in materiaal, herstel en vervanging — ramen en deuren serieus laat beoordelen door een kozijnspecialist, heeft meestal minder kans op onverwachte bijsturing en tocht, condens en versnelde slijtage."
        ],
        "bullets": [
          "onderdelen vervangen of compleet vernieuwen",
          "combineren met kozijnproject"
        ]
      },
      {
        "heading": "Welke gegevens je aanvraag echt sterker maken — ramen en deuren",
        "paragraphs": [
          "In het onderdeel welke gegevens je aanvraag echt sterker maken — ramen en deuren worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Punten zoals toegang, huidige staat en technische randvoorwaarden horen bij welke gegevens je aanvraag echt sterker maken — ramen en deuren omdat ze veel zeggen over omvang, risico en benodigde stappen binnen kozijnwerk.",
          "Rond welke gegevens je aanvraag echt sterker maken — ramen en deuren wordt vaak duidelijk dat goed voorwerk door een kozijnspecialist later herstel voorkomt en tocht, condens en versnelde slijtage reduceert."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en onderhoudskosten — ramen en deuren",
        "paragraphs": [
          "Rond wat uitstel betekent voor comfort en onderhoudskosten — ramen en deuren ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Bij wat uitstel betekent voor comfort en onderhoudskosten — ramen en deuren worden factoren als toegang, huidige staat en technische randvoorwaarden meegewogen om keuzes in kozijnwerk technisch te onderbouwen.",
          "Voor wat uitstel betekent voor comfort en onderhoudskosten — ramen en deuren loont een vroege technische check door een kozijnspecialist, omdat je daarmee tocht, condens en versnelde slijtage en onnodige herstelrondes beperkt."
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
        "answer": "Nee, VakConnect koppelt je aan een professional met vakkennis."
      }
    ],
    "cta": {
      "title": "Beschrijf je ramen en deuren-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met concrete details over ramen en deuren, locatie en planning.",
      "label": "Vraag een specialist voor ramen en deuren",
      "secondaryLabel": "Terug naar kozijnen",
      "secondaryHref": "/kozijnen"
    }
  },
  "badkamer/renovatie": {
    "path": "/badkamer/renovatie",
    "title": "Badkamerrenovatie via het platform",
    "description": "Badkamerrenovatie plannen van idee tot uitvoering: lees waar je technisch en praktisch op moet letten.",
    "keywords": [
      "badkamer",
      "renovatie",
      "vakman",
      "VakConnect"
    ],
    "h1": "Badkamerrenovatie: vind een geschikte vakman op het platform",
    "intro": [
      "Zoek je hulp bij badkamerrenovatie? Via VakConnect kun je je situatie helder omschrijven en een vakman met relevante ervaring vinden.",
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
          "Een badkamerrenovatie begint met de vraag wat functioneel niet meer klopt: indeling, comfort, vochtbeheersing of techniek.",
          "Dat vertrekpunt bepaalt of je vooral wilt vernieuwen in afwerking of ook leidingen, afvoer en elektra moet verleggen.",
          "Door eerst scope te bepalen voorkom je dat ontwerp en uitvoering elkaar later in de weg zitten."
        ]
      },
      {
        "heading": "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — renovatie",
        "paragraphs": [
          "Na sloop komt de technische basis: vlakheid, waterdichting, afschot, leidingen en ventilatiecapaciteit.",
          "Juist in deze fase worden fouten kostbaar als ze pas bij tegel- of sanitairmontage zichtbaar worden.",
          "Een realistische planning houdt daarom expliciet rekening met controles tussen de disciplines."
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
          "Materiaalkeuzes in tegelwerk en sanitair beïnvloeden niet alleen uitstraling, maar ook montagetijd en detailafwerking.",
          "Bij compacte badkamers zijn maatvoering en aansluitposities extra kritisch voor comfort en toegankelijkheid.",
          "Heldere projectinformatie bij je aanvraag helpt om vakmensen op planning en specialisatie passend te matchen."
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
          "Wat een specialist eerst in kaart brengt (renovatie) — renovatie geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Tijdens wat een specialist eerst in kaart brengt (renovatie) — renovatie geven huidige situatie in kaart brengen, sloop en voorbereiding plannen, water, afvoer, elektra en ventilatie afstemmen en tegelwerk en sanitair in logische volgorde uitvoeren richting aan materiaalkeuzes, werkvolgorde en planning in badkamerverbetering.",
          "Wie wat een specialist eerst in kaart brengt (renovatie) — renovatie serieus laat beoordelen door een badkamerspecialist, heeft meestal minder kans op onverwachte bijsturing en vocht in constructie en terugkerende herstelkosten."
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
          "Voor keuzes in scope, indeling en combinatie met installatiewerk — renovatie geldt dat kleine signalen vaak veel zeggen over het vervolg van de klus.",
          "Tijdens keuzes in scope, indeling en combinatie met installatiewerk — renovatie geven deelrenovatie of complete aanpak, huidige indeling verbeteren of volledig wijzigen en combinatie met loodgieter- en elektricienwerk richting aan materiaalkeuzes, werkvolgorde en planning in badkamerverbetering.",
          "Wie keuzes in scope, indeling en combinatie met installatiewerk — renovatie serieus laat beoordelen door een badkamerspecialist, heeft meestal minder kans op onverwachte bijsturing en vocht in constructie en terugkerende herstelkosten."
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
          "Dit onderdeel, welke input nodig is voor een realistische offertefase — renovatie, is belangrijk omdat hier de praktische haalbaarheid wordt bepaald.",
          "Informatie over toegang, huidige staat en technische randvoorwaarden voorkomt ruis bij welke input nodig is voor een realistische offertefase — renovatie en maakt de aanpak binnen badkamerverbetering beter vergelijkbaar.",
          "Als welke input nodig is voor een realistische offertefase — renovatie te globaal wordt ingeschat, groeit de kans op misplanning; een badkamerspecialist kan dat vroegtijdig bijsturen en vocht in constructie en terugkerende herstelkosten helpen beperken."
        ]
      },
      {
        "heading": "Gevolgen van uitstel bij vocht en slijtage — renovatie",
        "paragraphs": [
          "Dit onderdeel, gevolgen van uitstel bij vocht en slijtage — renovatie, is belangrijk omdat hier de praktische haalbaarheid wordt bepaald.",
          "Ook bij gevolgen van uitstel bij vocht en slijtage — renovatie blijft de combinatie van toegang, huidige staat en technische randvoorwaarden bepalend voor keuzes en tempo binnen badkamerverbetering.",
          "Een realistische keuze rond gevolgen van uitstel bij vocht en slijtage — renovatie ontstaat meestal pas nadat een badkamerspecialist de samenhang heeft beoordeeld; dat voorkomt later vocht in constructie en terugkerende herstelkosten."
        ],
        "type": "warning"
      },
      {
        "heading": "Planning tussen sloop, techniek en afwerking — renovatie",
        "paragraphs": [
          "Planning tussen sloop, techniek en afwerking — renovatie helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Wie planning tussen sloop, techniek en afwerking — renovatie goed wil laten inschatten, doet er verstandig aan factoren zoals toegang, huidige staat en technische randvoorwaarden direct te benoemen.",
          "Een realistische keuze rond planning tussen sloop, techniek en afwerking — renovatie ontstaat meestal pas nadat een badkamerspecialist de samenhang heeft beoordeeld; dat voorkomt later vocht in constructie en terugkerende herstelkosten."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in de intake.",
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over renovatie, locatie en planning.",
      "label": "Start je badkamerrenovatie",
      "secondaryLabel": "Terug naar badkamer",
      "secondaryHref": "/badkamer"
    }
  },
  "badkamer/tegelen": {
    "path": "/badkamer/tegelen",
    "title": "Badkamer tegelen op VakConnect",
    "description": "Badkamer tegelen met duurzame afwerking: lees wat ondergrond, voegwerk en maatvoering bepalen.",
    "keywords": [
      "badkamer",
      "tegelen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Badkamer tegelen: vind een gespecialiseerde vakman met VakConnect",
    "intro": [
      "Zoek je hulp bij badkamer tegelen? Op het platform kun je je situatie helder omschrijven en een professional met vakkennis vinden.",
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
          "Bij wanneer badkamer tegelen in beeld komt blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Punten zoals toegang, huidige staat en technische randvoorwaarden horen bij wanneer badkamer tegelen in beeld komt omdat ze veel zeggen over omvang, risico en benodigde stappen binnen badkamerverbetering.",
          "Bij wanneer badkamer tegelen in beeld komt helpt een inhoudelijke beoordeling door een badkamerspecialist om verkeerde prioriteiten en daarmee vocht in constructie en terugkerende herstelkosten te voorkomen."
        ]
      },
      {
        "heading": "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — tegelen",
        "paragraphs": [
          "Dit onderdeel, welke signalen laten zien dat de badkamer aan vernieuwing toe is — tegelen, is belangrijk omdat hier de praktische haalbaarheid wordt bepaald.",
          "Tijdens welke signalen laten zien dat de badkamer aan vernieuwing toe is — tegelen geven losse tegels, scheuren in voegwerk en verouderde uitstraling richting aan materiaalkeuzes, werkvolgorde en planning in badkamerverbetering.",
          "Als welke signalen laten zien dat de badkamer aan vernieuwing toe is — tegelen te globaal wordt ingeschat, groeit de kans op misplanning; een badkamerspecialist kan dat vroegtijdig bijsturen en vocht in constructie en terugkerende herstelkosten helpen beperken."
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
          "Technische oorzaken achter vocht- of gebruiksproblemen — tegelen geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Informatie over onvoldoende hechting, vochtbelasting en ondergrondbeweging voorkomt ruis bij technische oorzaken achter vocht- of gebruiksproblemen — tegelen en maakt de aanpak binnen badkamerverbetering beter vergelijkbaar.",
          "Juist in technische oorzaken achter vocht- of gebruiksproblemen — tegelen kan een badkamerspecialist onderscheid maken tussen tijdelijke verlichting en een aanpak die vocht in constructie en terugkerende herstelkosten op langere termijn verkleint."
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
          "Bij wat een specialist eerst in kaart brengt (tegelen) — tegelen blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Bij wat een specialist eerst in kaart brengt (tegelen) — tegelen vormen ondergrond controleren, waterdichting beoordelen, tegels plaatsen en voegen en afwerken van kritieke randen meestal de basis voor een realistische werkinschatting in badkamerverbetering.",
          "Door wat een specialist eerst in kaart brengt (tegelen) — tegelen vroeg te laten toetsen door een badkamerspecialist worden vervolgstappen consistenter en blijft vocht in constructie en terugkerende herstelkosten beter beheersbaar."
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
          "In het onderdeel keuzes in scope, indeling en combinatie met installatiewerk — tegelen worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Bij keuzes in scope, indeling en combinatie met installatiewerk — tegelen vormen groot formaat of klassiek formaat, wand, vloer of combinatie en voegkleur en onderhoudsgemak meestal de basis voor een realistische werkinschatting in badkamerverbetering.",
          "Door keuzes in scope, indeling en combinatie met installatiewerk — tegelen vroeg te laten toetsen door een badkamerspecialist worden vervolgstappen consistenter en blijft vocht in constructie en terugkerende herstelkosten beter beheersbaar."
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
          "Dit onderdeel, welke input nodig is voor een realistische offertefase — tegelen, is belangrijk omdat hier de praktische haalbaarheid wordt bepaald.",
          "Informatie over toegang, huidige staat en technische randvoorwaarden voorkomt ruis bij welke input nodig is voor een realistische offertefase — tegelen en maakt de aanpak binnen badkamerverbetering beter vergelijkbaar.",
          "Juist in welke input nodig is voor een realistische offertefase — tegelen kan een badkamerspecialist onderscheid maken tussen tijdelijke verlichting en een aanpak die vocht in constructie en terugkerende herstelkosten op langere termijn verkleint."
        ]
      },
      {
        "heading": "Gevolgen van uitstel bij vocht en slijtage — tegelen",
        "paragraphs": [
          "In gevolgen van uitstel bij vocht en slijtage — tegelen zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Bij gevolgen van uitstel bij vocht en slijtage — tegelen worden factoren als toegang, huidige staat en technische randvoorwaarden meegewogen om keuzes in badkamerverbetering technisch te onderbouwen.",
          "Bij gevolgen van uitstel bij vocht en slijtage — tegelen helpt een inhoudelijke beoordeling door een badkamerspecialist om verkeerde prioriteiten en daarmee vocht in constructie en terugkerende herstelkosten te voorkomen."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe bij de intake.",
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
        "answer": "Nee, je wordt gekoppeld aan een geschikte vakman."
      }
    ],
    "cta": {
      "title": "Beschrijf je badkamer tegelen-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met concrete details over tegelen, locatie en planning.",
      "label": "Vraag badkamer-tegelwerk aan",
      "secondaryLabel": "Terug naar badkamer",
      "secondaryHref": "/badkamer"
    }
  },
  "badkamer/sanitair": {
    "path": "/badkamer/sanitair",
    "title": "Badkamer sanitair via het platform",
    "description": "Sanitair in de badkamer vervangen of vernieuwen: wat bepaalt de beste aanpak?",
    "keywords": [
      "badkamer",
      "sanitair",
      "vakman",
      "VakConnect"
    ],
    "h1": "Badkamer sanitair: vind een vakman met relevante ervaring op het platform",
    "intro": [
      "Zoek je hulp bij badkamer sanitair? Op VakConnect kun je je situatie helder omschrijven en een gespecialiseerde vakman vinden.",
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
          "Bij wanneer badkamer sanitair in beeld komt blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Voor een bruikbare beoordeling van wanneer badkamer sanitair in beeld komt zijn toegang, huidige staat en technische randvoorwaarden vaak de kerngegevens binnen badkamerverbetering.",
          "Als wanneer badkamer sanitair in beeld komt te globaal wordt ingeschat, groeit de kans op misplanning; een badkamerspecialist kan dat vroegtijdig bijsturen en vocht in constructie en terugkerende herstelkosten helpen beperken."
        ]
      },
      {
        "heading": "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — sanitair",
        "paragraphs": [
          "Voor welke signalen laten zien dat de badkamer aan vernieuwing toe is — sanitair geldt dat kleine signalen vaak veel zeggen over het vervolg van de klus.",
          "Tijdens welke signalen laten zien dat de badkamer aan vernieuwing toe is — sanitair geven lekkende aansluitingen, versleten elementen en onpraktische opstelling richting aan materiaalkeuzes, werkvolgorde en planning in badkamerverbetering.",
          "Als welke signalen laten zien dat de badkamer aan vernieuwing toe is — sanitair te globaal wordt ingeschat, groeit de kans op misplanning; een badkamerspecialist kan dat vroegtijdig bijsturen en vocht in constructie en terugkerende herstelkosten helpen beperken."
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
          "Technische oorzaken achter vocht- of gebruiksproblemen — sanitair voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Tijdens technische oorzaken achter vocht- of gebruiksproblemen — sanitair geven slijtage, oude aansluitpunten en gewijzigde comfortwensen richting aan materiaalkeuzes, werkvolgorde en planning in badkamerverbetering.",
          "In de praktijk bepaalt technische oorzaken achter vocht- of gebruiksproblemen — sanitair vaak of een badkamerspecialist met beperkt herstel uitkomt of een bredere oplossing adviseert om vocht in constructie en terugkerende herstelkosten te vermijden."
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
          "Wat een specialist eerst in kaart brengt (sanitair) — sanitair maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Bij wat een specialist eerst in kaart brengt (sanitair) — sanitair worden factoren als opstelling beoordelen, nieuw sanitair selecteren en aansluiten, afstellen en afdichten meegewogen om keuzes in badkamerverbetering technisch te onderbouwen.",
          "Een badkamerspecialist kijkt bij wat een specialist eerst in kaart brengt (sanitair) — sanitair meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en vocht in constructie en terugkerende herstelkosten beperkt blijft."
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
          "Voor keuzes in scope, indeling en combinatie met installatiewerk — sanitair geldt dat kleine signalen vaak veel zeggen over het vervolg van de klus.",
          "Informatie over deelvervanging of complete set, eigen inkoop of adviestraject en combinatie met tegelwerk voorkomt ruis bij keuzes in scope, indeling en combinatie met installatiewerk — sanitair en maakt de aanpak binnen badkamerverbetering beter vergelijkbaar.",
          "Juist in keuzes in scope, indeling en combinatie met installatiewerk — sanitair kan een badkamerspecialist onderscheid maken tussen tijdelijke verlichting en een aanpak die vocht in constructie en terugkerende herstelkosten op langere termijn verkleint."
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
          "In het onderdeel welke input nodig is voor een realistische offertefase — sanitair worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Punten zoals toegang, huidige staat en technische randvoorwaarden horen bij welke input nodig is voor een realistische offertefase — sanitair omdat ze veel zeggen over omvang, risico en benodigde stappen binnen badkamerverbetering.",
          "Voor welke input nodig is voor een realistische offertefase — sanitair loont een vroege technische check door een badkamerspecialist, omdat je daarmee vocht in constructie en terugkerende herstelkosten en onnodige herstelrondes beperkt."
        ]
      },
      {
        "heading": "Gevolgen van uitstel bij vocht en slijtage — sanitair",
        "paragraphs": [
          "Bij gevolgen van uitstel bij vocht en slijtage — sanitair blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Elementen zoals toegang, huidige staat en technische randvoorwaarden maken gevolgen van uitstel bij vocht en slijtage — sanitair concreet en helpen om scope in badkamerverbetering af te bakenen.",
          "Bij gevolgen van uitstel bij vocht en slijtage — sanitair helpt een inhoudelijke beoordeling door een badkamerspecialist om verkeerde prioriteiten en daarmee vocht in constructie en terugkerende herstelkosten te voorkomen."
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
        "answer": "Nee, VakConnect koppelt je aan een professional met vakkennis."
      }
    ],
    "cta": {
      "title": "Beschrijf je badkamer sanitair-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met concrete details over sanitair, locatie en planning.",
      "label": "Start je aanvraag voor badkamersanitair",
      "secondaryLabel": "Terug naar badkamer",
      "secondaryHref": "/badkamer"
    }
  },
  "badkamer/inloopdouche": {
    "path": "/badkamer/inloopdouche",
    "title": "Inloopdouche op VakConnect",
    "description": "Inloopdouche realiseren? Lees welke technische en praktische keuzes bepalend zijn.",
    "keywords": [
      "badkamer",
      "inloopdouche",
      "vakman",
      "VakConnect"
    ],
    "h1": "Inloopdouche: vind een geschikte vakman met VakConnect",
    "intro": [
      "Zoek je hulp bij inloopdouche? Met VakConnect kun je je situatie helder omschrijven en een vakman met relevante ervaring vinden.",
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
          "Wanneer inloopdouche in beeld komt vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Punten zoals toegang, huidige staat en technische randvoorwaarden horen bij wanneer inloopdouche in beeld komt omdat ze veel zeggen over omvang, risico en benodigde stappen binnen badkamerverbetering.",
          "Bij wanneer inloopdouche in beeld komt helpt een inhoudelijke beoordeling door een badkamerspecialist om verkeerde prioriteiten en daarmee vocht in constructie en terugkerende herstelkosten te voorkomen."
        ]
      },
      {
        "heading": "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — inloopdouche",
        "paragraphs": [
          "In welke signalen laten zien dat de badkamer aan vernieuwing toe is — inloopdouche zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — inloopdouche wordt inhoudelijk sterker zodra wens voor drempelloze douche, water blijft staan en oude douchezone voldoet niet niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Bij welke signalen laten zien dat de badkamer aan vernieuwing toe is — inloopdouche is het voordeel van een badkamerspecialist vooral dat keuzes in uitvoering en timing meteen op vocht in constructie en terugkerende herstelkosten worden getoetst."
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
          "Technische oorzaken achter vocht- of gebruiksproblemen — inloopdouche maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Technische oorzaken achter vocht- of gebruiksproblemen — inloopdouche wordt inhoudelijk sterker zodra onvoldoende afschot, beperkte afvoeroplossing en verouderde opbouw niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Door technische oorzaken achter vocht- of gebruiksproblemen — inloopdouche vroeg te laten toetsen door een badkamerspecialist worden vervolgstappen consistenter en blijft vocht in constructie en terugkerende herstelkosten beter beheersbaar."
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
          "Wat een specialist eerst in kaart brengt (inloopdouche) — inloopdouche maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Wat een specialist eerst in kaart brengt (inloopdouche) — inloopdouche wordt betrouwbaarder beoordeeld wanneer haalbaarheid beoordelen, vloer en afvoer aanpassen en waterdichte opbouw en afwerking maken expliciet worden meegenomen in het beeld van badkamerverbetering.",
          "Als wat een specialist eerst in kaart brengt (inloopdouche) — inloopdouche te globaal wordt ingeschat, groeit de kans op misplanning; een badkamerspecialist kan dat vroegtijdig bijsturen en vocht in constructie en terugkerende herstelkosten helpen beperken."
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
          "In het onderdeel keuzes in scope, indeling en combinatie met installatiewerk — inloopdouche worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Punten zoals lineaire drain of put, glasoplossing en indeling en combinatie met volledige renovatie horen bij keuzes in scope, indeling en combinatie met installatiewerk — inloopdouche omdat ze veel zeggen over omvang, risico en benodigde stappen binnen badkamerverbetering.",
          "Voor keuzes in scope, indeling en combinatie met installatiewerk — inloopdouche loont een vroege technische check door een badkamerspecialist, omdat je daarmee vocht in constructie en terugkerende herstelkosten en onnodige herstelrondes beperkt."
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
          "In het onderdeel welke input nodig is voor een realistische offertefase — inloopdouche worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Punten zoals toegang, huidige staat en technische randvoorwaarden horen bij welke input nodig is voor een realistische offertefase — inloopdouche omdat ze veel zeggen over omvang, risico en benodigde stappen binnen badkamerverbetering.",
          "Voor welke input nodig is voor een realistische offertefase — inloopdouche loont een vroege technische check door een badkamerspecialist, omdat je daarmee vocht in constructie en terugkerende herstelkosten en onnodige herstelrondes beperkt."
        ]
      },
      {
        "heading": "Gevolgen van uitstel bij vocht en slijtage — inloopdouche",
        "paragraphs": [
          "Voor gevolgen van uitstel bij vocht en slijtage — inloopdouche geldt dat kleine signalen vaak veel zeggen over het vervolg van de klus.",
          "Informatie over toegang, huidige staat en technische randvoorwaarden voorkomt ruis bij gevolgen van uitstel bij vocht en slijtage — inloopdouche en maakt de aanpak binnen badkamerverbetering beter vergelijkbaar.",
          "Als gevolgen van uitstel bij vocht en slijtage — inloopdouche te globaal wordt ingeschat, groeit de kans op misplanning; een badkamerspecialist kan dat vroegtijdig bijsturen en vocht in constructie en terugkerende herstelkosten helpen beperken."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe bij je aanvraag.",
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over inloopdouche, locatie en planning.",
      "label": "Vraag een specialist voor inloopdouche",
      "secondaryLabel": "Terug naar badkamer",
      "secondaryHref": "/badkamer"
    }
  },
  "badkamer/complete-badkamer": {
    "path": "/badkamer/complete-badkamer",
    "title": "Complete badkamer via het platform",
    "description": "Complete badkamer vernieuwen: van oude situatie naar afgestemd totaalplan.",
    "keywords": [
      "badkamer",
      "complete-badkamer",
      "vakman",
      "VakConnect"
    ],
    "h1": "Complete badkamer: vind een gespecialiseerde vakman op het platform",
    "intro": [
      "Zoek je hulp bij complete badkamer? Via VakConnect kun je je situatie helder omschrijven en een professional met vakkennis vinden.",
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
          "In wanneer complete badkamer in beeld komt zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Wanneer complete badkamer in beeld komt wordt inhoudelijk sterker zodra toegang, huidige staat en technische randvoorwaarden niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Een realistische keuze rond wanneer complete badkamer in beeld komt ontstaat meestal pas nadat een badkamerspecialist de samenhang heeft beoordeeld; dat voorkomt later vocht in constructie en terugkerende herstelkosten."
        ]
      },
      {
        "heading": "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — complete badkamer",
        "paragraphs": [
          "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — complete badkamer vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Punten zoals meerdere gebreken tegelijk, technisch en visueel verouderd en wens voor nieuwe indeling horen bij welke signalen laten zien dat de badkamer aan vernieuwing toe is — complete badkamer omdat ze veel zeggen over omvang, risico en benodigde stappen binnen badkamerverbetering.",
          "Voor welke signalen laten zien dat de badkamer aan vernieuwing toe is — complete badkamer loont een vroege technische check door een badkamerspecialist, omdat je daarmee vocht in constructie en terugkerende herstelkosten en onnodige herstelrondes beperkt."
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
          "Bij technische oorzaken achter vocht- of gebruiksproblemen — complete badkamer blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Punten zoals ouderdom van installatie, opstapeling van kleine problemen en nieuwe woonbehoefte horen bij technische oorzaken achter vocht- of gebruiksproblemen — complete badkamer omdat ze veel zeggen over omvang, risico en benodigde stappen binnen badkamerverbetering.",
          "Rond technische oorzaken achter vocht- of gebruiksproblemen — complete badkamer wordt vaak duidelijk dat goed voorwerk door een badkamerspecialist later herstel voorkomt en vocht in constructie en terugkerende herstelkosten reduceert."
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
          "Wat een specialist eerst in kaart brengt (complete badkamer) — complete badkamer is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Elementen zoals inventariseren en prioriteren, technische disciplines afstemmen en volledige uitvoering en oplevering maken wat een specialist eerst in kaart brengt (complete badkamer) — complete badkamer concreet en helpen om scope in badkamerverbetering af te bakenen.",
          "Rond wat een specialist eerst in kaart brengt (complete badkamer) — complete badkamer wordt vaak duidelijk dat goed voorwerk door een badkamerspecialist later herstel voorkomt en vocht in constructie en terugkerende herstelkosten reduceert."
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
          "Keuzes in scope, indeling en combinatie met installatiewerk — complete badkamer voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Ook bij keuzes in scope, indeling en combinatie met installatiewerk — complete badkamer blijft de combinatie van basisrenovatie of luxe afwerking en gefaseerde planning of alles in één traject bepalend voor keuzes en tempo binnen badkamerverbetering.",
          "Wanneer keuzes in scope, indeling en combinatie met installatiewerk — complete badkamer zorgvuldig wordt beoordeeld, kan een badkamerspecialist gerichter plannen en de kans op vocht in constructie en terugkerende herstelkosten terugdringen."
        ],
        "bullets": [
          "basisrenovatie of luxe afwerking",
          "gefaseerde planning of alles in één traject"
        ]
      },
      {
        "heading": "Welke input nodig is voor een realistische offertefase — complete badkamer",
        "paragraphs": [
          "Welke input nodig is voor een realistische offertefase — complete badkamer geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Informatie over toegang, huidige staat en technische randvoorwaarden voorkomt ruis bij welke input nodig is voor een realistische offertefase — complete badkamer en maakt de aanpak binnen badkamerverbetering beter vergelijkbaar.",
          "In de praktijk bepaalt welke input nodig is voor een realistische offertefase — complete badkamer vaak of een badkamerspecialist met beperkt herstel uitkomt of een bredere oplossing adviseert om vocht in constructie en terugkerende herstelkosten te vermijden."
        ]
      },
      {
        "heading": "Gevolgen van uitstel bij vocht en slijtage — complete badkamer",
        "paragraphs": [
          "Gevolgen van uitstel bij vocht en slijtage — complete badkamer voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Informatie over toegang, huidige staat en technische randvoorwaarden voorkomt ruis bij gevolgen van uitstel bij vocht en slijtage — complete badkamer en maakt de aanpak binnen badkamerverbetering beter vergelijkbaar.",
          "In de praktijk bepaalt gevolgen van uitstel bij vocht en slijtage — complete badkamer vaak of een badkamerspecialist met beperkt herstel uitkomt of een bredere oplossing adviseert om vocht in constructie en terugkerende herstelkosten te vermijden."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in de intake.",
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
        "answer": "Nee, VakConnect koppelt je aan geschikte vakmanen."
      }
    ],
    "cta": {
      "title": "Beschrijf je complete badkamer-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met concrete details over complete badkamer, locatie en planning.",
      "label": "Plaats je complete badkamer-aanvraag",
      "secondaryLabel": "Terug naar badkamer",
      "secondaryHref": "/badkamer"
    }
  },
  "badkamer/ventilatie": {
    "path": "/badkamer/ventilatie",
    "title": "Badkamerventilatie op VakConnect",
    "description": "Ventilatieproblemen in de badkamer aanpakken: lees oorzaken, gevolgen en opties.",
    "keywords": [
      "badkamer",
      "ventilatie",
      "vakman",
      "VakConnect"
    ],
    "h1": "Badkamerventilatie: vind een vakman met relevante ervaring met VakConnect",
    "intro": [
      "Zoek je hulp bij badkamerventilatie? Op het platform kun je je situatie helder omschrijven en een gespecialiseerde vakman vinden.",
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
          "Voor wanneer badkamerventilatie in beeld komt geldt dat kleine signalen vaak veel zeggen over het vervolg van de klus.",
          "Tijdens wanneer badkamerventilatie in beeld komt geven toegang, huidige staat en technische randvoorwaarden richting aan materiaalkeuzes, werkvolgorde en planning in badkamerverbetering.",
          "Juist in wanneer badkamerventilatie in beeld komt kan een badkamerspecialist onderscheid maken tussen tijdelijke verlichting en een aanpak die vocht in constructie en terugkerende herstelkosten op langere termijn verkleint."
        ]
      },
      {
        "heading": "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — ventilatie",
        "paragraphs": [
          "In welke signalen laten zien dat de badkamer aan vernieuwing toe is — ventilatie zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — ventilatie wordt inhoudelijk sterker zodra lang natte oppervlakken, schimmel in voegen en blijvende muffe geur niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Door welke signalen laten zien dat de badkamer aan vernieuwing toe is — ventilatie vroeg te laten toetsen door een badkamerspecialist worden vervolgstappen consistenter en blijft vocht in constructie en terugkerende herstelkosten beter beheersbaar."
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
          "Technische oorzaken achter vocht- of gebruiksproblemen — ventilatie maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Wie technische oorzaken achter vocht- of gebruiksproblemen — ventilatie goed wil laten inschatten, doet er verstandig aan factoren zoals onvoldoende afzuiging, verouderde ventilator en onjuiste luchtstroom direct te benoemen.",
          "Een realistische keuze rond technische oorzaken achter vocht- of gebruiksproblemen — ventilatie ontstaat meestal pas nadat een badkamerspecialist de samenhang heeft beoordeeld; dat voorkomt later vocht in constructie en terugkerende herstelkosten."
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
          "Wat een specialist eerst in kaart brengt (ventilatie) — ventilatie is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Elementen zoals ventilatieprestatie beoordelen, componenten verbeteren of vervangen en afstemmen met badkamergebruik maken wat een specialist eerst in kaart brengt (ventilatie) — ventilatie concreet en helpen om scope in badkamerverbetering af te bakenen.",
          "Bij wat een specialist eerst in kaart brengt (ventilatie) — ventilatie helpt een inhoudelijke beoordeling door een badkamerspecialist om verkeerde prioriteiten en daarmee vocht in constructie en terugkerende herstelkosten te voorkomen."
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
          "In keuzes in scope, indeling en combinatie met installatiewerk — ventilatie zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Wie keuzes in scope, indeling en combinatie met installatiewerk — ventilatie goed wil laten inschatten, doet er verstandig aan factoren zoals lokaal ventilatieherstel of integrale renovatie en combineren met elektra-aanpassing direct te benoemen.",
          "Wanneer keuzes in scope, indeling en combinatie met installatiewerk — ventilatie zorgvuldig wordt beoordeeld, kan een badkamerspecialist gerichter plannen en de kans op vocht in constructie en terugkerende herstelkosten terugdringen."
        ],
        "bullets": [
          "lokaal ventilatieherstel of integrale renovatie",
          "combineren met elektra-aanpassing"
        ]
      },
      {
        "heading": "Welke input nodig is voor een realistische offertefase — ventilatie",
        "paragraphs": [
          "Voor welke input nodig is voor een realistische offertefase — ventilatie geldt dat kleine signalen vaak veel zeggen over het vervolg van de klus.",
          "Informatie over toegang, huidige staat en technische randvoorwaarden voorkomt ruis bij welke input nodig is voor een realistische offertefase — ventilatie en maakt de aanpak binnen badkamerverbetering beter vergelijkbaar.",
          "Wie welke input nodig is voor een realistische offertefase — ventilatie serieus laat beoordelen door een badkamerspecialist, heeft meestal minder kans op onverwachte bijsturing en vocht in constructie en terugkerende herstelkosten."
        ]
      },
      {
        "heading": "Gevolgen van uitstel bij vocht en slijtage — ventilatie",
        "paragraphs": [
          "In gevolgen van uitstel bij vocht en slijtage — ventilatie zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Wie gevolgen van uitstel bij vocht en slijtage — ventilatie goed wil laten inschatten, doet er verstandig aan factoren zoals toegang, huidige staat en technische randvoorwaarden direct te benoemen.",
          "Een realistische keuze rond gevolgen van uitstel bij vocht en slijtage — ventilatie ontstaat meestal pas nadat een badkamerspecialist de samenhang heeft beoordeeld; dat voorkomt later vocht in constructie en terugkerende herstelkosten."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe bij de intake.",
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
        "answer": "Nee, VakConnect koppelt je aan een professional met vakkennis."
      }
    ],
    "cta": {
      "title": "Beschrijf je badkamerventilatie-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met concrete details over ventilatie, locatie en planning.",
      "label": "Start je aanvraag voor badkamerventilatie",
      "secondaryLabel": "Terug naar badkamer",
      "secondaryHref": "/badkamer"
    }
  },
  "isolatie/dakisolatie": {
    "path": "/isolatie/dakisolatie",
    "title": "Dakisolatie via het platform",
    "description": "Dakisolatie plannen? Lees verschillen tussen daktypen, methodes en aandachtspunten.",
    "keywords": [
      "isolatie",
      "dakisolatie",
      "vakman",
      "VakConnect"
    ],
    "h1": "Dakisolatie: vind een geschikte vakman op het platform",
    "intro": [
      "Zoek je hulp bij dakisolatie? Op VakConnect kun je je situatie helder omschrijven en een vakman met relevante ervaring vinden.",
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
          "Dakisolatie verschilt sterk tussen hellende en platte daken, en tussen isoleren aan binnen- of buitenzijde.",
          "De bestaande opbouw, vochtgedrag en beschikbare ruimte bepalen welke route technisch verantwoord is.",
          "Een keuze op alleen Rc-waarde zonder opbouwcontrole geeft vaak een onvolledig beeld."
        ]
      },
      {
        "heading": "Signalen dat isolatieverbetering zinvol is — dakisolatie",
        "paragraphs": [
          "Bij hellende daken speelt de aansluiting op knieschotten, dakkapellen en doorvoeren mee; bij platte daken zijn naden en opstanden cruciaal.",
          "Ook ventilatie en dampremming moeten passen bij de gekozen opbouw om condensproblemen te voorkomen.",
          "Daarom wordt dakisolatie vrijwel altijd in combinatie met bouwkundige details beoordeeld."
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
          "Dakisolatie wordt vaak gecombineerd met renovatie van bedekking of afwerking omdat de constructie dan toch open ligt.",
          "Dat kan efficiënter zijn in planning en kosten, mits de werkzaamheden goed op elkaar aansluiten.",
          "Beschrijf in je aanvraag daktype, huidige laagopbouw en recente klachten voor een betere eerste inschatting."
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
          "Wat een isolatiespecialist beoordeelt vóór uitvoering (dakisolatie) — dakisolatie maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Wat een isolatiespecialist beoordeelt vóór uitvoering (dakisolatie) — dakisolatie wordt inhoudelijk sterker zodra daktype en opbouw beoordelen, methode kiezen (binnenzijde of buitenzijde) en uitvoering combineren met details en ventilatie niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Door wat een isolatiespecialist beoordeelt vóór uitvoering (dakisolatie) — dakisolatie vroeg te laten toetsen door een isolatiespecialist worden vervolgstappen consistenter en blijft onnodig warmteverlies en comfortklachten beter beheersbaar."
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
          "Keuzes in methode, materiaal en combinatiemaatregelen — dakisolatie helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Bij keuzes in methode, materiaal en combinatiemaatregelen — dakisolatie worden factoren als isoleren bij renovatie of als losse maatregel, focus op comfort, energie of beide en combinatie met dakrenovatie meegewogen om keuzes in isolatiewerk technisch te onderbouwen.",
          "Een isolatiespecialist kijkt bij keuzes in methode, materiaal en combinatiemaatregelen — dakisolatie meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en onnodig warmteverlies en comfortklachten beperkt blijft."
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
          "Welke woninginformatie je vooraf moet delen — dakisolatie voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Ook bij welke woninginformatie je vooraf moet delen — dakisolatie blijft de combinatie van toegang, huidige staat en technische randvoorwaarden bepalend voor keuzes en tempo binnen isolatiewerk.",
          "Door welke woninginformatie je vooraf moet delen — dakisolatie vroeg te laten toetsen door een isolatiespecialist worden vervolgstappen consistenter en blijft onnodig warmteverlies en comfortklachten beter beheersbaar."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en energiegebruik — dakisolatie",
        "paragraphs": [
          "Wat uitstel betekent voor comfort en energiegebruik — dakisolatie vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Punten zoals toegang, huidige staat en technische randvoorwaarden horen bij wat uitstel betekent voor comfort en energiegebruik — dakisolatie omdat ze veel zeggen over omvang, risico en benodigde stappen binnen isolatiewerk.",
          "Een isolatiespecialist kijkt bij wat uitstel betekent voor comfort en energiegebruik — dakisolatie meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en onnodig warmteverlies en comfortklachten beperkt blijft."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe bij je aanvraag.",
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
        "answer": "Nee, VakConnect koppelt je aan een gespecialiseerde vakman."
      }
    ],
    "cta": {
      "title": "Beschrijf je dakisolatie-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met concrete details over dakisolatie, locatie en planning.",
      "label": "Vraag dakisolatie aan",
      "secondaryLabel": "Terug naar isolatie",
      "secondaryHref": "/isolatie"
    }
  },
  "isolatie/spouwmuurisolatie": {
    "path": "/isolatie/spouwmuurisolatie",
    "title": "Spouwmuurisolatie op VakConnect",
    "description": "Spouwmuurisolatie overwegen? Ontdek wanneer de spouw geschikt is en welke factoren meespelen.",
    "keywords": [
      "isolatie",
      "spouwmuurisolatie",
      "vakman",
      "VakConnect"
    ],
    "h1": "Spouwmuurisolatie: vind een professional met vakkennis met VakConnect",
    "intro": [
      "Zoek je hulp bij spouwmuurisolatie? Met VakConnect kun je je situatie helder omschrijven en een geschikte vakman vinden.",
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
          "In het onderdeel wanneer spouwmuurisolatie in beeld komt worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Punten zoals toegang, huidige staat en technische randvoorwaarden horen bij wanneer spouwmuurisolatie in beeld komt omdat ze veel zeggen over omvang, risico en benodigde stappen binnen isolatiewerk.",
          "Voor wanneer spouwmuurisolatie in beeld komt loont een vroege technische check door een isolatiespecialist, omdat je daarmee onnodig warmteverlies en comfortklachten en onnodige herstelrondes beperkt."
        ]
      },
      {
        "heading": "Signalen dat isolatieverbetering zinvol is — spouwmuurisolatie",
        "paragraphs": [
          "Signalen dat isolatieverbetering zinvol is — spouwmuurisolatie vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Voor een bruikbare beoordeling van signalen dat isolatieverbetering zinvol is — spouwmuurisolatie zijn koude buitenmuren, tochtbeleving en hoge energievraag vaak de kerngegevens binnen isolatiewerk.",
          "Wie signalen dat isolatieverbetering zinvol is — spouwmuurisolatie serieus laat beoordelen door een isolatiespecialist, heeft meestal minder kans op onverwachte bijsturing en onnodig warmteverlies en comfortklachten."
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
          "Dit onderdeel, waardoor comfortverlies en warmteverlies ontstaan — spouwmuurisolatie, is belangrijk omdat hier de praktische haalbaarheid wordt bepaald.",
          "Tijdens waardoor comfortverlies en warmteverlies ontstaan — spouwmuurisolatie geven lege spouw, onregelmatige vulling en vochtbelasting richting aan materiaalkeuzes, werkvolgorde en planning in isolatiewerk.",
          "Juist in waardoor comfortverlies en warmteverlies ontstaan — spouwmuurisolatie kan een isolatiespecialist onderscheid maken tussen tijdelijke verlichting en een aanpak die onnodig warmteverlies en comfortklachten op langere termijn verkleint."
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
          "Dit onderdeel, wat een isolatiespecialist beoordeelt vóór uitvoering (spouwmuurisolatie) — spouwmuurisolatie, is belangrijk omdat hier de praktische haalbaarheid wordt bepaald.",
          "Tijdens wat een isolatiespecialist beoordeelt vóór uitvoering (spouwmuurisolatie) — spouwmuurisolatie geven spouwconditie beoordelen, geschikt materiaal inblazen en controle op resultaat richting aan materiaalkeuzes, werkvolgorde en planning in isolatiewerk.",
          "Juist in wat een isolatiespecialist beoordeelt vóór uitvoering (spouwmuurisolatie) — spouwmuurisolatie kan een isolatiespecialist onderscheid maken tussen tijdelijke verlichting en een aanpak die onnodig warmteverlies en comfortklachten op langere termijn verkleint."
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
          "Keuzes in methode, materiaal en combinatiemaatregelen — spouwmuurisolatie maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Wie keuzes in methode, materiaal en combinatiemaatregelen — spouwmuurisolatie goed wil laten inschatten, doet er verstandig aan factoren zoals losse maatregel of onderdeel van bredere renovatie en combineren met gevel- of kozijnwerk direct te benoemen.",
          "Door keuzes in methode, materiaal en combinatiemaatregelen — spouwmuurisolatie vroeg te laten toetsen door een isolatiespecialist worden vervolgstappen consistenter en blijft onnodig warmteverlies en comfortklachten beter beheersbaar."
        ],
        "bullets": [
          "losse maatregel of onderdeel van bredere renovatie",
          "combineren met gevel- of kozijnwerk"
        ]
      },
      {
        "heading": "Welke woninginformatie je vooraf moet delen — spouwmuurisolatie",
        "paragraphs": [
          "Welke woninginformatie je vooraf moet delen — spouwmuurisolatie vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Punten zoals toegang, huidige staat en technische randvoorwaarden horen bij welke woninginformatie je vooraf moet delen — spouwmuurisolatie omdat ze veel zeggen over omvang, risico en benodigde stappen binnen isolatiewerk.",
          "Rond welke woninginformatie je vooraf moet delen — spouwmuurisolatie wordt vaak duidelijk dat goed voorwerk door een isolatiespecialist later herstel voorkomt en onnodig warmteverlies en comfortklachten reduceert."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en energiegebruik — spouwmuurisolatie",
        "paragraphs": [
          "Wat uitstel betekent voor comfort en energiegebruik — spouwmuurisolatie is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Voor een bruikbare beoordeling van wat uitstel betekent voor comfort en energiegebruik — spouwmuurisolatie zijn toegang, huidige staat en technische randvoorwaarden vaak de kerngegevens binnen isolatiewerk.",
          "Wie wat uitstel betekent voor comfort en energiegebruik — spouwmuurisolatie serieus laat beoordelen door een isolatiespecialist, heeft meestal minder kans op onverwachte bijsturing en onnodig warmteverlies en comfortklachten."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in de intake.",
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
        "answer": "Nee, je wordt gekoppeld aan een vakman met relevante ervaring."
      }
    ],
    "cta": {
      "title": "Beschrijf je spouwmuurisolatie-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met concrete details over spouwmuurisolatie, locatie en planning.",
      "label": "Start je aanvraag voor spouwmuurisolatie",
      "secondaryLabel": "Terug naar isolatie",
      "secondaryHref": "/isolatie"
    }
  },
  "isolatie/vloerisolatie": {
    "path": "/isolatie/vloerisolatie",
    "title": "Vloerisolatie via het platform",
    "description": "Vloerisolatie voor meer comfort: lees welke aanpak past bij jouw woning.",
    "keywords": [
      "isolatie",
      "vloerisolatie",
      "vakman",
      "VakConnect"
    ],
    "h1": "Vloerisolatie: vind een gespecialiseerde vakman op het platform",
    "intro": [
      "Zoek je hulp bij vloerisolatie? Via VakConnect kun je je situatie helder omschrijven en een professional met vakkennis vinden.",
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
          "Rond wanneer vloerisolatie in beeld komt ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Bij wanneer vloerisolatie in beeld komt worden factoren als toegang, huidige staat en technische randvoorwaarden meegewogen om keuzes in isolatiewerk technisch te onderbouwen.",
          "Een isolatiespecialist kijkt bij wanneer vloerisolatie in beeld komt meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en onnodig warmteverlies en comfortklachten beperkt blijft."
        ]
      },
      {
        "heading": "Signalen dat isolatieverbetering zinvol is — vloerisolatie",
        "paragraphs": [
          "Signalen dat isolatieverbetering zinvol is — vloerisolatie vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Voor een bruikbare beoordeling van signalen dat isolatieverbetering zinvol is — vloerisolatie zijn koude vloer, tocht langs plinten en vochtige kruipruimte vaak de kerngegevens binnen isolatiewerk.",
          "In de praktijk bepaalt signalen dat isolatieverbetering zinvol is — vloerisolatie vaak of een isolatiespecialist met beperkt herstel uitkomt of een bredere oplossing adviseert om onnodig warmteverlies en comfortklachten te vermijden."
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
          "Rond waardoor comfortverlies en warmteverlies ontstaan — vloerisolatie ontstaat meestal het onderscheid tussen kort herstel en structurele verbetering.",
          "Bij waardoor comfortverlies en warmteverlies ontstaan — vloerisolatie worden factoren als ongeïsoleerde vloer, koude lucht uit kruipruimte en vochtbelasting meegewogen om keuzes in isolatiewerk technisch te onderbouwen.",
          "Bij waardoor comfortverlies en warmteverlies ontstaan — vloerisolatie helpt een inhoudelijke beoordeling door een isolatiespecialist om verkeerde prioriteiten en daarmee onnodig warmteverlies en comfortklachten te voorkomen."
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
          "Wat een isolatiespecialist beoordeelt vóór uitvoering (vloerisolatie) — vloerisolatie voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Voor wat een isolatiespecialist beoordeelt vóór uitvoering (vloerisolatie) — vloerisolatie zijn kruipruimte inspecteren, geschikte isolatiemethode kiezen en uitvoering en controle relevant; juist daaruit blijkt hoeveel werk in isolatiewerk daadwerkelijk nodig is.",
          "Voor wat een isolatiespecialist beoordeelt vóór uitvoering (vloerisolatie) — vloerisolatie loont een vroege technische check door een isolatiespecialist, omdat je daarmee onnodig warmteverlies en comfortklachten en onnodige herstelrondes beperkt."
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
          "Keuzes in methode, materiaal en combinatiemaatregelen — vloerisolatie geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Ook bij keuzes in methode, materiaal en combinatiemaatregelen — vloerisolatie blijft de combinatie van vloer- of bodemgerichte aanpak en combineren met kruipruimte-isolatie bepalend voor keuzes en tempo binnen isolatiewerk.",
          "Wanneer keuzes in methode, materiaal en combinatiemaatregelen — vloerisolatie zorgvuldig wordt beoordeeld, kan een isolatiespecialist gerichter plannen en de kans op onnodig warmteverlies en comfortklachten terugdringen."
        ],
        "bullets": [
          "vloer- of bodemgerichte aanpak",
          "combineren met kruipruimte-isolatie"
        ]
      },
      {
        "heading": "Welke woninginformatie je vooraf moet delen — vloerisolatie",
        "paragraphs": [
          "Welke woninginformatie je vooraf moet delen — vloerisolatie maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Welke woninginformatie je vooraf moet delen — vloerisolatie wordt betrouwbaarder beoordeeld wanneer toegang, huidige staat en technische randvoorwaarden expliciet worden meegenomen in het beeld van isolatiewerk.",
          "Juist in welke woninginformatie je vooraf moet delen — vloerisolatie kan een isolatiespecialist onderscheid maken tussen tijdelijke verlichting en een aanpak die onnodig warmteverlies en comfortklachten op langere termijn verkleint."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en energiegebruik — vloerisolatie",
        "paragraphs": [
          "Wat uitstel betekent voor comfort en energiegebruik — vloerisolatie helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Wie wat uitstel betekent voor comfort en energiegebruik — vloerisolatie goed wil laten inschatten, doet er verstandig aan factoren zoals toegang, huidige staat en technische randvoorwaarden direct te benoemen.",
          "Een realistische keuze rond wat uitstel betekent voor comfort en energiegebruik — vloerisolatie ontstaat meestal pas nadat een isolatiespecialist de samenhang heeft beoordeeld; dat voorkomt later onnodig warmteverlies en comfortklachten."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe bij de intake.",
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over vloerisolatie, locatie en planning.",
      "label": "Vraag vloerisolatie aan",
      "secondaryLabel": "Terug naar isolatie",
      "secondaryHref": "/isolatie"
    }
  },
  "isolatie/gevelisolatie": {
    "path": "/isolatie/gevelisolatie",
    "title": "Gevelisolatie op VakConnect",
    "description": "Gevelisolatie plannen? Ontdek wanneer deze maatregel past en welke keuzes belangrijk zijn.",
    "keywords": [
      "isolatie",
      "gevelisolatie",
      "vakman",
      "VakConnect"
    ],
    "h1": "Gevelisolatie: vind een geschikte vakman met VakConnect",
    "intro": [
      "Zoek je hulp bij gevelisolatie? Op het platform kun je je situatie helder omschrijven en een vakman met relevante ervaring vinden.",
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
          "Bij wanneer gevelisolatie in beeld komt blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Voor een bruikbare beoordeling van wanneer gevelisolatie in beeld komt zijn toegang, huidige staat en technische randvoorwaarden vaak de kerngegevens binnen isolatiewerk.",
          "Wie wanneer gevelisolatie in beeld komt serieus laat beoordelen door een isolatiespecialist, heeft meestal minder kans op onverwachte bijsturing en onnodig warmteverlies en comfortklachten."
        ]
      },
      {
        "heading": "Signalen dat isolatieverbetering zinvol is — gevelisolatie",
        "paragraphs": [
          "Signalen dat isolatieverbetering zinvol is — gevelisolatie vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Voor een bruikbare beoordeling van signalen dat isolatieverbetering zinvol is — gevelisolatie zijn koude buitenwanden, hoge warmteverliezen en renovatie van gevelafwerking vaak de kerngegevens binnen isolatiewerk.",
          "Juist in signalen dat isolatieverbetering zinvol is — gevelisolatie kan een isolatiespecialist onderscheid maken tussen tijdelijke verlichting en een aanpak die onnodig warmteverlies en comfortklachten op langere termijn verkleint."
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
          "Bij waardoor comfortverlies en warmteverlies ontstaan — gevelisolatie blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Voor een bruikbare beoordeling van waardoor comfortverlies en warmteverlies ontstaan — gevelisolatie zijn onvoldoende isolatieschil, verouderde gevelopbouw en koudebruggen vaak de kerngegevens binnen isolatiewerk.",
          "Als waardoor comfortverlies en warmteverlies ontstaan — gevelisolatie te globaal wordt ingeschat, groeit de kans op misplanning; een isolatiespecialist kan dat vroegtijdig bijsturen en onnodig warmteverlies en comfortklachten helpen beperken."
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
          "Voor wat een isolatiespecialist beoordeelt vóór uitvoering (gevelisolatie) — gevelisolatie geldt dat kleine signalen vaak veel zeggen over het vervolg van de klus.",
          "Informatie over gevelsituatie analyseren, systeemkeuze en detaillering bepalen en uitvoering met nette aansluitingen voorkomt ruis bij wat een isolatiespecialist beoordeelt vóór uitvoering (gevelisolatie) — gevelisolatie en maakt de aanpak binnen isolatiewerk beter vergelijkbaar.",
          "Wie wat een isolatiespecialist beoordeelt vóór uitvoering (gevelisolatie) — gevelisolatie serieus laat beoordelen door een isolatiespecialist, heeft meestal minder kans op onverwachte bijsturing en onnodig warmteverlies en comfortklachten."
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
          "Keuzes in methode, materiaal en combinatiemaatregelen — gevelisolatie is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Bij keuzes in methode, materiaal en combinatiemaatregelen — gevelisolatie vormen binnen- of buitengevelbenadering en combineren met kozijnproject meestal de basis voor een realistische werkinschatting in isolatiewerk.",
          "Wanneer keuzes in methode, materiaal en combinatiemaatregelen — gevelisolatie zorgvuldig wordt beoordeeld, kan een isolatiespecialist gerichter plannen en de kans op onnodig warmteverlies en comfortklachten terugdringen."
        ],
        "bullets": [
          "binnen- of buitengevelbenadering",
          "combineren met kozijnproject"
        ]
      },
      {
        "heading": "Welke woninginformatie je vooraf moet delen — gevelisolatie",
        "paragraphs": [
          "Welke woninginformatie je vooraf moet delen — gevelisolatie vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Bij welke woninginformatie je vooraf moet delen — gevelisolatie vormen toegang, huidige staat en technische randvoorwaarden meestal de basis voor een realistische werkinschatting in isolatiewerk.",
          "Wanneer welke woninginformatie je vooraf moet delen — gevelisolatie zorgvuldig wordt beoordeeld, kan een isolatiespecialist gerichter plannen en de kans op onnodig warmteverlies en comfortklachten terugdringen."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en energiegebruik — gevelisolatie",
        "paragraphs": [
          "Wat uitstel betekent voor comfort en energiegebruik — gevelisolatie maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Wie wat uitstel betekent voor comfort en energiegebruik — gevelisolatie goed wil laten inschatten, doet er verstandig aan factoren zoals toegang, huidige staat en technische randvoorwaarden direct te benoemen.",
          "Wanneer wat uitstel betekent voor comfort en energiegebruik — gevelisolatie zorgvuldig wordt beoordeeld, kan een isolatiespecialist gerichter plannen en de kans op onnodig warmteverlies en comfortklachten terugdringen."
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
        "answer": "Nee, VakConnect koppelt je aan een gespecialiseerde vakman."
      }
    ],
    "cta": {
      "title": "Beschrijf je gevelisolatie-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met concrete details over gevelisolatie, locatie en planning.",
      "label": "Beschrijf je gevelisolatieklus",
      "secondaryLabel": "Terug naar isolatie",
      "secondaryHref": "/isolatie"
    }
  },
  "isolatie/kruipruimte-isolatie": {
    "path": "/isolatie/kruipruimte-isolatie",
    "title": "Kruipruimte isolatie via het platform",
    "description": "Kruipruimte isoleren voor meer comfort en minder vochtimpact in huis.",
    "keywords": [
      "isolatie",
      "kruipruimte-isolatie",
      "vakman",
      "VakConnect"
    ],
    "h1": "Kruipruimte isolatie: vind een professional met vakkennis op het platform",
    "intro": [
      "Zoek je hulp bij kruipruimte isolatie? Op VakConnect kun je je situatie helder omschrijven en een geschikte vakman vinden.",
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
          "Wanneer kruipruimte isolatie in beeld komt maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Bij wanneer kruipruimte isolatie in beeld komt worden factoren als toegang, huidige staat en technische randvoorwaarden meegewogen om keuzes in isolatiewerk technisch te onderbouwen.",
          "Rond wanneer kruipruimte isolatie in beeld komt wordt vaak duidelijk dat goed voorwerk door een isolatiespecialist later herstel voorkomt en onnodig warmteverlies en comfortklachten reduceert."
        ]
      },
      {
        "heading": "Signalen dat isolatieverbetering zinvol is — kruipruimte isolatie",
        "paragraphs": [
          "Bij signalen dat isolatieverbetering zinvol is — kruipruimte isolatie blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Voor een bruikbare beoordeling van signalen dat isolatieverbetering zinvol is — kruipruimte isolatie zijn koude trek op begane grond, vochtige lucht en muffe geur vaak de kerngegevens binnen isolatiewerk.",
          "Als signalen dat isolatieverbetering zinvol is — kruipruimte isolatie te globaal wordt ingeschat, groeit de kans op misplanning; een isolatiespecialist kan dat vroegtijdig bijsturen en onnodig warmteverlies en comfortklachten helpen beperken."
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
          "Waardoor comfortverlies en warmteverlies ontstaan — kruipruimte isolatie voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Tijdens waardoor comfortverlies en warmteverlies ontstaan — kruipruimte isolatie geven onvoldoende isolatie, hoge vochtbelasting en beperkte ventilatie richting aan materiaalkeuzes, werkvolgorde en planning in isolatiewerk.",
          "Als waardoor comfortverlies en warmteverlies ontstaan — kruipruimte isolatie te globaal wordt ingeschat, groeit de kans op misplanning; een isolatiespecialist kan dat vroegtijdig bijsturen en onnodig warmteverlies en comfortklachten helpen beperken."
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
          "Wat een isolatiespecialist beoordeelt vóór uitvoering (kruipruimte isolatie) — kruipruimte isolatie voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Informatie over toegang en staat beoordelen, methode kiezen en uitvoering en controle voorkomt ruis bij wat een isolatiespecialist beoordeelt vóór uitvoering (kruipruimte isolatie) — kruipruimte isolatie en maakt de aanpak binnen isolatiewerk beter vergelijkbaar.",
          "Juist in wat een isolatiespecialist beoordeelt vóór uitvoering (kruipruimte isolatie) — kruipruimte isolatie kan een isolatiespecialist onderscheid maken tussen tijdelijke verlichting en een aanpak die onnodig warmteverlies en comfortklachten op langere termijn verkleint."
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
          "In keuzes in methode, materiaal en combinatiemaatregelen — kruipruimte isolatie zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Keuzes in methode, materiaal en combinatiemaatregelen — kruipruimte isolatie wordt inhoudelijk sterker zodra bodem- of vloerisolatie en combinatie met ventilatiemaatregelen niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Bij keuzes in methode, materiaal en combinatiemaatregelen — kruipruimte isolatie is het voordeel van een isolatiespecialist vooral dat keuzes in uitvoering en timing meteen op onnodig warmteverlies en comfortklachten worden getoetst."
        ],
        "bullets": [
          "bodem- of vloerisolatie",
          "combinatie met ventilatiemaatregelen"
        ]
      },
      {
        "heading": "Welke woninginformatie je vooraf moet delen — kruipruimte isolatie",
        "paragraphs": [
          "Dit onderdeel, welke woninginformatie je vooraf moet delen — kruipruimte isolatie, is belangrijk omdat hier de praktische haalbaarheid wordt bepaald.",
          "Informatie over toegang, huidige staat en technische randvoorwaarden voorkomt ruis bij welke woninginformatie je vooraf moet delen — kruipruimte isolatie en maakt de aanpak binnen isolatiewerk beter vergelijkbaar.",
          "Wie welke woninginformatie je vooraf moet delen — kruipruimte isolatie serieus laat beoordelen door een isolatiespecialist, heeft meestal minder kans op onverwachte bijsturing en onnodig warmteverlies en comfortklachten."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en energiegebruik — kruipruimte isolatie",
        "paragraphs": [
          "Voor wat uitstel betekent voor comfort en energiegebruik — kruipruimte isolatie geldt dat kleine signalen vaak veel zeggen over het vervolg van de klus.",
          "Ook bij wat uitstel betekent voor comfort en energiegebruik — kruipruimte isolatie blijft de combinatie van toegang, huidige staat en technische randvoorwaarden bepalend voor keuzes en tempo binnen isolatiewerk.",
          "Wanneer wat uitstel betekent voor comfort en energiegebruik — kruipruimte isolatie zorgvuldig wordt beoordeeld, kan een isolatiespecialist gerichter plannen en de kans op onnodig warmteverlies en comfortklachten terugdringen."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe bij je aanvraag.",
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
        "answer": "Nee, je wordt gekoppeld aan een vakman met relevante ervaring."
      }
    ],
    "cta": {
      "title": "Beschrijf je kruipruimte isolatie-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met concrete details over kruipruimte isolatie, locatie en planning.",
      "label": "Vraag kruipruimte-isolatie aan",
      "secondaryLabel": "Terug naar isolatie",
      "secondaryHref": "/isolatie"
    }
  },
  "verbouwing/aanbouw": {
    "path": "/verbouwing/aanbouw",
    "title": "Aanbouw op VakConnect",
    "description": "Aanbouw plannen? Lees welke keuzes en voorbereidingen bepalend zijn voor een haalbaar project.",
    "keywords": [
      "verbouwing",
      "aanbouw",
      "vakman",
      "VakConnect"
    ],
    "h1": "Aanbouw: vind een gespecialiseerde vakman met VakConnect",
    "intro": [
      "Zoek je hulp bij aanbouw? Met VakConnect kun je je situatie helder omschrijven en een professional met vakkennis vinden.",
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
          "Een aanbouwtraject draait om extra leefruimte, maar begint technisch bij haalbaarheid en samenhang met de bestaande woning.",
          "Constructie, fundering, aansluiting op gevel en routing van installaties moeten vroeg in beeld komen.",
          "Zonder die basis schuiven keuzes in indeling en afwerking later vaak op."
        ]
      },
      {
        "heading": "Wanneer een verbouwing meestal in beeld komt — aanbouw",
        "paragraphs": [
          "Bij aanbouw lopen disciplines door elkaar: ruwbouw, kozijnen, dak, installaties en afwerking.",
          "Een realistische fasering voorkomt wachttijd tussen vakgebieden en beperkt improvisatie op de bouwplaats.",
          "Dat maakt zowel planning als kosten beter voorspelbaar."
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
          "Afhankelijk van ontwerp en locatie kunnen vergunning of constructieve berekeningen nodig zijn.",
          "Het is verstandig om die randvoorwaarden vroeg te toetsen zodat uitvoering niet stilvalt in de voorbereidingsfase.",
          "Noem in de intake daarom maatvoering, gewenste functie en huidige situatie van de achtergevel."
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
          "Eerste beoordeling door een verbouwspecialist (aanbouw) — aanbouw maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Eerste beoordeling door een verbouwspecialist (aanbouw) — aanbouw wordt inhoudelijk sterker zodra scope en haalbaarheid bepalen, bouwkundige voorbereiding en uitvoering en aansluiting op bestaande woning niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Bij eerste beoordeling door een verbouwspecialist (aanbouw) — aanbouw is het voordeel van een verbouwspecialist vooral dat keuzes in uitvoering en timing meteen op planning-uitloop en aanvullende herstelposten worden getoetst."
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
          "In keuzes in fasering, scope en combinatieklussen — aanbouw zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Bij keuzes in fasering, scope en combinatieklussen — aanbouw worden factoren als compacte of ruime aanbouw, fasering van project en combinatie met installatiewerk meegewogen om keuzes in verbouwtrajecten technisch te onderbouwen.",
          "Bij keuzes in fasering, scope en combinatieklussen — aanbouw helpt een inhoudelijke beoordeling door een verbouwspecialist om verkeerde prioriteiten en daarmee planning-uitloop en aanvullende herstelposten te voorkomen."
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
          "Welke projectinformatie je aanvraag sterker maakt — aanbouw is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Punten zoals toegang, huidige staat en technische randvoorwaarden horen bij welke projectinformatie je aanvraag sterker maakt — aanbouw omdat ze veel zeggen over omvang, risico en benodigde stappen binnen verbouwtrajecten.",
          "Een verbouwspecialist kijkt bij welke projectinformatie je aanvraag sterker maakt — aanbouw meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en planning-uitloop en aanvullende herstelposten beperkt blijft."
        ]
      },
      {
        "heading": "Risico’s van uitstel of onduidelijke scope — aanbouw",
        "paragraphs": [
          "In risico’s van uitstel of onduidelijke scope — aanbouw zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Risico’s van uitstel of onduidelijke scope — aanbouw wordt betrouwbaarder beoordeeld wanneer toegang, huidige staat en technische randvoorwaarden expliciet worden meegenomen in het beeld van verbouwtrajecten.",
          "Juist in risico’s van uitstel of onduidelijke scope — aanbouw kan een verbouwspecialist onderscheid maken tussen tijdelijke verlichting en een aanpak die planning-uitloop en aanvullende herstelposten op langere termijn verkleint."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe bij de intake.",
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
        "answer": "Nee, VakConnect koppelt je aan een geschikte vakman."
      }
    ],
    "cta": {
      "title": "Beschrijf je aanbouw-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met concrete details over aanbouw, locatie en planning.",
      "label": "Start je aanvraag voor aanbouw",
      "secondaryLabel": "Terug naar verbouwing",
      "secondaryHref": "/verbouwing"
    }
  },
  "verbouwing/uitbouw": {
    "path": "/verbouwing/uitbouw",
    "title": "Uitbouw via het platform",
    "description": "Uitbouw realiseren voor meer leefruimte: ontdek de belangrijkste technische en praktische aandachtspunten.",
    "keywords": [
      "verbouwing",
      "uitbouw",
      "vakman",
      "VakConnect"
    ],
    "h1": "Uitbouw: vind een vakman met relevante ervaring op het platform",
    "intro": [
      "Zoek je hulp bij uitbouw? Via VakConnect kun je je situatie helder omschrijven en een gespecialiseerde vakman vinden.",
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
          "In wanneer uitbouw in beeld komt zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Wanneer uitbouw in beeld komt wordt betrouwbaarder beoordeeld wanneer toegang, huidige staat en technische randvoorwaarden expliciet worden meegenomen in het beeld van verbouwtrajecten.",
          "Juist in wanneer uitbouw in beeld komt kan een verbouwspecialist onderscheid maken tussen tijdelijke verlichting en een aanpak die planning-uitloop en aanvullende herstelposten op langere termijn verkleint."
        ]
      },
      {
        "heading": "Wanneer een verbouwing meestal in beeld komt — uitbouw",
        "paragraphs": [
          "Wanneer een verbouwing meestal in beeld komt — uitbouw voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Tijdens wanneer een verbouwing meestal in beeld komt — uitbouw geven te beperkte woonkeuken, krappe woonkamer en wens voor open plattegrond richting aan materiaalkeuzes, werkvolgorde en planning in verbouwtrajecten.",
          "Als wanneer een verbouwing meestal in beeld komt — uitbouw te globaal wordt ingeschat, groeit de kans op misplanning; een verbouwspecialist kan dat vroegtijdig bijsturen en planning-uitloop en aanvullende herstelposten helpen beperken."
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
          "Oorzaken van knelpunten in ruimte of woninggebruik — uitbouw helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Wie oorzaken van knelpunten in ruimte of woninggebruik — uitbouw goed wil laten inschatten, doet er verstandig aan factoren zoals huidige woningindeling en nieuwe gebruiksbehoeften direct te benoemen.",
          "Door oorzaken van knelpunten in ruimte of woninggebruik — uitbouw vroeg te laten toetsen door een verbouwspecialist worden vervolgstappen consistenter en blijft planning-uitloop en aanvullende herstelposten beter beheersbaar."
        ],
        "bullets": [
          "huidige woningindeling",
          "nieuwe gebruiksbehoeften"
        ]
      },
      {
        "heading": "Eerste beoordeling door een verbouwspecialist (uitbouw) — uitbouw",
        "paragraphs": [
          "Eerste beoordeling door een verbouwspecialist (uitbouw) — uitbouw vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Punten zoals mogelijkheden verkennen, constructie en afwerking plannen en uitvoering met installatiewerk afstemmen horen bij eerste beoordeling door een verbouwspecialist (uitbouw) — uitbouw omdat ze veel zeggen over omvang, risico en benodigde stappen binnen verbouwtrajecten.",
          "Voor eerste beoordeling door een verbouwspecialist (uitbouw) — uitbouw loont een vroege technische check door een verbouwspecialist, omdat je daarmee planning-uitloop en aanvullende herstelposten en onnodige herstelrondes beperkt."
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
          "In keuzes in fasering, scope en combinatieklussen — uitbouw zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Bij keuzes in fasering, scope en combinatieklussen — uitbouw worden factoren als kleine of grote uitbreiding, combinatie met keukenverbouwing en gefaseerde aanpak meegewogen om keuzes in verbouwtrajecten technisch te onderbouwen.",
          "Bij keuzes in fasering, scope en combinatieklussen — uitbouw helpt een inhoudelijke beoordeling door een verbouwspecialist om verkeerde prioriteiten en daarmee planning-uitloop en aanvullende herstelposten te voorkomen."
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
          "Welke projectinformatie je aanvraag sterker maakt — uitbouw is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Punten zoals toegang, huidige staat en technische randvoorwaarden horen bij welke projectinformatie je aanvraag sterker maakt — uitbouw omdat ze veel zeggen over omvang, risico en benodigde stappen binnen verbouwtrajecten.",
          "Voor welke projectinformatie je aanvraag sterker maakt — uitbouw loont een vroege technische check door een verbouwspecialist, omdat je daarmee planning-uitloop en aanvullende herstelposten en onnodige herstelrondes beperkt."
        ]
      },
      {
        "heading": "Risico’s van uitstel of onduidelijke scope — uitbouw",
        "paragraphs": [
          "Bij risico’s van uitstel of onduidelijke scope — uitbouw blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Voor een bruikbare beoordeling van risico’s van uitstel of onduidelijke scope — uitbouw zijn toegang, huidige staat en technische randvoorwaarden vaak de kerngegevens binnen verbouwtrajecten.",
          "Wie risico’s van uitstel of onduidelijke scope — uitbouw serieus laat beoordelen door een verbouwspecialist, heeft meestal minder kans op onverwachte bijsturing en planning-uitloop en aanvullende herstelposten."
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over uitbouw, locatie en planning.",
      "label": "Vraag een specialist voor uitbouw",
      "secondaryLabel": "Terug naar verbouwing",
      "secondaryHref": "/verbouwing"
    }
  },
  "verbouwing/zolder-verbouwen": {
    "path": "/verbouwing/zolder-verbouwen",
    "title": "Zolder verbouwen op VakConnect",
    "description": "Van opslag naar leefruimte: lees hoe je een zolderverbouwing slim voorbereidt.",
    "keywords": [
      "verbouwing",
      "zolder-verbouwen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Zolder verbouwen: vind een professional met vakkennis met VakConnect",
    "intro": [
      "Zoek je hulp bij zolder verbouwen? Op het platform kun je je situatie helder omschrijven en een geschikte vakman vinden.",
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
          "Wanneer zolder verbouwen in beeld komt maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Wanneer zolder verbouwen in beeld komt wordt inhoudelijk sterker zodra toegang, huidige staat en technische randvoorwaarden niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Bij wanneer zolder verbouwen in beeld komt is het voordeel van een verbouwspecialist vooral dat keuzes in uitvoering en timing meteen op planning-uitloop en aanvullende herstelposten worden getoetst."
        ]
      },
      {
        "heading": "Wanneer een verbouwing meestal in beeld komt — zolder verbouwen",
        "paragraphs": [
          "Voor wanneer een verbouwing meestal in beeld komt — zolder verbouwen geldt dat kleine signalen vaak veel zeggen over het vervolg van de klus.",
          "Informatie over onbenutte ruimte, tekort aan kamers en comfortproblemen op zolder voorkomt ruis bij wanneer een verbouwing meestal in beeld komt — zolder verbouwen en maakt de aanpak binnen verbouwtrajecten beter vergelijkbaar.",
          "Wie wanneer een verbouwing meestal in beeld komt — zolder verbouwen serieus laat beoordelen door een verbouwspecialist, heeft meestal minder kans op onverwachte bijsturing en planning-uitloop en aanvullende herstelposten."
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
          "Dit onderdeel, oorzaken van knelpunten in ruimte of woninggebruik — zolder verbouwen, is belangrijk omdat hier de praktische haalbaarheid wordt bepaald.",
          "Ook bij oorzaken van knelpunten in ruimte of woninggebruik — zolder verbouwen blijft de combinatie van gebrek aan isolatie, onpraktische indeling en onvoldoende licht of elektra bepalend voor keuzes en tempo binnen verbouwtrajecten.",
          "Wanneer oorzaken van knelpunten in ruimte of woninggebruik — zolder verbouwen zorgvuldig wordt beoordeeld, kan een verbouwspecialist gerichter plannen en de kans op planning-uitloop en aanvullende herstelposten terugdringen."
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
          "Bij eerste beoordeling door een verbouwspecialist (zolder verbouwen) — zolder verbouwen blijkt in de praktijk vaak dat details op locatie bepalend zijn voor de juiste aanpak.",
          "Voor een bruikbare beoordeling van eerste beoordeling door een verbouwspecialist (zolder verbouwen) — zolder verbouwen zijn functiedoel bepalen, isolatie en installaties afstemmen en afbouw voor dagelijks gebruik vaak de kerngegevens binnen verbouwtrajecten.",
          "Juist in eerste beoordeling door een verbouwspecialist (zolder verbouwen) — zolder verbouwen kan een verbouwspecialist onderscheid maken tussen tijdelijke verlichting en een aanpak die planning-uitloop en aanvullende herstelposten op langere termijn verkleint."
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
          "Keuzes in fasering, scope en combinatieklussen — zolder verbouwen is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Bij keuzes in fasering, scope en combinatieklussen — zolder verbouwen vormen slaapkamer, werkplek of multifunctioneel en combinatie met dakisolatie meestal de basis voor een realistische werkinschatting in verbouwtrajecten.",
          "Een realistische keuze rond keuzes in fasering, scope en combinatieklussen — zolder verbouwen ontstaat meestal pas nadat een verbouwspecialist de samenhang heeft beoordeeld; dat voorkomt later planning-uitloop en aanvullende herstelposten."
        ],
        "bullets": [
          "slaapkamer, werkplek of multifunctioneel",
          "combinatie met dakisolatie"
        ]
      },
      {
        "heading": "Welke projectinformatie je aanvraag sterker maakt — zolder verbouwen",
        "paragraphs": [
          "In welke projectinformatie je aanvraag sterker maakt — zolder verbouwen zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Bij welke projectinformatie je aanvraag sterker maakt — zolder verbouwen worden factoren als toegang, huidige staat en technische randvoorwaarden meegewogen om keuzes in verbouwtrajecten technisch te onderbouwen.",
          "Een verbouwspecialist kijkt bij welke projectinformatie je aanvraag sterker maakt — zolder verbouwen meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en planning-uitloop en aanvullende herstelposten beperkt blijft."
        ]
      },
      {
        "heading": "Risico’s van uitstel of onduidelijke scope — zolder verbouwen",
        "paragraphs": [
          "Risico’s van uitstel of onduidelijke scope — zolder verbouwen vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Bij risico’s van uitstel of onduidelijke scope — zolder verbouwen vormen toegang, huidige staat en technische randvoorwaarden meestal de basis voor een realistische werkinschatting in verbouwtrajecten.",
          "Bij risico’s van uitstel of onduidelijke scope — zolder verbouwen is het voordeel van een verbouwspecialist vooral dat keuzes in uitvoering en timing meteen op planning-uitloop en aanvullende herstelposten worden getoetst."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe bij je aanvraag.",
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
        "answer": "Nee, VakConnect koppelt je aan een vakman met relevante ervaring."
      }
    ],
    "cta": {
      "title": "Beschrijf je zolder verbouwen-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met concrete details over zolder verbouwen, locatie en planning.",
      "label": "Plaats je zolderverbouwing-aanvraag",
      "secondaryLabel": "Terug naar verbouwing",
      "secondaryHref": "/verbouwing"
    }
  },
  "verbouwing/woning-renoveren": {
    "path": "/verbouwing/woning-renoveren",
    "title": "Woning renoveren via het platform",
    "description": "Woningrenovatie in fases of totaal: krijg grip op prioriteiten, volgorde en uitvoering.",
    "keywords": [
      "verbouwing",
      "woning-renoveren",
      "vakman",
      "VakConnect"
    ],
    "h1": "Woning renoveren: vind een gespecialiseerde vakman op het platform",
    "intro": [
      "Zoek je hulp bij woning renoveren? Op VakConnect kun je je situatie helder omschrijven en een professional met vakkennis vinden.",
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
          "Wanneer woning renoveren in beeld komt voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Informatie over toegang, huidige staat en technische randvoorwaarden voorkomt ruis bij wanneer woning renoveren in beeld komt en maakt de aanpak binnen verbouwtrajecten beter vergelijkbaar.",
          "Wie wanneer woning renoveren in beeld komt serieus laat beoordelen door een verbouwspecialist, heeft meestal minder kans op onverwachte bijsturing en planning-uitloop en aanvullende herstelposten."
        ]
      },
      {
        "heading": "Wanneer een verbouwing meestal in beeld komt — woning renoveren",
        "paragraphs": [
          "In wanneer een verbouwing meestal in beeld komt — woning renoveren zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Bij wanneer een verbouwing meestal in beeld komt — woning renoveren worden factoren als meerdere verouderde onderdelen, comfort- en onderhoudsproblemen en installaties voldoen niet meer meegewogen om keuzes in verbouwtrajecten technisch te onderbouwen.",
          "Een verbouwspecialist kijkt bij wanneer een verbouwing meestal in beeld komt — woning renoveren meestal naar de volgorde van ingrepen, zodat herstel niet later alsnog moet worden overgedaan en planning-uitloop en aanvullende herstelposten beperkt blijft."
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
          "Dit onderdeel, oorzaken van knelpunten in ruimte of woninggebruik — woning renoveren, is belangrijk omdat hier de praktische haalbaarheid wordt bepaald.",
          "Voor oorzaken van knelpunten in ruimte of woninggebruik — woning renoveren zijn achterstallig onderhoud, technische veroudering en gewijzigde woonwensen relevant; juist daaruit blijkt hoeveel werk in verbouwtrajecten daadwerkelijk nodig is.",
          "Bij oorzaken van knelpunten in ruimte of woninggebruik — woning renoveren helpt een inhoudelijke beoordeling door een verbouwspecialist om verkeerde prioriteiten en daarmee planning-uitloop en aanvullende herstelposten te voorkomen."
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
          "Eerste beoordeling door een verbouwspecialist (woning renoveren) — woning renoveren geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Voor eerste beoordeling door een verbouwspecialist (woning renoveren) — woning renoveren zijn prioriteiten stellen, fasering bepalen en uitvoering en controle per fase relevant; juist daaruit blijkt hoeveel werk in verbouwtrajecten daadwerkelijk nodig is.",
          "Rond eerste beoordeling door een verbouwspecialist (woning renoveren) — woning renoveren wordt vaak duidelijk dat goed voorwerk door een verbouwspecialist later herstel voorkomt en planning-uitloop en aanvullende herstelposten reduceert."
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
          "Keuzes in fasering, scope en combinatieklussen — woning renoveren geeft richting aan scope, volgorde en de mate van voorbereiding die nodig is.",
          "Informatie over ruimtegerichte planning, combineren met isolatie en kozijnen en deelrenovatie versus totaalproject voorkomt ruis bij keuzes in fasering, scope en combinatieklussen — woning renoveren en maakt de aanpak binnen verbouwtrajecten beter vergelijkbaar.",
          "In de praktijk bepaalt keuzes in fasering, scope en combinatieklussen — woning renoveren vaak of een verbouwspecialist met beperkt herstel uitkomt of een bredere oplossing adviseert om planning-uitloop en aanvullende herstelposten te vermijden."
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
          "In welke projectinformatie je aanvraag sterker maakt — woning renoveren zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Bij welke projectinformatie je aanvraag sterker maakt — woning renoveren worden factoren als toegang, huidige staat en technische randvoorwaarden meegewogen om keuzes in verbouwtrajecten technisch te onderbouwen.",
          "Voor welke projectinformatie je aanvraag sterker maakt — woning renoveren loont een vroege technische check door een verbouwspecialist, omdat je daarmee planning-uitloop en aanvullende herstelposten en onnodige herstelrondes beperkt."
        ]
      },
      {
        "heading": "Risico’s van uitstel of onduidelijke scope — woning renoveren",
        "paragraphs": [
          "Risico’s van uitstel of onduidelijke scope — woning renoveren maakt zichtbaar welke factoren je vooraf moet uitzoeken om realistische offertes te krijgen.",
          "Risico’s van uitstel of onduidelijke scope — woning renoveren wordt inhoudelijk sterker zodra toegang, huidige staat en technische randvoorwaarden niet als losse punten maar als samenhangend geheel worden bekeken.",
          "Een realistische keuze rond risico’s van uitstel of onduidelijke scope — woning renoveren ontstaat meestal pas nadat een verbouwspecialist de samenhang heeft beoordeeld; dat voorkomt later planning-uitloop en aanvullende herstelposten."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe in de intake.",
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
      "description": "Plaats je aanvraag op /aanvraag met concrete details over woning renoveren, locatie en planning.",
      "label": "Start je woningrenovatie-aanvraag",
      "secondaryLabel": "Terug naar verbouwing",
      "secondaryHref": "/verbouwing"
    }
  },
  "verbouwing/keuken-verbouwen": {
    "path": "/verbouwing/keuken-verbouwen",
    "title": "Keuken verbouwen op VakConnect",
    "description": "Keuken verbouwen met aandacht voor indeling, aansluitingen en praktische planning.",
    "keywords": [
      "verbouwing",
      "keuken-verbouwen",
      "vakman",
      "VakConnect"
    ],
    "h1": "Keuken verbouwen: vind een geschikte vakman met VakConnect",
    "intro": [
      "Zoek je hulp bij keuken verbouwen? Met VakConnect kun je je situatie helder omschrijven en een vakman met relevante ervaring vinden.",
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
          "Wanneer keuken verbouwen in beeld komt voorkomt dat je op basis van algemene aannames een te smalle of juist te grote ingreep kiest.",
          "Tijdens wanneer keuken verbouwen in beeld komt geven toegang, huidige staat en technische randvoorwaarden richting aan materiaalkeuzes, werkvolgorde en planning in verbouwtrajecten.",
          "Juist in wanneer keuken verbouwen in beeld komt kan een verbouwspecialist onderscheid maken tussen tijdelijke verlichting en een aanpak die planning-uitloop en aanvullende herstelposten op langere termijn verkleint."
        ]
      },
      {
        "heading": "Wanneer een verbouwing meestal in beeld komt — keuken verbouwen",
        "paragraphs": [
          "In wanneer een verbouwing meestal in beeld komt — keuken verbouwen zie je vaak het verschil tussen symptomen en de werkelijke oorzaak van het probleem.",
          "Bij wanneer een verbouwing meestal in beeld komt — keuken verbouwen worden factoren als onpraktische opstelling, verouderde apparatuur en te weinig werkruimte meegewogen om keuzes in verbouwtrajecten technisch te onderbouwen.",
          "Voor wanneer een verbouwing meestal in beeld komt — keuken verbouwen loont een vroege technische check door een verbouwspecialist, omdat je daarmee planning-uitloop en aanvullende herstelposten en onnodige herstelrondes beperkt."
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
          "In het onderdeel oorzaken van knelpunten in ruimte of woninggebruik — keuken verbouwen worden technische aannames getoetst aan wat er in de woning echt aanwezig is.",
          "Bij oorzaken van knelpunten in ruimte of woninggebruik — keuken verbouwen vormen gewijzigde gebruikswensen, technische beperkingen oude keuken en slijtage meestal de basis voor een realistische werkinschatting in verbouwtrajecten.",
          "Een realistische keuze rond oorzaken van knelpunten in ruimte of woninggebruik — keuken verbouwen ontstaat meestal pas nadat een verbouwspecialist de samenhang heeft beoordeeld; dat voorkomt later planning-uitloop en aanvullende herstelposten."
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
          "Eerste beoordeling door een verbouwspecialist (keuken verbouwen) — keuken verbouwen vraagt vooral om een nuchtere inventarisatie van de huidige situatie voordat er keuzes worden vastgelegd.",
          "Bij eerste beoordeling door een verbouwspecialist (keuken verbouwen) — keuken verbouwen vormen huidige situatie opnemen, leiding- en elektra-aanpassingen plannen en plaatsing en afwerking meestal de basis voor een realistische werkinschatting in verbouwtrajecten.",
          "Wanneer eerste beoordeling door een verbouwspecialist (keuken verbouwen) — keuken verbouwen zorgvuldig wordt beoordeeld, kan een verbouwspecialist gerichter plannen en de kans op planning-uitloop en aanvullende herstelposten terugdringen."
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
          "Keuzes in fasering, scope en combinatieklussen — keuken verbouwen helpt om verwachtingen over resultaat en doorlooptijd vroeg te concretiseren.",
          "Keuzes in fasering, scope en combinatieklussen — keuken verbouwen wordt betrouwbaarder beoordeeld wanneer gedeeltelijke update of complete verbouwing, hergebruik van onderdelen of volledig nieuw en combinatie met uitbouw expliciet worden meegenomen in het beeld van verbouwtrajecten.",
          "Juist in keuzes in fasering, scope en combinatieklussen — keuken verbouwen kan een verbouwspecialist onderscheid maken tussen tijdelijke verlichting en een aanpak die planning-uitloop en aanvullende herstelposten op langere termijn verkleint."
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
          "Voor welke projectinformatie je aanvraag sterker maakt — keuken verbouwen geldt dat kleine signalen vaak veel zeggen over het vervolg van de klus.",
          "Voor welke projectinformatie je aanvraag sterker maakt — keuken verbouwen zijn toegang, huidige staat en technische randvoorwaarden relevant; juist daaruit blijkt hoeveel werk in verbouwtrajecten daadwerkelijk nodig is.",
          "Rond welke projectinformatie je aanvraag sterker maakt — keuken verbouwen wordt vaak duidelijk dat goed voorwerk door een verbouwspecialist later herstel voorkomt en planning-uitloop en aanvullende herstelposten reduceert."
        ]
      },
      {
        "heading": "Risico’s van uitstel of onduidelijke scope — keuken verbouwen",
        "paragraphs": [
          "Risico’s van uitstel of onduidelijke scope — keuken verbouwen is meestal het moment waarop duidelijk wordt wat direct moet en wat je slim kunt plannen.",
          "Elementen zoals toegang, huidige staat en technische randvoorwaarden maken risico’s van uitstel of onduidelijke scope — keuken verbouwen concreet en helpen om scope in verbouwtrajecten af te bakenen.",
          "Bij risico’s van uitstel of onduidelijke scope — keuken verbouwen helpt een inhoudelijke beoordeling door een verbouwspecialist om verkeerde prioriteiten en daarmee planning-uitloop en aanvullende herstelposten te voorkomen."
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
      "Voeg foto’s, bereikbaarheid en gewenste planning toe bij de intake.",
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
        "answer": "Nee, je wordt gekoppeld aan een gespecialiseerde vakman."
      }
    ],
    "cta": {
      "title": "Beschrijf je keuken verbouwen-klus en vind een passende vakman",
      "description": "Plaats je aanvraag op /aanvraag met concrete details over keuken verbouwen, locatie en planning.",
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

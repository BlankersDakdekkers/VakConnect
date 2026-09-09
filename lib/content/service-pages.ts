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
          "Bezoekers op deze pagina zoeken meestal duidelijkheid over de stap tussen eerste klacht en een haalbare oplossing. Voor dakdekker telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "In de praktijk zien we dat aanvragen vaak starten vanuit concrete situaties zoals actieve daklekkage, periodiek onderhoud bij ouder dak en stormschade aan pannen of nok. Een duidelijke omschrijving van de huidige toestand helpt om sneller een passende specialist te koppelen.",
          "Beschrijf daarom niet alleen het probleem, maar ook de impact op gebruik, comfort en planning. Dat maakt je aanvraag inhoudelijk sterker en beter vergelijkbaar voor aangesloten vakmensen."
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
          "Bij dakdekker-klussen is een goede diagnose vaak bepalend voor het vervolg. Zonder heldere beoordeling bestaat de kans dat alleen het symptoom wordt aangepakt. Voor dakdekker telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Een specialist kijkt doorgaans naar samenhang tussen zichtbare schade, onderliggende oorzaak en bereikbaarheid van de werklocatie.",
          "Via VakConnect kun je vooraf relevante context delen, zodat de eerste beoordeling direct specifieker wordt."
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
          "Niet elke situatie vraagt meteen om de grootste ingreep. Vaak is de beste keuze afhankelijk van staat, doel en planning van de woning. Voor dakdekker telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Wanneer meerdere onderdelen tegelijk aandacht vragen, kan een gefaseerde aanpak logisch zijn. In andere gevallen bespaart één integrale ingreep juist tijd en afstemming.",
          "Door je prioriteiten in de aanvraag te benoemen, kan een professional beter meedenken over een haalbare route."
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
          "Goede voorbereiding voorkomt onduidelijkheid in de eerste contactfase. Denk aan foto’s, afmetingen, eerdere reparaties en gewenste timing. Voor dakdekker telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Geef ook aan of de klus samenhangt met andere werkzaamheden, zoals renovatie, isolatie of installatiewerk. Dat beïnvloedt vaak de volgorde van uitvoering.",
          "Hoe concreter je startinformatie, hoe kleiner de kans op misverstanden over scope en verwachtingen."
        ]
      },
      {
        "heading": "Uitvoering op hoogte en bereikbaarheid",
        "paragraphs": [
          "Naast techniek spelen bereikbaarheid, veiligheid en logistiek een grote rol. Zeker bij woningen in stedelijke gebieden of op grotere hoogte kan dit de planning beïnvloeden. Voor dakdekker telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Ook de afstemming met bewoners, levertijden van materiaal en weersomstandigheden kan verschil maken in doorlooptijd.",
          "Door deze randvoorwaarden vroeg te benoemen, wordt de aanpak realistischer en voorspelbaarder."
        ]
      },
      {
        "heading": "Combinaties met isolatie en afwatering",
        "paragraphs": [
          "Veel klussen staan niet op zichzelf. Een slimme combinatie met aanverwant werk kan dubbel werk beperken en de planning verbeteren. Voor dakdekker telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Bijvoorbeeld: dakwerk met isolatie, badkamerrenovatie met leidingaanpassingen, of kozijnvervanging met schilderonderhoud.",
          "Noem in je aanvraag altijd welke nevenwerkzaamheden je overweegt, zodat een specialist daarop kan anticiperen."
        ]
      },
      {
        "heading": "Wanneer uitstel extra risico geeft",
        "paragraphs": [
          "Uitstel is niet altijd direct een ramp, maar bij terugkerende klachten neemt het risico op extra herstelwerk meestal toe. Voor dakdekker telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Dat geldt vooral wanneer vocht, veiligheid of gebruiksbeperkingen al merkbaar zijn.",
          "Als je twijfelt, is een inhoudelijke aanvraag via VakConnect vaak de snelste route naar duidelijke vervolgstappen voor dakdekker-werk."
        ],
        "type": "warning"
      },
      {
        "heading": "Informatie die jouw aanvraag sterker maakt",
        "paragraphs": [
          "Sterke aanvragen zijn concreet, compleet en realistisch in planning. Ze beschrijven zowel het probleem als de gewenste uitkomst. Voor dakdekker telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Noem wat al bekend is, wat nog onzeker is en welke keuzes je open wilt laten voor advies.",
          "Daarmee vergroot je de kans op een passende match en een efficiënter eerste contactmoment."
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
      "description": "Beschrijf je dakdekker-klus duidelijk via /aanvraag. VakConnect gebruikt die informatie om je te koppelen aan een passende specialist in jouw regio.",
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
          "Wie op deze pagina komt zoekt vaak houvast: wat moet nu gebeuren, wat kan wachten en welke voorbereiding voorkomt gedoe tijdens uitvoering. Voor schilder telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "In de praktijk zien we dat aanvragen vaak starten vanuit concrete situaties zoals periodiek buitenschilderwerk, opfrissen van binnenschilderwerk en herstel van bladderende of krijtende lagen. Een duidelijke omschrijving van de huidige toestand helpt om sneller een passende specialist te koppelen.",
          "Beschrijf daarom niet alleen het probleem, maar ook de impact op gebruik, comfort en planning. Dat maakt je aanvraag inhoudelijk sterker en beter vergelijkbaar voor aangesloten vakmensen."
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
          "Bij schilder-klussen is een goede diagnose vaak bepalend voor het vervolg. Zonder heldere beoordeling bestaat de kans dat alleen het symptoom wordt aangepakt. Voor schilder telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Een specialist kijkt doorgaans naar samenhang tussen zichtbare schade, onderliggende oorzaak en bereikbaarheid van de werklocatie.",
          "Via VakConnect kun je vooraf relevante context delen, zodat de eerste beoordeling direct specifieker wordt."
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
          "Niet elke situatie vraagt meteen om de grootste ingreep. Vaak is de beste keuze afhankelijk van staat, doel en planning van de woning. Voor schilder telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Wanneer meerdere onderdelen tegelijk aandacht vragen, kan een gefaseerde aanpak logisch zijn. In andere gevallen bespaart één integrale ingreep juist tijd en afstemming.",
          "Door je prioriteiten in de aanvraag te benoemen, kan een professional beter meedenken over een haalbare route."
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
          "Goede voorbereiding voorkomt onduidelijkheid in de eerste contactfase. Denk aan foto’s, afmetingen, eerdere reparaties en gewenste timing. Voor schilder telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Geef ook aan of de klus samenhangt met andere werkzaamheden, zoals renovatie, isolatie of installatiewerk. Dat beïnvloedt vaak de volgorde van uitvoering.",
          "Hoe concreter je startinformatie, hoe kleiner de kans op misverstanden over scope en verwachtingen."
        ]
      },
      {
        "heading": "Voorbereiding in huis of aan de gevel",
        "paragraphs": [
          "Naast techniek spelen bereikbaarheid, veiligheid en logistiek een grote rol. Zeker bij woningen in stedelijke gebieden of op grotere hoogte kan dit de planning beïnvloeden. Voor schilder telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Ook de afstemming met bewoners, levertijden van materiaal en weersomstandigheden kan verschil maken in doorlooptijd.",
          "Door deze randvoorwaarden vroeg te benoemen, wordt de aanpak realistischer en voorspelbaarder."
        ]
      },
      {
        "heading": "Planning rond droogtijd en seizoen",
        "paragraphs": [
          "Veel klussen staan niet op zichzelf. Een slimme combinatie met aanverwant werk kan dubbel werk beperken en de planning verbeteren. Voor schilder telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Bijvoorbeeld: dakwerk met isolatie, badkamerrenovatie met leidingaanpassingen, of kozijnvervanging met schilderonderhoud.",
          "Noem in je aanvraag altijd welke nevenwerkzaamheden je overweegt, zodat een specialist daarop kan anticiperen."
        ]
      },
      {
        "heading": "Wat uitstel doet met ondergrond en herstelwerk",
        "paragraphs": [
          "Uitstel is niet altijd direct een ramp, maar bij terugkerende klachten neemt het risico op extra herstelwerk meestal toe. Voor schilder telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Dat geldt vooral wanneer vocht, veiligheid of gebruiksbeperkingen al merkbaar zijn.",
          "Als je twijfelt, is een inhoudelijke aanvraag via VakConnect vaak de snelste route naar duidelijke vervolgstappen voor schilder-werk."
        ],
        "type": "warning"
      },
      {
        "heading": "Hoe je een inhoudelijk sterke aanvraag opstelt",
        "paragraphs": [
          "Sterke aanvragen zijn concreet, compleet en realistisch in planning. Ze beschrijven zowel het probleem als de gewenste uitkomst. Voor schilder telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Noem wat al bekend is, wat nog onzeker is en welke keuzes je open wilt laten voor advies.",
          "Daarmee vergroot je de kans op een passende match en een efficiënter eerste contactmoment."
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
      "description": "Beschrijf je schilder-klus duidelijk via /aanvraag. VakConnect gebruikt die informatie om je te koppelen aan een passende specialist in jouw regio.",
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
          "Bezoekers willen meestal snel weten hoe ernstig het probleem is en welke gegevens nodig zijn om geen tijd te verliezen. Voor loodgieter telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "In de praktijk zien we dat aanvragen vaak starten vanuit concrete situaties zoals lekkage bij leiding of aansluiting, terugkerende verstopping en aanpassen van water- of afvoertraject. Een duidelijke omschrijving van de huidige toestand helpt om sneller een passende specialist te koppelen.",
          "Beschrijf daarom niet alleen het probleem, maar ook de impact op gebruik, comfort en planning. Dat maakt je aanvraag inhoudelijk sterker en beter vergelijkbaar voor aangesloten vakmensen."
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
          "Bij loodgieter-klussen is een goede diagnose vaak bepalend voor het vervolg. Zonder heldere beoordeling bestaat de kans dat alleen het symptoom wordt aangepakt. Voor loodgieter telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Een specialist kijkt doorgaans naar samenhang tussen zichtbare schade, onderliggende oorzaak en bereikbaarheid van de werklocatie.",
          "Via VakConnect kun je vooraf relevante context delen, zodat de eerste beoordeling direct specifieker wordt."
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
          "Niet elke situatie vraagt meteen om de grootste ingreep. Vaak is de beste keuze afhankelijk van staat, doel en planning van de woning. Voor loodgieter telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Wanneer meerdere onderdelen tegelijk aandacht vragen, kan een gefaseerde aanpak logisch zijn. In andere gevallen bespaart één integrale ingreep juist tijd en afstemming.",
          "Door je prioriteiten in de aanvraag te benoemen, kan een professional beter meedenken over een haalbare route."
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
          "Goede voorbereiding voorkomt onduidelijkheid in de eerste contactfase. Denk aan foto’s, afmetingen, eerdere reparaties en gewenste timing. Voor loodgieter telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Geef ook aan of de klus samenhangt met andere werkzaamheden, zoals renovatie, isolatie of installatiewerk. Dat beïnvloedt vaak de volgorde van uitvoering.",
          "Hoe concreter je startinformatie, hoe kleiner de kans op misverstanden over scope en verwachtingen."
        ]
      },
      {
        "heading": "Combinatie met badkamer- of keukenwerk",
        "paragraphs": [
          "Naast techniek spelen bereikbaarheid, veiligheid en logistiek een grote rol. Zeker bij woningen in stedelijke gebieden of op grotere hoogte kan dit de planning beïnvloeden. Voor loodgieter telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Ook de afstemming met bewoners, levertijden van materiaal en weersomstandigheden kan verschil maken in doorlooptijd.",
          "Door deze randvoorwaarden vroeg te benoemen, wordt de aanpak realistischer en voorspelbaarder."
        ]
      },
      {
        "heading": "Planning bij spoed en niet-spoed",
        "paragraphs": [
          "Veel klussen staan niet op zichzelf. Een slimme combinatie met aanverwant werk kan dubbel werk beperken en de planning verbeteren. Voor loodgieter telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Bijvoorbeeld: dakwerk met isolatie, badkamerrenovatie met leidingaanpassingen, of kozijnvervanging met schilderonderhoud.",
          "Noem in je aanvraag altijd welke nevenwerkzaamheden je overweegt, zodat een specialist daarop kan anticiperen."
        ]
      },
      {
        "heading": "Risico’s van wachten bij waterproblemen",
        "paragraphs": [
          "Uitstel is niet altijd direct een ramp, maar bij terugkerende klachten neemt het risico op extra herstelwerk meestal toe. Voor loodgieter telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Dat geldt vooral wanneer vocht, veiligheid of gebruiksbeperkingen al merkbaar zijn.",
          "Als je twijfelt, is een inhoudelijke aanvraag via VakConnect vaak de snelste route naar duidelijke vervolgstappen voor loodgieter-werk."
        ],
        "type": "warning"
      },
      {
        "heading": "Wat je in je aanvraag moet opnemen",
        "paragraphs": [
          "Sterke aanvragen zijn concreet, compleet en realistisch in planning. Ze beschrijven zowel het probleem als de gewenste uitkomst. Voor loodgieter telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Noem wat al bekend is, wat nog onzeker is en welke keuzes je open wilt laten voor advies.",
          "Daarmee vergroot je de kans op een passende match en een efficiënter eerste contactmoment."
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
      "description": "Beschrijf je loodgieter-klus duidelijk via /aanvraag. VakConnect gebruikt die informatie om je te koppelen aan een passende specialist in jouw regio.",
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
          "Op deze pagina zoekt men vooral duidelijkheid over veiligheid, haalbaarheid en de omvang van de klus zonder zelf aan de installatie te sleutelen. Voor elektricien telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "In de praktijk zien we dat aanvragen vaak starten vanuit concrete situaties zoals uitvallende groepen of storingen, uitbreiden van stopcontacten en lichtpunten en voorbereiding op zwaardere apparatuur. Een duidelijke omschrijving van de huidige toestand helpt om sneller een passende specialist te koppelen.",
          "Beschrijf daarom niet alleen het probleem, maar ook de impact op gebruik, comfort en planning. Dat maakt je aanvraag inhoudelijk sterker en beter vergelijkbaar voor aangesloten vakmensen."
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
          "Bij elektricien-klussen is een goede diagnose vaak bepalend voor het vervolg. Zonder heldere beoordeling bestaat de kans dat alleen het symptoom wordt aangepakt. Voor elektricien telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Een specialist kijkt doorgaans naar samenhang tussen zichtbare schade, onderliggende oorzaak en bereikbaarheid van de werklocatie.",
          "Via VakConnect kun je vooraf relevante context delen, zodat de eerste beoordeling direct specifieker wordt."
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
          "Niet elke situatie vraagt meteen om de grootste ingreep. Vaak is de beste keuze afhankelijk van staat, doel en planning van de woning. Voor elektricien telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Wanneer meerdere onderdelen tegelijk aandacht vragen, kan een gefaseerde aanpak logisch zijn. In andere gevallen bespaart één integrale ingreep juist tijd en afstemming.",
          "Door je prioriteiten in de aanvraag te benoemen, kan een professional beter meedenken over een haalbare route."
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
          "Goede voorbereiding voorkomt onduidelijkheid in de eerste contactfase. Denk aan foto’s, afmetingen, eerdere reparaties en gewenste timing. Voor elektricien telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Geef ook aan of de klus samenhangt met andere werkzaamheden, zoals renovatie, isolatie of installatiewerk. Dat beïnvloedt vaak de volgorde van uitvoering.",
          "Hoe concreter je startinformatie, hoe kleiner de kans op misverstanden over scope en verwachtingen."
        ]
      },
      {
        "heading": "Planning met stroomonderbreking en bereikbaarheid",
        "paragraphs": [
          "Naast techniek spelen bereikbaarheid, veiligheid en logistiek een grote rol. Zeker bij woningen in stedelijke gebieden of op grotere hoogte kan dit de planning beïnvloeden. Voor elektricien telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Ook de afstemming met bewoners, levertijden van materiaal en weersomstandigheden kan verschil maken in doorlooptijd.",
          "Door deze randvoorwaarden vroeg te benoemen, wordt de aanpak realistischer en voorspelbaarder."
        ]
      },
      {
        "heading": "Combinatie met verbouwing en renovatie",
        "paragraphs": [
          "Veel klussen staan niet op zichzelf. Een slimme combinatie met aanverwant werk kan dubbel werk beperken en de planning verbeteren. Voor elektricien telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Bijvoorbeeld: dakwerk met isolatie, badkamerrenovatie met leidingaanpassingen, of kozijnvervanging met schilderonderhoud.",
          "Noem in je aanvraag altijd welke nevenwerkzaamheden je overweegt, zodat een specialist daarop kan anticiperen."
        ]
      },
      {
        "heading": "Waarom uitstel bij elektra onwenselijk is",
        "paragraphs": [
          "Uitstel is niet altijd direct een ramp, maar bij terugkerende klachten neemt het risico op extra herstelwerk meestal toe. Voor elektricien telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Dat geldt vooral wanneer vocht, veiligheid of gebruiksbeperkingen al merkbaar zijn.",
          "Als je twijfelt, is een inhoudelijke aanvraag via VakConnect vaak de snelste route naar duidelijke vervolgstappen voor elektricien-werk."
        ],
        "type": "warning"
      },
      {
        "heading": "Welke intake-informatie cruciaal is",
        "paragraphs": [
          "Sterke aanvragen zijn concreet, compleet en realistisch in planning. Ze beschrijven zowel het probleem als de gewenste uitkomst. Voor elektricien telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Noem wat al bekend is, wat nog onzeker is en welke keuzes je open wilt laten voor advies.",
          "Daarmee vergroot je de kans op een passende match en een efficiënter eerste contactmoment."
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
      "description": "Beschrijf je elektricien-klus duidelijk via /aanvraag. VakConnect gebruikt die informatie om je te koppelen aan een passende specialist in jouw regio.",
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
          "Mensen op deze pagina willen meestal afwegen of onderhoud nog zinvol is of dat vervanging beter past bij comfort en planning. Voor kozijnen telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "In de praktijk zien we dat aanvragen vaak starten vanuit concrete situaties zoals tocht of condens rond ramen, verouderde kozijnen met onderhoudsachterstand en combineren van kozijnwerk met HR-glas. Een duidelijke omschrijving van de huidige toestand helpt om sneller een passende specialist te koppelen.",
          "Beschrijf daarom niet alleen het probleem, maar ook de impact op gebruik, comfort en planning. Dat maakt je aanvraag inhoudelijk sterker en beter vergelijkbaar voor aangesloten vakmensen."
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
          "Bij kozijnen-klussen is een goede diagnose vaak bepalend voor het vervolg. Zonder heldere beoordeling bestaat de kans dat alleen het symptoom wordt aangepakt. Voor kozijnen telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Een specialist kijkt doorgaans naar samenhang tussen zichtbare schade, onderliggende oorzaak en bereikbaarheid van de werklocatie.",
          "Via VakConnect kun je vooraf relevante context delen, zodat de eerste beoordeling direct specifieker wordt."
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
          "Niet elke situatie vraagt meteen om de grootste ingreep. Vaak is de beste keuze afhankelijk van staat, doel en planning van de woning. Voor kozijnen telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Wanneer meerdere onderdelen tegelijk aandacht vragen, kan een gefaseerde aanpak logisch zijn. In andere gevallen bespaart één integrale ingreep juist tijd en afstemming.",
          "Door je prioriteiten in de aanvraag te benoemen, kan een professional beter meedenken over een haalbare route."
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
          "Goede voorbereiding voorkomt onduidelijkheid in de eerste contactfase. Denk aan foto’s, afmetingen, eerdere reparaties en gewenste timing. Voor kozijnen telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Geef ook aan of de klus samenhangt met andere werkzaamheden, zoals renovatie, isolatie of installatiewerk. Dat beïnvloedt vaak de volgorde van uitvoering.",
          "Hoe concreter je startinformatie, hoe kleiner de kans op misverstanden over scope en verwachtingen."
        ]
      },
      {
        "heading": "Combineren met glas en afwerking",
        "paragraphs": [
          "Naast techniek spelen bereikbaarheid, veiligheid en logistiek een grote rol. Zeker bij woningen in stedelijke gebieden of op grotere hoogte kan dit de planning beïnvloeden. Voor kozijnen telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Ook de afstemming met bewoners, levertijden van materiaal en weersomstandigheden kan verschil maken in doorlooptijd.",
          "Door deze randvoorwaarden vroeg te benoemen, wordt de aanpak realistischer en voorspelbaarder."
        ]
      },
      {
        "heading": "Planning en bereikbaarheid van montage",
        "paragraphs": [
          "Veel klussen staan niet op zichzelf. Een slimme combinatie met aanverwant werk kan dubbel werk beperken en de planning verbeteren. Voor kozijnen telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Bijvoorbeeld: dakwerk met isolatie, badkamerrenovatie met leidingaanpassingen, of kozijnvervanging met schilderonderhoud.",
          "Noem in je aanvraag altijd welke nevenwerkzaamheden je overweegt, zodat een specialist daarop kan anticiperen."
        ]
      },
      {
        "heading": "Uitstel en oplopende onderhoudsdruk",
        "paragraphs": [
          "Uitstel is niet altijd direct een ramp, maar bij terugkerende klachten neemt het risico op extra herstelwerk meestal toe. Voor kozijnen telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Dat geldt vooral wanneer vocht, veiligheid of gebruiksbeperkingen al merkbaar zijn.",
          "Als je twijfelt, is een inhoudelijke aanvraag via VakConnect vaak de snelste route naar duidelijke vervolgstappen voor kozijnen-werk."
        ],
        "type": "warning"
      },
      {
        "heading": "Hoe je je kozijnvraag helder aanvraagt",
        "paragraphs": [
          "Sterke aanvragen zijn concreet, compleet en realistisch in planning. Ze beschrijven zowel het probleem als de gewenste uitkomst. Voor kozijnen telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Noem wat al bekend is, wat nog onzeker is en welke keuzes je open wilt laten voor advies.",
          "Daarmee vergroot je de kans op een passende match en een efficiënter eerste contactmoment."
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
      "description": "Beschrijf je kozijnen-klus duidelijk via /aanvraag. VakConnect gebruikt die informatie om je te koppelen aan een passende specialist in jouw regio.",
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
          "Deze pagina wordt vaak bezocht door mensen die willen weten hoe ze een badkamerklus goed opzetten voordat ze keuzes vastleggen. Voor badkamer telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "In de praktijk zien we dat aanvragen vaak starten vanuit concrete situaties zoals gedeeltelijke opfrisbeurt, complete badkamerrenovatie en ombouwen naar inloopdouche. Een duidelijke omschrijving van de huidige toestand helpt om sneller een passende specialist te koppelen.",
          "Beschrijf daarom niet alleen het probleem, maar ook de impact op gebruik, comfort en planning. Dat maakt je aanvraag inhoudelijk sterker en beter vergelijkbaar voor aangesloten vakmensen."
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
          "Bij badkamer-klussen is een goede diagnose vaak bepalend voor het vervolg. Zonder heldere beoordeling bestaat de kans dat alleen het symptoom wordt aangepakt. Voor badkamer telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Een specialist kijkt doorgaans naar samenhang tussen zichtbare schade, onderliggende oorzaak en bereikbaarheid van de werklocatie.",
          "Via VakConnect kun je vooraf relevante context delen, zodat de eerste beoordeling direct specifieker wordt."
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
          "Niet elke situatie vraagt meteen om de grootste ingreep. Vaak is de beste keuze afhankelijk van staat, doel en planning van de woning. Voor badkamer telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Wanneer meerdere onderdelen tegelijk aandacht vragen, kan een gefaseerde aanpak logisch zijn. In andere gevallen bespaart één integrale ingreep juist tijd en afstemming.",
          "Door je prioriteiten in de aanvraag te benoemen, kan een professional beter meedenken over een haalbare route."
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
          "Goede voorbereiding voorkomt onduidelijkheid in de eerste contactfase. Denk aan foto’s, afmetingen, eerdere reparaties en gewenste timing. Voor badkamer telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Geef ook aan of de klus samenhangt met andere werkzaamheden, zoals renovatie, isolatie of installatiewerk. Dat beïnvloedt vaak de volgorde van uitvoering.",
          "Hoe concreter je startinformatie, hoe kleiner de kans op misverstanden over scope en verwachtingen."
        ]
      },
      {
        "heading": "Samenloop tussen disciplines",
        "paragraphs": [
          "Naast techniek spelen bereikbaarheid, veiligheid en logistiek een grote rol. Zeker bij woningen in stedelijke gebieden of op grotere hoogte kan dit de planning beïnvloeden. Voor badkamer telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Ook de afstemming met bewoners, levertijden van materiaal en weersomstandigheden kan verschil maken in doorlooptijd.",
          "Door deze randvoorwaarden vroeg te benoemen, wordt de aanpak realistischer en voorspelbaarder."
        ]
      },
      {
        "heading": "Planning van ruwbouw naar afwerking",
        "paragraphs": [
          "Veel klussen staan niet op zichzelf. Een slimme combinatie met aanverwant werk kan dubbel werk beperken en de planning verbeteren. Voor badkamer telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Bijvoorbeeld: dakwerk met isolatie, badkamerrenovatie met leidingaanpassingen, of kozijnvervanging met schilderonderhoud.",
          "Noem in je aanvraag altijd welke nevenwerkzaamheden je overweegt, zodat een specialist daarop kan anticiperen."
        ]
      },
      {
        "heading": "Wat uitstel doet bij vocht en slijtage",
        "paragraphs": [
          "Uitstel is niet altijd direct een ramp, maar bij terugkerende klachten neemt het risico op extra herstelwerk meestal toe. Voor badkamer telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Dat geldt vooral wanneer vocht, veiligheid of gebruiksbeperkingen al merkbaar zijn.",
          "Als je twijfelt, is een inhoudelijke aanvraag via VakConnect vaak de snelste route naar duidelijke vervolgstappen voor badkamer-werk."
        ],
        "type": "warning"
      },
      {
        "heading": "Welke aanvraaginformatie het verschil maakt",
        "paragraphs": [
          "Sterke aanvragen zijn concreet, compleet en realistisch in planning. Ze beschrijven zowel het probleem als de gewenste uitkomst. Voor badkamer telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Noem wat al bekend is, wat nog onzeker is en welke keuzes je open wilt laten voor advies.",
          "Daarmee vergroot je de kans op een passende match en een efficiënter eerste contactmoment."
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
      "description": "Beschrijf je badkamer-klus duidelijk via /aanvraag. VakConnect gebruikt die informatie om je te koppelen aan een passende specialist in jouw regio.",
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
          "Bezoekers zoeken hier meestal een realistisch beeld van wat in hun woningtype technisch haalbaar en logisch is. Voor isolatie telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "In de praktijk zien we dat aanvragen vaak starten vanuit concrete situaties zoals koud aanvoelende ruimtes, hoge energievraag ondanks normaal gebruik en renovatie waarbij bouwdelen open gaan. Een duidelijke omschrijving van de huidige toestand helpt om sneller een passende specialist te koppelen.",
          "Beschrijf daarom niet alleen het probleem, maar ook de impact op gebruik, comfort en planning. Dat maakt je aanvraag inhoudelijk sterker en beter vergelijkbaar voor aangesloten vakmensen."
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
          "Bij isolatie-klussen is een goede diagnose vaak bepalend voor het vervolg. Zonder heldere beoordeling bestaat de kans dat alleen het symptoom wordt aangepakt. Voor isolatie telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Een specialist kijkt doorgaans naar samenhang tussen zichtbare schade, onderliggende oorzaak en bereikbaarheid van de werklocatie.",
          "Via VakConnect kun je vooraf relevante context delen, zodat de eerste beoordeling direct specifieker wordt."
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
          "Niet elke situatie vraagt meteen om de grootste ingreep. Vaak is de beste keuze afhankelijk van staat, doel en planning van de woning. Voor isolatie telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Wanneer meerdere onderdelen tegelijk aandacht vragen, kan een gefaseerde aanpak logisch zijn. In andere gevallen bespaart één integrale ingreep juist tijd en afstemming.",
          "Door je prioriteiten in de aanvraag te benoemen, kan een professional beter meedenken over een haalbare route."
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
          "Goede voorbereiding voorkomt onduidelijkheid in de eerste contactfase. Denk aan foto’s, afmetingen, eerdere reparaties en gewenste timing. Voor isolatie telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Geef ook aan of de klus samenhangt met andere werkzaamheden, zoals renovatie, isolatie of installatiewerk. Dat beïnvloedt vaak de volgorde van uitvoering.",
          "Hoe concreter je startinformatie, hoe kleiner de kans op misverstanden over scope en verwachtingen."
        ]
      },
      {
        "heading": "Combinatie met dak, gevel of kozijnen",
        "paragraphs": [
          "Naast techniek spelen bereikbaarheid, veiligheid en logistiek een grote rol. Zeker bij woningen in stedelijke gebieden of op grotere hoogte kan dit de planning beïnvloeden. Voor isolatie telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Ook de afstemming met bewoners, levertijden van materiaal en weersomstandigheden kan verschil maken in doorlooptijd.",
          "Door deze randvoorwaarden vroeg te benoemen, wordt de aanpak realistischer en voorspelbaarder."
        ]
      },
      {
        "heading": "Planning en uitvoeringsmoment",
        "paragraphs": [
          "Veel klussen staan niet op zichzelf. Een slimme combinatie met aanverwant werk kan dubbel werk beperken en de planning verbeteren. Voor isolatie telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Bijvoorbeeld: dakwerk met isolatie, badkamerrenovatie met leidingaanpassingen, of kozijnvervanging met schilderonderhoud.",
          "Noem in je aanvraag altijd welke nevenwerkzaamheden je overweegt, zodat een specialist daarop kan anticiperen."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en verbruik",
        "paragraphs": [
          "Uitstel is niet altijd direct een ramp, maar bij terugkerende klachten neemt het risico op extra herstelwerk meestal toe. Voor isolatie telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Dat geldt vooral wanneer vocht, veiligheid of gebruiksbeperkingen al merkbaar zijn.",
          "Als je twijfelt, is een inhoudelijke aanvraag via VakConnect vaak de snelste route naar duidelijke vervolgstappen voor isolatie-werk."
        ],
        "type": "warning"
      },
      {
        "heading": "Inhoud die je aanvraag sterker maakt",
        "paragraphs": [
          "Sterke aanvragen zijn concreet, compleet en realistisch in planning. Ze beschrijven zowel het probleem als de gewenste uitkomst. Voor isolatie telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Noem wat al bekend is, wat nog onzeker is en welke keuzes je open wilt laten voor advies.",
          "Daarmee vergroot je de kans op een passende match en een efficiënter eerste contactmoment."
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
      "description": "Beschrijf je isolatie-klus duidelijk via /aanvraag. VakConnect gebruikt die informatie om je te koppelen aan een passende specialist in jouw regio.",
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
          "Wie deze pagina bezoekt wil vooral weten hoe een verbouwing praktisch en technisch goed wordt voorbereid. Voor verbouwing telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "In de praktijk zien we dat aanvragen vaak starten vanuit concrete situaties zoals ruimtegebrek oplossen, verouderde woningdelen vernieuwen en keuken of zolder functioneel herindelen. Een duidelijke omschrijving van de huidige toestand helpt om sneller een passende specialist te koppelen.",
          "Beschrijf daarom niet alleen het probleem, maar ook de impact op gebruik, comfort en planning. Dat maakt je aanvraag inhoudelijk sterker en beter vergelijkbaar voor aangesloten vakmensen."
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
          "Bij verbouwing-klussen is een goede diagnose vaak bepalend voor het vervolg. Zonder heldere beoordeling bestaat de kans dat alleen het symptoom wordt aangepakt. Voor verbouwing telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Een specialist kijkt doorgaans naar samenhang tussen zichtbare schade, onderliggende oorzaak en bereikbaarheid van de werklocatie.",
          "Via VakConnect kun je vooraf relevante context delen, zodat de eerste beoordeling direct specifieker wordt."
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
          "Niet elke situatie vraagt meteen om de grootste ingreep. Vaak is de beste keuze afhankelijk van staat, doel en planning van de woning. Voor verbouwing telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Wanneer meerdere onderdelen tegelijk aandacht vragen, kan een gefaseerde aanpak logisch zijn. In andere gevallen bespaart één integrale ingreep juist tijd en afstemming.",
          "Door je prioriteiten in de aanvraag te benoemen, kan een professional beter meedenken over een haalbare route."
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
          "Goede voorbereiding voorkomt onduidelijkheid in de eerste contactfase. Denk aan foto’s, afmetingen, eerdere reparaties en gewenste timing. Voor verbouwing telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Geef ook aan of de klus samenhangt met andere werkzaamheden, zoals renovatie, isolatie of installatiewerk. Dat beïnvloedt vaak de volgorde van uitvoering.",
          "Hoe concreter je startinformatie, hoe kleiner de kans op misverstanden over scope en verwachtingen."
        ]
      },
      {
        "heading": "Planning in een bewoonde woning",
        "paragraphs": [
          "Naast techniek spelen bereikbaarheid, veiligheid en logistiek een grote rol. Zeker bij woningen in stedelijke gebieden of op grotere hoogte kan dit de planning beïnvloeden. Voor verbouwing telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Ook de afstemming met bewoners, levertijden van materiaal en weersomstandigheden kan verschil maken in doorlooptijd.",
          "Door deze randvoorwaarden vroeg te benoemen, wordt de aanpak realistischer en voorspelbaarder."
        ]
      },
      {
        "heading": "Risico’s en onvoorziene punten",
        "paragraphs": [
          "Veel klussen staan niet op zichzelf. Een slimme combinatie met aanverwant werk kan dubbel werk beperken en de planning verbeteren. Voor verbouwing telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Bijvoorbeeld: dakwerk met isolatie, badkamerrenovatie met leidingaanpassingen, of kozijnvervanging met schilderonderhoud.",
          "Noem in je aanvraag altijd welke nevenwerkzaamheden je overweegt, zodat een specialist daarop kan anticiperen."
        ]
      },
      {
        "heading": "Wanneer aanvullende beoordeling nodig is",
        "paragraphs": [
          "Uitstel is niet altijd direct een ramp, maar bij terugkerende klachten neemt het risico op extra herstelwerk meestal toe. Voor verbouwing telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Dat geldt vooral wanneer vocht, veiligheid of gebruiksbeperkingen al merkbaar zijn.",
          "Als je twijfelt, is een inhoudelijke aanvraag via VakConnect vaak de snelste route naar duidelijke vervolgstappen voor verbouwing-werk."
        ],
        "type": "warning"
      },
      {
        "heading": "Welke projectdetails je aanvraag compleet maken",
        "paragraphs": [
          "Sterke aanvragen zijn concreet, compleet en realistisch in planning. Ze beschrijven zowel het probleem als de gewenste uitkomst. Voor verbouwing telt vooral dat oorzaak en vervolg logisch op elkaar aansluiten.",
          "Noem wat al bekend is, wat nog onzeker is en welke keuzes je open wilt laten voor advies.",
          "Daarmee vergroot je de kans op een passende match en een efficiënter eerste contactmoment."
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
      "description": "Beschrijf je verbouwing-klus duidelijk via /aanvraag. VakConnect gebruikt die informatie om je te koppelen aan een passende specialist in jouw regio.",
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
          "Bezoekers willen snel weten waar lekkage vandaan komt, hoe urgent de situatie is en welke informatie een vakman nodig heeft.",
          "Bij daklekkage draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van daklekkage op comfort, veiligheid of planning benoemt, kan een dakdekker sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — daklekkage",
        "paragraphs": [
          "Signalen bij daklekkage beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van daklekkage te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van daklekkage ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij daklekkage helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een dakdekker pakt daklekkage meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij daklekkage voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor daklekkage direct scherper maken."
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
          "Bij daklekkage zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor daklekkage logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor daklekkage bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als daklekkage samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van daklekkage en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — daklekkage",
        "paragraphs": [
          "Uitstel bij daklekkage kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer daklekkage terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om daklekkage tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
        ],
        "type": "warning"
      },
      {
        "heading": "Planning, bereikbaarheid en afstemming op locatie — daklekkage",
        "paragraphs": [
          "De planning van daklekkage wordt vaak bepaald door bereikbaarheid, voorbereiding en afhankelijkheid van andere disciplines.",
          "Als je voor daklekkage vooraf duidelijk bent over gewenste timing en flexibiliteit, kan de specialist realistischer plannen."
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
      "description": "Plaats je aanvraag op /aanvraag met details over daklekkage, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende dakdekker.",
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
          "Deze zoekintentie draait om de keuze tussen doorgaan met repareren of een grotere renovatiestap zetten.",
          "Bij dakrenovatie draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van dakrenovatie op comfort, veiligheid of planning benoemt, kan een dakdekker sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — dakrenovatie",
        "paragraphs": [
          "Signalen bij dakrenovatie beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van dakrenovatie te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van dakrenovatie ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij dakrenovatie helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een dakdekker pakt dakrenovatie meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij dakrenovatie voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor dakrenovatie direct scherper maken."
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
          "Bij dakrenovatie zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor dakrenovatie logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor dakrenovatie bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als dakrenovatie samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van dakrenovatie en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — dakrenovatie",
        "paragraphs": [
          "Uitstel bij dakrenovatie kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer dakrenovatie terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om dakrenovatie tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
        ],
        "type": "warning"
      },
      {
        "heading": "Planning, bereikbaarheid en afstemming op locatie — dakrenovatie",
        "paragraphs": [
          "De planning van dakrenovatie wordt vaak bepaald door bereikbaarheid, voorbereiding en afhankelijkheid van andere disciplines.",
          "Als je voor dakrenovatie vooraf duidelijk bent over gewenste timing en flexibiliteit, kan de specialist realistischer plannen."
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
      "description": "Plaats je aanvraag op /aanvraag met details over dakrenovatie, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende dakdekker.",
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
          "Bezoekers zoeken vooral verschil tussen incidenteel pannen vervangen en bredere vervanging van een dakvlak.",
          "Bij dakpannen vervangen draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van dakpannen vervangen op comfort, veiligheid of planning benoemt, kan een dakdekker sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — dakpannen vervangen",
        "paragraphs": [
          "Signalen bij dakpannen vervangen beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van dakpannen vervangen te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van dakpannen vervangen ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij dakpannen vervangen helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een dakdekker pakt dakpannen vervangen meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij dakpannen vervangen voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor dakpannen vervangen direct scherper maken."
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
          "Bij dakpannen vervangen zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor dakpannen vervangen logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor dakpannen vervangen bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als dakpannen vervangen samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van dakpannen vervangen en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — dakpannen vervangen",
        "paragraphs": [
          "Uitstel bij dakpannen vervangen kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer dakpannen vervangen terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om dakpannen vervangen tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
        ],
        "type": "warning"
      },
      {
        "heading": "Planning, bereikbaarheid en afstemming op locatie — dakpannen vervangen",
        "paragraphs": [
          "De planning van dakpannen vervangen wordt vaak bepaald door bereikbaarheid, voorbereiding en afhankelijkheid van andere disciplines.",
          "Als je voor dakpannen vervangen vooraf duidelijk bent over gewenste timing en flexibiliteit, kan de specialist realistischer plannen."
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
      "description": "Plaats je aanvraag op /aanvraag met details over dakpannen vervangen, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende dakdekker.",
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
          "Zoekers willen vooral weten hoe je problemen op een plat dak herkent en wanneer lokaal herstel nog volstaat.",
          "Bij plat dak draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van plat dak op comfort, veiligheid of planning benoemt, kan een dakdekker sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — plat dak",
        "paragraphs": [
          "Signalen bij plat dak beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van plat dak te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van plat dak ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij plat dak helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een dakdekker pakt plat dak meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij plat dak voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor plat dak direct scherper maken."
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
          "Bij plat dak zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor plat dak logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor plat dak bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als plat dak samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van plat dak en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — plat dak",
        "paragraphs": [
          "Uitstel bij plat dak kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer plat dak terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om plat dak tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over plat dak, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende dakdekker.",
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
          "Deze pagina wordt bezocht door mensen die twijfelen of het probleem in metselwerk, aansluiting of dakdetail zit.",
          "Bij schoorsteen draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van schoorsteen op comfort, veiligheid of planning benoemt, kan een dakdekker sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — schoorsteen",
        "paragraphs": [
          "Signalen bij schoorsteen beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van schoorsteen te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van schoorsteen ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij schoorsteen helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een dakdekker pakt schoorsteen meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij schoorsteen voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor schoorsteen direct scherper maken."
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
          "Bij schoorsteen zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor schoorsteen logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor schoorsteen bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als schoorsteen samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van schoorsteen en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — schoorsteen",
        "paragraphs": [
          "Uitstel bij schoorsteen kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer schoorsteen terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om schoorsteen tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over schoorsteen, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende dakdekker.",
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
          "Zoekers willen weten of lokaal herstel volstaat of dat de volledige noklijn aandacht vraagt.",
          "Bij nokvorsten draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van nokvorsten op comfort, veiligheid of planning benoemt, kan een dakdekker sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — nokvorsten",
        "paragraphs": [
          "Signalen bij nokvorsten beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van nokvorsten te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van nokvorsten ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij nokvorsten helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een dakdekker pakt nokvorsten meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij nokvorsten voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor nokvorsten direct scherper maken."
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
          "Bij nokvorsten zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor nokvorsten logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
        ],
        "bullets": [
          "traditionele mortel of droog noksysteem",
          "plaatselijk herstel of complete nokaanpak"
        ]
      },
      {
        "heading": "Welke informatie je in je aanvraag moet zetten — nokvorsten",
        "paragraphs": [
          "Een sterke aanvraag voor nokvorsten bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als nokvorsten samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van nokvorsten en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — nokvorsten",
        "paragraphs": [
          "Uitstel bij nokvorsten kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer nokvorsten terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om nokvorsten tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over nokvorsten, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende dakdekker.",
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
          "De bezoeker zoekt hier vooral oorzaak en aanpak van overlopende goten en lekkage langs gevels.",
          "Bij dakgoot draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van dakgoot op comfort, veiligheid of planning benoemt, kan een dakdekker sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — dakgoot",
        "paragraphs": [
          "Signalen bij dakgoot beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van dakgoot te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van dakgoot ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij dakgoot helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een dakdekker pakt dakgoot meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij dakgoot voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor dakgoot direct scherper maken."
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
          "Bij dakgoot zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor dakgoot logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor dakgoot bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als dakgoot samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van dakgoot en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — dakgoot",
        "paragraphs": [
          "Uitstel bij dakgoot kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer dakgoot terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om dakgoot tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over dakgoot, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende dakdekker.",
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
          "Bezoekers willen weten of de klacht uit dakdetail, bekleding of kozijnaansluiting komt.",
          "Bij dakkapel draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van dakkapel op comfort, veiligheid of planning benoemt, kan een dakdekker sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — dakkapel",
        "paragraphs": [
          "Signalen bij dakkapel beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van dakkapel te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van dakkapel ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij dakkapel helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een dakdekker pakt dakkapel meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij dakkapel voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor dakkapel direct scherper maken."
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
          "Bij dakkapel zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor dakkapel logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
        ],
        "bullets": [
          "lokaal herstel of bredere renovatie",
          "combinatie met kozijnwerk of schilderwerk"
        ]
      },
      {
        "heading": "Welke informatie je in je aanvraag moet zetten — dakkapel",
        "paragraphs": [
          "Een sterke aanvraag voor dakkapel bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als dakkapel samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van dakkapel en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — dakkapel",
        "paragraphs": [
          "Uitstel bij dakkapel kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer dakkapel terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om dakkapel tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over dakkapel, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende dakdekker.",
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
          "Deze pagina wordt gebruikt door bezoekers die preventief willen beoordelen in plaats van wachten op schade.",
          "Bij dakinspectie draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van dakinspectie op comfort, veiligheid of planning benoemt, kan een dakdekker sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen die vaak wijzen op dakproblemen — dakinspectie",
        "paragraphs": [
          "Signalen bij dakinspectie beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van dakinspectie te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van dakinspectie ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij dakinspectie helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een dakdekker pakt dakinspectie meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij dakinspectie voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor dakinspectie direct scherper maken."
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
          "Bij dakinspectie zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor dakinspectie logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
        ],
        "bullets": [
          "eenmalige inspectie of periodieke controle",
          "direct vervolgwerk opnemen of later plannen"
        ]
      },
      {
        "heading": "Welke informatie je in je aanvraag moet zetten — dakinspectie",
        "paragraphs": [
          "Een sterke aanvraag voor dakinspectie bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als dakinspectie samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van dakinspectie en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Gevolgen van uitstel en wanneer sneller handelen verstandig is — dakinspectie",
        "paragraphs": [
          "Uitstel bij dakinspectie kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer dakinspectie terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om dakinspectie tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over dakinspectie, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende dakdekker.",
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
          "De bezoeker wil weten hoe je binnenschilderwerk strak en duurzaam laat uitvoeren.",
          "Bij binnenschilderwerk draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van binnenschilderwerk op comfort, veiligheid of planning benoemt, kan een schilder sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Welke klachten je vaak ziet vóór schilderwerk — binnenschilderwerk",
        "paragraphs": [
          "Signalen bij binnenschilderwerk beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van binnenschilderwerk te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van binnenschilderwerk ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij binnenschilderwerk helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een schilder pakt binnenschilderwerk meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij binnenschilderwerk voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor binnenschilderwerk direct scherper maken."
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
          "Bij binnenschilderwerk zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor binnenschilderwerk logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor binnenschilderwerk bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als binnenschilderwerk samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van binnenschilderwerk en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Wat er gebeurt als je onderhoud te lang uitstelt — binnenschilderwerk",
        "paragraphs": [
          "Uitstel bij binnenschilderwerk kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer binnenschilderwerk terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om binnenschilderwerk tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over binnenschilderwerk, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende schilder.",
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
          "Deze pagina beantwoordt vooral wanneer onderhoud nodig is en hoe je houtwerk buiten duurzaam beschermt.",
          "Bij buitenschilderwerk draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van buitenschilderwerk op comfort, veiligheid of planning benoemt, kan een schilder sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Welke klachten je vaak ziet vóór schilderwerk — buitenschilderwerk",
        "paragraphs": [
          "Signalen bij buitenschilderwerk beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van buitenschilderwerk te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van buitenschilderwerk ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij buitenschilderwerk helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een schilder pakt buitenschilderwerk meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij buitenschilderwerk voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor buitenschilderwerk direct scherper maken."
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
          "Bij buitenschilderwerk zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor buitenschilderwerk logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor buitenschilderwerk bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als buitenschilderwerk samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van buitenschilderwerk en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Wat er gebeurt als je onderhoud te lang uitstelt — buitenschilderwerk",
        "paragraphs": [
          "Uitstel bij buitenschilderwerk kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer buitenschilderwerk terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om buitenschilderwerk tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over buitenschilderwerk, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende schilder.",
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
          "Bezoekers zoeken een aanpak die hout beschermt en tegelijk strak oogt.",
          "Bij kozijnen schilderen draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van kozijnen schilderen op comfort, veiligheid of planning benoemt, kan een schilder sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Welke klachten je vaak ziet vóór schilderwerk — kozijnen schilderen",
        "paragraphs": [
          "Signalen bij kozijnen schilderen beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van kozijnen schilderen te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van kozijnen schilderen ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij kozijnen schilderen helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een schilder pakt kozijnen schilderen meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij kozijnen schilderen voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor kozijnen schilderen direct scherper maken."
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
          "Bij kozijnen schilderen zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor kozijnen schilderen logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
        ],
        "bullets": [
          "binnenzijde, buitenzijde of beide",
          "lokale herstelklus of volledig kozijnpakket"
        ]
      },
      {
        "heading": "Zo maak je je aanvraag concreet en vergelijkbaar — kozijnen schilderen",
        "paragraphs": [
          "Een sterke aanvraag voor kozijnen schilderen bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als kozijnen schilderen samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van kozijnen schilderen en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Wat er gebeurt als je onderhoud te lang uitstelt — kozijnen schilderen",
        "paragraphs": [
          "Uitstel bij kozijnen schilderen kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer kozijnen schilderen terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om kozijnen schilderen tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over kozijnen schilderen, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende schilder.",
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
          "Bezoekers willen vooral weten hoe deuren netjes en duurzaam worden afgewerkt ondanks intensief gebruik.",
          "Bij deuren schilderen draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van deuren schilderen op comfort, veiligheid of planning benoemt, kan een schilder sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Welke klachten je vaak ziet vóór schilderwerk — deuren schilderen",
        "paragraphs": [
          "Signalen bij deuren schilderen beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van deuren schilderen te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van deuren schilderen ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij deuren schilderen helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een schilder pakt deuren schilderen meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij deuren schilderen voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor deuren schilderen direct scherper maken."
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
          "Bij deuren schilderen zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor deuren schilderen logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
        ],
        "bullets": [
          "alle deuren tegelijk of gefaseerd",
          "binnen en buiten apart plannen"
        ]
      },
      {
        "heading": "Zo maak je je aanvraag concreet en vergelijkbaar — deuren schilderen",
        "paragraphs": [
          "Een sterke aanvraag voor deuren schilderen bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als deuren schilderen samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van deuren schilderen en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Wat er gebeurt als je onderhoud te lang uitstelt — deuren schilderen",
        "paragraphs": [
          "Uitstel bij deuren schilderen kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer deuren schilderen terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om deuren schilderen tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over deuren schilderen, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende schilder.",
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
          "Deze pagina richt zich op mensen die vlekken of strepen willen oplossen met een duurzame afwerking.",
          "Bij plafond schilderen draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van plafond schilderen op comfort, veiligheid of planning benoemt, kan een schilder sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Welke klachten je vaak ziet vóór schilderwerk — plafond schilderen",
        "paragraphs": [
          "Signalen bij plafond schilderen beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van plafond schilderen te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van plafond schilderen ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij plafond schilderen helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een schilder pakt plafond schilderen meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij plafond schilderen voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor plafond schilderen direct scherper maken."
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
          "Bij plafond schilderen zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor plafond schilderen logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
        ],
        "bullets": [
          "alleen plafond of combinatie met wand",
          "standaard verf of vochtbestendige variant"
        ]
      },
      {
        "heading": "Zo maak je je aanvraag concreet en vergelijkbaar — plafond schilderen",
        "paragraphs": [
          "Een sterke aanvraag voor plafond schilderen bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als plafond schilderen samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van plafond schilderen en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Wat er gebeurt als je onderhoud te lang uitstelt — plafond schilderen",
        "paragraphs": [
          "Uitstel bij plafond schilderen kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer plafond schilderen terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om plafond schilderen tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over plafond schilderen, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende schilder.",
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
          "Deze pagina beantwoordt de vraag hoe je lekkage snel en gericht laat oppakken zonder onnodige vervolgschade.",
          "Bij lekkage draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van lekkage op comfort, veiligheid of planning benoemt, kan een loodgieter sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen die duiden op een loodgietersprobleem — lekkage",
        "paragraphs": [
          "Signalen bij lekkage beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van lekkage te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van lekkage ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij lekkage helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een loodgieter pakt lekkage meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij lekkage voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor lekkage direct scherper maken."
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
          "Bij lekkage zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor lekkage logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor lekkage bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als lekkage samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van lekkage en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Risico bij uitstel van lekkage of verstopping — lekkage",
        "paragraphs": [
          "Uitstel bij lekkage kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer lekkage terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om lekkage tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
        ],
        "type": "warning"
      },
      {
        "heading": "Praktische planning en bereikbaarheid van leidingen — lekkage",
        "paragraphs": [
          "De planning van lekkage wordt vaak bepaald door bereikbaarheid, voorbereiding en afhankelijkheid van andere disciplines.",
          "Als je voor lekkage vooraf duidelijk bent over gewenste timing en flexibiliteit, kan de specialist realistischer plannen."
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
      "description": "Plaats je aanvraag op /aanvraag met details over lekkage, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende loodgieter.",
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
          "De bezoeker wil weten waarom verstoppingen terugkomen en wanneer professionele aanpak nodig is.",
          "Bij verstopping draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van verstopping op comfort, veiligheid of planning benoemt, kan een loodgieter sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen die duiden op een loodgietersprobleem — verstopping",
        "paragraphs": [
          "Signalen bij verstopping beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van verstopping te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van verstopping ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij verstopping helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een loodgieter pakt verstopping meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij verstopping voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor verstopping direct scherper maken."
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
          "Bij verstopping zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor verstopping logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor verstopping bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als verstopping samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van verstopping en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Risico bij uitstel van lekkage of verstopping — verstopping",
        "paragraphs": [
          "Uitstel bij verstopping kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer verstopping terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om verstopping tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
        ],
        "type": "warning"
      },
      {
        "heading": "Praktische planning en bereikbaarheid van leidingen — verstopping",
        "paragraphs": [
          "De planning van verstopping wordt vaak bepaald door bereikbaarheid, voorbereiding en afhankelijkheid van andere disciplines.",
          "Als je voor verstopping vooraf duidelijk bent over gewenste timing en flexibiliteit, kan de specialist realistischer plannen."
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
      "description": "Plaats je aanvraag op /aanvraag met details over verstopping, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende loodgieter.",
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
          "De bezoeker wil weten wat leidingaanpassingen betekenen voor verbouwing, bereikbaarheid en kosten.",
          "Bij leidingwerk draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van leidingwerk op comfort, veiligheid of planning benoemt, kan een loodgieter sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen die duiden op een loodgietersprobleem — leidingwerk",
        "paragraphs": [
          "Signalen bij leidingwerk beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van leidingwerk te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van leidingwerk ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij leidingwerk helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een loodgieter pakt leidingwerk meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij leidingwerk voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor leidingwerk direct scherper maken."
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
          "Bij leidingwerk zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor leidingwerk logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor leidingwerk bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als leidingwerk samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van leidingwerk en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Risico bij uitstel van lekkage of verstopping — leidingwerk",
        "paragraphs": [
          "Uitstel bij leidingwerk kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer leidingwerk terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om leidingwerk tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over leidingwerk, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende loodgieter.",
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
          "Deze pagina helpt bezoekers bij de afweging tussen losse sanitairwissel en bredere aanpassing van de ruimte.",
          "Bij sanitair draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van sanitair op comfort, veiligheid of planning benoemt, kan een loodgieter sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen die duiden op een loodgietersprobleem — sanitair",
        "paragraphs": [
          "Signalen bij sanitair beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van sanitair te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van sanitair ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij sanitair helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een loodgieter pakt sanitair meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij sanitair voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor sanitair direct scherper maken."
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
          "Bij sanitair zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor sanitair logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor sanitair bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als sanitair samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van sanitair en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Risico bij uitstel van lekkage of verstopping — sanitair",
        "paragraphs": [
          "Uitstel bij sanitair kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer sanitair terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om sanitair tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over sanitair, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende loodgieter.",
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
          "De bezoeker zoekt een snelle route van acute melding naar passende opvolging.",
          "Bij spoed draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van spoed op comfort, veiligheid of planning benoemt, kan een loodgieter sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen die duiden op een loodgietersprobleem — spoed",
        "paragraphs": [
          "Signalen bij spoed beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van spoed te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van spoed ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij spoed helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een loodgieter pakt spoed meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij spoed voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor spoed direct scherper maken."
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
          "Bij spoed zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor spoed logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
        ],
        "bullets": [
          "tijdelijk beperken of direct definitief herstel",
          "combineren met vervolginspectie"
        ]
      },
      {
        "heading": "Welke gegevens je direct moet aanleveren — spoed",
        "paragraphs": [
          "Een sterke aanvraag voor spoed bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als spoed samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van spoed en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Risico bij uitstel van lekkage of verstopping — spoed",
        "paragraphs": [
          "Uitstel bij spoed kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer spoed terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om spoed tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over spoed, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende loodgieter.",
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
          "Bezoekers willen onderscheid tussen tijdelijke verstopping en structureel afvoerprobleem.",
          "Bij afvoer draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van afvoer op comfort, veiligheid of planning benoemt, kan een loodgieter sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen die duiden op een loodgietersprobleem — afvoer",
        "paragraphs": [
          "Signalen bij afvoer beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van afvoer te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van afvoer ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij afvoer helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een loodgieter pakt afvoer meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij afvoer voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor afvoer direct scherper maken."
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
          "Bij afvoer zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor afvoer logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor afvoer bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als afvoer samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van afvoer en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Risico bij uitstel van lekkage of verstopping — afvoer",
        "paragraphs": [
          "Uitstel bij afvoer kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer afvoer terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om afvoer tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over afvoer, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende loodgieter.",
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
          "De bezoeker zoekt vooral duidelijkheid over capaciteit, veiligheid en het verschil tussen uitbreiden en volledig vervangen.",
          "Bij groepenkast draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van groepenkast op comfort, veiligheid of planning benoemt, kan een elektricien sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Klachten die vaak op elektra-issues wijzen — groepenkast",
        "paragraphs": [
          "Signalen bij groepenkast beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van groepenkast te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van groepenkast ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij groepenkast helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een elektricien pakt groepenkast meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij groepenkast voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor groepenkast direct scherper maken."
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
          "Bij groepenkast zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor groepenkast logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor groepenkast bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als groepenkast samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van groepenkast en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Waarom uitstel bij elektra risico’s vergroot — groepenkast",
        "paragraphs": [
          "Uitstel bij groepenkast kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer groepenkast terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om groepenkast tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
        ],
        "type": "warning"
      },
      {
        "heading": "Planning, stroomonderbreking en praktische uitvoering — groepenkast",
        "paragraphs": [
          "De planning van groepenkast wordt vaak bepaald door bereikbaarheid, voorbereiding en afhankelijkheid van andere disciplines.",
          "Als je voor groepenkast vooraf duidelijk bent over gewenste timing en flexibiliteit, kan de specialist realistischer plannen."
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
      "description": "Plaats je aanvraag op /aanvraag met details over groepenkast, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende elektricien.",
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
          "Bezoekers willen oorzaak en risico duiden zonder zelf gevaarlijke handelingen uit te voeren.",
          "Bij storing draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van storing op comfort, veiligheid of planning benoemt, kan een elektricien sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Klachten die vaak op elektra-issues wijzen — storing",
        "paragraphs": [
          "Signalen bij storing beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van storing te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van storing ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij storing helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een elektricien pakt storing meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij storing voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor storing direct scherper maken."
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
          "Bij storing zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor storing logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
        ],
        "bullets": [
          "acute fout oplossen",
          "oorzaakanalyse bij terugkerende storingen"
        ]
      },
      {
        "heading": "Welke info je nodig hebt voor een gerichte intake — storing",
        "paragraphs": [
          "Een sterke aanvraag voor storing bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als storing samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van storing en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Waarom uitstel bij elektra risico’s vergroot — storing",
        "paragraphs": [
          "Uitstel bij storing kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer storing terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om storing tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over storing, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende elektricien.",
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
          "De bezoeker wil weten hoe extra aansluitpunten veilig en toekomstbestendig worden aangelegd.",
          "Bij stopcontacten draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van stopcontacten op comfort, veiligheid of planning benoemt, kan een elektricien sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Klachten die vaak op elektra-issues wijzen — stopcontacten",
        "paragraphs": [
          "Signalen bij stopcontacten beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van stopcontacten te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van stopcontacten ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij stopcontacten helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een elektricien pakt stopcontacten meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij stopcontacten voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor stopcontacten direct scherper maken."
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
          "Bij stopcontacten zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor stopcontacten logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor stopcontacten bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als stopcontacten samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van stopcontacten en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Waarom uitstel bij elektra risico’s vergroot — stopcontacten",
        "paragraphs": [
          "Uitstel bij stopcontacten kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer stopcontacten terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om stopcontacten tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over stopcontacten, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende elektricien.",
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
          "Deze pagina helpt bezoekers bij de vertaalslag van lichtwens naar technisch haalbare installatie.",
          "Bij verlichting draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van verlichting op comfort, veiligheid of planning benoemt, kan een elektricien sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Klachten die vaak op elektra-issues wijzen — verlichting",
        "paragraphs": [
          "Signalen bij verlichting beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van verlichting te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van verlichting ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij verlichting helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een elektricien pakt verlichting meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij verlichting voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor verlichting direct scherper maken."
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
          "Bij verlichting zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor verlichting logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor verlichting bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als verlichting samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van verlichting en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Waarom uitstel bij elektra risico’s vergroot — verlichting",
        "paragraphs": [
          "Uitstel bij verlichting kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer verlichting terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om verlichting tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over verlichting, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende elektricien.",
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
          "Bezoekers willen weten wat er nodig is om veilig van wens naar bruikbare aansluiting te gaan.",
          "Bij krachtstroom draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van krachtstroom op comfort, veiligheid of planning benoemt, kan een elektricien sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Klachten die vaak op elektra-issues wijzen — krachtstroom",
        "paragraphs": [
          "Signalen bij krachtstroom beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van krachtstroom te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van krachtstroom ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij krachtstroom helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een elektricien pakt krachtstroom meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij krachtstroom voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor krachtstroom direct scherper maken."
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
          "Bij krachtstroom zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor krachtstroom logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
        ],
        "bullets": [
          "volledige voorbereiding of gefaseerde uitbreiding",
          "combinatie met groepenkastaanpassing"
        ]
      },
      {
        "heading": "Welke info je nodig hebt voor een gerichte intake — krachtstroom",
        "paragraphs": [
          "Een sterke aanvraag voor krachtstroom bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als krachtstroom samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van krachtstroom en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Waarom uitstel bij elektra risico’s vergroot — krachtstroom",
        "paragraphs": [
          "Uitstel bij krachtstroom kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer krachtstroom terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om krachtstroom tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over krachtstroom, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende elektricien.",
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
          "Deze zoekintentie draait om materiaalkeuze en de vraag of kunststof past bij woning en onderhoudswens.",
          "Bij kunststof kozijnen draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van kunststof kozijnen op comfort, veiligheid of planning benoemt, kan een kozijnspecialist sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen dat kozijnen of aansluitingen aandacht vragen — kunststof kozijnen",
        "paragraphs": [
          "Signalen bij kunststof kozijnen beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van kunststof kozijnen te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van kunststof kozijnen ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij kunststof kozijnen helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een kozijnspecialist pakt kunststof kozijnen meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij kunststof kozijnen voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor kunststof kozijnen direct scherper maken."
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
          "Bij kunststof kozijnen zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor kunststof kozijnen logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor kunststof kozijnen bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als kunststof kozijnen samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van kunststof kozijnen en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en onderhoudskosten — kunststof kozijnen",
        "paragraphs": [
          "Uitstel bij kunststof kozijnen kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer kunststof kozijnen terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om kunststof kozijnen tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over kunststof kozijnen, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende kozijnspecialist.",
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
          "Bezoekers zoeken balans tussen karakter, onderhoud en technische staat.",
          "Bij houten kozijnen draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van houten kozijnen op comfort, veiligheid of planning benoemt, kan een kozijnspecialist sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen dat kozijnen of aansluitingen aandacht vragen — houten kozijnen",
        "paragraphs": [
          "Signalen bij houten kozijnen beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van houten kozijnen te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van houten kozijnen ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij houten kozijnen helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een kozijnspecialist pakt houten kozijnen meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij houten kozijnen voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor houten kozijnen direct scherper maken."
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
          "Bij houten kozijnen zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor houten kozijnen logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor houten kozijnen bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als houten kozijnen samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van houten kozijnen en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en onderhoudskosten — houten kozijnen",
        "paragraphs": [
          "Uitstel bij houten kozijnen kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer houten kozijnen terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om houten kozijnen tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over houten kozijnen, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende kozijnspecialist.",
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
          "De bezoeker wil begrijpen wat aluminium onderscheidt qua profieldikte, onderhoud en toepasbaarheid.",
          "Bij aluminium kozijnen draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van aluminium kozijnen op comfort, veiligheid of planning benoemt, kan een kozijnspecialist sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen dat kozijnen of aansluitingen aandacht vragen — aluminium kozijnen",
        "paragraphs": [
          "Signalen bij aluminium kozijnen beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van aluminium kozijnen te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van aluminium kozijnen ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij aluminium kozijnen helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een kozijnspecialist pakt aluminium kozijnen meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij aluminium kozijnen voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor aluminium kozijnen direct scherper maken."
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
          "Bij aluminium kozijnen zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor aluminium kozijnen logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor aluminium kozijnen bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als aluminium kozijnen samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van aluminium kozijnen en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en onderhoudskosten — aluminium kozijnen",
        "paragraphs": [
          "Uitstel bij aluminium kozijnen kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer aluminium kozijnen terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om aluminium kozijnen tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over aluminium kozijnen, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende kozijnspecialist.",
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
          "De bezoeker zoekt een heldere grens tussen dooronderhouden en verstandig vernieuwen.",
          "Bij kozijnen vervangen draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van kozijnen vervangen op comfort, veiligheid of planning benoemt, kan een kozijnspecialist sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen dat kozijnen of aansluitingen aandacht vragen — kozijnen vervangen",
        "paragraphs": [
          "Signalen bij kozijnen vervangen beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van kozijnen vervangen te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van kozijnen vervangen ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij kozijnen vervangen helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een kozijnspecialist pakt kozijnen vervangen meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij kozijnen vervangen voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor kozijnen vervangen direct scherper maken."
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
          "Bij kozijnen vervangen zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor kozijnen vervangen logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor kozijnen vervangen bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als kozijnen vervangen samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van kozijnen vervangen en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en onderhoudskosten — kozijnen vervangen",
        "paragraphs": [
          "Uitstel bij kozijnen vervangen kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer kozijnen vervangen terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om kozijnen vervangen tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over kozijnen vervangen, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende kozijnspecialist.",
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
          "Deze pagina helpt bij klachten rond bediening, tocht en sluiting van ramen en deuren.",
          "Bij ramen en deuren draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van ramen en deuren op comfort, veiligheid of planning benoemt, kan een kozijnspecialist sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen dat kozijnen of aansluitingen aandacht vragen — ramen en deuren",
        "paragraphs": [
          "Signalen bij ramen en deuren beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van ramen en deuren te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van ramen en deuren ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij ramen en deuren helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een kozijnspecialist pakt ramen en deuren meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij ramen en deuren voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor ramen en deuren direct scherper maken."
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
          "Bij ramen en deuren zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor ramen en deuren logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
        ],
        "bullets": [
          "onderdelen vervangen of compleet vernieuwen",
          "combineren met kozijnproject"
        ]
      },
      {
        "heading": "Welke gegevens je aanvraag echt sterker maken — ramen en deuren",
        "paragraphs": [
          "Een sterke aanvraag voor ramen en deuren bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als ramen en deuren samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van ramen en deuren en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en onderhoudskosten — ramen en deuren",
        "paragraphs": [
          "Uitstel bij ramen en deuren kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer ramen en deuren terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om ramen en deuren tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over ramen en deuren, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende kozijnspecialist.",
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
          "Deze zoekintentie gaat over het samenbrengen van ontwerp, techniek en planning tot een uitvoerbaar renovatieplan.",
          "Bij renovatie draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van renovatie op comfort, veiligheid of planning benoemt, kan een badkamerspecialist sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — renovatie",
        "paragraphs": [
          "Signalen bij renovatie beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van renovatie te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van renovatie ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij renovatie helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een badkamerspecialist pakt renovatie meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij renovatie voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor renovatie direct scherper maken."
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
          "Bij renovatie zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor renovatie logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor renovatie bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als renovatie samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van renovatie en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Gevolgen van uitstel bij vocht en slijtage — renovatie",
        "paragraphs": [
          "Uitstel bij renovatie kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer renovatie terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om renovatie tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
        ],
        "type": "warning"
      },
      {
        "heading": "Planning tussen sloop, techniek en afwerking — renovatie",
        "paragraphs": [
          "De planning van renovatie wordt vaak bepaald door bereikbaarheid, voorbereiding en afhankelijkheid van andere disciplines.",
          "Als je voor renovatie vooraf duidelijk bent over gewenste timing en flexibiliteit, kan de specialist realistischer plannen."
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
      "description": "Plaats je aanvraag op /aanvraag met details over renovatie, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende badkamerspecialist.",
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
          "Bezoekers willen weten hoe tegelkeuze en voorbereiding samenhangen met kwaliteit en onderhoud.",
          "Bij tegelen draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van tegelen op comfort, veiligheid of planning benoemt, kan een badkamerspecialist sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — tegelen",
        "paragraphs": [
          "Signalen bij tegelen beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van tegelen te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van tegelen ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij tegelen helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een badkamerspecialist pakt tegelen meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij tegelen voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor tegelen direct scherper maken."
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
          "Bij tegelen zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor tegelen logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor tegelen bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als tegelen samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van tegelen en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Gevolgen van uitstel bij vocht en slijtage — tegelen",
        "paragraphs": [
          "Uitstel bij tegelen kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer tegelen terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om tegelen tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over tegelen, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende badkamerspecialist.",
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
          "De pagina helpt bezoekers om sanitairkeuzes te koppelen aan technische haalbaarheid.",
          "Bij sanitair draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van sanitair op comfort, veiligheid of planning benoemt, kan een badkamerspecialist sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — sanitair",
        "paragraphs": [
          "Signalen bij sanitair beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van sanitair te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van sanitair ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij sanitair helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een badkamerspecialist pakt sanitair meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij sanitair voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor sanitair direct scherper maken."
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
          "Bij sanitair zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor sanitair logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor sanitair bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als sanitair samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van sanitair en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Gevolgen van uitstel bij vocht en slijtage — sanitair",
        "paragraphs": [
          "Uitstel bij sanitair kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer sanitair terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om sanitair tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over sanitair, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende badkamerspecialist.",
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
          "Bezoekers willen weten of een inloopdouche haalbaar is in hun huidige badkamer.",
          "Bij inloopdouche draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van inloopdouche op comfort, veiligheid of planning benoemt, kan een badkamerspecialist sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — inloopdouche",
        "paragraphs": [
          "Signalen bij inloopdouche beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van inloopdouche te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van inloopdouche ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij inloopdouche helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een badkamerspecialist pakt inloopdouche meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij inloopdouche voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor inloopdouche direct scherper maken."
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
          "Bij inloopdouche zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor inloopdouche logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor inloopdouche bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als inloopdouche samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van inloopdouche en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Gevolgen van uitstel bij vocht en slijtage — inloopdouche",
        "paragraphs": [
          "Uitstel bij inloopdouche kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer inloopdouche terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om inloopdouche tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over inloopdouche, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende badkamerspecialist.",
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
          "De bezoeker zoekt overzicht en realistische verwachtingen voor een totaalproject.",
          "Bij complete badkamer draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van complete badkamer op comfort, veiligheid of planning benoemt, kan een badkamerspecialist sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — complete badkamer",
        "paragraphs": [
          "Signalen bij complete badkamer beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van complete badkamer te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van complete badkamer ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij complete badkamer helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een badkamerspecialist pakt complete badkamer meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij complete badkamer voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor complete badkamer direct scherper maken."
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
          "Bij complete badkamer zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor complete badkamer logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
        ],
        "bullets": [
          "basisrenovatie of luxe afwerking",
          "gefaseerde planning of alles in één traject"
        ]
      },
      {
        "heading": "Welke input nodig is voor een realistische offertefase — complete badkamer",
        "paragraphs": [
          "Een sterke aanvraag voor complete badkamer bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als complete badkamer samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van complete badkamer en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Gevolgen van uitstel bij vocht en slijtage — complete badkamer",
        "paragraphs": [
          "Uitstel bij complete badkamer kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer complete badkamer terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om complete badkamer tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over complete badkamer, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende badkamerspecialist.",
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
          "Deze pagina helpt bij vragen over vocht, schimmel en luchtkwaliteit in natte ruimtes.",
          "Bij ventilatie draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van ventilatie op comfort, veiligheid of planning benoemt, kan een badkamerspecialist sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Welke signalen laten zien dat de badkamer aan vernieuwing toe is — ventilatie",
        "paragraphs": [
          "Signalen bij ventilatie beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van ventilatie te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van ventilatie ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij ventilatie helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een badkamerspecialist pakt ventilatie meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij ventilatie voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor ventilatie direct scherper maken."
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
          "Bij ventilatie zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor ventilatie logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
        ],
        "bullets": [
          "lokaal ventilatieherstel of integrale renovatie",
          "combineren met elektra-aanpassing"
        ]
      },
      {
        "heading": "Welke input nodig is voor een realistische offertefase — ventilatie",
        "paragraphs": [
          "Een sterke aanvraag voor ventilatie bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als ventilatie samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van ventilatie en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Gevolgen van uitstel bij vocht en slijtage — ventilatie",
        "paragraphs": [
          "Uitstel bij ventilatie kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer ventilatie terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om ventilatie tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over ventilatie, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende badkamerspecialist.",
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
          "De bezoeker wil begrijpen welke isolatie-aanpak past bij zijn dak en verbouwingsplannen.",
          "Bij dakisolatie draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van dakisolatie op comfort, veiligheid of planning benoemt, kan een isolatiespecialist sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen dat isolatieverbetering zinvol is — dakisolatie",
        "paragraphs": [
          "Signalen bij dakisolatie beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van dakisolatie te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van dakisolatie ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij dakisolatie helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een isolatiespecialist pakt dakisolatie meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij dakisolatie voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor dakisolatie direct scherper maken."
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
          "Bij dakisolatie zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor dakisolatie logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor dakisolatie bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als dakisolatie samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van dakisolatie en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en energiegebruik — dakisolatie",
        "paragraphs": [
          "Uitstel bij dakisolatie kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer dakisolatie terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om dakisolatie tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over dakisolatie, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende isolatiespecialist.",
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
          "Bezoekers zoeken een realistisch beeld van geschiktheid en effect bij bestaande bouw.",
          "Bij spouwmuurisolatie draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van spouwmuurisolatie op comfort, veiligheid of planning benoemt, kan een isolatiespecialist sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen dat isolatieverbetering zinvol is — spouwmuurisolatie",
        "paragraphs": [
          "Signalen bij spouwmuurisolatie beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van spouwmuurisolatie te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van spouwmuurisolatie ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij spouwmuurisolatie helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een isolatiespecialist pakt spouwmuurisolatie meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij spouwmuurisolatie voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor spouwmuurisolatie direct scherper maken."
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
          "Bij spouwmuurisolatie zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor spouwmuurisolatie logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
        ],
        "bullets": [
          "losse maatregel of onderdeel van bredere renovatie",
          "combineren met gevel- of kozijnwerk"
        ]
      },
      {
        "heading": "Welke woninginformatie je vooraf moet delen — spouwmuurisolatie",
        "paragraphs": [
          "Een sterke aanvraag voor spouwmuurisolatie bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als spouwmuurisolatie samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van spouwmuurisolatie en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en energiegebruik — spouwmuurisolatie",
        "paragraphs": [
          "Uitstel bij spouwmuurisolatie kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer spouwmuurisolatie terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om spouwmuurisolatie tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over spouwmuurisolatie, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende isolatiespecialist.",
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
          "Deze pagina wordt vooral bezocht door bewoners met koude vloeren of tochtklachten op de begane grond.",
          "Bij vloerisolatie draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van vloerisolatie op comfort, veiligheid of planning benoemt, kan een isolatiespecialist sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen dat isolatieverbetering zinvol is — vloerisolatie",
        "paragraphs": [
          "Signalen bij vloerisolatie beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van vloerisolatie te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van vloerisolatie ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij vloerisolatie helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een isolatiespecialist pakt vloerisolatie meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij vloerisolatie voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor vloerisolatie direct scherper maken."
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
          "Bij vloerisolatie zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor vloerisolatie logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
        ],
        "bullets": [
          "vloer- of bodemgerichte aanpak",
          "combineren met kruipruimte-isolatie"
        ]
      },
      {
        "heading": "Welke woninginformatie je vooraf moet delen — vloerisolatie",
        "paragraphs": [
          "Een sterke aanvraag voor vloerisolatie bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als vloerisolatie samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van vloerisolatie en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en energiegebruik — vloerisolatie",
        "paragraphs": [
          "Uitstel bij vloerisolatie kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer vloerisolatie terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om vloerisolatie tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over vloerisolatie, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende isolatiespecialist.",
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
          "De bezoeker wil weten hoe gevelisolatie zich verhoudt tot uitstraling, bouwdetails en comfort.",
          "Bij gevelisolatie draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van gevelisolatie op comfort, veiligheid of planning benoemt, kan een isolatiespecialist sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen dat isolatieverbetering zinvol is — gevelisolatie",
        "paragraphs": [
          "Signalen bij gevelisolatie beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van gevelisolatie te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van gevelisolatie ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij gevelisolatie helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een isolatiespecialist pakt gevelisolatie meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij gevelisolatie voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor gevelisolatie direct scherper maken."
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
          "Bij gevelisolatie zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor gevelisolatie logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
        ],
        "bullets": [
          "binnen- of buitengevelbenadering",
          "combineren met kozijnproject"
        ]
      },
      {
        "heading": "Welke woninginformatie je vooraf moet delen — gevelisolatie",
        "paragraphs": [
          "Een sterke aanvraag voor gevelisolatie bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als gevelisolatie samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van gevelisolatie en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en energiegebruik — gevelisolatie",
        "paragraphs": [
          "Uitstel bij gevelisolatie kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer gevelisolatie terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om gevelisolatie tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over gevelisolatie, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende isolatiespecialist.",
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
          "Deze pagina helpt bezoekers die koude vloeren koppelen aan een vochtige kruipruimte.",
          "Bij kruipruimte isolatie draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van kruipruimte isolatie op comfort, veiligheid of planning benoemt, kan een isolatiespecialist sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Signalen dat isolatieverbetering zinvol is — kruipruimte isolatie",
        "paragraphs": [
          "Signalen bij kruipruimte isolatie beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van kruipruimte isolatie te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van kruipruimte isolatie ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij kruipruimte isolatie helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een isolatiespecialist pakt kruipruimte isolatie meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij kruipruimte isolatie voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor kruipruimte isolatie direct scherper maken."
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
          "Bij kruipruimte isolatie zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor kruipruimte isolatie logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
        ],
        "bullets": [
          "bodem- of vloerisolatie",
          "combinatie met ventilatiemaatregelen"
        ]
      },
      {
        "heading": "Welke woninginformatie je vooraf moet delen — kruipruimte isolatie",
        "paragraphs": [
          "Een sterke aanvraag voor kruipruimte isolatie bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als kruipruimte isolatie samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van kruipruimte isolatie en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Wat uitstel betekent voor comfort en energiegebruik — kruipruimte isolatie",
        "paragraphs": [
          "Uitstel bij kruipruimte isolatie kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer kruipruimte isolatie terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om kruipruimte isolatie tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over kruipruimte isolatie, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende isolatiespecialist.",
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
          "Bezoekers willen weten hoe je extra ruimte realiseert met realistische planning en scope.",
          "Bij aanbouw draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van aanbouw op comfort, veiligheid of planning benoemt, kan een verbouwspecialist sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Wanneer een verbouwing meestal in beeld komt — aanbouw",
        "paragraphs": [
          "Signalen bij aanbouw beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van aanbouw te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van aanbouw ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij aanbouw helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een verbouwspecialist pakt aanbouw meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij aanbouw voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor aanbouw direct scherper maken."
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
          "Bij aanbouw zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor aanbouw logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor aanbouw bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als aanbouw samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van aanbouw en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Risico’s van uitstel of onduidelijke scope — aanbouw",
        "paragraphs": [
          "Uitstel bij aanbouw kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer aanbouw terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om aanbouw tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over aanbouw, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende verbouwspecialist.",
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
          "Deze pagina richt zich op bezoekers die hun bestaande ruimte willen vergroten zonder verhuizing.",
          "Bij uitbouw draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van uitbouw op comfort, veiligheid of planning benoemt, kan een verbouwspecialist sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Wanneer een verbouwing meestal in beeld komt — uitbouw",
        "paragraphs": [
          "Signalen bij uitbouw beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van uitbouw te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van uitbouw ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij uitbouw helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
        ],
        "bullets": [
          "huidige woningindeling",
          "nieuwe gebruiksbehoeften"
        ]
      },
      {
        "heading": "Eerste beoordeling door een verbouwspecialist (uitbouw) — uitbouw",
        "paragraphs": [
          "Een verbouwspecialist pakt uitbouw meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij uitbouw voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor uitbouw direct scherper maken."
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
          "Bij uitbouw zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor uitbouw logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor uitbouw bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als uitbouw samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van uitbouw en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Risico’s van uitstel of onduidelijke scope — uitbouw",
        "paragraphs": [
          "Uitstel bij uitbouw kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer uitbouw terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om uitbouw tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over uitbouw, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende verbouwspecialist.",
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
          "Bezoekers zoeken een stappenplan voor comfort, indeling en techniek op zolderniveau.",
          "Bij zolder verbouwen draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van zolder verbouwen op comfort, veiligheid of planning benoemt, kan een verbouwspecialist sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Wanneer een verbouwing meestal in beeld komt — zolder verbouwen",
        "paragraphs": [
          "Signalen bij zolder verbouwen beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van zolder verbouwen te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van zolder verbouwen ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij zolder verbouwen helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een verbouwspecialist pakt zolder verbouwen meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij zolder verbouwen voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor zolder verbouwen direct scherper maken."
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
          "Bij zolder verbouwen zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor zolder verbouwen logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
        ],
        "bullets": [
          "slaapkamer, werkplek of multifunctioneel",
          "combinatie met dakisolatie"
        ]
      },
      {
        "heading": "Welke projectinformatie je aanvraag sterker maakt — zolder verbouwen",
        "paragraphs": [
          "Een sterke aanvraag voor zolder verbouwen bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als zolder verbouwen samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van zolder verbouwen en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Risico’s van uitstel of onduidelijke scope — zolder verbouwen",
        "paragraphs": [
          "Uitstel bij zolder verbouwen kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer zolder verbouwen terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om zolder verbouwen tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over zolder verbouwen, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende verbouwspecialist.",
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
          "Deze zoekintentie gaat over samenhang: hoe pak je meerdere woningproblemen logisch en beheersbaar aan.",
          "Bij woning renoveren draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van woning renoveren op comfort, veiligheid of planning benoemt, kan een verbouwspecialist sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Wanneer een verbouwing meestal in beeld komt — woning renoveren",
        "paragraphs": [
          "Signalen bij woning renoveren beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van woning renoveren te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van woning renoveren ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij woning renoveren helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een verbouwspecialist pakt woning renoveren meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij woning renoveren voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor woning renoveren direct scherper maken."
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
          "Bij woning renoveren zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor woning renoveren logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor woning renoveren bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als woning renoveren samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van woning renoveren en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Risico’s van uitstel of onduidelijke scope — woning renoveren",
        "paragraphs": [
          "Uitstel bij woning renoveren kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer woning renoveren terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om woning renoveren tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over woning renoveren, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende verbouwspecialist.",
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
          "Bezoekers willen weten hoe ze keukenwensen combineren met water, elektra en afwerking.",
          "Bij keuken verbouwen draait de eerste beoordeling meestal om de vraag of het probleem lokaal is of onderdeel van een bredere situatie in de woning.",
          "Wanneer je de impact van keuken verbouwen op comfort, veiligheid of planning benoemt, kan een verbouwspecialist sneller prioriteiten bepalen."
        ]
      },
      {
        "heading": "Wanneer een verbouwing meestal in beeld komt — keuken verbouwen",
        "paragraphs": [
          "Signalen bij keuken verbouwen beginnen vaak klein, maar worden opvallender wanneer de oorzaak blijft bestaan.",
          "Door veranderingen in frequentie, intensiteit en timing van keuken verbouwen te noteren, maak je je aanvraag concreter."
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
          "De oorzaak van keuken verbouwen ligt vaak in een combinatie van materiaal, gebruik en detailuitvoering, niet in één los onderdeel.",
          "Bij keuken verbouwen helpt het om zowel zichtbare symptomen als mogelijke nevenfactoren te benoemen, zodat de diagnose breder kan worden opgezet."
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
          "Een verbouwspecialist pakt keuken verbouwen meestal stap voor stap aan: eerst oorzaak bevestigen, daarna scope afbakenen en pas dan uitvoering plannen.",
          "Bij keuken verbouwen voorkomt deze volgorde dat alleen een zichtbaar symptoom wordt aangepakt terwijl de kernoorzaak blijft bestaan.",
          "Door vooraf context te delen over bereikbaarheid en eerdere ingrepen, kan de professional het plan voor keuken verbouwen direct scherper maken."
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
          "Bij keuken verbouwen zijn vaak meerdere routes mogelijk: tijdelijk stabiliseren, lokaal herstellen of een bredere structurele oplossing kiezen.",
          "Welke route voor keuken verbouwen logisch is, hangt af van de staat van omliggende delen en van je planning met eventuele andere klussen."
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
          "Een sterke aanvraag voor keuken verbouwen bevat altijd plaats, timing, zichtbare kenmerken en wat je al hebt laten controleren of uitvoeren.",
          "Als keuken verbouwen samenhangt met andere werkzaamheden, vermeld dat direct zodat planning en volgorde vanaf het begin realistisch blijven.",
          "Foto’s van keuken verbouwen en de omgeving helpen om sneller een passende specialist te koppelen via VakConnect."
        ]
      },
      {
        "heading": "Risico’s van uitstel of onduidelijke scope — keuken verbouwen",
        "paragraphs": [
          "Uitstel bij keuken verbouwen kan in sommige gevallen, maar alleen wanneer de situatie stabiel is en geen extra schade of veiligheidsrisico geeft.",
          "Wanneer keuken verbouwen terugkeert, wordt het probleem vaak minder voorspelbaar en neemt de kans op aanvullende herstelstappen toe.",
          "Daarom is het meestal verstandig om keuken verbouwen tijdig te laten beoordelen in plaats van alleen symptomatisch te blijven reageren."
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
      "description": "Plaats je aanvraag op /aanvraag met details over keuken verbouwen, je locatie en gewenste timing. Zo kan VakConnect je koppelen aan een passende verbouwspecialist.",
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

import type { ServiceContentPageData, ServiceFaq, ServiceLink, ServiceSection } from "./service-pages.ts";
import { getLocation, getPublishedLocations } from "./locations.ts";

export type LocalServiceSlug = "dakdekker" | "loodgieter" | "schilder" | "elektricien";

type ServiceProfile = {
  serviceSlug: LocalServiceSlug;
  serviceName: string;
  localTaskSummary: string;
  housingFocus: string;
  accessibilityFocus: string;
  pricingFactors: string[];
  processSteps: string[];
  ctaLabel: string;
  subservices: Record<string, { name: string; localTaskSummary: string; focus: string }>;
};

export type LocalPageConfig = {
  serviceSlug: LocalServiceSlug;
  subserviceSlug: string | null;
  citySlug: string;
  published: boolean;
  indexable: boolean;
  canonicalPath: string;
  localIntro: string[];
  localSections: ServiceSection[];
  faq: ServiceFaq[];
  relatedLocalLinks: string[];
  relatedServiceLinks: ServiceLink[];
};

export type LocalServicePage = {
  serviceSlug: LocalServiceSlug;
  subserviceSlug: string | null;
  citySlug: string;
  published: boolean;
  indexable: boolean;
  canonicalPath: string;
  page: ServiceContentPageData;
};

const cityBatch = [
  "amsterdam",
  "rotterdam",
  "den-haag",
  "utrecht",
  "eindhoven",
  "groningen",
  "tilburg",
  "almere",
  "breda",
  "nijmegen",
  "arnhem",
  "apeldoorn",
  "haarlem",
  "amersfoort",
  "zwolle",
  "leeuwarden",
  "den-bosch",
  "enschede",
  "leiden",
  "dordrecht",
] as const;

const priorityCityBatch = ["amsterdam", "rotterdam", "den-haag", "utrecht", "eindhoven", "groningen", "breda", "tilburg", "nijmegen", "arnhem"] as const;

const topFiveCities = ["amsterdam", "rotterdam", "den-haag", "utrecht", "eindhoven"] as const;

const serviceProfiles: Record<LocalServiceSlug, ServiceProfile> = {
  dakdekker: {
    serviceSlug: "dakdekker",
    serviceName: "Dakdekker",
    localTaskSummary: "Dakwerk in deze regio varieert van lekkageherstel en onderhoud tot renovatie van complete dakdelen.",
    housingFocus: "Bij oudere woningen vragen aansluitingen, afwatering en staat van bestaande daklagen vaak extra aandacht.",
    accessibilityFocus: "Bij woningen in drukke of compacte straten is een goede inschatting van bereikbaarheid en werkhoogte essentieel.",
    pricingFactors: [
      "Daktype en bereikbaarheid van het werkvlak",
      "Benodigde herstelomvang en staat van bestaande details",
      "Materiaalkeuze en afwerking rond randen, goten en doorvoeren",
      "Combinatie met isolatie of aanvullende dakwerkzaamheden",
    ],
    processSteps: [
      "Omschrijf je dakvraag met locatie, type woning en zichtbare signalen.",
      "Voeg foto’s en informatie over toegang of werkhoogte toe.",
      "VakConnect koppelt je aanvraag aan passende dakdekkers in of rond de regio.",
      "Daarna stem je planning en aanpak rechtstreeks af met de geselecteerde vakman.",
    ],
    ctaLabel: "Plaats je dakaanvraag",
    subservices: {
      daklekkage: {
        name: "Daklekkage",
        localTaskSummary: "Bij daklekkage is snelle diagnose belangrijk om vervolgschade binnen te beperken.",
        focus: "Heldere informatie over wanneer en waar de lekkage zichtbaar is, helpt bij een gerichte eerste beoordeling.",
      },
      dakrenovatie: {
        name: "Dakrenovatie",
        localTaskSummary: "Dakrenovatie vraagt afweging tussen herstel, levensduur en combinaties met isolatie of afwatering.",
        focus: "Bij renovatie is een complete omschrijving van huidige staat en gewenste eindoplossing belangrijk voor realistische planning.",
      },
    },
  },
  loodgieter: {
    serviceSlug: "loodgieter",
    serviceName: "Loodgieter",
    localTaskSummary: "Loodgieterswerk in de regio loopt van acute storingen tot gepland onderhoud aan leidingen en afvoer.",
    housingFocus: "In bestaande woningen kunnen verouderde aansluitingen of beperkte technische ruimtes invloed hebben op de uitvoering.",
    accessibilityFocus: "Bij appartementen en compacte woningen helpt het om toegang, afsluitmogelijkheden en gewenste werktijden direct te noemen.",
    pricingFactors: [
      "Aard van de storing of onderhoudsvraag",
      "Toegankelijkheid van leidingen, afvoer of aansluitpunten",
      "Benodigde onderdelen en herstelwerk",
      "Mate van urgentie en mogelijke vervolgwerkzaamheden",
    ],
    processSteps: [
      "Beschrijf je loodgietersvraag met duidelijke klachten of doelen.",
      "Geef aan waar het probleem zit en welke ruimtes betrokken zijn.",
      "VakConnect matcht de aanvraag met relevante specialisten in de regio.",
      "Vervolgens stem je vervolg en planning af met de vakman.",
    ],
    ctaLabel: "Plaats je loodgietersaanvraag",
    subservices: {
      lekkage: {
        name: "Lekkage",
        localTaskSummary: "Bij lekkage in leidingen of aansluitingen is snelle lokalisatie belangrijk om extra schade te beperken.",
        focus: "Een complete intake met zichtbare symptomen en timing van de lekkage versnelt de eerste beoordeling.",
      },
      verstopping: {
        name: "Verstopping",
        localTaskSummary: "Terugkerende verstoppingen vragen vaak meer dan alleen tijdelijk ontstoppen.",
        focus: "Door gebruikspatroon, locatie en eerdere maatregelen te delen kan gerichter worden beoordeeld.",
      },
    },
  },
  schilder: {
    serviceSlug: "schilder",
    serviceName: "Schilder",
    localTaskSummary: "Schilderwerk in en rond de woning vraagt afstemming tussen ondergrond, planning en gewenste afwerking.",
    housingFocus: "Bij oudere woningen kunnen ondergrondconditie en bestaande verflagen extra voorbereiding vragen.",
    accessibilityFocus: "Voor buitenwerk spelen bereikbaarheid, weersvenster en werkhoogte regelmatig mee in de planning.",
    pricingFactors: [
      "Binnen- of buitenschilderwerk en totaal oppervlak",
      "Voorbehandeling van ondergrond en herstelwerk",
      "Materiaalkeuze en gewenste afwerkingsgraad",
      "Bereikbaarheid en fasering van de werkzaamheden",
    ],
    processSteps: [
      "Beschrijf welk schilderwerk nodig is en in welke ruimtes of geveldelen.",
      "Voeg foto’s van huidige staat en eventuele herstelpunten toe.",
      "VakConnect koppelt je aanvraag aan passende schilders uit de regio.",
      "Daarna bespreek je planning en uitvoering met de vakman.",
    ],
    ctaLabel: "Plaats je schildersaanvraag",
    subservices: {},
  },
  elektricien: {
    serviceSlug: "elektricien",
    serviceName: "Elektricien",
    localTaskSummary: "Elektrawerk varieert van storingsoplossing tot uitbreiding of aanpassing van installaties.",
    housingFocus: "In oudere woningen kunnen bestaande groepen, bekabeling of aansluitpunten extra aandacht vragen.",
    accessibilityFocus: "Bij werkzaamheden helpt het als je direct aangeeft welke ruimtes, groepenkastdelen of aansluitpunten betrokken zijn.",
    pricingFactors: [
      "Complexiteit van de elektrische vraag",
      "Bereikbaarheid van bekabeling en installatiedelen",
      "Benodigde materialen en veiligheidsaanpassingen",
      "Combinatie met andere renovatie- of onderhoudswerken",
    ],
    processSteps: [
      "Omschrijf je elektravraag en noem de huidige situatie.",
      "Geef aan welke ruimtes of onderdelen geraakt worden.",
      "VakConnect matcht op relevante expertise in of rond jouw regio.",
      "Vervolgens stem je planning en uitvoering direct af met de vakman.",
    ],
    ctaLabel: "Plaats je elektra-aanvraag",
    subservices: {},
  },
};

function buildCanonicalPath(serviceSlug: LocalServiceSlug, citySlug: string, subserviceSlug: string | null) {
  return subserviceSlug ? `/${serviceSlug}/${subserviceSlug}/${citySlug}` : `/${serviceSlug}/${citySlug}`;
}

function buildFaq(profile: ServiceProfile, cityName: string, subserviceName?: string) {
  const intent = subserviceName ? `${subserviceName.toLowerCase()} in ${cityName}` : `${profile.serviceName.toLowerCase()} in ${cityName}`;
  return [
    {
      question: `Hoe vind ik via VakConnect een ${intent}?`,
      answer: `Start met een duidelijke aanvraag op VakConnect. Beschrijf de situatie, voeg relevante details toe en kies de gewenste planning zodat je gekoppeld wordt aan passende vakmensen in of rond ${cityName}.`,
    },
    {
      question: "Kan ik spoed aangeven bij mijn aanvraag?",
      answer:
        "Ja, je kunt urgentie benoemen in je aanvraag. De uiteindelijke beschikbaarheid en responstijd bespreek je daarna rechtstreeks met de vakman die je aanvraag oppakt.",
    },
    {
      question: `Welke informatie helpt voor een goede intake in ${cityName}?`,
      answer:
        "Noem altijd de huidige situatie, gewenste oplossing, bereikbaarheid en eventuele foto’s. Hoe concreter de informatie, hoe beter een vakman de opdracht inhoudelijk kan beoordelen.",
    },
    {
      question: "Werkt VakConnect met vakmensen uit de regio?",
      answer:
        "VakConnect koppelt aanvragen aan passende vakmensen op basis van dienst en werkgebied. Dat kan een specialist uit de stad zelf zijn of uit een omliggende plaats.",
    },
    {
      question: "Kan ik ook een specialist uit een nabijgelegen plaats ontvangen?",
      answer:
        "Ja. Als dat inhoudelijk of qua planning beter past, kan je aanvraag ook uitkomen bij een vakman uit de omliggende regio.",
    },
  ] satisfies ServiceFaq[];
}

function buildLocalSections(profile: ServiceProfile, citySlug: string, subserviceSlug: string | null): ServiceSection[] {
  const location = getLocation(citySlug);
  if (!location) {
    return [];
  }

  const subservice = subserviceSlug ? profile.subservices[subserviceSlug] : undefined;
  const workSummary = subservice ? subservice.localTaskSummary : profile.localTaskSummary;
  const workFocus = subservice ? subservice.focus : profile.housingFocus;
  const scopeLabel = subservice ? `${subservice.name} in ${location.name}` : `${profile.serviceName} in ${location.name}`;

  return [
    {
      heading: `Welke klussen zijn vaak relevant voor ${scopeLabel}`,
      paragraphs: [
        `${workSummary} In ${location.name} helpt het om vooraf te specificeren of het om onderhoud, herstel of bredere renovatie gaat.`,
        `Met een complete intake kan een vakman sneller bepalen welke aanpak het beste past bij jouw situatie in ${location.name}.`,
      ],
      bullets: [
        "duidelijke probleemomschrijving of klusdoel",
        "foto’s van relevante onderdelen",
        "gewenste planning en eventuele urgentie",
        "toegangssituatie en praktische randvoorwaarden",
      ],
    },
    {
      heading: `Woning- en bouwcontext in ${location.name}`,
      paragraphs: [
        `${location.introFacts[0]} ${location.introFacts[1]}`,
        `${workFocus} ${location.localCharacteristics[0]}`,
      ],
    },
    {
      heading: `Bereikbaarheid en planning in ${location.name}`,
      paragraphs: [
        `${location.localCharacteristics[1]} ${profile.accessibilityFocus}`,
        `Door planning, toegang en gewenste uitvoeringsperiode vooraf te delen, wordt de intake inhoudelijk sterker en beter vergelijkbaar.`,
      ],
      type: "info",
    },
    {
      heading: `Prijsfactoren zonder vaste lokale aannames`,
      paragraphs: [
        `De kosten hangen af van de technische situatie, benodigde werkzaamheden en gekozen materialen, niet van standaardbedragen per stad.`,
        `Via VakConnect krijg je ruimte om je situatie in ${location.name} zorgvuldig te beschrijven, zodat een vakman op inhoud kan reageren.`,
      ],
      bullets: profile.pricingFactors,
    },
    {
      heading: `Hoe VakConnect lokaal matcht in ${location.name}`,
      paragraphs: [
        `VakConnect voert het werk niet zelf uit, maar koppelt je aanvraag aan passende vakmensen voor ${scopeLabel.toLowerCase()}.`,
        `De match gebeurt op basis van dienst, inhoud van je aanvraag en werkgebied, waarna je de uitvoering direct met de vakman afstemt.`,
      ],
    },
  ];
}

function buildLocalIntro(profile: ServiceProfile, citySlug: string, subserviceSlug: string | null) {
  const location = getLocation(citySlug);
  if (!location) {
    return [];
  }

  const subservice = subserviceSlug ? profile.subservices[subserviceSlug] : undefined;
  const introTopic = subservice ? subservice.name.toLowerCase() : profile.serviceName.toLowerCase();

  return [
    `Zoek je een ${introTopic} in ${location.name}? VakConnect helpt je om je aanvraag inhoudelijk scherp neer te zetten, zodat je sneller bij een passende vakman uitkomt.`,
    `${location.introFacts[0]} ${subservice ? subservice.focus : profile.localTaskSummary}`,
  ];
}

function toTitleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildRelatedServiceLinks(serviceSlug: LocalServiceSlug, subserviceSlug: string | null): ServiceLink[] {
  const profile = serviceProfiles[serviceSlug];
  const links: ServiceLink[] = [
    {
      href: `/${serviceSlug}`,
      title: `${profile.serviceName} overzicht`,
      description: `Bekijk de hoofdpagina voor ${profile.serviceName.toLowerCase()} en algemene aanpakkeuzes.`,
    },
  ];

  if (subserviceSlug) {
    const subservice = profile.subservices[subserviceSlug];
    if (subservice) {
      links.push({
        href: `/${serviceSlug}/${subserviceSlug}`,
        title: `${subservice.name} zonder lokale filter`,
        description: `Lees de algemene pagina over ${subservice.name.toLowerCase()} en vergelijk aanpakopties.`,
      });
    }
  } else {
    for (const [slug, subservice] of Object.entries(profile.subservices).slice(0, 3)) {
      links.push({
        href: `/${serviceSlug}/${slug}`,
        title: subservice.name,
        description: `Bekijk ${subservice.name.toLowerCase()} als specifieke vervolgroute.`,
      });
    }
  }

  links.push({
    href: "/aanvraag",
    title: "Aanvraag starten",
    description: "Plaats direct je klusaanvraag met details over locatie en planning.",
  });

  return links;
}

function buildContextualLocalServiceLinks(serviceSlug: LocalServiceSlug, citySlug: string, subserviceSlug: string | null): ServiceLink[] {
  const profile = serviceProfiles[serviceSlug];

  if (subserviceSlug) {
    const localMainPath = `/${serviceSlug}/${citySlug}`;
    const siblingLinks = localServicePageConfigs
      .filter(
        (candidate) =>
          candidate.serviceSlug === serviceSlug &&
          candidate.citySlug === citySlug &&
          candidate.subserviceSlug !== null &&
          candidate.subserviceSlug !== subserviceSlug &&
          candidate.published,
      )
      .map((candidate) => {
        const siblingName = profile.subservices[candidate.subserviceSlug!]?.name ?? candidate.subserviceSlug!;
        return {
          href: candidate.canonicalPath,
          title: `${siblingName} in deze stad`,
          description: `Bekijk ook lokale informatie over ${siblingName.toLowerCase()} binnen ${profile.serviceName.toLowerCase()}.`,
        };
      })
      .slice(0, 3);

    return [
      {
        href: localMainPath,
        title: `${profile.serviceName} in deze stad`,
        description: `Ga terug naar de lokale hoofdpagina voor ${profile.serviceName.toLowerCase()}.`,
      },
      ...siblingLinks,
    ];
  }

  const localSubLinks = localServicePageConfigs
    .filter(
      (candidate) =>
        candidate.serviceSlug === serviceSlug &&
        candidate.citySlug === citySlug &&
        candidate.subserviceSlug !== null &&
        candidate.published,
    )
    .map((candidate) => {
      const localSubName = profile.subservices[candidate.subserviceSlug!]?.name ?? candidate.subserviceSlug!;
      return {
        href: candidate.canonicalPath,
        title: `${localSubName} in ${getLocation(citySlug)?.name ?? citySlug}`,
        description: `Lokale verdieping voor ${localSubName.toLowerCase()} in dezelfde stad.`,
      };
    })
    .slice(0, 3);

  return localSubLinks;
}

function buildMainConfig(serviceSlug: LocalServiceSlug, citySlug: string): LocalPageConfig {
  const location = getLocation(citySlug);
  const profile = serviceProfiles[serviceSlug];
  const canonicalPath = buildCanonicalPath(serviceSlug, citySlug, null);

  if (!location) {
    throw new Error(`Onbekende citySlug in main config: ${citySlug}`);
  }

  return {
    serviceSlug,
    subserviceSlug: null,
    citySlug,
    published: true,
    indexable: true,
    canonicalPath,
    localIntro: buildLocalIntro(profile, citySlug, null),
    localSections: buildLocalSections(profile, citySlug, null),
    faq: buildFaq(profile, location.name),
    relatedLocalLinks: location.nearbyCities,
    relatedServiceLinks: buildRelatedServiceLinks(serviceSlug, null),
  };
}

function buildSubConfig(serviceSlug: LocalServiceSlug, subserviceSlug: string, citySlug: string): LocalPageConfig {
  const location = getLocation(citySlug);
  const profile = serviceProfiles[serviceSlug];
  const subservice = profile.subservices[subserviceSlug];
  const canonicalPath = buildCanonicalPath(serviceSlug, citySlug, subserviceSlug);

  if (!location || !subservice) {
    throw new Error(`Onbekende subservice/city config: ${serviceSlug}/${subserviceSlug}/${citySlug}`);
  }

  return {
    serviceSlug,
    subserviceSlug,
    citySlug,
    published: true,
    indexable: true,
    canonicalPath,
    localIntro: buildLocalIntro(profile, citySlug, subserviceSlug),
    localSections: buildLocalSections(profile, citySlug, subserviceSlug),
    faq: buildFaq(profile, location.name, subservice.name),
    relatedLocalLinks: location.nearbyCities,
    relatedServiceLinks: buildRelatedServiceLinks(serviceSlug, subserviceSlug),
  };
}

const localMainConfigs: LocalPageConfig[] = [
  ...cityBatch.map((citySlug) => buildMainConfig("dakdekker", citySlug)),
  ...priorityCityBatch.map((citySlug) => buildMainConfig("loodgieter", citySlug)),
  ...priorityCityBatch.map((citySlug) => buildMainConfig("schilder", citySlug)),
  ...priorityCityBatch.map((citySlug) => buildMainConfig("elektricien", citySlug)),
];

const localSubserviceConfigs: LocalPageConfig[] = [
  ...priorityCityBatch.map((citySlug) => buildSubConfig("dakdekker", "daklekkage", citySlug)),
  ...topFiveCities.map((citySlug) => buildSubConfig("dakdekker", "dakrenovatie", citySlug)),
  ...topFiveCities.map((citySlug) => buildSubConfig("loodgieter", "lekkage", citySlug)),
  ...["den-haag", "groningen", "breda", "tilburg", "nijmegen"].map((citySlug) => buildSubConfig("loodgieter", "verstopping", citySlug)),
];

export const localServicePageConfigs = [...localMainConfigs, ...localSubserviceConfigs];

function buildLocalPage(config: LocalPageConfig): LocalServicePage {
  const location = getLocation(config.citySlug);
  if (!location) {
    throw new Error(`Onbekende citySlug: ${config.citySlug}`);
  }

  const profile = serviceProfiles[config.serviceSlug];
  const subservice = config.subserviceSlug ? profile.subservices[config.subserviceSlug] : undefined;
  const contextLabel = subservice ? `${subservice.name.toLowerCase()} in ${location.name}` : `${profile.serviceName.toLowerCase()} in ${location.name}`;

  const publishedMainRouteSet = new Set(
    localServicePageConfigs
      .filter((candidate) => candidate.published && candidate.subserviceSlug === null)
      .map((candidate) => `/${candidate.serviceSlug}/${candidate.citySlug}`),
  );

  const nearbyLinks = config.relatedLocalLinks
    .map((nearbyCitySlug) => getLocation(nearbyCitySlug))
    .filter((nearbyLocation): nearbyLocation is NonNullable<typeof nearbyLocation> => Boolean(nearbyLocation))
    .map((nearbyLocation) => ({
      href: `/${config.serviceSlug}/${nearbyLocation.slug}`,
      title: `${profile.serviceName} in ${nearbyLocation.name}`,
      description: `Bekijk ook ${profile.serviceName.toLowerCase()} in ${nearbyLocation.name}.`,
    }))
    .filter((link) => publishedMainRouteSet.has(link.href));

  const contextualServiceLinks = buildContextualLocalServiceLinks(config.serviceSlug, config.citySlug, config.subserviceSlug);
  const relatedLinks = [...config.relatedServiceLinks, ...contextualServiceLinks, ...nearbyLinks].filter(
    (link, index, links) => links.findIndex((candidate) => candidate.href === link.href) === index,
  );

  const page: ServiceContentPageData = {
    path: config.canonicalPath,
    title: `${subservice ? `${subservice.name} in ${location.name}` : `${profile.serviceName} in ${location.name}`} nodig? Vind een passende vakman via VakConnect`,
    description: `Lokale uitleg over ${contextLabel}, inclusief woningcontext, planning, prijsfactoren en aanvraagtips voor ${location.name}.`,
    keywords: [
      `${profile.serviceName.toLowerCase()} ${location.name}`,
      `${location.name.toLowerCase()} ${profile.serviceName.toLowerCase()}`,
      subservice ? `${subservice.name.toLowerCase()} ${location.name}` : `${profile.serviceName.toLowerCase()} regio ${location.name}`,
      "VakConnect",
    ],
    h1: `${subservice ? subservice.name : profile.serviceName} in ${location.name} nodig? Vind een passende vakman via VakConnect`,
    intro: config.localIntro,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Diensten", href: "/diensten" },
      { label: toTitleCase(config.serviceSlug), href: `/${config.serviceSlug}` },
      ...(subservice ? [{ label: subservice.name, href: `/${config.serviceSlug}/${config.subserviceSlug}` }] : []),
      { label: location.name },
    ],
    sections: config.localSections,
    costFactors: profile.pricingFactors,
    processSteps: profile.processSteps,
    relatedLinks,
    faqs: config.faq,
    cta: {
      title: `Vind een passende ${subservice ? subservice.name.toLowerCase() : profile.serviceName.toLowerCase()} in ${location.name}`,
      description: `Plaats je aanvraag voor ${location.name} op VakConnect met voldoende details over situatie, planning en bereikbaarheid.`,
      label: profile.ctaLabel,
      secondaryLabel: "Start aanvraag",
      secondaryHref: "/aanvraag",
    },
  };

  return {
    serviceSlug: config.serviceSlug,
    subserviceSlug: config.subserviceSlug,
    citySlug: config.citySlug,
    published: config.published,
    indexable: config.indexable,
    canonicalPath: config.canonicalPath,
    page,
  };
}

export const localServicePages = localServicePageConfigs.map((config) => buildLocalPage(config));

const localPageByPath = new Map(localServicePages.map((page) => [page.canonicalPath, page]));

export function getLocalServicePageByPath(path: string) {
  return localPageByPath.get(path);
}

export function getLocalMainPage(serviceSlug: string, citySlug: string) {
  return localServicePages.find(
    (page) => page.serviceSlug === serviceSlug && page.subserviceSlug === null && page.citySlug === citySlug,
  );
}

export function getLocalSubservicePage(serviceSlug: string, subserviceSlug: string, citySlug: string) {
  return localServicePages.find(
    (page) => page.serviceSlug === serviceSlug && page.subserviceSlug === subserviceSlug && page.citySlug === citySlug,
  );
}

export function getPublishedLocalServicePages() {
  return localServicePages.filter((page) => page.published);
}

export function getIndexableLocalServicePages() {
  return localServicePages.filter((page) => page.published && page.indexable);
}

export function getPublishedLocalRoutes() {
  return getPublishedLocalServicePages().map((page) => page.canonicalPath);
}

export function getIndexableLocalRoutes() {
  return getIndexableLocalServicePages().map((page) => page.canonicalPath);
}

export function getLocalStaticParams() {
  return getPublishedLocalServicePages().map((page) => {
    if (page.subserviceSlug) {
      return { vakgebied: page.serviceSlug, slug: [page.subserviceSlug, page.citySlug] };
    }
    return { vakgebied: page.serviceSlug, slug: [page.citySlug] };
  });
}

export function getKnownLocalCitySlugs() {
  return getPublishedLocations().map((city) => city.slug);
}

export function getLocalLinksForServiceMain(serviceSlug: string, limit = 6): ServiceLink[] {
  return getPublishedLocalServicePages()
    .filter((page) => page.serviceSlug === serviceSlug && page.subserviceSlug === null)
    .slice(0, limit)
    .map((page) => {
      const location = getLocation(page.citySlug);
      return {
        href: page.canonicalPath,
        title: `${serviceProfiles[page.serviceSlug].serviceName} in ${location?.name ?? page.citySlug}`,
        description: `Bekijk lokale informatie voor ${location?.name ?? page.citySlug}.`,
      };
    });
}

export function getLocalLinksForServiceSub(serviceSlug: string, subserviceSlug: string, limit = 6): ServiceLink[] {
  return getPublishedLocalServicePages()
    .filter((page) => page.serviceSlug === serviceSlug && page.subserviceSlug === subserviceSlug)
    .slice(0, limit)
    .map((page) => {
      const location = getLocation(page.citySlug);
      const subserviceName = serviceProfiles[page.serviceSlug].subservices[subserviceSlug]?.name ?? subserviceSlug;
      return {
        href: page.canonicalPath,
        title: `${subserviceName} in ${location?.name ?? page.citySlug}`,
        description: `Lokale pagina over ${subserviceName.toLowerCase()} in ${location?.name ?? page.citySlug}.`,
      };
    });
}

export function getLocalCoverageSummary() {
  const mainPages = getPublishedLocalServicePages().filter((page) => page.subserviceSlug === null);
  const subPages = getPublishedLocalServicePages().filter((page) => page.subserviceSlug !== null);

  return {
    cities: getPublishedLocations().length,
    totalPages: getPublishedLocalServicePages().length,
    mainPages: mainPages.length,
    subPages: subPages.length,
  };
}

export function hasPublishedLocalMainPage(serviceSlug: string, citySlug: string) {
  return getPublishedLocalServicePages().some(
    (page) => page.serviceSlug === serviceSlug && page.subserviceSlug === null && page.citySlug === citySlug,
  );
}

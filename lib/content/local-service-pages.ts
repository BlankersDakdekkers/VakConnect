import type { ServiceContentPageData, ServiceFaq, ServiceLink, ServiceSection } from "./service-pages.ts";
import { allLocations, getLocation, getLocationsByTier, getPublishedLocations, type CityTier } from "./locations.ts";

export type LocalServiceSlug = "dakdekker" | "loodgieter" | "schilder" | "elektricien" | "kozijnen" | "badkamer" | "isolatie" | "verbouwing";

export type LocalPageConfig = {
  serviceSlug: LocalServiceSlug;
  subserviceSlug: string | null;
  citySlug: string;
  tier: CityTier;
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

type ServiceProfile = {
  serviceSlug: LocalServiceSlug;
  serviceName: string;
  localTaskSummary: string;
  housingFocus: string;
  accessibilityFocus: string;
  pricingFactors: string[];
  processSteps: string[];
  ctaLabel: string;
  localAngles: [string, string, string, string];
  subservices: Record<string, { name: string; localTaskSummary: string; focus: string }>;
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
const tierABCities = [...getLocationsByTier("A"), ...getLocationsByTier("B")].map((item) => item.slug);
const subPilotCities = ["amsterdam", "rotterdam", "den-haag", "utrecht"] as const;

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
    localAngles: ["daktypen", "oudere dakdetails", "bereikbaarheid op hoogte", "storm- en onderhoudscontext"],
    subservices: {
      daklekkage: { name: "Daklekkage", localTaskSummary: "Snelle diagnose beperkt vervolgschade.", focus: "Noem waar en wanneer lekkage zichtbaar is." },
      dakrenovatie: { name: "Dakrenovatie", localTaskSummary: "Renovatie vraagt afweging tussen herstel en levensduur.", focus: "Omschrijf huidige staat en gewenste eindoplossing." },
      "dakpannen-vervangen": { name: "Dakpannen vervangen", localTaskSummary: "Pannenwerk vraagt inspectie van onderlaag en bevestiging.", focus: "Benoem leeftijd, type pannen en zichtbare slijtage." },
      "plat-dak": { name: "Plat dak", localTaskSummary: "Bij platte daken is detailcontrole rond naden en afvoer cruciaal.", focus: "Vermeld afwatering, scheuren en recente reparaties." },
    },
  },
  loodgieter: {
    serviceSlug: "loodgieter",
    serviceName: "Loodgieter",
    localTaskSummary: "Loodgieterswerk loopt van acute storingen tot gepland onderhoud.",
    housingFocus: "In bestaande woningen kunnen verouderde aansluitingen of beperkte technische ruimtes invloed hebben op de uitvoering.",
    accessibilityFocus: "Bij appartementen helpt het om toegang, afsluitmogelijkheden en werktijden direct te benoemen.",
    pricingFactors: ["Aard van de storing", "Toegankelijkheid van leidingen", "Benodigde onderdelen", "Mate van urgentie"],
    processSteps: ["Beschrijf je loodgietersvraag", "Geef locatie en bereikbaarheid van het probleem", "VakConnect matcht op dienst en regio", "Stem uitvoering af met de vakman"],
    ctaLabel: "Plaats je loodgietersaanvraag",
    localAngles: ["oudere leidingen", "appartementen", "technische ruimtes", "afvoertrajecten"],
    subservices: {
      lekkage: { name: "Lekkage", localTaskSummary: "Snelle lokalisatie beperkt extra schade.", focus: "Noem zichtbare signalen en timing van het lek." },
      verstopping: { name: "Verstopping", localTaskSummary: "Terugkerende verstoppingen vragen oorzaakonderzoek.", focus: "Deel gebruikspatroon en eerdere maatregelen." },
      leidingwerk: { name: "Leidingwerk", localTaskSummary: "Leidingaanpassingen vragen inzicht in route en aansluitpunten.", focus: "Beschrijf bestaande situatie en gewenste wijziging." },
    },
  },
  schilder: {
    serviceSlug: "schilder",
    serviceName: "Schilder",
    localTaskSummary: "Schilderwerk vraagt afstemming tussen ondergrond, planning en afwerking.",
    housingFocus: "Bij oudere woningen kunnen ondergrondconditie en bestaande verflagen extra voorbereiding vragen.",
    accessibilityFocus: "Voor buitenwerk spelen bereikbaarheid, weersvenster en werkhoogte mee in de planning.",
    pricingFactors: ["Binnen- of buitenwerk", "Voorbehandeling en herstel", "Materiaalkeuze", "Bereikbaarheid en fasering"],
    processSteps: ["Beschrijf ruimtes of geveldelen", "Voeg foto’s van huidige staat toe", "VakConnect matcht met passende schilders", "Stem planning en afwerking af"],
    ctaLabel: "Plaats je schildersaanvraag",
    localAngles: ["buitenwerk", "houten kozijnen", "seizoensplanning", "bereikbaarheid"],
    subservices: {
      binnenschilderwerk: { name: "Binnenschilderwerk", localTaskSummary: "Binnenwerk draait om voorbereiding en afwerkingskwaliteit.", focus: "Noem ruimtes, staat van ondergrond en planning." },
      buitenschilderwerk: { name: "Buitenschilderwerk", localTaskSummary: "Buitenwerk vraagt timing op weersvenster en bereikbaarheid.", focus: "Beschrijf geveldelen en staat van houtwerk." },
    },
  },
  elektricien: {
    serviceSlug: "elektricien",
    serviceName: "Elektricien",
    localTaskSummary: "Elektrawerk varieert van storing tot uitbreiding van installaties.",
    housingFocus: "In oudere woningen kunnen bestaande groepen en bekabeling extra aandacht vragen.",
    accessibilityFocus: "Noem direct welke ruimtes en kastdelen betrokken zijn.",
    pricingFactors: ["Complexiteit van de vraag", "Bereikbaarheid van bekabeling", "Benodigde materialen", "Veiligheidsaanpassingen"],
    processSteps: ["Omschrijf je elektravraag", "Geef betrokken ruimtes of groepen", "VakConnect matcht op expertise", "Stem planning en uitvoering af"],
    ctaLabel: "Plaats je elektra-aanvraag",
    localAngles: ["oudere installaties", "uitbreiding", "appartementen", "groepenkast"],
    subservices: {
      groepenkast: { name: "Groepenkast", localTaskSummary: "Aanpassingen vragen controle op capaciteit en veiligheid.", focus: "Omschrijf huidige kast en uitbreidingswens." },
      storing: { name: "Storing", localTaskSummary: "Storing vraagt systematische diagnose van kring en belasting.", focus: "Noem wanneer en waar de storing optreedt." },
    },
  },
  kozijnen: {
    serviceSlug: "kozijnen",
    serviceName: "Kozijnen specialist",
    localTaskSummary: "Kozijnprojecten combineren materiaalkeuze, isolatiewaarde en plaatsingsdetails.",
    housingFocus: "Bij bestaande bouw bepalen maatvoering, aansluiting en staat van geveldelen de scope.",
    accessibilityFocus: "Bij appartementen of drukke straten moet transport en montageplanning vroeg worden afgestemd.",
    pricingFactors: ["Materiaalkeuze", "Aantal en maatvoering", "Glas en isolatiewaarde", "Demontage en afwerking"],
    processSteps: ["Beschrijf type kozijnvraag", "Deel foto’s en maatindicaties", "VakConnect matcht op relevante expertise", "Stem planning en uitvoering af"],
    ctaLabel: "Plaats je kozijnaanvraag",
    localAngles: ["materiaalkeuze", "isolatie", "oudere bouwdetails", "glasopties"],
    subservices: {
      "kunststof-kozijnen": { name: "Kunststof kozijnen", localTaskSummary: "Kunststof vraagt afstemming op profielkeuze en ventilatie.", focus: "Noem gewenste uitstraling en isolatiedoel." },
      "kozijnen-vervangen": { name: "Kozijnen vervangen", localTaskSummary: "Vervangen vraagt controle op aansluitingen en afwerking.", focus: "Beschrijf huidige staat en prioriteit per gevelopening." },
    },
  },
  badkamer: {
    serviceSlug: "badkamer",
    serviceName: "Badkamerspecialist",
    localTaskSummary: "Badkamerprojecten vragen afstemming van indeling, leidingwerk en ventilatie.",
    housingFocus: "In appartementen zijn ruimte, leidingroutes en geluidsbeperking vaak bepalend.",
    accessibilityFocus: "Afvoer van materiaal en werktijden kunnen verschillen per woningtype.",
    pricingFactors: ["Sloop- en opbouwwerk", "Leidingverlegging", "Sanitairkeuze", "Ventilatie en afwerking"],
    processSteps: ["Omschrijf je badkamerdoel", "Deel huidige indeling en knelpunten", "VakConnect koppelt op passende disciplines", "Stem planning en fasering af"],
    ctaLabel: "Plaats je badkameraanvraag",
    localAngles: ["appartementen", "leidingverlegging", "ventilatie", "ruimte-indeling"],
    subservices: {
      renovatie: { name: "Badkamerrenovatie", localTaskSummary: "Renovatie vraagt heldere scope en volgorde van disciplines.", focus: "Noem welke onderdelen behouden of vervangen worden." },
      "complete-badkamer": { name: "Complete badkamer", localTaskSummary: "Complete vernieuwing vraagt plan op techniek en afbouw.", focus: "Beschrijf stijlwens, indeling en planning." },
    },
  },
  isolatie: {
    serviceSlug: "isolatie",
    serviceName: "Isolatiespecialist",
    localTaskSummary: "Isolatievragen verschillen per bouwperiode en constructiedeel.",
    housingFocus: "Dak-, spouw- en vloeropbouw bepalen welke maatregel technisch past.",
    accessibilityFocus: "Toegang tot constructiedelen en combinatie met renovatie beïnvloeden de planning.",
    pricingFactors: ["Constructietype", "Bereikbaarheid", "Materiaalkeuze", "Combinatie met renovatiewerk"],
    processSteps: ["Beschrijf isolatiedoel", "Noem bouwperiode en constructie", "VakConnect matcht met relevante specialisten", "Bespreek aanpak en planning"],
    ctaLabel: "Plaats je isolatieaanvraag",
    localAngles: ["bouwperiode", "dak/spouw/vloer", "vocht", "renovatiecombinaties"],
    subservices: {
      dakisolatie: { name: "Dakisolatie", localTaskSummary: "Dakisolatie vraagt afstemming met huidige dakopbouw.", focus: "Noem type dak en huidige isolatiestatus." },
      vloerisolatie: { name: "Vloerisolatie", localTaskSummary: "Vloerisolatie draait om toegang en vochtcondities.", focus: "Beschrijf kruipruimte of vloerconstructie." },
    },
  },
  verbouwing: {
    serviceSlug: "verbouwing",
    serviceName: "Verbouwspecialist",
    localTaskSummary: "Verbouwingen vragen integratie van planning, constructie en meerdere disciplines.",
    housingFocus: "Bestaande indeling en constructie bepalen wat efficiënt en haalbaar is.",
    accessibilityFocus: "Logistiek, afvoer en werkvensters zijn belangrijk in bewoonde woningen.",
    pricingFactors: ["Constructieve ingrepen", "Omvang van disciplines", "Logistiek op locatie", "Fasering en doorlooptijd"],
    processSteps: ["Omschrijf verbouwdoel", "Noem huidige situatie en randvoorwaarden", "VakConnect matcht op relevante disciplines", "Stem volgorde en planning af"],
    ctaLabel: "Plaats je verbouwaanvraag",
    localAngles: ["aanbouw/uitbouw", "vergunning/constructie", "logistiek", "disciplinecoördinatie"],
    subservices: {
      aanbouw: { name: "Aanbouw", localTaskSummary: "Aanbouwprojecten vragen constructieve en logistieke voorbereiding.", focus: "Noem gewenste uitbreiding en huidige situatie." },
      uitbouw: { name: "Uitbouw", localTaskSummary: "Uitbouw vraagt afstemming op bestaande constructie en routing.", focus: "Omschrijf afmetingen, toegang en planning." },
    },
  },
};

const serviceNameMap: Record<string, string> = Object.fromEntries(Object.values(serviceProfiles).map((profile) => [profile.serviceSlug, profile.serviceName]));

function toTitleCase(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function hash(input: string) {
  return [...input].reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function buildCanonicalPath(serviceSlug: LocalServiceSlug, citySlug: string, subserviceSlug: string | null) {
  return subserviceSlug ? `/${serviceSlug}/${subserviceSlug}/${citySlug}` : `/${serviceSlug}/${citySlug}`;
}

function buildFaq(profile: ServiceProfile, cityName: string, subserviceName?: string) {
  const intent = subserviceName ? `${subserviceName.toLowerCase()} in ${cityName}` : `${profile.serviceName.toLowerCase()} in ${cityName}`;
  return [
    {
      question: `Hoe vind ik via VakConnect een ${intent}?`,
      answer: `Start met een duidelijke aanvraag op VakConnect en beschrijf de situatie, planning en bereikbaarheid in ${cityName}.`,
    },
    {
      question: "Kan ik spoed of fasering aangeven?",
      answer: "Ja, benoem urgentie en gewenste fasering in de aanvraag zodat dit direct wordt meegewogen in de intake.",
    },
    {
      question: `Welke lokale info helpt voor ${cityName}?`,
      answer: "Noem woningtype, bouwcontext, toegangssituatie en praktische randvoorwaarden zodat de vakman inhoudelijk kan beoordelen.",
    },
    {
      question: "Doet VakConnect de uitvoering zelf?",
      answer: "Nee, VakConnect is een platform en koppelt je aanvraag aan passende vakmensen op basis van dienst en werkgebied.",
    },
  ] satisfies ServiceFaq[];
}

function buildLocalIntro(profile: ServiceProfile, citySlug: string, subserviceSlug: string | null) {
  const location = getLocation(citySlug);
  if (!location) return [];

  const subservice = subserviceSlug ? profile.subservices[subserviceSlug] : undefined;
  const introTopic = subservice ? subservice.name.toLowerCase() : profile.serviceName.toLowerCase();
  return [
    `Zoek je een ${introTopic} in ${location.name}? VakConnect helpt je om je aanvraag inhoudelijk scherp neer te zetten voor een betere match.`,
    `${location.introFacts[0]} ${subservice ? subservice.focus : profile.localTaskSummary}`,
  ];
}

function buildLocalSections(profile: ServiceProfile, citySlug: string, subserviceSlug: string | null): ServiceSection[] {
  const location = getLocation(citySlug);
  if (!location) return [];

  const subservice = subserviceSlug ? profile.subservices[subserviceSlug] : undefined;
  const workSummary = subservice ? subservice.localTaskSummary : profile.localTaskSummary;
  const workFocus = subservice ? subservice.focus : profile.housingFocus;
  const sectionVariant = hash(`${profile.serviceSlug}-${citySlug}-${subserviceSlug ?? "main"}`) % 2;

  const blocks: ServiceSection[] = [
    {
      heading: sectionVariant === 0 ? `Lokale context voor ${location.name}` : `Wat speelt lokaal in ${location.name}`,
      paragraphs: [
        `${workSummary} ${location.localCharacteristics[0]}`,
        `${workFocus} ${location.contentProfile.renovationContext}`,
      ],
      bullets: [
        `Aandachtspunt: ${profile.localAngles[0]}`,
        `Aandachtspunt: ${profile.localAngles[1]}`,
        `Aandachtspunt: ${profile.localAngles[2]}`,
        `Aandachtspunt: ${profile.localAngles[3]}`,
      ],
    },
    {
      heading: sectionVariant === 0 ? `Planning en logistiek` : `Bereikbaarheid en uitvoering`,
      paragraphs: [
        `${location.localCharacteristics[1]}`,
        `${profile.accessibilityFocus} Door intake met toegang, planning en constraints vooraf te delen wordt de aanvraag beter vergelijkbaar.`,
      ],
      type: "info",
    },
    {
      heading: "Prijsfactoren zonder lokale aannames",
      paragraphs: [
        "Kosten volgen uit technische situatie, werkomvang en materiaalkeuze; niet uit standaardbedragen per stad.",
        `Een complete aanvraag voor ${location.name} maakt het voor vakmensen eenvoudiger om op inhoud te reageren.`,
      ],
      bullets: profile.pricingFactors,
    },
    {
      heading: "Woningcontext en voorbereiding",
      paragraphs: [
        `${location.introFacts[1]}`,
        `Beschrijf woningtype, bouwperiode, toegang en eventuele combinatieklussen zodat de intake in één keer bruikbaar is.`,
      ],
    },
  ];

  return sectionVariant === 0 ? blocks : [blocks[1], blocks[0], blocks[3], blocks[2]];
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

  if (subserviceSlug && profile.subservices[subserviceSlug]) {
    links.push({
      href: `/${serviceSlug}/${subserviceSlug}`,
      title: `${profile.subservices[subserviceSlug].name} zonder lokale filter`,
      description: `Lees de algemene pagina over ${profile.subservices[subserviceSlug].name.toLowerCase()}.`,
    });
  } else {
    for (const [slug, subservice] of Object.entries(profile.subservices).slice(0, 3)) {
      links.push({ href: `/${serviceSlug}/${slug}`, title: subservice.name, description: `Bekijk ${subservice.name.toLowerCase()} als vervolgroute.` });
    }
  }

  links.push({ href: "/aanvraag", title: "Aanvraag starten", description: "Plaats je klusaanvraag met context en planning." });
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
      .slice(0, 3)
      .map((candidate) => {
        const siblingName = profile.subservices[candidate.subserviceSlug!]?.name ?? candidate.subserviceSlug!;
        return {
          href: candidate.canonicalPath,
          title: `${siblingName} in deze stad`,
          description: `Lokale verdieping voor ${siblingName.toLowerCase()} in ${getLocation(citySlug)?.name ?? citySlug}.`,
        };
      });

    return [
      { href: localMainPath, title: `${profile.serviceName} in deze stad`, description: `Ga naar de lokale hoofdpagina voor ${profile.serviceName.toLowerCase()}.` },
      ...siblingLinks,
    ];
  }

  return localServicePageConfigs
    .filter((candidate) => candidate.serviceSlug === serviceSlug && candidate.citySlug === citySlug && candidate.subserviceSlug !== null && candidate.published)
    .slice(0, 3)
    .map((candidate) => {
      const subName = profile.subservices[candidate.subserviceSlug!]?.name ?? candidate.subserviceSlug!;
      return {
        href: candidate.canonicalPath,
        title: `${subName} in ${getLocation(citySlug)?.name ?? citySlug}`,
        description: `Lokale vervolgpagina over ${subName.toLowerCase()} in dezelfde stad.`,
      };
    });
}

function buildConfig(serviceSlug: LocalServiceSlug, citySlug: string, subserviceSlug: string | null, published: boolean): LocalPageConfig {
  const location = getLocation(citySlug);
  if (!location) throw new Error(`Onbekende citySlug: ${citySlug}`);

  const profile = serviceProfiles[serviceSlug];
  const subservice = subserviceSlug ? profile.subservices[subserviceSlug] : undefined;
  return {
    serviceSlug,
    subserviceSlug,
    citySlug,
    tier: location.tier,
    published,
    indexable: published,
    canonicalPath: buildCanonicalPath(serviceSlug, citySlug, subserviceSlug),
    localIntro: buildLocalIntro(profile, citySlug, subserviceSlug),
    localSections: buildLocalSections(profile, citySlug, subserviceSlug),
    faq: buildFaq(profile, location.name, subservice?.name),
    relatedLocalLinks: location.nearbyCities,
    relatedServiceLinks: buildRelatedServiceLinks(serviceSlug, subserviceSlug),
  };
}

const publishedMainConfigs: LocalPageConfig[] = [
  ...cityBatch.map((citySlug) => buildConfig("dakdekker", citySlug, null, true)),
  ...priorityCityBatch.map((citySlug) => buildConfig("loodgieter", citySlug, null, true)),
  ...priorityCityBatch.map((citySlug) => buildConfig("schilder", citySlug, null, true)),
  ...priorityCityBatch.map((citySlug) => buildConfig("elektricien", citySlug, null, true)),
  ...priorityCityBatch.map((citySlug) => buildConfig("kozijnen", citySlug, null, true)),
  ...priorityCityBatch.map((citySlug) => buildConfig("badkamer", citySlug, null, true)),
  ...priorityCityBatch.map((citySlug) => buildConfig("isolatie", citySlug, null, true)),
  ...priorityCityBatch.map((citySlug) => buildConfig("verbouwing", citySlug, null, true)),
];

const publishedSubserviceConfigs: LocalPageConfig[] = [
  ...priorityCityBatch.map((citySlug) => buildConfig("dakdekker", citySlug, "daklekkage", true)),
  ...topFiveCities.map((citySlug) => buildConfig("dakdekker", citySlug, "dakrenovatie", true)),
  ...topFiveCities.map((citySlug) => buildConfig("loodgieter", citySlug, "lekkage", true)),
  ...["den-haag", "groningen", "breda", "tilburg", "nijmegen"].map((citySlug) => buildConfig("loodgieter", citySlug, "verstopping", true)),
];

const publishedPathSet = new Set([...publishedMainConfigs, ...publishedSubserviceConfigs].map((item) => item.canonicalPath));

const draftMainConfigs = tierABCities.flatMap((citySlug) =>
  (Object.keys(serviceProfiles) as LocalServiceSlug[])
    .map((serviceSlug) => buildConfig(serviceSlug, citySlug, null, false))
    .filter((config) => !publishedPathSet.has(config.canonicalPath)),
);

const subservicePilotList: Array<{ serviceSlug: LocalServiceSlug; subserviceSlug: string }> = [
  { serviceSlug: "dakdekker", subserviceSlug: "daklekkage" },
  { serviceSlug: "dakdekker", subserviceSlug: "dakrenovatie" },
  { serviceSlug: "dakdekker", subserviceSlug: "dakpannen-vervangen" },
  { serviceSlug: "dakdekker", subserviceSlug: "plat-dak" },
  { serviceSlug: "loodgieter", subserviceSlug: "lekkage" },
  { serviceSlug: "loodgieter", subserviceSlug: "verstopping" },
  { serviceSlug: "loodgieter", subserviceSlug: "leidingwerk" },
  { serviceSlug: "schilder", subserviceSlug: "binnenschilderwerk" },
  { serviceSlug: "schilder", subserviceSlug: "buitenschilderwerk" },
  { serviceSlug: "elektricien", subserviceSlug: "groepenkast" },
  { serviceSlug: "elektricien", subserviceSlug: "storing" },
  { serviceSlug: "kozijnen", subserviceSlug: "kunststof-kozijnen" },
  { serviceSlug: "kozijnen", subserviceSlug: "kozijnen-vervangen" },
  { serviceSlug: "badkamer", subserviceSlug: "renovatie" },
  { serviceSlug: "badkamer", subserviceSlug: "complete-badkamer" },
  { serviceSlug: "isolatie", subserviceSlug: "dakisolatie" },
  { serviceSlug: "isolatie", subserviceSlug: "vloerisolatie" },
  { serviceSlug: "verbouwing", subserviceSlug: "aanbouw" },
  { serviceSlug: "verbouwing", subserviceSlug: "uitbouw" },
];

const draftSubserviceConfigs = subservicePilotList.flatMap(({ serviceSlug, subserviceSlug }) =>
  subPilotCities
    .map((citySlug) => buildConfig(serviceSlug, citySlug, subserviceSlug, false))
    .filter((config) => !publishedPathSet.has(config.canonicalPath)),
);

export const localServicePageConfigs = [
  ...publishedMainConfigs,
  ...publishedSubserviceConfigs,
  ...draftMainConfigs,
  ...draftSubserviceConfigs,
];

function buildLocalPage(config: LocalPageConfig): LocalServicePage {
  const location = getLocation(config.citySlug);
  if (!location) throw new Error(`Onbekende citySlug: ${config.citySlug}`);

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
      `${serviceNameMap[profile.serviceSlug].toLowerCase()} ${location.name}`,
      `${location.name.toLowerCase()} ${serviceNameMap[profile.serviceSlug].toLowerCase()}`,
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
      description: `Plaats je aanvraag voor ${location.name} met voldoende details over situatie, planning en bereikbaarheid.`,
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
  return localServicePages.find((page) => page.serviceSlug === serviceSlug && page.subserviceSlug === null && page.citySlug === citySlug);
}

export function getLocalSubservicePage(serviceSlug: string, subserviceSlug: string, citySlug: string) {
  return localServicePages.find((page) => page.serviceSlug === serviceSlug && page.subserviceSlug === subserviceSlug && page.citySlug === citySlug);
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
  return getPublishedLocalServicePages().map((page) =>
    page.subserviceSlug ? { vakgebied: page.serviceSlug, slug: [page.subserviceSlug, page.citySlug] } : { vakgebied: page.serviceSlug, slug: [page.citySlug] },
  );
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
        title: `${serviceNameMap[page.serviceSlug] ?? toTitleCase(page.serviceSlug)} in ${location?.name ?? page.citySlug}`,
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
  const pages = getPublishedLocalServicePages();
  const mainPages = pages.filter((page) => page.subserviceSlug === null);
  const subPages = pages.filter((page) => page.subserviceSlug !== null);

  return {
    cities: getPublishedLocations().length,
    totalPages: pages.length,
    mainPages: mainPages.length,
    subPages: subPages.length,
    tierA: allLocations.filter((city) => city.tier === "A").length,
    tierB: allLocations.filter((city) => city.tier === "B").length,
    tierC: allLocations.filter((city) => city.tier === "C").length,
    draftMainPages: localServicePageConfigs.filter((page) => !page.published && page.subserviceSlug === null).length,
    draftSubPages: localServicePageConfigs.filter((page) => !page.published && page.subserviceSlug !== null).length,
  };
}

export function hasPublishedLocalMainPage(serviceSlug: string, citySlug: string) {
  return getPublishedLocalServicePages().some((page) => page.serviceSlug === serviceSlug && page.subserviceSlug === null && page.citySlug === citySlug);
}

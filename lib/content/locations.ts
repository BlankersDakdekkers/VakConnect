export type CityTier = "A" | "B" | "C";

export type CityContentProfile = {
  urbanDensity: "hoog" | "gemiddeld" | "lager";
  buildingEraMix: "historische-kern-mix" | "naoorlogse-mix" | "nieuwbouw-groei" | "gemengd";
  accessibilityNotes: string;
  apartmentShareBand: "hoog" | "gemiddeld" | "lager";
  renovationContext: string;
  parkingLogistics: string;
  historicCore: boolean;
  suburbanExpansion: boolean;
};

export type LocationContent = {
  slug: string;
  name: string;
  province: string;
  regionLabel: string | null;
  tier: CityTier;
  introFacts: [string, string];
  localCharacteristics: [string, string];
  nearbyCities: string[];
  published: boolean;
  indexable: boolean;
  priority: number;
  populationBand?: string;
  housingNotes?: string;
  contentProfile: CityContentProfile;
};

type LocationSeed = {
  slug: string;
  name: string;
  province: string;
  regionLabel: string | null;
  tier: CityTier;
  nearbyCities: [string, string, string];
  populationBand: string;
  historicCore?: boolean;
  suburbanExpansion?: boolean;
};

const seeds: LocationSeed[] = [
  { slug: "amsterdam", name: "Amsterdam", province: "Noord-Holland", regionLabel: "Randstad", tier: "A", nearbyCities: ["haarlem", "hoofddorp", "zaandam"], populationBand: "zeer grootstedelijk", historicCore: true },
  { slug: "rotterdam", name: "Rotterdam", province: "Zuid-Holland", regionLabel: "Randstad", tier: "A", nearbyCities: ["schiedam", "vlaardingen", "capelle-aan-den-ijssel"], populationBand: "zeer grootstedelijk" },
  { slug: "den-haag", name: "Den Haag", province: "Zuid-Holland", regionLabel: "Randstad", tier: "A", nearbyCities: ["leiden", "rotterdam", "delft"], populationBand: "zeer grootstedelijk" },
  { slug: "utrecht", name: "Utrecht", province: "Utrecht", regionLabel: "Midden-Nederland", tier: "A", nearbyCities: ["amersfoort", "hilversum", "hoofddorp"], populationBand: "grootstedelijk", historicCore: true },
  { slug: "eindhoven", name: "Eindhoven", province: "Noord-Brabant", regionLabel: "Zuidoost-Brabant", tier: "A", nearbyCities: ["helmond", "den-bosch", "tilburg"], populationBand: "grootstedelijk", suburbanExpansion: true },
  { slug: "groningen", name: "Groningen", province: "Groningen", regionLabel: "Noord-Nederland", tier: "A", nearbyCities: ["assen", "heerenveen", "drachten"], populationBand: "regionale stad", historicCore: true },
  { slug: "tilburg", name: "Tilburg", province: "Noord-Brabant", regionLabel: "Midden-Brabant", tier: "A", nearbyCities: ["breda", "waalwijk", "eindhoven"], populationBand: "grote stad" },
  { slug: "breda", name: "Breda", province: "Noord-Brabant", regionLabel: "West-Brabant", tier: "A", nearbyCities: ["roosendaal", "etten-leur", "tilburg"], populationBand: "grote stad", historicCore: true },
  { slug: "nijmegen", name: "Nijmegen", province: "Gelderland", regionLabel: "Rijk van Nijmegen", tier: "A", nearbyCities: ["arnhem", "oss", "ede"], populationBand: "grote stad", historicCore: true },
  { slug: "arnhem", name: "Arnhem", province: "Gelderland", regionLabel: "Arnhem-Nijmegen", tier: "A", nearbyCities: ["nijmegen", "ede", "doetinchem"], populationBand: "middelgrote stad", historicCore: true },
  { slug: "haarlem", name: "Haarlem", province: "Noord-Holland", regionLabel: "Randstad", tier: "A", nearbyCities: ["hoofddorp", "amsterdam", "zaandam"], populationBand: "middelgrote stad", historicCore: true },
  { slug: "almere", name: "Almere", province: "Flevoland", regionLabel: "Flevoland", tier: "A", nearbyCities: ["amsterdam", "lelystad", "amersfoort"], populationBand: "grote stad", suburbanExpansion: true },
  { slug: "zwolle", name: "Zwolle", province: "Overijssel", regionLabel: "Regio Zwolle", tier: "A", nearbyCities: ["deventer", "kampen", "harderwijk"], populationBand: "middelgrote stad", historicCore: true },
  { slug: "amersfoort", name: "Amersfoort", province: "Utrecht", regionLabel: "Midden-Nederland", tier: "A", nearbyCities: ["utrecht", "hilversum", "veenendaal"], populationBand: "middelgrote stad", historicCore: true },

  { slug: "maastricht", name: "Maastricht", province: "Limburg", regionLabel: "Zuid-Limburg", tier: "B", nearbyCities: ["heerlen", "sittard", "roermond"], populationBand: "middelgrote stad", historicCore: true },
  { slug: "enschede", name: "Enschede", province: "Overijssel", regionLabel: "Twente", tier: "B", nearbyCities: ["hengelo", "almelo", "deventer"], populationBand: "middelgrote stad" },
  { slug: "leiden", name: "Leiden", province: "Zuid-Holland", regionLabel: "Randstad", tier: "B", nearbyCities: ["delft", "den-haag", "zoetermeer"], populationBand: "middelgrote stad", historicCore: true },
  { slug: "den-bosch", name: "Den Bosch", province: "Noord-Brabant", regionLabel: "Noordoost-Brabant", tier: "B", nearbyCities: ["oss", "waalwijk", "eindhoven"], populationBand: "middelgrote stad", historicCore: true },
  { slug: "apeldoorn", name: "Apeldoorn", province: "Gelderland", regionLabel: "Veluwe", tier: "B", nearbyCities: ["deventer", "harderwijk", "ede"], populationBand: "middelgrote stad", suburbanExpansion: true },
  { slug: "deventer", name: "Deventer", province: "Overijssel", regionLabel: "Stedendriehoek", tier: "B", nearbyCities: ["apeldoorn", "zwolle", "hengelo"], populationBand: "middelgrote stad", historicCore: true },
  { slug: "alkmaar", name: "Alkmaar", province: "Noord-Holland", regionLabel: "Noord-Holland Noord", tier: "B", nearbyCities: ["hoorn", "purmerend", "zaandam"], populationBand: "middelgrote stad", historicCore: true },
  { slug: "ede", name: "Ede", province: "Gelderland", regionLabel: "Foodvalley", tier: "B", nearbyCities: ["veenendaal", "wageningen", "arnhem"], populationBand: "middelgrote stad", suburbanExpansion: true },
  { slug: "gouda", name: "Gouda", province: "Zuid-Holland", regionLabel: "Midden-Holland", tier: "B", nearbyCities: ["zoetermeer", "capelle-aan-den-ijssel", "rotterdam"], populationBand: "middelgrote stad", historicCore: true },
  { slug: "zoetermeer", name: "Zoetermeer", province: "Zuid-Holland", regionLabel: "Randstad", tier: "B", nearbyCities: ["delft", "den-haag", "gouda"], populationBand: "middelgrote stad", suburbanExpansion: true },

  { slug: "dordrecht", name: "Dordrecht", province: "Zuid-Holland", regionLabel: "Drechtsteden", tier: "C", nearbyCities: ["rotterdam", "oosterhout", "roosendaal"], populationBand: "middelgrote stad", historicCore: true },
  { slug: "leeuwarden", name: "Leeuwarden", province: "Friesland", regionLabel: "Noord-Nederland", tier: "C", nearbyCities: ["heerenveen", "sneek", "drachten"], populationBand: "middelgrote stad", historicCore: true },
  { slug: "venlo", name: "Venlo", province: "Limburg", regionLabel: "Noord-Limburg", tier: "C", nearbyCities: ["roermond", "sittard", "maastricht"], populationBand: "middelgrote stad" },
  { slug: "roermond", name: "Roermond", province: "Limburg", regionLabel: "Midden-Limburg", tier: "C", nearbyCities: ["venlo", "sittard", "maastricht"], populationBand: "regionale stad", historicCore: true },
  { slug: "heerlen", name: "Heerlen", province: "Limburg", regionLabel: "Zuid-Limburg", tier: "C", nearbyCities: ["maastricht", "sittard", "venlo"], populationBand: "regionale stad" },
  { slug: "sittard", name: "Sittard", province: "Limburg", regionLabel: "Zuid-Limburg", tier: "C", nearbyCities: ["maastricht", "heerlen", "roermond"], populationBand: "regionale stad", historicCore: true },
  { slug: "helmond", name: "Helmond", province: "Noord-Brabant", regionLabel: "Zuidoost-Brabant", tier: "C", nearbyCities: ["eindhoven", "oss", "den-bosch"], populationBand: "regionale stad" },
  { slug: "oss", name: "Oss", province: "Noord-Brabant", regionLabel: "Noordoost-Brabant", tier: "C", nearbyCities: ["den-bosch", "nijmegen", "waalwijk"], populationBand: "regionale stad" },
  { slug: "roosendaal", name: "Roosendaal", province: "Noord-Brabant", regionLabel: "West-Brabant", tier: "C", nearbyCities: ["bergen-op-zoom", "etten-leur", "breda"], populationBand: "regionale stad" },
  { slug: "bergen-op-zoom", name: "Bergen op Zoom", province: "Noord-Brabant", regionLabel: "West-Brabant", tier: "C", nearbyCities: ["roosendaal", "etten-leur", "breda"], populationBand: "regionale stad", historicCore: true },
  { slug: "oosterhout", name: "Oosterhout", province: "Noord-Brabant", regionLabel: "West-Brabant", tier: "C", nearbyCities: ["breda", "waalwijk", "tilburg"], populationBand: "regionale stad" },
  { slug: "etten-leur", name: "Etten-Leur", province: "Noord-Brabant", regionLabel: "West-Brabant", tier: "C", nearbyCities: ["breda", "roosendaal", "bergen-op-zoom"], populationBand: "regionale stad" },
  { slug: "waalwijk", name: "Waalwijk", province: "Noord-Brabant", regionLabel: "Midden-Brabant", tier: "C", nearbyCities: ["tilburg", "den-bosch", "oosterhout"], populationBand: "regionale stad" },
  { slug: "alphen-aan-den-rijn", name: "Alphen aan den Rijn", province: "Zuid-Holland", regionLabel: "Groene Hart", tier: "C", nearbyCities: ["gouda", "leiden", "zoetermeer"], populationBand: "regionale stad" },
  { slug: "delft", name: "Delft", province: "Zuid-Holland", regionLabel: "Randstad", tier: "C", nearbyCities: ["den-haag", "rotterdam", "zoetermeer"], populationBand: "regionale stad", historicCore: true },
  { slug: "schiedam", name: "Schiedam", province: "Zuid-Holland", regionLabel: "Rijnmond", tier: "C", nearbyCities: ["rotterdam", "vlaardingen", "delft"], populationBand: "regionale stad", historicCore: true },
  { slug: "vlaardingen", name: "Vlaardingen", province: "Zuid-Holland", regionLabel: "Rijnmond", tier: "C", nearbyCities: ["rotterdam", "schiedam", "capelle-aan-den-ijssel"], populationBand: "regionale stad" },
  { slug: "capelle-aan-den-ijssel", name: "Capelle aan den IJssel", province: "Zuid-Holland", regionLabel: "Rijnmond", tier: "C", nearbyCities: ["rotterdam", "vlaardingen", "gouda"], populationBand: "regionale stad", suburbanExpansion: true },
  { slug: "hoofddorp", name: "Hoofddorp", province: "Noord-Holland", regionLabel: "Haarlemmermeer", tier: "C", nearbyCities: ["amsterdam", "haarlem", "zaandam"], populationBand: "regionale stad", suburbanExpansion: true },
  { slug: "zaandam", name: "Zaandam", province: "Noord-Holland", regionLabel: "Zaanstreek", tier: "C", nearbyCities: ["amsterdam", "purmerend", "alkmaar"], populationBand: "regionale stad" },
  { slug: "hilversum", name: "Hilversum", province: "Noord-Holland", regionLabel: "Het Gooi", tier: "C", nearbyCities: ["utrecht", "amersfoort", "purmerend"], populationBand: "regionale stad" },
  { slug: "purmerend", name: "Purmerend", province: "Noord-Holland", regionLabel: "Waterland", tier: "C", nearbyCities: ["zaandam", "hoorn", "amsterdam"], populationBand: "regionale stad", suburbanExpansion: true },
  { slug: "hoorn", name: "Hoorn", province: "Noord-Holland", regionLabel: "West-Friesland", tier: "C", nearbyCities: ["purmerend", "alkmaar", "zaandam"], populationBand: "regionale stad", historicCore: true },
  { slug: "lelystad", name: "Lelystad", province: "Flevoland", regionLabel: "Flevoland", tier: "C", nearbyCities: ["almere", "kampen", "harderwijk"], populationBand: "regionale stad", suburbanExpansion: true },
  { slug: "hengelo", name: "Hengelo", province: "Overijssel", regionLabel: "Twente", tier: "C", nearbyCities: ["enschede", "almelo", "deventer"], populationBand: "regionale stad" },
  { slug: "almelo", name: "Almelo", province: "Overijssel", regionLabel: "Twente", tier: "C", nearbyCities: ["enschede", "hengelo", "deventer"], populationBand: "regionale stad" },
  { slug: "kampen", name: "Kampen", province: "Overijssel", regionLabel: "Regio Zwolle", tier: "C", nearbyCities: ["zwolle", "deventer", "lelystad"], populationBand: "regionale stad", historicCore: true },
  { slug: "harderwijk", name: "Harderwijk", province: "Gelderland", regionLabel: "Veluwe", tier: "C", nearbyCities: ["apeldoorn", "ede", "lelystad"], populationBand: "regionale stad", historicCore: true },
  { slug: "veenendaal", name: "Veenendaal", province: "Utrecht", regionLabel: "Foodvalley", tier: "C", nearbyCities: ["ede", "wageningen", "amersfoort"], populationBand: "regionale stad" },
  { slug: "wageningen", name: "Wageningen", province: "Gelderland", regionLabel: "Foodvalley", tier: "C", nearbyCities: ["ede", "veenendaal", "arnhem"], populationBand: "regionale stad", historicCore: true },
  { slug: "doetinchem", name: "Doetinchem", province: "Gelderland", regionLabel: "Achterhoek", tier: "C", nearbyCities: ["arnhem", "zutphen", "deventer"], populationBand: "regionale stad" },
  { slug: "zutphen", name: "Zutphen", province: "Gelderland", regionLabel: "Achterhoek", tier: "C", nearbyCities: ["deventer", "doetinchem", "apeldoorn"], populationBand: "regionale stad", historicCore: true },
  { slug: "assen", name: "Assen", province: "Drenthe", regionLabel: "Noord-Drenthe", tier: "C", nearbyCities: ["groningen", "emmen", "heerenveen"], populationBand: "regionale stad" },
  { slug: "emmen", name: "Emmen", province: "Drenthe", regionLabel: "Zuidoost-Drenthe", tier: "C", nearbyCities: ["assen", "groningen", "heerenveen"], populationBand: "regionale stad" },
  { slug: "drachten", name: "Drachten", province: "Friesland", regionLabel: "Zuidoost-Friesland", tier: "C", nearbyCities: ["heerenveen", "leeuwarden", "sneek"], populationBand: "regionale stad", suburbanExpansion: true },
  { slug: "sneek", name: "Sneek", province: "Friesland", regionLabel: "Zuidwest-Friesland", tier: "C", nearbyCities: ["leeuwarden", "heerenveen", "drachten"], populationBand: "regionale stad", historicCore: true },
  { slug: "heerenveen", name: "Heerenveen", province: "Friesland", regionLabel: "Zuidoost-Friesland", tier: "C", nearbyCities: ["leeuwarden", "drachten", "sneek"], populationBand: "regionale stad" },
];

function buildContentProfile(seed: LocationSeed): CityContentProfile {
  return {
    urbanDensity: seed.tier === "A" ? "hoog" : seed.tier === "B" ? "gemiddeld" : "lager",
    buildingEraMix: seed.historicCore ? "historische-kern-mix" : seed.suburbanExpansion ? "nieuwbouw-groei" : seed.tier === "C" ? "naoorlogse-mix" : "gemengd",
    accessibilityNotes:
      seed.tier === "A"
        ? "Compacte straten en drukke verkeersstromen vragen vaak extra afstemming op toegang en werkvensters."
        : "Bereikbaarheid verschilt per wijk; een duidelijke intake over toegang, parkeren en materiaalrouting helpt de planning.",
    apartmentShareBand: seed.tier === "A" ? "hoog" : seed.tier === "B" ? "gemiddeld" : "lager",
    renovationContext:
      seed.historicCore
        ? "Combinatie van oudere bouw en recente renovaties vraagt om zorgvuldige opname van bestaande details."
        : "Mix van bestaande bouw en nieuwere woonwijken zorgt voor uiteenlopende onderhouds- en uitbreidingsvragen.",
    parkingLogistics:
      seed.tier === "A"
        ? "Parkeren en laden/lossen zijn niet overal vanzelfsprekend; planning vooraf voorkomt vertraging."
        : "Parkeer- en toegangssituatie is vaak beheersbaar, maar verschilt per buurt en type woning.",
    historicCore: Boolean(seed.historicCore),
    suburbanExpansion: Boolean(seed.suburbanExpansion),
  };
}

function buildLocation(seed: LocationSeed): LocationContent {
  const profile = buildContentProfile(seed);
  const densityLabel =
    profile.urbanDensity === "hoog" ? "dichtbebouwde" : profile.urbanDensity === "gemiddeld" ? "gevarieerde" : "ruimer opgezette";

  return {
    slug: seed.slug,
    name: seed.name,
    province: seed.province,
    regionLabel: seed.regionLabel,
    tier: seed.tier,
    introFacts: [
      `${seed.name} heeft ${densityLabel} woongebieden met een mix van bouwperioden en woningtypen.`,
      `Lokale planning wordt sterker wanneer woningcontext, bereikbaarheid en gewenste uitvoeringsperiode vooraf concreet zijn.`,
    ],
    localCharacteristics: [
      profile.renovationContext,
      `${profile.accessibilityNotes} ${profile.parkingLogistics}`,
    ],
    nearbyCities: seed.nearbyCities,
    published: true,
    indexable: true,
    priority: seed.tier === "A" ? 0.95 : seed.tier === "B" ? 0.8 : 0.64,
    populationBand: seed.populationBand,
    housingNotes: `${seed.name} (${seed.province}) wordt redactioneel beoordeeld met focus op ${profile.buildingEraMix.replace(/-/g, " ")} en ${profile.apartmentShareBand} appartementendichtheid.`,
    contentProfile: profile,
  };
}

const locations: Record<string, LocationContent> = Object.fromEntries(seeds.map((seed) => [seed.slug, buildLocation(seed)]));

export const allLocations = Object.values(locations);
export const locationSlugs = allLocations.map((location) => location.slug);

export function getLocation(citySlug: string) {
  return locations[citySlug];
}

export function getPublishedLocations() {
  return allLocations.filter((location) => location.published);
}

export function getIndexableLocations() {
  return allLocations.filter((location) => location.published && location.indexable);
}

export function getLocationsByTier(tier: CityTier) {
  return allLocations.filter((location) => location.tier === tier);
}

export type LocationContent = {
  slug: string;
  name: string;
  province: string;
  regionLabel: string | null;
  introFacts: [string, string];
  localCharacteristics: [string, string];
  nearbyCities: string[];
  published: boolean;
  indexable: boolean;
  priority: number;
  populationBand?: string;
  housingNotes?: string;
};

const locations = {
  amsterdam: {
    slug: "amsterdam",
    name: "Amsterdam",
    province: "Noord-Holland",
    regionLabel: "Randstad",
    introFacts: [
      "Amsterdam combineert dichtbebouwde buurten met veel appartementen, portiekwoningen en gemengde bouwperioden.",
      "Planning in de stad vraagt vaak extra aandacht voor bereikbaarheid, laden en lossen en werkmomenten in drukke straten.",
    ],
    localCharacteristics: [
      "Bij oudere panden vraagt de combinatie van bestaande installaties en renovaties om een zorgvuldige opname vooraf.",
      "In buurten met weinig parkeerruimte helpt het om toegang, steigeropties of liftgebruik vroeg in de aanvraag te benoemen.",
    ],
    nearbyCities: ["haarlem", "almere", "utrecht"],
    published: true,
    indexable: true,
    priority: 0.95,
    populationBand: "zeer grootstedelijk",
    housingNotes: "Veel appartementen, gemengde woningvoorraad en veel woningen uit verschillende bouwperioden.",
  },
  rotterdam: {
    slug: "rotterdam",
    name: "Rotterdam",
    province: "Zuid-Holland",
    regionLabel: "Randstad",
    introFacts: [
      "Rotterdam heeft een mix van hoogstedelijke gebieden, wederopbouwwijken en nieuwbouwlocaties.",
      "Bij werkzaamheden spelen logistiek, bereikbaarheid en afstemming met VvE of beheer geregeld een rol.",
    ],
    localCharacteristics: [
      "In hoogbouw kunnen transportafstanden, liftcapaciteit en toegangstijden de planning beïnvloeden.",
      "In oudere wijken is extra aandacht voor bestaande leidingen, aansluitingen en bouwkundige details vaak verstandig.",
    ],
    nearbyCities: ["dordrecht", "den-haag", "tilburg"],
    published: true,
    indexable: true,
    priority: 0.94,
    populationBand: "zeer grootstedelijk",
  },
  "den-haag": {
    slug: "den-haag",
    name: "Den Haag",
    province: "Zuid-Holland",
    regionLabel: "Randstad",
    introFacts: [
      "Den Haag kent veel woningen uit verschillende perioden, van oudere stadswijken tot recente uitbreidingen.",
      "Bereikbaarheid per wijk en de combinatie van appartementen en grondgebonden woningen maken een goede intake belangrijk.",
    ],
    localCharacteristics: [
      "Bij bestaande bouw is vooraf inzicht in staat van dak, leidingwerk of elektra belangrijk voor een realistische aanpak.",
      "In dichtbebouwde straten helpt het om parkeer- en toegangssituatie expliciet mee te nemen in de aanvraag.",
    ],
    nearbyCities: ["rotterdam", "leiden", "haarlem"],
    published: true,
    indexable: true,
    priority: 0.93,
    populationBand: "zeer grootstedelijk",
  },
  utrecht: {
    slug: "utrecht",
    name: "Utrecht",
    province: "Utrecht",
    regionLabel: "Midden-Nederland",
    introFacts: [
      "Utrecht combineert een compacte binnenstad met naoorlogse wijken en veel recente woningontwikkeling.",
      "Voor planning is de balans tussen stedelijke bereikbaarheid en woonwijken met verschillende bouwjaren relevant.",
    ],
    localCharacteristics: [
      "In oudere woningen kunnen verouderde aansluitingen of beperkte technische ruimtes extra voorbereiding vragen.",
      "In nieuwere buurten ligt de nadruk vaker op uitbreiding, verduurzaming en inpassing van nieuwe installaties.",
    ],
    nearbyCities: ["amersfoort", "amsterdam", "almere"],
    published: true,
    indexable: true,
    priority: 0.92,
    populationBand: "grootstedelijk",
  },
  eindhoven: {
    slug: "eindhoven",
    name: "Eindhoven",
    province: "Noord-Brabant",
    regionLabel: "Zuidoost-Brabant",
    introFacts: [
      "Eindhoven heeft een combinatie van bestaande woonwijken, naoorlogse bouw en veel nieuwbouwontwikkeling.",
      "Aanvragen profiteren van duidelijke informatie over type woning, bereikbaarheid en gewenste planning.",
    ],
    localCharacteristics: [
      "Bij renovatie in oudere woningen zijn ondergrond, aansluitpunten en huidige staat vaak bepalend voor de scope.",
      "In uitbreidingswijken draait het vaker om afwerking, upgrades en slim combineren van meerdere klussen.",
    ],
    nearbyCities: ["tilburg", "den-bosch", "breda"],
    published: true,
    indexable: true,
    priority: 0.9,
    populationBand: "grootstedelijk",
  },
  groningen: {
    slug: "groningen",
    name: "Groningen",
    province: "Groningen",
    regionLabel: "Noord-Nederland",
    introFacts: [
      "Groningen heeft een mix van binnenstedelijke woningen, jaren 30-bouw en recentere uitbreidingen.",
      "Voor werkzaamheden helpt het om rekening te houden met wijktype, bereikbaarheid en bouwkundige staat.",
    ],
    localCharacteristics: [
      "In oudere panden kunnen onderhoudsstaat en bestaande details bepalend zijn voor herstel- of renovatiekeuzes.",
      "In appartementencomplexen is afstemming over toegang en werktijden vaak onderdeel van de voorbereiding.",
    ],
    nearbyCities: ["leeuwarden", "zwolle", "enschede"],
    published: true,
    indexable: true,
    priority: 0.88,
    populationBand: "regionale stad",
  },
  tilburg: {
    slug: "tilburg",
    name: "Tilburg",
    province: "Noord-Brabant",
    regionLabel: "Midden-Brabant",
    introFacts: [
      "Tilburg heeft zowel bestaande woonwijken als nieuwbouwgebieden met uiteenlopende onderhoudsbehoeften.",
      "Een heldere intake over woningtype en bereikbaarheid helpt om aanvragen sneller passend te maken.",
    ],
    localCharacteristics: [
      "Bij oudere woningen kunnen kozijnen, daken of leidingdelen extra aandacht vragen tijdens de opname.",
      "In nieuwere buurten spelen planning en het combineren van werkzaamheden vaak een grote rol.",
    ],
    nearbyCities: ["breda", "eindhoven", "den-bosch"],
    published: true,
    indexable: true,
    priority: 0.86,
    populationBand: "grote stad",
  },
  almere: {
    slug: "almere",
    name: "Almere",
    province: "Flevoland",
    regionLabel: "Flevoland",
    introFacts: [
      "Almere bestaat grotendeels uit relatief jonge woonwijken met veel grondgebonden woningen.",
      "Aanvragen draaien hier vaak om onderhoud, uitbreiding en installatiewijzigingen in moderne woningtypes.",
    ],
    localCharacteristics: [
      "Bij moderne bouw ligt de nadruk vaker op comfortverbetering, verduurzaming en uitbreidingen.",
      "Duidelijke informatie over gewenste planning en bereikbaarheid helpt bij een efficiënte opvolging.",
    ],
    nearbyCities: ["amsterdam", "utrecht", "amersfoort"],
    published: true,
    indexable: true,
    priority: 0.82,
    populationBand: "grote stad",
  },
  breda: {
    slug: "breda",
    name: "Breda",
    province: "Noord-Brabant",
    regionLabel: "West-Brabant",
    introFacts: [
      "Breda combineert historische delen, jaren 30-wijken en uitbreidingslocaties met uiteenlopende woningtypen.",
      "Daardoor verschillen onderhouds- en renovatievragen vaak per buurt en type woning.",
    ],
    localCharacteristics: [
      "In oudere woningen vragen bestaande aansluitingen en bouwdetails vaak om een zorgvuldige beoordeling.",
      "In recentere wijken ligt het accent vaker op planbaar onderhoud en slimme combinatie van klussen.",
    ],
    nearbyCities: ["tilburg", "dordrecht", "eindhoven"],
    published: true,
    indexable: true,
    priority: 0.85,
    populationBand: "grote stad",
  },
  nijmegen: {
    slug: "nijmegen",
    name: "Nijmegen",
    province: "Gelderland",
    regionLabel: "Rijk van Nijmegen",
    introFacts: [
      "Nijmegen kent een combinatie van oudere stadsdelen, naoorlogse wijken en nieuwbouwgebieden.",
      "Voor vakwerk helpt een intake die rekening houdt met bouwperiode en bereikbaarheid.",
    ],
    localCharacteristics: [
      "Bij bestaande bouw kunnen ondergrond en bestaande installaties bepalend zijn voor de aanpak.",
      "Bij planbare klussen is duidelijke scope en fasering belangrijk voor een realistische planning.",
    ],
    nearbyCities: ["arnhem", "apeldoorn", "utrecht"],
    published: true,
    indexable: true,
    priority: 0.84,
    populationBand: "grote stad",
  },
  arnhem: {
    slug: "arnhem",
    name: "Arnhem",
    province: "Gelderland",
    regionLabel: "Arnhem-Nijmegen",
    introFacts: [
      "Arnhem heeft diverse woningtypes: van oudere stadswoningen tot naoorlogse en nieuwere buurten.",
      "Dat vraagt om maatwerk in opname, planning en uitvoering per type klus.",
    ],
    localCharacteristics: [
      "Bij oudere panden kan de technische staat van bestaande voorzieningen extra voorbereiding vragen.",
      "Voor buitenwerk en renovatie telt bereikbaarheid van locatie en materiaaltransport nadrukkelijk mee.",
    ],
    nearbyCities: ["nijmegen", "apeldoorn", "amersfoort"],
    published: true,
    indexable: true,
    priority: 0.83,
    populationBand: "middelgrote stad",
  },
  apeldoorn: {
    slug: "apeldoorn",
    name: "Apeldoorn",
    province: "Gelderland",
    regionLabel: "Veluwe",
    introFacts: [
      "Apeldoorn heeft een brede spreiding van woonwijken met verschillende bouwjaren en woningtypen.",
      "Voor aanvragen helpt het om huidige staat, planning en specifieke klusdoelen direct te benoemen.",
    ],
    localCharacteristics: [
      "In oudere woningen kunnen onderhoudsachterstand en bestaande details de scope vergroten.",
      "In ruim opgezette wijken is planning vaak goed voorspelbaar mits de aanvraag compleet is.",
    ],
    nearbyCities: ["arnhem", "zwolle", "amersfoort"],
    published: true,
    indexable: true,
    priority: 0.76,
    populationBand: "middelgrote stad",
  },
  haarlem: {
    slug: "haarlem",
    name: "Haarlem",
    province: "Noord-Holland",
    regionLabel: "Randstad",
    introFacts: [
      "Haarlem heeft veel karakteristieke stadswijken en daarnaast nieuwere woongebieden.",
      "Dat zorgt voor uiteenlopende onderhoudsvragen tussen oudere en recentere woningen.",
    ],
    localCharacteristics: [
      "In compactere straten vraagt uitvoering soms extra afstemming over toegang en logistiek.",
      "Bij oudere bouw is een goede technische opname belangrijk om verrassingen tijdens uitvoering te beperken.",
    ],
    nearbyCities: ["amsterdam", "leiden", "den-haag"],
    published: true,
    indexable: true,
    priority: 0.78,
    populationBand: "middelgrote stad",
  },
  amersfoort: {
    slug: "amersfoort",
    name: "Amersfoort",
    province: "Utrecht",
    regionLabel: "Midden-Nederland",
    introFacts: [
      "Amersfoort combineert historische delen met naoorlogse en recente uitbreidingswijken.",
      "Hierdoor lopen klusvragen uiteen van onderhoud tot modernisering en uitbreiding.",
    ],
    localCharacteristics: [
      "Bij oudere woningen kan extra aandacht nodig zijn voor bestaande aansluitingen en constructiedetails.",
      "In nieuwere wijken draait het vaker om efficiënt plannen en combineren van werkzaamheden.",
    ],
    nearbyCities: ["utrecht", "almere", "apeldoorn"],
    published: true,
    indexable: true,
    priority: 0.77,
    populationBand: "middelgrote stad",
  },
  zwolle: {
    slug: "zwolle",
    name: "Zwolle",
    province: "Overijssel",
    regionLabel: "Regio Zwolle",
    introFacts: [
      "Zwolle heeft een mix van binnenstedelijke gebieden, gezinswijken en recente nieuwbouw.",
      "Voor goede matching helpt het om type klus en context van de woning concreet te omschrijven.",
    ],
    localCharacteristics: [
      "In bestaande bouw kunnen onderhoudstoestand en bereikbaarheid sterk verschillen per wijk.",
      "Bij planbare projecten geeft duidelijke fasering vaak sneller duidelijke vervolgstappen.",
    ],
    nearbyCities: ["apeldoorn", "enschede", "groningen"],
    published: true,
    indexable: true,
    priority: 0.75,
    populationBand: "middelgrote stad",
  },
  leeuwarden: {
    slug: "leeuwarden",
    name: "Leeuwarden",
    province: "Friesland",
    regionLabel: "Noord-Nederland",
    introFacts: [
      "Leeuwarden kent zowel historische bebouwing als nieuwere woonwijken met verschillende onderhoudsprofielen.",
      "Voor vakwerk is een duidelijke omschrijving van de huidige situatie en planning extra waardevol.",
    ],
    localCharacteristics: [
      "Bij oudere woningen zijn staat van materiaal en bestaande aansluitingen vaak bepalend voor de aanpak.",
      "Bij regulier onderhoud helpt het om bereikbaarheid en gewenste doorlooptijd vooraf te benoemen.",
    ],
    nearbyCities: ["groningen", "zwolle", "enschede"],
    published: true,
    indexable: true,
    priority: 0.74,
    populationBand: "middelgrote stad",
  },
  "den-bosch": {
    slug: "den-bosch",
    name: "Den Bosch",
    province: "Noord-Brabant",
    regionLabel: "Noordoost-Brabant",
    introFacts: [
      "Den Bosch heeft een gevarieerde woningvoorraad met oudere stadsdelen en ruime uitbreidingswijken.",
      "Dat maakt lokale context rond bouwperiode en bereikbaarheid belangrijk bij aanvragen.",
    ],
    localCharacteristics: [
      "In oudere bouw kan de technische uitgangssituatie variëren, waardoor een zorgvuldige intake nodig is.",
      "In nieuwere wijken draait het vaker om planbaar onderhoud en functionele upgrades.",
    ],
    nearbyCities: ["eindhoven", "tilburg", "utrecht"],
    published: true,
    indexable: true,
    priority: 0.79,
    populationBand: "middelgrote stad",
  },
  enschede: {
    slug: "enschede",
    name: "Enschede",
    province: "Overijssel",
    regionLabel: "Twente",
    introFacts: [
      "Enschede combineert oudere wijken met moderne woongebieden en uiteenlopende woningtypes.",
      "Voor lokale aanvragen helpt een heldere omschrijving van situatie, planning en gewenste oplossing.",
    ],
    localCharacteristics: [
      "Bij bestaande woningen kunnen onderhoudsstatus en eerdere aanpassingen invloed hebben op de uitvoering.",
      "Bij grotere klussen geeft een gefaseerde aanpak vaak meer voorspelbaarheid in planning en kostenfactoren.",
    ],
    nearbyCities: ["zwolle", "arnhem", "nijmegen"],
    published: true,
    indexable: true,
    priority: 0.73,
    populationBand: "middelgrote stad",
  },
  leiden: {
    slug: "leiden",
    name: "Leiden",
    province: "Zuid-Holland",
    regionLabel: "Randstad",
    introFacts: [
      "Leiden heeft een combinatie van historische kern, bestaande woonwijken en nieuwere ontwikkelgebieden.",
      "Daardoor verschillen klusaanpakken regelmatig tussen binnenstad, schilwijken en nieuwe buurten.",
    ],
    localCharacteristics: [
      "In oudere bebouwing kunnen bestaande details en bereikbaarheid bepalend zijn voor de werkvoorbereiding.",
      "In moderner vastgoed ligt de focus vaak op efficiënt onderhoud en technische verbeteringen.",
    ],
    nearbyCities: ["den-haag", "haarlem", "rotterdam"],
    published: true,
    indexable: true,
    priority: 0.72,
    populationBand: "middelgrote stad",
  },
  dordrecht: {
    slug: "dordrecht",
    name: "Dordrecht",
    province: "Zuid-Holland",
    regionLabel: "Drechtsteden",
    introFacts: [
      "Dordrecht kent historische buurten, naoorlogse wijken en nieuwere woongebieden.",
      "Voor een passende vakmanselectie is lokale context over woningtype en staat van belang.",
    ],
    localCharacteristics: [
      "Bij oudere woningen kunnen onderhoudsachterstand en bestaande aansluitingen extra aandacht vragen.",
      "Bij planbare verbeteringen helpt het om gewenste planning en prioriteiten in de aanvraag te specificeren.",
    ],
    nearbyCities: ["rotterdam", "breda", "tilburg"],
    published: true,
    indexable: true,
    priority: 0.71,
    populationBand: "middelgrote stad",
  },
} satisfies Record<string, LocationContent>;

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

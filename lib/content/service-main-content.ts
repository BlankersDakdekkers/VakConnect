import type { ServiceContentPageData } from "./service-pages";

export const serviceMainContent: Record<string, ServiceContentPageData> = {
  dakdekker: {
    path: "/dakdekker",
    title: "Dakdekker nodig? Vind een vakman",
    description: "Daklekkage, reparatie of renovatie? Lees waar je op let en beschrijf je dakklus bij VakConnect.",
    keywords: ["dakdekker", "dakreparatie", "dakrenovatie", "daklekkage"],
    h1: "Dakdekker nodig voor reparatie of renovatie?",
    intro: [
      "Een dakprobleem begint niet altijd met een druppel aan het plafond. Losse dakpannen, versleten dakbedekking, een lekkende aansluiting of een volle dakgoot kunnen ook aanleiding zijn om een dakdekker te laten meekijken.",
      "Op deze pagina lees je welke dakklussen vaak voorkomen, wanneer onderzoek verstandig is en welke informatie helpt om jouw aanvraag helder te maken. VakConnect zoekt op basis van de klus en je regio naar passende professionals; de vakman beoordeelt zelf of het werk aansluit en jij beslist hoe je verdergaat.",
    ],
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Diensten", href: "/diensten" }, { label: "Dakdekker" }],
    sections: [
      {
        heading: "Welke werkzaamheden doet een dakdekker?",
        paragraphs: [
          "Dakwerk gaat over meer dan het vervangen van dakbedekking. Een dakdekker kan een lekkage onderzoeken, een plaatselijke reparatie uitvoeren of de staat van een compleet dak beoordelen. Ook aansluitingen rond schoorstenen, dakkapellen en dakramen vragen aandacht: juist op zulke overgangen kan water binnendringen.",
          "Bij een hellend dak kunnen werkzaamheden bestaan uit het rechtleggen of vervangen van dakpannen, herstel van nokvorsten en controle van de onderliggende lagen. Op een plat dak gaat het bijvoorbeeld om bitumen of een andere dakbedekking, naden, randen en afvoeren. Ook dakgoten, loodwerk en inspectie van bereikbare dakdelen kunnen bij de klus horen.",
          "Een aanvraag is bruikbaarder als je onderscheid maakt tussen een zichtbaar probleem en wat je al weet over de oorzaak. Beschrijf waar je vocht ziet, sinds wanneer en of het na regen optreedt. De plek van een vochtvlek binnen hoeft niet precies boven de bron op het dak te liggen.",
        ],
        bullets: ["Daklekkage opsporen en herstellen", "Dakpannen, nokvorsten en dakgoten", "Bitumen en andere dakbedekking op platte daken", "Schoorsteen- en dakkapelaansluitingen", "Dakinspectie en renovatie"],
      },
      {
        heading: "Lekkage of schade: wanneer laat je het dak beoordelen?",
        paragraphs: [
          "Schakel een dakdekker in bij terugkerende vochtplekken, water dat na regen binnenkomt, losgeraakte dakdelen of zichtbare schade na harde wind. Ook als je niet zeker weet of de oorzaak op het dak ligt, kan een professionele beoordeling helpen om de volgende stap te bepalen.",
          "Bij actief binnendringend water kan sneller handelen nodig zijn om gevolgschade te beperken. Maak de situatie veilig, blijf uit de buurt van natte elektrische onderdelen en voer geen risicovolle werkzaamheden op hoogte zelf uit. Bij direct gevaar neem je passende hulpdiensten of een gekwalificeerde professional in.",
          "Een kleine reparatie past wanneer de oorzaak plaatselijk is en omliggende delen nog in goede staat zijn. Als materiaal op meerdere plekken versleten is, kan een bredere aanpak logischer zijn. Een inspectie helpt de omvang te bepalen; alleen een vakman die de situatie heeft beoordeeld kan adviseren over de passende uitvoering.",
        ],
        type: "warning",
      },
      {
        heading: "Dakpannen, nokvorsten en schoorsteenwerk",
        paragraphs: [
          "Bij een pannendak is niet alleen de kapotte of verschoven pan van belang. De dakdekker kijkt ook naar de nok, bevestiging, aansluitingen en eventuele beschadiging van de onderliggende daklaag. Als meerdere pannen loszitten of de nokvorst scheuren vertoont, kan herstel van één onderdeel onvoldoende zijn.",
          "Rond een schoorsteen kunnen voegen, loodslabben en de aansluiting met de dakbedekking aandacht vragen. Een dakkapel heeft eveneens meerdere naden en overgangen die waterdicht moeten blijven. Benoem deze details als je ze kunt zien, maar ga niet zelf het dak op om foto’s te maken.",
          "Een professionele beoordeling maakt duidelijk of losse onderdelen vervangen kunnen worden of dat een groter deel aandacht nodig heeft. Dat voorkomt dat je alleen het zichtbare symptoom beschrijft terwijl de vakman een andere oorzaak aantreft.",
        ],
      },
      {
        heading: "Plat dak en dakrenovatie",
        paragraphs: [
          "Op een plat dak kunnen scheurtjes, loslatende naden, blazen of problemen bij de afvoer aanleiding zijn voor inspectie. De dakdekker beoordeelt de staat van het materiaal, de randen en de aansluitingen. Bitumen is een veelvoorkomende dakbedekking, maar de bestaande opbouw en toegepaste materialen bepalen welke herstelmethode passend is.",
          "Reparatie is niet altijd de beste keuze wanneer meerdere delen verouderd zijn of eerdere herstelplekken terugkomen. Een deelrenovatie kan geschikt zijn als slijtage zich tot een duidelijk afgebakend vlak beperkt; bij bredere veroudering komt vervanging van meer dakoppervlak in beeld. Isolatie verbeteren kan soms worden meegenomen wanneer de dakopbouw toch wordt aangepakt.",
          "Vraag bij renovatie om uitleg over de voorgestelde omvang, materialen, aansluitingen en wat wel of niet in het werk valt. De staat van de constructie kan pas goed worden beoordeeld wanneer de vakman de situatie ter plaatse heeft gezien.",
        ],
      },
      {
        heading: "Dakgoot, inspectie en onderhoud",
        paragraphs: [
          "Een dakgoot die overloopt, loshangt of lekt kan water langs de gevel leiden. De oplossing kan liggen in herstel van de goot zelf, de bevestiging of de afvoer. Kijk ook naar de aansluiting met het dak: een probleem in de goot is niet automatisch de enige oorzaak van vocht.",
          "Een dakinspectie is nuttig bij zichtbare slijtage, na schade of als voorbereiding op onderhoud, verkoop of renovatie. Spreek vooraf af welke delen worden bekeken en of de inspectie ook aansluitingen, goten en eventuele dakkapellen omvat. De bereikbaarheid bepaalt mede wat veilig en praktisch onderzocht kan worden.",
          "Periodiek onderhoud kan kleine gebreken aan het licht brengen voordat ze groter worden, maar vervangt geen herstel wanneer er al lekkage of schade is. Deel daarom je concrete aanleiding en gewenste uitkomst in de aanvraag.",
        ],
      },
      {
        heading: "Dakwerk combineren met isolatie",
        paragraphs: [
          "Als dakbedekking wordt vernieuwd, kan het een geschikt moment zijn om isolatie en aansluitingen mee te beoordelen. De keuze hangt af van de bestaande dakopbouw, de gewenste binnenafwerking en de staat van constructie en ventilatie.",
          "Bespreek vooraf wie dakwerk uitvoert en wie de isolatie beoordeelt. Afstemming voorkomt dat nieuwe lagen of aansluitingen elkaar in de weg zitten en maakt duidelijk welke werkzaamheden in welke fase worden uitgevoerd.",
        ],
      },
      {
        heading: "Zo helpt VakConnect bij een dakklus",
        paragraphs: [
          "Je beschrijft wat er aan het dak moet gebeuren, waar je de schade ziet en welke daksoort of materialen bekend zijn. Foto’s vanaf een veilige plek, eerdere reparaties en informatie over bereikbaarheid geven extra context; een vakman kan daarna beoordelen of de aanvraag bij zijn werk past.",
          "VakConnect gebruikt het type klus en je regio om passende professionals te zoeken. Een professional bepaalt zelf of hij de opdracht kan oppakken. Je bespreekt vervolgens rechtstreeks de inspectie, aanpak en eventuele offerte; de uiteindelijke keuze blijft bij jou.",
          "Bij een dakklus kun je ook aangeven of je eerst een diagnose wilt, al een duidelijk herstelverzoek hebt of renovatie overweegt. Die informatie helpt het gesprek te richten op de juiste scope in plaats van op een algemene omschrijving als ‘dak moet nagekeken worden’.",
        ],
      },
      {
        heading: "Waar let je op bij het kiezen van een dakdekker?",
        paragraphs: [
          "Vraag hoe de vakman de oorzaak en omvang van het werk vaststelt en of inspectie, materiaal en afvoer van oud materiaal onderdeel zijn van de prijsopgave. Bij reparatie is het nuttig om te begrijpen welk deel wordt hersteld en hoe omliggende aansluitingen worden meegenomen.",
          "Vergelijk voorstellen op werkzaamheden en uitgangspunten, niet alleen op het eindbedrag. Let op bereikbaarheid, eventuele steiger- of hoogwerkerkosten, garantievoorwaarden die de vakman zelf aanbiedt en afspraken over onverwachte schade die pas tijdens het werk zichtbaar wordt.",
          "VakConnect kan profiel- en bedrijfsgegevens controleren waar dat van toepassing is. Controleer zelf ook of het profiel, de voorgestelde werkzaamheden en de afspraken aansluiten op jouw klus. Er is geen vaste beschikbaarheid of landelijke dekking voor iedere dienst gegarandeerd.",
        ],
      },
    ],
    costFactors: [
      "Daktype, materiaal en totale oppervlakte van het dakvlak",
      "Reparatie van één plek tegenover deelrenovatie of volledige vervanging",
      "Bereikbaarheid en de noodzaak van steiger, hoogwerker of extra valbeveiliging",
      "Staat van aansluitingen, onderlagen, constructie en eventuele gevolgschade",
      "Materiaalkeuze, afvoer van oude dakbedekking en combineren met isolatie",
      "Spoed en het moment waarop veilig herstel mogelijk is",
    ],
    processSteps: [
      "Beschrijf het daktype, de klacht of gewenste renovatie en waar je signalen ziet.",
      "Voeg waar mogelijk foto’s vanaf een veilige plek toe en vermeld eerdere reparaties en bereikbaarheid.",
      "VakConnect gebruikt de klus en regio om passende professionals te vinden; een vakman beoordeelt zelf of de opdracht past.",
      "Bespreek inspectie, aanpak en kosten rechtstreeks. Jij kiest of je met de vakman verdergaat.",
    ],
    relatedLinks: [
      { href: "/dakdekker/daklekkage", title: "Daklekkage", description: "Lees wat helpt bij het beschrijven van lekkage en het beoordelen van mogelijke dakschade." },
      { href: "/dakdekker/dakrenovatie", title: "Dakrenovatie", description: "Bekijk wanneer reparatie, deelrenovatie of vernieuwing aan de orde kan zijn." },
      { href: "/dakdekker/dakpannen-vervangen", title: "Dakpannen vervangen", description: "Informatie over pannen, nokdetails en herstel van een pannendak." },
      { href: "/dakdekker/plat-dak", title: "Plat dak", description: "Meer over dakbedekking, naden, randen en afwatering op een plat dak." },
      { href: "/dakdekker/schoorsteen", title: "Schoorsteenwerk", description: "Aandachtspunten bij loodwerk en de aansluiting tussen schoorsteen en dak." },
      { href: "/dakdekker/nokvorsten", title: "Nokvorsten", description: "Herken aandachtspunten bij de nok van een hellend pannendak." },
      { href: "/dakdekker/dakgoot", title: "Dakgoot", description: "Lees over lekkage, herstel en afvoer rond de dakgoot." },
      { href: "/dakdekker/dakkapel", title: "Dakkapel", description: "Bekijk werkzaamheden aan de dak- en gevelaansluitingen van een dakkapel." },
      { href: "/dakdekker/dakinspectie", title: "Dakinspectie", description: "Wat je kunt bespreken bij een controle van de staat van je dak." },
      { href: "/hoe-werkt-het", title: "Hoe VakConnect werkt", description: "Lees hoe je klus en regio helpen bij het vinden van passende professionals." },
      { href: "/kosten", title: "Kosten en offertes", description: "Lees hoe je kosten voor verschillende klussen inzichtelijk maakt." },
    ],
    faqs: [
      { question: "Wanneer moet ik een dakdekker inschakelen?", answer: "Bij terugkerende vochtplekken, zichtbare dakschade, losliggende delen of een dak dat aan renovatie toe lijkt. Bij actieve lekkage kan sneller handelen helpen gevolgschade te beperken; ga niet zelf onveilig het dak op." },
      { question: "Wat kost dakwerk?", answer: "Dat hangt onder meer af van daktype, oppervlak, materiaal, bereikbaarheid en de omvang van herstel. Een vakman kan een passende prijsopgave maken nadat de situatie en gewenste werkzaamheden duidelijk zijn." },
      { question: "Kan een dakdekker een lekkage opsporen?", answer: "Een dakdekker kan dakdelen en aansluitingen beoordelen om een waarschijnlijke oorzaak te vinden. Vocht kan zich verplaatsen, dus de plek waar je het binnen ziet hoeft niet recht boven de lekkage te liggen." },
      { question: "Wat is het verschil tussen reparatie en renovatie?", answer: "Reparatie richt zich op een afgebakend gebrek. Bij verspreide slijtage of meerdere zwakke plekken kan deelrenovatie of vervanging logischer zijn; inspectie geeft inzicht in de staat van het hele dak." },
      { question: "Hoe vind ik een dakdekker in mijn regio?", answer: "Beschrijf je dakklus en regio op VakConnect. De matching zoekt naar passende professionals; een vakman bepaalt zelf of de opdracht aansluit en jij kiest hoe je verdergaat." },
    ],
    cta: { title: "Laat je dakklus helder beoordelen", description: "Beschrijf wat je ziet, welk daktype je hebt en of je herstel, inspectie of renovatie overweegt.", label: "Beschrijf je dakklus" },
  },
  schilder: {
    path: "/schilder",
    title: "Schilder nodig? Vind een vakman",
    description: "Binnen- of buitenschilderwerk, kozijnen of herstel? Vergelijk aandachtspunten en beschrijf je klus bij VakConnect.",
    keywords: ["schilder", "binnenschilderwerk", "buitenschilderwerk", "kozijnen schilderen"],
    h1: "Schilder nodig voor binnenwerk of onderhoud buiten?",
    intro: [
      "Schilderwerk beschermt oppervlakken én bepaalt hoe een ruimte of gevel eruitziet. De voorbereiding is minstens zo bepalend als de verf: houtrot, loszittende lagen, vocht of beschadigingen moeten eerst worden beoordeeld.",
      "Of je nu één deur wilt laten schilderen of periodiek onderhoud aan de buitenkant plant, een duidelijke omschrijving maakt de klus beter bespreekbaar. VakConnect gebruikt je klus en regio om passende professionals te zoeken. De schilder beoordeelt zelf of het werk past; jij kiest met wie je afspraken maakt.",
    ],
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Diensten", href: "/diensten" }, { label: "Schilder" }],
    sections: [
      {
        heading: "Binnen- en buitenschilderwerk",
        paragraphs: [
          "Binnenschilderwerk omvat onder meer muren, plafonds, deuren, plinten en kozijnen. De ondergrond bepaalt de voorbereiding: nieuw stucwerk, eerder geschilderde delen en beschadigde oppervlakken vragen elk om een andere aanpak. Benoem welke ruimtes en onderdelen je wilt laten doen en of meubels verplaatst moeten worden.",
          "Buitenschilderwerk beschermt hout en andere geschikte ondergronden tegen weer en gebruik. Denk aan gevelkozijnen, deuren, boeidelen en ander houtwerk. De staat van de bestaande verflaag, blootstelling aan zon en regen en het moment van uitvoering spelen mee in de planning.",
          "Schilderwerk aan gevels kan ook samengaan met herstel van kitnaden of plaatselijk houtwerk. Maak in de aanvraag duidelijk of je alleen een nieuwe verflaag verwacht of dat er eerst herstel nodig is. Zo kan de vakman de omvang gerichter bespreken.",
        ],
        bullets: ["Wanden, plafonds en binnendeuren", "Buitenkozijnen, deuren en boeidelen", "Houtwerk en geveldelen die geschikt zijn voor schilderwerk", "Onderhoud, bijwerken of een volledige schilderbeurt"],
      },
      {
        heading: "Onderhoud is iets anders dan volledige renovatie",
        paragraphs: [
          "Bij onderhoud is de bestaande ondergrond meestal nog voldoende intact en gaat het om reinigen, plaatselijk schuren, herstel van kleine gebreken en opnieuw afwerken. Wanneer verf op grote schaal loslaat, hout is aangetast of delen slecht hechten, kan uitgebreider herstel nodig zijn.",
          "Houtrot herstellen is specialistisch voorbereidend werk. Een schilder kan beoordelen of plaatselijk herstel onderdeel van de klus is of dat een timmerman nodig is voor aangetaste delen. Schilderen over beschadigd hout lost de oorzaak niet op en kan betekenen dat het probleem terugkomt.",
          "Bespreek vooraf welke onderdelen worden geïnspecteerd, hoe beschadigingen worden hersteld en welke afwerking is inbegrepen. Een duidelijke scope helpt ook als verschillende offertes met elkaar worden vergeleken.",
        ],
      },
      {
        heading: "Voorbereiding van kozijnen, deuren en houtwerk",
        paragraphs: [
          "Kozijnen en deuren krijgen dagelijks te maken met openen, sluiten, vocht en temperatuurverschillen. De schilder kijkt daarom niet alleen naar de kleur, maar ook naar de hechting van de bestaande laag, naden, beschadigingen en de staat van het hout of andere ondergrond.",
          "Vermeld of ramen en deuren goed sluiten en of je blaasjes, scheuren, verkleuring of zachte plekken ziet. Bij twijfel kan de vakman tijdens een beoordeling aangeven of extra herstel nodig is voordat er geschilderd kan worden.",
          "Ook binnendeuren en kozijnen vragen om een passende verfsoort en afwerking, afgestemd op gebruik en ondergrond. Geef aan of je kleurwijzigingen wilt en of alle kanten van een deur of kozijn moeten worden meegenomen.",
        ],
      },
      {
        heading: "Wanneer schakel je een schilder in?",
        paragraphs: [
          "Een schilder is een logische keuze als verf bladdert, houtwerk zijn beschermende laag verliest, muren opnieuw moeten worden afgewerkt of je na een verbouwing een nette afwerking wilt. Ook periodiek buitenschilderwerk kan helpen om oppervlakken in goede staat te houden, al hangt het juiste moment af van materiaal en weersinvloed.",
          "Na lekkage, stucwerkherstel of houtrot moet eerst de onderliggende oorzaak zijn aangepakt en de ondergrond geschikt zijn om af te werken. Bespreek die voorgeschiedenis, zodat de vakman kan aangeven welke voorbereiding nodig is.",
          "Bij een verhuizing of verbouwing kan schilderwerk onderdeel zijn van een grotere planning. Geef door welke ruimtes klaar zijn, wanneer andere werkzaamheden plaatsvinden en of je de woning tijdens het werk blijft gebruiken.",
        ],
      },
      {
        heading: "Gevelwerk en de staat van de ondergrond",
        paragraphs: [
          "Schilderwerk aan een gevel kan samengaan met herstel van houtwerk, kitnaden of andere aansluitingen. De ondergrond en bereikbaarheid moeten eerst worden beoordeeld; soms is een timmerman of gevelspecialist nodig voordat de schilder kan afwerken.",
          "Vermeld welke geveldelen je wilt laten behandelen en of er scheuren, vocht of loszittende verf zichtbaar zijn. Dan kan de vakman aangeven welke voorbereiding en eventuele aanvullende expertise nodig is.",
        ],
      },
      {
        heading: "Schilderwerk plannen na herstel of verbouwing",
        paragraphs: [
          "Nieuwe verf kan pas worden aangebracht als reparaties, stucwerk of houtrotherstel gereed zijn en de ondergrond geschikt is. Stem de volgorde af met de aannemer of andere uitvoerders en bespreek welke delen eerst moeten drogen of worden gecontroleerd.",
          "Geef aan of meubels aanwezig blijven, ruimtes in gebruik zijn en wanneer de woning beschikbaar is. Dat helpt de schilder om bescherming, toegang en werkvolgorde mee te nemen in de planning.",
        ],
      },
      {
        heading: "Zo helpt VakConnect bij schilderwerk",
        paragraphs: [
          "In je aanvraag noteer je binnen- of buitenwerk, de onderdelen, de geschatte omvang en de huidige staat van het schilderwerk. Foto’s van beschadigingen en informatie over eerdere verflagen maken het eerste gesprek concreter; vermeld ook of kleur en materiaal al zijn gekozen.",
          "VakConnect gebruikt de soort klus en je regio om passende professionals te vinden. Een schilder beslist zelf of de opdracht bij zijn werkzaamheden en planning past. Daarna bespreek je rechtstreeks de voorbereiding, verfkeuze, planning en offerte.",
          "Je kunt op VakConnect zoeken voor een kleine herstelklus, onderhoud van meerdere kozijnen of schilderwerk als onderdeel van een renovatie. Maak duidelijk wat voor jou het gewenste resultaat is en wat je al hebt voorbereid.",
        ],
      },
      {
        heading: "Waar let je op bij een schilder?",
        paragraphs: [
          "Vraag welke voorbereiding is inbegrepen: reinigen, schuren, gronden, repareren en afwerken kunnen een groot deel van het werk vormen. Leg ook vast welke oppervlakken, kanten en ruimtes wel en niet worden meegenomen en hoe materiaalkeuzes worden besproken.",
          "Bij buitenwerk zijn weersomstandigheden en bereikbaarheid relevant. Bij binnenwerk tellen afplakken, bescherming van vloeren en meubels en het aantal verflagen mee. Laat eventuele houtrotreparatie, kitwerk of herstel van ondergrond expliciet opnemen.",
          "Vergelijk offertes op dezelfde scope, materiaal en voorbereiding. VakConnect kan profiel- en bedrijfsgegevens controleren waar van toepassing; bekijk zelf de profielinformatie en bespreek rechtstreeks welke ervaring met jouw specifieke ondergrond of klus relevant is.",
        ],
      },
    ],
    costFactors: [
      "Aantal en oppervlak van wanden, plafonds, deuren of kozijnen",
      "Staat van de ondergrond en herstel van houtrot, scheuren of loslatende verf",
      "Hoeveel voorbereiding nodig is, zoals reinigen, schuren en gronden",
      "Verfsoort, kleurkeuze, gewenste afwerking en het aantal verflagen",
      "Bereikbaarheid van buitenwerk en eventuele steiger of hoogwerker",
      "Bescherming, afplakken en afvoer van materialen",
    ],
    processSteps: [
      "Beschrijf of het om binnen- of buitenschilderwerk gaat en welke onderdelen je wilt laten schilderen.",
      "Noem de staat van de verf en ondergrond, gewenste kleuren en mogelijk houtrot of eerdere schade.",
      "VakConnect zoekt met de klus en regio naar passende schilders; zij bepalen zelf of de aanvraag aansluit.",
      "Bespreek voorbereiding, verf, planning en offerte rechtstreeks en kies zelf of je opdracht geeft.",
    ],
    relatedLinks: [
      { href: "/schilder/binnenschilderwerk", title: "Binnenschilderwerk", description: "Lees over muren, plafonds, deuren en kozijnen binnen." },
      { href: "/schilder/buitenschilderwerk", title: "Buitenschilderwerk", description: "Aandachtspunten voor schilderwerk dat blootstaat aan weer en gebruik." },
      { href: "/schilder/kozijnen-schilderen", title: "Kozijnen schilderen", description: "Wat meespeelt bij voorbereiding en afwerking van kozijnen." },
      { href: "/schilder/deuren-schilderen", title: "Deuren schilderen", description: "Bespreek staat, gebruik en gewenste afwerking van deuren." },
      { href: "/schilder/plafond-schilderen", title: "Plafond schilderen", description: "Informatie over ondergrond en afwerking van een plafond." },
      { href: "/hoe-werkt-het", title: "Hoe VakConnect werkt", description: "Zo helpen klusomschrijving en regio bij het vinden van passende professionals." },
      { href: "/kosten", title: "Kosten en offertes", description: "Lees welke informatie een offerte voor je klus inzichtelijk maakt." },
    ],
    faqs: [
      { question: "Hoe vaak moet buitenschilderwerk worden gedaan?", answer: "Er is geen vast interval dat voor ieder huis geldt. Ondergrond, ligging, weersinvloed en de staat van de verf bepalen wanneer onderhoud nodig is. Laat beschadigingen beoordelen voordat vocht het hout verder aantast." },
      { question: "Wat beïnvloedt de kosten van schilderwerk?", answer: "Oppervlak, ondergrond, voorbereiding, verfsoort en bereikbaarheid spelen mee. Ook herstel van houtrot of beschadigingen kan extra werk vragen; laat duidelijk beschrijven wat in de offerte is opgenomen." },
      { question: "Doet een schilder ook houtrotherstel?", answer: "Sommige schilders voeren beperkt herstel uit; bij grotere aantasting kan een timmerman nodig zijn. Vraag vooraf wie het herstel doet en of het onderdeel is van de prijsopgave." },
      { question: "Wat is het verschil tussen onderhoud en een volledige schilderbeurt?", answer: "Onderhoud richt zich vaak op intacte verflagen met plaatselijk herstel en nieuwe afwerking. Bij omvangrijke schade of loslatende lagen kan meer voorbereiding of het verwijderen van oude verf nodig zijn." },
      { question: "Hoe vergelijk ik schilders?", answer: "Zorg dat offertes dezelfde ruimtes, onderdelen, voorbereiding en afwerking omvatten. Bespreek materiaal, herstelwerk, planning en wat er gebeurt als tijdens de voorbereiding extra schade zichtbaar wordt." },
    ],
    cta: { title: "Beschrijf het schilderwerk dat je wilt laten doen", description: "Vermeld de onderdelen, binnen of buiten, en wat je ziet aan de huidige verf- en ondergrond.", label: "Plaats je schilderklus" },
  },
  loodgieter: {
    path: "/loodgieter",
    title: "Loodgieter nodig? Vind een vakman",
    description: "Hulp bij lekkage, leidingwerk, afvoer of sanitair? Beschrijf je klus en vind passende vakmensen via VakConnect.",
    keywords: ["loodgieter", "lekkage", "leidingwerk", "sanitair"],
    h1: "Loodgieter nodig voor lekkage of leidingwerk?",
    intro: [
      "Een druppelende aansluiting, een afvoer die niet doorloopt of plannen voor nieuw sanitair vragen om verschillende werkzaamheden. Een loodgieter houdt zich bezig met waterleidingen, afvoer, kranen en installaties rond keuken en badkamer.",
      "Beschrijf wat je merkt en waar het probleem zit; je hoeft de technische oorzaak niet zelf vast te stellen. VakConnect gebruikt de soort klus en je regio om passende professionals te zoeken. De loodgieter bepaalt zelf of hij het werk kan aannemen en jij maakt de uiteindelijke keuze.",
    ],
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Diensten", href: "/diensten" }, { label: "Loodgieter" }],
    sections: [
      {
        heading: "Welke klussen voert een loodgieter uit?",
        paragraphs: [
          "Loodgieterswerk kan gaan om het opsporen en verhelpen van lekkage, het plaatsen of vervangen van kranen en sanitair, aanpassing van waterleidingen of herstel van een afvoer. Ook het aansluiten van een keuken of het installeren van onderdelen in een badkamer valt vaak binnen dit vakgebied.",
          "Een verstopte afvoer is niet hetzelfde als een lekkende leiding. Noteer welke afvoer problemen geeft, of meerdere punten tegelijk traag weglopen en wanneer de klacht begon. Dat helpt om het gesprek te richten op plaatselijke verstopping, leidingwerk of een mogelijk probleem verder in het afvoersysteem.",
          "Bij een verbouwing kunnen leidingen worden verlegd of vernieuwd. De benodigde werkzaamheden hangen af van de bestaande situatie, de nieuwe indeling en de bereikbaarheid van leidingen. Deel daarom ook tekeningen, foto’s of plannen als je die al hebt.",
        ],
        bullets: ["Lekkage opsporen en leidingwerk herstellen", "Kranen, wastafels, toiletten en ander sanitair", "Afvoer en verstopping", "Waterleidingen in keuken of badkamer", "Aansluitingen bij een renovatie"],
      },
      {
        heading: "Lekkage: beschrijf de signalen, niet alleen de plek",
        paragraphs: [
          "Een vochtplek, druppel of natte kast kan afkomstig zijn van een aansluiting, leiding, dak of aangrenzende ruimte. Vertel waar je het vocht ziet, of het voortdurend aanwezig is en of het samenhangt met gebruik van kraan, douche of verwarming. De vakman kan vervolgens beoordelen welke inspectie nodig is.",
          "Bij plotselinge of grotere lekkage is het belangrijk om verdere schade en direct gevaar te beperken. Raak geen natte elektrische onderdelen aan en vraag passende professionele hulp. Deze pagina geeft geen doe-het-zelf-instructies voor leidingen of installaties.",
          "Soms is na het verhelpen van de bron ook droging of herstel van wand, vloer of plafond nodig. Vraag of dat bij het loodgieterswerk hoort of dat je daarvoor een andere vakman nodig hebt.",
        ],
        type: "warning",
      },
      {
        heading: "Afvoer en verstopping",
        paragraphs: [
          "Een verstopping kan zich uiten in water dat langzaam wegloopt, borrelende geluiden of een nare geur. Als meerdere afvoerpunten problemen geven, is het handig dat in je aanvraag te vermelden. Dat kan erop wijzen dat de klacht niet beperkt is tot één sifon of aansluiting.",
          "Een loodgieter kan de afvoer beoordelen en bespreken welke aanpak bij de situatie past. Vermeld of het probleem terugkomt, welke voorzieningen zijn aangesloten en of er recent werkzaamheden aan het leidingwerk zijn uitgevoerd.",
          "Bij terugkerende verstoppingen is het zinvol om niet alleen de blokkade maar ook de mogelijke oorzaak te laten onderzoeken. Zo voorkom je dat een tijdelijke oplossing de onderliggende situatie ongemoeid laat.",
        ],
      },
      {
        heading: "Sanitair, badkamer en keukenleidingen",
        paragraphs: [
          "Voor het vervangen van een kraan, toilet, wastafel of douche kan een loodgieter de water- en afvoeraansluitingen verzorgen. Geef aan of het bestaande sanitair wordt vervangen op dezelfde plek of dat je een andere indeling wilt. Verplaatsen van leidingen kan extra werk betekenen en moet worden afgestemd met andere disciplines.",
          "Een badkamerrenovatie omvat vaak ook tegelwerk, elektra, ventilatie en waterdichting. De loodgieter is één van de betrokken vakmensen; plan de volgorde met degene die de renovatie coördineert. Voor werkzaamheden aan elektrische installaties schakel je een geschikte elektricien in.",
          "Bij een keukenverbouwing kunnen aanpassing van waterleiding en afvoer nodig zijn voor een nieuwe spoelbak, vaatwasser of andere opstelling. Deel de gewenste indeling en productinformatie zodra die bekend is.",
        ],
      },
      {
        heading: "Waterleiding vervangen of uitbreiden",
        paragraphs: [
          "Bij een verbouwing kan een bestaande waterleiding worden aangepast om een extra kraan, toestel of sanitaire voorziening te plaatsen. De route, het materiaal en de staat van het huidige leidingwerk bepalen mede welke werkzaamheden nodig zijn.",
          "Geef aan waar het nieuwe aansluitpunt moet komen en welke wand- of vloerafwerking aanwezig is. Bespreek ook wie opengebroken delen herstelt en hoe de nieuwe aansluiting wordt gecontroleerd voordat de ruimte wordt afgewerkt.",
        ],
      },
      {
        heading: "CV en verwarming: passende professionele hulp",
        paragraphs: [
          "Sommige loodgieters werken ook aan onderdelen van verwarmingsinstallaties, maar de expertise verschilt per professional. Beschrijf daarom precies of het om een radiator, leiding, lekkage of een storing aan de installatie gaat en vraag of de vakman bevoegd en toegerust is voor dat werk.",
          "Werk aan gastoestellen en verbrandingsinstallaties hoort bij daarvoor gecertificeerde professionals. Laat dergelijke werkzaamheden niet uitvoeren door iemand wiens bevoegdheid en ervaring je niet hebt vastgesteld. Bij twijfel vraag je vooraf naar de relevante certificering.",
          "VakConnect koppelt op basis van de ingevoerde dienst en regio; controleer zelf of de professional de specifieke installatieklus kan uitvoeren voordat je afspraken maakt.",
        ],
      },
      {
        heading: "Zo helpt VakConnect bij loodgieterswerk",
        paragraphs: [
          "Je kiest de soort klus en beschrijft de symptomen, de betrokken ruimte en eventuele eerdere reparaties. Vermeld of de lekkage actief is, of watergebruik de klacht beïnvloedt en of de installatie bereikbaar is. Deel geen aannames als feit; een vakman kan de oorzaak beoordelen.",
          "VakConnect gebruikt je klusomschrijving en regio om passende professionals te vinden. Een loodgieter bepaalt zelf of de aanvraag binnen zijn werkgebied en expertise past. Daarna bespreek je rechtstreeks de benodigde inspectie, uitvoering en kosten.",
          "Je hoeft niet vooraf te weten welk onderdeel kapot is. Juist een nauwkeurige beschrijving van wat je ziet en wanneer het gebeurt geeft de vakman een beter vertrekpunt om de juiste vervolgstap voor te stellen.",
        ],
      },
      {
        heading: "Een passende loodgieter kiezen",
        paragraphs: [
          "Vraag of de loodgieter ervaring heeft met het soort werk dat je nodig hebt, vooral bij leidingverlegging, terugkerende lekkage of installaties die specialistische bevoegdheid vragen. Bespreek hoe onderzoek, herstel en eventueel materiaalgebruik worden berekend.",
          "Laat bij grotere werkzaamheden vastleggen welke leidingen of aansluitingen worden aangepast, waar de nieuwe punten komen en hoe herstel van opengebroken afwerking wordt geregeld. Bij een renovatie helpt afstemming met tegelzetter, elektricien en aannemer om werkzaamheden in een bruikbare volgorde uit te voeren.",
          "Vergelijk offertes op inspectie, uitvoering, materiaal en eventuele voorrijkosten. VakConnect kan profiel- en bedrijfsgegevens controleren waar van toepassing; beschikbaarheid en geschiktheid verschillen per opdracht.",
        ],
      },
    ],
    costFactors: [
      "Soort probleem: diagnose, plaatselijk herstel, verstopping of nieuwe installatie",
      "Lengte, materiaal en bereikbaarheid van leidingen en afvoer",
      "Benodigde demontage en herstel van wand, vloer of afwerking",
      "Keuze en aantal kranen, sanitair of aansluitpunten",
      "Afstemming met tegelwerk, elektra of andere renovatiewerkzaamheden",
      "Eventuele spoed en benodigde specialistische bevoegdheid",
    ],
    processSteps: [
      "Beschrijf de klacht, ruimte en signalen; vermeld wanneer het probleem optreedt.",
      "Noem recente werkzaamheden, gewenste nieuwe aansluitingen en of leidingen bereikbaar zijn.",
      "VakConnect zoekt met klus en regio naar passende loodgieters; de professional beoordeelt zelf de opdracht.",
      "Bespreek inspectie, bevoegdheden waar relevant, aanpak en offerte rechtstreeks met de vakman.",
    ],
    relatedLinks: [
      { href: "/loodgieter/lekkage", title: "Lekkage", description: "Welke informatie helpt bij het omschrijven van vocht en lekkende aansluitingen." },
      { href: "/loodgieter/verstopping", title: "Verstopping", description: "Aandachtspunten bij een afvoer die niet goed doorloopt." },
      { href: "/loodgieter/leidingwerk", title: "Leidingwerk", description: "Meer over herstel, vervanging en aanpassing van leidingen." },
      { href: "/loodgieter/sanitair", title: "Sanitair", description: "Bespreek installatie of vervanging van kranen en sanitair." },
      { href: "/loodgieter/afvoer", title: "Afvoer", description: "Lees over problemen en werkzaamheden aan afvoerleidingen." },
      { href: "/loodgieter/spoed", title: "Spoed loodgieter", description: "Wat je kunt delen wanneer een loodgietersprobleem niet kan wachten." },
      { href: "/badkamer", title: "Badkamerrenovatie", description: "Bekijk hoe loodgieterswerk samenhangt met een complete badkamerklus." },
      { href: "/hoe-werkt-het", title: "Hoe VakConnect werkt", description: "Zo spelen je klus en regio een rol bij de matching." },
      { href: "/kosten", title: "Kosten en offertes", description: "Lees hoe je werkzaamheden en offerte-uitgangspunten vergelijkt." },
    ],
    faqs: [
      { question: "Wanneer heb ik een loodgieter nodig?", answer: "Bij lekkage, problemen met waterleidingen of afvoer en installatie van sanitair of aansluitingen. Als je de oorzaak niet kent, beschrijf dan de signalen; de loodgieter kan beoordelen wat onderzocht moet worden." },
      { question: "Wat beïnvloedt de kosten van loodgieterswerk?", answer: "De aard en omvang van het werk, bereikbaarheid van leidingen, benodigde onderdelen en eventueel herstel van afwerking spelen mee. Bij renovatie tellen ook de afstemming en volgorde met andere vakmensen." },
      { question: "Kan een loodgieter een lekkage opsporen?", answer: "Een loodgieter kan de situatie en bereikbare leidingen beoordelen om de bron te achterhalen. De plek waar water zichtbaar wordt, is niet altijd de plek waar het lek zit." },
      { question: "Werkt een loodgieter ook in badkamer en keuken?", answer: "Veel loodgieters verzorgen water- en afvoeraansluitingen voor sanitair en keukens. Bij grotere verbouwingen zijn vaak ook andere vakmensen nodig; bespreek vooraf wie welke werkzaamheden uitvoert." },
      { question: "Hoe snel kan een loodgieter beschikbaar zijn?", answer: "Beschikbaarheid hangt af van regio, type klus en planning van professionals. VakConnect kan geen vaste reactietijd beloven; vermeld in je aanvraag als de situatie dringend is." },
    ],
    cta: { title: "Vertel wat er aan water of afvoer speelt", description: "Omschrijf de klacht, de ruimte en wat je al hebt gezien. De oorzaak hoeft nog niet bekend te zijn.", label: "Vind een loodgieter" },
  },
  elektricien: {
    path: "/elektricien",
    title: "Elektricien nodig? Vind een vakman",
    description: "Storing, groepenkast, verlichting of extra aansluitingen? Omschrijf je elektraklus en zoek via VakConnect.",
    keywords: ["elektricien", "groepenkast", "elektrastoring", "elektra aanleggen"],
    h1: "Elektricien nodig voor storing of uitbreiding?",
    intro: [
      "Van een groepenkast die aan vervanging toe is tot extra stopcontacten of verlichting: elektrowerk moet passen bij de installatie en het gebruik van de woning. Storingen kunnen bovendien wijzen op een probleem dat niet veilig is om zelf te onderzoeken.",
      "Beschrijf wat er uitvalt, welke aanpassing je plant en of er apparaten of een verbouwing bij betrokken zijn. VakConnect gebruikt klus en regio om passende professionals te zoeken. De elektricien beoordeelt zelf of de klus bij zijn expertise past; jij bespreekt de aanpak en beslist zelf.",
    ],
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Diensten", href: "/diensten" }, { label: "Elektricien" }],
    sections: [
      {
        heading: "Werkzaamheden van een elektricien",
        paragraphs: [
          "Een elektricien kan storingen onderzoeken, stopcontacten of schakelaars plaatsen, verlichting aansluiten en bestaande elektra uitbreiden. Ook aanpassingen aan de groepenkast komen voor, bijvoorbeeld wanneer de woning anders wordt gebruikt of er extra elektrische voorzieningen worden toegevoegd.",
          "Bij keuken- en badkamerrenovaties moet elektra worden afgestemd op de indeling, apparatuur en de omgeving waarin onderdelen worden geplaatst. Een laadpunt of aansluiting voor zonnepanelen kan aanvullende eisen stellen aan de installatie en aan de expertise van de uitvoerder.",
          "Geef aan of het om bestaand werk, nieuwbouw of renovatie gaat. Vermeld welke apparaten of voorzieningen je wilt aansluiten en of je al informatie hebt over de huidige groepenkast. Je hoeft zelf geen onderdelen open te maken om deze informatie te verzamelen.",
        ],
        bullets: ["Groepenkast beoordelen of aanpassen", "Stopcontacten, schakelaars en verlichting", "Elektrastoringen onderzoeken", "Uitbreiding voor keuken of badkamer", "Aansluiting voor laadpunt of zonnepanelen"],
      },
      {
        heading: "Bij een storing: veiligheid gaat voor",
        paragraphs: [
          "Een stroomstoring kan ontstaan door een apparaat, overbelasting of een probleem in de installatie. Noteer wat er gebeurde, welke ruimtes zonder stroom zitten en of er een brandlucht, vonken, warmte of zichtbare schade is. Zulke signalen zijn belangrijk voor de professional.",
          "Raak beschadigde bedrading of natte elektrische onderdelen niet aan en probeer geen groepenkast of aansluiting zelf te repareren. Bij rook, brand of direct gevaar schakel je de hulpdiensten in. Deze pagina bevat bewust geen doe-het-zelf-stappen voor risicovolle elektra.",
          "Een elektricien kan onderzoeken waar de storing ontstaat en aangeven welke reparatie nodig is. Laat terugkerende uitval beoordelen in plaats van steeds opnieuw dezelfde installatie te belasten.",
        ],
        type: "warning",
      },
      {
        heading: "Groepenkast en uitbreiding van elektra",
        paragraphs: [
          "Of een groepenkast moet worden aangepast hangt af van de bestaande installatie, de staat van onderdelen en de extra belasting die je wilt aansluiten. Een extra keukenapparaat, laadpunt of andere elektrische voorziening kan aanleiding zijn om de capaciteit en verdeling te laten beoordelen.",
          "Vertel welke nieuwe apparatuur je gebruikt of gaat plaatsen en wanneer de woning voor het laatst is aangepast. Foto’s van de buitenkant van de kast kunnen context geven, maar open de kast niet voor de aanvraag.",
          "Vraag de elektricien welke werkzaamheden nodig zijn en of keuring, materiaal en aanpassingen aan leidingen of afwerking zijn inbegrepen. Bij oudere woningen kan onderzoek meer inzicht geven dan een aanname op basis van alleen het aantal apparaten.",
        ],
      },
      {
        heading: "Verlichting, stopcontacten en ruimtes met extra eisen",
        paragraphs: [
          "Extra stopcontacten of andere verlichting kunnen het gebruik van een ruimte verbeteren. De route van bekabeling, de bestaande installatie en de gewenste plaats bepalen hoeveel werk nodig is. Maak duidelijk of de afwerking na het aanbrengen van kabels ook onderdeel van de klus moet zijn.",
          "In keuken en badkamer moet de elektrotechnische uitvoering aansluiten op de ruimte, plaatsing van apparaten en de overige werkzaamheden. Laat een vakbekwame elektricien beoordelen wat passend en veilig is, en stem de planning af met loodgieter, tegelzetter of keukenmonteur.",
          "Bij spots, buitenverlichting en slimme bediening spelen ook type armatuur, bediening en bestaande bedrading mee. Deel waar de lichtpunten moeten komen en welke producten je al hebt gekozen.",
        ],
      },
      {
        heading: "Elektra tijdens een keuken- of badkamerrenovatie",
        paragraphs: [
          "Bij een nieuwe keukenindeling kunnen apparaten, werkbladverlichting en stopcontacten op andere plekken nodig zijn. In een badkamer moeten verlichting, ventilatie en aansluitingen passen bij de ruimte en de plaats van sanitair.",
          "Leg posities en productkeuzes vroeg vast en stem kabelroutes af met loodgieter, keukenmonteur of tegelzetter. Laat de elektricien aangeven wat op basis van de bestaande installatie mogelijk is.",
        ],
      },
      {
        heading: "Laadpunt en aansluiting van zonnepanelen",
        paragraphs: [
          "Een laadpunt voor een elektrische auto vraagt om een geschikte aansluiting en afstemming op de bestaande elektrische installatie. De benodigde oplossing hangt onder meer af van de auto, laadwens, netaansluiting, afstand tot de groepenkast en eventuele regeling van het laadvermogen.",
          "Voor zonnepanelen moeten panelen, omvormer en elektrische aansluiting op elkaar aansluiten. Het dakwerk zelf kan een ander vakgebied zijn; overleg vooraf wie de panelen monteert en wie de elektrische aansluiting verzorgt.",
          "Vraag of de elektricien de specifieke laad- of zonnepaneelklus uitvoert en welke erkenning of certificering daarbij vereist is. Deel beschikbare productspecificaties zodat de professional kan aangeven of aanvullende informatie nodig is.",
        ],
      },
      {
        heading: "Zo helpt VakConnect bij een elektraklus",
        paragraphs: [
          "Je beschrijft de storing of gewenste uitbreiding, de ruimte en de betrokken apparaten. Bij een storing vermeld je wat uitvalt en eventuele waarschuwingssignalen; bij gepland werk deel je je indeling, productkeuzes en planning.",
          "VakConnect gebruikt het type opdracht en je regio om passende professionals te zoeken. De elektricien beoordeelt zelf of zijn expertise en planning aansluiten op de aanvraag. Vervolgens bespreek je onderzoek, werkzaamheden en prijs rechtstreeks.",
          "Voor specialistische klussen, zoals laadvoorzieningen of installaties rond zonnepanelen, is het verstandig de vereiste expertise en bevoegdheden vooraf te controleren. De uiteindelijke keuze voor een professional maak je zelf.",
        ],
      },
      {
        heading: "Waar let je op bij het kiezen van een elektricien?",
        paragraphs: [
          "Vraag of de elektricien ervaring heeft met jouw type installatie en welke delen van het werk worden uitgevoerd. Bij laadpunten, zonnepanelen en werkzaamheden in specifieke omgevingen kan erkende of gecertificeerde expertise vereist zijn; controleer wat voor jouw klus van toepassing is.",
          "Laat in de offerte beschrijven of diagnose, materialen, aanpassingen in de groepenkast, bekabeling en herstel van afwerking zijn inbegrepen. Bij een storing bespreek je ook hoe vervolgonderzoek of onderdelen worden berekend.",
          "Vergelijk voorstellen op scope en technische uitgangspunten, niet alleen op totaalprijs. VakConnect kan profiel- en bedrijfsgegevens controleren waar dat van toepassing is, maar een specifieke bevoegdheid of aansluiting op jouw klus bespreek je rechtstreeks met de elektricien.",
        ],
      },
    ],
    costFactors: [
      "Onderzoek naar de oorzaak en complexiteit van een storing",
      "Staat, capaciteit en aanpasbaarheid van de bestaande installatie",
      "Aantal stopcontacten, lichtpunten, groepen of nieuwe aansluitingen",
      "Type apparatuur, materiaalkeuze en benodigde bekabeling",
      "Bereikbaarheid van kabelroutes en herstel van wanden of plafonds",
      "Specialistische expertise voor laadpunten, zonnepanelen of bijzondere ruimtes",
    ],
    processSteps: [
      "Beschrijf de storing of uitbreiding, de betrokken ruimte en de gewenste voorzieningen.",
      "Vermeld wat er uitvalt, welke apparatuur meespeelt en eventuele zichtbare waarschuwingssignalen.",
      "VakConnect gebruikt klus en regio om passende elektriciens te zoeken; de professional beoordeelt zelf de match.",
      "Controleer vereiste expertise en bespreek inspectie, materialen en offerte rechtstreeks met de elektricien.",
    ],
    relatedLinks: [
      { href: "/elektricien/groepenkast", title: "Groepenkast", description: "Aandachtspunten bij controle of aanpassing van de groepenkast." },
      { href: "/elektricien/storing", title: "Elektrastoring", description: "Wat je kunt delen wanneer elektra onverwacht uitvalt." },
      { href: "/elektricien/stopcontacten", title: "Stopcontacten", description: "Informatie over extra of te vervangen stopcontacten." },
      { href: "/elektricien/verlichting", title: "Verlichting", description: "Lichtpunten, armaturen en bediening laten aanpassen." },
      { href: "/elektricien/krachtstroom", title: "Krachtstroom", description: "Bespreek de installatie en apparatuur die krachtstroom vraagt." },
      { href: "/badkamer", title: "Badkamer", description: "Bekijk hoe elektrowerk samenhangt met een badkamerrenovatie." },
      { href: "/verbouwing/keuken-verbouwen", title: "Keuken verbouwen", description: "Elektra kan onderdeel zijn van een nieuwe keukenindeling." },
      { href: "/hoe-werkt-het", title: "Hoe VakConnect werkt", description: "Lees hoe klusdetails en werkgebied de matching ondersteunen." },
      { href: "/kosten", title: "Kosten en offertes", description: "Lees welke uitgangspunten je in offertes kunt vergelijken." },
    ],
    faqs: [
      { question: "Wanneer moet een groepenkast worden vervangen?", answer: "Dat hangt af van de staat en samenstelling van de bestaande installatie en de gewenste uitbreiding. Laat een elektricien beoordelen of aanpassing nodig is; een leeftijd op zichzelf bepaalt niet altijd de juiste oplossing." },
      { question: "Welke klussen doet een elektricien?", answer: "Onder meer storingen onderzoeken, verlichting en stopcontacten plaatsen, elektra uitbreiden en groepenkasten aanpassen. Specialistische toepassingen kunnen aanvullende expertise vereisen." },
      { question: "Wat beïnvloedt de kosten van een elektricien?", answer: "De benodigde diagnose, omvang van de installatie, materiaal, bereikbaarheid en herstel van afwerking spelen mee. Ook specialistische voorzieningen zoals een laadpunt kunnen aanvullende werkzaamheden vragen." },
      { question: "Kan elke elektricien een laadpaal aansluiten?", answer: "Niet iedere elektricien biedt dezelfde diensten. Vraag naar ervaring met het laadpunt, de vereiste expertise of certificering en of de bestaande installatie eerst moet worden beoordeeld." },
      { question: "Wanneer is specialistische certificering nodig?", answer: "Dat hangt af van het type installatie en werkzaamheden, bijvoorbeeld bij bepaalde laad- of gasgerelateerde systemen. Vraag de professional welke bevoegdheid voor jouw specifieke klus vereist is en controleer die informatie." },
    ],
    cta: { title: "Omschrijf je elektrawerk veilig en duidelijk", description: "Vermeld of het om een storing of geplande uitbreiding gaat en welke ruimte of apparatuur betrokken is.", label: "Start je aanvraag" },
  },
  kozijnen: {
    path: "/kozijnen",
    title: "Kozijnen laten vervangen of herstellen",
    description: "Kunststof, houten of aluminium kozijnen laten plaatsen? Vergelijk materiaal, glas en montage en start bij VakConnect.",
    keywords: ["kozijnen", "kozijnen vervangen", "kunststof kozijnen", "houten kozijnen"],
    h1: "Kozijnen laten vervangen of renoveren?",
    intro: [
      "Tocht, klemmende ramen, beschadigd hout of plannen voor beter isolerend glas kunnen aanleiding zijn om kozijnen te laten herstellen of vervangen. De juiste aanpak hangt af van de staat van het bestaande kozijn, de gevel en het materiaal dat bij de woning past.",
      "Op deze pagina lees je over kunststof, hout en aluminium, de relatie met glas en wat je vooraf kunt uitzoeken. VakConnect gebruikt je klus en regio om passende professionals te zoeken. Een vakman beoordeelt zelf of de opdracht past; jij bespreekt de mogelijkheden en kiest zelf.",
    ],
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Diensten", href: "/diensten" }, { label: "Kozijnen" }],
    sections: [
      {
        heading: "Raam- en deurkozijnen: herstel, renovatie of vervanging",
        paragraphs: [
          "Kozijnen vormen de aansluiting tussen raam of deur en de gevel. Werkzaamheden kunnen bestaan uit herstel van een onderdeel, verbeteren van sluiting en kierdichting, vervanging van glas of het volledig verwijderen en plaatsen van nieuwe kozijnen. Eerst moet duidelijk zijn welk probleem je wilt oplossen.",
          "Houtrot of beschadiging aan een houten kozijn vraagt mogelijk om plaatselijk herstel, terwijl ernstige aantasting of maatwerk in de gevel een bredere aanpak kan vragen. Ook kunststof of aluminium kozijnen kunnen onderhoud, herstel van hang- en sluitwerk of vervanging van onderdelen nodig hebben.",
          "Noem in je aanvraag om welke ramen of deuren het gaat, wat je merkt en of het kozijn zichtbaar beschadigd is. Foto’s van binnen- en buitenzijde en globale maten kunnen helpen, maar een vakman moet de definitieve maatvoering ter plaatse controleren.",
        ],
        bullets: ["Raamkozijnen en deurkozijnen vervangen of herstellen", "Kunststof, houten en aluminium kozijnen", "Glas vervangen of combineren met nieuwe kozijnen", "Montage, kierdichting en afwerking"],
      },
      {
        heading: "Kunststof, hout of aluminium?",
        paragraphs: [
          "Kunststof kozijnen vragen doorgaans weinig schilderonderhoud en zijn in verschillende uitvoeringen verkrijgbaar. Let op profiel, kleur, uitstraling en hoe het raam opent. De mogelijkheden hangen af van de gewenste stijl en de afmetingen van de gevelopening.",
          "Houten kozijnen bieden ruimte voor maatwerk en kunnen bij veel woningtypes passen, maar de verflaag en het houtwerk vragen onderhoud. Controleer bij bestaande houten kozijnen of schade plaatselijk is of op meer plekken voorkomt voordat je besluit tot reparatie of vervanging.",
          "Aluminium kan geschikt zijn voor slanke profielen of specifieke architectuur. Vergelijk de eigenschappen van het aangeboden systeem, de thermische prestaties, afwerking en prijsopbouw. Geen enkel materiaal is voor iedere woning automatisch de beste keuze; gevel, gebruik en onderhoudswens tellen mee.",
        ],
      },
      {
        heading: "Glas en isolatie meenemen in de keuze",
        paragraphs: [
          "Kozijn en glas vormen samen een onderdeel van de gebouwschil. Als je tocht of warmteverlies wilt aanpakken, bespreek dan niet alleen het raam maar ook de aansluiting op het kozijn en de gevel. Een nieuw kozijn met glas moet passen bij de bestaande constructie en ventilatie van de woning.",
          "Bestaande kozijnen kunnen soms geschikt zijn voor nieuw glas, maar dat hangt af van profiel, staat en draagkracht. De vakman kan beoordelen of glas vervangen voldoende is of dat ook het kozijn aangepast moet worden.",
          "Vraag naar de opgegeven isolatie-eigenschappen van glas en kozijn en hoe montage en kierdichting worden uitgevoerd. Resultaten hangen af van de hele woning en een individuele besparing is niet vooraf te garanderen.",
        ],
      },
      {
        heading: "Wat komt kijken bij vervanging en montage?",
        paragraphs: [
          "Bij vervanging worden oude kozijnen doorgaans verwijderd en nieuwe elementen passend in de gevelopening gemonteerd. De staat van metselwerk, dorpels, stelruimte en binnenafwerking kan invloed hebben op de uitvoering. Bespreek of herstel van dagkanten, vensterbanken en schilderwerk inbegrepen is.",
          "Ook het type glas, ventilatieroosters, horren, ventilatie en hang- en sluitwerk verdienen aandacht. Maak een lijst van ramen en deuren, hun draairichting en wat er aan elk element moet veranderen. Zo worden wensen niet pas na het inmeten duidelijk.",
          "Laat definitieve maatvoering door de uitvoerende partij controleren. Afwijkingen in oudere gevels en eerdere verbouwingen maken zelf opmeten ongeschikt als enige basis voor productie.",
        ],
      },
      {
        heading: "Wanneer is renoveren genoeg?",
        paragraphs: [
          "Als het kozijn constructief goed is, kan herstel van sluitwerk, kitnaden, beglazing of een beschadigd deel voldoende zijn. Bij ernstige houtaantasting, vervorming, terugkerende lekkage of meerdere slecht sluitende ramen kan vervanging onderzocht worden.",
          "Bij renovatie is het belangrijk de oorzaak van tocht of vocht vast te stellen. Slechte kierdichting, glas, ventilatie en de aansluiting op de gevel kunnen elk een rol spelen. Een inspectie helpt om te voorkomen dat een zichtbare kier wordt aangepakt terwijl het probleem ergens anders zit.",
          "Vraag de vakman om uit te leggen welke onderdelen behouden blijven, hoe de overgang naar bestaande gevel wordt afgewerkt en welk onderhoud daarna nodig is.",
        ],
      },
      {
        heading: "Materiaalkeuze en onderhoud op lange termijn",
        paragraphs: [
          "Een kozijnkeuze heeft gevolgen voor de uitstraling, het onderhoud en de aansluiting op de woning. Hout kan periodiek schilderwerk vragen; kunststof en aluminium hebben andere reinigings- en onderhoudspunten. Vergelijk de eigenschappen van concrete profielen in plaats van alleen de materiaalnaam.",
          "Bespreek hoe kleur, glas, ventilatie en hang- en sluitwerk bij elkaar passen. Zo wordt een keuze niet alleen op uiterlijk gebaseerd, maar ook op gebruik en de bestaande gevel.",
        ],
      },
      {
        heading: "Zo helpt VakConnect bij kozijnen",
        paragraphs: [
          "Geef aan of je herstel, glasvervanging, renovatie of nieuwe kozijnen zoekt. Noteer het aantal ramen en deuren, materiaalvoorkeur, zichtbare schade, gewenste isolatie en of binnen- of buitenafwerking moet worden meegenomen.",
          "VakConnect gebruikt het type klus en je regio om passende professionals te vinden. De kozijnspecialist beoordeelt zelf of hij de opdracht kan uitvoeren. Je bespreekt daarna inmeten, materiaalkeuze, montage en kosten rechtstreeks.",
          "Heb je nog geen materiaal gekozen? Beschrijf dan je woning, onderhoudswens en aanleiding. Een vakman kan ter plaatse opties toelichten; je hoeft de keuze niet op basis van alleen een online omschrijving te maken.",
        ],
      },
      {
        heading: "Waar let je op bij een kozijnspecialist?",
        paragraphs: [
          "Vraag wie verantwoordelijk is voor inmeten, productie, verwijderen van bestaande kozijnen, montage en afwerking. Laat afspraken over glas, roosters, hang- en sluitwerk en herstel van gevel of binnenzijde opnemen in de offerte.",
          "Vergelijk systemen op materiaal, profiel, glas, isolatie-eigenschappen, onderhoud en garantievoorwaarden van de leverancier of uitvoerder. Check ook hoe ventilatie wordt geregeld wanneer kierdichting verbetert.",
          "Een profiel kan informatie geven over een bedrijf en diens werkgebied; controleer zelf of de specialist ervaring heeft met jouw materiaal, gevel en type vervanging. VakConnect geeft geen algemene garantie over alle professionals.",
        ],
      },
    ],
    costFactors: [
      "Aantal, afmetingen en vorm van ramen en deurkozijnen",
      "Materiaalkeuze en profiel, kleur, glas en aanvullende opties",
      "Herstel van bestaand kozijn tegenover volledig vervangen",
      "Verwijderen, montage en afwerking van gevel en binnenzijde",
      "Bereikbaarheid, staat van metselwerk en afwijkende maatvoering",
      "Ventilatieroosters, hang- en sluitwerk en afvoer van oude onderdelen",
    ],
    processSteps: [
      "Beschrijf welke raam- of deurkozijnen aandacht vragen en wat het probleem of doel is.",
      "Vermeld materiaal, aantal elementen, glaswensen, zichtbare schade en gewenste afwerking.",
      "VakConnect gebruikt klus en regio om passende kozijnprofessionals te zoeken; zij beoordelen zelf de aanvraag.",
      "Laat de specialist inmeten en bespreek materiaal, montage, glas, afwerking en offerte voordat je beslist.",
    ],
    relatedLinks: [
      { href: "/kozijnen/kunststof-kozijnen", title: "Kunststof kozijnen", description: "Lees aandachtspunten bij kunststof profielen, afwerking en onderhoud." },
      { href: "/kozijnen/houten-kozijnen", title: "Houten kozijnen", description: "Meer over houten kozijnen, herstel en periodiek onderhoud." },
      { href: "/kozijnen/aluminium-kozijnen", title: "Aluminium kozijnen", description: "Bekijk keuzes rond aluminium profielen en toepassing." },
      { href: "/kozijnen/kozijnen-vervangen", title: "Kozijnen vervangen", description: "Wat je kunt bespreken bij verwijderen en montage van nieuwe kozijnen." },
      { href: "/kozijnen/ramen-en-deuren", title: "Ramen en deuren", description: "Aandachtspunten voor raam- en deurkozijnen als geheel." },
      { href: "/schilder/kozijnen-schilderen", title: "Kozijnen schilderen", description: "Schilderonderhoud kan passend zijn wanneer bestaande kozijnen behouden blijven." },
      { href: "/isolatie", title: "Isolatie", description: "Bekijk isolatie als onderdeel van een bredere woningverbetering." },
      { href: "/hoe-werkt-het", title: "Hoe VakConnect werkt", description: "Lees hoe klusomschrijving en regio helpen bij de matching." },
      { href: "/kosten", title: "Kosten en offertes", description: "Vergelijk montage, glas, materiaal en afwerking in offertes." },
    ],
    faqs: [
      { question: "Kunststof, hout of aluminium: wat past bij mijn woning?", answer: "Dat hangt af van uitstraling, onderhoud, profiel, budget en de bestaande gevelopening. Vraag de specialist de eigenschappen van de aangeboden systemen toe te lichten en vergelijk op dezelfde uitgangspunten." },
      { question: "Wat beïnvloedt de kosten van kozijnen?", answer: "Aantal en formaat, materiaal, glas, montage, bereikbaarheid en de staat van gevel en bestaande kozijnen spelen mee. Ook binnen- en buitenafwerking kan onderdeel zijn van de prijs." },
      { question: "Wanneer moeten kozijnen worden vervangen?", answer: "Ernstige aantasting, blijvende problemen met sluiten of terugkerende vocht- en tochtklachten kunnen reden zijn voor beoordeling. Soms volstaat herstel; laat de staat en oorzaak eerst onderzoeken." },
      { question: "Kan ik alleen het glas laten vervangen?", answer: "Soms kan bestaand kozijn nieuw glas dragen, maar dat hangt af van profiel, staat en beschikbare ruimte. Een vakman kan beoordelen of glasvervanging mogelijk is zonder het kozijn te vervangen." },
      { question: "Hoe lang duurt montage?", answer: "De duur verschilt met het aantal kozijnen, maatwerk, bereikbaarheid en benodigde afwerking. Vraag de uitvoerder om een planning voor jouw woning; er is geen vaste montageduur voor iedere klus." },
    ],
    cta: { title: "Bespreek de juiste kozijnoplossing voor je woning", description: "Vertel wat je wilt verbeteren en welke ramen, deuren of materialen het betreft.", label: "Beschrijf je kozijnklus" },
  },
  badkamer: {
    path: "/badkamer",
    title: "Badkamer laten renoveren? Vind hulp",
    description: "Badkamer renoveren met tegelwerk, sanitair en installaties? Bekijk de aandachtspunten en start bij VakConnect.",
    keywords: ["badkamer renoveren", "badkamer renovatie", "sanitair", "tegelwerk badkamer"],
    h1: "Badkamer laten renoveren of aanpassen?",
    intro: [
      "Een nieuwe douche, andere indeling of complete badkamerrenovatie vraagt om meer dan sanitair kiezen. Waterdichting, leidingwerk, elektra, tegelwerk en ventilatie moeten op elkaar aansluiten, zeker wanneer voorzieningen worden verplaatst.",
      "Bepaal eerst wat je wilt veranderen en wat kan blijven. VakConnect gebruikt je klus en regio om passende professionals te vinden. Betrokken vakmensen beoordelen zelf of de opdracht bij hun werk past; jij bespreekt de aanpak en beslist zelf met wie je verdergaat.",
    ],
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Diensten", href: "/diensten" }, { label: "Badkamer" }],
    sections: [
      {
        heading: "Van kleine aanpassing tot complete badkamerrenovatie",
        paragraphs: [
          "Een badkamerklus kan variëren van een kraan of wastafel vervangen tot het volledig strippen en opnieuw opbouwen van de ruimte. Denk aan douche of bad, toilet, wastafelmeubel, tegelwerk, verlichting, stopcontacten, leidingwerk en ventilatie. Omschrijf welke onderdelen je wilt vernieuwen en welke behouden blijven.",
          "Een andere indeling vraagt vaak om verplaatsing van water- en afvoerleidingen en mogelijk aanpassing van elektra. Dat beïnvloedt de werkvolgorde en kan gevolgen hebben voor vloer, wanden en waterdichting. Laat de bestaande situatie beoordelen voordat je definitieve keuzes vastlegt.",
          "Bij een complete renovatie zijn meestal meerdere disciplines nodig. Een aannemer of coördinator kan werkzaamheden plannen; loodgieter, elektricien en tegelzetter verzorgen hun eigen vakwerk. Spreek af wie de afstemming en controle op zich neemt.",
        ],
        bullets: ["Complete badkamerrenovatie of deelrenovatie", "Douche, inloopdouche, toilet en wastafel", "Tegelwerk en afwerking", "Water- en afvoerleidingen", "Elektra, verlichting en ventilatie"],
      },
      {
        heading: "Indeling, sanitair en leidingwerk",
        paragraphs: [
          "De gewenste plek van douche, toilet en wastafel bepaalt mede of bestaande aansluitingen kunnen blijven. Een nieuwe indeling kan extra leidingwerk, aanpassing van afvoer of constructieve controle vragen. Deel een schets of plattegrond als je die hebt en noteer welke voorzieningen prioriteit hebben.",
          "Productkeuzes zoals douchegoot, inbouwkranen, toilet en wastafelmeubel kunnen invloed hebben op maatvoering en montage. Controleer tijdig welke producten je wilt gebruiken en bespreek met de vakman wanneer ze beschikbaar moeten zijn.",
          "Waterdruk, bestaande leidingen en de opbouw van vloer en wand zijn niet altijd zichtbaar voordat werk begint. Vraag hoe onverwachte situaties worden besproken en vastgelegd voordat aanvullend werk wordt uitgevoerd.",
        ],
      },
      {
        heading: "Tegelwerk, waterdichting en aansluitingen",
        paragraphs: [
          "Tegels geven de badkamer uitstraling, maar de ondergrond en afdichting erachter zijn minstens zo belangrijk. Hoeken, doorvoeren, douchevloer en aansluitingen rond bad of wastafel vragen om een zorgvuldige opbouw die past bij de gekozen producten en de ruimte.",
          "Bespreek formaat en patroon van tegels, voegkleur, snijwerk en de afwerking bij nissen of randen. Ook de staat van bestaande wanden kan bepalen hoeveel voorbereiding nodig is voordat tegelwerk kan beginnen.",
          "Laat uitleggen welke werkzaamheden de waterdichting omvatten en hoe die worden afgestemd op leidingdoorvoeren en doucheafvoer. Dit is geen plek om aannames te doen op basis van alleen het zichtbare tegelwerk.",
        ],
      },
      {
        heading: "Elektra, verlichting en ventilatie",
        paragraphs: [
          "Spiegelverlichting, ventilator, verwarming en stopcontacten moeten passen bij de badkamerindeling en de eisen voor elektra in vochtige ruimtes. Laat een geschikte elektricien de installatie beoordelen en uitvoeren; plaats of verplaats elektrische voorzieningen niet zelf op basis van algemene instructies.",
          "Ventilatie helpt vochtige lucht af te voeren. Een renovatie is een goed moment om te bespreken of de huidige voorziening voldoende werkt, waar lucht wordt afgevoerd en hoe toevoer van lucht is geregeld.",
          "Stem deze onderdelen vroeg af met de loodgieter en tegelzetter. De positie van kabels, leidingen, ventilatiekanalen en nisjes kan gevolgen hebben voor de opbouw en afwerking van wanden en plafond.",
        ],
      },
      {
        heading: "Plan de werkvolgorde vooraf",
        paragraphs: [
          "Een badkamer wordt doorgaans in stappen opgebouwd: eerst worden bestaande onderdelen verwijderd en leidingen of elektra aangepast, daarna volgen ondergrond en waterdichting, tegelwerk en montage van sanitair en accessoires. De exacte volgorde hangt af van de gekozen oplossing en afspraken tussen vakmensen.",
          "Denk vooraf na over toegang tot de woning, gebruik van een tweede badkamer en opslag van materialen. Bespreek ook wie puin afvoert, de ruimte beschermt en de eindcontrole verzorgt.",
          "De doorlooptijd is afhankelijk van omvang, materiaalbeschikbaarheid, droogtijden en eventuele verrassingen in de bestaande ruimte. Vraag om een planning die rekening houdt met de specifieke klus, zonder uit te gaan van een vaste standaardduur.",
        ],
      },
      {
        heading: "Coördinatie van meerdere disciplines",
        paragraphs: [
          "Een badkamerrenovatie kan door één partij worden georganiseerd of door jou met afzonderlijke vakmensen worden gepland. In beide gevallen moet helder zijn wie de volgorde bewaakt, wanneer keuzes moeten worden gemaakt en wie controleert of aansluitingen gereed zijn voor de volgende stap.",
          "Leg afspraken over levering, toegang, afval en wijzigingen vast. Een duidelijke taakverdeling maakt het makkelijker om verwachtingen te bespreken als werk van de ene discipline invloed heeft op een andere.",
        ],
      },
      {
        heading: "Zo helpt VakConnect bij een badkamerklus",
        paragraphs: [
          "Je geeft aan of je een complete renovatie of een specifieke aanpassing zoekt, beschrijft de huidige indeling en deelt je wensen voor sanitair, tegelwerk en installaties. Noem ook wat je wilt behouden, de gewenste planning en of er al een ontwerp of productkeuze is.",
          "VakConnect gebruikt de klus en regio om passende professionals te zoeken. Een professional bepaalt zelf of hij de aanvraag oppakt en of zijn werkzaamheden passen bij jouw project. Je bespreekt daarna rechtstreeks scope, taakverdeling, planning en kosten.",
          "Bij meerdere disciplines is het belangrijk helder te krijgen wie de werkzaamheden coördineert. Je kunt in je aanvraag aangeven of je één partij zoekt voor een totaalproject of specifieke vakmensen voor afzonderlijke onderdelen.",
        ],
      },
      {
        heading: "Waar let je op bij een badkamerprofessional?",
        paragraphs: [
          "Vraag welke werkzaamheden de professional zelf uitvoert en welke door onderaannemers of andere vakmensen worden gedaan. Leg vast wie leidingwerk, elektra, waterdichting, tegelwerk, montage, afvoer van puin en eventuele herstelwerkzaamheden coördineert.",
          "Vergelijk offertes op dezelfde indeling, materialen en afwerking. Controleer of verwijderen van bestaande onderdelen, voorbereiding van de ondergrond, afdichting en montage van jouw gekozen sanitair zijn meegenomen.",
          "Bespreek hoe wijzigingen en onvoorziene gebreken worden afgehandeld voordat extra werk start. Een duidelijke schriftelijke scope maakt verwachtingen over kosten en planning transparanter.",
        ],
      },
    ],
    costFactors: [
      "Deelrenovatie tegenover volledig strippen en opnieuw opbouwen",
      "Aantal en type sanitaire voorzieningen en materiaalkeuzes",
      "Verleggen of vervangen van waterleidingen, afvoer en elektra",
      "Ondergrond, waterdichting, tegeloppervlak en gewenste afwerking",
      "Ventilatie, maatwerk, bereikbaarheid en afvoer van oud materiaal",
      "Afstemming, planning en coördinatie van verschillende vakmensen",
    ],
    processSteps: [
      "Omschrijf de huidige badkamer, gewenste indeling en wat je wilt vernieuwen of behouden.",
      "Deel waar mogelijk een schets, maatvoering en keuzes voor sanitair, tegelwerk en planning.",
      "VakConnect gebruikt klus en regio om passende professionals te vinden; zij bepalen zelf of ze de opdracht oppakken.",
      "Bespreek disciplines, coördinatie, waterdichting, planning en offerte en leg afspraken schriftelijk vast.",
    ],
    relatedLinks: [
      { href: "/badkamer/renovatie", title: "Badkamerrenovatie", description: "Lees aandachtspunten bij een complete of gedeeltelijke renovatie." },
      { href: "/badkamer/tegelen", title: "Badkamer tegelen", description: "Bespreek ondergrond, patroon, afdichting en tegelafwerking." },
      { href: "/badkamer/sanitair", title: "Sanitair", description: "Informatie over plaatsing of vervanging van badkameronderdelen." },
      { href: "/badkamer/inloopdouche", title: "Inloopdouche", description: "Bekijk wat een inloopdouche vraagt van indeling en vloer." },
      { href: "/badkamer/complete-badkamer", title: "Complete badkamer", description: "Voorbereiding van een project met meerdere onderdelen." },
      { href: "/badkamer/ventilatie", title: "Badkamerventilatie", description: "Neem afvoer van vochtige lucht mee in de renovatie." },
      { href: "/loodgieter", title: "Loodgieter", description: "Waterleidingen, afvoer en sanitair zijn vaak onderdeel van de klus." },
      { href: "/elektricien", title: "Elektricien", description: "Voor veilige elektra, verlichting en aansluitingen in de badkamer." },
      { href: "/hoe-werkt-het", title: "Hoe VakConnect werkt", description: "Lees hoe je projectomschrijving en regio bij matching helpen." },
      { href: "/kosten", title: "Kosten en offertes", description: "Vergelijk scope, materialen en taakverdeling in offertes." },
    ],
    faqs: [
      { question: "Wat bepaalt de kosten van een badkamerrenovatie?", answer: "Projectomvang, sanitair, tegelwerk, leidingaanpassingen, elektra, waterdichting en afwerking spelen mee. Ook de bestaande ondergrond en coördinatie van meerdere vakmensen beïnvloeden de offerte." },
      { question: "Welke vakmensen zijn nodig?", answer: "Afhankelijk van de klus kunnen een loodgieter, elektricien, tegelzetter en aannemer nodig zijn. Bij een totaalrenovatie is het belangrijk af te spreken wie de planning en afstemming coördineert." },
      { question: "Hoe lang duurt een renovatie?", answer: "Dat verschilt met de omvang, materiaalbeschikbaarheid, droogtijden en eventuele onvoorziene gebreken. Vraag de uitvoerder om een planning voor jouw badkamer en bespreek mogelijke afhankelijkheden." },
      { question: "Kunnen leidingen worden verlegd?", answer: "Vaak kan een nieuwe indeling aanpassing van leidingen vragen, maar haalbaarheid hangt af van constructie, afvoer en beschikbare ruimte. Laat de situatie beoordelen voordat je de indeling definitief maakt." },
      { question: "Moet ventilatie worden aangepast?", answer: "Niet altijd, maar de ventilatie verdient aandacht bij een renovatie, vooral als de ruimte vochtig blijft of de indeling verandert. Bespreek afvoer en luchttoevoer met de betrokken vakman." },
    ],
    cta: { title: "Breng je badkamerplannen in kaart", description: "Beschrijf wat je wilt vernieuwen, welke onderdelen blijven en of de indeling verandert.", label: "Start je badkamerklus" },
  },
  isolatie: {
    path: "/isolatie",
    title: "Isolatie van je woning laten verbeteren",
    description: "Dak, vloer, spouw of gevel isoleren? Bekijk aandachtspunten rond woning, materiaal en ventilatie en start bij VakConnect.",
    keywords: ["isolatie", "dakisolatie", "vloerisolatie", "spouwmuurisolatie"],
    h1: "Isolatie verbeteren in je woning?",
    intro: [
      "Een comfortabelere woning begint met de juiste aanpak voor dak, vloer, gevel of spouw. Welke isolatie geschikt is, hangt af van de woning, bestaande constructie, vocht en ventilatie; één oplossing past niet overal.",
      "Op deze pagina lees je waar je de verschillende isolatievormen voor gebruikt en welke informatie helpt bij een eerste beoordeling. VakConnect gebruikt klus en regio om passende professionals te zoeken. Een specialist beoordeelt zelf of de situatie en opdracht binnen zijn expertise vallen.",
    ],
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Diensten", href: "/diensten" }, { label: "Isolatie" }],
    sections: [
      {
        heading: "Welke delen van de woning kun je isoleren?",
        paragraphs: [
          "Isolatiewerk kan betrekking hebben op het dak, de vloer of kruipruimte, een spouwmuur of de gevel. Elk onderdeel vraagt een andere werkwijze en beoordeling van de bestaande opbouw. Bij sommige woningen is er al isolatie aanwezig, maar is de staat of continuïteit daarvan niet duidelijk.",
          "Dakisolatie kan aan de binnen- of buitenzijde worden aangebracht, afhankelijk van dakconstructie, beschikbare ruimte en gewenste afwerking. Vloer- of kruipruimte-isolatie hangt mede af van vocht, hoogte en toegankelijkheid. Spouwmuurisolatie is alleen een optie wanneer de spouw en gevel daarvoor geschikt zijn.",
          "Gevelisolatie kan aan de binnen- of buitenzijde worden overwogen wanneer andere mogelijkheden niet passen of als onderdeel van een grotere renovatie. Aanpassing van glas of kozijnen kan aanvullend bijdragen aan de gebouwschil, maar is een aparte klus met eigen materiaal- en montagekeuzes.",
        ],
        bullets: ["Dakisolatie aan de binnen- of buitenzijde", "Vloer- en kruipruimte-isolatie", "Spouwmuurisolatie na geschiktheidsbeoordeling", "Gevelisolatie als onderdeel van een passende aanpak", "Glas en kozijnen als aanvullende verbetering"],
      },
      {
        heading: "Eerst de woning en constructie laten beoordelen",
        paragraphs: [
          "Voor een keuze is inzicht nodig in de huidige isolatie, bouwkundige staat, vocht en ventilatie. Bij oudere woningen kunnen eerdere aanpassingen of verborgen constructiedelen bepalend zijn. Vertel wat je weet over bouwjaar, eerdere isolatie en klachten zoals condens of vochtplekken.",
          "Een geschikte specialist kan beoordelen of een spouw schoon en bruikbaar is, of een dakopbouw ruimte biedt voor isolatie en of de kruipruimte toegankelijk is. Een isolatiemaatregel zonder aandacht voor bestaande vochtproblemen kan ongewenste gevolgen hebben.",
          "Vraag welke inspectie of meting vooraf wordt uitgevoerd en hoe bevindingen de materiaalkeuze beïnvloeden. Een offerte is beter te beoordelen als duidelijk is welke delen en oppervlaktes worden aangepakt.",
        ],
      },
      {
        heading: "Ventilatie hoort bij isolatieplannen",
        paragraphs: [
          "Wanneer een woning beter wordt afgedicht, kan de luchtverversing veranderen. Ventilatie verdient daarom aandacht naast het isolatiemateriaal. De benodigde voorziening hangt af van de woning, de huidige ventilatie en hoe bewoners ruimtes gebruiken.",
          "Bespreek met de specialist of bestaande ventilatieroosters of mechanische ventilatie voldoende blijven functioneren en of aanpassingen nodig zijn. Laat vocht- of schimmelproblemen onderzoeken in plaats van ze achter een nieuwe afwerking te verbergen.",
          "Isoleren kan onderdeel zijn van een grotere renovatie. Stem de volgorde af met werkzaamheden aan dak, gevel, kozijnen en installaties, zodat aansluitingen niet worden onderbroken en afwerking waar nodig wordt hersteld.",
        ],
      },
      {
        heading: "Dakisolatie en isolatie van de vloer",
        paragraphs: [
          "Bij dakisolatie zijn het type dak, de beschikbare hoogte, bestaande lagen en de gewenste binnenafwerking belangrijk. Bij een hellend dak gaat het bijvoorbeeld om de ruimte tussen of onder de constructie; bij een plat dak moet de volledige dakopbouw worden beoordeeld.",
          "Voor vloerisolatie tellen de bereikbaarheid van de kruipruimte, bodemvocht, ventilatieopeningen en de staat van de vloer mee. Als de ruimte laag of moeilijk toegankelijk is, kan dat de mogelijke methode en de uitvoering beïnvloeden.",
          "Noem in de aanvraag of je vooral comfort, een renovatie of het aanpakken van een koude vloer als aanleiding hebt. De specialist kan vervolgens kijken welke bouwdelen en randvoorwaarden nader onderzocht moeten worden.",
        ],
      },
      {
        heading: "Spouwmuur en gevel: niet elke muur is hetzelfde",
        paragraphs: [
          "Spouwmuurisolatie is alleen geschikt als er een bruikbare spouw is en de gevel in passende staat verkeert. Vervuiling, vocht, bestaande vulling of bijzondere geveldetails kunnen invloed hebben op de geschiktheid. Laat daarom een controle uitvoeren voordat een methode wordt gekozen.",
          "Bij gevelisolatie aan de buitenzijde kunnen uiterlijk, aansluitingen bij kozijnen, dakrand en ventilatieopeningen veranderen. Binnenisolatie vraagt aandacht voor vochtgedrag en afwerking. Bespreek de gevolgen voor de volledige gevel, niet alleen het isolatiemateriaal.",
          "Glas en kozijnen kunnen als aanvullende context worden meegenomen wanneer je de woning als geheel wilt verbeteren. Ze vormen echter een afzonderlijke investering en moeten worden afgestemd op de ventilatie en overige isolatiemaatregelen.",
        ],
      },
      {
        heading: "Glas en kozijnen als aanvullende verbetering",
        paragraphs: [
          "Bij een bredere aanpak van de gebouwschil kunnen glas en kozijnen naast dak-, vloer- of gevelisolatie in beeld komen. Een passend nieuw kozijn of glas kan comfort beïnvloeden, maar moet aansluiten op de bestaande gevel en de manier waarop de woning wordt geventileerd.",
          "Vraag welke verbetering bij het onderzochte bouwdeel hoort en welke onderdelen een aparte klus vormen. Zo kun je keuzes en offertes beter uit elkaar houden en de volgorde van werkzaamheden afstemmen.",
        ],
      },
      {
        heading: "Zo helpt VakConnect bij isolatiewerk",
        paragraphs: [
          "Beschrijf welk bouwdeel je wilt isoleren, wat je aanleiding is en wat je weet over de huidige constructie. Vermeld eerdere maatregelen, vochtproblemen, bereikbaarheid en of je al een inspectie of advies hebt ontvangen.",
          "VakConnect gebruikt de klus en je regio om passende professionals te zoeken. Een isolatiespecialist beoordeelt zelf of het project aansluit bij zijn expertise en werkgebied. Jij bespreekt vervolgens geschiktheid, materiaal, ventilatie, uitvoering en offerte.",
          "Je kunt ook aangeven als je nog twijfelt tussen dak-, vloer- of gevelaanpak. Deel dan de woningkenmerken en je doel; een vakman kan aangeven welke inspectie nodig is voordat je een maatregel kiest.",
        ],
      },
      {
        heading: "Waar let je op bij een isolatiespecialist?",
        paragraphs: [
          "Vraag hoe de professional de geschiktheid van het bouwdeel vaststelt en welk materiaal met welke dikte of opbouw wordt toegepast. Laat ook details rond naden, doorvoeren, aansluitingen en eventuele bestaande vochtproblemen bespreken.",
          "Vraag welke voorbereiding, afwerking en ventilatieaanpassingen wel of niet zijn inbegrepen. Als een maatregel gevolgen kan hebben voor gevelaanzicht, dakrand of vloerhoogte, bespreek dat voordat je een opdracht bevestigt.",
          "Vergelijk offertes op hetzelfde oppervlak, materiaal, inspectie en afwerkingsniveau. VakConnect kan profiel- en bedrijfsgegevens controleren waar van toepassing; vraag zelf naar relevante ervaring met het type woning en isolatie dat je overweegt.",
        ],
      },
    ],
    costFactors: [
      "Te isoleren bouwdeel, oppervlak en bestaande constructie",
      "Materiaal, gewenste opbouw en eventuele verwijdering van oude lagen",
      "Geschiktheidsinspectie en herstel van vocht- of bouwkundige problemen",
      "Bereikbaarheid van dak, gevel, spouw of kruipruimte",
      "Afwerking, aansluitingen rond kozijnen en doorvoeren",
      "Aanpassingen aan ventilatie of combinatie met andere renovatiewerkzaamheden",
    ],
    processSteps: [
      "Beschrijf welk bouwdeel je wilt isoleren en wat de aanleiding voor de klus is.",
      "Vermeld bekende bouwkundige informatie, eerdere isolatie, vochtklachten en bereikbaarheid.",
      "VakConnect zoekt op basis van klus en regio naar passende specialisten; zij beoordelen zelf de opdracht.",
      "Bespreek inspectie, geschiktheid, ventilatie, materiaalkeuze en offerte voordat je een maatregel kiest.",
    ],
    relatedLinks: [
      { href: "/isolatie/dakisolatie", title: "Dakisolatie", description: "Lees over isolatie aan de binnen- of buitenzijde van het dak." },
      { href: "/isolatie/vloerisolatie", title: "Vloerisolatie", description: "Aandachtspunten bij isolatie van de vloer of kruipruimte." },
      { href: "/isolatie/kruipruimte-isolatie", title: "Kruipruimte-isolatie", description: "Bekijk welke informatie over toegang en vocht relevant is." },
      { href: "/isolatie/spouwmuurisolatie", title: "Spouwmuurisolatie", description: "Waarom eerst de spouw en gevel op geschiktheid worden beoordeeld." },
      { href: "/isolatie/gevelisolatie", title: "Gevelisolatie", description: "Mogelijkheden en aansluitingen bij isolatie van de gevel." },
      { href: "/kozijnen", title: "Kozijnen", description: "Kozijnen en glas kunnen onderdeel zijn van woningverbetering." },
      { href: "/verbouwing", title: "Verbouwing", description: "Neem isolatiemaatregelen mee in een bredere renovatieplanning." },
      { href: "/hoe-werkt-het", title: "Hoe VakConnect werkt", description: "Zo helpen klusomschrijving en regio bij het vinden van een specialist." },
      { href: "/kosten", title: "Kosten en offertes", description: "Vergelijk inspectie, materiaal, oppervlak en afwerking." },
    ],
    faqs: [
      { question: "Welke isolatievorm past bij mijn woning?", answer: "Dat hangt af van bouwdeel, bestaande constructie, vocht, bereikbaarheid en aanwezige isolatie. Laat de woning beoordelen voordat je kiest tussen dak-, vloer-, spouw- of gevelisolatie." },
      { question: "Wat beïnvloedt de kosten van isolatie?", answer: "Oppervlak, materiaal, bereikbaarheid, voorbereiding en afwerking spelen mee. Ook inspectie, herstel van bouwkundige problemen en ventilatieaanpassingen kunnen invloed hebben." },
      { question: "Moet ventilatie worden aangepast?", answer: "Dat kan nodig zijn wanneer de luchtdichtheid van de woning verandert. Laat de bestaande ventilatie en het gebruik van ruimtes meenemen in het advies van de specialist." },
      { question: "Kan elk dak worden geïsoleerd?", answer: "Niet elke dakopbouw laat dezelfde methode toe. Type dak, ruimte, bestaande lagen en vochtgedrag bepalen welke oplossingen onderzocht kunnen worden." },
      { question: "Welke vakman heb ik nodig?", answer: "Zoek een specialist die ervaring heeft met het bouwdeel dat je wilt isoleren en de geschiktheid vooraf beoordeelt. Bij combinatie met dak- of kozijnwerk kunnen meerdere vakgebieden betrokken zijn." },
    ],
    cta: { title: "Ontdek welke isolatieklus bij je woning past", description: "Vertel welk bouwdeel je wilt verbeteren en wat je al weet over de constructie en ventilatie.", label: "Beschrijf je isolatieklus" },
  },
  verbouwing: {
    path: "/verbouwing",
    title: "Verbouwing laten uitvoeren? Vind vakmensen",
    description: "Van aanbouw en zolder tot keuken of renovatie: breng je verbouwklus helder in kaart en start via VakConnect.",
    keywords: ["verbouwing", "aanbouw", "woningrenovatie", "zolder verbouwen"],
    h1: "Verbouwing plannen? Vind hulp voor jouw project",
    intro: [
      "Een verbouwing kan een enkele ruimte betreffen of meerdere onderdelen van de woning omvatten. Een keuken aanpassen, zolder indelen, aanbouw realiseren of woning renoveren vraagt telkens om een andere combinatie van voorbereiding, vakmensen en planning.",
      "Begin met een duidelijke omschrijving van wat je wilt veranderen en wat het eindresultaat moet zijn. VakConnect gebruikt je klus en regio om passende professionals te zoeken. Professionals bepalen zelf of het project bij hun werk past; jij bespreekt voorstellen en kiest zelf met wie je verdergaat.",
    ],
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Diensten", href: "/diensten" }, { label: "Verbouwing" }],
    sections: [
      {
        heading: "Van kleine aanpassing tot totaalrenovatie",
        paragraphs: [
          "Onder verbouwing vallen uiteenlopende werkzaamheden: binnenwanden plaatsen of verwijderen, timmerwerk, een zolder bruikbaar maken, keuken of badkamer vernieuwen, een woning renoveren of een aanbouw en uitbouw realiseren. De benodigde voorbereiding hangt af van de omvang en de bestaande constructie.",
          "Bij een kleine klus kan één vakman voldoende zijn. Een project met constructieve wijzigingen, nieuwe installaties en afwerking vraagt vaak om verschillende disciplines. Maak onderscheid tussen wat vaststaat, wat nog onderzocht moet worden en welke onderdelen je eventueel later wilt uitvoeren.",
          "Een aanbouw of uitbouw verschilt sterk van een interne renovatie. Denk aan aansluiting op de bestaande woning, fundering, gevel, dak, installaties en afwerking. De haalbaarheid en eventuele vergunningen hangen af van de concrete situatie; controleer dit tijdig bij de gemeente of een deskundige.",
        ],
        bullets: ["Aanbouw of uitbouw", "Zolderverbouwing en binnenwanden", "Timmerwerk en woningrenovatie", "Keuken- of badkamerverbouwing", "Totaalproject of gefaseerde aanpak"],
      },
      {
        heading: "Begin met scope, doel en prioriteiten",
        paragraphs: [
          "Schrijf op welke ruimtes of onderdelen veranderen, wat behouden blijft en waarom je verbouwt. Meer bergruimte, een andere indeling, herstel van achterstallig onderhoud of een nieuwe keuken leiden tot verschillende keuzes en werkvolgordes.",
          "Maak waar mogelijk een schets met maten, foto’s en een lijst van gewenste materialen. Je hoeft niet elk detail al te hebben gekozen, maar benoem onzekerheden zoals een wand waarvan de functie onbekend is of installaties die mogelijk verplaatst moeten worden.",
          "Bij grotere projecten helpt het om wensen te rangschikken in noodzakelijk, gewenst en optioneel. Dat maakt het eenvoudiger om voorstellen en fasering te bespreken wanneer niet alle onderdelen tegelijk kunnen worden uitgevoerd.",
        ],
      },
      {
        heading: "Constructie, installaties en voorbereiding",
        paragraphs: [
          "Het verplaatsen of verwijderen van een wand kan gevolgen hebben voor de constructie. Ook leidingen, elektra, ventilatie en verwarming kunnen in wanden of vloeren lopen. Laat vooraf vaststellen wat er aanwezig is en welke deskundigheid nodig is voordat sloop- of zaagwerk begint.",
          "Bij een zolderverbouwing tellen onder meer dakconstructie, daglicht, isolatie, ventilatie en toegang mee. Voor een aanbouw komen fundering en aansluiting op de bestaande gevel in beeld. Een bouwkundige of andere specialist kan nodig zijn om plannen te beoordelen.",
          "Als meerdere vakmensen betrokken zijn, spreek af wie de werkvolgorde bewaakt en wijzigingen vastlegt. Heldere verantwoordelijkheid helpt om te voorkomen dat een volgende discipline begint voordat voorbereidende werkzaamheden gereed zijn.",
        ],
      },
      {
        heading: "Keuken, badkamer en binnenafwerking",
        paragraphs: [
          "Een keukenverbouwing kan bestaan uit nieuwe kasten en apparatuur op dezelfde plek, maar ook uit verplaatsing van water, afvoer, elektra of wanden. Deel de gewenste indeling en apparatuur zodat aansluitingen en montage samen kunnen worden gepland.",
          "Een badkamer vraagt vaak om loodgieterswerk, elektra, waterdichting, tegelwerk en montage. Beslis vroeg welke onderdelen behouden blijven en bespreek wie de verschillende werkzaamheden coördineert.",
          "Timmerwerk, binnenwanden en afwerking kunnen op hun beurt invloed hebben op deuren, vloeren, verlichting en ventilatie. Werk een ruimte niet alleen op uiterlijk uit; denk ook aan gebruik, onderhoud en bereikbaarheid van installaties.",
        ],
      },
      {
        heading: "Voorbereiding en vergunningen tijdig onderzoeken",
        paragraphs: [
          "Voor grotere aanpassingen kunnen tekeningen, constructief advies of overleg met de gemeente nodig zijn. Of een vergunning of melding van toepassing is, hangt af van de aard van het werk, woning en lokale regels. Controleer dit voor jouw plan in plaats van uit te gaan van een algemene regel.",
          "Deel in je aanvraag wat al is uitgezocht en welke vragen nog openstaan. Een vakman kan aangeven welke aanvullende deskundigheid nodig is, maar formele eisen controleer je bij de gemeente of een bevoegde adviseur.",
        ],
      },
      {
        heading: "Fasering, planning en gebruik van de woning",
        paragraphs: [
          "Een verbouwing in bewoonde staat vraagt aandacht voor stof, geluid, toegang en tijdelijke uitval van keuken, badkamer of verwarming. Bespreek hoe ruimtes beschikbaar zijn en welke werkzaamheden voorrang hebben.",
          "Bij gefaseerde renovatie moet de volgorde aansluiten op afhankelijkheden. Isolatie, kozijnen en binnenafwerking kunnen bijvoorbeeld met elkaar samenhangen; een planning per ruimte of bouwdeel helpt om dubbel werk te voorkomen.",
          "Planning is afhankelijk van materiaal, voorbereiding, vergunningen waar relevant, beschikbaarheid van vakmensen en wat tijdens het werk wordt aangetroffen. Vraag om een realistische projectplanning en hoe wijzigingen of vertragingen worden gecommuniceerd.",
        ],
      },
      {
        heading: "Zo helpt VakConnect bij een verbouwing",
        paragraphs: [
          "Je beschrijft het project, de woningdelen, gewenste werkzaamheden en globale planning. Deel beschikbare tekeningen, foto’s, maten of materiaalkeuzes en geef aan welke onderdelen nog onderzocht moeten worden.",
          "VakConnect gebruikt de omschreven klus en regio om passende professionals te zoeken. Een vakman bepaalt zelf of de omvang, planning en disciplines passen bij zijn werk. Daarna bespreek je rechtstreeks de scope, eventuele opname op locatie, kosten en taakverdeling.",
          "Voor projecten met meerdere disciplines kun je aangeven of je een partij zoekt die coördineert of losse specialisten nodig hebt. Zorg dat helder is wie offertes verzamelt, wie beslissingen vastlegt en wie verantwoordelijk is voor de aansluiting tussen werkzaamheden.",
        ],
      },
      {
        heading: "Waar let je op bij een aannemer of verbouwspecialist?",
        paragraphs: [
          "Vraag om een offerte waarin werkzaamheden, materialen, uitsluitingen en afwerking duidelijk zijn omschreven. Bij meerdere vakmensen moet duidelijk worden wie de coördinatie doet en hoe kosten van meerwerk worden besproken voordat dit wordt uitgevoerd.",
          "Controleer of bouwkundige beoordeling, tekeningen, constructieberekening, vergunningen of meldingen onderdeel zijn van de voorbereiding of apart geregeld moeten worden. De noodzaak verschilt per project en gemeente; laat geen algemene aanname leidend zijn.",
          "Vergelijk offertes op dezelfde scope, planning en materiaalkeuzes. Bespreek betalingsmomenten, wijzigingen, oplevering en eventuele garanties die de uitvoerder zelf aanbiedt. VakConnect kan profiel- en bedrijfsgegevens controleren waar van toepassing, maar vervangt je eigen beoordeling van de afspraken niet.",
        ],
      },
    ],
    costFactors: [
      "Projectomvang en het aantal ruimtes of bouwdelen",
      "Constructieve aanpassingen, tekeningen en benodigde onderzoeken",
      "Materiaal, afwerking en maatwerk",
      "Nieuwe of verplaatste water-, elektra-, ventilatie- en verwarmingsinstallaties",
      "Coördinatie van meerdere vakmensen en fasering van het werk",
      "Bereikbaarheid, afvoer, tijdelijke voorzieningen en onvoorziene gebreken",
    ],
    processSteps: [
      "Beschrijf het gewenste resultaat, de betrokken ruimtes en wat behouden blijft.",
      "Deel foto’s, tekeningen, maten en bekende bouwkundige of installatietechnische aandachtspunten.",
      "VakConnect zoekt met klus en regio naar passende vakmensen; zij bepalen zelf of het project past.",
      "Bespreek scope, disciplines, coördinatie, vergunningvragen, planning en offerte voordat je afspraken maakt.",
    ],
    relatedLinks: [
      { href: "/verbouwing/aanbouw", title: "Aanbouw", description: "Aandachtspunten bij een uitbreiding die aansluit op de woning." },
      { href: "/verbouwing/uitbouw", title: "Uitbouw", description: "Lees over ruimtewinst, aansluiting en voorbereiding van een uitbouw." },
      { href: "/verbouwing/zolder-verbouwen", title: "Zolder verbouwen", description: "Breng indeling, isolatie en gebruik van de zolder in kaart." },
      { href: "/verbouwing/woning-renoveren", title: "Woning renoveren", description: "Bekijk hoe je prioriteiten en fasering van renovatie bespreekt." },
      { href: "/verbouwing/keuken-verbouwen", title: "Keuken verbouwen", description: "Voor een nieuwe keukenindeling en bijbehorende aansluitingen." },
      { href: "/badkamer", title: "Badkamer", description: "Een badkamerproject vraagt vaak meerdere vakdisciplines." },
      { href: "/isolatie", title: "Isolatie", description: "Neem isolatiemaatregelen mee in een renovatieplan." },
      { href: "/hoe-werkt-het", title: "Hoe VakConnect werkt", description: "Lees hoe projectomschrijving en regio bij de matching helpen." },
      { href: "/kosten", title: "Kosten en offertes", description: "Vergelijk scope, materialen, planning en coördinatie." },
    ],
    faqs: [
      { question: "Wat kost een verbouwing?", answer: "Kosten hangen af van omvang, constructie, materiaal, installaties, afwerking en coördinatie. Beschrijf eerst dezelfde scope voor alle partijen en laat een vakman de bestaande situatie beoordelen." },
      { question: "Heb ik een vergunning nodig?", answer: "Dat hangt af van de werkzaamheden, woning en lokale regels. Controleer de actuele eisen bij je gemeente en vraag zo nodig advies van een bouwkundige of andere deskundige voordat je start." },
      { question: "Welke vakmensen zijn nodig?", answer: "Dat verschilt per project. Een badkamer kan loodgieter, elektricien en tegelzetter vragen; bij een aanbouw kunnen ook ontwerp, constructie en afwerking betrokken zijn." },
      { question: "Hoe plan ik meerdere disciplines?", answer: "Breng afhankelijkheden en werkvolgorde vooraf in kaart en spreek af wie de planning coördineert. Leg verantwoordelijkheden, wijzigingen en oplevermomenten vast." },
      { question: "Hoe vergelijk ik verbouwingsoffertes?", answer: "Vergelijk dezelfde werkzaamheden, materialen, afwerking, uitsluitingen, planning en afspraken over meerwerk. Een laag totaalbedrag is lastig te beoordelen als scopes verschillen." },
    ],
    cta: { title: "Zet je verbouwplan om in een duidelijke aanvraag", description: "Beschrijf het gewenste resultaat, de betrokken ruimtes en wat al bekend is over planning en uitvoering.", label: "Beschrijf je verbouwing" },
  },
};

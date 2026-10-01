import type { ServiceContentPageData } from "./service-pages.ts";

type EditorialSubPage = {
  title: string;
  description: string;
  h1: string;
  lead: string;
  details: [string, string, string, string, string, string, string];
  faqs: [string, string][];
};

const editorialSubPages: Record<string, EditorialSubPage> = {
  "dakdekker/daklekkage": {
    title: "Daklekkage laten repareren? | VakConnect",
    description: "Vochtplek of water langs het dak? Lees hoe lekdetectie en herstel werken en beschrijf je daklekkage voor een passende dakdekker via VakConnect.",
    h1: "Daklekkage laten repareren?",
    lead: "Een nat plafond, druppels bij een dakraam of vocht langs de schoorsteen vragen om onderzoek van de lekbron. Beschrijf je dak en de schade; VakConnect helpt je aanvraag bij een passende dakdekker terecht te komen.",
    details: [
      "Een daklekkage is niet altijd zichtbaar op de plek waar water binnendringt. Water kan langs balken of isolatie naar een andere kamer lopen. Een dakdekker beoordeelt daarom niet alleen de vochtplek, maar ook het dakvlak, de aansluitingen en de afwatering.",
      "Groeit een vochtplek na regen, druppelt er water of ruikt de zolder muf? Leg vast wanneer de klacht optreedt en maak foto's van de plek binnen én van het dak als dat veilig kan. Bij actieve inwatering is snel laten beoordelen verstandig om schade aan hout en binnenafwerking te beperken.",
      "Bij een plat dak ontstaan problemen onder meer bij naden, opstanden, doorvoeren of stilstaand water; bij een hellend dak spelen beschadigde pannen, de nok of aansluitingen rond schoorsteen en dakkapel vaker mee. De zichtbare schade vertelt niet vanzelf welke laag defect is.",
      "Een tijdelijke afdekking kan verdere inwatering soms beperken, maar neemt de oorzaak niet weg. Definitief herstel begint met inspectie van het lektraject. Afhankelijk van de staat volgt plaatselijk herstel van bedekking of aansluitingen, of een voorstel voor groter dakonderhoud.",
      "Vraag welk detail de vakman als oorzaak ziet en welke omliggende delen hij controleert. Laat in de offerte onderscheid maken tussen inspectie, noodmaatregel, definitieve reparatie en herstel van binnenwerk; verborgen vochtschade kan de omvang na opening veranderen.",
      "Vermeld het soort dak, de geschatte leeftijd, eerdere reparaties, locatie van vochtplekken en of het alleen bij wind of langdurige regen gebeurt. Klim niet zelf op een nat of beschadigd dak. Een duidelijke beschrijving helpt de vakman het juiste onderzoek voor te bereiden.",
      "De prijs hangt af van de tijd om het lek op te sporen, bereikbaarheid en hoogte, dakmateriaal, benodigde reparatie en eventuele schade onder de bedekking. Een spoedbeoordeling of herstel van isolatie en binnenafwerking kan de offerte veranderen; vraag om een uitgesplitste scope."
    ],
    faqs: [
      ["Waarom zit de vochtplek niet onder het lek?", "Water kan via dakbeschot, isolatie of balken een andere route volgen. Daarom is controle van dak en aansluitingen nodig, niet alleen van het plafond."],
      ["Is een noodreparatie voldoende?", "Een noodmaatregel kan inwatering beperken, maar definitief herstel vraagt om vaststelling van de oorzaak en beoordeling van de omliggende dakdelen."],
      ["Wat als het dak niet overal beschadigd is?", "Bij een afgebakend defect kan lokaal herstel passen. Als meerdere details versleten zijn, bespreek dan of een bredere ingreep zinvoller is."],
      ["Wat moet ik bij de aanvraag vermelden?", "Noteer daktype, plek van de schade, moment van optreden, eerdere reparaties en voeg veilige foto's toe. Meld actieve waterinloop duidelijk."]
    ]
  },
  "dakdekker/dakrenovatie": {
    title: "Dak laten renoveren? | VakConnect",
    description: "Steeds opnieuw dakschade of verouderde bedekking? Vergelijk deelherstel en renovatie en beschrijf je dakproject op VakConnect.",
    h1: "Dak laten renoveren?",
    lead: "Terugkerende reparaties of slijtage op meerdere plekken kunnen wijzen op een dak dat meer nodig heeft dan een lokale ingreep. Beschrijf de huidige dakopbouw en je plannen om de renovatie goed te laten beoordelen.",
    details: [
      "Dakrenovatie kan bestaan uit vernieuwen van bedekking, panlatten, aansluitingen en beschadigde onderlagen. Welke onderdelen werkelijk nodig zijn, hangt af van de staat van het dak en wat pas zichtbaar wordt na inspectie of demontage.",
      "Bij meerdere lekkages, poreuze pannen of verouderde dakranden is blijven repareren niet altijd zinvol. Ook een geplande verbouwing kan een logisch moment zijn om het dak te beoordelen, zeker als isolatie of dakramen tegelijk worden aangepakt.",
      "Op een hellend dak bepalen onderdak, bevestiging en nok mede de scope; bij een plat dak spelen de opbouw, doorvoeren en afwatering een grote rol. Vocht in isolatie of beschadigd dakbeschot kan een voorstel ingrijpend veranderen.",
      "Een dakdekker kan deelrenovatie tegenover volledige vervanging zetten. Vraag welke bestaande lagen behouden kunnen blijven en of tegelijk isoleren technisch past bij de gekozen opbouw. Een nieuwe toplaag over een slechte ondergrond lost het onderliggende probleem niet op.",
      "Laat vastleggen welke dakvlakken, goten, aansluitingen en afvoerpunten onder de opdracht vallen. Vraag hoe onverwachte schade na openen wordt besproken en hoe het dak tijdens het werk tegen regen wordt beschermd.",
      "Verzamel foto's, eerdere offertes en informatie over de huidige bedekking. Geef aan of zonnepanelen, schoorstenen of dakkapellen de toegang beïnvloeden. Voor veranderingen aan dakvorm of uiterlijk kunnen lokale regels relevant zijn; laat dat vooraf controleren.",
      "Dakoppervlak, materiaal, bereikbaarheid, afvoer van oude lagen en de staat van onderconstructie bepalen de kosten. Combinatie met isolatie, dakramen of herstel van aansluitingen vraagt om aparte posten, zodat offertes inhoudelijk vergelijkbaar blijven."
    ],
    faqs: [
      ["Wanneer is renoveren logischer dan repareren?", "Als schade op meerdere plaatsen terugkomt of de dakopbouw breed versleten is, kan een renovatie duurzamer zijn. Laat de staat eerst beoordelen."],
      ["Kan dakisolatie worden meegenomen?", "Dat kan soms wanneer delen van het dak toch open gaan; de aanpak hangt af van de bestaande opbouw en vocht- en ventilatiehuishouding."],
      ["Worden panlatten altijd vervangen?", "Niet automatisch. De dakdekker beoordeelt hun staat en bevestiging in samenhang met de gekozen nieuwe bedekking."],
      ["Wat hoort in een renovatieofferte?", "Laat dakvlakken, afvoer van oud materiaal, onderlagen, aansluitingen, eventuele isolatie en afspraken bij verborgen schade benoemen."]
    ]
  },
  "dakdekker/dakpannen-vervangen": {
    title: "Dakpannen laten vervangen? | VakConnect",
    description: "Losse of kapotte dakpannen? Lees wanneer lokaal herstel volstaat en wanneer vervangen verstandiger is. Vraag gericht dakwerk aan via VakConnect.",
    h1: "Dakpannen laten vervangen?",
    lead: "Een gebroken pan kan plaatselijk worden vervangen, maar bij terugkerende schade verdienen ook panlatten, nok en aansluitingen aandacht. Beschrijf waar de pannen liggen en wat je ziet.",
    details: [
      "Dakpannen beschermen een hellend dak samen met de onderliggende lagen. Vervangen kan één pan betreffen of een heel dakvlak. Een beoordeling moet duidelijk maken of de beschadiging op zichzelf staat of wijst op slijtage van bevestiging of dakconstructie.",
      "Zie je verschoven pannen na wind, stukken pan in de goot of vocht onder het dak? Laat de situatie beoordelen, vooral als regen toegang krijgt tot onderdak of isolatie. Van de straat af is de omvang vaak niet betrouwbaar vast te stellen.",
      "Breuk kan ontstaan door storm, ouderdom, belasting of een onjuiste aansluiting. Pannen bij een dakkapel, dakraam of schoorsteen verdienen extra aandacht: lekkage daar kan komen van het aansluitdetail in plaats van de pan zelf.",
      "Bij enkele beschadigde pannen past mogelijk lokaal herstel. Zijn veel pannen versleten of passen vervangende exemplaren slecht bij de bestaande dekking, dan kan vervanging van een groter vlak logisch zijn. Panlatten en onderliggende lagen worden daarbij mee beoordeeld.",
      "Vraag of nieuwe pannen aansluiten bij hellingshoek en huidige constructie. Laat de vakman de nok, randen en doorvoeren meenemen in de beoordeling. Veilig toegangsmateriaal en afvoer van oud materiaal horen in een duidelijke werkafspraak.",
      "Noem het vermoedelijke type pan, het aantal zichtbare defecten en eventuele eerdere stormschade. Foto's vanaf de grond helpen; ga niet zelf het dak op. Bij een volledige vervanging kun je bespreekbaar maken of dakisolatie tegelijk zinvol is.",
      "Aantal dakvlakken, vorm en hoogte, beschikbaarheid van passende pannen, staat van panlatten en benodigde steiger bepalen de omvang. Aanpassingen bij nok en aansluitingen zijn vaak aparte onderdelen van de offerte."
    ],
    faqs: [
      ["Moet het hele dak worden vervangen bij één kapotte pan?", "Nee, als de rest van de dekking en onderlagen goed zijn, kan plaatselijk vervangen volstaan. Een inspectie helpt dat te bepalen."],
      ["Wat gebeurt er met versleten panlatten?", "Die kunnen bij grotere werkzaamheden worden beoordeeld en zo nodig vervangen; de staat is niet altijd van buitenaf zichtbaar."],
      ["Waarom blijft het lek na vervanging van een pan?", "Het water kan via een aansluiting, onderdak of nok binnenkomen. Laat ook die details onderzoeken als de klacht aanhoudt."],
      ["Welke informatie helpt bij een offerte?", "Vermeld daktype, zichtbare schade, bereikbaarheid, dakramen en of het om één plek of meerdere dakvlakken gaat."]
    ]
  },
  "dakdekker/plat-dak": {
    title: "Plat dak laten repareren of vernieuwen? | VakConnect",
    description: "Plat dak met lekkage of slijtage? Lees over bitumen, doorvoeren en afwatering en vind passende hulp via VakConnect.",
    h1: "Plat dak laten repareren of vernieuwen?",
    lead: "Bij een plat dak zijn naden, randen en afvoeren minstens zo belangrijk als de zichtbare dakbedekking. Deel wat je ziet en of er water blijft staan, zodat de juiste klus beoordeeld kan worden.",
    details: [
      "Een plat dak is een samenhang van dakbedekking, isolatie, ondergrond en afvoeren. Ook een bitumenlaag die er grotendeels goed uitziet kan zwakke plekken hebben bij dakranden of doorvoeren. Inspectie bepaalt of het om één detail of brede slijtage gaat.",
      "Water op het plafond, blazen in bitumen, losse naden of langdurig stilstaand water zijn redenen om beoordeling te vragen. Niet iedere plas betekent direct een lek; terugkerend water en beschadigde details verdienen wel aandacht.",
      "Scheuren, openstaande overlappen en een verstopte afvoer kunnen water een weg naar binnen geven. Bij een uitbouw of dakkapel zijn aansluitingen op de gevel en opstanden extra gevoelig; de feitelijke oorzaak kan verder liggen dan de vochtplek binnen.",
      "Een beperkt defect kan soms lokaal worden gerepareerd. Overlagen of vervangen vraagt eerst beoordeling van de bestaande laag, vocht in de opbouw en geschiktheid van de ondergrond. Nieuw materiaal op een natte of losliggende laag is geen vanzelfsprekende oplossing.",
      "Bespreek of randen, hemelwaterafvoer en doorvoeren expliciet in de offerte staan. Vraag wat er gebeurt als onder de oude laag vochtig isolatiemateriaal wordt gevonden en hoe de afwatering na het werk wordt gecontroleerd.",
      "Beschrijf materiaal als je dat weet, de plek van plassen, de leeftijd van eerder werk en het verloop van lekkage. Voeg foto's toe vanaf een veilige plek; op een nat dak lopen brengt risico's mee.",
      "Dakoppervlak, hoogte, aantal doorvoeren, ondergrond, keuze tussen lokaal herstel en vervanging en eventuele isolatieschade beïnvloeden de kosten. Ook bereikbaarheid en afvoer van oude bedekking horen bij een vergelijkbare offerte."
    ],
    faqs: [
      ["Kun je nieuwe bitumen over bestaande bedekking leggen?", "Soms, maar alleen na beoordeling van hechting, vocht en dakopbouw. Bij een slechte ondergrond kan verwijderen verstandiger zijn."],
      ["Is stilstaand water altijd een probleem?", "Niet iedere plas wijst op schade, maar blijvend water bij naden en afvoeren verdient inspectie van afschot en afwatering."],
      ["Welke details lekken vaak op platte daken?", "Naast de dakbaan zijn randen, dakdoorvoeren, opstanden en aansluitingen op gevels belangrijke controlepunten."],
      ["Wanneer kies je vervanging boven reparatie?", "Als meerdere plekken verouderd zijn of de opbouw vochtig is, kan een volledige aanpak logischer zijn dan telkens lokaal herstellen."]
    ]
  },
  "dakdekker/schoorsteen": {
    title: "Schoorsteen laten herstellen? | VakConnect",
    description: "Lekkage of scheuren aan de schoorsteen? Ontdek wat voegen, lood en bovenplaat betekenen voor herstel en vraag een vakman aan via VakConnect.",
    h1: "Schoorsteen laten herstellen?",
    lead: "Vocht rond een schoorsteen kan uit het metselwerk, de bovenplaat of de aansluiting op het dak komen. Een gerichte inspectie voorkomt dat alleen de zichtbare plek wordt aangepakt.",
    details: [
      "Herstel aan een schoorsteen draait om de combinatie van metselwerk, voegwerk, bovenplaat en waterkering bij het dak. Een lekkage naast de schoorsteen hoeft niet uit dezelfde kier te komen als waar binnen een vlek ontstaat.",
      "Uitspoelende voegen, scheuren, losse stenen en vocht langs de schacht vragen om controle. Ook als de schoorsteen niet meer wordt gebruikt, kan achterstallig onderhoud water naar de dakconstructie laten lopen.",
      "Verouderd lood of spouwlood kan bij de aansluiting water doorlaten. Een gebarsten bovenplaat of poreuze voegen kunnen eveneens een rol spelen. Impregneren is geen vervanging voor herstel van scheuren, los voegwerk of een fout aansluitdetail.",
      "Afhankelijk van de oorzaak kan voegwerk worden hersteld, lood worden vernieuwd of de bovenkant worden gerepareerd. Als de schoorsteen niet meer nodig is, bespreek dan apart of verwijderen haalbaar is en hoe dak en afvoer daarna worden afgesloten.",
      "Vraag welk onderdeel verantwoordelijk is voor vocht en welke aangrenzende pannen en dakdetails worden gecontroleerd. Bij verwijderen of veranderingen aan het uiterlijk kunnen constructieve en gemeentelijke randvoorwaarden gelden; laat die eerst toetsen.",
      "Beschrijf of de schoorsteen in gebruik is, waar vocht zichtbaar is en of er eerder lood of voegwerk is vervangen. Foto's vanaf de grond en de zolder zijn nuttiger dan een onveilige opname vanaf het dak.",
      "Hoogte en steigerwerk, staat van metselwerk, omvang van voeg- of loodwerk en afwerking na eventuele verwijdering bepalen de kosten. Laat inspectie en herstel van dakdetails als afzonderlijke onderdelen benoemen."
    ],
    faqs: [
      ["Helpt impregneren tegen iedere schoorsteenlekkage?", "Nee. Impregneren herstelt geen scheuren, defect voegwerk of een lekkende loodaansluiting. Eerst moet de oorzaak duidelijk zijn."],
      ["Kan een ongebruikte schoorsteen weg?", "Dat kan soms, maar de constructie, vergunningcontext en afwerking van het dak moeten vooraf worden beoordeeld."],
      ["Waarom is lood rond de schoorsteen belangrijk?", "De waterkering bij de aansluiting moet regen van de dakopbouw weghouden. Bij beschadiging kan water achter de bedekking komen."],
      ["Wat hoort in de offerte voor schoorsteenherstel?", "Vraag om een omschrijving van metselwerk, voegen, lood, bovenplaat, toegang en eventueel herstel van aangrenzende dakbedekking."]
    ]
  },
  "dakdekker/nokvorsten": {
    title: "Nokvorsten laten herstellen? | VakConnect",
    description: "Losse of gescheurde nokvorsten? Lees waarom de bevestiging en aansluiting tellen en beschrijf je dakklus op VakConnect.",
    h1: "Nokvorsten laten herstellen?",
    lead: "Een losse nokvorst kan bij wind gevaarlijk worden en water onder de nok doorlaten. Laat naast de zichtbare schade ook de bevestiging van de overige nok beoordelen.",
    details: [
      "Nokvorsten sluiten de bovenste lijn van een hellend dak af. Herstel betekent meer dan één losse vorst terugleggen: de bevestiging en de aansluiting op de pannen bepalen of de nok daarna goed blijft functioneren.",
      "Zie je een verschoven nokpan, brokken mortel in de goot of licht bij de nok vanaf de zolder? Meld dit bij je aanvraag. Een los onderdeel op hoogte kan risico geven voor mensen onder het dak.",
      "Verouderde mortel, slijtage aan bevestigingen of beweging in de dakconstructie kunnen tot losse delen leiden. Soms zijn ook de aangrenzende pannen beschadigd. De dakdekker beoordeelt de hele nok voordat de omvang van herstel wordt gekozen.",
      "Bij beperkte schade kan gericht herstel passen. Als meerdere vorsten instabiel zijn, kan een bredere vernieuwing van de nok nodig zijn. Bespreek welke bevestigingswijze past bij de bestaande dakopbouw.",
      "Laat vastleggen of de hele nok wordt geïnspecteerd en welke delen worden vervangen. Vraag hoe aangrenzende pannen en de waterkering onder de nok worden beoordeeld, niet alleen hoe de bovenkant eruit zal zien.",
      "Vermeld of de schade na storm ontstond en of er eerdere reparaties aan de nok zijn gedaan. Foto's vanaf de grond zijn voldoende voor een eerste indruk; laat werken op het dak aan een professional over.",
      "Lengte van de nok, aantal losse delen, staat van bevestiging en pannen en toegang met steiger of hoogwerker beïnvloeden de offerte. Laat materiaal en veiligheidsvoorzieningen expliciet opnemen."
    ],
    faqs: [
      ["Kan één losse nokvorst apart worden hersteld?", "Dat kan wanneer de rest van de nok stabiel is. Controle van aangrenzende vorsten voorkomt dat een breder probleem wordt gemist."],
      ["Waarom liggen er stukken mortel in de goot?", "Dat kan wijzen op verouderde bevestiging van nokvorsten; een dakdekker kan vaststellen of vorsten daardoor losraken."],
      ["Is een losse nokvorst gevaarlijk?", "Een los deel kan bij wind vallen en water doorlaten. Laat de situatie beoordelen en blijf uit de buurt van mogelijk vallende delen."],
      ["Welke details zijn belangrijk in de offerte?", "Vraag om de noklengte, aantal te vervangen delen, bevestiging, controle van aangrenzende pannen en de benodigde toegang."]
    ]
  },
  "dakdekker/dakgoot": {
    title: "Dakgoot laten repareren of vervangen? | VakConnect",
    description: "Lekkende of overlopende dakgoot? Lees over naden, afschot en afvoer en vraag gericht dakgootwerk aan via VakConnect.",
    h1: "Dakgoot laten repareren of vervangen?",
    lead: "Water dat langs de gevel loopt of uit een goot lekt kan ook voegwerk en hout aantasten. Beschrijf waar de goot overloopt en of de afvoer nog werkt.",
    details: [
      "Een dakgoot vangt regenwater op en voert het af naar een regenpijp. Herstel kan gaan om een naad, beugel of uitloop, maar soms is een groter stuk van de goot versleten of hangt het zonder goed afschot.",
      "Waterstrepen op de gevel, een doorhangende goot of lekkage bij een verbinding zijn aanleiding om te laten kijken. Bij regen is het verschil tussen een verstopte uitloop en een lek in de goot vaak beter te zien.",
      "Bladeren en vuil kunnen de afvoer blokkeren, terwijl open naden of beschadigd materiaal voor plaatselijke lekkage zorgen. Als de goot achterover helt, kan water richting dakrand lopen; reinigen alleen verhelpt die oorzaak niet.",
      "Reiniging, lokale reparatie en gedeeltelijke of volledige vervanging zijn verschillende opdrachten. Een vakman beoordeelt materiaal, beugels, uitlopen en regenpijpen samen voordat hij een oplossing adviseert.",
      "Vraag waar het water uiteindelijk naartoe gaat en of de regenpijp en aansluiting gecontroleerd worden. Spreek bij vervanging materiaal, lengte, afschot en wijze van bevestigen duidelijk af; een mooie goot zonder vrije afvoer blijft problemen geven.",
      "Geef aan aan welke kant van het huis de goot zit, op welke hoogte, waar het water verschijnt en of er bomen dichtbij staan. Een korte beschrijving van de klacht tijdens regen helpt bij de diagnose.",
      "Lengte, materiaal, aantal hoeken en uitlopen, staat van beugels en bereikbaarheid bepalen de kosten. Afvoerherstel en eventuele schade aan boeiboord of dakrand kunnen aparte posten zijn."
    ],
    faqs: [
      ["Is een overlopende goot altijd lek?", "Nee, ook een verstopte uitloop, verkeerd afschot of onvoldoende afvoer kan water over de rand laten lopen."],
      ["Wanneer is vervanging verstandiger?", "Als naden of gootdelen op veel plekken versleten zijn, kan vervanging zinvoller zijn dan telkens repareren."],
      ["Moet de regenpijp ook worden gecontroleerd?", "Ja, een blokkade of lekkage verderop kan dezelfde klachten veroorzaken als een defecte dakgoot."],
      ["Welke gegevens helpen bij de aanvraag?", "Vermeld hoogte, lengte bij benadering, materiaal als bekend en het punt waar water tijdens regen naar buiten komt."]
    ]
  },
  "dakdekker/dakkapel": {
    title: "Dakkapel laten herstellen? | VakConnect",
    description: "Lekkage of slijtage bij een dakkapel? Lees over dakbedekking, kozijn en aansluitingen en vind een passende vakman via VakConnect.",
    h1: "Dakkapel laten herstellen?",
    lead: "Vocht rond een dakkapel kan via het platte dak, de aansluiting op het hellende dak of het kozijn binnenkomen. Omschrijf waar en wanneer je het probleem ziet.",
    details: [
      "Bij herstel van een dakkapel zijn dakvlak, zijwangen, kozijn en aansluiting op het hoofddak betrokken. De klus kan beperkt zijn tot een afdichting, maar ook onderhoud aan meerdere materialen nodig maken.",
      "Natte plekken langs het plafond, bladderende afwerking bij het raam of tocht zijn signalen om te onderzoeken. Water rond een dakkapel kan op verschillende hoogtes binnendringen en pas later binnen zichtbaar worden.",
      "Versleten dakbedekking, beschadigde loodslabben, ondeugdelijke kitnaden of houtrot zijn mogelijke oorzaken. Soms ligt het probleem bij de afvoer van het kleine platte dak, niet bij de pannen ernaast.",
      "Een vakman zoekt het traject van waterinloop en bepaalt of plaatselijk herstel voldoende is. Bij ouder houtwerk of een versleten dakvlak kan een gecombineerde ingreep verstandiger zijn dan alleen een naad afdichten.",
      "Vraag welke onderdelen van dakkapel en hoofddak worden bekeken. Laat in de offerte onderscheid maken tussen dakreparatie, kozijnherstel en binnenafwerking. Controle van vocht achter bekleding kan de uiteindelijke scope beïnvloeden.",
      "Vermeld op welke zijde de dakkapel zit, of de klacht samenhangt met windrichting en welke delen zichtbaar beschadigd zijn. Foto's van binnen en buiten vanaf een veilige plek helpen het onderzoek richten.",
      "Hoogte en toegankelijkheid, soort bedekking, staat van kozijn en zijwangen en eventueel herstel onder de zichtbare afwerking bepalen de kosten. Vraag welke aansluitdetails in het voorstel zijn inbegrepen."
    ],
    faqs: [
      ["Is een lekkende dakkapel altijd een dakprobleem?", "Nee, water kan ook langs raam, zijwang of aansluiting op de pannen binnenkomen. Inspectie van alle details is nodig."],
      ["Helpt opnieuw kitten altijd?", "Niet als de ondergrond of het dakdetail is beschadigd. Laat eerst vaststellen waar water binnenkomt."],
      ["Kunnen houtrot en daklekkage tegelijk worden aangepakt?", "Dat kan wanneer de betrokken vakman of meerdere disciplines beide onderdelen beoordelen; vermeld beide klachten in de aanvraag."],
      ["Welke foto's zijn handig?", "Maak veilige foto's van vocht binnen, de buitenkant en de overgang naar het hoofddak zonder zelf het dak op te gaan."]
    ]
  },
  "dakdekker/dakinspectie": {
    title: "Dakinspectie aanvragen? | VakConnect",
    description: "Twijfel over de staat van je dak? Lees wat een inspectie kan opleveren en vraag een passende dakdekker aan via VakConnect.",
    h1: "Dakinspectie aanvragen?",
    lead: "Bij terugkerende vochtplekken, na stormschade of voor een renovatie helpt een gerichte inspectie om te bepalen welke delen aandacht vragen. Beschrijf de aanleiding en het daktype.",
    details: [
      "Een dakinspectie brengt de zichtbare staat van bedekking, randen, aansluitingen en afwatering in kaart. Het is een beoordeling van wat toegankelijk en waarneembaar is; verborgen lagen kunnen aanvullend onderzoek vragen.",
      "Laat het dak bekijken bij onverklaarde vochtplekken, zichtbare slijtage, stormschade of vóór een grotere verbouwing. Ook zonder actief lek kan inspectie helpen om onderhoud te onderscheiden van volledige renovatie.",
      "Bij hellende daken verdienen pannen, nok en doorvoeren aandacht. Platte daken vragen beoordeling van naden, opstanden en hemelwaterafvoer. Vocht onder de bedekking is niet altijd van bovenaf zichtbaar.",
      "Bespreek vooraf of je alleen een conditiebeoordeling wilt of ook een advies voor reparatie. Een inspectie kan urgente gebreken aanwijzen, maar voor een definitieve offerte kan alsnog openen of meten nodig zijn.",
      "Vraag om een heldere terugkoppeling met bevindingen per dakdeel en onderscheid tussen direct herstel en planbaar onderhoud. Controleer of de inspectie ook schoorsteen, dakkapel en goten omvat als die relevant zijn.",
      "Vermeld daktype, bereikbaarheid, eerdere lekkages en de reden voor inspectie. Bij een woningkoop is het verstandig expliciet te benoemen welke onderdelen je vooraf beoordeeld wilt hebben.",
      "Dakoppervlak, helling, hoogte, aantal details en benodigde toegang beïnvloeden de inspectiekosten. Extra onderzoek onder de bedekking of een afzonderlijk hersteladvies kan de omvang veranderen."
    ],
    faqs: [
      ["Is een inspectie ook zinvol zonder lekkage?", "Ja, zichtbare slijtage of plannen voor renovatie kunnen aanleiding zijn om onderhoud en vervanging beter te kunnen afwegen."],
      ["Kan een inspecteur verborgen schade zien?", "Niet altijd. Afgedekte lagen en isolatie kunnen nader onderzoek vereisen; vraag welke beperkingen voor de beoordeling gelden."],
      ["Krijg ik meteen een reparatievoorstel?", "Dat hangt af van de opdracht en bevindingen. Spreek af of je een schriftelijk overzicht en een aparte herstelofferte verwacht."],
      ["Welke delen laat ik bekijken?", "Noem dakvlakken, goten, schoorsteen, dakkapel, dakramen en plekken met eerdere klachten die voor jou relevant zijn."]
    ]
  },
  "schilder/binnenschilderwerk": {
    title: "Binnenschilderwerk laten doen? | VakConnect",
    description: "Muren, plafonds of houtwerk binnen schilderen? Lees over ondergrond, voorbereiding en afwerking en plaats je schilderklus via VakConnect.",
    h1: "Binnenschilderwerk laten doen?",
    lead: "Een frisse kleur begint bij een geschikte ondergrond. Geef aan welke kamers, muren, plafonds of houten delen je wilt laten schilderen en welke afwerking je verwacht.",
    details: [
      "Binnenschilderwerk omvat verschillende oppervlakken: een muur vraagt een andere voorbereiding dan een deur of kozijn. De schilder bekijkt bestaande lagen, beschadigingen en het gewenste eindbeeld voordat de hoeveelheid werk duidelijk is.",
      "Vlekken, scheuren of oude verf die loslaat zijn aanleiding voor herstel vóór het schilderen. Ook bij een nieuwe kleur over een donkere ondergrond kan extra voorbereiding nodig zijn; beschrijf de huidige situatie in je aanvraag.",
      "Zuiging en structuur van stucwerk beïnvloeden het resultaat van muren en plafonds. Houtwerk heeft te maken met oude laklagen, naden en slijtage bij intensief gebruik. Vochtplekken vragen eerst onderzoek van de oorzaak, niet alleen een nieuwe verflaag.",
      "Een vakman bespreekt reinigen, repareren, gronden en de gewenste afwerking. Voor kleurkeuze helpen proefvlakken bij verschillende lichtinval. Als meerdere ruimtes betrokken zijn, kan de volgorde van werken de overlast thuis beperken.",
      "Vraag welke voorbereiding en hoeveel afwerklagen in de offerte zijn opgenomen. Spreek af of plinten, radiatoren, deuren en kozijnen tot de opdracht behoren en wie meubels verplaatst of oppervlakken afdekt.",
      "Noteer het aantal ruimtes, afmetingen bij benadering en foto's van beschadigingen. Geef aan of wanden recent zijn gestuct of eerder zijn behandeld; dit kan van invloed zijn op planning en materiaalkeuze.",
      "Oppervlak, staat van de ondergrond, aantal kleuren, herstelwerk en detaillering van houtwerk sturen de kosten. Een offerte met aparte posten voor muren, plafonds en houtwerk maakt vergelijken eenvoudiger."
    ],
    faqs: [
      ["Moeten nieuw gestucte muren meteen geschilderd worden?", "De ondergrond moet geschikt en voldoende droog zijn; laat de schilder beoordelen wanneer voorbereiding en schilderen verantwoord zijn."],
      ["Waarom zijn vlekken na schilderwerk soms nog zichtbaar?", "Een vocht- of roetvlek vraagt mogelijk eerst brononderzoek en specifieke voorbereiding; een gewone afwerklaag kan onvoldoende zijn."],
      ["Kan ik muren en deuren in één aanvraag opnemen?", "Ja. Geef per oppervlak aan wat je wilt laten doen, zodat de vakman planning en materialen afzonderlijk kan inschatten."],
      ["Wat maakt een schilderofferte vergelijkbaar?", "Een duidelijke omschrijving van ondergrondherstel, afdekwerk, aantal lagen, te schilderen onderdelen en gekozen afwerking."]
    ]
  },
  "schilder/buitenschilderwerk": {
    title: "Buitenschilderwerk laten uitvoeren? | VakConnect",
    description: "Bladderende verf of onderhoud aan de gevel? Lees over vocht, voorbereiding en bereikbaarheid en vraag buitenschilderwerk aan via VakConnect.",
    h1: "Buitenschilderwerk laten uitvoeren?",
    lead: "Schilferende verf, kale plekken of zachte houtdelen vragen om meer dan een snelle nieuwe laag. Beschrijf welke geveldelen onderhoud nodig hebben en hoe ze bereikbaar zijn.",
    details: [
      "Buitenschilderwerk beschermt hout en andere geschikte ondergronden tegen weer en slijtage. De benodigde voorbereiding verschilt per gevelzijde, materiaal en conditie van de bestaande verflaag.",
      "Bladderen, barsten, verkleuring of openstaande naden zijn signalen om onderhoud te plannen. Een vaste schildercyclus geldt niet voor elke woning: zon, regen, ligging en eerdere uitvoering beïnvloeden de staat.",
      "Vocht achter verf kan hechting verstoren. Bij houtwerk moet mogelijke houtrot eerst worden beoordeeld; opnieuw schilderen over aangetast hout verbergt het probleem maar herstelt het niet.",
      "De schilder kan plaatselijk herstellen, oude lagen verwijderen waar ze slecht hechten en daarna opbouwen met een passend verfsysteem. Droogte en temperatuur bepalen wanneer buitenwerk verantwoord kan plaatsvinden; planning blijft daarom afhankelijk van het weer.",
      "Vraag of kozijnen, deuren, boeidelen en gevelonderdelen apart zijn opgenomen. Let op afspraken over houtreparaties die pas na voorbereiding zichtbaar worden en over veilig werken op hoogte.",
      "Maak foto's van schade per gevelzijde en vermeld eerdere onderhoudsbeurten als je die kent. Geef door welke delen achter een aanbouw liggen of alleen met steiger bereikbaar zijn.",
      "De kosten hangen af van aantal en soort oppervlakken, benodigde voorbereiding, staat van het hout, bereikbaarheid en eventuele steiger. Laat materiaal en herstelposten benoemen zonder op één universele onderhoudstermijn te rekenen."
    ],
    faqs: [
      ["Kun je buiten schilderen als het nat is?", "De ondergrond en weersomstandigheden moeten geschikt zijn voor voorbereiding en afwerking; de schilder stemt de planning daarop af."],
      ["Moet bladderende verf helemaal worden verwijderd?", "Slecht hechtende lagen vragen behandeling; hoe ver dat moet gaan hangt af van de staat van het oppervlak."],
      ["Hoe vaak is onderhoud nodig?", "Dat verschilt per ondergrond, ligging en eerder werk. Inspecteer regelmatig op open naden, slijtage en houtschade in plaats van een vaste termijn aan te houden."],
      ["Kan houtrot worden meegerekend?", "Vraag om een beoordeling en maak afspraken over meerwerk als aangetast hout pas tijdens het schuren zichtbaar wordt."]
    ]
  },
  "schilder/kozijnen-schilderen": {
    title: "Kozijnen laten schilderen? | VakConnect",
    description: "Kozijnen met slijtende lak of kale plekken? Lees wanneer herstel en schilderwerk passen en beschrijf je klus via VakConnect.",
    h1: "Kozijnen laten schilderen?",
    lead: "Een kozijn met open naden of afbladderende verf heeft eerst aandacht voor de ondergrond nodig. Geef aan of het om binnen-, buiten- of beide zijden gaat.",
    details: [
      "Kozijnen schilderen vraagt zorgvuldig werk rond glas, beslag en bewegende delen. Een duurzame afwerking hangt af van de toestand van het hout of andere overschilderbare ondergrond, niet alleen van de gekozen kleur.",
      "Kale plekken, scheuren bij glaslatten of stroef sluitende ramen zijn signalen om het kozijn te laten bekijken. Bij zacht hout of terugkerende vochtplekken moet eerst duidelijk worden of plaatselijk herstel nog volstaat.",
      "Water kan via open verbindingen of beschadigde kit en beglazing bij het hout komen. Vervuilde of slecht hechtende oude lagen kunnen de nieuwe verf verstoren; inspectie van liggende delen en onderdorpels is daarom belangrijk.",
      "De schilder bespreekt reinigen, herstel van kleine gebreken, voorbereiding en afwerking. Bij diepere houtrot kan een gespecialiseerd herstel of kozijnvervanging nodig zijn; schilderen alleen is dan geen oplossing.",
      "Vraag of glaslatten, sponningen en binnenzijden zijn inbegrepen. Laat vastleggen wie houtschade en kitwerk uitvoert en hoe ramen tijdens de werkzaamheden bruikbaar blijven.",
      "Geef aantallen, materiaal, verdieping en foto's van onderdorpels door. Meld bestaande tocht, vocht of eerdere houtrot zodat het werk niet te smal wordt ingeschat.",
      "Aantal ramen, detaillering, staat van lak en hout, bereikbaarheid en eventueel herstel of steigerwerk bepalen de prijs. Splits binnen- en buitenwerk in de offerte als de aanpak verschilt."
    ],
    faqs: [
      ["Kan een kozijn met houtrot nog geschilderd worden?", "Eerst moet de schade worden beoordeeld en waar mogelijk hersteld; een verflaag over zacht hout houdt het probleem niet tegen."],
      ["Moeten glaslatten worden meegenomen?", "Bespreek dat expliciet: naden langs beglazing kunnen belangrijk zijn voor bescherming tegen vocht."],
      ["Is kozijnen schilderen hetzelfde als vervangen?", "Nee. Schilderwerk onderhoudt een geschikt kozijn; bij ernstige schade of andere wensen voor glas en profiel kan vervanging beter passen."],
      ["Welke foto's zijn bruikbaar?", "Maak opnamen van de volledige kozijnen en detailfoto's van onderdorpels, naden, loslatende verf en eventuele zachte plekken."]
    ]
  },
  "schilder/deuren-schilderen": {
    title: "Deuren laten schilderen? | VakConnect",
    description: "Binnen- of buitendeuren opnieuw laten schilderen? Lees over gebruikssporen, ondergrond en afwerking en vraag een schilder aan via VakConnect.",
    h1: "Deuren laten schilderen?",
    lead: "Stootschade op een binnendeur vraagt een andere aanpak dan een buitendeur met openstaande naden. Geef aan om welke deuren en zijden het gaat.",
    details: [
      "Bij deuren schilderen tellen vlakheid, randen en het gebruik van scharnieren en sloten mee. De schilder beoordeelt eerst het materiaal en de oude afwerking voordat een geschikt resultaat kan worden afgesproken.",
      "Krassen, afgebladderde lak of kleurverschil kunnen een reden zijn om opnieuw te schilderen. Bij een buitendeur verdienen ook vochtsporen langs onderkant en glasopeningen aandacht.",
      "Een oude laklaag kan slecht hechten of beschadigd zijn bij het beslag. Vocht dat via naden in hout dringt, vraagt herstel van de oorzaak voordat er nieuwe verf overheen gaat.",
      "Voorbereiding kan reinigen, repareren, schuren en gronden omvatten. Spreek af of de deur op zijn plaats wordt afgewerkt of tijdelijk uit de scharnieren gaat, en wat dat betekent voor de toegang tot de woning.",
      "Vraag of kozijn, deurpost, glaslatten en beide zijden meedoen. Een buitendeur moet na het schilderen nog goed sluiten; laat afspraken over beslag, tochtstrippen en droogtijd vooraf toelichten.",
      "Meld aantal deuren, type ondergrond, binnendeuren of buitendeuren en zichtbare beschadigingen. Foto's van randen en bestaande lak helpen bij de inschatting.",
      "Aantal deuren, profielwerk, herstel, aantal te behandelen zijden en bereikbaarheid sturen de kosten. Aparte posten voor kozijnen of houtreparatie voorkomen onduidelijkheid."
    ],
    faqs: [
      ["Moet een deur uit de scharnieren?", "Niet altijd. Dat hangt af van het gewenste bereik van de afwerking, de ruimte en de gekozen aanpak."],
      ["Kan een voordeur tijdens het werk gebruikt worden?", "Bespreek met de schilder hoe toegang en droging worden georganiseerd; sommige werkzaamheden beperken tijdelijk het gebruik."],
      ["Zijn kozijnen automatisch inbegrepen?", "Nee. Vermeld deurblad, kozijn en glaslatten afzonderlijk in je aanvraag en laat ze benoemen in de offerte."],
      ["Wat als de lak steeds opnieuw loslaat?", "Laat de ondergrond, oude verflagen en eventuele vochtproblemen onderzoeken voordat weer een laag wordt aangebracht."]
    ]
  },
  "schilder/plafond-schilderen": {
    title: "Plafond laten schilderen? | VakConnect",
    description: "Vlekken, scheuren of verkleuring op het plafond? Lees over voorbereiding en egale afwerking en vraag schilderwerk aan via VakConnect.",
    h1: "Plafond laten schilderen?",
    lead: "Een plafond dat strepen of vochtvlekken laat zien vraagt eerst aandacht voor lichtinval en ondergrond. Vermeld het oppervlak en eventuele eerdere lekkage.",
    details: [
      "Plafond schilderen draait om een egale afwerking op een groot vlak dat in strijklicht snel verschillen laat zien. Voorbereiding van scheuren, naden en oude lagen is net zo belangrijk als het schilderen zelf.",
      "Een verkleurd plafond, zichtbare rolbanen of gerepareerde plekken zijn redenen voor een nieuwe afwerking. Vochtplekken moeten eerst droog zijn en de oorzaak van het vocht moet zijn opgelost.",
      "Verschil in zuiging na stucwerk of reparaties kan zichtbaar blijven. Ook roet, nicotine of eerder aangebrachte verf kunnen de ondergrond beïnvloeden; beschrijf wat je weet van oude afwerking.",
      "Een schilder kan de ondergrond egaal maken, geschikte voorbereiding kiezen en het werk plannen met zo min mogelijk onderbrekingen. Bij veel scheuren kan stuc- of herstelwerk nodig zijn vóór het schilderen.",
      "Vraag of naden, plafondlijsten en afplakken van muren zijn inbegrepen. Bij een hoog plafond of trapgat zijn hulpmiddelen nodig; laat dat meenemen in de beoordeling.",
      "Geef afmetingen, plafondhoogte, type ruimte en duidelijke foto's bij daglicht door. Vermeld actieve vochtproblemen, want alleen overschilderen voorkomt terugkeer niet.",
      "Oppervlak, hoogte, herstel van naden of scheuren, vlekbehandeling en bescherming van meubels bepalen de kosten. Maak onderscheid tussen schilderwerk en eventueel stucwerk."
    ],
    faqs: [
      ["Kun je een vochtvlek meteen overschilderen?", "Eerst moet de oorzaak van vocht zijn verholpen en de ondergrond geschikt zijn; anders kan de vlek terugkomen."],
      ["Waarom ontstaan strepen op een plafond?", "Lichtinval, ondergrond en de wijze van aanbrengen spelen mee. Een vakman beoordeelt of voorbereiding of een nieuwe afwerklaag nodig is."],
      ["Kan ik een plafond combineren met muren?", "Ja, vermeld de beide oppervlakken en afwerking apart zodat de planning en offerte duidelijk blijven."],
      ["Is stucwerk bij scheuren inbegrepen?", "Niet vanzelf. Vraag om een aparte beoordeling van de scheuren en zet herstel expliciet in de omschrijving."]
    ]
  },
  "loodgieter/lekkage": {
    title: "Lekkage door loodgieter laten herstellen? | VakConnect",
    description: "Waterverlies of vochtplek bij leidingen? Lees hoe brononderzoek, reparatie en gevolgschade samenhangen en vraag hulp aan via VakConnect.",
    h1: "Lekkage door een loodgieter laten herstellen?",
    lead: "Een druppelende koppeling is zichtbaarder dan een leiding achter de muur. Vertel waar het vocht verschijnt, of de waterdruk verandert en wanneer de schade begon.",
    details: [
      "Een loodgieter onderzoekt of water uit een toevoerleiding, afvoer of sanitairaansluiting komt. De bron kan een andere plek hebben dan de natte vloer of wand; de diagnose bepaalt welk onderdeel moet worden geopend of vervangen.",
      "Een vochtplek die groter wordt, een natte kast of een onverwacht drukverlies zijn redenen voor onderzoek. Bij actieve waterinloop is snelle beoordeling verstandig om schade aan vloer, muur en elektra te beperken.",
      "Versleten koppelingen, beschadigde leidingen en lekkende afvoeraansluitingen geven verschillende klachten. Een afvoer kan vooral lekken tijdens gebruik; een toevoerleiding kan ook zonder open kraan water verliezen.",
      "Een tijdelijke maatregel om verdere schade te beperken staat los van definitieve reparatie. De vakman onderzoekt de bron en bespreekt of een klein onderdeel kan worden vervangen of een langer leidingdeel aandacht vraagt.",
      "Vraag welke test of inspectie nodig is en of openbreken van tegelwerk of vloer tot de offerte behoort. Laat afspraken over dichtmaken en herstellen van afwerking vastleggen; lekherstel en binnenherstel zijn niet altijd dezelfde opdracht.",
      "Vermeld waar water zichtbaar is, of het probleem bij gebruik van douche of kraan optreedt, eerdere reparaties en eventuele veranderingen in druk. Voeg foto's toe en meld als water in de buurt van elektra komt.",
      "Tijd voor opsporing, bereikbaarheid van leidingen, benodigd materiaal en herstel van opengebroken afwerking sturen de kosten. Bij urgente werkzaamheden kan planning een extra factor zijn; vraag welke werkzaamheden precies worden aangeboden."
    ],
    faqs: [
      ["Hoe weet ik of het om een leiding of afvoer gaat?", "Een afvoer lekt vaak bij gebruik; een toevoer kan voortdurend water verliezen. Alleen onderzoek kan de bron betrouwbaar bevestigen."],
      ["Moet de hele vloer open?", "Niet altijd. De omvang van eventueel openbreken hangt af van waar de bron zit en hoe de leiding toegankelijk is."],
      ["Wat als het vocht bij een stopcontact zit?", "Vermijd contact met natte elektra en laat de situatie veilig beoordelen; vermeld dit duidelijk bij je aanvraag."],
      ["Is binnenherstel onderdeel van lekreparatie?", "Niet vanzelf. Vraag wie tegels, stucwerk of vloeren terugplaatst en laat dit apart op de offerte zetten."]
    ]
  },
  "loodgieter/verstopping": {
    title: "Verstopping laten verhelpen? | VakConnect",
    description: "Gootsteen, douche of toilet loopt niet door? Lees wanneer een loodgieter nodig is en beschrijf je verstopping op VakConnect.",
    h1: "Verstopping laten verhelpen?",
    lead: "Als water terugkomt of meerdere afvoeren tegelijk borrelen, is het belangrijk te weten waar het probleem zit. Geef aan welke aansluitingen getroffen zijn en of de klacht terugkeert.",
    details: [
      "Ontstoppen gaat om het vinden en verwijderen van een blokkade in een afvoertraject. Een gootsteen, douche of toilet kan plaatselijk verstopt zijn; bij meerdere aansluitingen kan de oorzaak verderop in de hoofdafvoer zitten.",
      "Langzaam weglopend water, borrelgeluiden en terugslag verdienen aandacht. Als het toilet of meerdere afvoeren tegelijk onbruikbaar worden, leg dan duidelijk uit welke ruimtes getroffen zijn en sinds wanneer.",
      "Vet en etensresten in de keuken, haar en zeep in de douche of een voorwerp in het toilet zijn mogelijke oorzaken. Terugkerende verstopping kan ook wijzen op de leidingloop, vervorming of verzakking.",
      "Een vakman bepaalt eerst welk traject verstopt is en of reinigen voldoende is. Bij herhaaldelijke blokkades kan aanvullend onderzoek van de afvoer nodig zijn; alleen telkens dezelfde opening vrijmaken lost een structurele oorzaak niet op.",
      "Vraag wat inbegrepen is bij het ontstoppen en wanneer aanvullend onderzoek of reparatie apart wordt aangeboden. Gebruik geen agressieve chemische middelen als vervanging voor een veilige diagnose en vermeld eerder gebruikte middelen bij de aanvraag.",
      "Noteer welke afvoeren wel en niet werken, of het water terugkomt en wat al aan het leidingtraject is veranderd. Beschrijf eventuele geurhinder of terugslag zodat een specialist de situatie kan inschatten.",
      "De prijs hangt af van bereikbaarheid van de leiding, plek en aard van de blokkade, benodigd onderzoek en eventueel herstel van leidingdelen. Vraag vooraf hoe extra werk bij een structureel defect wordt afgestemd."
    ],
    faqs: [
      ["Wat als zowel douche als toilet niet doorloopt?", "Dan kan de blokkade verderop zitten dan één aansluiting. Geef aan welke afvoeren getroffen zijn zodat de diagnose daarop wordt afgestemd."],
      ["Waarom komt een verstopping terug?", "Achterblijvend vuil of een probleem in de leidingloop kan nieuwe ophoping veroorzaken. Bij herhaling is onderzoek van het traject zinvol."],
      ["Kan ik chemische ontstopper gebruiken?", "Agressieve middelen kunnen risico's geven en verhelpen een structurele oorzaak niet. Laat bij aanhoudende klachten een specialist beoordelen wat nodig is."],
      ["Wanneer hoort een afvoerreparatie bij de klus?", "Als een beschadigd of verkeerd aangelegd leidingdeel de oorzaak is, bespreek dan een afzonderlijk herstelvoorstel naast het ontstoppen."]
    ]
  },
  "loodgieter/leidingwerk": {
    title: "Leidingwerk laten aanleggen of verleggen? | VakConnect",
    description: "Waterleidingen of afvoeren verleggen? Lees over tracé, bereikbaarheid en afstemming met de afwerking en plaats je klus via VakConnect.",
    h1: "Leidingwerk laten aanleggen of verleggen?",
    lead: "Een nieuwe keukenindeling of extra wastafel begint bij de beschikbare toevoer en afvoer. Beschrijf de huidige aansluitingen en de gewenste positie.",
    details: [
      "Leidingwerk omvat het aanleggen, vervangen of verplaatsen van waterleidingen en afvoeren. De gekozen route hangt af van bestaande aansluitingen, vloer- en wandopbouw en de apparaten die erop worden aangesloten.",
      "Bij een keukenverbouwing, badkamerwijziging of verouderde leiding kan nieuw werk nodig zijn. Maak onderscheid tussen een extra tappunt, een complete verlegging en herstel van een lekkend deel.",
      "Een afvoer heeft andere randvoorwaarden dan een toevoerleiding. Onvoldoende ruimte, moeilijke bereikbaarheid of oude materiaalovergangen kunnen de aanleg ingewikkelder maken dan op een plattegrond lijkt.",
      "Een loodgieter bespreekt tracé, materiaal en aansluiting op de bestaande installatie. Als wanden of vloeren open moeten, stem dan sloop en afwerking af met andere betrokken vakmensen voordat de volgorde vastligt.",
      "Vraag hoe bereikbare aansluitpunten worden gecontroleerd en welke delen na aanleg zichtbaar blijven. Zet duidelijk in de offerte wie sleuven herstelt, tegels terugplaatst en apparatuur aansluit.",
      "Maak een eenvoudige schets van de oude en gewenste indeling. Geef door welke apparaten en sanitairpunten water en afvoer nodig hebben, en wanneer de ruimte beschikbaar is voor de aanleg.",
      "Aantal aansluitpunten, lengte en toegankelijkheid van het tracé, materiaal en herstel van wanden of vloeren beïnvloeden de kosten. Bij gecombineerde verbouwingen zijn planning en afstemming tussen disciplines extra posten."
    ],
    faqs: [
      ["Kunnen leidingen altijd naar een andere muur?", "Niet zonder meer. De bestaande installatie, beschikbare ruimte en afvoerroute bepalen wat haalbaar is."],
      ["Wie maakt de wand na het verleggen dicht?", "Dat moet expliciet worden afgesproken; leidingwerk en tegel- of stucwerk kunnen aparte opdrachten zijn."],
      ["Wanneer plan ik het leidingwerk in een verbouwing?", "Leg de gewenste indeling vroeg vast, zodat de leidingen voor de definitieve wand- en vloerafwerking kunnen worden beoordeeld."],
      ["Wat moet ik op een schets zetten?", "Markeer bestaande en gewenste aansluitpunten, apparatuur en eventuele beperkingen zoals een draagmuur of vloerverwarming."]
    ]
  },
  "loodgieter/sanitair": {
    title: "Sanitair laten plaatsen? | VakConnect",
    description: "Wastafel, kraan of toilet laten plaatsen? Lees over aansluitingen, ruimte en afwerking en vraag een loodgieter aan via VakConnect.",
    h1: "Sanitair laten plaatsen?",
    lead: "Een nieuwe wastafel of kraan moet passen bij de beschikbare ruimte én bij water en afvoer. Beschrijf wat je wilt vervangen en wat er aan aansluitingen aanwezig is.",
    details: [
      "Sanitair plaatsen kan beperkt zijn tot een kraan of wastafel, maar ook nieuwe aansluitingen voor toilet of douche omvatten. De montage vraagt aandacht voor bevestiging, waterdichte aansluitingen en bruikbare indeling.",
      "Een lekkende kraan, versleten wasbak of een wens om de ruimte anders te gebruiken kan aanleiding zijn. Geef aan of oud sanitair kan blijven zitten totdat de nieuwe onderdelen beschikbaar zijn.",
      "Maatverschillen, versleten afsluiters of een afvoer op de verkeerde plek kunnen de montage beïnvloeden. Bij wandtoiletten en zware elementen moet ook de draagkracht van de ondergrond worden beoordeeld.",
      "Een loodgieter bekijkt of bestaande aansluitingen bruikbaar zijn en plaatst of vervangt de afgesproken onderdelen. Als leidingen verlegd of tegels vervangen moeten worden, wordt het een bredere klus dan alleen montage.",
      "Controleer of demontage, afvoer van oude onderdelen, kitwerk en herstel van tegels inbegrepen zijn. Spreek af wie materialen levert en welke afmetingen vóór bestelling gecontroleerd worden.",
      "Vermeld productafmetingen als die bekend zijn, maak foto's van de huidige aansluitingen en noteer of de ruimte tijdens de klus beschikbaar moet blijven.",
      "Het aantal toestellen, bestaande leidingposities, materiaalkeuze, demontage en afwerking bepalen de kosten. Vergelijk offertes op de volledige scope, niet alleen op montage van het nieuwe sanitair."
    ],
    faqs: [
      ["Kan nieuw sanitair op oude leidingen?", "Dat hangt af van staat, maatvoering en ligging van de aansluitingen. Laat de vakman dit vóór de montage beoordelen."],
      ["Wie bestelt de kraan of wastafel?", "Dat spreek je af met de uitvoerder; controleer vooraf of de gekozen onderdelen bij de aanwezige aansluitingen passen."],
      ["Is tegelherstel bij montage inbegrepen?", "Niet standaard. Als een wand open moet of oude bevestigingen zichtbaar blijven, zet herstel apart op de offerte."],
      ["Wat als ik meerdere toestellen tegelijk wil vervangen?", "Beschrijf ieder onderdeel en de gewenste planning zodat aansluitwerk en beschikbaarheid van de ruimte samen worden bekeken."]
    ]
  },
  "loodgieter/spoed": {
    title: "Loodgieter met spoed nodig? | VakConnect",
    description: "Actieve lekkage of onbruikbare afvoer? Lees wat je bij een urgente aanvraag moet melden en zoek via VakConnect een passende loodgieter.",
    h1: "Loodgieter met spoed nodig?",
    lead: "Water dat blijft lopen of een toilet dat overstroomt vraagt om een duidelijke beschrijving van de ernst. Vermeld wat geraakt wordt en of het probleem nog actief is; VakConnect belooft geen vaste reactietijd.",
    details: [
      "Een urgente loodgietersklus richt zich eerst op het veilig beperken van verdere schade en het vaststellen van de bron. Noodherstel en definitieve reparatie zijn soms verschillende werkzaamheden.",
      "Actief uitstromend water, meerdere onbruikbare afvoeren of vocht bij elektra vragen snel om professionele beoordeling. Geef aan welke ruimtes geraakt zijn en of kwetsbare spullen of buren risico lopen.",
      "Een kapotte koppeling, leidingbreuk of verstopte hoofdafvoer kan plotseling problemen geven. Zonder inspectie is niet te zeggen of alleen het zichtbare onderdeel defect is of ook ander leidingwerk aandacht nodig heeft.",
      "Een vakman beoordeelt ter plaatse de oorzaak en bespreekt wat meteen kan worden gedaan. Als voor definitief herstel onderdelen of openbreken nodig zijn, vraag dan om aparte afspraken voor die vervolgstap.",
      "Vraag vooraf hoe inspectie, spoedinzet en eventueel vervolgwerk worden berekend. Leg vast wie schade aan wanden of vloer herstelt en deel eerdere problemen met dezelfde leiding.",
      "Beschrijf helder het type probleem, beginmoment, hoeveelheid water en wat nog wel werkt. Foto's vanuit een veilige positie kunnen helpen; bij water rond elektra is veiligheid belangrijker dan beeldmateriaal.",
      "Urgentie, tijdstip, bereikbaarheid, diagnose en materiaal bepalen de uiteindelijke kosten. Vraag om transparantie over eventuele extra werkzaamheden; het platform kan geen beschikbaarheid of aankomsttijd garanderen."
    ],
    faqs: [
      ["Is elke lekkage een spoedgeval?", "Een kleine druppel en actieve wateruitstroom vragen een andere prioriteit. Meld of de schade toeneemt en laat een vakman de situatie beoordelen."],
      ["Komt er gegarandeerd direct iemand?", "Nee. VakConnect helpt de aanvraag zichtbaar te maken voor passende vakmensen; beschikbaarheid en timing bespreek je met hen."],
      ["Is noodherstel hetzelfde als definitief herstel?", "Niet altijd. Een tijdelijke maatregel kan schade beperken terwijl definitieve reparatie nader onderzoek of onderdelen vraagt."],
      ["Welke informatie mag niet ontbreken?", "Noem locatie, type waterprobleem, ernst, getroffen ruimtes en of water in de buurt van elektrische voorzieningen komt."]
    ]
  },
  "loodgieter/afvoer": {
    title: "Afvoer laten repareren of aanleggen? | VakConnect",
    description: "Lekkende of slecht werkende afvoer? Lees over leidingloop, aansluiting en herstel en beschrijf je afvoerklus op VakConnect.",
    h1: "Afvoer laten repareren of aanleggen?",
    lead: "Een afvoer die steeds borrelt of lekt kan een blokkade hebben, maar ook een beschadigd leidingdeel. Beschrijf welke toestellen op het traject zijn aangesloten.",
    details: [
      "Afvoerwerk gaat over de leiding tussen toestel en verdere riolering: aanleg, verlegging of reparatie. Bij een langdurige verstopping is alleen ontstoppen soms niet voldoende als de leiding zelf beschadigd is.",
      "Terugkerende geur, water onder een gootsteenkast of terugslag in meerdere ruimtes zijn aanleidingen voor onderzoek. Vermeld of de klacht alleen optreedt wanneer water wordt gebruikt.",
      "Oorzaken lopen uiteen van een lekkende sifon tot slechte verbindingen, vervormde leiding of verkeerd verloop. De plek waar water zichtbaar wordt, is niet altijd de plek van het defect.",
      "Een loodgieter bekijkt het traject en bespreekt of een aansluiting kan worden hersteld of dat een leidingdeel moet worden vervangen. Bij twijfel over de toestand van een onzichtbaar traject kan aanvullend onderzoek nodig zijn.",
      "Vraag welke aansluiting of leiding onder de offerte valt en of vloeren, kasten of tegels open moeten. Spreek herstel van de afwerking afzonderlijk af voordat het werk begint.",
      "Maak foto's van zichtbare aansluitingen, meld de getroffen ruimtes en geef aan of de afvoer recent is aangepast. Bij een nieuwe keukenindeling helpt een schets van de gewenste positie.",
      "Lengte en toegankelijkheid van het traject, aantal aansluitingen, diagnose en herstel van omliggende afwerking sturen de kosten. Laat nieuw leidingwerk en eventueel ontstoppingswerk apart beschrijven."
    ],
    faqs: [
      ["Is afvoerreparatie hetzelfde als ontstoppen?", "Nee. Ontstoppen verwijdert een blokkade; reparatie herstelt een beschadigde of verkeerd aangesloten leiding."],
      ["Waarom ruikt een afvoer zonder zichtbaar lek?", "Een sifon, aansluiting of ventilatie van het leidingtraject kan meespelen. De oorzaak vraagt gerichte beoordeling."],
      ["Moet een kast worden weggehaald?", "Dat hangt af van de bereikbaarheid van de defecte aansluiting. Bespreek vooraf wat er wordt gedemonteerd en teruggeplaatst."],
      ["Wat vermeld ik over meerdere trage afvoeren?", "Noem alle betrokken toestellen; daarmee kan de vakman beoordelen of het probleem in een gedeeld traject zit."]
    ]
  },
};

export function getEditorialSubPage(slug: string, fallback: ServiceContentPageData): ServiceContentPageData {
  const content = editorialSubPages[slug];
  if (!content) return fallback;
  const [parent] = slug.split("/");
  const serviceSlug = ["dakdekker", "schilder", "loodgieter", "elektricien", "isolatie"].includes(parent)
    ? parent
    : parent === "badkamer" ? "badkamer-verbouwen" : undefined;
  const headings = [
    "Wat houdt deze klus in?",
    "Wanneer is dit nodig?",
    "Mogelijke oorzaken en situaties",
    "Mogelijke aanpak",
    "Waar moet je op letten?",
    "Je aanvraag voorbereiden",
    "Wat beïnvloedt de kosten?"
  ];
  return {
    ...fallback,
    title: content.title,
    description: content.description,
    h1: content.h1,
    intro: [content.lead],
    sections: content.details.map((text, index) => ({ heading: headings[index], paragraphs: [text] })),
    faqs: content.faqs.map(([question, answer]) => ({ question, answer })),
    relatedLinks: fallback.relatedLinks.filter((link) => link.href !== `/${parent}` && link.href.split("/").length > 2).slice(0, 3),
    cta: {
      ...fallback.cta,
      title: content.h1,
      description: "Beschrijf je situatie, de gewenste aanpak en je regio. Een passende vakman kan je aanvraag bekijken; prijs en uitvoering bespreek je rechtstreeks.",
      serviceSlug,
    },
  };
}

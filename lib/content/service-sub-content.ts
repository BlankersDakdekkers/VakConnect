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
    h1: "Dakrenovatie laten uitvoeren?",
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
  "elektricien/groepenkast": {
    title: "Groepenkast laten vervangen? | VakConnect",
    description: "Oude groepenkast of extra groepen nodig? Lees over aardlek, belasting en veilige vervanging en vind een elektricien via VakConnect.",
    h1: "Groepenkast laten vervangen?",
    lead: "Een nieuwe kookplaat, verbouwing of terugkerende uitval kan vragen om beoordeling van de groepenkast. Laat uitbreiding en vervanging veilig door een elektricien onderzoeken.",
    details: [
      "De groepenkast verdeelt elektriciteit over groepen en bevat beveiligingen. Vervangen kan nodig zijn bij veroudering of gewijzigde belasting; soms is een gerichte uitbreiding voldoende. De bestaande installatie bepaalt welke oplossing past.",
      "Regelmatig uitvallende groepen, weinig ruimte voor extra aansluitingen of plannen voor inductie en laadvoorzieningen zijn redenen voor beoordeling. Een storing is niet automatisch een defect van de groepenkast: ook apparatuur of bedrading kan meespelen.",
      "De benodigde capaciteit hangt af van huidige groepen, aardlekbeveiliging en nieuwe apparaten. Voor een kookplaat kan een passende kookgroep of andere voorziening nodig zijn; laat dit bepalen op basis van aansluiting en apparatuur.",
      "Een elektricien inventariseert de installatie en bespreekt indeling, beveiliging en eventuele aanpassing van de aansluiting. De uitvoering en controles horen bij een deskundige; ga niet zelf in een groepenkast aan de slag.",
      "Vraag welke groepen, aardlekvoorzieningen en labels worden geleverd en wat er na het werk wordt getest. Spreek af of aanpassing van bedrading, meteromgeving of netaansluiting buiten de opdracht valt.",
      "Noteer de aanwezige groepen en beoogde apparaten zonder de kast open te maken. Een foto van de buitenkant en omschrijving van storingen helpen bij het eerste gesprek.",
      "Aantal groepen, staat van bedrading, beschikbare ruimte, nieuwe apparaten en benodigde aanpassingen bepalen de kosten. Laat materialen, testen en eventuele aanvullende werkzaamheden afzonderlijk vermelden."
    ],
    faqs: [
      ["Moet de hele groepenkast weg voor één extra groep?", "Niet altijd. De beschikbare ruimte en staat van de installatie bepalen of uitbreiding mogelijk en verantwoord is."],
      ["Is een uitvallende aardlek altijd een defecte kast?", "Nee. Ook aangesloten apparatuur of bedrading kan de beveiliging laten aanspreken. Laat de oorzaak veilig onderzoeken."],
      ["Welke informatie helpt bij inductie?", "Geef type kookplaat en huidige aansluiting door; de elektricien bepaalt welke groep en voorzieningen passend zijn."],
      ["Mag ik de groepenkast zelf aanpassen?", "Werk in een groepenkast brengt ernstige risico's mee. Laat beoordeling, uitvoering en controle aan een deskundige elektricien over."]
    ]
  },
  "elektricien/storing": {
    title: "Elektrische storing laten onderzoeken? | VakConnect",
    description: "Stroomuitval in huis of terugkerende aardlekstoring? Lees over veilige diagnose en vraag een elektricien aan via VakConnect.",
    h1: "Elektrische storing laten onderzoeken?",
    lead: "Valt een deel van de woning uit of komt een storing steeds terug? Beschrijf wat niet meer werkt en of er warmte, geur of vocht bij betrokken is.",
    details: [
      "Storingsonderzoek zoekt uit of het probleem zit bij de groep, aangesloten apparatuur, bedrading of een beveiliging. De zichtbare uitval zegt niet altijd waar de fout ontstaat.",
      "Terugkerende uitval, knipperende verlichting of een stopcontact dat warm wordt vraagt beoordeling. Bij brandlucht of zichtbare beschadiging is veiligheid leidend: gebruik de betrokken installatie niet en laat een deskundige kijken.",
      "Overbelasting, een defect apparaat, beschadigde kabel of vocht kan een groep of aardlek doen uitschakelen. Uitval in meerdere ruimtes kan op een gedeelde groep wijzen; de elektricien moet de oorzaak zorgvuldig afbakenen.",
      "Een specialist onderzoekt veilig de betrokken delen en bespreekt reparatie of vervanging. Een nieuwe groepenkast is niet automatisch de oplossing; eerst moet duidelijk zijn of de fout in de kast, bedrading of een apparaat zit.",
      "Vraag wat het storingsonderzoek omvat en hoe herstel na de diagnose wordt aangeboden. Maak afspraken over vervolgwerk als delen achter muren of plafonds niet direct bereikbaar zijn.",
      "Noteer welke kamers en apparaten betrokken zijn, sinds wanneer de storing optreedt en of recent iets is geïnstalleerd. Open geen elektrische onderdelen en ga bij verdachte warmte of geur niet experimenteren.",
      "Diagnosetijd, bereikbaarheid van bedrading, onderdelen en eventuele herstelwerkzaamheden aan wand of kast beïnvloeden de kosten. Laat onderzoek en reparatie apart omschrijven."
    ],
    faqs: [
      ["Waarom valt alleen één deel van het huis uit?", "Dat deel kan op dezelfde groep zijn aangesloten. Een elektricien onderzoekt of de beveiliging, bedrading of een aangesloten apparaat de oorzaak is."],
      ["Is terugkerende aardlekuitval gevaarlijk?", "Het is een signaal dat onderzoek verdient. Vocht, beschadiging of een defect apparaat kan de beveiliging laten aanspreken."],
      ["Moet ik meteen de groepenkast vervangen?", "Nee, zonder diagnose staat niet vast waar de fout zit. Laat eerst de oorzaak bepalen."],
      ["Wat meld ik bij brandlucht?", "Geef de locatie en betrokken installatie duidelijk door, gebruik het verdachte onderdeel niet en laat de veiligheid professioneel beoordelen."]
    ]
  },
  "elektricien/stopcontacten": {
    title: "Stopcontacten laten plaatsen? | VakConnect",
    description: "Extra stopcontacten of oude aansluitingen vervangen? Lees over positie, belasting en veilige aanleg via VakConnect.",
    h1: "Stopcontacten laten plaatsen?",
    lead: "Extra aansluitpunten in een keuken of werkruimte vragen om een plan voor locatie én belasting. Beschrijf waar je stroom nodig hebt en welke apparaten je wilt gebruiken.",
    details: [
      "Een stopcontact bijplaatsen of vervangen lijkt klein, maar de aanwezige groep, leidingroute en wandopbouw bepalen de klus. De elektricien controleert of de bestaande installatie de gewenste uitbreiding ondersteunt.",
      "Een tekort aan aansluitpunten, versleten contactdozen of een nieuwe ruimte-indeling zijn redenen voor aanleg. In vochtige ruimtes gelden extra aandachtspunten voor positie en bescherming; laat een deskundige de mogelijkheden bepalen.",
      "Meerdere zware apparaten op dezelfde groep kunnen problemen geven. Een slechte verbinding of beschadigd contact kan warm worden; bij verkleuring of brandlucht is veilig laten beoordelen verstandiger dan alleen een nieuw afdekraam plaatsen.",
      "Een elektricien bespreekt posities, aantal punten, zichtbare of weggewerkte aanleg en eventuele uitbreiding van groepen. Bij een keukenplan is afstemming met meubels en apparaten belangrijk voordat wanden worden afgewerkt.",
      "Laat per punt benoemen of er sleuven, leidingen en herstel van wandafwerking nodig zijn. Vraag ook of bestaande aarding en beveiliging worden gecontroleerd en wat buiten het voorstel valt.",
      "Markeer gewenste plekken op een plattegrond en vermeld apparaten die tegelijk gebruikt worden. Foto's van de wand en groepenkast buitenzijde helpen; laat de technische beoordeling aan de elektricien.",
      "Aantal punten, afstand tot bestaande installatie, wandmateriaal, wijze van wegwerken en eventueel extra groepwerk bepalen de kosten. Vergelijk offertes inclusief afwerking, niet alleen contactdozen."
    ],
    faqs: [
      ["Kan ik overal een stopcontact bij laten plaatsen?", "Niet zonder beoordeling. De beschikbare leidingroute, groep en eisen voor de ruimte bepalen wat passend is."],
      ["Heb ik voor een nieuw keukenapparaat een extra groep nodig?", "Dat hangt af van het apparaat en de bestaande belasting; laat een elektricien de installatie beoordelen."],
      ["Is sleufherstel inbegrepen?", "Niet vanzelf. Spreek af wie de wand opent en na aanleg afwerkt."],
      ["Hoe geef ik de gewenste posities door?", "Een eenvoudige plattegrond met meubels en apparaten helpt de elektricien de punten logisch te plaatsen."]
    ]
  },
  "elektricien/verlichting": {
    title: "Verlichting laten aanleggen? | VakConnect",
    description: "Nieuwe verlichting of lichtpunten plannen? Lees over schakeling, aansluitingen en afwerking en vind een elektricien via VakConnect.",
    h1: "Verlichting laten aanleggen?",
    lead: "Een extra plafondpunt of nieuwe spots beïnvloeden ook schakelaars en kabelroutes. Geef door waar je licht wilt en welke ruimte het betreft.",
    details: [
      "Verlichtingswerk kan gaan om een armatuur aansluiten, extra lichtpunten maken of de schakeling aanpassen. De bestaande bedrading en de gekozen armaturen bepalen wat mogelijk is zonder groter installatiewerk.",
      "Bij een nieuwe indeling, donkere werkplek of renovatie is het verstandig lichtpunten vroeg te plannen. In badkamer en buitenruimte vraagt de locatie om passende bescherming tegen vocht.",
      "Knipperen of uitvallen hoeft niet alleen aan de lamp te liggen; aansluiting, schakelaar of dimmer kan een rol spelen. Bij terugkerende elektrische klachten is onderzoek nodig voor je alleen armaturen vervangt.",
      "Een elektricien bespreekt plaats, bediening, aansluiting en veilige montage. Voor inbouwspots moet onder meer de aanwezige plafondruimte en het gekozen armatuur passen; laat dit vóór de definitieve afwerking toetsen.",
      "Vraag of armaturen, schakelaars, dimmers, nieuwe kabels en gaten in het plafond zijn inbegrepen. Maak afspraken over afwerking van sleuven en eventueel herstel van stuc- of schilderwerk.",
      "Gebruik een plattegrond met lichtpunten en schakelaars, en vermeld het type plafond. Deel productspecificaties van gekozen lampen als die beschikbaar zijn.",
      "Aantal punten, kabelroute, plafondopbouw, bedieningswensen en afwerking sturen de kosten. Werk in een afgewerkt plafond kan meer voorbereiding vragen dan in een open verbouwing."
    ],
    faqs: [
      ["Kunnen spots in ieder plafond?", "Niet altijd. Ruimte, materiaal en gekozen armaturen moeten eerst worden beoordeeld."],
      ["Waarom knipperen lampen op een dimmer?", "Armatuur en dimmer kunnen niet bij elkaar passen of er kan een aansluitprobleem zijn. Laat de oorzaak onderzoeken."],
      ["Zijn lampen bij de aanleg inbegrepen?", "Dat spreek je vooraf af; noteer wie armaturen levert en welke montage en schakelaars in de offerte staan."],
      ["Wanneer plan ik verlichting bij renovatie?", "Bij voorkeur vóór plafonds en wanden definitief worden gesloten, zodat kabelroutes en schakelaars goed kunnen worden afgestemd."]
    ]
  },
  "elektricien/krachtstroom": {
    title: "Krachtstroom laten aanleggen? | VakConnect",
    description: "Zwaardere apparatuur aansluiten? Lees over netaansluiting, groepenkast en deskundige aanleg van krachtstroom via VakConnect.",
    h1: "Krachtstroom laten aanleggen?",
    lead: "Een machine of andere zware verbruiker vraagt mogelijk een andere elektrische voorziening dan een normaal stopcontact. Laat apparaat en bestaande aansluiting vooraf beoordelen.",
    details: [
      "Krachtstroom is geen losse contactdoos zonder verdere context. De benodigde aansluiting hangt af van de specificaties van de verbruiker, de huidige netaansluiting en de beveiliging in de groepenkast.",
      "Nieuwe werkplaatsapparatuur of een verbouwing met zwaardere elektrische belasting kan aanleiding zijn. Controleer eerst wat het apparaat werkelijk vraagt; niet elke kookplaat of laadvoorziening vraagt dezelfde aanpak.",
      "Een bestaande installatie kan onvoldoende ruimte of capaciteit hebben. Ook afstand tot de gebruiksplek en kabelroute tellen mee. De elektricien beoordeelt of een aanpassing van de netaansluiting nodig is.",
      "Een erkend deskundige voor de elektrische werkzaamheden plant groepen, beveiliging en aanleg op basis van de installatie. Aanpassingen aan de aansluiting zelf kunnen afstemming met de netbeheerder vereisen.",
      "Vraag welke werkzaamheden in de groepenkast en welke kabelroute in de offerte zitten. Bespreek hoe de nieuwe voorziening wordt gecontroleerd en wie eventuele netbeheerderstappen regelt.",
      "Verstrek het typeplaatje of de technische gegevens van het apparaat en foto's van de huidige situatie zonder kasten te openen. Meld ook andere geplande grote verbruikers.",
      "Netaansluiting, capaciteit van de kast, lengte en ligging van kabels, afwerking en eventuele externe aanpassingen beïnvloeden de kosten. Laat externe kosten en installatiewerk gescheiden toelichten."
    ],
    faqs: [
      ["Heeft elke inductiekookplaat krachtstroom nodig?", "Nee, aansluitvereisten verschillen. Laat de specificaties van het toestel en je installatie samen beoordelen."],
      ["Moet de netbeheerder iets aanpassen?", "Dat hangt af van de huidige netaansluiting en benodigde capaciteit. De elektricien kan aangeven of afstemming nodig is."],
      ["Kan krachtstroom op een bestaande groep?", "Een passende beveiliging en installatie zijn noodzakelijk; laat dit uitsluitend door een deskundige bepalen."],
      ["Welke gegevens helpen bij de aanvraag?", "Stuur de technische gegevens van de verbruiker, gewenste locatie en informatie over andere zware apparaten."]
    ]
  },
  "kozijnen/kunststof-kozijnen": {
    title: "Kunststof kozijnen laten plaatsen? | VakConnect",
    description: "Kunststof kozijnen overwegen? Lees over glaskeuze, ventilatie, sparingen en montage en beschrijf je project via VakConnect.",
    h1: "Kunststof kozijnen laten plaatsen?",
    lead: "Nieuwe kozijnen veranderen uitstraling, glas en bediening van je ramen. Beschrijf welke openingen je wilt aanpakken en wat je belangrijk vindt aan onderhoud en ventilatie.",
    details: [
      "Bij kunststof kozijnen gaat het om profiel, glas, beslag en de aansluiting op de bestaande gevel. De juiste maat en montage zijn minstens zo belangrijk als het gekozen materiaal voor gebruik en comfort.",
      "Tocht, moeilijk sluitende ramen of een wens voor minder onderhoud kunnen redenen zijn om te vervangen. Kijk ook naar de staat van de huidige kozijnen: soms is herstel of alleen glasvervanging nog een optie.",
      "De bestaande sparing, vensterbank en gevelafwerking bepalen hoe het nieuwe kozijn kan worden geplaatst. Glaskeuze beïnvloedt onder meer comfort en gewicht; bespreek opties zonder een vaste besparingsclaim te verwachten.",
      "Een leverancier meet in en bespreekt draaiwijze, verdeling en glas. Ventilatie verdient aandacht als naden straks beter sluiten. De montage moet aansluiten op de gevel en omgaan met bestaande waterkering en afwerking.",
      "Vraag welk glas, beslag, ventilatievoorziening en binnen- en buitenafwerking zijn inbegrepen. Laat de demontage en afvoer van oude kozijnen en herstel rond de sparingen vastleggen.",
      "Tel ramen en deuren, noteer afmetingen bij benadering en maak foto's van gevel en binnenzijde. Geef aan of een gevelwijziging of afwijkende kleur onderdeel van je plannen is.",
      "Aantal en afmetingen, profielindeling, glas, bereikbaarheid, montage in bestaande sparingen en herstel van gevel of binnenwand bepalen de kosten. Vergelijk offertes met dezelfde specificaties."
    ],
    faqs: [
      ["Hebben kunststof kozijnen geen onderhoud?", "Ze vragen doorgaans ander onderhoud dan hout; schoonhouden en controleren van beslag en afdichtingen blijven belangrijk."],
      ["Moet ik ventilatie opnieuw regelen?", "Betere kierdichting verandert de luchttoevoer. Bespreek hoe voldoende ventilatie in de ruimte behouden blijft."],
      ["Kan ieder bestaand kozijn zonder gevelwerk worden vervangen?", "Niet altijd. De maatvoering en staat van de sparing bepalen welke aanpassing en afwerking nodig zijn."],
      ["Kan ik zelf het glas kiezen?", "Ja, bespreek comfort, gebruik en gewicht met de vakman zodat profiel, beslag en glas bij elkaar passen."]
    ]
  },
  "kozijnen/houten-kozijnen": {
    title: "Houten kozijnen laten herstellen of plaatsen? | VakConnect",
    description: "Houtrot of tocht bij houten kozijnen? Vergelijk herstel, schilderwerk en vervanging en vraag een specialist aan via VakConnect.",
    h1: "Houten kozijnen laten herstellen of plaatsen?",
    lead: "Hout geeft veel mogelijkheden voor herstel en detaillering, maar vocht kan onder verf ongemerkt schade veroorzaken. Beschrijf welke delen zacht, beschadigd of moeilijk sluitend zijn.",
    details: [
      "Houten kozijnen kunnen worden onderhouden, plaatselijk hersteld of vervangen. De keuze hangt af van de staat van dorpels, stijlen, verbindingen en de gewenste glas- en ventilatieoplossing.",
      "Loslatende verf, open naden en zachte onderdorpels zijn redenen om de staat te laten beoordelen. Een kozijn dat scheef trekt of moeilijk sluit, kan ook een probleem met de aansluiting of constructie hebben.",
      "Vocht kan via kitnaden, glaslatten of horizontale delen binnendringen. Alleen opnieuw schilderen helpt niet als er houtrot onder de laag zit. Laat schade vóór een besluit over vervangen in kaart brengen.",
      "Een vakman bespreekt wat lokaal kan worden gerepareerd en waar vernieuwen verstandiger is. Schilderwerk beschermt het herstelde hout; spreek af wie dat verzorgt. Bij een karakteristiek of beschermd pand kunnen eisen voor uiterlijk gelden.",
      "Vraag welke delen daadwerkelijk worden vervangen of gerepareerd en hoe aansluitingen op gevel en glas worden afgewerkt. Vergelijk niet alleen materiaalprijzen, maar ook het toekomstige onderhoud.",
      "Maak foto's van onderdorpels en naden, noteer eerder herstel en vertel of behoud van de bestaande uitstraling belangrijk is. Geef aan of het gebouw bijzondere regels kent als dat bekend is.",
      "Omvang van houtrot, profielwerk, glaskeuze, schilderwerk en bereikbaarheid bepalen de kosten. Een offerte voor plaatselijk herstel heeft een andere scope dan die voor een volledig nieuw kozijn."
    ],
    faqs: [
      ["Is houtrot altijd reden om het kozijn te vervangen?", "Nee, plaatselijk herstel kan soms. Bij grote schade aan meerdere dragende delen kan vervangen logischer zijn."],
      ["Is schilderwerk inbegrepen na houtreparatie?", "Niet automatisch. Leg vast hoe het herstelde deel wordt beschermd en wie de eindafwerking doet."],
      ["Kan ik in een karakteristieke woning zomaar veranderen?", "Bij beschermde panden of bijzondere gevels kunnen regels gelden. Laat de toepasselijke situatie vooraf controleren."],
      ["Wat maakt onderhoud belangrijk?", "Open naden en beschadigde verflagen laten vocht bij het hout komen; regelmatige controle helpt beginnende schade te herkennen."]
    ]
  },
  "kozijnen/aluminium-kozijnen": {
    title: "Aluminium kozijnen laten plaatsen? | VakConnect",
    description: "Aluminium kozijnen overwegen voor nieuwe ramen of een uitbouw? Lees over profiel, glas, montage en afwerking via VakConnect.",
    h1: "Aluminium kozijnen laten plaatsen?",
    lead: "Bij aluminium kozijnen bepalen maatvoering, glas en aansluiting op de gevel het eindresultaat. Beschrijf of het om vervanging in een bestaande opening of nieuwbouw gaat.",
    details: [
      "Aluminium kozijnen worden gekozen voor een bepaalde uitstraling en indeling van grote of kleine glasvlakken. Het profiel moet passen bij het gewenste glas, de bediening en de bestaande bouwkundige opening.",
      "Bij verouderde kozijnen, een nieuw gevelontwerp of een uitbouw kan aluminium een optie zijn. Vergelijk het materiaal met andere mogelijkheden op uitstraling, onderhoud en technische aansluiting, niet op een algemene besparingsbelofte.",
      "Een bestaande sparing kan scheef zijn of beschadigde randen hebben. Glasgewicht, dorpel en ventilatie beïnvloeden welke oplossing geschikt is en hoeveel voorbereidend werk nodig wordt.",
      "De vakman meet in, bepaalt profielindeling en stemt de plaatsing af op waterkering en luchtdichte aansluiting. In een uitbouw moet de kozijnkeuze vroeg worden afgestemd met constructie en dak.",
      "Vraag om specificaties van profiel, glas, beslag en eventuele ventilatie. Leg vast wie oude kozijnen verwijdert, gevelaansluitingen afwerkt en schade rond de opening herstelt.",
      "Lever foto's, globale maten en je wensen voor kleur, draaibare delen en drempel aan. Geef door of de opening verandert: dat kan bouwkundige beoordeling en andere regels meebrengen.",
      "Afmetingen, glasoppervlak, profielindeling, montagehoogte en afwerking van de sparing bepalen de kosten. Een nieuw gevelgat is een andere opdracht dan vervanging op dezelfde plek."
    ],
    faqs: [
      ["Passen aluminium kozijnen in iedere bestaande sparing?", "De opening moet worden ingemeten en de aansluiting beoordeeld; aanpassing van omliggend werk kan nodig zijn."],
      ["Zijn grote glasvlakken altijd mogelijk?", "Afmetingen, constructie, gewicht en type glas bepalen wat verantwoord is. Laat het ontwerp daarop toetsen."],
      ["Hoe houd ik ventilatie in de ruimte?", "Bespreek toevoer en bestaande ventilatie bij een beter sluitend nieuw kozijn."],
      ["Welke onderdelen moeten in de offerte staan?", "Profiel, glas, beslag, montage, oude kozijnen afvoeren en afwerking aan binnen- en buitenzijde."]
    ]
  },
  "kozijnen/kozijnen-vervangen": {
    title: "Kozijnen laten vervangen? | VakConnect",
    description: "Kozijnen versleten of tocht in huis? Lees wanneer herstel nog past en wat vervanging, glas en montage bepalen via VakConnect.",
    h1: "Kozijnen laten vervangen?",
    lead: "Bij houtrot, blijvende tocht of slecht sluitende ramen is vervanging een optie, maar niet altijd de enige. Beschrijf wat je huidige kozijnen mankeert en wat je wilt verbeteren.",
    details: [
      "Kozijnen vervangen betekent oude elementen verwijderen en nieuwe passend monteren in de gevel. Materiaalkeuze, glas, ventilatie en herstel van aansluitingen horen bij dezelfde afweging.",
      "Als herstel van dorpels of beslag niet meer voldoende is, kan vervangen logisch zijn. Ook een renovatie met andere raamindeling vraagt vroeg om inzicht in de bestaande sparingen en gevel.",
      "Tocht kan komen van afdichtingen, glas of de aansluiting rondom het kozijn. Houtrot kan plaatselijk zijn; laat daarom beoordelen of een beperkte reparatie, glasvervanging of volledige wissel het probleem werkelijk aanpakt.",
      "Een specialist meet in, bespreekt materiaal, bediening en glas en plant demontage en montage. Bij aanpassing van openingen kunnen constructieve en gemeentelijke aandachtspunten spelen.",
      "Vraag wat er gebeurt met binnenvensterbanken, gevelafwerking, schilderwerk en oude kozijnen. Ventilatie en waterdichte aansluiting zijn net zo belangrijk als een mooi nieuw profiel.",
      "Tel de elementen, maak foto's van schade en geef aan welke ramen moeten kunnen openen. Meld eventuele plannen voor gevelisolatie, zodat aansluitingen niet los van elkaar worden beoordeeld.",
      "Aantal kozijnen, afmetingen, materiaal, glas, hoogte en afwerking van binnen- en buitenzijde bepalen de kosten. Laat eventueel metsel- of stucwerk als aparte post opnemen."
    ],
    faqs: [
      ["Moet een tochtend kozijn altijd worden vervangen?", "Nee. Onderzoek eerst of afdichtingen, glas of een aansluiting hersteld kunnen worden."],
      ["Wordt het metselwerk beschadigd bij vervanging?", "Dat hangt af van de bestaande montage. Spreek vooraf af welke afwerking en herstel in de opdracht zitten."],
      ["Wat kies ik eerst: materiaal of glas?", "Beide keuzes hangen samen met gebruik, uitstraling en bestaande opening; bespreek ze tegelijk met de specialist."],
      ["Blijft ventilatie na vervanging voldoende?", "Betere kierdichting vraagt aandacht voor toevoer van frisse lucht. Neem ventilatie mee in het ontwerp."]
    ]
  },
  "kozijnen/ramen-en-deuren": {
    title: "Ramen en deuren laten vernieuwen? | VakConnect",
    description: "Nieuwe ramen of buitendeuren nodig? Lees over bediening, beglazing, drempels en aansluiting en vraag een vakman aan via VakConnect.",
    h1: "Ramen en deuren laten vernieuwen?",
    lead: "Een raam dat niet goed opent of een buitendeur die tocht vraagt om een afweging tussen beslagherstel, glas en vervanging. Beschrijf per opening het probleem.",
    details: [
      "Ramen en deuren combineren kozijn, bewegend deel, glas en beslag. Goed gebruik vraagt correcte maatvoering en montage; een mooi profiel alleen lost een scheef sluitende opening niet op.",
      "Klemmende ramen, tochtende buitendeuren of verouderd glas zijn aanleiding voor beoordeling. Geef aan of je alleen beter gebruik wilt of ook een andere indeling van de gevel.",
      "Slijtage van scharnieren, afdichtingen en drempels kan lijken op een defect kozijn. Vocht onder een deur kan komen van de waterkering bij de dorpel; laat de oorzaak eerst bepalen.",
      "Een vakman vergelijkt herstel van beslag en rubbers met een nieuw raam of deur. Bij vervanging bespreek je draairichting, veiligheid, glas en ventilatie binnen de bestaande opening.",
      "Vraag of sluitwerk, dorpel, beglazing en afwerking van binnenzijde in de offerte staan. Nieuwe buitendeuren vragen aandacht voor waterdichte aansluiting en toegankelijkheid van de entree.",
      "Maak een overzicht van aantallen en draairichtingen en noteer waar het klemt of tocht. Foto's van drempels en aansluitingen maken het verschil tussen reparatie en nieuw werk inzichtelijk.",
      "Afmetingen, type glas, beslag, drempels, bereikbaarheid en staat van sparingen bepalen de kosten. Splits reparatie van volledige vervanging bij het vergelijken van opties."
    ],
    faqs: [
      ["Is een klemmend raam altijd aan vervanging toe?", "Nee, beslag of afstelling kan de oorzaak zijn. Laat eerst de staat van raam en kozijn controleren."],
      ["Kan ik alleen de buitendeur vervangen?", "Dat hangt af van maatvoering en staat van het bestaande kozijn; een specialist kan de aansluiting beoordelen."],
      ["Welke keuzes zijn belangrijk voor een nieuwe deur?", "Denk aan draairichting, sluitwerk, drempel, glas en aansluiting op de gevel."],
      ["Wat als er vocht bij de drempel komt?", "Laat waterkering en aansluiting onderzoeken voordat alleen een afdichting of nieuw deurblad wordt gekozen."]
    ]
  },
  "badkamer/renovatie": {
    title: "Badkamer laten renoveren? | VakConnect",
    description: "Badkamerrenovatie plannen? Lees over indeling, leidingen, waterdichting en afwerking en beschrijf je project via VakConnect.",
    h1: "Badkamer laten renoveren?",
    lead: "Een andere indeling raakt meer dan de tegels. Leg vast wat er moet veranderen aan douche, toilet, leidingen en ventilatie, zodat de volgorde van het werk bespreekbaar wordt.",
    details: [
      "Een badkamerrenovatie verbindt ontwerp, sloop, leidingwerk, elektra, waterdichting, tegelwerk en sanitair. Wie welk onderdeel uitvoert en hoe de werkzaamheden op elkaar aansluiten moet vroeg duidelijk zijn.",
      "Lekkage achter tegels, onpraktische indeling of verouderde voorzieningen zijn redenen om te renoveren. Bepaal eerst welke onderdelen echt veranderen; een nieuwe douche op dezelfde plek is iets anders dan een volledige herindeling.",
      "Onder bestaande afwerking kan vochtschade zichtbaar worden die de planning wijzigt. De positie van standleiding, afvoer en ventilatie bepaalt hoeveel vrijheid er is om sanitair te verplaatsen.",
      "Een vakman of team bespreekt de indeling en beoordeelt daarna leidingen, elektrische punten, ondergrond en waterdichting. Tegels en sanitair volgen pas wanneer de onderliggende werkzaamheden zijn afgestemd en gecontroleerd.",
      "Vraag wie verantwoordelijk is voor waterdichte aansluitingen bij vloer, wanden en douche. Laat vastleggen welke disciplines zijn inbegrepen, hoe wijzigingen worden afgestemd en wanneer de ruimte niet bruikbaar is.",
      "Verzamel maten, foto's en een lijst van wensen en onderdelen die blijven. Vermeld of een tweede badkamer beschikbaar is en wie materialen levert, zodat leveringen en werkzaamheden op elkaar passen.",
      "Oppervlak, sloop, verplaatsen van leidingen, herstel van vocht, materiaalkeuze, ventilatie en aantal betrokken disciplines bepalen de kosten. Vraag een gespecificeerde offerte met afspraken over verborgen gebreken."
    ],
    faqs: [
      ["Kan de douche op een andere plek?", "Dat hangt af van de afvoerroute, vloeropbouw en leidingwerk. Laat de mogelijkheden beoordelen voordat de indeling vaststaat."],
      ["Waarom is waterdichting een aparte aandachtspost?", "Tegels en voegen alleen maken de opbouw niet waterdicht. De onderliggende aansluitingen moeten passend worden uitgevoerd."],
      ["Wie coördineert loodgieter en elektricien?", "Spreek vooraf af wie planning en overdracht tussen disciplines verzorgt, zeker bij een volledige renovatie."],
      ["Wat als na sloop vochtschade zichtbaar wordt?", "Vraag vóór de start hoe aanvullend herstel wordt beoordeeld, begroot en afgestemd."]
    ]
  },
  "badkamer/tegelen": {
    title: "Badkamer laten tegelen? | VakConnect",
    description: "Nieuwe badkamertegels op wand of vloer? Lees over ondergrond, waterdichting en afwerking en vraag tegelwerk aan via VakConnect.",
    h1: "Badkamer laten tegelen?",
    lead: "Een strak tegelvlak begint onder de tegel. Geef aan welke wanden en vloeren worden aangepakt en of er oude tegels of vochtschade aanwezig zijn.",
    details: [
      "Badkamer tegelen vraagt voorbereiding van de ondergrond, maatverdeling en aandacht voor natte zones. Wand- en vloertegels hebben andere praktische eisen; ook hoeken, randen en afschot beïnvloeden het werk.",
      "Losse tegels, beschadigde voegen of een nieuwe indeling kunnen aanleiding zijn voor tegelwerk. Als vocht via de douchevloer komt, is alleen nieuwe voegmortel mogelijk onvoldoende.",
      "Een ongelijke of vochtige ondergrond kan hechting en eindresultaat beïnvloeden. In de douche verdienen aansluitingen en waterdichting extra aandacht voordat tegels het werk aan het zicht onttrekken.",
      "Een tegelzetter bespreekt sloop, egalisatie, indeling, waterdichting en afwerking van voegen en kitnaden. Grote tegels of veel nissen kunnen extra voorbereiding en snijwerk vragen.",
      "Vraag welke ondergrondbehandeling en afdichting zijn inbegrepen. Spreek af wie leidingen, douchegoot en sanitair plaatst en wanneer het tegelwerk daarop moet aansluiten.",
      "Lever globale afmetingen, foto's en eventuele productmaten van gekozen tegels aan. Geef aan of de bestaande ondergrond blijft zitten en welke gedeelten tijdens het werk toegankelijk moeten zijn.",
      "Oppervlak, staat van de ondergrond, sloop, tegelformaat, patroon, nissen en waterdichting bepalen de kosten. Laat kitwerk en afvoer van oud materiaal apart benoemen."
    ],
    faqs: [
      ["Kunnen nieuwe tegels over oude heen?", "Dat kan alleen als de bestaande ondergrond geschikt is en maatvoering en waterdichting kloppen. Laat dit ter plaatse beoordelen."],
      ["Zijn tegelvoegen waterdicht?", "Voegen alleen vervangen geen goed uitgevoerde waterdichting in natte zones."],
      ["Waarom verschilt de prijs per tegelformaat?", "Maat, patroon en aantal uitsparingen beïnvloeden voorbereiding en snijwerk."],
      ["Wie sluit de douchegoot aan?", "Leg vooraf vast welke vakman de afvoer en waterdichte aansluiting verzorgt en hoe dit met het tegelwerk wordt afgestemd."]
    ]
  },
  "badkamer/sanitair": {
    title: "Badkamersanitair laten vervangen? | VakConnect",
    description: "Wastafel, bad of toilet in de badkamer vernieuwen? Lees over montage, aansluitingen en ruimte en plaats je aanvraag via VakConnect.",
    h1: "Badkamersanitair laten vervangen?",
    lead: "Een nieuw meubel of toilet moet op bestaande leidingen passen en ruimte laten voor gebruik. Geef aan wat blijft, wat weggaat en welke producten je op het oog hebt.",
    details: [
      "Badkamersanitair omvat onder meer wastafel, bad, toilet en kranen. Vervanging op dezelfde plek is vaak een andere klus dan montage in een nieuwe indeling met verlegde toevoer en afvoer.",
      "Versleten toestellen, lekkende kranen of een ruimte die niet prettig werkt kunnen aanleiding zijn. Beoordeel vóór bestellen of producten en bevestiging geschikt zijn voor de bestaande wand en aansluitingen.",
      "Achter een oud meubel kunnen tegelschade of leidingen op een onverwachte plek zitten. Bij een nieuw toilet speelt ook de afvoerpositie mee; voor zware meubels moet de wand geschikt zijn.",
      "Een vakman demonteert bestaande onderdelen waar afgesproken, beoordeelt aansluitingen en monteert nieuw sanitair. Als leidingen, tegels of waterdichting moeten veranderen, is meer nodig dan alleen toestelmontage.",
      "Vraag of kranen, sifons, kitwerk en afvoer van oude onderdelen in de offerte staan. Controleer wie maatvoering en levering verzorgt en wie eventuele schade achter oude toestellen herstelt.",
      "Maak foto's met zicht op de aansluitpunten en noteer afmetingen van de ruimte en het gewenste meubel. Beschrijf of je de badkamer in de tussentijd moet kunnen gebruiken.",
      "Aantal onderdelen, materiaalkeuze, verleggen van leidingen, demontage en tegelherstel bepalen de kosten. Vergelijk montageoffertes alleen als dezelfde onderdelen zijn inbegrepen."
    ],
    faqs: [
      ["Kan een nieuw wastafelmeubel aan elke wand?", "Niet zonder beoordeling van bevestiging, leidingposities en draagkracht van de wand."],
      ["Worden oude onderdelen afgevoerd?", "Spreek dit expliciet af; demontage en afvoer zijn niet altijd bij de montage inbegrepen."],
      ["Moet het toilet op dezelfde plek blijven?", "Verplaatsen hangt af van afvoerroute en vloeropbouw en kan een groter verbouwingsproject worden."],
      ["Wie herstelt beschadigde tegels achter het oude meubel?", "Laat dat vooraf in de scope opnemen of bespreek het als mogelijke aanvullende werkzaamheid."]
    ]
  },
  "badkamer/inloopdouche": {
    title: "Inloopdouche laten maken? | VakConnect",
    description: "Inloopdouche of douchebak overwegen? Lees over afvoer, afschot, waterdichting en glaswand en vind een vakman via VakConnect.",
    h1: "Inloopdouche laten maken?",
    lead: "Een inloopdouche zonder goede afwatering kan water buiten de natte zone brengen. Beschrijf de beschikbare ruimte, huidige douche en gewenste instap.",
    details: [
      "Een inloopdouche combineert douchevloer, afvoer, waterdichting en vaak een glaswand. Een douchebak kan een alternatief zijn als de vloeropbouw of afvoerpositie weinig ruimte biedt.",
      "Bij een oude douchecabine, lastig bereikbare instap of nieuwe badkamerindeling kan een inloopdouche passen. Bepaal eerst de afmetingen en waar water terecht kan komen tijdens het douchen.",
      "De plaats van de afvoer en de beschikbare vloerhoogte bepalen of het benodigde afschot haalbaar is. Lekkage bij oude kitnaden kan wijzen op bredere problemen met de aansluiting achter tegels.",
      "Een vakman beoordeelt de vloer, leidingposities en natte zone voordat douchegoot, afdichting, tegels en glaswand worden afgestemd. Soms is verleggen van leidingen nodig voor een andere douchepositie.",
      "Vraag wie verantwoordelijk is voor afdichting bij vloer en wand, de aansluiting van de afvoer en de kitnaden. Bespreek de plaats van de glaswand en hoe spatwater buiten de douche wordt beperkt.",
      "Lever een schets met maten, foto's van de huidige vloer en informatie over de ligging van de afvoer. Geef aan of je een douchebak, vlakke vloer of toegankelijkere instap wilt onderzoeken.",
      "Sloop, aanpassing van afvoer en leidingen, vloeropbouw, waterdichting, tegels en glas bepalen de kosten. Een offerte moet duidelijk maken welke disciplines en afwerkingen inbegrepen zijn."
    ],
    faqs: [
      ["Is een inloopdouche in elke badkamer mogelijk?", "De vloerhoogte, afvoerroute en ruimte voor afschot moeten worden beoordeeld; soms past een douchebak beter."],
      ["Voorkomt een glaswand al het spatwater?", "Niet vanzelf. De indeling, afmetingen en douchepositie bepalen waar water terechtkomt."],
      ["Kunnen oude kitnaden een lek veroorzaken?", "Dat kan, maar onderzoek ook de onderliggende waterdichting en aansluitingen wanneer vocht terugkeert."],
      ["Wat hoort bij het waterdicht maken?", "Laat vastleggen welke vloer- en wandaansluitingen, afvoer en natte zones de uitvoerder behandelt."]
    ]
  },
  "badkamer/complete-badkamer": {
    title: "Complete badkamer laten maken? | VakConnect",
    description: "Een complete badkamer vernieuwen? Lees over ontwerp, disciplines, planning en kostenfactoren en start je aanvraag via VakConnect.",
    h1: "Complete badkamer laten maken?",
    lead: "Een nieuwe badkamer van sloop tot laatste kraan vraagt coördinatie tussen meerdere vakmensen. Beschrijf gewenste indeling, afwerking en welke voorzieningen absoluut nodig zijn.",
    details: [
      "Een complete badkamer omvat doorgaans sloop, leidingen, elektra, ventilatie, waterdichting, tegelwerk en montage. In tegenstelling tot een beperkte renovatie worden vrijwel alle zichtbare en verborgen onderdelen opnieuw beoordeeld.",
      "Een sterk verouderde ruimte of een volledig andere indeling kan aanleiding zijn. Inventariseer welke onderdelen weg kunnen en of structurele vochtproblemen eerst moeten worden opgelost.",
      "Bestaande leidingen en vloeropbouw beperken soms waar douche en toilet kunnen komen. Na sloop kan verborgen schade aan wand of vloer zichtbaar worden; houd in de planning ruimte voor beoordeling daarvan.",
      "Start met een indelingsplan en technische check. Pas daarna kunnen productkeuzes, volgorde van disciplines en levering worden afgestemd. De waterdichte opbouw moet gecontroleerd zijn voordat tegelwerk haar afdekt.",
      "Vraag wie het project coördineert, welke disciplines meedoen en wie aansprakelijk is voor aansluitingen tussen hun werkzaamheden. Leg vast wanneer de ruimte buiten gebruik is en hoe wijzigingen worden goedgekeurd.",
      "Maak een lijst met gewenste toestellen, maatvoering, foto's en prioriteiten. Laat weten wie materialen bestelt en of elders in huis een bruikbare badkamer beschikbaar is tijdens de werkzaamheden.",
      "Omvang van sloop, verplaatsen van installaties, ondergrondherstel, materiaalkeuze en projectcoördinatie beïnvloeden de kosten. Een gespecificeerde offerte maakt aanvullende keuzes en verborgen gebreken beter bespreekbaar."
    ],
    faqs: [
      ["Wat is het verschil met een kleine badkamerrenovatie?", "Bij een complete badkamer worden indeling en onderliggende installaties meestal breder beoordeeld dan bij een beperkte vervanging."],
      ["Wie bewaakt de volgorde van het werk?", "Leg vast wie planning en overdracht tussen sloop, installaties, waterdichting, tegels en montage regelt."],
      ["Kan ik sanitair zelf inkopen?", "Bespreek maten, levertijden en verantwoordelijkheden voor geschiktheid van de producten vóór bestelling."],
      ["Hoe wordt onverwachte vochtschade behandeld?", "Spreek af dat verborgen gebreken eerst worden besproken en apart worden begroot voordat extra werk plaatsvindt."]
    ]
  },
  "badkamer/ventilatie": {
    title: "Badkamerventilatie laten verbeteren? | VakConnect",
    description: "Condens of schimmel in de badkamer? Lees over luchttoevoer, afvoer en bestaande installatie en vraag hulp aan via VakConnect.",
    h1: "Badkamerventilatie laten verbeteren?",
    lead: "Condens die lang blijft hangen kan wijzen op onvoldoende afvoer of toevoer van lucht. Beschrijf wanneer het probleem ontstaat en welke ventilatie er nu aanwezig is.",
    details: [
      "Badkamerventilatie voert vochtige lucht af en vraagt tegelijk om toevoer van nieuwe lucht. Een ventilator vervangen is niet altijd genoeg als het kanaal of de luchttoevoer niet werkt.",
      "Langdurig beslagen spiegels, muffe geur of terugkerende schimmel zijn redenen om het systeem te bekijken. Controle van vochtbronnen blijft belangrijk: een lekkage vraagt een andere aanpak dan condens.",
      "Een vervuild rooster, ongeschikt kanaal, verkeerd werkende ventilator of te weinig luchttoevoer kan de werking beperken. Ook een bouwkundige koude plek kan condens op één wand versterken.",
      "Een vakman beoordeelt afvoerroute, aanwezige ventilatie en luchttoevoer. Daarna kan reinigen, herstellen of vernieuwen van onderdelen aan de orde zijn; een extra apparaat zonder goede kanaalroute helpt mogelijk niet.",
      "Vraag hoe het systeem na de werkzaamheden wordt gecontroleerd en of elektra en kanalen in de offerte zitten. Bespreek de positie van luchttoevoer en afvoer zodat vocht niet alleen verplaatst wordt.",
      "Vermeld of er een raam, mechanische ventilatie of losse ventilator is en wanneer condens optreedt. Foto's van roosters, schimmelplekken en bestaande aansluitingen helpen de beoordeling.",
      "Bestaande kanalen, benodigde elektrische aansluiting, bereikbaarheid en afwerking bepalen de kosten. Onderzoek naar eventuele lekkage of herstel van schimmel- en vochtschade kan een aparte opdracht zijn."
    ],
    faqs: [
      ["Is schimmel altijd een ventilatieprobleem?", "Nee, ook lekkage of een koude bouwkundige plek kan meespelen. Laat de vochtbron beoordelen."],
      ["Helpt een sterkere ventilator automatisch?", "Niet als het kanaal geblokkeerd is of verse lucht niet kan toestromen. Bekijk het hele systeem."],
      ["Heeft ventilatie ook luchttoevoer nodig?", "Ja, afvoer werkt alleen goed als er vervangende lucht de ruimte kan bereiken."],
      ["Wanneer schakel ik een elektricien in?", "Bij aanleg of aanpassing van elektrische ventilatie hoort veilige elektrische uitvoering bij de opdracht."]
    ]
  },
  "isolatie/dakisolatie": {
    title: "Dakisolatie laten aanbrengen? | VakConnect",
    description: "Dak laten isoleren? Vergelijk aanpak van binnen of buiten, vocht en ventilatie en beschrijf je project via VakConnect.",
    h1: "Dakisolatie laten aanbrengen?",
    lead: "Een koud zolderdak vraagt om een oplossing die bij de bestaande dakopbouw past. Beschrijf het type dak, de staat van de bedekking en hoe je de ruimte gebruikt.",
    details: [
      "Dakisolatie kan bij sommige daken aan de binnenzijde of tijdens dakwerk aan de buitenzijde worden aangebracht. De beste plek hangt af van de bestaande lagen, beschikbare ruimte en plannen voor renovatie.",
      "Een koude zolder, tocht of een dak dat toch vernieuwd wordt kan aanleiding zijn. Als er vochtplekken of lekkages zijn, moeten die eerst worden onderzocht voordat nieuwe isolatie de oorzaak aan het zicht onttrekt.",
      "Bij een hellend dak spelen onderdak en ventilatie mee; bij een plat dak verschilt de opbouw en moet de staat van de bedekking worden bekeken. Onjuiste omgang met vocht en dampremming kan problemen geven in de constructie.",
      "Een specialist beoordeelt de bestaande dakopbouw, vocht en bereikbaarheid. Daarna bespreekt hij een geschikte aanpak en hoe isolatie aansluit op ramen, balken en eventuele nieuwe dakbedekking.",
      "Vraag hoe vochtveiligheid en ventilatie zijn meegenomen en wie eventuele dakreparaties uitvoert. Laat dikte, materiaal, afwerking en aansluitingen op aangrenzende delen expliciet in de offerte opnemen.",
      "Maak foto's van zolder, dakramen en zichtbare dakbeschot en vermeld eerdere lekkages. Geef aan of de zolder als woonruimte wordt gebruikt; dat kan de gewenste afwerking beïnvloeden.",
      "Dakoppervlak, type dak, bestaande lagen, toegankelijkheid, materiaal en binnenafwerking bepalen de kosten. Combinatie met dakrenovatie of herstel van vochtschade wijzigt de scope."
    ],
    faqs: [
      ["Is isoleren van binnen altijd mogelijk?", "Niet zonder beoordeling van bestaande lagen, vocht en ventilatie. De gekozen opbouw moet bij het dak passen."],
      ["Kan dakisolatie samen met dakvervanging?", "Ja, dat kan een logisch moment zijn om de buitenzijde mee te nemen; laat de opbouw als geheel beoordelen."],
      ["Moet een lekkage eerst worden opgelost?", "Ja, een vochtbron moet worden vastgesteld en hersteld voordat die achter nieuwe isolatie verdwijnt."],
      ["Waarom is dampremming belangrijk?", "Vochttransport in de dakopbouw beïnvloedt de constructie; laat de passende plaats en uitvoering door een specialist bepalen."]
    ]
  },
  "isolatie/spouwmuurisolatie": {
    title: "Spouwmuur laten isoleren? | VakConnect",
    description: "Spouwmuurisolatie overwegen? Lees waarom geschiktheid, vocht en gevelstaat eerst gecontroleerd moeten worden via VakConnect.",
    h1: "Spouwmuur laten isoleren?",
    lead: "Niet elke buitenmuur heeft een geschikte spouw. Beschrijf je woning en zichtbare vochtproblemen, zodat een specialist eerst de gevel kan beoordelen.",
    details: [
      "Bij spouwmuurisolatie wordt de ruimte tussen binnen- en buitenblad benut. Of dat kan, hangt af van aanwezigheid, breedte en toestand van de spouw en de buitengevel.",
      "Een koude buitenmuur kan aanleiding zijn om isolatie te onderzoeken. Vochtplekken, beschadigd voegwerk of eerdere ingrepen vragen eerst om extra aandacht; isoleren is geen reparatie voor een lekkende gevel.",
      "Vuil, oude isolatie of verbindingen in de spouw kunnen de aanpak beïnvloeden. Ook de slagregendichtheid van het buitenblad is relevant; een snelle keuze op basis van alleen woningbouwjaar is onvoldoende.",
      "Een specialist beoordeelt gevel en spouw voordat materiaal en methode worden besproken. Als de gevel herstel nodig heeft, hoort dat vóór de definitieve isolatiekeuze te worden afgestemd.",
      "Vraag hoe geschiktheid wordt vastgesteld en welke delen van de gevel in de opdracht vallen. Bespreek afwerking van boorgaten en wat gebeurt als de spouw niet geschikt blijkt.",
      "Maak foto's van gevels en vochtplekken en vermeld eerdere isolatie of gevelreparaties. Geef aan of het om alle gevels of slechts één zijde gaat.",
      "Geveloppervlak, spouwtoestand, materiaalkeuze, hoogte, bereikbaarheid en eventueel voegwerkherstel sturen de kosten. Vraag om een offerte na geschiktheidsbeoordeling."
    ],
    faqs: [
      ["Heeft iedere woning een isolabele spouw?", "Nee. Aanwezigheid en staat van de spouw moeten eerst worden onderzocht."],
      ["Kan ik isoleren bij vochtplekken?", "Laat de oorzaak van vocht eerst beoordelen; spouwisolatie verhelpt geen lekkage of gebrekkig metselwerk."],
      ["Worden boorgaten zichtbaar?", "De afwerking van openingen hoort vooraf te worden besproken en in de offerte te staan."],
      ["Wat als er al isolatiemateriaal zit?", "Dat kan de mogelijkheden veranderen. Een specialist onderzoekt wat aanwezig is en of aanvullend werk zinvol is."]
    ]
  },
  "isolatie/vloerisolatie": {
    title: "Vloerisolatie laten aanbrengen? | VakConnect",
    description: "Koude vloer of tocht langs de vloer? Lees over vloertype, kruipruimte, vocht en toegang en vraag isolatiewerk aan via VakConnect.",
    h1: "Vloerisolatie laten aanbrengen?",
    lead: "Een koude vloer kan vanuit de kruipruimte of via een andere aanpak worden geïsoleerd. Vertel welk vloertype je hebt en of de ruimte eronder bereikbaar is.",
    details: [
      "Vloerisolatie vermindert warmteverlies via de vloer, maar de methode verschilt per vloerconstructie. Een houten vloer met kruipruimte vraagt andere keuzes dan een massieve vloer zonder toegang eronder.",
      "Koude voeten en tocht langs de vloer kunnen redenen zijn om de opbouw te bekijken. Bij vocht of schimmel onder de vloer is eerst onderzoek nodig; isoleren mag bestaande problemen niet verbergen.",
      "Hoogte en bereikbaarheid van een kruipruimte bepalen of de onderzijde van de vloer kan worden behandeld. Bij leidingen en ventilatieopeningen is maatwerk nodig om toegang en luchtstroming niet onbedoeld te belemmeren.",
      "Een specialist beoordeelt vloertype, droogte en toegang en bespreekt welke methode technisch past. Als de vloer toch open gaat voor renovatie, kan een aanpak aan de bovenzijde een andere mogelijkheid zijn.",
      "Vraag hoe vocht, ventilatie en bestaande leidingen worden meegenomen. Laat materiaal, behandeld oppervlak en eventuele voorbereidende werkzaamheden in de offerte vastleggen.",
      "Vermeld vloeroppervlak, type vloer als bekend en de plek van een kruipluik. Foto's van bereikbare delen en informatie over eerdere vochtklachten zijn nuttig.",
      "Oppervlak, methode, bereikbaarheid, vloerconstructie en noodzakelijke voorbereiding bepalen de kosten. Extra werk aan vocht of beschadigde vloeronderdelen moet apart worden beoordeeld."
    ],
    faqs: [
      ["Kan ik een vloer zonder kruipruimte isoleren?", "Mogelijk wel, maar de aanpak verschilt en kan gevolgen hebben voor vloerhoogte en afwerking. Laat de opbouw beoordelen."],
      ["Moet een kruipruimte droog zijn?", "Vochttoestand is een belangrijk onderdeel van de beoordeling; los oorzaken van ernstige vochtproblemen niet op met alleen isolatie."],
      ["Blijft kruipruimteventilatie nodig?", "De bestaande ventilatie moet bij het isolatieplan worden betrokken, niet zomaar worden afgesloten."],
      ["Wat als er veel leidingen onder de vloer lopen?", "Dat beïnvloedt bereikbaarheid en uitvoering; meld aanwezige leidingen bij de aanvraag."]
    ]
  },
  "isolatie/gevelisolatie": {
    title: "Gevelisolatie laten plaatsen? | VakConnect",
    description: "Gevel isoleren aan binnen- of buitenzijde? Lees over vocht, gevelbeeld en aansluitingen en beschrijf je project via VakConnect.",
    h1: "Gevelisolatie laten plaatsen?",
    lead: "Als spouwisolatie niet past of je de gevel toch vernieuwt, kan isolatie aan de gevel een optie zijn. Beschrijf gevelmateriaal, vochtklachten en gewenste uitstraling.",
    details: [
      "Gevelisolatie kan aan de binnenzijde of buitenzijde worden overwogen. Beide keuzes beïnvloeden aansluitingen bij kozijnen, dakrand en fundering en hebben een ander effect op ruimte of gevelbeeld.",
      "Een koude gevel, geplande gevelrenovatie of ontbrekende geschikte spouw kan aanleiding zijn. Onderzoek bestaande vochtproblemen vóórdat een nieuwe laag de oude gevel afdekt.",
      "Scheuren, slecht voegwerk en lekkende aansluitingen moeten worden beoordeeld. Binnenisolatie kan ruimte innemen; buitenisolatie verandert de afwerking en soms de maatvoering bij ramen en dak.",
      "Een specialist vergelijkt de opbouw van de bestaande wand met de gewenste aanpak en stemt details rond openingen en ventilatie af. De bestaande gevel moet geschikt zijn voordat het afwerksysteem wordt gekozen.",
      "Vraag wie kozijnen, dakranden en plinten aanpast en welke gevelafwerking is inbegrepen. Bij verandering van het gevelbeeld kunnen gemeentelijke regels spelen; controleer de situatie vooraf.",
      "Maak foto's van alle gevelzijden, noteer vochtplekken en geef aan of kozijnen binnenkort worden vervangen. Samenhang in de planning kan dubbele werkzaamheden voorkomen.",
      "Geveloppervlak, aantal openingen, bereikbaarheid, isolatiemethode, herstel van bestaande gevel en afwerking sturen de kosten. Bouwkundige aanpassingen horen als aparte posten in een offerte."
    ],
    faqs: [
      ["Wat is het verschil met spouwmuurisolatie?", "Spouwisolatie gebruikt een bestaande holle ruimte; gevelisolatie aan binnen- of buitenzijde verandert de wandopbouw en aansluitdetails."],
      ["Kan de buitengevel er hetzelfde uit blijven zien?", "Dat hangt van de gekozen afwerking en detaillering af. Bespreek ook eventuele lokale eisen aan het gevelbeeld."],
      ["Moet vocht in de gevel eerst worden onderzocht?", "Ja, een nieuwe isolatielaag mag een actieve vochtbron niet aan het zicht onttrekken."],
      ["Waarom zijn kozijnen belangrijk?", "De nieuwe wanddikte verandert aansluitingen rond ramen en deuren; laat die details mee ontwerpen."]
    ]
  },
  "isolatie/kruipruimte-isolatie": {
    title: "Kruipruimte laten isoleren? | VakConnect",
    description: "Koude of vochtige kruipruimte? Lees over bodem en vloer, toegang en ventilatie en vraag passend isolatieadvies via VakConnect.",
    h1: "Kruipruimte laten isoleren?",
    lead: "Een kruipruimte met vocht of weinig werkhoogte vraagt eerst onderzoek van de situatie. Beschrijf toegang, vloer en eventuele wateroverlast voordat je een methode kiest.",
    details: [
      "Kruipruimte-isolatie kan zich richten op de onderkant van de vloer of op de bodem van de kruipruimte. De keuze hangt af van werkhoogte, vocht, vloertype en wat je wilt verbeteren.",
      "Een koude vloer, muffe lucht of zichtbare condens zijn redenen om de ruimte te laten beoordelen. Stilstaand water vraagt ook onderzoek naar de oorzaak; isolatiemateriaal alleen verhelpt geen lekkage.",
      "Leidingen, lage balken en nauwe toegang beperken de uitvoering. Bij een houten vloer zijn de staat van het hout en de ventilatie extra belangrijk voordat de opbouw verandert.",
      "Een vakman beoordeelt of de vloer of bodem bereikbaar en geschikt is. Daarna wordt een isolatiemethode gekozen die rekening houdt met vocht, leidingen en noodzakelijke ventilatie.",
      "Vraag welk oppervlak wordt behandeld en hoe ventilatieopeningen en toegangspunten beschikbaar blijven. Laat maatregelen voor waterproblemen los van het isolatiewerk omschrijven.",
      "Geef de locatie en afmeting van het luik, het vloertype en foto's van de kruipruimte voor zover veilig bereikbaar. Meld water na zware regen of eerdere schade aan houten delen.",
      "Werkhoogte, oppervlak, methode, materiaal en vochtproblemen bepalen de kosten. Herstel van leidingen of houtconstructie kan de opdracht uitbreiden en vraagt eigen beoordeling."
    ],
    faqs: [
      ["Wat is het verschil met vloerisolatie?", "Kruipruimte-isolatie kan bodem of vloeronderzijde betreffen; vloerisolatie richt zich op de vloerconstructie zelf."],
      ["Kan er geïsoleerd worden als er water staat?", "Eerst moet de wateroverlast worden beoordeeld; het materiaal en de methode moeten bij de omstandigheden passen."],
      ["Mogen ventilatieopeningen dicht?", "Niet zonder deskundige beoordeling. Ventilatie kan van belang zijn voor vochtbeheer onder de vloer."],
      ["Wat als het kruipluik erg klein is?", "Toegankelijkheid bepaalt welke inspectie en uitvoering mogelijk zijn. Vermeld dit vooraf bij de aanvraag."]
    ]
  },
  "verbouwing/aanbouw": {
    title: "Aanbouw laten realiseren? | VakConnect",
    description: "Een aanbouw plannen? Lees over ontwerp, fundering, constructie, dak en vergunningcontext en beschrijf je project op VakConnect.",
    h1: "Aanbouw laten realiseren?",
    lead: "Extra ruimte naast je woning begint met een haalbaar plan voor fundering, aansluiting op het huis en installaties. Beschrijf waar je wilt bouwen en hoe je de nieuwe ruimte gebruikt.",
    details: [
      "Een aanbouw voegt een bouwdeel aan de woning toe. Ontwerp, fundering, dragende constructie, gevel, dak, kozijnen en afwerking moeten samen worden bekeken voordat er een uitvoerbare scope is.",
      "Een extra kamer of ruimere entree kan aanleiding zijn. De beschikbare grond, toegang voor materieel en ligging van leidingen bepalen vroeg welke ontwerpen praktisch haalbaar zijn.",
      "Bodem en bestaande fundering zijn niet automatisch geschikt voor een uitbreiding. De aansluiting op de bestaande gevel en het dak verdient aandacht tegen waterinloop; een doorbraak vraagt constructieve beoordeling.",
      "Een ontwerp wordt afgestemd met bouwkundige randvoorwaarden, eventuele vergunningen en daarna met uitvoerende disciplines. Installaties, isolatie en binnenafwerking worden bij voorkeur vóór de start van de ruwbouw gepland.",
      "Vraag wie ontwerp, constructieberekeningen en eventuele vergunningcontrole regelt. Spreek af waar de verantwoordelijkheid voor aansluitingen op bestaand werk ligt en hoe wijzigingen bij onverwachte ondergrond worden behandeld.",
      "Maak een schets van locatie, gewenste afmetingen en functie van de ruimte. Geef aan hoe het terrein bereikbaar is en welke ramen, verwarming en elektrische punten je verwacht.",
      "Afmetingen, fundering, constructie, dak, kozijnen, bereikbaarheid, installaties en afwerkingsniveau bepalen de kosten. Vergelijk voorstellen op dezelfde scope inclusief sloop, puinafvoer en eventueel ontwerpwerk."
    ],
    faqs: [
      ["Is voor een aanbouw altijd een vergunning nodig?", "Dat verschilt per plek en ontwerp. Controleer de actuele regels voor jouw situatie voordat uitvoering wordt vastgelegd."],
      ["Waarom moet de fundering vroeg worden beoordeeld?", "De ondergrond en bestaande woning bepalen mede welke constructie haalbaar is en welke kostenposten nodig zijn."],
      ["Zijn elektra en verwarming inbegrepen?", "Niet vanzelf. Laat installaties en afwerking afzonderlijk in het voorstel benoemen."],
      ["Wat gebeurt er bij de aansluiting op het bestaande dak?", "Die moet als onderdeel van het ontwerp waterdicht en bouwkundig passend worden uitgewerkt; vraag wie dit uitvoert."]
    ]
  },
  "verbouwing/uitbouw": {
    title: "Uitbouw laten maken? | VakConnect",
    description: "Woonkamer of keuken uitbreiden? Lees over doorbraak, fundering, licht, dak en afwerking en vraag een vakman aan via VakConnect.",
    h1: "Uitbouw laten realiseren?",
    lead: "Een uitbouw verandert de overgang tussen bestaande kamer en nieuwe ruimte. Geef aan welke gevel open moet, hoe je daglicht wilt behouden en wat de nieuwe ruimte nodig heeft.",
    details: [
      "Bij een uitbouw wordt bestaande woonruimte uitgebreid met een nieuw bouwdeel. De constructieve doorbraak, vloer, fundering, dak en buitenschil moeten als één geheel worden ontworpen.",
      "Een krappe keuken of woonkamer kan aanleiding zijn. Bepaal hoe het bestaande deel tijdens het werk gebruikt wordt en of de nieuwe ruimte een andere indeling van elektra, water en verwarming vraagt.",
      "Een te ruime opening zonder passend constructief plan is geen optie. Ook dakafwatering en aansluiting op het bestaande huis vragen aandacht; bestaande leidingen in de gevel of grond kunnen de planning beïnvloeden.",
      "Een specialist brengt maten en bestaande constructie in kaart, toetst vergunningcontext en bespreekt volgorde van fundering, ruwbouw, installaties en afwerking. Kozijnen en daklichten bepalen mede het daglicht in de verdiepte ruimte.",
      "Vraag wie de doorbraak berekent en uitvoert en welke tijdelijke voorzieningen voor de woning worden getroffen. Leg vast wat onder binnenafwerking valt, zoals vloer, plafond, schilderwerk en keukenaanpassingen.",
      "Maak foto's van de gevel en huidige kamer en noteer gewenste diepte en gebruik. Geef plannen voor keuken of pui door, zodat aansluitingen in de juiste fase worden meegenomen.",
      "Oppervlak, fundering, constructieve doorbraak, kozijnen, dak en afwerkingsniveau bepalen de kosten. Een offerte zonder installaties en binnenwerk is niet vergelijkbaar met een volledig afgewerkt voorstel."
    ],
    faqs: [
      ["Kan de hele achtergevel worden geopend?", "Dat vraagt constructieve beoordeling en een passend ontwerp; de mogelijkheden verschillen per woning."],
      ["Wat is het verschil met een aanbouw?", "Een uitbouw vergroot doorgaans een bestaande ruimte; een aanbouw kan een afzonderlijke nieuwe ruimte vormen. De technische scope blijft projectspecifiek."],
      ["Moet ik vergunningen regelen?", "Dat hangt af van afmetingen, locatie en lokale regels. Laat voor jouw ontwerp controleren wat van toepassing is."],
      ["Wanneer kies ik kozijnen en daklichten?", "Neem die vroeg in het ontwerp mee, omdat daglicht, constructie en dakdetails ervan afhangen."]
    ]
  },
  "verbouwing/zolder-verbouwen": {
    title: "Zolder laten verbouwen? | VakConnect",
    description: "Zolder als extra kamer gebruiken? Lees over indeling, dakisolatie, daglicht, trap en elektra en beschrijf je plan via VakConnect.",
    h1: "Zolder laten verbouwen?",
    lead: "Van opslag naar bruikbare kamer vraagt aandacht voor hoogte, daglicht en bereikbaarheid. Beschrijf de huidige dakopbouw en wat je met de zolder wilt doen.",
    details: [
      "Een zolderverbouwing combineert indeling, isolatie, ventilatie, daglicht, elektra en afwerking. Als de ruimte intensief gebruikt wordt, worden ook verwarming en de toegang via de trap belangrijk.",
      "Een werk- of slaapkamer op zolder kan reden zijn voor verbouwing. Controleer eerst bruikbare stahoogte, vloerbelasting en bestaande vochtplekken voordat de plattegrond definitief wordt.",
      "Schuine dakvlakken beperken plaatsing van meubels en ramen. Een dakkapel kan extra hoogte geven maar vraagt beoordeling van dakconstructie, waterdichte aansluiting en eventuele gemeentelijke regels.",
      "Een vakman bespreekt de dakopbouw, vocht en isolatie voordat wanden worden gesloten. Daarna kunnen lichtpunten, stopcontacten, verwarming, trapaanpassingen en afwerking in samenhang worden gepland.",
      "Vraag wie constructieve aandachtspunten en ventilatie beoordeelt en of dakkapel, dakramen of trap bij de offerte horen. Laat de bestaande dakbedekking eerst op lekkage controleren.",
      "Maak een schets met maten onder de schuine delen, foto's van de dakconstructie en positie van de trap. Vermeld of leidingen en verwarming al aanwezig zijn.",
      "Daktoestand, isolatie, trap, daglichtvoorzieningen, extra installaties en afwerking bepalen de kosten. Constructieve aanpassingen en vergunningswerk moeten afzonderlijk worden toegelicht."
    ],
    faqs: [
      ["Heb ik altijd een dakkapel nodig?", "Nee. De gewenste functie, bestaande hoogte en daglicht bepalen of dakramen of andere indelingen voldoende zijn."],
      ["Kan de bestaande trap blijven?", "Dat hangt af van toegang, bruikbaarheid en eventuele eisen voor de nieuwe functie van de ruimte."],
      ["Moet dakisolatie vóór afwerking?", "De opbouw, vochttoestand en ventilatie moeten eerst worden beoordeeld voordat de definitieve binnenafwerking wordt geplaatst."],
      ["Kan een zoldervloer alle nieuwe belasting aan?", "Dat vraagt beoordeling van de constructie en de geplande inrichting; ga niet uit van de huidige opslagfunctie."]
    ]
  },
  "verbouwing/woning-renoveren": {
    title: "Woning laten renoveren? | VakConnect",
    description: "Woningrenovatie in fases of als totaalproject? Lees over prioriteiten, installaties en coördinatie via VakConnect.",
    h1: "Woning laten renoveren?",
    lead: "Bij een woningrenovatie bepaalt de volgorde van constructie, installaties en afwerking of werk later weer open moet. Beschrijf de staat van de woning en je prioriteiten.",
    details: [
      "Een woningrenovatie kan variëren van enkele ruimtes tot een brede aanpak van bouwschil, installaties en binnenafwerking. Definieer per onderdeel of het om herstel, verduurzaming of herindeling gaat.",
      "Verouderde leidingen, vochtproblemen of een onpraktische plattegrond kunnen aanleiding zijn. Bepaal welke gebreken eerst opgelost moeten worden voordat nieuwe vloer- of wandafwerking wordt gekozen.",
      "Achter oude afwerking kunnen constructieve of vochtschades zichtbaar worden. Ook de staat van elektra en verwarming is relevant wanneer muren en vloeren toch open liggen.",
      "Een project begint met inventarisatie en een logische volgorde: onderzoek, eventueel sloop, constructie, installaties en pas daarna afwerking. Bij gefaseerd werk moeten aansluitingen tussen oude en nieuwe delen worden gepland.",
      "Vraag wie disciplines coördineert en wijzigingen goedkeurt. Leg vast welke ruimtes bewoonbaar blijven, wie materialen levert en hoe onverwachte gebreken na sloop worden begroot.",
      "Maak een lijst van ruimtes, technische klachten en gewenste eindkwaliteit. Foto's, bestaande tekeningen en eerdere onderzoeken helpen om de eerste scope realistisch te maken.",
      "Omvang, staat van het huis, sloop, installaties, aantal disciplines en afwerkingsniveau bepalen de kosten. Vergelijk offertes alleen als dezelfde onderdelen en verantwoordelijkheden zijn opgenomen."
    ],
    faqs: [
      ["Kan een renovatie per ruimte worden uitgevoerd?", "Soms wel; houd rekening met leidingen en afwerking die meerdere ruimtes verbinden, zodat werk niet dubbel gebeurt."],
      ["Wat moet eerst: isolatie of binnenafwerking?", "Dat hangt van de opbouw af, maar verborgen gebreken en installaties horen vóór definitieve afwerking te worden beoordeeld."],
      ["Wie stemt de verschillende vakmensen af?", "Spreek één aanspreekpunt en een duidelijke taakverdeling af voordat de uitvoering begint."],
      ["Hoe ga ik om met verborgen gebreken?", "Vraag hoe ze worden gemeld en begroot, en spreek af dat aanvullend werk pas na overleg plaatsvindt."]
    ]
  },
  "verbouwing/keuken-verbouwen": {
    title: "Keuken laten verbouwen? | VakConnect",
    description: "Nieuwe keukenindeling plannen? Lees over water, elektra, ventilatie en afwerking en plaats je keukenklus via VakConnect.",
    h1: "Keuken laten verbouwen?",
    lead: "Een kookeiland of nieuwe apparaten vragen een andere planning van aansluitingen. Deel je huidige plattegrond en gewenste indeling voordat wanden en vloeren worden afgewerkt.",
    details: [
      "Keukenverbouwing omvat vaak sloop, aanpassing van water en afvoer, elektra, ventilatie en plaatsing van meubels. Een keuken op dezelfde plek is technisch anders dan een verplaatsing naar een andere wand.",
      "Gebrekkige werkruimte, verouderde aansluitingen of de wens voor nieuwe apparatuur zijn aanleidingen. Controleer vroeg of het ontwerp past bij de bestaande afvoer en elektrische installatie.",
      "Een kookplaat, oven en andere apparaten kunnen een aanpassing van groepen vragen; een spoelbak of vaatwasser heeft toevoer en afvoer nodig. De route onder de vloer of achter de wand bepaalt de haalbaarheid.",
      "Een vakman stemt sloop, leiding- en elektrawerk af op het definitieve keukenplan. Pas als posities zijn gecontroleerd, kunnen wandafwerking, vloer en montage logisch op elkaar volgen.",
      "Vraag wie meubels en apparaten levert en aansluit, wie eventuele wandopeningen sluit en hoe ventilatie wordt meegenomen. Laat maten en posities toetsen vóór het bestellen van een keuken.",
      "Maak een schets met aansluitpunten, apparatuur en afmetingen. Vermeld wat van de oude keuken blijft en of de ruimte tijdens de verbouwing deels nodig is.",
      "Verleggen van aansluitingen, staat van elektra, sloop, meubels, apparaten en herstel van vloer en wanden bepalen de kosten. Splits installatie, montage en afwerking in offertes."
    ],
    faqs: [
      ["Kan een spoelbak naar een kookeiland?", "De afvoerroute en vloeropbouw moeten geschikt zijn; laat het plan toetsen voordat je het eiland bestelt."],
      ["Is voor inductie een nieuwe groep nodig?", "Dat hangt af van de kookplaat en bestaande installatie. Een elektricien beoordeelt de passende voorziening."],
      ["Wie monteert en sluit de apparatuur aan?", "Leg vast welke partij levering, montage, water en elektra verzorgt zodat verantwoordelijkheden helder zijn."],
      ["Wanneer moet het keukenontwerp definitief zijn?", "Vóór leidingen en elektra definitief worden aangelegd, anders kunnen aansluitpunten verkeerd uitkomen."]
    ]
  },
};

const practicalNotes: Record<string, string> = {
  "dakdekker/daklekkage": "Bij regen met wind kan water onder een aansluiting worden gedreven waar het bij rustige regen droog blijft. Noteer daarom niet alleen het tijdstip van lekkage, maar ook of windrichting verschil maakt. Een nieuwe vochtplek na eerdere reparatie kan wijzen op een tweede defect of op water dat in de constructie is achtergebleven. Spreek af of de vakman terugkoppelt welke lekroute hij heeft gevonden; pas dan kun je beoordelen of ook aangetaste isolatie of plafondafwerking aandacht nodig heeft.",
  "dakdekker/dakrenovatie": "Een voorstel voor dakrenovatie is pas vergelijkbaar als duidelijk is wat blijft zitten. Vraag of panlatten, isolatie, oude bedekking en aansluitingen in de scope vallen, en welke delen pas na het openen kunnen worden beoordeeld. Denk ook aan bereikbaarheid voor bewoners en aan het moment waarop zonnepanelen of een dakraam tijdelijk moeten worden verwijderd. Een strak gepland project blijft afhankelijk van de staat die bij demontage zichtbaar wordt.",
  "dakdekker/dakpannen-vervangen": "Als een identiek type dakpan niet meer beschikbaar is, kan een reparatie technisch lastiger zijn dan een foto van de schade doet vermoeden. Bespreek of passende vervangende pannen te vinden zijn en hoe verschil in kleur of profiel eruitziet. Bij pannen die op meerdere dakvlakken losraken, is het verstandig niet alleen de kapotte exemplaren te tellen maar ook hun bevestiging en onderlaag te laten beoordelen.",
  "dakdekker/plat-dak": "Bitumen kan scheuren of blazen vertonen zonder dat elk zichtbaar gebrek direct water doorlaat. Omgekeerd kan een lek onder een ogenschijnlijk gaaf vlak ontstaan bij een kleine aansluiting van een dakdoorvoer. Vraag de vakman om die details te controleren en de staat van de bestaande laag te onderbouwen voordat er overlagen wordt voorgesteld. Water dat op isolatie blijft staan verandert de keuze voor herstel.",
  "dakdekker/schoorsteen": "Bij een schoorsteen met scheuren in de bovenplaat kan water in het metselwerk trekken en lager bij de dakdoorvoer naar binnen komen. Dat maakt een enkele natte plek binnen geen betrouwbaar bewijs voor een defecte loodslab. Laat een voorstel daarom beschrijven of de bovenkant, voegwerk en aansluiting zijn beoordeeld. Bij verwijderen van een ongebruikte schoorsteen moet ook de nieuwe dakopbouw volledig worden afgewerkt.",
  "dakdekker/nokvorsten": "Schade aan de nok wordt soms pas na een storm opgemerkt, terwijl andere delen van de bevestiging al langer verzwakt kunnen zijn. Laat niet alleen de losse vorst, maar ook de aansluitende delen en de pannen direct onder de nok bekijken. Het doel is een nok die bij het bestaande dak past; een reparatie die alleen de zichtbare scheur vult, pakt een slechte bevestiging niet vanzelf aan.",
  "dakdekker/dakgoot": "Een overlopende goot kan schade geven aan boeiboord, gevel en kozijnen zonder dat de goot zelf lek is. Vergelijk een klacht bij hevige regen met het verloop op een droge dag en noteer waar het water verschijnt. Als een regenpijp niet afvoert, maakt vervanging van alleen de goot het probleem niet weg. Vraag of uitlopen en aansluitingen bij de afvoer meedoen.",
  "dakdekker/dakkapel": "De overgang tussen dakkapel en hellend dak heeft meerdere lagen en materialen. Een vakman moet onderscheid kunnen maken tussen water dat door het dakkapeldak komt en vocht dat via het raam of de zijwang loopt. Laat bij een offerte benoemen welke overgang wordt geopend en hoe die weer waterdicht wordt afgewerkt. Vraag ook naar eventuele schade achter de binnenbekleding.",
  "dakdekker/dakinspectie": "Een inspectie kan geruststellend zijn, maar is niet hetzelfde als garantie dat nergens verborgen schade bestaat. Vraag daarom welke dakdelen de vakman daadwerkelijk kan bekijken en welke alleen na openen toegankelijk worden. Een verslag met foto's, locatie van gebreken en voorgestelde prioriteit helpt bij het afwegen van onderhoud tegen renovatie en bij het vergelijken van latere hersteloffertes.",
  "schilder/binnenschilderwerk": "Bij een ruimte die dagelijks gebruikt wordt, bepaalt de werkvolgorde hoeveel overlast je ervaart. Bespreek eerst welke meubels weg kunnen en welke deuren toegankelijk moeten blijven. Laat onregelmatige wanden of vlekken vóór de definitieve kleurkeuze beoordelen; op grote vlakken en bij schuin invallend licht valt herstel sterker op dan op een klein kleurenstaal.",
  "schilder/buitenschilderwerk": "De zuid- en westzijde van een woning kunnen anders verweren dan beschutte gevels. Vraag daarom om beoordeling per zijde in plaats van uit te gaan van één uniforme schilderbeurt. Als zachte plekken of open naden pas tijdens het voorbereiden zichtbaar worden, bespreek dan vooraf hoe houtreparatie wordt aangeboden en of dat de planning beïnvloedt.",
  "schilder/kozijnen-schilderen": "De onderdorpel krijgt veel regen en zon en verdient aparte aandacht bij inspectie van houten kozijnen. Een raam dat tijdens het schilderen gesloten moet blijven, kan invloed hebben op dagelijks gebruik van de ruimte. Vraag hoe de schilder randen en beslag behandelt en wanneer het raam weer normaal kan worden bediend zonder de nieuwe afwerking te beschadigen.",
  "schilder/deuren-schilderen": "Bij een deur met panelen, ruiten of reliëf is het werk anders dan bij een vlak deurblad. Ook de randen en onderkant kunnen aandacht vragen, vooral bij buitendeuren waar vocht in het hout kan komen. Laat vooraf afspreken of sloten, scharnieren en tochtvoorzieningen blijven zitten en hoe de deur tussentijds veilig afsluitbaar blijft.",
  "schilder/plafond-schilderen": "Een plafond met oude waterschade vraagt eerst een controle van de lekkagebron. Kijk vervolgens ook naar hoe eerdere reparaties de structuur van het plafond hebben veranderd. Vraag de schilder om een voorstel dat herstel van de ondergrond onderscheidt van schilderen; alleen een extra laag over een ongelijk vlak maakt verschillen vaak niet onzichtbaar.",
  "loodgieter/lekkage": "Bij een verborgen lek kan de natste plek een gevolg zijn van water dat onder een vloer of langs een leiding verder is gelopen. Een beschrijving van wanneer de schade optrad en welke toestellen gebruikt zijn, helpt het onderscheid tussen afvoer en toevoer maken. Vraag na reparatie hoe de vakman controleert dat de bron is verholpen en wat er moet gebeuren met achtergebleven vocht.",
  "loodgieter/verstopping": "Als de gootsteen alleen traag leegloopt maar douche en toilet goed werken, kan het probleem dichtbij de keuken zitten. Bij terugslag op meerdere plekken is juist het gedeelde traject verdacht. Meld of eerdere ontstoppingen kort hielpen: dat is relevante informatie voor het afwegen van reinigen tegen inspectie van de leiding zelf.",
  "loodgieter/leidingwerk": "Bij verlegging voor een keuken of badkamer is de uiteindelijke positie van toestellen belangrijker dan een eerste schets. Wijzigingen nadat de vloer is gesloten kunnen opnieuw hak- of breekwerk geven. Spreek daarom een controlemoment af vóór afwerking en laat vastleggen welke aansluitpunten ook na montage bereikbaar blijven.",
  "loodgieter/sanitair": "Een nieuw toestel kan niet alleen qua uiterlijk, maar ook qua bevestigingspunten en afvoerpositie afwijken van het oude. Controleer vooraf of oude gaten achter het nieuwe sanitair verdwijnen of apart moeten worden afgewerkt. Bij een gedeelde badkamer telt ook of het toilet of de wastafel tijdens de werkzaamheden beschikbaar blijft.",
  "loodgieter/spoed": "Voor een urgente aanvraag is de ernst van het probleem informatiever dan alleen het woord spoed. Leg uit of water nog actief binnenkomt, wat al nat is en welke voorzieningen niet bruikbaar zijn. Een passende vakman beslist zelf of hij de aanvraag kan oppakken; maak prijs en vervolgstappen rechtstreeks met hem duidelijk vóór het werk.",
  "loodgieter/afvoer": "Een afvoer die telkens weer lekt bij dezelfde aansluiting kan om een nieuwe verbinding vragen, terwijl herhaalde blokkades in een verder gelegen traject een andere diagnose nodig hebben. Benoem of de afvoer achter een keukenmeubel, onder een douchevloer of in de kruipruimte ligt: bereikbaarheid verandert de opdracht wezenlijk.",
  "elektricien/groepenkast": "Bij een verbouwing worden nieuwe apparaten soms afzonderlijk gekozen terwijl hun gezamenlijke belasting nog niet is bekeken. Geef de elektricien daarom het volledige plan, inclusief keuken, verwarming en mogelijke laadvoorziening. Vraag welke werkzaamheden echt nodig zijn voor de nieuwe groepen en of de bestaande bedrading en aansluiting de gewenste indeling toelaten.",
  "elektricien/storing": "Een storing die telkens bij hetzelfde gebruik terugkomt, kan een ander onderzoek vragen dan een willekeurige uitval zonder duidelijke aanleiding. Noteer wanneer en in welke ruimte het gebeurt, maar probeer elektrische onderdelen niet zelf te openen. Maak onderscheid tussen een tijdelijk weer werkende aansluiting en een oorzaak die aantoonbaar is vastgesteld.",
  "elektricien/stopcontacten": "Bij extra punten achter een keukenblad is de exacte positie van kasten en apparatuur bepalend. Een paar centimeter verschil kan een contactdoos slecht bereikbaar maken. Laat het definitieve meubelplan daarom eerst controleren en spreek af of kabels zichtbaar worden geleid of in de wand verdwijnen.",
  "elektricien/verlichting": "Een lichtplan wordt praktischer als de schakelaar op de gebruiksroute zit en werkplekken niet in de schaduw van meubels vallen. Noteer welke punten samen moeten schakelen en waar je eventueel wilt dimmen. Zo kan de elektricien beoordelen of de bestaande bedrading en armaturen geschikt zijn voor de gewenste bediening.",
  "elektricien/krachtstroom": "Een verzoek om krachtstroom zonder gegevens van het apparaat is moeilijk te beoordelen. Nominaal vermogen en aansluitwijze staan doorgaans bij de productspecificaties. Laat de elektricien die informatie afzetten tegen de bestaande netaansluiting en andere verbruikers; de uitvoering van een nieuwe groep alleen zegt nog niet dat het apparaat veilig kan worden aangesloten.",
  "kozijnen/kunststof-kozijnen": "Een nieuw kozijn kan de kier rond een oud raam wegnemen, maar dat verandert ook hoe verse lucht binnenkomt. Bespreek ventilatie per ruimte en controleer of gekozen draaiende delen passen bij de inrichting. Bij vervanging in oude sparingen kan de binnenafwerking anders uitvallen dan op een productfoto; laat de aansluitdetails opnemen.",
  "kozijnen/houten-kozijnen": "Bij houtrot is vooral de diepte en plaats van de schade relevant. Een kleine plek in een goed bereikbaar deel vraagt een andere afweging dan aantasting van meerdere dorpels en verbindingen. Laat niet alleen de zichtbare schade, maar ook de oorzaak van vocht bekijken; anders loopt een gerepareerd kozijn opnieuw risico.",
  "kozijnen/aluminium-kozijnen": "Bij grote glasvlakken is de maatvoering van profiel, glas en draagconstructie belangrijker dan alleen het gewenste aanzicht. Bespreek waar ramen open moeten kunnen en hoe zon en ventilatie de ruimte beïnvloeden. Vraag om een tekening of maatopgave die je kunt toetsen aan de bestaande gevel voordat productie begint.",
  "kozijnen/kozijnen-vervangen": "Een vergelijking tussen hout, kunststof en aluminium is pas nuttig als ook glas, bediening en afwerking gelijk zijn meegenomen. Vraag per kozijn welk deel van de oude situatie verdwijnt en hoe gevel en vensterbank daarna aansluiten. Bij meerdere kozijnen kan een gefaseerde aanpak overlast beperken, maar ook dubbele toegangskosten geven.",
  "kozijnen/ramen-en-deuren": "Een buitendeur met nieuwe drempel beïnvloedt de aansluiting op vloer en gevel. Bij ramen gaat het juist vaak om de bediening en ventilatie op de plek waar ze gebruikt worden. Maak in één aanvraag per opening duidelijk wat je wilt behouden: zo voorkom je dat een voorstel voor alleen nieuwe elementen noodzakelijke herstelwerkzaamheden overslaat.",
  "badkamer/renovatie": "Als één badkamer in huis aanwezig is, bepaalt de volgorde van sloop, leidingen en tegelwerk hoe lang voorzieningen ontbreken. Vraag daarom om een planning per fase zonder een vaste duur als garantie te behandelen. Bespreek ook wie na iedere discipline controleert of leidingen en waterdichting gereed zijn voor de volgende afwerking.",
  "badkamer/tegelen": "Een tegelpatroon dat op een kleine wand goed lijkt, kan bij nissen, hoeken en leidingdoorvoeren veel snijwerk opleveren. Bespreek waar voegen en snijlijnen komen voordat de eerste tegel wordt gezet. Controleer ook of de gekozen vloertegel en het afschot passen bij de doucheopbouw.",
  "badkamer/sanitair": "Wanneer de bestaande wastafel verdwijnt, kunnen oude tegelgaten en verkleuring zichtbaar worden. Een groter meubel bedekt niet automatisch alle schade en kan een andere afvoerhoogte vragen. Controleer daarom maatvoering van product en aansluitingen samen met de uitvoerder vóór bestelling.",
  "badkamer/inloopdouche": "Een vlakke instap kan aantrekkelijk zijn, maar er moet voldoende ruimte zijn voor de afvoer en het afschot. Een glaswand beschermt alleen de delen die binnen het ontwerp vallen; denk ook aan de plaats van handdoeken en deur. Laat de vakman de volledige natte zone beschrijven, niet alleen de zichtbare vloer.",
  "badkamer/complete-badkamer": "Bij een compleet project is een mooi ontwerp pas uitvoerbaar wanneer leidingen, vloerhoogte en aansluitingen zijn getoetst. Vraag per fase wie controleert voordat het volgende onderdeel de onderliggende werkzaamheden afdekt. Leg productleveringen en mogelijke afwijkingen na sloop vast om discussies over extra werk te voorkomen.",
  "badkamer/ventilatie": "Een ventilator die wel draait maar geen vocht afvoert kan op een probleem in het kanaal of de luchttoevoer wijzen. Beschrijf niet alleen schimmelplekken, maar ook hoe lang condens zichtbaar blijft en of het raam open kan. Een gericht onderzoek maakt het verschil tussen reinigen, aanpassen en een nieuwe voorziening.",
  "isolatie/dakisolatie": "Een dampremmende laag moet worden afgestemd op de volledige bestaande dakopbouw; een los advies voor alleen materiaal is onvoldoende. Bij een dakkapel of dakraam verdienen overgangen aparte aandacht. Vraag hoe een specialist bestaand vocht beoordeelt en welke delen zichtbaar blijven voor controle na het isoleren.",
  "isolatie/spouwmuurisolatie": "De staat van de buitengevel telt mee: open voegen of langdurig vocht bij slagregen kunnen eerst herstel vragen. Laat een specialist toelichten hoe hij de spouw beoordeelt en welke beperkingen hij aantreft. Bespreek ook wat er gebeurt als tijdens inspectie blijkt dat oude isolatie of vervuiling een uniforme aanpak belemmert.",
  "isolatie/vloerisolatie": "Bij een houten vloer is de staat van de balken relevant voordat de onderzijde wordt afgewerkt. Bij een vloer zonder kruipruimte kan een nieuwe bovenlaag invloed hebben op deuren en drempels. Vraag daarom niet alleen naar isolatiemateriaal maar ook naar de gevolgen voor toegang, ventilatie en aansluitende ruimtes.",
  "isolatie/gevelisolatie": "Een buitengevel met veel raamopeningen vraagt extra aandacht voor dagkanten en dorpels. Binnenisolatie kan stopcontacten en leidingen raken en verkleint de bruikbare ruimte. Laat beide opties vergelijken aan de hand van de bestaande wand en de aansluitingen, niet op basis van een algemeen besparingspercentage.",
  "isolatie/kruipruimte-isolatie": "Een natte bodem en een vochtige houten vloer zijn verschillende problemen. Vraag de vakman vast te stellen waar het vocht vandaan komt en wat dat betekent voor gekozen materiaal en ventilatie. Bij een lage kruipruimte kan de gewenste methode zelfs onuitvoerbaar blijken; controleer werkhoogte vóór de offerte.",
  "verbouwing/aanbouw": "Een extra ruimte vraagt een duidelijke overgang met het bestaande huis, zowel buiten bij dak en fundering als binnen bij vloer en verwarming. Vraag om een voorstel dat die aansluitingen tekent of beschrijft. Geef aan welke voorzieningen meteen nodig zijn en welke eventueel later komen; dat beïnvloedt fundering en installaties.",
  "verbouwing/uitbouw": "Een uitbouw maakt een woonkamer groter maar kan het bestaande midden van de kamer donkerder maken. Bekijk daarom de positie van glas en daklichten al bij het ontwerp. Geef ook door waar keuken of eethoek komt; die keuze bepaalt waar elektra, afvoer en verwarming nodig zijn voordat de vloer dichtgaat.",
  "verbouwing/zolder-verbouwen": "Een zolder met lage knieschotten heeft misschien meer vloeroppervlak dan bruikbare stahoogte. Meet daarom de ruimte onder de kap op meerdere punten en bespreek waar trap, bed en opbergruimte passen. Bij plannen voor een dakkapel moet de aansluiting op het bestaande dak integraal worden beoordeeld.",
  "verbouwing/woning-renoveren": "Een renovatie in fases kan bewoners ruimte geven om thuis te blijven, maar vraagt extra aandacht voor tijdelijke voorzieningen en aansluitingen. Stel prioriteiten op basis van technische gebreken en afhankelijkheden: nieuwe afwerking vóór leidingwerk kan dubbel werk veroorzaken. Vraag om een fasering die duidelijk onderscheid maakt tussen noodzakelijk herstel en gewenste verbetering.",
  "verbouwing/keuken-verbouwen": "Een definitieve keukenplattegrond bepaalt de positie van afvoer, stopcontacten en ventilatie. Controleer daarom vóór sloop of het ontwerp past bij leidingroutes en de beschikbare groepenkast. Spreek af wie op locatie de aansluitmaten controleert vóór de nieuwe meubels arriveren, zodat montage niet stilvalt door een verkeerde aansluiting."
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
    sections: [
      ...content.details.map((text, index) => ({ heading: headings[index], paragraphs: [text] })),
      { heading: "Praktische afweging voor jouw situatie", paragraphs: [practicalNotes[slug]] }
    ],
    faqs: content.faqs.map(([question, answer]) => ({ question, answer })),
    relatedLinks: (() => {
      const links = fallback.relatedLinks.filter((link) => link.href !== `/${parent}` && link.href.split("/").length > 2);
      const supplements: Record<string, string[]> = {
        "badkamer/renovatie": ["/badkamer/inloopdouche", "/badkamer/tegelen"],
        "verbouwing/woning-renoveren": ["/verbouwing/keuken-verbouwen", "/verbouwing/zolder-verbouwen"],
      };
      for (const href of supplements[slug] ?? []) {
        if (!links.some((link) => link.href === href)) {
          const target = href.split("/").at(-1)!.replaceAll("-", " ");
          links.push({ href, title: target[0].toUpperCase() + target.slice(1), description: `Bekijk wanneer ${target} bij jouw project past.` });
        }
      }
      return links.slice(0, 3);
    })(),
    cta: {
      ...fallback.cta,
      title: content.h1,
      description: "Beschrijf je situatie, de gewenste aanpak en je regio. Een passende vakman kan je aanvraag bekijken; prijs en uitvoering bespreek je rechtstreeks.",
      serviceSlug,
    },
  };
}

export type UtrechtAreaSlug =
  | "centrum"
  | "overvecht"
  | "lombok"
  | "zuilen"
  | "kanaleneiland"
  | "leidsche-rijn"
  | "de-meern"
  | "hoograven"
  | "oost"
  | "west";

export type UtrechtFaqItem = {
  question: string;
  answer: string;
};

export type UtrechtPageContent = {
  language: "en" | "nl";
  href: string;
  breadcrumbLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  contextHeading: string;
  areaContext: string;
  practicalInfo: string[];
  listingHeading: string;
  listingIntro: string;
  faqTitle: string;
  faqIntro: string;
  faqs: UtrechtFaqItem[];
  listingLimit?: number;
};

export type UtrechtAreaDefinition = UtrechtPageContent & {
  slug: UtrechtAreaSlug;
  label: string;
  areaSlugAliases: string[];
  matchTerms: string[];
  minimumListings: number;
  relatedAreaSlugs: UtrechtAreaSlug[];
  factSources: string[];
};

export const utrechtCityPage: UtrechtPageContent = {
  language: "en",
  href: "/utrecht",
  breadcrumbLabel: "Utrecht",
  eyebrow: "Utrecht location directory",
  title: "Tobacco Shops in Utrecht | Map, Opening Hours & Directions",
  description:
    "View published tobacco shop, kiosk and gas station locations in Utrecht with a map, opening hours, directions and contact details. Adults 18+ only.",
  h1: "Tobacco Shops in Utrecht",
  intro:
    "Use this Utrecht directory to compare published locations by address, neighborhood, opening hours and place type. The map covers Utrecht and included nearby localities in the current dataset, while individual listing pages provide directions and contact details where available.",
  contextHeading: "Utrecht coverage",
  areaContext:
    "Utrecht is divided into distinct districts and neighborhoods, from the Binnenstad and Overvecht to Leidsche Rijn and Vleuten-De Meern. Searching by neighborhood, street or postal code is often the quickest way to narrow the city-wide list.",
  practicalInfo: [
    "Published listings are ordered with locations currently shown as open first; missing or unclear hours are never treated as open.",
    "If browser location is shared, nearest sorting uses the coordinates only for the current browser session. Otherwise, Utrecht Centraal is the local distance reference.",
    "The map fits the Utrecht result set where coordinates are available. Addresses and opening hours should still be checked before travelling."
  ],
  listingHeading: "Published Utrecht-area listings",
  listingIntro:
    "These records come from the public shop data layer and include Utrecht plus nearby localities assigned to the current Utrecht coverage set.",
  faqTitle: "Utrecht directory FAQ",
  faqIntro: "Practical answers about searching and comparing listed locations in Utrecht.",
  faqs: [
    {
      question: "How can I search for a listed location in Utrecht?",
      answer:
        "Search by neighborhood, street, postal code or place name. The Utrecht city filter keeps the results within the supported Utrecht coverage set."
    },
    {
      question: "What distance is shown if I do not share my location?",
      answer:
        "Utrecht results use Utrecht Centraal as the fallback reference. If you allow location access, distance sorting instead uses your current browser location."
    },
    {
      question: "Are De Meern listings included with Utrecht?",
      answer:
        "Yes. De Meern is part of the municipality's Vleuten-De Meern district and is included in the current Utrecht-area coverage where published records are available."
    },
    {
      question: "Are opening hours guaranteed?",
      answer:
        "No. Opening hours can change, and missing or unclear hours are shown as unavailable. Verify important details with the location before visiting."
    },
    {
      question: "Does TobaccoNearby sell tobacco products?",
      answer:
        "No. TobaccoNearby is a neutral location directory for adults aged 18+ and does not sell products, process orders or promote smoking."
    }
  ]
};

export const utrechtDutchPages: Record<"tabakswinkel" | "sigaretten", UtrechtPageContent> = {
  tabakswinkel: {
    language: "nl",
    href: "/tabakswinkel-utrecht",
    breadcrumbLabel: "Tabakswinkels in Utrecht",
    eyebrow: "Praktische locatie-informatie",
    title: "Tabakswinkels in Utrecht | Kaart, Openingstijden & Route",
    description:
      "Bekijk praktische informatie over vermelde tabakswinkels en andere verkooppunten in Utrecht, met adressen, openingstijden, kaart en routes. Voor volwassenen van 18 jaar en ouder.",
    h1: "Tabakswinkels in Utrecht",
    intro:
      "Zoek je een tabakswinkel of ander vermeld verkooppunt in Utrecht? Deze pagina bundelt adressen, openingstijden waar beschikbaar, plaatssoorten en route-informatie voor volwassenen van 18 jaar en ouder.",
    contextHeading: "Zoeken binnen Utrecht",
    areaContext:
      "Utrecht bestaat uit verschillende wijken en buurten. Daarom kun je de vermeldingen niet alleen op stadsniveau bekijken, maar ook verfijnen op gebieden zoals Centrum, Overvecht, Lombok, Zuilen, Kanaleneiland en Leidsche Rijn.",
    practicalInfo: [
      "Gebruik een wijknaam, straat of postcode om de lijst te verfijnen; de kaart toont alleen locaties met bruikbare coördinaten.",
      "Zonder gedeelde browserlocatie gebruikt de website Utrecht Centraal als lokaal referentiepunt voor afstanden.",
      "Openingstijden, contactgegevens en toegankelijkheidsinformatie kunnen wijzigen. Controleer belangrijke gegevens voor vertrek."
    ],
    listingHeading: "Vermelde locaties in Utrecht",
    listingIntro:
      "De lijst bevat gepubliceerde tabakswinkels en andere plaatssoorten uit de Utrecht-dekking. Een vermelding is geen aanbeveling.",
    faqTitle: "Veelgestelde vragen over tabakswinkels in Utrecht",
    faqIntro: "Korte, praktische antwoorden over zoeken en locatiegegevens.",
    faqs: [
      {
        question: "Hoe vind ik een tabakswinkel in Utrecht?",
        answer:
          "Gebruik de zoekbalk of kies een Utrechtse wijk. Vermeldingen kunnen een adres, openingstijden, route en contactgegevens bevatten."
      },
      {
        question: "Kan ik zoeken op postcode of straat?",
        answer:
          "Ja. De zoekfunctie ondersteunt postcodes, straten, wijknamen en plaatsnamen binnen de ondersteunde Utrecht-dekking."
      },
      {
        question: "Welke locaties worden als open getoond?",
        answer:
          "Alleen locaties waarvan de beschikbare openingstijden veilig als open kunnen worden gelezen. Ontbrekende of onduidelijke tijden tellen niet als open."
      },
      {
        question: "Kan ik onjuiste informatie melden?",
        answer:
          "Ja. Via de detailpagina van een locatie kun je een correctie voorstellen. Inzendingen worden beoordeeld voordat gegevens worden aangepast."
      },
      {
        question: "Verkoopt TobaccoNearby tabaksproducten?",
        answer:
          "Nee. TobaccoNearby biedt alleen neutrale locatie-informatie voor volwassenen van 18+ en verkoopt geen producten."
      }
    ],
    listingLimit: 20
  },
  sigaretten: {
    language: "nl",
    href: "/sigaretten-kopen-utrecht",
    breadcrumbLabel: "Sigaretten kopen in Utrecht",
    eyebrow: "Locatie-informatie voor 18+",
    title: "Sigaretten kopen in Utrecht | Locaties, Openingstijden & Route",
    description:
      "Vind neutrale locatie-informatie over vermelde verkooppunten in Utrecht, met adressen, openingstijden en routes. Actuele beschikbaarheid kan wijzigen. Alleen 18+.",
    h1: "Sigaretten kopen in Utrecht",
    intro:
      "Deze pagina is bedoeld voor volwassenen van 18+ die zoeken naar praktische locatie-informatie over vermelde verkooppunten in Utrecht. TobaccoNearby verkoopt zelf geen producten en kan de actuele beschikbaarheid bij een locatie niet garanderen.",
    contextHeading: "Praktische informatie, geen verkoopsite",
    areaContext:
      "Verkooppunten en verkoopregels kunnen wijzigen. Gebruik daarom de wijkpagina's, kaart, adressen en route-links om een locatie te vinden en controleer openingstijden en actuele beschikbaarheid rechtstreeks voordat je vertrekt.",
    practicalInfo: [
      "De lijst kan tabakswinkels, kiosken, tankstations en andere gepubliceerde plaatssoorten bevatten; een vermelding zegt niets over de actuele voorraad.",
      "Zoek op Utrechtse wijk, straat of postcode en open daarna de detailpagina voor de beschikbare contact- en routegegevens.",
      "TobaccoNearby toont geen commerciële productinformatie en verwerkt geen bestellingen."
    ],
    listingHeading: "Praktische locatievermeldingen",
    listingIntro:
      "Bekijk gepubliceerde Utrechtse locaties en controleer de gegevens bij de locatie. De volgorde is informatief en vormt geen aanbeveling.",
    faqTitle: "Veelgestelde vragen over locatie-informatie",
    faqIntro: "Neutrale antwoorden voor volwassenen die een vermelde locatie in Utrecht zoeken.",
    faqs: [
      {
        question: "Waar kan ik in Utrecht locatie-informatie vinden?",
        answer:
          "Gebruik de kaart, zoekbalk of wijklinks om gepubliceerde locaties met adressen, openingstijden en routes te bekijken."
      },
      {
        question: "Betekent een vermelding dat sigaretten beschikbaar zijn?",
        answer:
          "Nee. Het aanbod kan wijzigen en TobaccoNearby houdt geen voorraad bij. Controleer actuele beschikbaarheid rechtstreeks bij de locatie."
      },
      {
        question: "Kan ik zoeken zonder mijn locatie te delen?",
        answer:
          "Ja. Je kunt altijd zoeken op wijk, straat of postcode. Zonder locatietoegang gebruikt de site Utrecht Centraal alleen als afstandsreferentie."
      },
      {
        question: "Zijn de openingstijden altijd actueel?",
        answer:
          "Nee. Tijden kunnen veranderen door feestdagen, tijdelijke sluitingen of wijzigingen bij de locatie. Controleer ze voor vertrek."
      },
      {
        question: "Moedigt TobaccoNearby roken aan?",
        answer:
          "Nee. De website verkoopt geen tabaksproducten en biedt uitsluitend neutrale locatie-informatie voor volwassenen van 18+."
      }
    ],
    listingLimit: 20
  }
};

export const utrechtAreaDefinitions: UtrechtAreaDefinition[] = [
  {
    language: "nl",
    slug: "centrum",
    label: "Utrecht Centrum",
    href: "/utrecht/centrum",
    breadcrumbLabel: "Centrum",
    eyebrow: "Utrechtse gebiedspagina",
    title: "Tabakswinkels in Utrecht Centrum | Kaart & Route",
    description:
      "Bekijk vermelde tabakswinkels en andere locaties in Utrecht Centrum met adressen, openingstijden, kaart en route-informatie. Alleen voor volwassenen van 18+.",
    h1: "Tabakswinkels in Utrecht Centrum",
    intro:
      "Deze pagina toont praktische locatie-informatie voor gepubliceerde vermeldingen in Utrecht Centrum. Je vindt hier adressen, openingstijden waar beschikbaar, plaatssoorten, een kaart en route-links.",
    contextHeading: "Over Utrecht Centrum",
    areaContext:
      "De Utrechtse Binnenstad omvat de historische binnenstad en het stationsgebied, met Utrecht Centraal, Hoog Catharijne en de Jaarbeurs als herkenbare oriëntatiepunten. De compacte stratenstructuur maakt zoeken op straat of postcode vaak handiger dan alleen op wijknaam.",
    practicalInfo: [
      "Gebruik een adres of 3511- en 3512-postcode om vermeldingen in het centrum nauwkeuriger te vergelijken.",
      "Utrecht Centraal ligt in het stationsgebied en is het standaard lokale referentiepunt wanneer je geen browserlocatie deelt.",
      "Controleer openingstijden voor vertrek; drukke centrumlocaties kunnen afwijkende uren hebben zonder dat dit direct in de directory staat."
    ],
    listingHeading: "Vermelde locaties in Utrecht Centrum",
    listingIntro: "Alleen gepubliceerde, aan Utrecht gekoppelde records die bij Centrum passen worden hieronder getoond.",
    faqTitle: "Veelgestelde vragen over Utrecht Centrum",
    faqIntro: "Praktische antwoorden voor het zoeken naar een vermelde locatie in het centrum.",
    faqs: [
      { question: "Hoe zoek ik een locatie in Utrecht Centrum?", answer: "Bekijk de lijst en kaart of zoek op straat, postcode of Binnenstad. Elke kaartlink opent praktische route-informatie." },
      { question: "Valt het stationsgebied onder Utrecht Centrum?", answer: "Het stationsgebied hoort bij de wijk Binnenstad. Voor afstanden gebruikt de site Utrecht Centraal als lokale referentie wanneer geen browserlocatie is gedeeld." },
      { question: "Zijn alle locaties in het centrum nu open?", answer: "Nee. Alleen vermeldingen met leesbare openingstijden kunnen als open worden aangeduid. Controleer tijden altijd voor vertrek." },
      { question: "Kan ik onjuiste centrumgegevens melden?", answer: "Ja. Open de betreffende detailpagina en gebruik de correctie-optie. Wijzigingen worden eerst beoordeeld." },
      { question: "Verkoopt TobaccoNearby producten?", answer: "Nee. TobaccoNearby is een neutrale locatiedirectory voor volwassenen van 18+ en verwerkt geen bestellingen." }
    ],
    areaSlugAliases: ["centrum", "utrecht-centrum", "binnenstad"],
    matchTerms: ["Utrecht Centrum", "Utrecht-Centrum", "Binnenstad"],
    minimumListings: 3,
    relatedAreaSlugs: ["lombok", "west", "oost", "zuilen"],
    factSources: [
      "https://omgevingsvisie.utrecht.nl/gebiedsbeleid/gebiedsbeleid-wijk-binnenstad/beschrijving-van-wijk-binnenstad",
      "https://www.utrecht.nl/wonen-en-leven/bouwprojecten-en-stedelijke-ontwikkeling/bouwprojecten/binnenstad/stationsgebied"
    ]
  },
  {
    language: "nl",
    slug: "overvecht",
    label: "Overvecht",
    href: "/utrecht/overvecht",
    breadcrumbLabel: "Overvecht",
    eyebrow: "Utrechtse gebiedspagina",
    title: "Tabakswinkels in Overvecht, Utrecht | Openingstijden & Kaart",
    description:
      "Vind praktische locatie-informatie voor vermelde verkooppunten in Overvecht, Utrecht, met adressen, openingstijden, kaart en routes. Alleen 18+.",
    h1: "Tabakswinkels in Overvecht, Utrecht",
    intro:
      "Bekijk gepubliceerde locaties in Overvecht op kaart en in een compacte lijst. De vermeldingen kunnen openingstijden, contactgegevens, toegankelijkheidsinformatie en route-links bevatten.",
    contextHeading: "Over Overvecht",
    areaContext:
      "Overvecht is een grote Utrechtse wijk met meerdere buurten rond de bekende dreven. De Einsteindreef vormt een belangrijke scheiding tussen het noordelijke en zuidelijke deel, waardoor zoeken op een specifieke dreef of postcode nuttig kan zijn.",
    practicalInfo: [
      "Zoek op straatnamen zoals Einsteindreef, Zambesidreef of andere concrete adressen uit de gepubliceerde vermeldingen.",
      "De kaart groepeert uitsluitend locaties met geldige coördinaten en blijft bruikbaar zonder locatietoestemming.",
      "Openingstijden en toegankelijkheid worden alleen getoond wanneer die gegevens beschikbaar zijn; ontbrekende informatie wordt niet ingevuld."
    ],
    listingHeading: "Vermelde locaties in Overvecht",
    listingIntro: "De resultaten zijn eerst op Utrecht gescopeerd en daarna op Overvecht gematcht.",
    faqTitle: "Veelgestelde vragen over Overvecht",
    faqIntro: "Korte antwoorden over zoeken en navigeren binnen Overvecht.",
    faqs: [
      { question: "Hoe vind ik een vermeld verkooppunt in Overvecht?", answer: "Gebruik de lijst, kaart of zoekfunctie met een straat, dreef of postcode in Overvecht." },
      { question: "Kan ik zoeken op een specifieke dreef?", answer: "Ja. De algemene zoekpagina ondersteunt straatnamen naast wijknamen en postcodes." },
      { question: "Hoe wordt afstand in Overvecht berekend?", answer: "Met locatietoestemming gebruikt de browser je huidige positie. Zonder toestemming wordt Utrecht Centraal als stadsreferentie gebruikt." },
      { question: "Wordt ontbrekende toegankelijkheidsinformatie aangevuld?", answer: "Nee. TobaccoNearby toont toegankelijkheid alleen wanneer de brongegevens daar duidelijke informatie over bevatten." },
      { question: "Kan ik een verouderde vermelding melden?", answer: "Ja. Gebruik op de detailpagina de optie om onjuiste informatie te melden; de inzending wordt eerst beoordeeld." }
    ],
    areaSlugAliases: ["overvecht"],
    matchTerms: ["Overvecht"],
    minimumListings: 3,
    relatedAreaSlugs: ["zuilen", "centrum", "oost", "leidsche-rijn"],
    factSources: ["https://omgevingsvisie.utrecht.nl/gebiedsbeleid/gebiedsbeleid-wijk-overvecht/beschrijving-van-wijk-overvecht"]
  },
  {
    language: "nl",
    slug: "lombok",
    label: "Lombok",
    href: "/utrecht/lombok",
    breadcrumbLabel: "Lombok",
    eyebrow: "Utrechtse gebiedspagina",
    title: "Tabakswinkels in Lombok, Utrecht | Adressen & Route",
    description:
      "Bekijk gepubliceerde locaties in Lombok, Utrecht met adressen, openingstijden, kaart en route-informatie. Neutrale locatie-informatie voor volwassenen van 18+.",
    h1: "Tabakswinkels in Lombok, Utrecht",
    intro:
      "Deze Lombok-pagina bundelt praktische informatie over gepubliceerde locaties, met adressen, openingstijden waar beschikbaar en directe route-links. Gebruik de kaart om vermeldingen binnen de buurt te vergelijken.",
    contextHeading: "Over Lombok",
    areaContext:
      "Lombok maakt deel uit van Utrecht West en ligt rond de Kanaalstraat en Vleutenseweg. De Kanaalstraat is een belangrijke route en winkelstraat, terwijl de Laan van Nieuw-Guinea het winkelgebied westwaarts voortzet.",
    practicalInfo: [
      "Zoek op Kanaalstraat, Vleutenseweg, Laan van Nieuw-Guinea of een postcode uit de 3531- en 3533-gebieden wanneer dat beter aansluit op je vertrekpunt.",
      "Lombok ligt aan de westzijde van de binnenstad; route-links gebruiken het volledige adres en niet alleen coördinaten.",
      "De directory houdt geen voorraad bij. Controleer actuele beschikbaarheid en openingstijden rechtstreeks bij de locatie."
    ],
    listingHeading: "Vermelde locaties in Lombok",
    listingIntro: "Deze lijst bevat alleen gepubliceerde Utrecht-records die aan Lombok zijn gekoppeld.",
    faqTitle: "Veelgestelde vragen over Lombok",
    faqIntro: "Praktische informatie voor zoeken rond Lombok en Utrecht West.",
    faqs: [
      { question: "Bij welke Utrechtse wijk hoort Lombok?", answer: "Lombok hoort bij Utrecht West. Deze pagina gebruikt de buurtkoppeling uit de gepubliceerde locatiegegevens." },
      { question: "Kan ik zoeken rond de Kanaalstraat?", answer: "Ja. Vul Kanaalstraat of een specifiek adres in op de zoekpagina om de resultaten verder te verfijnen." },
      { question: "Toont de kaart ook locaties buiten Lombok?", answer: "Nee. De kaart op deze pagina gebruikt dezelfde stad- en buurtfilter als de zichtbare lijst." },
      { question: "Zijn openingstijden in Lombok altijd actueel?", answer: "Niet gegarandeerd. Controleer openingstijden en contactgegevens voor vertrek, vooral bij tijdelijke wijzigingen." },
      { question: "Kan ik een ontbrekende locatie voorstellen?", answer: "Ja. Gebruik de pagina 'Add or Update a Shop'; alle voorstellen worden handmatig beoordeeld." }
    ],
    areaSlugAliases: ["lombok"],
    matchTerms: ["Lombok"],
    minimumListings: 3,
    relatedAreaSlugs: ["west", "centrum", "kanaleneiland", "leidsche-rijn"],
    factSources: ["https://omgevingsvisie.utrecht.nl/gebiedsbeleid/gebiedsbeleid-wijk-west/beschrijving-van-wijk-west"]
  },
  {
    language: "nl",
    slug: "zuilen",
    label: "Zuilen",
    href: "/utrecht/zuilen",
    breadcrumbLabel: "Zuilen",
    eyebrow: "Utrechtse gebiedspagina",
    title: "Tabakswinkels in Zuilen, Utrecht | Kaart & Openingstijden",
    description:
      "Bekijk vermelde locaties in Zuilen, Utrecht met adressen, openingstijden, kaart en route-links. Praktische informatie voor volwassenen van 18+.",
    h1: "Tabakswinkels in Zuilen, Utrecht",
    intro:
      "Gebruik deze pagina voor praktische locatiegegevens van gepubliceerde vermeldingen in Zuilen. De kaart en kaartenlijst maken het mogelijk adressen, openingstijden en routes naast elkaar te bekijken.",
    contextHeading: "Over Zuilen",
    areaContext:
      "Zuilen is een buurt binnen de Utrechtse wijk Noordwest en wordt lokaal onderscheiden in een westelijk, oostelijk en noordelijk deel. Meerdere vermeldingen liggen rond de Amsterdamsestraatweg, waardoor zoeken op huisnummer nuttig is.",
    practicalInfo: [
      "Controleer het volledige adres: de Amsterdamsestraatweg loopt door meerdere buurten en huisnummers liggen niet allemaal dicht bij elkaar.",
      "Gebruik de kaart voor onderlinge ligging en de routeknop voor een adresgebaseerde route.",
      "Ontbrekende telefoon-, website- of toegankelijkheidsgegevens worden niet als bekende informatie gepresenteerd."
    ],
    listingHeading: "Vermelde locaties in Zuilen",
    listingIntro: "De onderstaande resultaten zijn eerst beperkt tot Utrecht en daarna aan Zuilen gekoppeld.",
    faqTitle: "Veelgestelde vragen over Zuilen",
    faqIntro: "Antwoorden over adressen, routes en gegevenskwaliteit in Zuilen.",
    faqs: [
      { question: "Waar ligt Zuilen binnen Utrecht?", answer: "Zuilen hoort bij de wijk Noordwest. De pagina toont alleen gepubliceerde locaties die in de data aan Zuilen zijn gekoppeld." },
      { question: "Kan ik zoeken op Amsterdamsestraatweg?", answer: "Ja. Gebruik ook het huisnummer, omdat de straat lang is en door verschillende buurten loopt." },
      { question: "Hoe open ik een route naar een locatie?", answer: "Gebruik de routeknop op een kaart. De bestemming wordt opgebouwd uit naam, adres, postcode, plaats en land." },
      { question: "Waarom ontbreekt soms toegankelijkheidsinformatie?", answer: "Onbekende toegankelijkheid wordt bewust niet ingevuld. TobaccoNearby doet geen aannames over toegankelijkheid." },
      { question: "Is deze pagina bedoeld voor 18+?", answer: "Ja. TobaccoNearby biedt neutrale locatie-informatie en is bedoeld voor volwassenen van 18 jaar en ouder." }
    ],
    areaSlugAliases: ["zuilen"],
    matchTerms: ["Zuilen"],
    minimumListings: 3,
    relatedAreaSlugs: ["overvecht", "west", "centrum", "lombok"],
    factSources: ["https://omgevingsvisie.utrecht.nl/gebiedsbeleid/gebiedsbeleid-wijk-noordwest/beschrijving-van-wijk-noordwest"]
  },
  {
    language: "nl",
    slug: "kanaleneiland",
    label: "Kanaleneiland",
    href: "/utrecht/kanaleneiland",
    breadcrumbLabel: "Kanaleneiland",
    eyebrow: "Utrechtse gebiedspagina",
    title: "Tabakswinkels in Kanaleneiland | Locaties & Route",
    description:
      "Vind praktische informatie over vermelde locaties in Kanaleneiland, Utrecht, met adressen, openingstijden, kaart en routes. Alleen voor volwassenen van 18+.",
    h1: "Tabakswinkels in Kanaleneiland, Utrecht",
    intro:
      "Bekijk gepubliceerde locaties in Kanaleneiland met hun adres, openingstijden waar beschikbaar en route-informatie. De kaart gebruikt alleen de resultaten die bij dit Utrechtse gebied horen.",
    contextHeading: "Over Kanaleneiland",
    areaContext:
      "Kanaleneiland ligt in de Utrechtse wijk Zuidwest en bestaat uit een noordelijk en zuidelijk deel. De Beneluxlaan is een belangrijke doorgaande route door het gebied en vormt een bruikbaar oriëntatiepunt bij het vergelijken van adressen.",
    practicalInfo: [
      "Zoek op Beneluxlaan, winkelgebied of postcode wanneer de wijknaam te breed is voor je route.",
      "De kaart toont de onderlinge ligging; afstanden zonder locatietoestemming blijven gebaseerd op Utrecht Centraal.",
      "Controleer openingstijden en contactgegevens voor vertrek, omdat tijdelijke wijzigingen niet altijd direct zichtbaar zijn."
    ],
    listingHeading: "Vermelde locaties in Kanaleneiland",
    listingIntro: "Alleen gepubliceerde Utrecht-records die bij Kanaleneiland passen worden getoond.",
    faqTitle: "Veelgestelde vragen over Kanaleneiland",
    faqIntro: "Korte antwoorden over lokaal zoeken en de kaartweergave.",
    faqs: [
      { question: "Bij welke wijk hoort Kanaleneiland?", answer: "Kanaleneiland is onderdeel van Utrecht Zuidwest en bestaat uit meerdere buurtdelen." },
      { question: "Kan ik zoeken op Beneluxlaan?", answer: "Ja. De zoekfunctie ondersteunt straatnamen, adressen en postcodes naast wijknamen." },
      { question: "Kan ik de kaart gebruiken zonder locatie te delen?", answer: "Ja. Locatietoegang is optioneel; de gebiedskaart werkt ook zonder je browserpositie." },
      { question: "Worden locaties met onbekende openingstijden als open getoond?", answer: "Nee. Alleen veilig leesbare uren worden gebruikt voor de status en open-nu-prioriteit." },
      { question: "Hoe meld ik een fout in een vermelding?", answer: "Open de locatiepagina en gebruik 'Report incorrect information'. De melding wordt voor publicatie beoordeeld." }
    ],
    areaSlugAliases: ["kanaleneiland"],
    matchTerms: ["Kanaleneiland"],
    minimumListings: 3,
    relatedAreaSlugs: ["lombok", "west", "de-meern", "hoograven"],
    factSources: ["https://omgevingsvisie.utrecht.nl/gebiedsbeleid/gebiedsbeleid-wijk-zuidwest/beschrijving-van-wijk-zuidwest"]
  },
  {
    language: "nl",
    slug: "leidsche-rijn",
    label: "Leidsche Rijn",
    href: "/utrecht/leidsche-rijn",
    breadcrumbLabel: "Leidsche Rijn",
    eyebrow: "Utrechtse gebiedspagina",
    title: "Tabakswinkels in Leidsche Rijn | Kaart & Openingstijden",
    description:
      "Bekijk gepubliceerde locaties in Leidsche Rijn met adressen, openingstijden, kaart en route-informatie. Neutrale informatie voor volwassenen van 18+.",
    h1: "Tabakswinkels in Leidsche Rijn",
    intro:
      "Deze pagina brengt gepubliceerde vermeldingen in Leidsche Rijn samen, inclusief records rond Parkwijk en Terwijde wanneer de locatiegegevens die koppeling ondersteunen. Bekijk adressen, openingstijden en routes op één plek.",
    contextHeading: "Over Leidsche Rijn",
    areaContext:
      "Leidsche Rijn is een Utrechtse wijk ten westen van het Amsterdam-Rijnkanaal. De wijk omvat onder meer Leidsche Rijn Centrum, Parkwijk, Het Zand, Hoge Weide, Terwijde, Langerak en Rijnvliet.",
    practicalInfo: [
      "Zoek naast Leidsche Rijn ook op Parkwijk of Terwijde wanneer dat beter past bij het adres.",
      "De zoekfunctie is tolerant voor bestaande schrijfvarianten, terwijl de openbare pagina overal de correcte gebiedsnaam Leidsche Rijn toont.",
      "Route-links gebruiken het volledige adres. Controleer openingstijden en actuele locatiegegevens voor vertrek."
    ],
    listingHeading: "Vermelde locaties in Leidsche Rijn",
    listingIntro: "De filter accepteert bestaande gegevensvarianten, maar blijft altijd eerst tot Utrecht beperkt.",
    faqTitle: "Veelgestelde vragen over Leidsche Rijn",
    faqIntro: "Praktische informatie over gebiedsnamen, routes en gegevenscontrole.",
    faqs: [
      { question: "Welke buurten horen bij Leidsche Rijn?", answer: "De gemeente noemt onder meer Leidsche Rijn Centrum, Parkwijk, Het Zand, Hoge Weide, Terwijde, Langerak en Rijnvliet." },
      { question: "Herkent de zoekfunctie schrijfvarianten?", answer: "Ja. De zoekfunctie is tolerant voor bestaande gegevensvarianten, terwijl de openbare pagina de correcte spelling Leidsche Rijn gebruikt." },
      { question: "Worden Terwijde-locaties meegenomen?", answer: "Ja, wanneer een gepubliceerd Utrecht-record in de gegevens duidelijk aan Terwijde is gekoppeld, omdat Terwijde deel uitmaakt van Leidsche Rijn." },
      { question: "Kan ik een locatie op postcode zoeken?", answer: "Ja. Gebruik de algemene zoekpagina met een volledige of gedeeltelijke postcode." },
      { question: "Zijn vermelde locaties aanbevelingen?", answer: "Nee. De lijst biedt neutrale locatie-informatie en bevat geen ranglijst of productaanbevelingen." }
    ],
    areaSlugAliases: ["leidsche-rijn", "leidsche-rein", "terwijde"],
    matchTerms: ["Leidsche Rijn", "Leidsche Rein", "Terwijde"],
    minimumListings: 3,
    relatedAreaSlugs: ["de-meern", "west", "lombok", "kanaleneiland"],
    factSources: ["https://www.utrecht.nl/wonen-en-leven/wijken/leidsche-rijn"]
  },
  {
    language: "nl",
    slug: "de-meern",
    label: "De Meern",
    href: "/utrecht/de-meern",
    breadcrumbLabel: "De Meern",
    eyebrow: "Utrechtse gebiedspagina",
    title: "Tabakswinkels in De Meern | Adressen & Route",
    description:
      "Bekijk vermelde locaties in De Meern met adressen, openingstijden, kaart en route-informatie. Praktische locatiegegevens voor volwassenen van 18+.",
    h1: "Tabakswinkels in De Meern",
    intro:
      "Deze pagina toont de gepubliceerde locaties die in de huidige Utrecht-dekking aan De Meern zijn gekoppeld. Gebruik adres, postcode, openingstijden en kaart om de vermeldingen praktisch te vergelijken.",
    contextHeading: "Over De Meern",
    areaContext:
      "De Meern hoort bij de Utrechtse wijk Vleuten-De Meern. Het gemeentelijke gebied omvat naast het dorp onder meer Veldhuizen, De Balije, De Woerd en het bedrijvengebied Oudenrijn.",
    practicalInfo: [
      "De Meern-records kunnen De Meern als plaatswaarde gebruiken; de website koppelt die bestaande waarde veilig aan de Utrecht-dekking.",
      "Zonder browserlocatie worden afstanden voor deze pagina vergeleken met Utrecht Centraal, niet met Amsterdam Centraal.",
      "De pagina blijft gericht op concrete adressen en gebiedsinformatie; controleer details altijd voor vertrek."
    ],
    listingHeading: "Vermelde locaties in De Meern",
    listingIntro: "Deze pagina verschijnt alleen zolang minimaal twee gepubliceerde De Meern-records beschikbaar zijn.",
    faqTitle: "Veelgestelde vragen over De Meern",
    faqIntro: "Antwoorden over de gebiedskoppeling en praktische locatiegegevens.",
    faqs: [
      { question: "Hoort De Meern bij Utrecht?", answer: "De Meern maakt deel uit van de gemeente Utrecht en de wijk Vleuten-De Meern. De bronrecords mogen De Meern als plaatsnaam gebruiken." },
      { question: "Waarom staat Utrecht Centraal bij de afstand?", answer: "Utrecht Centraal is het lokale fallback-referentiepunt wanneer je geen browserlocatie deelt." },
      { question: "Kan ik zoeken op een De Meern-postcode?", answer: "Ja. De zoekpagina ondersteunt volledige en gedeeltelijke postcodes naast plaats- en wijknamen." },
      { question: "Is een locatie altijd rolstoeltoegankelijk?", answer: "Dat wordt niet aangenomen. Toegankelijkheidsinformatie verschijnt alleen wanneer de brongegevens een bekende ja- of nee-waarde bevatten." },
      { question: "Kan ik een ontbrekende De Meern-locatie melden?", answer: "Ja. Gebruik de inzendpagina om een toevoeging of correctie voor handmatige beoordeling voor te stellen." }
    ],
    areaSlugAliases: ["de-meern", "de meern"],
    matchTerms: ["De Meern"],
    minimumListings: 2,
    relatedAreaSlugs: ["leidsche-rijn", "kanaleneiland", "west", "lombok"],
    factSources: ["https://omgevingsvisie.utrecht.nl/gebiedsbeleid/gebiedsbeleid-wijk-vleuten-de-meern"]
  },
  {
    language: "nl",
    slug: "hoograven",
    label: "Hoograven",
    href: "/utrecht/hoograven",
    breadcrumbLabel: "Hoograven",
    eyebrow: "Utrechtse gebiedspagina",
    title: "Tabakswinkels in Hoograven, Utrecht | Kaart & Route",
    description:
      "Bekijk gepubliceerde locaties in Hoograven, Utrecht met adressen, openingstijden, kaart en route-links. Alleen voor volwassenen van 18+.",
    h1: "Tabakswinkels in Hoograven, Utrecht",
    intro:
      "Vind praktische informatie over de gepubliceerde vermeldingen in Hoograven. Adressen, openingstijden waar beschikbaar, plaatssoorten en route-links staan samen met een lokale kaart op deze pagina.",
    contextHeading: "Over Hoograven",
    areaContext:
      "Hoograven maakt deel uit van de Utrechtse wijk Zuid, samen met onder meer Lunetten, Tolsteeg, Rotsoord en de Bokkenbuurt. Smaragdplein en de omliggende straten zijn herkenbare oriëntatiepunten in de huidige locatiedata.",
    practicalInfo: [
      "Zoek op Hoograven, Smaragdplein of een specifieke postcode om vermeldingen snel te vinden.",
      "De kaart is een hulpmiddel voor oriëntatie; routeknoppen gebruiken het vermelde adres als bestemming.",
      "Controleer openingstijden en contactgegevens direct, omdat lokale wijzigingen niet altijd meteen in de directory staan."
    ],
    listingHeading: "Vermelde locaties in Hoograven",
    listingIntro: "De resultaten zijn Utrecht-gescopeerd en gebruiken de gepubliceerde buurt- en adresgegevens.",
    faqTitle: "Veelgestelde vragen over Hoograven",
    faqIntro: "Korte antwoorden over zoeken rond Hoograven en Utrecht Zuid.",
    faqs: [
      { question: "Bij welke Utrechtse wijk hoort Hoograven?", answer: "Hoograven hoort bij Utrecht Zuid, samen met onder meer Lunetten, Tolsteeg en Rotsoord." },
      { question: "Kan ik zoeken rond Smaragdplein?", answer: "Ja. Gebruik Smaragdplein of een volledig adres in de zoekbalk om passende vermeldingen te bekijken." },
      { question: "Hoe weet ik of een locatie open is?", answer: "De kaart toont een status alleen als de beschikbare openingstijden geldig zijn. Controleer de tijden voor vertrek." },
      { question: "Toont de pagina alleen Hoograven?", answer: "Ja. Eerst wordt op Utrecht gefilterd en daarna op de Hoograven-termen uit de locatiegegevens." },
      { question: "Kan ik een wijziging doorgeven?", answer: "Ja. Correcties worden via een apart formulier ingestuurd en pas na beoordeling verwerkt." }
    ],
    areaSlugAliases: ["hoograven"],
    matchTerms: ["Hoograven"],
    minimumListings: 3,
    relatedAreaSlugs: ["kanaleneiland", "oost", "centrum", "lombok"],
    factSources: ["https://www.utrecht.nl/wonen-en-leven/wijken/zuid"]
  },
  {
    language: "nl",
    slug: "oost",
    label: "Utrecht Oost",
    href: "/utrecht/oost",
    breadcrumbLabel: "Oost",
    eyebrow: "Utrechtse gebiedspagina",
    title: "Tabakswinkels in Utrecht Oost | Openingstijden & Kaart",
    description:
      "Bekijk vermelde locaties in Utrecht Oost met adressen, openingstijden, kaart en route-informatie. Neutrale locatiegegevens voor volwassenen van 18+.",
    h1: "Tabakswinkels in Utrecht Oost",
    intro:
      "Deze pagina toont gepubliceerde vermeldingen die in de dataset aan Utrecht Oost zijn gekoppeld. Bekijk het adres, de kaart, beschikbare openingstijden en directe route-links.",
    contextHeading: "Over Utrecht Oost",
    areaContext:
      "Utrecht Oost omvat onder meer Buiten-Wittevrouwen, Oudwijk, Abstede, de Schildersbuurt en de omgeving van Wilhelminapark en Rijnsweerd. Straten zoals de Burgemeester Reigerstraat vormen bruikbare lokale zoektermen.",
    practicalInfo: [
      "Gebruik een buurtnaam, straat of postcode om de brede districtsaanduiding Utrecht Oost verder te verfijnen.",
      "De kaart toont alleen gepubliceerde Utrecht-records die aan Oost zijn gekoppeld; Amsterdam Oost kan niet in deze resultaten terechtkomen.",
      "Openingsstatus en toegankelijkheid worden uitsluitend uit beschikbare gegevens afgeleid en nooit ingevuld op basis van aannames."
    ],
    listingHeading: "Vermelde locaties in Utrecht Oost",
    listingIntro: "De stadsscope wordt toegepast voordat de gebiedsterm Oost wordt beoordeeld.",
    faqTitle: "Veelgestelde vragen over Utrecht Oost",
    faqIntro: "Praktische antwoorden over gebiedsfiltering en lokale routes.",
    faqs: [
      { question: "Welke buurten horen bij Utrecht Oost?", answer: "De wijk omvat onder meer Buiten-Wittevrouwen, Oudwijk, Abstede, Rijnsweerd en de omgeving van Wilhelminapark." },
      { question: "Kan Amsterdam Oost in deze lijst verschijnen?", answer: "Nee. De filter beperkt records eerst tot Utrecht en matcht pas daarna de gebiedsaanduiding Oost." },
      { question: "Kan ik zoeken op Burgemeester Reigerstraat?", answer: "Ja. Straatnamen en postcodes worden ondersteund op de algemene zoekpagina." },
      { question: "Zijn de kaartpunten exact?", answer: "De punten zijn gebaseerd op beschikbare coördinaten en bedoeld als praktische oriëntatie. Controleer het volledige adres voor vertrek." },
      { question: "Verkoopt de website zelf producten?", answer: "Nee. TobaccoNearby verstrekt alleen neutrale locatie-informatie voor volwassenen van 18+."
      }
    ],
    areaSlugAliases: ["oost", "utrecht-oost"],
    matchTerms: ["Utrecht Oost", "Utrecht-Oost"],
    minimumListings: 3,
    relatedAreaSlugs: ["centrum", "hoograven", "overvecht", "kanaleneiland"],
    factSources: ["https://omgevingsvisie.utrecht.nl/gebiedsbeleid/gebiedsbeleid-wijk-oost/beschrijving-van-wijk-oost"]
  },
  {
    language: "nl",
    slug: "west",
    label: "Utrecht West",
    href: "/utrecht/west",
    breadcrumbLabel: "West",
    eyebrow: "Utrechtse gebiedspagina",
    title: "Tabakswinkels in Utrecht West | Adressen & Route",
    description:
      "Vind praktische locatie-informatie voor vermelde locaties in Utrecht West, met adressen, openingstijden, kaart en routes. Alleen voor volwassenen van 18+.",
    h1: "Tabakswinkels in Utrecht West",
    intro:
      "Bekijk de gepubliceerde vermeldingen die in de gegevens aan Utrecht West zijn gekoppeld. De lijst en kaart tonen adressen, openingstijden waar beschikbaar en route-informatie zonder locaties uit Amsterdam West mee te nemen.",
    contextHeading: "Over Utrecht West",
    areaContext:
      "De Utrechtse wijk West bestaat uit Oog in Al, Welgelegen, Lombok-Leidseweg, Nieuw Engeland en de Schepenbuurt; ook de bedrijvengebieden Lage Weide en Cartesiusweg horen erbij. Lombok heeft binnen deze directory een eigen, specifiekere pagina.",
    practicalInfo: [
      "Gebruik Utrecht West of een concrete straat zoals Cartesiusweg om de brede wijkfilter verder te verfijnen.",
      "De pagina gebruikt alleen records die expliciet als Utrecht West zijn vastgelegd; Lombok-vermeldingen staan op de aparte Lombok-pagina.",
      "Route-links zijn adresgebaseerd. Openingstijden en contactgegevens moeten voor vertrek worden gecontroleerd."
    ],
    listingHeading: "Vermelde locaties in Utrecht West",
    listingIntro: "De pagina gebruikt een expliciete Utrecht-stadsscope en de gebiedswaarde Utrecht West.",
    faqTitle: "Veelgestelde vragen over Utrecht West",
    faqIntro: "Antwoorden over de wijkindeling en het vergelijken van vermeldingen.",
    faqs: [
      { question: "Welke buurten horen bij Utrecht West?", answer: "De gemeente noemt onder meer Oog in Al, Welgelegen, Lombok-Leidseweg, Nieuw Engeland en de Schepenbuurt." },
      { question: "Waarom heeft Lombok een aparte pagina?", answer: "Lombok heeft voldoende eigen locatiedata en een duidelijke buurtidentiteit. De Utrecht West-pagina blijft gericht op records met de bredere West-aanduiding." },
      { question: "Kan Amsterdam West hier verschijnen?", answer: "Nee. De stad wordt eerst gecontroleerd; alleen Utrecht-records kunnen daarna als West worden gematcht." },
      { question: "Kan ik zoeken op Cartesiusweg?", answer: "Ja. De zoekpagina ondersteunt straten, adressen en postcodes binnen alle ondersteunde steden." },
      { question: "Hoe meld ik een fout?", answer: "Gebruik de correctieknop op de detailpagina. Bezoekers kunnen de openbare shopgegevens niet direct aanpassen." }
    ],
    areaSlugAliases: ["west", "utrecht-west"],
    matchTerms: ["Utrecht West", "Utrecht-West"],
    minimumListings: 3,
    relatedAreaSlugs: ["lombok", "centrum", "leidsche-rijn", "kanaleneiland"],
    factSources: ["https://omgevingsvisie.utrecht.nl/gebiedsbeleid/gebiedsbeleid-wijk-west/beschrijving-van-wijk-west"]
  }
];

export const primaryUtrechtAreaSlugs: UtrechtAreaSlug[] = [
  "centrum",
  "overvecht",
  "lombok",
  "zuilen",
  "leidsche-rijn"
];

export function getUtrechtAreaDefinition(value?: string) {
  const normalized = normalizeUtrechtAreaText(value);

  return utrechtAreaDefinitions.find(
    (area) =>
      normalizeUtrechtAreaText(area.slug) === normalized ||
      normalizeUtrechtAreaText(area.label) === normalized ||
      [...area.areaSlugAliases, ...area.matchTerms].some(
        (alias) => normalizeUtrechtAreaText(alias) === normalized
      )
  );
}

export function getUtrechtAreaSearchTargets(value: string) {
  const normalizedValue = normalizeUtrechtAreaText(value);

  if (!normalizedValue) {
    return [];
  }

  return utrechtAreaDefinitions.filter((area) =>
    [area.slug, area.label, ...area.areaSlugAliases, ...area.matchTerms].some((term) => {
      const normalizedTerm = normalizeUtrechtAreaText(term);
      return normalizedValue === normalizedTerm || (normalizedTerm.length >= 5 && normalizedValue.includes(normalizedTerm));
    })
  );
}

export function getUtrechtAreaDisplayName(value?: string) {
  const area = utrechtAreaDefinitions.find((definition) =>
    [definition.slug, definition.label, ...definition.areaSlugAliases, ...definition.matchTerms].some(
      (term) => normalizeUtrechtAreaText(term) === normalizeUtrechtAreaText(value)
    )
  );

  return area?.label ?? normalizeLeidscheRijnSpelling(value ?? "");
}

export function normalizeLeidscheRijnSpelling(value: string) {
  return value.replace(/Leidsche Rein/gi, "Leidsche Rijn");
}

export function normalizeUtrechtAreaText(value?: string) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

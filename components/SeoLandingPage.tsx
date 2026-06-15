import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import DisclaimerNotice from "@/components/DisclaimerNotice";
import FAQSection from "@/components/FAQSection";
import LazyShopMap from "@/components/LazyShopMap";
import RelatedPagesSection from "@/components/RelatedPagesSection";
import SearchBar from "@/components/SearchBar";
import ShopCard from "@/components/ShopCard";
import { getSeoPageUiLabels, SeoLandingPageDefinition } from "@/data/seo-pages";
import { Shop } from "@/data/shops";

type SeoLandingPageProps = {
  page: SeoLandingPageDefinition;
  shops: Shop[];
};

export default function SeoLandingPage({ page, shops }: SeoLandingPageProps) {
  const pageId = slugifyId(page.h1);
  const labels = getSeoPageUiLabels(page.language);
  const listingLimit = page.listingLimit ?? 10;
  const visibleShops = shops.slice(0, listingLimit);
  const hasMoreListings = shops.length > visibleShops.length;
  const searchCopy = getSearchCopy(page);

  return (
    <section className="container-shell py-6 md:py-8" lang={labels.htmlLang}>
      <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase text-teal">{labels.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">{page.h1}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">{page.introCopy}</p>
          <p className="mt-4 rounded-lg border border-line bg-white px-4 py-3 text-sm font-medium text-ink">
            {labels.adultNotice}
          </p>
          <div className="mt-6">
            <SearchBar
              compact
              helperText={searchCopy.helperText}
              placeholder={searchCopy.placeholder}
            />
            {page.intent === "near-me" ? (
              <p className="mt-3 text-sm leading-6 text-muted">{searchCopy.locationNote}</p>
            ) : null}
          </div>
        </div>
        <aside className="grid gap-5">
          <AdSlot placement="sidebar" />
          <div className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-lg font-bold text-ink">{labels.practicalNoteHeading}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              {labels.disclaimer}
            </p>
          </div>
        </aside>
      </div>

      {page.intent === "near-me" ? (
        <>
          <NearMeGuide page={page} />
          <FeaturedNearMeLinks language={page.language} />
        </>
      ) : null}

      <DisclaimerNotice className="mt-8" text={labels.disclaimer} />

      <section className="mt-8 rounded-lg border border-line bg-white p-5">
        <h2 className="text-lg font-bold text-ink">{labels.aboutHeading}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{page.context}</p>
        <ul className="mt-4 grid gap-2 text-sm leading-6 text-muted">
          {page.practicalPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8" aria-labelledby={`${pageId}-listings-heading`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id={`${pageId}-listings-heading`} className="text-2xl font-bold text-ink">
              {labels.listingsHeading}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              {labels.listingsIntro}
            </p>
          </div>
          <Link
            className="focus-ring rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-teal"
            href="/search"
          >
            {page.ctaLabel}
          </Link>
        </div>

        <div className="mt-6 grid gap-5">
          {visibleShops.length > 0 ? (
            visibleShops.map((shop) => <ShopCard key={shop.slug} shop={shop} />)
          ) : (
            <div className="rounded-lg border border-line bg-white p-6">
              <h2 className="text-xl font-bold text-ink">{labels.noListingsHeading}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{labels.noListingsText}</p>
            </div>
          )}
        </div>
        {hasMoreListings ? (
          <div className="mt-5 rounded-lg border border-line bg-white p-5 text-sm leading-6 text-muted">
            <p>
              {getListingCountCopy(page.language, visibleShops.length, shops.length)}
            </p>
            <Link className="mt-3 inline-flex font-bold text-teal hover:text-ink" href="/search">
              {page.ctaLabel}
            </Link>
          </div>
        ) : null}
      </section>

      {visibleShops.length > 0 ? (
        <section className="mt-8" aria-labelledby={`${pageId}-map-heading`}>
          <div className="mb-4">
            <h2 id={`${pageId}-map-heading`} className="text-2xl font-bold text-ink">
              {labels.mapHeading}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">{labels.mapIntro}</p>
          </div>
          <LazyShopMap shops={visibleShops} />
        </section>
      ) : null}

      <RelatedPagesSection
        className="mt-8"
        intro={labels.relatedIntro}
        language={page.language}
        links={page.relatedLinks}
        title={labels.relatedHeading}
      />

      <FAQSection
        className="mt-8"
        id={`${pageId}-faq`}
        items={page.faqItems}
        intro={labels.faqIntro}
        title={labels.faqTitle}
      />
    </section>
  );
}

type SeoSearchCopy = {
  helperText: string;
  locationNote?: string;
  placeholder: string;
};

function getSearchCopy(page: SeoLandingPageDefinition): SeoSearchCopy {
  if (page.intent === "near-me" && page.language === "nl") {
    return {
      helperText: "Gebruik mijn locatie is optioneel. Je kunt ook zoeken op buurt, straat of postcode.",
      locationNote:
        "Als je locatie deelt, wordt deze alleen in je browser gebruikt om locaties op afstand te sorteren. Je kunt de site ook gebruiken zonder locatie te delen.",
      placeholder: "Zoek op buurt, straat, postcode of gebied"
    };
  }

  if (page.intent === "near-me" && page.language === "de") {
    return {
      helperText: "Standortzugriff ist optional. Sie können auch nach Stadtteil, Straße oder Postleitzahl suchen.",
      locationNote:
        "Wenn Sie den Standortzugriff erlauben, wird Ihr Standort nur in Ihrem Browser genutzt, um Einträge nach Entfernung zu sortieren. Sie können auch ohne Standortfreigabe suchen.",
      placeholder: "Stadtteil, Straße, Postleitzahl oder Gebiet"
    };
  }

  if (page.intent === "near-me" && page.language === "fr") {
    return {
      helperText: "Le partage de localisation est facultatif. Vous pouvez aussi rechercher par quartier, rue ou code postal.",
      locationNote:
        "Si vous autorisez la localisation, elle est utilisée uniquement dans votre navigateur pour trier les fiches par distance. Vous pouvez aussi chercher sans partager votre position.",
      placeholder: "Quartier, rue, code postal ou zone"
    };
  }

  if (page.intent === "near-me") {
    return {
      helperText: "Use my location is optional. You can also search by neighborhood, street, or postal code.",
      locationNote:
        "If you share location access, it is used only in your browser to sort nearby listings. You can still search manually without sharing location.",
      placeholder: "Search by neighborhood, street, postal code, or area"
    };
  }

  if (page.language === "nl") {
    return {
      helperText: "Zoek op gebied, postcode, straat, station of buurt.",
      placeholder: "Zoek op gebied, postcode, straat of buurt"
    };
  }

  if (page.language === "de") {
    return {
      helperText: "Suchen Sie nach Gebiet, Postleitzahl, Straße, Bahnhof oder Stadtteil.",
      placeholder: "Gebiet, Postleitzahl, Straße oder Stadtteil"
    };
  }

  if (page.language === "fr") {
    return {
      helperText: "Recherchez par zone, code postal, rue, gare ou quartier.",
      placeholder: "Zone, code postal, rue ou quartier"
    };
  }

  return {
    helperText: "Search by area, postal code, street, station, or neighborhood.",
    placeholder: "Search by area, postal code, street, or neighborhood"
  };
}

function NearMeGuide({ page }: { page: SeoLandingPageDefinition }) {
  const copy = getNearMeGuideCopy(page);

  return (
    <section className="mt-8 rounded-lg border border-line bg-white p-5" aria-labelledby="near-me-guide-heading">
      <h2 id="near-me-guide-heading" className="text-2xl font-bold text-ink">
        {copy.heading}
      </h2>
      <div className="mt-4 grid gap-4 text-sm leading-6 text-muted">
        {copy.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function FeaturedNearMeLinks({ language }: { language: SeoLandingPageDefinition["language"] }) {
  const copy = getFeaturedLinksCopy(language);
  const cities = [
    { label: "Amsterdam", href: "/amsterdam/tobacco-shops" },
    { label: "Utrecht" },
    { label: "Rotterdam" },
    { label: "Den Haag" },
    { label: "Eindhoven" }
  ];
  const neighborhoods = [
    { label: "Amsterdam Centrum", href: "/amsterdam/centrum" },
    { label: "De Pijp", href: "/amsterdam/de-pijp" },
    { label: "Jordaan", href: "/amsterdam/jordaan" },
    { label: "Noord", href: "/amsterdam/noord" },
    { label: "Oost", href: "/amsterdam/oost" },
    { label: "Zuid", href: "/amsterdam/zuid" },
    { label: "Bijlmer", href: "/amsterdam/zuidoost" }
  ];

  return (
    <section className="mt-8 grid gap-5 md:grid-cols-2" aria-labelledby="featured-location-links-heading">
      <div className="rounded-lg border border-line bg-white p-5">
        <h2 id="featured-location-links-heading" className="text-lg font-bold text-ink">
          {copy.cityHeading}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">{copy.cityIntro}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {cities.map((city) =>
            city.href ? (
              <Link
                key={city.label}
                className="focus-ring rounded-lg border border-line bg-paper px-3 py-2 text-sm font-semibold text-ink hover:border-teal hover:text-teal"
                href={city.href}
              >
                {city.label}
              </Link>
            ) : (
              <span key={city.label} className="rounded-lg border border-line bg-paper px-3 py-2 text-sm font-semibold text-muted">
                {city.label}
              </span>
            )
          )}
        </div>
      </div>
      <div className="rounded-lg border border-line bg-white p-5">
        <h2 className="text-lg font-bold text-ink">{copy.neighborhoodHeading}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{copy.neighborhoodIntro}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {neighborhoods.map((neighborhood) => (
            <Link
              key={neighborhood.href}
              className="focus-ring rounded-lg border border-line bg-paper px-3 py-2 text-sm font-semibold text-ink hover:border-teal hover:text-teal"
              href={neighborhood.href}
            >
              {neighborhood.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function getNearMeGuideCopy(page: SeoLandingPageDefinition) {
  const topic = page.h1;

  if (page.language === "nl") {
    return {
      heading: "Zo zoeken naar locaties in de buurt werkt",
      paragraphs: [
        `${topic} is een zoekopdracht die vaak wordt gebruikt wanneer iemand snel praktische informatie nodig heeft, maar niet precies weet welke buurt, straat of postcode het handigst is. TobaccoNearby helpt volwassenen van 18+ om neutrale locatie-informatie te bekijken voor tabakswinkels, kiosken, convenience stores en tankstations waar gegevens beschikbaar zijn. De website verkoopt geen tabaksproducten, verwerkt geen bestellingen en moedigt roken niet aan. De pagina is bedoeld als startpunt voor adressen, openingstijden, route-informatie, kaartweergave en links naar relevante Amsterdamse gebieden.`,
        "Je kunt op meerdere manieren zoeken. De zoekbalk werkt voor buurten, straten, postcodes, stations en bekende gebiedsnamen. Wie locatie delen toestaat, kan de browser laten helpen met sorteren op afstand; die locatie wordt alleen tijdelijk in de browser gebruikt voor de zoekactie. Je kunt dezelfde informatie ook zonder locatie delen bekijken door handmatig een buurt of straat in te voeren. Dat is handig voor bezoekers die onderweg zijn, expats die de stad nog leren kennen of bewoners die liever op gebied zoeken.",
        "Openingstijden zijn belangrijk bij zoekopdrachten in de buurt, maar ze kunnen veranderen door feestdagen, tijdelijke sluitingen, personeelsbezetting of lokale wijzigingen. Daarom toont TobaccoNearby openingstijden waar beschikbaar, maar vraagt de site gebruikers om gegevens te controleren voordat ze vertrekken. Sommige vermeldingen kunnen een telefoonnummer, website, toegankelijkheidsinformatie of routeknop bevatten. Als gegevens ontbreken, blijft de vermelding bruikbaar als locatieverwijzing, maar de details moeten extra worden geverifieerd.",
        "Niet elke locatie is hetzelfde type plek. Sommige vermeldingen zijn tabakswinkels, terwijl andere als kiosk, tankstation, convenience store, night shop of andere locatie kunnen zijn opgenomen. Het type label helpt om de kaart en resultaten praktischer te scannen zonder iets aan te prijzen. De website toont geen prijzen, aanbiedingen, merken of productaanbevelingen. De bedoeling is alleen om volwassenen van 18+ te helpen begrijpen waar praktische locatie-informatie beschikbaar is.",
        "Voor betere oriëntatie kun je ook via stadspagina’s en buurtpagina’s navigeren. Amsterdam is opgedeeld in gebieden zoals Centrum, De Pijp, Jordaan, Noord, Oost, Zuid en Bijlmer/Zuidoost. Zoeken per buurt werkt vaak sneller dan zoeken op heel Nederland of alleen op “in de buurt”. Deze pagina toont ook belangrijke Amsterdam-links, zodat zoekmachines en gebruikers gemakkelijk naar de meest nuttige, indexeerbare pagina’s kunnen gaan in plaats van naar tijdelijke filter-URL’s.",
        "De uitgelichte steden laten zien hoe de directory later kan groeien. Amsterdam is nu de belangrijkste stad met gepubliceerde gegevens, terwijl Utrecht, Rotterdam, Den Haag en Eindhoven als toekomstige uitbreidingsrichting zichtbaar zijn. Dit voorkomt dat de pagina doet alsof er al landelijke dekking is, maar maakt wel duidelijk dat de structuur is voorbereid op meer steden. Voor nu zijn de Amsterdamse stadspagina, buurtpagina’s en shopdetailpagina’s de belangrijkste plekken om actuele, indexeerbare informatie te vinden.",
        "Wanneer je een specifieke locatie bekijkt, helpt de shopdetailpagina met extra context zoals het adres, de buurt, openingstijden, routeknoppen, kaartmarkering, nabijgelegen vermeldingen en datum van de laatste update. Die detailpagina’s zijn nuttiger dan tijdelijke zoek-URL’s, omdat ze een vaste URL hebben en meer unieke informatie bevatten. Daarom verwijst TobaccoNearby vanuit deze pagina naar buurtpagina’s en afzonderlijke vermeldingen, terwijl dynamische zoekfilters bedoeld blijven voor gebruiksgemak en niet als belangrijkste indexeerbare pagina’s.",
        "De weergegeven locaties zijn een beperkte selectie gepubliceerde vermeldingen. Gebruik de volledige zoekpagina voor alle Amsterdamse resultaten, filters zoals open nu, telefoonnummer, website, toegankelijkheid en kaartweergave. Controleer altijd openingstijden, contactgegevens, route-informatie en beschikbaarheid voordat je een locatie bezoekt. TobaccoNearby blijft een neutrale informatieve directory en geen verkoopkanaal."
      ]
    };
  }

  if (page.language === "de") {
    return {
      heading: "So finden Sie praktische Standorte in der Nähe",
      paragraphs: [
        `${topic} ist eine Suchanfrage, die viele Besucher nutzen, wenn sie sich in Amsterdam orientieren möchten und noch nicht wissen, welcher Stadtteil, welche Straße oder welche Postleitzahl am sinnvollsten ist. TobaccoNearby hilft Erwachsenen ab 18 Jahren, neutrale Standortinformationen zu Tabakgeschäften, Kiosken, Convenience Stores und Tankstellen zu finden, soweit Daten verfügbar sind. Die Website verkauft keine Tabakprodukte, nimmt keine Bestellungen an und fördert das Rauchen nicht. Sie zeigt praktische Angaben wie Adressen, Öffnungszeiten, Wegbeschreibungen, Kartenansicht und Links zu relevanten Amsterdamer Gebieten.`,
        "Die Suche kann auf verschiedene Arten genutzt werden. Sie können nach Stadtteilen, Straßen, Postleitzahlen, Bahnhöfen oder bekannten Gebietsnamen suchen. Wenn Sie den Standortzugriff erlauben, nutzt die Website Ihre Position nur im Browser, um Einträge nach Entfernung zu sortieren. Diese Information wird nicht in Supabase gespeichert und nicht an Analytics gesendet. Wer keinen Standort teilen möchte, kann jederzeit manuell suchen und erhält weiterhin nutzbare Ergebnisse.",
        "Öffnungszeiten sind bei einer Suche in der Nähe besonders wichtig, können sich aber durch Feiertage, vorübergehende Schließungen oder lokale Änderungen ändern. Deshalb zeigt TobaccoNearby Öffnungszeiten nur als praktische Information an und bittet Nutzer, Details vor dem Besuch zu prüfen. Manche Einträge enthalten zusätzlich Telefonnummern, Websites, Hinweise zur Barrierefreiheit oder Links zu Google Maps. Wenn Angaben fehlen, bleibt die Seite als Orientierung hilfreich, sollte aber besonders sorgfältig überprüft werden.",
        "Nicht jeder gelistete Ort ist derselbe Typ von Standort. Einige Einträge sind Tabakgeschäfte, andere können Kioske, Tankstellen, Convenience Stores, Night Shops oder sonstige Standorte sein. Das Typ-Label hilft, Karte und Ergebnisliste schneller zu verstehen, ohne Produkte oder Konsum zu bewerben. TobaccoNearby zeigt keine Preise, Rabatte, Marken oder Produktempfehlungen. Die Seite bleibt bewusst neutral und auf praktische Standortinformationen beschränkt.",
        "Für eine bessere Orientierung verweist die Seite auch auf Stadt- und Stadtteilseiten. Amsterdam ist kompakt, aber stark in Viertel gegliedert: Centrum, De Pijp, Jordaan, Noord, Oost, Zuid und Bijlmer/Zuidoost sind häufig genutzte Einstiege. Die Navigation über diese Seiten hilft Suchmaschinen und Nutzern, wichtige indexierbare Inhalte zu finden, statt unnötig viele temporäre Such- und Filter-URLs aufzurufen.",
        "Die aufgeführten Städte zeigen, wie das Verzeichnis später erweitert werden kann. Amsterdam ist derzeit die wichtigste Stadt mit veröffentlichten Daten, während Utrecht, Rotterdam, Den Haag und Eindhoven als mögliche zukünftige Erweiterungen sichtbar sind. So entsteht kein Eindruck einer bereits vollständigen landesweiten Abdeckung, aber die Seitenstruktur bleibt skalierbar. Für aktuelle Inhalte sind momentan die Amsterdamer Stadtseite, die Stadtteilseiten und die einzelnen Detailseiten der gelisteten Standorte am wichtigsten.",
        "Wenn Sie einen einzelnen Eintrag öffnen, finden Sie dort mehr Kontext als in einer temporären Suche: Adresse, Stadtteil, Öffnungszeiten, Wegbeschreibung, Kartenmarkierung, nahe gelegene gelistete Standorte und das letzte Aktualisierungsdatum. Diese Detailseiten haben feste URLs und enthalten mehr eigene Informationen. Deshalb verlinkt TobaccoNearby von dieser Seite auf wichtige Stadtteile und Einträge, während dynamische Suchfilter vor allem der Nutzung dienen und nicht der wichtigste Inhalt für die Indexierung sein sollen.",
        "Die sichtbaren Einträge sind eine begrenzte Auswahl veröffentlichter Standorte. Für alle Amsterdamer Ergebnisse können Sie die vollständige Suche mit Filtern wie geöffnet, Telefonnummer vorhanden, Website vorhanden, Barrierefreiheit und Kartenansicht nutzen. Bitte prüfen Sie Öffnungszeiten, Kontaktdaten, Wegbeschreibung und Verfügbarkeit immer vor einem Besuch. TobaccoNearby ist eine neutrale Informationsseite für Erwachsene ab 18 Jahren."
      ]
    };
  }

  if (page.language === "fr") {
    return {
      heading: "Comment trouver des informations pratiques près de vous",
      paragraphs: [
        `${topic} est une recherche fréquente pour les visiteurs qui se trouvent à Amsterdam et ne savent pas encore quel quartier, quelle rue ou quel code postal utiliser. TobaccoNearby aide les adultes de 18 ans et plus à consulter des informations neutres sur des bureaux de tabac, kiosques, commerces de proximité et stations-service lorsque des données sont disponibles. Le site ne vend pas de produits du tabac, ne traite pas de commandes et ne fait pas la promotion du tabagisme. Il présente des adresses, horaires, itinéraires, cartes et liens vers des zones utiles.`,
        "Vous pouvez rechercher de plusieurs manières. La barre de recherche accepte les quartiers, rues, codes postaux, gares et noms de zones connus. Si vous autorisez la localisation, votre position est utilisée uniquement dans votre navigateur pour trier les fiches par distance. Elle n’est pas enregistrée dans Supabase et n’est pas envoyée aux outils d’analyse. Vous pouvez aussi chercher manuellement sans partager votre localisation, ce qui reste utile pour les touristes, expatriés et visiteurs.",
        "Les horaires sont importants pour une recherche près de soi, mais ils peuvent changer à cause des jours fériés, de fermetures temporaires ou de mises à jour locales. TobaccoNearby affiche les horaires disponibles comme information pratique, tout en invitant les utilisateurs à vérifier les détails avant de se déplacer. Certaines fiches peuvent inclure un numéro de téléphone, un site web, des informations d’accessibilité ou un lien d’itinéraire. Si une donnée manque, la fiche doit être vérifiée avec encore plus d’attention.",
        "Tous les lieux listés ne sont pas du même type. Certains peuvent être des bureaux de tabac, tandis que d’autres sont des kiosques, stations-service, commerces de proximité, night shops ou autres lieux. Le libellé du type aide à lire la carte et les résultats sans recommander de produits. Le site n’affiche pas de prix, promotions, marques ou conseils d’achat. L’objectif reste strictement informatif et destiné aux adultes de 18 ans et plus.",
        "Pour mieux s’orienter, vous pouvez aussi utiliser les pages par ville et par quartier. Amsterdam est compacte mais très organisée par zones, notamment Centrum, De Pijp, Jordaan, Noord, Oost, Zuid et Bijlmer/Zuidoost. Ces liens aident les visiteurs et les moteurs de recherche à accéder aux pages importantes et indexables, plutôt qu’à de nombreuses URL temporaires de recherche ou de filtre.",
        "Les villes mises en avant montrent comment l’annuaire pourra évoluer. Amsterdam est actuellement la ville principale avec des données publiées, tandis qu’Utrecht, Rotterdam, Den Haag et Eindhoven sont présentées comme pistes d’extension future. Cela évite de laisser penser que la couverture nationale est déjà complète, tout en gardant une structure prête pour d’autres villes. Pour l’instant, les pages les plus utiles sont les pages d’Amsterdam, les pages de quartiers et les fiches détaillées de lieux listés.",
        "En ouvrant une fiche détaillée, vous trouverez plus de contexte que dans une recherche temporaire: adresse, quartier, horaires, itinéraire, carte, lieux listés à proximité et date de dernière mise à jour. Ces pages ont des URL stables et contiennent davantage d’informations uniques. C’est pourquoi TobaccoNearby relie cette page aux quartiers importants et aux fiches individuelles, tandis que les filtres de recherche restent surtout destinés à l’usage pratique et non à l’indexation principale.",
        "Les lieux visibles sur cette page représentent une sélection limitée de fiches publiées. Pour parcourir tous les résultats à Amsterdam, utilisez la page de recherche complète avec les filtres comme ouvert maintenant, téléphone disponible, site web disponible, accessibilité et vue carte. Vérifiez toujours les horaires, coordonnées, itinéraires et disponibilités avant de vous déplacer. TobaccoNearby reste un annuaire neutre, pas un service de vente."
      ]
    };
  }

  return {
    heading: "How to find nearby practical location information",
    paragraphs: [
      `${topic} is a search people often use when they need practical information quickly but do not yet know which neighborhood, street, postal code or station area to search. TobaccoNearby helps adults aged 18+ find neutral location information for listed tobacco shops, kiosks, convenience stores and gas stations where data is available. The website does not sell tobacco products, process orders or promote smoking. It is designed as a practical directory with addresses, opening hours where available, directions, map view and links to useful Amsterdam area pages.`,
      "You can search in several ways. The search bar works with neighborhoods, streets, postal codes, stations and common area names. If you choose to share your location, the browser can help sort listings by distance; the location is used only in your browser for that search flow. You can also search manually without sharing location, which is useful for visitors, tourists, expats and local residents who prefer to look up an area before travelling.",
      "Opening hours are one of the most important details for near-me searches, but they can change because of holidays, temporary closures, staffing or local updates. TobaccoNearby shows opening hours where available and asks users to verify details before visiting. Some listings may also include phone numbers, websites, accessibility information and Google Maps directions. When data is missing, the listing can still help with orientation, but the missing details should be checked directly.",
      "Nearby searches can include different kinds of places. Some listings are tobacco shops, while others may be kiosks, gas stations, convenience stores, night shops or other locations. Place-type labels help users scan the map and result cards without turning the page into a sales page. TobaccoNearby does not show prices, deals, brands, discounts or product recommendations. The goal is simply to make practical location information easier to find for adults aged 18+.",
      "City pages and neighborhood pages make the directory easier to browse. Amsterdam is compact but very neighborhood-based, so searches for Centrum, De Pijp, Jordaan, Noord, Oost, Zuid or Bijlmer can be more useful than a broad country-level search. These internal links also help users and search engines reach important indexable pages instead of spending time on temporary filtered search URLs.",
      "Featured cities show how the directory can expand over time. Amsterdam is currently the main city with published listing data, while Utrecht, Rotterdam, Den Haag and Eindhoven are shown as future expansion areas. This keeps the page honest about current coverage while making the structure ready for more Dutch cities later. For now, the strongest indexable paths are the Amsterdam city page, Amsterdam neighborhood pages and individual shop detail pages.",
      "When you open a shop detail page, you get more context than a temporary search result URL can provide: address, neighborhood, opening hours, directions, map location, nearby listed shops and last updated information. Those pages have stable URLs and more unique content, which makes them better for users and search engines. That is why this page links to neighborhood pages and listing pages, while dynamic search filters stay useful for browsing but are kept out of the main indexing path.",
      "The listings shown here are a limited set of published locations. Use the full search page to browse all Amsterdam listings, use filters such as open now, has phone number, has website and wheelchair accessible, or switch to the map view. Always verify opening hours, contact details, directions and availability before visiting. TobaccoNearby remains a neutral informational directory and is intended only for adults aged 18+."
    ]
  };
}

function getFeaturedLinksCopy(language: SeoLandingPageDefinition["language"]) {
  if (language === "nl") {
    return {
      cityHeading: "Uitgelichte steden",
      cityIntro: "Amsterdam is momenteel de belangrijkste stad in de directory. Andere steden staan klaar voor latere uitbreiding.",
      neighborhoodHeading: "Uitgelichte Amsterdamse buurten",
      neighborhoodIntro: "Gebruik buurtpagina’s om sneller praktische locatie-informatie in Amsterdam te vinden."
    };
  }

  if (language === "de") {
    return {
      cityHeading: "Ausgewählte Städte",
      cityIntro: "Amsterdam ist derzeit die wichtigste Stadt im Verzeichnis. Weitere Städte sind für spätere Erweiterungen vorgesehen.",
      neighborhoodHeading: "Ausgewählte Stadtteile in Amsterdam",
      neighborhoodIntro: "Nutzen Sie Stadtteilseiten, um praktische Standortinformationen in Amsterdam schneller zu finden."
    };
  }

  if (language === "fr") {
    return {
      cityHeading: "Villes mises en avant",
      cityIntro: "Amsterdam est actuellement la ville principale de l’annuaire. D’autres villes sont prévues pour une extension future.",
      neighborhoodHeading: "Quartiers d’Amsterdam",
      neighborhoodIntro: "Utilisez les pages de quartiers pour trouver plus rapidement des informations pratiques à Amsterdam."
    };
  }

  return {
    cityHeading: "Featured cities",
    cityIntro: "Amsterdam is currently the main city in the directory. Other cities are prepared for future expansion.",
    neighborhoodHeading: "Featured Amsterdam neighborhoods",
    neighborhoodIntro: "Use neighborhood pages to find practical Amsterdam location information faster."
  };
}

function getListingCountCopy(language: SeoLandingPageDefinition["language"], visibleCount: number, totalCount: number) {
  if (language === "nl") {
    return `${visibleCount} van ${totalCount} gepubliceerde vermeldingen worden op deze pagina getoond.`;
  }

  if (language === "de") {
    return `${visibleCount} von ${totalCount} veröffentlichten Einträgen werden auf dieser Seite angezeigt.`;
  }

  if (language === "fr") {
    return `${visibleCount} sur ${totalCount} fiches publiées sont affichées sur cette page.`;
  }

  return `Showing ${visibleCount} of ${totalCount} published Amsterdam listings on this page.`;
}

function slugifyId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

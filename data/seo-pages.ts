import type { FAQItem } from "@/components/FAQSection";

export type SeoLandingPageDefinition = {
  href: string;
  label: string;
  metadataTitle: string;
  metadataDescription: string;
  h1: string;
  intro: string;
  context: string;
  practicalPoints: string[];
  faqs: FAQItem[];
};

export const seoLandingPages: SeoLandingPageDefinition[] = [
  {
    href: "/amsterdam/sigaretten-kopen",
    label: "Sigaretten kopen Amsterdam",
    metadataTitle: "Sigaretten kopen in Amsterdam | Praktische locatie-informatie",
    metadataDescription:
      "Zoek praktische informatie over locaties in Amsterdam waar volwassenen tabakswinkels kunnen vinden, inclusief adressen, openingstijden en route-informatie. Alleen voor volwassenen van 18+.",
    h1: "Sigaretten kopen in Amsterdam",
    intro:
      "Deze pagina biedt neutrale en praktische locatie-informatie voor volwassenen van 18+ die zoeken naar tabakswinkels in Amsterdam. TobaccoNearby verkoopt geen tabaksproducten en moedigt roken niet aan. Controleer altijd openingstijden, contactgegevens en beschikbaarheid voordat je een winkel bezoekt.",
    context:
      "Gebruik deze pagina als praktische gids voor gepubliceerde tabakswinkels en tabakszaken in Amsterdam. De informatie kan adressen, openingstijden, route-links, contactgegevens, buurtinformatie en toegankelijkheidsdetails bevatten waar beschikbaar.",
    practicalPoints: [
      "Verkooplocaties en openingstijden kunnen veranderen door feestdagen, tijdelijke sluitingen of wijzigingen bij winkels.",
      "TobaccoNearby verwerkt geen bestellingen en toont geen verkoopgerichte informatie.",
      "Zoek ook per buurt, straat, postcode of gebied om relevante Amsterdamse locaties te vinden."
    ],
    faqs: [
      {
        question: "Verkoopt TobaccoNearby sigaretten?",
        answer:
          "Nee. TobaccoNearby verkoopt geen tabaksproducten en verwerkt geen bestellingen. De website biedt alleen praktische locatie-informatie voor volwassenen van 18+."
      },
      {
        question: "Waar kan ik sigaretten kopen in Amsterdam?",
        answer:
          "Volwassenen van 18+ kunnen via TobaccoNearby praktische informatie vinden over tabakswinkels in Amsterdam, zoals adressen, openingstijden en route-informatie. Controleer gegevens altijd voordat je vertrekt."
      },
      {
        question: "Zijn openingstijden altijd actueel?",
        answer:
          "Openingstijden kunnen veranderen door feestdagen, tijdelijke sluitingen of wijzigingen bij de winkel. Controleer details altijd voordat je een locatie bezoekt."
      },
      {
        question: "Kan ik zoeken op buurt?",
        answer:
          "Ja. Je kunt zoeken op buurt, postcode, straat of gebied, zoals Centrum, De Pijp, Jordaan, Nieuw-West, Zuidoost of Diemen."
      },
      {
        question: "Is TobaccoNearby alleen bedoeld voor volwassenen?",
        answer:
          "Ja. TobaccoNearby is bedoeld voor volwassenen van 18+ en biedt neutrale, praktische locatie-informatie."
      }
    ]
  },
  {
    href: "/amsterdam/waar-sigaretten-kopen",
    label: "Waar sigaretten kopen",
    metadataTitle: "Waar sigaretten kopen in Amsterdam? | TobaccoNearby",
    metadataDescription:
      "Bekijk waar volwassenen in Amsterdam praktische informatie kunnen vinden over tabakswinkels, openingstijden, adressen en route-informatie. Alleen bedoeld voor 18+.",
    h1: "Waar sigaretten kopen in Amsterdam?",
    intro:
      "Door veranderingen in verkooppunten kan het lastiger zijn om te weten waar tabakswinkels zich bevinden. TobaccoNearby biedt neutrale locatie-informatie voor volwassenen van 18+, zoals adressen, openingstijden en route-links.",
    context:
      "Deze pagina is bedoeld voor praktische oriëntatie op gepubliceerde Amsterdamse tabakswinkels en tabakszaken. TobaccoNearby verkoopt geen tabaksproducten, verwerkt geen bestellingen en moedigt roken niet aan.",
    practicalPoints: [
      "Gebruik de zoekfunctie om te zoeken op buurt, postcode, straatnaam of bekend gebied.",
      "Controleer openingstijden, contactgegevens, toegankelijkheid en beschikbaarheid altijd rechtstreeks voordat je vertrekt.",
      "Vermeldingen kunnen ook een kaart, route-link en openbaarvervoerinformatie bevatten waar beschikbaar."
    ],
    faqs: [
      {
        question: "Verkoopt TobaccoNearby sigaretten?",
        answer:
          "Nee. TobaccoNearby verkoopt geen tabaksproducten en verwerkt geen bestellingen. De website biedt alleen praktische locatie-informatie voor volwassenen van 18+."
      },
      {
        question: "Waar kan ik sigaretten kopen in Amsterdam?",
        answer:
          "Volwassenen van 18+ kunnen via TobaccoNearby praktische informatie vinden over tabakswinkels in Amsterdam, zoals adressen, openingstijden en route-informatie. Controleer gegevens altijd voordat je vertrekt."
      },
      {
        question: "Kan ik zoeken naar een tabakswinkel in de buurt?",
        answer:
          "Ja. Je kunt zoeken op buurt, postcode, straat of gebied. Als je locatie deelt in de browser, kan de zoekpagina resultaten op afstand sorteren."
      },
      {
        question: "Zijn alle vermeldingen geverifieerd?",
        answer:
          "Sommige vermeldingen kunnen als geverifieerd worden gemarkeerd, maar gegevens kunnen nog steeds wijzigen. Controleer belangrijke details altijd voordat je een winkel bezoekt."
      },
      {
        question: "Kan ik onjuiste informatie melden?",
        answer:
          "Ja. Je kunt een correctiesuggestie of update indienen. Inzendingen worden beoordeeld voordat informatie wordt aangepast."
      }
    ]
  },
  {
    href: "/amsterdam/buy-cigarettes",
    label: "Buy cigarettes Amsterdam",
    metadataTitle: "Buy Cigarettes in Amsterdam? Practical Location Information | TobaccoNearby",
    metadataDescription:
      "Find neutral, practical location information about tobacco shops in Amsterdam, including addresses, opening hours and directions. Adults aged 18+ only.",
    h1: "Buy Cigarettes in Amsterdam?",
    intro:
      "This page provides neutral location information for adults aged 18+ who are looking for practical information about tobacco shop locations in Amsterdam. TobaccoNearby does not sell tobacco products, process orders or promote smoking.",
    context:
      "Use this page to review published Amsterdam listings with practical details such as address, neighborhood, opening hours, contact information, accessibility notes and map directions where available.",
    practicalPoints: [
      "Listings are informational and may change because of holidays, temporary closures or shop updates.",
      "TobaccoNearby does not show sales-focused information or online ordering options.",
      "You can narrow your search by neighborhood, postal code, street, place type or nearby transport area."
    ],
    faqs: [
      {
        question: "Does TobaccoNearby sell cigarettes?",
        answer:
          "No. TobaccoNearby does not sell tobacco products, process orders or promote smoking. It only provides practical location information for adults aged 18+."
      },
      {
        question: "Where can I buy cigarettes in Amsterdam?",
        answer:
          "Adults aged 18+ can use TobaccoNearby to find practical information about listed tobacco shop locations in Amsterdam, including addresses, opening hours and directions."
      },
      {
        question: "Are opening hours always accurate?",
        answer:
          "Opening hours may change due to holidays, temporary closures or shop updates. Please verify details before visiting."
      },
      {
        question: "Can I search by neighborhood?",
        answer:
          "Yes. You can search by neighborhood, postal code, street or area, including Centrum, De Pijp, Jordaan, Nieuw-West, Zuidoost and Diemen."
      },
      {
        question: "Is TobaccoNearby a sales website?",
        answer:
          "No. TobaccoNearby provides neutral directory information only and does not sell tobacco products, process orders or promote smoking."
      }
    ]
  },
  {
    href: "/amsterdam/where-to-buy-cigarettes",
    label: "Where to buy cigarettes",
    metadataTitle: "Where to Buy Cigarettes in Amsterdam | Practical Shop Information",
    metadataDescription:
      "Find practical information about listed tobacco shops in Amsterdam, including addresses, opening hours, directions and contact details. Adults 18+ only.",
    h1: "Where to Buy Cigarettes in Amsterdam",
    intro:
      "TobaccoNearby helps adults find practical location information about listed tobacco shops in Amsterdam. Listings may include addresses, opening hours, contact details and directions. Information may change, so verify details before visiting.",
    context:
      "This page is an informational directory page for Amsterdam. It is not an online shop and does not promote tobacco use or product availability.",
    practicalPoints: [
      "Use listings as a starting point for address, route and contact information.",
      "Check shop details directly before travelling, especially during holidays or late opening hours.",
      "Browse Amsterdam area pages for more specific local context around Centrum, De Pijp, West, Oost, Noord, Zuid, Zuidoost, Nieuw-West and Diemen."
    ],
    faqs: [
      {
        question: "Does TobaccoNearby sell cigarettes?",
        answer:
          "No. TobaccoNearby does not sell tobacco products, process orders or promote smoking. It only provides practical location information for adults aged 18+."
      },
      {
        question: "Where can I buy cigarettes in Amsterdam?",
        answer:
          "Adults aged 18+ can use TobaccoNearby to find practical information about listed tobacco shop locations in Amsterdam, including addresses, opening hours and directions."
      },
      {
        question: "Can I get directions to listed shops?",
        answer:
          "Yes. Listings may include a directions link that opens route information in Google Maps where available."
      },
      {
        question: "Are opening hours always accurate?",
        answer:
          "Opening hours may change due to holidays, temporary closures or shop updates. Please verify details before visiting."
      },
      {
        question: "Can I report incorrect information?",
        answer:
          "Yes. Use the report or update options to submit a correction suggestion. Submitted updates are reviewed before publication or listing changes."
      }
    ]
  },
  {
    href: "/amsterdam/tobacco-shops",
    label: "Tobacco shops Amsterdam",
    metadataTitle: "Tobacco Shops in Amsterdam | TobaccoNearby",
    metadataDescription:
      "Search listed tobacco shops in Amsterdam with practical information such as addresses, opening hours, directions, place type and contact details. Adults 18+ only.",
    h1: "Tobacco Shops in Amsterdam",
    intro:
      "This page lists practical information about tobacco shop locations in Amsterdam. TobaccoNearby is intended for adults aged 18+ and does not sell tobacco products or promote smoking.",
    context:
      "Published listings may include shop location, area, place type, opening hours, phone number, website, accessibility information and directions where available.",
    practicalPoints: [
      "Use the listings and map for practical location reference only.",
      "Shop details may change, so verify opening hours, contact details and accessibility information before visiting.",
      "TobaccoNearby is built for Amsterdam now and structured so more Dutch cities can be added later."
    ],
    faqs: [
      {
        question: "Does TobaccoNearby sell tobacco products?",
        answer:
          "No. TobaccoNearby does not sell tobacco products, process orders or promote smoking. It only provides practical location information for adults aged 18+."
      },
      {
        question: "How can I search tobacco shops in Amsterdam?",
        answer:
          "Use the search page or this listing page to review addresses, opening hours, directions, place type and neighborhood details where available."
      },
      {
        question: "Can I search by neighborhood?",
        answer:
          "Yes. You can search by neighborhood, postal code, street or area, including Centrum, De Pijp, Jordaan, Nieuw-West, Zuidoost and Diemen."
      },
      {
        question: "Are opening hours always accurate?",
        answer:
          "Opening hours may change due to holidays, temporary closures or shop updates. Please verify details before visiting."
      },
      {
        question: "Can I report incorrect shop information?",
        answer:
          "Yes. Use the report or update option to suggest corrections. Submitted updates are reviewed before any changes are made."
      }
    ]
  }
];

export function getSeoLandingPage(href: string) {
  return seoLandingPages.find((page) => page.href === href);
}

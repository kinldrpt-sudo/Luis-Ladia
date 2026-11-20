// Jediný zdroj textů a nastavení pro vánoční přání. Upravujte jen tento soubor.
window.GREETING = {
  // Zobrazí nenápadný štítek návrhu na úvodní fotce. Hodnota false znamená finální verzi ke sdílení.
  draft: false,

  senders: ["Luis Rodríguez", "Ladislav Prištic"],
  monogram: "L&L",
  season: "Vánoce 2026 · Nový rok 2027",

  hero: {
    eyebrow: "Krásné svátky",
    title: "Veselé Vánoce",
    subtitle: "a šťastný nový rok 2027"
  },

  // Automatický odpočet: nejprve do Štědrého dne a poté do Nového roku.
  countdown: {
    christmas: "2026-12-24T00:00:00+01:00",
    newYear: "2027-01-01T00:00:00+01:00",
    timeZone: "Europe/Prague"
  },

  // Hlavní dopis s přáním.
  letter: {
    title: "Ze srdce vám přejeme",
    paragraphs: [
      "V tomto kouzelném svátečním čase se na chvíli zastavujeme, abychom vám popřáli krásné a pokojné svátky v kruhu těch, kteří prozařují váš život.",
      "Ať Vánoce naplní váš domov klidem, upřímným objetím a okamžiky, které vám zůstanou v srdci navždy.",
      "A ať nový rok 2027 přinese spoustu radosti, pevné zdraví, hojnost, štěstí a nové sny, které můžeme společně oslavit."
    ],
    closing: "S těmi nejkrásnějšími přáními,"
  },

  // Přání pro nový rok. icon: star, gift, candle, heart nebo glass.
  wishesHeading: "Přání pro rok 2027",
  wishes: [
    { title: "Radost", detail: "Společný smích a dny plné světla", icon: "star" },
    { title: "Hojnost", detail: "Prosperita, úspěšné projekty a bohatě prostřený stůl", icon: "gift" },
    { title: "Zdraví a klid", detail: "Pohoda v duši a dobrá nálada každý den", icon: "candle" },
    { title: "Láska", detail: "Dlouhá objetí s těmi, které máte nejraději", icon: "heart" },
    { title: "Nové sny", detail: "Otevřené cesty a nezapomenutelné přípitky", icon: "glass" }
  ],

  // Interaktivní blok pro přípitek.
  toast: {
    heading: "Přípitek na vše, co přichází",
    body: "Ať už jsme blízko, nebo na dálku, pozvedáme sklenku na vás a na vše krásné, co tento nový rok přinese.",
    buttonLabel: "Pozvednout sklenku",
    phrases: [
      "Na rok 2027 plný zdraví, klidu a hojnosti!",
      "Na všechna objetí, která nás ještě čekají!",
      "Na velké radosti i malé každodenní zázraky!",
      "Ať nikdy nechybí důvod k oslavě!",
      "Zdraví, lásku a štěstí vám i vašim blízkým!"
    ]
  },

  // Prázdná hodnota spustí 3D animaci otevření obálky s voskovou pečetí.
  introVideo: "",
  // Prázdná hodnota skryje tlačítko hudby. Můžete přidat cestu k licencovanému vánočnímu .mp3.
  music: ""
};

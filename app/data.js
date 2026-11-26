// Kalandria national statistics — all figures invented for the fictional
// Republic of Kalandria. Every series below is internally consistent:
// province populations sum to the national total, age groups sum to 100%,
// and economic sectors sum to 100% of gross value added.

const KALANDRIA = {
  country: "Republic of Kalandria",
  capital: "Port Meridia",
  currency: "kaldar",
  currencySymbol: "K",
  office: "Kalandria National Statistics Office (KNSO)",
  years: [2019, 2020, 2021, 2022, 2023, 2024],
  areaKm2: 84620,

  population: {
    total: [4102000, 4138000, 4171000, 4205000, 4244000, 4286000],
    change2024: { births: 58900, deaths: 30200, netMigration: 13300 },
    lifeExpectancy: [77.4, 77.1, 77.6, 78.0, 78.3, 78.6],
    lifeMale2024: 76.1,
    lifeFemale2024: 81.2,
    ageGroups2024: [
      { label: "0–14 years", pct: 21.4 },
      { label: "15–24 years", pct: 13.2 },
      { label: "25–54 years", pct: 43.8 },
      { label: "55–64 years", pct: 11.6 },
      { label: "65 years and over", pct: 10.0 },
    ],
  },

  economy: {
    gdpBillion: [38.4, 36.9, 39.8, 43.1, 45.6, 48.2],
    gdpGrowth: [3.1, -3.9, 7.9, 8.3, 5.8, 5.7],
    unemployment: [5.8, 7.4, 6.9, 6.1, 5.6, 5.2],
    inflation: [2.1, 1.4, 3.2, 6.8, 4.4, 2.9],
    exportsBillion: [12.4, 11.1, 13.6, 15.9, 16.8, 18.2],
    importsBillion: [13.1, 12.0, 14.2, 16.4, 17.0, 17.6],
    sectors2024: [
      { label: "Services", pct: 58.2 },
      { label: "Industry", pct: 24.6 },
      { label: "Agriculture", pct: 9.4 },
      { label: "Construction", pct: 5.1 },
      { label: "Other", pct: 2.7 },
    ],
  },

  environment2024: [
    { label: "Renewable share of electricity", value: 41.2, unit: "%", note: "Target 50% by 2030" },
    { label: "Forest cover", value: 46.8, unit: "%", note: "of total land area" },
    { label: "CO₂ emissions per capita", value: 4.9, unit: "t", note: "Down from 5.6 t in 2019" },
    { label: "Days with good air quality", value: 312, unit: "days", note: "of 365 days in 2024" },
    { label: "Household recycling rate", value: 38.5, unit: "%", note: "Up from 31.0% in 2019" },
    { label: "Protected land", value: 18.3, unit: "%", note: "of total land area" },
  ],

  provinces: [
    { name: "Port Meridia", capital: true, population: 1142000, areaKm2: 1240, gdpPerCapita: 16480, unemployment: 4.6, life: 79.4, forest: 12.4, renewable: 38.6, co2: 5.8, recycling: 44.1, protected: 9.2, goodDays: 298 },
    { name: "Aldermere", capital: false, population: 786000, areaKm2: 9840, gdpPerCapita: 11920, unemployment: 5.1, life: 78.8, forest: 52.1, renewable: 44.3, co2: 4.6, recycling: 39.8, protected: 21.5, goodDays: 318 },
    { name: "Caelum Coast", capital: false, population: 654000, areaKm2: 7620, gdpPerCapita: 12640, unemployment: 4.9, life: 79.1, forest: 31.7, renewable: 47.9, co2: 4.2, recycling: 41.2, protected: 14.8, goodDays: 331 },
    { name: "Dunvarra", capital: false, population: 512000, areaKm2: 12480, gdpPerCapita: 9870, unemployment: 5.8, life: 78.2, forest: 58.9, renewable: 39.4, co2: 5.1, recycling: 33.6, protected: 24.6, goodDays: 309 },
    { name: "Eastfield", capital: false, population: 438000, areaKm2: 10960, gdpPerCapita: 9140, unemployment: 6.2, life: 77.9, forest: 44.2, renewable: 36.8, co2: 5.4, recycling: 35.9, protected: 16.1, goodDays: 304 },
    { name: "Halcyon Isles", capital: false, population: 296000, areaKm2: 6540, gdpPerCapita: 10580, unemployment: 5.5, life: 79.6, forest: 28.5, renewable: 52.4, co2: 3.8, recycling: 40.7, protected: 27.3, goodDays: 342 },
    { name: "Nordmark", capital: false, population: 274000, areaKm2: 18320, gdpPerCapita: 8760, unemployment: 6.0, life: 78.0, forest: 63.8, renewable: 42.1, co2: 4.4, recycling: 31.2, protected: 29.8, goodDays: 322 },
    { name: "Veyl Highlands", capital: false, population: 184000, areaKm2: 17620, gdpPerCapita: 7930, unemployment: 6.8, life: 77.4, forest: 71.2, renewable: 48.7, co2: 3.9, recycling: 29.4, protected: 34.5, goodDays: 336 },
  ],

  releases: [
    { date: "25 Nov 2026", title: "Consumer prices, October 2026", detail: "Consumer prices rose 2.9% year on year; food prices up 3.4%, transport down 0.8%." },
    { date: "21 Nov 2026", title: "Labour force survey, Q3 2026", detail: "Unemployment eased to 5.1%; employment rose by 18,400 people over the quarter." },
    { date: "18 Nov 2026", title: "Regional GDP, 2024", detail: "Port Meridia leads the provinces at K 16,480 per capita; Veyl Highlands lowest at K 7,930." },
    { date: "12 Nov 2026", title: "Population estimate, 2024", detail: "Population reached 4,286,000 — up 42,000 on 2023, driven by 58,900 births and net migration of 13,300." },
    { date: "05 Nov 2026", title: "Trade bulletin, September 2026", detail: "Goods trade surplus of K 0.6 billion in 2024; exports grew 8.3% to K 18.2 billion." },
    { date: "28 Oct 2026", title: "Environment indicators, 2024", detail: "Renewables supplied 41.2% of electricity; forest cover held at 46.8% of land." },
  ],
};

// Derived figures, computed from the series above so the site can never
// show a number that disagrees with its own tables.
KALANDRIA.derived = (() => {
  const pop = KALANDRIA.population.total;
  const gdp = KALANDRIA.economy.gdpBillion;
  const last = KALANDRIA.years.length - 1;
  const gdpPerCapita2024 = Math.round((gdp[last] * 1e9) / pop[last]);
  const popGrowth = ((pop[last] - pop[last - 1]) / pop[last - 1]) * 100;
  const tradeBalance2024 = +(KALANDRIA.economy.exportsBillion[last] - KALANDRIA.economy.importsBillion[last]).toFixed(1);
  const provincePopSum = KALANDRIA.provinces.reduce((s, p) => s + p.population, 0);
  const ageSum = KALANDRIA.population.ageGroups2024.reduce((s, g) => s + g.pct, 0);
  const sectorSum = KALANDRIA.economy.sectors2024.reduce((s, g) => s + g.pct, 0);
  const density = pop[last] / KALANDRIA.areaKm2;
  return { gdpPerCapita2024, popGrowth, tradeBalance2024, provincePopSum, ageSum, sectorSum, density };
})();

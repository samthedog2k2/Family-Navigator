
export type ShipInfo = {
    id: string;
    name: string;
    cruiseLine: string;
    built: number;
    tonnage: number;
    length: number; // in feet
    beam: number; // in feet
    pax: number;
    crew: number;
    speed: number; // in knots
    lastRefurb?: string;
    imageUrl?: string;
};

export const shipData: ShipInfo[] = [
    // Royal Caribbean
    { id: 'RCI_Icon', name: 'Icon of the Seas', cruiseLine: 'Royal Caribbean', built: 2023, tonnage: 250800, length: 1198, beam: 213, pax: 7600, crew: 2350, speed: 22 },
    { id: 'RCI_Wonder', name: 'Wonder of the Seas', cruiseLine: 'Royal Caribbean', built: 2022, tonnage: 236857, length: 1188, beam: 210, pax: 6988, crew: 2300, speed: 22 },
    { id: 'RCI_Symphony', name: 'Symphony of the Seas', cruiseLine: 'Royal Caribbean', built: 2018, tonnage: 228081, length: 1188, beam: 215.5, pax: 6680, crew: 2200, speed: 22 },
    { id: 'RCI_Harmony', name: 'Harmony of the Seas', cruiseLine: 'Royal Caribbean', built: 2016, tonnage: 226963, length: 1188, beam: 215.5, pax: 6687, crew: 2200, speed: 22, lastRefurb: "2021" },
    { id: 'RCI_Utopia', name: 'Utopia of the Seas', cruiseLine: 'Royal Caribbean', built: 2024, tonnage: 236860, length: 1188, beam: 211, pax: 5668, crew: 2290, speed: 22 },

    // Carnival
    { id: 'CCL_MardiGras', name: 'Mardi Gras', cruiseLine: 'Carnival', built: 2020, tonnage: 181808, length: 1130, beam: 137, pax: 6500, crew: 1735, speed: 23 },
    { id: 'CCL_Celebration', name: 'Carnival Celebration', cruiseLine: 'Carnival', built: 2022, tonnage: 183521, length: 1130, beam: 137, pax: 6631, crew: 1735, speed: 17 },
    { id: 'CCL_Jubilee', name: 'Carnival Jubilee', cruiseLine: 'Carnival', built: 2023, tonnage: 183521, length: 1130, beam: 137, pax: 6631, crew: 1735, speed: 17 },
    { id: 'CCL_Venice', name: 'Carnival Venezia', cruiseLine: 'Carnival', built: 2019, tonnage: 135225, length: 1061, beam: 122, pax: 5145, crew: 1393, speed: 22.5, lastRefurb: "2023" },

    // Norwegian Cruise Line
    { id: 'NCL_Prima', name: 'Norwegian Prima', cruiseLine: 'Norwegian', built: 2022, tonnage: 143535, length: 965, beam: 133, pax: 3099, crew: 1506, speed: 21.5 },
    { id: 'NCL_Viva', name: 'Norwegian Viva', cruiseLine: 'Norwegian', built: 2023, tonnage: 143535, length: 965, beam: 133, pax: 3099, crew: 1506, speed: 21.5 },
    { id: 'NCL_Encore', name: 'Norwegian Encore', cruiseLine: 'Norwegian', built: 2019, tonnage: 169116, length: 1094, beam: 136, pax: 3998, crew: 1735, speed: 22.5 },

    // MSC Cruises
    { id: 'MSC_WorldEuropa', name: 'MSC World Europa', cruiseLine: 'MSC Cruises', built: 2022, tonnage: 215863, length: 1094, beam: 154, pax: 6762, crew: 2138, speed: 22.7 },
    { id: 'MSC_Meraviglia', name: 'MSC Meraviglia', cruiseLine: 'MSC Cruises', built: 2017, tonnage: 171598, length: 1036, beam: 141, pax: 5642, crew: 1536, speed: 22.7, lastRefurb: "2021" },
    { id: 'MSC_Seascape', name: 'MSC Seascape', cruiseLine: 'MSC Cruises', built: 2022, tonnage: 170412, length: 1112, beam: 135, pax: 5877, crew: 1700, speed: 21.8, imageUrl: "https://www.cruisemapper.com/images/ships/2281-3f5f3e9a58b.jpg" },

    // Disney Cruise Line
    { id: 'DCL_Wish', name: 'Disney Wish', cruiseLine: 'Disney', built: 2022, tonnage: 144000, length: 1119, beam: 128, pax: 4000, crew: 1555, speed: 22 },
    { id: 'DCL_Fantasy', name: 'Disney Fantasy', cruiseLine: 'Disney', built: 2012, tonnage: 129750, length: 1115, beam: 125, pax: 4000, crew: 1458, speed: 22, lastRefurb: "2023" },
    { id: 'DCL_Treasure', name: 'Disney Treasure', cruiseLine: 'Disney', built: 2024, tonnage: 144000, length: 1119, beam: 128, pax: 4000, crew: 1555, speed: 22 },

    // Holland America
    { id: 'HAL_Rotterdam', name: 'Rotterdam', cruiseLine: 'Holland America', built: 2021, tonnage: 99935, length: 984, beam: 115, pax: 2668, crew: 1053, speed: 22 },
    { id: 'HAL_Koningsdam', name: 'Koningsdam', cruiseLine: 'Holland America', built: 2016, tonnage: 99863, length: 975, beam: 115, pax: 2650, crew: 1025, speed: 22, lastRefurb: "2021" },

    // Virgin Voyages
    { id: 'VV_Scarlet', name: 'Scarlet Lady', cruiseLine: 'Virgin Voyages', built: 2020, tonnage: 110000, length: 909, beam: 125, pax: 2770, crew: 1160, speed: 22 },
    { id: 'VV_Valiant', name: 'Valiant Lady', cruiseLine: 'Virgin Voyages', built: 2021, tonnage: 110000, length: 909, beam: 125, pax: 2770, crew: 1160, speed: 22 },

    // Viking Ocean Cruises
    { id: 'Viking_Saturn', name: 'Viking Saturn', cruiseLine: 'Viking', built: 2023, tonnage: 47800, length: 745, beam: 94.5, pax: 930, crew: 465, speed: 20 },
    { id: 'Viking_Neptune', name: 'Viking Neptune', cruiseLine: 'Viking', built: 2022, tonnage: 47800, length: 745, beam: 94.5, pax: 930, crew: 465, speed: 20 },

    // Celebrity Cruises
    { id: 'CEL_Ascent', name: 'Celebrity Ascent', cruiseLine: 'Celebrity', built: 2023, tonnage: 140600, length: 1073, beam: 128, pax: 3260, crew: 1430, speed: 22 },
    { id: 'CEL_Beyond', name: 'Celebrity Beyond', cruiseLine: 'Celebrity', built: 2022, tonnage: 141420, length: 1073, beam: 128, pax: 3260, crew: 1416, speed: 22 },
];

    
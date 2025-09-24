
export type ShipInfo = {
    id: string;
    name: string;
    cruiseLine: string;
    built: number;
    tonnage: number;
    pax: number;
    crew: number;
    lastRefurb?: string;
};

export const shipData: ShipInfo[] = [
    // Royal Caribbean
    { id: 'RCI_Icon', name: 'Icon of the Seas', cruiseLine: 'Royal Caribbean', built: 2023, tonnage: 250800, pax: 7600, crew: 2350 },
    { id: 'RCI_Wonder', name: 'Wonder of the Seas', cruiseLine: 'Royal Caribbean', built: 2022, tonnage: 236857, pax: 6988, crew: 2300 },
    { id: 'RCI_Symphony', name: 'Symphony of the Seas', cruiseLine: 'Royal Caribbean', built: 2018, tonnage: 228081, pax: 6680, crew: 2200 },
    
    // Carnival
    { id: 'CCL_MardiGras', name: 'Mardi Gras', cruiseLine: 'Carnival', built: 2020, tonnage: 181808, pax: 6500, crew: 1735 },
    { id: 'CCL_Celebration', name: 'Carnival Celebration', cruiseLine: 'Carnival', built: 2022, tonnage: 183521, pax: 6631, crew: 1735 },
    { id: 'CCL_Jubilee', name: 'Carnival Jubilee', cruiseLine: 'Carnival', built: 2023, tonnage: 183521, pax: 6631, crew: 1735 },

    // Norwegian Cruise Line
    { id: 'NCL_Prima', name: 'Norwegian Prima', cruiseLine: 'Norwegian', built: 2022, tonnage: 143535, pax: 3099, crew: 1506 },
    { id: 'NCL_Viva', name: 'Norwegian Viva', cruiseLine: 'Norwegian', built: 2023, tonnage: 143535, pax: 3099, crew: 1506 },
    { id: 'NCL_Encore', name: 'Norwegian Encore', cruiseLine: 'Norwegian', built: 2019, tonnage: 169116, pax: 3998, crew: 1735 },

    // MSC Cruises
    { id: 'MSC_WorldEuropa', name: 'MSC World Europa', cruiseLine: 'MSC Cruises', built: 2022, tonnage: 215863, pax: 6762, crew: 2138 },
    { id: 'MSC_Meraviglia', name: 'MSC Meraviglia', cruiseLine: 'MSC Cruises', built: 2017, tonnage: 171598, pax: 5642, crew: 1536 },
    { id: 'MSC_Seascape', name: 'MSC Seascape', cruiseLine: 'MSC Cruises', built: 2022, tonnage: 170412, pax: 5632, crew: 1648 },

    // Disney Cruise Line
    { id: 'DCL_Wish', name: 'Disney Wish', cruiseLine: 'Disney', built: 2022, tonnage: 144000, pax: 4000, crew: 1555 },
    { id: 'DCL_Fantasy', name: 'Disney Fantasy', cruiseLine: 'Disney', built: 2012, tonnage: 129750, pax: 4000, crew: 1458 },
    
    // Holland America
    { id: 'HAL_Rotterdam', name: 'Rotterdam', cruiseLine: 'Holland America', built: 2021, tonnage: 99935, pax: 2668, crew: 1053 },
    
    // Virgin Voyages
    { id: 'VV_Scarlet', name: 'Scarlet Lady', cruiseLine: 'Virgin Voyages', built: 2020, tonnage: 110000, pax: 2770, crew: 1160 },
    
    // Viking Ocean Cruises
    { id: 'Viking_Saturn', name: 'Viking Saturn', cruiseLine: 'Viking', built: 2023, tonnage: 47800, pax: 930, crew: 465 },

    // Celebrity Cruises
    { id: 'CEL_Ascent', name: 'Celebrity Ascent', cruiseLine: 'Celebrity', built: 2023, tonnage: 140600, pax: 3260, crew: 1430 },
];

    
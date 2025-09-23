"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PackingGuideProps {
  mode: 'family' | 'couple';
}

export function PackingGuide({ mode }: PackingGuideProps) {
  const familyList = [
    'Seasickness medication', 
    'Snacks for kids', 
    'Formal wear for theme nights', 
    'Sunscreen and aloe vera', 
    'Passports and travel documents', 
    'Portable charger/power bank', 
    'Card games or books for downtime',
  ];
  const coupleList = [
    'Elegant outfits for dinner', 
    'Magnetic hooks for extra hanging space', 
    'A good book or e-reader', 
    'Your favorite wine or spirits (check cruise line policy)', 
    'Camera for capturing memories', 
    'Sunglasses and a wide-brimmed hat',
  ];

  const list = mode === 'family' ? familyList : coupleList;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Packing Guide: {mode === 'family' ? 'Family Essentials' : 'Couple\'s Getaway'}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc space-y-2 pl-5">
          {list.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground italic">
          Insider Tip: Pack a small carry-on with essentials (swimsuit, change of clothes) for the first day on the ship before your main luggage arrives.
        </p>
      </CardContent>
    </Card>
  );
}

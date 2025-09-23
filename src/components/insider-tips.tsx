"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InsiderTipsProps {
  mode: 'family' | 'couple';
}

export function InsiderTips({ mode }: InsiderTipsProps) {
    const familyTips = [
        "Look for 'Kids Sail Free' promotions, often available on MSC and Norwegian for future sailings.",
        "Use a family or multi-device Wi-Fi plan; it's almost always cheaper than buying for each person.",
        "Off-port parking lots are 40-60% cheaper than port garages and offer free shuttles.",
        "Check CruiseCritic and Reddit forums for recent reviews on kids' clubs and family activities for your specific ship.",
    ];

    const coupleTips = [
        "Consider booking a spa pass for the week for access to exclusive, quiet thermal suites.",
        "Many cruise lines allow you to bring one bottle of wine or champagne per person.",
        "Look for last-minute deals on sites like Vacations To Go, which can offer up to 70% off if your dates are flexible.",
        "Research 'resale' cruise bookings on sites like TransferTravel or SpareFare for potentially deep discounts.",
    ];

  const tips = mode === 'family' ? familyTips : coupleTips;

  return (
    <Card className="bg-yellow-100/50">
      <CardHeader>
        <CardTitle>Insider Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc space-y-2 pl-5">
          {tips.map((tip, i) => <li key={i}>{tip}</li>)}
        </ul>
      </CardContent>
    </Card>
  );
}

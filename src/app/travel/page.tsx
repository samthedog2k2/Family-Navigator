import { CruiseFinder } from "@/components/cruise-finder";
import { PageHeader } from "@/components/page-header";

export default function TravelPage() {
  return (
    <main className="flex-1 p-4 sm:p-6">
      <PageHeader
        title="Cruise Finder"
        description="Find your next cruise adventure with our detailed search tool."
      />
      <CruiseFinder />
    </main>
  );
}

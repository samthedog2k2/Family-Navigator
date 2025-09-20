
import { FamilyCalendar } from "@/components/family-calendar";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";

export default function CalendarPage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="Family Calendar"
        description="Organize and view schedules for the whole family."
      />
      <FamilyCalendar />
    </LayoutWrapper>
  );
}

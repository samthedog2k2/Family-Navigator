
import { FamilyCalendar } from "@/components/family-calendar";
import { CalendarControlSidebar } from "@/components/calendar-control-sidebar";
import { LayoutWrapper } from "@/components/layout-wrapper";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function CalendarPage() {
  return (
    <SidebarProvider>
      <Sidebar>
        <CalendarControlSidebar />
      </Sidebar>
      <SidebarInset>
        <LayoutWrapper>
          <FamilyCalendar />
        </LayoutWrapper>
      </SidebarInset>
    </SidebarProvider>
  );
}

import {
  Bell,
  Building2,
  CalendarDays,
  GraduationCap,
  Images,
  Inbox,
  KeyRound,
  LayoutDashboard,
  PanelTop,
  UsersRound,
  type LucideProps,
} from "lucide-react";
import type { AdminIcon as AdminIconName } from "@/lib/admin-nav";

const icons = {
  dashboard: LayoutDashboard,
  bell: Bell,
  calendar: CalendarDays,
  inbox: Inbox,
  panel: PanelTop,
  images: Images,
  graduation: GraduationCap,
  building: Building2,
  users: UsersRound,
  key: KeyRound,
} satisfies Record<AdminIconName, React.ComponentType<LucideProps>>;

export function AdminIcon({ name, ...props }: { name: AdminIconName } & LucideProps) {
  const Icon = icons[name];
  return <Icon {...props} />;
}

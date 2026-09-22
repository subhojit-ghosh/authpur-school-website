import {
  Bell,
  Building2,
  ClipboardList,
  CalendarDays,
  GraduationCap,
  History,
  Images,
  Inbox,
  KeyRound,
  LayoutDashboard,
  PanelTop,
  Type,
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
  clipboard: ClipboardList,
  building: Building2,
  text: Type,
  users: UsersRound,
  history: History,
  key: KeyRound,
} satisfies Record<AdminIconName, React.ComponentType<LucideProps>>;

export function AdminIcon({ name, ...props }: { name: AdminIconName } & LucideProps) {
  const Icon = icons[name];
  return <Icon {...props} />;
}

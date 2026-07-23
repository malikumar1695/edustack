import {
  AppstoreOutlined,
  BarChartOutlined,
  BugOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CreditCardOutlined,
  CrownOutlined,
  DashboardOutlined,
  DesktopOutlined,
  FormOutlined,
  HomeOutlined,
  IdcardOutlined,
  MonitorOutlined,
  OrderedListOutlined,
  ProfileOutlined,
  ProjectOutlined,
  ReadOutlined,
  RobotOutlined,
  SettingOutlined,
  StopOutlined,
  TableOutlined,
  UnorderedListOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import type { MenuRoute } from "./menuRoutes";

// Explicit imports (rather than `import *`) so the bundler can tree-shake
// unused icons — config/routes.ts's `icon: 'home'` string convention only
// auto-resolves inside Umi Max, whose layout plugin does this same lookup
// before ProLayout ever sees the route tree.
const ICONS: Record<string, React.ComponentType> = {
  home: HomeOutlined,
  crown: CrownOutlined,
  dashboard: DashboardOutlined,
  barChart: BarChartOutlined,
  monitor: MonitorOutlined,
  desktop: DesktopOutlined,
  form: FormOutlined,
  orderedList: OrderedListOutlined,
  profile: ProfileOutlined,
  table: TableOutlined,
  read: ReadOutlined,
  project: ProjectOutlined,
  appstore: AppstoreOutlined,
  unorderedList: UnorderedListOutlined,
  creditCard: CreditCardOutlined,
  idcard: IdcardOutlined,
  checkCircle: CheckCircleOutlined,
  closeCircle: CloseCircleOutlined,
  warning: WarningOutlined,
  stop: StopOutlined,
  bug: BugOutlined,
  user: UserOutlined,
  setting: SettingOutlined,
  robot: RobotOutlined,
};

function resolveIcon(name?: string): React.ReactNode {
  if (!name) return undefined;
  const Icon = ICONS[name];
  return Icon ? <Icon /> : undefined;
}

export type ResolvedMenuRoute = Omit<MenuRoute, "icon" | "routes"> & {
  icon?: React.ReactNode;
  routes?: ResolvedMenuRoute[];
};

export function withResolvedIcons(routes: MenuRoute[]): ResolvedMenuRoute[] {
  return routes.map((route) => ({
    ...route,
    icon: resolveIcon(route.icon),
    routes: route.routes ? withResolvedIcons(route.routes) : undefined,
  }));
}

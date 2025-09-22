
export type NavLink = {
  title: string;
  href: string;
  description: string;
  isLeaf: true;
};

export type NavMenu = {
  title:string;
  description: string;
  isLeaf: false;
  children: (NavLink & { isOverview?: boolean })[];
};

export type NavItem = NavLink | NavMenu;

export const isNavMenu = (item: NavItem): item is NavMenu => !item.isLeaf;

export const mainNavItems: NavItem[] = [
  { title: "Home", href: "/", description: "Go to homepage", isLeaf: true },
  { title: "Chat", href: "/chat", description: "Chat with an AI", isLeaf: true },
  { title: "Calendar", href: "/calendar", description: "Organize your family's schedule", isLeaf: true },
  { title: "Weather", href: "/weather", description: "Check the local forecast", isLeaf: true },
  {
    title: "School",
    isLeaf: false,
    description: "Track grades and assignments",
    children: [
      { title: "Overview", href: "/school", description: "View the main school dashboard.", isLeaf: true, isOverview: true },
      { title: "Ethan's Page", href: "/school/ethan", description: "View Ethan's schedule, grades, and assignments.", isLeaf: true },
      { title: "Elle's Page", href: "/school/elle", description: "View Elle's schedule, grades, and assignments.", isLeaf: true },
    ],
  },

  {
    title: "Screen Time",
    isLeaf: false,
    description: "Monitor and manage your family's device usage.",
    children: [
      { title: "Overview", href: "/screentime", description: "View the main screen time dashboard.", isLeaf: true, isOverview: true },
      { title: "Ethan's Usage", href: "/screentime/ethan", description: "Track usage for Ethan's devices.", isLeaf: true },
      { title: "Elle's Usage", href: "/screentime/elle", description: "Track usage for Elle's devices.", isLeaf: true },
    ],
  },

  {
    title: "Entertainment",
    isLeaf: false,
    description: "Manage subscriptions and watchlists.",
    children: [
      { title: "Overview", href: "/entertainment", description: "Manage your streaming subscriptions and watchlists.", isLeaf: true, isOverview: true },
      { title: "Netflix", href: "/entertainment/subscriptions/netflix", description: "Manage Netflix subscription.", isLeaf: true },
      { title: "Hulu", href: "/entertainment/subscriptions/hulu", description: "Manage Hulu subscription.", isLeaf: true },
      { title: "Prime", href: "/entertainment/subscriptions/prime", description: "Manage Prime Video subscription.", isLeaf: true },
      { title: "Max", href: "/entertainment/subscriptions/max", description: "Manage Max subscription.", isLeaf: true },
      { title: "Apple TV+", href: "/entertainment/subscriptions/apple", description: "Manage Apple TV+ subscription.", isLeaf: true },
      { title: "Movies", href: "/entertainment/movies", description: "Track movies to watch.", isLeaf: true },
      { title: "Sports", href: "/entertainment/sports", description: "Follow your favorite sports.", isLeaf: true },
    ],
  },

  { title: "Travel", href: "/travel", description: "Plan your next family adventure", isLeaf: true },
  { title: "Finance", href: "/finance", description: "Manage your family's finances", isLeaf: true },
  { title: "Health", href: "/health", description: "Keep track of your family's health", isLeaf: true },

  {
    title: "AI Agents",
    isLeaf: false,
    description: "Interact with AI agents.",
    children: [
      { title: "Webpages Agent", href: "/agents/webpages", description: "Interact with websites to extract info and perform tasks.", isLeaf: true, isOverview: true },
      { title: "Travel Agent", href: "/agents/travel", description: "Plan trips, find deals, and get travel recommendations.", isLeaf: true },
      { title: "Finance Agent", href: "/agents/finance", description: "Analyze spending, track investments, and get financial advice.", isLeaf: true },
      { title: "Health Agent", href: "/agents/health", description: "Monitor health data, get tips, and track wellness goals.", isLeaf: true },
    ],
  },
];

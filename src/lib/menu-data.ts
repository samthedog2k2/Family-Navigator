export type NavLink = {
  title: string;
  href: string;
  description: string;
  isLeaf: true;
};

export type NavMenu = {
  title: string;
  description: string;
  isLeaf: false;
  children: (NavLink & { isOverview?: boolean })[];
};

export type NavItem = NavLink | NavMenu;

export const isNavMenu = (item: NavItem): item is NavMenu => !item.isLeaf;

export const mainNavItems: NavItem[] = [
  { title: "Home", href: "/", description: "Go to homepage", isLeaf: true },
  { title: "Chat", href: "/chat", description: "Chat with an AI", isLeaf: true },
  { title: "Calendar", href: "/calendar", description: "View family calendar", isLeaf: true },
  {
    title: "School",
    isLeaf: false,
    description: "Monitor your family's school activities.",
    children: [
       {
        title: "Overview",
        href: "/school",
        description: "View the main school dashboard.",
        isLeaf: true,
        isOverview: true,
      },
      {
        title: "Ethan's Page",
        href: "/school/ethan",
        description: "View Ethan's school schedule, grades, and assignments.",
        isLeaf: true,
      },
      {
        title: "Elle's Page",
        href: "/school/elle",
        description: "View Elle's school schedule, grades, and assignments.",
        isLeaf: true,
      }
    ]
  },
  {
    title: "Screen Time",
    isLeaf: false,
    description: "Monitor and manage your family's device usage.",
    children: [
      {
        title: "Overview",
        href: "/screentime",
        description: "View the main screen time dashboard.",
        isLeaf: true,
        isOverview: true,
      },
      {
        title: "Ethan's Usage",
        href: "/screentime/ethan",
        description: "Track usage for iPad, Oculus, and Switch.",
        isLeaf: true,
      },
      {
        title: "Elle's Usage",
        href: "/screentime/elle",
        description: "Track usage for iPad, Oculus, and Switch.",
        isLeaf: true,
      }
    ]
  },
  {
    title: "Weather",
    isLeaf: false,
    description: "Check the local forecast and radar.",
    children: [
       {
        title: "Overview",
        href: "/weather",
        description: "View the main weather dashboard.",
        isLeaf: true,
        isOverview: true,
      },
       {
        title: "Forecast",
        href: "/weather/forecast",
        description: "View the latest weather forecast.",
        isLeaf: true,
      },
      {
        title: "Radar",
        href: "/weather/radar",
        description: "See real-time weather radar maps.",
        isLeaf: true,
      }
    ]
  },
  {
    title: "Entertainment",
    isLeaf: false,
    description: "Manage your subscriptions and watchlists.",
    children: [
      { title: "Overview", href: "/entertainment", description: "Manage your streaming subscriptions and watchlists.", isLeaf: true, isOverview: true },
      { title: "Netflix", href: "/entertainment/subscriptions/netflix", description: "Manage your Netflix subscription.", isLeaf: true, },
      { title: "Hulu", href: "/entertainment/subscriptions/hulu", description: "Manage your Hulu subscription.", isLeaf: true, },
      { title: "Prime", href: "/entertainment/subscriptions/prime", description: "Manage your Prime Video subscription.", isLeaf: true, },
      { title: "Max", href: "/entertainment/subscriptions/max", description: "Manage your Max subscription.", isLeaf: true, },
      { title: "Apple TV+", href: "/entertainment/subscriptions/apple", description: "Manage your Apple TV+ subscription.", isLeaf: true, },
      { title: "Movies", href: "/entertainment/movies", description: "Track movies to watch.", isLeaf: true, },
      { title: "Sports", href: "/entertainment/sports", description: "Follow your favorite sports.", isLeaf: true, },
    ]
  },
  {
    title: "AI Agents",
    isLeaf: false,
    description: "Interact with AI agents.",
    children: [
      {
        title: "Webpages Agent",
        href: "/agents/webpages",
        description: "Interact with websites to extract information and perform tasks.",
        isLeaf: true,
        isOverview: true,
      },
      {
        title: "Travel Agent",
        href: "/agents/travel",
        description: "Plan trips, find deals, and get travel recommendations.",
        isLeaf: true,
      },
      {
        title: "Finance Agent",
        href: "/agents/finance",
        description: "Analyze spending, track investments, and get financial advice.",
        isLeaf: true,
      },
      {
        title: "Health Agent",
        href: "/agents/health",
        description: "Monitor health data, get fitness tips, and track wellness goals.",
        isLeaf: true,
      },
    ]
  }
];

export interface PortfolioItem {
  id: string;
  title: string;
  credit: string;
  thumbnail: string;
  href: string;
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: "sorai-esports",
    title: "SORAI ESPORTS",
    credit: "Esports Media Platform",
    thumbnail: "/portfolio/sorai-esports.png",
    href: "https://esports.sorai.tw",
  },
  {
    id: "sorai-unite-zaoji",
    title: "SORAI UNITE 造極",
    credit: "Event Visual",
    thumbnail: "https://i.ytimg.com/vi/z4sNKSCqdd4/maxresdefault.jpg",
    href: "https://youtu.be/z4sNKSCqdd4",
  },
  {
    id: "project-3",
    title: "LAN DOWN UNDER 2025",
    credit: "Visual Direction",
    thumbnail: "/portfolio/cb5oud.jpg",
    href: "https://bax.vision/work/visual/lan-down-under-2025",
  },
  {
    id: "project-2",
    title: "Orient Elite Clash 2025",
    credit: "Visual Direction",
    thumbnail: "/portfolio/q71lx4.jpg",
    href: "https://bax.vision/work/visual/orient-elite-clash-2025",
  },

  {
    id: "project-1",
    title: "Twilight Tourney 暮光邀請盃 2024 ",
    credit: "Event Organizer, Visual Direction",
    thumbnail: "/portfolio/2drgjd.png",
    href: "https://bax.vision/work/visual/twilight-tourney-2024",
  },

  {
    id: "project-4",
    title: "Orient Elite Clash 2024",
    credit: "Visual Direction",
    thumbnail: "/portfolio/nzxs41.jpg",
    href: "https://bax.vision/work/visual/orient-elite-clash-2024",
  },
];

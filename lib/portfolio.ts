export interface PortfolioItem {
  id: string;
  title: string;
  credit: string;
  thumbnail: string;
  href: string;
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: "project-1",
    title: "Project One",
    credit: "Client: Riot Games",
    thumbnail: "/portfolio/project-1.jpg",
    href: "/work/project-1",
  },
  {
    id: "project-2",
    title: "Project Two",
    credit: "Client: Blizzard",
    thumbnail: "/portfolio/project-2.jpg",
    href: "/work/project-2",
  },
  {
    id: "project-3",
    title: "Project Three",
    credit: "Client: Valve",
    thumbnail: "/portfolio/project-3.jpg",
    href: "/work/project-3",
  },
  {
    id: "project-4",
    title: "Project Four",
    credit: "Client: Epic Games",
    thumbnail: "/portfolio/project-4.jpg",
    href: "/work/project-4",
  },
];

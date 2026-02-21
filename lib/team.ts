export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  href: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: "founder",
    name: "Bax",
    role: "Creative Director",
    avatar: "/team/bax.jpg",
    href: "/bax",
  },
  {
    id: "co-founder",
    name: "Charls Lin",
    role: "Project Manager",
    avatar: "/team/cometcafe.jpeg",
    href: "/cometcafe",
  },
];

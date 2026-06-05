export type BlogStory = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  link: string;
};

export const blogsData: BlogStory[] = [
  {
    id: 1,
    title: "Behind every home, there's a story",
    excerpt: "Our Local Deli was built on the belief that every home deserves reliable and well-designed essentials. Discover how we've grown into a trusted provider across the Philippines.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1600&auto=format&fit=crop",

    link: "#"
  },
  {
    id: 2,
    title: "What does Omega really mean?",
    excerpt: "Coming from the Greek Alphabet, Omega means 'the last'—and the last is very usually the BEST. Learn why Omega is the final choice for value and quality.",
    image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=1600&auto=format&fit=crop",
    link: "#"
  },
  {
    id: 3,
    title: "Modern Solutions for Filipino Families",
    excerpt: "We are committed to delivering innovation and convenience, helping households create better everyday experiences with functional and stylish housewares.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1600&auto=format&fit=crop",

    link: "#"
  }
];

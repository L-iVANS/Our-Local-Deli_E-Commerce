export type CategoryData = {
  id: string;
  name: string;
  image: string;
  videoUrl?: string;
  iconName: string;
};

export const categoriesData: CategoryData[] = [
  {
    id: "frozen-meat",
    name: "FROZEN MEAT",
    image:
      "https://images.unsplash.com/photo-1625643269470-5d3e7b69fa34?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    iconName: "Wine",
  },
  {
    id: "frozen-seafood",
    name: "FROZEN SEAFOOD",
    image:
      "https://plus.unsplash.com/premium_photo-1757479571362-e8807cfac237?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    iconName: "ChefHat",
  },
  {
    id: "ready-to-cook",
    name: "READY TO COOK",
    image:
      "https://images.unsplash.com/photo-1774101074569-b669d4fc207f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    iconName: "Soup",
  },
  {
    id: "snacks",
    name: "SNACKS",
    image:
      "https://images.unsplash.com/photo-1665762520658-4b725e05c5f4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    iconName: "Thermometer",
  },
];

// Dev-only guard — catches duplicate ids before they reach React
if (process.env.NODE_ENV === "development") {
  const ids = categoriesData.map((c) => c.id);
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (duplicates.length > 0) {
    console.error(
      `[categoriesData] Duplicate ids found: ${[...new Set(duplicates)].join(", ")}`
    );
  }
}
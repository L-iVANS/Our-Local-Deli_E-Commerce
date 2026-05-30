
export type CategoryData = {
  id: string;
  name: string;
  image: string;
  videoUrl?: string;
  iconName: string; // CMS-ready representation instead of JSX
};


export const categoriesData: CategoryData[] = [
  {
    id: "glassware",
    name: "GLASSWARE",
    image: "https://images.unsplash.com/photo-1677338354607-e73fee0bccbb?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    iconName: "Wine",
  },


  {
    id: "kitchenware",
    name: "KITCHENWARE",
    image: "https://images.unsplash.com/photo-1646285455104-17a46be2540f?q=80&w=997&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    iconName: "ChefHat",
  },
  {
    id: "dinnerware",
    name: "DINNERWARE",
    image: "https://images.unsplash.com/photo-1774509623829-881b7946b8e0?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    iconName: "Soup",
  },
  {
    id: "vacuum-flask",
    name: "VACUUM FLASK",
    image: "https://plus.unsplash.com/premium_photo-1673884222757-18da49c319f2?q=80&w=1036&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    iconName: "Thermometer",
  }
];





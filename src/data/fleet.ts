export type Category = "Supercar" | "Sport" | "Luxury" | "SUV";

export interface ShowcaseVehicle {
  name: string;
  category: Category;
  image: string;
  imageAlt: string;
  price: number;
  transmission: string;
  seats: number;
  horsepower: number;
}

// Editorial showcase data. Live availability and final prices come from the rental inventory.
export const showcaseFleet: ShowcaseVehicle[] = [
  {
    name: "Apex V12",
    category: "Supercar",
    image: "/fleet/red-supercar.webp",
    imageAlt: "Red exotic supercar in a dark showroom",
    price: 1250,
    transmission: "Automatic",
    seats: 2,
    horsepower: 720,
  },
  {
    name: "GT S",
    category: "Sport",
    image: "/fleet/graphite-gt.webp",
    imageAlt: "Graphite grand touring coupe in a dark showroom",
    price: 680,
    transmission: "Automatic",
    seats: 2,
    horsepower: 510,
  },
  {
    name: "BMW X5",
    category: "SUV",
    image: "/fleet/bmw-x5.jpg",
    imageAlt: "BMW X5 luxury SUV",
    price: 290,
    transmission: "Automatic",
    seats: 5,
    horsepower: 375,
  },
  {
    name: "Mercedes E-Class",
    category: "Luxury",
    image: "/fleet/mercedes-e-class.jpg",
    imageAlt: "Mercedes E-Class luxury sedan",
    price: 240,
    transmission: "Automatic",
    seats: 5,
    horsepower: 255,
  },
];

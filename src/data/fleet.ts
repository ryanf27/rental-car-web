export type Category = "Supercar" | "Sports" | "Luxury" | "SUV";

export interface Vehicle {
  slug: string;
  brand: string;
  model: string;
  name: string;
  category: Category;
  year: number;
  image: string;
  imageAlt: string;
  dailyPrice: number;
  transmission: string;
  drivetrain: string;
  seats: number;
  horsepower: number;
  description: string;
  features: string[];
  featured?: boolean;
}

// The collection is intentionally local editorial data. Only inquiries need persistence.
export const fleet: Vehicle[] = [
  {
    slug: "apex-v12",
    brand: "Apex",
    model: "V12",
    name: "Apex V12",
    category: "Supercar",
    year: 2025,
    image: "/fleet/red-supercar.webp",
    imageAlt: "Red mid-engine supercar in a dark showroom",
    dailyPrice: 1250,
    transmission: "Automatic",
    drivetrain: "Rear-wheel drive",
    seats: 2,
    horsepower: 720,
    description: "A low-slung statement car created for the pure theatre of the open road. The Apex V12 is a fictional concept in the Noir collection, with performance to match its presence.",
    features: ["Personal handover", "Premium cabin", "Performance-focused drive"],
    featured: true,
  },
  {
    slug: "porsche-911-turbo-s",
    brand: "Porsche",
    model: "911 Turbo S",
    name: "Porsche 911 Turbo S",
    category: "Sports",
    year: 2025,
    image: "/fleet/porsche-911.webp",
    imageAlt: "Silver Porsche 911 Turbo S in a dark showroom",
    dailyPrice: 890,
    transmission: "Automatic",
    drivetrain: "All-wheel drive",
    seats: 4,
    horsepower: 640,
    description: "An iconic silhouette with remarkable everyday composure. The 911 Turbo S pairs unmistakable character with effortless pace for a drive that stays with you.",
    features: ["All-wheel drive", "Premium interior", "Grand touring comfort"],
    featured: true,
  },
  {
    slug: "noir-gt-s",
    brand: "Noir",
    model: "GT S",
    name: "Noir GT S",
    category: "Sports",
    year: 2025,
    image: "/fleet/graphite-gt.webp",
    imageAlt: "Graphite grand touring coupe in a dark showroom",
    dailyPrice: 680,
    transmission: "Automatic",
    drivetrain: "Rear-wheel drive",
    seats: 2,
    horsepower: 510,
    description: "A fictional grand tourer conceived for long roads and late arrivals. The GT S trades noise for confidence, with a clean silhouette and a focused cabin.",
    features: ["Grand touring cabin", "Premium audio", "Personal handover"],
    featured: true,
  },
  {
    slug: "range-rover-sport",
    brand: "Range Rover",
    model: "Sport",
    name: "Range Rover Sport",
    category: "SUV",
    year: 2025,
    image: "/fleet/range-rover-sport.webp",
    imageAlt: "White Range Rover Sport in a dark showroom",
    dailyPrice: 390,
    transmission: "Automatic",
    drivetrain: "All-wheel drive",
    seats: 5,
    horsepower: 395,
    description: "Quiet strength, generous space and an elevated view of every journey. The Range Rover Sport brings a composed sense of occasion to the city and beyond.",
    features: ["All-wheel drive", "Spacious cabin", "Refined ride"],
    featured: true,
  },
  {
    slug: "bmw-x5",
    brand: "BMW",
    model: "X5",
    name: "BMW X5",
    category: "SUV",
    year: 2024,
    image: "/fleet/bmw-x5.jpg",
    imageAlt: "BMW X5 luxury SUV",
    dailyPrice: 290,
    transmission: "Automatic",
    drivetrain: "All-wheel drive",
    seats: 5,
    horsepower: 375,
    description: "Versatile, assured and effortlessly comfortable. The X5 gives every passenger room to settle in without giving up the pleasure of driving.",
    features: ["All-wheel drive", "Spacious luggage area", "Premium cabin"],
  },
  {
    slug: "mercedes-e-class",
    brand: "Mercedes-Benz",
    model: "E-Class",
    name: "Mercedes-Benz E-Class",
    category: "Luxury",
    year: 2024,
    image: "/fleet/mercedes-e-class.jpg",
    imageAlt: "Mercedes-Benz E-Class luxury sedan",
    dailyPrice: 240,
    transmission: "Automatic",
    drivetrain: "Rear-wheel drive",
    seats: 5,
    horsepower: 255,
    description: "Understated sophistication for business, celebrations and everything between. The E-Class makes refinement feel completely natural.",
    features: ["Executive comfort", "Quiet cabin", "Premium audio"],
  },
];

export function findVehicle(slug: string): Vehicle | undefined {
  return fleet.find((car) => car.slug === slug);
}

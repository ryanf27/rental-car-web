import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CarFilters } from "@/components/search/CarFilters";
import { CarGrid } from "@/components/search/CarGrid";
import { useAuth } from "@/hooks/useAuth";
import heroCarImage from "@/assets/hero-car.jpg";
import { ArrowRight, Star, Users, Shield, Clock, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    brand: "",
    priceRange: [0, 1000],
    transmission: "",
    seats: "",
    fuelType: "",
  });

  // Sample car data - in a real app, this would come from your database
  const cars = [
    {
      id: "1",
      name: "BMW 5 Series",
      brand: "BMW",
      category: "Executive Sedan",
      type: "Sedan",
      price: 89,
      image: "/src/assets/bmw-5-series.jpg",
      features: ["Leather Interior", "Navigation", "Premium Audio", "Heated Seats"],
      rating: 4.9,
      seats: 5,
      color: "Silver",
      transmission: "Automatic",
      fuelType: "Petrol",
      year: 2024,
      available: true
    },
    {
      id: "2",
      name: "Audi Q7",
      brand: "Audi",
      category: "Luxury SUV",
      type: "SUV",
      price: 129,
      image: "/src/assets/audi-q7.jpg",
      features: ["7 Seats", "Panoramic Roof", "Quattro AWD", "Premium Sound"],
      rating: 4.8,
      seats: 7,
      color: "White",
      transmission: "Automatic",
      fuelType: "Diesel",
      year: 2024,
      available: true
    },
    {
      id: "3",
      name: "Mercedes C-Class",
      brand: "Mercedes",
      category: "Business Class",
      type: "Sedan",
      price: 79,
      image: "/src/assets/mercedes-c-class.jpg",
      features: ["AMG Package", "Wireless Charging", "Driver Assist", "Ambient Lighting"],
      rating: 4.7,
      seats: 5,
      color: "Blue",
      transmission: "Automatic",
      fuelType: "Petrol",
      year: 2024,
      available: true
    },
    {
      id: "4",
      name: "BMW X5",
      brand: "BMW",
      category: "Luxury SUV",
      type: "SUV",
      price: 145,
      image: "/src/assets/bmw-x5.jpg",
      features: ["xDrive AWD", "Panoramic Roof", "Harman Kardon", "Gesture Control"],
      rating: 4.8,
      seats: 7,
      color: "Black",
      transmission: "Automatic",
      fuelType: "Hybrid",
      year: 2024,
      available: true
    },
    {
      id: "5",
      name: "Audi A4",
      brand: "Audi",
      category: "Premium Sedan",
      type: "Sedan",
      price: 75,
      image: "/src/assets/audi-a4.jpg",
      features: ["Virtual Cockpit", "Matrix LED", "Sport Suspension", "Bang & Olufsen"],
      rating: 4.6,
      seats: 5,
      color: "Grey",
      transmission: "Automatic",
      fuelType: "Petrol",
      year: 2024,
      available: true
    },
    {
      id: "6",
      name: "Mercedes E-Class",
      brand: "Mercedes",
      category: "Executive Sedan",
      type: "Sedan",
      price: 95,
      image: "/src/assets/mercedes-e-class.jpg",
      features: ["MBUX System", "Air Suspension", "Burmester Audio", "Night Package"],
      rating: 4.7,
      seats: 5,
      color: "Silver",
      transmission: "Automatic",
      fuelType: "Diesel",
      year: 2024,
      available: true
    }
  ];

  const filteredCars = cars.filter(car => {
    if (filters.brand && car.brand !== filters.brand) return false;
    if (filters.transmission && car.transmission !== filters.transmission) return false;
    if (filters.seats && car.seats.toString() !== filters.seats) return false;
    if (filters.fuelType && car.fuelType !== filters.fuelType) return false;
    if (car.price < filters.priceRange[0] || car.price > filters.priceRange[1]) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-r from-primary to-accent rounded-lg"></div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CarRental Pro
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Home</a>
          <a href="#cars" className="text-muted-foreground hover:text-primary transition-colors">Cars</a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">About</a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4" />
                <span className="text-muted-foreground">{user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    Premium
                  </span>
                  <br />
                  Car Rentals
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Experience luxury and comfort with our premium fleet of vehicles. 
                  Book instantly and drive with confidence.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground group">
                  <span>Explore Fleet</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Premium Cars</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">50k+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </div>
              </div>
            </div>
            
            <div className="relative animate-slide-in-right">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
              <img 
                src={heroCarImage} 
                alt="Premium luxury car" 
                className="relative z-10 w-full h-auto rounded-3xl shadow-elegant"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Why Choose CarRental Pro?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide exceptional service and premium vehicles for all your transportation needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 animate-slide-in-left">
              <div className="bg-gradient-to-r from-primary to-accent p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Clock className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Instant Booking</h3>
              <p className="text-muted-foreground">
                Book your perfect car in seconds with our streamlined process
              </p>
            </div>
            
            <div className="text-center space-y-4 animate-fade-in">
              <div className="bg-gradient-to-r from-primary to-accent p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Fully Insured</h3>
              <p className="text-muted-foreground">
                All vehicles come with comprehensive insurance coverage
              </p>
            </div>
            
            <div className="text-center space-y-4 animate-slide-in-right">
              <div className="bg-gradient-to-r from-primary to-accent p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Star className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Premium Fleet</h3>
              <p className="text-muted-foreground">
                Choose from luxury sedans, SUVs, and sports cars
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Car Grid Section */}
      <section id="cars" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Choose Your Perfect Car
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our premium fleet of vehicles, carefully selected for your comfort and style
          </p>
        </div>

        <div className="mb-8">
          <CarFilters />
        </div>

        <CarGrid cars={filteredCars} />
      </section>

      {/* Footer */}
      <footer className="bg-secondary/30 border-t border-border/50 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 CarRental Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
import { motion } from 'framer-motion';
import { Star, Users, Palette, Fuel, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { useState } from 'react';

export interface Car {
  id: string;
  name: string;
  brand: string;
  category: string;
  type: string;
  price: number;
  image: string;
  features: string[];
  rating: number;
  seats: number;
  color: string;
  transmission: string;
  fuelType: string;
  year: number;
  available: boolean;
}

interface CarGridProps {
  cars: Car[];
}

const CARS_PER_PAGE = 6;

export function CarGrid({ cars }: CarGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const totalPages = Math.ceil(cars.length / CARS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARS_PER_PAGE;
  const endIndex = startIndex + CARS_PER_PAGE;
  const currentCars = cars.slice(startIndex, endIndex);

  const handleBookNow = (car: Car) => {
    setSelectedCar(car);
    setShowCheckout(true);
  };

  const handleCheckout = () => {
    // Here you would integrate with your payment system
    alert(`Booking confirmed for ${selectedCar?.name}! Total: €${selectedCar?.price}/day`);
    setShowCheckout(false);
    setSelectedCar(null);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentCars.map((car, index) => (
        <motion.div
          key={car.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.7, 
            delay: index * 0.1,
            ease: "easeOut"
          }}
          viewport={{ once: true }}
          whileHover={{ y: -6, scale: 1.02 }}
          className="group"
        >
          <Card className="overflow-hidden bg-card/70 backdrop-blur-sm border-border/30 rounded-[1.25rem] shadow-elegant hover:shadow-hover transition-all duration-300">
            <div className="aspect-video overflow-hidden">
              <img 
                src={car.image} 
                alt={car.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold">{car.name}</CardTitle>
                  <CardDescription className="text-secondary-foreground">
                    {car.brand} • {car.category}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{car.rating}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Car Details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-secondary-foreground">
                  <Users className="w-4 h-4" />
                  <span>{car.seats} seats</span>
                </div>
                <div className="flex items-center gap-2 text-secondary-foreground">
                  <Palette className="w-4 h-4" />
                  <span>{car.color}</span>
                </div>
                <div className="flex items-center gap-2 text-secondary-foreground">
                  <Settings className="w-4 h-4" />
                  <span>{car.transmission}</span>
                </div>
                <div className="flex items-center gap-2 text-secondary-foreground">
                  <Fuel className="w-4 h-4" />
                  <span>{car.fuelType}</span>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2">
                {car.features.slice(0, 3).map((feature) => (
                  <Badge 
                    key={feature}
                    variant="secondary"
                    className="bg-white/5 text-accent border-border/20 text-xs"
                  >
                    {feature}
                  </Badge>
                ))}
                {car.features.length > 3 && (
                  <Badge 
                    variant="secondary"
                    className="bg-white/5 text-accent border-border/20 text-xs"
                  >
                    +{car.features.length - 3} more
                  </Badge>
                )}
              </div>
              
              {/* Price and Booking */}
              <div className="flex items-center justify-between pt-4">
                <div className="text-2xl font-bold text-primary">
                  €{car.price}
                  <span className="text-sm font-normal text-secondary-foreground">/day</span>
                </div>
                <Button 
                  size="sm"
                  className="bg-primary hover:bg-primary/90 rounded-lg transition-all hover:scale-105"
                  disabled={!car.available}
                  onClick={() => handleBookNow(car)}
                >
                  {car.available ? 'Book Now' : 'Unavailable'}
                </Button>
              </div>

              {/* Availability Badge */}
              <div className="flex justify-end">
                <Badge 
                  variant={car.available ? "default" : "secondary"}
                  className={car.available 
                    ? "bg-green-500/20 text-green-400 border-green-500/30" 
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                  }
                >
                  {car.available ? 'Available' : 'Booked'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Your Car</DialogTitle>
            <DialogDescription>
              Confirm your booking for {selectedCar?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCar && (
            <div className="space-y-4">
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <img 
                  src={selectedCar.image} 
                  alt={selectedCar.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{selectedCar.name}</h3>
                <p className="text-secondary-foreground">{selectedCar.brand} • {selectedCar.category}</p>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{selectedCar.seats} seats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    <span>{selectedCar.color}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <span>{selectedCar.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="w-4 h-4" />
                    <span>{selectedCar.fuelType}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total per day:</span>
                    <span className="text-2xl font-bold text-primary">€{selectedCar.price}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCheckout(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCheckout}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
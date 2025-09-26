import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Car as CarIcon, Zap, Shield, Star, ArrowRight, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CarFilters } from '@/components/search/CarFilters';
import { CarGrid, type Car } from '@/components/search/CarGrid';
import { useScrollAnimation, prefersReducedMotion } from '@/lib/motion';
import Lenis from 'lenis';
import heroCarImage from '@/assets/hero-car.jpg';
import bmw5SeriesImage from '@/assets/bmw-5-series.jpg';
import audiQ7Image from '@/assets/audi-q7.jpg';
import mercedesCClassImage from '@/assets/mercedes-c-class.jpg';
import audiA4Image from '@/assets/audi-a4.jpg';
import bmwX5Image from '@/assets/bmw-x5.jpg';
import mercedesEClassImage from '@/assets/mercedes-e-class.jpg';

export default function Index() {
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const carsRef = useRef<HTMLElement>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [seatsFilter, setSeatsFilter] = useState('all');
  const [colorFilter, setColorFilter] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  
  const { scrollYProgress } = useScroll();
  const heroParallaxY = useTransform(scrollYProgress, [0, 0.4], [0, -80]);
  const heroRotateY = useTransform(scrollYProgress, [0.1, 0.9], [-0.05, 0.05]);
  
  // Initialize smooth scrolling
  useEffect(() => {
    if (prefersReducedMotion()) return;
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    setMounted(true);

    return () => lenis.destroy();
  }, []);

  // Scroll animations
  useScrollAnimation(featuresRef, { threshold: 0.2 });
  useScrollAnimation(carsRef, { threshold: 0.1 });

  const features = [
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Book your perfect car in seconds with our streamlined process",
      badge: "Fast"
    },
    {
      icon: Shield,
      title: "Fully Insured",
      description: "All vehicles come with comprehensive insurance coverage",
      badge: "Secure"
    },
    {
      icon: Star,
      title: "Premium Fleet",
      description: "Choose from luxury sedans, SUVs, and sports cars",
      badge: "Quality"
    }
  ];

  const allCars: Car[] = [
    // BMW Models
    {
      id: '1',
      name: "BMW 5 Series",
      brand: "BMW",
      category: "Executive Sedan",
      type: "Sedan",
      price: 89,
      image: bmw5SeriesImage,
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
      id: '2',
      name: "BMW X5",
      brand: "BMW",
      category: "Luxury SUV",
      type: "SUV",
      price: 145,
      image: bmwX5Image,
      features: ["xDrive AWD", "Panoramic Roof", "Harman Kardon", "Gesture Control"],
      rating: 4.8,
      seats: 7,
      color: "White",
      transmission: "Automatic",
      fuelType: "Hybrid",
      year: 2024,
      available: true
    },
    {
      id: '3',
      name: "BMW 3 Series",
      brand: "BMW",
      category: "Sports Sedan",
      type: "Sedan",
      price: 72,
      image: bmw5SeriesImage,
      features: ["M Sport Package", "iDrive 8", "Wireless Charging", "Sport Suspension"],
      rating: 4.7,
      seats: 5,
      color: "Black",
      transmission: "Automatic",
      fuelType: "Petrol",
      year: 2024,
      available: true
    },
    {
      id: '4',
      name: "BMW X3",
      brand: "BMW",
      category: "Compact SUV",
      type: "SUV",
      price: 98,
      image: bmwX5Image,
      features: ["xDrive", "LED Headlights", "Apple CarPlay", "Power Tailgate"],
      rating: 4.6,
      seats: 5,
      color: "Blue",
      transmission: "Automatic",
      fuelType: "Petrol",
      year: 2024,
      available: true
    },
    {
      id: '5',
      name: "BMW 7 Series",
      brand: "BMW",
      category: "Luxury Sedan",
      type: "Sedan",
      price: 165,
      image: bmw5SeriesImage,
      features: ["Executive Lounge", "Massage Seats", "Laser Lights", "Sky Lounge Roof"],
      rating: 4.9,
      seats: 4,
      color: "Silver",
      transmission: "Automatic",
      fuelType: "Hybrid",
      year: 2024,
      available: true
    },

    // Audi Models
    {
      id: '6',
      name: "Audi Q7",
      brand: "Audi",
      category: "Luxury SUV", 
      type: "SUV",
      price: 129,
      image: audiQ7Image,
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
      id: '7',
      name: "Audi A4",
      brand: "Audi",
      category: "Premium Sedan",
      type: "Sedan",
      price: 75,
      image: audiA4Image,
      features: ["Virtual Cockpit", "Matrix LED", "Sport Suspension", "Bang & Olufsen"],
      rating: 4.6,
      seats: 5,
      color: "Black",
      transmission: "Automatic",
      fuelType: "Petrol",
      year: 2024,
      available: true
    },
    {
      id: '8',
      name: "Audi A6",
      brand: "Audi",
      category: "Executive Sedan",
      type: "Sedan",
      price: 92,
      image: audiA4Image,
      features: ["MMI Navigation", "Air Suspension", "Premium Plus", "Quattro"],
      rating: 4.7,
      seats: 5,
      color: "Grey",
      transmission: "Automatic",
      fuelType: "Diesel",
      year: 2024,
      available: true
    },
    {
      id: '9',
      name: "Audi Q5",
      brand: "Audi",
      category: "Premium SUV",
      type: "SUV",
      price: 108,
      image: audiQ7Image,
      features: ["Quattro Ultra", "Virtual Cockpit Plus", "LED Matrix", "Power Liftgate"],
      rating: 4.5,
      seats: 5,
      color: "Red",
      transmission: "Automatic",
      fuelType: "Petrol",
      year: 2024,
      available: false
    },
    {
      id: '10',
      name: "Audi A8",
      brand: "Audi",
      category: "Luxury Sedan",
      type: "Sedan",
      price: 175,
      image: audiA4Image,
      features: ["AI Traffic Jam Pilot", "Relaxation Seats", "Matrix OLED", "Predictive Suspension"],
      rating: 4.8,
      seats: 4,
      color: "Black",
      transmission: "Automatic",
      fuelType: "Hybrid",
      year: 2024,
      available: true
    },

    // Mercedes Models
    {
      id: '11',
      name: "Mercedes C-Class",
      brand: "Mercedes",
      category: "Business Class",
      type: "Sedan",
      price: 79,
      image: mercedesCClassImage,
      features: ["AMG Package", "Wireless Charging", "Driver Assist", "Ambient Lighting"],
      rating: 4.7,
      seats: 5,
      color: "Blue",
      transmission: "Automatic",
      fuelType: "Petrol",
      year: 2024,
      available: false
    },
    {
      id: '12',
      name: "Mercedes E-Class",
      brand: "Mercedes",
      category: "Executive Sedan",
      type: "Sedan",
      price: 95,
      image: mercedesEClassImage,
      features: ["MBUX System", "Air Suspension", "Burmester Audio", "Night Package"],
      rating: 4.7,
      seats: 5,
      color: "Silver",
      transmission: "Automatic",
      fuelType: "Diesel",
      year: 2024,
      available: true
    },
    {
      id: '13',
      name: "Mercedes S-Class",
      brand: "Mercedes",
      category: "Luxury Sedan",
      type: "Sedan",
      price: 185,
      image: mercedesEClassImage,
      features: ["MBUX Hyperscreen", "Executive Rear Seats", "3D Sound", "Digital Light"],
      rating: 4.9,
      seats: 4,
      color: "Black",
      transmission: "Automatic",
      fuelType: "Hybrid",
      year: 2024,
      available: true
    },
    {
      id: '14',
      name: "Mercedes GLE",
      brand: "Mercedes",
      category: "Luxury SUV",
      type: "SUV",
      price: 135,
      image: mercedesCClassImage,
      features: ["4MATIC", "Air Body Control", "Premium Package", "Multibeam LED"],
      rating: 4.6,
      seats: 7,
      color: "White",
      transmission: "Automatic",
      fuelType: "Diesel",
      year: 2024,
      available: true
    },
    {
      id: '15',
      name: "Mercedes GLC",
      brand: "Mercedes",
      category: "Premium SUV",
      type: "SUV",
      price: 105,
      image: mercedesCClassImage,
      features: ["4MATIC", "MBUX", "AMG Line", "Panoramic Roof"],
      rating: 4.5,
      seats: 5,
      color: "Grey",
      transmission: "Automatic",
      fuelType: "Petrol",
      year: 2024,
      available: true
    },

    // Porsche Models
    {
      id: '16',
      name: "Porsche Cayenne",
      brand: "Porsche",
      category: "Sports SUV",
      type: "SUV",
      price: 195,
      image: bmwX5Image,
      features: ["Sport Chrono", "PASM", "Bose Audio", "Porsche Traction Management"],
      rating: 4.8,
      seats: 5,
      color: "Black",
      transmission: "Automatic",
      fuelType: "Petrol",
      year: 2024,
      available: true
    },
    {
      id: '17',
      name: "Porsche Macan",
      brand: "Porsche",
      category: "Compact Sports SUV",
      type: "SUV",
      price: 155,
      image: bmwX5Image,
      features: ["Sport Plus Mode", "PCM", "LED Matrix", "Sport Exhaust"],
      rating: 4.7,
      seats: 5,
      color: "Red",
      transmission: "Automatic",
      fuelType: "Petrol",
      year: 2024,
      available: true
    },
    {
      id: '18',
      name: "Porsche Panamera",
      brand: "Porsche",
      category: "Sports Sedan",
      type: "Sedan",
      price: 225,
      image: bmw5SeriesImage,
      features: ["Sport Turismo", "Air Suspension", "Burmester 3D", "Matrix LED"],
      rating: 4.9,
      seats: 4,
      color: "Silver",
      transmission: "Automatic",
      fuelType: "Hybrid",
      year: 2024,
      available: false
    },

    // Tesla Models
    {
      id: '19',
      name: "Tesla Model S",
      brand: "Tesla",
      category: "Electric Luxury",
      type: "Sedan",
      price: 165,
      image: audiA4Image,
      features: ["Autopilot", "17' Touchscreen", "Premium Audio", "Bioweapon Defense Mode"],
      rating: 4.6,
      seats: 5,
      color: "White",
      transmission: "Automatic",
      fuelType: "Electric",
      year: 2024,
      available: true
    },
    {
      id: '20',
      name: "Tesla Model X",
      brand: "Tesla",
      category: "Electric SUV",
      type: "SUV",
      price: 185,
      image: audiQ7Image,
      features: ["Falcon Wing Doors", "Full Self-Driving", "Premium Interior", "7 Seats"],
      rating: 4.5,
      seats: 7,
      color: "Black",
      transmission: "Automatic",
      fuelType: "Electric",
      year: 2024,
      available: true
    },
    {
      id: '21',
      name: "Tesla Model 3",
      brand: "Tesla",
      category: "Electric Sedan",
      type: "Sedan",
      price: 125,
      image: audiA4Image,
      features: ["Enhanced Autopilot", "Premium Connectivity", "Glass Roof", "Supercharging"],
      rating: 4.4,
      seats: 5,
      color: "Blue",
      transmission: "Automatic",
      fuelType: "Electric",
      year: 2024,
      available: true
    },

    // Jaguar Models
    {
      id: '22',
      name: "Jaguar XF",
      brand: "Jaguar",
      category: "Luxury Sedan",
      type: "Sedan",
      price: 118,
      image: mercedesEClassImage,
      features: ["InControl Touch Pro", "Meridian Audio", "Adaptive Dynamics", "LED Signature"],
      rating: 4.5,
      seats: 5,
      color: "Grey",
      transmission: "Automatic",
      fuelType: "Diesel",
      year: 2024,
      available: true
    },
    {
      id: '23',
      name: "Jaguar F-PACE",
      brand: "Jaguar",
      category: "Sports SUV",
      type: "SUV",
      price: 138,
      image: bmwX5Image,
      features: ["Configurable Dynamics", "Activity Key", "Meridian Surround", "All Surface Progress Control"],
      rating: 4.6,
      seats: 5,
      color: "Red",
      transmission: "Automatic",
      fuelType: "Petrol",
      year: 2024,
      available: true
    },

    // Land Rover Models
    {
      id: '24',
      name: "Range Rover Evoque",
      brand: "Land Rover",
      category: "Compact Luxury SUV",
      type: "SUV",
      price: 142,
      image: audiQ7Image,
      features: ["Terrain Response", "Clear Sight Ground View", "Meridian Audio", "Pivi Pro"],
      rating: 4.4,
      seats: 5,
      color: "White",
      transmission: "Automatic",
      fuelType: "Diesel",
      year: 2024,
      available: true
    },
    {
      id: '25',
      name: "Range Rover Sport",
      brand: "Land Rover",
      category: "Luxury SUV",
      type: "SUV",
      price: 168,
      image: audiQ7Image,
      features: ["Adaptive Air Suspension", "Terrain Response 2", "Meridian Signature", "Dynamic Response"],
      rating: 4.7,
      seats: 7,
      color: "Black",
      transmission: "Automatic",
      fuelType: "Diesel",
      year: 2024,
      available: true
    },

    // Volvo Models
    {
      id: '26',
      name: "Volvo XC90",
      brand: "Volvo",
      category: "Luxury SUV",
      type: "SUV",
      price: 125,
      image: bmwX5Image,
      features: ["Pilot Assist", "Bowers & Wilkins", "Air Suspension", "Crystal Gear Shifter"],
      rating: 4.6,
      seats: 7,
      color: "Silver",
      transmission: "Automatic",
      fuelType: "Hybrid",
      year: 2024,
      available: true
    },
    {
      id: '27',
      name: "Volvo S90",
      brand: "Volvo",
      category: "Executive Sedan",
      type: "Sedan",
      price: 98,
      image: mercedesEClassImage,
      features: ["Sensus Connect", "Four-C Adaptive Chassis", "CleanZone", "Crystal Gear Knob"],
      rating: 4.5,
      seats: 5,
      color: "Blue",
      transmission: "Automatic",
      fuelType: "Diesel",
      year: 2024,
      available: false
    },

    // Lexus Models
    {
      id: '28',
      name: "Lexus ES",
      brand: "Lexus",
      category: "Luxury Sedan",
      type: "Sedan",
      price: 89,
      image: audiA4Image,
      features: ["Lexus Safety System+", "Mark Levinson Audio", "Hybrid Drive", "Lexus Interface"],
      rating: 4.7,
      seats: 5,
      color: "White",
      transmission: "Automatic",
      fuelType: "Hybrid",
      year: 2024,
      available: true
    },
    {
      id: '29',
      name: "Lexus RX",
      brand: "Lexus",
      category: "Luxury SUV",
      type: "SUV",
      price: 115,
      image: audiQ7Image,
      features: ["Lexus Safety System+", "Premium Package", "Panoramic Roof", "Wireless Charging"],
      rating: 4.6,
      seats: 5,
      color: "Grey",
      transmission: "Automatic",
      fuelType: "Hybrid",
      year: 2024,
      available: true
    },

    // Infiniti Models
    {
      id: '30',
      name: "Infiniti Q50",
      brand: "Infiniti",
      category: "Sports Sedan",
      type: "Sedan",
      price: 82,
      image: bmw5SeriesImage,
      features: ["Direct Adaptive Steering", "Bose Audio", "ProPILOT Assist", "Dual Touchscreen"],
      rating: 4.3,
      seats: 5,
      color: "Black",
      transmission: "Automatic",
      fuelType: "Petrol",
      year: 2024,
      available: true
    },
    {
      id: '31',
      name: "Infiniti QX80",
      brand: "Infiniti",
      category: "Full-Size SUV",
      type: "SUV",
      price: 148,
      image: bmwX5Image,
      features: ["Intelligent 4WD", "Theater Package", "Bose Performance Audio", "Around View Monitor"],
      rating: 4.4,
      seats: 8,
      color: "Silver",
      transmission: "Automatic",
      fuelType: "Petrol",
      year: 2024,
      available: true
    },

    // Genesis Models
    {
      id: '32',
      name: "Genesis G90",
      brand: "Genesis",
      category: "Luxury Sedan",
      type: "Sedan",
      price: 155,
      image: mercedesEClassImage,
      features: ["Genesis Executive Package", "Lexicon Audio", "Smart Cruise Control", "Wireless Charging"],
      rating: 4.8,
      seats: 5,
      color: "White",
      transmission: "Automatic",
      fuelType: "Petrol",
      year: 2024,
      available: true
    },
    {
      id: '33',
      name: "Genesis GV80",
      brand: "Genesis",
      category: "Luxury SUV",
      type: "SUV",
      price: 138,
      image: audiQ7Image,
      features: ["Highway Driving Assist", "Bang & Olufsen 3D", "Air Suspension", "Wireless Android Auto"],
      rating: 4.7,
      seats: 7,
      color: "Black",
      transmission: "Automatic",
      fuelType: "Petrol",
      year: 2024,
      available: true
    },

    // Cadillac Models
    {
      id: '34',
      name: "Cadillac Escalade",
      brand: "Cadillac",
      category: "Luxury SUV",
      type: "SUV",
      price: 175,
      image: bmwX5Image,
      features: ["Super Cruise", "AKG Studio Audio", "Magnetic Ride Control", "38' Curved OLED"],
      rating: 4.5,
      seats: 8,
      color: "Black",
      transmission: "Automatic",
      fuelType: "Petrol",
      year: 2024,
      available: false
    },
    {
      id: '35',
      name: "Cadillac CT5",
      brand: "Cadillac",
      category: "Sports Sedan",
      type: "Sedan",
      price: 92,
      image: bmw5SeriesImage,
      features: ["Magnetic Ride Control", "Bose Performance Audio", "Super Cruise Ready", "Wireless Charging"],
      rating: 4.4,
      seats: 5,
      color: "Red",
      transmission: "Automatic",
      fuelType: "Petrol",
      year: 2024,
      available: true
    }
  ];

  // Filter cars based on search and filters
  const filteredCars = useMemo(() => {
    return allCars.filter(car => {
      const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           car.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBrand = brandFilter === 'all' || car.brand === brandFilter;
      const matchesType = typeFilter === 'all' || car.type === typeFilter;
      const matchesSeats = seatsFilter === 'all' || car.seats.toString() === seatsFilter;
      const matchesColor = colorFilter === 'all' || car.color === colorFilter;
      
      let matchesPrice = true;
      if (priceRange !== 'all') {
        const [min, max] = priceRange === '200+' ? [200, Infinity] : priceRange.split('-').map(Number);
        matchesPrice = car.price >= min && (max ? car.price <= max : true);
      }
      
      return matchesSearch && matchesBrand && matchesType && matchesSeats && matchesColor && matchesPrice;
    });
  }, [allCars, searchTerm, brandFilter, typeFilter, seatsFilter, colorFilter, priceRange]);

  const clearFilters = () => {
    setSearchTerm('');
    setBrandFilter('all');
    setTypeFilter('all');
    setSeatsFilter('all');
    setColorFilter('all');
    setPriceRange('all');
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-[Inter]">
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ 
          background: 'var(--gradient-hero)',
        }}
      >
        {/* Hero Car Image */}
        <motion.div 
          className="absolute inset-0 z-10"
          style={{ 
            y: heroParallaxY,
            rotateY: heroRotateY 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/30 to-background/60" />
          <img 
            src={heroCarImage} 
            alt="Luxury car"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
        
        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="space-y-4">
              <Badge 
                variant="secondary" 
                className="bg-white/5 text-foreground border-border/20 backdrop-blur-sm"
              >
                <CarIcon className="w-4 h-4 mr-2" />
                Premium Car Rental
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
                Drive
                <span className="block text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-clip-text">
                  Excellence
                </span>
              </h1>
              
              <p className="text-xl text-secondary-foreground leading-relaxed max-w-lg">
                Experience luxury on every journey. Premium vehicles, professional service, 
                and seamless booking for discerning travelers.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-[0.9rem] px-8 py-6 text-lg font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-elegant"
              >
                Book Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white/5 border-border/30 backdrop-blur-sm hover:bg-white/10 rounded-[0.9rem] px-8 py-6 text-lg"
              >
                View Fleet
              </Button>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-secondary-foreground">Premium Cars</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-secondary-foreground">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">4.9</div>
                <div className="text-sm text-secondary-foreground">Rating</div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/20 z-15" />
      </motion.section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 relative">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Why Choose DriveEase
            </h2>
            <p className="text-xl text-secondary-foreground max-w-2xl mx-auto">
              Premium car rental with unmatched service quality and attention to detail
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/30 rounded-[1.25rem] shadow-elegant hover:shadow-hover transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <Badge 
                        variant="secondary"
                        className="bg-white/5 text-accent border-border/20"
                      >
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-secondary-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cars Section */}
      <section ref={carsRef} className="py-24 bg-secondary/20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Premium Fleet
            </h2>
            <p className="text-xl text-secondary-foreground max-w-2xl mx-auto">
              Handpicked luxury vehicles for the ultimate driving experience
            </p>
          </motion.div>
          
          {/* Search and Filters */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <CarFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              brandFilter={brandFilter}
              setBrandFilter={setBrandFilter}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              seatsFilter={seatsFilter}
              setSeatsFilter={setSeatsFilter}
              colorFilter={colorFilter}
              setColorFilter={setColorFilter}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              onClearFilters={clearFilters}
            />
          </motion.div>

          {/* Results count */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <p className="text-secondary-foreground">
              {filteredCars.length} car{filteredCars.length !== 1 ? 's' : ''} available
            </p>
          </motion.div>
          
          {/* Car Grid */}
          {filteredCars.length > 0 ? (
            <CarGrid cars={filteredCars} />
          ) : (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <CarIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No cars found</h3>
              <p className="text-secondary-foreground mb-6">
                Try adjusting your search criteria or clearing the filters.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-card/30 backdrop-blur-sm border-t border-border/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CarIcon className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold">DriveEase</span>
              </div>
              <p className="text-secondary-foreground">
                Premium car rental service for discerning travelers worldwide.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Services</h4>
              <div className="space-y-2 text-secondary-foreground">
                <div>Luxury Cars</div>
                <div>Business Rental</div>
                <div>Airport Transfer</div>
                <div>Chauffeur Service</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Support</h4>
              <div className="space-y-2 text-secondary-foreground">
                <div>Help Center</div>
                <div>Contact Us</div>
                <div>Terms of Service</div>
                <div>Privacy Policy</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Contact</h4>
              <div className="space-y-2 text-secondary-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Global Service</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>24/7 Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Premium Support</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border/30 text-center text-secondary-foreground">
            <p>&copy; 2024 DriveEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
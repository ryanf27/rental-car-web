import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Car, Zap, Shield, Star, ArrowRight, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StudioScene3D } from '@/components/3d/StudioScene3D';
import { useScrollAnimation, prefersReducedMotion } from '@/lib/motion';
import Lenis from 'lenis';

export default function Index() {
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const carsRef = useRef<HTMLElement>(null);
  
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

  const cars = [
    {
      name: "BMW 5 Series",
      category: "Executive Sedan",
      price: "€89",
      image: "🚗",
      features: ["Leather Interior", "Navigation", "Premium Audio"],
      rating: 4.9
    },
    {
      name: "Audi Q7",
      category: "Luxury SUV", 
      price: "€129",
      image: "🚙",
      features: ["7 Seats", "Panoramic Roof", "Quattro AWD"],
      rating: 4.8
    },
    {
      name: "Mercedes C-Class",
      category: "Business Class",
      price: "€79",
      image: "🚘",
      features: ["AMG Package", "Wireless Charging", "Driver Assist"],
      rating: 4.7
    }
  ];

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
        {/* 3D Car Scene */}
        <motion.div 
          className="absolute inset-0 z-10"
          style={{ 
            y: heroParallaxY,
            rotateY: heroRotateY 
          }}
        >
          <StudioScene3D className="w-full h-full" />
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
                <Car className="w-4 h-4 mr-2" />
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
          
          <div className="grid md:grid-cols-3 gap-8">
            {cars.map((car, index) => (
              <motion.div
                key={car.name}
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
                  <div className="aspect-video bg-gradient-to-br from-secondary via-card to-secondary/50 flex items-center justify-center text-6xl">
                    {car.image}
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-semibold">{car.name}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{car.rating}</span>
                      </div>
                    </div>
                    <CardDescription className="text-secondary-foreground">
                      {car.category}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {car.features.map((feature) => (
                        <Badge 
                          key={feature}
                          variant="secondary"
                          className="bg-white/5 text-accent border-border/20 text-xs"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4">
                      <div className="text-2xl font-bold text-primary">
                        {car.price}
                        <span className="text-sm font-normal text-secondary-foreground">/day</span>
                      </div>
                      <Button 
                        size="sm"
                        className="bg-primary hover:bg-primary/90 rounded-lg transition-all hover:scale-105"
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-card/30 backdrop-blur-sm border-t border-border/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Car className="w-8 h-8 text-primary" />
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
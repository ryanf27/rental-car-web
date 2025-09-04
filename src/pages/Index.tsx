import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Scene3D } from "@/components/3d/Scene3D";
import { Car, Shield, Clock, Star, ArrowRight, CheckCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!start || !end) {
      toast({ title: "Dates required", description: "Please select start and end dates." });
      return;
    }
    if (end < start) {
      toast({ title: "Invalid range", description: "End date must be after start date." });
      return;
    }
    const params = new URLSearchParams({ start, end }).toString();
    navigate(`/search?${params}`);
  };

  const today = new Date().toISOString().split("T")[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/5">
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 opacity-30"
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        </motion.div>
      </div>

      {/* Navigation */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-50 w-full border-b border-border/20 bg-background/80 backdrop-blur-md"
      >
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <motion.a 
            href="/" 
            className="font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            DriveEase
          </motion.a>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
            <a href="#fleet" className="text-muted-foreground hover:text-primary transition-colors">Fleet</a>
            <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
          </nav>
        </div>
      </motion.header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
          <div className="mx-auto max-w-6xl px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none">
                  <span className="block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                    Premium Cars
                  </span>
                  <span className="block text-foreground mt-2">
                    For Every Journey
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                  Experience luxury and comfort with our curated collection of premium vehicles. 
                  From elegant sedans to powerful SUVs.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Instant Booking</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Best Price Guarantee</span>
                </div>
              </motion.div>

              {/* Enhanced Search Form */}
              <motion.div variants={itemVariants}>
                <form onSubmit={onSubmit} className="bg-card/90 backdrop-blur-sm border border-border/50 p-6 rounded-2xl shadow-2xl">
                  <div className="grid gap-4 md:grid-cols-3 items-end">
                    <div className="space-y-2">
                      <label htmlFor="start" className="block text-sm font-medium text-foreground">Pickup Date</label>
                      <Input 
                        id="start" 
                        type="date" 
                        min={today} 
                        value={start} 
                        onChange={(e) => setStart(e.target.value)} 
                        className="h-11 border-border/60 focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="end" className="block text-sm font-medium text-foreground">Return Date</label>
                      <Input 
                        id="end" 
                        type="date" 
                        min={start || today} 
                        value={end} 
                        onChange={(e) => setEnd(e.target.value)} 
                        className="h-11 border-border/60 focus:border-primary transition-colors"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="h-11 font-semibold px-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 group"
                    >
                      Find Cars
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>

            {/* 3D Car Scene */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={heroInView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="relative h-[500px] lg:h-[600px]"
            >
              <Scene3D className="absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-20 bg-background/50 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate={statsInView ? "visible" : "hidden"}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {[
                { number: "10K+", label: "Happy Customers" },
                { number: "500+", label: "Premium Cars" },
                { number: "50+", label: "Cities Covered" },
                { number: "24/7", label: "Support Available" },
              ].map((stat, index) => (
                <motion.div key={index} variants={itemVariants} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} id="features" className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
              className="text-center mb-16"
            >
              <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-4">
                Why Choose DriveEase
              </motion.h2>
              <motion.p variants={itemVariants} className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience the difference with our premium service and attention to detail
              </motion.p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: Car,
                  title: "Premium Fleet",
                  description: "Luxury vehicles maintained to the highest standards with regular safety checks and premium amenities."
                },
                {
                  icon: Shield,
                  title: "Full Insurance",
                  description: "Comprehensive coverage included with every rental for your peace of mind and protection."
                },
                {
                  icon: Clock,
                  title: "24/7 Service",
                  description: "Round-the-clock customer support and roadside assistance whenever you need it."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-center">{feature.title}</h3>
                  <p className="text-muted-foreground text-center leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary via-primary to-accent">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-white space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Drive?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust DriveEase for their car rental needs.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-200"
                onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;

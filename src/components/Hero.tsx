import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-shield.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Shield className="w-4 h-4" />
              AI-Powered Protection
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Every Woman Deserves to Feel{" "}
              <span className="text-primary">Safe Online</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl">
              SafeHer is your AI harassment shield. We detect abuse, filter threats, store evidence, 
              and provide emergency support—before harm happens.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6 rounded-full"
              >
                Get Protected Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 rounded-full border-2 hover:bg-secondary"
              >
                Learn How It Works
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-8">
              <div>
                <p className="text-3xl font-bold text-primary">500K+</p>
                <p className="text-sm text-muted-foreground">Women Protected</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="text-3xl font-bold text-primary">99.9%</p>
                <p className="text-sm text-muted-foreground">Threat Detection</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="text-3xl font-bold text-primary">24/7</p>
                <p className="text-sm text-muted-foreground">Active Shield</p>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in animation-delay-300">
            <div className="absolute inset-0 bg-gradient-primary blur-3xl opacity-20 animate-float" />
            <img 
              src={heroImage} 
              alt="SafeHer AI Protection Shield" 
              className="relative rounded-3xl shadow-lg-custom w-full"
            />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;

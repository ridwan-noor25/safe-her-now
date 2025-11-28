import { Download, ScanSearch, ShieldCheck, Bell } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Download,
    title: "Install SafeHer",
    description: "Download the app or browser extension in seconds. Simple setup, no technical skills needed.",
  },
  {
    number: "02",
    icon: ScanSearch,
    title: "AI Scans in Real-Time",
    description: "Our AI continuously monitors your messages and interactions, detecting threats instantly.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Automatic Protection",
    description: "Harmful content is filtered before you see it. Evidence is securely stored automatically.",
  },
  {
    number: "04",
    icon: Bell,
    title: "You Stay Empowered",
    description: "Browse, chat, and connect freely. Get alerts only when needed. Access support anytime.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden" id="how-it-works">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Protection Made Simple
          </h2>
          <p className="text-xl text-muted-foreground">
            Get protected in minutes. SafeHer works silently in the background, 
            keeping you safe while you live your digital life.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative animate-fade-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-primary blur-xl opacity-30" />
                  <div className="relative w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {step.number}
                  </div>
                </div>
                
                <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary via-accent to-transparent -translate-x-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

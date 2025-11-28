import { Shield, Zap, Lock, AlertCircle, Globe, Smartphone } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "Real-Time Detection",
    description: "Our AI instantly identifies harassment, threats, and abuse across languages and African contexts—detecting harm before it reaches you.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Shield,
    title: "Smart Filtering",
    description: "Automatically filters abusive content while letting genuine messages through. You stay connected without the toxicity.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Lock,
    title: "Evidence Vault",
    description: "Securely stores screenshots and evidence with timestamps. Everything you need if you decide to report or take legal action.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: AlertCircle,
    title: "Emergency Support",
    description: "Instant access to crisis resources and support networks when threats escalate. You're never alone.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Globe,
    title: "Local Context Aware",
    description: "Trained on African slang, dialects, and regional harassment patterns. Protection that understands your reality.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    description: "Protection across social media, messaging apps, emails, and more. One shield for your entire digital life.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-background" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Powerful Protection
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your Personal AI Safety Layer
          </h2>
          <p className="text-xl text-muted-foreground">
            SafeHer combines cutting-edge AI with deep understanding of local contexts 
            to provide comprehensive protection that actually works.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-8 hover:shadow-glow transition-all duration-300 animate-fade-up border-2 group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

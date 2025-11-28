import { AlertTriangle, MessageSquareWarning, Camera, UserX } from "lucide-react";
import { Card } from "@/components/ui/card";

const problems = [
  {
    icon: MessageSquareWarning,
    title: "Daily Harassment",
    description: "Millions of women face insults, threats, and abusive messages every single day with no protection.",
  },
  {
    icon: Camera,
    title: "Image-Based Abuse",
    description: "Non-consensual sharing and manipulation of personal images causes lasting trauma.",
  },
  {
    icon: UserX,
    title: "Online Stalking",
    description: "Persistent unwanted contact and monitoring creates fear and restricts freedom online.",
  },
  {
    icon: AlertTriangle,
    title: "No Real-Time Protection",
    description: "Most solutions react after harm is done. Women need protection before the damage happens.",
  },
];

const Problem = () => {
  return (
    <section className="py-24 bg-muted/30" id="problem">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The Reality Women Face Online
          </h2>
          <p className="text-xl text-muted-foreground">
            Online harassment isn't just words on a screen—it's a crisis affecting mental health, 
            careers, and safety. Yet most platforms offer no real-time protection.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <Card 
              key={index}
              className="p-6 hover:shadow-glow transition-all duration-300 animate-fade-up border-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
                <problem.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{problem.title}</h3>
              <p className="text-muted-foreground">{problem.description}</p>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-block bg-destructive/10 text-destructive px-6 py-3 rounded-full font-semibold">
            73% of women have experienced online harassment—it's time for change.
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;

import { Card } from "@/components/ui/card";
import { Heart, TrendingUp, Users, Award } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "500K+",
    label: "Women Protected Daily",
    description: "Growing community of empowered users",
  },
  {
    icon: TrendingUp,
    value: "2M+",
    label: "Threats Blocked",
    description: "And counting, every single day",
  },
  {
    icon: Heart,
    value: "99.9%",
    label: "Satisfaction Rate",
    description: "Women feel safer and more confident",
  },
  {
    icon: Award,
    value: "15+",
    label: "African Countries",
    description: "Serving communities across the continent",
  },
];

const testimonials = [
  {
    quote: "SafeHer gave me back my confidence to engage online. I can finally focus on my work without constant fear.",
    author: "Amara N.",
    role: "Journalist, Lagos",
  },
  {
    quote: "The real-time protection is incredible. I didn't realize how much harassment I was tolerating until SafeHer filtered it out.",
    author: "Zuri M.",
    role: "Student, Nairobi",
  },
  {
    quote: "As a business owner, I need to be visible online. SafeHer lets me connect with customers without the abuse.",
    author: "Thandiwe S.",
    role: "Entrepreneur, Cape Town",
  },
];

const Impact = () => {
  return (
    <section className="py-24 bg-muted/30" id="impact">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Real Protection, Real Impact
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of women who've reclaimed their online freedom and safety.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card 
              key={index}
              className="p-6 text-center hover:shadow-glow transition-all duration-300 animate-fade-up border-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
              <p className="font-semibold mb-2">{stat.label}</p>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </Card>
          ))}
        </div>
        
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 animate-fade-up">
            Voices of Empowerment
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className="p-8 hover:shadow-glow transition-all duration-300 animate-fade-up border-2"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="mb-6">
                  <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;

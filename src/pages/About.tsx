import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Shield, Heart, Users, Target, Award, Globe } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Safety First",
    description: "Every decision we make prioritizes the safety and wellbeing of women online.",
  },
  {
    icon: Heart,
    title: "Empowerment",
    description: "We believe in empowering women to reclaim their digital spaces without fear.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building a supportive ecosystem where women support and protect each other.",
  },
  {
    icon: Globe,
    title: "Inclusion",
    description: "Designed for African contexts, celebrating diversity in language and culture.",
  },
];

const team = [
  {
    name: "Amara Okafor",
    role: "Founder & CEO",
    bio: "Tech entrepreneur passionate about using AI to solve real-world problems affecting women.",
  },
  {
    name: "Dr. Zainab Hassan",
    role: "Chief AI Officer",
    bio: "PhD in Machine Learning with 10+ years experience in natural language processing.",
  },
  {
    name: "Thandiwe Mbeki",
    role: "Head of Safety",
    bio: "Former cybersecurity specialist dedicated to online protection and digital rights.",
  },
  {
    name: "Fatima Diallo",
    role: "Community Director",
    bio: "Grassroots organizer building safe spaces for women across African communities.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Our Story
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Built by Women, For Women
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              SafeHer was born from lived experience. We've faced the harassment, felt the fear, 
              and witnessed the silence. Now we're fighting back with technology that truly understands 
              and protects.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-in-right">
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                To create a digital world where every woman can exist, speak, create, and thrive 
                online without fear of harassment, abuse, or violence.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                We believe technology should serve as a shield, not a weapon. SafeHer leverages 
                cutting-edge AI to detect and prevent online harm before it causes damage, while 
                respecting privacy and autonomy.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                <Card className="p-6 border-2">
                  <p className="text-3xl font-bold text-primary mb-2">500K+</p>
                  <p className="text-sm text-muted-foreground">Women Protected</p>
                </Card>
                <Card className="p-6 border-2">
                  <p className="text-3xl font-bold text-primary mb-2">15+</p>
                  <p className="text-sm text-muted-foreground">Countries Served</p>
                </Card>
              </div>
            </div>
            
            <div className="relative animate-fade-in animation-delay-300">
              <div className="absolute inset-0 bg-gradient-accent blur-3xl opacity-20 animate-float" />
              <Card className="relative p-8 border-2 shadow-lg-custom">
                <Target className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-2xl font-semibold mb-4">Why It Matters</h3>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                    <span>73% of women have experienced online harassment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                    <span>41% have been sexually harassed online</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                    <span>Many women self-censor or leave platforms entirely</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                    <span>Existing solutions react too late—after harm is done</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Core Values</h2>
            <p className="text-xl text-muted-foreground">
              These principles guide everything we do, from product development to community engagement.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card 
                key={index}
                className="p-8 hover:shadow-glow transition-all duration-300 animate-fade-up border-2 text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground">
              A diverse group of technologists, activists, and community builders united by one mission.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card 
                key={index}
                className="p-6 hover:shadow-glow transition-all duration-300 animate-fade-up border-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-24 h-24 bg-gradient-accent rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-center mb-2">{member.name}</h3>
                <p className="text-sm text-primary text-center mb-4">{member.role}</p>
                <p className="text-sm text-muted-foreground text-center">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-up">
            <Award className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join Us in Making History
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Every woman protected, every threat blocked, every voice empowered—together we're 
              creating the safe internet we all deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-all duration-300">
                Join Our Team
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300">
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;

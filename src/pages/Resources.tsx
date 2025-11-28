import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, Phone, FileText, Video, MessageSquare, Shield, AlertCircle } from "lucide-react";

const resourceCategories = [
  {
    icon: BookOpen,
    title: "Safety Guides",
    description: "Comprehensive guides on staying safe online",
    resources: [
      "Complete Online Safety Handbook",
      "Social Media Protection Guide",
      "Privacy Settings Checklist",
      "Recognizing Online Threats",
    ],
  },
  {
    icon: FileText,
    title: "Legal Resources",
    description: "Know your rights and legal options",
    resources: [
      "Cyberbullying Laws by Country",
      "How to Report Online Harassment",
      "Legal Action Templates",
      "Rights in Digital Spaces",
    ],
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Step-by-step video guides",
    resources: [
      "Setting Up SafeHer",
      "Evidence Collection Best Practices",
      "Using Emergency Features",
      "Platform-Specific Safety Tips",
    ],
  },
  {
    icon: MessageSquare,
    title: "Community Support",
    description: "Connect with others and share experiences",
    resources: [
      "Join Support Groups",
      "Share Your Story",
      "Mentor Program",
      "Monthly Community Calls",
    ],
  },
];

const emergencyContacts = [
  {
    country: "Nigeria",
    hotline: "+234-800-XXX-XXXX",
    organization: "National Women's Rights Center",
  },
  {
    country: "Kenya",
    hotline: "+254-800-XXX-XXXX",
    organization: "Women's Safety Network",
  },
  {
    country: "South Africa",
    hotline: "+27-800-XXX-XXXX",
    organization: "Gender-Based Violence Command Center",
  },
  {
    country: "Ghana",
    hotline: "+233-800-XXX-XXXX",
    organization: "Women in Law & Development",
  },
];

const quickTips = [
  {
    title: "Document Everything",
    description: "Take screenshots with timestamps. SafeHer automatically saves evidence, but manual backups help too.",
  },
  {
    title: "Don't Engage",
    description: "Responding to harassers often escalates situations. Let SafeHer filter it and focus on your wellbeing.",
  },
  {
    title: "Use Strong Privacy Settings",
    description: "Review privacy settings on all platforms regularly. Limit who can contact you and see your information.",
  },
  {
    title: "Trust Your Instincts",
    description: "If something feels wrong, it probably is. Block, report, and use SafeHer's emergency features if needed.",
  },
];

const Resources = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-up">
            <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Safety Resources & Support
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Everything you need to stay safe, informed, and empowered in digital spaces. 
              From guides to emergency contacts, we've got you covered.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="bg-destructive/10 border-y border-destructive/20 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">In Immediate Danger?</span>
            </div>
            <span className="text-muted-foreground">Contact local authorities or</span>
            <Button variant="destructive" className="rounded-full">
              <Phone className="w-4 h-4 mr-2" />
              Emergency Hotline: +123-456-7890
            </Button>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resourceCategories.map((category, index) => (
              <Card 
                key={index}
                className="p-6 hover:shadow-glow transition-all duration-300 animate-slide-in-right border-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <category.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                <ul className="space-y-2">
                  {category.resources.map((resource, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Download className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="hover:text-primary cursor-pointer transition-colors">
                        {resource}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Safety Tips */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Quick Safety Tips</h2>
            <p className="text-xl text-muted-foreground">
              Essential advice for immediate protection
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {quickTips.map((tip, index) => (
              <Card 
                key={index}
                className="p-6 hover:shadow-glow transition-all duration-300 animate-fade-up border-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-accent font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{tip.title}</h3>
                    <p className="text-muted-foreground">{tip.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
            <Phone className="w-12 h-12 text-accent mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Emergency Contacts</h2>
            <p className="text-xl text-muted-foreground">
              24/7 support hotlines across Africa
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {emergencyContacts.map((contact, index) => (
              <Card 
                key={index}
                className="p-6 hover:shadow-glow transition-all duration-300 animate-fade-up border-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-semibold mb-2">{contact.country}</h3>
                <p className="text-2xl font-bold text-primary mb-2">{contact.hotline}</p>
                <p className="text-sm text-muted-foreground">{contact.organization}</p>
                <Button className="w-full mt-4 bg-gradient-primary rounded-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-24 bg-gradient-to-br from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-up">
            <Download className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Download Complete Safety Kit
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get all our guides, templates, and resources in one comprehensive PDF package.
            </p>
            <Button className="bg-white text-primary hover:bg-white/90 px-8 py-6 rounded-full text-lg">
              <Download className="w-5 h-5 mr-2" />
              Download Full Kit (PDF)
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;

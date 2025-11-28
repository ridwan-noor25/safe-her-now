import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, MessageSquare, Send, Clock } from "lucide-react";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "General inquiries and support",
    contact: "hello@safeher.com",
    action: "Send Email",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak with our team",
    contact: "+123-456-7890",
    action: "Call Now",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Instant support 24/7",
    contact: "Available now",
    action: "Start Chat",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Our headquarters",
    contact: "Lagos, Nigeria",
    action: "Get Directions",
  },
];

const offices = [
  {
    city: "Lagos",
    country: "Nigeria",
    address: "123 Tech Hub Street, Victoria Island, Lagos",
    phone: "+234-800-XXX-XXXX",
  },
  {
    city: "Nairobi",
    country: "Kenya",
    address: "456 Innovation Drive, Westlands, Nairobi",
    phone: "+254-800-XXX-XXXX",
  },
  {
    city: "Cape Town",
    country: "South Africa",
    address: "789 Digital Boulevard, Green Point, Cape Town",
    phone: "+27-800-XXX-XXXX",
  },
];

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-up">
            <MessageSquare className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Have questions? Need support? Want to partner? We're here to help. 
              Reach out and let's create safer digital spaces together.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <Card 
                key={index}
                className="p-6 hover:shadow-glow transition-all duration-300 animate-slide-in-right border-2 text-center cursor-pointer group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <method.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                <p className="text-primary font-semibold mb-4">{method.contact}</p>
                <Button variant="outline" className="w-full rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                  {method.action}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="animate-fade-up">
              <h2 className="text-4xl font-bold mb-6">Send Us a Message</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Fill out the form and our team will get back to you within 24 hours.
              </p>
              
              <Card className="p-8 border-2">
                <form className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Amara"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Okafor"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="amara@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <select className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>General Inquiry</option>
                      <option>Technical Support</option>
                      <option>Partnership</option>
                      <option>Press & Media</option>
                      <option>Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                  
                  <Button className="w-full bg-gradient-primary py-6 rounded-full text-lg">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>
            
            <div className="space-y-8 animate-fade-up animation-delay-300">
              <Card className="p-8 border-2">
                <Clock className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-2xl font-semibold mb-4">Business Hours</h3>
                <div className="space-y-3 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-semibold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-semibold">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold">Closed</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-accent font-semibold">Emergency Support: 24/7</p>
                </div>
              </Card>
              
              <Card className="p-8 border-2 bg-gradient-to-br from-primary/5 to-accent/5">
                <h3 className="text-2xl font-semibold mb-4">Need Immediate Help?</h3>
                <p className="text-muted-foreground mb-6">
                  If you're experiencing harassment or need urgent assistance, 
                  our emergency support team is available 24/7.
                </p>
                <Button className="w-full bg-destructive hover:bg-destructive/90 py-6 rounded-full">
                  <Phone className="w-5 h-5 mr-2" />
                  Emergency Hotline
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Offices</h2>
            <p className="text-xl text-muted-foreground">
              Visit us at any of our locations across Africa
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {offices.map((office, index) => (
              <Card 
                key={index}
                className="p-8 hover:shadow-glow transition-all duration-300 animate-fade-up border-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MapPin className="w-10 h-10 text-accent mb-4" />
                <h3 className="text-2xl font-semibold mb-2">{office.city}</h3>
                <p className="text-sm text-muted-foreground mb-4">{office.country}</p>
                <p className="text-sm mb-4">{office.address}</p>
                <p className="text-primary font-semibold mb-4">{office.phone}</p>
                <Button variant="outline" className="w-full rounded-full">
                  Get Directions
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-24 bg-gradient-to-br from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Have Questions?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Check out our FAQ section for quick answers to common questions, 
              or reach out directly—we're always happy to help.
            </p>
            <Button className="bg-white text-primary hover:bg-white/90 px-8 py-6 rounded-full text-lg">
              View FAQ
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;

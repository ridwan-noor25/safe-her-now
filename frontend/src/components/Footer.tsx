import { Shield, Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">SafeHer</span>
            </div>
            <p className="text-background/70 mb-6">
              AI-powered protection empowering women to exist, speak, and thrive online safely.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-background/10 hover:bg-background/20 rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-background/10 hover:bg-background/20 rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-background/10 hover:bg-background/20 rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-background/10 hover:bg-background/20 rounded-lg flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-background/70 hover:text-background transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-background/70 hover:text-background transition-colors">How It Works</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">Pricing</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">Safety Guide</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">Support Center</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">Blog</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">Community</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">About Us</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">Careers</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">Press Kit</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/70 text-sm">
              © {currentYear} SafeHer. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-background/70 hover:text-background transition-colors">Privacy Policy</a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">Terms of Service</a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-background/20 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-background px-4 py-2 rounded-full text-sm">
            <Mail className="w-4 h-4" />
            Emergency Support: support@safeher.com | 24/7 Hotline: +123-456-7890
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

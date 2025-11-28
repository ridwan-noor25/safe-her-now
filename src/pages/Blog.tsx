import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight, TrendingUp } from "lucide-react";

const featuredPost = {
  title: "How AI is Revolutionizing Online Safety for Women",
  excerpt: "Discover how SafeHer's advanced AI technology is detecting and preventing harassment in real-time, creating safer digital spaces for millions of women across Africa.",
  category: "Technology",
  author: "Amara Okafor",
  date: "Nov 20, 2025",
  readTime: "8 min read",
  image: "bg-gradient-to-br from-primary/20 to-accent/20",
};

const blogPosts = [
  {
    title: "5 Signs You're Being Digitally Stalked (And What To Do)",
    excerpt: "Learn to recognize the warning signs of online stalking and take immediate action to protect yourself.",
    category: "Safety Tips",
    author: "Zuri Mwangi",
    date: "Nov 18, 2025",
    readTime: "5 min read",
  },
  {
    title: "Success Story: How Sarah Reclaimed Her Online Voice",
    excerpt: "A journalist shares her journey of overcoming severe online harassment with SafeHer's protection.",
    category: "Community",
    author: "Thandiwe Mbeki",
    date: "Nov 15, 2025",
    readTime: "6 min read",
  },
  {
    title: "Understanding Your Legal Rights Against Cyberbullying",
    excerpt: "A comprehensive guide to legal protections and actions you can take in different African countries.",
    category: "Legal",
    author: "Fatima Diallo",
    date: "Nov 12, 2025",
    readTime: "10 min read",
  },
  {
    title: "The Mental Health Impact of Online Harassment",
    excerpt: "Why online abuse is more than 'just words' and how to protect your mental wellbeing.",
    category: "Wellness",
    author: "Dr. Nia Okeke",
    date: "Nov 10, 2025",
    readTime: "7 min read",
  },
  {
    title: "Platform Guide: Instagram Safety Settings You Need",
    excerpt: "Step-by-step instructions for maximizing your privacy and safety on Instagram.",
    category: "Guides",
    author: "Zuri Mwangi",
    date: "Nov 8, 2025",
    readTime: "5 min read",
  },
  {
    title: "Building Supportive Online Communities for Women",
    excerpt: "How to create and maintain safe spaces where women can connect without fear.",
    category: "Community",
    author: "Amara Okafor",
    date: "Nov 5, 2025",
    readTime: "8 min read",
  },
];

const categories = ["All", "Technology", "Safety Tips", "Community", "Legal", "Wellness", "Guides"];

const Blog = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4" />
              Latest Updates
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Stories, Tips & Insights
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Stay informed with the latest in online safety, success stories from our community, 
              and expert advice on digital protection.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-background border-b border-border sticky top-20 z-40 backdrop-blur-lg bg-background/95">
        <div className="container mx-auto px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "outline"}
                className="rounded-full whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden border-2 hover:shadow-glow transition-all duration-300 animate-fade-up">
            <div className="grid lg:grid-cols-2">
              <div className={`${featuredPost.image} min-h-[300px] lg:min-h-[400px] flex items-center justify-center`}>
                <div className="text-6xl">📱</div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium w-fit mb-4">
                  Featured
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {featuredPost.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </div>
                </div>
                <Button className="bg-gradient-primary rounded-full w-fit">
                  Read Full Story
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card 
                key={index}
                className="overflow-hidden hover:shadow-glow transition-all duration-300 animate-fade-up border-2 cursor-pointer group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 h-48 flex items-center justify-center text-5xl">
                  {index % 3 === 0 ? "🛡️" : index % 3 === 1 ? "💪" : "📚"}
                </div>
                <div className="p-6">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-3">
                    {post.category}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <Button variant="ghost" className="group-hover:text-primary transition-colors p-0">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="rounded-full">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-gradient-to-br from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center animate-fade-up">
            <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8 opacity-90">
              Get the latest safety tips, success stories, and updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full text-foreground focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button className="bg-white text-primary hover:bg-white/90 px-8 py-4 rounded-full">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;

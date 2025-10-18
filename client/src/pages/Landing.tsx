import { Button } from "@/components/ui/button";
import { Card as ShadcnCard, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Shield, Users, TrendingUp, CheckCircle2, Factory } from "lucide-react";
import { Card, Text, View, Button as ReshapedButton, Badge } from "reshaped";
import { LoginForm } from "@/components/LoginForm";
import { Link } from "wouter"

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background z-10" />
        
        {/* Placeholder for hero image - will be replaced with actual Jamaican manufacturing imagery */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
        
        <View className="relative z-20 max-w-5xl mx-auto px-4 text-center" gap={6}>
          <View gap={2} align="center">
            <Badge color="neutral" className="backdrop-blur-sm">
              <Text variant="caption-1" weight="medium" className="text-white">
                Jamaica's Premier B2B Manufacturing Marketplace
              </Text>
            </Badge>
          </View>
          
          <h1 className="font-display font-bold text-5xl md:text-7xl text-white mb-0" data-testid="heading-hero">
            Connect with Jamaica's Manufacturing Excellence
          </h1>
          
          <Text 
            variant="body-2" 
            className="text-white/90 max-w-3xl mx-auto"
          >
            Your gateway to verified manufacturers, agro-processors, and production partners across Jamaica
          </Text>
          
          <View direction="row" gap={3} justify="center" align="center" className="flex-wrap">
            <ReshapedButton
              color="primary"
              size="large"
              onClick={() => document.getElementById('login')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-get-started"
              className="backdrop-blur-sm"
            >
              Get Started
            </ReshapedButton>
            <ReshapedButton
              variant="ghost"
              size="large"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-learn-more"
              className="backdrop-blur-sm border border-white/40 text-white hover:bg-white/10"
            >
              Learn More
            </ReshapedButton>
          </View>
        </View>
      </section>

      {/* Login Section */}
      <section id="login" className="-mt-16 mb-16 px-4 flex justify-center">
        <LoginForm />
      </section>

      {/* Value Propositions */}
      <section id="features" className="py-24 px-4">
        <View className="max-w-7xl mx-auto" gap={10}>
          <View align="center" gap={4}>
            <h2 className="font-display font-bold text-4xl" data-testid="heading-features">
              Why Choose JamMakers?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl text-center">
              The complete platform for manufacturing partnerships in Jamaica
            </p>
          </View>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card padding={6} data-testid="card-feature-verified">
              <View gap={4}>
                <View className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </View>
                <View gap={2}>
                  <h3 className="text-xl font-semibold">Verified Manufacturers</h3>
                  <p className="text-muted-foreground">
                    All manufacturers undergo rigorous verification to ensure quality and reliability
                  </p>
                </View>
              </View>
            </Card>

            <Card padding={6} data-testid="card-feature-search">
              <View gap={4}>
                <View className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                  <Search className="h-6 w-6 text-primary" />
                </View>
                <View gap={2}>
                  <h3 className="text-xl font-semibold">Advanced Search</h3>
                  <p className="text-muted-foreground">
                    Find the perfect manufacturing partner with powerful filters by industry, capacity, and certifications
                  </p>
                </View>
              </View>
            </Card>

            <Card padding={6} data-testid="card-feature-rfq">
              <View gap={4}>
                <View className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                  <Factory className="h-6 w-6 text-primary" />
                </View>
                <View gap={2}>
                  <h3 className="text-xl font-semibold">RFQ Management</h3>
                  <p className="text-muted-foreground">
                    Streamline your procurement with integrated request-for-quote workflows
                  </p>
                </View>
              </View>
            </Card>

            <Card padding={6} data-testid="card-feature-network">
              <View gap={4}>
                <View className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </View>
                <View gap={2}>
                  <h3 className="text-xl font-semibold">Trusted Network</h3>
                  <p className="text-muted-foreground">
                    Join a community of verified brands, manufacturers, and service providers
                  </p>
                </View>
              </View>
            </Card>

            <Card padding={6} data-testid="card-feature-financing">
              <View gap={4}>
                <View className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </View>
                <View gap={2}>
                  <h3 className="text-xl font-semibold">Financing Options</h3>
                  <p className="text-muted-foreground">
                    Connect with financial institutions offering business loans and growth capital
                  </p>
                </View>
              </View>
            </Card>

            <Card padding={6} data-testid="card-feature-support">
              <View gap={4}>
                <View className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </View>
                <View gap={2}>
                  <h3 className="text-xl font-semibold">24/7 AI Support</h3>
                  <p className="text-muted-foreground">
                    Get instant help with JamBot for manufacturing questions, certifications, and guidance
                  </p>
                </View>
              </View>
            </Card>
          </div>
        </View>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Sign up and complete your profile as a brand, manufacturer, or service provider
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">Connect & Communicate</h3>
              <p className="text-muted-foreground">
                Search for partners, send RFQs, and communicate directly through our platform
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">Grow Your Business</h3>
              <p className="text-muted-foreground">
                Manage projects, track progress, and build lasting partnerships
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="default"
              className="text-lg px-8 py-6 h-auto hover-elevate active-elevate-2"
              asChild
              data-testid="button-join-now"
            >
              <Link href="/brands/create">Join JamMakers Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-display font-semibold text-lg mb-4">JamMakers</h4>
              <p className="text-sm text-muted-foreground">
                Jamaica's premier manufacturing and agro-processing marketplace
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Platform</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Find Manufacturers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Resources</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Financing</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 JamMakers. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

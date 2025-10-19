import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginForm } from "@/components/LoginForm";
import { Search, Factory, Handshake, ShieldCheck, MessageSquare, FileText, TrendingUp, LogIn } from "lucide-react";

export default function Landing() {
  return (
    <div id="landing-root" className="min-h-screen bg-white text-gray-900">
      {/* Top Header */}
      <header className="px-5 py-4 border-b bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-display text-[27px] font-bold mt-[20px]"><span className="text-green-600">JA</span> Makers</Link>
          <nav className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-9 gap-2" aria-label="Sign in" asChild>
              <Link href="/login" className="inline-flex">
                <LogIn className="h-4 w-4" />
                Sign in
              </Link>
            </Button>
            <Button variant="default" size="sm" className="h-9 gap-2 bg-green-600 hover:bg-green-700 text-white" aria-label="Register" asChild>
              <Link href="/signup" className="inline-flex">Register</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Find manufacturers and bring products to life
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Connect with vetted factories, designers, raw material suppliers, and financing partners across Jamaica.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/manufacturers">
                <Button size="lg" className="w-full sm:w-auto">Explore manufacturers</Button>
              </Link>
              <Link href="/rfqs/new">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">Start a project</Button>
              </Link>
            </div>

            {/* Quick Search (illustrative) */}
            <div className="mt-6 max-w-lg">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Search className="h-4 w-4" />
                </span>
                <Input
                  placeholder="What do you want to make? e.g. bottled drinks, t-shirts, skincare"
                  className="pl-10"
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Use filters in the directory to refine by industry, location, and capacity.
              </p>
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
              Trusted by local brands and global buyers
            </div>
          </div>

          {/* Hero Visual */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="font-medium flex items-center gap-2">
                  <Factory className="h-4 w-4" /> Food & Beverage
                </div>
                <div className="text-sm text-muted-foreground">Bottling, packaging, private label</div>
              </div>
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="font-medium flex items-center gap-2">
                  <Factory className="h-4 w-4" /> Textiles & Fashion
                </div>
                <div className="text-sm text-muted-foreground">Cut & sew, screen printing, embroidery</div>
              </div>
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="font-medium flex items-center gap-2">
                  <Factory className="h-4 w-4" /> Personal Care
                </div>
                <div className="text-sm text-muted-foreground">Formulation, filling, labeling</div>
              </div>
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="font-medium flex items-center gap-2">
                  <Factory className="h-4 w-4" /> Furniture & Home
                </div>
                <div className="text-sm text-muted-foreground">Woodworking, metal fabrication</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-background">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-5 w-5" />
              <h3 className="font-semibold">Search & Filter</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Browse a growing network of manufacturers and service providers. Filter by industry, location, and capacity.
            </p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Handshake className="h-5 w-5" />
              <h3 className="font-semibold">Request Quotes</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Connect, message, and request quotes directly from verified partners to kick off your project.
            </p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5" />
              <h3 className="font-semibold">Verified Profiles</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Look for verification badges and detailed profiles to assess capabilities, certifications, and capacity.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-8">How it works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold mb-1">1. Post your project</div>
              <p className="text-sm text-muted-foreground">Outline your product, quantities, timelines, and requirements.</p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold mb-1">2. Match with manufacturers</div>
              <p className="text-sm text-muted-foreground">Discover partners with the right capabilities and location.</p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold mb-1">3. Chat & request quotes</div>
              <p className="text-sm text-muted-foreground">Share details, request proposals, and compare offers.</p>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold mb-1">4. Deliver & scale</div>
              <p className="text-sm text-muted-foreground">Move to production and track progress across milestones.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA: Join */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold">Ready to get started?</h3>
            <p className="mt-1 text-sm opacity-90">Join as a brand or list your factory.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signup">
              <Button variant="secondary">Join as a Brand</Button>
            </Link>
            <Link href="/manufacturers/create">
              <Button variant="outline" className="bg-white/10">List Your Factory</Button>
            </Link>
          </div>
        </div>
      </section>



      {/* Resources & Extras */}
      <section className="border-t bg-background">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-5 w-5" />
              <h3 className="font-semibold">Messages</h3>
            </div>
            <p className="text-sm text-muted-foreground">Secure messaging between brands and manufacturers.</p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5" />
              <h3 className="font-semibold">Resources</h3>
            </div>
            <p className="text-sm text-muted-foreground">Export guides, certification requirements, costing templates.</p>
            <div className="mt-3">
              <Link href="/resources">
                <Button variant="outline" size="sm">Explore Resources</Button>
              </Link>
            </div>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5" />
              <h3 className="font-semibold">Financing</h3>
            </div>
            <p className="text-sm text-muted-foreground">Connect with financial institutions for production capital.</p>
            <div className="mt-3">
              <Link href="/finance">
                <Button variant="outline" size="sm">View Options</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-6 py-8 text-sm text-muted-foreground flex items-center justify-between">
          <div>© <span className="text-[19px]"><span className="text-green-600">JA</span> Makers</span></div>
          <div className="flex items-center gap-4">
            <Link href="/resources">Resources</Link>
            <Link href="/training">Training</Link>
            <Link href="/manufacturers">Manufacturers</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
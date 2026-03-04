
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Stethoscope, User, ShieldAlert, Activity, Globe, Lock } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-hospital-facility');

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <Stethoscope className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground font-headline">
            MARUTHI CLINIC
          </h1>
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/patient/login">Patient Login</Link>
          </Button>
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/doctor/login">Doctor Login</Link>
          </Button>
          <Button asChild className="shadow-sm">
            <Link href="/patient/register">Register Now</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="container mx-auto grid grid-cols-1 items-center gap-12 px-6 py-24 md:grid-cols-2 lg:py-32">
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm">
              <Activity className="h-4 w-4" />
              Next-Generation Healthcare Portal
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter text-primary md:text-6xl lg:text-7xl font-headline leading-[1.1]">
              Excellence in <br />
              <span className="text-foreground">Clinical Care.</span>
            </h1>
            <div className="space-y-4">
               <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground/80">
                Integrated Medical Management System
              </h2>
              <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
                Welcome to the Maruthi Clinic digital portal. Manage appointments, access secure health records, and connect with our world-class medical specialists through our unified healthcare ecosystem.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" asChild className="px-8 h-12 text-md shadow-lg shadow-primary/20">
                <Link href="/patient/register">Create Patient Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8 h-12 text-md">
                <Link href="#services">Our Medical Services</Link>
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-6 border-t border-primary/10">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">24/7 Access</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative group w-full max-w-[600px]">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              
              <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-primary/20 bg-card">
                <img
                  src={heroImage?.imageUrl || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1080"}
                  alt="Modern Hospital Facility"
                  className="object-cover aspect-[4/3] w-full transition-transform duration-700 group-hover:scale-105"
                  data-ai-hint={heroImage?.imageHint || "hospital clinic"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-5 bg-black/40 backdrop-blur-md rounded-xl border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
                      <Stethoscope className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase tracking-wider">Clinical Excellence</p>
                      <p className="text-xs text-white/90 font-medium">State-of-the-art facility & digital care</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="bg-muted/50 py-24">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center space-y-4">
              <h2 className="text-4xl font-bold font-headline tracking-tight">Dedicated Access Control</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our portal provides secure, specialized interfaces for every member of the Maruthi Clinic family.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-10 bg-card rounded-3xl border border-primary/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                  <User className="h-10 w-10" />
                </div>
                <h3 className="mb-4 text-2xl font-bold font-headline">Patient Portal</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Securely view your records, manage appointments, and request medication refills from your personal health dashboard.
                </p>
                <Button variant="link" className="mt-4 text-primary font-semibold" asChild>
                  <Link href="/patient/login">Patient Login →</Link>
                </Button>
              </div>
              <div className="flex flex-col items-center text-center p-10 bg-card rounded-3xl border border-primary/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                  <Stethoscope className="h-10 w-10" />
                </div>
                <h3 className="mb-4 text-2xl font-bold font-headline">Doctor Portal</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Advanced tools for medical staff to manage patient lists, review clinical data, and streamline healthcare delivery.
                </p>
                <Button variant="link" className="mt-4 text-primary font-semibold" asChild>
                  <Link href="/doctor/login">Medical Staff Login →</Link>
                </Button>
              </div>
              <div className="flex flex-col items-center text-center p-10 bg-card rounded-3xl border border-primary/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                  <ShieldAlert className="h-10 w-10" />
                </div>
                <h3 className="mb-4 text-2xl font-bold font-headline">Administration</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Full oversight of clinic operations, provider management, and secure system configurations for administrators.
                </p>
                <Button variant="link" className="mt-4 text-primary font-semibold" asChild>
                  <Link href="/admin/login">Admin Management →</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card">
        <div className="container mx-auto flex flex-col items-center justify-between gap-8 px-6 py-12 sm:flex-row">
          <div className="flex flex-col gap-2 items-center sm:items-start">
            <Link href="/" className="flex items-center gap-2">
              <Stethoscope className="h-6 w-6 text-primary" />
              <h1 className="text-lg font-bold tracking-tight text-foreground font-headline">
                MARUTHI CLINIC
              </h1>
            </Link>
            <p className="text-sm text-muted-foreground">
              Excellence in healthcare infrastructure since 2010.
            </p>
          </div>
          <p className="text-sm text-muted-foreground order-last sm:order-none">
            © {new Date().getFullYear()} Maruthi Clinic. All rights reserved.
          </p>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Link
              href="/admin/login"
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              Staff Portal
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

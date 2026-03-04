import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Stethoscope, User, ShieldAlert } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-face-analysis');

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          <Stethoscope className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            MARUTHI CLINIC
          </h1>
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/patient/login">Patient Login</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/doctor/login">Doctor Login</Link>
          </Button>
          <Button asChild>
            <Link href="/patient/register">Register</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="container mx-auto grid grid-cols-1 items-center gap-12 px-6 py-24 md:grid-cols-2 lg:py-32">
          <div className="space-y-6">
            <h1 className="text-5xl font-extrabold tracking-tighter text-primary md:text-6xl lg:text-8xl font-headline underline decoration-primary/30 underline-offset-8">
              Face Analysis
            </h1>
            <div className="space-y-4">
               <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                AI-powered Health Assessment
              </h2>
              <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
                Experience the future of healthcare at Maruthi Clinic. Our advanced AI-driven tools provide deep insights into your health, starting with professional biometric face analysis in a clinical setting you can trust.
              </p>
            </div>
            <div className="flex gap-4 pt-4">
              <Button size="lg" asChild className="px-8 shadow-lg shadow-primary/20">
                <Link href="/patient/register">Get Started Today</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border-4 border-primary/10 bg-black group">
              <img
                src={heroImage?.imageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1080"}
                alt="AI-powered Face Analysis"
                className="object-cover aspect-[4/3] w-full max-w-[600px] transition-transform duration-700 group-hover:scale-105"
                data-ai-hint={heroImage?.imageHint || "face recognition"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent pointer-events-none"></div>
              <div className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-medium text-white tracking-widest uppercase">Scanning Identity</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-muted py-20">
          <div className="container mx-auto px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold">A Portal for Everyone</h2>
              <p className="text-muted-foreground">
                Dedicated interfaces for every member of our clinic.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-8 bg-card rounded-2xl border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground rotate-3">
                  <User className="h-8 w-8 -rotate-3" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Patient Portal</h3>
                <p className="text-muted-foreground">
                  Access your health records, schedule appointments, and message
                  your doctor securely.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-8 bg-card rounded-2xl border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground -rotate-3">
                  <Stethoscope className="h-8 w-8 rotate-3" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Doctor Portal</h3>
                <p className="text-muted-foreground">
                  Manage your patient list, review AI-assisted records, and streamline your clinical workflow.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-8 bg-card rounded-2xl border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <ShieldAlert className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Admin Access</h3>
                <p className="text-muted-foreground">
                  Oversee clinic operations with secure management tools and detailed staff oversight.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Maruthi Clinic. All rights reserved.
          </p>
          <nav className="flex gap-6">
            <Link
              href="/admin/login"
              className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Admin Login
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

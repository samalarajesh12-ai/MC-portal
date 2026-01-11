import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Stethoscope, User, ShieldAlert } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-7 w-7 text-primary"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
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
            <h1 className="text-4xl font-extrabold tracking-tighter text-primary md:text-5xl lg:text-6xl">
              Modern Healthcare, Right at Your Fingertips.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Maruthi Clinic provides a seamless digital experience for patients
              and doctors. Manage appointments, access records, and communicate
              securely.
            </p>
            <div className="flex gap-4">
              <Button size="lg" asChild>
                <Link href="/patient/register">Get Started Today</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="https://picsum.photos/seed/health-team/600/400"
              alt="Healthcare professionals"
              className="rounded-xl shadow-2xl"
              data-ai-hint="healthcare professionals team"
            />
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
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Patient Portal</h3>
                <p className="text-muted-foreground">
                  Access your health records, schedule appointments, and message
                  your doctor.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Stethoscope className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Doctor Portal</h3>
                <p className="text-muted-foreground">
                  Manage your patient list, review records, and streamline your
                  workflow.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <ShieldAlert className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Admin Access</h3>
                <p className="text-muted-foreground">
                  Oversee clinic operations with secure, confidential access.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Maruthi Clinic. All rights reserved.
          </p>
          <nav className="flex gap-4">
            <Link
              href="/admin/login"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Admin Login
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Terms of Service
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function PatientRegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showCredentialsDialog, setShowCredentialsDialog] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState({
    username: '',
    password: '',
  });
  const [copied, setCopied] = useState(false);

  const handleRegister = (event: React.FormEvent) => {
    event.preventDefault();
    const username = `patient_${Math.random().toString(36).substring(2, 8)}`;
    const password = Math.random().toString(36).substring(2, 10);
    setGeneratedCredentials({ username, password });
    setShowCredentialsDialog(true);
  };

  const copyToClipboard = () => {
    const textToCopy = `Username: ${generatedCredentials.username}\nPassword: ${generatedCredentials.password}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast({ title: 'Copied to clipboard!' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
        <Link href="/" className="mb-8 flex items-center gap-2">
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
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <UserPlus className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Create Patient Account</CardTitle>
            <CardDescription>
              Fill out the form below to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" placeholder="Doe" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" required />
              </div>
              <Button type="submit" className="w-full">
                Register
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/patient/login"
                className="font-medium text-primary hover:underline"
              >
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>

      <AlertDialog open={showCredentialsDialog} onOpenChange={setShowCredentialsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Registration Successful!</AlertDialogTitle>
            <AlertDialogDescription>
              Please save your automatically generated credentials. You will use
              these to log in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 rounded-md border bg-muted/50 p-4">
            <div className="space-y-1">
              <Label htmlFor="gen-username">Username</Label>
              <p id="gen-username" className="font-mono text-sm">
                {generatedCredentials.username}
              </p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="gen-password">Password</Label>
              <p id="gen-password" className="font-mono text-sm">
                {generatedCredentials.password}
              </p>
            </div>
          </div>
          <AlertDialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={copyToClipboard}
              className="w-full sm:w-auto"
            >
              {copied ? <Check className="mr-2" /> : <Copy className="mr-2" />}
              {copied ? 'Copied!' : 'Copy Credentials'}
            </Button>
            <AlertDialogAction
              onClick={() => router.push('/patient/login')}
              className="w-full sm:w-auto"
            >
              Continue to Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

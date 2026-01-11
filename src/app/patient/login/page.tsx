'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
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
import { User, Camera, ShieldAlert } from 'lucide-react';
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
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function PatientLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const [showFaceIdModal, setShowFaceIdModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | undefined
  >(undefined);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (showFaceIdModal) {
      const getCameraPermission = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error('Camera API not available in this browser.');
          setHasCameraPermission(false);
          return;
        }
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
        }
      };

      getCameraPermission();

      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
        }
      };
    }
  }, [showFaceIdModal]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Login Successful',
        description: 'Welcome back! Redirecting to your dashboard.',
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'Please check your credentials and try again.',
      });
    }
  };

  const handleFaceIdVerification = () => {
    setIsVerifying(true);
    // In a real app, you'd send the captured image to a face recognition service
    setTimeout(() => {
      setIsVerifying(false);
      setShowFaceIdModal(false);
      toast({
        title: 'Face ID Verified!',
        description: 'Welcome back! Redirecting to your dashboard.',
      });
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-7 w-7 text-primary"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
              clipRule="evenodd"
            />
          </svg>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            MARUTHI CLINIC
          </h1>
        </Link>
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <User className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Patient Login</CardTitle>
            <CardDescription>
              Access your health records and appointments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="patient@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowFaceIdModal(true)}
            >
              <Camera className="mr-2 h-4 w-4" />
              Login with Face ID
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-2">
            <div className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                href="/patient/register"
                className="font-medium text-primary hover:underline"
              >
                Register
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      <AlertDialog open={showFaceIdModal} onOpenChange={setShowFaceIdModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" /> Face ID Verification
            </AlertDialogTitle>
            <AlertDialogDescription>
              Position your face in the center of the frame to log in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="relative flex min-h-[200px] items-center justify-center">
            <video
              ref={videoRef}
              className="w-full aspect-video rounded-md bg-muted"
              autoPlay
              muted
              playsInline
            />
            {hasCameraPermission === false && (
              <Alert variant="destructive" className="absolute">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Camera Access Denied</AlertTitle>
                <AlertDescription>
                  Please enable camera permissions in your browser to use Face
                  ID.
                </AlertDescription>
              </Alert>
            )}
            {isVerifying && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
                <p className="mt-2 text-lg font-semibold text-white">
                  Verifying...
                </p>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowFaceIdModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleFaceIdVerification}
              disabled={hasCameraPermission !== true || isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Verify'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    
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
import { Stethoscope, Camera, ShieldAlert, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DoctorLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password');

  useEffect(() => {
    if (loginMethod === 'faceid') {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
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
  }, [loginMethod]);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: 'Login Successful',
      description: 'Welcome back, Doctor! Redirecting to your portal.',
    });
    router.push('/dashboard');
  };

  const handleFaceIdVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      toast({
        title: 'Face ID Verified!',
        description: 'Welcome back, Doctor! Redirecting to your portal.',
      });
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-primary">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
        </svg>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">MARUTHI CLINIC</h1>
      </Link>

      <Card className="w-full max-w-md shadow-xl border-primary/10">
        <CardHeader className="text-center space-y-1">
          <div className="mx-auto mb-2 bg-primary/10 p-3 rounded-full w-fit">
            <Stethoscope className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">Doctor Portal</CardTitle>
          <CardDescription>Secure access for healthcare providers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="password" onValueChange={setLoginMethod} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="password" className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" /> Credentials
              </TabsTrigger>
              <TabsTrigger value="faceid" className="flex items-center gap-2">
                <Camera className="h-4 w-4" /> Biometric
              </TabsTrigger>
            </TabsList>

            <TabsContent value="password">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <Input id="email" type="email" placeholder="doctor@maruthi.clinic" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full h-11">Sign In to Dashboard</Button>
              </form>
            </TabsContent>

            <TabsContent value="faceid">
              <div className="space-y-4">
                <div className="relative flex min-h-[240px] items-center justify-center overflow-hidden rounded-lg bg-black/5 border-2 border-dashed border-primary/20">
                  <video ref={videoRef} className="w-full aspect-video object-cover" autoPlay muted playsInline />
                  {hasCameraPermission === false && (
                    <Alert variant="destructive" className="absolute mx-4">
                      <ShieldAlert className="h-4 w-4" />
                      <AlertTitle>Camera Access Required</AlertTitle>
                      <AlertDescription>Please enable camera access in your browser.</AlertDescription>
                    </Alert>
                  )}
                  {isVerifying && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/20 backdrop-blur-sm">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-2"></div>
                      <p className="text-sm font-semibold text-primary-foreground drop-shadow-md">Verifying Identity...</p>
                    </div>
                  )}
                </div>
                <Button 
                  onClick={handleFaceIdVerification} 
                  className="w-full h-11"
                  disabled={hasCameraPermission !== true || isVerifying}
                >
                  {isVerifying ? 'Verifying...' : 'Verify Identity'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2 border-t pt-6">
          <div className="text-sm text-muted-foreground">
            Need an account? <Link href="/doctor/register" className="font-semibold text-primary hover:underline">Apply for Access</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
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
import { Stethoscope, ClipboardCheck, Camera, ShieldAlert, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';

export default function DoctorRegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const [faceImage, setFaceImage] = useState<string | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
  }, []);
  
  const handleRegister = (event: React.FormEvent) => {
    event.preventDefault();
     if (!faceImage) {
        toast({
            variant: 'destructive',
            title: 'Face Image Required',
            description: 'Please capture a face image to complete registration.',
        });
        return;
    }
    toast({
      title: 'Registration Submitted',
      description:
        "Your application is under review. You'll be notified upon approval.",
      action: (
        <div className="flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5 text-green-500" />
          <span>Success</span>
        </div>
      ),
    });
    router.push('/doctor/login');
  };

  const captureFaceImage = () => {
    if (videoRef.current && canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
            const dataUrl = canvasRef.current.toDataURL('image/png');
            setFaceImage(dataUrl);
            toast({ title: 'Face image captured!'});
        }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
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
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Stethoscope className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Doctor Registration</CardTitle>
          <CardDescription>
            Join our team of dedicated healthcare professionals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" placeholder="John" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" placeholder="Smith" required />
              </div>
               <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input id="mobile" type="tel" placeholder="+1 (555) 123-4567" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="dr.smith@maruthi.clinic"
                  required
                />
              </div>
               <div className="space-y-2">
                    <Label htmlFor="blood-group">Blood Group</Label>
                    <Select>
                        <SelectTrigger id="blood-group">
                            <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="joining-date">Date of Joining</Label>
                  <Input id="joining-date" type="date" required />
                </div>
              <div className="space-y-2">
                <Label htmlFor="qualification">Primary Qualification</Label>
                <Input id="qualification" placeholder="e.g., MBBS, MD" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Select>
                  <SelectTrigger id="specialty">
                    <SelectValue placeholder="Select a specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="dermatology">Dermatology</SelectItem>
                    <SelectItem value="pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">Medical License Number</Label>
                <Input id="license" placeholder="GMC-1234567" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Work Experience (Years)</Label>
                <Input id="experience" type="number" placeholder="5" required />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="current-unit">Current Unit/Department</Label>
              <Input id="current-unit" placeholder="e.g., Emergency Department" required />
            </div>
            
            <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
                <Label className="flex items-center gap-2 font-semibold">
                    <Camera className="h-5 w-5"/>
                    Face Image for Login
                </Label>
                <div className="relative flex items-center justify-center">
                    <video ref={videoRef} className="w-full max-w-sm aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                    <canvas ref={canvasRef} className="hidden"></canvas>
                    {hasCameraPermission === false && (
                        <Alert variant="destructive" className="absolute">
                            <ShieldAlert className="h-4 w-4"/>
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription>
                                Please allow camera access for face registration.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <Button type="button" onClick={captureFaceImage} disabled={hasCameraPermission !== true} className="w-full sm:w-auto">Capture Face Image</Button>
                    {faceImage && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                           <Check className="h-5 w-5" />
                           <span>Image captured!</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="password">Create Password</Label>
              <Input id="password" type="password" required />
            </div>

            <Button type="submit" className="w-full md:col-span-2">
              Submit Application
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/doctor/login"
              className="font-medium text-primary hover:underline"
            >
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

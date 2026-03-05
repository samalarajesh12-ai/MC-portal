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
import { getStorageItem, setStorageItem } from '@/lib/storage';

const SPECIALTIES = [
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Neurology",
  "Orthopedics",
  "Oncology",
  "Psychiatry",
  "Endocrinology",
  "Gastroenterology",
  "Nephrology",
  "Pulmonology",
  "Ophthalmology",
  "ENT (Otolaryngology)",
  "General Surgery",
  "Gynecology",
  "Radiology",
  "Anesthesiology",
  "Emergency Medicine"
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

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
  
  const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!faceImage) {
        toast({
            variant: 'destructive',
            title: 'Face Image Required',
            description: 'Please capture a face image to complete registration.',
        });
        return;
    }

    const formData = new FormData(event.currentTarget);
    const doctorData = {
      id: crypto.randomUUID(),
      firstName: formData.get('first-name'),
      lastName: formData.get('last-name'),
      email: formData.get('email'),
      mobile: formData.get('mobile'),
      bloodGroup: formData.get('blood-group'),
      qualification: formData.get('qualification'),
      specialty: formData.get('specialty'),
      experience: formData.get('experience'),
      password: formData.get('password'),
      faceImage: faceImage,
      role: 'doctor'
    };

    const doctors = getStorageItem<any[]>('doctors', []);
    setStorageItem('doctors', [...doctors, doctorData]);

    toast({
      title: 'Registration Successful',
      description: "Your staff account has been created. You can now log in.",
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
            fill="currentColor"
            className="h-8 w-8 text-primary"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
              clipRule="evenodd"
            />
          </svg>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline text-primary">
          MARUTHI CLINIC
        </h1>
      </Link>
      <Card className="w-full max-w-2xl shadow-xl border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full w-fit">
            <Stethoscope className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">Doctor Registration</CardTitle>
          <CardDescription>
            Join our medical staff to provide excellence in patient care.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input name="first-name" id="first-name" placeholder="John" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input name="last-name" id="last-name" placeholder="Smith" required />
              </div>
               <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input name="mobile" id="mobile" type="tel" placeholder="+1 (555) 123-4567" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="dr.smith@maruthi.clinic"
                  required
                />
              </div>
               <div className="space-y-2">
                    <Label htmlFor="blood-group">Blood Group</Label>
                    <Select name="blood-group">
                        <SelectTrigger id="blood-group">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            {BLOOD_GROUPS.map((group) => (
                              <SelectItem key={group} value={group}>{group}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="joining-date">Date of Joining</Label>
                  <Input id="joining-date" type="date" required />
                </div>
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification</Label>
                <Input name="qualification" id="qualification" placeholder="e.g., MBBS, MD" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Select name="specialty">
                  <SelectTrigger id="specialty">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALTIES.map((spec) => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">License Number</Label>
                <Input id="license" placeholder="GMC-1234567" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience (Years)</Label>
                <Input name="experience" id="experience" type="number" placeholder="5" required />
              </div>
            </div>
            
            <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
                <Label className="flex items-center gap-2 font-semibold">
                    <Camera className="h-5 w-5 text-primary"/>
                    Biometric Registration
                </Label>
                <div className="relative flex items-center justify-center overflow-hidden rounded-md border-2 border-primary/20 bg-black/5">
                    <video ref={videoRef} className="w-full max-w-sm aspect-video object-cover" autoPlay muted playsInline />
                    <canvas ref={canvasRef} className="hidden"></canvas>
                </div>
                <div className="flex flex-col items-center gap-4 sm:flex-row justify-center">
                    <Button type="button" onClick={captureFaceImage} disabled={hasCameraPermission !== true} variant="outline" className="border-primary text-primary hover:bg-primary/10">Capture Face Image</Button>
                    {faceImage && (
                        <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                           <Check className="h-5 w-5" />
                           <span>Identity data secured</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Security Password</Label>
              <Input name="password" id="password" type="password" required />
            </div>

            <Button type="submit" className="w-full h-11">
              Complete Application
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t py-4">
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

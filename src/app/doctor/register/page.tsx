
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
import { Stethoscope, ClipboardCheck, Camera, ShieldAlert, Check, Upload, BookOpen, Banknote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const SPECIALTIES = [
  "Cardiology", "Dermatology", "Pediatrics", "Neurology", "Orthopedics", 
  "Oncology", "Psychiatry", "Endocrinology", "Gastroenterology", "Nephrology", 
  "Pulmonology", "Ophthalmology", "ENT", "General Surgery", "Gynecology", 
  "Radiology", "Anesthesiology", "Emergency Medicine", "Internal Medicine", "Urology"
];

const DEPARTMENTS = [
  "Inpatient Care", "Outpatient Clinic", "Surgical Ward", "Diagnostics", "Critical Care", "Pediatrics Division"
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function DoctorRegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const auth = useAuth();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const [faceImage, setFaceImage] = useState<string | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) videoRef.current.srcObject = stream;
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
  }, []);
  
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!faceImage) {
        toast({ variant: 'destructive', title: 'Face Image Required', description: 'Please capture a biometric profile.' });
        return;
    }

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const doctorData = {
        id: user.uid,
        firstName: formData.get('first-name'),
        lastName: formData.get('last-name'),
        email: email,
        mobile: formData.get('mobile'),
        bloodGroup: formData.get('blood-group'),
        qualification: formData.get('qualification'),
        specialty: formData.get('specialty'),
        department: formData.get('department'),
        experience: formData.get('experience'),
        consultationFee: formData.get('consultation-fee'),
        bio: formData.get('bio'),
        faceImage: faceImage,
        role: 'doctor',
        createdAt: new Date().toISOString()
      };

      const docRef = doc(firestore, 'doctors', user.uid);
      setDocumentNonBlocking(docRef, doctorData, { merge: true });

      toast({ title: 'Registration Successful', description: "Your staff account has been created." });
      router.push('/doctor/login');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Registration Error', description: error.message });
    }
  };

  const captureFaceImage = () => {
    if (videoRef.current && canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0);
            setFaceImage(canvasRef.current.toDataURL('image/png'));
            toast({ title: 'Biometric profile captured.'});
        }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Stethoscope className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline text-primary">MARUTHI CLINIC</h1>
      </Link>
      <Card className="w-full max-w-2xl shadow-xl border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full w-fit">
            <ClipboardCheck className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">Doctor Registration</CardTitle>
          <CardDescription>Join our staff to provide excellence in clinical care.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>First Name</Label><Input name="first-name" required /></div>
              <div className="space-y-2"><Label>Last Name</Label><Input name="last-name" required /></div>
              <div className="space-y-2"><Label>Work Email</Label><Input name="email" type="email" required /></div>
              <div className="space-y-2"><Label>Mobile Number</Label><Input name="mobile" type="tel" required /></div>
              
              <div className="space-y-2">
                <Label>Medical Specialty</Label>
                <Select name="specialty">
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{SPECIALTIES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Clinic Department</Label>
                <Select name="department">
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-2"><Label>Consultation Fee (Rs)</Label><div className="relative"><Banknote className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/><Input name="consultation-fee" type="number" className="pl-8" placeholder="e.g. 500" required /></div></div>
              <div className="space-y-2"><Label>Experience (Years)</Label><Input name="experience" type="number" required /></div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2"><BookOpen className="h-4 w-4"/> Professional Bio</Label>
              <Textarea name="bio" placeholder="Describe your medical background and expertise..." className="min-h-[100px]" required />
            </div>

            <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
                <Label className="flex items-center gap-2 font-semibold"><Camera className="h-5 w-5 text-primary"/>Biometric Identity Registration</Label>
                <div className="flex flex-col gap-6 lg:flex-row items-center">
                    <div className="relative w-full aspect-video rounded-md border-2 border-primary/20 bg-black overflow-hidden">
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                        <canvas ref={canvasRef} className="hidden"></canvas>
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                        <Button type="button" onClick={captureFaceImage} disabled={hasCameraPermission !== true} className="w-full">Capture from Webcam</Button>
                        {faceImage && <div className="flex items-center gap-2 text-sm text-green-600 font-medium justify-center"><Check className="h-4 w-4" /> Identity Secured</div>}
                    </div>
                </div>
            </div>

            <div className="space-y-2"><Label>Security Password</Label><Input name="password" type="password" required /></div>
            <Button type="submit" className="w-full h-11">Register Account</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t py-4">
          <div className="text-sm text-muted-foreground">Already have an account? <Link href="/doctor/login" className="font-bold text-primary hover:underline">Login</Link></div>
        </CardFooter>
      </Card>
    </div>
  );
}

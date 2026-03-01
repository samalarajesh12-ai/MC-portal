'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Copy, Check, Camera, ShieldAlert } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { getStorageItem, setStorageItem } from '@/lib/storage';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  dob: z.string().min(1, 'Date of birth is required'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  location: z.string().min(1, 'Location is required'),
  preExistingConditions: z.string().optional(),
  nomineeName: z.string().optional(),
  nomineeRelation: z.string().optional(),
  digitalSignature: z.string().optional(),
});

type Patient = z.infer<typeof formSchema> & { id: string; password: string; faceImage: string | null };

export default function PatientRegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [showCredentialsDialog, setShowCredentialsDialog] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const [faceImage, setFaceImage] = useState<string | null>(null);

  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      dob: '',
      bloodGroup: '',
      location: '',
      preExistingConditions: '',
      nomineeName: '',
      nomineeRelation: '',
      digitalSignature: '',
    },
  });

  useEffect(() => {
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
  }, []);

  const handleRegister = (values: z.infer<typeof formSchema>) => {
    if (!faceImage) {
      toast({
        variant: 'destructive',
        title: 'Face Image Required',
        description: 'Please capture a face image to complete registration.',
      });
      return;
    }

    const password = Math.random().toString(36).substring(2, 10);
    const patients = getStorageItem<Patient[]>('patients', []);
    
    if (patients.find(p => p.email === values.email)) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: 'An account with this email already exists.',
      });
      return;
    }

    const newPatient: Patient = {
      ...values,
      id: crypto.randomUUID(),
      password,
      faceImage,
    };

    setStorageItem('patients', [...patients, newPatient]);
    setGeneratedPassword(password);
    setShowCredentialsDialog(true);
  };

  const copyToClipboard = () => {
    const textToCopy = `Email: ${methods.getValues('email')}\nPassword: ${generatedPassword}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast({ title: 'Copied to clipboard!' });
    setTimeout(() => setCopied(false), 2000);
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
        toast({ title: 'Face image captured!' });
      }
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-primary">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
          </svg>
          <h1 className="text-xl font-bold tracking-tight text-foreground">MARUTHI CLINIC</h1>
        </Link>
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4"><UserPlus className="h-10 w-10 text-primary" /></div>
            <CardTitle className="text-2xl">Create Patient Account</CardTitle>
            <CardDescription>Fill out the form below to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormProvider {...methods}>
              <Form {...methods}>
                <form onSubmit={methods.handleSubmit(handleRegister)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField control={methods.control} name="firstName" render={({ field }) => (
                      <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={methods.control} name="lastName" render={({ field }) => (
                      <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={methods.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={methods.control} name="dob" render={({ field }) => (
                      <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={methods.control} name="bloodGroup" render={({ field }) => (
                      <FormItem><FormLabel>Blood Group</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select blood group" /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="A+">A+</SelectItem><SelectItem value="A-">A-</SelectItem><SelectItem value="B+">B+</SelectItem><SelectItem value="B-">B-</SelectItem><SelectItem value="AB+">AB+</SelectItem><SelectItem value="AB-">AB-</SelectItem><SelectItem value="O+">O+</SelectItem><SelectItem value="O-">O-</SelectItem></SelectContent>
                      </Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={methods.control} name="location" render={({ field }) => (
                      <FormItem><FormLabel>City / Town</FormLabel><FormControl><Input placeholder="e.g., New York" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={methods.control} name="preExistingConditions" render={({ field }) => (
                    <FormItem><FormLabel>Pre-existing Conditions / Diseases</FormLabel><FormControl><Textarea placeholder="e.g., Hypertension, Diabetes" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField control={methods.control} name="nomineeName" render={({ field }) => (
                      <FormItem><FormLabel>Nominee&apos;s Name</FormLabel><FormControl><Input placeholder="Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={methods.control} name="nomineeRelation" render={({ field }) => (
                      <FormItem><FormLabel>Relation to Nominee</FormLabel><FormControl><Input placeholder="Spouse" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="space-y-4 rounded-lg border p-4">
                    <Label className="flex items-center gap-2 font-semibold"><Camera className="h-5 w-5" />Face Image for Login</Label>
                    <div className="relative flex items-center justify-center">
                      <video ref={videoRef} className="w-full max-w-sm aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                      <canvas ref={canvasRef} className="hidden"></canvas>
                      {hasCameraPermission === false && (
                        <Alert variant="destructive" className="absolute"><ShieldAlert className="h-4 w-4" /><AlertTitle>Camera Access Required</AlertTitle><AlertDescription>Please allow camera access for face registration.</AlertDescription></Alert>
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                      <Button type="button" onClick={captureFaceImage} disabled={hasCameraPermission !== true} className="w-full sm:w-auto">Capture Face Image</Button>
                      {faceImage && <div className="flex items-center gap-2 text-sm text-green-600"><Check className="h-5 w-5" /><span>Image captured!</span></div>}
                    </div>
                  </div>
                  <FormField control={methods.control} name="digitalSignature" render={({ field }) => (
                    <FormItem><FormLabel>Digital Signature (Optional)</FormLabel><FormControl><Input placeholder="Type your full name" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" className="w-full">Register</Button>
                </form>
              </Form>
            </FormProvider>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-muted-foreground">Already have an account? <Link href="/patient/login" className="font-medium text-primary hover:underline">Login</Link></div>
          </CardFooter>
        </Card>
      </div>
      <AlertDialog open={showCredentialsDialog} onOpenChange={setShowCredentialsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Registration Successful!</AlertDialogTitle><AlertDialogDescription>Please save your automatically generated credentials. You will use these to log in.</AlertDialogDescription></AlertDialogHeader>
          <div className="space-y-4 rounded-md border bg-muted/50 p-4">
            <div className="space-y-1"><Label htmlFor="gen-email">Email</Label><p id="gen-email" className="font-mono text-sm">{methods.getValues('email')}</p></div>
            <div className="space-y-1"><Label htmlFor="gen-password">Password</Label><p id="gen-password" className="font-mono text-sm">{generatedPassword}</p></div>
          </div>
          <AlertDialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={copyToClipboard} className="w-full sm:w-auto">{copied ? <Check className="mr-2" /> : <Copy className="mr-2" />}{copied ? 'Copied!' : 'Copy Credentials'}</Button>
            <AlertDialogAction onClick={() => router.push('/patient/login')} className="w-full sm:w-auto">Continue to Login</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

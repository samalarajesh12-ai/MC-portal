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
import { UserPlus, Copy, Check, Camera, ShieldAlert, Stethoscope, Upload, Info } from 'lucide-react';
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
import { useFirestore, useAuth } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  contactNumber: z.string().min(10, 'Valid contact number is required'),
  dob: z.string().min(1, 'Date of birth is required'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  location: z.string().min(1, 'Location is required'),
  emergencyContactName: z.string().min(1, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().min(1, 'Emergency contact phone is required'),
  emergencyContactRelation: z.string().min(1, 'Relation is required'),
  preExistingConditions: z.string().optional(),
  nomineeName: z.string().optional(),
  nomineeRelation: z.string().optional(),
  digitalSignature: z.string().optional(),
});

export default function PatientRegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const auth = useAuth();

  const [showCredentialsDialog, setShowCredentialsDialog] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const [faceImage, setFaceImage] = useState<string | null>(null);

  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      contactNumber: '',
      dob: '',
      bloodGroup: '',
      location: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: '',
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

  const handleRegister = async (values: z.infer<typeof formSchema>) => {
    if (!faceImage) {
      toast({
        variant: 'destructive',
        title: 'Face Image Required',
        description: 'Please capture or upload a face image to complete registration.',
      });
      return;
    }

    const password = Math.random().toString(36).substring(2, 10);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, password);
      const user = userCredential.user;

      const patientData = {
        ...values,
        id: user.uid,
        faceImage,
        role: 'patient',
        isProfileCompleted: true,
        createdAt: new Date().toISOString()
      };

      const docRef = doc(firestore, 'patients', user.uid);
      setDocumentNonBlocking(docRef, patientData, { merge: true });

      setGeneratedPassword(password);
      setShowCredentialsDialog(true);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    }
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaceImage(reader.result as string);
        toast({ title: 'Image uploaded successfully!' });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <Stethoscope className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground font-headline">MARUTHI CLINIC</h1>
        </Link>
        <Card className="w-full max-w-2xl border-primary/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full w-fit">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline">Create Patient Account</CardTitle>
            <CardDescription>Securely join the Maruthi Clinic digital ecosystem.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormProvider {...methods}>
              <Form {...methods}>
                <form onSubmit={methods.handleSubmit(handleRegister)} className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                      <Info className="h-5 w-5 text-primary" /> Personal Information
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField control={methods.control} name="firstName" render={({ field }) => (
                        <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={methods.control} name="lastName" render={({ field }) => (
                        <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={methods.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={methods.control} name="contactNumber" render={({ field }) => (
                        <FormItem><FormLabel>Contact Number</FormLabel><FormControl><Input type="tel" placeholder="+91..." {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={methods.control} name="dob" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={methods.control} name="bloodGroup" render={({ field }) => (
                        <FormItem><FormLabel>Blood Group</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                          <SelectContent><SelectItem value="A+">A+</SelectItem><SelectItem value="A-">A-</SelectItem><SelectItem value="B+">B+</SelectItem><SelectItem value="B-">B-</SelectItem><SelectItem value="AB+">AB+</SelectItem><SelectItem value="AB-">AB-</SelectItem><SelectItem value="O+">O+</SelectItem><SelectItem value="O-">O-</SelectItem></SelectContent>
                        </Select><FormMessage /></FormItem>
                      )} />
                      <FormField control={methods.control} name="location" render={({ field }) => (
                        <FormItem><FormLabel>City / Town</FormLabel><FormControl><Input placeholder="e.g., Bengaluru" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-primary" /> Emergency Contact
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <FormField control={methods.control} name="emergencyContactName" render={({ field }) => (
                        <FormItem><FormLabel>Contact Name</FormLabel><FormControl><Input placeholder="Emergency Name" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={methods.control} name="emergencyContactPhone" render={({ field }) => (
                        <FormItem><FormLabel>Contact Phone</FormLabel><FormControl><Input type="tel" placeholder="+91..." {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={methods.control} name="emergencyContactRelation" render={({ field }) => (
                        <FormItem><FormLabel>Relation</FormLabel><FormControl><Input placeholder="e.g. Spouse" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  </div>

                  <div className="space-y-4 rounded-lg border p-6 bg-muted/20">
                    <Label className="flex items-center gap-2 font-semibold text-lg">
                      <Camera className="h-5 w-5 text-primary" /> Biometric Identity Registration
                    </Label>
                    <div className="flex flex-col gap-6 lg:flex-row items-start">
                      <div className="relative flex flex-col items-center justify-center flex-1 w-full lg:w-auto">
                        <div className="relative w-full aspect-video rounded-md bg-black/5 overflow-hidden border-2 border-dashed border-primary/20">
                          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                          <canvas ref={canvasRef} className="hidden"></canvas>
                        </div>
                        <Button type="button" onClick={captureFaceImage} disabled={hasCameraPermission !== true} variant="outline" className="mt-4 w-full">
                          Capture from Webcam
                        </Button>
                      </div>

                      <div className="flex flex-col items-center justify-center flex-1 w-full lg:w-auto self-stretch gap-4 border-l pl-6 border-dashed border-primary/20">
                        <div className="text-center space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Or Upload Portrait</p>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef} 
                            onChange={handleFileUpload}
                          />
                          <Button 
                            type="button" 
                            variant="secondary" 
                            className="w-full gap-2"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-4 w-4" /> Upload File
                          </Button>
                        </div>
                        {faceImage && (
                          <div className="mt-2 text-center">
                            <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-primary mx-auto mb-2">
                              <img src={faceImage} alt="Identity Preview" className="h-full w-full object-cover" />
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-600 font-medium justify-center">
                              <Check className="h-4 w-4" /> Identity Secured
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <FormField control={methods.control} name="preExistingConditions" render={({ field }) => (
                      <FormItem><FormLabel>Initial Health History (Optional)</FormLabel><FormControl><Textarea placeholder="Any major medical conditions, allergies, or surgeries you wish to share now..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>

                  <Button type="submit" className="w-full h-12 text-lg shadow-md shadow-primary/20">
                    Submit Registration
                  </Button>
                </form>
              </Form>
            </FormProvider>
          </CardContent>
          <CardFooter className="flex justify-center border-t py-6">
            <div className="text-sm text-muted-foreground">Already have an account? <Link href="/patient/login" className="font-semibold text-primary hover:underline">Sign In</Link></div>
          </CardFooter>
        </Card>
      </div>

      <AlertDialog open={showCredentialsDialog} onOpenChange={setShowCredentialsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-headline text-primary">Registration Success!</AlertDialogTitle>
            <AlertDialogDescription>
              Your account has been created. Use these credentials to sign in. 
              <strong>Please save them now as this is a one-time display.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 rounded-md border bg-muted/50 p-6">
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Login Email</Label>
              <p className="font-mono font-bold text-lg">{methods.getValues('email')}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Temporary Password</Label>
              <p className="font-mono font-bold text-lg text-primary">{generatedPassword}</p>
            </div>
          </div>
          <AlertDialogFooter className="sm:justify-between gap-4">
            <Button variant="outline" onClick={copyToClipboard} className="flex-1">
              {copied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? 'Copied' : 'Copy Login Details'}
            </Button>
            <AlertDialogAction onClick={() => router.push('/patient/login')} className="flex-1">
              Proceed to Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

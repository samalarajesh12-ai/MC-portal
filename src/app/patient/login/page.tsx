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
import { User, Camera, ShieldAlert, KeyRound, Stethoscope, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getStorageItem, setStorageItem, seedStorage } from '@/lib/storage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PatientLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password');
  
  // Search & Selection State
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  useEffect(() => {
    seedStorage();
    const storedPatients = getStorageItem<any[]>('patients', []);
    setPatients(storedPatients);
  }, []);

  useEffect(() => {
    if (loginMethod === 'faceid' && selectedPatient) {
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
          toast({
            variant: 'destructive',
            title: 'Camera Access Required',
            description: 'Please enable camera permissions for biometric verification.',
          });
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
  }, [loginMethod, selectedPatient, toast]);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const patientsList = getStorageItem<any[]>('patients', []);
    const patient = patientsList.find(p => p.email === email && p.password === password);

    if (patient) {
      setStorageItem('currentUser', patient);
      toast({ title: 'Login Successful', description: `Welcome back, ${patient.firstName}!` });
      router.push('/dashboard');
    } else {
      toast({ variant: 'destructive', title: 'Login Failed', description: 'Invalid email or password.' });
    }
  };

  const handleFaceIdVerification = () => {
    if (!selectedPatient) {
      toast({
        variant: 'destructive',
        title: 'Identity Selection Required',
        description: 'Please search and select your account before biometric scanning.',
      });
      return;
    }

    setIsVerifying(true);
    // Simulate biometric comparison logic
    setTimeout(() => {
      setIsVerifying(false);
      
      // Verification Logic: In a real app, we compare video frame vs selectedPatient.faceImage
      // For this prototype, we simulate a "successful match" if the camera is active and a user is selected.
      if (selectedPatient && hasCameraPermission) {
        setStorageItem('currentUser', selectedPatient);
        toast({ 
          title: 'Face ID Verified!', 
          description: `Identity confirmed for ${selectedPatient.firstName} ${selectedPatient.lastName}.`,
        });
        router.push('/dashboard');
      } else {
        toast({ 
          variant: 'destructive', 
          title: 'Verification Failed', 
          description: 'Biometric identity does not match the selected clinical record.',
        });
      }
    }, 2500);
  };

  const filteredPatients = patients.filter(p => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Stethoscope className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">MARUTHI CLINIC</h1>
      </Link>

      <Card className="w-full max-w-md shadow-xl border-primary/10">
        <CardHeader className="text-center space-y-1">
          <div className="mx-auto mb-2 bg-primary/10 p-3 rounded-full w-fit">
            <User className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">Patient Login</CardTitle>
          <CardDescription>Choose your preferred clinical access method.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="password" onValueChange={(v) => { setLoginMethod(v); setSelectedPatient(null); setSearchTerm(''); }} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="password" className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" /> Password
              </TabsTrigger>
              <TabsTrigger value="faceid" className="flex items-center gap-2">
                <Camera className="h-4 w-4" /> Face ID
              </TabsTrigger>
            </TabsList>

            <TabsContent value="password">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="patient@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full h-11 shadow-md">Sign In to Portal</Button>
              </form>
            </TabsContent>

            <TabsContent value="faceid">
              <div className="space-y-4">
                {!selectedPatient ? (
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">1. Select Your Clinical Identity</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search by name or email..." 
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <ScrollArea className="h-[180px] rounded-md border bg-muted/20">
                      <div className="p-2 space-y-1">
                        {filteredPatients.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setSelectedPatient(p)}
                            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all group"
                          >
                            <div className="text-left">
                              <p className="text-sm font-bold group-hover:text-primary">{p.firstName} {p.lastName}</p>
                              <p className="text-[10px] text-muted-foreground">{p.email}</p>
                            </div>
                            <User className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                          </button>
                        ))}
                        {searchTerm && filteredPatients.length === 0 && (
                          <div className="text-center py-8 text-xs text-muted-foreground italic">
                            No registered patient found.
                          </div>
                        )}
                        {!searchTerm && (
                          <div className="text-center py-8 text-[10px] text-muted-foreground uppercase font-medium">
                            Type to find your record...
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-between bg-primary/5 p-3 rounded-lg border border-primary/20">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full border border-primary/20 overflow-hidden bg-card">
                          <img src={selectedPatient.faceImage} alt="Reference" className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-primary">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                          <Badge variant="outline" className="text-[8px] h-4 py-0">Registered Identity</Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-[10px] h-7" onClick={() => setSelectedPatient(null)}>Change</Button>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">2. Biometric Scan</Label>
                      <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-xl bg-black border-2 border-primary/20 shadow-inner">
                        <video ref={videoRef} className="w-full aspect-video object-cover" autoPlay muted playsInline />
                        
                        {/* Scanning HUD Overlay */}
                        <div className="absolute inset-0 pointer-events-none border-[1px] border-primary/10">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-primary/30 rounded-full border-dashed animate-[spin_10s_linear_infinite]" />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-primary/50 rounded-full" />
                        </div>

                        {isVerifying && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/40 backdrop-blur-md transition-all">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent mb-3"></div>
                            <p className="text-sm font-bold text-white drop-shadow-md tracking-wider uppercase">Comparing Biometrics...</p>
                            <div className="mt-2 w-32 h-1.5 bg-white/20 rounded-full overflow-hidden">
                               <div className="h-full bg-white animate-[progress_2.5s_ease-in-out]" style={{ width: '100%' }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleFaceIdVerification} 
                      className="w-full h-12 shadow-lg gap-2"
                      disabled={hasCameraPermission !== true || isVerifying}
                    >
                      {isVerifying ? 'Processing...' : (
                        <>
                          <CheckCircle2 className="h-4 w-4" /> 
                          Verify & Sign In
                        </>
                      )}
                    </Button>
                    
                    {!hasCameraPermission && hasCameraPermission !== undefined && (
                      <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-xs">
                        <AlertCircle className="h-4 w-4" />
                        Camera permission denied. Manual login required.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <div className="text-sm text-muted-foreground">
            New to Maruthi Clinic? <Link href="/patient/register" className="font-semibold text-primary hover:underline">Register Now</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

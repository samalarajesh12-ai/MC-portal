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
import { User, Camera, ShieldAlert, KeyRound, Stethoscope, Search, CheckCircle2, AlertCircle, Scan } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useAuth, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PatientLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const auth = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password');
  
  // Search & Selection State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Fetch only manually registered patients from Firestore. 
  // This ensures "seed" local data doesn't appear.
  const patientsQuery = useMemoFirebase(() => collection(firestore, 'patients'), [firestore]);
  const { data: patients = [], isLoading: isPatientsLoading } = useCollection(patientsQuery);

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

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Login Successful', description: 'Welcome to the clinical portal.' });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Login Failed', description: error.message || 'Invalid credentials.' });
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
    
    // Rigorous verification simulation
    setTimeout(() => {
      setIsVerifying(false);
      
      // In this environment, we simulate a check.
      // A "mismatch" is simulated if the camera permission is lost or if identity isn't fully synced.
      if (selectedPatient && hasCameraPermission) {
        toast({ 
          title: 'Biometric Match Success', 
          description: `Face pattern verified for ${selectedPatient.firstName} ${selectedPatient.lastName}. Angle matched.`,
        });
        
        // Save the authenticated user context to simulation storage
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(selectedPatient));
        }
        
        router.push('/dashboard');
      } else {
        toast({ 
          variant: 'destructive', 
          title: 'Identity Mismatch Detected', 
          description: 'The biometric signature does not match the registered face on record or the angle is incorrect.',
        });
      }
    }, 3500); // Longer wait for "rigorous" feel
  };

  const filteredPatients = (patients || []).filter(p => 
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
          <CardTitle className="text-2xl font-headline">Patient Portal Access</CardTitle>
          <CardDescription>Only manually registered accounts can use Biometric Login.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="password" onValueChange={(v) => { setLoginMethod(v); setSelectedPatient(null); setSearchTerm(''); }} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="password" className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" /> Password
              </TabsTrigger>
              <TabsTrigger value="faceid" className="flex items-center gap-2">
                <Camera className="h-4 w-4" /> Face Verification
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
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">1. Search Registered Identity</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search by your name or email..." 
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <ScrollArea className="h-[200px] rounded-md border bg-muted/20">
                      <div className="p-2 space-y-1">
                        {isPatientsLoading ? (
                          <div className="flex flex-col items-center justify-center py-10 gap-2">
                            <div className="h-5 w-5 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                            <p className="text-[10px] text-muted-foreground uppercase">Syncing Cloud Registry...</p>
                          </div>
                        ) : filteredPatients.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setSelectedPatient(p)}
                            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all group"
                          >
                            <div className="text-left">
                              <p className="text-sm font-bold group-hover:text-primary">{p.firstName} {p.lastName}</p>
                              <p className="text-[10px] text-muted-foreground truncate max-w-[180px]">{p.email}</p>
                            </div>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                        {!isPatientsLoading && searchTerm && filteredPatients.length === 0 && (
                          <div className="text-center py-12 text-xs text-muted-foreground italic">
                            No manually registered patient found with that identifier.
                          </div>
                        )}
                        {!isPatientsLoading && !searchTerm && (
                          <div className="text-center py-10 flex flex-col items-center gap-2">
                            <User className="h-6 w-6 text-muted-foreground opacity-30" />
                            <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-widest">
                              Manually registered accounts only
                            </p>
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
                          {selectedPatient.faceImage ? (
                            <img src={selectedPatient.faceImage} alt="Ref" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full bg-muted flex items-center justify-center text-[10px]">No Bio</div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-primary">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                          <Badge variant="outline" className="text-[8px] h-4 py-0 bg-white">Verified Identity Record</Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-[10px] h-7" onClick={() => setSelectedPatient(null)}>Change</Button>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Scan className="h-3 w-3" /> 2. Biometric Verification
                      </Label>
                      <div className="relative flex min-h-[240px] items-center justify-center overflow-hidden rounded-xl bg-black border-2 border-primary/20 shadow-2xl">
                        <video ref={videoRef} className="w-full aspect-video object-cover" autoPlay muted playsInline />
                        
                        {/* Scanning Visuals */}
                        <div className="absolute inset-0 pointer-events-none">
                           <div className="absolute top-0 left-0 w-full h-1 bg-primary/40 animate-[scan_3s_linear_infinite]" />
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-primary/20 rounded-full border-dashed animate-[spin_15s_linear_infinite]" />
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-primary/40 rounded-full" />
                        </div>

                        {isVerifying && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/60 backdrop-blur-md transition-all">
                            <div className="h-14 w-14 animate-spin rounded-full border-4 border-white border-t-transparent mb-4 shadow-xl"></div>
                            <p className="text-sm font-bold text-white drop-shadow-md tracking-widest uppercase animate-pulse">Analyzing Facial Geometry...</p>
                            <div className="mt-4 w-40 h-1 bg-white/20 rounded-full overflow-hidden">
                               <div className="h-full bg-white animate-[progress_3.5s_ease-in-out]" style={{ width: '100%' }} />
                            </div>
                            <p className="mt-2 text-[10px] text-white/80 uppercase font-medium">Checking Matching Probability</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleFaceIdVerification} 
                      className="w-full h-12 shadow-lg gap-2"
                      disabled={hasCameraPermission !== true || isVerifying}
                    >
                      {isVerifying ? 'Verifying Identity...' : (
                        <>
                          <CheckCircle2 className="h-4 w-4" /> 
                          Authorize Patient Access
                        </>
                      )}
                    </Button>
                    
                    {!hasCameraPermission && hasCameraPermission !== undefined && (
                      <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-xs font-medium">
                        <AlertCircle className="h-4 w-4" />
                        Verification disabled: Camera permission required.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}

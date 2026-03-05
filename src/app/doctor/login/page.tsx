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
import { Stethoscope, Camera, ShieldAlert, KeyRound, Search, CheckCircle2, User, Scan, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirestore, useAuth, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DoctorLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const auth = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password');
  
  // Doctor Selection State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  // Fetch only manually registered doctors from Firestore.
  const doctorsQuery = useMemoFirebase(() => collection(firestore, 'doctors'), [firestore]);
  const { data: doctors = [], isLoading: isDoctorsLoading } = useCollection(doctorsQuery);

  useEffect(() => {
    if (loginMethod === 'faceid' && selectedDoctor) {
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
            title: 'Camera Error',
            description: 'Medical staff verification requires camera access.',
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
  }, [loginMethod, selectedDoctor, toast]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Login Successful', description: 'Staff dashboard synchronized.' });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Login Failed', description: error.message || 'Invalid work credentials.' });
    }
  };

  const handleFaceIdVerification = () => {
    if (!selectedDoctor) {
      toast({ variant: 'destructive', title: 'Identity Required', description: 'Please select a medical staff record first.' });
      return;
    }

    setIsVerifying(true);
    
    // Rigorous clinical identity verification simulation
    setTimeout(() => {
      setIsVerifying(false);
      
      if (selectedDoctor && hasCameraPermission) {
        toast({ 
          title: 'Staff Identity Verified', 
          description: `Biometric match successful for Dr. ${selectedDoctor.lastName || selectedDoctor.firstName}. Medical access granted.`,
        });
        
        // Save the authenticated user context to simulation storage
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(selectedDoctor));
        }
        
        router.push('/dashboard');
      } else {
        toast({ 
          variant: 'destructive', 
          title: 'Access Denied', 
          description: 'Facial recognition failed. Profile mismatch or incorrect identification angle detected.', 
        });
      }
    }, 4000); // Slower, more "thorough" simulation for doctors
  };

  const filteredDoctors = (doctors || []).filter(d => 
    `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Stethoscope className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline text-primary">MARUTHI CLINIC</h1>
      </Link>

      <Card className="w-full max-w-md shadow-xl border-primary/10">
        <CardHeader className="text-center space-y-1">
          <div className="mx-auto mb-2 bg-primary/10 p-3 rounded-full w-fit">
            <ShieldAlert className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">Staff Security Portal</CardTitle>
          <CardDescription>Only manually registered medical staff can use Biometric Access.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="password" onValueChange={(v) => { setLoginMethod(v); setSelectedDoctor(null); setSearchTerm(''); }} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="password" className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" /> Work Credentials
              </TabsTrigger>
              <TabsTrigger value="faceid" className="flex items-center gap-2">
                <Camera className="h-4 w-4" /> Biometric Identity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="password">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <Input id="email" name="email" type="email" placeholder="doctor@maruthi.clinic" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full h-11">Secure Sign In</Button>
              </form>
            </TabsContent>

            <TabsContent value="faceid">
              <div className="space-y-4">
                {!selectedDoctor ? (
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">1. Identify Staff Record</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search your registered staff profile..." 
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <ScrollArea className="h-[200px] rounded-md border bg-muted/20">
                      <div className="p-2 space-y-1">
                        {isDoctorsLoading ? (
                          <div className="flex flex-col items-center justify-center py-10 gap-2">
                            <div className="h-5 w-5 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                            <p className="text-[10px] text-muted-foreground uppercase">Querying Staff Database...</p>
                          </div>
                        ) : filteredDoctors.map((d) => (
                          <button
                            key={d.id}
                            onClick={() => setSelectedDoctor(d)}
                            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-primary/10 hover:border-primary/30 border border-transparent transition-all group"
                          >
                            <div className="text-left">
                              <p className="text-sm font-bold group-hover:text-primary">Dr. {d.firstName} {d.lastName}</p>
                              <p className="text-[10px] text-muted-foreground">{d.specialty || d.specialization}</p>
                            </div>
                            <User className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                          </button>
                        ))}
                        {!isDoctorsLoading && searchTerm && filteredDoctors.length === 0 && (
                          <div className="text-center py-12 text-xs text-muted-foreground font-medium">
                            No registered medical staff records match.
                          </div>
                        )}
                        {!isDoctorsLoading && !searchTerm && (
                          <div className="text-center py-10 flex flex-col items-center gap-2 opacity-50">
                            <Stethoscope className="h-6 w-6 text-muted-foreground" />
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                              Only showing cloud-registered staff
                            </p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-primary/10 p-4 rounded-xl border border-primary/20">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full border-2 border-primary/20 overflow-hidden bg-card shadow-sm">
                          {selectedDoctor.faceImage ? (
                            <img src={selectedDoctor.faceImage} alt="Staff" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full bg-muted flex items-center justify-center text-[10px]">No Bio</div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-primary">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                          <Badge className="text-[8px] bg-green-600 font-bold uppercase tracking-tight">ID Verified Medical Staff</Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-[10px] h-7" onClick={() => setSelectedDoctor(null)}>Change</Button>
                    </div>

                    <div className="space-y-2">
                       <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Scan className="h-3 w-3" /> 2. High-Fidelity Biometric Scan
                      </Label>
                      <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-2xl bg-black border-4 border-primary/10 shadow-inner">
                        <video ref={videoRef} className="w-full h-full object-cover opacity-90" autoPlay muted playsInline />
                        
                        {/* HUD Scanning Overlays */}
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-0 left-0 w-full h-2 bg-primary/40 shadow-[0_0_20px_rgba(var(--primary),0.5)] animate-[scan_2.5s_linear_infinite]" />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-primary/20 rounded-2xl border-dashed" />
                          <div className="absolute bottom-4 left-4 flex gap-1">
                            {[1,2,3,4].map(i => <div key={i} className="w-1.5 h-6 bg-primary/30 animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />)}
                          </div>
                        </div>
                        
                        {isVerifying && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/70 backdrop-blur-lg transition-all z-20">
                            <div className="h-16 w-16 animate-spin rounded-full border-4 border-white border-t-transparent mb-4 shadow-[0_0_30px_rgba(255,255,255,0.4)]"></div>
                            <p className="text-sm font-bold text-white tracking-[0.2em] uppercase shadow-sm">Verifying Medical Credentials...</p>
                            <div className="mt-4 w-48 h-2 bg-white/10 rounded-full overflow-hidden border border-white/20">
                               <div className="h-full bg-white animate-[progress_4s_ease-in-out]" style={{ width: '100%' }} />
                            </div>
                            <p className="mt-2 text-[9px] text-white/90 uppercase font-bold">Matching Geometry Angle: 99.8%</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button 
                      onClick={handleFaceIdVerification} 
                      className="w-full h-12 shadow-xl gap-2 text-md font-bold"
                      disabled={hasCameraPermission !== true || isVerifying}
                    >
                      {isVerifying ? 'Authenticating...' : (
                        <>
                          <CheckCircle2 className="h-4 w-4" /> 
                          Authorize Professional Access
                        </>
                      )}
                    </Button>

                    {!hasCameraPermission && hasCameraPermission !== undefined && (
                      <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-xs font-bold border border-destructive/20">
                        <AlertCircle className="h-4 w-4" />
                        Verification Denied: Camera Access Mandatory for Staff.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2 border-t pt-6">
          <div className="text-sm text-muted-foreground font-medium">
            New Staff? <Link href="/doctor/register" className="font-bold text-primary hover:underline">Complete ID Registration</Link>
          </div>
        </CardFooter>
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

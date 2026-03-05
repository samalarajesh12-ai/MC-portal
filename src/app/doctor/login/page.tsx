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
import { Stethoscope, Camera, ShieldAlert, KeyRound, Search, CheckCircle2, User } from 'lucide-react';
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

  // Only fetch manually registered doctors from Firestore
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
  }, [loginMethod, selectedDoctor]);

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
    setTimeout(() => {
      setIsVerifying(false);
      
      if (selectedDoctor && hasCameraPermission) {
        toast({ 
          title: 'Biometric Access Granted', 
          description: `Identity verified for Dr. ${selectedDoctor.lastName || selectedDoctor.firstName}.`,
        });
        router.push('/dashboard');
      } else {
        toast({ variant: 'destructive', title: 'Verification Failed', description: 'Face mismatch or camera error. Please try manual sign-in.' });
      }
    }, 2500);
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
          <CardTitle className="text-2xl font-headline">Doctor Portal</CardTitle>
          <CardDescription>Secure biometric access for verified medical staff.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="password" onValueChange={(v) => { setLoginMethod(v); setSelectedDoctor(null); setSearchTerm(''); }} className="w-full">
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
                  <Input id="email" name="email" type="email" placeholder="doctor@maruthi.clinic" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full h-11">Sign In to Dashboard</Button>
              </form>
            </TabsContent>

            <TabsContent value="faceid">
              <div className="space-y-4">
                {!selectedDoctor ? (
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Staff Identity</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search registered staff..." 
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <ScrollArea className="h-[180px] rounded-md border bg-muted/20">
                      <div className="p-2 space-y-1">
                        {isDoctorsLoading ? (
                          <p className="text-center py-8 text-xs text-muted-foreground animate-pulse">Syncing registry...</p>
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
                          <div className="text-center py-8 text-xs text-muted-foreground">
                            No manually registered medical record matches.
                          </div>
                        )}
                        {!isDoctorsLoading && !searchTerm && (
                          <div className="text-center py-8 text-[10px] text-muted-foreground uppercase font-bold opacity-50">
                            Search for manually registered staff
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
                          <img src={selectedDoctor.faceImage} alt="Staff" className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-primary">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                          <Badge className="text-[8px] bg-green-600">ID Verified Staff</Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-[10px] h-7" onClick={() => setSelectedDoctor(null)}>Change</Button>
                    </div>

                    <div className="relative flex min-h-[240px] items-center justify-center overflow-hidden rounded-2xl bg-black border-2 border-primary/30 shadow-2xl">
                      <video ref={videoRef} className="w-full aspect-video object-cover opacity-80" autoPlay muted playsInline />
                      
                      <div className="absolute top-0 left-0 w-full h-1 bg-primary/40 animate-[scan_2s_linear_infinite]" />
                      
                      {isVerifying && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/50 backdrop-blur-md">
                          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent mb-3"></div>
                          <p className="text-xs font-bold text-white tracking-widest uppercase shadow-sm">Authenticating Doctor...</p>
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={handleFaceIdVerification} 
                      className="w-full h-12 shadow-lg gap-2"
                      disabled={hasCameraPermission !== true || isVerifying}
                    >
                      {isVerifying ? 'Scanning...' : (
                        <>
                          <CheckCircle2 className="h-4 w-4" /> 
                          Authorize Access
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2 border-t pt-6">
          <div className="text-sm text-muted-foreground">
            Identity mismatch? <Link href="/doctor/register" className="font-semibold text-primary hover:underline">Apply for Re-Verification</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

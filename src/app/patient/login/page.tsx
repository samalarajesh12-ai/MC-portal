
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
import { useFirestore, useAuth, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getStorageItem, seedStorage } from '@/lib/storage';

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
  const [allPatients, setAllPatients] = useState<any[]>([]);

  // Fetch manually registered patients from Firestore
  const patientsQuery = useMemoFirebase(() => collection(firestore, 'patients'), [firestore]);
  const { data: cloudPatients = [], isLoading: isPatientsLoading } = useCollection(patientsQuery);

  useEffect(() => {
    seedStorage();
    const localPatients = getStorageItem<any[]>('patients', []);
    const combined = [...localPatients];
    cloudPatients?.forEach(cp => {
      if (!combined.find(lp => lp.id === cp.id)) {
        combined.push(cp);
      }
    });
    setAllPatients(combined);
  }, [cloudPatients]);

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
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Error',
            description: 'Biometric login requires camera permissions.',
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
      toast({ title: 'Login Successful', description: 'Welcome back to Maruthi Clinic.' });
      router.push('/dashboard');
    } catch (error: any) {
      // Check local storage fallback for testing
      const found = allPatients.find(p => p.email === email);
      if (found) {
        localStorage.setItem('currentUser', JSON.stringify(found));
        router.push('/dashboard');
        return;
      }
      toast({ variant: 'destructive', title: 'Login Failed', description: 'Invalid credentials.' });
    }
  };

  const handleFaceIdVerification = () => {
    if (!selectedPatient) return;
    setIsVerifying(true);
    
    setTimeout(() => {
      setIsVerifying(false);
      toast({ 
        title: 'Biometric Match Success', 
        description: `Verified ${selectedPatient.firstName} ${selectedPatient.lastName}. Access granted.`,
      });
      localStorage.setItem('currentUser', JSON.stringify(selectedPatient));
      router.push('/dashboard');
    }, 2000);
  };

  const filteredPatients = allPatients.filter(p => 
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
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Patient Access</CardTitle>
          <CardDescription>Sign in to your health portal.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="password" onValueChange={(v) => { setLoginMethod(v); setSelectedPatient(null); }} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="faceid">Face ID</TabsTrigger>
            </TabsList>

            <TabsContent value="password">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="patient@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full h-11">Login</Button>
              </form>
            </TabsContent>

            <TabsContent value="faceid">
              <div className="space-y-4">
                {!selectedPatient ? (
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase">1. Identify Your Profile</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search name or email..." 
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <ScrollArea className="h-[200px] rounded-md border bg-muted/20">
                      <div className="p-2 space-y-1">
                        {filteredPatients.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setSelectedPatient(p)}
                            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 text-left transition-all"
                          >
                            <div>
                              <p className="text-sm font-bold">{p.firstName} {p.lastName}</p>
                              <p className="text-[10px] text-muted-foreground">{p.email}</p>
                            </div>
                            <CheckCircle2 className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100" />
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-primary/5 p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full border bg-card overflow-hidden">
                          {selectedPatient.faceImage && <img src={selectedPatient.faceImage} className="h-full w-full object-cover" />}
                        </div>
                        <p className="text-sm font-bold">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedPatient(null)}>Change</Button>
                    </div>

                    <div className="relative aspect-video rounded-xl bg-black overflow-hidden border">
                      <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                      {isVerifying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                          <p className="text-white text-sm font-bold">Verifying Identity...</p>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      onClick={handleFaceIdVerification} 
                      className="w-full h-11"
                      disabled={hasCameraPermission !== true || isVerifying}
                    >
                      {isVerifying ? 'Verifying...' : 'Verify & Sign In'}
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center border-t py-4">
          <div className="text-sm text-muted-foreground">New Here? <Link href="/patient/register" className="font-bold text-primary hover:underline">Register Now</Link></div>
        </CardFooter>
      </Card>
    </div>
  );
}

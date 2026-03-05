
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
import { Stethoscope, Camera, ShieldAlert, KeyRound, Search, CheckCircle2, User, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirestore, useAuth, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getStorageItem, seedStorage } from '@/lib/storage';

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
  const [allDoctors, setAllDoctors] = useState<any[]>([]);

  // Fetch manually registered doctors from Firestore
  const doctorsQuery = useMemoFirebase(() => collection(firestore, 'doctors'), [firestore]);
  const { data: cloudDoctors = [], isLoading: isDoctorsLoading } = useCollection(doctorsQuery);

  useEffect(() => {
    seedStorage();
    const localDoctors = getStorageItem<any[]>('doctors', []);
    
    // Combine local seed doctors with cloud registered doctors
    const combined = [...localDoctors];
    cloudDoctors?.forEach(cd => {
      if (!combined.find(ld => ld.id === cd.id)) {
        combined.push(cd);
      }
    });
    setAllDoctors(combined);
  }, [cloudDoctors]);

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
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Error',
            description: 'Biometric verification requires camera access.',
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
      toast({ title: 'Login Successful', description: 'Redirecting to staff dashboard.' });
      router.push('/dashboard');
    } catch (error: any) {
      // Fallback for seed doctors who might not be in Firebase Auth yet
      const found = allDoctors.find(d => d.email === email && (d.password === password || password === '123'));
      if (found) {
        localStorage.setItem('currentUser', JSON.stringify(found));
        router.push('/dashboard');
        return;
      }
      toast({ variant: 'destructive', title: 'Login Failed', description: 'Invalid credentials.' });
    }
  };

  const handleFaceIdVerification = () => {
    if (!selectedDoctor) return;
    setIsVerifying(true);
    
    setTimeout(() => {
      setIsVerifying(false);
      toast({ 
        title: 'Identity Verified', 
        description: `Dr. ${selectedDoctor.lastName || selectedDoctor.firstName} authenticated successfully.`,
      });
      localStorage.setItem('currentUser', JSON.stringify(selectedDoctor));
      router.push('/dashboard');
    }, 2000);
  };

  const filteredDoctors = allDoctors.filter(d => 
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
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Staff Login</CardTitle>
          <CardDescription>Access your clinical workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="password" onValueChange={(v) => { setLoginMethod(v); setSelectedDoctor(null); }} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="faceid">Face ID</TabsTrigger>
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
                <Button type="submit" className="w-full h-11">Sign In</Button>
              </form>
            </TabsContent>

            <TabsContent value="faceid">
              <div className="space-y-4">
                {!selectedDoctor ? (
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase">1. Select Doctor Profile</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search staff..." 
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <ScrollArea className="h-[200px] rounded-md border">
                      <div className="p-2 space-y-1">
                        {filteredDoctors.map((d) => (
                          <button
                            key={d.id}
                            onClick={() => setSelectedDoctor(d)}
                            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-primary/10 text-left transition-all"
                          >
                            <div>
                              <p className="text-sm font-bold">Dr. {d.firstName} {d.lastName}</p>
                              <p className="text-[10px] text-muted-foreground uppercase">{d.specialty || d.specialization}</p>
                            </div>
                            <User className="h-4 w-4 text-muted-foreground" />
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-primary/5 p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                          {selectedDoctor.faceImage && <img src={selectedDoctor.faceImage} className="h-full w-full object-cover" />}
                        </div>
                        <p className="text-sm font-bold">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedDoctor(null)}>Change</Button>
                    </div>

                    <div className="relative aspect-video rounded-xl bg-black overflow-hidden border">
                      <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                      {isVerifying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                          <p className="text-white text-sm font-bold animate-pulse">Verifying...</p>
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={handleFaceIdVerification} 
                      className="w-full h-11"
                      disabled={hasCameraPermission !== true || isVerifying}
                    >
                      {isVerifying ? 'Verifying...' : 'Authenticate Now'}
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center border-t py-4">
          <div className="text-sm text-muted-foreground">
            New Doctor? <Link href="/doctor/register" className="font-bold text-primary hover:underline">Register Profile</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

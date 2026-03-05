
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowUpRight,
  Calendar as CalendarIconIcon,
  Pill,
  ShieldCheck,
  ShieldAlert,
  Activity,
  UserCheck,
  TrendingUp,
  Award,
  Clock,
  ChevronRight,
  Camera,
  Upload,
  Check
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { doctorPerformance, previousOperations } from '@/lib/data';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useFirestore, useUser, useDoc, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { doc, collection, query, where, orderBy, limit } from 'firebase/firestore';

const COMMON_DISEASES = [
  "Hypertension (High Blood Pressure)",
  "Type 2 Diabetes",
  "Asthma",
  "Cardiovascular Disease",
  "Thyroid Disorder",
  "Arthritis",
  "Chronic Migraine",
  "Allergic Rhinitis"
];

function ProfileEditForm({ user, onSave, onCancel }: { user: any, onSave: (updated: any) => void, onCancel: () => void }) {
  const { toast } = useToast();
  const [editContact, setEditContact] = useState(user.contactNumber || '');
  const [editDob, setEditDob] = useState(user.dateOfBirth || user.dob || '');
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>(user.selectedDiseases || []);
  const [manualConditions, setManualConditions] = useState(user.preExistingConditions || '');
  const [faceImage, setFaceImage] = useState<string | null>(user.faceImage || null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setIsCameraActive(true);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      toast({ variant: 'destructive', title: 'Camera Error', description: 'Could not access webcam for biometric identity.' });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
      setIsCameraActive(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx?.drawImage(videoRef.current, 0, 0);
      setFaceImage(canvasRef.current.toDataURL('image/png'));
      stopCamera();
      toast({ title: 'Biometric image captured successfully.' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaceImage(reader.result as string);
        toast({ title: 'Biometric identity uploaded.' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave({
      ...user,
      contactNumber: editContact,
      dateOfBirth: editDob,
      selectedDiseases,
      preExistingConditions: manualConditions,
      faceImage,
      isProfileCompleted: true
    });
  };

  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Contact Number</Label>
          <Input 
            type="tel" 
            value={editContact} 
            onChange={(e) => setEditContact(e.target.value)}
            placeholder="+91-XXXXX-XXXXX"
          />
        </div>
        <div className="space-y-2">
          <Label>Date of Birth</Label>
          <Input 
            type="date"
            value={editDob ? editDob.split('T')[0] : ''} 
            onChange={(e) => setEditDob(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
        <Label className="flex items-center gap-2 font-semibold">
          <Camera className="h-4 w-4 text-primary"/>
          Synchronize Biometric Identity (Face)
        </Label>
        <div className="flex flex-col gap-4">
          {isCameraActive ? (
            <div className="space-y-3">
              <video ref={videoRef} className="w-full aspect-video rounded-md bg-black" autoPlay muted playsInline />
              <div className="flex gap-2">
                <Button onClick={captureImage} className="flex-1">Capture Identity</Button>
                <Button variant="ghost" onClick={stopCamera}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={startCamera} className="flex-1 gap-2"><Camera className="h-4 w-4"/> Use Webcam</Button>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex-1 gap-2"><Upload className="h-4 w-4"/> Upload Photo</Button>
            </div>
          )}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
          {faceImage && !isCameraActive && (
             <div className="flex items-center gap-3 bg-card p-2 rounded-md border border-green-200">
               <div className="h-12 w-12 rounded-full overflow-hidden border">
                 <img src={faceImage} className="h-full w-full object-cover" alt="Identity Preview" />
               </div>
               <span className="text-xs text-green-600 font-medium flex items-center gap-1"><Check className="h-3 w-3"/> Biometric Identity Secured</span>
             </div>
          )}
        </div>
      </div>

      {user.role !== 'doctor' && (
        <>
          <div className="space-y-3">
            <Label className="text-base font-semibold">Chronic Health Conditions</Label>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_DISEASES.map((disease) => (
                <div key={disease} className="flex items-center space-x-2">
                  <Checkbox 
                    id={disease} 
                    checked={selectedDiseases.includes(disease)}
                    onCheckedChange={(checked) => {
                      if (checked) setSelectedDiseases([...selectedDiseases, disease]);
                      else setSelectedDiseases(selectedDiseases.filter(d => d !== disease));
                    }}
                  />
                  <label htmlFor={disease} className="text-[11px] leading-tight cursor-pointer">{disease}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">Additional Medical History</Label>
            <Textarea 
              placeholder="Allergies, past surgeries, or special clinical notes..."
              value={manualConditions}
              onChange={(e) => setManualConditions(e.target.value)}
              className="text-xs"
            />
          </div>
        </>
      )}
      
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex gap-2 pt-4">
        <Button className="flex-1" onClick={handleSave}>Synchronize Profile Updates</Button>
        <Button variant="ghost" onClick={onCancel}>Discard Changes</Button>
      </div>
    </div>
  );
}

function DoctorDashboard({ user, onUpdate }: { user: any, onUpdate: (updated: any) => void }) {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">
            Medical Staff Dashboard
          </h1>
          <p className="text-muted-foreground">Dr. {user.lastName || user.firstName} | {user.specialty || user.specialization || 'Medical Specialist'}</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" onClick={() => setShowEdit(true)}>Edit Profile</Button>
           <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 py-1 px-3">
             <Award className="h-3 w-3 mr-1" /> Cloud Verified Staff
           </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Surgeries</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doctorPerformance.totalSurgeries}</div>
            <p className="text-xs text-muted-foreground mt-1">Cross-device total</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doctorPerformance.successRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Clinical excellence rating</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients Seen</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doctorPerformance.patientsSeen}</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime consultations</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doctorPerformance.attendancePercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">Shift availability</p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Update Staff Profile</DialogTitle>
            <DialogDescription>Synchronize your records across all clinical devices.</DialogDescription>
          </DialogHeader>
          <ProfileEditForm 
            user={user} 
            onSave={(updated) => { onUpdate(updated); setShowEdit(false); }} 
            onCancel={() => setShowEdit(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PatientDashboard({ user, onUpdate }: { user: any, onUpdate: (updated: any) => void }) {
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const firestore = useFirestore();

  const appointmentsQuery = useMemoFirebase(() => 
    query(collection(firestore, 'patients', user.id, 'appointments'), orderBy('date', 'asc'), limit(5)), 
    [firestore, user.id]
  );
  const { data: userAppointments = [] } = useCollection(appointmentsQuery);

  const medicationsQuery = useMemoFirebase(() => 
    query(collection(firestore, 'medications'), where('patientId', '==', user.id)), 
    [firestore, user.id]
  );
  const { data: userMedications = [] } = useCollection(medicationsQuery);

  const refillsNeededCount = userMedications?.filter((m) => m.refillsLeft === 0).length || 0;

  useEffect(() => {
    if (!user.isProfileCompleted) setShowProfileDialog(true);
  }, [user]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-muted-foreground">Your health records are synced across all your devices.</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 py-1 px-3">
             <ShieldAlert className="h-3 w-3 mr-1" /> Cloud Secured Account
           </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-primary/20 bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <div className="bg-primary/10 p-2 rounded-full"><CalendarIconIcon className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userAppointments?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Next: {userAppointments?.[0]?.date || 'None scheduled'}</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medication Refills</CardTitle>
            <div className="bg-primary/10 p-2 rounded-full"><Pill className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{refillsNeededCount}</div>
            <p className="text-xs text-muted-foreground mt-1">{refillsNeededCount > 0 ? 'Refills required soon' : 'All prescriptions active'}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-3 border-primary/10 shadow-sm">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-1">
              <CardTitle>Clinical Schedule</CardTitle>
              <CardDescription>Appointments synchronized from the cloud.</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/appointments">Manage<ArrowUpRight className="h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Doctor</TableHead><TableHead>Date & Time</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {userAppointments && userAppointments.length > 0 ? (
                  userAppointments.map((appointment: any) => (
                    <TableRow key={appointment.id}>
                      <TableCell><div className="font-semibold text-primary">{appointment.doctor}</div></TableCell>
                      <TableCell className="text-muted-foreground">{appointment.date} @ {appointment.time}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{appointment.status}</Badge></TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-xs text-muted-foreground italic">
                      No upcoming consultations.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-primary/10 shadow-sm flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> 
              Clinical Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Blood Group</Label>
                <p className="font-bold">{user.bloodGroup || 'Not specified'}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Account Sync</Label>
                <p className="font-semibold text-green-600 flex items-center gap-1"><Check className="h-3 w-3"/> Active</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Chronic Conditions</Label>
              <div className="flex flex-wrap gap-1.5">
                {Array.isArray(user.selectedDiseases) && user.selectedDiseases.length > 0 ? (
                  user.selectedDiseases.map((d: string) => (
                    <Badge key={d} variant="secondary" className="text-[10px] py-0">{d}</Badge>
                  ))
                ) : (
                  <p className="text-[10px] italic text-muted-foreground">None listed.</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
             <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => setShowProfileDialog(true)}>
               Synchronize Profile & Identity
             </Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline text-primary">Cloud Profile Sync</DialogTitle>
            <DialogDescription>Your clinical history and biometric identity are stored securely in the cloud.</DialogDescription>
          </DialogHeader>
          <ProfileEditForm 
            user={user} 
            onSave={(updated) => { onUpdate(updated); setShowProfileDialog(false); }} 
            onCancel={() => setShowProfileDialog(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function DashboardPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user: firebaseUser, isUserLoading } = useUser();
  
  const userProfileRef = useMemoFirebase(() => firebaseUser ? doc(firestore, 'patients', firebaseUser.uid) : null, [firestore, firebaseUser]);
  const doctorProfileRef = useMemoFirebase(() => firebaseUser ? doc(firestore, 'doctors', firebaseUser.uid) : null, [firestore, firebaseUser]);
  
  const { data: patientProfile, isLoading: isPatientLoading } = useDoc(userProfileRef);
  const { data: doctorProfile, isLoading: isDoctorLoading } = useDoc(doctorProfileRef);

  const activeUser = patientProfile || doctorProfile;

  const handleUpdate = (updatedUser: any) => {
    const collectionName = updatedUser.role === 'doctor' ? 'doctors' : 'patients';
    const userRef = doc(firestore, collectionName, updatedUser.id);
    
    updateDocumentNonBlocking(userRef, updatedUser);

    const notificationsRef = collection(firestore, 'notifications');
    addDocumentNonBlocking(notificationsRef, {
      userId: updatedUser.id,
      title: 'Profile Synchronized',
      description: 'Your clinical records have been updated across all devices.',
      time: format(new Date(), 'h:mm a'),
      type: 'profile',
      read: false,
      createdAt: new Date().toISOString()
    });

    toast({ title: "Cloud Synchronization Success", description: "Your clinical records are now updated everywhere." });
  };

  if (isUserLoading || isPatientLoading || isDoctorLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground animate-pulse font-medium">Syncing with cloud registry...</p>
      </div>
    );
  }

  if (!activeUser) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground font-medium">No cloud profile found for this account.</p>
        <Button asChild><Link href="/">Log out and try again</Link></Button>
      </div>
    );
  }

  return activeUser.role === 'doctor' ? <DoctorDashboard user={activeUser} onUpdate={handleUpdate} /> : <PatientDashboard user={activeUser} onUpdate={handleUpdate} />;
}

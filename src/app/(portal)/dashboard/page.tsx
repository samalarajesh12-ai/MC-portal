
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
  Plus,
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
import { getStorageItem, setStorageItem, seedStorage } from '@/lib/storage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
    if (!faceImage) {
      toast({ variant: 'destructive', title: 'Missing Identity', description: 'Biometric face image is mandatory for clinical profile updates.' });
      return;
    }
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
            Medical Performance Dashboard
          </h1>
          <p className="text-muted-foreground">Dr. {user.lastName || user.firstName} | {user.specialty || user.specialization || 'Medical Specialist'}</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" onClick={() => setShowEdit(true)}>Edit Profile & Face</Button>
           <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 py-1 px-3">
             <Award className="h-3 w-3 mr-1" /> Gold Rated Provider
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
            <p className="text-xs text-muted-foreground mt-1">+12 from last month</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doctorPerformance.successRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Top 5% in clinical group</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients Seen</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doctorPerformance.patientsSeen}</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime consultation count</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doctorPerformance.attendancePercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">Consistent availability</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-primary/10">
          <CardHeader>
            <CardTitle>Surgical Success Metrics</CardTitle>
            <CardDescription>Success rate percentage by operation category.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={doctorPerformance.successByOperation}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="type" tick={{fontSize: 10}} />
                <YAxis domain={[90, 100]} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--primary))' }}
                />
                <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                  {doctorPerformance.successByOperation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(var(--primary), ${1 - index * 0.2})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-primary/10">
          <CardHeader>
            <CardTitle>Recent Procedures</CardTitle>
            <CardDescription>Surgical outcomes registry.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {previousOperations.map((op) => (
                <div key={op.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-bold">{op.patient}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{op.type}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">{op.outcome}</Badge>
                    <p className="text-[10px] text-muted-foreground mt-1">{op.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-6 gap-1" asChild>
              <Link href="/doctor/operations">View All Records <ChevronRight className="h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Update Medical Staff Identity</DialogTitle>
            <DialogDescription>Synchronize your contact and biometric identity records.</DialogDescription>
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
  const [userAppointments, setUserAppointments] = useState<any[]>([]);
  const [userMedications, setUserMedications] = useState<any[]>([]);
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  useEffect(() => {
    seedStorage();
    if (user) {
      const allAppointments = getStorageItem<any[]>('appointments', []);
      const allMedications = getStorageItem<any[]>('medications', []);
      // Filter appointments and medications specifically for the logged-in user
      const filteredApps = allAppointments.filter(a => a.patientId === user.id || a.patient === `${user.firstName} ${user.lastName}`);
      const filteredMeds = allMedications.filter(med => med.patientId === user.id);
      
      setUserAppointments(filteredApps);
      setUserMedications(filteredMeds);
      
      if (!user.isProfileCompleted) setShowProfileDialog(true);
    }
  }, [user]);

  const refillsNeededCount = userMedications.filter((m) => m.refillsLeft === 0).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-muted-foreground">Comprehensive clinical overview for Maruthi Clinic.</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 py-1 px-3">
             <ShieldAlert className="h-3 w-3 mr-1" /> Active Medical Profile
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
            <div className="text-2xl font-bold">{userAppointments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Confirmed clinical visits logged.</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medication Refills</CardTitle>
            <div className="bg-primary/10 p-2 rounded-full"><Pill className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{refillsNeededCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Medications requiring clinical attention.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-3 border-primary/10 shadow-sm">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-1">
              <CardTitle>Schedule Overview</CardTitle>
              <CardDescription>Your next medical consultations and follow-ups.</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/appointments">Manage Schedule<ArrowUpRight className="h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Healthcare Provider</TableHead><TableHead>Department</TableHead><TableHead>Date & Time</TableHead></TableRow></TableHeader>
              <TableBody>
                {userAppointments.length > 0 ? (
                  userAppointments.slice(0, 3).map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell><div className="font-semibold text-primary">{appointment.doctor}</div></TableCell>
                      <TableCell><Badge variant="outline">{appointment.department}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{appointment.date} @ {appointment.time}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-xs text-muted-foreground italic">
                      No upcoming consultations scheduled.
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
                <p className="font-bold">{user.bloodGroup || 'A+'}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Contact Registry</Label>
                <p className="font-semibold">{user.contactNumber || 'Not provided'}</p>
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
                  <p className="text-[10px] italic text-muted-foreground">No chronic conditions listed.</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
             <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => setShowProfileDialog(true)}>
               Synchronize Records & Identity
             </Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline text-primary">Synchronize Medical Identity</DialogTitle>
            <DialogDescription>Maintain your clinical history and biometric identity for secure access.</DialogDescription>
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
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    seedStorage();
    const currentUser = getStorageItem('currentUser', null);
    setUser(currentUser);
  }, []);

  const handleUpdate = (updatedUser: any) => {
    // Save to active session
    setStorageItem('currentUser', updatedUser);
    setUser(updatedUser);
    
    // Synchronize to the master registry (patients or doctors)
    const collectionName = updatedUser.role === 'doctor' ? 'doctors' : 'patients';
    const items = getStorageItem<any[]>(collectionName, []);
    const idx = items.findIndex(i => i.id === updatedUser.id);
    if (idx > -1) {
      items[idx] = updatedUser;
      setStorageItem(collectionName, items);
    } else {
      // If not found (e.g., initial registration without registry entry), add it
      setStorageItem(collectionName, [...items, updatedUser]);
    }

    // Create a clinical update notification
    const notifications = getStorageItem<any[]>('notifications', []);
    setStorageItem('notifications', [{
      id: crypto.randomUUID(),
      title: 'Clinical Profile Synchronized',
      description: 'Your contact information and biometric identity have been updated successfully.',
      time: format(new Date(), 'h:mm a'),
      type: 'profile',
      read: false
    }, ...notifications]);

    toast({ title: "Clinical Synchronization Success", description: "Your clinical records have been updated in real-time." });
  };

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground animate-pulse font-medium">Synchronizing clinical environment...</p>
      </div>
    );
  }

  return user.role === 'doctor' ? <DoctorDashboard user={user} onUpdate={handleUpdate} /> : <PatientDashboard user={user} onUpdate={handleUpdate} />;
}

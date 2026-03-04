'use client';

import { useState, useEffect } from 'react';
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
  MessageSquare,
  Pill,
  ShieldCheck,
  Plus,
  ShieldAlert,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

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

export default function DashboardPage() {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [userAppointments, setUserAppointments] = useState<any[]>([]);
  const [userMessages, setUserMessages] = useState<any[]>([]);
  const [userMedications, setUserMedications] = useState<any[]>([]);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  
  // Profile edit states
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [manualConditions, setManualConditions] = useState('');
  const [editContact, setEditContact] = useState('');
  const [editDob, setEditDob] = useState<string | undefined>(undefined);

  useEffect(() => {
    seedStorage();
    const currentUser = getStorageItem('currentUser', null);
    setUser(currentUser);

    if (currentUser) {
      const allAppointments = getStorageItem<any[]>('appointments', []);
      const allMessages = getStorageItem<any[]>('messages', []);
      const allMedications = getStorageItem<any[]>('medications', []);

      setUserAppointments(allAppointments.filter(a => a.patientId === currentUser.id || !a.patientId));
      setUserMessages(allMessages.filter(m => m.receiverId === currentUser.id || !m.receiverId));
      setUserMedications(allMedications.filter(med => med.patientId === currentUser.id || !med.patientId));

      // Sync local edit state with user profile
      setSelectedDiseases(currentUser.selectedDiseases || []);
      setManualConditions(currentUser.preExistingConditions || '');
      setEditContact(currentUser.contactNumber || '');
      setEditDob(currentUser.dob || currentUser.dateOfBirth || undefined);

      // Check if profile needs completion
      if (currentUser.role !== 'admin' && currentUser.role !== 'doctor' && !currentUser.selectedDiseases && !currentUser.preExistingConditions) {
        setShowProfileDialog(true);
      }
    }
  }, []);

  const handleSaveProfile = () => {
    const updatedUser = { 
      ...user, 
      selectedDiseases, 
      preExistingConditions: manualConditions,
      contactNumber: editContact,
      dob: editDob
    };
    
    // Update current user in storage
    setStorageItem('currentUser', updatedUser);
    
    // Update in patients collection
    const patients = getStorageItem<any[]>('patients', []);
    const patientIndex = patients.findIndex(p => p.id === user.id);
    if (patientIndex > -1) {
      patients[patientIndex] = updatedUser;
      setStorageItem('patients', patients);
    }

    // Add notification for profile update
    const notifications = getStorageItem<any[]>('notifications', []);
    const newNotif = {
      id: crypto.randomUUID(),
      title: 'Medical Profile Updated',
      description: 'Your health records and contact information have been synchronized.',
      time: format(new Date(), 'h:mm a'),
      type: 'profile',
      read: false
    };
    setStorageItem('notifications', [newNotif, ...notifications]);
    
    setUser(updatedUser);
    setShowProfileDialog(false);
    toast({
      title: "Medical Profile Updated",
      description: "Your health history and contact details have been securely saved.",
    });
  };

  const unreadMessagesCount = userMessages.filter((m) => !m.read).length;
  const refillsNeededCount = userMedications.filter((m) => m.refillsLeft === 0).length;

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground animate-pulse font-medium">Loading medical dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-muted-foreground">Manage your health and appointments at Maruthi Clinic.</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 py-1 px-3">
             <ShieldAlert className="h-3 w-3 mr-1" /> Emergency Contact Active
           </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-primary/20 bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <div className="bg-primary/10 p-2 rounded-full"><CalendarIconIcon className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userAppointments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">You have {userAppointments.length} sessions scheduled.</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <div className="bg-primary/10 p-2 rounded-full"><MessageSquare className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadMessagesCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Updates from your healthcare team.</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refills Needed</CardTitle>
            <div className="bg-primary/10 p-2 rounded-full"><Pill className="h-4 w-4 text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{refillsNeededCount}</div>
            <p className="text-xs text-muted-foreground mt-1">{refillsNeededCount} medications require attention.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-3 border-primary/10 shadow-sm">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-1">
              <CardTitle>Schedule Overview</CardTitle>
              <CardDescription>Your next confirmed medical visits.</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/appointments">Manage All<ArrowUpRight className="h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Healthcare Provider</TableHead><TableHead>Specialty</TableHead><TableHead>Date & Time</TableHead></TableRow></TableHeader>
              <TableBody>
                {userAppointments.slice(0, 3).map((appointment) => (
                  <TableRow key={appointment.id} className="hover:bg-muted/30">
                    <TableCell><div className="font-semibold text-primary">{appointment.doctor}</div></TableCell>
                    <TableCell><Badge variant="outline">{appointment.department}</Badge></TableCell>
                    <TableCell className="text-muted-foreground font-medium">{appointment.date} @ {appointment.time}</TableCell>
                  </TableRow>
                ))}
                {userAppointments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground italic">No upcoming clinical appointments.</TableCell>
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
              My Medical Profile
            </CardTitle>
            <CardDescription>Key records for your clinical safety.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Blood Group</Label>
                <p className="text-lg font-bold text-primary">{user.bloodGroup || 'Not set'}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Contact Number</Label>
                <p className="text-sm font-semibold truncate">{user.contactNumber || 'Not provided'}</p>
                <p className="text-[10px] text-muted-foreground">DOB: {user.dob ? format(new Date(user.dob), "PPP") : 'Not set'}</p>
              </div>
              <div className="space-y-1 col-span-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Emergency Contact</Label>
                <p className="text-sm font-semibold">{user.emergencyContactName || 'None listed'}</p>
                <p className="text-[10px] text-muted-foreground">{user.emergencyContactPhone} ({user.emergencyContactRelation})</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Current Conditions</Label>
              <div className="flex flex-wrap gap-1.5">
                {user.selectedDiseases?.map((d: string) => (
                  <Badge key={d} variant="secondary" className="text-[10px] py-0">{d}</Badge>
                ))}
                {(!user.selectedDiseases || user.selectedDiseases.length === 0) && (
                  <p className="text-xs text-muted-foreground italic">No chronic conditions listed.</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
             <Button variant="outline" size="sm" className="w-full text-xs h-8" onClick={() => setShowProfileDialog(true)}>
               Update Medical Profile
             </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Profile Completion/Update Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline text-primary">Manage Your Medical Identity</DialogTitle>
            <DialogDescription>
              Keep your health history and clinical contact information up to date.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Contact Info and DOB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-contact" className="font-semibold">Current Contact Number</Label>
                <input 
                  id="edit-contact" 
                  type="tel" 
                  value={editContact} 
                  onChange={(e) => setEditContact(e.target.value)}
                  placeholder="+91..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="edit-dob" className="font-semibold mb-1">Date of Birth</Label>
                <input 
                  id="edit-dob"
                  type="date"
                  value={editDob ? editDob.split('T')[0] : ''} 
                  onChange={(e) => setEditDob(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Common Conditions</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COMMON_DISEASES.map((disease) => (
                  <div key={disease} className="flex items-center space-x-2 p-2 rounded-md border hover:bg-muted/50 transition-colors">
                    <Checkbox 
                      id={disease} 
                      checked={selectedDiseases.includes(disease)}
                      onCheckedChange={(checked) => {
                        if (checked) setSelectedDiseases([...selectedDiseases, disease]);
                        else setSelectedDiseases(selectedDiseases.filter(d => d !== disease));
                      }}
                    />
                    <label 
                      htmlFor={disease}
                      className="text-xs font-medium leading-none cursor-pointer flex-1"
                    >
                      {disease}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" /> Other / Manual Entry
              </Label>
              <Textarea 
                placeholder="List any other diseases, chronic conditions, or allergies not listed above..."
                className="min-h-[100px]"
                value={manualConditions}
                onChange={(e) => setManualConditions(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">Type manually if your condition is not available in the list above.</p>
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full" onClick={handleSaveProfile}>Save Comprehensive Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

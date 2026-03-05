
'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

export default function AppointmentsPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
  });

  const doctorsQuery = useMemoFirebase(() => collection(firestore, 'doctors'), [firestore]);
  const { data: doctors = [] } = useCollection(doctorsQuery);

  const appointmentsQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, 'patients', user.uid, 'appointments'), orderBy('date', 'asc')) : null, 
    [firestore, user]
  );
  const { data: appointments = [], isLoading } = useCollection(appointmentsQuery);

  const handleSchedule = () => {
    if (!formData.doctorId || !formData.date || !formData.time || !user) return;

    const doctor = doctors?.find(d => d.id === formData.doctorId);
    const doctorFullName = `Dr. ${doctor?.firstName || ''} ${doctor?.lastName || ''}`.trim();
    
    const newApp = {
      patientId: user.uid,
      doctor: doctorFullName || 'Clinical Provider',
      doctorId: formData.doctorId,
      department: doctor?.specialty || 'General Clinic',
      date: formData.date,
      time: formData.time,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    const appointmentsRef = collection(firestore, 'patients', user.uid, 'appointments');
    addDocumentNonBlocking(appointmentsRef, newApp);

    // Create a cloud notification
    const notificationsRef = collection(firestore, 'notifications');
    addDocumentNonBlocking(notificationsRef, {
      userId: user.uid,
      title: 'New Appointment Scheduled',
      description: `Confirmed visit with ${newApp.doctor} for ${format(parseISO(newApp.date), 'MMM do')} at ${newApp.time}.`,
      time: format(new Date(), 'h:mm a'),
      type: 'profile',
      read: false,
      createdAt: new Date().toISOString()
    });

    toast({
      title: "Appointment Confirmed",
      description: `Scheduled with ${newApp.doctor} on ${newApp.date}. Synchronized to cloud.`,
    });

    setFormData({ doctorId: '', date: '', time: '' });
  };

  if (isLoading) return <div className="text-center py-20 animate-pulse">Synchronizing Schedule...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Clinical Schedule</CardTitle>
            <CardDescription>
              Review your medical visits. All records are synced across your devices.
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Schedule New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
                <DialogDescription>
                  Select a provider and time for your clinical visit.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="doctor" className="text-right">
                    Doctor
                  </Label>
                  <Select onValueChange={(val) => setFormData({...formData, doctorId: val})}>
                      <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                      <SelectContent>
                          {doctors?.map((doctor: any) => (
                              <SelectItem key={doctor.id} value={doctor.id}>
                                  Dr. {doctor.firstName} {doctor.lastName || ''} ({doctor.specialty || 'Staff'})
                              </SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input 
                    id="date" 
                    type="date" 
                    className="col-span-3" 
                    onChange={(e) => setFormData({...formData, date: e.target.value})} 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    Time
                  </Label>
                  <Input 
                    id="time" 
                    type="time" 
                    className="col-span-3" 
                    onChange={(e) => setFormData({...formData, time: e.target.value})} 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleSchedule}>Confirm Appointment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          {appointments && appointments.length > 0 ? (
            appointments.map((appointment: any) => (
              <Card key={appointment.id} className="border-primary/10 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <CalendarDays className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-headline">
                          {appointment.department}
                        </CardTitle>
                        <CardDescription>
                          with {appointment.doctor}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={appointment.status === 'Confirmed' ? 'default' : 'secondary'} className={appointment.status === 'Confirmed' ? 'bg-green-600 text-white' : ''}>
                      {appointment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm font-medium">
                    {format(parseISO(appointment.date), 'EEEE, MMMM do, yyyy')} at {appointment.time}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end pt-0">
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                      </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                      <DropdownMenuItem>Reschedule</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Cancel Appointment</DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground italic border-2 border-dashed rounded-lg">
              No clinical appointments scheduled.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

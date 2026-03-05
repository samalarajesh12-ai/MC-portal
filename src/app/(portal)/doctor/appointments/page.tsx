
'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarCheck, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { getStorageItem, setStorageItem, seedStorage } from '@/lib/storage';
import { format, parseISO, compareAsc } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function DoctorAppointmentsPage() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctor, setDoctor] = useState<any>(null);

  useEffect(() => {
    seedStorage();
    const currentUser = getStorageItem<any>('currentUser', null);
    setDoctor(currentUser);
    
    const allAppointments = getStorageItem<any[]>('appointments', []);
    // Filter appointments for the current doctor
    const doctorAppointments = allAppointments.filter(app => 
      app.doctorId === currentUser?.id || app.doctor === `Dr. ${currentUser?.lastName}`
    );
    
    setAppointments(doctorAppointments.sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date))));
  }, []);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    const allAppointments = getStorageItem<any[]>('appointments', []);
    const updated = allAppointments.map(app => app.id === id ? { ...app, status: newStatus } : app);
    setStorageItem('appointments', updated);
    
    // Refresh local list
    const doctorAppointments = updated.filter(app => 
      app.doctorId === doctor?.id || app.doctor === `Dr. ${doctor?.lastName}`
    );
    setAppointments(doctorAppointments.sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date))));

    toast({
      title: "Appointment Updated",
      description: `Visit status changed to ${newStatus}.`,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
            <CalendarCheck className="h-8 w-8" />
            Appointment Scheduling
          </h1>
          <p className="text-muted-foreground">Manage your daily clinical visits and patient consultations.</p>
        </div>
      </div>

      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle>Upcoming Consultations</CardTitle>
          <CardDescription>Chronological overview of your patient bookings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Patient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.length > 0 ? (
                appointments.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-bold">{app.patient || 'Unknown Patient'}</TableCell>
                    <TableCell>{format(parseISO(app.date), 'MMM do, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {app.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={app.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}
                      >
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {app.status !== 'Completed' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-green-600"
                            onClick={() => handleUpdateStatus(app.id, 'Completed')}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive"
                            onClick={() => handleUpdateStatus(app.id, 'Cancelled')}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic">
                    No clinical appointments scheduled for your profile.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

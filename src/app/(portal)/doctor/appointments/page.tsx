
'use client';

import React from 'react';
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
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, useCollection, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, where, doc, orderBy } from 'firebase/firestore';

export default function DoctorAppointmentsPage() {
  const { toast } = useToast();
  const { user: doctorUser } = useUser();
  const firestore = useFirestore();

  const appointmentsQuery = useMemoFirebase(() => 
    doctorUser ? query(
      collection(firestore, 'appointments'), 
      where('doctorId', '==', doctorUser.uid),
      orderBy('date', 'asc')
    ) : null, 
    [firestore, doctorUser]
  );
  const { data: appointments = [], isLoading } = useCollection(appointmentsQuery);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    const appRef = doc(firestore, 'appointments', id);
    updateDocumentNonBlocking(appRef, { status: newStatus });

    toast({
      title: "Appointment Updated",
      description: `Visit status changed to ${newStatus} in the clinical cloud.`,
    });
  };

  if (isLoading) return <div className="text-center py-20 animate-pulse">Syncing Doctor Schedule...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
            <CalendarCheck className="h-8 w-8" />
            Appointment Scheduling
          </h1>
          <p className="text-muted-foreground">Manage clinical visits and consultations. Synced across all your devices.</p>
        </div>
      </div>

      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle>Upcoming Consultations</CardTitle>
          <CardDescription>Cloud-synced overview of your bookings.</CardDescription>
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
              {appointments && appointments.length > 0 ? (
                appointments.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-bold">{app.patientName || 'Clinical Patient'}</TableCell>
                    <TableCell>{app.date ? format(parseISO(app.date), 'MMM do, yyyy') : 'N/A'}</TableCell>
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
                    No clinical appointments found in your cloud registry.
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

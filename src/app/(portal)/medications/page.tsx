
'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Pill, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { useFirestore, useUser, useCollection, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';

export default function MedicationsPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const medicationsQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, 'medications'), where('patientId', '==', user.uid)) : null, 
    [firestore, user]
  );
  const { data: medications = [], isLoading } = useCollection(medicationsQuery);

  const handleRequestRefill = (med: any) => {
    if (!user) return;

    // 1. Update medication state in cloud
    const medRef = doc(firestore, 'medications', med.id);
    updateDocumentNonBlocking(medRef, { refillRequested: true });

    // 2. Create a cloud notification
    const notificationsRef = collection(firestore, 'notifications');
    addDocumentNonBlocking(notificationsRef, {
      userId: user.uid,
      title: 'Refill Requested',
      description: `Your request for ${med.name} (${med.dosage}) has been submitted to the cloud.`,
      time: format(new Date(), 'h:mm a'),
      type: 'refill',
      read: false,
      createdAt: new Date().toISOString()
    });

    toast({
      title: "Refill Request Sent",
      description: `Your request for ${med.name} has been synchronized with the clinic staff.`,
    });
  };

  if (isLoading) return <div className="text-center py-20 animate-pulse">Synchronizing Medications...</div>;

  return (
    <Card className="border-primary/10 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Pill className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="font-headline text-2xl">Medication Refills</CardTitle>
            <CardDescription>
              Manage your current prescriptions. All changes sync across your devices.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-bold">Medication</TableHead>
              <TableHead className="font-bold">Dosage</TableHead>
              <TableHead className="font-bold">Frequency</TableHead>
              <TableHead className="font-bold text-center">Refills Left</TableHead>
              <TableHead className="text-right font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications && medications.length > 0 ? (
              medications.map((med) => (
                <TableRow key={med.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-semibold text-primary">{med.name}</TableCell>
                  <TableCell>{med.dosage}</TableCell>
                  <TableCell>{med.frequency}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        med.refillsLeft > 0 ? 'secondary' : 'destructive'
                      }
                      className="min-w-[2rem] justify-center"
                    >
                      {med.refillsLeft}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {med.refillRequested ? (
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Requested
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        disabled={med.refillsLeft === 0}
                        onClick={() => handleRequestRefill(med)}
                        className="gap-2"
                      >
                        Request Refill
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">
                  No medications found in your clinical cloud record.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

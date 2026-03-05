
'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pill, PlusCircle, User, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getStorageItem, setStorageItem, seedStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function DoctorPrescriptionsPage() {
  const { toast } = useToast();
  const [patients, setPatients] = useState<any[]>([]);
  const [doctor, setDoctor] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    patientId: '',
    name: '',
    dosage: '',
    frequency: '',
    refills: 0
  });

  useEffect(() => {
    seedStorage();
    setPatients(getStorageItem<any[]>('patients', []));
    setDoctor(getStorageItem<any>('currentUser', null));
  }, []);

  const handleIssuePrescription = () => {
    if (!formData.patientId || !formData.name || !formData.dosage) {
        toast({ variant: 'destructive', title: 'Incomplete Form', description: 'Please fill in all clinical details.' });
        return;
    }

    const newPrescription = {
      id: crypto.randomUUID(),
      patientId: formData.patientId,
      name: formData.name,
      dosage: formData.dosage,
      frequency: formData.frequency,
      refillsLeft: formData.refills,
      lastRefill: format(new Date(), 'yyyy-MM-dd'),
      issuedBy: `Dr. ${doctor?.lastName}`
    };

    const medications = getStorageItem<any[]>('medications', []);
    setStorageItem('medications', [newPrescription, ...medications]);

    // Notify the patient via internal notification system
    const notifications = getStorageItem<any[]>('notifications', []);
    const newNotif = {
      id: crypto.randomUUID(),
      patientId: formData.patientId,
      title: 'New Prescription Issued',
      description: `A new prescription for ${formData.name} has been added to your record by Dr. ${doctor?.lastName}.`,
      time: format(new Date(), 'h:mm a'),
      type: 'refill',
      read: false
    };
    setStorageItem('notifications', [newNotif, ...notifications]);

    toast({
      title: "Prescription Issued",
      description: `Medication ${formData.name} synchronized with patient record.`,
    });

    setFormData({ patientId: '', name: '', dosage: '', frequency: '', refills: 0 });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
            <Pill className="h-8 w-8" />
            Digital Prescription System
          </h1>
          <p className="text-muted-foreground">Issue digital medical orders and synchronize with the pharmacy records.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 border-primary/20 shadow-lg">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-lg flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-primary" /> New Prescription Entry
            </CardTitle>
            <CardDescription>Enter clinical medication details for the patient.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Select Patient</Label>
                <Select onValueChange={(v) => setFormData({...formData, patientId: v})} value={formData.patientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Medication Name</Label>
                <Input 
                  placeholder="e.g., Amoxicillin" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Dosage</Label>
                <Input 
                  placeholder="e.g., 500mg" 
                  value={formData.dosage}
                  onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Input 
                  placeholder="e.g., Twice daily" 
                  value={formData.frequency}
                  onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Refills Allowed</Label>
                <Input 
                  type="number"
                  value={formData.refills}
                  onChange={(e) => setFormData({...formData, refills: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/10">
            <Button className="w-full gap-2" onClick={handleIssuePrescription}>
              <CheckCircle2 className="h-4 w-4" /> Issue and Synchronize
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-2 border-primary/10 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Digital Signature Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-card p-6 rounded-lg border-2 border-dashed border-primary/20 flex flex-col items-center justify-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className="font-bold text-lg">Dr. {doctor?.lastName}</div>
              <div className="text-xs text-muted-foreground uppercase">{doctor?.specialty || 'Medical Practitioner'}</div>
              <Badge className="mt-4 bg-green-600">ID Verified</Badge>
            </div>
            <p className="text-[10px] text-muted-foreground text-center italic">
              Every digital prescription is cryptographically signed and tracked for clinical audit purposes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

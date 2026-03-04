'use client';

import { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Eye, User, Stethoscope } from 'lucide-react';
import { getStorageItem, setStorageItem, seedStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    seedStorage();
    setPatients(getStorageItem<any[]>('patients', []));
    setDoctors(getStorageItem<any[]>('doctors', []));
  }, []);

  const handleDeletePatient = (id: string) => {
    const updated = patients.filter(p => p.id !== id);
    setPatients(updated);
    setStorageItem('patients', updated);
    toast({ title: 'Patient Removed', description: 'The patient record has been deleted.' });
  };

  const handleDeleteDoctor = (id: string) => {
    const updated = doctors.filter(d => d.id !== id);
    setDoctors(updated);
    setStorageItem('doctors', updated);
    toast({ title: 'Doctor Removed', description: 'The healthcare provider record has been deleted.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold font-headline text-primary">Clinic Management</h2>
        <p className="text-muted-foreground">Oversee and manage all patient and healthcare provider records.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Total Patients</CardTitle>
              <CardDescription>Registered users in the system</CardDescription>
            </div>
            <User className="h-8 w-8 text-primary opacity-20" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{patients.length}</div>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Total Doctors</CardTitle>
              <CardDescription>Healthcare professionals</CardDescription>
            </div>
            <Stethoscope className="h-8 w-8 text-primary opacity-20" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{doctors.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="patients" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
          <TabsTrigger value="patients" className="gap-2">
            <User className="h-4 w-4" /> Patients
          </TabsTrigger>
          <TabsTrigger value="doctors" className="gap-2">
            <Stethoscope className="h-4 w-4" /> Doctors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Patient Directory</CardTitle>
              <CardDescription>Manage patient accounts and health access.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.firstName} {patient.lastName}</TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell><Badge variant="outline">{patient.bloodGroup}</Badge></TableCell>
                      <TableCell>{patient.location}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon"><Eye className="h-4 w-4 text-primary" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeletePatient(patient.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {patients.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No patients registered yet.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctors">
          <Card>
            <CardHeader>
              <CardTitle>Doctor Directory</CardTitle>
              <CardDescription>Manage staff and specialists.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell className="font-medium">{doctor.firstName || doctor.name} {doctor.lastName || ''}</TableCell>
                      <TableCell>{doctor.specialty || doctor.specialization}</TableCell>
                      <TableCell>{doctor.experience || 'N/A'} yrs</TableCell>
                      <TableCell>{doctor.email}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon"><Eye className="h-4 w-4 text-primary" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteDoctor(doctor.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {doctors.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No doctors on staff.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

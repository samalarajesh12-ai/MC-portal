
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
import { Users, Search, Eye, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getStorageItem, seedStorage } from '@/lib/storage';
import Link from 'next/link';

export default function DoctorPatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    seedStorage();
    const storedPatients = getStorageItem<any[]>('patients', []);
    setPatients(storedPatients);
  }, []);

  const filteredPatients = patients.filter(p => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
            <Users className="h-8 w-8" />
            Patient Management
          </h1>
          <p className="text-muted-foreground">Manage your assigned patients and review their clinical status.</p>
        </div>
      </div>

      <Card className="border-primary/10">
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients by name or email..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Patient Name</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id} className="hover:bg-muted/10 transition-colors">
                    <TableCell>
                      <div className="font-bold">{patient.firstName} {patient.lastName}</div>
                      <div className="text-xs text-muted-foreground">{patient.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/5">{patient.bloodGroup || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {patient.contactNumber || 'No phone'}
                      </div>
                    </TableCell>
                    <TableCell>{patient.location || 'N/A'}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/doctor/records?patientId=${patient.id}`} className="gap-1.5">
                          <Eye className="h-3 w-3" /> View Records
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic">
                    {patients.length === 0 ? "No patients registered in the system." : "No matching patients found."}
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

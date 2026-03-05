
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getStorageItem, seedStorage } from '@/lib/storage';

function RecordsContent() {
  const searchParams = useSearchParams();
  const initialPatientId = searchParams.get('patientId');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [medicalHistory, setMedicalHistory] = useState<any>(null);

  useEffect(() => {
    seedStorage();
    const storedPatients = getStorageItem<any[]>('patients', []);
    setPatients(storedPatients);
    
    if (initialPatientId) {
      const p = storedPatients.find(p => p.id === initialPatientId);
      if (p) {
        setSelectedPatient(p);
        // In a real app, this would be a per-patient query. 
        // For this MVP, we use the global history if none exists for the patient.
        const history = getStorageItem<any>(`medicalHistory_${p.id}`, getStorageItem('medicalHistory', {
          allergies: [],
          surgeries: [],
          conditions: []
        }));
        setMedicalHistory(history);
      }
    }
  }, [initialPatientId]);

  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient);
    const history = getStorageItem<any>(`medicalHistory_${patient.id}`, getStorageItem('medicalHistory', {
      allergies: [],
      surgeries: [],
      conditions: []
    }));
    setMedicalHistory(history);
  };

  const filteredPatients = patients.filter(p => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
            <ClipboardList className="h-8 w-8" />
            Medical Records Access
          </h1>
          <p className="text-muted-foreground">Search patients and review comprehensive clinical histories.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Patient Selection</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredPatients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPatient(p)}
                  className={`w-full text-left p-3 rounded-md transition-colors border ${
                    selectedPatient?.id === p.id 
                      ? 'bg-primary/10 border-primary text-primary font-bold' 
                      : 'hover:bg-muted border-transparent'
                  }`}
                >
                  <div className="text-sm">{p.firstName} {p.lastName}</div>
                  <div className="text-[10px] opacity-60 uppercase">{p.bloodGroup || 'A+'} Blood Group</div>
                </button>
              ))}
              {filteredPatients.length === 0 && (
                <p className="text-center text-xs text-muted-foreground italic py-4">No patients found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          {selectedPatient ? (
            <>
              <CardHeader className="border-b bg-muted/20">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{selectedPatient.firstName} {selectedPatient.lastName}</CardTitle>
                    <CardDescription>Clinical ID: {selectedPatient.id.substring(0, 8)}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Accordion type="multiple" defaultValue={['history']}>
                  <AccordionItem value="history">
                    <AccordionTrigger className="text-base font-bold">Chronic Conditions</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-2">
                        {medicalHistory?.conditions?.map((c: any) => (
                          <Badge key={c.name} variant="secondary" className="px-3 py-1">
                            {c.name} (Since {c.diagnosed})
                          </Badge>
                        ))}
                        {(!medicalHistory?.conditions || medicalHistory.conditions.length === 0) && (
                          <p className="text-xs text-muted-foreground italic">No chronic conditions recorded.</p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="allergies">
                    <AccordionTrigger className="text-base font-bold">Clinical Allergies</AccordionTrigger>
                    <AccordionContent>
                       <Table>
                         <TableHeader><TableRow><TableHead>Allergen</TableHead><TableHead>Reaction</TableHead></TableRow></TableHeader>
                         <TableBody>
                           {medicalHistory?.allergies?.map((a: any) => (
                             <TableRow key={a.name}><TableCell className="font-medium">{a.name}</TableCell><TableCell>{a.reaction}</TableCell></TableRow>
                           ))}
                         </TableBody>
                       </Table>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-12 text-center">
              <Search className="h-12 w-12 opacity-20 mb-4" />
              <p className="font-medium">Select a patient from the list</p>
              <p className="text-sm">Review their complete medical history and records.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function DoctorRecordsAccessPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center animate-pulse">Loading Clinical Records...</div>}>
      <RecordsContent />
    </Suspense>
  );
}

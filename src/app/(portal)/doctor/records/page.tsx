
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
import { useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';

function RecordsContent() {
  const searchParams = useSearchParams();
  const initialPatientId = searchParams.get('patientId');
  const firestore = useFirestore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(initialPatientId);

  const patientsQuery = useMemoFirebase(() => 
    query(collection(firestore, 'patients'), orderBy('firstName', 'asc')), 
    [firestore]
  );
  const { data: patients = [] } = useCollection(patientsQuery);

  const selectedPatientRef = useMemoFirebase(() => 
    selectedPatientId ? doc(firestore, 'patients', selectedPatientId) : null, 
    [firestore, selectedPatientId]
  );
  const { data: selectedPatient } = useDoc(selectedPatientRef);

  const filteredPatients = (patients || []).filter(p => 
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
          <p className="text-muted-foreground">Comprehensive cloud-synced patient history.</p>
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
                  onClick={() => setSelectedPatientId(p.id)}
                  className={`w-full text-left p-3 rounded-md transition-colors border ${
                    selectedPatientId === p.id 
                      ? 'bg-primary/10 border-primary text-primary font-bold' 
                      : 'hover:bg-muted border-transparent'
                  }`}
                >
                  <div className="text-sm">{p.firstName} {p.lastName}</div>
                  <div className="text-[10px] opacity-60 uppercase">{p.bloodGroup || 'A+'} Blood Group</div>
                </button>
              ))}
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
                <Accordion type="multiple" defaultValue={['history', 'allergies']}>
                  <AccordionItem value="history">
                    <AccordionTrigger className="text-base font-bold">Health History</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {selectedPatient.selectedDiseases?.map((d: string) => (
                            <Badge key={d} variant="secondary">{d}</Badge>
                          ))}
                        </div>
                        <div className="p-3 bg-muted rounded-md text-sm">
                           <p className="font-semibold text-xs text-muted-foreground uppercase mb-1">Clinical Notes</p>
                           {selectedPatient.preExistingConditions || 'No detailed history available.'}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="emergency">
                    <AccordionTrigger className="text-base font-bold">Emergency Contacts</AccordionTrigger>
                    <AccordionContent>
                       <div className="grid grid-cols-2 gap-4 text-sm">
                         <div>
                            <p className="text-xs text-muted-foreground font-bold">Contact Name</p>
                            <p>{selectedPatient.emergencyContactName || 'N/A'}</p>
                         </div>
                         <div>
                            <p className="text-xs text-muted-foreground font-bold">Relation</p>
                            <p>{selectedPatient.emergencyContactRelation || 'N/A'}</p>
                         </div>
                         <div className="col-span-2">
                            <p className="text-xs text-muted-foreground font-bold">Phone</p>
                            <p>{selectedPatient.emergencyContactPhone || 'N/A'}</p>
                         </div>
                       </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-12 text-center">
              <Search className="h-12 w-12 opacity-20 mb-4" />
              <p className="font-medium">Select a patient from the registry</p>
              <p className="text-sm">Review their comprehensive cloud-synced history.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function DoctorRecordsAccessPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center animate-pulse">Synchronizing Cloud Records...</div>}>
      <RecordsContent />
    </Suspense>
  );
}

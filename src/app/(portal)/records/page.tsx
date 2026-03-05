
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
import { getStorageItem, seedStorage } from '@/lib/storage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

export default function RecordsPage() {
  const [medicalHistory, setMedicalHistory] = useState<any>(null);
  const [labResults, setLabResults] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    seedStorage();
    const history = getStorageItem<any>('medicalHistory', {
      allergies: [],
      surgeries: [],
      conditions: []
    });
    const labs = getStorageItem<any[]>('labResults', []);
    setMedicalHistory(history);
    setLabResults(labs);
  }, []);

  if (!isMounted || !medicalHistory) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground animate-pulse font-medium">Synchronizing medical records...</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="history">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="history">Medical History</TabsTrigger>
          <TabsTrigger value="results">Lab Results</TabsTrigger>
        </TabsList>
        <Button size="sm" variant="outline" className="gap-2">
            <FileDown className="h-4 w-4"/>
            Download All Records
        </Button>
      </div>
      <TabsContent value="history" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Medical History</CardTitle>
            <CardDescription>
              An overview of your health conditions, surgeries, and allergies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={['conditions', 'allergies']}>
              <AccordionItem value="conditions">
                <AccordionTrigger className="text-lg font-semibold">
                  Known Conditions
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc space-y-2 pl-6">
                    {medicalHistory.conditions && medicalHistory.conditions.length > 0 ? (
                      medicalHistory.conditions.map((condition: any) => (
                        <li key={condition.name}>
                          <span className="font-medium">{condition.name}</span> -
                          Diagnosed in {condition.diagnosed}
                        </li>
                      ))
                    ) : (
                      <li className="text-muted-foreground italic list-none">No chronic conditions recorded.</li>
                    )}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="allergies">
                <AccordionTrigger className="text-lg font-semibold">
                  Allergies
                </AccordionTrigger>
                <AccordionContent>
                <ul className="list-disc space-y-2 pl-6">
                    {medicalHistory.allergies && medicalHistory.allergies.length > 0 ? (
                      medicalHistory.allergies.map((allergy: any) => (
                        <li key={allergy.name}>
                          <span className="font-medium">{allergy.name}</span> -
                          Reaction: {allergy.reaction}
                        </li>
                      ))
                    ) : (
                      <li className="text-muted-foreground italic list-none">No known allergies.</li>
                    )}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="surgeries">
                <AccordionTrigger className="text-lg font-semibold">
                  Past Surgeries
                </AccordionTrigger>
                <AccordionContent>
                <ul className="list-disc space-y-2 pl-6">
                    {medicalHistory.surgeries && medicalHistory.surgeries.length > 0 ? (
                      medicalHistory.surgeries.map((surgery: any) => (
                        <li key={surgery.name}>
                          <span className="font-medium">{surgery.name}</span> -
                          {surgery.date}
                        </li>
                      ))
                    ) : (
                      <li className="text-muted-foreground italic list-none">No past surgical history recorded.</li>
                    )}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="results" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Lab Results</CardTitle>
            <CardDescription>
              Your recent clinical laboratory reports.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labResults && labResults.length > 0 ? (
                  labResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">
                        {result.testName}
                      </TableCell>
                      <TableCell>{result.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            result.status === 'Normal'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {result.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-10 text-muted-foreground italic">No lab results found in clinical record.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

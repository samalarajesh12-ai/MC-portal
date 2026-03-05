
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import { useFirestore, useUser, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';

export default function RecordsPage() {
  const { toast } = useToast();
  const { user: firebaseUser } = useUser();
  const firestore = useFirestore();
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch full patient profile for history and conditions
  const patientProfileRef = useMemoFirebase(() => 
    firebaseUser ? doc(firestore, 'patients', firebaseUser.uid) : null, 
    [firestore, firebaseUser]
  );
  const { data: patientData, isLoading: isProfileLoading } = useDoc(patientProfileRef);

  // Fetch lab results specifically for this patient from Firestore
  const labsQuery = useMemoFirebase(() => 
    firebaseUser ? query(collection(firestore, 'labResults'), where('patientId', '==', firebaseUser.uid)) : null, 
    [firestore, firebaseUser]
  );
  const { data: labResults = [], isLoading: isLabsLoading } = useCollection(labsQuery);

  // Fetch bills for report audit
  const billsQuery = useMemoFirebase(() => 
    firebaseUser ? query(collection(firestore, 'bills'), where('patientId', '==', firebaseUser.uid)) : null, 
    [firestore, firebaseUser]
  );
  const { data: bills = [] } = useCollection(billsQuery);

  const downloadFullReport = async () => {
    if (!patientData) return;
    setIsGenerating(true);
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(24);
      doc.setTextColor(10, 100, 100);
      doc.text('MARUTHI CLINIC', 105, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Comprehensive Clinical Medical Report', 105, 28, { align: 'center' });
      doc.line(20, 35, 190, 35);

      // Patient Identity
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.setFont(undefined, 'bold');
      doc.text('PATIENT IDENTITY', 20, 45);
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text(`Full Name: ${patientData.firstName} ${patientData.lastName || ''}`, 20, 52);
      doc.text(`Patient ID: ${patientData.id}`, 20, 58);
      doc.text(`Date of Birth: ${patientData.dateOfBirth || 'Not specified'}`, 20, 64);
      doc.text(`Blood Group: ${patientData.bloodGroup || 'Not specified'}`, 20, 70);
      doc.text(`Contact: ${patientData.contactNumber || 'Not specified'}`, 20, 76);

      // Medical History Section
      let currentY = 90;
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('MEDICAL HISTORY', 20, currentY);
      doc.line(20, currentY + 2, 80, currentY + 2);
      
      currentY += 10;
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text('Chronic Conditions:', 20, currentY);
      doc.setFont(undefined, 'normal');
      currentY += 6;
      if (patientData.selectedDiseases?.length > 0) {
        patientData.selectedDiseases.forEach((d: string) => {
          doc.text(`- ${d}`, 25, currentY);
          currentY += 6;
        });
      } else {
        doc.text('No recorded chronic conditions.', 25, currentY);
        currentY += 6;
      }

      currentY += 4;
      doc.setFont(undefined, 'bold');
      doc.text('Additional Clinical Notes:', 20, currentY);
      doc.setFont(undefined, 'normal');
      currentY += 6;
      doc.text(patientData.preExistingConditions || 'No additional notes.', 25, currentY);

      // Lab Results
      currentY += 15;
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('LABORATORY RECORDS', 20, currentY);
      doc.line(20, currentY + 2, 80, currentY + 2);
      currentY += 10;
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      if (labResults.length > 0) {
        labResults.forEach((lab: any) => {
          doc.text(`${lab.date}: ${lab.testName} - [${lab.status}]`, 25, currentY);
          currentY += 6;
        });
      } else {
        doc.text('No lab results recorded for this UID.', 25, currentY);
        currentY += 6;
      }

      // Billing Summary Audit
      currentY += 15;
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('BILLING AUDIT SUMMARY', 20, currentY);
      doc.line(20, currentY + 2, 80, currentY + 2);
      currentY += 10;
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      
      let totalSpent = 0;
      if (bills.length > 0) {
        bills.forEach((b: any) => {
          const gst = b.amount * 0.025;
          const total = b.amount + gst;
          totalSpent += total;
          doc.text(`${b.date}: ${b.service} - Rs ${total.toLocaleString()}`, 25, currentY);
          currentY += 6;
          if (currentY > 260) {
            doc.addPage();
            currentY = 20;
          }
        });
        currentY += 10;
        doc.setFont(undefined, 'bold');
        doc.text(`Total Cumulative Spending: Rs ${totalSpent.toLocaleString()}`, 20, currentY);
      } else {
        doc.text('No billing history available for this account.', 25, currentY);
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Generated on: ${new Date().toLocaleString()} | Maruthi Clinic Cloud Portal`, 105, 285, { align: 'center' });

      doc.save(`Medical_Report_${patientData.firstName}.pdf`);
      toast({ title: "Report Ready", description: "Your unique clinical PDF has been generated." });
    } catch (error) {
      console.error('PDF Error:', error);
      toast({ variant: "destructive", title: "Report Error", description: "Failed to compile medical report." });
    } finally {
      setIsGenerating(false);
    }
  };

  if (isProfileLoading || isLabsLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground animate-pulse font-medium">Syncing your private records...</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="history">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <TabsList>
          <TabsTrigger value="history">Medical History</TabsTrigger>
          <TabsTrigger value="results">Lab Results</TabsTrigger>
        </TabsList>
        <Button 
          size="sm" 
          variant="outline" 
          className="gap-2"
          disabled={isGenerating || !patientData}
          onClick={downloadFullReport}
        >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4"/>}
            Download Full Profile Report
        </Button>
      </div>
      <TabsContent value="history" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Unique Medical History</CardTitle>
            <CardDescription>
              Health data isolated for your clinical account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={['conditions', 'notes']}>
              <AccordionItem value="conditions">
                <AccordionTrigger className="text-lg font-semibold">
                  Recognized Conditions
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2">
                    {patientData?.selectedDiseases?.length > 0 ? (
                      patientData.selectedDiseases.map((d: string) => (
                        <Badge key={d} variant="secondary">{d}</Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic">No conditions specified for this profile.</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="notes">
                <AccordionTrigger className="text-lg font-semibold">
                  Clinical Notes
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm bg-muted p-4 rounded-md">
                    {patientData?.preExistingConditions || "No additional clinical history recorded."}
                  </p>
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
              Laboratory reports synchronized to your UID.
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
                {labResults.length > 0 ? (
                  labResults.map((result: any) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.testName}</TableCell>
                      <TableCell>{result.date}</TableCell>
                      <TableCell>
                        <Badge variant={result.status === 'Normal' ? 'secondary' : 'destructive'}>
                          {result.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-10 text-muted-foreground italic">
                      No lab results found for this profile in the cloud database.
                    </TableCell>
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

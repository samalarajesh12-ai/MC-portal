
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
import { FileDown, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

export default function RecordsPage() {
  const { toast } = useToast();
  const [medicalHistory, setMedicalHistory] = useState<any>(null);
  const [labResults, setLabResults] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    seedStorage();
    const history = getStorageItem<any>('medicalHistory', {
      allergies: [],
      surgeries: [],
      conditions: []
    });
    const labs = getStorageItem<any[]>('labResults', []);
    const currentUser = getStorageItem<any>('currentUser', null);
    
    setMedicalHistory(history);
    setLabResults(labs);
    setUser(currentUser);
  }, []);

  const downloadFullReport = async () => {
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
      doc.text(`Full Name: ${user?.firstName} ${user?.lastName || ''}`, 20, 52);
      doc.text(`Patient ID: ${user?.id}`, 20, 58);
      doc.text(`Date of Birth: ${user?.dateOfBirth || user?.dob || 'Not specified'}`, 20, 64);
      doc.text(`Blood Group: ${user?.bloodGroup || 'Not specified'}`, 20, 70);
      doc.text(`Contact: ${user?.contactNumber || 'Not specified'}`, 20, 76);

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
      if (medicalHistory?.conditions?.length > 0) {
        medicalHistory.conditions.forEach((c: any) => {
          doc.text(`- ${c.name} (Diagnosed: ${c.diagnosed})`, 25, currentY);
          currentY += 6;
        });
      } else {
        doc.text('No recorded chronic conditions.', 25, currentY);
        currentY += 6;
      }

      currentY += 4;
      doc.setFont(undefined, 'bold');
      doc.text('Known Allergies:', 20, currentY);
      doc.setFont(undefined, 'normal');
      currentY += 6;
      if (medicalHistory?.allergies?.length > 0) {
        medicalHistory.allergies.forEach((a: any) => {
          doc.text(`- ${a.name} (Reaction: ${a.reaction})`, 25, currentY);
          currentY += 6;
        });
      } else {
        doc.text('No known allergies.', 25, currentY);
        currentY += 6;
      }

      // Past Surgeries
      currentY += 10;
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('SURGICAL RECORDS', 20, currentY);
      doc.line(20, currentY + 2, 80, currentY + 2);
      currentY += 10;
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      if (medicalHistory?.surgeries?.length > 0) {
        medicalHistory.surgeries.forEach((s: any) => {
          doc.text(`- ${s.name} (${s.date})`, 25, currentY);
          currentY += 6;
        });
      } else {
        doc.text('No surgical history recorded.', 25, currentY);
        currentY += 6;
      }

      // Billing Summary Audit
      currentY += 15;
      const bills = getStorageItem<any[]>('bills', []);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('BILLING AUDIT SUMMARY', 20, currentY);
      doc.line(20, currentY + 2, 80, currentY + 2);
      currentY += 10;
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      
      let totalSpent = 0;
      let totalGST = 0;

      if (bills.length > 0) {
        bills.forEach((b: any) => {
          const gst = b.amount * 0.025;
          const total = b.amount + gst;
          totalSpent += total;
          totalGST += gst;
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
        currentY += 6;
        doc.text(`Total Clinical Tax (GST 2.5%) Paid: Rs ${totalGST.toLocaleString()}`, 20, currentY);
      } else {
        doc.text('No billing history available.', 25, currentY);
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Generated on: ${new Date().toLocaleString()} | Maruthi Clinic Portal v1.1.0`, 105, 285, { align: 'center' });

      doc.save(`Medical_Report_${user?.firstName || 'Patient'}.pdf`);
      
      toast({
        title: "Medical Report Ready",
        description: "Comprehensive PDF profile has been generated.",
      });
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast({
        variant: "destructive",
        title: "Report Error",
        description: "Failed to compile medical report.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

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
        <Button 
          size="sm" 
          variant="outline" 
          className="gap-2"
          disabled={isGenerating}
          onClick={downloadFullReport}
        >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4"/>}
            Download Full Clinical Report
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

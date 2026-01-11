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
import { labResults, medicalHistory } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

export default function RecordsPage() {
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
                    {medicalHistory.conditions.map((condition) => (
                      <li key={condition.name}>
                        <span className="font-medium">{condition.name}</span> -
                        Diagnosed in {condition.diagnosed}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="allergies">
                <AccordionTrigger className="text-lg font-semibold">
                  Allergies
                </AccordionTrigger>
                <AccordionContent>
                <ul className="list-disc space-y-2 pl-6">
                    {medicalHistory.allergies.map((allergy) => (
                      <li key={allergy.name}>
                        <span className="font-medium">{allergy.name}</span> -
                        Reaction: {allergy.reaction}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="surgeries">
                <AccordionTrigger className="text-lg font-semibold">
                  Past Surgeries
                </AccordionTrigger>
                <AccordionContent>
                <ul className="list-disc space-y-2 pl-6">
                    {medicalHistory.surgeries.map((surgery) => (
                      <li key={surgery.name}>
                        <span className="font-medium">{surgery.name}</span> -
                        {surgery.date}
                      </li>
                    ))}
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
              Your recent lab test results.
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
                {labResults.map((result) => (
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

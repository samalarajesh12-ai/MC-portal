
'use client';

import React from 'react';
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
import { UserCheck, Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dailyAttendance } from '@/lib/data';

export default function DoctorAttendancePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
            <UserCheck className="h-8 w-8" />
            Clinical Attendance
          </h1>
          <p className="text-muted-foreground">Verify your daily shifts and working hours.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
           <div className="px-4 font-bold text-sm bg-muted py-2 rounded-md flex items-center gap-2">
             <CalendarIcon className="h-4 w-4" /> February 2024
           </div>
           <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-primary/10">
          <CardHeader>
            <CardTitle>Shift Log</CardTitle>
            <CardDescription>A detailed breakdown of your monthly presence.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Date</TableHead>
                  <TableHead>Shift Type</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead className="text-right">Clock-in Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailyAttendance.map((log) => (
                  <TableRow key={log.date} className="hover:bg-muted/10">
                    <TableCell className="font-semibold">{log.date}</TableCell>
                    <TableCell>{log.shift}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {log.hours > 0 ? `${log.hours}h` : '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={log.status === 'Present' ? 'default' : 'secondary'}>
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Target Hours</span>
                <span className="font-bold">160h</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[75%]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-card rounded-lg border border-primary/10">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Present Days</p>
                <p className="text-2xl font-bold text-primary">22</p>
              </div>
              <div className="p-3 bg-card rounded-lg border border-primary/10">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Leave Days</p>
                <p className="text-2xl font-bold text-orange-500">2</p>
              </div>
              <div className="p-3 bg-card rounded-lg border border-primary/10">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">On-Call</p>
                <p className="text-2xl font-bold text-blue-500">4</p>
              </div>
              <div className="p-3 bg-card rounded-lg border border-primary/10">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Overtime</p>
                <p className="text-2xl font-bold text-green-500">12h</p>
              </div>
            </div>

            <div className="pt-4 border-t border-primary/10">
              <Button className="w-full gap-2">
                <UserCheck className="h-4 w-4" /> Clock In / Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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
import { Calendar } from '@/components/ui/calendar';
import { MoreHorizontal, PlusCircle, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { getStorageItem, seedStorage } from '@/lib/storage';
import { format, parseISO, compareAsc } from 'date-fns';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    // Set initial date on client to avoid hydration mismatch
    setSelectedDate(new Date());
    
    seedStorage();
    const storedAppointments = getStorageItem<any[]>('appointments', []);
    const storedDoctors = getStorageItem<any[]>('doctors', []);
    
    // Sort appointments in sequential (chronological) order
    const sorted = [...storedAppointments].sort((a, b) => {
      return compareAsc(parseISO(a.date), parseISO(b.date));
    });
    
    setAppointments(sorted);
    setDoctors(storedDoctors);
  }, []);

  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Clinical Schedule</CardTitle>
              <CardDescription>
                Review your medical visits in chronological sequence.
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Schedule New
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule New Appointment</DialogTitle>
                  <DialogDescription>
                    Select a provider and time for your clinical visit.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="doctor" className="text-right">
                      Doctor
                    </Label>
                    <Select>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a doctor" />
                        </SelectTrigger>
                        <SelectContent>
                            {doctors.map((doctor) => (
                                <SelectItem key={doctor.id} value={doctor.id}>
                                    {doctor.firstName || doctor.name} ({doctor.specialization || doctor.specialty})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Date
                    </Label>
                    <Input id="date" type="date" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time" className="text-right">
                      Time
                    </Label>
                    <Input id="time" type="time" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Confirm Appointment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <Card key={appointment.id} className="border-primary/10 shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <CalendarDays className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-headline">
                            {appointment.department}
                          </CardTitle>
                          <CardDescription>
                            with {appointment.doctor}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={appointment.status === 'Confirmed' ? 'default' : 'secondary'} className={appointment.status === 'Confirmed' ? 'bg-green-600 text-white' : ''}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm font-medium">
                      {format(parseISO(appointment.date), 'EEEE, MMMM do, yyyy')} at {appointment.time}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-end pt-0">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuItem>Reschedule</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Cancel Appointment</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground italic border-2 border-dashed rounded-lg">
                No clinical appointments scheduled.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="border-primary/20 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Medical Calendar</CardTitle>
            <CardDescription>View availability and bookings.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border-0"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

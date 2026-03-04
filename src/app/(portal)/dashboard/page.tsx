'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowUpRight,
  Calendar,
  MessageSquare,
  Pill,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getStorageItem, seedStorage } from '@/lib/storage';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [userAppointments, setUserAppointments] = useState<any[]>([]);
  const [userMessages, setUserMessages] = useState<any[]>([]);
  const [userMedications, setUserMedications] = useState<any[]>([]);

  useEffect(() => {
    seedStorage();
    const currentUser = getStorageItem('currentUser', null);
    setUser(currentUser);

    if (currentUser) {
      const allAppointments = getStorageItem<any[]>('appointments', []);
      const allMessages = getStorageItem<any[]>('messages', []);
      const allMedications = getStorageItem<any[]>('medications', []);

      // Filter data for the specific patient
      // In a real app, IDs would match. Here we filter by a mock name match for initial data
      setUserAppointments(allAppointments.filter(a => a.patientId === currentUser.id || !a.patientId));
      setUserMessages(allMessages.filter(m => m.receiverId === currentUser.id || !m.receiverId));
      setUserMedications(allMedications.filter(med => med.patientId === currentUser.id || !med.patientId));
    }
  }, []);

  const unreadMessagesCount = userMessages.filter((m) => !m.read).length;
  const refillsNeededCount = userMedications.filter((m) => m.refillsLeft === 0).length;

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline text-primary">
        Welcome back, {user.firstName}!
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-primary/20 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userAppointments.length}</div>
            <p className="text-xs text-muted-foreground">You have {userAppointments.length} appointments scheduled.</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadMessagesCount}</div>
            <p className="text-xs text-muted-foreground">You have {unreadMessagesCount} unread messages.</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medication Refills</CardTitle>
            <Pill className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{refillsNeededCount}</div>
            <p className="text-xs text-muted-foreground">{refillsNeededCount} medications need a refill request.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-primary/10">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Here are your next scheduled appointments.</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/appointments">View All<ArrowUpRight className="h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Doctor</TableHead><TableHead>Department</TableHead><TableHead>Date & Time</TableHead></TableRow></TableHeader>
              <TableBody>
                {userAppointments.slice(0, 3).map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell><div className="font-medium">{appointment.doctor}</div></TableCell>
                    <TableCell>{appointment.department}</TableCell>
                    <TableCell>{appointment.date} at {appointment.time}</TableCell>
                  </TableRow>
                ))}
                {userAppointments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">No upcoming appointments.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="border-primary/10">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Your latest conversations with your care team.</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/messages">View All<ArrowUpRight className="h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4">
            {userMessages.slice(0, 3).map((message) => (
              <div key={message.id} className="flex items-start gap-4 p-2 rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{message.sender}</p>
                    {!message.read && <Badge className="bg-primary">New</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{message.subject}</p>
                </div>
              </div>
            ))}
            {userMessages.length === 0 && (
              <p className="text-center py-4 text-muted-foreground">No messages found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

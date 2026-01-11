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
import { appointments, messages, medications, patient } from '@/lib/data';

export default function DashboardPage() {
  const unreadMessagesCount = messages.filter((m) => !m.read).length;
  const refillsNeededCount = medications.filter((m) => m.refillsLeft === 0).length;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-headline">
        Welcome back, {patient.name}!
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-xs text-muted-foreground">
              You have {appointments.length} appointments scheduled.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadMessagesCount}</div>
            <p className="text-xs text-muted-foreground">
              You have {unreadMessagesCount} unread messages.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Medication Refills
            </CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{refillsNeededCount}</div>
            <p className="text-xs text-muted-foreground">
              {refillsNeededCount} medications need a refill request.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>
                Here are your next scheduled appointments.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/appointments">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.slice(0, 3).map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="font-medium">{appointment.doctor}</div>
                    </TableCell>
                    <TableCell>
                        {appointment.department}
                    </TableCell>
                    <TableCell>
                        {appointment.date} at {appointment.time}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
        <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>
                Your latest conversations with your care team.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/messages">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4">
            {messages.slice(0, 3).map((message) => (
                <div key={message.id} className="flex items-start gap-4">
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <p className="font-medium">{message.sender}</p>
                            {!message.read && <Badge className="bg-primary hover:bg-primary">New</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{message.subject}</p>
                    </div>
                </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

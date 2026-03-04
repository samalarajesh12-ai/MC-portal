'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { setStorageItem } from '@/lib/storage';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setStorageItem('currentUser', { id: 'admin', role: 'admin', firstName: 'Admin' });
    toast({
      title: 'Login Successful',
      description: 'Redirecting to management dashboard...',
    });
    router.push('/admin/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
       <Link href="/" className="mb-8 flex items-center gap-2">
       <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-8 w-8 text-primary"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
              clipRule="evenodd"
            />
          </svg>
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
                MARUTHI CLINIC
            </h1>
        </Link>
      <Card className="w-full max-w-sm shadow-xl border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full w-fit">
            <ShieldAlert className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">Admin Portal</CardTitle>
          <CardDescription>
            Confidential access for management only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@maruthi.clinic"
                required
                defaultValue="admin@maruthi.clinic"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Security Password</Label>
              <Input id="password" type="password" required defaultValue="password" />
            </div>
            <Button type="submit" className="w-full h-11">
              Authenticate
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

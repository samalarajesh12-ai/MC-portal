'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, LogOut, Users, Stethoscope, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { removeStorageItem } from '@/lib/storage';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-card px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <ShieldAlert className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-foreground font-headline">ADMIN PORTAL</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-1 ml-8">
            <Button variant="ghost" asChild className="gap-2">
                <Link href="/admin/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    Management
                </Link>
            </Button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild onClick={() => removeStorageItem('currentUser')}>
            <Link href="/" className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 p-6 container mx-auto">{children}</main>
    </div>
  );
}


'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, Search, LogOut, Stethoscope, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { navItems, doctorNavItems } from '@/lib/data';
import NavItems from './_components/nav-items';
import { useFirestore, useUser, useCollection, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, where, doc, orderBy } from 'firebase/firestore';

function Header() {
  const { user } = useUser();
  const firestore = useFirestore();

  const notificationsQuery = useMemoFirebase(() => 
    user ? query(
      collection(firestore, 'notifications'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    ) : null, 
    [firestore, user]
  );
  const { data: notifications = [] } = useCollection(notificationsQuery);
  const unreadCount = notifications?.filter((n: any) => !n.read).length || 0;

  const markAllAsRead = () => {
    notifications?.forEach((n: any) => {
      if (!n.read) {
        const notifRef = doc(firestore, 'notifications', n.id);
        updateDocumentNonBlocking(notifRef, { read: true });
      }
    });
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="w-full flex-1">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search clinical cloud..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground border-2 border-background"
                variant="destructive"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="flex items-center justify-between p-4 border-b">
            <h4 className="font-semibold text-sm">Cloud Notifications</h4>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="text-xs h-7 px-2" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
          <ScrollArea className="h-80">
            {notifications && notifications.length > 0 ? (
              <div className="flex flex-col">
                {notifications.map((notif: any) => (
                  <div 
                    key={notif.id} 
                    className={`flex gap-3 p-4 border-b last:border-0 hover:bg-muted/50 transition-colors ${!notif.read ? 'bg-primary/5' : ''}`}
                  >
                    <div className="mt-1">
                      {notif.type === 'refill' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                      {notif.type === 'profile' && <Clock className="h-4 w-4 text-primary" />}
                      {notif.type === 'alert' && <AlertCircle className="h-4 w-4 text-destructive" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold leading-none">{notif.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{notif.description}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-medium">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
                <Bell className="h-10 w-10 opacity-20 mb-2" />
                <p className="text-sm italic">No cloud updates.</p>
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {user?.displayName || 'User'}
            <p className="text-xs text-muted-foreground font-normal">Cloud Profile</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const firestore = useFirestore();

  // Determine role from Firestore profile
  const patientProfileQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, 'patients'), where('id', '==', user.uid)) : null,
    [firestore, user]
  );
  
  const doctorProfileQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, 'doctors'), where('id', '==', user.uid)) : null,
    [firestore, user]
  );

  const { data: patientProfile } = useCollection(patientProfileQuery);
  const { data: doctorProfile } = useCollection(doctorProfileQuery);

  const role = doctorProfile && doctorProfile.length > 0 ? 'doctor' : 'patient';
  const activeNavItems = role === 'doctor' ? doctorNavItems : navItems;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2 p-2">
            <Stethoscope className="h-8 w-8 text-sidebar-foreground" />
            <h1 className="text-xl font-headline font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              MARUTHI CLINIC
            </h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <NavItems items={activeNavItems} />
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

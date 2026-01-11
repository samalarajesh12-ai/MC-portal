"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import type { NavItem } from '@/lib/data';
import { iconMap } from '@/lib/data';


type NavItemsProps = {
  items: NavItem[];
};

export default function NavItems({ items }: NavItemsProps) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const Icon = iconMap[item.iconName];
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={item.label}
            >
              <Link href={item.href}>
                <Icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </>
  );
}

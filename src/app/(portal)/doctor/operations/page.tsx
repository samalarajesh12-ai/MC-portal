
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Download, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { previousOperations } from '@/lib/data';

export default function OperationsHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOps = previousOperations.filter(op => 
    op.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
            <Activity className="h-8 w-8" />
            Surgical Registry
          </h1>
          <p className="text-muted-foreground">Historical log of all clinical operations and outcomes.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Export Registry (PDF)
        </Button>
      </div>

      <Card className="border-primary/10">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient or procedure..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <Filter className="h-3 w-3" /> Filter by Outcome
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Patient Name</TableHead>
                <TableHead>Procedure Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Outcome</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOps.map((op) => (
                <TableRow key={op.id} className="hover:bg-muted/10 transition-colors">
                  <TableCell className="font-bold">{op.patient}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">{op.type}</Badge>
                  </TableCell>
                  <TableCell>{op.date}</TableCell>
                  <TableCell className="text-muted-foreground">{op.duration}</TableCell>
                  <TableCell className="text-right">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
                      {op.outcome}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOps.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic">
                    No surgical records match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

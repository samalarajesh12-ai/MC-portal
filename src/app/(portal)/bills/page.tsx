
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileDown, 
  CreditCard, 
  Landmark, 
  Wallet, 
  ShieldCheck, 
  Receipt,
  Search,
  ChevronDown,
  ChevronUp,
  Activity,
  Loader2
} from 'lucide-react';
import { getStorageItem, setStorageItem, seedStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const paymentMethodIcons = {
    'Debit Card': <CreditCard className="h-4 w-4" />,
    'UPI': <Wallet className="h-4 w-4" />,
    'Cash': <Landmark className="h-4 w-4" />,
    'Insurance': <ShieldCheck className="h-4 w-4" />,
    'Split Payment': <Receipt className="h-4 w-4" />
}

export default function BillsPage() {
  const { toast } = useToast();
  const [bills, setBills] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedBillId, setExpandedBillId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  
  const [editingBill, setEditingBill] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    seedStorage();
    const storedBills = getStorageItem<any[]>('bills', []);
    const currentUser = getStorageItem<any>('currentUser', null);
    setBills(storedBills);
    setUser(currentUser);
  }, []);

  const calculateGST = (amount: number) => amount * 0.025;
  const calculateTotal = (amount: number) => amount + calculateGST(amount);

  const handleUpdateBill = () => {
    if (!editingBill) return;
    
    const updated = bills.map(b => b.id === editingBill.id ? editingBill : b);
    setBills(updated);
    setStorageItem('bills', updated);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Bill Updated",
      description: `Payment details for ${editingBill.service} synchronized.`,
    });
  };

  const downloadBillPDF = async (bill: any) => {
    setIsGenerating(bill.id);
    try {
      const doc = new jsPDF();
      const subtotal = bill.amount;
      const gst = calculateGST(subtotal);
      const total = calculateTotal(subtotal);

      // Header
      doc.setFontSize(22);
      doc.setTextColor(10, 100, 100);
      doc.text('MARUTHI CLINIC', 105, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Excellence in Clinical Care Since 2010', 105, 28, { align: 'center' });
      doc.line(20, 35, 190, 35);

      // Patient Info
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`Patient: ${user?.firstName} ${user?.lastName || ''}`, 20, 45);
      doc.text(`Bill Date: ${bill.date}`, 140, 45);
      doc.text(`ID: ${user?.id?.substring(0, 8)}`, 20, 52);
      doc.text(`Service: ${bill.service}`, 20, 65);

      // Table Header
      doc.setFillColor(240, 240, 240);
      doc.rect(20, 75, 170, 10, 'F');
      doc.setFont(undefined, 'bold');
      doc.text('Description', 25, 82);
      doc.text('Amount (Rs)', 160, 82, { align: 'right' });

      // Table Content
      doc.setFont(undefined, 'normal');
      doc.text(bill.service, 25, 92);
      doc.text(subtotal.toLocaleString(), 160, 92, { align: 'right' });

      // Surgical Details
      let currentY = 105;
      if (bill.surgicals && bill.surgicals.length > 0) {
        doc.setFont(undefined, 'bold');
        doc.text('Surgicals & Consumables:', 20, currentY);
        doc.setFont(undefined, 'normal');
        currentY += 8;
        bill.surgicals.forEach((item: any) => {
          doc.text(`- ${item.name} (Qty: ${item.count})`, 25, currentY);
          currentY += 6;
        });
      }

      // Totals
      currentY = Math.max(currentY + 10, 140);
      doc.line(120, currentY, 190, currentY);
      currentY += 8;
      doc.text('Subtotal:', 125, currentY);
      doc.text(subtotal.toLocaleString(), 185, currentY, { align: 'right' });
      
      currentY += 8;
      doc.text('GST (2.5%):', 125, currentY);
      doc.text(gst.toLocaleString(), 185, currentY, { align: 'right' });

      currentY += 10;
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Grand Total:', 125, currentY);
      doc.text(`Rs ${total.toLocaleString()}`, 185, currentY, { align: 'right' });

      // Payment Method
      currentY += 20;
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Payment Method: ${bill.paymentMethod}`, 20, currentY);
      if (bill.paymentDetails) {
        currentY += 6;
        doc.text(`Details: ${bill.paymentDetails}`, 20, currentY);
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('This is a computer-generated invoice and does not require a physical signature.', 105, 280, { align: 'center' });

      doc.save(`Invoice_${bill.id.substring(0, 8)}.pdf`);
      
      toast({
        title: "Download Complete",
        description: `Invoice for ${bill.service} saved successfully.`,
      });
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Could not generate PDF at this time.",
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const filteredBills = bills.filter(b => 
    b.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
            <Receipt className="h-8 w-8" />
            Medical Bills
          </h1>
          <p className="text-muted-foreground">Manage surgical details, taxes (2.5% GST), and payment splits.</p>
        </div>
        <div className="relative max-w-sm w-full">
           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
           <Input 
             placeholder="Search clinical services..." 
             className="pl-8" 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clinical Billing History</CardTitle>
          <CardDescription>
            Grand totals include a statutory clinical GST of 2.5%.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>GST (2.5%)</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.map((bill) => {
                const subtotal = bill.amount;
                const gst = calculateGST(subtotal);
                const total = calculateTotal(subtotal);
                const isExpanded = expandedBillId === bill.id;

                return (
                  <React.Fragment key={bill.id}>
                    <TableRow className="hover:bg-muted/10 transition-colors">
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => setExpandedBillId(isExpanded ? null : bill.id)}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                      <TableCell className="font-bold text-primary">{bill.service}</TableCell>
                      <TableCell>{bill.date}</TableCell>
                      <TableCell>Rs {subtotal.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">Rs {gst.toLocaleString()}</TableCell>
                      <TableCell className="font-bold">Rs {total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1.5 font-normal">
                          {paymentMethodIcons[bill.paymentMethod as keyof typeof paymentMethodIcons]}
                          {bill.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-primary"
                          onClick={() => { setEditingBill(bill); setIsEditDialogOpen(true); }}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 gap-1.5"
                          disabled={isGenerating === bill.id}
                          onClick={() => downloadBillPDF(bill)}
                        >
                          {isGenerating === bill.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <FileDown className="h-3 w-3" />}
                          PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow className="bg-muted/5">
                        <TableCell colSpan={8} className="p-4 border-l-4 border-primary">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <Activity className="h-3 w-3" /> Medical Surgicals & Consumables
                              </h4>
                              {bill.surgicals && bill.surgicals.length > 0 ? (
                                <div className="space-y-2">
                                  {bill.surgicals.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center bg-card p-2 rounded border border-primary/5">
                                      <span className="text-sm font-medium">{item.name}</span>
                                      <Badge variant="secondary" className="bg-primary/5 text-primary">Count: {item.count}</Badge>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs italic text-muted-foreground">No specific surgical items logged for this visit.</p>
                              )}
                            </div>
                            <div className="bg-card p-4 rounded-lg border space-y-3 shadow-inner">
                               <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment Summary</h4>
                               <div className="space-y-1.5">
                                 <div className="flex justify-between text-sm">
                                   <span>Status</span>
                                   <Badge className="bg-green-100 text-green-700">{bill.status}</Badge>
                                 </div>
                                 <div className="flex justify-between text-sm">
                                   <span>Method</span>
                                   <span className="font-semibold">{bill.paymentMethod}</span>
                                 </div>
                                 {bill.paymentDetails && (
                                   <p className="text-[10px] text-muted-foreground pt-1 border-t italic">{bill.paymentDetails}</p>
                                 )}
                               </div>
                               <Button 
                                 size="sm" 
                                 className="w-full gap-2 mt-2"
                                 disabled={isGenerating === bill.id}
                                 onClick={() => downloadBillPDF(bill)}
                                >
                                 {isGenerating === bill.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
                                 Download PDF Invoice
                               </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Update Payment Method</DialogTitle>
            <DialogDescription>
              Adjust clinical payment method, including support for split transactions.
            </DialogDescription>
          </DialogHeader>
          {editingBill && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Service Reference</Label>
                <Input value={editingBill.service} disabled className="bg-muted" />
              </div>
              
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(paymentMethodIcons).map((method) => (
                    <Button 
                      key={method}
                      variant={editingBill.paymentMethod === method ? 'default' : 'outline'}
                      size="sm"
                      className="justify-start gap-2 h-9"
                      onClick={() => setEditingBill({ ...editingBill, paymentMethod: method })}
                    >
                      {paymentMethodIcons[method as keyof typeof paymentMethodIcons]}
                      <span className="text-xs">{method}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {editingBill.paymentMethod === 'Split Payment' && (
                <div className="space-y-3 p-3 bg-primary/5 rounded-md border border-primary/20">
                   <Label className="text-xs font-bold text-primary">Split Transaction Details</Label>
                   <Textarea 
                     placeholder="e.g., Rs 500 paid in Cash, Rs 2000 via UPI."
                     value={editingBill.paymentDetails || ''}
                     onChange={(e) => setEditingBill({...editingBill, paymentDetails: e.target.value})}
                     className="min-h-[80px]"
                   />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button className="w-full" onClick={handleUpdateBill}>Save Billing Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

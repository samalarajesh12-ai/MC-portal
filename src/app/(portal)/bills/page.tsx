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
import { FileDown, CreditCard, Landmark, Wallet, ShieldCheck } from 'lucide-react';
import { bills } from '@/lib/data';

const paymentMethodIcons = {
    'Debit Card': <CreditCard className="h-4 w-4" />,
    'UPI': <Wallet className="h-4 w-4" />,
    'Cash': <Landmark className="h-4 w-4" />,
    'Insurance': <ShieldCheck className="h-4 w-4" />
}

export default function BillsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Bills</CardTitle>
        <CardDescription>
          View your billing history and download your invoices.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell className="font-medium">{bill.service}</TableCell>
                <TableCell>{bill.date}</TableCell>
                <TableCell>Rs {bill.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={bill.status === 'Paid' ? 'secondary' : 'outline'}
                    className={bill.status === 'Paid' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {bill.status}
                  </Badge>
                </TableCell>
                <TableCell className="flex items-center gap-2">
                    {paymentMethodIcons[bill.paymentMethod as keyof typeof paymentMethodIcons]}
                    {bill.paymentMethod}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" className="gap-2">
                    <FileDown className="h-4 w-4" />
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

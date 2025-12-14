import { motion } from 'framer-motion';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Receipt,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Eye,
  AlertTriangle,
  Shield,
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { payments } from '@/data/mockData';
import { cn } from '@/lib/utils';

const statusConfig = {
  success: { label: 'Success', color: 'bg-success/20 text-success', icon: CheckCircle },
  pending: { label: 'Pending', color: 'bg-warning/20 text-warning', icon: Clock },
  failed: { label: 'Failed', color: 'bg-destructive/20 text-destructive', icon: XCircle },
  refunded: { label: 'Refunded', color: 'bg-muted text-muted-foreground', icon: RefreshCw },
};

const methodIcons = {
  card: '💳',
  upi: '📱',
  crypto: '₿',
  bank: '🏦',
};

export default function PaymentsHistory() {
  const totalPaid = payments.filter(p => p.status === 'success').reduce((sum, p) => sum + p.amount, 0);
  const totalRefunded = payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0);
  const activeSubscription = payments.find(p => p.status === 'success');

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Receipt className="h-6 w-6 text-primary" />
          Payments & History
        </h1>
        <p className="text-muted-foreground mt-1">View your payment history and manage billing</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Paid"
          value={`$${totalPaid}`}
          icon={<CreditCard className="h-5 w-5" />}
          variant="primary"
        />
        <StatCard
          title="Active Subscription"
          value={activeSubscription?.plan || 'None'}
          icon={<CheckCircle className="h-5 w-5" />}
          variant="success"
        />
        <StatCard
          title="Refunds Processed"
          value={`$${totalRefunded}`}
          icon={<RefreshCw className="h-5 w-5" />}
          variant="default"
        />
      </div>

      {/* Payment Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-border bg-card overflow-hidden"
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-display font-semibold text-foreground">Payment Records</h2>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="text-muted-foreground">Date</TableHead>
              <TableHead className="text-muted-foreground">Transaction ID</TableHead>
              <TableHead className="text-muted-foreground">Amount</TableHead>
              <TableHead className="text-muted-foreground">Method</TableHead>
              <TableHead className="text-muted-foreground">Plan</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment, index) => {
              const status = statusConfig[payment.status];
              const StatusIcon = status.icon;

              return (
                <motion.tr
                  key={payment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-border hover:bg-secondary/30"
                >
                  <TableCell className="font-medium">
                    <div>
                      <p className="text-foreground">{format(new Date(payment.createdAt), 'MMM dd, yyyy')}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(payment.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {payment.transactionId}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    ${payment.amount} {payment.currency}
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <span>{methodIcons[payment.method]}</span>
                      <span className="capitalize text-foreground">{payment.method}</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-foreground">{payment.plan}</TableCell>
                  <TableCell>
                    <Badge className={cn("flex items-center gap-1 w-fit", status.color)}>
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {payment.status === 'success' && (
                        <Button variant="ghost" size="sm" className="text-warning">
                          <AlertTriangle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </motion.div>

      {/* Raise Claim */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        <h3 className="font-display font-semibold text-lg text-foreground mb-4">Raise a Claim</h3>
        <p className="text-muted-foreground mb-4">
          Have an issue with a payment? Submit a claim and we'll investigate.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Request Refund
          </Button>
          <Button variant="outline">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Report Payment Issue
          </Button>
        </div>
      </motion.div>

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Shield className="h-5 w-5 text-success" />
          <span className="text-sm">14-Day Money-Back Guarantee</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CreditCard className="h-5 w-5 text-primary" />
          <span className="text-sm">Secure Payment</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-5 w-5 text-accent" />
          <span className="text-sm">24/7 Support Response SLA</span>
        </div>
      </div>
    </div>
  );
}

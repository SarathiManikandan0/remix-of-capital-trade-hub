import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Ticket } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TicketCardProps {
  ticket: Ticket;
  onClick?: () => void;
  index?: number;
}

const statusConfig = {
  open: { label: 'Open', color: 'bg-warning/20 text-warning', icon: AlertCircle },
  'in-progress': { label: 'In Progress', color: 'bg-primary/20 text-primary', icon: Clock },
  resolved: { label: 'Resolved', color: 'bg-success/20 text-success', icon: CheckCircle },
};

const priorityColors = {
  low: 'border-l-muted-foreground',
  medium: 'border-l-warning',
  high: 'border-l-destructive',
};

const typeLabels = {
  support: 'General Support',
  payment: 'Payment Issue',
  subscription: 'Subscription',
};

export function TicketCard({ ticket, onClick, index = 0 }: TicketCardProps) {
  const status = statusConfig[ticket.status];
  const StatusIcon = status.icon;
  const lastMessage = ticket.messages[ticket.messages.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={cn(
        "rounded-xl border bg-card p-5 cursor-pointer hover:border-primary/30 transition-all",
        "border-l-4",
        priorityColors[ticket.priority]
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
            <Badge variant="outline" className="text-xs">
              {typeLabels[ticket.type]}
            </Badge>
          </div>
          <h4 className="font-semibold text-foreground truncate">{ticket.subject}</h4>
        </div>
        <Badge className={cn("flex-shrink-0", status.color)}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {status.label}
        </Badge>
      </div>

      {/* Last Message Preview */}
      {lastMessage && (
        <div className="bg-secondary/50 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "text-xs font-medium",
              lastMessage.sender === 'admin' ? "text-primary" : "text-foreground"
            )}>
              {lastMessage.sender === 'admin' ? 'Support Team' : 'You'}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{lastMessage.content}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">{ticket.messages.length} messages</span>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          View Thread
        </Button>
      </div>
    </motion.div>
  );
}

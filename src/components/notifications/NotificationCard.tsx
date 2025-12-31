import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Radio, CreditCard, Headphones, Megaphone, X } from 'lucide-react';
import { Notification } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NotificationCardProps {
  notification: Notification;
  onDismiss?: (id: string) => void;
  index?: number;
}

const typeIcons = {
  signal: Radio,
  subscription: CreditCard,
  support: Headphones,
  announcement: Megaphone,
};

const typeColors = {
  signal: 'bg-success/30 text-success ring-1 ring-success/30',
  subscription: 'bg-warning/20 text-warning',
  support: 'bg-primary/20 text-primary',
  announcement: 'bg-accent/20 text-accent',
};

export function NotificationCard({ notification, onDismiss, index = 0 }: NotificationCardProps) {
  const Icon = typeIcons[notification.type];
  
  // Check if notification is older (more than 1 day old)
  const isOlder = Date.now() - new Date(notification.createdAt).getTime() > 86400000;
  
  // Check if it's a TP hit notification (success type notification mentioning TP)
  const isTPHit = notification.type === 'signal' && 
    (notification.title.toLowerCase().includes('tp') || notification.message.toLowerCase().includes('target'));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "flex items-start gap-4 p-4 rounded-xl border transition-colors",
        notification.read
          ? "bg-card/50 border-border"
          : "bg-primary/5 border-primary/20",
        isOlder && notification.read && "opacity-70",
        isTPHit && !notification.read && "border-success/30 bg-success/5"
      )}
    >
      <div className={cn("p-2 rounded-lg flex-shrink-0", typeColors[notification.type])}>
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className={cn(
              "font-medium text-foreground",
              !notification.read && "font-semibold"
            )}>
              {notification.title}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => onDismiss(notification.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>

      {!notification.read && (
        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
      )}
    </motion.div>
  );
}

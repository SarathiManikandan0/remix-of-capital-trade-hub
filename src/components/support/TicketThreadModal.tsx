import { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { X, Send, Paperclip, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, TicketMessage } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TicketThreadModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onSendReply: (ticketId: string, message: string) => void;
}

const statusConfig = {
  open: { label: 'Open', color: 'bg-warning/20 text-warning', icon: AlertCircle },
  'in-progress': { label: 'In Progress', color: 'bg-primary/20 text-primary', icon: Clock },
  resolved: { label: 'Resolved', color: 'bg-success/20 text-success', icon: CheckCircle },
};

const typeLabels = {
  support: 'General Support',
  payment: 'Payment Issue',
  subscription: 'Subscription',
};

export function TicketThreadModal({ ticket, isOpen, onClose, onSendReply }: TicketThreadModalProps) {
  const [replyMessage, setReplyMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [ticket?.messages]);

  if (!ticket) return null;

  const status = statusConfig[ticket.status];
  const StatusIcon = status.icon;
  const isResolved = ticket.status === 'resolved';

  const handleSendReply = () => {
    if (replyMessage.trim() && !isResolved) {
      onSendReply(ticket.id, replyMessage.trim());
      setReplyMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[85vh] flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                <Badge variant="outline" className="text-xs">
                  {typeLabels[ticket.type]}
                </Badge>
                <Badge className={cn("flex-shrink-0", status.color)}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {status.label}
                </Badge>
              </div>
              <DialogTitle className="font-display text-lg text-foreground">
                {ticket.subject}
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Created {format(new Date(ticket.createdAt), 'MMM d, yyyy')} at {format(new Date(ticket.createdAt), 'h:mm a')}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Messages Thread */}
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="space-y-4">
            <AnimatePresence>
              {ticket.messages.map((message, index) => (
                <MessageBubble key={message.id} message={message} index={index} />
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Reply Area */}
        <div className="p-4 border-t border-border bg-secondary/20">
          {isResolved ? (
            <div className="text-center py-3">
              <p className="text-sm text-muted-foreground">
                This ticket has been resolved. Create a new ticket if you need further assistance.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <Textarea
                placeholder="Type your reply..."
                className="bg-secondary/50 border-border min-h-[80px] resize-none"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attach File
                </Button>
                <Button 
                  onClick={handleSendReply}
                  disabled={!replyMessage.trim()}
                  className="gradient-primary text-primary-foreground"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Reply
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface MessageBubbleProps {
  message: TicketMessage;
  index: number;
}

function MessageBubble({ message, index }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn("flex", isUser ? "justify-start" : "justify-end")}
    >
      <div className={cn(
        "max-w-[80%] rounded-xl p-4",
        isUser 
          ? "bg-secondary/50 rounded-tl-none" 
          : "bg-primary/20 rounded-tr-none"
      )}>
        <div className="flex items-center gap-2 mb-2">
          <span className={cn(
            "text-xs font-semibold",
            isUser ? "text-foreground" : "text-primary"
          )}>
            {isUser ? 'You' : 'Support Team'}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-foreground whitespace-pre-wrap">{message.content}</p>
      </div>
    </motion.div>
  );
}

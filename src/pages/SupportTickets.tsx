import { useState } from 'react';
import { motion } from 'framer-motion';
import { Headphones, Plus, Clock, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { TicketCard } from '@/components/support/TicketCard';
import { TicketThreadModal } from '@/components/support/TicketThreadModal';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { tickets as initialTickets } from '@/data/mockData';
import { Ticket } from '@/types';
import { toast } from 'sonner';

type TicketType = 'support' | 'payment' | 'subscription';

const typeConfig: Record<TicketType, { label: string; order: number }> = {
  support: { label: 'General Support', order: 1 },
  payment: { label: 'Payment Issue', order: 2 },
  subscription: { label: 'Subscription Issue', order: 3 },
};

function groupTicketsByType(tickets: Ticket[]): Record<TicketType, Ticket[]> {
  const grouped: Record<TicketType, Ticket[]> = {
    support: [],
    payment: [],
    subscription: [],
  };

  tickets.forEach(ticket => {
    grouped[ticket.type].push(ticket);
  });

  // Sort each group: open first, then resolved
  Object.keys(grouped).forEach(type => {
    grouped[type as TicketType].sort((a, b) => {
      if (a.status === 'resolved' && b.status !== 'resolved') return 1;
      if (a.status !== 'resolved' && b.status === 'resolved') return -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  });

  return grouped;
}

export default function SupportTickets() {
  const [isOpen, setIsOpen] = useState(false);
  const [ticketsList, setTicketsList] = useState<Ticket[]>(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isThreadOpen, setIsThreadOpen] = useState(false);
  
  // Form state
  const [ticketType, setTicketType] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  // Validation errors
  const [errors, setErrors] = useState<{ type?: string; subject?: string; message?: string }>({});

  const openTickets = ticketsList.filter(t => t.status === 'open' || t.status === 'in-progress');
  const resolvedTickets = ticketsList.filter(t => t.status === 'resolved');
  const groupedTickets = groupTicketsByType(ticketsList);

  const resetForm = () => {
    setTicketType('');
    setSubject('');
    setMessage('');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: { type?: string; subject?: string; message?: string } = {};
    
    if (!ticketType) {
      newErrors.type = 'Please select an issue type';
    }
    if (!subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateTicketId = () => {
    const existingIds = ticketsList.map(t => {
      const num = parseInt(t.id.replace('TKT-', ''));
      return isNaN(num) ? 0 : num;
    });
    const maxId = Math.max(...existingIds, 0);
    return `TKT-${String(maxId + 1).padStart(3, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newTicket: Ticket = {
      id: generateTicketId(),
      subject: subject.trim(),
      type: ticketType as TicketType,
      status: 'open',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: '1',
          content: message.trim(),
          sender: 'user',
          createdAt: new Date().toISOString(),
        },
      ],
    };

    setTicketsList(prev => [newTicket, ...prev]);
    setIsOpen(false);
    resetForm();
    toast.success('Ticket created successfully!', {
      description: `Ticket ${newTicket.id} has been submitted.`,
    });
  };

  const handleModalClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleViewThread = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsThreadOpen(true);
  };

  const handleCloseThread = () => {
    setIsThreadOpen(false);
    setSelectedTicket(null);
  };

  const handleSendReply = (ticketId: string, messageContent: string) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      content: messageContent,
      sender: 'user' as const,
      createdAt: new Date().toISOString(),
    };

    setTicketsList(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          messages: [...ticket.messages, newMessage],
          updatedAt: new Date().toISOString(),
        };
      }
      return ticket;
    }));

    // Update selected ticket for immediate UI update
    setSelectedTicket(prev => {
      if (prev && prev.id === ticketId) {
        return {
          ...prev,
          messages: [...prev.messages, newMessage],
          updatedAt: new Date().toISOString(),
        };
      }
      return prev;
    });

    toast.success('Reply sent successfully!');
  };

  const hasTickets = ticketsList.length > 0;
  const typesWithTickets = (Object.keys(typeConfig) as TicketType[])
    .filter(type => groupedTickets[type].length > 0)
    .sort((a, b) => typeConfig[a].order - typeConfig[b].order);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Headphones className="h-6 w-6 text-primary" />
            Support & Tickets
          </h1>
          <p className="text-muted-foreground mt-1">Get help from our support team</p>
        </div>

        <Dialog open={isOpen} onOpenChange={handleModalClose}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Create Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display">Create New Ticket</DialogTitle>
            </DialogHeader>
            <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label>Issue Type</Label>
                <Select value={ticketType} onValueChange={setTicketType}>
                  <SelectTrigger className={`bg-secondary/50 border-border ${errors.type ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="support">General Support</SelectItem>
                    <SelectItem value="payment">Payment Issue</SelectItem>
                    <SelectItem value="subscription">Subscription Issue</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
              </div>

              <div className="space-y-2">
                <Label>Subject</Label>
                <Input 
                  placeholder="Brief description of your issue" 
                  className={`bg-secondary/50 border-border ${errors.subject ? 'border-destructive' : ''}`}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
                {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
              </div>

              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  placeholder="Describe your issue in detail..."
                  className={`bg-secondary/50 border-border min-h-[120px] ${errors.message ? 'border-destructive' : ''}`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Attachments (optional)</Label>
                <Input type="file" className="bg-secondary/50 border-border" />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" type="button" onClick={() => handleModalClose(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="gradient-primary text-primary-foreground">
                  Submit Ticket
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Open Tickets"
          value={openTickets.length}
          icon={<AlertCircle className="h-5 w-5" />}
          variant={openTickets.length > 0 ? 'warning' : 'default'}
        />
        <StatCard
          title="Resolved"
          value={resolvedTickets.length}
          icon={<CheckCircle className="h-5 w-5" />}
          variant="success"
        />
        <StatCard
          title="Avg Response Time"
          value="2 hrs"
          subtitle="24hr SLA"
          icon={<Clock className="h-5 w-5" />}
          variant="primary"
        />
      </div>

      {/* Tickets List with Issue Type Segregation */}
      <div className="space-y-6">
        <h2 className="font-display text-lg font-semibold text-foreground">Your Tickets</h2>

        {hasTickets ? (
          <div className="space-y-8">
            {typesWithTickets.map((type) => (
              <TicketSection
                key={type}
                title={typeConfig[type].label}
                tickets={groupedTickets[type]}
                onViewThread={handleViewThread}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 rounded-xl border border-border bg-card"
          >
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No tickets yet</h3>
            <p className="text-muted-foreground mb-4">Create a ticket to get help from our support team</p>
            <Button className="gradient-primary text-primary-foreground" onClick={() => setIsOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Ticket
            </Button>
          </motion.div>
        )}
      </div>

      {/* Quick Help */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        <h3 className="font-display font-semibold text-lg text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <Headphones className="h-5 w-5 text-primary" />
            <span>Live Chat</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <MessageCircle className="h-5 w-5 text-accent" />
            <span>FAQ</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <Clock className="h-5 w-5 text-success" />
            <span>Response Times</span>
          </Button>
        </div>
      </motion.div>

      {/* Thread Modal */}
      <TicketThreadModal
        ticket={selectedTicket}
        isOpen={isThreadOpen}
        onClose={handleCloseThread}
        onSendReply={handleSendReply}
      />
    </div>
  );
}

interface TicketSectionProps {
  title: string;
  tickets: Ticket[];
  onViewThread: (ticket: Ticket) => void;
}

function TicketSection({ title, tickets, onViewThread }: TicketSectionProps) {
  if (tickets.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </h3>
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">{tickets.length} ticket{tickets.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {tickets.map((ticket, index) => (
          <TicketCard 
            key={ticket.id} 
            ticket={ticket} 
            index={index}
            onClick={() => onViewThread(ticket)}
          />
        ))}
      </div>
    </motion.div>
  );
}
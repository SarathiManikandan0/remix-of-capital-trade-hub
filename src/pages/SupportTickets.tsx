import { useState } from 'react';
import { motion } from 'framer-motion';
import { Headphones, Plus, Clock, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { TicketCard } from '@/components/support/TicketCard';
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

export default function SupportTickets() {
  const [isOpen, setIsOpen] = useState(false);
  const [ticketsList, setTicketsList] = useState<Ticket[]>(initialTickets);
  
  // Form state
  const [ticketType, setTicketType] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  // Validation errors
  const [errors, setErrors] = useState<{ type?: string; subject?: string; message?: string }>({});

  const openTickets = ticketsList.filter(t => t.status === 'open');
  const resolvedTickets = ticketsList.filter(t => t.status === 'resolved');

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
      type: ticketType as 'support' | 'payment' | 'subscription',
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

      {/* Tickets List */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-foreground">Your Tickets</h2>

        {ticketsList.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {ticketsList.map((ticket, index) => (
              <TicketCard key={ticket.id} ticket={ticket} index={index} />
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
    </div>
  );
}
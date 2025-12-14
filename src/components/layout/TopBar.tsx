import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { notifications } from '@/data/mockData';
import { format } from 'date-fns';

const pageTitle: Record<string, string> = {
  '/': 'Dashboard / Overview',
  '/signals': 'Live Signals',
  '/analysis': 'Market Analysis',
  '/courses': 'Tools & Courses',
  '/subscription': 'My Subscription',
  '/support': 'Support & Tickets',
  '/payments': 'Payments & History',
  '/notifications': 'Notifications',
  '/settings': 'Profile & Settings',
};

export function TopBar() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Page Title */}
      <div className="flex items-center gap-2">
        <h1 className="font-display text-lg font-semibold text-foreground">
          {pageTitle[location.pathname] || 'D-Trading'}
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-9 bg-secondary/50 border-border focus:border-primary"
          />
        </div>

        {/* Date */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-lg border border-border">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {format(new Date(), 'MMM dd, yyyy')}
          </span>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center gradient-accent text-accent-foreground border-0">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    </header>
  );
}

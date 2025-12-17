import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { notifications as initialNotifications } from '@/data/mockData';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { format } from 'date-fns';
import { Notification } from '@/types';

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
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notificationList, setNotificationList] = useState<Notification[]>(initialNotifications);
  
  const unreadCount = notificationList.filter(n => !n.read).length;
  const sortedNotifications = [...notificationList].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleNotificationClick = (id: string) => {
    setNotificationList(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setOpen(false);
    navigate('/notifications');
  };

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

        {/* Date */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-lg border border-border">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {format(new Date(), 'MMM dd, yyyy')}
          </span>
        </div>

        {/* Notifications Popover */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center gradient-accent text-accent-foreground border-0">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            align="end" 
            className="w-[400px] p-0 bg-card border-border"
            sideOffset={8}
          >
            <div className="p-4 border-b border-border">
              <h3 className="font-display font-semibold text-foreground">Notifications</h3>
              <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
            </div>
            <ScrollArea className="h-[400px]">
              <div className="p-3 space-y-3">
                {sortedNotifications.map((notification, index) => (
                  <div 
                    key={notification.id} 
                    onClick={() => handleNotificationClick(notification.id)}
                    className="cursor-pointer"
                  >
                    <NotificationCard 
                      notification={notification} 
                      index={index}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}

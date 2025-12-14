import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Radio, CreditCard, Headphones, Megaphone, Settings, Check } from 'lucide-react';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { notifications as initialNotifications } from '@/data/mockData';
import { Notification } from '@/types';

type NotificationType = 'all' | 'signal' | 'subscription' | 'support' | 'announcement';

const typeIcons = {
  all: Bell,
  signal: Radio,
  subscription: CreditCard,
  support: Headphones,
  announcement: Megaphone,
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<NotificationType>('all');

  const filteredNotifications = notifications.filter(n =>
    activeTab === 'all' ? true : n.type === activeTab
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
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
            <Bell className="h-6 w-6 text-primary" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-sm rounded-full gradient-accent text-accent-foreground">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">Stay updated with your trading activity</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as NotificationType)}>
        <TabsList className="bg-secondary/50 border border-border p-1 flex-wrap h-auto">
          {(['all', 'signal', 'subscription', 'support', 'announcement'] as const).map(type => {
            const Icon = typeIcons[type];
            const count = type === 'all'
              ? notifications.length
              : notifications.filter(n => n.type === type).length;

            return (
              <TabsTrigger
                key={type}
                value={type}
                className="data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground capitalize"
              >
                <Icon className="h-4 w-4 mr-2" />
                {type === 'all' ? 'All' : type}
                <span className="ml-2 text-xs opacity-60">({count})</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-3">
                {filteredNotifications.map((notification, index) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onDismiss={handleDismiss}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No notifications</h3>
                <p className="text-muted-foreground">You're all caught up!</p>
              </motion.div>
            )}
          </AnimatePresence>

          {filteredNotifications.length > 5 && (
            <div className="text-center mt-6">
              <Button variant="outline">Load More</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

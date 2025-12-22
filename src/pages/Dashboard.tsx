import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  Radio,
  Headphones,
  TrendingUp,
  Calendar,
  ArrowRight,
  Crown,
  Bell,
  Zap,
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { SignalCard } from '@/components/signals/SignalCard';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { currentUser, signals, notifications, tickets } from '@/data/mockData';
import { format, differenceInDays } from 'date-fns';

export default function Dashboard() {
  const todaySignals = signals.filter(s => s.status === 'active');
  const openTickets = tickets.filter(t => t.status === 'open');
  const unreadNotifications = notifications.filter(n => !n.read).slice(0, 3);
  const recentSignals = signals.slice(0, 3);
  const daysUntilExpiry = differenceInDays(new Date(currentUser.subscriptionExpiry), new Date());

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-card to-accent/10 border border-primary/20 p-6"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Hello, {currentUser.name.split(' ')[0]}! 👋
              </h1>
            </div>
            <p className="text-muted-foreground">Let's check how your trading is performing today.</p>
            <div className="flex items-center gap-3 mt-4">
              <Badge className="gradient-primary text-primary-foreground border-0 px-3 py-1">
                <Crown className="h-3 w-3 mr-1" />
                {currentUser.tier.charAt(0).toUpperCase() + currentUser.tier.slice(1)} Member
              </Badge>
              <Badge variant="outline" className="border-success/30 text-success">
                {currentUser.subscriptionStatus === 'active' ? 'Active' : 'Expired'}
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Link to="/subscription">
              <Button className="gradient-accent text-accent-foreground hover:opacity-90">
                <Zap className="h-4 w-4 mr-2" />
                Upgrade Plan
              </Button>
            </Link>
            <Link to="/support">
              <Button variant="outline" className="border-border hover:bg-secondary">
                <Headphones className="h-4 w-4 mr-2" />
                Get Support
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Subscription Status"
          value={currentUser.subscriptionStatus === 'active' ? 'Active' : 'Expired'}
          subtitle={`Renews: ${format(new Date(currentUser.subscriptionExpiry), 'MMM dd, yyyy')}`}
          icon={<CreditCard className="h-5 w-5" />}
          variant={daysUntilExpiry <= 7 ? 'warning' : 'success'}
          to="/subscription"
        />
        <StatCard
          title="Signals Today"
          value={todaySignals.length}
          subtitle={`${todaySignals.length} active signals`}
          icon={<Radio className="h-5 w-5" />}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
          to="/signals"
        />
        <StatCard
          title="Open Tickets"
          value={openTickets.length}
          subtitle="Avg response: 2hrs"
          icon={<Headphones className="h-5 w-5" />}
          variant={openTickets.length > 0 ? 'accent' : 'default'}
          to="/support"
        />
        <StatCard
          title="Engagement"
          value="94%"
          subtitle="Last 30 days activity"
          icon={<TrendingUp className="h-5 w-5" />}
          variant="default"
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Signals */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">Recent Live Signals</h2>
            <Link to="/signals">
              <Button variant="ghost" size="sm" className="text-primary">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recentSignals.map((signal, i) => (
              <SignalCard key={signal.id} signal={signal} index={i} />
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </h2>
            <Link to="/notifications">
              <Button variant="ghost" size="sm" className="text-primary">
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {unreadNotifications.length > 0 ? (
              unreadNotifications.map((notification, i) => (
                <NotificationCard key={notification.id} notification={notification} index={i} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No new notifications</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/signals" className="block">
            <div className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-center group">
              <Radio className="h-6 w-6 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-foreground">Live Signals</p>
            </div>
          </Link>
          <Link to="/analysis" className="block">
            <div className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-center group">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-success group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-foreground">Analysis</p>
            </div>
          </Link>
          <Link to="/support" className="block">
            <div className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-center group">
              <Headphones className="h-6 w-6 mx-auto mb-2 text-accent group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-foreground">Support</p>
            </div>
          </Link>
          <Link to="/subscription" className="block">
            <div className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-center group">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-warning group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-foreground">Subscription</p>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

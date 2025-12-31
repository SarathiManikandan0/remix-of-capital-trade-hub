import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Radio,
  TrendingUp,
  BookOpen,
  CreditCard,
  Headphones,
  Receipt,
  Bell,
  Settings,
  ChevronLeft,
  LogOut,
  Crown,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { currentUser } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/signals', label: 'Live Signals', icon: Radio },
  { path: '/analysis', label: 'Market Analysis', icon: TrendingUp },
  { path: '/courses', label: 'Tools & Courses', icon: BookOpen },
  { path: '/subscription', label: 'My Subscription', icon: CreditCard },
  { path: '/support', label: 'Support & Tickets', icon: Headphones },
  { path: '/payments', label: 'Payments & History', icon: Receipt },
  { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/community', label: 'Community', icon: Users },
  { path: '/settings', label: 'Profile & Settings', icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const tierColors = {
    student: 'text-primary',
    beginner: 'text-accent',
    elite: 'text-amber-400',
  };

  const handleAvatarClick = () => {
    navigate('/settings');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen sticky top-0 bg-sidebar border-r border-sidebar-border flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <span className="font-display font-bold text-primary-foreground">D</span>
                </div>
                <span className="font-display font-bold text-lg text-foreground">D-TRADING</span>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
          </Button>
        </div>
      </div>

      {/* User Profile */}
      <div className={cn("p-4 border-b border-sidebar-border", collapsed && "px-2")}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <motion.div
            onClick={handleAvatarClick}
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer relative group"
          >
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-60 group-hover:opacity-100 group-hover:bg-primary/30 transition-all duration-300" />
            <Avatar className="relative h-10 w-10 border-2 border-primary/50 group-hover:border-primary transition-all duration-300 ring-2 ring-primary/20 group-hover:ring-primary/40 ring-offset-2 ring-offset-sidebar">
              <AvatarFallback className="bg-secondary text-foreground font-semibold">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="font-semibold text-foreground truncate">{currentUser.name}</p>
                <div 
                  className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={handleAvatarClick}
                >
                  <Crown className={cn("h-3 w-3", tierColors[currentUser.tier])} />
                  <span className={cn("text-xs font-medium capitalize", tierColors[currentUser.tier])}>
                    {currentUser.tier} Member
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    "hover:bg-sidebar-accent group relative",
                    isActive && "bg-primary/10 text-primary",
                    !isActive && "text-sidebar-foreground hover:text-foreground",
                    collapsed && "justify-center px-2"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary"
                    />
                  )}
                  <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary")} />
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10",
            collapsed ? "px-2" : "justify-start"
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </motion.aside>
  );
}

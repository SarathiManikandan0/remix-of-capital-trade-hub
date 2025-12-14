import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Palette,
  TrendingUp,
  FileText,
  Headphones,
  LogOut,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { currentUser } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface SettingSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function SettingSection({ title, icon, children }: SettingSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-secondary">{icon}</div>
        <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

export default function ProfileSettings() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-foreground">Profile & Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences</p>
      </motion.div>

      {/* Personal Info */}
      <SettingSection title="Personal Information" icon={<User className="h-5 w-5 text-primary" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input defaultValue={currentUser.name} className="bg-secondary/50" />
          </div>
          <div className="space-y-2">
            <Label>Email Address</Label>
            <div className="relative">
              <Input defaultValue={currentUser.email} className="bg-secondary/50 pr-20" />
              <Badge className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary/20 text-primary">
                {currentUser.tier.toUpperCase()}
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input defaultValue={currentUser.phone} className="bg-secondary/50" />
          </div>
        </div>
      </SettingSection>

      {/* Notification Preferences */}
      <SettingSection title="Notification Preferences" icon={<Bell className="h-5 w-5 text-primary" />}>
        <div className="space-y-4">
          {[
            { label: 'Live Signal Emails', description: 'Get notified when new signals are posted' },
            { label: 'Market Update Emails', description: 'Daily market analysis and updates' },
            { label: 'Subscription Reminders', description: 'Renewal and expiry notifications' },
            { label: 'Webinar Reminders', description: 'Upcoming webinar notifications' },
            { label: 'Push Notifications', description: 'In-app push notifications' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Switch defaultChecked={i < 3} />
            </div>
          ))}
        </div>
      </SettingSection>

      {/* Trading Preferences */}
      <SettingSection title="Trading Preferences" icon={<TrendingUp className="h-5 w-5 text-primary" />}>
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Risk Level</Label>
            <div className="flex gap-3">
              {['Low', 'Medium', 'High'].map((level) => (
                <Button
                  key={level}
                  variant={level === 'Medium' ? 'default' : 'outline'}
                  className={cn(
                    level === 'Medium' && 'gradient-primary text-primary-foreground'
                  )}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Default Lot Size</Label>
            <Select defaultValue="0.1">
              <SelectTrigger className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.01">0.01</SelectItem>
                <SelectItem value="0.1">0.1</SelectItem>
                <SelectItem value="0.5">0.5</SelectItem>
                <SelectItem value="1.0">1.0</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Max Copy/Auto Loss Limit (USD)</Label>
              <span className="text-sm text-muted-foreground">$500</span>
            </div>
            <Slider defaultValue={[500]} max={2000} step={50} />
          </div>
        </div>
      </SettingSection>

      {/* Security */}
      <SettingSection title="Security" icon={<Shield className="h-5 w-5 text-primary" />}>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-foreground">Change Password</p>
              <p className="text-sm text-muted-foreground">Update your account password</p>
            </div>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Separator className="bg-border" />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-foreground">Two-Factor Authentication (2FA)</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Switch />
          </div>
          <Separator className="bg-border" />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-foreground">Logout All Devices</p>
              <p className="text-sm text-muted-foreground">Sign out from all active sessions</p>
            </div>
            <Button variant="outline" size="sm">
              Logout All
            </Button>
          </div>
        </div>
      </SettingSection>

      {/* Billing */}
      <SettingSection title="Billing" icon={<CreditCard className="h-5 w-5 text-primary" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-sm text-muted-foreground">Currency</p>
            <p className="font-semibold text-foreground">USD ($)</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-sm text-muted-foreground">Current Plan</p>
            <p className="font-semibold text-foreground capitalize">{currentUser.tier}</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-sm text-muted-foreground">Next Billing</p>
            <p className="font-semibold text-foreground">Dec 31, 2025</p>
          </div>
        </div>
        <Button variant="outline" className="mt-4">View Billing History</Button>
      </SettingSection>

      {/* Preferences */}
      <SettingSection title="Preferences" icon={<Globe className="h-5 w-5 text-primary" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Language</Label>
            <Select defaultValue="en">
              <SelectTrigger className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Time Zone</Label>
            <Select defaultValue="utc">
              <SelectTrigger className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="est">EST</SelectItem>
                <SelectItem value="pst">PST</SelectItem>
                <SelectItem value="ist">IST</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Theme Mode</Label>
            <Select defaultValue="dark">
              <SelectTrigger className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SettingSection>

      {/* Legal & Support */}
      <SettingSection title="Legal" icon={<FileText className="h-5 w-5 text-primary" />}>
        <div className="space-y-2">
          {[
            'Terms & Conditions',
            'Risk Disclosure',
            'Refund Policy',
            'Privacy Policy',
          ].map((item) => (
            <Button key={item} variant="ghost" className="w-full justify-between">
              {item}
              <ChevronRight className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </SettingSection>

      {/* Account Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-destructive/30 bg-destructive/5 p-6"
      >
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">Danger Zone</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
          <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10">
            Cancel Subscription
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Warning: Deleting your account is permanent and cannot be undone.
        </p>
      </motion.div>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Clock, Star, RefreshCw } from 'lucide-react';
import { PricingCard } from '@/components/subscription/PricingCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { plans, currentUser } from '@/data/mockData';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

export default function MySubscription() {
  const [isYearly, setIsYearly] = useState(false);
  const currentPlan = plans.find(p => p.id === currentUser.tier);
  const daysUntilExpiry = differenceInDays(new Date(currentUser.subscriptionExpiry), new Date());

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          My Subscription
        </h1>
        <p className="text-muted-foreground mt-1">Manage your plan and billing</p>
      </motion.div>

      {/* Current Plan Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-accent/5 p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="gradient-primary text-primary-foreground border-0 px-3 py-1">
                Current Plan
              </Badge>
              <Badge variant="outline" className="border-success/30 text-success">
                Active
              </Badge>
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-1">
              {currentPlan?.name}
            </h2>
            <p className="text-muted-foreground">${currentPlan?.price}/month</p>
            <p className="text-sm text-muted-foreground mt-2">
              Renews on {format(new Date(currentUser.subscriptionExpiry), 'MMMM dd, yyyy')}
            </p>
            {daysUntilExpiry <= 7 && (
              <Badge className="mt-2 bg-warning/20 text-warning border-0">
                Expires in {daysUntilExpiry} days
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button className="gradient-primary text-primary-foreground">
              <RefreshCw className="h-4 w-4 mr-2" />
              Renew Now
            </Button>
            <Button variant="outline">Request Refund</Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-foreground">{daysUntilExpiry}</p>
            <p className="text-sm text-muted-foreground">Days Remaining</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-success">Active</p>
            <p className="text-sm text-muted-foreground">Auto-Renew</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-foreground">5</p>
            <p className="text-sm text-muted-foreground">Signals Today</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-foreground">24/7</p>
            <p className="text-sm text-muted-foreground">Support Access</p>
          </div>
        </div>
      </motion.div>

      {/* Billing Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center gap-4"
      >
        <Badge className="gradient-accent text-accent-foreground border-0 px-4 py-2">
          <Star className="h-4 w-4 mr-2" />
          2-Month Intro Offer - Save 17%
        </Badge>
        
        <div className="flex items-center gap-4">
          <Label htmlFor="billing" className={cn(!isYearly && "text-primary font-semibold")}>Monthly</Label>
          <Switch
            id="billing"
            checked={isYearly}
            onCheckedChange={setIsYearly}
          />
          <Label htmlFor="billing" className={cn(isYearly && "text-primary font-semibold")}>
            Yearly
            <span className="ml-1 text-success text-xs">(Save 17%)</span>
          </Label>
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <PricingCard key={plan.id} plan={plan} isYearly={isYearly} index={index} />
        ))}
      </div>

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-6 pt-6"
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <Shield className="h-5 w-5 text-success" />
          <span className="text-sm">14-Day Money-Back Guarantee</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CreditCard className="h-5 w-5 text-primary" />
          <span className="text-sm">Secure Payment via Stripe</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-5 w-5 text-accent" />
          <span className="text-sm">24/7 Support Response SLA</span>
        </div>
      </motion.div>
    </div>
  );
}

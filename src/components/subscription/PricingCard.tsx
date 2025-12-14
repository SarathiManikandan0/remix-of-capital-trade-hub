import { motion } from 'framer-motion';
import { Check, Crown, Zap, GraduationCap } from 'lucide-react';
import { Plan } from '@/types';
import { currentUser } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PricingCardProps {
  plan: Plan;
  isYearly?: boolean;
  index?: number;
}

const iconMap = {
  GraduationCap: GraduationCap,
  Zap: Zap,
  Crown: Crown,
};

export function PricingCard({ plan, isYearly = false, index = 0 }: PricingCardProps) {
  const isCurrentPlan = currentUser.tier === plan.id;
  const price = isYearly ? plan.yearlyPrice : plan.price;
  const Icon = iconMap[plan.icon as keyof typeof iconMap] || Zap;

  const isPopular = plan.id === 'beginner';
  const isElite = plan.id === 'elite';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "relative rounded-2xl border p-6 flex flex-col",
        isPopular && "border-primary/50 shadow-glow-primary",
        isElite && "border-accent/50 shadow-glow-accent",
        !isPopular && !isElite && "border-border",
        "bg-card"
      )}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground border-0 px-4">
          Most Popular
        </Badge>
      )}

      {isElite && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-accent text-accent-foreground border-0 px-4">
          Elite
        </Badge>
      )}

      {/* Icon */}
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
        isPopular && "gradient-primary",
        isElite && "gradient-accent",
        !isPopular && !isElite && "bg-secondary"
      )}>
        <Icon className={cn(
          "h-6 w-6",
          isPopular ? "text-primary-foreground" : isElite ? "text-accent-foreground" : "text-foreground"
        )} />
      </div>

      {/* Plan Name */}
      <h3 className="font-display text-xl font-bold text-foreground mb-1">{plan.name}</h3>
      <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-display font-bold text-foreground">${price}</span>
          <span className="text-muted-foreground">/{isYearly ? 'year' : 'month'}</span>
        </div>
        {isYearly && (
          <p className="text-sm text-success mt-1">Save 17% with yearly billing</p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-6 flex-1">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-sm text-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      {isCurrentPlan ? (
        <Button disabled className="w-full bg-secondary text-muted-foreground">
          Current Plan
        </Button>
      ) : (
        <Button
          className={cn(
            "w-full",
            isPopular && "gradient-primary text-primary-foreground hover:opacity-90",
            isElite && "gradient-accent text-accent-foreground hover:opacity-90",
            !isPopular && !isElite && "bg-secondary text-foreground hover:bg-secondary/80"
          )}
        >
          {currentUser.tier === 'elite' ? 'Downgrade' : `Join the ${plan.name.split(' ')[0]}`}
        </Button>
      )}

      {/* Footer */}
      <p className="text-xs text-center text-muted-foreground mt-4">
        {isPopular ? 'Most traders choose this plan' : isElite ? 'For serious wealth builders' : 'Perfect for learning the ropes'}
      </p>
    </motion.div>
  );
}

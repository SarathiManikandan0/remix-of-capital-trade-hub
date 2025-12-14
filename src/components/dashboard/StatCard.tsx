import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning';
  className?: string;
}

const variantStyles = {
  default: 'bg-card border-border',
  primary: 'bg-primary/10 border-primary/20',
  accent: 'bg-accent/10 border-accent/20',
  success: 'bg-success/10 border-success/20',
  warning: 'bg-warning/10 border-warning/20',
};

const iconVariantStyles = {
  default: 'bg-secondary text-foreground',
  primary: 'bg-primary/20 text-primary',
  accent: 'bg-accent/20 text-accent',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
};

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-xl border p-5",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-display font-bold text-foreground">{value}</p>
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn("p-2.5 rounded-lg", iconVariantStyles[variant])}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

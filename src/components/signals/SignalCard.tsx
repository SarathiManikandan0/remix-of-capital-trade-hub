import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Lock } from 'lucide-react';
import { Signal } from '@/types';
import { currentUser } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SignalCardProps {
  signal: Signal;
  index?: number;
}

const tierOrder = { student: 1, beginner: 2, elite: 3 };

const riskColors = {
  low: 'bg-success/20 text-success border-success/30',
  medium: 'bg-warning/20 text-warning border-warning/30',
  high: 'bg-destructive/20 text-destructive border-destructive/30',
};

const statusColors = {
  active: 'bg-success/20 text-success',
  closed: 'bg-muted text-muted-foreground',
  pending: 'bg-warning/20 text-warning',
};

export function SignalCard({ signal, index = 0 }: SignalCardProps) {
  const navigate = useNavigate();
  const userTierLevel = tierOrder[currentUser.tier];
  const signalTierLevel = tierOrder[signal.tier];
  const isLocked = signalTierLevel > userTierLevel;

  const handleUpgradeClick = () => {
    navigate('/subscription#plans');
  };

  const formatPrice = (price: number) => {
    if (price < 10) return price.toFixed(4);
    if (price < 1000) return price.toFixed(2);
    return price.toLocaleString();
  };

  const getTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (hours < 1) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (isLocked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="relative rounded-xl border border-border bg-card/50 p-5 overflow-hidden"
      >
        {/* Blurred placeholder content */}
        <div className="opacity-30 blur-[2px] select-none pointer-events-none">
          <div className="flex items-center justify-between mb-4">
            <span className="font-display font-semibold">{signal.pair}</span>
            <Badge variant="outline">Locked</Badge>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Entry</span>
              <span className="font-mono font-medium text-foreground">••••••</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Stop Loss</span>
              <span className="font-mono font-medium text-destructive">••••••</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Targets</span>
              <span className="font-mono font-medium text-success">••••••</span>
            </div>
          </div>
        </div>
        
        {/* Lock overlay */}
        <div className="absolute inset-0 bg-background/40 flex flex-col items-center justify-center z-10">
          <Lock className="h-8 w-8 text-muted-foreground mb-2" />
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm text-muted-foreground font-medium">
              {signal.tier.toUpperCase()} Signal
            </p>
            {currentUser.tier === 'beginner' && (
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-xs">
                Beginner
              </Badge>
            )}
          </div>
          <Button size="sm" className="mt-3 gradient-primary text-primary-foreground" onClick={handleUpgradeClick}>
            Upgrade to Unlock
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              signal.type === 'buy' ? "bg-success/20" : "bg-destructive/20"
            )}
          >
            {signal.type === 'buy' ? (
              <TrendingUp className="h-5 w-5 text-success" />
            ) : (
              <TrendingDown className="h-5 w-5 text-destructive" />
            )}
          </div>
          <div>
            <p className="font-display font-semibold text-foreground">{signal.pair}</p>
            <p className="text-xs text-muted-foreground">{getTimeAgo(signal.createdAt)}</p>
          </div>
        </div>
        <Badge className={cn("uppercase font-semibold", statusColors[signal.status])}>
          {signal.status}
        </Badge>
      </div>

      {/* Signal Type */}
      <div className="mb-4">
        <span
          className={cn(
            "inline-block px-3 py-1 rounded-md text-sm font-bold uppercase",
            signal.type === 'buy'
              ? "bg-success/20 text-success"
              : "bg-destructive/20 text-destructive"
          )}
        >
          {signal.type}
        </span>
      </div>

      {/* Price Levels */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Entry</span>
          <span className="font-mono font-medium text-foreground">{formatPrice(signal.entry)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Stop Loss</span>
          <span className="font-mono font-medium text-destructive">{formatPrice(signal.stopLoss)}</span>
        </div>
        {signal.takeProfit.map((tp, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-muted-foreground">TP{i + 1}</span>
            <span className="font-mono font-medium text-success">{formatPrice(tp)}</span>
          </div>
        ))}
      </div>

      {/* Risk Level */}
      <div className="flex items-center justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className={cn("capitalize border cursor-help", riskColors[signal.riskLevel])}>
                {signal.riskLevel} Risk
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="bg-popover text-popover-foreground border-border">
              <p className="text-sm">
                {signal.riskLevel === 'low' && 'Conservative risk-reward setup'}
                {signal.riskLevel === 'medium' && 'Balanced risk-reward setup'}
                {signal.riskLevel === 'high' && 'Aggressive risk-reward setup'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {signal.tier !== 'student' && (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 uppercase text-xs">
            {signal.tier}
          </Badge>
        )}
      </div>
    </motion.div>
  );
}

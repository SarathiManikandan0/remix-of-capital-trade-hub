import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Radio } from 'lucide-react';
import { SignalCard } from '@/components/signals/SignalCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { signals } from '@/data/mockData';

type Market = 'crypto' | 'forex' | 'stocks';
type RiskLevel = 'all' | 'low' | 'medium' | 'high';
type Status = 'all' | 'active' | 'closed' | 'pending';

export default function LiveSignals() {
  const [activeMarket, setActiveMarket] = useState<Market>('crypto');
  const [riskFilter, setRiskFilter] = useState<RiskLevel>('all');
  const [statusFilter, setStatusFilter] = useState<Status>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSignals = useMemo(() => {
    return signals.filter(signal => {
      if (signal.market !== activeMarket) return false;
      if (riskFilter !== 'all' && signal.riskLevel !== riskFilter) return false;
      if (statusFilter !== 'all' && signal.status !== statusFilter) return false;
      if (searchQuery && !signal.pair.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [activeMarket, riskFilter, statusFilter, searchQuery]);

  const marketSignalCounts = {
    crypto: signals.filter(s => s.market === 'crypto').length,
    forex: signals.filter(s => s.market === 'forex').length,
    stocks: signals.filter(s => s.market === 'stocks').length,
  };

  const activeSignalsCount = filteredSignals.filter(s => s.status === 'active').length;

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
            <Radio className="h-6 w-6 text-primary" />
            Live Signals
          </h1>
          <p className="text-muted-foreground mt-1">Real-time trading signals across all markets</p>
        </div>
        <Badge className="gradient-success text-success-foreground border-0 px-4 py-2 self-start">
          <span className="w-2 h-2 rounded-full bg-success-foreground animate-pulse mr-2" />
          {activeSignalsCount} Active Signals
        </Badge>
      </motion.div>

      {/* Market Tabs */}
      <Tabs value={activeMarket} onValueChange={(v) => setActiveMarket(v as Market)}>
        <TabsList className="bg-secondary/50 border border-border p-1">
          <TabsTrigger value="crypto" className="data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
            Crypto
            <Badge variant="secondary" className="ml-2 bg-background/20">{marketSignalCounts.crypto}</Badge>
          </TabsTrigger>
          <TabsTrigger value="forex" className="data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
            Forex
            <Badge variant="secondary" className="ml-2 bg-background/20">{marketSignalCounts.forex}</Badge>
          </TabsTrigger>
          <TabsTrigger value="stocks" className="data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
            Stocks
            <Badge variant="secondary" className="ml-2 bg-background/20">{marketSignalCounts.stocks}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mt-6 p-4 rounded-xl bg-card border border-border"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by pair..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary/50 border-border"
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={riskFilter} onValueChange={(v) => setRiskFilter(v as RiskLevel)}>
              <SelectTrigger className="w-[140px] bg-secondary/50 border-border">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as Status)}>
              <SelectTrigger className="w-[140px] bg-secondary/50 border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Signal Grid */}
        <TabsContent value={activeMarket} className="mt-6">
          {filteredSignals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSignals.map((signal, index) => (
                <SignalCard key={signal.id} signal={signal} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Radio className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No signals found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or check back later</p>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

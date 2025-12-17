import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Lock, Eye, BarChart2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { marketAnalyses, currentUser } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const tierOrder = { student: 1, beginner: 2, elite: 3 };

const sentimentConfig = {
  bullish: { icon: TrendingUp, color: 'text-success', bg: 'bg-success/20' },
  bearish: { icon: TrendingDown, color: 'text-destructive', bg: 'bg-destructive/20' },
  neutral: { icon: Minus, color: 'text-muted-foreground', bg: 'bg-muted' },
};

// Asset categorization helpers
const cryptoAssets = ['BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'DOT', 'DOGE', 'AVAX', 'LINK', 'MATIC'];
const isCrypto = (asset: string) => cryptoAssets.some(c => asset.toUpperCase().includes(c));
const isForex = (asset: string) => asset.includes('/') && !isCrypto(asset);
const isStock = (asset: string) => !isCrypto(asset) && !isForex(asset);

const filterAnalysesByTab = (analyses: typeof marketAnalyses, tab: string) => {
  switch (tab) {
    case 'crypto':
      return analyses.filter(a => isCrypto(a.asset));
    case 'forex':
      return analyses.filter(a => isForex(a.asset));
    case 'stocks':
      return analyses.filter(a => isStock(a.asset));
    default:
      return analyses;
  }
};

export default function MarketAnalysis() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const userTierLevel = tierOrder[currentUser.tier];

  const handleUpgradeClick = () => {
    navigate('/subscription#plans');
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
            <BarChart2 className="h-6 w-6 text-primary" />
            Market Analysis
          </h1>
          <p className="text-muted-foreground mt-1">Expert insights and market commentary</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/50 border border-border p-1">
          <TabsTrigger value="all" className="data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
            All Markets
          </TabsTrigger>
          <TabsTrigger value="crypto" className="data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
            Crypto
          </TabsTrigger>
          <TabsTrigger value="forex" className="data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
            Forex
          </TabsTrigger>
          <TabsTrigger value="stocks" className="data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
            Stocks
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterAnalysesByTab(marketAnalyses, activeTab).map((analysis, index) => {
              const isLocked = tierOrder[analysis.tier] > userTierLevel;
              const sentiment = sentimentConfig[analysis.sentiment];
              const SentimentIcon = sentiment.icon;

              return (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "rounded-xl border bg-card overflow-hidden group hover:border-primary/30 transition-all",
                    isLocked && "relative"
                  )}
                >
                  {/* Analysis Image Placeholder */}
                  <div className="h-40 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                    <BarChart2 className="h-12 w-12 text-muted-foreground/50" />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={cn("capitalize", sentiment.bg, sentiment.color)}>
                        <SentimentIcon className="h-3 w-3 mr-1" />
                        {analysis.sentiment}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{analysis.asset}</Badge>
                      {analysis.tier !== 'student' && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 uppercase text-xs">
                          {analysis.tier}
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-display font-semibold text-lg text-foreground mb-2 line-clamp-2">
                      {analysis.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {analysis.content}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" /> {analysis.views}
                        </span>
                        <span>{analysis.engagement}% engagement</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  {/* Locked Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 backdrop-blur-sm bg-background/70 flex flex-col items-center justify-center">
                      <Lock className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground font-medium mb-3">
                        {analysis.tier.toUpperCase()} Content
                      </p>
                      <Button size="sm" className="gradient-primary text-primary-foreground" onClick={handleUpgradeClick}>
                        Upgrade to Unlock
                      </Button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Megaphone, MessageSquare, Radio, Send, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { currentUser } from '@/data/mockData';

interface Announcement {
  id: string;
  title: string;
  description: string;
  timestamp: string;
}

interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  userTier: 'free' | 'vip' | 'elite';
  message: string;
  timestamp: string;
}

interface ChatRoom {
  id: string;
  name: string;
  icon: string;
  onlineCount: number;
}

const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'New Trading Strategy Course Available',
    description: 'We have just released a comprehensive course on advanced trading strategies. Check it out in the Tools & Courses section!',
    timestamp: '2 hours ago',
  },
  {
    id: 'ann-2',
    title: 'Platform Maintenance Notice',
    description: 'Scheduled maintenance will occur this Saturday from 2 AM to 4 AM UTC. Live signals will be paused during this time.',
    timestamp: '1 day ago',
  },
  {
    id: 'ann-3',
    title: 'Weekly Market Analysis Now Live',
    description: 'Our team has published the weekly market analysis covering major pairs and upcoming economic events.',
    timestamp: '3 days ago',
  },
];

const chatRooms: ChatRoom[] = [
  { id: 'general', name: 'General', icon: '💬', onlineCount: 47 },
  { id: 'forex', name: 'Forex Traders', icon: '💹', onlineCount: 23 },
  { id: 'crypto', name: 'Crypto Traders', icon: '₿', onlineCount: 31 },
  { id: 'stocks', name: 'Stock Traders', icon: '📈', onlineCount: 18 },
  { id: 'elite', name: 'Elite Lounge', icon: '👑', onlineCount: 12 },
];

const initialMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    roomId: 'general',
    userId: 'u1',
    userName: 'Alex Morgan',
    userTier: 'elite',
    message: 'Good morning everyone! Markets are looking interesting today.',
    timestamp: '9:15 AM',
  },
  {
    id: 'msg-2',
    roomId: 'general',
    userId: 'u2',
    userName: 'Sarah Chen',
    userTier: 'vip',
    message: 'Hey Alex! Yeah, I noticed the volatility picking up on EUR/USD.',
    timestamp: '9:18 AM',
  },
  {
    id: 'msg-3',
    roomId: 'general',
    userId: 'u3',
    userName: 'Mike Johnson',
    userTier: 'free',
    message: 'Anyone else watching the BTC price action right now?',
    timestamp: '9:22 AM',
  },
  {
    id: 'msg-4',
    roomId: 'general',
    userId: 'u1',
    userName: 'Alex Morgan',
    userTier: 'elite',
    message: 'The signals have been pretty accurate this week. Made some solid gains on the GBP/JPY trade.',
    timestamp: '9:25 AM',
  },
  {
    id: 'msg-5',
    roomId: 'general',
    userId: 'u4',
    userName: 'Emma Wilson',
    userTier: 'vip',
    message: 'Welcome to the new members joining us today! Feel free to ask any questions.',
    timestamp: '9:30 AM',
  },
  {
    id: 'msg-6',
    roomId: 'forex',
    userId: 'u2',
    userName: 'Sarah Chen',
    userTier: 'vip',
    message: 'The NFP data release is coming up. Everyone ready?',
    timestamp: '9:45 AM',
  },
  {
    id: 'msg-7',
    roomId: 'forex',
    userId: 'u5',
    userName: 'David Lee',
    userTier: 'elite',
    message: 'I\'m positioned for a potential USD strength. What are your thoughts?',
    timestamp: '9:48 AM',
  },
  {
    id: 'msg-8',
    roomId: 'crypto',
    userId: 'u3',
    userName: 'Mike Johnson',
    userTier: 'free',
    message: 'ETH looking bullish on the 4H chart. Breaking resistance soon?',
    timestamp: '10:00 AM',
  },
  {
    id: 'msg-9',
    roomId: 'crypto',
    userId: 'u6',
    userName: 'Lisa Park',
    userTier: 'elite',
    message: 'Be careful with leverage in this market. Volatility is high.',
    timestamp: '10:05 AM',
  },
  {
    id: 'msg-10',
    roomId: 'stocks',
    userId: 'u7',
    userName: 'James Brown',
    userTier: 'vip',
    message: 'Tech earnings coming up next week. Expecting some big moves.',
    timestamp: '10:15 AM',
  },
  {
    id: 'msg-11',
    roomId: 'elite',
    userId: 'u1',
    userName: 'Alex Morgan',
    userTier: 'elite',
    message: 'Private strategy session at 3 PM UTC. Don\'t miss it!',
    timestamp: '10:30 AM',
  },
];

const tierColors: Record<string, string> = {
  free: 'bg-muted/50 text-muted-foreground border-muted',
  vip: 'bg-primary/20 text-primary border-primary/30',
  elite: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

export default function Community() {
  const [activeTab, setActiveTab] = useState('community');
  const [selectedRoom, setSelectedRoom] = useState('general');
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const roomMessages = messages.filter(m => m.roomId === selectedRoom);
  const currentRoom = chatRooms.find(r => r.id === selectedRoom);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [roomMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tierMap: Record<string, 'free' | 'vip' | 'elite'> = {
      student: 'free',
      beginner: 'vip',
      elite: 'elite',
    };

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      roomId: selectedRoom,
      userId: 'current',
      userName: currentUser.name,
      userTier: tierMap[currentUser.tier] || 'free',
      message: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
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
            <Users className="h-6 w-6 text-primary" />
            Community
          </h1>
          <p className="text-muted-foreground mt-1">Connect, learn, and grow with fellow traders</p>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full sm:w-auto bg-secondary/50 border border-border p-1 rounded-xl">
          <TabsTrigger 
            value="live-chat" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-lg px-4 py-2"
          >
            <MessageSquare className="h-4 w-4" />
            Live Chat
          </TabsTrigger>
          <TabsTrigger 
            value="broadcast" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-lg px-4 py-2"
          >
            <Radio className="h-4 w-4" />
            Broadcast
          </TabsTrigger>
          <TabsTrigger 
            value="community" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-lg px-4 py-2"
          >
            <Users className="h-4 w-4" />
            Community
          </TabsTrigger>
        </TabsList>

        {/* Live Chat Tab - Coming Soon */}
        <TabsContent value="live-chat" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Card className="bg-card border-border max-w-md w-full">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="h-10 w-10 text-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-3">Live Chat</h2>
                <p className="text-muted-foreground mb-6">This feature will be available soon</p>
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 text-sm px-4 py-1">
                  Coming Soon
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Broadcast Tab - Read-Only Announcements */}
        <TabsContent value="broadcast" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Megaphone className="h-5 w-5 text-accent" />
              <h2 className="font-display text-lg font-semibold text-foreground">Announcements</h2>
            </div>
            <div className="space-y-4">
              {initialAnnouncements.map((ann) => (
                <Card key={ann.id} className="bg-card border-border">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-accent/20 text-accent border-accent/30">Announcement</Badge>
                        <span className="text-xs text-muted-foreground">{ann.timestamp}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{ann.title}</h3>
                    <p className="text-sm text-muted-foreground">{ann.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* Community Tab - Chat Rooms */}
        <TabsContent value="community" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[600px]">
              {/* Rooms Sidebar */}
              <div className="lg:col-span-1">
                <Card className="bg-card border-border h-full">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-4 px-2 pt-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold text-foreground text-sm">Community Rooms</h3>
                    </div>
                    <div className="space-y-1">
                      {chatRooms.map((room) => (
                        <button
                          key={room.id}
                          onClick={() => setSelectedRoom(room.id)}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all",
                            selectedRoom === room.id
                              ? "bg-primary/20 border border-primary/30"
                              : "hover:bg-secondary/50"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{room.icon}</span>
                            <span className={cn(
                              "text-sm font-medium",
                              selectedRoom === room.id ? "text-primary" : "text-foreground"
                            )}>
                              {room.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs text-muted-foreground">{room.onlineCount}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chat Area */}
              <div className="lg:col-span-3">
                <Card className="bg-card border-border h-full flex flex-col">
                  {/* Chat Header */}
                  <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                    <span className="text-lg">{currentRoom?.icon}</span>
                    <h3 className="font-semibold text-foreground">{currentRoom?.name}</h3>
                    <div className="flex items-center gap-1 ml-auto">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs text-muted-foreground">{currentRoom?.onlineCount} online</span>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 px-4">
                    <div className="py-4 space-y-4">
                      {roomMessages.map((msg) => (
                        <div key={msg.id} className="flex items-start gap-3">
                          <Avatar className="h-9 w-9 border border-border flex-shrink-0">
                            <AvatarFallback className="bg-secondary text-foreground text-xs">
                              {msg.userName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-foreground text-sm">{msg.userName}</span>
                              <Badge variant="outline" className={cn("text-[10px] uppercase px-1.5 py-0", tierColors[msg.userTier])}>
                                {msg.userTier}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                            </div>
                            <p className="text-sm text-foreground/90 mt-0.5">{msg.message}</p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={`Message #${currentRoom?.name.toLowerCase().replace(' ', '-')}`}
                        className="bg-secondary/50 border-border flex-1"
                      />
                      <Button type="submit" size="icon" className="gradient-primary text-primary-foreground shrink-0">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

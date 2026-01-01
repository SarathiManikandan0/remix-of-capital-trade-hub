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
import EmojiPicker from '@/components/chat/EmojiPicker';
import ImageAttachment, { ImagePreview } from '@/components/chat/ImageAttachment';

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
  imageUrl?: string;
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
  const [selectedImage, setSelectedImage] = useState<{ file: File; preview: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (!newMessage.trim() && !selectedImage) return;

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
      imageUrl: selectedImage?.preview,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setSelectedImage(null);
  };

  const handleEmojiSelect = (emoji: string) => {
    const input = inputRef.current;
    if (input) {
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const newValue = newMessage.slice(0, start) + emoji + newMessage.slice(end);
      setNewMessage(newValue);
      // Focus back and set cursor position after emoji
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    } else {
      setNewMessage(prev => prev + emoji);
    }
  };

  const handleImageSelect = (file: File) => {
    const preview = URL.createObjectURL(file);
    setSelectedImage({ file, preview });
  };

  const handleRemoveImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.preview);
      setSelectedImage(null);
    }
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

        {/* Community Tab - Coming Soon */}
        <TabsContent value="community" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Card className="bg-card border-border max-w-md w-full">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-3">Community</h2>
                <p className="text-muted-foreground mb-6">This feature will be available soon</p>
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 text-sm px-4 py-1 cursor-not-allowed">
                  Coming Soon
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

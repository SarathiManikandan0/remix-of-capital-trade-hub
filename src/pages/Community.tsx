import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Megaphone, ThumbsUp, MessageCircle, Filter, MessageSquare, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { currentUser } from '@/data/mockData';

interface Announcement {
  id: string;
  title: string;
  description: string;
  timestamp: string;
}

interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userTier: 'free' | 'vip' | 'elite';
  title: string;
  category: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  liked: boolean;
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

const initialPosts: CommunityPost[] = [
  {
    id: 'post-1',
    userId: 'u1',
    userName: 'Alex Morgan',
    userTier: 'elite',
    title: 'My experience with the BTC/USDT signals',
    category: 'signals',
    content: 'Just wanted to share my results from following the BTC signals this week. The accuracy has been incredible! What strategies are you all using for risk management?',
    timestamp: '30 minutes ago',
    likes: 24,
    comments: 8,
    liked: false,
  },
  {
    id: 'post-2',
    userId: 'u2',
    userName: 'Sarah Chen',
    userTier: 'vip',
    title: 'Best practices for position sizing?',
    category: 'strategies',
    content: 'Looking for advice on position sizing. I currently use 2% risk per trade but wondering if others have different approaches based on signal confidence levels.',
    timestamp: '2 hours ago',
    likes: 15,
    comments: 12,
    liked: true,
  },
  {
    id: 'post-3',
    userId: 'u3',
    userName: 'Mike Johnson',
    userTier: 'free',
    title: 'New to trading - where to start?',
    category: 'beginner',
    content: 'Hi everyone! Just joined the platform and feeling a bit overwhelmed. Any recommendations for which courses to start with?',
    timestamp: '5 hours ago',
    likes: 32,
    comments: 18,
    liked: false,
  },
];

const categories = [
  { value: 'all', label: 'All Posts' },
  { value: 'strategies', label: 'Strategies' },
  { value: 'signals', label: 'Signals Discussion' },
  { value: 'beginner', label: 'Beginner Questions' },
  { value: 'general', label: 'General' },
];

const postCategories = [
  { value: 'general', label: 'General' },
  { value: 'strategies', label: 'Strategy' },
  { value: 'signals', label: 'Risk Management' },
  { value: 'beginner', label: 'Psychology' },
];

const tierColors: Record<string, string> = {
  free: 'bg-muted/50 text-muted-foreground border-muted',
  vip: 'bg-primary/20 text-primary border-primary/30',
  elite: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

export default function Community() {
  const [activeTab, setActiveTab] = useState('community');
  const [isOpen, setIsOpen] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [filter, setFilter] = useState('all');
  
  // Form state
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState('');
  const [postMessage, setPostMessage] = useState('');
  const [errors, setErrors] = useState<{ title?: string; category?: string; message?: string }>({});

  const filteredPosts = filter === 'all' ? posts : posts.filter(p => p.category === filter);

  const resetForm = () => {
    setPostTitle('');
    setPostCategory('');
    setPostMessage('');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: { title?: string; category?: string; message?: string } = {};
    if (!postTitle.trim()) newErrors.title = 'Title is required';
    if (!postCategory) newErrors.category = 'Please select a category';
    if (!postMessage.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const tierMap: Record<string, 'free' | 'vip' | 'elite'> = {
      student: 'free',
      beginner: 'vip',
      elite: 'elite',
    };

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      userId: 'current',
      userName: currentUser.name,
      userTier: tierMap[currentUser.tier] || 'free',
      title: postTitle.trim(),
      category: postCategory,
      content: postMessage.trim(),
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      liked: false,
    };

    setPosts(prev => [newPost, ...prev]);
    setIsOpen(false);
    resetForm();
    toast.success('Post created successfully!');
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const handleComment = (postId: string) => {
    toast.info('Comments coming soon!');
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
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-accent/20 text-accent border-accent/30">Announcement</Badge>
                        <span className="text-xs text-muted-foreground">{ann.timestamp}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold text-foreground mb-1">{ann.title}</h3>
                    <p className="text-sm text-muted-foreground">{ann.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* Community Tab - Discussion Feed */}
        <TabsContent value="community" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Create Post Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end"
              >
                <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
                  <DialogTrigger asChild>
                    <Button className="gradient-primary text-primary-foreground">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border">
                    <DialogHeader>
                      <DialogTitle className="font-display">Create New Post</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                      <div className="space-y-2">
                        <Label>Post Title</Label>
                        <Input
                          placeholder="Enter a title for your post"
                          className={cn("bg-secondary/50 border-border", errors.title && "border-destructive")}
                          value={postTitle}
                          onChange={(e) => setPostTitle(e.target.value)}
                        />
                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={postCategory} onValueChange={setPostCategory}>
                          <SelectTrigger className={cn("bg-secondary/50 border-border", errors.category && "border-destructive")}>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {postCategories.map(cat => (
                              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label>Message</Label>
                        <Textarea
                          placeholder="Share your thoughts..."
                          className={cn("bg-secondary/50 border-border min-h-[120px]", errors.message && "border-destructive")}
                          value={postMessage}
                          onChange={(e) => setPostMessage(e.target.value)}
                        />
                        {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button type="submit" className="gradient-primary text-primary-foreground">Post</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </motion.div>

              {/* Discussion Feed */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">Discussion Feed</h2>
                <div className="space-y-4">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <Card key={post.id} className="bg-card border-border">
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10 border border-border">
                              <AvatarFallback className="bg-secondary text-foreground text-sm">
                                {post.userName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-foreground">{post.userName}</span>
                                <Badge variant="outline" className={cn("text-xs uppercase", tierColors[post.userTier])}>
                                  {post.userTier}
                                </Badge>
                                <span className="text-xs text-muted-foreground">· {post.timestamp}</span>
                              </div>
                              <h4 className="font-medium text-foreground mt-1">{post.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{post.content}</p>
                              <div className="flex items-center gap-4 mt-3">
                                <button
                                  onClick={() => handleLike(post.id)}
                                  className={cn(
                                    "flex items-center gap-1.5 text-sm transition-colors",
                                    post.liked ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                  )}
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                  <span>{post.likes}</span>
                                </button>
                                <button
                                  onClick={() => handleComment(post.id)}
                                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{post.comments}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12 rounded-xl border border-border bg-card">
                      <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No posts yet</h3>
                      <p className="text-muted-foreground">Be the first to start a discussion!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar Filters */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                    <Filter className="h-4 w-4 text-primary" />
                    Categories
                  </h3>
                </CardHeader>
                <CardContent className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setFilter(cat.value)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                        filter === cat.value
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

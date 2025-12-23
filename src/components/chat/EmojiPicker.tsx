import { useState } from 'react';
import { Smile } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const emojiCategories = [
  {
    name: 'Smileys',
    emojis: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😍', '🥰', '😘', '😗', '😋', '😛', '😜', '🤪', '😎', '🤩', '🥳', '😏', '😒', '🙄', '😬', '😮', '🤐', '😯', '😴'],
  },
  {
    name: 'Gestures',
    emojis: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👋', '🖐️', '✋', '👏', '🙌', '👐', '🤲', '🙏', '💪', '🦾', '🖕', '✍️'],
  },
  {
    name: 'Hearts',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💔', '❣️', '💟', '♥️'],
  },
  {
    name: 'Finance',
    emojis: ['📈', '📉', '💰', '💵', '💴', '💶', '💷', '💸', '💳', '🏦', '💹', '📊', '🪙', '💎', '🏆', '🎯', '🚀', '⚡', '🔥', '✨'],
  },
  {
    name: 'Objects',
    emojis: ['⭐', '🌟', '✅', '❌', '⚠️', '🔔', '📌', '📍', '🎉', '🎊', '🎁', '🏅', '🥇', '🥈', '🥉', '⏰', '📱', '💻', '⌚', '📧'],
  },
];

export default function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary/70"
        >
          <Smile className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-72 p-0 bg-card border-border" 
        side="top" 
        align="start"
        sideOffset={8}
      >
        {/* Category Tabs */}
        <div className="flex border-b border-border p-1 gap-1">
          {emojiCategories.map((cat, idx) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(idx)}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                activeCategory === idx
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground hover:bg-secondary/50'
              }`}
            >
              {cat.emojis[0]}
            </button>
          ))}
        </div>
        
        {/* Emoji Grid */}
        <ScrollArea className="h-48">
          <div className="p-2">
            <p className="text-xs text-muted-foreground mb-2">{emojiCategories[activeCategory].name}</p>
            <div className="grid grid-cols-8 gap-1">
              {emojiCategories[activeCategory].emojis.map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => handleEmojiClick(emoji)}
                  className="text-lg p-1 rounded hover:bg-secondary/70 transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

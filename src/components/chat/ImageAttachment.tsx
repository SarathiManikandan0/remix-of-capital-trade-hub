import { useRef } from 'react';
import { ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageAttachmentProps {
  onImageSelect: (file: File) => void;
  selectedImage: { file: File; preview: string } | null;
  onRemoveImage: () => void;
}

export default function ImageAttachment({ 
  onImageSelect, 
  selectedImage, 
  onRemoveImage 
}: ImageAttachmentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (validTypes.includes(file.type)) {
        onImageSelect(file);
      }
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleClick}
        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary/70"
      >
        <ImageIcon className="h-5 w-5" />
      </Button>
    </>
  );
}

interface ImagePreviewProps {
  preview: string;
  onRemove: () => void;
}

export function ImagePreview({ preview, onRemove }: ImagePreviewProps) {
  return (
    <div className="relative inline-block">
      <img 
        src={preview} 
        alt="Attachment preview" 
        className="h-16 w-16 object-cover rounded-lg border border-border"
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-2 -right-2 h-5 w-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/80 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

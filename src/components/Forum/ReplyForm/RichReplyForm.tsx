// src/components/Forum/ReplyForm/RichReplyForm.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, List, Link, Image, Code, 
  Loader, X, Paperclip 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@heroui/react';
import styles from './RichReplyForm.module.scss';

interface RichReplyFormProps {
  onSubmit: (content: string, attachments?: File[]) => Promise<void>;
  isSubmitting: boolean;
  placeholder?: string;
  maxAttachments?: number;
}

interface Attachment {
  file: File;
  preview: string;
}

export function RichReplyForm({
  onSubmit,
  isSubmitting,
  placeholder = 'Write your reply...',
  maxAttachments = 3
}: RichReplyFormProps) {
  const { isAuthenticated } = useAuth();
  const editorRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Clean up attachment previews
    return () => {
      attachments.forEach(attachment => {
        if (attachment.preview.startsWith('blob:')) {
          URL.revokeObjectURL(attachment.preview);
        }
      });
    };
  }, [attachments]);

  const formatDoc = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      formatDoc('insertText', '    ');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (attachments.length + files.length > maxAttachments) {
      alert(`Maximum ${maxAttachments} files allowed`);
      return;
    }

    const newAttachments = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => {
      const newAttachments = [...prev];
      if (prev[index].preview.startsWith('blob:')) {
        URL.revokeObjectURL(prev[index].preview);
      }
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorRef.current || isSubmitting) return;

    const content = editorRef.current.innerHTML;
    if (!content.trim() && attachments.length === 0) return;

    await onSubmit(content, attachments.map(a => a.file));
    editorRef.current.innerHTML = '';
    setAttachments([]);
    setIsExpanded(false);
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.authPrompt}>
        Please sign in to reply to this topic.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.richReplyForm}>
      {isExpanded && (
        <div className={styles.toolbar}>
          <button type="button" onClick={() => formatDoc('bold')}>
            <Bold size={16} />
          </button>
          <button type="button" onClick={() => formatDoc('italic')}>
            <Italic size={16} />
          </button>
          <button type="button" onClick={() => formatDoc('insertUnorderedList')}>
            <List size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => {
              const url = prompt('Enter URL:');
              if (url) formatDoc('createLink', url);
            }}
          >
            <Link size={16} />
          </button>
          <button type="button" onClick={() => fileInputRef.current?.click()}>
            <Image size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => formatDoc('formatBlock', 'pre')}
          >
            <Code size={16} />
          </button>
        </div>
      )}

      <div
        ref={editorRef}
        className={`${styles.editor} ${isExpanded ? styles.expanded : ''}`}
        contentEditable
        onFocus={() => setIsExpanded(true)}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
      />

      {attachments.length > 0 && (
        <div className={styles.attachments}>
          {attachments.map((attachment, index) => (
            <div key={index} className={styles.attachmentPreview}>
              {attachment.file.type.startsWith('image/') ? (
                <img src={attachment.preview} alt="attachment" />
              ) : (
                <Paperclip size={24} />
              )}
              <button 
                type="button"
                onClick={() => removeAttachment(index)}
                className={styles.removeAttachment}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        accept="image/*,.pdf,.doc,.docx"
        style={{ display: 'none' }}
      />

      {isExpanded && (
        <div className={styles.formActions}>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setIsExpanded(false);
              editorRef.current!.innerHTML = '';
              setAttachments([]);
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader className={styles.spinner} size={16} />
                Submitting...
              </>
            ) : (
              'Submit Reply'
            )}
          </Button>
        </div>
      )}
    </form>
  );
}
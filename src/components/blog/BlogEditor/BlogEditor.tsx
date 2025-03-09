// src/components/Blog/BlogEditor.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from 'next-themes';
import axios from 'axios';
import { 
  X, Upload, Link as LinkIcon, Image as ImageIcon, 
  Info, AlertCircle, Check, Loader2 
} from 'lucide-react';
import { BlogCategory, BlogEditorProps } from '@/types/blog';
import styles from './BlogEditor.module.scss';
import clsx from 'clsx';

import type { BlogTag } from '@/types/blog';


interface Tag {
  id: string;
  slug: string;
  name: string;
}


const BlogEditor: React.FC<BlogEditorProps> = ({
  post,
  onSave,
  onCancel,
  className
}) => {
  const { theme, systemTheme } = useTheme();
  const editorRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  // Fix hydration issues by waiting for mount
  useEffect(() => {
    setMounted(true);
    // Fetch categories
    fetchCategories();
  }, []);

  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    status: post?.status || 'draft',
    metaTitle: post?.metaTitle || '',
    metaDescription: post?.metaDescription || '',
    isFeatured: post?.isFeatured || false,
    featuredImage: post?.featuredImage || '',
    categories: post?.categories?.map(c => c.id) || [],
    tags: post?.tags?.map(t => t.name) || []
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUploadMethod, setImageUploadMethod] = useState<'url' | 'upload'>('url');
  const [imagePreview, setImagePreview] = useState<string | null>(post?.featuredImage || null);
  const [uploading, setUploading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    post?.categories?.map(c => c.id) || []
  );

  // Get the current theme
  const currentTheme = theme === 'system' ? systemTheme : theme;
  
  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/blog/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const editorConfig = {
    height: 500,
    menubar: true,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
      'codesample'
    ],
    toolbar: 'undo redo | blocks | ' +
      'bold italic forecolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat | link image media codesample | help',
    content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 16px; line-height: 1.6; }',
    skin: currentTheme === 'dark' ? 'oxide-dark' : 'oxide',
    content_css: currentTheme === 'dark' ? 'dark' : 'default',
    promotion: false,
    branding: false,
    relative_urls: false,
    remove_script_host: true,
    convert_urls: true,
    images_upload_handler: async (blobInfo: any, progress: (percent: number) => void) => {
      // This is for inline images in the editor
      try {
        const formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());
        
        const response = await axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            if (e.total) {
              progress(Math.round((e.loaded / e.total) * 100));
            }
          }
        });
        
        return response.data.url;
      } catch (err) {
        console.error('Error uploading image:', err);
        throw new Error('Image upload failed');
      }
    }
  };

 

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    setSaving(true);
    setError(null);
    const content = editorRef.current ? editorRef.current.getContent() : formData.content;
    
    // Process tags to extract names
    const tagNames = tags
      .filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
      .map(tag => tag.trim());

    // Type assertion for formData.tags
    const existingTags = formData.tags as (string | { name: string })[];
    
    // Get final tag names
    const rawTagNames = tagNames.length > 0 
      ? tagNames 
      : existingTags.map(tag => 
          typeof tag === 'string' ? tag : tag.name
        );

    // Convert to proper BlogTag objects with required fields
    const finalTags: BlogTag[] = rawTagNames.map(tagName => {
      const slug = tagName.toLowerCase().replace(/\s+/g, '-');
      return {
        id: crypto.randomUUID(),
        name: tagName,
        slug: slug || 'default-slug' // Ensure slug is always defined
      };
    });

    await onSave({ 
      ...formData, 
      content,
      categories: selectedCategories
        .map(id => categories.find(category => category.id === id))
        .filter(Boolean) as BlogCategory[],
      tags: finalTags
    });
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to save post');
  } finally {
    setSaving(false);
  }
};




  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, featuredImage: url }));
    setImagePreview(url);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Upload file
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setFormData(prev => ({ ...prev, featuredImage: response.data.url }));
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, featuredImage: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  // Wait until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  const containerClass = clsx(
    styles.editor,
    currentTheme === 'dark' && styles.dark,
    className
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={containerClass}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {post ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={styles.error} 
              role="alert"
            >
              <AlertCircle size={20} />
              <span>{error}</span>
              <button 
                type="button"
                onClick={() => setError(null)}
                className={styles.closeError}
                aria-label="Close error"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.fields}>
          <div className={styles.mainColumn}>
            <div className={styles.field}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Enter post title"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="content">Content</label>
              <Editor
                id="content"
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={formData.content}
                init={editorConfig}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="excerpt">Excerpt</label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                className={styles.textarea}
                rows={3}
                placeholder="Brief summary of your post (optional)"
              />
            </div>
          </div>

          <div className={styles.sideColumn}>
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>Publishing</h3>
              
              <div className={styles.field}>
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className={styles.checkbox}
                  />
                  <span>Featured Post</span>
                </label>
                <div className={styles.helpText}>
                  <Info size={14} />
                  <span>Featured posts appear prominently on the blog homepage</span>
                </div>
              </div>
            </div>

            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>Featured Image</h3>
              
              <div className={styles.imageUploader}>
                <div className={styles.uploadMethodToggle}>
                  <button
                    type="button"
                    className={clsx(
                      styles.uploadMethodButton,
                      imageUploadMethod === 'url' && styles.active
                    )}
                    onClick={() => setImageUploadMethod('url')}
                  >
                    <LinkIcon size={16} />
                    <span>URL</span>
                  </button>
                  <button
                    type="button"
                    className={clsx(
                      styles.uploadMethodButton,
                      imageUploadMethod === 'upload' && styles.active
                    )}
                    onClick={() => setImageUploadMethod('upload')}
                  >
                    <Upload size={16} />
                    <span>Upload</span>
                  </button>
                </div>

                {imageUploadMethod === 'url' ? (
                  <div className={styles.field}>
                    <input
                      type="url"
                      name="featuredImage"
                      value={formData.featuredImage}
                      onChange={handleImageUrlChange}
                      placeholder="Enter image URL"
                      className={styles.input}
                    />
                  </div>
                ) : (
                  <div className={styles.uploadContainer}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className={styles.uploadButton}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <Loader2 size={16} className={styles.spinner} />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          <span>Choose Image</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {imagePreview && (
                  <div className={styles.imagePreviewContainer}>
                    <div className={styles.imagePreview}>
                      <img src={imagePreview} alt="Preview" />
                      <button 
                        type="button" 
                        onClick={clearImage}
                        className={styles.clearImageButton}
                        aria-label="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>Categories</h3>
              <div className={styles.categoriesContainer}>
                {categories.length > 0 ? (
                  <div className={styles.categoriesList}>
                    {categories.map(category => (
                      <label key={category.id} className={styles.categoryLabel}>
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => handleCategoryToggle(category.id)}
                          className={styles.categoryCheckbox}
                        />
                        <span className={styles.categoryName}>{category.name}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noItems}>No categories available</p>
                )}
              </div>
            </div>

            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>Tags</h3>
              <div className={styles.tagInput}>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add tag and press Enter"
                  className={styles.input}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className={styles.addTagButton}
                  disabled={!newTag.trim()}
                >
                  Add
                </button>
              </div>
              
              <div className={styles.tagsContainer}>
                {tags.length > 0 ? (
                  <div className={styles.tagsList}>
                    {tags.map(tag => (
                      <div key={tag} className={styles.tag}>
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className={styles.removeTagButton}
                          aria-label={`Remove ${tag}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : formData.tags.length > 0 ? (
                  <div className={styles.tagsList}>
                    {formData.tags.map(tag => (
                      <div key={tag} className={styles.tag}>
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              tags: prev.tags.filter(t => t !== tag)
                            }));
                          }}
                          className={styles.removeTagButton}
                          aria-label={`Remove ${tag}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noItems}>No tags added yet</p>
                )}
              </div>
            </div>

            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>SEO Settings</h3>
              <div className={styles.field}>
                <label htmlFor="metaTitle">Meta Title</label>
                <input
                  type="text"
                  id="metaTitle"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="SEO title (optional)"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="metaDescription">Meta Description</label>
                <textarea
                  id="metaDescription"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  className={styles.textarea}
                  rows={3}
                  placeholder="SEO description (optional)"
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 size={16} className={styles.spinner} />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check size={16} />
                <span>Save Post</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default BlogEditor;
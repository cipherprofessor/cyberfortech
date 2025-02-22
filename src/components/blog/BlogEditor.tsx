// src/components/Blog/BlogEditor.tsx
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from 'next-themes';
import { BlogEditorProps } from '@/types/blog';
import styles from './BlogEditor.module.scss';

// You can create a separate config file for environment variables
const TINYMCE_API_KEY = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;

const BlogEditor: React.FC<BlogEditorProps> = ({
  post,
  onSave,
  onCancel,
  className = ''
}) => {
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    status: post?.status || 'draft',
    metaTitle: post?.metaTitle || '',
    metaDescription: post?.metaDescription || '',
    isFeatured: post?.isFeatured || false
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      // Get the latest editor content
      const content = editorRef.current ? editorRef.current.getContent() : formData.content;
      await onSave({ ...formData, content });
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${styles.editor} ${className} ${theme === 'dark' ? styles.dark : ''}`}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {post ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
        </div>

        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}

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
            apiKey={TINYMCE_API_KEY}
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={formData.content}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
                'codesample', 'emoticons', 'hr', 'pagebreak', 'quickbars', 'save'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | image media link codesample | help',
              content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 16px; line-height: 1.6; }',
              skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
              content_css: theme === 'dark' ? 'dark' : 'default',
              images_upload_handler: async (blobInfo, progress) => {
                // Implement your image upload logic here
                // Return the URL of the uploaded image
                return new Promise((resolve, reject) => {
                  // Example:
                  // const formData = new FormData();
                  // formData.append('file', blobInfo.blob(), blobInfo.filename());
                  // const response = await fetch('/api/upload', { method: 'POST', body: formData });
                  // const data = await response.json();
                  // resolve(data.url);
                  reject('Image upload not implemented');
                });
              },
              file_picker_types: 'image',
              automatic_uploads: true,
              promotion: false,
              branding: false
            }}
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
            placeholder="Enter a brief excerpt of your post"
          />
        </div>

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
            Featured Post
          </label>
        </div>

        <div className={styles.seo}>
          <h3>SEO Settings</h3>
          <div className={styles.field}>
            <label htmlFor="metaTitle">Meta Title</label>
            <input
              type="text"
              id="metaTitle"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter SEO title"
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
              rows={2}
              placeholder="Enter SEO description"
            />
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
            {saving ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default BlogEditor;

import BlogEditor from '@/components/blog/BlogEditor/BlogEditor';
import { useBlogOperations } from '@/hooks/useBlogOperations';
import router from 'next/router';

export default function NewBlogPost() {
  const { handleCreatePost, loading } = useBlogOperations();

  return (
    <BlogEditor
      onSave={handleCreatePost}
      onCancel={() => router.back()}
    />
  );
}
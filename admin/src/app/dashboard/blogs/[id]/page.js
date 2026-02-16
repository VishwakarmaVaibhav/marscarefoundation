'use client';

import { useParams } from 'next/navigation';
import BlogEditor from '@/components/BlogEditor';

export default function EditBlogPage() {
    const params = useParams();
    return <BlogEditor blogId={params.id} />;
}

import prisma from "@/lib/prisma";
import type { Blog, User } from "@prisma/client"; // optional

export default async function Posts() {
  const posts = await prisma.blog.findMany({
    include: {
      user: true,
    },
  });

  // TypeScript tự nhận: post: { id: number; title: string; user: User | null; ... }
  type PostWithUser = Blog & { user: User | null }; 

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16 text-[#333333]">
      <h1 className="text-4xl font-bold mb-8">Posts</h1>
      <ul className="max-w-2xl space-y-4">
        {posts.map((post: PostWithUser) => (
          <li key={post.id}>
            <span className="font-semibold">{post.title}</span>
            <span className="text-sm text-gray-600 ml-2">
              by {post.user?.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

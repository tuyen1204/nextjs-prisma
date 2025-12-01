import prisma from "@/lib/prisma";

// Định nghĩa interface cho user
interface User {
  id: number;
  name: string | null;
}

// Định nghĩa interface cho blog kèm user
interface BlogWithUser {
  id: number;
  title: string;
  user: User | null;
}

export default async function Posts() {
  const posts = await prisma.blog.findMany({
    include: {
      user: true,
    },
  });

  // Cast mỗi post về interface BlogWithUser
  const typedPosts: BlogWithUser[] = posts.map(post => ({
    id: post.id,
    title: post.title,
    user: post.user ? { id: post.user.id, name: post.user.name } : null,
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16 text-[#333333]">
      <h1 className="text-4xl font-bold mb-8">Posts</h1>
      <ul className="max-w-2xl space-y-4">
        {typedPosts.map((post) => (
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

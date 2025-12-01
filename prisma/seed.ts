import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // Xóa data cũ để tránh conflict unique
  // Thứ tự xóa quan trọng vì khóa ngoại
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.blog.deleteMany();

  // Tạo Roles
  const adminRole = await prisma.role.create({ data: { name: 'Admin' } });
  const userRole = await prisma.role.create({ data: { name: 'User' } });

  // Tạo Users
  const passwordAdmin = await bcrypt.hash("admin", 10);
  const passwordUser = await bcrypt.hash("user", 10);

  const Blogs = [
    {
      title: "Blog 1",
      excerpt: "Excerpt 1",
      content: "Content 1",
      thumbnail: "Thumbnail 1",
      published: true,
    },
    {
      title: "Blog 2",
      excerpt: "Excerpt 2",
      content: "Content 2",
      thumbnail: "Thumbnail 2",
      published: true,
    },
  ];

  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@gmail.com",
      password: passwordAdmin,
      roleId: adminRole.id,
    }
  });

  await prisma.user.create({
    data: {
      name: "User",
      email: "user@gmail.com",
      password: passwordUser,
      roleId: userRole.id,
    }
  });

  await prisma.blog.createMany({
    data: Blogs.map(blog => ({
      ...blog,
      userId: 1,
    })),
  });

}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

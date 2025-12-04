import { prisma } from "@/lib/prisma";

async function main() {
  await prisma.user.create({
    data: {
      id: "1",
      name: "Lorenzo Lucchesi",
      email: "lorenzo.lucchesi@test.com",
      posts: {
        create: {
          title: "Hello World",
          content: "This is my first post!",
          published: true,
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

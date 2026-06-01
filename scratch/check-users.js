const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Fetching existing user accounts from Neon PostgreSQL...");
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      hashedPassword: true,
      createdAt: true,
    }
  });

  console.log(`Total users found: ${users.length}`);
  users.forEach((u, i) => {
    console.log(`[User ${i + 1}] ID: ${u.id} | Email: ${u.email} | Name: ${u.name} | Verified: ${u.emailVerified} | Has Password: ${!!u.hashedPassword} | Created: ${u.createdAt}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const { PrismaClient } = require("@prisma/client");

const directUrl = "postgresql://neondb_owner:npg_LGXN2JMQZcw3@52.1.58.3/neondb?sslmode=require";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: directUrl,
    },
  },
});

async function main() {
  console.log("Testing direct IPv4 Neon PostgreSQL host...");
  console.log("IP Address: 52.1.58.3");
  
  const users = await prisma.user.findMany({
    take: 1,
  });
  console.log("Direct connection successful! Row count fetched:", users.length);
}

main()
  .catch((e) => {
    console.error("Direct connection failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

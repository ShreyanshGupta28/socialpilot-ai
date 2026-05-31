const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkRecords() {
  try {
    const users = await prisma.user.findMany();
    console.log("Current User Records physically in SQLite (dev.db):");
    console.log(JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Failed to query database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRecords();

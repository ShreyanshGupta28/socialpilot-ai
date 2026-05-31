const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getStats() {
  console.log("--------------------------------------------------");
  console.log("SocialPilot AI - Database QA Audit");
  console.log("--------------------------------------------------");

  try {
    const userCount = await prisma.user.count();
    const msgCount = await prisma.message.count();
    const savedTemplates = await prisma.message.count({ where: { isSaved: true } });
    
    // Check for orphaned message records
    const allMessages = await prisma.message.findMany({
      select: { id: true, userId: true }
    });
    
    const orphans = [];
    for (const msg of allMessages) {
      const userExists = await prisma.user.findUnique({
        where: { id: msg.userId },
        select: { id: true }
      });
      if (!userExists) {
        orphans.push(msg.id);
      }
    }

    console.log(`✔ Physical User Count: ${userCount}`);
    console.log(`✔ Physical Message Count: ${msgCount}`);
    console.log(`✔ Saved/Bookmarked Templates Count: ${savedTemplates}`);
    console.log(`✔ Orphaned Message Records: ${orphans.length}`);
    if (orphans.length > 0) {
      console.log(`⚠️ Orphan PIDs:`, orphans);
    }
  } catch (err) {
    console.error("Database query failed:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

getStats();

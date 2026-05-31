const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Neon PostgreSQL query verification test...");
  
  const testEmail = `test_user_${Date.now()}@example.com`;
  const hashedPassword = await bcrypt.hash("secure_password_123", 10);

  // 1. Create a User record
  console.log(`Inserting test user: ${testEmail}...`);
  const newUser = await prisma.user.create({
    data: {
      email: testEmail,
      name: "Prisma Test Agent",
      hashedPassword: hashedPassword,
      plan: "FREE",
    },
  });
  console.log("Insert successful! Created User ID:", newUser.id);

  // 2. Query the created user record
  console.log(`Querying created user by email: ${testEmail}...`);
  const fetchedUser = await prisma.user.findUnique({
    where: { email: testEmail },
  });

  if (fetchedUser && fetchedUser.name === "Prisma Test Agent") {
    console.log("Query successful! Found User:", fetchedUser.email);
  } else {
    throw new Error("Query verification failed: User not found or mismatch!");
  }

  // 3. Clean up the test user
  console.log(`Cleaning up test user: ${testEmail}...`);
  await prisma.user.delete({
    where: { id: fetchedUser.id },
  });
  console.log("Cleanup successful!");
  console.log("ALL DB VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉");
}

main()
  .catch((e) => {
    console.error("Test failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

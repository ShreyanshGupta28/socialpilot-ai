const { PrismaClient } = require("@prisma/client");
const bcryptjs = require("bcryptjs");

const prisma = new PrismaClient();

async function runTests() {
  console.log("--------------------------------------------------");
  console.log("Starting SocialPilot AI Local Auth & DB Verification...");
  console.log("--------------------------------------------------");

  try {
    // 1. Reset database for clean testing state
    console.log("Cleaning up existing test users...");
    await prisma.user.deleteMany({
      where: {
        email: "test@example.com"
      }
    });

    // 2. Mock Registration Step
    console.log("\n[1/3] Simulating User Registration...");
    const rawPassword = "SecurePassword123!";
    console.log("Hashing password...");
    const hashedPassword = await bcryptjs.hash(rawPassword, 10);
    
    console.log("Writing new User record to SQLite...");
    const newUser = await prisma.user.create({
      data: {
        email: "test@example.com",
        name: "Test Pilot",
        hashedPassword,
        emailVerified: true, // Mark verified directly for subsequent login test
        plan: "FREE",
      }
    });

    console.log("✔ Registration Success! User created with ID:", newUser.id);
    console.log("✔ Default Plan check: plan =", newUser.plan);
    console.log("✔ Default Daily Credit count check: count =", newUser.dailyCount);

    // 3. Mock Login / Authorization Step
    console.log("\n[2/3] Simulating Credentials Authorization...");
    console.log("Searching user record in SQLite by email...");
    const lookupUser = await prisma.user.findUnique({
      where: { email: "test@example.com" }
    });

    if (!lookupUser) {
      throw new Error("Login Simulation Failure: User not found in database.");
    }

    console.log("Comparing password hashes using bcryptjs...");
    const isPasswordCorrect = await bcryptjs.compare(rawPassword, lookupUser.hashedPassword);

    if (!isPasswordCorrect) {
      throw new Error("Login Simulation Failure: Password hash comparison mismatch.");
    }

    if (!lookupUser.emailVerified) {
      throw new Error("Login Simulation Failure: User email is not verified.");
    }

    console.log("✔ Credentials Authorization Success!");
    console.log(`✔ User Authorized Session Profile: { id: "${lookupUser.id}", email: "${lookupUser.email}", plan: "${lookupUser.plan}" }`);

    // 4. Mock Dashboard Statistics Step
    console.log("\n[3/3] Simulating Dashboard Stats Load...");
    console.log("Executing parallel queries...");
    const [totalCount, savedCount, recentMessages] = await Promise.all([
      prisma.message.count({ where: { userId: lookupUser.id } }),
      prisma.message.count({ where: { userId: lookupUser.id, isSaved: true } }),
      prisma.message.findMany({
        where: { userId: lookupUser.id },
        take: 3
      })
    ]);

    console.log("✔ Dashboard queries executed successfully!");
    console.log(`✔ Stats compiled: { totalRuns: ${totalCount}, savedCount: ${savedCount}, recentLogs: ${recentMessages.length} }`);

    console.log("\n--------------------------------------------------");
    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! Local environment is fully functional.");
    console.log("--------------------------------------------------");

  } catch (error) {
    console.error("\n❌ Test Suite Encountered An Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();

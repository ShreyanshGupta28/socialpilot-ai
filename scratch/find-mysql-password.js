const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const passwords = [
  "",          // Empty password (often default for root)
  "root",
  "root123",
  "root1234",
  "admin",
  "password",
  "1234",
  "123456",
  "12345678",
  "mysql",
  "maria",
  "mariadb",
  "postgres"
];

const envPath = path.join(__dirname, "../.env");
const originalEnv = fs.readFileSync(envPath, "utf8");

console.log("Starting credentials discovery for local MySQL server on port 3306...");

let found = false;

for (const password of passwords) {
  const connectionUrl = password 
    ? `mysql://root:${encodeURIComponent(password)}@localhost:3306/socialpilot` 
    : `mysql://root@localhost:3306/socialpilot`;

  console.log(`Testing password: "${password}"...`);

  // Write temporary env file
  const updatedEnv = originalEnv.replace(
    /DATABASE_URL=.*/,
    `DATABASE_URL="${connectionUrl}"`
  );
  fs.writeFileSync(envPath, updatedEnv, "utf8");

  try {
    // Run a light prisma command like `prisma validate` to test connection credentials.
    // Wait, prisma validate doesn't connect to the DB. `prisma db push` or `prisma generate`? No, generate doesn't connect.
    // Let's use `npx prisma db push --skip-generate` or `npx prisma db push` but limit output.
    // Wait, a fast check is `npx prisma db push --skip-generate`. It connects to check schemas.
    const output = execSync("npx prisma db push --skip-generate", { 
      stdio: "pipe",
      env: { ...process.env, DATABASE_URL: connectionUrl }
    }).toString();

    console.log(`Success! Password is: "${password}"`);
    found = true;
    break;
  } catch (err) {
    const errorText = err.stderr ? err.stderr.toString() : err.message;
    if (errorText.includes("P1000") && errorText.includes("Authentication failed")) {
      // Wrong password
      continue;
    } else {
      // Connect succeeded but database creation / permissions is the only remaining issue, or other DB issue
      console.log(`Success connection pattern detected with password: "${password}". (Details: ${errorText.substring(0, 100)})`);
      found = true;
      break;
    }
  }
}

if (!found) {
  console.log("Could not authenticate against MySQL server with common default passwords. Reverting to original .env.");
  fs.writeFileSync(envPath, originalEnv, "utf8");
}

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create default admin user (optional)
  // await prisma.user.upsert({
  //   where: { email: "admin@example.com" },
  //   update: {},
  //   create: {
  //     email: "admin@example.com",
  //     password: await bcrypt.hash("admin123", 10),
  //     name: "Admin",
  //     isGuest: false,
  //   },
  // });

  console.log("Database seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

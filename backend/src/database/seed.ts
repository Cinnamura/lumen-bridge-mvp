import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'admin123';
  const operatorPassword = process.env.OPERATOR_SEED_PASSWORD || 'operator123';

  const adminHash = await bcrypt.hash(adminPassword, 10);
  const operatorHash = await bcrypt.hash(operatorPassword, 10);

  await prisma.adminUser.upsert({
    where: { login: 'admin' },
    update: { passwordHash: adminHash },
    create: { login: 'admin', passwordHash: adminHash, role: 'admin' },
  });

  await prisma.adminUser.upsert({
    where: { login: 'operator' },
    update: { passwordHash: operatorHash },
    create: { login: 'operator', passwordHash: operatorHash, role: 'operator' },
  });

  console.log('✓ Seed complete: admin (role: admin) and operator (role: operator) created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

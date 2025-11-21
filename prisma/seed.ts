import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Проверяем, существует ли уже админ
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@school.com' }
  });

  if (existingAdmin) {
    console.log('Адміністратор вже існує');
    return;
  }

  // Создаем админа
  const hashedPassword = await bcrypt.hash('admin1236', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@school.com',
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log('Адміністратор створений:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

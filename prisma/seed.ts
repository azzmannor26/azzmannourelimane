import { PrismaClient, UserStatus, RoleName } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  /*-------------------------------- users -----------------------------*/
  const superAdminUser = await prisma.user.create({
    data: {
      email: 'superadmin@example.com',
      password: await bcryptjs.hash('password123', 10),
      phone: '01234567',
      firstName: 'Super',
      lastName: 'Admin',
      status: UserStatus.ACTIVE,
      role: RoleName.SUPER_ADMIN,
    },
  });

  console.log(
    'Super Admin User has been created successfully:',
    superAdminUser.email,
  );

  const adminUser = await prisma.user.create({
    data: {
      email: 'Admin@example.com',
      password: await bcryptjs.hash('password123', 10),
      phone: '01234567',
      firstName: 'Admin',
      lastName: 'Admin',
      status: UserStatus.ACTIVE,
      role: RoleName.ADMIN,
    },
  });

  console.log('Admin User has been created :', adminUser.email);

  const member = await prisma.user.create({
    data: {
      email: 'member@example.com',
      password: await bcryptjs.hash('password123', 10),
      phone: '01234567',
      firstName: 'member',
      lastName: 'member',
      status: UserStatus.ACTIVE,
      role: RoleName.USER,
    },
  });

  console.log('member User has been created :', member.email);

  const User_1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      password: await bcryptjs.hash('password123', 10),
      phone: '01234567',
      firstName: 'user1',
      lastName: 'user ',
      status: UserStatus.ACTIVE,
      role: RoleName.USER,
    },
  });

  console.log('User has been created :', User_1.email);

  const User_2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      password: await bcryptjs.hash('password123', 10),
      phone: '01234567',
      firstName: 'User',
      lastName: 'User',
      status: UserStatus.ACTIVE,
      role: RoleName.USER,
    },
  });

  console.log('User User has been created successfully:', User_2.email);

  /*--------------------------------------------------------------------*/

  console.log('Seed data created successfully!');
}

main()
  .catch((error) => {
    console.error('Error creating seed data:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

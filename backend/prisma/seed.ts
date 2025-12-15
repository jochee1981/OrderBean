import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@orderbean.com' },
    update: {},
    create: {
      email: 'admin@orderbean.com',
      password_hash: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  // Create test customer
  const customerPassword = await bcrypt.hash('customer123', 10)
  const customer = await prisma.user.upsert({
    where: { email: 'customer@orderbean.com' },
    update: {},
    create: {
      email: 'customer@orderbean.com',
      password_hash: customerPassword,
      name: 'Test Customer',
      role: 'CUSTOMER',
    },
  })

  // Create test cafe
  const cafe = await prisma.cafe.create({
    data: {
      name: '강남역 카페',
      address: '서울시 강남구 강남대로 123',
      phone: '02-1234-5678',
    },
  })

  console.log('Seed data created:', { admin, customer, cafe })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


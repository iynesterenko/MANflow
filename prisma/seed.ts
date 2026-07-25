import { PrismaClient, Role, AdminStatus } from '../app/generated/prisma/client'
const prisma = new PrismaClient()

async function main() {
  const saEmail = process.env.INITIAL_SA_EMAIL

  if (!saEmail) {
    throw new Error('❌ INITIAL_SA_EMAIL не найдена в .env файле!')
  }

  const admin = await prisma.admin.upsert({
    where: { email: saEmail },
    update: {},
    create: {
      email: saEmail,
      name: 'System Administrator',
      role: Role.SA,
      status: AdminStatus.PENDING,
    },
  })

  console.log(`✅ Seed completed. SA created/verified: ${admin.email}`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
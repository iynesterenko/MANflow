import { PrismaClient, Role, AdminStatus } from '../app/generated/prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const saEmail = process.env.INITIAL_SA_EMAIL
  const saPassword = process.env.INITIAL_SA_PASSWORD

  if (!saEmail || !saPassword) {
    throw new Error('❌ INITIAL_SA_EMAIL або INITIAL_SA_PASSWORD не знайдено в .env файлі!')
  }

  const passwordHash = await bcrypt.hashSync(saPassword, 10)

  const admin = await prisma.admin.upsert({
    where: { email: saEmail },
    update: {
      passwordHash,
    },
    create: {
      email: saEmail,
      name: 'System Administrator',
      passwordHash,
      role: Role.SA,
      status: AdminStatus.ACTIVE,
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
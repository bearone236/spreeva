import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const { hash } = bcrypt
const prisma = new PrismaClient()

async function main() {
  // すでに団体が存在しなければ作成
  const organization = await prisma.organization.upsert({
    where: { id: 'unique-organization-id' },
    update: {},
    create: {
      name: 'Test Organization',
      description: 'This is a test organization',
      organizationType: 'School',
    },
  })

  // ハッシュ化したパスワード
  const hashedPassword = await hash('password123', 10)

  // 管理者ユーザーを追加
  await prisma.organizationUser.create({
    data: {
      name: 'Admin User',
      email: 'admin@test.com',
      password: hashedPassword,
      userType: 'admin',
      organizationId: organization.id,
    },
  })

  // メンバーユーザーを追加
  await prisma.organizationUser.create({
    data: {
      name: 'Member User',
      email: 'member@test.com',
      password: hashedPassword,
      userType: 'member',
      organizationId: organization.id,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

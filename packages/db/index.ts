import { PrismaClient } from '@prisma/client'

export const prismaClientSingleton = () => {
  return new PrismaClient()
}
// export * from '@prisma/client';
declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma: ReturnType<typeof prismaClientSingleton> = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

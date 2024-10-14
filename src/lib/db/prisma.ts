import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prismaBase = globalThis.prismaGlobal ?? prismaClientSingleton()
export const prisma = prismaBase.$extends({
  query: {
    cart: {
      async update({ args, query }) {
        args.data = { ...args.data, updatedAt: new Date() }
        return query(args)
      }
    }
  }
})
export default prismaBase

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prismaBase
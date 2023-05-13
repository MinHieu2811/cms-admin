import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined
}

// const client = globalThis.prisma = new PrismaClient()
// if(process.env.NODE_ENV !== 'production') {
//   globalThis.prisma = client
// }

let db: typeof globalThis.prisma;

//check if we are running in production mode
if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  db = global.prisma
}

export default db
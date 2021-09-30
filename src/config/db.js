/* eslint-disable import/no-mutable-exports */
import pkg from '@prisma/client';
import typedi from 'typedi';

const { Container } = typedi;
const { PrismaClient } = pkg;

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

Container.set('prisma', prisma);

export default prisma;

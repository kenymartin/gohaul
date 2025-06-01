import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Run migrations
    await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;
    
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 
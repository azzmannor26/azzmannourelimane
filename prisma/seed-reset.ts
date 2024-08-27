import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function getAllTableNames(): Promise<string[]> {
  // Fetch all table names from the database using introspection
  const tableNamesQuery = await prisma.$queryRaw<
    { tablename: string }[]
  >`SELECT tablename FROM pg_tables WHERE schemaname = 'public';`;
  return tableNamesQuery.map((table) => table.tablename);
}

async function main() {
  try {
    // Get all table names dynamically
    const tableNames = await getAllTableNames();

    // Calculate the maximum table name length for padding purposes
    const maximumTableNameLength = tableNames.reduce(
      (max, tableName) => Math.max(max, tableName.length),
      0,
    );

    // Reset each table
    for (const tableName of tableNames) {
      await prisma.$queryRawUnsafe(
        `TRUNCATE "${tableName}" RESTART IDENTITY CASCADE;`,
      );
      const paddedTableName = tableName.padEnd(maximumTableNameLength, ' ');
      console.log(
        `Table \x1b[36m${paddedTableName}\x1b[0m has been \x1b[31m dropped\x1b[0m`,
      );
    }
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    // Disconnect from Prisma client
    await prisma.$disconnect();
  }
}

main();

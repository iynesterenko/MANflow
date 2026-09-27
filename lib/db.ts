import { PrismaClient } from "../app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;


function getDatabaseUrl() {
  console.log(`DATABASE_URL:`, process.env.DATABASE_URL);
  const baseUrl = process.env.DATABASE_URL;

  // Перевіряємо, чи це Preview-деплой у Vercel
  if (process.env.VERCEL_ENV === 'preview' && baseUrl) {
    // Взяти назву гілки з системної змінної Vercel
    const branchName = process.env.VERCEL_GIT_COMMIT_REF || 'preview';
    
    // Формуємо безпечне ім'я схеми в Postgres (наприклад: pr_13_audit_log)
    const schemaName = `pr_${branchName.replace(/[^a-zA-Z0-9_]/g, '_')}`;

    const url = new URL(baseUrl);
    url.searchParams.set('schema', schemaName);
    return url.toString();
  }

  return baseUrl;
}


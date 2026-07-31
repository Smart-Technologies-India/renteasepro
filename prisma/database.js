require("dotenv").config();
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("../generated/prisma/client");

const connectionLimit = Number.parseInt(
  process.env.PRISMA_CONNECTION_LIMIT ?? "10",
  10
);

const prismaClientSingleton = () => {
  const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: Number.isNaN(connectionLimit) ? 10 : connectionLimit,
  });

  return new PrismaClient({
    adapter: adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["warn", "error"],
  });
};

const prisma = globalThis.prisma ?? prismaClientSingleton();

module.exports = prisma;

globalThis.prisma = prisma;

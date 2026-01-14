// import "dotenv/config";
// import { PrismaClient } from "@prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";

// const connectionString = process.env.DATABASE_URL;
// const adapter = new PrismaPg({ connectionString });

// const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
// import { PrismaClient } from "../generated/prisma/client";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };

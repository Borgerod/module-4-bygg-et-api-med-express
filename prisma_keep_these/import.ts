// filepath: prisma/seed.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { readFileSync } from "fs";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	const data = JSON.parse(readFileSync("export.json", "utf-8"));
	if (Array.isArray(data.todos)) {
		// Optional: Clear existing todos
		await prisma.todo.deleteMany({});
		// Insert todos
		await prisma.todo.createMany({ data: data.todos });
		console.log("Todos imported from export.json");
	} else {
		console.error("No todos found in export.json");
	}
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

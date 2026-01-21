import {
  // sequelize,
  testConnection,
  syncDatabase,
} from "@expressBackend/config/db.config";
import Employee from "../models/employee.model";
import User from "../models/user.model";

async function seed() {
  try {
    await testConnection();
    await syncDatabase();

    await Employee.create({
      firstname: ["John", "Jane", "Foo", "Bar"][Math.floor(Math.random() * 4)],
      lastname: ["Lastnamne", "Doe", "Olsen", "Hansen"][
        Math.floor(Math.random() * 4)
      ],
      email: "foo3@bar.com",
      phone: "98765432",
      position: "Home",
      department: "Management",
    });

    await User.create({
      email: "test2@auth.no",
      password: "abc123",
      role: "user",
    });

    await User.create({
      email: "test@auth.no",
      password: "abc123",
      role: "admin",
    });

    console.log("DB Seeded successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding DB:", err);
    process.exit(1);
  }
}

seed();

import { testConnection, syncDatabase } from "@expressBackend/config/db.config";
import Employee from "../models/employee.model";
import User from "../models/user.model";
import { generateCompanyEmail } from "../schema/employee.schema";
import { departments, positions, roles } from "../models/employee.model";

async function seed() {
  try {
    await testConnection();
    await syncDatabase();

    // Generate random employee data
    const firstname = ["John", "Jane", "Foo", "Bar"][
      Math.floor(Math.random() * 4)
    ];
    const lastname = ["Lastname", "Doe", "Olsen", "Hansen"][
      Math.floor(Math.random() * 4)
    ];
    const department =
      departments[Math.floor(Math.random() * departments.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const email = generateCompanyEmail(firstname, lastname);

    await Employee.create({
      firstname,
      lastname,
      email,
      countryCode: "+47",
      phone: "98765432",
      department,
      position,
      role,
      isActive: true,
      isOnline: false,
    });

    await User.create({
      email: "test2@auth.no",
      password: "abc123ABC!",
      role: "user",
      username: "TestUser2",
      isActive: true,
      isOnline: false,
    });

    await User.create({
      email: "test1@auth.no",
      password: "abc123ABC!",
      role: "user",
      username: "TestUser1",
      isActive: true,
      isOnline: false,
    });

    await User.create({
      email: "test@auth.no",
      password: "abc123ABC!",
      role: "admin",
      username: "TestUser0",
      isActive: true,
      isOnline: false,
    });

    console.log("DB Seeded successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding DB:", err);
    process.exit(1);
  }
}

seed();

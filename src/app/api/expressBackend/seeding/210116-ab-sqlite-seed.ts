import {
  testConnection,
  syncDatabase,
} from "@/app/api/expressBackend/config/db.config";
import Employee from "@/app/api/expressBackend/models/employee.model";
import User from "@/app/api/expressBackend/models/user.model";
import { staffMap } from "@/app/api/expressBackend/models/employee.model";

const generatedUserPasswords: {
  username: string;
  email: string;
  password: string;
  role: string;
}[] = [];

async function seed() {
  try {
    await testConnection();
    await syncDatabase();

    await createStaticTestEmployee();

    const userBatchSize: number = 8;
    await generateUsersAndEmployees(userBatchSize);

    await printUserLogins();

    console.log("DB Seeded successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding DB:", err);
    process.exit(1);
  }
}

async function printUserLogins() {
  console.log("User login info for testing:");
  generatedUserPasswords.forEach((user) => {
    console.log(
      `Username: ${user.username}, Email: ${user.email}, Password: ${user.password}, Role: ${user.role}`,
    );
  });
}

const namingProb = {
  hasMiddleName: 0.6,
  hasDoubleFirstNameSpace: 0.06,
  hasDoubleFirstNameHyphen: 0.04,
  hasDoubleLastNameSpace: 0.06,
  hasDoubleLastNameHyphen: 0.06,
};
function randomPhoneNumber(): string {
  const starts = ["4", "9", "8"];
  const start = starts[Math.floor(Math.random() * starts.length)];
  let number = start;
  for (let i = 0; i < 7; i++) {
    number += Math.floor(Math.random() * 10).toString();
  }
  return number;
}

async function createStaticTestEmployee() {
  const staticUser = await User.create({
    email: "test.employee@example.com",
    password: "TestEmployee#2024",
    role: "admin",
    username: "testemployee",
    isActive: true,
  });

  generatedUserPasswords.push({
    username: "testemployee",
    email: "test.employee@example.com",
    password: "TestEmployee#2024",
    role: "admin",
  });

  await Employee.create({
    userId: staticUser.id,
    firstname: "Test",
    middlename: "Static",
    lastname: "Employee",
    countryCode: "+47",
    phone: "90000000",
    department: "it",
    position: "Utvikler",
    role: "admin",
    isActive: true,
    isOnline: false,
  });
}

async function generateUsersAndEmployees(batchSize: number) {
  let emails: string[] = [
    "alex.miller@example.com",
    "jordan.smith@example.com",
    "taylor.brown@example.com",
    "casey.johnson@example.com",
    "morgan.wilson@example.com",
    "riley.anderson@example.com",
    "jamie.thomas@example.com",
    "devon.moore@example.com",
    "quinn.jackson@example.com",
    "parker.white@example.com",
  ];
  let usernames: string[] = [
    "alexmiller",
    "jordansmith",
    "taylorb",
    "caseyj",
    "morganw",
    "riley_a",
    "jamiet",
    "devonm",
    "quinnj",
    "parkerw",
  ];
  const passwords: string[] = [
    "Sunset#4821",
    "BlueTiger!93",
    "Rocket$Moon7",
    "EchoWave@21",
    "IronClad_55",
    "NovaSpark!8",
    "ShadowFox#12",
    "PixelStorm$9",
    "CrimsonKey@77",
    "LunarPath_4",
  ];
  const roles = ["user", "admin"] as const;
  type UserRole = (typeof roles)[number];

  const departmentKeys = Object.keys(staffMap) as Array<keyof typeof staffMap>;
  const firstnames = [
    "John",
    "Jane",
    "Richard",
    "Victoria",
    "Mohammed",
    "Paul",
    "Ole",
    "Trine",
    "Karen",
  ];
  const middlenames = [
    "Marie",
    "Marion",
    "Erik",
    "Christian",
    "Mohammed",
    "Harry",
    "Middle",
    "Ove",
    "Samantha",
    "Tina",
  ];
  const lastnames = [
    "Doe",
    "Olsen",
    "Hansen",
    "Oksnes",
    "Jihadia",
    "Smith",
    "Archer",
    "Willow",
    "Bossmán",
  ];
  const pick = (arr: string[]): string =>
    arr[Math.floor(Math.random() * arr.length)];

  for (let i = 0; i < batchSize; i++) {
    const email = emails[Math.floor(Math.random() * emails.length)];
    emails = emails.filter((item) => item !== email);
    const username = usernames[Math.floor(Math.random() * usernames.length)];
    usernames = usernames.filter((item) => item !== username);
    const password = passwords[Math.floor(Math.random() * passwords.length)];
    const role = roles[Math.floor(Math.random() * roles.length)] as UserRole;

    const user = await User.create({
      email: email,
      password: password,
      role: role,
      username: username,
      isActive: true,
    });

    generatedUserPasswords.push({
      username,
      email,
      password,
      role,
    });

    const probOfSpace = Math.random() < namingProb.hasDoubleFirstNameSpace;
    const probOfHyphen = Math.random() < namingProb.hasDoubleFirstNameHyphen;
    let firstname: string;
    if (probOfSpace || probOfHyphen) {
      const separator = probOfHyphen ? "-" : " ";
      firstname = `${pick(firstnames)}${separator}${pick(firstnames)}`;
    } else {
      firstname = pick(firstnames);
    }

    const probOfMiddle = Math.random() < namingProb.hasMiddleName;
    const middlename = probOfMiddle ? pick(middlenames) : null;

    const probOfLastSpace = Math.random() < namingProb.hasDoubleLastNameSpace;
    const probOfLastHyphen = Math.random() < namingProb.hasDoubleLastNameHyphen;
    let lastname: string;
    if (probOfLastSpace || probOfLastHyphen) {
      const separator = probOfLastHyphen ? "-" : " ";
      lastname = `${pick(lastnames)}${separator}${pick(lastnames)}`;
    } else {
      lastname = pick(lastnames);
    }

    const randomDeptKey =
      departmentKeys[Math.floor(Math.random() * departmentKeys.length)];
    const staffArray = staffMap[randomDeptKey];
    const randomStaff =
      staffArray[Math.floor(Math.random() * staffArray.length)];
    const department = randomDeptKey;
    const position = randomStaff.position;
    const staffRole = randomStaff.role;

    await Employee.create({
      userId: user.id,
      firstname,
      middlename,
      lastname,
      countryCode: "+47",
      phone: randomPhoneNumber(),
      department,
      position,
      role: staffRole,
      isActive: true,
      isOnline: false,
    });
  }
}

seed();

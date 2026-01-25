// import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@expressBackend/config/db.config";
import { departmentCodes } from "@expressBackend/schema/employee.schema";
import { DataTypes, Model, Optional, Op } from "sequelize";
import {
  departments,
  positions,
  roles,
} from "@expressBackend/constants/employee.contants";

// const departments = [
//   "Executive",
//   "Management",
//   "Administration",
//   "FinanceAndAccounting",
//   "HumanResources",
//   "SalesAndMarketing",
//   "OperationsAndProduction",
//   "InformationTechnology",
//   "CustomerService",
//   "LegalAndCompliance",
// ];

// const positions = [
//   "CEO",
//   "COO",
//   "CFO",
//   "CTO",
//   "GeneralManager",
//   "DepartmentManager",
//   "ProjectManager",
//   "TeamLead",
//   "OfficeAdministrator",
//   "ExecutiveAssistant",
//   "Accountant",
//   "PayrollSpecialist",
//   "FinancialAnalyst",
//   "HRManager",
//   "Recruiter",
//   "HRCoordinator",
//   "SalesRepresentative",
//   "MarketingManager",
//   "SocialMediaManager",
//   "ContentStrategist",
//   "GrowthAnalyst",
//   "OperationsManager",
//   "ProductionWorker",
//   "Technician",
//   "QualityControlInspector",
//   "SupplyChainCoordinator",
//   "ITManager",
//   "SystemAdministrator",
//   "NetworkAdministrator",
//   "SoftwareDeveloper",
//   "SeniorSoftwareDeveloper",
//   "TechnicalLead",
//   "DevOpsEngineer",
//   "SiteReliabilityEngineer",
//   "SecurityEngineer",
//   "SecurityAnalyst",
//   "DatabaseAdministrator",
//   "DataEngineer",
//   "DataAnalyst",
//   "QATester",
//   "QAEngineer",
//   "TechnicalSupportSpecialist",
//   "ITSupportManager",
//   "CustomerServiceRepresentative",
//   "CustomerSupportManager",
//   "CustomerSuccessManager",
//   "LegalCounsel",
//   "ComplianceOfficer",
//   "RiskOfficer",
// ];

// const roles = [
//   "user",
//   "employee",
//   "admin",
//   "moderator",
//   "editor",
//   "manager",
//   "supervisor",
//   "operator",
//   "support",
//   "auditor",
//   "developer",
//   "system",
//   "superadmin",
// ];

export const staffMap = {
  // this will work as a template for checking positions and privilages.
  Executive: [
    { position: "CEO", role: "admin" }, //carefull about giving CEO's too much power (since they can have minimal IT experience)
    { position: "COO", role: "system" },
    { position: "CFO", role: "admin" },
    { position: "CTO", role: "superadmin" },
  ],
  Management: [
    { position: "GeneralManager", role: "manager" },
    { position: "DepartmentManager", role: "manager" },
    { position: "ProjectManager", role: "supervisor" },
    { position: "TeamLead", role: "supervisor" },
  ],

  Administration: [
    { position: "OfficeAdministrator", role: "operator" },
    { position: "ExecutiveAssistant", role: "support" },
  ],

  FinanceAndAccounting: [
    { position: "Accountant", role: "auditor" },
    { position: "PayrollSpecialist", role: "auditor" },
    { position: "FinancialAnalyst", role: "editor" },
  ],

  HumanResources: [
    { position: "HRManager", role: "manager" },
    { position: "Recruiter", role: "editor" },
    { position: "HRCoordinator", role: "support" },
  ],

  SalesAndMarketing: [
    { position: "SalesRepresentative", role: "employee" },
    { position: "MarketingManager", role: "manager" },
    { position: "SocialMediaManager", role: "editor" },
    { position: "ContentStrategist", role: "editor" },
    { position: "GrowthAnalyst", role: "editor" },
  ],

  OperationsAndProduction: [
    { position: "OperationsManager", role: "manager" },
    { position: "ProductionWorker", role: "operator" },
    { position: "Technician", role: "operator" },
    { position: "QualityControlInspector", role: "auditor" },
    { position: "SupplyChainCoordinator", role: "operator" },
  ],

  InformationTechnology: [
    { position: "ITManager", role: "system" },
    { position: "SystemAdministrator", role: "system" },
    { position: "NetworkAdministrator", role: "system" },

    { position: "SoftwareDeveloper", role: "developer" },
    { position: "SeniorSoftwareDeveloper", role: "developer" },
    { position: "TechnicalLead", role: "supervisor" },

    { position: "DevOpsEngineer", role: "system" },
    { position: "SiteReliabilityEngineer", role: "system" },

    { position: "SecurityEngineer", role: "system" },
    { position: "SecurityAnalyst", role: "auditor" },

    { position: "DatabaseAdministrator", role: "system" },
    { position: "DataEngineer", role: "developer" },
    { position: "DataAnalyst", role: "editor" },

    { position: "QATester", role: "employee" }, // maybe user would be good here since they are supposed to represent the user
    { position: "QAEngineer", role: "developer" },

    { position: "TechnicalSupportSpecialist", role: "support" },
    { position: "ITSupportManager", role: "supervisor" },
  ],

  CustomerService: [
    { position: "CustomerServiceRepresentative", role: "support" },
    { position: "CustomerSupportManager", role: "supervisor" },
    { position: "CustomerSuccessManager", role: "manager" },
  ],

  LegalAndCompliance: [
    { position: "LegalCounsel", role: "superadmin" },
    { position: "ComplianceOfficer", role: "auditor" },
    { position: "RiskOfficer", role: "auditor" },
  ],
};
/*
 */
// note: Types are at the bottom so any devs wont have to scroll through all of it to get to the model.
// note: I could, but i dont want to implement more complexity with sequelize-typescript (for now)
export interface EmployeeAttributes {
  id: string;
  // employeeId: number;
  employeeId: string;
  firstname: string;
  middlename?: string | null;
  lastname: string;
  email: string;
  countryCode: string;
  phone: string;
  department: string;
  position: string;
  role: string;
  isActive: boolean;
  isOnline: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoggedIn?: Date | null;
}

// type EmployeeCreationAttributes = Optional<
//   EmployeeAttributes,
//   "id" | "employeeId" | "email" | "createdAt" | "updatedAt" | "lastLoggedIn"
// >;

class Employee
  // extends Model<EmployeeAttributes, EmployeeCreationAttributes>
  extends Model<
    EmployeeAttributes,
    Omit<
      EmployeeAttributes,
      "id" | "employeeId" | "email" | "createdAt" | "updatedAt" | "lastLoggedIn"
    >
  >
  implements EmployeeAttributes
{
  declare id: string;
  // declare employeeId: number;
  declare employeeId: string;
  declare firstname: string;
  declare middlename?: string | null;
  declare lastname: string;
  declare email: string;
  declare countryCode: string;
  declare phone: string;
  declare department: string;
  declare position: string;
  declare role: string;
  declare isActive: boolean;
  declare isOnline: boolean;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare lastLoggedIn?: Date | null;

  toJSON(): Omit<EmployeeAttributes, "password"> {
    const values = { ...this.get() } as EmployeeAttributes;
    return values;
  }
}

Employee.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    employeeId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      // autoIncrement: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    middlename: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "+47",
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "employee",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    lastLoggedIn: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },

  {
    sequelize,
    tableName: "Employees",
    timestamps: true,
    hooks: {
      beforeValidate: async (employee: Employee) => {
        if (!employee.employeeId) {
          if (!employee.department) {
            throw new Error("Department is required to generate employeeId");
          }
          employee.employeeId = await generateEmployeeId(employee.department);
        }
        if (!employee.email) {
          if (!employee.firstname || !employee.lastname) {
            throw new Error(
              "Firstname and lastname are required to generate email",
            );
          }
          employee.email = await generateCompanyEmail(
            employee.firstname,
            employee.middlename ?? "",
            employee.lastname,
            employee.department,
          );
        }
      },
    },
  },
);

//* HELPER FUNCTIONS

// Format employee ID for display with department code
export async function generateEmployeeId(department: string): Promise<string> {
  const deptCode = departmentCodes[department] || "XX";
  const lastEmployee = await Employee.findOne({
    where: {
      department,
      employeeId: { [Op.like]: `EMP-${deptCode}-%` },
    },
    order: [["createdAt", "DESC"]],
  });
  let employeeNumber = 1;
  if (lastEmployee && lastEmployee.employeeId) {
    const match = lastEmployee.employeeId.match(/EMP-\w+-(\d+)/);
    if (match) {
      employeeNumber = parseInt(match[1], 10) + 1;
    }
  }

  return `EMP-${deptCode}-${employeeNumber.toString().padStart(9, "0")}`;
  // return `EMP-${employeeNumber.toString().padStart(7, "0")}`;
}

// Generate company email
export async function generateCompanyEmail(
  firstname: string,
  middlename: string,
  lastname: string,
  department: string,
): Promise<string> {
  /*
  generates a unique company email address based on name and department.
  will keep trying to push an email where it tries out different combinations of abbviviations. 
  it will keep adding characters to the abbriviations untill it works. 
  if nothing else works it will add a number and push it.  
  */
  const clean = (str: string) => str.toLowerCase().replace(/[^a-z]/g, "");
  const domain = `${department}.${process.env.COMPANY_DOMAIN}.${process.env.DOMAIN_EXTENTION}`;
  const cleanFirst = clean(firstname);
  const cleanMiddle = clean(middlename || "");
  const cleanLast = clean(lastname);

  // Helper to generate all abbreviation levels for a name
  function abbreviations(name: string): string[] {
    if (!name) return [""];
    const abbrs = [];
    for (let i = name.length; i > 0; i--) {
      abbrs.push(name.slice(0, i));
    }
    return abbrs;
  }

  // Try all abbreviation combos, then add numbers if needed
  let number = 0;
  while (true) {
    for (const first of abbreviations(cleanFirst)) {
      for (const middle of abbreviations(cleanMiddle)) {
        for (const last of abbreviations(cleanLast)) {
          // Try all base patterns
          const patterns = [
            `${first}.${last}`,
            `${first[0]}.${last}`,
            `${first}.${last[0]}`,
            middle ? `${first}.${middle[0]}.${last}` : "",
            middle ? `${first}.${middle}.${last}` : "",
            `${first}`,
            `${last}`,
          ].filter(Boolean);

          for (const base of patterns) {
            const email = `${base}${number ? number : ""}@${domain}`;
            const exists = await Employee.findOne({ where: { email } });
            if (!exists) return email;
          }
        }
      }
    }
    number++;
  }
}

//   const lastEmployee =
//   return "morendin";
// }
// type Department =
//   | "Executive"
//   | "Management"
//   | "Administration"
//   | "FinanceAndAccounting"
//   | "HumanResources"
//   | "SalesAndMarketing"
//   | "OperationsAndProduction"
//   | "InformationTechnology"
//   | "CustomerService"
//   | "LegalAndCompliance";

// type Position =
//   | "CEO"
//   | "COO"
//   | "CFO"
//   | "CTO"
//   | "GeneralManager"
//   | "DepartmentManager"
//   | "ProjectManager"
//   | "TeamLead"
//   | "OfficeAdministrator"
//   | "ExecutiveAssistant"
//   | "Accountant"
//   | "PayrollSpecialist"
//   | "FinancialAnalyst"
//   | "HRManager"
//   | "Recruiter"
//   | "HRCoordinator"
//   | "SalesRepresentative"
//   | "MarketingManager"
//   | "SocialMediaManager"
//   | "ContentStrategist"
//   | "GrowthAnalyst"
//   | "OperationsManager"
//   | "ProductionWorker"
//   | "Technician"
//   | "QualityControlInspector"
//   | "SupplyChainCoordinator"
//   | "ITManager"
//   | "SystemAdministrator"
//   | "NetworkAdministrator"
//   | "SoftwareDeveloper"
//   | "SeniorSoftwareDeveloper"
//   | "TechnicalLead"
//   | "DevOpsEngineer"
//   | "SiteReliabilityEngineer"
//   | "SecurityEngineer"
//   | "SecurityAnalyst"
//   | "DatabaseAdministrator"
//   | "DataEngineer"
//   | "DataAnalyst"
//   | "QATester"
//   | "QAEngineer"
//   | "TechnicalSupportSpecialist"
//   | "ITSupportManager"
//   | "CustomerServiceRepresentative"
//   | "CustomerSupportManager"
//   | "CustomerSuccessManager"
//   | "LegalCounsel"
//   | "ComplianceOfficer"
//   | "RiskOfficer";

// type Role =
//   | "user"
//   | "admin"
//   | "moderator"
//   | "editor"
//   | "manager"
//   | "supervisor"
//   | "operator"
//   | "support"
//   | "auditor"
//   | "developer"
//   | "system"
//   | "superadmin";

export type Department = (typeof departments)[number];
export type Position = (typeof positions)[number];
export type Role = (typeof roles)[number];
export default Employee;
// export type { EmployeeCreationAttributes };
export { departments, positions, roles };

// generateEmployeeId("IT").then((id: string) => {
//   // ... use id ...
// });

// generateEmployeeId("IT").then((id: string) => {
//   // ... use id ...
// });

import sequelize from "@/app/api/expressBackend/config/db.config";
import { departmentCodes } from "@/app/api/expressBackend/schema/employee.schema";
import { DataTypes, Model, Op } from "sequelize";
import {
  departments,
  positions,
  roles,
} from "@/app/api/expressBackend/constants/employee.contants";

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
// note: Types are at the bottom so any devs wont have to scroll through all of it to get to the model.
// note: I could, but i dont want to implement more complexity with sequelize-typescript (for now)
export interface EmployeeAttributes {
  id: string;
  userId: string;
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

class Employee
  extends Model<
    EmployeeAttributes,
    Omit<
      EmployeeAttributes,
      "employeeId" | "email" | "createdAt" | "updatedAt" | "lastLoggedIn"
    >
  >
  implements EmployeeAttributes
{
  declare id: string;
  declare userId: string;
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
      field: "id",
    },
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      field: "user_id",
    },
    employeeId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "employee_id",
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "firstname",
    },
    middlename: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "middlename",
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "lastname",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "email",
      validate: { isEmail: true },
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "+47",
      field: "country_code",
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "phone",
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "department",
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "position",
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "employee",
      field: "role",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_online",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
    lastLoggedIn: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      field: "last_logged_in",
    },
  },

  {
    sequelize,
    tableName: "Employees",
    timestamps: true,
    indexes: [
      {
        fields: ["lastname", "firstname", "middlename"],
      },
      {
        fields: ["employee_id", "user_id"],
      },
    ],
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
      // beforeCreate: async (employee: Employee) => {
      //   employee.userId;
      // },
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

export type Department = (typeof departments)[number];
export type Position = (typeof positions)[number];
export type Role = (typeof roles)[number];
export default Employee;
export { departments, positions, roles };

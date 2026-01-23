import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.config.js";
/*
  const staffMap = {
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
*/
// note: Types are at the bottom so any devs wont have to scroll through all of it to get to the model.
// note: I could, but i dont want to implement more complexity with sequelize-typescript (for now)
interface EmployeeAttributes {
  id: string;
  employeeId: number; // changed from string to number to match schema
  firstname: string;
  lastname: string;
  email: string;
  countryCode: string;
  phone: string;
  department: Department;
  position: Position;
  role: Role;
  isActive: boolean;
  isOnline: boolean;
  createdAt?: Date; //idk if this should be ? or not.
  updatedAt?: Date; //idk if this should be ? or not.
  lastLoggedIn?: Date | null; // nullable to match schema
}
class Employee
  extends Model<
    EmployeeAttributes,
    Omit<EmployeeAttributes, "id" | "createdAt" | "updatedAt" | "employeeId">
  >
  implements EmployeeAttributes
{
  declare id: string;
  declare employeeId: number;
  declare firstname: string;
  declare lastname: string;
  declare email: string;
  declare countryCode: string;
  declare phone: string;
  declare department: Department;
  declare position: Position;
  declare role: Role;
  declare isActive: boolean;
  declare isOnline: boolean;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare lastLoggedIn?: Date | null;
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
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      unique: true,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "First name cannot be empty",
        },
        len: {
          args: [2, 50],
          msg: "First name must be between 2 and 50 characters",
        },
        is: {
          args: /^[a-zA-ZæøåÆØÅ\s'-]+$/i,
          msg: "First name can only contain letters, spaces, hyphens, and apostrophes",
        },
      },
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Last name cannot be empty",
        },
        len: {
          args: [2, 50],
          msg: "Last name must be between 2 and 50 characters",
        },
        is: {
          args: /^[a-zA-ZæøåÆØÅ\s'-]+$/i,
          msg: "Last name can only contain letters, spaces, hyphens, and apostrophes",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^\+\d{1,4}$/,
          msg: "Country code must start with + and have 1-4 digits",
        },
      },
      defaultValue: "+47",
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Phone number is required",
        },
        is: {
          args: /^[\d\s]+$/,
          msg: "Phone number can only contain digits and spaces",
        },
      },
    },
    department: {
      type: DataTypes.ENUM(
        "Executive",
        "Management",
        "Administration",
        "FinanceAndAccounting",
        "HumanResources",
        "SalesAndMarketing",
        "OperationsAndProduction",
        "InformationTechnology",
        "CustomerService",
        "LegalAndCompliance",
      ),
      allowNull: false,
    },
    position: {
      type: DataTypes.ENUM(
        "CEO",
        "COO",
        "CFO",
        "CTO",
        "GeneralManager",
        "DepartmentManager",
        "ProjectManager",
        "TeamLead",
        "OfficeAdministrator",
        "ExecutiveAssistant",
        "Accountant",
        "PayrollSpecialist",
      ),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
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
  },

  {
    sequelize,
    tableName: "Employees",
    timestamps: true,

    // Indexes for performance
    indexes: [
      {
        fields: ["lastname", "firstname"],
      },
    ],
  },
);

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

const departments = [
  "Executive",
  "Management",
  "Administration",
  "FinanceAndAccounting",
  "HumanResources",
  "SalesAndMarketing",
  "OperationsAndProduction",
  "InformationTechnology",
  "CustomerService",
  "LegalAndCompliance",
];
const positions = [
  "CEO",
  "COO",
  "CFO",
  "CTO",
  "GeneralManager",
  "DepartmentManager",
  "ProjectManager",
  "TeamLead",
  "OfficeAdministrator",
  "ExecutiveAssistant",
  "Accountant",
  "PayrollSpecialist",
  "FinancialAnalyst",
  "HRManager",
  "Recruiter",
  "HRCoordinator",
  "SalesRepresentative",
  "MarketingManager",
  "SocialMediaManager",
  "ContentStrategist",
  "GrowthAnalyst",
  "OperationsManager",
  "ProductionWorker",
  "Technician",
  "QualityControlInspector",
  "SupplyChainCoordinator",
  "ITManager",
  "SystemAdministrator",
  "NetworkAdministrator",
  "SoftwareDeveloper",
  "SeniorSoftwareDeveloper",
  "TechnicalLead",
  "DevOpsEngineer",
  "SiteReliabilityEngineer",
  "SecurityEngineer",
  "SecurityAnalyst",
  "DatabaseAdministrator",
  "DataEngineer",
  "DataAnalyst",
  "QATester",
  "QAEngineer",
  "TechnicalSupportSpecialist",
  "ITSupportManager",
  "CustomerServiceRepresentative",
  "CustomerSupportManager",
  "CustomerSuccessManager",
  "LegalCounsel",
  "ComplianceOfficer",
  "RiskOfficer",
];
const roles = [
  "user",
  "employee",
  "admin",
  "moderator",
  "editor",
  "manager",
  "supervisor",
  "operator",
  "support",
  "auditor",
  "developer",
  "system",
  "superadmin",
];
type Department = (typeof departments)[number];
type Position = (typeof positions)[number];
type Role = (typeof roles)[number];

export default Employee;
export type { EmployeeAttributes, Department, Position, Role };
export { departments, positions, roles };

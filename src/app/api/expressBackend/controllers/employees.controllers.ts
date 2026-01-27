import {
  EmployeeCreation,
  EmployeeSchemaCreate,
  EmployeeSchemaUpdate,
  EmployeeUpdate,
} from "@/app/api/expressBackend/schema/employee.schema";
import Employee, {
  EmployeeAttributes,
} from "@/app/api/expressBackend/models/employee.model";
import {
  UniqueConstraintError,
  ValidationError as SequelizeValidationError,
} from "sequelize";
import { ZodError } from "zod";

type EmployeeSafe = Omit<EmployeeAttributes, "passwordHash">;

function getStatusFromError(error: unknown): number {
  if (error instanceof ZodError) return 400;
  if (typeof error === "object" && error !== null) {
    const clientError = error as { message?: string };
    const msg = clientError.message?.toLowerCase() ?? "";
    if (msg.includes("not found")) return 404;
    if (msg.includes("conflict")) return 409;
    if (msg.includes("unique constraint")) return 409;
    if (msg.includes("validation error")) return 400;
  }
  return 500;
}

export async function getEmployees(): Promise<EmployeeSafe[]> {
  try {
    const employees = await Employee.findAll({
      attributes: { exclude: ["password"] },
    });
    console.info(
      `GET /employees`,
      employees.map((employee) => ({
        id: employee.id,
        employeeId: employee.employeeId,
        firstname: employee.firstname,
        lastname: employee.lastname,
        email: employee.email,
        countryCode: employee.countryCode,
        phone: employee.phone,
        department: employee.department,
        position: employee.position,
        role: employee.role,
        isActive: employee.isActive,
        isOnline: employee.isOnline,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt,
        lastLoggedIn: employee.lastLoggedIn,
      })),
    );
    return employees.map((employee) => employee.toJSON() as EmployeeSafe);
  } catch (error) {
    console.error(`GET /employees`, {
      error: error instanceof Error ? error.message : error,
    });
    const clientError = new Error("Failed to fetch employees");
    (clientError as Error & { status: number }).status =
      getStatusFromError(error);
    throw clientError;
  }
}

export async function getEmployeeById(id: string): Promise<EmployeeSafe> {
  try {
    const employee = await Employee.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!employee) {
      const clientError = new Error("Employee not found");
      (clientError as Error & { status: number }).status = 404;
      console.error(`GET /employees/${id}`, { error: "Employee not found" });
      throw clientError;
    }
    console.info(`GET /employees/${id}`, {
      // I will return everything for now and cherrypick based on employee's (user) roles
      id: employee.id,
      employeeId: employee.employeeId,
      firstname: employee.firstname,
      lastname: employee.lastname,
      email: employee.email,
      countryCode: employee.countryCode,
      phone: employee.phone,
      department: employee.department,
      position: employee.position,
      role: employee.role,
      isActive: employee.isActive,
      isOnline: employee.isOnline,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
      lastLoggedIn: employee.lastLoggedIn,
    });
    return employee.toJSON() as EmployeeSafe;
  } catch (error) {
    console.error(`GET /employees/${id}`, {
      error: error instanceof Error ? error.message : error,
    });
    const clientError = new Error("Failed to fetch employee");
    (clientError as Error & { status: number }).status =
      getStatusFromError(error);
    throw clientError;
  }
}

export async function createEmployee(createEmployeeData: EmployeeCreation) {
  try {
    const validatedData = EmployeeSchemaCreate.parse(createEmployeeData);

    const employee = await Employee.create({
      ...validatedData,
      userId: String((createEmployeeData as { userId?: string }).userId),
      isActive: false,
      isOnline: false,
    });

    console.info(`POST /employees`, {
      id: employee.id,
      userId: employee.userId,
      employeeId: employee.employeeId,
      firstname: employee.firstname,
      lastname: employee.lastname,
      email: employee.email,
      countryCode: employee.countryCode,
      phone: employee.phone,
      department: employee.department,
      position: employee.position,
      role: employee.role,
      isActive: employee.isActive,
      isOnline: employee.isOnline,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
      lastLoggedIn: employee.lastLoggedIn,
    });

    return employee.toJSON() as EmployeeSafe;
  } catch (error) {
    if (error instanceof ZodError) {
      console.error(`POST /employees`, { error: error.issues });
      (error as ZodError & { status?: number }).status = 400;
      throw error;
    }
    if (error instanceof UniqueConstraintError) {
      console.error(`POST /employees`, {
        error: "A employee with the same credentials already exists.",
      });
      const clientError = new Error(
        "A employee with the same credentials already exists.",
      ) as Error & { status?: number };
      clientError.status = 409;
      throw clientError;
    }
    console.error(`POST /employees`, {
      error: error instanceof Error ? error.message : error,
    });
    const clientError = new Error("Failed to create employee") as Error & {
      status?: number;
    };
    clientError.status = getStatusFromError(error);
    throw clientError;
  }
}

export async function updateEmployee(id: string, updateData: EmployeeUpdate) {
  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      const clientError = new Error("Employee not found");
      (clientError as Error & { status: number }).status = 404;
      console.error(`PATCH /employees/${id}`, { error: "Employee not found" });
      throw clientError;
    }
    // Use the correct schema for updates
    const validatedData = EmployeeSchemaUpdate.parse(updateData);

    await employee.update(validatedData);

    const result = employee.toJSON() as EmployeeSafe;
    console.info(`PATCH /employees/${id}`, {
      id: employee.id,
      userId: employee.userId,
      employeeId: employee.employeeId,
      firstname: employee.firstname,
      lastname: employee.lastname,
      email: employee.email,
      countryCode: employee.countryCode,
      phone: employee.phone,
      department: employee.department,
      position: employee.position,
      role: employee.role,
      isActive: employee.isActive,
      isOnline: employee.isOnline,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
      lastLoggedIn: employee.lastLoggedIn,
    });
    return result;
  } catch (error) {
    if (error instanceof ZodError) {
      console.error(`PATCH /employees/${id}`, { error: error.issues });
      (error as ZodError & { status: number }).status = 400;
      throw error;
    }
    if (error instanceof SequelizeValidationError) {
      console.error(`PATCH /employees/${id}`, { error: error.errors });
      const clientError = new Error("Validation error") as Error & {
        status: number;
      };
      clientError.status = 400;
      throw clientError;
    }
    console.error(`PATCH /employees/${id}`, {
      error: error instanceof Error ? error.message : error,
    });
    const clientError = new Error("Failed to update employee");
    (clientError as Error & { status: number }).status =
      getStatusFromError(error);
    throw clientError;
  }
}

export async function deleteEmployee(id: string): Promise<EmployeeSafe | null> {
  try {
    const employee = await Employee.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!employee) {
      const clientError = new Error("Employee not found");
      (clientError as Error & { status: number }).status = 404;
      console.error(`DELETE /employees/${id}`, { error: "Employee not found" });
      throw clientError;
    }

    const employeeData = employee.toJSON() as EmployeeSafe;
    await employee.destroy();

    console.info(`DELETE /employees/${id}`, {
      id: employee.id,
      userId: employee.id,
      employeeId: employee.employeeId,
      firstname: employee.firstname,
      lastname: employee.lastname,
      email: employee.email,
      countryCode: employee.countryCode,
      phone: employee.phone,
      department: employee.department,
      position: employee.position,
      role: employee.role,
      isActive: employee.isActive,
      isOnline: employee.isOnline,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
      lastLoggedIn: employee.lastLoggedIn,
    });

    return employeeData;
  } catch (error) {
    console.error(`DELETE /employees/${id}`, {
      error: error instanceof Error ? error.message : error,
    });
    const clientError = new Error("Failed to delete employee");
    (clientError as Error & { status: number }).status =
      getStatusFromError(error);
    throw clientError;
  }
}

// ----------------------------------------------
//               HELPER FUNCTIONS
// ----------------------------------------------

// Normalize phone for storage (strips spaces)
export function normalizePhone(phone: string): string {
  return phone.replace(/\s/g, "");
}

// Format phone for display (adds spaces)
export function formatPhone(countryCode: string, phone: string): string {
  const cleaned = phone.replace(/\s/g, "");
  if (cleaned.length === 8) {
    return `${countryCode} ${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5)}`;
  }
  return `${countryCode} ${cleaned.match(/.{1,3}/g)?.join(" ") || cleaned}`;
}

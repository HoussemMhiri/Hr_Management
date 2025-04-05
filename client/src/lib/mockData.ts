
import { User, Leave } from "@/types";
import { addDays, format } from "date-fns";

// Mock users data
export const users: User[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    sickLeaveBalance: 10,
    paidLeaveBalance: 25,
    exceptionBalance: 5
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    password: "user123",
    role: "user",
    sickLeaveBalance: 8,
    paidLeaveBalance: 20,
    exceptionBalance: 3
  },
  {
    id: 3,
    name: "Jane Smith",
    email: "jane@example.com",
    password: "user123",
    role: "user",
    sickLeaveBalance: 10,
    paidLeaveBalance: 22,
    exceptionBalance: 5
  }
];

// Generate random past, current and future leave requests
const today = new Date();
const generateRandomDate = (minDays: number, maxDays: number) => {
  const randomDays = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
  return addDays(today, randomDays);
};

// Mock leave requests data
export const leaves: Leave[] = [
  {
    id: 1,
    userId: 2,
    type: "paid",
    startDate: format(generateRandomDate(5, 10), "yyyy-MM-dd"),
    endDate: format(generateRandomDate(11, 15), "yyyy-MM-dd"),
    status: "approved",
    reason: "Annual vacation",
    requestDate: format(addDays(today, -10), "yyyy-MM-dd"),
    responseDate: format(addDays(today, -8), "yyyy-MM-dd")
  },
  {
    id: 2,
    userId: 3,
    type: "sick",
    startDate: format(generateRandomDate(-5, -3), "yyyy-MM-dd"),
    endDate: format(generateRandomDate(-2, -1), "yyyy-MM-dd"),
    status: "approved",
    reason: "Medical appointment",
    requestDate: format(addDays(today, -8), "yyyy-MM-dd"),
    responseDate: format(addDays(today, -7), "yyyy-MM-dd")
  },
  {
    id: 3,
    userId: 2,
    type: "exception",
    startDate: format(addDays(today, 0), "yyyy-MM-dd"),
    endDate: format(addDays(today, 0), "yyyy-MM-dd"),
    status: "pending",
    reason: "Family emergency",
    requestDate: format(addDays(today, -1), "yyyy-MM-dd")
  },
  {
    id: 4,
    userId: 3,
    type: "paid",
    startDate: format(generateRandomDate(15, 20), "yyyy-MM-dd"),
    endDate: format(generateRandomDate(21, 25), "yyyy-MM-dd"),
    status: "pending",
    reason: "Summer vacation",
    requestDate: format(addDays(today, -3), "yyyy-MM-dd")
  }
];

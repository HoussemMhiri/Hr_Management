
// User types
export type UserRole = "admin" | "user";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  sickLeaveBalance: number;
  paidLeaveBalance: number;
  exceptionBalance: number;
}

// Leave types
export type LeaveType = "sick" | "paid" | "exception";
export type LeaveStatus = "pending" | "approved" | "rejected";

export interface Leave {
  id: number;
  userId: number;
  type: LeaveType;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  reason?: string;
  comment?: string;
  requestDate: string;
  responseDate?: string;
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Leave balance chart data
export interface BalanceChartData {
  name: string;
  value: number;
  color: string;
}

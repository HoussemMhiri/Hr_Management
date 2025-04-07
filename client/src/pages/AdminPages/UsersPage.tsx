import React from "react";
/* import { users, leaves } from "@/lib/mockData"; */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { useLeave } from "@/context/LeaveContext";

const UsersPage: React.FC = () => {
  const { allUsers, fetchAllUsers } = useAuth();
  const { allLeaves, fetchAllLeaves } = useLeave();

  // Get the pending leave count for each user
  const getPendingLeaveCount = (userId: number) => {
    return allLeaves.filter(
      (leave) => leave.userId === userId && leave.status === "pending"
    ).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Sick Leave</TableHead>
                <TableHead>Paid Leave</TableHead>
                <TableHead>Exception</TableHead>
                <TableHead>Pending Requests</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsers
                .sort((a, b) => {
                  // Prioritize users with the "admin" role
                  if (a.role === "admin" && b.role !== "admin") {
                    return -1;
                  }
                  if (b.role === "admin" && a.role !== "admin") {
                    return 1;
                  }
                  return 0;
                })
                .map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell>{user.sickLeaveBalance} days</TableCell>
                    <TableCell>{user.paidLeaveBalance} days</TableCell>
                    <TableCell>{user.exceptionBalance} days</TableCell>
                    <TableCell>{getPendingLeaveCount(user._id)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;

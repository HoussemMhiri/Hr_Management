import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { Leave, User } from "@/types";
import { format, parseISO } from "date-fns";

interface RecentLeavesCardProps {
  leaves: Leave[];
  users?: User[];
  showUser?: boolean;
}

const RecentLeavesCard: React.FC<RecentLeavesCardProps> = ({
  leaves,
  users,
  showUser = false,
}) => {
  // Helper to get user name
  const getUserName = (userId: number): string => {
    const user = users?.find((u) => u.id === userId);
    return user ? user.name : `User ${userId}`;
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  // Get leave type label
  const getLeaveTypeLabel = (type: string) => {
    switch (type) {
      case "sick":
        return "Sick Leave";
      case "paid":
        return "Paid Leave";
      case "exception":
        return "Exception";
      default:
        return type;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Recent Leave Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {showUser && <TableHead>Employee</TableHead>}
                <TableHead>Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaves.length > 0 ? (
                leaves.slice(0, 5).map((leave, index) => (
                  <TableRow key={`${leave._id}-${index}`}>
                    {showUser && (
                      <TableCell className="font-medium">
                        {getUserName(leave.userId)}
                      </TableCell>
                    )}
                    <TableCell>{getLeaveTypeLabel(leave.type)}</TableCell>
                    <TableCell>
                      {format(parseISO(leave.startDate), "MMM d")} -{" "}
                      {format(parseISO(leave.endDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{getStatusBadge(leave.status)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={showUser ? 4 : 3}
                    className="text-center text-muted-foreground"
                  >
                    No recent leave requests
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentLeavesCard;

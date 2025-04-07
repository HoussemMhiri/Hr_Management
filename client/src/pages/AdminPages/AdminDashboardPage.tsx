import React, { useEffect, useState } from "react";
import { leaves, users } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { Badge } from "@/components/ui";
import StatsCard from "@/components/Dashboard/StatsCard";
import { Calendar, CheckCircle2, Clock, Users, XCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Leave } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useLeave } from "@/context/LeaveContext";
import { useAuth } from "@/context/AuthContext";
import axios from "@/lib/axios";

// Admin dashboard
const AdminDashboardPage: React.FC = () => {
  const { allUsers, fetchAllUsers } = useAuth();
  const { allLeaves } = useLeave();
  const [leaveRequests, setLeaveRequests] = useState<Leave[]>(allLeaves);
  const { toast } = useToast();

  // Stats calculations
  const pendingRequests = leaveRequests?.filter(
    (leave) => leave?.status === "pending"
  ).length;

  const approvedRequests = leaveRequests.filter(
    (leave) => leave.status === "approved"
  ).length;

  const todaysRequests = leaveRequests.filter(
    (leave) =>
      leave.requestDate.split("T")[0] === new Date().toISOString().split("T")[0]
  ).length;

  // Get user name by ID
  const getUserName = () => {
    const user = allUsers.find((u) => u.role === "user");
    return user ? user.name : "User not found";
  };

  // Handle leave request approval/rejection
  /* const handleLeaveAction = (
    leaveId: number,
    status: "approved" | "rejected"
  ) => {
    setLeaveRequests(
      leaveRequests.map((leave) =>
        leave.id === leaveId
          ? {
              ...leave,
              status,
              responseDate: new Date().toISOString().split("T")[0],
            }
          : leave
      )
    );

    toast({
      title: `Request ${status}`,
      description: `Leave request has been ${status}.`,
    });
  }; */
  const handleLeaveAction = async (
    leaveId: number,
    status: "approved" | "rejected",
    userId: number,
    type: string,
    daysCount: number
  ) => {
    try {
      const response = await axios.put(`/leave/${leaveId}`, {
        status,
        userId,
        type,
        daysCount,
      });

      if (response.status === 200) {
        setLeaveRequests(
          leaveRequests.map((leave) =>
            leave.id === leaveId
              ? {
                  ...leave,
                  status,
                  responseDate: new Date().toISOString().split("T")[0],
                }
              : leave
          )
        );
        window.location.reload();
        toast({
          title: `Request ${status}`,
          description: `Leave request has been ${status}.`,
        });
      }
    } catch (error) {
      console.error("Error updating leave status:", error);
      toast({
        title: "Error",
        description: "There was an error updating the leave request.",
      });
    }
  };

  // Get badge for leave status
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

  const fetchAllLeaves = async () => {
    try {
      const response = await axios.get("/leave/all");
      setLeaveRequests(response.data.leaves);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };
  useEffect(() => {
    fetchAllLeaves();
  }, []);

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

  const pendingLeaves = leaveRequests.filter(
    (leave) => leave.status === "pending"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <StatsCard
          title="Pending Requests"
          value={pendingRequests}
          icon={<Clock className="h-5 w-5" />}
        />
        <StatsCard
          title="Approved Leaves"
          value={approvedRequests}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatsCard
          title="Total Users"
          value={allUsers.length}
          icon={<Users className="h-5 w-5" />}
        />
        <StatsCard
          title="Today's Requests"
          value={todaysRequests}
          icon={<Calendar className="h-5 w-5" />}
        />
      </div>

      {/* Pending Leave Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pending Leave Requests</CardTitle>
          <CardDescription>
            Review and manage leave requests from your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingLeaves.length > 0 ? (
                pendingLeaves.map((leave) => (
                  <TableRow key={leave._id}>
                    <TableCell className="font-medium">
                      {getUserName()}
                    </TableCell>
                    <TableCell>{getLeaveTypeLabel(leave.type)}</TableCell>
                    <TableCell>
                      {format(parseISO(leave.startDate), "MMM d")} -{" "}
                      {format(parseISO(leave.endDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      {format(parseISO(leave.requestDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{getStatusBadge(leave.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
                          onClick={() =>
                            handleLeaveAction(
                              leave._id,
                              "approved",
                              leave.userId,
                              leave.type,
                              leave.daysCount
                            )
                          }
                        >
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() =>
                            handleLeaveAction(
                              leave._id,
                              "rejected",
                              leave.userId,
                              leave.type,
                              leave.daysCount
                            )
                          }
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    No pending leave requests
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent leave history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Leave History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.filter((leave) => leave.status !== "pending")
                .length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    No recent leave history
                  </TableCell>
                </TableRow>
              ) : (
                leaveRequests
                  .filter((leave) => leave.status !== "pending")
                  .slice(0, 5)
                  .map((leave) => (
                    <TableRow key={leave._id}>
                      <TableCell className="font-medium">
                        {getUserName()}
                      </TableCell>
                      <TableCell>{getLeaveTypeLabel(leave.type)}</TableCell>
                      <TableCell>
                        {format(parseISO(leave.startDate), "MMM d")} -{" "}
                        {format(parseISO(leave.endDate), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{getStatusBadge(leave.status)}</TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end border-t px-6 py-4">
          <Button variant="outline">View All History</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;

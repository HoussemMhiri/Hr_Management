import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { differenceInBusinessDays, parseISO } from "date-fns";
import { Leave, LeaveType, User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { useLeave } from "@/context/LeaveContext";

interface LeaveFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onSubmit: (leave: Partial<Leave>) => void;
}

const LeaveForm: React.FC<LeaveFormProps> = ({
  open,
  onOpenChange,
  user,
  onSubmit,
}) => {
  const { fetchUser } = useAuth();
  const { fetchLeaves } = useLeave();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [leaveType, setLeaveType] = useState<LeaveType>("paid");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Calculate number of days (business days only)
  const daysCount =
    startDate && endDate
      ? differenceInBusinessDays(parseISO(endDate), parseISO(startDate)) + 1
      : 0;

  // Get balance for selected leave type
  const getBalance = () => {
    switch (leaveType) {
      case "paid":
        return user.paidLeaveBalance;
      case "sick":
        return user.sickLeaveBalance;
      case "exception":
        return user.exceptionBalance;
      default:
        return 0;
    }
  };

  // Check if request is valid
  const isValid =
    startDate &&
    endDate &&
    leaveType &&
    daysCount > 0 &&
    daysCount <= getBalance() &&
    (leaveType !== "exception" || reason.trim().length > 0);

  const handleSubmit = async () => {
    if (!isValid) return;

    setIsSubmitting(true);

    // Create leave request object
    const leaveRequest: Partial<Leave> = {
      type: leaveType,
      startDate,
      endDate,
      reason,
      daysCount,
      requestDate: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await axios.post("/leave", leaveRequest);

      if (response.status === 201) {
        toast({
          title: "Leave request submitted",
          description: "Your leave request has been submitted for approval.",
        });

        resetForm();
        fetchUser();
        fetchLeaves();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error submitting leave request:", error);
      toast({
        title: "Error",
        description: "Failed to submit leave request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setStartDate("");
    setEndDate("");
    setLeaveType("paid");
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Leave</DialogTitle>
          <DialogDescription>
            Fill out this form to submit a leave request.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="leave-type">Leave Type</Label>
            <Select
              value={leaveType}
              onValueChange={(value) => setLeaveType(value as LeaveType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Leave Types</SelectLabel>
                  <SelectItem value="paid">
                    Paid Leave ({user.paidLeaveBalance} days available)
                  </SelectItem>
                  <SelectItem value="sick">
                    Sick Leave ({user.sickLeaveBalance} days available)
                  </SelectItem>
                  <SelectItem value="exception">
                    Exception ({user.exceptionBalance} days available)
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a reason for your leave request"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          {startDate && endDate && daysCount > 0 && (
            <div className="rounded-md bg-accent p-3">
              <p className="text-sm font-medium">
                Duration:{" "}
                <span className="font-bold">
                  {daysCount} {daysCount === 1 ? "day" : "days"}
                </span>
              </p>
              <p className="text-sm">
                {leaveType && (
                  <>
                    Balance after request:{" "}
                    <span className="font-bold">
                      {Math.max(0, getBalance() - daysCount)} days
                    </span>
                  </>
                )}
              </p>
              {daysCount > getBalance() && (
                <p className="mt-1 text-xs text-destructive">
                  Warning: Request exceeds your available balance
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveForm;

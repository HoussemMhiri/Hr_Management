
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const SettingsPage: React.FC = () => {
  const [defaultSettings, setDefaultSettings] = useState({
    sickLeaveDefault: 10,
    paidLeaveDefault: 20,
    exceptionLeaveDefault: 5,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings saved",
        description: "Default leave allocations have been updated.",
      });
    }, 1000);
  };

  const handleResetBalances = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Balances reset",
        description: "All user leave balances have been reset to default values.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Default Leave Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Default Leave Allocations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sick-leave">Default Sick Leave Days</Label>
              <Input
                id="sick-leave"
                type="number"
                min={0}
                value={defaultSettings.sickLeaveDefault}
                onChange={(e) =>
                  setDefaultSettings({
                    ...defaultSettings,
                    sickLeaveDefault: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paid-leave">Default Paid Leave Days</Label>
              <Input
                id="paid-leave"
                type="number"
                min={0}
                value={defaultSettings.paidLeaveDefault}
                onChange={(e) =>
                  setDefaultSettings({
                    ...defaultSettings,
                    paidLeaveDefault: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exception-leave">Default Exception Days</Label>
              <Input
                id="exception-leave"
                type="number"
                min={0}
                value={defaultSettings.exceptionLeaveDefault}
                onChange={(e) =>
                  setDefaultSettings({
                    ...defaultSettings,
                    exceptionLeaveDefault: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <Button className="w-full" onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>
          </CardContent>
        </Card>

        {/* Reset Balances */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reset Leave Balances</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Reset all users' leave balances to the default values. This is
                typically done at the beginning of a new year.
              </p>
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Warning
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        This action will reset leave balances for all users. This
                        cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Button
              className="w-full"
              variant="outline"
              onClick={handleResetBalances}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Reset All Balances"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;

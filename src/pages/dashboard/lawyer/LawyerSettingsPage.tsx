import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/toaster";
import { ROUTES } from "@/constants/routes.constants";

export function LawyerSettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [available, setAvailable] = useState(true);

  const handleLogout = async () => {
    await logout();
    toast.success("You've been logged out");
    navigate(ROUTES.home);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">Manage your public profile and availability.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Full name" defaultValue={user?.name} />
          <Input label="Email" defaultValue={user?.email} />
          <Input label="Consultation fee (₹)" defaultValue="1500" />
          <Input label="Response time (minutes)" defaultValue="15" />
          <div className="sm:col-span-2">
            <Button onClick={() => toast.success("Profile updated")}>Save changes</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Availability</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Accepting new consultations</p>
            <p className="text-xs text-muted-foreground">Turn off to pause new bookings</p>
          </div>
          <Switch checked={available} onCheckedChange={setAvailable} />
        </CardContent>
      </Card>
      <Card className="border-danger/30">
        <CardContent className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">Log out</p>
          <Button variant="outline" onClick={handleLogout}><LogOut className="h-4 w-4" /> Logout</Button>
        </CardContent>
      </Card>
    </div>
  );
}

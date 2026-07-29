import { useNavigate, Link } from "react-router-dom";
import { LogOut, UserCircle, ChevronRight } from "lucide-react";
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

      {/* ── Edit Full Profile Prompt ─────────────────────────── */}
      <Link to="/lawyer/profile/edit" className="block">
        <div className="group flex items-center justify-between rounded-xl border border-brand-500/30 bg-brand-500/5 p-5 transition-colors hover:bg-brand-500/10">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/15 text-brand-500">
              <UserCircle className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-foreground">Edit Your Full Profile</p>
              <p className="text-xs text-muted-foreground">
                Add education, career timeline, FAQs, office locations, gallery, and more.
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-brand-400 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>

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

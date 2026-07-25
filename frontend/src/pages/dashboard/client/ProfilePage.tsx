import { useState } from "react";
import { Camera, Save, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toaster";

export function ProfilePage() {
  const { user } = useAuth();
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">Manage your personal information and preferences.</p>
      </div>

      <Card>
        <CardContent className="flex items-center gap-4">
          <div className="relative">
            <Avatar src={user?.avatarUrl} name={user?.name ?? "You"} size="xl" />
            <button
              type="button"
              aria-label="Change avatar"
              onClick={() => toast.success("Avatar upload dialog opened")}
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white shadow-soft hover:bg-brand-700"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-foreground">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs
        tabs={[
          {
            value: "personal",
            label: "Personal Info",
            content: (
              <Card>
                <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Full name" defaultValue={user?.name} />
                  <Input label="Email" type="email" defaultValue={user?.email} />
                  <Input label="Phone number" placeholder="98765 43210" />
                  <Select label="City" placeholder="Select city" options={[{ value: "mumbai", label: "Mumbai" }, { value: "delhi", label: "Delhi" }, { value: "pune", label: "Pune" }]} />
                  <div className="sm:col-span-2">
                    <Button onClick={() => toast.success("Profile updated")}><Save className="h-4 w-4" /> Save changes</Button>
                  </div>
                </CardContent>
              </Card>
            ),
          },
          {
            value: "emergency",
            label: "Emergency Contact",
            content: (
              <Card>
                <CardHeader><CardTitle>Emergency Contact</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Contact name" placeholder="Jane Doe" />
                  <Input label="Relationship" placeholder="Spouse, parent, sibling…" />
                  <Input label="Phone number" placeholder="98765 43210" />
                  <Input label="Email" type="email" placeholder="jane@example.com" />
                  <div className="sm:col-span-2">
                    <Button onClick={() => toast.success("Emergency contact saved")}><Save className="h-4 w-4" /> Save contact</Button>
                  </div>
                </CardContent>
              </Card>
            ),
          },
          {
            value: "preferences",
            label: "Preferences",
            content: (
              <Card>
                <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Email alerts</p>
                      <p className="text-xs text-muted-foreground">Appointment reminders and case updates</p>
                    </div>
                    <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">SMS alerts</p>
                      <p className="text-xs text-muted-foreground">Time-sensitive updates via text</p>
                    </div>
                    <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} />
                  </div>
                </CardContent>
              </Card>
            ),
          },
          {
            value: "security",
            label: "Security",
            content: (
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-4 w-4" /> Security</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Input label="Current password" type="password" placeholder="••••••••" />
                  <Input label="New password" type="password" placeholder="••••••••" />
                  <Button onClick={() => toast.success("Password updated")}>Update password</Button>
                </CardContent>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}

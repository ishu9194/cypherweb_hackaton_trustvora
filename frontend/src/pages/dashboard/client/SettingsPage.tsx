import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, LogOut, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toaster";
import { useDisclosure } from "@/hooks/useDisclosure";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function SettingsPage() {
  const { mode, setMode } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const deleteModal = useDisclosure();
  const [confirmText, setConfirmText] = useState("");
  const [profileVisible, setProfileVisible] = useState(true);
  const [shareActivity, setShareActivity] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("You've been logged out");
    navigate(ROUTES.home);
  };

  const handleDelete = () => {
    if (confirmText !== "DELETE") {
      toast.error('Type "DELETE" to confirm');
      return;
    }
    deleteModal.close();
    toast.success("Account deletion requested — this is a UI preview in this demo");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">Manage your app preferences and account security.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {THEME_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMode(option.value)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors",
                  mode === option.value ? "border-brand-600 bg-brand-50 dark:bg-brand-500/10" : "border-border hover:border-brand-300",
                )}
              >
                <option.icon className="h-5 w-5 text-foreground" />
                <span className="text-xs font-medium text-foreground">{option.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Language & Region</CardTitle></CardHeader>
        <CardContent>
          <Select
            label="Language"
            options={[{ value: "en", label: "English" }, { value: "hi", label: "हिन्दी (Hindi)" }, { value: "mr", label: "मराठी (Marathi)" }]}
            value="en"
            onValueChange={() => toast.success("Language preference saved")}
            className="max-w-xs"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Privacy</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Public profile</p>
              <p className="text-xs text-muted-foreground">Let lawyers see your profile before you book</p>
            </div>
            <Switch checked={profileVisible} onCheckedChange={setProfileVisible} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Share activity data</p>
              <p className="text-xs text-muted-foreground">Help us improve recommendations</p>
            </div>
            <Switch checked={shareActivity} onCheckedChange={setShareActivity} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Password</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Current password" type="password" placeholder="••••••••" />
          <Input label="New password" type="password" placeholder="••••••••" />
          <div className="sm:col-span-2">
            <Button onClick={() => toast.success("Password updated")}>Update password</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-danger/30">
        <CardHeader><CardTitle className="text-danger">Danger Zone</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Log out of your account</p>
            <p className="text-xs text-muted-foreground">You can log back in anytime</p>
          </div>
          <Button variant="outline" onClick={handleLogout}><LogOut className="h-4 w-4" /> Logout</Button>
        </CardContent>
        <CardContent className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Delete account</p>
            <p className="text-xs text-muted-foreground">Permanently remove your account and all data</p>
          </div>
          <Button variant="destructive" onClick={deleteModal.open}><AlertTriangle className="h-4 w-4" /> Delete account</Button>
        </CardContent>
      </Card>

      <Modal
        open={deleteModal.isOpen}
        onOpenChange={deleteModal.close}
        title="Delete your account"
        description="This action is permanent and cannot be undone."
        footer={<><Button variant="outline" onClick={deleteModal.close}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete permanently</Button></>}
      >
        <p className="mb-3 text-sm text-muted-foreground">Type <span className="font-mono font-semibold text-foreground">DELETE</span> to confirm.</p>
        <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="DELETE" />
      </Modal>
    </div>
  );
}

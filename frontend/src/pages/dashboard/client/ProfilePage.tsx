import { useRef, useState, useEffect } from "react";
import { Camera, Loader2, Save, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toaster";
import { authService } from "@/services/api/auth.service";

const CITY_OPTIONS = [
  { value: "mumbai", label: "Mumbai" },
  { value: "delhi", label: "Delhi" },
  { value: "bengaluru", label: "Bengaluru" },
  { value: "pune", label: "Pune" },
  { value: "hyderabad", label: "Hyderabad" },
  { value: "chennai", label: "Chennai" },
  { value: "kolkata", label: "Kolkata" },
  { value: "ahmedabad", label: "Ahmedabad" },
];

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [city, setCity] = useState(user?.city ?? "mumbai");

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setPhone(user.phone ?? "");
      setCity(user.city ?? "mumbai");
    }
  }, [user]);

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, and WEBP image files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Avatar image size must be less than 5MB.");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const { uploadToSupabase, BUCKETS } = await import("@/lib/supabase");
      const publicUrl = await uploadToSupabase(file, BUCKETS.PROFILE_IMAGE, "client-avatars");

      const updatedUser = await authService.updateProfile({ avatarUrl: publicUrl });
      updateUser(updatedUser);
      toast.success("Profile photo updated successfully!");
    } catch (err: any) {
      console.warn("Avatar upload failed:", err);
      toast.error(err.message || "Failed to upload avatar photo");
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error("Full name is required");
      return;
    }

    setIsSavingProfile(true);
    try {
      const updatedUser = await authService.updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        city,
      });
      updateUser(updatedUser);
      toast.success("Profile details saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">Manage your personal information and preferences.</p>
      </div>

      <Card>
        <CardContent className="flex items-center gap-4 py-6">
          <div className="relative">
            <Avatar src={user?.avatarUrl} name={user?.name ?? "You"} size="xl" />
            <button
              type="button"
              aria-label="Change profile photo"
              disabled={isUploadingAvatar}
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white shadow-soft transition-transform hover:scale-105 hover:bg-brand-700 disabled:opacity-50"
            >
              {isUploadingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarSelect}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-display text-lg font-semibold text-foreground">{user?.name}</p>
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-600 dark:bg-brand-500/10 capitalize">
                {user?.role}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Allowed profile photo: JPG, PNG, WEBP up to 5MB</p>
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
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Full name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    label="Email (read-only)"
                    type="email"
                    value={user?.email ?? ""}
                    disabled
                    readOnly
                  />
                  <Input
                    label="Phone number"
                    placeholder="e.g. 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Select
                    label="City"
                    placeholder="Select city"
                    options={CITY_OPTIONS}
                    value={city}
                    onValueChange={setCity}
                  />
                  <div className="sm:col-span-2 pt-2">
                    <Button onClick={handleSaveProfile} isLoading={isSavingProfile}>
                      <Save className="h-4 w-4" /> Save changes
                    </Button>
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
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Contact name" placeholder="e.g. Jane Doe" />
                  <Input label="Relationship" placeholder="Spouse, parent, sibling…" />
                  <Input label="Phone number" placeholder="98765 43210" />
                  <Input label="Email" type="email" placeholder="jane@example.com" />
                  <div className="sm:col-span-2 pt-2">
                    <Button onClick={() => toast.success("Emergency contact saved successfully")}>
                      <Save className="h-4 w-4" /> Save contact
                    </Button>
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
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input label="Current password" type="password" placeholder="••••••••" />
                  <Input label="New password" type="password" placeholder="••••••••" />
                  <Button onClick={() => toast.success("Password updated successfully")}>Update password</Button>
                </CardContent>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}

export default ProfilePage;

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, GraduationCap, Clock, BookOpen, Building2,
  Image, HelpCircle, Phone, Save, Plus, Trash2,
  ChevronDown, ChevronUp, CheckCircle2, Briefcase, Globe,
  Award, MapPin, ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { lawyerProfileService } from "@/services/api/lawyerProfile.service";
import type {
  Lawyer,
  LawyerEducationDB,
  LawyerTimelineDB,
  LawyerCourtMembershipDB,
  LawyerFAQDB,
  LawyerOfficeDB,
  LawyerGalleryImageDB,
} from "@/types";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

// ─── Reusable sub-components ──────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  description,
  open,
  onToggle,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-surface/50"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
          <Icon className="h-4.5 w-4.5" />
        </span>
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
    </button>
  );
}

function Textarea({ label, ...props }: { label?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="w-full">
      {label && <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>}
      <textarea
        {...props}
        className={cn(
          "min-h-[100px] w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground",
          "transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
          "resize-none",
        )}
      />
    </div>
  );
}

// ─── Profile Completion Bar ────────────────────────────────────────────────────

function ProfileCompletion({ profile }: { profile: Partial<Lawyer> | null }) {
  if (!profile) return null;

  const checks = [
    !!profile.bio,
    !!profile.title,
    !!profile.barNumber,
    !!profile.phone,
    (profile.specializations?.length ?? 0) > 0,
    (profile.languages?.length ?? 0) > 0,
    (profile.education?.length ?? 0) > 0,
    (profile.timeline?.length ?? 0) > 0,
    (profile.courtMemberships?.length ?? 0) > 0,
    (profile.faqs?.length ?? 0) > 0,
    (profile.officeLocations?.length ?? 0) > 0,
    (profile.gallery?.length ?? 0) > 0,
  ];
  const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  const color = pct < 40 ? "bg-danger" : pct < 70 ? "bg-amber-500" : "bg-success";

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className={cn("h-4 w-4", pct === 100 ? "text-success" : "text-muted-foreground")} />
          <span className="text-sm font-semibold text-foreground">Profile Completion</span>
        </div>
        <span className="text-sm font-bold text-brand-500">{pct}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {pct < 100 && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          Fill in all sections to maximise your profile's visibility to clients.
        </p>
      )}
    </div>
  );
}

// ─── Chip Input ───────────────────────────────────────────────────────────────

function ChipInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setInput("");
  };

  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-surface p-2.5 min-h-[44px]">
        {values.map((v) => (
          <span
            key={v}
            className="flex items-center gap-1 rounded-md bg-brand-500/10 px-2.5 py-1 text-xs font-medium text-brand-600"
          >
            {v}
            <button
              type="button"
              onClick={() => onChange(values.filter((x) => x !== v))}
              className="ml-0.5 text-brand-400 hover:text-danger"
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
          placeholder={placeholder ?? "Type and press Enter"}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Press Enter or comma to add each item.</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function LawyerProfileEditorPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Lawyer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Section open state
  const [open, setOpen] = useState<Record<string, boolean>>({
    basic: true,
    consultation: false,
    specializations: false,
    education: false,
    timeline: false,
    courts: false,
    faqs: false,
    offices: false,
    gallery: false,
    contact: false,
  });

  // Local form state for flat fields
  const [form, setForm] = useState<Partial<Lawyer>>({});

  // Addition forms
  const [newEdu, setNewEdu] = useState({ degree: "", institution: "", year: "" });
  const [newTL, setNewTL] = useState({ year: "", title: "", description: "" });
  const [newCM, setNewCM] = useState({ courtName: "", since: "" });
  const [newFAQ, setNewFAQ] = useState({ question: "", answer: "" });
  const [newOffice, setNewOffice] = useState({ name: "", address: "", city: "", state: "", pincode: "", mapsLink: "" });
  const [newGallery, setNewGallery] = useState({ url: "", caption: "", type: "photo" });

  const toggle = (key: string) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  const f = (key: keyof Lawyer) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  /** Shows '' in the input when the value is 0 (i.e. the registration default), so optional numeric fields look empty. */
  const numVal = (v: number | undefined | null) => (v === undefined || v === null || v === 0) ? "" : String(v);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await lawyerProfileService.getMyProfile();
      setProfile(data);
      setForm({
        name: data.name,
        title: data.title ?? "",
        subtitle: data.subtitle ?? "",
        bio: data.bio,
        city: data.city,
        state: data.state,
        experienceYears: data.experienceYears,
        qualification: data.qualification,
        court: data.court,
        consultationFee: data.consultationFee,
        responseTimeMinutes: data.responseTimeMinutes,
        barNumber: data.barNumber ?? "",
        barCouncilName: data.barCouncilName ?? "",
        // Show empty string (not "0") for zero-value optional fields on a new profile
        casesWon: (data.casesWon ?? 0) === 0 ? (undefined as any) : data.casesWon,
        successRate: (data.successRate ?? 0) === 0 ? (undefined as any) : data.successRate,
        phone: data.phone ?? "",
        whatsapp: data.whatsapp ?? "",
        website: data.website ?? "",
        linkedin: data.linkedin ?? "",
        workingDays: data.workingDays ?? "",
        workingHours: data.workingHours ?? "",
        onlineConsultation: data.onlineConsultation,
        offlineConsultation: data.offlineConsultation,
        languages: data.languages,
        specializations: data.specializations,
        consultationTypes: data.consultationTypes,
      });
    } catch {
      toast.error("Failed to load your profile.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveProfile = async () => {
    setSaving(true);
    try {
      await lawyerProfileService.updateProfile(form);
      toast.success("Profile saved successfully!");
      // Refresh to get latest data
      await load();
    } catch {
      toast.error("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Section action handlers ─────────────────────────────────────────────

  const handleAddEdu = async () => {
    if (!newEdu.degree || !newEdu.institution || !newEdu.year) return toast.error("Fill all education fields.");
    try {
      await lawyerProfileService.addEducation({ degree: newEdu.degree, institution: newEdu.institution, year: Number(newEdu.year) });
      setNewEdu({ degree: "", institution: "", year: "" });
      toast.success("Education added.");
      await load();
    } catch { toast.error("Failed to add education."); }
  };

  const handleDeleteEdu = async (id: string) => {
    try { await lawyerProfileService.deleteEducation(id); toast.success("Removed."); await load(); }
    catch { toast.error("Failed to remove."); }
  };

  const handleAddTL = async () => {
    if (!newTL.year || !newTL.title || !newTL.description) return toast.error("Fill all timeline fields.");
    try {
      await lawyerProfileService.addTimeline(newTL);
      setNewTL({ year: "", title: "", description: "" });
      toast.success("Timeline entry added.");
      await load();
    } catch { toast.error("Failed to add."); }
  };

  const handleDeleteTL = async (id: string) => {
    try { await lawyerProfileService.deleteTimeline(id); toast.success("Removed."); await load(); }
    catch { toast.error("Failed to remove."); }
  };

  const handleAddCM = async () => {
    if (!newCM.courtName || !newCM.since) return toast.error("Fill all court membership fields.");
    try {
      await lawyerProfileService.addCourtMembership({ courtName: newCM.courtName, since: Number(newCM.since) });
      setNewCM({ courtName: "", since: "" });
      toast.success("Court membership added.");
      await load();
    } catch { toast.error("Failed to add."); }
  };

  const handleDeleteCM = async (id: string) => {
    try { await lawyerProfileService.deleteCourtMembership(id); toast.success("Removed."); await load(); }
    catch { toast.error("Failed to remove."); }
  };

  const handleAddFAQ = async () => {
    if (!newFAQ.question || !newFAQ.answer) return toast.error("Fill both question and answer.");
    try {
      await lawyerProfileService.addFAQ(newFAQ);
      setNewFAQ({ question: "", answer: "" });
      toast.success("FAQ added.");
      await load();
    } catch { toast.error("Failed to add."); }
  };

  const handleDeleteFAQ = async (id: string) => {
    try { await lawyerProfileService.deleteFAQ(id); toast.success("Removed."); await load(); }
    catch { toast.error("Failed to remove."); }
  };

  const handleAddOffice = async () => {
    if (!newOffice.name || !newOffice.address || !newOffice.city || !newOffice.state) return toast.error("Fill required office fields.");
    try {
      await lawyerProfileService.addOffice(newOffice);
      setNewOffice({ name: "", address: "", city: "", state: "", pincode: "", mapsLink: "" });
      toast.success("Office added.");
      await load();
    } catch { toast.error("Failed to add."); }
  };

  const handleDeleteOffice = async (id: string) => {
    try { await lawyerProfileService.deleteOffice(id); toast.success("Removed."); await load(); }
    catch { toast.error("Failed to remove."); }
  };

  const handleAddGallery = async () => {
    if (!newGallery.url) return toast.error("Enter an image URL.");
    try {
      await lawyerProfileService.addGalleryImage({ url: newGallery.url, caption: newGallery.caption, type: newGallery.type as any });
      setNewGallery({ url: "", caption: "", type: "photo" });
      toast.success("Image added to gallery.");
      await load();
    } catch { toast.error("Failed to add."); }
  };

  const handleDeleteGallery = async (id: string) => {
    try { await lawyerProfileService.deleteGalleryImage(id); toast.success("Removed."); await load(); }
    catch { toast.error("Failed to remove."); }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 pb-16">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
          <h1 className="font-display text-2xl font-bold text-foreground">Edit Your Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Build your complete professional profile. Changes appear live on your public page.
          </p>
        </div>
        <Button onClick={saveProfile} isLoading={saving} className="shrink-0">
          <Save className="mr-2 h-4 w-4" /> Save Profile
        </Button>
      </div>

      {/* Profile completion */}
      <ProfileCompletion profile={profile ? { ...profile, ...form } : null} />

      {/* ── Basic Information ─────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <SectionHeader icon={User} title="Basic Information" description="Name, title, bio, location" open={open.basic} onToggle={() => toggle("basic")} />
        {open.basic && (
          <div className="border-t border-border p-5 space-y-6">
            {/* Avatar Photo Upload */}
            <div className="flex items-center gap-4 rounded-xl border border-border bg-surface/50 p-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-brand-500 bg-surface">
                <img
                  src={form.avatarUrl || profile?.avatarUrl || "https://placehold.co/160?text=Avatar"}
                  alt="Profile Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold text-foreground">Profile Picture</p>
                <p className="text-xs text-muted-foreground">Upload a photo to Supabase storage (`profile-image` bucket).</p>
                <div className="flex items-center gap-2 pt-1">
                  <label className="cursor-pointer rounded-lg bg-brand-500/10 px-3 py-1.5 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-500/20">
                    <span>📷 Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          toast.loading("Uploading photo to Supabase...");
                          const { uploadToSupabase, BUCKETS } = await import("@/lib/supabase");
                          const url = await uploadToSupabase(file, BUCKETS.PROFILE, "avatars");
                          setForm((prev) => ({ ...prev, avatarUrl: url }));
                          toast.dismiss();
                          toast.success("Profile photo uploaded!");
                        } catch (err: any) {
                          toast.dismiss();
                          toast.error(err.message || "Photo upload failed");
                        }
                      }}
                    />
                  </label>
                  {form.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, avatarUrl: "" }))}
                      className="text-xs text-muted-foreground hover:text-danger"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Full Name *" value={String(form.name ?? "")} onChange={f("name")} />
              <Input label="Professional Title" placeholder="e.g. Advocate, Supreme Court" value={String(form.title ?? "")} onChange={f("title")} />
              <Input label="Subtitle" placeholder="e.g. Bar Council · High Court" value={String(form.subtitle ?? "")} onChange={f("subtitle")} />
              <Input label="Qualification" value={String(form.qualification ?? "")} onChange={f("qualification")} />
              <Input label="City *" value={String(form.city ?? "")} onChange={f("city")} />
              <Input label="State *" value={String(form.state ?? "")} onChange={f("state")} />
              <Input label="Years of Experience" type="number" min="0" value={numVal(form.experienceYears as number)} onChange={f("experienceYears")} />
              <Input label="Cases Won" type="number" min="0" value={numVal(form.casesWon as number)} onChange={f("casesWon")} />
              <Input label="Success Rate (%)" type="number" min="0" max="100" value={numVal(form.successRate as number)} onChange={f("successRate")} />
              <Input label="Bar Council Registration No." value={String(form.barNumber ?? "")} onChange={f("barNumber")} />
              <Input label="Bar Council Name" value={String(form.barCouncilName ?? "")} onChange={f("barCouncilName")} />
              <Input label="Court" value={String(form.court ?? "")} onChange={f("court")} />
              <div className="sm:col-span-2">
                <Textarea label="About / Bio *" placeholder="Describe your experience, approach, and expertise..." rows={4} value={String(form.bio ?? "")} onChange={f("bio")} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Consultation Settings ─────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <SectionHeader icon={Clock} title="Consultation Settings" description="Fee, response time, working hours" open={open.consultation} onToggle={() => toggle("consultation")} />
        {open.consultation && (
          <div className="border-t border-border p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Consultation Fee (₹) *" type="number" min="0" value={String(form.consultationFee ?? "")} onChange={f("consultationFee")} />
              <Input label="Response Time (minutes)" type="number" min="1" value={String(form.responseTimeMinutes ?? "")} onChange={f("responseTimeMinutes")} />
              <Input label="Working Days" placeholder="e.g. Mon - Sat" value={String(form.workingDays ?? "")} onChange={f("workingDays")} />
              <Input label="Working Hours" placeholder="e.g. 10:00 AM - 6:00 PM" value={String(form.workingHours ?? "")} onChange={f("workingHours")} />
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <input type="checkbox" id="online" checked={!!form.onlineConsultation} onChange={(e) => setForm((p) => ({ ...p, onlineConsultation: e.target.checked }))} className="h-4 w-4 accent-brand-500" />
                <label htmlFor="online" className="text-sm text-foreground">Online Consultation</label>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <input type="checkbox" id="offline" checked={!!form.offlineConsultation} onChange={(e) => setForm((p) => ({ ...p, offlineConsultation: e.target.checked }))} className="h-4 w-4 accent-brand-500" />
                <label htmlFor="offline" className="text-sm text-foreground">In-Office Consultation</label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Specializations & Languages ───────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <SectionHeader icon={Briefcase} title="Specializations & Languages" description="Practice areas and spoken languages" open={open.specializations} onToggle={() => toggle("specializations")} />
        {open.specializations && (
          <div className="border-t border-border p-5 space-y-4">
            <ChipInput
              label="Practice Areas"
              values={form.specializations ?? []}
              onChange={(v) => setForm((p) => ({ ...p, specializations: v }))}
              placeholder="e.g. Criminal Law, press Enter"
            />
            <ChipInput
              label="Languages"
              values={form.languages ?? []}
              onChange={(v) => setForm((p) => ({ ...p, languages: v }))}
              placeholder="e.g. Hindi, press Enter"
            />
            <ChipInput
              label="Consultation Types"
              values={form.consultationTypes ?? []}
              onChange={(v) => setForm((p) => ({ ...p, consultationTypes: v as any }))}
              placeholder="video / voice / office / chat"
            />
          </div>
        )}
      </div>

      {/* ── Education ─────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <SectionHeader icon={GraduationCap} title="Education" description="Degrees and academic background" open={open.education} onToggle={() => toggle("education")} />
        {open.education && (
          <div className="border-t border-border p-5 space-y-4">
            {(profile?.education ?? []).map((edu) => (
              <div key={edu.id} className="flex items-start justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{edu.degree}</p>
                  <p className="text-xs text-muted-foreground">{edu.institution} · {edu.year}</p>
                </div>
                <button type="button" onClick={() => handleDeleteEdu(edu.id)} className="text-muted-foreground hover:text-danger"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <div className="rounded-lg border border-dashed border-border p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Add Education</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Input label="Degree" placeholder="e.g. LLB" value={newEdu.degree} onChange={(e) => setNewEdu((p) => ({ ...p, degree: e.target.value }))} />
                <Input label="Institution" placeholder="e.g. NLU Delhi" value={newEdu.institution} onChange={(e) => setNewEdu((p) => ({ ...p, institution: e.target.value }))} />
                <Input label="Year" type="number" placeholder="e.g. 2018" value={newEdu.year} onChange={(e) => setNewEdu((p) => ({ ...p, year: e.target.value }))} />
              </div>
              <Button variant="outline" size="sm" onClick={handleAddEdu}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add</Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Career Timeline ───────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <SectionHeader icon={Clock} title="Career Timeline" description="Key milestones and career events" open={open.timeline} onToggle={() => toggle("timeline")} />
        {open.timeline && (
          <div className="border-t border-border p-5 space-y-4">
            {(profile?.timeline ?? []).map((tl) => (
              <div key={tl.id} className="flex items-start justify-between rounded-lg border border-border p-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-brand-500/10 px-1.5 py-0.5 text-xs font-bold text-brand-500">{tl.year}</span>
                    <p className="text-sm font-semibold text-foreground">{tl.title}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{tl.description}</p>
                </div>
                <button type="button" onClick={() => handleDeleteTL(tl.id)} className="text-muted-foreground hover:text-danger"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <div className="rounded-lg border border-dashed border-border p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Add Timeline Entry</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Input label="Year" placeholder="e.g. 2020" value={newTL.year} onChange={(e) => setNewTL((p) => ({ ...p, year: e.target.value }))} />
                <Input label="Title" placeholder="e.g. Joined Supreme Court Bar" value={newTL.title} onChange={(e) => setNewTL((p) => ({ ...p, title: e.target.value }))} />
                <Input label="Description" placeholder="Brief description..." value={newTL.description} onChange={(e) => setNewTL((p) => ({ ...p, description: e.target.value }))} />
              </div>
              <Button variant="outline" size="sm" onClick={handleAddTL}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add</Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Court Memberships ──────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <SectionHeader icon={Award} title="Court Memberships" description="Courts and bar associations you belong to" open={open.courts} onToggle={() => toggle("courts")} />
        {open.courts && (
          <div className="border-t border-border p-5 space-y-4">
            {(profile?.courtMemberships ?? []).map((cm) => (
              <div key={cm.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{cm.courtName}</p>
                  <p className="text-xs text-muted-foreground">Member since {cm.since}</p>
                </div>
                <button type="button" onClick={() => handleDeleteCM(cm.id)} className="text-muted-foreground hover:text-danger"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <div className="rounded-lg border border-dashed border-border p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Add Court Membership</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input label="Court / Bar Name" placeholder="e.g. Supreme Court Bar Association" value={newCM.courtName} onChange={(e) => setNewCM((p) => ({ ...p, courtName: e.target.value }))} />
                <Input label="Member Since (Year)" type="number" placeholder="e.g. 2019" value={newCM.since} onChange={(e) => setNewCM((p) => ({ ...p, since: e.target.value }))} />
              </div>
              <Button variant="outline" size="sm" onClick={handleAddCM}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add</Button>
            </div>
          </div>
        )}
      </div>

      {/* ── FAQs ──────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <SectionHeader icon={HelpCircle} title="Frequently Asked Questions" description="Common questions clients ask you" open={open.faqs} onToggle={() => toggle("faqs")} />
        {open.faqs && (
          <div className="border-t border-border p-5 space-y-4">
            {(profile?.faqs ?? []).map((faq) => (
              <div key={faq.id} className="flex items-start justify-between rounded-lg border border-border p-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">{faq.question}</p>
                  <p className="text-xs text-muted-foreground">{faq.answer}</p>
                </div>
                <button type="button" onClick={() => handleDeleteFAQ(faq.id)} className="ml-3 shrink-0 text-muted-foreground hover:text-danger"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <div className="rounded-lg border border-dashed border-border p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Add FAQ</p>
              <Input label="Question" placeholder="e.g. Do you offer free initial consultations?" value={newFAQ.question} onChange={(e) => setNewFAQ((p) => ({ ...p, question: e.target.value }))} />
              <Textarea label="Answer" placeholder="Your answer here..." value={newFAQ.answer} onChange={(e) => setNewFAQ((p) => ({ ...p, answer: e.target.value }))} />
              <Button variant="outline" size="sm" onClick={handleAddFAQ}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add</Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Office Locations ──────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <SectionHeader icon={Building2} title="Office Locations" description="Where clients can meet you in person" open={open.offices} onToggle={() => toggle("offices")} />
        {open.offices && (
          <div className="border-t border-border p-5 space-y-4">
            {(profile?.officeLocations ?? []).map((o) => (
              <div key={o.id} className="flex items-start justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{o.name}</p>
                  <p className="text-xs text-muted-foreground">{o.address}, {o.city}, {o.state}{o.pincode ? ` - ${o.pincode}` : ""}</p>
                  {o.mapsLink && <a href={o.mapsLink} target="_blank" rel="noreferrer" className="mt-0.5 text-xs text-brand-500 hover:underline">📍 View on Maps</a>}
                </div>
                <button type="button" onClick={() => handleDeleteOffice(o.id)} className="ml-3 shrink-0 text-muted-foreground hover:text-danger"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <div className="rounded-lg border border-dashed border-border p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Add Office</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input label="Office Name *" placeholder="e.g. Main Chamber" value={newOffice.name} onChange={(e) => setNewOffice((p) => ({ ...p, name: e.target.value }))} />
                <Input label="City *" value={newOffice.city} onChange={(e) => setNewOffice((p) => ({ ...p, city: e.target.value }))} />
                <Input label="State *" value={newOffice.state} onChange={(e) => setNewOffice((p) => ({ ...p, state: e.target.value }))} />
                <Input label="Pincode" value={newOffice.pincode} onChange={(e) => setNewOffice((p) => ({ ...p, pincode: e.target.value }))} />
                <div className="sm:col-span-2">
                  <Textarea label="Full Address *" rows={2} value={newOffice.address} onChange={(e) => setNewOffice((p) => ({ ...p, address: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <Input label="Google Maps Link (optional)" placeholder="https://maps.google.com/..." value={newOffice.mapsLink} onChange={(e) => setNewOffice((p) => ({ ...p, mapsLink: e.target.value }))} />
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleAddOffice}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add Office</Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Gallery ───────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <SectionHeader icon={Image} title="Gallery" description="Photos, certificates, and office images" open={open.gallery} onToggle={() => toggle("gallery")} />
        {open.gallery && (
          <div className="border-t border-border p-5 space-y-4">
            {(profile?.gallery ?? []).length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {(profile?.gallery ?? []).map((img) => (
                  <div key={img.id} className="group relative overflow-hidden rounded-lg border border-border aspect-video bg-surface">
                    <img src={img.url} alt={img.caption ?? "Gallery"} className="h-full w-full object-cover" onError={(e) => (e.currentTarget.src = "https://placehold.co/400x225?text=Image+Error")} />
                    <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      {img.caption && <span className="mt-auto text-[10px] text-white/90">{img.caption}</span>}
                      <button
                        type="button"
                        onClick={() => handleDeleteGallery(img.id)}
                        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-danger/80 text-white"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="rounded-lg border border-dashed border-border p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Add Image</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input label="Image URL *" placeholder="https://example.com/photo.jpg" value={newGallery.url} onChange={(e) => setNewGallery((p) => ({ ...p, url: e.target.value }))} className="flex-1" />
                <div className="mt-5 shrink-0">
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground hover:bg-surface-sunken">
                    <span>📁 Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          toast.loading("Uploading image to Supabase...");
                          const { uploadToSupabase, BUCKETS } = await import("@/lib/supabase");
                          const url = await uploadToSupabase(file, BUCKETS.PROFILE, "gallery");
                          setNewGallery((p) => ({ ...p, url }));
                          toast.dismiss();
                          toast.success("Image uploaded! Click 'Add Image' to save to your gallery.");
                        } catch (err: any) {
                          toast.dismiss();
                          toast.error(err.message || "Image upload failed");
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Caption (optional)" value={newGallery.caption} onChange={(e) => setNewGallery((p) => ({ ...p, caption: e.target.value }))} />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Type</label>
                  <select value={newGallery.type} onChange={(e) => setNewGallery((p) => ({ ...p, type: e.target.value }))} className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-brand-500 focus:outline-none">
                    <option value="photo">Photo</option>
                    <option value="certificate">Certificate</option>
                    <option value="office">Office</option>
                  </select>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleAddGallery}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add Image</Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Contact Information ───────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <SectionHeader icon={Phone} title="Contact Information" description="Phone, website, and social links" open={open.contact} onToggle={() => toggle("contact")} />
        {open.contact && (
          <div className="border-t border-border p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Phone" placeholder="+91 98765 43210" value={String(form.phone ?? "")} onChange={f("phone")} leftIcon={<Phone className="h-4 w-4" />} />
              <Input label="WhatsApp" placeholder="+91 98765 43210" value={String(form.whatsapp ?? "")} onChange={f("whatsapp")} />
              <Input label="Website" placeholder="https://yourdomain.com" value={String(form.website ?? "")} onChange={f("website")} leftIcon={<Globe className="h-4 w-4" />} />
              <Input label="LinkedIn" placeholder="https://linkedin.com/in/..." value={String(form.linkedin ?? "")} onChange={f("linkedin")} />
            </div>
          </div>
        )}
      </div>

      {/* Sticky bottom save bar */}
      <div className="sticky bottom-4 flex justify-end pt-2">
        <Button onClick={saveProfile} isLoading={saving} size="lg" className="shadow-lg shadow-brand-500/30">
          <Save className="mr-2 h-4 w-4" /> Save All Changes
        </Button>
      </div>
    </div>
  );
}

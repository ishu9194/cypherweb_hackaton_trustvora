import { useState } from "react";
import { Heart, Mail, Search as SearchIcon, Settings, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { SearchBox } from "@/components/ui/search-box";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup } from "@/components/ui/radio";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Drawer } from "@/components/ui/drawer";
import { Tooltip } from "@/components/ui/tooltip";
import { Popover } from "@/components/ui/popover";
import { Dropdown } from "@/components/ui/dropdown";
import { Tabs } from "@/components/ui/tabs";
import { Accordion } from "@/components/ui/accordion";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { toast } from "@/components/ui/toaster";
import { Pagination } from "@/components/ui/pagination";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import { Calendar } from "@/components/ui/calendar";
import { Timeline } from "@/components/ui/timeline";
import { Loader } from "@/components/ui/loader";
import { Skeleton, SkeletonCard, SkeletonText } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { SuccessState } from "@/components/states/SuccessState";
import { LAWYERS } from "@/data/lawyers.data";
import { useDisclosure } from "@/hooks/useDisclosure";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-border py-12 first:pt-0">
      <h2 className="font-display text-xl font-bold text-foreground">{title}</h2>
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}

const gridColumns: DataGridColumn<(typeof LAWYERS)[number]>[] = [
  { key: "name", header: "Name", render: (row) => row.name, sortValue: (row) => row.name },
  { key: "city", header: "City", render: (row) => row.city, sortValue: (row) => row.city },
  { key: "rating", header: "Rating", render: (row) => row.rating.toFixed(1), sortValue: (row) => row.rating, align: "right" },
  { key: "fee", header: "Fee", render: (row) => `₹${row.consultationFee}`, sortValue: (row) => row.consultationFee, align: "right" },
];

export function StyleGuidePage() {
  const modal = useDisclosure();
  const drawer = useDisclosure();
  const [page, setPage] = useState(3);
  const [date, setDate] = useState<Date>();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Style Guide" }]} />
      <h1 className="mt-4 font-display text-3xl font-bold text-foreground">Trustix Design System</h1>
      <p className="mt-2 text-muted-foreground">Every reusable component in one place — Phase 1 foundation for all future pages.</p>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link Button</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Settings"><Settings className="h-4 w-4" /></Button>
          <Button isLoading>Loading</Button>
          <Button leftIcon={<Heart className="h-4 w-4" />}>With Icon</Button>
        </div>
      </Section>

      <Section title="Form Controls">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input label="Full name" placeholder="Meet Agrawal" leftIcon={<User className="h-4 w-4" />} />
          <Input label="Email" placeholder="you@email.com" leftIcon={<Mail className="h-4 w-4" />} error="Enter a valid email address" />
          <Textarea label="Message" placeholder="Type here…" />
          <Select label="City" placeholder="Choose a city" options={[{ value: "mumbai", label: "Mumbai" }, { value: "delhi", label: "Delhi" }, { value: "pune", label: "Pune" }]} />
          <SearchBox placeholder="Search lawyers…" onSearch={() => {}} />
          <div className="space-y-3">
            <Checkbox label="Verified lawyers only" description="Show only Bar Council verified profiles" defaultChecked={false} />
            <Switch label="Online now" />
          </div>
        </div>
        <RadioGroup
          orientation="horizontal"
          options={[{ value: "video", label: "Video" }, { value: "voice", label: "Voice" }, { value: "chat", label: "Chat" }]}
          value="video"
          onValueChange={() => {}}
        />
      </Section>

      <Section title="Cards">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card lift>
            <CardHeader>
              <CardTitle>Consultation Booked</CardTitle>
              <CardDescription>Video call with Adv. Priya Sharma</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">25 Jul 2026, 11:00 AM</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Join Call</Button>
              <Button size="sm" variant="outline">Reschedule</Button>
            </CardFooter>
          </Card>
          <Card variant="glass" className="p-6">
            <p className="text-sm font-semibold text-foreground">Glass variant</p>
            <p className="mt-1 text-sm text-muted-foreground">Used over gradient/mesh backgrounds like the hero.</p>
          </Card>
        </div>
      </Section>

      <Section title="Overlays">
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={modal.open}>Open Modal</Button>
          <Button variant="outline" onClick={drawer.open}>Open Drawer</Button>
          <Tooltip content="This is a tooltip"><Button variant="outline">Hover me</Button></Tooltip>
          <Popover trigger={<Button variant="outline">Open Popover</Button>}>
            <p className="text-sm text-foreground">Popover content goes here.</p>
          </Popover>
          <Dropdown
            trigger={<Button variant="outline">Open Dropdown</Button>}
            items={[
              { label: "Edit", icon: <Settings className="h-4 w-4" /> },
              { label: "Delete", icon: <Trash2 className="h-4 w-4" />, destructive: true },
            ]}
          />
          <Button variant="outline" onClick={() => toast.success("This is a toast notification")}>Trigger Toast</Button>
        </div>
        <Modal open={modal.isOpen} onOpenChange={modal.close} title="Confirm booking" description="You're about to book a consultation." footer={<><Button variant="outline" onClick={modal.close}>Cancel</Button><Button onClick={modal.close}>Confirm</Button></>}>
          <p className="text-sm text-muted-foreground">This is example modal body content.</p>
        </Modal>
        <Drawer open={drawer.isOpen} onOpenChange={drawer.close} title="Filters">
          <p className="text-sm text-muted-foreground">Drawer content — typically used for filters or details panels.</p>
        </Drawer>
      </Section>

      <Section title="Navigation">
        <Tabs
          tabs={[
            { value: "one", label: "Overview", content: <p className="text-sm text-muted-foreground">Overview tab content.</p> },
            { value: "two", label: "Details", content: <p className="text-sm text-muted-foreground">Details tab content.</p> },
          ]}
        />
        <Pagination page={page} totalPages={12} onPageChange={setPage} />
        <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Appointments" }]} />
      </Section>

      <Section title="Badges & Alerts">
        <div className="flex flex-wrap gap-2">
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="brand">Brand</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
        <div className="space-y-3">
          <Alert variant="info" title="Heads up">This is an informational alert.</Alert>
          <Alert variant="success" title="Success">Your changes have been saved.</Alert>
          <Alert variant="warning" title="Warning">Your session will expire soon.</Alert>
          <Alert variant="danger" title="Error">Something went wrong processing your request.</Alert>
        </div>
      </Section>

      <Section title="Data Display">
        <DataGrid columns={gridColumns} rows={LAWYERS} getRowId={(row) => row.id} />
        <Accordion
          items={[
            { value: "a1", question: "What is Trustix?", answer: "A platform connecting clients with verified lawyers." },
            { value: "a2", question: "How do I book a consultation?", answer: "Search, select a lawyer, and pick an available time slot." },
          ]}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Calendar selected={date} onSelect={setDate} />
          <Timeline
            steps={[
              { title: "Case filed", timestamp: "2 Jul", status: "complete" },
              { title: "Documents submitted", timestamp: "10 Jul", status: "complete" },
              { title: "Hearing scheduled", timestamp: "22 Jul", status: "current" },
              { title: "Resolution", status: "upcoming" },
            ]}
          />
        </div>
      </Section>

      <Section title="Avatars">
        <div className="flex flex-wrap items-center gap-3">
          <Avatar name="Meet Agrawal" size="sm" />
          <Avatar name="Priya Sharma" src={LAWYERS[0].avatarUrl} size="md" online />
          <Avatar name="Rohan Mehta" src={LAWYERS[1].avatarUrl} size="lg" verified />
          <Avatar name="Ananya Iyer" src={LAWYERS[2].avatarUrl} size="xl" online />
        </div>
      </Section>

      <Section title="Loading & Empty States">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex items-center justify-center rounded-xl border border-border p-8"><Loader label="Loading…" /></div>
          <SkeletonCard />
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <SkeletonText lines={2} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <EmptyState icon={<SearchIcon className="h-5 w-5" />} title="No results found" description="Try adjusting your filters." />
          <ErrorState onRetry={() => toast.error("Retry clicked")} />
          <SuccessState title="Booking confirmed" description="A confirmation has been sent to your email." />
        </div>
      </Section>
    </div>
  );
}

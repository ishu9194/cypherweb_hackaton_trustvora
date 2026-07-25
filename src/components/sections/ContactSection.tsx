import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";

const contactSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(10, "Enter a valid phone number").max(15),
  message: z.string().min(10, "Tell us a bit more (min 10 characters)"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const CONTACT_INFO = [
  { icon: MapPin, label: "Office", value: "14th Floor, Prestige Tower, Bandra Kurla Complex, Mumbai 400051" },
  { icon: Phone, label: "Phone", value: "+91 22 4567 8900" },
  { icon: Mail, label: "Email", value: "hello@trustora.in" },
  { icon: Clock, label: "Business Hours", value: "Mon–Sat, 9:00 AM – 8:00 PM IST" },
];

export function ContactSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (values: ContactFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    toast.success(`Thanks, ${values.name.split(" ")[0]} — we'll get back to you within 24 hours.`);
    reset();
  };

  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">Contact Us</span>
        <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">We're here to help</h2>
        <p className="mt-3 text-muted-foreground">Have a question that isn't in the FAQ? Send us a message and we'll respond within a day.</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="space-y-5">
            {CONTACT_INFO.map((item) => (
              <div key={item.label} className="flex gap-3 rounded-xl border border-border bg-surface p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10">
                  <item.icon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-3">
            <Button
              variant="accent"
              className="flex-1"
              onClick={() => toast.success("Opening WhatsApp chat…")}
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => toast.success("Live chat widget opening…")}
            >
              <MessageCircle className="h-4 w-4" />
              Live Chat
            </Button>
          </div>

          <div className="mt-5 flex h-40 items-center justify-center rounded-xl border border-dashed border-border bg-surface-sunken text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" /> Map view
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-soft lg:col-span-3"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Full name" placeholder="Meet Agrawal" error={errors.name?.message} {...register("name")} />
            <Input label="Phone number" placeholder="98765 43210" error={errors.phone?.message} {...register("phone")} />
          </div>
          <Input label="Email address" type="email" placeholder="you@email.com" error={errors.email?.message} {...register("email")} />
          <Textarea label="Message" placeholder="Tell us what you need help with…" rows={5} error={errors.message?.message} {...register("message")} />
          <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
            <Send className="h-4 w-4" />
            Send Message
          </Button>
        </motion.form>
      </div>
    </section>
  );
}

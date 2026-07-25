import { useState } from "react";
import { Link } from "react-router-dom";
import { Send } from "lucide-react";
import { APP_NAME, APP_TAGLINE } from "@/constants/app.constants";
import { ROUTES } from "@/constants/routes.constants";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";

/** lucide-react dropped brand/logo icons — small inline SVGs stand in for them. */
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.87.24-1.5 1.5-1.5H16.5V4.3c-.27-.04-1.18-.11-2.24-.11-2.22 0-3.74 1.35-3.74 3.83V10.5H8v3h2.52V21h2.98Z" />
    </svg>
  );
}
function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 3h3.1l-6.75 7.72L23.2 21h-6.22l-4.87-6.37L6.5 21H3.4l7.22-8.26L3.2 3h6.38l4.4 5.82L18.9 3Zm-1.09 16.17h1.72L7.3 4.73H5.46l12.35 14.44Z" />
    </svg>
  );
}
function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.94 8.5H3.56V20.5H6.94V8.5ZM5.25 3a1.95 1.95 0 1 0 0 3.9 1.95 1.95 0 0 0 0-3.9ZM20.5 20.5h-3.38v-6.14c0-1.46-.03-3.34-2.04-3.34-2.04 0-2.35 1.6-2.35 3.24v6.24H9.35V8.5h3.24v1.64h.05c.45-.85 1.56-1.75 3.2-1.75 3.42 0 4.66 2.25 4.66 5.17V20.5Z" />
    </svg>
  );
}
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="17.15" cy="6.85" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const FOOTER_COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: ROUTES.about },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: ROUTES.blog },
      { label: "Contact", href: ROUTES.contact },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Pricing", href: ROUTES.pricing },
      { label: "Services", href: ROUTES.services },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Practice Areas",
    links: [
      { label: "Corporate Law", href: `${ROUTES.practiceAreas}?area=corporate` },
      { label: "Family Law", href: `${ROUTES.practiceAreas}?area=family` },
      { label: "Property Law", href: `${ROUTES.practiceAreas}?area=property` },
      { label: "Startup Law", href: `${ROUTES.practiceAreas}?area=startup` },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

const SOCIALS = [
  { icon: FacebookIcon, label: "Facebook", href: "https://facebook.com" },
  { icon: TwitterIcon, label: "Twitter", href: "https://twitter.com" },
  { icon: LinkedinIcon, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: InstagramIcon, label: "Instagram", href: "https://instagram.com" },
];

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }
    toast.success("Subscribed! Watch your inbox for legal insights.");
    setEmail("");
  };

  return (
    <footer className="border-t border-border bg-surface-sunken">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_2.6fr]">
          <div>
            <Link to={ROUTES.home} className="flex items-center gap-2">
              <img src="/assets/logo.png" alt={`${APP_NAME} logo`} className="h-9 w-9 object-contain" />
              <span className="font-display text-lg font-bold text-foreground">{APP_NAME}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">{APP_TAGLINE}</p>

            <form onSubmit={handleSubscribe} className="mt-6 flex max-w-sm gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Email address"
                className="h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
              <Button type="submit" size="icon" aria-label="Subscribe to newsletter">
                <Send className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 flex items-center gap-2">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand-500 hover:text-brand-600"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <p className="text-sm font-semibold text-foreground">{column.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.href} className="text-sm text-muted-foreground transition-colors hover:text-brand-600">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">Made for people who need a lawyer, not a headache.</p>
        </div>
      </div>
    </footer>
  );
}

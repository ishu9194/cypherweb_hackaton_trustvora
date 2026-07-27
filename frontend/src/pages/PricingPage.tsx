import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ROUTES } from "@/constants/routes.constants";

const PRICING_TIERS = [
  {
    name: "Client Standard",
    description: "For individuals and founders seeking verified legal consultation.",
    priceMonthly: 0,
    priceYearly: 0,
    badge: "Free Forever",
    highlight: false,
    cta: "Find a Lawyer Now",
    ctaHref: ROUTES.findLawyers,
    features: [
      "Access to 100% Bar Council verified lawyers",
      "Direct consultation booking with upfront fee transparency",
      "Secure client document storage & end-to-end encrypted chat",
      "Automated consultation reminders & receipt downloads",
      "24/7 customer support via email & live chat",
    ],
  },
  {
    name: "Advocate Pro",
    description: "For independent lawyers wanting to expand their client base.",
    priceMonthly: 1999,
    priceYearly: 1599,
    badge: "Most Popular",
    highlight: true,
    cta: "Join as a Lawyer",
    ctaHref: ROUTES.register,
    features: [
      "Verified Bar Council Badge on profile",
      "Unlimited client consultation bookings",
      "Trust Engine score calculation & verification badge",
      "Real-time WebSocket alerts for new appointment requests",
      "Lawyer analytics dashboard & earnings reports",
      "Priority listing in location & practice area searches",
    ],
  },
  {
    name: "Law Firm / Enterprise",
    description: "For law practices and corporate legal departments.",
    priceMonthly: 4999,
    priceYearly: 3999,
    badge: "Enterprise",
    highlight: false,
    cta: "Contact Enterprise Sales",
    ctaHref: ROUTES.contact,
    features: [
      "Everything in Advocate Pro for up to 10 advocates",
      "Centralized practice management dashboard",
      "Dedicated account manager & priority onboarding",
      "Custom billing & invoicing integration",
      "SLA guaranteed 99.9% uptime",
    ],
  },
];

const FAQS = [
  {
    question: "Are there any hidden fees for clients booking a consultation?",
    answer: "No. Clients only pay the exact consultation fee set upfront by the advocate. Trustix charges zero hidden booking fees to clients.",
  },
  {
    question: "How are lawyer qualifications and Bar Council status verified?",
    answer: "Every advocate must submit their Bar Council enrollment number and degree certificate. Our team independently verifies credentials before issuing a Verified Badge.",
  },
  {
    question: "Can I upgrade or cancel my subscription anytime?",
    answer: "Yes, advocates can upgrade, downgrade, or cancel their subscription plan at any time directly from the settings page.",
  },
];

export function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="pb-24">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-brand-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Pricing" }]} className="[&_*]:text-white/70 [&_a:hover]:text-white" />
          <div className="mt-6 max-w-3xl">
            <Badge variant="accent" className="mb-3">Simple & Transparent</Badge>
            <h1 className="font-display text-3xl font-bold sm:text-5xl">Transparent Pricing for Everyone</h1>
            <p className="mt-4 text-base text-navy-200 sm:text-lg">
              Free for clients finding legal counsel. Predictable subscription plans for advocates and law firms.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="mt-10 flex items-center gap-3">
            <span className={`text-sm font-medium ${!annual ? "text-white" : "text-navy-300"}`}>Monthly billing</span>
            <button
              type="button"
              onClick={() => setAnnual(!annual)}
              className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-white/20 transition-colors duration-200 ease-in-out focus:outline-none"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  annual ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${annual ? "text-white" : "text-navy-300"}`}>
              Annual billing <span className="rounded-full bg-accent-500/20 px-2 py-0.5 text-xs text-accent-300">Save 20%</span>
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {PRICING_TIERS.map((tier) => {
            const price = annual ? tier.priceYearly : tier.priceMonthly;
            return (
              <div
                key={tier.name}
                className={`relative flex flex-col justify-between rounded-3xl border p-8 shadow-soft transition-all duration-200 ${
                  tier.highlight
                    ? "border-brand-500 bg-surface shadow-lifted ring-2 ring-brand-500/20"
                    : "border-border bg-surface"
                }`}
              >
                {tier.badge && (
                  <Badge variant={tier.highlight ? "brand" : "neutral"} className="absolute -top-3 right-8">
                    {tier.badge}
                  </Badge>
                )}

                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">{tier.name}</h3>
                  <p className="mt-2 text-xs text-muted-foreground">{tier.description}</p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="font-display text-4xl font-extrabold text-foreground">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-muted-foreground">{price > 0 ? "/month" : ""}</span>
                  </div>

                  <ul className="mt-8 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-xs text-foreground">
                        <Check className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <Button
                    variant={tier.highlight ? "primary" : "outline"}
                    className="w-full"
                    asChild
                  >

                    <Link to={tier.ctaHref}>{tier.cta}</Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQs */}
      <div className="mx-auto max-w-4xl px-4 pt-24 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold text-foreground text-center">Frequently Asked Questions</h2>
        <div className="mt-8 space-y-6">
          {FAQS.map((faq) => (
            <div key={faq.question} className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <h3 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-brand-600" />
                {faq.question}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

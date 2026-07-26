import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award, BadgeCheck, BookOpen, CalendarCheck, Camera, Download, Flag, GraduationCap,
  Heart, Landmark, MapPin, MessageCircle, Share2, Star, TrendingUp,
} from "lucide-react";
import type { Lawyer, Review } from "@/types";
import { lawyersService } from "@/services/api/lawyers.service";
import { getLawyerExtras } from "@/data/lawyerProfiles.data";
import { getSlotsForDate } from "@/data/availability.data";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Tabs } from "@/components/ui/tabs";
import { Accordion } from "@/components/ui/accordion";
import { Timeline } from "@/components/ui/timeline";
import { Tooltip } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/toaster";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useFavoritesStore } from "@/hooks/useFavoritesStore";
import { LawyerCard } from "@/components/lawyers/LawyerCard";
import { LawyerProfileSkeleton } from "@/components/lawyers/LawyerProfileSkeleton";
import { ReportLawyerModal } from "@/components/lawyers/ReportLawyerModal";
import { ROUTES } from "@/constants/routes.constants";
import { downloadTextFile, formatCurrency, formatDate } from "@/lib/utils";

export function LawyerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const report = useDisclosure();
  const { isFavorited, toggleFavorite } = useFavoritesStore();
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setIsLoading(true);
    setNotFound(false);
    Promise.all([lawyersService.getById(id), lawyersService.getReviews(id)]).then(([result, revList]) => {
      if (cancelled) return;
      if (result) {
        setLawyer(result);
        setReviews((result.reviews as Review[]) || revList || []);
      } else {
        setNotFound(true);
      }
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!lawyer) return;
    let cancelled = false;
    lawyersService
      .list({ practiceArea: lawyer.specializations[0], pageSize: 4 })
      .then(({ lawyers }) => {
        if (cancelled) return;
        setRelated(lawyers.filter((l) => l.id !== lawyer.id).slice(0, 3));
      })
      .catch(() => {
        if (!cancelled) setRelated([]);
      });
    return () => {
      cancelled = true;
    };
  }, [lawyer]);

  if (notFound) return <Navigate to={ROUTES.notFound} replace />;
  if (isLoading || !lawyer) return <LawyerProfileSkeleton />;

  const extras = getLawyerExtras(lawyer.id);
  const favorited = isFavorited(lawyer.id);

  const handleDownload = () => {
    const content = `${lawyer.name}\n${lawyer.qualification}\n${lawyer.court}\n\nSpecializations: ${lawyer.specializations.join(", ")}\nExperience: ${lawyer.experienceYears} years\nRating: ${lawyer.rating} (${lawyer.reviewCount} reviews)\nConsultation Fee: ${formatCurrency(lawyer.consultationFee)}\n\nBio:\n${lawyer.bio}\n\nGenerated from Trustix on ${new Date().toLocaleDateString("en-IN")}`;
    downloadTextFile(`${lawyer.name.replace(/\s+/g, "-")}-profile.txt`, content);
    toast.success("Profile downloaded");
  };

  const toggleHelpful = (id: string) => {
    setHelpfulReviews((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="pb-20">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-brand-900">
        <div className="gradient-mesh pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Find Lawyers", href: ROUTES.findLawyers }, { label: lawyer.name }]} className="[&_*]:text-white/70 [&_a:hover]:text-white" />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end"
          >
            <Avatar src={lawyer.avatarUrl} name={lawyer.name} size="xl" online={lawyer.online} className="ring-4 ring-white/20" />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">{lawyer.name}</h1>
                {lawyer.verified && (
                  <Tooltip content="Bar Council verified">
                    <BadgeCheck className="h-6 w-6 text-accent-400" />
                  </Tooltip>
                )}
              </div>
              <p className="mt-1 text-sm text-navy-200">{lawyer.qualification} · {lawyer.court}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {lawyer.specializations.map((s) => <Badge key={s} variant="outline" className="border-white/25 text-white">{s}</Badge>)}
              </div>
            </div>

            <div className="flex gap-2">
              <Tooltip content={favorited ? "Remove from saved" : "Save profile"}>
                <Button variant="outline" size="icon" className="border-white/25 text-white hover:bg-white/10" onClick={() => { toggleFavorite(lawyer.id); toast.success(favorited ? "Removed from saved" : "Profile saved"); }}>
                  <Heart className={favorited ? "h-4 w-4 fill-danger text-danger" : "h-4 w-4"} />
                </Button>
              </Tooltip>
              <Tooltip content="Share profile">
                <Button variant="outline" size="icon" className="border-white/25 text-white hover:bg-white/10" onClick={() => toast.success("Profile link copied to clipboard")}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </Tooltip>
              <Tooltip content="Download profile">
                <Button variant="outline" size="icon" className="border-white/25 text-white hover:bg-white/10" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                </Button>
              </Tooltip>
              <Tooltip content="Report this profile">
                <Button variant="outline" size="icon" className="border-white/25 text-white hover:bg-white/10" onClick={report.open}>
                  <Flag className="h-4 w-4" />
                </Button>
              </Tooltip>
            </div>
          </motion.div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Rating", value: `${lawyer.rating}★`, icon: Star },
              { label: "Experience", value: `${lawyer.experienceYears}y`, icon: GraduationCap },
              { label: "Cases Handled", value: lawyer.casesWon, icon: BookOpen },
              { label: "Success Rate", value: `${lawyer.successRate}%`, icon: TrendingUp },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-4 text-center">
                <stat.icon className="mx-auto h-4 w-4 text-accent-400" />
                <p className="mt-1.5 font-display text-lg font-bold text-white">{stat.value}</p>
                <p className="text-[11px] text-navy-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto -mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
            <Tabs
              tabs={[
                {
                  value: "overview",
                  label: "Overview",
                  content: (
                    <div className="space-y-8">
                      <div>
                        <h3 className="font-display text-base font-semibold text-foreground">About</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{lawyer.bio}</p>
                      </div>

                      <div>
                        <h3 className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-foreground">
                          <GraduationCap className="h-4 w-4 text-brand-600" /> Education
                        </h3>
                        <ul className="space-y-2">
                          {extras.education.map((edu) => (
                            <li key={edu.degree} className="flex justify-between rounded-lg bg-surface-sunken px-4 py-2.5 text-sm">
                              <span className="text-foreground">{edu.degree} — {edu.institution}</span>
                              <span className="text-muted-foreground">{edu.year}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {extras.certifications.length > 0 && (
                        <div>
                          <h3 className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-foreground">
                            <BadgeCheck className="h-4 w-4 text-brand-600" /> Certifications
                          </h3>
                          <ul className="space-y-2">
                            {extras.certifications.map((cert) => (
                              <li key={cert.name} className="flex justify-between rounded-lg bg-surface-sunken px-4 py-2.5 text-sm">
                                <span className="text-foreground">{cert.name} — {cert.issuer}</span>
                                <span className="text-muted-foreground">{cert.year}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <h3 className="mb-3 font-display text-base font-semibold text-foreground">Career Timeline</h3>
                        <Timeline
                          steps={extras.timeline.map((t, i) => ({
                            title: t.title,
                            description: t.description,
                            timestamp: t.year,
                            status: i === extras.timeline.length - 1 ? "current" : "complete",
                          }))}
                        />
                      </div>

                      <div>
                        <h3 className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-foreground">
                          <Landmark className="h-4 w-4 text-brand-600" /> Court Memberships
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {extras.courtMemberships.map((m) => (
                            <Badge key={m.name} variant="outline">{m.name} · since {m.since}</Badge>
                          ))}
                        </div>
                      </div>

                      {extras.awards.length > 0 && (
                        <div>
                          <h3 className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-foreground">
                            <Award className="h-4 w-4 text-brand-600" /> Awards
                          </h3>
                          <ul className="space-y-2">
                            {extras.awards.map((award) => (
                              <li key={award.title} className="flex justify-between rounded-lg bg-surface-sunken px-4 py-2.5 text-sm">
                                <span className="text-foreground">{award.title} — {award.issuer}</span>
                                <span className="text-muted-foreground">{award.year}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  value: "reviews",
                  label: `Reviews (${lawyer.reviewCount})`,
                  content: (
                    <div className="space-y-5">
                      <div className="flex items-center gap-4 rounded-xl bg-surface-sunken p-5">
                        <div className="text-center">
                          <p className="font-display text-3xl font-bold text-foreground">{lawyer.rating}</p>
                          <div className="mt-1 flex gap-0.5 text-amber-500">
                            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{lawyer.reviewCount} reviews</p>
                        </div>
                      </div>
                      {reviews.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No reviews yet for this lawyer.</p>
                      ) : (
                        reviews.map((review) => (
                        <div key={review.id} className="rounded-xl border border-border p-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar src={review.authorAvatarUrl} name={review.authorName} size="sm" />
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <p className="text-sm font-semibold text-foreground">{review.authorName}</p>
                                  {review.verifiedClient && <Badge variant="success">Verified</Badge>}
                                </div>
                                <p className="text-xs text-muted-foreground">{formatDate(review.date)}</p>
                              </div>
                            </div>
                            <div className="flex gap-0.5 text-amber-500">
                              {Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>
                          <button
                            type="button"
                            onClick={() => toggleHelpful(review.id)}
                            className="mt-3 text-xs font-medium text-muted-foreground hover:text-brand-600"
                          >
                            {helpfulReviews.has(review.id) ? "✓ Marked helpful" : "Was this helpful?"}
                          </button>
                        </div>
                      )))}
                    </div>
                  ),
                },
                {
                  value: "gallery",
                  label: "Gallery",
                  content: (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {extras.galleryLabels.map((label) => (
                        <div key={label} className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 text-brand-700 dark:from-brand-500/10 dark:to-accent-500/10 dark:text-brand-300">
                          <Camera className="h-6 w-6" />
                          <span className="px-2 text-center text-xs font-medium">{label}</span>
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  value: "locations",
                  label: "Locations",
                  content: (
                    <div className="space-y-3">
                      {extras.officeLocations.map((office) => (
                        <div key={office.label} className="flex gap-3 rounded-xl border border-border p-4">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10">
                            <MapPin className="h-4.5 w-4.5" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{office.label}</p>
                            <p className="text-sm text-muted-foreground">{office.address}, {office.city}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  value: "faq",
                  label: "FAQ",
                  content: extras.faqs.length > 0 ? (
                    <Accordion items={extras.faqs.map((f, i) => ({ value: `faq-${i}`, question: f.question, answer: f.answer }))} />
                  ) : (
                    <p className="text-sm text-muted-foreground">No frequently asked questions yet — feel free to ask directly via chat.</p>
                  ),
                },
              ]}
            />
          </div>

          {/* Sticky booking card */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-lifted">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Consultation fee</p>
                  <p className="font-display text-2xl font-bold text-foreground">{formatCurrency(lawyer.consultationFee)}</p>
                </div>
                <Badge variant={lawyer.online ? "accent" : "neutral"}>{lawyer.online ? "Online now" : "Offline"}</Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Responds in ~{lawyer.responseTimeMinutes} minutes</p>

              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold text-foreground">Next available slots today</p>
                <div className="flex flex-wrap gap-1.5">
                  {getSlotsForDate(new Date(), lawyer.id).filter((s) => s.available).slice(0, 4).map((slot) => (
                    <span key={slot.time} className="rounded-md border border-border px-2.5 py-1 text-xs text-foreground">
                      {slot.time}
                    </span>
                  ))}
                </div>
              </div>

              <Button size="lg" className="mt-5 w-full" onClick={() => navigate(ROUTES.bookLawyer(lawyer.id))}>
                <CalendarCheck className="h-4 w-4" />
                Book Consultation
              </Button>
              <Button variant="outline" size="lg" className="mt-2 w-full" onClick={() => toast.success(`Starting a chat with ${lawyer.name}`)}>
                <MessageCircle className="h-4 w-4" />
                Chat Now
              </Button>

              <div className="mt-5 border-t border-border pt-5">
                <p className="mb-2 text-xs font-semibold text-foreground">Languages</p>
                <div className="flex flex-wrap gap-1.5">
                  {lawyer.languages.map((lang) => <Badge key={lang} variant="outline">{lang}</Badge>)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related lawyers */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-xl font-bold text-foreground">Related Lawyers</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              {related.map((l) => <LawyerCard key={l.id} lawyer={l} />)}
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline" asChild>
                <Link to={ROUTES.findLawyers}>Browse all lawyers</Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      <ReportLawyerModal open={report.isOpen} onOpenChange={report.close} lawyerName={lawyer.name} />
    </div>
  );
}

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
const BLOG_CATEGORIES = ["All", "Startup Law", "Real Estate", "Taxation", "Employment", "Property Law"];
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SearchBox } from "@/components/ui/search-box";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { toast } from "@/components/ui/toaster";
import { formatDate, cn } from "@/lib/utils";
import { contentService } from "@/services/api/content.service";
import { useAsync } from "@/hooks/useAsync";

export function BlogPage() {
  const { data: posts, isLoading, error, refetch } = useAsync(() => contentService.getBlogPosts(), []);
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");

  const postsList = posts ?? [];
  const featured = postsList.find((p) => p.featured) ?? postsList[0];

  const filtered = useMemo(() => {
    if (!featured) return [];
    return postsList
      .filter((p) => p.id !== featured.id)
      .filter((p) => category === "All" || p.category === category)
      .filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));
  }, [postsList, category, query, featured]);

  if (error) return <ErrorState description={error} onRetry={refetch} />;

  return (
    <div className="pb-24">
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">Trustix Blog</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-foreground sm:text-5xl">Legal insights, in plain language</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Practical guidance from verified advocates — no jargon, no fear-mongering.</p>
        </div>

        {isLoading || !featured ? (
          <div className="mt-12 flex h-64 items-center justify-center rounded-3xl border border-border bg-surface text-sm text-muted-foreground">
            Loading articles…
          </div>
        ) : (
          <motion.button
            type="button"
            onClick={() => toast.success("Opening article…")}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("group mt-12 block w-full overflow-hidden rounded-3xl bg-gradient-to-br p-8 text-left text-white shadow-lifted sm:p-12", featured.coverGradient)}
          >
            <Badge variant="outline" className="border-white/30 text-white">{featured.category}</Badge>
            <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold leading-snug sm:text-3xl">{featured.title}</h2>
            <p className="mt-3 max-w-xl text-sm text-white/80">{featured.excerpt}</p>
            <div className="mt-6 flex items-center gap-3">
              <Avatar src={featured.authorAvatarUrl} name={featured.author} size="sm" />
              <div className="text-xs text-white/80">
                <p className="font-medium text-white">{featured.author}</p>
                <p>{formatDate(featured.date)} · {featured.readTimeMinutes} min read</p>
              </div>
              <ArrowRight className="ml-auto h-5 w-5 transition-transform group-hover:translate-x-1" />
            </div>
          </motion.button>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                  category === cat ? "border-brand-600 bg-brand-600 text-white" : "border-border text-muted-foreground hover:border-brand-300 hover:text-foreground",
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <SearchBox placeholder="Search articles…" onSearch={setQuery} className="sm:w-64" />
        </div>

        {isLoading ? (
          <p className="mt-10 py-8 text-center text-sm text-muted-foreground">Loading blog catalog…</p>
        ) : filtered.length === 0 ? (
          <EmptyState title="No articles found" description="Try a different category or search term." className="mt-10" />
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: (index % 3) * 0.06 }}
                className="card-lift group overflow-hidden rounded-2xl border border-border bg-surface"
              >
                <Link to="#" onClick={(e) => { e.preventDefault(); toast.success("Opening article…"); }} className="block">
                  <div className={cn("flex h-36 items-end bg-gradient-to-br p-5", post.coverGradient)}>
                    <Badge variant="outline" className="border-white/30 text-white">{post.category}</Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-brand-600">{post.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                      <div className="flex items-center gap-2">
                        <Avatar src={post.authorAvatarUrl} name={post.author} size="sm" />
                        <div>
                          <p className="text-xs font-medium text-foreground">{post.author}</p>
                          <p className="text-[11px] text-muted-foreground">{formatDate(post.date)}</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><Clock className="h-3 w-3" /> {post.readTimeMinutes} min</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default BlogPage;

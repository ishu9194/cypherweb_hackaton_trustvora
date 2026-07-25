import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { BLOG_POSTS } from "@/data/blog.data";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate, cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes.constants";

export function BlogPreviewSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">From the Blog</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">Legal insights, in plain language</h2>
        </div>
        <Button variant="outline" asChild>
          <Link to={ROUTES.blog}>
            Visit the blog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {BLOG_POSTS.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="card-lift group overflow-hidden rounded-2xl border border-border bg-surface"
          >
            <Link to={ROUTES.blog} className="block">
              <div className={cn("flex h-36 items-end bg-gradient-to-br p-5", post.coverGradient)}>
                <Badge variant="outline" className="border-white/30 text-white">{post.category}</Badge>
              </div>
              <div className="p-6">
                <h3 className="font-display text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-brand-600">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-2">
                    <Avatar src={post.authorAvatarUrl} name={post.author} size="sm" />
                    <div>
                      <p className="text-xs font-medium text-foreground">{post.author}</p>
                      <p className="text-[11px] text-muted-foreground">{formatDate(post.date)}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {post.readTimeMinutes} min
                  </span>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

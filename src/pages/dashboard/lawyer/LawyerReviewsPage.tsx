import { useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import { REVIEWS } from "@/data/testimonials.data";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import { formatDate } from "@/lib/utils";

export function LawyerReviewsPage() {
  const [replies, setReplies] = useState<Record<string, string>>({ [REVIEWS[0].id]: "Thank you so much for the kind words — it was a pleasure working with you!" });
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [openReplyId, setOpenReplyId] = useState<string | null>(null);

  const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

  const submitReply = (id: string) => {
    const text = drafts[id]?.trim();
    if (!text) { toast.error("Write a reply before submitting"); return; }
    setReplies((prev) => ({ ...prev, [id]: text }));
    setOpenReplyId(null);
    toast.success("Reply posted");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Reviews</h2>
          <p className="mt-1 text-sm text-muted-foreground">{REVIEWS.length} client reviews.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2">
          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
          <span className="font-display text-lg font-bold text-foreground">{avgRating}</span>
          <span className="text-xs text-muted-foreground">average rating</span>
        </div>
      </div>

      <div className="space-y-4">
        {REVIEWS.map((review) => (
          <Card key={review.id}>
            <CardContent>
              <div className="flex items-start justify-between">
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

              {replies[review.id] ? (
                <div className="mt-4 ml-4 rounded-lg border-l-2 border-brand-500 bg-surface-sunken p-3">
                  <p className="text-xs font-semibold text-brand-600">Your reply</p>
                  <p className="mt-1 text-sm text-muted-foreground">{replies[review.id]}</p>
                </div>
              ) : openReplyId === review.id ? (
                <div className="mt-4 space-y-2">
                  <Textarea placeholder="Write a reply…" rows={3} value={drafts[review.id] ?? ""} onChange={(e) => setDrafts((p) => ({ ...p, [review.id]: e.target.value }))} />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => submitReply(review.id)}>Post reply</Button>
                    <Button size="sm" variant="ghost" onClick={() => setOpenReplyId(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <Button size="sm" variant="outline" className="mt-3" onClick={() => setOpenReplyId(review.id)}>
                  <MessageSquare className="h-3.5 w-3.5" /> Reply
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

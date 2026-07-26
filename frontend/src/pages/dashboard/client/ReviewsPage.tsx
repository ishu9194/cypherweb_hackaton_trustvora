import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit2, Star, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { toast } from "@/components/ui/toaster";
import { useDisclosure } from "@/hooks/useDisclosure";
import { formatDate } from "@/lib/utils";
import { ROUTES } from "@/constants/routes.constants";
import { dashboardService } from "@/services/api/dashboard.service";
import { useAsync } from "@/hooks/useAsync";
import type { Review } from "@/types";

export function ReviewsPage() {
  const { data: initialReviews, isLoading, error, refetch } = useAsync(() => dashboardService.getReviews(), []);
  const [reviews, setReviews] = useState<Review[]>([]);
  const editModal = useDisclosure();
  const [editing, setEditing] = useState<Review | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (initialReviews) {
      setReviews(initialReviews.map((r) => ({ ...r, authorName: "You" })));
    }
  }, [initialReviews]);

  const openEdit = (review: Review) => {
    setEditing(review);
    setDraft(review.comment);
    editModal.open();
  };

  const saveEdit = () => {
    if (!editing) return;
    setReviews((prev) => prev.map((r) => (r.id === editing.id ? { ...r, comment: draft } : r)));
    editModal.close();
    toast.success("Review updated");
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    toast.success("Review deleted");
  };

  if (error) return <ErrorState description={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">My Reviews</h2>
        <p className="mt-1 text-sm text-muted-foreground">Reviews you've written for lawyers you've consulted.</p>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          description="After a completed consultation, you can leave a review from My Appointments."
          action={<Button size="sm" asChild><Link to={ROUTES.clientAppointments}>View appointments</Link></Button>}
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={review.authorName} size="sm" />
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
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(review)}>
                    <Edit2 className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" className="text-danger hover:bg-danger/10" onClick={() => deleteReview(review.id)}>
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={editModal.isOpen}
        onOpenChange={editModal.close}
        title="Edit review"
        footer={<><Button variant="outline" onClick={editModal.close}>Cancel</Button><Button onClick={saveEdit}>Save changes</Button></>}
      >
        <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={4} />
      </Modal>
    </div>
  );
}

export default ReviewsPage;

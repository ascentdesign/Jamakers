import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Review {
  id: number;
  rating: number;
  qualityRating: number;
  communicationRating: number;
  timelinessRating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    email: string;
  };
}

interface ReviewListProps {
  manufacturerId: string;
}

export function ReviewList({ manufacturerId }: ReviewListProps) {
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews", manufacturerId],
  });

  if (isLoading) {
    return <div className="text-center text-muted-foreground py-8">Loading reviews...</div>;
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No reviews yet. Be the first to review this manufacturer!
      </div>
    );
  }

  const StarDisplay = ({ rating, label }: { rating: number; label?: string }) => (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-muted-foreground">{label}:</span>}
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">
        Reviews ({reviews.length})
      </div>
      {reviews.map((review) => (
        <Card key={review.id} data-testid={`review-${review.id}`}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {review.reviewer.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{review.reviewer.email.split('@')[0]}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                  <StarDisplay rating={review.rating} />
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <StarDisplay rating={review.qualityRating} label="Quality" />
                  <StarDisplay rating={review.communicationRating} label="Communication" />
                  <StarDisplay rating={review.timelinessRating} label="Timeliness" />
                </div>

                <p className="text-sm" data-testid={`review-comment-${review.id}`}>
                  {review.comment}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

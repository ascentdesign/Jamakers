import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import type { Review, User } from "@shared/schema";

interface ReviewCardProps {
  review: Review & { reviewer?: User };
  canRespond?: boolean;
  onRespond?: () => void;
}

export function ReviewCard({ review, canRespond, onRespond }: ReviewCardProps) {
  const reviewer = review.reviewer;

  const getInitials = () => {
    if (reviewer?.firstName && reviewer?.lastName) {
      return `${reviewer.firstName[0]}${reviewer.lastName[0]}`.toUpperCase();
    }
    return reviewer?.email?.[0]?.toUpperCase() || "U";
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card data-testid={`review-card-${review.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={reviewer?.profileImageUrl || undefined} className="object-cover" />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold" data-testid={`text-reviewer-name-${review.id}`}>
                {reviewer?.firstName && reviewer?.lastName
                  ? `${reviewer.firstName} ${reviewer.lastName}`
                  : reviewer?.email?.split('@')[0] || "Anonymous"}
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="text-right">
            {renderStars(review.rating)}
            <div className="text-sm font-semibold mt-1" data-testid={`text-rating-${review.id}`}>
              {review.rating}.0 out of 5
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Category Ratings */}
        {(review.qualityRating || review.communicationRating || review.timelinessRating) && (
          <div className="grid grid-cols-3 gap-4 p-3 bg-muted/30 rounded-md">
            {review.qualityRating && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">Quality</div>
                {renderStars(review.qualityRating)}
              </div>
            )}
            {review.communicationRating && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">Communication</div>
                {renderStars(review.communicationRating)}
              </div>
            )}
            {review.timelinessRating && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">Timeliness</div>
                {renderStars(review.timelinessRating)}
              </div>
            )}
          </div>
        )}

        {/* Testimonial */}
        {review.testimonial && (
          <div>
            <p className="text-sm" data-testid={`text-testimonial-${review.id}`}>
              {review.testimonial}
            </p>
          </div>
        )}

        {/* Manufacturer Response */}
        {review.response && (
          <div className="border-l-2 border-primary pl-4 py-2 bg-primary/5 rounded-r-md">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                Manufacturer Response
              </Badge>
              {review.respondedAt && (
                <span className="text-xs text-muted-foreground">
                  {new Date(review.respondedAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <p className="text-sm" data-testid={`text-response-${review.id}`}>
              {review.response}
            </p>
          </div>
        )}

        {/* Respond Button */}
        {canRespond && !review.response && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRespond}
            className="hover-elevate active-elevate-2"
            data-testid={`button-respond-${review.id}`}
          >
            Respond to Review
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

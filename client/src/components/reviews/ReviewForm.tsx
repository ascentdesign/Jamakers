import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  qualityRating: z.number().min(1).max(5),
  communicationRating: z.number().min(1).max(5),
  timelinessRating: z.number().min(1).max(5),
  comment: z.string().min(20, "Review must be at least 20 characters"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  projectId: number;
  manufacturerId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ projectId, manufacturerId, onSuccess }: ReviewFormProps) {
  const { toast } = useToast();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hoveredQuality, setHoveredQuality] = useState(0);
  const [hoveredCommunication, setHoveredCommunication] = useState(0);
  const [hoveredTimeliness, setHoveredTimeliness] = useState(0);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      qualityRating: 0,
      communicationRating: 0,
      timelinessRating: 0,
      comment: "",
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      return await apiRequest("/api/reviews", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          projectId,
          manufacturerId,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/manufacturers", manufacturerId] });
      toast({
        title: "Review Submitted",
        description: "Your review has been submitted successfully.",
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    createReviewMutation.mutate(data);
  };

  const StarRating = ({ 
    value, 
    onChange, 
    hovered, 
    onHover, 
    label 
  }: { 
    value: number; 
    onChange: (val: number) => void;
    hovered: number;
    onHover: (val: number) => void;
    label: string;
  }) => (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            onMouseEnter={() => onHover(rating)}
            onMouseLeave={() => onHover(0)}
            className="p-1 hover-elevate rounded"
            data-testid={`star-${label.toLowerCase().replace(/\s+/g, '-')}-${rating}`}
          >
            <Star
              className={`h-6 w-6 ${
                rating <= (hovered || value)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
      </div>
    </FormItem>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Overall Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <StarRating
                  label="Overall Rating"
                  value={field.value}
                  onChange={field.onChange}
                  hovered={hoveredRating}
                  onHover={setHoveredRating}
                />
              )}
            />

            {/* Quality Rating */}
            <FormField
              control={form.control}
              name="qualityRating"
              render={({ field }) => (
                <StarRating
                  label="Product Quality"
                  value={field.value}
                  onChange={field.onChange}
                  hovered={hoveredQuality}
                  onHover={setHoveredQuality}
                />
              )}
            />

            {/* Communication Rating */}
            <FormField
              control={form.control}
              name="communicationRating"
              render={({ field }) => (
                <StarRating
                  label="Communication"
                  value={field.value}
                  onChange={field.onChange}
                  hovered={hoveredCommunication}
                  onHover={setHoveredCommunication}
                />
              )}
            />

            {/* Timeliness Rating */}
            <FormField
              control={form.control}
              name="timelinessRating"
              render={({ field }) => (
                <StarRating
                  label="Timeliness"
                  value={field.value}
                  onChange={field.onChange}
                  hovered={hoveredTimeliness}
                  onHover={setHoveredTimeliness}
                />
              )}
            />

            {/* Comment */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your experience working with this manufacturer..."
                      className="min-h-32"
                      {...field}
                      data-testid="input-review-comment"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={createReviewMutation.isPending}
              data-testid="button-submit-review"
            >
              {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
